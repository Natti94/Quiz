<# fix-npm-lock helper moved to dev folder #>
param(
  [switch]$Quick,
  [switch]$GlobalNetlify
)

Write-Host "Fix npm lock helper (dev copy)"
# The actual script is the same as the existing logic; to keep maintainers in sync, we call the original file.
& "$(Join-Path $PSScriptRoot '..\fix-npm-lock.ps1')" @args
