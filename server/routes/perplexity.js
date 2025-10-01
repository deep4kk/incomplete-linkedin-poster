import express from 'express';
import { generateMultiplePosts } from '../services/perplexityService.js';
import { database } from '../config/database.js';

const router = express.Router();

router.post('/generate', async (req, res) => {
  try {
    const { niche } = req.body;

    if (!niche) {
      return res.status(400).json({ error: 'Niche is required' });
    }

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

    res.json({ success: true, posts: savedPosts });
  } catch (error) {
    console.error('Error generating posts:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
