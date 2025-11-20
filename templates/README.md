# LLM Integration Templates

This directory contains different templates for integrating AI/LLM services based on your project architecture and requirements.

## Available Templates

### 1. `netlify-serverless-llm.js`
**Use Case**: Serverless API endpoints on Netlify
**Architecture**: Serverless functions
**Database**: None (stateless)
**Deployment**: Netlify Functions

**Features**:
- REST API endpoint for AI chat
- CORS headers configured
- Error handling for serverless environment
- Environment variable support

**Setup**:
```bash
# Place in netlify/functions/llm-chat.js
# Set environment variables in Netlify dashboard
# Deploy automatically on git push
```

### 2. `express-mongodb-llm.js`
**Use Case**: Full-stack web applications with conversation history
**Architecture**: Express server + MongoDB
**Database**: MongoDB with conversation storage
**Deployment**: Heroku, DigitalOcean, AWS, etc.

**Features**:
- REST API with conversation management
- User-specific chat history
- MongoDB integration for persistence
- CRUD operations for conversations

**Setup**:
```bash
npm install express mongoose node-fetch dotenv cors helmet
# Set MONGODB_URI in .env
node express-mongodb-llm.js
```

### 3. `express-postgresql-llm.js`
**Use Case**: Enterprise applications requiring ACID transactions
**Architecture**: Express server + PostgreSQL
**Database**: PostgreSQL with relational data
**Deployment**: Heroku, Railway, AWS RDS, etc.

**Features**:
- Transaction-safe conversation storage
- Complex queries and analytics support
- JSON aggregation for message history
- Connection pooling for performance

**Setup**:
```bash
npm install express pg node-fetch dotenv cors helmet
# Set DATABASE_URL in .env
node express-postgresql-llm.js
```

### 4. `express-simple-llm.js`
**Use Case**: Quick prototyping or simple web apps
**Architecture**: Express server only
**Database**: In-memory (resets on restart)
**Deployment**: Local development, simple hosting

**Features**:
- Basic REST API for chat
- In-memory conversation history
- Simple HTML frontend included
- No database setup required

**Setup**:
```bash
npm install express node-fetch dotenv cors helmet
# Set AI_PROVIDER in .env
node express-simple-llm.js
```

### 5. `cli-llm.js`
**Use Case**: Command-line tools, scripts, automation
**Architecture**: CLI application
**Database**: None (stateless)
**Deployment**: npm package, shell scripts

**Features**:
- Interactive chat mode
- One-off queries
- Connection testing
- Command-line arguments and options

**Setup**:
```bash
npm install commander node-fetch dotenv
chmod +x cli-llm.js
./cli-llm.js chat "Hello AI!"
./cli-llm.js interactive
./cli-llm.js test
```

## Common Environment Variables

All templates use the same LLM client (`lib/llmTemplate.js`) and support these environment variables:

```env
# AI Provider Selection
AI_PROVIDER=ollama  # ollama, grok, or huggingface

# Ollama (Local AI)
OLLAMA_URL=http://localhost:11434
OLLAMA_API_KEY=  # Optional

# Grok (xAI)
GROK_API_KEY=your_key_here

# Hugging Face
HF_TOKEN=your_token_here

# Database (for server templates)
MONGODB_URI=mongodb://localhost:27017/llm-app
DATABASE_URL=postgresql://user:pass@localhost:5432/llm_app

# Server
PORT=3000
NODE_ENV=development
```

## Choosing the Right Template

| Scenario | Template | Why |
|----------|----------|-----|
| Static site with AI features | `netlify-serverless-llm.js` | No server management, scales automatically |
| Chat application with history | `express-mongodb-llm.js` | Document storage, flexible schemas |
| Enterprise app with reporting | `express-postgresql-llm.js` | ACID compliance, complex queries |
| Quick prototyping | `express-simple-llm.js` | No database setup, includes frontend |
| CLI tools or automation | `cli-llm.js` | No web framework overhead |
| Prototyping | Any | Quick to set up and test |

## Shared Dependencies

All templates require:
- `node-fetch` (or built-in `fetch` in Node 18+)
- `dotenv` for environment variables
- The LLM client: `lib/llmTemplate.js`

## Security Notes

- Never commit `.env` files
- Use HTTPS in production
- Validate and sanitize user inputs
- Rate limit API calls
- Store API keys securely (environment variables, not code)

## Customization

Each template can be modified to:
- Add authentication/authorization
- Implement rate limiting
- Add logging/monitoring
- Integrate with other databases (MySQL, Redis, etc.)
- Add streaming responses
- Implement conversation branching