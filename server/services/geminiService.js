import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const nichePrompts = {
  'AI Integration': `You are an expert in AI Integration. Create a professional LinkedIn post that:
- Demonstrates deep expertise in AI Integration solutions
- Provides valuable insights or tips for MIS and Tech professionals
- Uses a professional yet engaging tone
- Includes relevant hashtags for AI and integration topics
- Is between 150-300 words
- Positions the author as a thought leader in AI Integration
- Must be unique and different from any previous posts
- Can include a call-to-action or question to engage readers`,

  'Google Apps Script': `You are an expert in Google Apps Script. Create a professional LinkedIn post that:
- Showcases advanced Google Apps Script expertise
- Provides actionable tips or insights for data management professionals
- Uses a professional yet engaging tone
- Includes relevant hashtags for Google Workspace and automation
- Is between 150-300 words
- Positions the author as the go-to expert for Google Apps Script
- Must be unique and different from any previous posts
- Can include a call-to-action or question to engage readers`,

  'Data Management Automation': `You are an expert in Data Management Automation. Create a professional LinkedIn post that:
- Demonstrates expertise in data management and automation solutions
- Provides valuable insights for MIS professionals and data managers
- Uses a professional yet engaging tone
- Includes relevant hashtags for data management and automation
- Is between 150-300 words
- Positions the author as a leader in data automation
- Must be unique and different from any previous posts
- Can include a call-to-action or question to engage readers`
};

export async function generateLinkedInPost(niche) {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    const prompt = nichePrompts[niche] || nichePrompts['AI Integration'];

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return text.trim();
  } catch (error) {
    console.error('Error generating post:', error);
    throw new Error('Failed to generate post');
  }
}

export async function generateMultiplePosts(niche, count = 3) {
  try {
    const posts = [];
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    const prompt = `${nichePrompts[niche]}

Generate ${count} completely different and unique LinkedIn posts. Each post must:
- Have a distinct angle or topic
- Use different writing styles (storytelling, tips, insights, case study, etc.)
- Be completely independent from each other
- Not repeat themes or examples

Format: Return ONLY the posts separated by "---POST_SEPARATOR---" with no other text.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    const generatedPosts = text.split('---POST_SEPARATOR---').map(p => p.trim()).filter(p => p.length > 0);

    return generatedPosts.slice(0, count);
  } catch (error) {
    console.error('Error generating posts:', error);
    throw new Error('Failed to generate posts');
  }
}
