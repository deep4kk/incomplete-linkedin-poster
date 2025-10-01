import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const PERPLEXITY_API_URL = 'https://api.perplexity.ai/chat/completions';
const PERPLEXITY_API_KEY = process.env.PERPLEXITY_API_KEY;

export async function generateLinkedInPost(niche) {
  try {
    const prompt = `You are an expert in ${niche}. Create a professional LinkedIn post that:
- Demonstrates deep expertise in ${niche}
- Provides valuable insights or tips for professionals
- Uses a professional yet engaging tone
- Includes relevant hashtags
- Is between 150-300 words
- Positions the author as a thought leader
- Must be unique and different from any previous posts
- Can include a call-to-action or question to engage readers`;

    const response = await axios.post(
      PERPLEXITY_API_URL,
      {
        model: 'llama-3.1-sonar-small-128k-online',
        messages: [
          {
            role: 'system',
            content: 'You are a professional LinkedIn content writer who creates engaging, insightful posts.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 1000,
      },
      {
        headers: {
          Authorization: `Bearer ${PERPLEXITY_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const content = response.data.choices[0].message.content;
    return content.trim();
  } catch (error) {
    console.error('Error generating post with Perplexity:', error.response?.data || error.message);
    throw new Error('Failed to generate post');
  }
}

export async function generateMultiplePosts(niche, count = 3) {
  try {
    const posts = [];

    for (let i = 0; i < count; i++) {
      const prompt = `You are an expert in ${niche}. Create a professional LinkedIn post that:
- Demonstrates deep expertise in ${niche}
- Provides valuable insights or tips for professionals
- Uses a professional yet engaging tone
- Includes relevant hashtags
- Is between 150-300 words
- Positions the author as a thought leader
- Must be unique and completely different from previous posts
- Can include a call-to-action or question to engage readers

Post ${i + 1} of ${count} - Make it distinctly different with a unique angle or topic.`;

      const response = await axios.post(
        PERPLEXITY_API_URL,
        {
          model: 'llama-3.1-sonar-small-128k-online',
          messages: [
            {
              role: 'system',
              content: 'You are a professional LinkedIn content writer who creates engaging, insightful posts with unique perspectives.',
            },
            {
              role: 'user',
              content: prompt,
            },
          ],
          temperature: 0.8,
          max_tokens: 1000,
        },
        {
          headers: {
            Authorization: `Bearer ${PERPLEXITY_API_KEY}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const content = response.data.choices[0].message.content;
      posts.push(content.trim());

      await new Promise((resolve) => setTimeout(resolve, 500));
    }

    return posts;
  } catch (error) {
    console.error('Error generating posts with Perplexity:', error.response?.data || error.message);
    throw new Error('Failed to generate posts');
  }
}
