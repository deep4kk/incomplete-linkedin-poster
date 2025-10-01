import express from 'express';
import {
  getLinkedInAuthUrl,
  exchangeCodeForToken,
  postToLinkedIn,
  getStoredAccessToken,
} from '../services/linkedinService.js';
import { database } from '../config/database.js';

const router = express.Router();

router.get('/auth-url', async (req, res) => {
  try {
    const { authUrl, state } = await getLinkedInAuthUrl();
    res.json({ authUrl, state });
  } catch (error) {
    console.error('Error getting auth URL:', error);
    res.status(500).json({ error: error.message });
  }
});

router.get('/callback', async (req, res) => {
  try {
    const { code } = req.query;

    if (!code) {
      return res.redirect('http://localhost:5173/?error=no_code');
    }

    await exchangeCodeForToken(code);
    res.redirect('http://localhost:5173/?auth=success');
  } catch (error) {
    console.error('Error in callback:', error);
    res.redirect('http://localhost:5173/?error=auth_failed');
  }
});

router.post('/callback', async (req, res) => {
  try {
    const { code } = req.body;

    if (!code) {
      return res.status(400).json({ error: 'Authorization code is required' });
    }

    const result = await exchangeCodeForToken(code);
    res.json({ success: true, userInfo: result.userInfo });
  } catch (error) {
    console.error('Error in callback:', error);
    res.status(500).json({ error: error.message });
  }
});

router.get('/auth-status', async (req, res) => {
  try {
    const token = await getStoredAccessToken();
    res.json({ authenticated: !!token });
  } catch (error) {
    console.error('Error checking auth status:', error);
    res.status(500).json({ error: error.message, authenticated: false });
  }
});

router.post('/post', async (req, res) => {
  try {
    const { postId, content } = req.body;

    if (!postId || !content) {
      return res.status(400).json({ error: 'Post ID and content are required' });
    }

    const linkedInResponse = await postToLinkedIn(content);

    const result = await database.updatePost(postId, {
      status: 'posted',
      posted_at: new Date().toISOString(),
      linkedin_post_id: linkedInResponse.id,
    });

    res.json({ success: true, post: result.post, linkedInResponse });
  } catch (error) {
    console.error('Error posting to LinkedIn:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
