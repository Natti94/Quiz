# Security Templates

This directory contains comprehensive security templates and guides for implementing Content Security Policy (CSP), input validation, XSS prevention, OWASP security guidelines, and automated security testing.

## 📁 Files Overview

### 📖 `security-guide.md`
**Comprehensive security guide** covering:
- CSP implementation and configuration
- Input validation strategies for XSS prevention
- OWASP Top 10 security guidelines
- Jest security testing patterns
- DevOps security testing integration

### 🔒 `csp-middleware.js`
**Express.js middleware** for Content Security Policy:
- Environment-specific CSP configurations
- Nonce generation for inline scripts
- CSP violation reporting
- Production vs development settings

### ✅ `input-validation.js`
**Input validation and sanitization library**:
- XSS prevention with HTML sanitization
- Email, username, password validation
- Quiz content validation
- Express middleware for request validation

### 🧪 `security-tests.js`
**Jest test suite** for security features:
- CSP header validation
- XSS attack prevention testing
- Input validation testing
- Rate limiting tests
- SQL injection prevention

### 🔄 `security-testing-workflow.yml`
**GitHub Actions workflow** for automated security testing:
- SAST (Static Application Security Testing)
- Dependency vulnerability scanning
- Container security scanning
- DAST (Dynamic Application Security Testing)
- Secrets detection

## 🚀 Quick Start

### 1. Install Security Dependencies
```bash
npm install --save-dev xss validator bcryptjs jsonwebtoken
npm install --save dompurify  # For client-side XSS prevention
```

### 2. Setup CSP Middleware
```javascript
// In your main Express app
const cspMiddleware = require('./security-templates/csp-middleware');
app.use(cspMiddleware);
```

### 3. Add Input Validation
```javascript
// In your routes
const InputValidator = require('./security-templates/input-validation');

app.post('/api/user', InputValidator.validateRequestBody({
  username: { type: 'username', required: true },
  email: { type: 'email', required: true },
  password: { type: 'password', required: true }
}), (req, res) => {
  // Use req.validatedBody for safe data
  res.json({ user: req.validatedBody });
});
```

### 4. Run Security Tests
```bash
# Add to package.json scripts
"test:security": "jest security-tests.js",
"security:audit": "npm audit --audit-level high",
"security:lint": "eslint . --ext .js --config .eslintrc.security.js"

# Run all security checks
npm run test:security && npm run security:audit && npm run security:lint
```

### 5. Deploy Security Workflow
```bash
# Copy workflow to GitHub Actions
cp security-testing-workflow.yml .github/workflows/
```

## 🔧 Configuration

### Environment Variables
```bash
# Required for security features
NODE_ENV=production
JWT_SECRET=your-super-secure-jwt-secret
CSP_REPORT_URI=https://your-domain.com/csp-report
```

### CSP Configuration
Edit `csp-middleware.js` to customize:
- Allowed domains for scripts, styles, images
- Enable/disable inline scripts
- Configure reporting endpoints

### Validation Rules
Customize validation in `input-validation.js`:
- Password complexity requirements
- Username format rules
- Content length limits

## 🧪 Testing Strategy

### Unit Tests
- Input validation functions
- CSP header generation
- Authentication utilities

### Integration Tests
- API endpoints with security middleware
- XSS prevention in forms
- Rate limiting behavior

### End-to-End Tests
- Complete user registration flow
- Quiz creation and answering
- File upload security

### Automated Security Scanning
- **SAST**: CodeQL for static analysis
- **DAST**: OWASP ZAP for dynamic testing
- **Container**: Trivy and Dockle for Docker security
- **Dependencies**: OWASP Dependency Check

## 📊 Security Metrics

Track these security KPIs:
- CSP violation reports
- Failed authentication attempts
- XSS attempt blocks
- Vulnerability scan results
- Security test coverage

## 🚨 Security Monitoring

### CSP Violation Reporting
```javascript
// Add to your app for CSP monitoring
app.post('/csp-report', (req, res) => {
  console.error('CSP Violation:', req.body['csp-report']);
  // Send to logging service (e.g., Sentry, LogRocket)
  res.status(200).json({ received: true });
});
```

### Security Headers Check
```javascript
// Middleware to verify security headers
const verifySecurityHeaders = (req, res, next) => {
  const requiredHeaders = [
    'content-security-policy',
    'x-frame-options',
    'x-content-type-options',
    'x-xss-protection'
  ];

  const missing = requiredHeaders.filter(header =>
    !res.getHeader(header)
  );

  if (missing.length > 0) {
    console.warn('Missing security headers:', missing);
  }

  next();
};
```

## 🔐 Security Best Practices

### Authentication
- Use bcrypt for password hashing (12+ rounds)
- Implement JWT with short expiration
- Add rate limiting to auth endpoints
- Use secure session cookies

### Data Validation
- Validate on both client and server
- Sanitize HTML content
- Use parameterized queries
- Limit input lengths

### CSP Implementation
- Start with restrictive policies
- Use nonces for inline scripts
- Monitor violation reports
- Gradually relax as needed

### Testing
- Test security features in CI/CD
- Include security tests in coverage
- Regular dependency updates
- Automated vulnerability scanning

## 📚 Additional Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Content Security Policy Reference](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP)
- [OWASP ZAP](https://www.zaproxy.org/)
- [Trivy Documentation](https://aquasecurity.github.io/trivy/)
- [JWT Security Best Practices](https://tools.ietf.org/html/rfc8725)

## 🤝 Contributing

When adding new security features:
1. Update the security guide
2. Add corresponding tests
3. Update CI/CD workflows
4. Document configuration options
5. Test in all environments

## 📞 Support

For security issues or questions:
- Check the security guide first
- Review test failures in CI/CD
- Monitor CSP violation reports
- Regular security audits recommended