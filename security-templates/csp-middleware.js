// middleware/csp.js - Content Security Policy middleware
const crypto = require('crypto');

// CSP configurations for different environments
const cspConfigs = {
  development: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      connectSrc: ["'self'", "ws:", "http://localhost:*"],
      imgSrc: ["'self'", "data:", "blob:"],
      fontSrc: ["'self'"]
    }
  },

  production: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "https://cdn.example.com"],
      styleSrc: ["'self'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https://images.example.com"],
      connectSrc: ["'self'", "https://api.example.com"],
      frameSrc: ["'none'"],
      objectSrc: ["'none'"],
      baseUri: ["'self'"],
      formAction: ["'self'"],
      frameAncestors: ["'none'"],
      upgradeInsecureRequests: []
    }
  },

  strict: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'"],
      imgSrc: ["'self'"],
      connectSrc: ["'self'"],
      frameSrc: ["'none'"],
      objectSrc: ["'none'"],
      baseUri: ["'self'"],
      formAction: ["'self'"],
      frameAncestors: ["'none'"],
      requireTrustedTypesFor: ["'script'"]
    }
  }
};

const generateCSP = (config) => {
  return Object.entries(config.directives)
    .map(([directive, sources]) => {
      const sourceList = Array.isArray(sources) ? sources.join(' ') : sources;
      return `${directive} ${sourceList}`;
    })
    .join('; ');
};

const generateNonce = () => {
  return crypto.randomBytes(16).toString('base64');
};

const cspMiddleware = (req, res, next) => {
  const environment = process.env.NODE_ENV || 'development';
  const config = cspConfigs[environment] || cspConfigs.production;

  // Generate nonce for inline scripts/styles if needed
  const nonce = generateNonce();
  res.locals.nonce = nonce;

  // Add nonce to script-src if using inline scripts
  if (config.directives.scriptSrc && config.directives.scriptSrc.includes("'unsafe-inline'")) {
    config.directives.scriptSrc = config.directives.scriptSrc.filter(src => src !== "'unsafe-inline'");
    config.directives.scriptSrc.push(`'nonce-${nonce}'`);
  }

  const cspHeader = generateCSP(config);
  res.setHeader('Content-Security-Policy', cspHeader);

  // Report-only mode for testing (uncomment in development)
  // res.setHeader('Content-Security-Policy-Report-Only', cspHeader);

  next();
};

module.exports = cspMiddleware;