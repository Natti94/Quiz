# NPM lock troubleshooting (ECOMPROMISED)

If you see `npm ERR! code ECOMPROMISED` or `npm ERR! Lock compromised` while running `npm install`, `npm run dev:netlify` or `npx netlify-cli@latest dev`, the lockfile or your local npm cache is likely corrupted. Follow this guide to fix it safely.

## Quick summary
1. Run the helper script `scripts/dev/fix-npm-lock.ps1` from the repository root. It automates backup, cache cleanup, reinstall.
2. Or follow the manual steps below (PowerShell, Windows).

## Quick one-liner (PowerShell)
```powershell
cd C:\dev_natti\quiz\quiz-frontend; pwsh ..\scripts\dev\fix-npm-lock.ps1
```

## Manual Steps (detailed)
1. Navigate to the repository root:
```powershell
cd C:\dev_natti\quiz
```

2. Backup current lock files and package state (optional but recommended):
```powershell
Copy-Item package-lock.json package-lock.json.backup -ErrorAction SilentlyContinue
If (Test-Path .\quiz-frontend\package-lock.json) { Copy-Item .\quiz-frontend\package-lock.json .\quiz-frontend\package-lock.json.backup }
The helper now supports saving backups into `archives/lock-backups/` to avoid cluttering the repo root.
Run the automated helper before other steps:

```
npm run backup:package-locks
# or: node ./scripts/backups/backup-package-locks.mjs --commit
```

This will create timestamped backups under `archives/lock-backups/` instead of `package-lock.json.backup` in the repository root.
```

3. Remove node_modules and lock files:
```powershell
Remove-Item -Path node_modules -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item -Path .\quiz-frontend\node_modules -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item -Path package-lock.json -Force -ErrorAction SilentlyContinue
Remove-Item -Path .\quiz-frontend\package-lock.json -Force -ErrorAction SilentlyContinue
```

4. Clear and verify npm cache:
```powershell
npm cache clean --force
npm cache verify
```

5. Reinstall dependencies (from root to re-generate lock):
```powershell
npm install
```

6. Optional: Start Netlify Dev after install:
```powershell
npm run dev:netlify
# or
npx --yes netlify-cli@latest dev
```

## Prevention tips
- Avoid editing `package-lock.json` by hand.
- Keep `package-lock.json` committed to source control; if a lockfile becomes corrupted you can revert.
- Use consistent Node and npm versions across team/dev machines.
- Don't run concurrent npm installs in the same repo; they can race the lockfile.
- Run `npm cache verify` periodically when troubleshooting.

## Reference to automated helper
- The script `scripts/dev/fix-npm-lock.ps1` implements the above workflow with a `-Quick` flag to skip reinstall.
- GitHub Actions & CI: consider adding a `fix-npm-lock` or `npm cache verify` check in developer tooling if this happens often.

---

If you want, I can:
- Add a small Windows/Posix script that runs the fix automatically.
- Add a CI action (optional) that checks for ECOMPROMISED in release steps and warns.
