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
 - Manual cleanup: this repo provides a dispatchable GitHub Action `.github/workflows/cleanup-logfs.yml` to run `scripts/infra/clean-logfs.mjs` on-demand from the Actions UI (it runs as a dry-run by default, set `run=true` when you want to delete). We intentionally don't run cleanup on a schedule; we prefer manual handling.
 - To scan if logs were accidentally committed and untrack them from git, use `node scripts/dev/scan-committed-logs.mjs --remove` (review output first with `--dry-run`).
 - To scan if logs were accidentally committed and untrack them from git, use `node scripts/dev/scan-committed-logs.mjs --remove` (review output first with `--dry-run`). Alternatively use shorthand:

  ```bash
  npm run scan-committed-logs -- --dry-run
  # or to remove from tracking (commits are still required):
  npm run scan-committed-logs -- --remove
  ```

 - To purge old logs locally (default) or on a schedule (via GitHub Actions):
 - To scan and move known generated files from the repository root into sensible locations (archives or `logfs`), use:

  ```bash
  # Dry-run: list which files would be moved
  npm run move-generated-root -- --dry-run

  # Actually move and untrack from git
  npm run move-generated-root -- --untrack --commit
  ```

  This script uses a default set of simple rules for common generated artifacts (logs, lockfile backups, deno.lock). You can customize the rules via a JSON file:
  ```bash
  node ./scripts/infra/move-root-generated.mjs --rules ./my-rules.json --dry-run

  The repo includes default rules in `scripts/infra/generated-root-rules.json` — use this as a starting point.
  ```

  ```bash
  npm run clean-logfs -- --days 30 --dry-run
  # run for real, remove --dry-run
  npm run clean-logfs -- --days 30
  ```
- Use `--dry-run` and `--force` flags on the helper scripts to check behavior before copying or overwriting anything.
