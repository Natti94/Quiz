<# Kill local host sessions for common dev ports. #>
param(
  [int[]]$Ports = @(8888, 5173, 5174, 3999, 60497),
  [switch]$IncludeAllNode = $false,
  [switch]$KillOllama = $false,
  [switch]$Force = $false
)

if (-not $KillOllama) { $Ports = $Ports | Where-Object { $_ -ne 11434 } }

Write-Host "Looking for processes on ports: $($Ports -join ', ')"
Get-NetTCPConnection -LocalPort $Ports -ErrorAction SilentlyContinue | ForEach-Object { Stop-Process -Id $_.OwningProcess -Force -ErrorAction SilentlyContinue }
