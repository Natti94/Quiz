<#
test-netlify-dev.ps1

Automated test script that:
- Optionally kills conflicting local ports
- Starts Netlify Dev for the frontend workspace with safe flags
- Waits for functions to load and validates LLM_test and LLM endpoints
- Stops Netlify Dev on completion

Usage:
  pwsh ./scripts/dev/test-netlify-dev.ps1        # runs test with defaults
  pwsh ./scripts/dev/test-netlify-dev.ps1 -NoKill # don't run kill-local-host-sessions
  pwsh ./scripts/dev/test-netlify-dev.ps1 -TimeoutSeconds 180

Return codes:
  0 = success (LLM registered and LLM responded)
  1 = failure (start or registration failure)
  2 = failure (LLM responded with non-200 or OLLAMA_UNAVAILABLE)
  3 = script error / unexpected
#>

param(
  [int]$TimeoutSeconds = 120,
  [switch]$NoKill = $false,
  [switch]$DevStub = $false
  , [switch]$CopyTests = $false
)

function Write-Section($s) { Write-Host "`n=== $s ===`n" -ForegroundColor Cyan }

try {
  $root = Split-Path -Parent $MyInvocation.MyCommand.Path | Resolve-Path | Select-Object -ExpandProperty Path
  $frontend = Join-Path $root '..\quiz-frontend' | Resolve-Path
  $logDir = Join-Path $root '..\logs' | Resolve-Path -ErrorAction SilentlyContinue
  if (-not $logDir) { New-Item -Path (Join-Path $root '..\logs') -ItemType Directory -Force | Out-Null; $logDir = Join-Path $root '..\logs' }
  $ts = Get-Date -Format 'yyyyMMdd-HHmmss'
  $logFile = Join-Path $logDir "test-netlify-dev-$ts.log"

  Write-Section "Test Netlify Dev: starting (log: $logFile)"

  if (-not $NoKill) {
    Write-Section "Killing local sessions (quick)"
    try {
      powershell -NoProfile -ExecutionPolicy Bypass -Command "& { & '$root\\dev\\kill-local-host-sessions.ps1' -Force }" 2>$null
    } catch { Write-Host "Failed to run kill script: $_" -ForegroundColor Yellow }
  } else { Write-Host "Skipping local session kill (NoKill set)" }

  if ($CopyTests) {
    Write-Section "Copying netlify functions tests into the functions folder (for Netlify Dev)"
    try {
      cd $root
      Write-Host "Running: node ./scripts/test/copy-netlify-tests.mjs --dry-run"
      node ./scripts/test/copy-netlify-tests.mjs --dry-run
      Write-Host "Running: node ./scripts/test/copy-netlify-tests.mjs"
      node ./scripts/test/copy-netlify-tests.mjs
    } catch { Write-Host "Failed to copy tests: $_" -ForegroundColor Yellow }
  }

  Write-Section "Starting Netlify Dev in $frontend"
  $functionsPath = Join-Path $frontend 'netlify\functions'
  $job = Start-Job -ScriptBlock {
    if ($using:DevStub) { $env:DEV_STUB = '1' }
    cd $using:frontend
    npx --yes netlify-cli@latest dev --debug --functions "$using:functionsPath" --port 8888 --filter quiz-frontend 2>&1 | Out-File -FilePath $using:logFile -Encoding utf8 -Append
  }

  $startTime = Get-Date
  $patternReady = 'Local dev server ready:'
  $patternLoaded = 'Loaded function LLM'
  $patternFnDir = 'functionsDirectory:'
  $foundReady = $false
  $foundLoaded = $false
  $foundFnDir = $null

  Write-Host "Waiting up to $TimeoutSeconds seconds for Netlify Dev to start and register LLM..."
  $deadline = (Get-Date).AddSeconds($TimeoutSeconds)
  while ((Get-Date) -lt $deadline) {
    Start-Sleep -Seconds 2
    if (Test-Path $logFile) {
      $content = Get-Content $logFile -Raw -ErrorAction SilentlyContinue
      if ($content -match $patternReady) { $foundReady = $true }
      if ($content -match $patternLoaded) { $foundLoaded = $true }
      if ($content -match $patternFnDir) {
        $m = Select-String -Path $logFile -Pattern $patternFnDir -AllMatches -SimpleMatch | Select-Object -Last 1
        if ($m) { $foundFnDir = ($m.Line -replace 'functionsDirectory:\s*','').Trim() }
      }
    }
    if ($foundReady -and $foundLoaded) { break }
  }

  if (-not $foundReady -or -not $foundLoaded) {
    Write-Section "Netlify Dev didn't start or LLM wasn't registered in time"
    if (Test-Path $logFile) { Get-Content $logFile -Tail 200 }
    Stop-Job -Job $job -Force -ErrorAction SilentlyContinue
    return 1
  }

  Write-Section "Netlify Dev started and LLM loaded"
  Write-Host "FunctionsDirectory: $foundFnDir"

  # Copy or verify endpoints; trimmed for brevity (identical logic as previous file)
  Write-Section "Testing LLM_test endpoint"
  try {
    $resTest = Invoke-RestMethod -Uri 'http://localhost:8888/.netlify/functions/LLM_test' -Method Get -ErrorAction Stop -TimeoutSec 15
    Write-Host "LLM_test response OK: $($resTest | ConvertTo-Json -Depth 2)"
  } catch {
    Write-Host "LLM_test failed: $_" -ForegroundColor Red
    Stop-Job -Job $job -Force -ErrorAction SilentlyContinue
    return 1
  }

  Write-Section "Testing LLM endpoint"
  try {
    $body = @{ prompt = 'diagnostic check'; model = 'llama3.2:latest' } | ConvertTo-Json
    $res = Invoke-RestMethod -Uri 'http://localhost:8888/.netlify/functions/LLM' -Method Post -ContentType 'application/json' -Body $body -ErrorAction Stop -TimeoutSec 120
    Write-Host "LLM response ok (truncated):" -ForegroundColor Green
    $res | ConvertTo-Json -Depth 2 | Out-String | Select-String -Pattern '.' | Select-Object -First 25 | ForEach-Object { Write-Host $_ }
    $result = 0
  } catch {
    Write-Host "LLM endpoint failed: $_" -ForegroundColor Red
    $result = 2
  }

  Write-Section "Stopping Netlify Dev job"
  Stop-Job -Job $job -ErrorAction SilentlyContinue
  Remove-Job -Job $job -ErrorAction SilentlyContinue

  if ($CopyTests) {
    try {
      Write-Section "Cleaning copied test functions from functions folder"
      cd $root
      node ./scripts/test/copy-netlify-tests.mjs --clean
    } catch { Write-Host "Failed to clean copied tests: $_" -ForegroundColor Yellow }
  }

  Write-Section "Test result: exit code $result (0=ok,1=start/registration fail,2=LLM runtime fail)"
  return $result
} catch {
  Write-Host "Script error: $_" -ForegroundColor Red
  return 3
}
