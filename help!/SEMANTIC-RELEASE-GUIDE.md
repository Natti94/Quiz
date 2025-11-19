# Semantic Release & Conventional Commits — Quick Guide

This repo uses Conventional Commits + semantic-release to automate changelogs, version bumps and GitHub Releases. This guide explains commit message convention, how to trigger releases locally, and the small repo-specific steps (subpackages and lockfile backups).

## Conventional Commit basics
- Format: `<type>(<scope>)?: <subject>`
- Optional body and footers follow the subject, separated by a blank line.
- Breaking changes:
  - Add a `!` after the `type` or `scope`: `feat!: drop Node 12 support` — OR — add a footer `BREAKING CHANGE: reason and migration`.

Common types used here (and how semantic-release maps them):
- feat: a new feature -> minor release
- fix: a bug fix -> patch release
- perf: performance improvement -> patch release
- docs: documentation only; will not change release version unless other commits change it
- style: white-space, formatting, missing semi-colons — no effect on release
- refactor: code change that neither fixes a bug nor adds a feature — no effect on release
- test: tests; no effect on release
- chore: maintenance tasks; no effect
- build: changes that affect build system or external dependencies
- ci: changes to CI configuration and workflow files

Examples:
- `feat(ui): add summary screen for exam`
- `fix(auth): prevent double logout when session expires`
- `feat!: remove deprecated API endpoint` (major)
- `chore(release): bump root version via semantic-release` (used by the release process)

## Footers
- `BREAKING CHANGE:` — provides a detailed description and will cause a major bump.
- `Closes #123` — can mention issue numbers but does not affect versioning.

## Local release testing & tips
- Run semantic-release in dry-run mode locally to see what would happen (no change to repository):

  ```bash
  npx semantic-release --dry-run
  ```

- On CI this repository uses `npx semantic-release` (see `.github/workflows/release.yml`).
- semantic-release uses `@semantic-release/commit-analyzer` with the "conventionalcommits" preset. That means release type is inferred from commit messages.
- The repo also uses a local plugin: `scripts/release/semantic-release-update-subpackages.mjs`. This updates subpackage versions for monorepos as part of the `prepare` step.

## How to write commits that trigger the right release
- Want a patch? Use `fix:` or `perf:`. Example:
  - `fix(loader): handle 0-length CSV` → patch
- Want a minor? Use `feat:`. Example:
  - `feat(leaderboard): add user rank to response` → minor
- Want a major? Add a breaking change. Example:
  - `feat!: remove v1 API support` or add body/footers with `BREAKING CHANGE:`

## Releasing (recommended flow)
1. Commit your changes following Conventional Commits.
2. Push to main (or a branch that your CI uses for release). The `release` workflow will run semantic-release and publish a new GitHub Release, bump the version, and update `CHANGELOG.md`.
3. If you need to run a release locally for debugging, run `npx semantic-release --dry-run` and validate the output. Do not run the actual `npx semantic-release` locally unless you know how to set up GitHub tokens and NPM tokens; releases are typically handled by CI.

## Subpackages & `prepare` step
- This repo runs a custom plugin in the `prepare` stage (see `.releaserc.json` and `scripts/release/semantic-release-update-subpackages.mjs`) to update subpackage versions across workspaces before the release commit.
- Do not manually update subpackage versions unless you intend to bypass the plugin — the local plugin ensures consistent workspaces.

## Lock backups
- Before running any local release/tooling that touches `package-lock.json` or `quiz-frontend/package-lock.json`, run the lock backup script:

  ```bash
  npm run backup:package-locks
  # or: node ./scripts/backups/backup-package-locks.mjs --commit
  ```

- Backups are written to `archives/lock-backups/` using a timestamp and project name — we keep these in the repo by default for audits and troubleshooting.

## Want stricter enforcement?
- Add a commit-lint rule and a commitizen config to help authors format messages.
- Add a PR check that runs `npx semantic-release --dry-run` or checks `commit-analyzer` output for PR-level sanity tests.

## Troubleshooting
- If semantic-release fails on CI, run locally with `--dry-run` to inspect what it would have done. Make sure `GITHUB_TOKEN` or `GH_TOKEN` and other secrets are configured for CI.
- If you accidentally commit a generated file or a log to `main`, see `help!/LOGFS.md` for guidance on moving generated files to `logfs/` or `archives/` and untracking them with `scan-committed-logs`.

---
Saved help & next steps:
- Add a commit-lint + commitizen flow if you want a guided commit process.
- Add an optional PR check to guard accidental `.*.log` commits.

For anything more strict, tell me which enforcement you want and I'll add it.