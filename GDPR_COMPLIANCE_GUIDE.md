# GDPR Compliance Guide for Quiz Application

This document documents the GDPR compliance for the Quiz application. It serves as a canonical compliance artifact for audits and internal review.

## Title and Purpose
- Title: GDPR Compliance Guide — Quiz Application
- Purpose: Document personal data processing, privacy controls, legal basis, DPIA, breaches, retention, and security for audits and internal review.
- Controller (company): Natti94 (Personal Project)
- Data Protection Officer / Contact: Natnael Berhane / natnael.berhane.sv@gmail.com / [phone if applicable]
- Document version / date: v1.0 / November 20, 2025

---

## 1. Summary / Product Overview
- High-level description: A full-stack quiz application with React frontend and Node.js backend, allowing users to take quizzes, track scores, and manage accounts. Primary user base: Students and quiz enthusiasts.
- Main categories of data processed: User accounts, quiz scores, session data, analytics, consent logs.
- Key GDPR features implemented:
  - Consent collection and logging
  - Data portability (export user data)
  - Right to erasure (account deletion)
  - Breach detection & reporting
  - Scheduled retention and deletion

---

## 2. Data Inventory
- Data category: User Account Details (email, username, passwordHash, createdAt, lastLogin)
- Purpose: Authentication, profile management, and user identification
- Lawful basis: Contract (user agreement for account creation)
- Source: Collected from user registration form
- Storage location: MongoDB (users collection) / Local storage during development
- Retention: Indefinite until user deletion or inactivity (USER_RETENTION_INACTIVE_DAYS env var)
- Recipients: Email service for notifications (e.g., password reset)
- International transfer: No (data stored locally or in EU-compliant cloud)
- Technical controls: HTTPS, bcrypt hashing, JWT with secure cookies
- Audit log: User security events and consent logs

- Data category: Quiz Scores and Progress (quizId, score, answers, timestamps)
- Purpose: Track user performance and provide personalized quizzes
- Lawful basis: Legitimate interest (improving user experience)
- Source: Generated during quiz sessions
- Storage location: MongoDB (scores collection)
- Retention: 1 year (SCORE_RETENTION_DAYS env var)
- Recipients: None (internal only)
- International transfer: No
- Technical controls: Encrypted storage, access controls
- Audit log: Quiz attempt logs

- Data category: Session and Analytics Data (IP address, user agent, quiz interactions)
- Purpose: Session management and basic analytics
- Lawful basis: Consent (cookie banner)
- Source: Browser sessions and interactions
- Storage location: Cookies and server logs
- Retention: 30 days (SESSION_RETENTION_DAYS env var)
- Recipients: None
- International transfer: No
- Technical controls: HttpOnly, Secure, SameSite cookies; anonymized logs
- Audit log: Consent logs

(Repeat for additional categories as needed)

---

## 3. Lawful Basis Matrix
- User accounts and authentication: Contract
- Quiz scores and progress: Legitimate interest
- Session cookies: Necessary for service provision
- Analytics and notifications: Consent

---

## 4. Data Processing Register (JSON template)
{
  "processingName": "User Accounts",
  "purpose": "Authentication and profile management",
  "dataCategories": ["email", "username", "passwordHash", "createdAt"],
  "lawfulBasis": "contract",
  "retentionDays": 1095,
  "security": ["bcrypt", "HTTPS", "JWT"],
  "processors": ["MongoDB (self-hosted)", "Email provider (if used)"]
}

{
  "processingName": "Quiz Data",
  "purpose": "Performance tracking and personalization",
  "dataCategories": ["quizId", "score", "answers"],
  "lawfulBasis": "legitimateInterest",
  "retentionDays": 365,
  "security": ["encryption", "access controls"],
  "processors": ["MongoDB"]
}

---

## 5. Consent Management
- Location: Cookie banner on frontend, settings page
- Implementation details: Store consent records in `consentLogs` collection; set cookies with `SameSite`, `HttpOnly`, `Secure` flags.
- Example consent language: "We use cookies to manage your session and improve the quiz experience. You can manage preferences in Settings."

Map to repo:
- UI: `quiz-frontend/src/components/CookieBanner.jsx`, `Settings.jsx`
- Backend: `quiz-backend-local/controllers/consentController.js`, `models/ConsentLog.js`
- Cookies config: `quiz-backend-local/config/cookieConfig.js`

---

## 6. Data Subject Rights
Right of Access (Article 15)
- Steps: User logs in → Requests data export → Backend generates JSON/CSV → Delivered via email or secure link
- Endpoint: `GET /api/user/data-access`

Right to Portability (Article 20)
- Formats: JSON and CSV
- Endpoint: `POST /api/user/data-portability`

Right to Erasure (Article 17)
- Flow: User confirms deletion → Backend anonymizes/deletes data → Logs audit
- Endpoint: `DELETE /api/user/account`
- Logging: `consentLogs` and deletion audit in `userAuditLogs`

Rectification & Objection
- Update endpoints: `PUT /api/user/profile`
- Objections handled via support ticket, evaluated within 1 month

---

## 7. Breach Response (Articles 33 & 34)
- Controllers & routes: `quiz-backend-local/controllers/incidentController.js`, `routes/incident.js`
- Timeline: Notify supervisory authority within 72 hours if high risk
- Template for authority notification: Include breach details, affected users, mitigation steps
- Template for user notifications: Clear explanation of breach and recommended actions
- Post-mortem: Update security controls and DPIA

---

## 8. Security (Article 32) Checklist
- TLS/HTTPS enforced in production
- Helmet for CSP and security headers
- Rate limiting on auth endpoints
- Input sanitization and XSS protection
- CSRF protection via tokens
- bcrypt for password hashing
- JWT with short TTL and secure cookies
- Logging and monitoring for suspicious activity

---

## 9. Retention & Deletion
- Defined in `.env`: `USER_RETENTION_INACTIVE_DAYS=1095`, `SCORE_RETENTION_DAYS=365`, `SESSION_RETENTION_DAYS=30`
- Data retention jobs: `quiz-backend-local/services/dataRetentionService.js`
- Anonymize vs delete: Delete PII on request; anonymize for audit logs

---

## 10. Processors & Vendors
- MongoDB: Data storage – Self-hosted, no DPA needed
- Email provider (if used): Notifications – Ensure DPA signed

---

## 11. DPIA Template
- Description: Processing user quiz data for personalization
- Risk assessment: Low risk, mitigated by encryption and consent
- Mitigation: Regular audits, data minimization
- Residual risk: Minimal
- Action plan: Annual review

---

## 12. Auditing & Logs
- Log consent changes, security events, quiz attempts
- Retain per `AUDIT_RETENTION_DAYS=365`

---

## 13. Testing & Monitoring
Automated tests:
- Health check: `GET /health` returns system status
- Data export: `POST /api/user/data-portability` returns data
- Data deletion: `DELETE /api/user/account` responds 200
- Consent: Cookie banner sets correct flags

CI: Run tests on PRs affecting user data.

---

## 14. Templates
- Breach email: Subject + details + contact
- User notice: Subject + explanation + steps

---

## 15. Developer Checklist
- [ ] Update data inventory on schema changes
- [ ] Test export/deletion flows
- [ ] Ensure consent UI is updated
- [ ] Add logs for new PII handling

---

## Appendix: Source Mapping
- Consent UI: `quiz-frontend/src/components/CookieBanner.jsx`
- Data export: `quiz-backend-local/controllers/userController.js`
- Deletion: `quiz-backend-local/controllers/userController.js`
- Incident: `quiz-backend-local/controllers/incidentController.js`
- Health: `quiz-backend-local/routes/health.js`

---

_Last updated: November 20, 2025_