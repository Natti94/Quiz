<#
PowerShell helper for clearing broken npm/_npx caches, backing up lockfiles,
reinstalling the workspace dependencies and starting Netlify dev with debug.

Usage:
  - From repository root:
      pwsh ./scripts/dev/fix-npm-lock.ps1           # runs the full fix workflow (compat wrapper available at ./scripts/fix-npm-lock.ps1)
  - To only perform quick cleanup (no reinstall):
      pwsh ./scripts/dev/fix-npm-lock.ps1 -Quick

This script is designed for Windows PowerShell. It will:
  1) Stop any running Node processes
  2) Backup package-lock.json files (root & workspaces)
  3) Remove node_modules and lockfiles (optional for thorough cleanup)
  4) Remove npm cache _npx and _locks folders
  5) Verify npm cache
  6) Reinstall dependencies from monorepo root (when not -Quick)
  7) Install netlify-cli globally (optional)
  8) Start Netlify Dev in the frontend workspace with debug

Note: Running this will remove locally installed modules and regenerate a
workspace lockfile. Use with care and ensure you have a git checkpoint if needed.
#>

param(
  [switch]$Quick,            # when set, only clears caches and does not reinstall
  [switch]$GlobalNetlify     # install netlify-cli globally if set
)

function Write-Section($text) {
  Write-Host "`n=== $text ===`n" -ForegroundColor Cyan
}

Write-Section "Compatibility wrapper — forwarding to scripts/dev/fix-npm-lock.ps1"
& "$(Join-Path $PSScriptRoot 'dev\fix-npm-lock.ps1')" @args
return

Write-Section "Fix NPM Lock: Starting"

Write-Host "Node: $(node -v)"
Write-Host "npm: $(npm -v)"

Write-Section "Stopping node processes (if any)"
Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue

Write-Section "Backing up lockfiles"
If (Test-Path .\package-lock.json) { Copy-Item .\package-lock.json .\package-lock.json.backup -Force; Write-Host 'Backed up root package-lock.json' }
If (Test-Path .\quiz-frontend\package-lock.json) { Copy-Item .\quiz-frontend\package-lock.json .\quiz-frontend\package-lock.json.backup -Force; Write-Host 'Backed up frontend package-lock.json' }
If (Test-Path .\quiz-backend-local\package-lock.json) { Copy-Item .\quiz-backend-local\package-lock.json .\quiz-backend-local\package-lock.json.backup -Force; Write-Host 'Backed up backend package-lock.json' }

Write-Section "Removing npm/_npx caches & locks"
$npmCache = Join-Path $env:LOCALAPPDATA "npm-cache"
$npxPath = Join-Path $npmCache "_npx"
$locksPath = Join-Path $npmCache "_locks"
If (Test-Path $npxPath) { Remove-Item -Recurse -Force $npxPath; Write-Host "Removed _npx cache" } else { Write-Host "No _npx cache found" }
If (Test-Path $locksPath) { Remove-Item -Recurse -Force $locksPath; Write-Host "Removed _locks" } else { Write-Host "No _locks found" }

Write-Section "Verify npm cache"
npm cache verify

if (-not $Quick) {
  Write-Section "Removing node_modules and lockfiles (root & workspaces)"
  If (Test-Path .\node_modules) { Remove-Item -Recurse -Force .\node_modules -ErrorAction SilentlyContinue; Write-Host 'Deleted root node_modules' }
  If (Test-Path .\quiz-frontend\node_modules) { Remove-Item -Recurse -Force .\quiz-frontend\node_modules -ErrorAction SilentlyContinue; Write-Host 'Deleted quiz-frontend node_modules' }
  If (Test-Path .\quiz-backend-local\node_modules) { Remove-Item -Recurse -Force .\quiz-backend-local\node_modules -ErrorAction SilentlyContinue; Write-Host 'Deleted quiz-backend-local node_modules' }

  Write-Host "Removing existing package-lock.json files to regenerate a clean workspace lock"
  If (Test-Path .\package-lock.json) { Remove-Item -Force .\package-lock.json -ErrorAction SilentlyContinue; Write-Host 'Removed root package-lock.json' }
  If (Test-Path .\quiz-frontend\package-lock.json) { Remove-Item -Force .\quiz-frontend\package-lock.json -ErrorAction SilentlyContinue; Write-Host 'Removed frontend package-lock.json' }
  If (Test-Path .\quiz-backend-local\package-lock.json) { Remove-Item -Force .\quiz-backend-local\package-lock.json -ErrorAction SilentlyContinue; Write-Host 'Removed backend package-lock.json' }

  Write-Section "Installing dependencies from monorepo root (regenerate lock)"
  npm install --loglevel=info
}

if ($GlobalNetlify) {
  Write-Section "Installing netlify-cli globally (optional)"
  npm install -g netlify-cli@latest
}

Write-Section "Starting Netlify Dev in frontend workspace"
Split-Path -Path $MyInvocation.MyCommand.Path -Parent | Out-Null
cd .\quiz-frontend

Write-Host "Running: npx --yes netlify-cli@latest dev --debug"
npx --yes netlify-cli@latest dev --debug

Write-Section "Fix NPM Lock: Done"
