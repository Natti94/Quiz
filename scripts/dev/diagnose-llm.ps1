<#
diagnose-llm.ps1
Collects local diagnostics for Netlify Dev + LLM function and Ollama.
Run from repository root or frontend workspace. This script does not change files.

Outputs: Node/npm versions, netlify-cli version, Netlify Dev port usage, functions directory listing, netlify.toml content, Ollama status, environment variables, and recent npm logs.
#>

function Write-Section($header) { Write-Host "`n=== $header ===`n" -ForegroundColor Cyan }

Write-Section "Date / CWD"
Get-Date
Get-Location

Write-Section "Node / NPM / Netlify"
try { node -v } catch { Write-Host "node not found" }
try { npm -v } catch { Write-Host "npm not found" }
try { npx --yes netlify-cli@latest --version } catch { Write-Host "netlify-cli not available via npx" }
try { netlify -v } catch { Write-Host "netlify not installed globally" }

Write-Section "Netlify.toml & Function files listing (frontend workspace)"
if (Test-Path .\quiz-frontend\netlify.toml) { Get-Content .\quiz-frontend\netlify.toml -ErrorAction SilentlyContinue } else { Write-Host "No netlify.toml in quiz-frontend" }
if (Test-Path .\quiz-frontend\netlify\functions) { Get-ChildItem .\quiz-frontend\netlify\functions | Select Name, Length | Format-Table -AutoSize } else { Write-Host "No functions directory found in quiz-frontend\netlify\functions" }

Write-Section "Netlify Dev process listening on default ports (8888) and Ollama (11434)"
try { Get-NetTCPConnection -LocalPort 8888 -ErrorAction SilentlyContinue | Format-List } catch { Write-Host "No netstat support or not privileged" }
try { Get-NetTCPConnection -LocalPort 11434 -ErrorAction SilentlyContinue | Format-List } catch { Write-Host "No netstat support or not privileged" }

Write-Section "Node processes command lines (to see netlify/ollama if started as node)"
try { Get-WmiObject Win32_Process -Filter "Name = 'node.exe'" | Select-Object ProcessId,CommandLine | Format-Table -AutoSize } catch { Write-Host "Could not enumerate node processes via WMI" }

Write-Section "Selected env variables"
Get-ChildItem Env:AI_PROVIDER,Env:OLLAMA_API_URL,Env:OLLAMA_API_KEY,Env:GROQ_API_KEY,Env:HUGGINGFACE_API_KEY,Env:VITE_AUTH_API_BASE_URL -ErrorAction SilentlyContinue | Format-Table Name,Value -AutoSize

Write-Section "OLLAMA: list models + health checks (if ollama CLI exists)"
try { & ollama list 2>$null | Out-String | Write-Host } catch { Write-Host "ollama CLI not found or not in PATH" }
try { curl -I http://localhost:11434/ -UseBasicParsing -ErrorAction SilentlyContinue | Select-Object StatusCode, StatusDescription } catch { Write-Host "curl to Ollama failed or not installed" }

Write-Section "Test LLM function endpoint (netlify dev should be running)"
try {
  $resp = curl -s -X POST http://localhost:8888/.netlify/functions/LLM -H "Content-Type: application/json" -d '{"prompt":"diagnostic check","model":"natnaelberhanesv/quiz-qwen"}' -UseBasicParsing -ErrorAction SilentlyContinue
  if ($resp) { Write-Host "LLM function response (truncated):"; $resp.Substring(0,[Math]::Min(300,$resp.Length)) | Write-Host } else { Write-Host "No response from LLM function (is netlify dev running?)" }
} catch { Write-Host "Error invoking LLM function. Netlify Dev may not be running, or endpoint refused." }

Write-Section "Recent npm logs (tail 200 lines)"
try { $log = Get-ChildItem "$env:LOCALAPPDATA\npm-cache\_logs" | Sort-Object LastWriteTime -Descending | Select-Object -First 1; if ($log) { Get-Content $log.FullName -Tail 200 | Out-String | Write-Host } else { Write-Host "No npm logs found" } } catch { Write-Host "Could not read npm logs" }

Write-Section "Quick disk space + CPU info"
Get-PSDrive -PSProvider FileSystem | Select-Object Name, @{Name='Free(GB)';Expression={ [math]::Round($_.Free/1GB,2)}}, @{Name='Total(GB)';Expression={[math]::Round($_.Used/1GB,2)}} | Format-Table -AutoSize
Get-CimInstance -ClassName Win32_ComputerSystem | Select-Object Name,NumberOfLogicalProcessors | Format-List

Write-Section "Done"
