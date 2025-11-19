<#
kill-local-host-sessions.ps1

Safely find and (optionally) kill processes that listen on common local dev ports.
This helps when Netlify Dev cannot bind to port 8888 because another process is already running.

Usage:
  # Dry-run (default): lists processes using the configured ports
    pwsh ./scripts/dev/kill-local-host-sessions.ps1

  # Interactive kill with confirmation
    pwsh ./scripts/dev/kill-local-host-sessions.ps1 -ConfirmKill

  # Force kill without prompt
    pwsh ./scripts/dev/kill-local-host-sessions.ps1 -Force

Options:
  -Ports <int[]>: Ports to target. Default: 8888,5173,5174,3999,60497
  -IncludeAllNode: target all node.exe processes binding on localhost (dangerous)
  -KillOllama: include port 11434 (default: false)
  -Force: do not prompt
  -WhatIf: show what would be done

IMPORTANT: Use with care. This will force-stop running processes.
#>

param(
  [int[]]$Ports = @(8888, 5173, 5174, 3999, 60497),
  [switch]$IncludeAllNode = $false,
  [switch]$KillOllama = $false,
  [switch]$Force = $false
)

function Write-Section($s) { Write-Host "`n=== $s ===`n" -ForegroundColor Cyan }

if (-not $KillOllama) {
  # Ensure we don't include Ollama's default port unless explicitly asked
  $Ports = $Ports | Where-Object { $_ -ne 11434 }
}

Write-Section "Compatibility wrapper — forwarding to scripts/dev/kill-local-host-sessions.ps1"
& "$(Join-Path $PSScriptRoot 'dev\kill-local-host-sessions.ps1')" @args
return

Write-Section "Scanning for local TCP listeners on ports: $($Ports -join ', ')"

$connections = @()
foreach ($p in $Ports) {
  $conns = Get-NetTCPConnection -LocalPort $p -ErrorAction SilentlyContinue
  if ($conns) { $connections += $conns }
}

if (-not $IncludeAllNode) {
  # Also add connections where local address is loopback or all addresses but limit to user-specified ports
  # (we already gathered by ports)
}

if (-not $connections -or $connections.Count -eq 0) {
  Write-Host "No listening processes found on the configured ports." -ForegroundColor Green
  return
}

# Group by owning process
$grouped = $connections | Group-Object OwningProcess

function Get-ProcessInfo($pid) {
  try {
    $proc = Get-CimInstance Win32_Process -Filter "ProcessId = $pid"
    return @{ Id = $pid; Name = $proc.Name; CommandLine = $proc.CommandLine }
  } catch {
    return @{ Id = $pid; Name = "(unknown)"; CommandLine = "(unknown)" }
  }
}

$candidates = @()
foreach ($g in $grouped) {
  $pid = $g.Name
  $pinfo = Get-ProcessInfo $pid
  $ports = ($g.Group | Select-Object -ExpandProperty LocalPort | Sort-Object -Unique) -join ', '
  $candidates += [PSCustomObject]@{
    PID = [int]$pid;
    Name = $pinfo.Name;
    CommandLine = $pinfo.CommandLine;
    Ports = $ports
  }
}

Write-Section "Candidates to stop"
$candidates | Format-Table PID, Name, Ports, @{Name='Command';Expression={$_.CommandLine}} -AutoSize

if (-not $Force) {
  $prompt = "Do you want to stop these processes? (Y/N)"
  $answer = Read-Host $prompt
  if ($answer -notin @('Y','y','Yes','yes')) {
    Write-Host "Aborting without stopping any processes." -ForegroundColor Yellow
    return
  }
}

Write-Section "Stopping processes"
foreach ($row in $candidates) {
  try {
    Write-Host "Stopping PID $($row.PID) ($($row.Name)) listening on $($row.Ports)" -ForegroundColor Yellow
    Stop-Process -Id $row.PID -Force -ErrorAction Stop
    Write-Host "Stopped PID $($row.PID)" -ForegroundColor Green
  } catch {
    Write-Host "Failed to stop PID $($row.PID): $_" -ForegroundColor Red
  }
}

Write-Section "Validation — Re-check ports"
foreach ($p in $Ports) {
  $after = Get-NetTCPConnection -LocalPort $p -ErrorAction SilentlyContinue
  if ($after) { Write-Host "Port $p still in use by PID(s): $($after | Select-Object -ExpandProperty OwningProcess -Unique -Join ', ')" -ForegroundColor Red }
  else { Write-Host "Port $p is now free" -ForegroundColor Green }
}

Write-Section "Done"
