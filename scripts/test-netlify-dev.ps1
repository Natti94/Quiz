<#
test-netlify-dev.ps1

Automated test script that:
- Optionally kills conflicting local ports
- Starts Netlify Dev for the frontend workspace with safe flags
- Waits for functions to load and validates LLM_test and LLM endpoints
- Stops Netlify Dev on completion

Usage:
  pwsh ./scripts/test-netlify-dev.ps1        # runs test with defaults
  pwsh ./scripts/test-netlify-dev.ps1 -NoKill # don't run kill-local-host-sessions
  pwsh ./scripts/test-netlify-dev.ps1 -TimeoutSeconds 180

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
    # Prefer Windows PowerShell 'powershell' so 'pwsh' isn't required. Use -Command to safely pass params.
    try {
      powershell -NoProfile -ExecutionPolicy Bypass -Command "& { & '$root\\kill-local-host-sessions.ps1' -Force }" 2>$null
    } catch { Write-Host "Failed to run kill script: $_" -ForegroundColor Yellow }
  } else { Write-Host "Skipping local session kill (NoKill set)" }

  Write-Section "Starting Netlify Dev in $frontend"
  # Start Netlify Dev in the frontend workspace as a background job and pipe output to $logFile
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

  # If Netlify resolved the functionsDirectory to something different than our frontend functions path,
  # copy LLM and LLM_test to that directory for testing.
  if ($foundFnDir -and $foundFnDir -ne $functionsPath) {
    Write-Section "Detected functionsDirectory mismatch (dev using $foundFnDir). Checking LLM presence..."
    $llmInFound = Test-Path (Join-Path $foundFnDir 'LLM.js')
    if (-not $llmInFound) {
      Write-Host "LLM.js not found in $foundFnDir. Copying from frontend for test..." -ForegroundColor Yellow
      try {
      # When the runtime doesn't include the frontend functions, copy the functions
      # using the original filenames so the endpoints match (LLM and LLM_test).
      $srcLLM = (Join-Path $frontend 'netlify\functions\LLM.js')
      $srcLLMTest = (Join-Path $frontend 'netlify\functions\LLM_test.js')
      $dstLLM = (Join-Path $foundFnDir 'LLM.js')
      $dstLLMTest = (Join-Path $foundFnDir 'LLM_test.js')

      # Backup any existing target files before copying
      $backups = @()
      if (Test-Path $dstLLM) {
        $bk = Join-Path $foundFnDir "LLM.bak.$ts.js"
        Move-Item -Path $dstLLM -Destination $bk -Force -ErrorAction Stop
        $backups += @{ Orig = $dstLLM; Backup = $bk }
      }
      if (Test-Path $dstLLMTest) {
        $bk2 = Join-Path $foundFnDir "LLM_test.bak.$ts.js"
        Move-Item -Path $dstLLMTest -Destination $bk2 -Force -ErrorAction Stop
        $backups += @{ Orig = $dstLLMTest; Backup = $bk2 }
      }

      Copy-Item -Path $srcLLM -Destination $dstLLM -Force -ErrorAction Stop
      Copy-Item -Path $srcLLMTest -Destination $dstLLMTest -Force -ErrorAction Stop
        Write-Host "Copied dev copies to $foundFnDir" -ForegroundColor Green
        # Wait a moment for netlify dev to detect new functions
        Start-Sleep -Seconds 2
      } catch {
        Write-Host "Failed to copy LLM files for test: $_" -ForegroundColor Red
      }
    } else {
      Write-Host "LLM.js already present in $foundFnDir" -ForegroundColor Green
    }
  }

  # Add cleanup step: if we created backups we should restore them after tests
  $cleanupBackupActions = {
    param($foundFnDir, $frontend, $backups)
    foreach ($b in $backups) {
      try {
        if (Test-Path $b.Backup) {
          Move-Item -Path $b.Backup -Destination $b.Orig -Force -ErrorAction Stop
          Write-Host "Restored backup $($b.Backup) -> $($b.Orig)" -ForegroundColor Cyan
        }
      } catch {
        Write-Host "Failed to restore backup $($b.Backup): $_" -ForegroundColor Yellow
      }
    }
    # Remove any dev copies we created if there was no original
    $maybeLLM = Join-Path $foundFnDir 'LLM.js'
    $maybeLLMTest = Join-Path $foundFnDir 'LLM_test.js'
    if (-not (Test-Path (Join-Path $frontend 'netlify\functions\LLM.js')) -and (Test-Path $maybeLLM)) {
      # don't remove if copying from frontend (we may still want the runtime copy)
      Remove-Item -Path $maybeLLM -Force -ErrorAction SilentlyContinue
    }
    if (-not (Test-Path (Join-Path $frontend 'netlify\functions\LLM_test.js')) -and (Test-Path $maybeLLMTest)) {
      Remove-Item -Path $maybeLLMTest -Force -ErrorAction SilentlyContinue
    }
  }

  # Test the LLM_test endpoint
  Write-Section "Testing LLM_test endpoint"
  try {
    $resTest = Invoke-RestMethod -Uri 'http://localhost:8888/.netlify/functions/LLM_test' -Method Get -ErrorAction Stop -TimeoutSec 15
    Write-Host "LLM_test response OK: $($resTest | ConvertTo-Json -Depth 2)"
  } catch {
    Write-Host "LLM_test failed: $_" -ForegroundColor Red
    Stop-Job -Job $job -Force -ErrorAction SilentlyContinue
    return 1
  }

  # Test the LLM endpoint (POST)
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

  Write-Section "Test result: exit code $result (0=ok,1=start/registration fail,2=LLM runtime fail)"
  return $result
} catch {
  Write-Host "Script error: $_" -ForegroundColor Red
  return 3
}
