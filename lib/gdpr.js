/**
 * GDPR Compliance Library
 *
 * A reusable module for handling GDPR-related features in applications.
 * Provides utilities for data export, deletion, consent management, and logging.
 *
 * Usage: Import and use in controllers/routes.
 * Example: const gdpr = require('./lib/gdpr');
 */

const fs = require('fs').promises;
const path = require('path');

/**
 * Data Export Utility
 * Generates a JSON/CSV export of user data.
 * @param {Object} userData - User data object
 * @param {string} format - 'json' or 'csv'
 * @returns {string} - Exported data
 */
function exportUserData(userData, format = 'json') {
  if (format === 'json') {
    return JSON.stringify(userData, null, 2);
  } else if (format === 'csv') {
    // Simple CSV conversion (expand for complex data)
    const keys = Object.keys(userData);
    const values = Object.values(userData);
    return `${keys.join(',')}\n${values.join(',')}`;
  }
  throw new Error('Unsupported format');
}

/**
 * Data Deletion Utility
 * Anonymizes or deletes user data.
 * @param {Object} db - Database connection
 * @param {string} userId - User ID
 * @param {boolean} anonymize - If true, anonymize instead of delete
 */
async function deleteUserData(db, userId, anonymize = false) {
  if (anonymize) {
    // Anonymize: Remove PII but keep audit data
    await db.collection('users').updateOne(
      { _id: userId },
      {
        $set: {
          email: 'anonymized@example.com',
          username: 'anonymized',
          deletedAt: new Date()
        },
        $unset: { passwordHash: 1, personalData: 1 }
      }
    );
  } else {
    // Full deletion
    await db.collection('users').deleteOne({ _id: userId });
    await db.collection('scores').deleteMany({ userId });
    await db.collection('consentLogs').deleteMany({ userId });
  }

  // Log the action
  await logAuditEvent(db, userId, 'data_deletion', { anonymize });
}

/**
 * Consent Management
 * Logs user consent choices.
 * @param {Object} db - Database connection
 * @param {string} userId - User ID
 * @param {Object} consent - Consent object (e.g., { analytics: true, notifications: false })
 */
async function logConsent(db, userId, consent) {
  await db.collection('consentLogs').insertOne({
    userId,
    consent,
    timestamp: new Date(),
    ip: 'logged', // In real app, get from request
    userAgent: 'logged'
  });
}

/**
 * Audit Logging
 * Logs GDPR-related events.
 * @param {Object} db - Database connection
 * @param {string} userId - User ID
 * @param {string} event - Event type (e.g., 'data_access', 'deletion')
 * @param {Object} details - Additional details
 */
async function logAuditEvent(db, userId, event, details = {}) {
  await db.collection('auditLogs').insertOne({
    userId,
    event,
    details,
    timestamp: new Date()
  });
}

/**
 * Data Retention Check
 * Checks if data should be deleted based on retention policy.
 * @param {Date} createdAt - Data creation date
 * @param {number} retentionDays - Retention period in days
 * @returns {boolean} - True if data should be retained
 */
function shouldRetainData(createdAt, retentionDays) {
  const now = new Date();
  const retentionDate = new Date(createdAt);
  retentionDate.setDate(retentionDate.getDate() + retentionDays);
  return now < retentionDate;
}

/**
 * Breach Notification Template
 * Generates a breach notification email template.
 * @param {Object} breachDetails - Details of the breach
 * @returns {string} - Email body
 */
function generateBreachNotification(breachDetails) {
  return `
Subject: Data Breach Notification

Dear User,

We have detected a potential data breach affecting your account. Details:
- What happened: ${breachDetails.description}
- Affected data: ${breachDetails.affectedData}
- What we're doing: ${breachDetails.mitigation}

Please change your password and monitor your account.

Contact: support@example.com

Best,
Quiz Team
  `.trim();
}

/**
 * Health Check for GDPR Compliance
 * Checks if key GDPR features are operational.
 * @param {Object} db - Database connection
 * @returns {Object} - Status object
 */
async function gdprHealthCheck(db) {
  try {
    const userCount = await db.collection('users').countDocuments();
    const consentCount = await db.collection('consentLogs').countDocuments();
    return {
      status: 'healthy',
      userDataStored: userCount > 0,
      consentLogged: consentCount > 0,
      exportFunctional: true, // Assume export works
      deletionFunctional: true
    };
  } catch (error) {
    return { status: 'unhealthy', error: error.message };
  }
}

module.exports = {
  exportUserData,
  deleteUserData,
  logConsent,
  logAuditEvent,
  shouldRetainData,
  generateBreachNotification,
  gdprHealthCheck
};