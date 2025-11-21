/**
 * GraphQL API Template with Apollo Server
 *
 * This template provides a complete GraphQL API with proper schema design,
 * resolvers, authentication, validation, and comprehensive documentation.
 */

const { ApolloServer, gql, AuthenticationError, ForbiddenError } = require('apollo-server-express');
const { makeExecutableSchema } = require('@graphql-tools/schema');
const { applyMiddleware } = require('graphql-middleware');
const { shield, rule } = require('graphql-shield');
const rateLimit = require('graphql-rate-limit');
const logger = require('../monitoring/winston-logger');

// Import services
const QuizService = require('../services/QuizService');
const UserService = require('../services/UserService');
const authMiddleware = require('../middleware/auth');

// ================================
// GraphQL Schema Definition
// ================================

const typeDefs = gql`
  # Enums
  enum Difficulty {
    EASY
    MEDIUM
    HARD
  }

  enum QuizStatus {
    DRAFT
    PUBLISHED
    ARCHIVED
  }

  # Types
  type User {
    id: ID!
    username: String!
    email: String!
    avatar: String
    createdAt: DateTime!
    updatedAt: DateTime!
    stats: UserStats!
  }

  type UserStats {
    totalQuizzes: Int!
    totalPlays: Int!
    averageScore: Float!
    bestScore: Int!
  }

  type Quiz {
    id: ID!
    title: String!
    description: String
    category: String
    difficulty: Difficulty!
    status: QuizStatus!
    creator: User!
    questions: [Question!]!
    settings: QuizSettings!
    stats: QuizStats!
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  type QuizStats {
    totalPlays: Int!
    averageScore: Float!
    averageTime: Int!
    completionRate: Float!
  }

  type Question {
    id: ID!
    question: String!
    options: [String!]!
    correctAnswer: Int!
    explanation: String
    timeLimit: Int
  }

  type QuizSettings {
    timeLimit: Int
    shuffleQuestions: Boolean!
    shuffleOptions: Boolean!
    showResults: Boolean!
    allowRetake: Boolean!
  }

  type QuizSession {
    id: ID!
    quiz: Quiz!
    user: User!
    answers: [Answer!]!
    score: Int!
    timeSpent: Int!
    completedAt: DateTime
    startedAt: DateTime!
  }

  type Answer {
    questionId: ID!
    answer: Int!
    correct: Boolean!
    timeSpent: Int!
  }

  type PaginatedQuizzes {
    data: [Quiz!]!
    pagination: Pagination!
  }

  type Pagination {
    page: Int!
    limit: Int!
    total: Int!
    totalPages: Int!
  }

  # Inputs
  input CreateQuizInput {
    title: String!
    description: String
    category: String
    difficulty: Difficulty!
    questions: [CreateQuestionInput!]!
    settings: QuizSettingsInput
  }

  input CreateQuestionInput {
    question: String!
    options: [String!]!
    correctAnswer: Int!
    explanation: String
    timeLimit: Int
  }

  input QuizSettingsInput {
    timeLimit: Int
    shuffleQuestions: Boolean
    shuffleOptions: Boolean
    showResults: Boolean
    allowRetake: Boolean
  }

  input UpdateQuizInput {
    title: String
    description: String
    category: String
    difficulty: Difficulty
    status: QuizStatus
    settings: QuizSettingsInput
  }

  input SubmitAnswerInput {
    sessionId: ID!
    questionId: ID!
    answer: Int!
  }

  input QuizFilters {
    search: String
    category: String
    difficulty: Difficulty
    creatorId: ID
    status: QuizStatus
  }

  # Scalars
  scalar DateTime

  # Queries
  type Query {
    # Quiz queries
    quiz(id: ID!): Quiz
    quizzes(
      page: Int = 1
      limit: Int = 20
      filters: QuizFilters
    ): PaginatedQuizzes!

    # User queries
    me: User!
    user(id: ID!): User
    users(page: Int = 1, limit: Int = 20): PaginatedUsers!

    # Quiz session queries
    quizSession(id: ID!): QuizSession
    myQuizSessions(page: Int = 1, limit: Int = 20): PaginatedQuizSessions!
  }

  type PaginatedUsers {
    data: [User!]!
    pagination: Pagination!
  }

  type PaginatedQuizSessions {
    data: [QuizSession!]!
    pagination: Pagination!
  }

  # Mutations
  type Mutation {
    # Quiz mutations
    createQuiz(input: CreateQuizInput!): Quiz!
    updateQuiz(id: ID!, input: UpdateQuizInput!): Quiz!
    deleteQuiz(id: ID!): Boolean!

    # Quiz session mutations
    startQuiz(quizId: ID!): QuizSession!
    submitAnswer(input: SubmitAnswerInput!): AnswerResult!
    finishQuiz(sessionId: ID!): QuizResult!

    # User mutations
    updateProfile(input: UpdateProfileInput!): User!
  }

  type AnswerResult {
    correct: Boolean!
    explanation: String
    nextQuestion: Question
    progress: QuizProgress!
  }

  type QuizProgress {
    currentQuestion: Int!
    totalQuestions: Int!
    timeRemaining: Int
    score: Int!
  }

  type QuizResult {
    session: QuizSession!
    score: Int!
    percentage: Float!
    timeSpent: Int!
    rank: Int
    achievements: [String!]
  }

  input UpdateProfileInput {
    username: String
    email: String
    avatar: String
  }
`;

// ================================
// Authentication Rules
// ================================

const isAuthenticated = rule({ cache: 'contextual' })(
  async (parent, args, ctx, info) => {
    if (!ctx.user) {
      return new AuthenticationError('You must be logged in');
    }
    return true;
  }
);

const isQuizOwner = rule({ cache: 'contextual' })(
  async (parent, args, ctx, info) => {
    if (!ctx.user) {
      return new AuthenticationError('You must be logged in');
    }

    const quiz = await QuizService.getQuizById(args.id || args.quizId);
    if (!quiz) {
      return new ForbiddenError('Quiz not found');
    }

    if (quiz.creatorId !== ctx.user.id) {
      return new ForbiddenError('Access denied');
    }

    return true;
  }
);

const isSessionOwner = rule({ cache: 'contextual' })(
  async (parent, args, ctx, info) => {
    if (!ctx.user) {
      return new AuthenticationError('You must be logged in');
    }

    const session = await QuizService.getQuizSession(args.id || args.sessionId || args.input?.sessionId);
    if (!session) {
      return new ForbiddenError('Session not found');
    }

    if (session.userId !== ctx.user.id) {
      return new ForbiddenError('Access denied');
    }

    return true;
  }
);

// ================================
// Permissions Shield
// ================================

const permissions = shield({
  Query: {
    me: isAuthenticated,
    quizSession: isSessionOwner,
    myQuizSessions: isAuthenticated,
  },
  Mutation: {
    createQuiz: isAuthenticated,
    updateQuiz: isQuizOwner,
    deleteQuiz: isQuizOwner,
    startQuiz: isAuthenticated,
    submitAnswer: isSessionOwner,
    finishQuiz: isSessionOwner,
    updateProfile: isAuthenticated,
  },
}, {
  allowExternalErrors: true,
  fallbackError: new ForbiddenError('Access denied'),
});

// ================================
// Resolvers
// ================================

const resolvers = {
  Query: {
    // Quiz queries
    quiz: async (parent, { id }, { user }) => {
      const quiz = await QuizService.getQuizById(id, user?.id);

      if (!quiz) {
        throw new Error('Quiz not found');
      }

      // Check access permissions
      if (quiz.status !== 'PUBLISHED' && quiz.creatorId !== user?.id) {
        throw new ForbiddenError('Access denied');
      }

      logger.info('Quiz queried', { quizId: id, userId: user?.id });
      return quiz;
    },

    quizzes: async (parent, { page = 1, limit = 20, filters }, { user }) => {
      const result = await QuizService.getQuizzes({
        page,
        limit,
        filters,
        userId: user?.id,
      });

      logger.info('Quizzes queried', {
        userId: user?.id,
        count: result.data.length,
        page,
        limit,
      });

      return result;
    },

    // User queries
    me: (parent, args, { user }) => {
      return UserService.getUserById(user.id);
    },

    user: async (parent, { id }, { user }) => {
      return UserService.getUserById(id);
    },

    users: async (parent, { page = 1, limit = 20 }, { user }) => {
      return UserService.getUsers({ page, limit });
    },

    // Quiz session queries
    quizSession: async (parent, { id }, { user }) => {
      return QuizService.getQuizSession(id);
    },

    myQuizSessions: async (parent, { page = 1, limit = 20 }, { user }) => {
      return QuizService.getUserQuizSessions(user.id, { page, limit });
    },
  },

  Mutation: {
    // Quiz mutations
    createQuiz: async (parent, { input }, { user }) => {
      try {
        const quizData = {
          ...input,
          creatorId: user.id,
        };

        const quiz = await QuizService.createQuiz(quizData);

        logger.info('Quiz created via GraphQL', {
          quizId: quiz.id,
          creatorId: user.id,
          questionCount: quiz.questions.length,
        });

        return quiz;
      } catch (error) {
        logger.error('Failed to create quiz via GraphQL', {
          error: error.message,
          userId: user.id,
          title: input.title,
        });
        throw error;
      }
    },

    updateQuiz: async (parent, { id, input }, { user }) => {
      const quiz = await QuizService.updateQuiz(id, input);

      logger.info('Quiz updated via GraphQL', { quizId: id, userId: user.id });

      return quiz;
    },

    deleteQuiz: async (parent, { id }, { user }) => {
      await QuizService.deleteQuiz(id);

      logger.info('Quiz deleted via GraphQL', { quizId: id, userId: user.id });

      return true;
    },

    // Quiz session mutations
    startQuiz: async (parent, { quizId }, { user }) => {
      const session = await QuizService.startQuizSession(quizId, user.id);

      logger.info('Quiz session started via GraphQL', {
        quizId,
        userId: user.id,
        sessionId: session.id,
      });

      return session;
    },

    submitAnswer: async (parent, { input }, { user }) => {
      const { sessionId, questionId, answer } = input;

      const result = await QuizService.submitAnswer(sessionId, questionId, answer);

      logger.info('Answer submitted via GraphQL', {
        sessionId,
        questionId,
        userId: user.id,
        correct: result.correct,
      });

      return result;
    },

    finishQuiz: async (parent, { sessionId }, { user }) => {
      const result = await QuizService.finishQuiz(sessionId);

      logger.info('Quiz finished via GraphQL', {
        sessionId,
        userId: user.id,
        score: result.score,
      });

      return result;
    },

    // User mutations
    updateProfile: async (parent, { input }, { user }) => {
      const updatedUser = await UserService.updateUser(user.id, input);

      logger.info('Profile updated via GraphQL', { userId: user.id });

      return updatedUser;
    },
  },

  // Field resolvers
  Quiz: {
    creator: async (quiz) => {
      return UserService.getUserById(quiz.creatorId);
    },

    stats: async (quiz) => {
      return QuizService.getQuizStats(quiz.id);
    },
  },

  User: {
    stats: async (user) => {
      return UserService.getUserStats(user.id);
    },
  },

  QuizSession: {
    quiz: async (session) => {
      return QuizService.getQuizById(session.quizId);
    },

    user: async (session) => {
      return UserService.getUserById(session.userId);
    },
  },
};

// ================================
// Rate Limiting
// ================================

const rateLimitRule = rateLimit({
  identifyContext: (ctx) => ctx.user?.id || ctx.req.ip,
  formatError: ({ fieldName }) => `Rate limit exceeded for ${fieldName}`,
  formatErrorDescription: (limit) => `You are limited to ${limit} requests per minute`,
});

// ================================
// Schema Creation
// ================================

const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

// Apply middleware
const schemaWithMiddleware = applyMiddleware(
  schema,
  permissions,
  rateLimitRule
);

// ================================
// Apollo Server Setup
// ================================

const createApolloServer = () => {
  return new ApolloServer({
    schema: schemaWithMiddleware,
    context: ({ req }) => {
      // Extract user from request (set by auth middleware)
      return {
        user: req.user,
        req,
      };
    },
    formatError: (error) => {
      logger.error('GraphQL Error', {
        error: error.message,
        locations: error.locations,
        path: error.path,
        userId: error.source?.context?.user?.id,
      });

      // Don't expose internal errors in production
      if (process.env.NODE_ENV === 'production' && !error.originalError) {
        return new Error('Internal server error');
      }

      return error;
    },
    plugins: [
      {
        requestDidStart: (requestContext) => {
          logger.info('GraphQL Request Started', {
            query: requestContext.request.query,
            variables: requestContext.request.variables,
            operationName: requestContext.request.operationName,
            userId: requestContext.context.user?.id,
          });

          return {
            willSendResponse: (requestContext) => {
              logger.info('GraphQL Response Sent', {
                operationName: requestContext.request.operationName,
                userId: requestContext.context.user?.id,
                duration: Date.now() - requestContext.metrics.start,
              });
            },
          };
        },
      },
    ],
  });
};

module.exports = {
  createApolloServer,
  typeDefs,
  resolvers,
};