// Express Server with MongoDB and LLM Integration
// Install: npm install express mongoose node-fetch dotenv cors helmet

const express = require('express');
const mongoose = require('mongoose');
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

// MongoDB Models
const ConversationSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  messages: [{
    role: { type: String, enum: ['user', 'assistant'], required: true },
    content: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
    provider: { type: String, default: 'ollama' }
  }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const Conversation = mongoose.model('Conversation', ConversationSchema);

// Database connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/llm-app', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Connected to MongoDB');
}).catch(err => {
  console.error('MongoDB connection error:', err);
});

// Initialize LLM client
const llmClient = new LLMClient(process.env.AI_PROVIDER || 'ollama');

// Routes
app.post('/api/chat', async (req, res) => {
  try {
    const { message, userId, conversationId, provider } = req.body;

    if (!message || !userId) {
      return res.status(400).json({ error: 'Message and userId are required' });
    }

    // Get or create conversation
    let conversation;
    if (conversationId) {
      conversation = await Conversation.findById(conversationId);
      if (!conversation) {
        return res.status(404).json({ error: 'Conversation not found' });
      }
    } else {
      conversation = new Conversation({ userId, messages: [] });
    }

    // Add user message to conversation
    conversation.messages.push({
      role: 'user',
      content: message,
      provider: provider || process.env.AI_PROVIDER
    });

    // Query AI
    const aiResponse = await llmClient.query(message, { provider });

    // Add AI response to conversation
    conversation.messages.push({
      role: 'assistant',
      content: aiResponse,
      provider: provider || process.env.AI_PROVIDER
    });

    conversation.updatedAt = new Date();
    await conversation.save();

    res.json({
      response: aiResponse,
      conversationId: conversation._id,
      provider: provider || process.env.AI_PROVIDER
    });

  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ error: 'AI service error' });
  }
});

app.get('/api/conversations/:userId', async (req, res) => {
  try {
    const conversations = await Conversation.find({ userId: req.params.userId })
      .sort({ updatedAt: -1 })
      .limit(10);

    res.json(conversations);
  } catch (error) {
    console.error('Get conversations error:', error);
    res.status(500).json({ error: 'Database error' });
  }
});

app.delete('/api/conversations/:conversationId', async (req, res) => {
  try {
    await Conversation.findByIdAndDelete(req.params.conversationId);
    res.json({ message: 'Conversation deleted' });
  } catch (error) {
    console.error('Delete conversation error:', error);
    res.status(500).json({ error: 'Database error' });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});