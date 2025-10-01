import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import perplexityRoutes from './routes/perplexity.js';
import linkedinRoutes from './routes/linkedin.js';
import postsRoutes from './routes/posts.js';
import { initTelegramBot } from './services/telegramService.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/perplexity', perplexityRoutes);
app.use('/api/posts', postsRoutes);
app.use('/auth/callback', linkedinRoutes);
app.use('/api/linkedin', linkedinRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

initTelegramBot();

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`LinkedIn OAuth callback: http://localhost:${PORT}/auth/callback`);
});
