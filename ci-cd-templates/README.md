# CI/CD Templates

This directory contains reusable CI/CD templates for different project architectures and technologies.

## Files

### `release-workflow.yml`
GitHub Actions workflow template for automated releases with semantic versioning.

**Features:**
- Conditional logic for monorepo vs single repo setups
- Quality checks (linting, testing, building)
- Automated semantic releases
- Optional Docker image building and deployment
- Slack notifications (configurable)

**Usage:**
1. Copy to `.github/workflows/release.yml`
2. Update repository secrets (GITHUB_TOKEN, NPM_TOKEN, etc.)
3. Customize job conditions based on your project structure
4. Enable/disable optional features as needed

### `.releaserc.json`
Semantic-release configuration template for automated versioning and publishing.

**Features:**
- Standard semantic-release setup
- NPM publishing
- Changelog generation
- GitHub releases
- Git version commits

**Usage:**
1. Copy to root directory as `.releaserc.json`
2. Install semantic-release plugins: `npm install --save-dev semantic-release @semantic-release/changelog @semantic-release/git @semantic-release/github`
3. For monorepos, modify the configuration to disable npm publishing at root level
4. Customize assets array for your build outputs

### `semantic-release-config.js`
JavaScript version of semantic-release config with comments and examples.

**Usage:**
- Use when you need conditional configuration or more complex logic
- Rename to `.releaserc.js` in your project root
- Contains commented examples for monorepo setups and additional plugins

## Project Structure Support

### Single Repository
- Use default configurations
- Enable NPM publishing in `.releaserc.json`
- Set `is_monorepo: false` in workflow

### Monorepo (NPM Workspaces)
- Set `npmPublish: false` in semantic-release config
- Use workspace-specific publishing
- Set `is_monorepo: true` in workflow
- Consider using tools like `lerna` or `changesets` for complex monorepos

## Required Secrets

Add these to your GitHub repository secrets:

- `GITHUB_TOKEN`: Auto-generated, used for creating releases
- `NPM_TOKEN`: For NPM publishing (if applicable)
- `SLACK_WEBHOOK`: For Slack notifications (optional)
- `DOCKER_HUB_TOKEN`: For Docker publishing (optional)

## Customization

### For Different Package Managers
- **Yarn**: Add `yarn` cache and use `yarn publish` in scripts
- **PNPM**: Add `pnpm` cache and configure workspaces
- **Bun**: Similar to npm but with bun-specific commands

### For Different Deployment Targets
- **Netlify**: Use Netlify CLI in deployment job
- **Vercel**: Use Vercel CLI
- **AWS/GCP/Azure**: Use respective CLIs and configure credentials

### For Different Languages
- **Python**: Use `python-semantic-release` instead
- **Java**: Use `jreleaser` or Maven release plugins
- **Go**: Use `goreleaser`

## Commit Message Conventions

Follow conventional commits for proper semantic versioning:

- `feat:` - Minor version bump
- `fix:` - Patch version bump
- `BREAKING CHANGE:` - Major version bump
- `chore:`, `docs:`, `style:`, `refactor:`, `perf:`, `test:` - No version bump

## Troubleshooting

### Release Not Triggering
- Check commit messages follow conventional format
- Verify workflow triggers on correct branches
- Check semantic-release logs in Actions

### NPM Publish Failing
- Verify NPM_TOKEN has correct permissions
- Check package.json version is not "private"
- Ensure package name is available on NPM

### GitHub Release Issues
- Verify GITHUB_TOKEN permissions
- Check if release assets exist at specified paths