/**
 * Winston Logger Configuration Template
 *
 * This template provides a production-ready logging configuration using Winston
 * with structured logging, multiple transports, and proper log rotation.
 */

const winston = require('winston');
const path = require('path');
require('winston-daily-rotate-file');

// Define log levels
const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

const colors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  debug: 'white',
};

winston.addColors(colors);

// Create logs directory if it doesn't exist
const fs = require('fs');
const logsDir = path.join(process.cwd(), 'logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

// Define log format
const logFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.json(),
  winston.format.colorize({ all: true })
);

// Console transport for development
const consoleTransport = new winston.transports.Console({
  level: process.env.LOG_LEVEL || 'debug',
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.simple()
  ),
});

// File transport for errors
const errorFileTransport = new winston.transports.DailyRotateFile({
  filename: path.join(logsDir, 'error-%DATE%.log'),
  datePattern: 'YYYY-MM-DD',
  level: 'error',
  format: logFormat,
  maxSize: '20m',
  maxFiles: '14d',
});

// File transport for all logs
const combinedFileTransport = new winston.transports.DailyRotateFile({
  filename: path.join(logsDir, 'combined-%DATE%.log'),
  datePattern: 'YYYY-MM-DD',
  format: logFormat,
  maxSize: '20m',
  maxFiles: '14d',
});

// HTTP request logging transport
const httpFileTransport = new winston.transports.DailyRotateFile({
  filename: path.join(logsDir, 'http-%DATE%.log'),
  datePattern: 'YYYY-MM-DD',
  level: 'http',
  format: logFormat,
  maxSize: '20m',
  maxFiles: '14d',
});

// Create logger instance
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  levels,
  format: logFormat,
  transports: [
    consoleTransport,
    errorFileTransport,
    combinedFileTransport,
    httpFileTransport,
  ],
  // Handle exceptions and rejections
  exceptionHandlers: [
    new winston.transports.File({
      filename: path.join(logsDir, 'exceptions.log'),
    }),
  ],
  rejectionHandlers: [
    new winston.transports.File({
      filename: path.join(logsDir, 'rejections.log'),
    }),
  ],
});

// Add request logging middleware
logger.stream = {
  write: (message) => {
    logger.http(message.trim());
  },
};

// Performance logging helper
logger.performance = (operation, startTime, metadata = {}) => {
  const duration = Date.now() - startTime;
  logger.info('Performance measurement', {
    operation,
    duration,
    ...metadata,
  });
};

// Request logging helper
logger.request = (req, res, next) => {
  const start = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - start;
    logger.http('HTTP Request', {
      method: req.method,
      url: req.url,
      status: res.statusCode,
      duration,
      ip: req.ip,
      userAgent: req.get('User-Agent'),
    });
  });

  next();
};

module.exports = logger;