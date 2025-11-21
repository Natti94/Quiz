## Archiving Guide

This directory contains comprehensive templates and guides for implementing systematic archiving, backup, and retention policies for development artifacts, runtime logs, and important project files.

## 📁 Files Overview

### 📖 `ARCHIVING_GUIDE.md`
**Complete archiving guide** covering:
- Lockfile backup strategies and automation
- Runtime log management and rotation
- Tag backup and metadata preservation
- Retention policies and cleanup procedures
- CI/CD integration for automated archiving
- Security considerations for archived data

### 📦 `archives/lock-backups/`
**Lockfile backup storage**:
- Timestamped package-lock.json backups
- Automated backup scripts
- Version history preservation
- Quick restoration procedures

### 📝 `archives/tag-backups/`
**Git tag metadata archives**:
- Complete tag information dumps
- Tagger details and timestamps
- Historical tag snapshots
- Troubleshooting reference data

### 📋 `archives/logfs-archive/`
**Rotated runtime logs**:
- Compressed log archives
- Age-based rotation
- Space management
- Audit trail preservation

### 🔧 `archives/templates/`
**Archiving templates for different data types**:
- `archive-netlify-logs.mjs` - Netlify function logs and deployment data
- `archive-semantic-release.mjs` - Semantic-release dry runs and CI artifacts
- `archive-runtime-logs.mjs` - Application runtime logs and error tracking
- `archive-database.mjs` - Database backups and schema dumps
- `archive-ci-artifacts.mjs` - CI/CD artifacts and build outputs

### 🔧 `logfs/`
**Ephemeral runtime logs**:
- Development session logs
- CI/CD pipeline outputs
- Debug information storage
- Temporary diagnostic data

## 🚀 Quick Start

### 1. Install Archiving Dependencies
```bash
npm install --save-dev fast-glob tar fs-extra
```

### 2. Basic Archiving Workflow
```bash
# Create lockfile backup
npm run backup:package-locks

# Archive old logs
npm run archive:rotate-logs

# Backup git tags
npm run backup:tags

# Clean up old archives
npm run archive:cleanup
```

### 3. Using Archiving Templates
```bash
# Archive Netlify function logs and deployments
node archives/templates/archive-netlify-logs.mjs --site-id your-site-id --days 7

# Archive semantic-release dry runs and CI artifacts
node archives/templates/archive-semantic-release.mjs --days 30 --include-artifacts

# Archive application runtime logs
node archives/templates/archive-runtime-logs.mjs --days 7 --rotate

# Archive database backups and schema
node archives/templates/archive-database.mjs --type mongodb --days 30

# Archive CI/CD artifacts and build outputs
node archives/templates/archive-ci-artifacts.mjs --days 14 --include-builds
```

### 4. Add to package.json Scripts
```json
{
  "scripts": {
    "backup:package-locks": "node scripts/backups/backup-package-locks.mjs",
    "backup:tags": "node scripts/backups/backup-git-tags.mjs",
    "archive:rotate-logs": "node scripts/archiving/rotate-logs.mjs",
    "archive:cleanup": "node scripts/archiving/cleanup-old-archives.mjs",
    "archive:all": "npm run backup:package-locks && npm run backup:tags && npm run archive:rotate-logs"
  }
}
```

## 🔧 Configuration

### Lockfile Backup Settings
Edit backup scripts to customize:
- Backup frequency and naming patterns
- Retention periods for old backups
- Compression options
- Storage location configuration

### Log Rotation Configuration
Configure in rotation scripts:
- Age thresholds for log rotation
- Compression algorithms
- Archive naming conventions
- Space usage limits

### Tag Backup Options
Customize tag backup scripts for:
- Tag filtering (annotated vs lightweight)
- Metadata inclusion levels
- Backup frequency
- Historical data retention

## 📊 Generated Archives

The archiving scripts create several types of archives:

- **`package-lock.{timestamp}.backup`** - Lockfile snapshots with timestamps
- **`tag-backup-{timestamp}.txt`** - Complete git tag metadata dumps
- **`logfs-archive-{date}.tgz`** - Compressed rotated logs
- **`archive-manifest.json`** - Inventory of all archived items

## 🔄 CI/CD Integration

### GitHub Actions Workflow
```yaml
# .github/workflows/archive.yml
name: Archive & Backup

on:
  push:
    branches: [ main ]
  schedule:
    # Run daily at 2 AM UTC
    - cron: '0 2 * * *'

jobs:
  archive:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm

      - run: npm ci
      - run: npm run archive:all

      - uses: actions/upload-artifact@v4
        with:
          name: archives-${{ github.run_number }}
          path: archives/
          retention-days: 30
```

### Automated Cleanup
```yaml
# .github/workflows/cleanup.yml
name: Cleanup Archives

on:
  schedule:
    # Run weekly on Sundays
    - cron: '0 3 * * 0'

jobs:
  cleanup:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm run archive:cleanup
      - run: git add archives/ && git commit -m "chore: cleanup old archives" || true
      - run: git push
```

## 📈 Archiving Metrics

Track these archiving KPIs:

- **Backup Success Rate** - Percentage of successful automated backups
- **Storage Usage** - Archive directory size over time
- **Retention Compliance** - Age of oldest retained archives
- **Recovery Time** - Time to restore from backups
- **Archive Integrity** - Verification of backup integrity

## 🛠️ Customization

### For Different Storage Backends

**AWS S3:**
```javascript
// scripts/archiving/upload-to-s3.mjs
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');

const s3Client = new S3Client({ region: process.env.AWS_REGION });
await s3Client.send(new PutObjectCommand({
  Bucket: process.env.ARCHIVE_BUCKET,
  Key: `archives/${filename}`,
  Body: archiveData
}));
```

**Google Cloud Storage:**
```javascript
// scripts/archiving/upload-to-gcs.mjs
const { Storage } = require('@google-cloud/storage');

const storage = new Storage();
const bucket = storage.bucket(process.env.ARCHIVE_BUCKET);
await bucket.upload(localPath, {
  destination: `archives/${filename}`
});
```

### For Different Archive Formats

**ZIP Archives:**
```javascript
const archiver = require('archiver');

const output = fs.createWriteStream(archivePath);
const archive = archiver('zip', { zlib: { level: 9 } });
archive.pipe(output);
archive.directory(sourceDir, false);
await archive.finalize();
```

**7-Zip High Compression:**
```bash
# For maximum compression
7z a -t7z -m0=lzma2 -mx=9 archive.7z source/
```

## 🚨 Best Practices

### Backup Strategies
- Implement 3-2-1 backup rule (3 copies, 2 media types, 1 offsite)
- Test backup restoration regularly
- Encrypt sensitive archived data
- Monitor backup success/failure

### Log Management
- Rotate logs before they consume too much space
- Compress old logs for long-term storage
- Implement log level filtering
- Set appropriate retention periods

### Security Considerations
- Never archive secrets or sensitive data
- Encrypt archives containing PII
- Implement access controls for archives
- Regular security audits of archived data

### Performance Optimization
- Compress archives to save storage space
- Use incremental backups when possible
- Schedule archiving during low-usage periods
- Monitor archive creation performance

## 📚 Additional Resources

- [3-2-1 Backup Strategy](https://www.backblaze.com/blog/the-3-2-1-backup-strategy/)
- [Log Rotation Best Practices](https://www.linuxjournal.com/article/6914)
- [Git Data Recovery](https://git-scm.com/book/en/v2/Git-Internals-Maintenance-and-Data-Recovery)
- [Archive Formats Comparison](https://en.wikipedia.org/wiki/Comparison_of_file_archivers)

## 🤝 Contributing

When adding archiving features:
1. Update the archiving guide
2. Add corresponding tests
3. Update CI/CD workflows
4. Document configuration options
5. Test with real backup scenarios

## 📞 Support

For archiving questions:
- Check the archiving guide first
- Review archive manifests for inventory
- Monitor CI/CD pipeline results
- Regular backup integrity audits recommended

---

**Pro Tip:** Start with basic lockfile backups and log rotation, then gradually add more sophisticated archiving as your project grows. Always test restoration procedures to ensure backups are reliable.
