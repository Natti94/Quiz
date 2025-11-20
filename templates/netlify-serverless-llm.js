// Netlify Serverless Function Template with LLM
// Place this in netlify/functions/llm-chat.js
// Install: npm install node-fetch dotenv

const LLMClient = require('../../lib/llmTemplate');

exports.handler = async (event, context) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const { prompt, provider = 'ollama', options = {} } = JSON.parse(event.body);

    if (!prompt) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Prompt is required' })
      };
    }

    // Initialize LLM client
    const llm = new LLMClient(provider);

    // Query the AI
    const response = await llm.query(prompt, options);

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*', // Adjust for production
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
      },
      body: JSON.stringify({
        response: response,
        provider: provider,
        timestamp: new Date().toISOString()
      })
    };

  } catch (error) {
    console.error('LLM Function Error:', error);

    return {
      statusCode: 500,
      body: JSON.stringify({
        error: 'AI service temporarily unavailable',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      })
    };
  }
};