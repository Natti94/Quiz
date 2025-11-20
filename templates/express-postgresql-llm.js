// Express Server with PostgreSQL and LLM Integration
// Install: npm install express pg node-fetch dotenv cors helmet

const express = require('express');
const { Pool } = require('pg');
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

// PostgreSQL connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://user:password@localhost:5432/llm_app',
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// Initialize database tables
async function initDB() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS conversations (
        id SERIAL PRIMARY KEY,
        user_id VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS messages (
        id SERIAL PRIMARY KEY,
        conversation_id INTEGER REFERENCES conversations(id) ON DELETE CASCADE,
        role VARCHAR(50) NOT NULL CHECK (role IN ('user', 'assistant')),
        content TEXT NOT NULL,
        provider VARCHAR(100) DEFAULT 'ollama',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('Database initialized');
  } catch (error) {
    console.error('Database initialization error:', error);
  }
}

initDB();

// Initialize LLM client
const llmClient = new LLMClient(process.env.AI_PROVIDER || 'ollama');

// Routes
app.post('/api/chat', async (req, res) => {
  const client = await pool.connect();
  try {
    const { message, userId, conversationId, provider } = req.body;

    if (!message || !userId) {
      return res.status(400).json({ error: 'Message and userId are required' });
    }

    await client.query('BEGIN');

    // Get or create conversation
    let conversation;
    if (conversationId) {
      const result = await client.query(
        'SELECT * FROM conversations WHERE id = $1',
        [conversationId]
      );
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Conversation not found' });
      }
      conversation = result.rows[0];
    } else {
      const result = await client.query(
        'INSERT INTO conversations (user_id) VALUES ($1) RETURNING *',
        [userId]
      );
      conversation = result.rows[0];
    }

    // Add user message
    await client.query(
      'INSERT INTO messages (conversation_id, role, content, provider) VALUES ($1, $2, $3, $4)',
      [conversation.id, 'user', message, provider || process.env.AI_PROVIDER]
    );

    // Query AI
    const aiResponse = await llmClient.query(message, { provider });

    // Add AI response
    await client.query(
      'INSERT INTO messages (conversation_id, role, content, provider) VALUES ($1, $2, $3, $4)',
      [conversation.id, 'assistant', aiResponse, provider || process.env.AI_PROVIDER]
    );

    // Update conversation timestamp
    await client.query(
      'UPDATE conversations SET updated_at = CURRENT_TIMESTAMP WHERE id = $1',
      [conversation.id]
    );

    await client.query('COMMIT');

    res.json({
      response: aiResponse,
      conversationId: conversation.id,
      provider: provider || process.env.AI_PROVIDER
    });

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Chat error:', error);
    res.status(500).json({ error: 'AI service error' });
  } finally {
    client.release();
  }
});

app.get('/api/conversations/:userId', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT c.*, json_agg(
        json_build_object(
          'id', m.id,
          'role', m.role,
          'content', m.content,
          'provider', m.provider,
          'created_at', m.created_at
        ) ORDER BY m.created_at
      ) as messages
      FROM conversations c
      LEFT JOIN messages m ON c.id = m.conversation_id
      WHERE c.user_id = $1
      GROUP BY c.id
      ORDER BY c.updated_at DESC
      LIMIT 10
    `, [req.params.userId]);

    res.json(result.rows);
  } catch (error) {
    console.error('Get conversations error:', error);
    res.status(500).json({ error: 'Database error' });
  }
});

app.delete('/api/conversations/:conversationId', async (req, res) => {
  try {
    await pool.query('DELETE FROM conversations WHERE id = $1', [req.params.conversationId]);
    res.json({ message: 'Conversation deleted' });
  } catch (error) {
    console.error('Delete conversation error:', error);
    res.status(500).json({ error: 'Database error' });
  }
});

// Health check
app.get('/health', async (req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({ status: 'OK', database: 'connected', timestamp: new Date().toISOString() });
  } catch (error) {
    res.status(500).json({ status: 'ERROR', database: 'disconnected' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});