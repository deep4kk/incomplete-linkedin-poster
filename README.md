# LinkedIn Post Manager with Telegram Bot

Complete LinkedIn content management system with AI-powered post generation, web interface, and Telegram bot. Uses Google Sheets as database - NO Supabase needed!

## Features

- AI Content Generation with Gemini
- 3 Niches: AI Integration, Google Apps Script, Data Management Automation
- LinkedIn OAuth & Direct Posting
- Telegram Bot with Daily 11 AM Reminders
- Google Sheets Database (No Supabase!)
- Analytics Dashboard
- Mobile-Responsive Design

## Quick Start

### 1. Install Dependencies
\`\`\`bash
npm install
\`\`\`

### 2. Set Up Google Apps Script (Your Database!)

1. Create [Google Sheet](https://sheets.google.com)
2. Extensions > Apps Script
3. Copy code from `google-apps-script/Code.gs`
4. Run `setupAllSheets` function
5. Deploy > New deployment > Web app
6. Set "Execute as": Me, "Who has access": Anyone
7. Copy Web App URL

### 3. Configure .env

\`\`\`env
PORT=3001

# Gemini AI (https://makersuite.google.com/app/apikey)
GEMINI_API_KEY=your_key_here

# LinkedIn (https://www.linkedin.com/developers/)
LINKEDIN_CLIENT_ID=your_client_id
LINKEDIN_CLIENT_SECRET=your_secret
LINKEDIN_REDIRECT_URI=http://localhost:3001/auth/callback

# Google Apps Script (from step 2)
GOOGLE_APPS_SCRIPT_URL=https://script.google.com/macros/s/YOUR_ID/exec

# Telegram Bot (optional - @BotFather)
TELEGRAM_BOT_TOKEN=your_bot_token
TELEGRAM_CHAT_ID=your_chat_id
\`\`\`

### 4. Run Application

**Terminal 1:**
\`\`\`bash
npm run server
\`\`\`

**Terminal 2:**
\`\`\`bash
npm run dev
\`\`\`

Visit: `http://localhost:5173`

## LinkedIn Setup

1. Go to [LinkedIn Developers](https://www.linkedin.com/developers/)
2. Create app
3. Add redirect: `http://localhost:3001/auth/callback`
4. Request: "Sign In with LinkedIn" + "Share on LinkedIn"
5. Copy Client ID & Secret to .env

## Telegram Bot Setup (Optional)

1. Message [@BotFather](https://t.me/botfather)
2. Send `/newbot`, follow prompts
3. Copy bot token
4. Start chat with bot, send any message
5. Visit: `https://api.telegram.org/bot<TOKEN>/getUpdates`
6. Find your chat ID in response
7. Add to .env

## Usage

### Web Interface
1. Click "Connect LinkedIn"
2. Select niche
3. Generate 3 posts
4. Approve/reject
5. Post to LinkedIn

### Telegram Bot
1. Message bot: `/start`
2. Choose niche
3. Review posts
4. Approve & post

Daily reminder at 11 AM!

## How It Works

- **Database**: Google Sheets (3 sheets: Posts, Auth, Logs)
- **Backend**: Node.js talks to Google Apps Script
- **LinkedIn**: OAuth flow through backend (port 3001)
- **Telegram**: Long polling + cron for daily reminders

## Troubleshooting

### Failed to Fetch
- Check backend running on port 3001
- Verify GOOGLE_APPS_SCRIPT_URL in .env
- Ensure Google Script is deployed

### LinkedIn Not Working
- Redirect URI must be exactly: `http://localhost:3001/auth/callback`
- Check app has required permissions
- Verify credentials in .env

### Telegram Silent
- Check bot token
- Send `/start` to bot first
- Verify TELEGRAM_CHAT_ID set

## Project Structure

\`\`\`
server/
  ├── config/database.js       # Google Sheets API wrapper
  ├── services/
  │   ├── geminiService.js     # AI post generation
  │   ├── linkedinService.js   # LinkedIn OAuth & posting
  │   └── telegramService.js   # Telegram bot + cron
  └── routes/                  # API endpoints

src/
  ├── components/              # React components
  ├── lib/api.ts              # Frontend API client
  └── App.tsx                 # Main application

google-apps-script/
  └── Code.gs                 # Database layer
\`\`\`

## API Endpoints

- `POST /api/gemini/generate` - Generate posts
- `GET /api/linkedin/auth-url` - Get OAuth URL
- `GET /auth/callback` - OAuth callback
- `POST /api/linkedin/post` - Post to LinkedIn
- `GET /api/posts` - Get all posts
- `PATCH /api/posts/:id/approve` - Approve post

## Important Notes

- LinkedIn redirect MUST be port 3001 (backend)
- Google Apps Script needs "Anyone" access
- Telegram daily trigger uses system time
- All data stored in Google Sheets (no Supabase!)

## License

Private and confidential.
