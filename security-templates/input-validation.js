// middleware/validation.js - Input validation and XSS prevention
const validator = require('validator');
const xss = require('xss');

class InputValidator {
  // Sanitize HTML input to prevent XSS
  static sanitizeHtml(input) {
    if (typeof input !== 'string') return input;

    return xss(input, {
      whiteList: {}, // No HTML tags allowed by default
      stripIgnoreTag: true,
      stripIgnoreTagBody: ['script', 'style']
    });
  }

  // Validate and sanitize user input
  static validateUserInput(input, options = {}) {
    const {
      maxLength = 1000,
      allowHtml = false,
      allowSpecialChars = false
    } = options;

    if (!input || typeof input !== 'string') {
      throw new Error('Input must be a non-empty string');
    }

    let sanitized = input.trim();

    // Length validation
    if (sanitized.length > maxLength) {
      throw new Error(`Input exceeds maximum length of ${maxLength} characters`);
    }

    // HTML sanitization
    if (!allowHtml) {
      sanitized = this.sanitizeHtml(sanitized);
    }

    // Special characters validation
    if (!allowSpecialChars) {
      const specialCharsRegex = /[<>'"&]/;
      if (specialCharsRegex.test(sanitized)) {
        throw new Error('Special characters are not allowed');
      }
    }

    return sanitized;
  }

  // Validate email with normalization
  static validateEmail(email) {
    if (!email || !validator.isEmail(email)) {
      throw new Error('Invalid email format');
    }
    return validator.normalizeEmail(email);
  }

  // Validate username format
  static validateUsername(username) {
    const usernameRegex = /^[a-zA-Z0-9_-]{3,20}$/;
    if (!usernameRegex.test(username)) {
      throw new Error('Username must be 3-20 characters, alphanumeric with underscores and hyphens only');
    }
    return username;
  }

  // Validate password strength
  static validatePassword(password) {
    if (!password || password.length < 8) {
      throw new Error('Password must be at least 8 characters long');
    }

    // Check for complexity
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if (!hasUpperCase || !hasLowerCase || !hasNumbers || !hasSpecialChar) {
      throw new Error('Password must contain uppercase, lowercase, number, and special character');
    }

    return password;
  }

  // Validate quiz answer
  static validateQuizAnswer(answer, options = {}) {
    const { maxLength = 500, allowHtml = false } = options;

    if (!answer || typeof answer !== 'string') {
      throw new Error('Answer must be a non-empty string');
    }

    return this.validateUserInput(answer, { maxLength, allowHtml });
  }

  // Validate quiz question
  static validateQuizQuestion(question) {
    if (!question || typeof question !== 'string') {
      throw new Error('Question must be a non-empty string');
    }

    if (question.length < 10) {
      throw new Error('Question must be at least 10 characters long');
    }

    if (question.length > 1000) {
      throw new Error('Question cannot exceed 1000 characters');
    }

    return this.sanitizeHtml(question);
  }

  // Validate URL for safety
  static validateUrl(url) {
    if (!url || !validator.isURL(url, {
      protocols: ['http', 'https'],
      require_protocol: true
    })) {
      throw new Error('Invalid URL format');
    }

    // Additional security checks
    if (url.includes('javascript:') || url.includes('data:')) {
      throw new Error('Potentially unsafe URL');
    }

    return url;
  }

  // Express middleware for request validation
  static validateRequestBody(schema) {
    return (req, res, next) => {
      try {
        const validatedData = {};

        for (const [field, rules] of Object.entries(schema)) {
          const value = req.body[field];

          if (rules.required && (value === undefined || value === null)) {
            throw new Error(`${field} is required`);
          }

          if (value !== undefined && value !== null) {
            switch (rules.type) {
              case 'email':
                validatedData[field] = this.validateEmail(value);
                break;
              case 'username':
                validatedData[field] = this.validateUsername(value);
                break;
              case 'password':
                validatedData[field] = this.validatePassword(value);
                break;
              case 'quizAnswer':
                validatedData[field] = this.validateQuizAnswer(value, rules.options);
                break;
              case 'quizQuestion':
                validatedData[field] = this.validateQuizQuestion(value);
                break;
              case 'url':
                validatedData[field] = this.validateUrl(value);
                break;
              case 'string':
                validatedData[field] = this.validateUserInput(value, rules.options);
                break;
              default:
                validatedData[field] = value;
            }
          }
        }

        req.validatedBody = validatedData;
        next();
      } catch (error) {
        res.status(400).json({ error: error.message });
      }
    };
  }
}

module.exports = InputValidator;