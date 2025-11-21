/**
 * API Documentation Template
 *
 * This template provides comprehensive API documentation with OpenAPI/Swagger
 * specifications, interactive documentation, and usage examples.
 */

const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const path = require('path');

// ================================
// OpenAPI/Swagger Configuration
// ================================

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Quiz API',
      version: '1.0.0',
      description: `
        A comprehensive quiz application API that provides endpoints for creating,
        managing, and taking quizzes with real-time features and collaborative editing.

        ## Features
        - User authentication and authorization
        - Quiz creation and management
        - Real-time quiz sessions
        - Collaborative quiz editing
        - Leaderboards and statistics
        - Social features and notifications

        ## Authentication
        All protected endpoints require a Bearer token in the Authorization header:
        \`Authorization: Bearer <your-jwt-token>\`

        ## Rate Limiting
        API endpoints are rate limited to prevent abuse. Check the response headers
        for rate limit information.

        ## Error Handling
        The API uses standard HTTP status codes and returns error details in JSON format.
      `,
      contact: {
        name: 'API Support',
        email: 'support@quizapp.com',
        url: 'https://quizapp.com/support',
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT',
      },
    },
    servers: [
      {
        url: 'http://localhost:3001/api/v1',
        description: 'Development server',
      },
      {
        url: 'https://api.quizapp.com/v1',
        description: 'Production server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        Error: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false,
            },
            error: {
              type: 'string',
              example: 'Error message',
            },
            details: {
              type: 'object',
              description: 'Additional error details',
            },
          },
        },
        Pagination: {
          type: 'object',
          properties: {
            page: {
              type: 'integer',
              example: 1,
            },
            limit: {
              type: 'integer',
              example: 20,
            },
            total: {
              type: 'integer',
              example: 150,
            },
            totalPages: {
              type: 'integer',
              example: 8,
            },
          },
        },
        User: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
              example: '123e4567-e89b-12d3-a456-426614174000',
            },
            username: {
              type: 'string',
              example: 'quizmaster',
            },
            email: {
              type: 'string',
              format: 'email',
              example: 'user@example.com',
            },
            avatar: {
              type: 'string',
              format: 'uri',
              example: 'https://example.com/avatar.jpg',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              example: '2023-01-01T00:00:00.000Z',
            },
            stats: {
              $ref: '#/components/schemas/UserStats',
            },
          },
        },
        UserStats: {
          type: 'object',
          properties: {
            totalQuizzes: {
              type: 'integer',
              example: 15,
            },
            totalPlays: {
              type: 'integer',
              example: 234,
            },
            averageScore: {
              type: 'number',
              format: 'float',
              example: 85.5,
            },
            bestScore: {
              type: 'integer',
              example: 100,
            },
          },
        },
        Quiz: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
            },
            title: {
              type: 'string',
              example: 'JavaScript Fundamentals',
            },
            description: {
              type: 'string',
              example: 'Test your knowledge of JavaScript basics',
            },
            category: {
              type: 'string',
              example: 'Programming',
            },
            difficulty: {
              type: 'string',
              enum: ['EASY', 'MEDIUM', 'HARD'],
              example: 'MEDIUM',
            },
            status: {
              type: 'string',
              enum: ['DRAFT', 'PUBLISHED', 'ARCHIVED'],
              example: 'PUBLISHED',
            },
            creator: {
              $ref: '#/components/schemas/User',
            },
            questions: {
              type: 'array',
              items: {
                $ref: '#/components/schemas/Question',
              },
            },
            settings: {
              $ref: '#/components/schemas/QuizSettings',
            },
            stats: {
              $ref: '#/components/schemas/QuizStats',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
        Question: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
            },
            question: {
              type: 'string',
              example: 'What is the output of console.log(typeof null)?',
            },
            options: {
              type: 'array',
              items: {
                type: 'string',
              },
              example: ['"null"', '"object"', '"undefined"', '"boolean"'],
            },
            correctAnswer: {
              type: 'integer',
              example: 1,
            },
            explanation: {
              type: 'string',
              example: 'In JavaScript, null is a primitive value but typeof returns "object" for historical reasons.',
            },
            timeLimit: {
              type: 'integer',
              example: 30,
            },
          },
        },
        QuizSettings: {
          type: 'object',
          properties: {
            timeLimit: {
              type: 'integer',
              example: 1800,
              description: 'Total quiz time limit in seconds',
            },
            shuffleQuestions: {
              type: 'boolean',
              example: true,
            },
            shuffleOptions: {
              type: 'boolean',
              example: false,
            },
            showResults: {
              type: 'boolean',
              example: true,
            },
            allowRetake: {
              type: 'boolean',
              example: true,
            },
          },
        },
        QuizStats: {
          type: 'object',
          properties: {
            totalPlays: {
              type: 'integer',
              example: 1250,
            },
            averageScore: {
              type: 'number',
              format: 'float',
              example: 78.5,
            },
            averageTime: {
              type: 'integer',
              example: 450,
            },
            completionRate: {
              type: 'number',
              format: 'float',
              example: 0.85,
            },
          },
        },
        QuizSession: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
            },
            quiz: {
              $ref: '#/components/schemas/Quiz',
            },
            user: {
              $ref: '#/components/schemas/User',
            },
            score: {
              type: 'integer',
              example: 85,
            },
            timeSpent: {
              type: 'integer',
              example: 420,
            },
            completedAt: {
              type: 'string',
              format: 'date-time',
            },
            startedAt: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
        CreateQuizRequest: {
          type: 'object',
          required: ['title', 'questions'],
          properties: {
            title: {
              type: 'string',
              minLength: 1,
              maxLength: 200,
              example: 'React Hooks Quiz',
            },
            description: {
              type: 'string',
              maxLength: 1000,
              example: 'Test your understanding of React Hooks',
            },
            category: {
              type: 'string',
              example: 'React',
            },
            difficulty: {
              type: 'string',
              enum: ['EASY', 'MEDIUM', 'HARD'],
              example: 'MEDIUM',
            },
            questions: {
              type: 'array',
              minItems: 1,
              items: {
                $ref: '#/components/schemas/CreateQuestionRequest',
              },
            },
            settings: {
              $ref: '#/components/schemas/QuizSettings',
            },
          },
        },
        CreateQuestionRequest: {
          type: 'object',
          required: ['question', 'options', 'correctAnswer'],
          properties: {
            question: {
              type: 'string',
              minLength: 1,
              maxLength: 500,
              example: 'What does useState return?',
            },
            options: {
              type: 'array',
              minItems: 2,
              maxItems: 6,
              items: {
                type: 'string',
              },
              example: ['A state value', 'A setter function', 'An array with both', 'A promise'],
            },
            correctAnswer: {
              type: 'integer',
              minimum: 0,
              example: 2,
            },
            explanation: {
              type: 'string',
              example: 'useState returns an array containing the current state value and a setter function.',
            },
            timeLimit: {
              type: 'integer',
              minimum: 5,
              example: 30,
            },
          },
        },
        UpdateQuizRequest: {
          type: 'object',
          properties: {
            title: {
              type: 'string',
              minLength: 1,
              maxLength: 200,
            },
            description: {
              type: 'string',
              maxLength: 1000,
            },
            category: {
              type: 'string',
            },
            difficulty: {
              type: 'string',
              enum: ['EASY', 'MEDIUM', 'HARD'],
            },
            status: {
              type: 'string',
              enum: ['DRAFT', 'PUBLISHED', 'ARCHIVED'],
            },
            settings: {
              $ref: '#/components/schemas/QuizSettings',
            },
          },
        },
      },
      responses: {
        UnauthorizedError: {
          description: 'Authentication information is missing or invalid',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error',
              },
              example: {
                success: false,
                error: 'Invalid token',
              },
            },
          },
        },
        ForbiddenError: {
          description: 'Access to the requested resource is forbidden',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error',
              },
              example: {
                success: false,
                error: 'Access denied',
              },
            },
          },
        },
        NotFoundError: {
          description: 'The requested resource was not found',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error',
              },
              example: {
                success: false,
                error: 'Quiz not found',
              },
            },
          },
        },
        ValidationError: {
          description: 'The request data failed validation',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error',
              },
              example: {
                success: false,
                error: 'Validation failed',
                details: {
                  title: 'Title must be between 1 and 200 characters',
                  questions: 'At least one question is required',
                },
              },
            },
          },
        },
        RateLimitError: {
          description: 'Too many requests',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error',
              },
              example: {
                success: false,
                error: 'Too many requests, please try again later',
              },
            },
          },
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: [
    path.join(__dirname, '../routes/*.js'),
    path.join(__dirname, '../controllers/*.js'),
    path.join(__dirname, 'api-documentation.js'),
  ],
};

// ================================
// API Documentation Setup
// ================================

const specs = swaggerJsdoc(swaggerOptions);

// Custom CSS for better documentation appearance
const customCss = `
  .swagger-ui .topbar { display: none }
  .swagger-ui .info .title { color: #3b4151 }
  .swagger-ui .scheme-container { background: #fafafa }
`;

// Custom JS for enhanced functionality
const customJs = `
  window.onload = function() {
    // Add copy-to-clipboard functionality for code examples
    const codeBlocks = document.querySelectorAll('pre code');
    codeBlocks.forEach(block => {
      const button = document.createElement('button');
      button.innerHTML = '📋';
      button.className = 'copy-button';
      button.onclick = function() {
        navigator.clipboard.writeText(block.textContent);
        button.innerHTML = '✅';
        setTimeout(() => button.innerHTML = '📋', 2000);
      };
      block.parentNode.insertBefore(button, block);
    });
  };
`;

// ================================
// Documentation Middleware
// ================================

const setupApiDocumentation = (app) => {
  // Swagger UI
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, {
    explorer: true,
    customCss,
    customJs,
    swaggerOptions: {
      persistAuthorization: true,
      displayRequestDuration: true,
      docExpansion: 'list',
      filter: true,
      showExtensions: true,
      showCommonExtensions: true,
    },
  }));

  // JSON API specs
  app.get('/api-docs.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(specs);
  });

  // Health check endpoint for API docs
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version || '1.0.0',
      environment: process.env.NODE_ENV || 'development',
    });
  });

  console.log('📚 API Documentation available at /api-docs');
  console.log('📄 OpenAPI JSON available at /api-docs.json');
};

// ================================
// Additional Documentation Routes
// ================================

/**
 * @swagger
 * /api/health:
 *   get:
 *     summary: API Health Check
 *     tags: [System]
 *     responses:
 *       200:
 *         description: API is healthy
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: ok
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                 version:
 *                   type: string
 *                   example: 1.0.0
 *                 environment:
 *                   type: string
 *                   example: production
 */
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version || '1.0.0',
    environment: process.env.NODE_ENV || 'development',
  });
});

/**
 * @swagger
 * /api/stats:
 *   get:
 *     summary: API Statistics
 *     tags: [System]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: API usage statistics
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalUsers:
 *                   type: integer
 *                   example: 1250
 *                 totalQuizzes:
 *                   type: integer
 *                   example: 340
 *                 totalSessions:
 *                   type: integer
 *                   example: 5670
 *                 uptime:
 *                   type: string
 *                   example: 15 days, 8 hours
 */
app.get('/api/stats', authMiddleware, async (req, res) => {
  try {
    const stats = await SystemService.getApiStats();
    res.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    logger.error('Failed to get API stats', { error: error.message });
    res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
});

// ================================
// Documentation Generation Helpers
// ================================

const generateEndpointDocs = (method, path, options) => {
  return `
/**
 * @swagger
 * ${path}:
 *   ${method.toLowerCase()}:
 *     summary: ${options.summary}
 *     tags: ${JSON.stringify(options.tags || ['Default'])}
 *     ${options.description ? `description: ${options.description}` : ''}
 *     ${options.parameters ? `parameters: ${JSON.stringify(options.parameters, null, 2)}` : ''}
 *     ${options.requestBody ? `requestBody: ${JSON.stringify(options.requestBody, null, 2)}` : ''}
 *     responses: ${JSON.stringify(options.responses, null, 2)}
 *     ${options.security ? `security: ${JSON.stringify(options.security, null, 2)}` : ''}
 */
`;
};

const generateModelDocs = (modelName, schema) => {
  return `
/**
 * @swagger
 * components:
 *   schemas:
 *     ${modelName}:
 *       type: object
 *       ${schema.required ? `required: ${JSON.stringify(schema.required)}` : ''}
 *       properties: ${JSON.stringify(schema.properties, null, 2)}
 */
`;
};

// ================================
// Export
// ================================

module.exports = {
  setupApiDocumentation,
  generateEndpointDocs,
  generateModelDocs,
  swaggerOptions,
  specs,
};