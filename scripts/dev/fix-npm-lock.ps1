#<
# fix-npm-lock helper moved to dev folder
#
# This script performs a safe cleanup and re-install to resolve npm ECOMPROMISED lock issues.
# See help!/NPM-LOCK-FIX.md for detailed manual steps and prevention tips.
#>
param(
  [switch]$Quick,
  [switch]$GlobalNetlify
)

Write-Host "Fix npm lock helper (dev copy)"
# Before making changes, save a backup of any package-lock files to archives/lock-backups
Write-Host "Backing up package-lock.json files to archives/lock-backups/"
cd $PSScriptRoot\..; node ./scripts/backups/backup-package-locks.mjs

# The actual script is the same as the existing logic; to keep maintainers in sync, we call the original file (if present).
if (Test-Path (Join-Path $PSScriptRoot '..\fix-npm-lock.ps1')) {
  & "$(Join-Path $PSScriptRoot '..\fix-npm-lock.ps1')" @args
} else {
  Write-Host "Original fix script missing; please run the recommended manual steps from help!/NPM-LOCK-FIX.md" -ForegroundColor Yellow
}
