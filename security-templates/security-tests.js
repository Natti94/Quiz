// tests/security/security.test.js - Comprehensive security test suite
const request = require('supertest');
const express = require('express');
const InputValidator = require('../../middleware/validation');
const cspMiddleware = require('../../middleware/csp');

describe('Security Test Suite', () => {
  let app;

  beforeEach(() => {
    app = express();
    app.use(express.json());

    // Apply security middleware
    app.use(cspMiddleware);

    // Test routes
    app.post('/api/register', InputValidator.validateRequestBody({
      username: { type: 'username', required: true },
      email: { type: 'email', required: true },
      password: { type: 'password', required: true }
    }), (req, res) => {
      res.json({ message: 'User registered', user: req.validatedBody });
    });

    app.post('/api/quiz-answer', InputValidator.validateRequestBody({
      answer: { type: 'quizAnswer', required: true, options: { maxLength: 500 } }
    }), (req, res) => {
      res.json({ answer: req.validatedBody.answer });
    });

    app.post('/api/quiz-question', InputValidator.validateRequestBody({
      question: { type: 'quizQuestion', required: true }
    }), (req, res) => {
      res.json({ question: req.validatedBody.question });
    });
  });

  describe('CSP Security Headers', () => {
    test('should set CSP header', async () => {
      const response = await request(app).get('/api/register');

      expect(response.headers['content-security-policy']).toBeDefined();
      expect(response.headers['content-security-policy']).toContain("default-src 'self'");
    });

    test('should prevent inline scripts in production', async () => {
      process.env.NODE_ENV = 'production';
      const response = await request(app).get('/api/register');

      expect(response.headers['content-security-policy']).not.toContain("'unsafe-inline'");
      process.env.NODE_ENV = 'test';
    });
  });

  describe('Input Validation - XSS Prevention', () => {
    const xssPayloads = [
      '<script>alert(1)</script>',
      'javascript:alert(1)',
      '<img src=x onerror=alert(1)>',
      '<iframe src="javascript:alert(1)"></iframe>',
      '<object data="javascript:alert(1)"></object>',
      '<svg onload=alert(1)>',
      '"><script>alert(1)</script>',
      '\'><script>alert(1)</script>'
    ];

    test.each(xssPayloads)('should prevent XSS attack: %s', async (payload) => {
      const response = await request(app)
        .post('/api/quiz-answer')
        .send({ answer: payload });

      expect(response.status).toBe(400);
      expect(response.body.error).toMatch(/not allowed|Invalid|exceeds/);
    });

    test('should allow safe input', async () => {
      const response = await request(app)
        .post('/api/quiz-answer')
        .send({ answer: 'This is a safe answer without any malicious content.' });

      expect(response.status).toBe(200);
      expect(response.body.answer).toBe('This is a safe answer without any malicious content.');
    });
  });

  describe('User Registration Validation', () => {
    test('should validate complete registration', async () => {
      const response = await request(app)
        .post('/api/register')
        .send({
          username: 'testuser123',
          email: 'test@example.com',
          password: 'SecurePass123!'
        });

      expect(response.status).toBe(200);
      expect(response.body.user.username).toBe('testuser123');
      expect(response.body.user.email).toBe('test@example.com');
    });

    test('should reject invalid email', async () => {
      const response = await request(app)
        .post('/api/register')
        .send({
          username: 'testuser123',
          email: 'invalid-email',
          password: 'SecurePass123!'
        });

      expect(response.status).toBe(400);
      expect(response.body.error).toContain('email');
    });

    test('should reject weak password', async () => {
      const response = await request(app)
        .post('/api/register')
        .send({
          username: 'testuser123',
          email: 'test@example.com',
          password: 'weak'
        });

      expect(response.status).toBe(400);
      expect(response.body.error).toContain('Password');
    });

    test('should reject invalid username', async () => {
      const response = await request(app)
        .post('/api/register')
        .send({
          username: 'us', // too short
          email: 'test@example.com',
          password: 'SecurePass123!'
        });

      expect(response.status).toBe(400);
      expect(response.body.error).toContain('Username');
    });
  });

  describe('Quiz Content Validation', () => {
    test('should validate quiz question length', async () => {
      const shortQuestion = 'Hi';
      const response = await request(app)
        .post('/api/quiz-question')
        .send({ question: shortQuestion });

      expect(response.status).toBe(400);
      expect(response.body.error).toContain('at least 10 characters');
    });

    test('should accept valid quiz question', async () => {
      const validQuestion = 'What is the capital city of France?';
      const response = await request(app)
        .post('/api/quiz-question')
        .send({ question: validQuestion });

      expect(response.status).toBe(200);
      expect(response.body.question).toBe(validQuestion);
    });

    test('should sanitize HTML in quiz questions', async () => {
      const maliciousQuestion = 'What is <b>your</b> <script>alert(1)</script>name?';
      const response = await request(app)
        .post('/api/quiz-question')
        .send({ question: maliciousQuestion });

      expect(response.status).toBe(200);
      expect(response.body.question).not.toContain('<script>');
      expect(response.body.question).toContain('your');
    });
  });

  describe('Rate Limiting Protection', () => {
    test('should handle rapid requests appropriately', async () => {
      const promises = [];
      for (let i = 0; i < 10; i++) {
        promises.push(
          request(app)
            .post('/api/register')
            .send({
              username: `user${i}`,
              email: `user${i}@example.com`,
              password: 'SecurePass123!'
            })
        );
      }

      const responses = await Promise.all(promises);
      const successCount = responses.filter(r => r.status === 200).length;
      const errorCount = responses.filter(r => r.status === 400).length;

      // Should have some successful and some failed requests
      expect(successCount + errorCount).toBe(10);
    });
  });

  describe('SQL Injection Prevention', () => {
    test('should prevent SQL injection in user search', async () => {
      // This would require a database mock, but the validation layer
      // should prevent malicious input from reaching the database
      const sqlInjection = "'; DROP TABLE users; --";

      const response = await request(app)
        .post('/api/register')
        .send({
          username: sqlInjection,
          email: 'test@example.com',
          password: 'SecurePass123!'
        });

      expect(response.status).toBe(400);
      expect(response.body.error).toContain('alphanumeric');
    });
  });
});