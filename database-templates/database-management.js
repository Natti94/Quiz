/**
 * Database Templates
 *
 * This template provides database migration scripts, seed data generators,
 * and database management utilities for PostgreSQL and MongoDB.
 */

// ================================
// PostgreSQL Migration Template
// ================================

const postgresMigrationTemplate = (migrationName) => `
-- Migration: ${migrationName}
-- Created: ${new Date().toISOString()}
-- Description: [Brief description of what this migration does]

BEGIN;

-- Your migration SQL here
-- Example: Creating a new table, adding columns, creating indexes, etc.

-- Example migration for adding user preferences
-- CREATE TABLE IF NOT EXISTS user_preferences (
--     id SERIAL PRIMARY KEY,
--     user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
--     preferences JSONB DEFAULT '{}',
--     created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
--     updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
--     UNIQUE(user_id)
-- );

-- Example migration for adding indexes
-- CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_user_preferences_user_id
--     ON user_preferences(user_id);

-- Example migration for adding constraints
-- ALTER TABLE quizzes ADD CONSTRAINT chk_difficulty
--     CHECK (difficulty IN ('EASY', 'MEDIUM', 'HARD'));

COMMIT;
`;

// ================================
// MongoDB Migration Template
// ================================

const mongoMigrationTemplate = (migrationName) => `
/**
 * Migration: ${migrationName}
 * Created: ${new Date().toISOString()}
 * Description: [Brief description of what this migration does]
 */

module.exports = {
  async up(db) {
    // Migration logic for applying changes
    // Example: Creating collections, adding indexes, updating documents

    // Example: Create a new collection
    // await db.createCollection('user_preferences');

    // Example: Add indexes
    // await db.collection('quizzes').createIndex({ category: 1 });
    // await db.collection('quizzes').createIndex({ difficulty: 1 });
    // await db.collection('quizzes').createIndex({ creatorId: 1 });

    // Example: Update existing documents
    // await db.collection('users').updateMany(
    //   { preferences: { $exists: false } },
    //   { $set: { preferences: {} } }
    // );

    console.log('Migration ${migrationName} applied successfully');
  },

  async down(db) {
    // Rollback logic for reverting changes
    // This should undo what the 'up' function did

    // Example: Drop collection
    // await db.collection('user_preferences').drop();

    // Example: Drop indexes
    // await db.collection('quizzes').dropIndex({ category: 1 });

    // Example: Revert document updates
    // await db.collection('users').updateMany(
    //   { preferences: {} },
    //   { $unset: { preferences: 1 } }
    // );

    console.log('Migration ${migrationName} rolled back successfully');
  }
};
`;

// ================================
// Seed Data Generator
// ================================

const seedDataGenerator = {
  // Generate sample users
  generateUsers: (count = 10) => {
    const users = [];
    const firstNames = ['Alice', 'Bob', 'Charlie', 'Diana', 'Eve', 'Frank', 'Grace', 'Henry', 'Ivy', 'Jack'];
    const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez'];

    for (let i = 0; i < count; i++) {
      const firstName = firstNames[i % firstNames.length];
      const lastName = lastNames[Math.floor(i / firstNames.length) % lastNames.length];
      const username = `${firstName.toLowerCase()}${lastName.toLowerCase()}${i}`;

      users.push({
        username,
        email: `${username}@example.com`,
        password: '$2b$10$hashedPasswordHere', // In real usage, hash the password
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`,
        createdAt: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000), // Random date within last year
        stats: {
          totalQuizzes: Math.floor(Math.random() * 20),
          totalPlays: Math.floor(Math.random() * 500),
          averageScore: Math.floor(Math.random() * 40) + 60, // 60-100
          bestScore: Math.floor(Math.random() * 40) + 60,
        },
      });
    }

    return users;
  },

  // Generate sample quiz categories
  generateCategories: () => [
    'Programming',
    'Science',
    'History',
    'Geography',
    'Literature',
    'Mathematics',
    'Art',
    'Music',
    'Sports',
    'General Knowledge',
  ],

  // Generate sample quizzes
  generateQuizzes: (userIds, categories, count = 50) => {
    const quizzes = [];
    const difficulties = ['EASY', 'MEDIUM', 'HARD'];
    const statuses = ['DRAFT', 'PUBLISHED', 'ARCHIVED'];

    const quizTitles = [
      'JavaScript Fundamentals',
      'World Capitals Quiz',
      'Periodic Table Challenge',
      'Ancient Civilizations',
      'Shakespeare Trivia',
      'Algebra Basics',
      'Art History Masters',
      'Music Theory Essentials',
      'Olympic Games History',
      'General Knowledge Test',
    ];

    for (let i = 0; i < count; i++) {
      const creatorId = userIds[Math.floor(Math.random() * userIds.length)];
      const category = categories[Math.floor(Math.random() * categories.length)];
      const difficulty = difficulties[Math.floor(Math.random() * difficulties.length)];
      const status = statuses[Math.floor(Math.random() * statuses.length)];

      quizzes.push({
        title: `${quizTitles[i % quizTitles.length]} ${Math.floor(i / quizTitles.length) + 1}`,
        description: `Test your knowledge of ${category.toLowerCase()} with this ${difficulty.toLowerCase()} quiz.`,
        category,
        difficulty,
        status,
        creatorId,
        questions: generateQuestions(difficulty, Math.floor(Math.random() * 10) + 5), // 5-15 questions
        settings: {
          timeLimit: Math.floor(Math.random() * 1800) + 300, // 5-35 minutes
          shuffleQuestions: Math.random() > 0.5,
          shuffleOptions: Math.random() > 0.5,
          showResults: Math.random() > 0.3,
          allowRetake: Math.random() > 0.2,
        },
        stats: {
          totalPlays: Math.floor(Math.random() * 1000),
          averageScore: Math.floor(Math.random() * 40) + 60,
          averageTime: Math.floor(Math.random() * 1800) + 300,
          completionRate: Math.random() * 0.4 + 0.6, // 60-100%
        },
        createdAt: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(),
      });
    }

    return quizzes;
  },

  // Generate sample questions
  generateQuestions: (difficulty, count) => {
    const questions = [];
    const questionTemplates = {
      EASY: [
        { q: 'What is 2 + 2?', options: ['3', '4', '5', '6'], correct: 1 },
        { q: 'What color is the sky on a clear day?', options: ['Red', 'Blue', 'Green', 'Yellow'], correct: 1 },
        { q: 'How many continents are there?', options: ['5', '6', '7', '8'], correct: 2 },
      ],
      MEDIUM: [
        { q: 'What is the capital of France?', options: ['London', 'Berlin', 'Paris', 'Madrid'], correct: 2 },
        { q: 'What is the chemical symbol for water?', options: ['H2O', 'CO2', 'O2', 'N2'], correct: 0 },
        { q: 'Who wrote "Romeo and Juliet"?', options: ['Charles Dickens', 'William Shakespeare', 'Jane Austen', 'Mark Twain'], correct: 1 },
      ],
      HARD: [
        { q: 'What is the square root of 144?', options: ['10', '12', '14', '16'], correct: 1 },
        { q: 'What is the atomic number of gold?', options: ['77', '78', '79', '80'], correct: 2 },
        { q: 'In what year did World War II end?', options: ['1944', '1945', '1946', '1947'], correct: 1 },
      ],
    };

    const templates = questionTemplates[difficulty];

    for (let i = 0; i < count; i++) {
      const template = templates[Math.floor(Math.random() * templates.length)];
      questions.push({
        question: template.q,
        options: [...template.options],
        correctAnswer: template.correct,
        explanation: `The correct answer is ${template.options[template.correct]}`,
        timeLimit: Math.floor(Math.random() * 60) + 15, // 15-75 seconds
      });
    }

    return questions;
  },
};

// ================================
// Database Connection Template
// ================================

const postgresConnectionTemplate = `
const { Pool } = require('pg');
const logger = require('../monitoring/winston-logger');

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'quiz_app',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD,
  max: 20, // Maximum number of clients in the pool
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Event handlers
pool.on('connect', (client) => {
  logger.info('New client connected to PostgreSQL');
});

pool.on('error', (err, client) => {
  logger.error('Unexpected error on idle client', { error: err.message });
});

// Query helper
const query = async (text, params) => {
  const start = Date.now();
  try {
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    logger.debug('Executed query', {
      text,
      duration,
      rows: res.rowCount,
    });
    return res;
  } catch (error) {
    logger.error('Query failed', {
      text,
      error: error.message,
      duration: Date.now() - start,
    });
    throw error;
  }
};

// Transaction helper
const getClient = async () => {
  const client = await pool.connect();
  const query = client.query;
  const release = client.release;

  // Set a timeout of 5 seconds, after which we will log this client's last query
  const timeout = setTimeout(() => {
    logger.error('A client has been checked out for more than 5 seconds!');
    logger.error(\`The last executed query on this client was: \${client.lastQuery}\`);
  }, 5000);

  // Monkey patch the query method to keep track of the last query executed
  client.query = (...args) => {
    client.lastQuery = args;
    return query.apply(client, args);
  };

  client.release = () => {
    clearTimeout(timeout);
    // Set the methods back to their old un-monkey-patched version
    client.query = query;
    client.release = release;
    return release.apply(client);
  };

  return client;
};

const withTransaction = async (callback) => {
  const client = await getClient();
  try {
    await client.query('BEGIN');
    const result = await callback(client);
    await client.query('COMMIT');
    return result;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

module.exports = {
  query,
  getClient,
  withTransaction,
  pool,
};
`;

const mongoConnectionTemplate = `
const { MongoClient } = require('mongodb');
const logger = require('../monitoring/winston-logger');

let client;
let db;

const connectDB = async () => {
  try {
    const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/quiz_app';

    client = new MongoClient(uri, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });

    await client.connect();
    db = client.db();

    logger.info('Connected to MongoDB');

    // Create indexes
    await createIndexes();

  } catch (error) {
    logger.error('Failed to connect to MongoDB', { error: error.message });
    process.exit(1);
  }
};

const createIndexes = async () => {
  try {
    // User indexes
    await db.collection('users').createIndex({ email: 1 }, { unique: true });
    await db.collection('users').createIndex({ username: 1 }, { unique: true });

    // Quiz indexes
    await db.collection('quizzes').createIndex({ creatorId: 1 });
    await db.collection('quizzes').createIndex({ category: 1 });
    await db.collection('quizzes').createIndex({ difficulty: 1 });
    await db.collection('quizzes').createIndex({ status: 1 });
    await db.collection('quizzes').createIndex({ 'stats.totalPlays': -1 });

    // Session indexes
    await db.collection('sessions').createIndex({ userId: 1 });
    await db.collection('sessions').createIndex({ quizId: 1 });
    await db.collection('sessions').createIndex({ createdAt: 1 });

    logger.info('Database indexes created');
  } catch (error) {
    logger.error('Failed to create indexes', { error: error.message });
  }
};

const getDB = () => {
  if (!db) {
    throw new Error('Database not connected');
  }
  return db;
};

const closeDB = async () => {
  if (client) {
    await client.close();
    logger.info('Disconnected from MongoDB');
  }
};

// Graceful shutdown
process.on('SIGINT', async () => {
  await closeDB();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await closeDB();
  process.exit(0);
});

module.exports = {
  connectDB,
  getDB,
  closeDB,
};
`;

// ================================
// Migration Runner
// ================================

const migrationRunner = {
  // PostgreSQL migration runner
  runPostgresMigrations: async (migrationsDir) => {
    const fs = require('fs').promises;
    const path = require('path');
    const { query } = require('./postgres-connection');

    try {
      // Create migrations table if it doesn't exist
      await query(`
        CREATE TABLE IF NOT EXISTS migrations (
          id SERIAL PRIMARY KEY,
          name VARCHAR(255) NOT NULL UNIQUE,
          executed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Get executed migrations
      const executed = await query('SELECT name FROM migrations ORDER BY id');
      const executedNames = executed.rows.map(row => row.name);

      // Get migration files
      const files = await fs.readdir(migrationsDir);
      const migrationFiles = files
        .filter(file => file.endsWith('.sql'))
        .sort();

      for (const file of migrationFiles) {
        if (!executedNames.includes(file)) {
          console.log(`Running migration: ${file}`);

          const filePath = path.join(migrationsDir, file);
          const sql = await fs.readFile(filePath, 'utf8');

          await query(sql);
          await query('INSERT INTO migrations (name) VALUES ($1)', [file]);

          console.log(`Migration completed: ${file}`);
        }
      }

      console.log('All migrations completed');
    } catch (error) {
      console.error('Migration failed:', error);
      throw error;
    }
  },

  // MongoDB migration runner
  runMongoMigrations: async (migrationsDir) => {
    const fs = require('fs').promises;
    const path = require('path');
    const { getDB } = require('./mongo-connection');

    try {
      const db = getDB();

      // Create migrations collection if it doesn't exist
      await db.createCollection('migrations');

      // Get executed migrations
      const executed = await db.collection('migrations').find({}).toArray();
      const executedNames = executed.map(m => m.name);

      // Get migration files
      const files = await fs.readdir(migrationsDir);
      const migrationFiles = files
        .filter(file => file.endsWith('.js'))
        .sort();

      for (const file of migrationFiles) {
        if (!executedNames.includes(file)) {
          console.log(`Running migration: ${file}`);

          const filePath = path.join(migrationsDir, file);
          const migration = require(filePath);

          await migration.up(db);

          await db.collection('migrations').insertOne({
            name: file,
            executedAt: new Date(),
          });

          console.log(`Migration completed: ${file}`);
        }
      }

      console.log('All migrations completed');
    } catch (error) {
      console.error('Migration failed:', error);
      throw error;
    }
  },
};

// ================================
// Export Templates
// ================================

module.exports = {
  postgresMigrationTemplate,
  mongoMigrationTemplate,
  seedDataGenerator,
  postgresConnectionTemplate,
  mongoConnectionTemplate,
  migrationRunner,
};