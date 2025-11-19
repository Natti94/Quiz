<# self audit moved into dev/ #>
param(
  [switch]$Fix = $false,
  [switch]$FullFix = $false,
  [switch]$GlobalNetlify = $false
)

Write-Host "Self-audit (dev)":
& "$(Join-Path $PSScriptRoot '..\self-audit.ps1')" @args
