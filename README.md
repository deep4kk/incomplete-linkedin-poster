# LinkedIn Post Manager with Telegram Bot

Complete LinkedIn content management system with AI-powered post generation, web interface, and Telegram bot. Uses Supabase as database with Perplexity AI for content generation.

## Features

- AI Content Generation with Perplexity AI
- Quick Select: AI Integration, Google Apps Script, Data Management Automation
- Custom Topic Input: Enter any niche or topic you want
- LinkedIn OAuth & Direct Posting
- Telegram Bot with Daily 11 AM Reminders
- Supabase Database
- Analytics Dashboard
- Mobile-Responsive Design

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure .env

```env
PORT=3001

# Supabase (Database)
VITE_SUPABASE_URL=https://0ec90b57d6e95fcbda19832f.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here

# Perplexity AI
PERPLEXITY_API_KEY=your_perplexity_api_key

# LinkedIn (https://www.linkedin.com/developers/)
LINKEDIN_CLIENT_ID=your_client_id
LINKEDIN_CLIENT_SECRET=your_secret
LINKEDIN_REDIRECT_URI=http://localhost:3001/auth/callback

# Telegram Bot (optional - @BotFather)
TELEGRAM_BOT_TOKEN=your_bot_token
TELEGRAM_CHAT_ID=your_chat_id
```

### 3. Run Application

**Terminal 1 - Backend Server:**
```bash
npm run server
```

**Terminal 2 - Frontend (automatically starts):**
```bash
npm run dev
```

Visit: `http://localhost:5173`

## API Keys Setup

### Perplexity AI
1. Go to [Perplexity API](https://www.perplexity.ai/)
2. Sign up for API access
3. Get your API key from the dashboard
4. Add to .env as `PERPLEXITY_API_KEY`

### LinkedIn Setup
1. Go to [LinkedIn Developers](https://www.linkedin.com/developers/)
2. Create new app
3. Add redirect URI: `http://localhost:3001/auth/callback`
4. Request permissions: "Sign In with LinkedIn" + "Share on LinkedIn" + "w_member_social"
5. Copy Client ID & Secret to .env

### Telegram Bot Setup (Optional)
1. Message [@BotFather](https://t.me/botfather) on Telegram
2. Send `/newbot` and follow prompts
3. Copy bot token
4. Start chat with your bot, send any message
5. Visit: `https://api.telegram.org/bot<TOKEN>/getUpdates`
6. Find your chat ID in the response
7. Add both to .env

## Usage

### Web Interface
1. Click "Connect LinkedIn" to authenticate
2. Select a quick niche (AI Integration, Google Apps Script, Data Management) OR enter your custom topic
3. Click "Generate 3 Posts"
4. Review generated posts
5. Approve or reject each post
6. Post approved content directly to LinkedIn

### Telegram Bot
1. Message your bot: `/start`
2. Choose niche from options
3. Review posts sent by bot
4. Approve and post via bot commands

Daily reminder sent at 11 AM automatically!

## How It Works

- **Database**: Supabase (PostgreSQL) - stores posts, auth tokens, and logs
- **AI Engine**: Perplexity AI (llama-3.1-sonar-small-128k-online model)
- **Backend**: Node.js Express server (port 3001)
- **Frontend**: React + Vite + TypeScript + Tailwind CSS
- **LinkedIn**: OAuth 2.0 flow with UGC posting API
- **Telegram**: Long polling + node-cron for scheduled reminders

## Troubleshooting

### Failed to Fetch / Connection Error
- Ensure backend server is running on port 3001
- Check that all environment variables are set correctly
- Verify Supabase URL and keys are valid

### LinkedIn Not Working
- Redirect URI must be exactly: `http://localhost:3001/auth/callback`
- Check app has required permissions (openid, profile, email, w_member_social)
- Verify Client ID and Secret in .env
- Make sure you've completed LinkedIn authentication in the UI

### Perplexity AI Errors
- Verify API key is correct
- Check you have API credits available
- Ensure no rate limiting issues

### Telegram Silent
- Check bot token is correct
- Send `/start` to bot first to initiate conversation
- Verify TELEGRAM_CHAT_ID is set correctly
- Check server logs for Telegram errors

## Project Structure

```
server/
  ├── config/database.js           # Supabase client wrapper
  ├── services/
  │   ├── perplexityService.js     # AI post generation with Perplexity
  │   ├── linkedinService.js       # LinkedIn OAuth & posting
  │   └── telegramService.js       # Telegram bot + cron scheduler
  └── routes/
      ├── perplexity.js            # Post generation endpoints
      ├── linkedin.js              # OAuth & posting endpoints
      └── posts.js                 # Post management endpoints

src/
  ├── components/
  │   ├── Dashboard.tsx            # Stats dashboard
  │   ├── Header.tsx               # App header with auth
  │   ├── NicheSelector.tsx        # Quick select + custom input
  │   ├── PostCard.tsx             # Individual post display
  │   └── LogsTable.tsx            # Activity logs
  ├── lib/api.ts                   # Frontend API client
  ├── types/index.ts               # TypeScript types
  └── App.tsx                      # Main application

google-apps-script/
  └── Code.gs                      # Legacy Google Sheets integration
```

## API Endpoints

- `POST /api/perplexity/generate` - Generate posts with AI
- `GET /api/linkedin/auth-url` - Get LinkedIn OAuth URL
- `GET /auth/callback` - OAuth callback handler
- `POST /api/linkedin/callback` - Exchange code for token
- `GET /api/linkedin/auth-status` - Check authentication status
- `POST /api/linkedin/post` - Post content to LinkedIn
- `GET /api/posts` - Get all posts
- `GET /api/posts/stats` - Get statistics
- `GET /api/posts/logs` - Get activity logs
- `PATCH /api/posts/:id/approve` - Approve a post
- `PATCH /api/posts/:id/reject` - Reject a post

## Database Schema

The application uses Supabase with the following tables:

- **linkedin_posts**: Stores generated and posted content
- **linkedin_auth**: Stores OAuth tokens
- **post_logs**: Tracks all post-related activities

## Important Notes

- LinkedIn redirect URI MUST be `http://localhost:3001/auth/callback` (backend port)
- Perplexity AI generates unique, high-quality posts using online models
- Custom topics allow unlimited flexibility beyond the 3 predefined niches
- Telegram daily reminder uses node-cron (11 AM based on server timezone)
- All sensitive data stored securely in Supabase
- Frontend communicates with backend API, not directly with external services

## Tech Stack

- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS, Lucide Icons
- **Backend**: Node.js, Express 5, Axios, Dotenv
- **Database**: Supabase (PostgreSQL)
- **AI**: Perplexity AI (llama-3.1-sonar-small-128k-online)
- **Integrations**: LinkedIn API, Telegram Bot API
- **Scheduling**: node-cron

## License

Private and confidential.
