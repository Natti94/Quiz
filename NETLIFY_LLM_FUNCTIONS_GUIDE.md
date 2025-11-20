# Guide: Netlify Serverless Functions with LLM.js (Beginner-Friendly)

This guide is for first-timers. It covers setting up Netlify, creating functions, and integrating LLM.js for AI.

## What are Netlify Functions?
Serverless functions run code without managing servers. Perfect for AI queries in your app.

## Prerequisites
- Netlify account (free).
- Node.js installed.
- Your app deployed on Netlify (or ready to deploy).

## Step 1: Sign Up for Netlify
1. Go to [netlify.com](https://netlify.com) in your browser.
2. Click "Sign up" (top right).
3. Use email, GitHub, GitLab, or Bitbucket.
4. Verify email and log in.

## Step 2: Install Netlify CLI
1. Open terminal.
2. Run: `npm install -g netlify-cli`
3. Verify: `netlify --version`

## Step 3: Set Up Your Project
1. In your project root, create folder: `netlify/functions/`
2. If deploying, connect your repo to Netlify (drag-drop or Git).

## Step 4: Create a Basic Function
1. Create file: `netlify/functions/llm-chat.js`
2. Add code:
   ```javascript
   exports.handler = async (event, context) => {
     if (event.httpMethod !== 'POST') {
       return { statusCode: 405, body: 'Method not allowed' };
     }

     const { prompt } = JSON.parse(event.body);

     // Placeholder response
     const reply = `You said: ${prompt}`;

     return {
       statusCode: 200,
       headers: { 'Content-Type': 'application/json' },
       body: JSON.stringify({ reply })
     };
   };
   ```

## Step 5: Integrate LLM.js
1. Install LLM.js: `npm install llm-js` (check actual package name).
2. Update function:
   ```javascript
   const LLM = require('llm-js'); // Adjust import

   exports.handler = async (event, context) => {
     if (event.httpMethod !== 'POST') {
       return { statusCode: 405, body: 'Method not allowed' };
     }

     const { prompt } = JSON.parse(event.body);

     try {
       const llm = new LLM({ model: 'llama2' }); // Or your model
       const reply = await llm.generate(prompt);

       return {
         statusCode: 200,
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify({ reply })
       };
     } catch (error) {
       return {
         statusCode: 500,
         body: JSON.stringify({ error: 'LLM error' })
       };
     }
   };
   ```

## Step 6: Set Environment Variables
1. In Netlify dashboard, go to Site > Environment variables.
2. Add keys like `OPENAI_API_KEY` if using APIs.
3. Or in `netlify.toml`:
   ```
   [build.environment]
   OPENAI_API_KEY = "your-key"
   ```

## Step 7: Test Locally
1. Run: `netlify dev`
2. Test function at `http://localhost:8888/.netlify/functions/llm-chat`
3. Use Postman or curl: `curl -X POST http://localhost:8888/.netlify/functions/llm-chat -d '{"prompt":"Hello"}'`

## Step 8: Deploy
1. Push code to Git.
2. Netlify auto-deploys.
3. Function URL: `https://your-site.netlify.app/.netlify/functions/llm-chat`

## Best Practices
- Handle errors (return 500).
- Add logging: `console.log`.
- Rate limit if needed.
- For APIs, use fetch in function (install node-fetch for Node < 18).

## Troubleshooting
- **Function not found**: Check path `netlify/functions/`.
- **Import errors**: Ensure packages installed.
- **Env vars**: Set in dashboard.
- **CORS**: Netlify handles it.

## Next Steps
- Add more functions for quiz AI.
- Explore Netlify docs.
- **Templates Available**: Check `lib/llmTemplate.js` for client code and `.env.example` for environment variables.