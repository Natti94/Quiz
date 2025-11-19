<# Start a minimal Netlify Dev stub for local testing. #>
param(
  [int]$Port = 8888,
  [string]$FunctionsPath = "..\quiz-frontend\netlify\functions",
  [string]$Filter = "quiz-frontend"
)

Write-Host "Starting Netlify Dev (stub) with functions path: $FunctionsPath"
& powershell -NoProfile -ExecutionPolicy Bypass -Command "npx --yes netlify-cli@latest dev --debug --functions $FunctionsPath --port $Port --filter $Filter"
