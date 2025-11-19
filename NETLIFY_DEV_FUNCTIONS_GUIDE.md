Netlify Dev Functions Guide — Local Development

This repo uses Netlify Dev to run functions locally and Ollama (LLM) for AI inference.

Common issues:
- Netlify Dev may pick the workspace root's `netlify/functions` instead of the frontend `quiz-frontend/netlify/functions`. Use the `--functions` and `--dir` flags to force the frontend functions path.
- Port conflicts: ensure port 8888 (Netlify Dev) and 11434 (Ollama) are free.
- Ollama can take long to respond; the local lambda runtime imposes a 30s timeout by default and may cause the LLM to fail.

How to run local dev with a fast stub:
- To avoid long LLM inference times during frontend development we provide a DEV_STUB that returns a small canned response. You can start dev with the stub using either:
  - From the `quiz-frontend` directory:
    npm run dev:netlify:stub

  - Or from the repository root (PowerShell):
    powershell -NoProfile -ExecutionPolicy Bypass -File ./scripts/start-netlify-dev-stub.ps1 -Port 8888 -FunctionsPath quiz-frontend/netlify/functions -Filter quiz-frontend

This wrapper sets DEV_STUB=1 in the Netlify process' environment and will ensure quick responses.

How the dev-stub works:
- The stub is engine-agnostic and returns a fixed JSON response when `DEV_STUB` is truthy. The LLM function checks `DEV_STUB` before contacting any provider.

Troubleshooting:
- If functions are not registered correctly, pass both `--dir` and `--functions` to `netlify dev` and `--filter` for monorepos.
- If Netlify picks an unexpected `functionsDirectory`, `test-netlify-dev.ps1` will attempt to copy function files into the resolved runtime folder for a quick validation. You can run:
  pwsh ./scripts/test-netlify-dev.ps1

- If the kill script errors, run it by itself first to see the details and confirm permissions:
  pwsh ./scripts/kill-local-host-sessions.ps1 -Force

- If you want to use a smaller offline model during dev instead of a stub, set `AI_PROVIDER` environment variable to hugggingface/groq or use a local smaller Ollama model. Use the existing check scripts `npm run check:ollama` to validate Ollama.

Quick try-it commands:
  - Start dev with an LLM stub (frontend dir):
    npm run dev:netlify:stub
  - Run automated Netlify dev test (frontend dir) using the stub:
    npm run test:netlify-dev:stub


Notes:
- The stub is intended for development only. Do not enable DEV_STUB in CI, staging, or production.
- If your workstation still returns 404 on functions, ensure you start `netlify dev` from the frontend directory or use `--dir` and `--functions` to point to correct paths.

