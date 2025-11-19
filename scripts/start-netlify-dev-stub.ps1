<#
 start-netlify-dev-stub.ps1

 Helper to start Netlify Dev with DEV_STUB enabled and pre-kill local ports.
 This script is Windows Powershell friendly and avoids quoting issues in package.json.
#>

param(
  [int]$Port = 8888,
  [string]$FunctionsPath = "../quiz-frontend/netlify/functions",
  [string]$Filter = "quiz-frontend"
)

Write-Host "Starting Netlify Dev with DEV_STUB enabled" -ForegroundColor Cyan

# Set the environment variable for this session
$env:DEV_STUB = '1'

# Kill common dev ports to avoid collisions
Write-Host "Running kill-local-host-sessions.ps1 to free ports" -ForegroundColor Yellow
& "$(Join-Path $PSScriptRoot 'kill-local-host-sessions.ps1')" -Force

Write-Host "Starting netlify dev (port $Port) with functions in $FunctionsPath" -ForegroundColor Green
cd "$PSScriptRoot/.."

# Launch netlify dev; the current session includes DEV_STUB in environment
& npx --yes netlify-cli@latest dev --debug --functions (Resolve-Path $FunctionsPath).Path --dir ./quiz-frontend --port $Port --filter $Filter
