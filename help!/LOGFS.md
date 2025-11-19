# `logfs` — local ephemeral log store

This repository stores long-term backups like tag listings under `archives/tag-backups/` and developer ephemeral runtime logs under `logfs/`.

Why `logfs`?
- Local runtime log files such as Netlify Dev output, diagnostics from `test-netlify-dev.ps1`, or other short-lived artifacts are not meant to be committed. Use `logfs/` to keep them from cluttering the repository history.

Where should files go?
- Tag backups and their SHA mappings: `archives/tag-backups/` (versioned and often committed)
- Netlify dev logs and other local dev debug output: `logfs/`

Quick commands:
- Move local `logfs` and `archives` files into a shared infra repository (under `logs/`):

  INFRA_GIT_URL=git@github.com:org/infra.git node scripts/infra/move-logs-to-infra.mjs --commit

- Import infra `logs/` into local archive(s):

  INFRA_GIT_URL=git@github.com:org/infra.git node scripts/archiving/move-logs-to-archives.mjs --commit

Notes:
- `logfs/` is listed in `.gitignore` so it won't be accidentally committed.
 - Cron cleanup: this repo has a scheduled GitHub Action `.github/workflows/cleanup-logfs.yml` (weekly) that runs `scripts/infra/clean-logfs.mjs` in a dry-run by default; run the workflow manually with `run=true` to perform deletions.
 - To scan if logs were accidentally committed and untrack them from git, use `node scripts/dev/scan-committed-logs.mjs --remove` (review output first with `--dry-run`).
 - To scan if logs were accidentally committed and untrack them from git, use `node scripts/dev/scan-committed-logs.mjs --remove` (review output first with `--dry-run`). Alternatively use shorthand:

  ```bash
  npm run scan-committed-logs -- --dry-run
  # or to remove from tracking (commits are still required):
  npm run scan-committed-logs -- --remove
  ```

 - To purge old logs locally (default) or on a schedule (via GitHub Actions):

  ```bash
  npm run clean-logfs -- --days 30 --dry-run
  # run for real, remove --dry-run
  npm run clean-logfs -- --days 30
  ```
- Use `--dry-run` and `--force` flags on the helper scripts to check behavior before copying or overwriting anything.
