# LLM Client Template
# Copy this file and rename it (e.g., ollamaClient.js, grokClient.js)
# Install dependencies: npm install node-fetch dotenv

const fetch = require('node-fetch'); // Remove for Node 18+
require('dotenv').config();

class LLMClient {
  constructor(provider = 'ollama') {
    this.provider = provider;
  }

  async query(prompt, options = {}) {
    switch (this.provider) {
      case 'ollama':
        return this.queryOllama(prompt, options);
      case 'grok':
        return this.queryGrok(prompt, options);
      case 'huggingface':
        return this.queryHuggingFace(prompt, options);
      default:
        throw new Error(`Unsupported provider: ${this.provider}`);
    }
  }

  async queryOllama(prompt, { model = 'llama2' } = {}) {
    try {
      const response = await fetch(process.env.OLLAMA_URL || 'http://localhost:11434/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(process.env.OLLAMA_API_KEY && { 'Authorization': `Bearer ${process.env.OLLAMA_API_KEY}` })
        },
        body: JSON.stringify({
          model: model,
          prompt: prompt,
          stream: false
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return data.response;
    } catch (error) {
      console.error('Ollama error:', error.message);
      return 'Error: Could not connect to Ollama.';
    }
  }

  async queryGrok(prompt, { model = 'grok-beta', temperature = 0 } = {}) {
    try {
      const response = await fetch('https://api.x.ai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.GROK_API_KEY}`
        },
        body: JSON.stringify({
          messages: [{ role: 'user', content: prompt }],
          model: model,
          stream: false,
          temperature: temperature
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

  async queryHuggingFace(prompt, { model = 'gpt2', maxLength = 50, temperature = 0.7 } = {}) {
    try {
      const response = await fetch(`https://api-inference.huggingface.co/models/${model}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.HF_TOKEN}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          inputs: prompt,
          parameters: { max_length: maxLength, temperature: temperature }
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return data[0].generated_text;
    } catch (error) {
      console.error('Hugging Face error:', error.message);
      return 'Error: Could not query Hugging Face.';
    }
  }
}

module.exports = LLMClient;