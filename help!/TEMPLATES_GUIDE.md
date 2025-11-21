## Templates Guide

This directory contains comprehensive templates and guides for implementing various development processes, integrations, and automation scripts across different technologies and architectures.

## 📁 Files Overview

### 📖 `TEMPLATES_GUIDE.md`
**Complete templates guide** covering:
- Template organization and naming conventions
- Variable substitution and customization
- Template categories and use cases
- Implementation examples and best practices
- Testing and validation strategies
- Contributing guidelines for new templates

### 📁 `templates/`
**Core application templates**:
- `netlify-serverless-llm.js` - Serverless LLM API endpoints
- `express-mongodb-llm.js` - Full-stack LLM with MongoDB
- `express-postgresql-llm.js` - Enterprise LLM with PostgreSQL
- `express-simple-llm.js` - Simple LLM prototyping
- `cli-llm.js` - Command-line LLM tools
- `README.md` - Template usage documentation

### 📁 `ci-cd-templates/`
**CI/CD pipeline templates**:
- `release-workflow.yml` - GitHub Actions release automation
- `.releaserc.json` - Semantic-release configuration
- `README.md` - CI/CD setup and customization guide

### 📁 `security-templates/`
**Security implementation templates**:
- `csp-middleware.js` - Content Security Policy middleware
- `input-validation.js` - XSS prevention and validation
- `security-tests.js` - Security test suites
- `README.md` - Comprehensive security guide

### 📁 `optimization-templates/`
**Performance optimization templates**:
- `bundle-analyzer.mjs` - Bundle analysis and reporting
- `minify-js.mjs` - JavaScript minification scripts
- `performance-monitor.mjs` - Performance tracking
- `README.md` - Optimization strategies and guides

### 📁 `cookie-templates/`
**Cookie compliance templates**:
- `cookie-banner-react.jsx` - React cookie consent banner
- `cookie-utils.js` - Cookie management utilities
- `express-cookie-middleware.js` - Server-side cookie handling
- `README.md` - GDPR cookie compliance guide

### 📁 `archives/templates/`
**Archiving and backup templates**:
- `archive-netlify-logs.mjs` - Netlify function log archiving
- `archive-semantic-release.mjs` - CI/CD artifact archiving
- `archive-runtime-logs.mjs` - Application log rotation
- `archive-database.mjs` - Database backup templates
- `archive-ci-artifacts.mjs` - Build output archiving

## 🚀 Quick Start

### 1. Install Template Dependencies
```bash
npm install --save-dev fast-glob handlebars ejs mustache
```

### 2. Basic Template Usage
```bash
# Copy and customize a template
cp templates/express-simple-llm.js my-app/server.js

# Use variable substitution
node scripts/templates/apply-template.mjs templates/express-simple-llm.js config.json

# Validate template syntax
node scripts/templates/validate-templates.mjs
```

### 3. Add to package.json Scripts
```json
{
  "scripts": {
    "template:validate": "node scripts/templates/validate-templates.mjs",
    "template:apply": "node scripts/templates/apply-template.mjs",
    "template:list": "node scripts/templates/list-templates.mjs"
  }
}
```

## 🔧 Configuration

### Template Variables
Configure variable substitution in templates:
- Use `{{VARIABLE_NAME}}` for Handlebars-style substitution
- Use `<%= VARIABLE_NAME %>` for EJS-style templates
- Define defaults in template headers
- Validate required variables before application

### Template Categories
Organize templates by purpose:
- **API Templates** - Backend service implementations
- **Frontend Templates** - UI component and page templates
- **Infrastructure Templates** - Deployment and configuration
- **Security Templates** - Authentication and authorization
- **Testing Templates** - Test suite and mocking utilities

### Validation Rules
Set up template validation:
- Syntax checking for target languages
- Required variable validation
- Security scanning for sensitive content
- Dependency verification

## 📊 Template Metrics

Track these template KPIs:

- **Usage Rate** - Templates applied per month
- **Success Rate** - Percentage of successful template applications
- **Customization Rate** - Average variables modified per template
- **Error Rate** - Template application failures
- **Maintenance Cost** - Time spent updating templates

## 🛠️ Customization

### For Different Template Engines

**Handlebars Templates:**
```javascript
const handlebars = require('handlebars');

const template = handlebars.compile(source);
const result = template(variables);
```

**EJS Templates:**
```javascript
const ejs = require('ejs');

const result = await ejs.renderFile(templatePath, variables, options);
```

**Mustache Templates:**
```javascript
const mustache = require('mustache');

const result = mustache.render(template, variables);
```

### For Different Output Formats

**File Generation:**
```javascript
const fs = require('fs');
const path = require('path');

function generateFromTemplate(templatePath, outputPath, variables) {
  const template = fs.readFileSync(templatePath, 'utf8');
  const result = processTemplate(template, variables);
  const outputDir = path.dirname(outputPath);

  fs.mkdirSync(outputDir, { recursive: true });
  fs.writeFileSync(outputPath, result);
}
```

**Directory Structures:**
```javascript
const { copy } = require('fs-extra');

async function scaffoldFromTemplate(templateDir, outputDir, variables) {
  await copy(templateDir, outputDir);

  // Process all template files
  const files = await glob('**/*.{js,ts,json,md}', { cwd: outputDir });
  for (const file of files) {
    const content = fs.readFileSync(path.join(outputDir, file), 'utf8');
    const processed = processTemplate(content, variables);
    fs.writeFileSync(path.join(outputDir, file), processed);
  }
}
```

## 🚨 Best Practices

### Template Design
- Keep templates focused and single-purpose
- Use clear variable naming conventions
- Include comprehensive documentation
- Provide example configurations
- Test templates across different environments

### Variable Management
- Define variable schemas with types and defaults
- Validate variable values before substitution
- Use environment-specific variable sets
- Document variable purposes and formats

### Security Considerations
- Never include secrets in templates
- Sanitize user-provided variable values
- Validate file paths and commands
- Implement template content scanning

### Maintenance
- Regularly update templates for new dependencies
- Test templates against current runtimes
- Deprecate outdated templates gracefully
- Maintain backward compatibility

## 📚 Additional Resources

- [Handlebars Documentation](https://handlebarsjs.com/)
- [EJS Template Engine](https://ejs.co/)
- [Mustache Logic-less Templates](https://mustache.github.io/)
- [Template Metaprogramming](https://en.wikipedia.org/wiki/Template_metaprogramming)

## 🤝 Contributing

When adding new templates:
1. Follow naming conventions and categorization
2. Include comprehensive documentation
3. Add validation and test cases
4. Update the templates guide
5. Provide usage examples

## 📞 Support

For template questions:
- Check the templates guide first
- Review template documentation
- Test templates in isolated environments
- Validate variable configurations

---

**Pro Tip:** Start with simple copy-and-modify templates, then progress to sophisticated templating systems as your project scales. Always validate templates before production use.
