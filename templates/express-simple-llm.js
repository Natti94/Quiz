// Simple Express Server with LLM (No Database)
// Install: npm install express node-fetch dotenv cors helmet

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const LLMClient = require('../lib/llmTemplate');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Initialize LLM client
const llmClient = new LLMClient(process.env.AI_PROVIDER || 'ollama');

// In-memory storage (resets on server restart)
let conversationHistory = [];

// Routes
app.post('/api/chat', async (req, res) => {
  try {
    const { message, provider, clearHistory } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Clear history if requested
    if (clearHistory) {
      conversationHistory = [];
    }

    // Add user message to history
    conversationHistory.push({
      role: 'user',
      content: message,
      timestamp: new Date().toISOString(),
      provider: provider || process.env.AI_PROVIDER
    });

    // Query AI
    const aiResponse = await llmClient.query(message, { provider });

    // Add AI response to history
    conversationHistory.push({
      role: 'assistant',
      content: aiResponse,
      timestamp: new Date().toISOString(),
      provider: provider || process.env.AI_PROVIDER
    });

    // Keep only last 50 messages to prevent memory issues
    if (conversationHistory.length > 50) {
      conversationHistory = conversationHistory.slice(-50);
    }

    res.json({
      response: aiResponse,
      conversationLength: conversationHistory.length,
      provider: provider || process.env.AI_PROVIDER
    });

  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ error: 'AI service error' });
  }
});

app.get('/api/history', (req, res) => {
  res.json({
    history: conversationHistory,
    count: conversationHistory.length
  });
});

app.delete('/api/history', (req, res) => {
  conversationHistory = [];
  res.json({ message: 'History cleared' });
});

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    aiProvider: process.env.AI_PROVIDER || 'ollama',
    conversationCount: conversationHistory.length,
    timestamp: new Date().toISOString()
  });
});

// Simple frontend (optional)
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>LLM Chat</title>
      <style>
        body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }
        #chat { border: 1px solid #ccc; height: 400px; overflow-y: auto; padding: 10px; margin: 10px 0; }
        #message { width: 70%; padding: 5px; }
        button { padding: 5px 10px; }
      </style>
    </head>
    <body>
      <h1>AI Chat</h1>
      <div id="chat"></div>
      <input type="text" id="message" placeholder="Type your message...">
      <button onclick="sendMessage()">Send</button>
      <button onclick="clearHistory()">Clear History</button>

      <script>
        async function sendMessage() {
          const message = document.getElementById('message').value;
          if (!message) return;

          document.getElementById('message').value = '';

          // Add user message
          addMessage('You', message);

          try {
            const response = await fetch('/api/chat', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ message })
            });

            const data = await response.json();
            addMessage('AI', data.response);
          } catch (error) {
            addMessage('Error', 'Failed to get AI response');
          }
        }

        function addMessage(sender, text) {
          const chat = document.getElementById('chat');
          chat.innerHTML += \`<p><strong>\${sender}:</strong> \${text}</p>\`;
          chat.scrollTop = chat.scrollHeight;
        }

        async function clearHistory() {
          await fetch('/api/history', { method: 'DELETE' });
          document.getElementById('chat').innerHTML = '<p>History cleared</p>';
        }

        // Enter key support
        document.getElementById('message').addEventListener('keypress', function(e) {
          if (e.key === 'Enter') sendMessage();
        });
      </script>
    </body>
    </html>
  `);
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`AI Provider: ${process.env.AI_PROVIDER || 'ollama'}`);
});