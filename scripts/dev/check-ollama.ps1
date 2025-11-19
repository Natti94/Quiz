<#
Check-Ollama PowerShell Script
Performs a series of checks to verify Ollama is installed, running, and has the requested model.

Usage:
  powershell -NoProfile -ExecutionPolicy Bypass ./scripts/dev/check-ollama.ps1       # read-only checks
  powershell -NoProfile -ExecutionPolicy Bypass ./scripts/dev/check-ollama.ps1 -PullModel  # pull model if missing

Options:
  -PullModel    Pull the default model if it's missing (uses 'ollama pull').
  -ModelName    Name of the ollama model to check (default: 'llama3.2:latest')

Outputs a concise JSON summary to stdout and returns non-zero exit code on failures.
#>

param(
  [string]$ModelName = 'llama3.2:latest',
  [switch]$PullModel = $false
)

function Write-Section($s) { Write-Host "`n=== $s ===`n" -ForegroundColor Cyan }

$ollamaUrl = if ($env:OLLAMA_API_URL -and $env:OLLAMA_API_URL.Trim().Length -gt 0) { $env:OLLAMA_API_URL } else { 'http://localhost:11434' }
Write-Section "Check-Ollama: Target"
Write-Host "OLLAMA_API_URL: $ollamaUrl"
Write-Host "Model: $ModelName"

$status = [ordered]@{
  timestamp = (Get-Date).ToString("o")
  ollamaCli = $false
  ollamaHttp = $false
  modelPresent = $false
  modelPulled = $false
  generateOK = $false
  errors = @()
}

Write-Section "Checking for ollama CLI"
try {
  $cliV = & ollama --version 2>$null
  if ($LASTEXITCODE -eq 0) { $status.ollamaCli = $true; Write-Host "ollama CLI found: $cliV" } else { Write-Host "ollama CLI not found (exit $LASTEXITCODE)" }
} catch { $status.errors += "ollama CLI not found: $_"; Write-Host "ollama CLI not found" }

Write-Section "Checking Ollama HTTP endpoint"
try {
  $resp = Invoke-WebRequest -Uri $ollamaUrl -Method Head -UseBasicParsing -ErrorAction Stop
  if ($resp.StatusCode -ge 200 -and $resp.StatusCode -lt 400) { $status.ollamaHttp = $true; Write-Host "Ollama HTTP OK: $($resp.StatusCode)" } else { $status.errors += "Ollama HTTP status: $($resp.StatusCode)"; Write-Host "Ollama HTTP returned: $($resp.StatusCode)" }
} catch { $status.errors += "Ollama HTTP failed: $_"; Write-Host "Ollama HTTP failed: $_" }

Write-Section "Checking model presence (ollama list)"
try {
  $list = & ollama list 2>$null | Out-String
  if ($list -ne $null -and $list -match [regex]::Escape($ModelName)) {
    $status.modelPresent = $true
    Write-Host "Model present: $ModelName"
  } else {
    Write-Host "Model not present: $ModelName"
  }
} catch { $status.errors += "ollama list failed: $_"; Write-Host "ollama list failed: $_" }

if (-not $status.modelPresent -and $PullModel) {
  Write-Section "Pulling model: $ModelName"
  try {
    & ollama pull $ModelName 2>&1 | Write-Host
    if ($LASTEXITCODE -eq 0) { $status.modelPulled = $true; Write-Host "Model pulled successfully" } else { $status.errors += "ollama pull exit $LASTEXITCODE"; Write-Host "Model pull exit $LASTEXITCODE" }
  } catch { $status.errors += "ollama pull failed: $_"; Write-Host "ollama pull failed: $_" }
}

Write-Section "Test generation via Ollama HTTP API (if HTTP is up)"
if ($status.ollamaHttp) {
  try {
    $body = @{ model = $ModelName; prompt = "diagnostic check"; stream = $false } | ConvertTo-Json
    $genUri = "$ollamaUrl/api/generate"
    $genResp = Invoke-WebRequest -Uri $genUri -Method Post -ContentType 'application/json' -Body $body -UseBasicParsing -ErrorAction Stop -TimeoutSec 120
    $status.generateOK = $true
    Write-Host "Generate endpoint responded status: $($genResp.StatusCode)"
  } catch { $status.errors += "Generate test failed: $_"; Write-Host "Generate test failed: $_" }
}

Write-Section "Result"
$json = $status | ConvertTo-Json -Depth 5
Write-Host "Summary JSON:"
Write-Host $json

if ($status.ollamaCli -and $status.ollamaHttp -and ($status.modelPresent -or $status.modelPulled) -and $status.generateOK) {
  Write-Host "All checks passed" -ForegroundColor Green
  exit 0
} else {
  Write-Host "One or more checks failed" -ForegroundColor Red
  exit 2
}
