# GDPR Compliance Library

A reusable Node.js module for implementing GDPR features in applications. Provides utilities for data handling, consent, auditing, and compliance checks.

## Installation
This library is part of the project. Import it in your code:

```javascript
const gdpr = require('./lib/gdpr');
```

## Features

### Data Export
Generate user data exports in JSON or CSV format.

```javascript
const userData = { email: 'user@example.com', scores: [100, 95] };
const jsonExport = gdpr.exportUserData(userData, 'json');
const csvExport = gdpr.exportUserData(userData, 'csv');
```

### Data Deletion
Anonymize or fully delete user data.

```javascript
await gdpr.deleteUserData(db, userId, true); // Anonymize
await gdpr.deleteUserData(db, userId, false); // Delete
```

### Consent Logging
Log user consent choices.

```javascript
await gdpr.logConsent(db, userId, { analytics: true, notifications: false });
```

### Audit Logging
Log GDPR events.

```javascript
await gdpr.logAuditEvent(db, userId, 'data_access', { exportedFields: ['email', 'scores'] });
```

### Retention Checks
Check if data should be retained.

```javascript
const retain = gdpr.shouldRetainData(user.createdAt, 365); // 1 year retention
```

### Breach Notifications
Generate email templates for breaches.

```javascript
const email = gdpr.generateBreachNotification({
  description: 'Unauthorized access detected',
  affectedData: 'Email addresses',
  mitigation: 'Passwords reset'
});
```

### Health Checks
Verify GDPR features are working.

```javascript
const status = await gdpr.gdprHealthCheck(db);
console.log(status); // { status: 'healthy', ... }
```

## Usage in Controllers
Example in a user controller:

```javascript
const gdpr = require('../lib/gdpr');

app.post('/api/user/data-portability', async (req, res) => {
  const userData = await getUserData(req.user.id);
  const exportData = gdpr.exportUserData(userData, req.body.format);
  await gdpr.logAuditEvent(db, req.user.id, 'data_export');
  res.send(exportData);
});

app.delete('/api/user/account', async (req, res) => {
  await gdpr.deleteUserData(db, req.user.id);
  res.send({ message: 'Account deleted' });
});
```

## Configuration
Set retention periods in `.env`:
- `USER_RETENTION_DAYS=1095`
- `AUDIT_RETENTION_DAYS=365`

## Testing
Run tests to ensure compliance:
- Export functionality
- Deletion without data loss
- Consent logging
- Audit trails

## Reusability
Copy this module to other projects and adapt the database queries as needed. Ensure MongoDB collections like `users`, `consentLogs`, `auditLogs` exist.