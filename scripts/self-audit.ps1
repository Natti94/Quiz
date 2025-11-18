<#
Self-Audit PowerShell Script
Collects environment information, Netlify and Ollama status, and npm logs.
It can optionally run a quick or full fix for npm lock issues via existing fix-npm-lock.ps1.

Usage:
  pwsh -NoProfile -ExecutionPolicy Bypass ./scripts/self-audit.ps1         # read-only audit
  pwsh -NoProfile -ExecutionPolicy Bypass ./scripts/self-audit.ps1 -Fix  # run quick fix
  pwsh -NoProfile -ExecutionPolicy Bypass ./scripts/self-audit.ps1 -Fix -FullFix -GlobalNetlify

Notes:
  - This script does not change files unless -Fix is passed.
  - Logs are saved to ./logs/self-audit-<timestamp>.log
#>

param(
  [switch]$Fix = $false,
  [switch]$FullFix = $false,
  [switch]$GlobalNetlify = $false
)

function Write-Section($s) { Write-Host "`n=== $s ===`n" -ForegroundColor Cyan }

$root = Split-Path -Parent $MyInvocation.MyCommand.Path | Resolve-Path | Select-Object -ExpandProperty Path
$logDir = Join-Path $root "..\logs" | Resolve-Path -ErrorAction SilentlyContinue
If (-not $logDir) { New-Item -Path (Join-Path $root "..\logs") -ItemType Directory -Force | Out-Null; $logDir = Join-Path $root "..\logs" }
$timestamp = Get-Date -Format "yyyyMMdd-HHmmss"
$logFile = Join-Path $logDir "self-audit-$timestamp.log"

Write-Host "Self-audit started. Log: $logFile"
Start-Transcript -Path $logFile -Force | Out-Null

try {
  Write-Section "Date / CWD"
  Get-Date
  Get-Location

  Write-Section "Node / NPM / Netlify"
  try { node -v } catch { Write-Host "node not found" }
  try { npm -v } catch { Write-Host "npm not found" }
  try { npx --yes netlify-cli@latest --version } catch { Write-Host "netlify-cli not available via npx" }
  try { netlify -v } catch { Write-Host "netlify not installed globally" }

  Write-Section "Netlify.toml & Function files listing (frontend workspace)"
  if (Test-Path "$root\..\quiz-frontend\netlify.toml") { Get-Content "$root\..\quiz-frontend\netlify.toml" -ErrorAction SilentlyContinue } else { Write-Host "No netlify.toml in quiz-frontend" }
  if (Test-Path "$root\..\quiz-frontend\netlify\functions") { Get-ChildItem "$root\..\quiz-frontend\netlify\functions" -Name | ForEach-Object { Write-Host " - $_" } } else { Write-Host "No functions directory found in quiz-frontend\netlify\functions" }

  Write-Section "Netlify Dev process listening on default ports (8888) and Ollama (11434)"
  try { Get-NetTCPConnection -LocalPort 8888 -ErrorAction SilentlyContinue | Format-List } catch { Write-Host "No netstat support or not privileged" }
  try { Get-NetTCPConnection -LocalPort 11434 -ErrorAction SilentlyContinue | Format-List } catch { Write-Host "No netstat support or not privileged" }

  Write-Section "Node processes command lines (to see netlify/ollama if started as node)"
  try { Get-WmiObject Win32_Process -Filter "Name = 'node.exe'" | Select-Object ProcessId,CommandLine | Format-Table -AutoSize } catch { Write-Host "Could not enumerate node processes via WMI" }

  Write-Section "Selected env variables"
  Get-ChildItem Env:AI_PROVIDER,Env:OLLAMA_API_URL,Env:OLLAMA_API_KEY,Env:GROQ_API_KEY,Env:HUGGINGFACE_API_KEY,Env:VITE_AUTH_API_BASE_URL -ErrorAction SilentlyContinue | Format-Table Name,Value -AutoSize

  Write-Section "OLLAMA: list models + health checks (if ollama CLI exists)"
  try { & ollama list 2>$null | Out-String | Write-Host } catch { Write-Host "ollama CLI not found or not in PATH" }
  try { Invoke-WebRequest -Uri http://localhost:11434/ -Method Head -UseBasicParsing -ErrorAction SilentlyContinue | Select-Object StatusCode, StatusDescription | Out-String | Write-Host } catch { Write-Host "curl to Ollama failed or not installed" }

  Write-Section "Test LLM function endpoint (netlify dev should be running)"
  try {
    $resp = Invoke-RestMethod -Uri http://localhost:8888/.netlify/functions/LLM -Method Post -ContentType "application/json" -Body '{"prompt":"diagnostic check","model":"llama3.2:latest"}' -ErrorAction SilentlyContinue
    if ($resp) { Write-Host "LLM function response (truncated):"; $resp | ConvertTo-Json -Depth 3 | Out-String | Select-String -Pattern '.' -Context 0,0 | ForEach-Object { $_.ToString() } }
    else { Write-Host "No response from LLM function (is netlify dev running?)" }
  } catch { Write-Host "Error invoking LLM function. Netlify Dev may not be running, or endpoint refused." }

  Write-Section "Recent npm logs (tail 200 lines)"
  try { $log = Get-ChildItem "$env:LOCALAPPDATA\npm-cache\_logs" | Sort-Object LastWriteTime -Descending | Select-Object -First 1; if ($log) { Get-Content $log.FullName -Tail 200 | Out-String | Write-Host } else { Write-Host "No npm logs found" } } catch { Write-Host "Could not read npm logs" }

  Write-Section "ECOMPROMISED scan"
  try { $logs = Get-ChildItem "$env:LOCALAPPDATA\npm-cache\_logs" -ErrorAction SilentlyContinue | Sort-Object LastWriteTime -Descending; foreach ($l in $logs) { if (Select-String -Path $l.FullName -Pattern "ECOMPROMISED|Lock compromised" -Quiet) { Write-Host "Found 'ECOMPROMISED' in: $($l.FullName)"; Select-String -Path $l.FullName -Pattern "ECOMPROMISED|Lock compromised" | Select-Object LineNumber,Line | Format-Table -AutoSize } } } catch { Write-Host "Could not scan npm logs for ECOMPROMISED" }

  Write-Section "Quick disk space + CPU info"
  Get-PSDrive -PSProvider FileSystem | Select-Object Name, @{Name='Free(GB)';Expression={ [math]::Round($_.Free/1GB,2)}}, @{Name='Total(GB)';Expression={[math]::Round($_.Used/1GB,2)}} | Format-Table -AutoSize
  Get-CimInstance -ClassName Win32_ComputerSystem | Select-Object Name,NumberOfLogicalProcessors | Format-List

  if ($Fix) {
    Write-Section "Attempting quick fix (remove _npx / _locks)"
    try { pwsh -NoProfile -ExecutionPolicy Bypass $root\..\scripts\fix-npm-lock.ps1 -Quick -ErrorAction Stop } catch { Write-Host "Quick fix failed: $_" }

    if ($FullFix) {
      Write-Section "Attempting full fix (remove node_modules and reinstall)"
      try { pwsh -NoProfile -ExecutionPolicy Bypass $root\..\scripts\fix-npm-lock.ps1 -GlobalNetlify:$GlobalNetlify -ErrorAction Stop } catch { Write-Host "Full fix failed: $_" }
    }
  }

  Write-Section "Summary"
  Write-Host "Self-audit completed. Log saved to: $logFile"
} catch {
  Write-Host "Exception during self-audit: $_"
} finally {
  Stop-Transcript | Out-Null
}

Write-Host "Done"
