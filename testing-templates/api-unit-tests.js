/**
 * Unit Test Template with Jest and Supertest
 *
 * This template provides a comprehensive testing setup for API endpoints,
 * middleware, utilities, and business logic with proper mocking and coverage.
 */

const request = require('supertest');
const { jest } = require('@jest/globals');

// Mock external dependencies
jest.mock('../lib/database');
jest.mock('../lib/cache');
jest.mock('../lib/external-api');

const app = require('../app');
const db = require('../lib/database');
const cache = require('../lib/cache');
const externalApi = require('../lib/external-api');

// Test data factories
const createTestUser = (overrides = {}) => ({
  id: 'user-123',
  email: 'test@example.com',
  name: 'Test User',
  role: 'user',
  createdAt: new Date('2024-01-01'),
  ...overrides,
});

const createTestQuiz = (overrides = {}) => ({
  id: 'quiz-123',
  title: 'Sample Quiz',
  description: 'A test quiz',
  questions: [
    {
      id: 'q1',
      question: 'What is 2+2?',
      options: ['3', '4', '5', '6'],
      correctAnswer: 1,
    },
  ],
  creatorId: 'user-123',
  isPublished: true,
  createdAt: new Date('2024-01-01'),
  ...overrides,
});

describe('Quiz API Endpoints', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/quizzes', () => {
    it('should return list of published quizzes', async () => {
      // Arrange
      const mockQuizzes = [
        createTestQuiz({ id: 'quiz-1', title: 'Quiz 1' }),
        createTestQuiz({ id: 'quiz-2', title: 'Quiz 2' }),
      ];

      db.getPublishedQuizzes.mockResolvedValue(mockQuizzes);

      // Act
      const response = await request(app)
        .get('/api/quizzes')
        .expect(200);

      // Assert
      expect(response.body).toHaveLength(2);
      expect(response.body[0]).toHaveProperty('title', 'Quiz 1');
      expect(db.getPublishedQuizzes).toHaveBeenCalledTimes(1);
    });

    it('should handle database errors gracefully', async () => {
      // Arrange
      db.getPublishedQuizzes.mockRejectedValue(new Error('Database connection failed'));

      // Act & Assert
      await request(app)
        .get('/api/quizzes')
        .expect(500);

      expect(db.getPublishedQuizzes).toHaveBeenCalledTimes(1);
    });

    it('should support pagination', async () => {
      // Arrange
      const mockQuizzes = [createTestQuiz()];
      db.getPublishedQuizzes.mockResolvedValue(mockQuizzes);

      // Act
      const response = await request(app)
        .get('/api/quizzes?page=2&limit=10')
        .expect(200);

      // Assert
      expect(db.getPublishedQuizzes).toHaveBeenCalledWith(
        expect.objectContaining({ page: 2, limit: 10 })
      );
    });
  });

  describe('GET /api/quizzes/:id', () => {
    it('should return quiz details for valid ID', async () => {
      // Arrange
      const mockQuiz = createTestQuiz();
      db.getQuizById.mockResolvedValue(mockQuiz);

      // Act
      const response = await request(app)
        .get('/api/quizzes/quiz-123')
        .expect(200);

      // Assert
      expect(response.body).toHaveProperty('id', 'quiz-123');
      expect(response.body).toHaveProperty('title', 'Sample Quiz');
    });

    it('should return 404 for non-existent quiz', async () => {
      // Arrange
      db.getQuizById.mockResolvedValue(null);

      // Act & Assert
      await request(app)
        .get('/api/quizzes/non-existent')
        .expect(404);
    });

    it('should return 403 for unpublished quiz when user is not creator', async () => {
      // Arrange
      const mockQuiz = createTestQuiz({ isPublished: false, creatorId: 'other-user' });
      db.getQuizById.mockResolvedValue(mockQuiz);

      // Act & Assert
      await request(app)
        .get('/api/quizzes/quiz-123')
        .expect(403);
    });
  });

  describe('POST /api/quizzes', () => {
    it('should create new quiz for authenticated user', async () => {
      // Arrange
      const newQuizData = {
        title: 'New Quiz',
        description: 'A new test quiz',
        questions: [],
      };

      const createdQuiz = createTestQuiz(newQuizData);
      db.createQuiz.mockResolvedValue(createdQuiz);

      // Mock authentication middleware
      const mockUser = createTestUser();
      app.use((req, res, next) => {
        req.user = mockUser;
        next();
      });

      // Act
      const response = await request(app)
        .post('/api/quizzes')
        .send(newQuizData)
        .expect(201);

      // Assert
      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('title', 'New Quiz');
      expect(db.createQuiz).toHaveBeenCalledWith(
        expect.objectContaining({
          ...newQuizData,
          creatorId: mockUser.id,
        })
      );
    });

    it('should validate required fields', async () => {
      // Act & Assert
      await request(app)
        .post('/api/quizzes')
        .send({}) // Missing required fields
        .expect(400);
    });

    it('should return 401 for unauthenticated requests', async () => {
      // Act & Assert
      await request(app)
        .post('/api/quizzes')
        .send({ title: 'Test Quiz' })
        .expect(401);
    });
  });

  describe('PUT /api/quizzes/:id', () => {
    it('should update quiz for creator', async () => {
      // Arrange
      const mockUser = createTestUser();
      const mockQuiz = createTestQuiz({ creatorId: mockUser.id });
      const updateData = { title: 'Updated Title' };

      db.getQuizById.mockResolvedValue(mockQuiz);
      db.updateQuiz.mockResolvedValue({ ...mockQuiz, ...updateData });

      // Act
      const response = await request(app)
        .put('/api/quizzes/quiz-123')
        .set('Authorization', `Bearer ${mockUser.id}`)
        .send(updateData)
        .expect(200);

      // Assert
      expect(response.body).toHaveProperty('title', 'Updated Title');
    });

    it('should return 403 for non-creator attempting update', async () => {
      // Arrange
      const mockQuiz = createTestQuiz({ creatorId: 'other-user' });
      db.getQuizById.mockResolvedValue(mockQuiz);

      // Act & Assert
      await request(app)
        .put('/api/quizzes/quiz-123')
        .send({ title: 'Updated Title' })
        .expect(403);
    });
  });

  describe('DELETE /api/quizzes/:id', () => {
    it('should delete quiz for creator', async () => {
      // Arrange
      const mockUser = createTestUser();
      const mockQuiz = createTestQuiz({ creatorId: mockUser.id });

      db.getQuizById.mockResolvedValue(mockQuiz);
      db.deleteQuiz.mockResolvedValue(true);

      // Act & Assert
      await request(app)
        .delete('/api/quizzes/quiz-123')
        .set('Authorization', `Bearer ${mockUser.id}`)
        .expect(204);

      expect(db.deleteQuiz).toHaveBeenCalledWith('quiz-123');
    });
  });
});

// Utility function tests
describe('Quiz Validation Utilities', () => {
  const { validateQuizData, validateQuestion } = require('../lib/validation');

  describe('validateQuizData', () => {
    it('should pass valid quiz data', () => {
      const validData = {
        title: 'Valid Quiz',
        description: 'A valid quiz description',
        questions: [
          {
            question: 'What is 2+2?',
            options: ['3', '4', '5'],
            correctAnswer: 1,
          },
        ],
      };

      expect(() => validateQuizData(validData)).not.toThrow();
    });

    it('should reject quiz without title', () => {
      const invalidData = {
        description: 'Missing title',
        questions: [],
      };

      expect(() => validateQuizData(invalidData)).toThrow('Title is required');
    });

    it('should reject quiz with invalid question structure', () => {
      const invalidData = {
        title: 'Invalid Quiz',
        questions: [
          {
            question: 'Invalid question',
            options: ['A'], // Too few options
            correctAnswer: 0,
          },
        ],
      };

      expect(() => validateQuizData(invalidData)).toThrow();
    });
  });

  describe('validateQuestion', () => {
    it('should pass valid question', () => {
      const validQuestion = {
        question: 'What is the capital of France?',
        options: ['London', 'Paris', 'Berlin', 'Madrid'],
        correctAnswer: 1,
      };

      expect(() => validateQuestion(validQuestion)).not.toThrow();
    });

    it('should reject question with too few options', () => {
      const invalidQuestion = {
        question: 'Too few options?',
        options: ['Yes'],
        correctAnswer: 0,
      };

      expect(() => validateQuestion(invalidQuestion)).toThrow('At least 2 options required');
    });

    it('should reject question with invalid correct answer index', () => {
      const invalidQuestion = {
        question: 'Invalid answer index?',
        options: ['A', 'B', 'C'],
        correctAnswer: 5, // Out of bounds
      };

      expect(() => validateQuestion(invalidQuestion)).toThrow('Invalid correct answer index');
    });
  });
});

// Integration-style tests
describe('Quiz Taking Flow', () => {
  it('should allow complete quiz taking workflow', async () => {
    // Arrange
    const mockUser = createTestUser();
    const mockQuiz = createTestQuiz();

    db.getQuizById.mockResolvedValue(mockQuiz);
    cache.get.mockResolvedValue(null); // No cached result
    cache.set.mockResolvedValue(true);

    // Act: Start quiz
    const startResponse = await request(app)
      .post('/api/quizzes/quiz-123/start')
      .set('Authorization', `Bearer ${mockUser.id}`)
      .expect(200);

    expect(startResponse.body).toHaveProperty('sessionId');

    const sessionId = startResponse.body.sessionId;

    // Act: Submit answer
    const answerResponse = await request(app)
      .post(`/api/quizzes/quiz-123/answer`)
      .set('Authorization', `Bearer ${mockUser.id}`)
      .send({
        sessionId,
        questionId: 'q1',
        answer: 1, // Correct answer
      })
      .expect(200);

    expect(answerResponse.body).toHaveProperty('correct', true);

    // Act: Complete quiz
    const completeResponse = await request(app)
      .post(`/api/quizzes/quiz-123/complete`)
      .set('Authorization', `Bearer ${mockUser.id}`)
      .send({ sessionId })
      .expect(200);

    expect(completeResponse.body).toHaveProperty('score');
    expect(completeResponse.body).toHaveProperty('completedAt');
  });
});

// Performance tests
describe('Performance Tests', () => {
  it('should handle multiple concurrent requests', async () => {
    // Arrange
    const mockQuizzes = Array(100).fill().map((_, i) =>
      createTestQuiz({ id: `quiz-${i}`, title: `Quiz ${i}` })
    );

    db.getPublishedQuizzes.mockResolvedValue(mockQuizzes);

    // Act: Make multiple concurrent requests
    const promises = Array(50).fill().map(() =>
      request(app).get('/api/quizzes').expect(200)
    );

    const startTime = Date.now();
    const responses = await Promise.all(promises);
    const duration = Date.now() - startTime;

    // Assert
    expect(duration).toBeLessThan(5000); // Should complete within 5 seconds
    responses.forEach(response => {
      expect(response.body).toHaveLength(100);
    });
  });
});