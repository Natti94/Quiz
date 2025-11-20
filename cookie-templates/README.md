# Cookie Management Guide & Templates

A comprehensive guide to implementing cookie consent, management, and compliance across different web frameworks and architectures.

## Table of Contents
- [Cookie Basics](#cookie-basics)
- [Legal Compliance](#legal-compliance)
- [Available Templates](#available-templates)
- [Implementation Examples](#implementation-examples)
- [Security Best Practices](#security-best-practices)
- [Testing & Debugging](#testing--debugging)

## Cookie Basics

### Types of Cookies
- **Essential/Strictly Necessary**: Required for site functionality
- **Analytics/Performance**: Track usage and performance
- **Functional**: Remember user preferences
- **Marketing/Advertising**: Personalized ads and marketing

### Cookie Attributes
- `Secure`: Only sent over HTTPS
- `HttpOnly`: Inaccessible to JavaScript
- `SameSite`: CSRF protection (Strict, Lax, None)
- `Max-Age`/`Expires`: Cookie lifetime
- `Domain`/`Path`: Scope restrictions

### Common Cookie Names
- `session_id`: Session management
- `user_preferences`: UI settings
- `consent_status`: GDPR consent
- `analytics_consent`: Analytics opt-in
- `_ga`: Google Analytics
- `marketing_consent`: Marketing cookies

## Legal Compliance

### GDPR Requirements
- Clear consent for non-essential cookies
- Easy withdrawal of consent
- Cookie banner with granular controls
- Record of consent decisions

### Cookie Laws by Region
- **EU**: GDPR (ePrivacy Directive)
- **UK**: PECR (UK GDPR)
- **US**: CCPA (some states), no federal law
- **Canada**: PIPEDA
- **Australia**: Privacy Act

### Consent Requirements
- Freely given, specific, informed consent
- Separate consent for each purpose
- Easy to withdraw
- No pre-ticked boxes
- Clear privacy policy link

## Available Templates

### 1. `cookie-banner-react.jsx` - React Cookie Banner
**Framework**: React
**Features**: Granular consent, Google Consent Mode integration, GDPR compliant
**Dependencies**: `react-cookie-consent`, `js-cookie`
**Use Case**: Modern React applications

### 2. `cookie-banner-vanilla.js` - Vanilla JavaScript Banner
**Framework**: Plain JavaScript
**Features**: No dependencies, customizable UI, local storage fallback
**Dependencies**: None
**Use Case**: Any website, WordPress, static sites

### 3. `cookie-utils.js` - Cookie Utility Library
**Framework**: Universal (Node.js + Browser)
**Features**: Complete cookie management, security helpers, GDPR compliance
**Dependencies**: None
**Use Case**: Any JavaScript application

### 4. `express-cookie-middleware.js` - Express Server Middleware
**Framework**: Express.js
**Features**: Server-side cookie security, consent middleware, GDPR routes
**Dependencies**: `cookie-parser`, `express-session`
**Use Case**: Node.js/Express backends

### 5. `nextjs-cookie-banner.jsx` - Next.js Cookie Banner
**Framework**: Next.js
**Features**: SSR compatible, API route logging, multi-language support
**Dependencies**: `cookies-next`
**Use Case**: Next.js applications

### 6. `cookie-compliance-checker.js` - Compliance Testing Tool
**Framework**: Node.js CLI
**Features**: Automated cookie auditing, security analysis, compliance reporting
**Dependencies**: None
**Use Case**: Development, auditing, compliance checks

## Quick Start

### For React Apps
```bash
npm install react-cookie-consent js-cookie
# Copy cookie-banner-react.jsx to your components
# Import and use: <CookieConsent />
```

### For Vanilla JavaScript
```html
<!-- Include cookie-banner-vanilla.js -->
<script src="cookie-banner-vanilla.js"></script>
<!-- Automatically initializes on page load -->
```

### For Express Servers
```javascript
const { setupCookieMiddleware } = require('./express-cookie-middleware');
app.use(setupCookieMiddleware(app, { sessionSecret: 'your-secret' }));
```

### Testing Compliance
```bash
node cookie-compliance-checker.js https://yourwebsite.com
```

## Environment Variables

```env
# Server-side settings
NODE_ENV=production
SESSION_SECRET=your-secure-session-secret

# Cookie security
COOKIE_SECURE=true
COOKIE_SAME_SITE=strict

# GDPR compliance
CONSENT_LOGGING=true
DATA_RETENTION_DAYS=2555
```

## Additional Resources

### Libraries & Tools
- **Client-side**: `js-cookie`, `react-cookie-consent`, `vanilla-cookieconsent`
- **Server-side**: `cookie-parser`, `express-session`, `cookies-next`
- **Testing**: Cookiebot Scanner, Google Tag Assistant

### Legal Resources
- **GDPR**: [GDPR Cookie Guidelines](https://ico.org.uk/for-the-public/online/cookies/)
- **CCPA**: [California Consumer Privacy Act](https://cppa.ca.gov/)
- **ePrivacy**: [EU ePrivacy Directive](https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32002L0058)

### Implementation Guides
- **Google Consent Mode**: [Google Analytics Help](https://support.google.com/analytics/answer/10000058)
- **Cookie Security**: [OWASP Cookie Security](https://owasp.org/www-chapter-london/assets/slides/OWASP_London_20171130_Cookie_Security_Myths_And_Reality.pdf)

## Common Patterns

### Conditional Loading
```javascript
// Only load analytics if consented
if (getCookie('analytics_consent') === 'true') {
  // Load Google Analytics, Facebook Pixel, etc.
}
```

### Server-side Consent Checking
```javascript
app.get('/analytics', (req, res) => {
  if (!req.canUseAnalytics()) {
    return res.status(403).json({ error: 'Analytics consent required' });
  }
  // Return analytics data
});
```

### Consent Logging
```javascript
// Log all consent changes for GDPR compliance
function logConsentChange(preferences) {
  fetch('/api/consent/log', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      preferences,
      timestamp: new Date().toISOString(),
      ip: getClientIP(),
      userAgent: navigator.userAgent
    })
  });
}
```

## Implementation Examples

### Basic Cookie Banner HTML
```html
<div id="cookie-banner" class="cookie-banner">
  <p>We use cookies to improve your experience.</p>
  <button id="accept-all">Accept All</button>
  <button id="customize">Customize</button>
  <button id="reject-all">Reject All</button>
</div>
```

### Setting Cookies with JavaScript
```javascript
// Set a cookie
document.cookie = "username=john; max-age=86400; secure; samesite=strict";

// Get a cookie
function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
}

// Delete a cookie
document.cookie = "username=; max-age=0; path=/";
```

### Server-Side Cookie Setting (Express)
```javascript
app.get('/set-cookie', (req, res) => {
  res.cookie('session_id', 'abc123', {
    maxAge: 900000,
    httpOnly: true,
    secure: true,
    sameSite: 'strict'
  });
  res.send('Cookie set');
});
```

## Security Best Practices

### Secure Cookie Attributes
```javascript
// Always use these for sensitive cookies
{
  httpOnly: true,    // Prevents XSS access
  secure: true,      // HTTPS only
  sameSite: 'strict', // CSRF protection
  maxAge: 3600000    // Reasonable expiration
}
```

### Cookie Security Checklist
- [ ] Use HTTPS in production
- [ ] Set `secure` flag for all cookies
- [ ] Use `httpOnly` for session/auth cookies
- [ ] Implement `sameSite` protection
- [ ] Validate cookie values server-side
- [ ] Use short expiration times
- [ ] Encrypt sensitive cookie data
- [ ] Implement cookie rotation

### Preventing Common Attacks
- **XSS**: Use `httpOnly` for sensitive cookies
- **CSRF**: Use `sameSite` and CSRF tokens
- **Cookie Theft**: Use `secure` and HTTPS
- **Session Fixation**: Regenerate session IDs

## Testing & Debugging

### Browser Developer Tools
1. Open DevTools → Application → Cookies
2. Check cookie attributes and values
3. Test cookie behavior across page reloads
4. Verify secure/HTTPOnly flags

### Testing Commands
```bash
# Check cookies with curl
curl -I https://example.com

# Test cookie setting
curl -c cookies.txt -b cookies.txt https://example.com

# Validate cookie security
# Use browser extensions or security scanners
```

### Common Issues
- Cookies not persisting: Check `path` and `domain`
- Cookies blocked: Check browser settings
- CORS issues: Verify `sameSite` settings
- Mobile issues: Test on actual devices

## Integration with Analytics

### Google Analytics 4
```javascript
// Only load GA if consent given
if (getCookie('analytics_consent') === 'true') {
  // Load Google Analytics
  gtag('config', 'GA_MEASUREMENT_ID');
}
```

### Facebook Pixel
```javascript
if (getCookie('marketing_consent') === 'true') {
  // Load Facebook Pixel
  fbq('init', 'PIXEL_ID');
}
```

## Server-Side Considerations

### Cookie Parsing
```javascript
// Express cookie parser
app.use(cookieParser());

// Access cookies
app.get('/profile', (req, res) => {
  const sessionId = req.cookies.session_id;
  // Validate session...
});
```

### Session Management
```javascript
// Express session with secure cookies
app.use(session({
  secret: process.env.SESSION_SECRET,
  cookie: {
    secure: true,
    httpOnly: true,
    sameSite: 'strict',
    maxAge: 3600000
  }
}));
```

## Mobile Considerations

### iOS Safari
- Intelligent Tracking Prevention (ITP)
- 7-day limit for third-party cookies
- Requires user interaction for cookie setting

### Android Chrome
- Similar restrictions to desktop
- App WebViews may have different rules

## Compliance Monitoring

### Regular Audits
- Monthly cookie inventory review
- Consent log analysis
- User complaint monitoring
- Privacy policy updates

### Automated Monitoring
```javascript
// Log consent changes
function logConsentChange(category, consented) {
  fetch('/api/consent-log', {
    method: 'POST',
    body: JSON.stringify({
      category,
      consented,
      timestamp: new Date(),
      userAgent: navigator.userAgent
    })
  });
}
```

## Resources

### Useful Libraries
- `js-cookie`: Simple cookie manipulation
- `cookieconsent`: Feature-rich consent banner
- `react-cookie-consent`: React-specific solution

### Legal Resources
- GDPR Cookie Guidelines: [ico.org.uk](https://ico.org.uk)
- ePrivacy Directive: [eur-lex.europa.eu](https://eur-lex.europa.eu)
- CCPA Guidelines: [cppa.ca.gov](https://cppa.ca.gov)

### Testing Tools
- Cookiebot Scanner
- Google Tag Assistant
- Browser DevTools
- Security headers scanners