This directory organizes runnable helper scripts used across the repository.

Categories
- dev/  — developer-only helpers (PowerShell). Examples: check-ollama.ps1, self-audit.ps1, test-netlify-dev.ps1. These scripts may be interactive and are not intended for CI.
 - dev/  — developer-only helpers (PowerShell). Examples: check-ollama.ps1, self-audit.ps1, test-netlify-dev.ps1. These scripts may be interactive and are not intended for CI.
 - NPM lock troubleshooting — see `help!/NPM-LOCK-FIX.md` for curated guidance and quick PowerShell fixes.
 - Semantic releases — see `help!/SEMANTIC-RELEASE-GUIDE.md` for Conventional Commit usage and release tips.
 - Netlify function tests — the `tests/netlify/functions` folder contains small function helpers used during Netlify Dev testing. Use `npm run test:netlify-dev:with-tests` (root or frontend) to copy these tests into the running functions directory, run the test suite, then clean them up.
- formatting/ — formatters and cleanup scripts used for repository maintenance.
- backups/ — tag backup and restore helpers. These scripts interact with tags and the `archives/` folder.
- release/ — release helpers invoked by `semantic-release` and other publication steps.
- infra/ — helpers to import/export logs or backups to an external infra repository.

Compatibility wrappers
- Top-level scripts (e.g. `scripts/check-ollama.ps1`) are thin forwarders for a short transition period. They simply call the canonical script under `scripts/dev/` or another category.
- Best practice: update any automation, local shell scripts, or documentation to call the canonical script under `scripts/<category>/` directly.
- Once all references are updated and a release cycle has passed, the wrappers can be removed during a clean-up commit.

How to use
- For local development, call the canonical dev script directly, e.g.:
  pwsh -NoProfile -ExecutionPolicy Bypass ./scripts/dev/check-ollama.ps1

- For CI flows, prefer non-interactive flags or use the headless Node scripts under `scripts/backups` and `scripts/release`.

Transition plan (recommended)
- Keep wrappers for one release. Notify integrators that canonical script paths have changed.
- After 1 release cycle, remove wrappers in a follow-up cleanup PR.

Notes
- Do not store large logs on the main branch. Use `archives/` for small snapshots and an external infra repo or CI artifacts for large backups.
