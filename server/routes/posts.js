import express from 'express';
import { database } from '../config/database.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const { status } = req.query;
    const result = await database.getPosts(status || null);

    res.json(result);
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/logs', async (req, res) => {
  try {
    const result = await database.getLogs();
    const posts = await database.getPosts();

    if (result.success && posts.success) {
      const logs = result.logs.map((log) => {
        const post = posts.posts.find((p) => p.id === log.post_id);
        return {
          ...log,
          linkedin_posts: post || null,
        };
      });

      res.json({ success: true, logs });
    } else {
      res.json(result);
    }
  } catch (error) {
    console.error('Error fetching logs:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/stats', async (req, res) => {
  try {
    const result = await database.getStats();
    res.json(result);
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

router.patch('/:id/approve', async (req, res) => {
  try {
    const { id } = req.params;

    const result = await database.updatePost(id, {
      status: 'approved',
      approved_at: new Date().toISOString(),
    });

    res.json(result);
  } catch (error) {
    console.error('Error approving post:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

router.patch('/:id/reject', async (req, res) => {
  try {
    const { id } = req.params;

    const result = await database.updatePost(id, {
      status: 'rejected',
    });

    res.json(result);
  } catch (error) {
    console.error('Error rejecting post:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
