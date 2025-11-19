#<
# fix-npm-lock helper moved to dev folder
#
# This script performs a safe cleanup and re-install to resolve npm ECOMPROMISED lock issues.
# See HELP/NPM-LOCK-FIX.md for detailed manual steps and prevention tips.
#>
param(
  [switch]$Quick,
  [switch]$GlobalNetlify
)

Write-Host "Fix npm lock helper (dev copy)"
# The actual script is the same as the existing logic; to keep maintainers in sync, we call the original file.
& "$(Join-Path $PSScriptRoot '..\fix-npm-lock.ps1')" @args
