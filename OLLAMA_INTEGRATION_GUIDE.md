# Guide: Integrating Ollama for Local AI in Applications (Beginner-Friendly)

This guide is designed for first-time users. It covers everything from downloading Ollama to integrating it into your app, with step-by-step instructions.

## What is Ollama?
Ollama lets you run AI models locally on your computer, no internet or API keys needed for basic use. It's great for development and privacy-focused apps.

## Prerequisites
- A computer with at least 8GB RAM (16GB recommended for larger models).
- macOS, Windows, or Linux.
- Basic command-line knowledge (we'll guide you).

## Step 1: Download and Install Ollama
1. Go to [ollama.ai](https://ollama.ai) in your web browser.
2. Click "Download" and select your operating system (e.g., macOS, Windows).
3. Download the installer file (e.g., `.dmg` for Mac, `.exe` for Windows).
4. Run the installer and follow the on-screen instructions. It will install Ollama and add it to your PATH.
5. Open a terminal (Command Prompt on Windows, Terminal on Mac/Linux) and type `ollama --version` to verify. You should see the version number.

## Step 2: Start the Ollama Server
1. In your terminal, run: `ollama serve`
2. This starts a local server on `http://localhost:11434`. Keep this terminal open—it's running in the background.
3. If you see errors (e.g., port in use), try `ollama serve --port 11435` to use a different port.

## Step 3: Download a Model
1. Open a new terminal window (keep the server running).
2. Run: `ollama pull llama2` (this downloads the Llama 2 model, about 4GB).
3. Wait for the download to complete. You can check progress with `ollama list`.
4. Test it: `ollama run llama2` and type a message like "Hello!". Press Ctrl+D to exit.

## Step 4: Integrate into Your Node.js App
1. Install node-fetch if needed (for Node < 18): `npm install node-fetch`
2. Create a file like `ollamaClient.js`:
   ```javascript
   const fetch = require('node-fetch'); // Remove if using Node 18+

   async function queryOllama(prompt, model = 'llama2') {
     try {
       const response = await fetch('http://localhost:11434/api/generate', {
         method: 'POST',
         headers: {
           'Content-Type': 'application/json'
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

   module.exports = { queryOllama };
   ```
3. Use it in your app:
   ```javascript
   const { queryOllama } = require('./ollamaClient');
   // In a route or function
   const reply = await queryOllama('Explain AI simply.');
   console.log(reply);
   ```

## Advanced Tips
- **Streaming**: Set `stream: true` and handle chunks for real-time responses.
- **Custom Models**: Pull others like `ollama pull mistral`.
- **Production**: For servers, use Docker or cloud GPUs. Local Ollama isn't ideal for high traffic.

## Troubleshooting
- **"Command not found"**: Restart terminal or reinstall Ollama.
- **Slow responses**: Use smaller models like `llama2:7b`.
- **Port issues**: Check firewall settings.
- **Model not found**: Ensure you pulled it with `ollama pull <model>`.

## Next Steps
- Experiment with different prompts.
- Integrate into your quiz app for AI-generated questions.
- For more, check Ollama's docs.
- **Template Available**: Check `lib/llmTemplate.js` for a reusable client class.