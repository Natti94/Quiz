/**
 * REST API Template with Express
 *
 * This template provides a complete REST API structure with proper error handling,
 * validation, authentication, pagination, and comprehensive documentation.
 */

const express = require('express');
const router = express.Router();
const { body, param, query, validationResult } = require('express-validator');
const rateLimit = require('express-rate-limit');
const logger = require('../monitoring/winston-logger');

// Import services (these would be your actual service classes)
const QuizService = require('../services/QuizService');
const UserService = require('../services/UserService');
const authMiddleware = require('../middleware/auth');
const validationMiddleware = require('../middleware/validation');

// Rate limiting
const createLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // limit each IP to 10 requests per windowMs
  message: 'Too many quiz creation requests, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
});

// ================================
// Quiz Routes
// ================================

/**
 * @swagger
 * /api/quizzes:
 *   get:
 *     summary: Get list of quizzes
 *     tags: [Quizzes]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *         description: Number of items per page
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search term
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Quiz category filter
 *     responses:
 *       200:
 *         description: List of quizzes
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Quiz'
 *                 pagination:
 *                   $ref: '#/components/schemas/Pagination'
 */
router.get('/quizzes',
  generalLimiter,
  [
    query('page').optional().isInt({ min: 1 }).toInt(),
    query('limit').optional().isInt({ min: 1, max: 100 }).toInt(),
    query('search').optional().isString().trim(),
    query('category').optional().isString().trim(),
  ],
  validationMiddleware,
  async (req, res) => {
    try {
      const { page = 1, limit = 20, search, category } = req.query;

      const result = await QuizService.getQuizzes({
        page,
        limit,
        search,
        category,
        userId: req.user?.id, // For personalized results
      });

      logger.info('Quizzes fetched', {
        userId: req.user?.id,
        count: result.data.length,
        page,
        limit,
      });

      res.json({
        success: true,
        data: result.data,
        pagination: result.pagination,
      });
    } catch (error) {
      logger.error('Failed to fetch quizzes', { error: error.message, userId: req.user?.id });
      res.status(500).json({
        success: false,
        error: 'Internal server error',
      });
    }
  }
);

/**
 * @swagger
 * /api/quizzes/{id}:
 *   get:
 *     summary: Get quiz by ID
 *     tags: [Quizzes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Quiz ID
 *     responses:
 *       200:
 *         description: Quiz details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Quiz'
 *       404:
 *         description: Quiz not found
 */
router.get('/quizzes/:id',
  generalLimiter,
  [
    param('id').isUUID().withMessage('Invalid quiz ID format'),
  ],
  validationMiddleware,
  async (req, res) => {
    try {
      const { id } = req.params;
      const quiz = await QuizService.getQuizById(id, req.user?.id);

      if (!quiz) {
        return res.status(404).json({
          success: false,
          error: 'Quiz not found',
        });
      }

      // Check if user can access this quiz
      if (!quiz.isPublished && quiz.creatorId !== req.user?.id) {
        return res.status(403).json({
          success: false,
          error: 'Access denied',
        });
      }

      logger.info('Quiz fetched', { quizId: id, userId: req.user?.id });

      res.json({
        success: true,
        data: quiz,
      });
    } catch (error) {
      logger.error('Failed to fetch quiz', {
        error: error.message,
        quizId: req.params.id,
        userId: req.user?.id
      });
      res.status(500).json({
        success: false,
        error: 'Internal server error',
      });
    }
  }
);

/**
 * @swagger
 * /api/quizzes:
 *   post:
 *     summary: Create new quiz
 *     tags: [Quizzes]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - questions
 *             properties:
 *               title:
 *                 type: string
 *                 minLength: 1
 *                 maxLength: 200
 *               description:
 *                 type: string
 *                 maxLength: 1000
 *               category:
 *                 type: string
 *               questions:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/Question'
 *               settings:
 *                 $ref: '#/components/schemas/QuizSettings'
 *     responses:
 *       201:
 *         description: Quiz created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Quiz'
 */
router.post('/quizzes',
  authMiddleware,
  createLimiter,
  [
    body('title')
      .trim()
      .isLength({ min: 1, max: 200 })
      .withMessage('Title must be 1-200 characters'),
    body('description')
      .optional()
      .trim()
      .isLength({ max: 1000 })
      .withMessage('Description must be max 1000 characters'),
    body('category')
      .optional()
      .trim()
      .isLength({ max: 50 }),
    body('questions')
      .isArray({ min: 1 })
      .withMessage('At least one question is required'),
    body('questions.*.question')
      .trim()
      .isLength({ min: 1, max: 500 }),
    body('questions.*.options')
      .isArray({ min: 2, max: 6 })
      .withMessage('Each question must have 2-6 options'),
    body('questions.*.correctAnswer')
      .isInt({ min: 0 })
      .custom((value, { req, path }) => {
        const questionIndex = path.split('.')[1];
        const options = req.body.questions[questionIndex].options;
        if (value >= options.length) {
          throw new Error('Correct answer index out of range');
        }
        return true;
      }),
  ],
  validationMiddleware,
  async (req, res) => {
    try {
      const quizData = {
        ...req.body,
        creatorId: req.user.id,
      };

      const quiz = await QuizService.createQuiz(quizData);

      logger.info('Quiz created', {
        quizId: quiz.id,
        creatorId: req.user.id,
        questionCount: quiz.questions.length,
      });

      res.status(201).json({
        success: true,
        data: quiz,
      });
    } catch (error) {
      logger.error('Failed to create quiz', {
        error: error.message,
        userId: req.user.id,
        title: req.body.title,
      });

      if (error.name === 'ValidationError') {
        return res.status(400).json({
          success: false,
          error: 'Validation failed',
          details: error.errors,
        });
      }

      res.status(500).json({
        success: false,
        error: 'Internal server error',
      });
    }
  }
);

/**
 * @swagger
 * /api/quizzes/{id}:
 *   put:
 *     summary: Update quiz
 *     tags: [Quizzes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/QuizUpdate'
 *     responses:
 *       200:
 *         description: Quiz updated successfully
 */
router.put('/quizzes/:id',
  authMiddleware,
  generalLimiter,
  [
    param('id').isUUID(),
    body('title').optional().trim().isLength({ min: 1, max: 200 }),
    body('description').optional().trim().isLength({ max: 1000 }),
  ],
  validationMiddleware,
  async (req, res) => {
    try {
      const { id } = req.params;
      const quiz = await QuizService.getQuizById(id);

      if (!quiz) {
        return res.status(404).json({
          success: false,
          error: 'Quiz not found',
        });
      }

      if (quiz.creatorId !== req.user.id) {
        return res.status(403).json({
          success: false,
          error: 'Access denied',
        });
      }

      const updatedQuiz = await QuizService.updateQuiz(id, req.body);

      logger.info('Quiz updated', { quizId: id, userId: req.user.id });

      res.json({
        success: true,
        data: updatedQuiz,
      });
    } catch (error) {
      logger.error('Failed to update quiz', {
        error: error.message,
        quizId: req.params.id,
        userId: req.user.id,
      });
      res.status(500).json({
        success: false,
        error: 'Internal server error',
      });
    }
  }
);

/**
 * @swagger
 * /api/quizzes/{id}:
 *   delete:
 *     summary: Delete quiz
 *     tags: [Quizzes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Quiz deleted successfully
 */
router.delete('/quizzes/:id',
  authMiddleware,
  generalLimiter,
  [
    param('id').isUUID(),
  ],
  validationMiddleware,
  async (req, res) => {
    try {
      const { id } = req.params;
      const quiz = await QuizService.getQuizById(id);

      if (!quiz) {
        return res.status(404).json({
          success: false,
          error: 'Quiz not found',
        });
      }

      if (quiz.creatorId !== req.user.id) {
        return res.status(403).json({
          success: false,
          error: 'Access denied',
        });
      }

      await QuizService.deleteQuiz(id);

      logger.info('Quiz deleted', { quizId: id, userId: req.user.id });

      res.status(204).send();
    } catch (error) {
      logger.error('Failed to delete quiz', {
        error: error.message,
        quizId: req.params.id,
        userId: req.user.id,
      });
      res.status(500).json({
        success: false,
        error: 'Internal server error',
      });
    }
  }
);

// ================================
// Quiz Taking Routes
// ================================

/**
 * @swagger
 * /api/quizzes/{id}/start:
 *   post:
 *     summary: Start a quiz session
 *     tags: [Quiz Taking]
 *     security:
 *       - bearerAuth: []
 */
router.post('/quizzes/:id/start',
  authMiddleware,
  generalLimiter,
  [
    param('id').isUUID(),
  ],
  validationMiddleware,
  async (req, res) => {
    try {
      const { id } = req.params;
      const session = await QuizService.startQuizSession(id, req.user.id);

      logger.info('Quiz session started', {
        quizId: id,
        userId: req.user.id,
        sessionId: session.id,
      });

      res.json({
        success: true,
        data: session,
      });
    } catch (error) {
      logger.error('Failed to start quiz session', {
        error: error.message,
        quizId: req.params.id,
        userId: req.user.id,
      });
      res.status(500).json({
        success: false,
        error: 'Internal server error',
      });
    }
  }
);

/**
 * @swagger
 * /api/quizzes/{id}/answer:
 *   post:
 *     summary: Submit answer for a question
 *     tags: [Quiz Taking]
 *     security:
 *       - bearerAuth: []
 */
router.post('/quizzes/:id/answer',
  authMiddleware,
  generalLimiter,
  [
    param('id').isUUID(),
    body('sessionId').isUUID(),
    body('questionId').isUUID(),
    body('answer').isInt({ min: 0 }),
  ],
  validationMiddleware,
  async (req, res) => {
    try {
      const { id } = req.params;
      const { sessionId, questionId, answer } = req.body;

      const result = await QuizService.submitAnswer(sessionId, questionId, answer);

      logger.info('Answer submitted', {
        quizId: id,
        sessionId,
        questionId,
        userId: req.user.id,
        correct: result.correct,
      });

      res.json({
        success: true,
        data: result,
      });
    } catch (error) {
      logger.error('Failed to submit answer', {
        error: error.message,
        quizId: req.params.id,
        sessionId: req.body.sessionId,
        userId: req.user.id,
      });
      res.status(500).json({
        success: false,
        error: 'Internal server error',
      });
    }
  }
);

// ================================
// User Routes
// ================================

/**
 * @swagger
 * /api/users/profile:
 *   get:
 *     summary: Get user profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 */
router.get('/users/profile',
  authMiddleware,
  generalLimiter,
  async (req, res) => {
    try {
      const user = await UserService.getUserById(req.user.id);

      res.json({
        success: true,
        data: user,
      });
    } catch (error) {
      logger.error('Failed to get user profile', {
        error: error.message,
        userId: req.user.id,
      });
      res.status(500).json({
        success: false,
        error: 'Internal server error',
      });
    }
  }
);

// ================================
// Error Handling Middleware
// ================================

// 404 handler for API routes
router.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'API endpoint not found',
  });
});

// Global error handler
router.use((error, req, res, next) => {
  logger.error('API Error', {
    error: error.message,
    stack: error.stack,
    url: req.url,
    method: req.method,
    userId: req.user?.id,
    ip: req.ip,
  });

  // Mongoose validation error
  if (error.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      error: 'Validation failed',
      details: Object.values(error.errors).map(err => err.message),
    });
  }

  // JWT errors
  if (error.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      error: 'Invalid token',
    });
  }

  if (error.name === 'TokenExpiredError') {
    return res.status(401).json({
      success: false,
      error: 'Token expired',
    });
  }

  // Default error response
  res.status(500).json({
    success: false,
    error: 'Internal server error',
  });
});

module.exports = router;