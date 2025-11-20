# Guide: Integrating Grok AI from xAI (Beginner-Friendly)

This guide is for first-time users. It walks you through signing up, getting an API key, and integrating Grok into your app.

## What is Grok?
Grok is an AI built by xAI, inspired by the Hitchhiker's Guide to the Galaxy. It's helpful, truthful, and fun for chat, code, and more.

## Prerequisites
- Internet connection.
- A free xAI account.
- Node.js installed (for integration).

## Step 1: Sign Up for xAI
1. Go to [x.ai](https://x.ai) in your browser.
2. Click "Sign Up" (top right).
3. Enter your email and create a password. Or sign up with Google/X/Twitter.
4. Verify your email by clicking the link sent to you.
5. Log in to your account.

## Step 2: Get Your API Key
1. After logging in, go to [console.x.ai](https://console.x.ai) (or search for "xAI API" in your account settings).
2. If it's your first time, click "Create API Key".
3. Name it (e.g., "My Quiz App").
4. Copy the key (it looks like `xai-...`). Keep it secret!
5. If you lose it, generate a new one.

## Step 3: Set Up Environment Variables
1. In your project root, create a `.env` file (if not exists).
2. Add: `GROK_API_KEY=your_key_here`
3. Install dotenv: `npm install dotenv`
4. In your code, load it: `require('dotenv').config();`

## Step 4: Integrate into Your Node.js App
1. Install node-fetch if needed (for Node < 18): `npm install node-fetch`
2. Create `grokClient.js`:
   ```javascript
   const fetch = require('node-fetch'); // Remove if using Node 18+
   require('dotenv').config();

   async function queryGrok(prompt) {
     try {
       const response = await fetch('https://api.x.ai/v1/chat/completions', {
         method: 'POST',
         headers: {
           'Content-Type': 'application/json',
           'Authorization': `Bearer ${process.env.GROK_API_KEY}`
         },
         body: JSON.stringify({
           messages: [{ role: 'user', content: prompt }],
           model: 'grok-beta',
           stream: false,
           temperature: 0
         })
       });

       if (!response.ok) {
         throw new Error(`HTTP ${response.status}: ${response.statusText}`);
       }

       const data = await response.json();
       return data.choices[0].message.content;
     } catch (error) {
       console.error('Grok error:', error.message);
       return 'Error: Could not query Grok.';
     }
   }

   module.exports = { queryGrok };
   ```
3. Use it:
   ```javascript
   const { queryGrok } = require('./grokClient');
   const answer = await queryGrok('What is AI?');
   console.log(answer);
   ```

## API Details
- Endpoint: `https://api.x.ai/v1/chat/completions`
- Models: `grok-beta` (main one).
- Rate limits: Check xAI docs for free tier limits.

## Best Practices
- Secure your API key (never commit to Git).
- Handle rate limits (retry with backoff).
- Use for non-sensitive data (Grok is truthful but not perfect).

## Troubleshooting
- **401 Unauthorized**: Check API key.
- **429 Too Many Requests**: Wait and retry.
- **Network errors**: Ensure internet and correct endpoint.
- **Sign-up issues**: Use a different email or contact xAI support.

## Next Steps
- Try different prompts.
- Integrate into your quiz for AI hints.
- Explore xAI docs for more features.
- **Template Available**: Check `lib/llmTemplate.js` for a reusable client class.