// Express Cookie Middleware & Utilities
// Install: npm install cookie-parser express-session

const cookieParser = require('cookie-parser');
const session = require('express-session');

// Cookie Security Middleware
function cookieSecurityMiddleware(options = {}) {
  const defaults = {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: 'strict',
    maxAge: 3600000 // 1 hour
  };

  return (req, res, next) => {
    // Override res.cookie to add security defaults
    const originalCookie = res.cookie.bind(res);
    res.cookie = (name, value, options = {}) => {
      const secureOptions = { ...defaults, ...options };
      return originalCookie(name, value, secureOptions);
    };

    // Add cookie utility methods to response
    res.setSecureCookie = (name, value, options = {}) => {
      return res.cookie(name, value, {
        ...defaults,
        ...options,
        secure: true,
        httpOnly: true
      });
    };

    res.setSessionCookie = (name, value) => {
      return res.cookie(name, value, {
        ...defaults,
        maxAge: null // Session cookie
      });
    };

    next();
  };
}

// Session Configuration with Secure Cookies
function createSecureSessionConfig(options = {}) {
  const sessionSecret = options.secret || process.env.SESSION_SECRET;

  if (!sessionSecret) {
    throw new Error('SESSION_SECRET environment variable is required');
  }

  return {
    secret: sessionSecret,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production', // HTTPS only in production
      httpOnly: true, // Prevent XSS access
      sameSite: 'strict', // CSRF protection
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    },
    ...options
  };
}

// Cookie Consent Middleware
function cookieConsentMiddleware(options = {}) {
  const {
    consentCookie = 'cookie_consent',
    preferencesCookie = 'cookie_preferences',
    redirectPath = null
  } = options;

  return (req, res, next) => {
    // Add consent checking methods to request
    req.hasCookieConsent = () => {
      return req.cookies[consentCookie] === 'true';
    };

    req.getCookiePreferences = () => {
      try {
        const prefs = req.cookies[preferencesCookie];
        return prefs ? JSON.parse(prefs) : {
          necessary: true,
          analytics: false,
          marketing: false,
          functional: false
        };
      } catch (error) {
        console.warn('Invalid cookie preferences, using defaults');
        return {
          necessary: true,
          analytics: false,
          marketing: false,
          functional: false
        };
      }
    };

    req.canUseAnalytics = () => {
      return req.getCookiePreferences().analytics;
    };

    req.canUseMarketing = () => {
      return req.getCookiePreferences().marketing;
    };

    req.canUseFunctional = () => {
      return req.getCookiePreferences().functional;
    };

    // Add consent setting methods to response
    res.setCookieConsent = (preferences = {}) => {
      res.cookie(consentCookie, 'true', {
        maxAge: 365 * 24 * 60 * 60 * 1000, // 1 year
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict'
      });

      res.cookie(preferencesCookie, JSON.stringify({
        necessary: true,
        analytics: false,
        marketing: false,
        functional: false,
        ...preferences
      }), {
        maxAge: 365 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict'
      });
    };

    // Redirect if consent required but not given
    if (redirectPath && !req.hasCookieConsent() && req.path !== redirectPath) {
      const isApiRoute = req.path.startsWith('/api/');
      const isAssetRoute = /\.(css|js|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$/.test(req.path);

      if (!isApiRoute && !isAssetRoute && req.method === 'GET') {
        return res.redirect(redirectPath);
      }
    }

    next();
  };
}

// GDPR Data Export Middleware
function gdprCookieMiddleware(options = {}) {
  const {
    exportRoute = '/api/cookies/export',
    deleteRoute = '/api/cookies/delete'
  } = options;

  return (req, res, next) => {
    if (req.path === exportRoute && req.method === 'GET') {
      // Export user's cookies (anonymized)
      const cookieData = {
        consentGiven: req.hasCookieConsent(),
        preferences: req.getCookiePreferences(),
        exportedAt: new Date().toISOString(),
        // Don't export sensitive cookie values
        cookieNames: Object.keys(req.cookies).filter(name =>
          !name.includes('session') && !name.includes('auth')
        )
      };

      return res.json({
        success: true,
        data: cookieData
      });
    }

    if (req.path === deleteRoute && req.method === 'DELETE') {
      // Clear non-essential cookies
      const cookiesToClear = [
        'cookie_consent',
        'cookie_preferences',
        'analytics_consent',
        'marketing_consent',
        'functional_consent'
      ];

      cookiesToClear.forEach(cookieName => {
        res.clearCookie(cookieName);
      });

      return res.json({
        success: true,
        message: 'Non-essential cookies cleared',
        clearedCookies: cookiesToClear
      });
    }

    next();
  };
}

// Rate Limiting for Cookie Operations
function cookieRateLimitMiddleware(options = {}) {
  const {
    windowMs = 15 * 60 * 1000, // 15 minutes
    maxRequests = 10,
    skipSuccessfulRequests = false
  } = options;

  const requests = new Map();

  return (req, res, next) => {
    // Only rate limit cookie-related endpoints
    if (!req.path.includes('/cookie') && !req.path.includes('/consent')) {
      return next();
    }

    const key = req.ip;
    const now = Date.now();
    const windowStart = now - windowMs;

    if (!requests.has(key)) {
      requests.set(key, []);
    }

    const userRequests = requests.get(key);

    // Remove old requests
    const recentRequests = userRequests.filter(time => time > windowStart);

    if (recentRequests.length >= maxRequests) {
      return res.status(429).json({
        error: 'Too many cookie operations. Please try again later.',
        retryAfter: Math.ceil((recentRequests[0] + windowMs - now) / 1000)
      });
    }

    recentRequests.push(now);
    requests.set(key, recentRequests);

    next();
  };
}

// Complete Express App Setup
function setupCookieMiddleware(app, options = {}) {
  const {
    sessionSecret,
    consentRedirect = null,
    enableRateLimit = true
  } = options;

  // Basic cookie parsing
  app.use(cookieParser());

  // Security middleware
  app.use(cookieSecurityMiddleware());

  // Session setup (optional)
  if (sessionSecret) {
    app.use(session(createSecureSessionConfig({ secret: sessionSecret })));
  }

  // Consent middleware
  app.use(cookieConsentMiddleware({
    redirectPath: consentRedirect
  }));

  // GDPR compliance routes
  app.use(gdprCookieMiddleware());

  // Rate limiting (optional)
  if (enableRateLimit) {
    app.use(cookieRateLimitMiddleware());
  }

  // Health check endpoint
  app.get('/api/cookies/health', (req, res) => {
    res.json({
      status: 'OK',
      consent: req.hasCookieConsent(),
      preferences: req.getCookiePreferences(),
      timestamp: new Date().toISOString()
    });
  });
}

module.exports = {
  cookieSecurityMiddleware,
  createSecureSessionConfig,
  cookieConsentMiddleware,
  gdprCookieMiddleware,
  cookieRateLimitMiddleware,
  setupCookieMiddleware
};