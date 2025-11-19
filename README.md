# Quiz App

A responsive quiz application with multiple subjects. Choose a subject, answer questions with instant feedback and explanations, and cancel at any time to see a summary of your current score. Includes a gated exam with an unlock key and per-question level (G/VG). The WAI subject (Web Architecture & Internet) covers HTTP/HTTPS, proxies, authN/Z, crypto, logging, and OWASP Top 10 topics. An Updates section displays the latest commits from this repository via a Netlify Function (with Prev/Next navigation).

**NEW:** AI-powered evaluation for VG-level exam questions using Ollama (llama3.2). Exams can be taken in standard mode (multiple choice) or AI mode (free text answers evaluated by local AI).

Automated releases: the project uses Conventional Commits + semantic-release to auto-bump versions (patch/minor/major), generate a changelog, tag, and publish GitHub Releases on pushes to main. The current version is also shown in the app header.

## Features

- Subject chooser with card UI
- Answer flow with immediate correctness highlight
- Explanation panel shown after selecting an answer
- Cancel session and see a summary (score, attempts, total questions)
- Mobile-friendly, responsive styles using CSS `clamp()` and scoped selectors
- Clean separation of concerns: subject chooser (`Form`) vs quiz runner (`Subject`)
- Gated exam subject with unlock key (persisted in `localStorage`)
- **AI evaluation mode:** Free text answers for VG-level questions evaluated by Ollama llama3.2
- **Discord bot integration:** `/prekey` command generates pre-access tokens for exam unlock flow
- Per-question level display (G/VG) for exam questions
- Netlify Function for external links/assets via environment variables
- Updates section that shows latest repo commits (via `/api/commits` → Netlify Function), with single-commit viewer and Prev/Next controls
- WAI subject: Web Architecture & Internet (HTTP, HTTPS, CA, Proxy, AuthN/Z, Helmet, OWASP, crypto, logging)
- **Dual exam system:** PLU Exam and WAI Exam with shared unlock mechanism
- **Intelligent AI mode:** VG questions use AI evaluation (textarea), G questions use multiple choice

## Project structure

This is a **monorepo** with frontend and backend:

```
quiz/                    # Root monorepo
  .env                   # Shared environment variables
  package.json           # Root package for scripts
  scripts/               # Shared formatting & comment removal
    formatRepo.mjs       # Format both frontend & backend
    removeComments.mjs   # Strip comments from both projects

quiz-frontend/           # React frontend (Vite)
  index.html
  package.json
  vite.config.js
  eslint.config.js

  public/
    _redirects           # Routes: /api/* -> functions, SPA fallback /* -> /index.html

  netlify/
    functions/
      getAssets.js         # Serve external links from env
      getCommits.js        # Proxy to GitHub commits (single repo)
      discordInteractions.js # Discord bot slash commands (/prekey)
      verifyPreAccess.js   # Step 1: verify admin key (JWT pre-token)
      requestUnlock.js     # Step 2: email a one-time key (Resend)
      verifyUnlock.js      # Step 3: verify key → issue unlock JWT
      getDevUnlockKey.js   # Dev-only helper to fetch local key
      LLM.js               # AI evaluation endpoint (Groq/HuggingFace/Ollama)
      _store.js, jwtUtils.js, generateUnlockKey.js, mongoStore.js

  src/
    main.jsx             # React entry
    index.css            # Global styles (scoped to the app shell)
    App.jsx              # App shell: header, subject chooser, updates, footer

    components/
      nav/
        nav.jsx          # "Visit Other Projects" button (uses getAssets/env)
        nav.css
      content/
        content.jsx      # Head content; composes form + subject
        content.css
        content-wrapper/
          form.jsx       # Subject chooser with exam mode selector (standard/AI)
          subjects.jsx   # Quiz logic/view (shuffle, scoring, AI evaluation)
      updates/
        updates.jsx      # Single-commit viewer with Prev/Next; fetches /api/commits
        updates.css
      footer/
        footer.jsx       # Minimal © footer
        footer.css

    data/
      index.js           # Subject registry
      quiz/
        default/
          apt.js         # APT questions
          plu.js         # PLU questions
          wai.js         # WAI questions
        exam/
          pluExam.js     # PLU exam (G/VG) with { level: "G" | "VG", ... }
          waiExam.js     # WAI exam (G/VG) - 9 G + 6 VG questions on security/GDPR

quiz-backend/            # Node.js/Express backend
  server.js              # Express app entry point
  package.json
  config/
    db.js                # MongoDB connection
  models/
    User.js              # User schema (syncs with teacher's API)
    Leaderboard.js       # Quiz score tracking
  controllers/
    authController.js    # Auth proxy (register/login/logout)
    leaderboardController.js  # Score CRUD operations
  middleware/
    auth.js              # JWT verification
    errorHandler.js      # Global error handling
  routes/
    auth.js              # Auth endpoints
    leaderboard.js       # Leaderboard endpoints
  README.md              # Backend-specific documentation
```

## Getting Started

### Quick Start (Root Level)

From the root folder, you can run both frontend and backend:

```powershell
# Install all dependencies (root, frontend, backend)
npm run install:all

# Run both frontend and backend concurrently
npm run dev

# Or run individually
npm run dev:frontend  # Starts Vite on localhost:5173
npm run dev:backend   # Starts Express on localhost:5000

# Format entire codebase (frontend + backend)
npm run format:repo

# Strip comments from entire codebase
npm run strip:comments
```

### Frontend Only

From the app folder:

```powershell
cd quiz-frontend
npm install
npm run dev
```

Then open http://localhost:5173.

### Backend Only

From the backend folder:

```powershell
cd quiz-backend
npm install
npm run dev
```

Backend runs on http://localhost:5000 (see `quiz-backend/README.md` for full API documentation).

### Local dev with API (/api/\*)

To use the unlock and updates APIs locally, run the Netlify Dev server (proxies Vite and mounts functions) and open the app on port 8888:

```powershell
npm run dev:netlify        # starts Netlify Dev (uses npx to run the CLI)
# or (Windows): auto-open browser, then start Netlify Dev
npm run dev:netlify:open
```

Note: Some Netlify CLI versions don’t support a --open flag. The "dev:netlify:open" script opens http://localhost:8888 via PowerShell and then launches Netlify Dev.

Then open (or it will open automatically): http://localhost:8888. If you see 404s for /api/\* on port 5173, you’re on the Vite-only server; use the Netlify Dev URL instead.

### Build & Preview

```powershell
npm run build
npm run preview
```

- Output goes to `dist/`.
- Files in `public/` (including `_redirects`) are copied to `dist/` automatically by Vite.

## Environment variables

Create a local `.env` at the **root level** (`quiz/.env`). Both frontend and backend share this file (do not commit it; the repo ignores `.env`). Configure the same keys in your Netlify site settings for production.

The `.env` file is structured with clear sections:

- **Client-exposed (VITE\_\*)**: Variables prefixed with `VITE_` are available in the frontend
- **Backend Server Settings**: `NODE_ENV`, `PORT`, `CORS_ORIGIN`
- **MongoDB Configuration**: `MONGODB_URI`
- **JWT & Auth Settings**: `JWT_SECRET`, `TEACHER_API_*` endpoints
- **Exam & Unlock System**: `EXAM_SECRET`, `DEV_ACCESS_TOKEN`
- **Email (Resend)**: `RESEND_API_KEY`, `RESEND_FROM`
- **AI Provider Settings**: `AI_PROVIDER`, `GROQ_API_KEY`, etc.

Required

Client (public):

```
VITE_CLOUDINARY_PROJECTS_LINK=https://your-projects-site.example.com/
```

Server (Netlify Functions):

```
EXAM_SECRET=your-local-or-prod-exam-key
JWT_SECRET=your-jwt-signing-secret
DISCORD_PUBLIC_KEY=your-discord-bot-public-key
```

- The client calls `/api/verifyUnlock`, which validates the user’s key server‑side against `EXAM_SECRET` and returns a short‑lived JWT signed with `JWT_SECRET`.
- The client stores the token in `localStorage` and auto-unlocks while it’s valid.
- The “Begär nyckel” button posts `/api/requestUnlock` and the server emails the user a key (requires Resend settings below).

Optional (Netlify Function → GitHub API):

- `GITHUB_TOKEN` or `GH_TOKEN` — Personal Access Token to avoid GitHub API rate limits when fetching commits.
- `GITHUB_OWNER` (default: `Natti94`) and `GITHUB_REPO` (default: `Quiz`) — The function enforces a single allowed repo; override only if you know what you’re doing.

Optional (email via Resend):

```
RESEND_API_KEY=...
RESEND_FROM=verified@sender.tld
RESEND_TO=admin@your.tld   # optional BCC for audit
```

Optional (Discord bot):

```
DISCORD_ALLOWED_CHANNEL_ID=channel-id-to-restrict-commands
DISCORD_BYPASS_VERIFY=true  # local dev only, skip signature verification
```

Optional (AI evaluation):

**Local Development:**

- Ollama must be running locally on `localhost:11434` with `llama3.2:latest` model installed
- Install: `ollama pull llama3.2:latest` (2GB model)
- The AI evaluation endpoint includes rate limiting (10 req/min per IP) and prompt length limits (2000 chars)

**Production Deployment - FREE OPTIONS (Recommended):** ⭐

- **Groq (Best):** Fast, free, no credit card

  ```
  AI_PROVIDER=groq
  GROQ_API_KEY=your-free-api-key
  ```

  - Model: `llama-3.3-70b-versatile` (powerful, fast inference)
  - Free tier: 30 requests/min, 14,400 requests/day
  - Get API key: https://console.groq.com/keys

- **Hugging Face:** Completely free, slower

  ```
  AI_PROVIDER=huggingface
  HUGGINGFACE_API_KEY=your-free-token
  ```

  - Model: `meta-llama/Llama-3.2-3B-Instruct`
  - Unlimited requests (may have cold starts)

**Production Deployment - Self-Hosted Ollama:**

- Deploy Ollama on a separate server (VPS, EC2, etc.) with 4GB+ RAM
- Set environment variables in Netlify:
  ```
  AI_PROVIDER=ollama
  OLLAMA_API_URL=http://your-server-ip:11434
  OLLAMA_API_KEY=your-optional-api-key
  ```
- See "Deploying Ollama to Production" section below for detailed setup

### Local dev behavior

- In Netlify Dev (localhost), the unlock flow can skip email/DB. The app can fetch a developer key ("Öppna (Utvecklare)") and `verifyUnlock` accepts `EXAM_SECRET` directly.
- The data store uses an in-memory map in dev (no MongoDB needed). You can omit `MONGODB_URI` in local `.env`.

### Automated releases (semantic-release)

- Workflow: `.github/workflows/release.yml` (runs on push to `main`).
- Config: `./.releaserc.json` (monorepo release from repository root). If you previously used `quiz-frontend/.releaserc.json`, you can remove or archive it when switching to root-level releases.
- Tag and log backups: tag cleanup creates a `archives/tag-backups/tag-backup-*.txt` file and a matching `archives/tag-backups/tag-backup-*-sha.txt` mapping. These are committed to `archives/tag-backups/` by default. You can also store backups in a central infra repository or cloud storage (see next section).
 - Tag and log backups: tag cleanup creates a `archives/tag-backups/tag-backup-*.txt` file and a matching `archives/tag-backups/tag-backup-*-sha.txt` mapping. These are committed to `archives/tag-backups/` by default. You can also store backups in a central infra repository or cloud storage (see next section).
 - Ephemeral runtime logs (Netlify dev output, local diagnostic logs) are stored in the `logfs/` folder. `logfs/` is ignored by git and intended for transient developer logs. Use `scripts/infra/move-logs-to-infra.mjs` to push `logfs/` + `archives/tag-backups/` to a shared infra repo (under `logs/`) when you want to centralize or persist them.
  Storing logs & backups elsewhere
- Use an "infra" repo:
  - To copy local backups into an infra repo (push): run `INFRA_GIT_URL=git@github.com:org/infra.git node scripts/move-logs-to-infra.mjs` (if you previously added this helper). That will push `archives/tag-backups/*` into the infra repo under `logs/`.
  - To copy local backups and runtime logs into an infra repo (push): run
    `INFRA_GIT_URL=git@github.com:org/infra.git node scripts/infra/move-logs-to-infra.mjs --commit`.
    That will push both `archives/tag-backups/*` and `logfs/*` into the infra repo under `logs/`.
  - To restore or import backups from infra into the monorepo archives: run `INFRA_GIT_URL=git@github.com:org/infra.git node scripts/archiving/move-logs-to-archives.mjs [srcFolderInInfra] --commit`.
    By default tag backups are copied into `archives/tag-backups/` and other logs are copied into `logfs/`.
    - By default the script copies files into `archives/tag-backups/` but doesn't commit them unless you pass `--commit`.
- Restore tags locally from an archived mapping: if you ever need to re-create local tags, use `node scripts/backups/restore-tags-from-sha.mjs` to re-create tags in your local repo from the latest `*-sha.txt` mapping in `archives/tag-backups/` (script supports `--dry-run`, `--force`, and `--push`).
- Tests for Netlify functions now live under `tests/netlify/functions` — use `npm run test:netlify-dev:with-tests` to copy them into the Netlify functions folder for local debugging and automated checks.
- Restore tags locally from an archived mapping: if you ever need to re-create local tags, use `node scripts/backups/restore-tags-from-sha.mjs` to re-create tags in your local repo from the latest `*-sha.txt` mapping in `archives/tag-backups/` (script supports `--dry-run`, `--force`, and `--push`).
- Use CI artifacts: add a workflow that uploads the backup files as artifacts on each release/cleanup.
- Dev tools: all developer helper scripts are now grouped under `scripts/dev/` - e.g. `scripts/dev/check-ollama.ps1`, `scripts/dev/diagnose-llm.ps1`, `scripts/dev/test-netlify-dev.ps1`. Old paths still work via compatibility wrappers.
- Use cloud storage: a small action or script can upload the files to S3 or GCS. Keep secrets outside the repo and add a short archiving job in your release pipeline.
- Versions are inferred from commit messages (Conventional Commits):
  - `fix: …` → patch (e.g., 2.0.1 → 2.0.2)
  - `feat: …` → minor (e.g., 2.0.2 → 2.1.0)
  - `feat!: …` or a `BREAKING CHANGE:` footer → major (e.g., 2.1.0 → 3.0.0)
- Outputs: updates `CHANGELOG.md`, bumps `package.json`/`package-lock.json`, creates a tag and GitHub Release.
- The version is injected at build time and shown in the UI header.

## Deploying to Netlify

- Build command: `npm run build`
- Publish directory: `dist`
- Functions directory: `netlify/functions`
- Redirects: ensure `public/_redirects` includes API routes and SPA fallback, e.g.

  ```
  /api/commits         /.netlify/functions/getCommits           200
  /api/assets          /.netlify/functions/getAssets            200
  /api/getDevUnlockKey /.netlify/functions/getDevUnlockKey      200
  /api/requestUnlock   /.netlify/functions/requestUnlock        200
  /api/verifyUnlock    /.netlify/functions/verifyUnlock         200
  /api/verifyPreAccess /.netlify/functions/verifyPreAccess      200
  /api/LLM             /.netlify/functions/LLM                  200
  /*                   /index.html                              200
  ```

- Add environment variables (`VITE_CLOUDINARY_PROJECTS_LINK`, `EXAM_SECRET`, `JWT_SECRET`, `DISCORD_PUBLIC_KEY`, and optionally `GITHUB_TOKEN`, `RESEND_*`, `DISCORD_ALLOWED_CHANNEL_ID`) in your site settings.
- For Discord bot interactions, configure the Interactions Endpoint URL in Discord Developer Portal:
  ```
  https://your-site.netlify.app/.netlify/functions/discordInteractions
  ```

## Editing questions / adding subjects

Question object shape:

```js
{
  // For exam questions only
  level: "G" | "VG", // optional elsewhere, required for exam
  question: "...",
  options: ["A", "B", "C", "D"],
  correct: 1, // index into options
  explanation: "..."
}
```

- Edit arrays in `src/data/quiz/default/apt.js`, `src/data/quiz/default/plu.js`, and `src/data/quiz/default/wai.js` (named exports).
- Exam questions live in `src/data/quiz/exam/pluExam.js` and `src/data/quiz/exam/waiExam.js` and include a `level` (G/VG). The UI shows the level on each question.
- Existing subjects: APT, PLU, WAI (training mode), PLU Exam, and WAI Exam.
- Add a new subject by creating `src/data/quiz/<name>.js` (export a named array), wiring it in `subjects.jsx` (based on the `subject` prop), adding a card in `form.jsx`, and extending any subject metadata registry (label/icon) used in `App.jsx`.

### AI Evaluation Mode

- **Standard Mode:** Multiple choice questions (both G and VG levels shown as standard multiple choice)
- **AI Mode:** Intelligent mixed evaluation based on question level
  - **VG-level questions:** Free text answers evaluated by Ollama AI (textarea input, AI feedback with pass/fail, detailed explanation)
  - **G-level questions:** Standard multiple choice (instant feedback, no AI evaluation)
  - All questions (both G and VG) are available in AI mode, providing a complete exam experience
  - VG questions are clearly labeled with "(AI-bedömd)" indicator
  - G questions use standard multiple choice for faster answers and partial credit
- Training subjects (PLU, APT, WAI) always use standard mode
- Only exam subjects (TENTA: PLU Exam, WAI Exam) have the AI mode option
- **Dual Exam System:** Both PLU and WAI exams available with shared unlock mechanism
  - PLU Exam: Focus on packaging, delivery, and follow-up processes
  - WAI Exam: Web security, protocols (HTTPS/TLS/TCP/UDP), GDPR, OWASP Top 10
  - Unlock once, access both exams

## Free AI for Production (No Server Needed!)

**🆓 Use Groq or Hugging Face - completely free cloud AI!**

| Provider                 | Speed       | Free Tier         | Rate Limit     | Best For       |
| ------------------------ | ----------- | ----------------- | -------------- | -------------- |
| **Groq** ⭐              | ⚡⚡⚡ Fast | 30/min, 14.4k/day | App: 10/min/IP | **Production** |
| **Hugging Face**         | 🐌 Slow     | Unlimited         | App: 10/min/IP | Testing        |
| **Ollama (Self-hosted)** | ⚡⚡ Fast   | Self-host         | App: 10/min/IP | Privacy        |

**Quick Setup (2 minutes):**

1. Get free API key from https://console.groq.com/keys
2. Add to Netlify environment variables:
   ```
   AI_PROVIDER=groq
   GROQ_API_KEY=your-free-key-here
   ```
3. Done! 🎉

**Model Details:**

- **Groq:** Uses `llama-3.3-70b-versatile` (powerful 70B parameter model, fast inference)
- **Hugging Face:** Uses `meta-llama/Llama-3.2-3B-Instruct` (smaller 3B model, slower)
- **Ollama:** Uses `llama3.2:latest` (local/remote 3B model)

**Usage Estimation (20 students/day):**

- Light usage (10 AI questions/student): **200 requests/day** = 1.4% of Groq daily limit
- Heavy usage (30 AI questions/student): **600 requests/day** = 4.2% of Groq daily limit
- Netlify Functions: 6,000-18,000 req/month = **4.8%-14.4%** of free tier (125k/month)

**Rate Limiting:**

- Your app enforces **10 requests per minute per IP** to prevent abuse
- Groq API allows 30 req/min, so multiple users can use simultaneously
- Returns 429 status with `Retry-After` header when limit exceeded

**Get Started:**

- Groq API: https://console.groq.com/keys (instant, no credit card)
- Hugging Face: https://huggingface.co/settings/tokens (instant, no credit card)

---

## Deploying Ollama to Production

To enable AI evaluation in production, deploy Ollama on a separate server:

### Option 1: Deploy on a VPS (DigitalOcean, Hetzner, etc.)

**1. Create a server:**

- Minimum: 2 vCPU, 4GB RAM
- Recommended: 4 vCPU, 8GB RAM for better performance
- Ubuntu 22.04 LTS recommended

**2. Install Ollama:**

```bash
# SSH into your server
ssh root@your-server-ip

# Install Ollama
curl -fsSL https://ollama.com/install.sh | sh

# Pull the model
ollama pull llama3.2:latest
```

**3. Configure Ollama to accept external connections:**

```bash
# Create systemd override
sudo mkdir -p /etc/systemd/system/ollama.service.d
sudo nano /etc/systemd/system/ollama.service.d/override.conf
```

Add this content:

```ini
[Service]
Environment="OLLAMA_HOST=0.0.0.0:11434"
```

Restart Ollama:

```bash
sudo systemctl daemon-reload
sudo systemctl restart ollama
```

**4. Set up firewall:**

```bash
# Allow Ollama port
sudo ufw allow 11434/tcp

# Enable firewall
sudo ufw enable
```

**5. (Recommended) Set up Nginx reverse proxy with HTTPS:**

```bash
# Install Nginx and Certbot
sudo apt update
sudo apt install nginx certbot python3-certbot-nginx -y

# Create Nginx config
sudo nano /etc/nginx/sites-available/ollama
```

Add this config:

```nginx
server {
    listen 80;
    server_name your-domain.com;  # Replace with your domain

    location / {
        proxy_pass http://localhost:11434;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;

        # Increase timeout for AI processing
        proxy_read_timeout 300s;
        proxy_connect_timeout 300s;
    }
}
```

Enable and get SSL:

```bash
sudo ln -s /etc/nginx/sites-available/ollama /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
sudo certbot --nginx -d your-domain.com
```

**6. Add environment variables to Netlify:**

Go to: https://app.netlify.com/sites/your-site/configuration/env

Add:

```
OLLAMA_API_URL=https://your-domain.com
```

Or if using IP without SSL:

```
OLLAMA_API_URL=http://your-server-ip:11434
```

### Option 2: Deploy on AWS EC2

**1. Launch EC2 instance:**

- AMI: Ubuntu Server 22.04 LTS
- Instance type: t3.medium (2 vCPU, 4GB RAM) or larger
- Security group: Allow inbound TCP 11434 (or 443 if using SSL)

**2. Follow the same installation steps as VPS above**

### Option 3: Use Docker

```bash
# On your server
docker run -d \
  -v ollama:/root/.ollama \
  -p 11434:11434 \
  --name ollama \
  ollama/ollama

# Pull model
docker exec -it ollama ollama pull llama3.2:latest
```

### Security Best Practices

**Option A: IP Whitelist (Simple)**

Only allow Netlify's IPs:

```bash
# Get Netlify IPs from: https://docs.netlify.com/cloud/ip-addresses/
sudo ufw allow from 52.0.0.0/8 to any port 11434
```

**Option B: API Key Authentication (Recommended)**

Add a reverse proxy with authentication:

```nginx
# In your Nginx config, add:
location / {
    # Check for API key
    if ($http_authorization != "Bearer your-secret-key-here") {
        return 401;
    }

    proxy_pass http://localhost:11434;
    # ... rest of proxy config
}
```

Then add to Netlify:

```
OLLAMA_API_KEY=your-secret-key-here
```

### Testing Your Setup

Test from your local machine:

```bash
curl -X POST https://your-domain.com/api/generate \
  -H "Content-Type: application/json" \
  -d '{
    "model": "llama3.2:latest",
    "prompt": "Why is the sky blue?",
    "stream": false
  }'
```

### Cost Estimation

- **DigitalOcean Droplet:** $12-24/month (4GB-8GB RAM)
- **Hetzner Cloud:** €5-10/month (very affordable, EU only)
- **AWS EC2 t3.medium:** ~$30/month
- **Modal.com (Serverless):** Pay per use, ~$0.10-0.50 per 1000 evaluations

## Notes & troubleshooting

- Cancel summary shows points out of attempted, plus the total available for the chosen subject. The current question counts as attempted only if you selected an answer.
- If the "Visit Other Projects" button fails in production, verify the Netlify env var `VITE_CLOUDINARY_PROJECTS_LINK` is set.
- Styles are intentionally scoped (e.g., `.app-shell .quiz-wrapper ...`) to avoid leaking into other pages.
- Exam not unlocking:
  - Ensure `.env` has `EXAM_SECRET` and `JWT_SECRET` (restart dev server after changes).
  - For Discord prekey flow, ensure `DISCORD_PUBLIC_KEY` is set and bot is configured.
  - For local testing, use the developer button ("Öppna (Utvecklare)") or paste `EXAM_SECRET` directly; no email/DB required.
  - Clear `localStorage` keys `preToken` and `examToken` (DevTools → Application → Local Storage) to re-lock for testing.
  - In production, confirm env vars are set on Netlify and a fresh deploy is live.
- Updates not showing or rate-limited:
  - Ensure `public/_redirects` contains the `/api/commits` mapping shown above.
  - Set `GITHUB_TOKEN` in Netlify to avoid GitHub API rate limits.
  - In local dev without Netlify functions, the Updates component tries `/api/commits`, then falls back to `/.netlify/functions/getCommits`, and finally to the public GitHub API.
- AI evaluation not working:
  - **Recommended:** Use Groq (free, fast) - See `FREE_AI_SETUP.md`
  - **Local Development:**
    - Ensure Ollama is running: check `http://localhost:11434` in browser
    - Verify model installed: `ollama list` should show `llama3.2:latest`
  - **Production (Groq/Hugging Face):**
    - Check `AI_PROVIDER` and API key are set in Netlify environment variables
    - Test API key: `curl https://api.groq.com/openai/v1/models -H "Authorization: Bearer YOUR_KEY"`
    - Check Netlify function logs for errors
  - **Production (Self-hosted Ollama):**
    - Check `OLLAMA_API_URL` environment variable is set in Netlify
    - Test your Ollama server: `curl http://your-server:11434/api/tags`
    - Check server firewall allows port 11434
    - Verify Ollama service is running: `sudo systemctl status ollama`
  - Check console for rate limit errors (30 req/min per IP)
  - AI mode evaluates VG-level questions only; G questions use standard multiple choice
  - In AI mode, only questions marked "(AI-bedömd)" use AI evaluation
- NPM lock errors (ECOMPROMISED):
  - If you encounter `npm ERR! code ECOMPROMISED` or a "Lock compromised" error, see `help!/NPM-LOCK-FIX.md` for a step-by-step fix and recommended script (`scripts/dev/fix-npm-lock.ps1`).
  - If no AI provider is configured, AI mode will be automatically disabled with a warning message
- Discord bot issues:
  - Common issues: signature verification failures, channel restrictions, expired tokens
  - Verify Interactions Endpoint URL is set correctly in Discord Developer Portal
  - Ensure `DISCORD_PUBLIC_KEY` matches the key in Discord Developer Portal

## Security and env hygiene

- Do not commit `.env`. The root `.gitignore` already ignores `.env` in all subfolders.
- If you accidentally pushed secrets in the past, rotate them immediately. Optionally, rewrite history with BFG or `git filter-repo` to purge old secrets.

## License

MIT
