## Semantic Release — Troubleshooting Guide

This guide collects common problems encountered when running `semantic-release` locally or in CI and step-by-step fixes. It focuses on issues we've seen in this repository: missing plugins, Windows file-lock (esbuild) errors during `npm ci`, missing GitHub token (ENOGHTOKEN), and the `TypeError: Invalid date` coming from the release-notes generator.

### Quick checklist

- Stop any local dev servers/watchers that may hold file handles (Vite, Netlify dev, esbuild, editors).
- Run `npm ci` from the repo root so semantic-release and its plugins are installed.
- Provide a GitHub token in `GITHUB_TOKEN` or `GH_TOKEN` to allow the GitHub plugin to verify conditions when running the full pipeline.

---

## Reproduce locally (dry-run)

Run these from PowerShell in the repo root.

```powershell
# install dependencies (only do after stopping dev servers)
npm ci

# run semantic-release in dry-run mode
$env:GITHUB_TOKEN = '<YOUR_TOKEN>'
npx semantic-release --dry-run
Remove-Item Env:GITHUB_TOKEN
```

If `semantic-release` fails early with ENOGHTOKEN, set a token as above. If it fails earlier with "Cannot find module '@semantic-release/changelog'" make sure `npm ci` completed successfully (see below).

---

## Common failures and fixes

1) EPERM error during `npm ci` referencing `esbuild.exe` (Windows)

Symptoms:

- Error: EPERM: operation not permitted, unlink '...\node_modules\@esbuild\win32-x64\esbuild.exe'

Cause and quick fixes:

- A running process (dev server / watcher / editor or antivirus) has locked the binary.
- Stop any processes that may use `esbuild` (Vite dev, Netlify dev). If unsure, reboot to clear locks.

PowerShell options:

```powershell
# Try to stop Node processes (careful — this will stop all node processes)
Get-Process node | Stop-Process -Force

# If still blocked, remove the file as Administrator and reinstall
Start-Process powershell -Verb RunAs -ArgumentList {
  Remove-Item -LiteralPath 'C:\dev_natti\quiz\node_modules\@esbuild\win32-x64\esbuild.exe' -Force
  cd C:\dev_natti\quiz; npm ci
}
```

If you don't want to delete files, reboot and retry `npm ci`.

2) Cannot find module '@semantic-release/changelog'

Symptoms:

- Running `npx semantic-release --dry-run` shows module not found for a semantic-release plugin.

Fix:

- Install dependencies at the repository root: `npm ci` (or `npm install`). Ensure workspace deps are installed if using npm workspaces.

3) ENOGHTOKEN / No GitHub token specified

Symptoms:

- semantic-release complains: "No GitHub token specified" and exits during `verifyConditions` for `@semantic-release/github`.

Fix:

- Set `GITHUB_TOKEN` (or `GH_TOKEN`) in your environment for local dry-runs. Use a personal access token with repo permissions. Example (PowerShell):

```powershell
$env:GITHUB_TOKEN = 'ghp_XXXXXXXXXXXXXXXX'
npx semantic-release --dry-run
Remove-Item Env:GITHUB_TOKEN
```

Do NOT commit tokens to source. In CI, use the repository secret (e.g., `GITHUB_TOKEN`) or a personal token stored in the runner's secrets.

4) TypeError: Invalid date (from release-notes generator)

Symptoms:

- semantic-release fails in `@semantic-release/release-notes-generator` or in `conventional-changelog-writer` with `TypeError: Invalid date`.

Cause:

- The generator parses commit metadata (author/committer dates). If a commit has a malformed or missing date field, the date parsing utility throws.

How to find offending commits

1. Print commits with author and committer ISO dates and scan for empty/malformed entries:

```powershell
git log --pretty=format:"%H | %an <%ae> | author:%aI | committer:%cI" --reverse > commits-dates.txt
notepad commits-dates.txt
```

2. If you suspect a specific range, inspect a single commit in detail:

```powershell
git show --pretty=fuller <commit-hash>
```

3. Run semantic-release in debug mode to get more context (after setting `GITHUB_TOKEN`):

```powershell
$env:DEBUG = 'semantic-release*'
npx semantic-release --dry-run
Remove-Item Env:DEBUG
```

Fixing the commit date

- If the bad commit is safe to rewrite (only on branches not shared or if the team agrees), you can amend the committer date and force-push:

```powershell
# example: reset the committer date for a single commit
GIT_COMMITTER_DATE="2025-11-20T12:00:00+01:00" git commit --amend --no-edit --date "2025-11-20T12:00:00+01:00"
git push --force-with-lease origin main
```

- If rewriting history is not acceptable, consider one of these workarounds:
  - Configure the release-notes generator to ignore problematic commits (advanced).
  - Upgrade/downgrade `conventional-changelog-writer`/`semantic-release` to a version that tolerates the metadata (not guaranteed).

Notes about rewriting history: rewriting published branches will disrupt collaborators and CI. Prefer non-destructive fixes when possible.

---

## Quick troubleshooting flow (summary)

1. Stop dev servers, close editors that may lock files.
2. Run `npm ci` from repo root.
3. If `npm ci` errors with EPERM, reboot or stop node processes and retry.
4. Set `GITHUB_TOKEN` in environment and run `npx semantic-release --dry-run`.
5. If `Invalid date` appears, run the `git log` command above and inspect suspect commits; use `git show` to review metadata.
6. Fix commit dates (if safe) or apply a non-destructive workaround.

---

If you'd like, I can:

- Run the debug dry-run for you if you temporarily set `GITHUB_TOKEN` in this terminal and confirm it's safe to use.
- Search the current repo for commits with empty committer dates using a small Node script and share the suspects.

Add this file into `help!/` so other contributors can follow these steps.
