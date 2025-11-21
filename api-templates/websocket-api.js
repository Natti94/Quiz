/**
 * WebSocket API Template with Socket.IO
 *
 * This template provides real-time communication capabilities for quizzes,
 * including live quiz sessions, collaborative quiz creation, and real-time notifications.
 */

const socketIo = require('socket.io');
const jwt = require('jsonwebtoken');
const logger = require('../monitoring/winston-logger');

// Import services
const QuizService = require('../services/QuizService');
const UserService = require('../services/UserService');
const NotificationService = require('../services/NotificationService');

// In-memory stores (in production, use Redis or database)
const activeRooms = new Map(); // roomId -> { quizId, participants: Map<socketId, userData> }
const userSockets = new Map(); // userId -> Set<socketId>

// ================================
// Authentication Middleware
// ================================

const authenticateSocket = async (socket, next) => {
  try {
    const token = socket.handshake.auth.token || socket.handshake.query.token;

    if (!token) {
      return next(new Error('Authentication token required'));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await UserService.getUserById(decoded.id);

    if (!user) {
      return next(new Error('User not found'));
    }

    socket.user = user;
    next();
  } catch (error) {
    logger.error('Socket authentication failed', {
      error: error.message,
      socketId: socket.id,
    });
    next(new Error('Authentication failed'));
  }
};

// ================================
// Room Management
// ================================

class RoomManager {
  static createRoom(quizId, creatorId) {
    const roomId = `quiz_${quizId}_${Date.now()}`;
    activeRooms.set(roomId, {
      quizId,
      creatorId,
      participants: new Map(),
      createdAt: new Date(),
      settings: {
        maxParticipants: 100,
        allowLateJoin: true,
        timeLimit: null,
      },
    });

    logger.info('Room created', { roomId, quizId, creatorId });
    return roomId;
  }

  static joinRoom(roomId, socketId, userData) {
    const room = activeRooms.get(roomId);
    if (!room) {
      throw new Error('Room not found');
    }

    if (room.participants.size >= room.settings.maxParticipants) {
      throw new Error('Room is full');
    }

    room.participants.set(socketId, {
      ...userData,
      joinedAt: new Date(),
      score: 0,
      answers: [],
    });

    // Track user sockets
    if (!userSockets.has(userData.id)) {
      userSockets.set(userData.id, new Set());
    }
    userSockets.get(userData.id).add(socketId);

    logger.info('User joined room', { roomId, socketId, userId: userData.id });
    return room;
  }

  static leaveRoom(roomId, socketId) {
    const room = activeRooms.get(roomId);
    if (!room) return;

    const participant = room.participants.get(socketId);
    if (participant) {
      room.participants.delete(socketId);

      // Clean up user sockets tracking
      const userSocketSet = userSockets.get(participant.id);
      if (userSocketSet) {
        userSocketSet.delete(socketId);
        if (userSocketSet.size === 0) {
          userSockets.delete(participant.id);
        }
      }

      logger.info('User left room', { roomId, socketId, userId: participant.id });

      // Clean up empty rooms after some time
      if (room.participants.size === 0) {
        setTimeout(() => {
          if (activeRooms.get(roomId)?.participants.size === 0) {
            activeRooms.delete(roomId);
            logger.info('Room cleaned up', { roomId });
          }
        }, 300000); // 5 minutes
      }
    }
  }

  static getRoom(roomId) {
    return activeRooms.get(roomId);
  }

  static getRoomParticipants(roomId) {
    const room = activeRooms.get(roomId);
    return room ? Array.from(room.participants.values()) : [];
  }

  static broadcastToRoom(io, roomId, event, data, excludeSocket = null) {
    const room = activeRooms.get(roomId);
    if (!room) return;

    room.participants.forEach((participant, socketId) => {
      if (socketId !== excludeSocket) {
        io.to(socketId).emit(event, data);
      }
    });
  }
}

// ================================
// Socket.IO Setup
// ================================

const initializeSocketIO = (server) => {
  const io = socketIo(server, {
    cors: {
      origin: process.env.CLIENT_URL || "http://localhost:3000",
      methods: ["GET", "POST"],
      credentials: true,
    },
    pingTimeout: 60000,
    pingInterval: 25000,
  });

  // Apply authentication middleware
  io.use(authenticateSocket);

  io.on('connection', (socket) => {
    logger.info('User connected', {
      socketId: socket.id,
      userId: socket.user.id,
      username: socket.user.username,
    });

    // ================================
    // Quiz Room Events
    // ================================

    socket.on('join-quiz-room', async (data) => {
      try {
        const { quizId, roomId } = data;

        if (!quizId) {
          socket.emit('error', { message: 'Quiz ID is required' });
          return;
        }

        // Verify quiz exists and is accessible
        const quiz = await QuizService.getQuizById(quizId, socket.user.id);
        if (!quiz) {
          socket.emit('error', { message: 'Quiz not found' });
          return;
        }

        if (quiz.status !== 'PUBLISHED' && quiz.creatorId !== socket.user.id) {
          socket.emit('error', { message: 'Access denied' });
          return;
        }

        let currentRoomId = roomId;

        // Create room if not specified or doesn't exist
        if (!currentRoomId || !RoomManager.getRoom(currentRoomId)) {
          currentRoomId = RoomManager.createRoom(quizId, socket.user.id);
        }

        // Join the room
        const room = RoomManager.joinRoom(currentRoomId, socket.id, {
          id: socket.user.id,
          username: socket.user.username,
          avatar: socket.user.avatar,
        });

        socket.join(currentRoomId);

        // Notify others in the room
        socket.to(currentRoomId).emit('user-joined', {
          user: {
            id: socket.user.id,
            username: socket.user.username,
            avatar: socket.user.avatar,
          },
          participantCount: room.participants.size,
        });

        // Send room info to the joining user
        socket.emit('room-joined', {
          roomId: currentRoomId,
          quiz,
          participants: RoomManager.getRoomParticipants(currentRoomId),
          settings: room.settings,
        });

        logger.info('User joined quiz room', {
          socketId: socket.id,
          userId: socket.user.id,
          roomId: currentRoomId,
          quizId,
        });

      } catch (error) {
        logger.error('Failed to join quiz room', {
          error: error.message,
          socketId: socket.id,
          userId: socket.user.id,
          data,
        });
        socket.emit('error', { message: error.message });
      }
    });

    socket.on('leave-quiz-room', (data) => {
      const { roomId } = data;

      if (roomId) {
        RoomManager.leaveRoom(roomId, socket.id);
        socket.leave(roomId);

        // Notify others
        socket.to(roomId).emit('user-left', {
          userId: socket.user.id,
          username: socket.user.username,
        });
      }
    });

    socket.on('start-quiz-session', async (data) => {
      try {
        const { roomId } = data;
        const room = RoomManager.getRoom(roomId);

        if (!room) {
          socket.emit('error', { message: 'Room not found' });
          return;
        }

        if (room.creatorId !== socket.user.id) {
          socket.emit('error', { message: 'Only room creator can start the quiz' });
          return;
        }

        // Start quiz for all participants
        const quiz = await QuizService.getQuizById(room.quizId);

        // Broadcast quiz start
        io.to(roomId).emit('quiz-started', {
          quiz: {
            id: quiz.id,
            title: quiz.title,
            questions: quiz.questions.length,
            settings: quiz.settings,
          },
          startedAt: new Date(),
        });

        // Start individual sessions for each participant
        room.participants.forEach(async (participant, socketId) => {
          try {
            const session = await QuizService.startQuizSession(room.quizId, participant.id);
            io.to(socketId).emit('session-started', {
              sessionId: session.id,
              questions: quiz.questions,
            });
          } catch (error) {
            io.to(socketId).emit('error', { message: 'Failed to start session' });
          }
        });

        logger.info('Quiz session started', {
          roomId,
          quizId: room.quizId,
          participantCount: room.participants.size,
        });

      } catch (error) {
        logger.error('Failed to start quiz session', {
          error: error.message,
          socketId: socket.id,
          userId: socket.user.id,
          data,
        });
        socket.emit('error', { message: error.message });
      }
    });

    socket.on('submit-answer', async (data) => {
      try {
        const { roomId, sessionId, questionId, answer, timeSpent } = data;

        const result = await QuizService.submitAnswer(sessionId, questionId, answer, timeSpent);

        // Update room participant data
        const room = RoomManager.getRoom(roomId);
        if (room) {
          const participant = room.participants.get(socket.id);
          if (participant) {
            participant.score = result.score;
            participant.answers.push({
              questionId,
              answer,
              correct: result.correct,
              timeSpent,
            });
          }
        }

        // Send result to user
        socket.emit('answer-result', {
          questionId,
          correct: result.correct,
          explanation: result.explanation,
          score: result.score,
          nextQuestion: result.nextQuestion,
        });

        // Broadcast progress to room (without revealing answers)
        socket.to(roomId).emit('participant-progress', {
          userId: socket.user.id,
          username: socket.user.username,
          progress: result.progress,
        });

        logger.info('Answer submitted', {
          sessionId,
          questionId,
          userId: socket.user.id,
          correct: result.correct,
        });

      } catch (error) {
        logger.error('Failed to submit answer', {
          error: error.message,
          socketId: socket.id,
          userId: socket.user.id,
          data,
        });
        socket.emit('error', { message: error.message });
      }
    });

    socket.on('finish-quiz', async (data) => {
      try {
        const { roomId, sessionId } = data;

        const result = await QuizService.finishQuiz(sessionId);

        // Send final result to user
        socket.emit('quiz-finished', {
          result,
          leaderboard: await getRoomLeaderboard(roomId),
        });

        // Broadcast completion to room
        socket.to(roomId).emit('participant-finished', {
          userId: socket.user.id,
          username: socket.user.username,
          score: result.score,
          timeSpent: result.timeSpent,
        });

        logger.info('Quiz finished', {
          sessionId,
          userId: socket.user.id,
          score: result.score,
        });

      } catch (error) {
        logger.error('Failed to finish quiz', {
          error: error.message,
          socketId: socket.id,
          userId: socket.user.id,
          data,
        });
        socket.emit('error', { message: error.message });
      }
    });

    // ================================
    // Collaborative Quiz Creation
    // ================================

    socket.on('join-collaboration', async (data) => {
      try {
        const { quizId } = data;

        if (!quizId) {
          socket.emit('error', { message: 'Quiz ID is required' });
          return;
        }

        // Verify user can edit this quiz
        const quiz = await QuizService.getQuizById(quizId);
        if (!quiz) {
          socket.emit('error', { message: 'Quiz not found' });
          return;
        }

        if (quiz.creatorId !== socket.user.id) {
          // Check if user has been invited to collaborate
          const collaborators = await QuizService.getQuizCollaborators(quizId);
          if (!collaborators.includes(socket.user.id)) {
            socket.emit('error', { message: 'Access denied' });
            return;
          }
        }

        const collabRoomId = `collab_${quizId}`;
        socket.join(collabRoomId);

        // Send current quiz state
        socket.emit('collaboration-joined', {
          quiz,
          collaborators: await getCollaborators(collabRoomId),
        });

        // Notify others
        socket.to(collabRoomId).emit('collaborator-joined', {
          user: {
            id: socket.user.id,
            username: socket.user.username,
            avatar: socket.user.avatar,
          },
        });

        logger.info('User joined collaboration', {
          socketId: socket.id,
          userId: socket.user.id,
          quizId,
        });

      } catch (error) {
        logger.error('Failed to join collaboration', {
          error: error.message,
          socketId: socket.id,
          userId: socket.user.id,
          data,
        });
        socket.emit('error', { message: error.message });
      }
    });

    socket.on('update-quiz-draft', async (data) => {
      try {
        const { quizId, updates } = data;

        // Verify permissions
        const quiz = await QuizService.getQuizById(quizId);
        if (quiz.creatorId !== socket.user.id) {
          const collaborators = await QuizService.getQuizCollaborators(quizId);
          if (!collaborators.includes(socket.user.id)) {
            socket.emit('error', { message: 'Access denied' });
            return;
          }
        }

        // Apply updates
        const updatedQuiz = await QuizService.updateQuizDraft(quizId, updates, socket.user.id);

        // Broadcast to collaborators
        const collabRoomId = `collab_${quizId}`;
        socket.to(collabRoomId).emit('quiz-updated', {
          updates,
          updatedBy: {
            id: socket.user.id,
            username: socket.user.username,
          },
          timestamp: new Date(),
        });

        logger.info('Quiz draft updated', {
          quizId,
          userId: socket.user.id,
          updates: Object.keys(updates),
        });

      } catch (error) {
        logger.error('Failed to update quiz draft', {
          error: error.message,
          socketId: socket.id,
          userId: socket.user.id,
          data,
        });
        socket.emit('error', { message: error.message });
      }
    });

    // ================================
    // Real-time Notifications
    // ================================

    socket.on('subscribe-notifications', () => {
      socket.join(`notifications_${socket.user.id}`);
      logger.info('User subscribed to notifications', {
        socketId: socket.id,
        userId: socket.user.id,
      });
    });

    socket.on('unsubscribe-notifications', () => {
      socket.leave(`notifications_${socket.user.id}`);
      logger.info('User unsubscribed from notifications', {
        socketId: socket.id,
        userId: socket.user.id,
      });
    });

    // ================================
    // Chat/Messaging
    // ================================

    socket.on('send-message', async (data) => {
      try {
        const { roomId, message, type = 'text' } = data;

        if (!roomId || !message) {
          socket.emit('error', { message: 'Room ID and message are required' });
          return;
        }

        const room = RoomManager.getRoom(roomId);
        if (!room) {
          socket.emit('error', { message: 'Room not found' });
          return;
        }

        const messageData = {
          id: `msg_${Date.now()}_${socket.id}`,
          userId: socket.user.id,
          username: socket.user.username,
          avatar: socket.user.avatar,
          message,
          type,
          timestamp: new Date(),
        };

        // Broadcast message to room
        io.to(roomId).emit('message-received', messageData);

        // Store message for room history
        if (!room.messages) room.messages = [];
        room.messages.push(messageData);

        // Keep only last 100 messages
        if (room.messages.length > 100) {
          room.messages = room.messages.slice(-100);
        }

        logger.info('Message sent', {
          roomId,
          userId: socket.user.id,
          messageType: type,
        });

      } catch (error) {
        logger.error('Failed to send message', {
          error: error.message,
          socketId: socket.id,
          userId: socket.user.id,
          data,
        });
        socket.emit('error', { message: error.message });
      }
    });

    // ================================
    // Connection Management
    // ================================

    socket.on('disconnect', () => {
      logger.info('User disconnected', {
        socketId: socket.id,
        userId: socket.user.id,
      });

      // Clean up from all rooms
      activeRooms.forEach((room, roomId) => {
        RoomManager.leaveRoom(roomId, socket.id);
      });

      // Clean up user socket tracking
      const userSocketSet = userSockets.get(socket.user.id);
      if (userSocketSet) {
        userSocketSet.delete(socket.id);
        if (userSocketSet.size === 0) {
          userSockets.delete(socket.user.id);
        }
      }
    });

    socket.on('disconnecting', () => {
      // Notify rooms about impending disconnect
      socket.rooms.forEach(roomId => {
        if (roomId !== socket.id) {
          socket.to(roomId).emit('user-disconnecting', {
            userId: socket.user.id,
            username: socket.user.username,
          });
        }
      });
    });
  });

  return io;
};

// ================================
// Helper Functions
// ================================

async function getRoomLeaderboard(roomId) {
  const room = RoomManager.getRoom(roomId);
  if (!room) return [];

  const participants = Array.from(room.participants.values());
  const leaderboard = participants
    .filter(p => p.score !== undefined)
    .sort((a, b) => b.score - a.score)
    .map((p, index) => ({
      rank: index + 1,
      userId: p.id,
      username: p.username,
      avatar: p.avatar,
      score: p.score,
      answers: p.answers.length,
    }));

  return leaderboard;
}

async function getCollaborators(collabRoomId) {
  // Get all sockets in the collaboration room
  const collabSockets = await io.in(collabRoomId).allSockets();
  const collaborators = [];

  for (const socketId of collabSockets) {
    const socket = io.sockets.sockets.get(socketId);
    if (socket?.user) {
      collaborators.push({
        id: socket.user.id,
        username: socket.user.username,
        avatar: socket.user.avatar,
      });
    }
  }

  return collaborators;
}

// ================================
// Notification Broadcasting
// ================================

const broadcastNotification = (userId, notification) => {
  const io = global.io; // Assuming io is stored globally
  if (io) {
    io.to(`notifications_${userId}`).emit('notification', notification);
  }
};

// ================================
// Export
// ================================

module.exports = {
  initializeSocketIO,
  RoomManager,
  broadcastNotification,
};