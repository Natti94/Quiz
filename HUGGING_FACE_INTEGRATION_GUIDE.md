# Guide: Integrating Hugging Face Models (Beginner-Friendly)

This guide is for first-timers. It covers signing up, getting a token, and using Hugging Face models in your app.

## What is Hugging Face?
Hugging Face is a platform for open-source AI models. You can use their free API for text, images, and more without running models locally.

## Prerequisites
- Internet connection.
- Free Hugging Face account.
- Node.js for integration.

## Step 1: Sign Up for Hugging Face
1. Go to [huggingface.co](https://huggingface.co) in your browser.
2. Click "Sign Up" (top right).
3. Enter email, username, password. Or sign up with GitHub/Google.
4. Verify email by clicking the link.
5. Log in.

## Step 2: Get Your API Token
1. After login, click your profile (top right) > Settings.
2. Go to "Access Tokens" tab.
3. Click "New token".
4. Name it (e.g., "Quiz App Token").
5. Role: "Read" (free tier).
6. Copy the token (starts with `hf_`). Keep it secret!

## Step 3: Set Up Environment Variables
1. Create `.env` in project root.
2. Add: `HF_TOKEN=your_token_here`
3. Install dotenv: `npm install dotenv`
4. Load in code: `require('dotenv').config();`

## Step 4: Integrate into Your Node.js App
1. Install node-fetch if needed (for Node < 18): `npm install node-fetch`
2. Create `hfClient.js`:
   ```javascript
   const fetch = require('node-fetch'); // Remove if using Node 18+
   require('dotenv').config();

   async function queryHuggingFace(prompt, model = 'gpt2') {
     try {
       const response = await fetch(`https://api-inference.huggingface.co/models/${model}`, {
         method: 'POST',
         headers: {
           'Authorization': `Bearer ${process.env.HF_TOKEN}`,
           'Content-Type': 'application/json'
         },
         body: JSON.stringify({
           inputs: prompt,
           parameters: { max_length: 50, temperature: 0.7 }
         })
       });

       if (!response.ok) {
         throw new Error(`HTTP ${response.status}: ${response.statusText}`);
       }

       const data = await response.json();
       return data[0].generated_text;
     } catch (error) {
       console.error('HF error:', error.message);
       return 'Error: Could not query Hugging Face.';
     }
   }

   module.exports = { queryHuggingFace };
   ```
3. Use it:
   ```javascript
   const { queryHuggingFace } = require('./hfClient');
   const text = await queryHuggingFace('The future of AI is');
   console.log(text);
   ```

## Popular Models
- Text: `gpt2`, `microsoft/DialoGPT-medium`
- Classification: `cardiffnlp/twitter-roberta-base-sentiment`
- Try models on [huggingface.co/models](https://huggingface.co/models).

## Best Practices
- Free tier: 30k requests/month, slow for big models.
- First request may take time (model loading).
- Upgrade account for faster inference.
- For privacy, run models locally with Transformers library.

## Troubleshooting
- **403 Forbidden**: Check token.
- **503 Service Unavailable**: Model loading, retry later.
- **Rate limit**: Wait or upgrade.
- **Sign-up issues**: Use different email.

## Next Steps
- Experiment with different models.
- Use for quiz question generation.
- Check docs for more features.
- **Template Available**: Check `lib/llmTemplate.js` for a reusable client class.