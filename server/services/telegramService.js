import TelegramBot from 'node-telegram-bot-api';
import cron from 'node-cron';
import { generateMultiplePosts } from './geminiService.js';
import { postToLinkedIn } from './linkedinService.js';
import { database } from '../config/database.js';

let bot;
let userSessions = new Map();

export function initTelegramBot() {
  const token = process.env.TELEGRAM_BOT_TOKEN;

  if (!token) {
    console.log('Telegram bot token not configured. Skipping Telegram integration.');
    return;
  }

  try {
    bot = new TelegramBot(token, { polling: true });

    bot.on('message', async (msg) => {
      const chatId = msg.chat.id;
      const text = msg.text;

      if (text === '/start') {
        await bot.sendMessage(
          chatId,
          'Welcome to LinkedIn Post Manager!\n\nSelect a niche to generate posts:',
          getNicheKeyboard()
        );
      }
    });

    bot.on('callback_query', async (query) => {
      const chatId = query.message.chat.id;
      const data = query.data;

      await handleCallbackQuery(chatId, data, query);
    });

    cron.schedule('0 11 * * *', async () => {
      await sendDailyReminder();
    });

    console.log('Telegram bot initialized successfully');
    console.log('Daily reminders scheduled for 11:00 AM');
  } catch (error) {
    console.error('Failed to initialize Telegram bot:', error);
  }
}

function getNicheKeyboard() {
  return {
    reply_markup: {
      inline_keyboard: [
        [{ text: 'AI Integration', callback_data: 'niche_AI Integration' }],
        [{ text: 'Google Apps Script', callback_data: 'niche_Google Apps Script' }],
        [
          {
            text: 'Data Management Automation',
            callback_data: 'niche_Data Management Automation',
          },
        ],
      ],
    },
  };
}

async function handleCallbackQuery(chatId, data, query) {
  try {
    if (data.startsWith('niche_')) {
      const niche = data.replace('niche_', '');
      await bot.answerCallbackQuery(query.id, { text: 'Generating posts...' });

      await bot.sendMessage(chatId, `Generating 3 posts for: ${niche}`);

      const posts = await generateMultiplePosts(niche, 3);

      const savedPosts = [];
      for (const content of posts) {
        const result = await database.savePost({
          niche,
          content,
          status: 'generated',
          generated_at: new Date().toISOString(),
        });

        if (result.success) {
          savedPosts.push(result.post);
        }
      }

      userSessions.set(chatId, { posts: savedPosts, currentIndex: 0 });

      await showNextPost(chatId);
    } else if (data.startsWith('approve_')) {
      const postIndex = parseInt(data.split('_')[1]);
      await handlePostApproval(chatId, postIndex, query);
    } else if (data.startsWith('reject_')) {
      const postIndex = parseInt(data.split('_')[1]);
      await handlePostRejection(chatId, postIndex, query);
    } else if (data.startsWith('post_')) {
      const postIndex = parseInt(data.split('_')[1]);
      await handlePostToLinkedIn(chatId, postIndex, query);
    }
  } catch (error) {
    console.error('Error handling callback query:', error);
    await bot.sendMessage(chatId, `Error: ${error.message}`);
  }
}

async function showNextPost(chatId) {
  const session = userSessions.get(chatId);

  if (!session || session.currentIndex >= session.posts.length) {
    await bot.sendMessage(chatId, 'All posts reviewed!\n\nUse /start to generate more posts.');
    userSessions.delete(chatId);
    return;
  }

  const post = session.posts[session.currentIndex];
  const postNumber = session.currentIndex + 1;

  const keyboard = {
    reply_markup: {
      inline_keyboard: [
        [
          { text: 'Approve', callback_data: `approve_${session.currentIndex}` },
          { text: 'Reject', callback_data: `reject_${session.currentIndex}` },
        ],
      ],
    },
  };

  await bot.sendMessage(
    chatId,
    `Post ${postNumber}/${session.posts.length}\n\nNiche: ${post.niche}\n\n${post.content}`,
    keyboard
  );
}

async function handlePostApproval(chatId, postIndex, query) {
  const session = userSessions.get(chatId);

  if (!session) {
    await bot.answerCallbackQuery(query.id, { text: 'Session expired' });
    return;
  }

  const post = session.posts[postIndex];

  await database.updatePost(post.id, {
    status: 'approved',
    approved_at: new Date().toISOString(),
  });

  await bot.answerCallbackQuery(query.id, { text: 'Post approved!' });

  const keyboard = {
    reply_markup: {
      inline_keyboard: [[{ text: 'Post to LinkedIn', callback_data: `post_${postIndex}` }]],
    },
  };

  await bot.sendMessage(chatId, 'Post approved! Ready to post to LinkedIn.', keyboard);

  session.currentIndex++;
  await showNextPost(chatId);
}

async function handlePostRejection(chatId, postIndex, query) {
  const session = userSessions.get(chatId);

  if (!session) {
    await bot.answerCallbackQuery(query.id, { text: 'Session expired' });
    return;
  }

  const post = session.posts[postIndex];

  await database.updatePost(post.id, {
    status: 'rejected',
  });

  await bot.answerCallbackQuery(query.id, { text: 'Post rejected' });
  await bot.sendMessage(chatId, 'Post rejected.');

  session.currentIndex++;
  await showNextPost(chatId);
}

async function handlePostToLinkedIn(chatId, postIndex, query) {
  const session = userSessions.get(chatId);

  if (!session) {
    await bot.answerCallbackQuery(query.id, { text: 'Session expired' });
    return;
  }

  const post = session.posts[postIndex];

  try {
    await bot.answerCallbackQuery(query.id, { text: 'Posting to LinkedIn...' });

    const linkedInResponse = await postToLinkedIn(post.content);

    await database.updatePost(post.id, {
      status: 'posted',
      posted_at: new Date().toISOString(),
      linkedin_post_id: linkedInResponse.id,
    });

    await bot.sendMessage(chatId, 'Successfully posted to LinkedIn!');
  } catch (error) {
    await bot.sendMessage(chatId, `Failed to post to LinkedIn: ${error.message}`);
  }
}

async function sendDailyReminder() {
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!chatId || !bot) {
    return;
  }

  try {
    await bot.sendMessage(
      chatId,
      'Good morning! Time to create some LinkedIn content.\n\nSelect a niche to generate posts:',
      getNicheKeyboard()
    );
  } catch (error) {
    console.error('Error sending daily reminder:', error);
  }
}
