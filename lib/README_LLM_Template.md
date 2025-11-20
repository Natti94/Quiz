# LLM Template

This is a reusable template for integrating various AI/LLM providers in your Node.js applications.

## Usage

1. Copy `llmTemplate.js` to your project and rename it (e.g., `myLLMClient.js`)
2. Copy `.env.example` to `.env` and fill in your API keys
3. Install dependencies: `npm install node-fetch dotenv`
4. Use in your code:

```javascript
const LLMClient = require('./myLLMClient');

const llm = new LLMClient('ollama'); // or 'grok', 'huggingface'

async function example() {
  const response = await llm.query('Hello, how are you?');
  console.log(response);
}

example();
```

## Supported Providers

- **Ollama**: Local AI models (default)
- **Grok**: xAI's AI model
- **Hugging Face**: Open-source models via Inference API

## Configuration

Set your API keys in `.env`:

- `OLLAMA_URL`: Ollama server URL (default: http://localhost:11434)
- `OLLAMA_API_KEY`: Optional API key for authenticated Ollama
- `GROK_API_KEY`: Your xAI API key
- `HF_TOKEN`: Your Hugging Face token
- `AI_PROVIDER`: Default provider ('ollama', 'grok', or 'huggingface')

## Notes

- For Node.js 18+, remove the `node-fetch` import (use built-in `fetch`)
- Handle errors appropriately in production
- Rate limits apply to cloud APIs (Grok, Hugging Face)
- Ollama requires the server to be running locally