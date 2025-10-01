# Google Apps Script Setup (Your Database!)

This Google Apps Script acts as your database - replacing Supabase completely!

## Quick Setup

### 1. Create Google Sheet
1. Go to [Google Sheets](https://sheets.google.com)
2. Create new spreadsheet
3. Name it: "LinkedIn Posts Database"

### 2. Add Script
1. In your sheet: **Extensions > Apps Script**
2. Delete any existing code
3. Copy ALL code from `Code.gs`
4. Paste into editor
5. Save (Ctrl+S or Cmd+S)
6. Name project: "LinkedIn Posts API"

### 3. Initialize Sheets
1. Select `setupAllSheets` from dropdown
2. Click **Run** button
3. Grant permissions when prompted
4. Go back to your Google Sheet
5. Verify 3 sheets created:
   - LinkedIn Posts (green headers)
   - LinkedIn Auth (blue headers)
   - Activity Logs (orange headers)

### 4. Deploy as Web App
1. Click **Deploy > New deployment**
2. Click gear icon > Select **Web app**
3. Set:
   - **Description**: LinkedIn Posts API
   - **Execute as**: Me
   - **Who has access**: **Anyone** (IMPORTANT!)
4. Click **Deploy**
5. Copy the **Web app URL**
6. Click **Done**

### 5. Update .env
Add the Web app URL to your `.env` file:

\`\`\`env
GOOGLE_APPS_SCRIPT_URL=https://script.google.com/macros/s/YOUR_SCRIPT_ID_HERE/exec
\`\`\`

## What Each Sheet Does

### LinkedIn Posts
Stores all generated posts with status tracking
- Columns: ID, Niche, Content, Status, Timestamps, LinkedIn Post ID

### LinkedIn Auth
Stores LinkedIn access token
- Columns: Access Token, Refresh Token, Expires At, User Info

### Activity Logs
Tracks all actions (generated, approved, posted, rejected)
- Columns: ID, Post ID, Action, Details, Timestamp

## API Actions

The script handles these actions:
- `savePost` - Save generated post
- `getPosts` - Retrieve posts (with optional status filter)
- `updatePost` - Update post status
- `saveAuth` - Store LinkedIn token
- `getAuth` - Retrieve auth token
- `getLogs` - Get activity logs
- `getStats` - Get statistics

## Testing

1. Visit your Web app URL in browser
2. Should see: `{"status":"active","message":"LinkedIn Posts Manager API is running"}`
3. If error, check:
   - Script is deployed
   - "Who has access" is set to "Anyone"
   - Authorized the script

## Troubleshooting

### "Authorization Required"
- Run `setupAllSheets` and authorize
- Make sure you clicked "Allow" on all permissions

### "Deployment Not Found"
- Redeploy: Deploy > Manage deployments > Edit > Deploy
- Make sure "Who has access" is **Anyone**

### "Sheet Not Found"
- Run `setupAllSheets` function
- Check all 3 sheets exist in your spreadsheet

### Backend Can't Connect
- Verify Web app URL is correct in .env
- URL should end with `/exec`
- No trailing spaces

## Redeploying

If you update the script:
1. Save changes
2. Deploy > Manage deployments
3. Click edit icon (pencil)
4. Version > New version
5. Deploy
6. URL stays the same!

## Security

- Script executes as YOU
- Data visible to anyone with sheet link
- For production: Consider restricted access + proper auth
- Never share the Web app URL publicly

## Advantages Over Supabase

- No setup required
- No monthly costs
- Familiar spreadsheet interface
- Easy data export
- No row limits for this use case
- Built-in version history

## Need Help?

Check the Apps Script execution logs:
1. In Apps Script editor
2. **View > Logs** or **View > Executions**
3. See all requests and errors
