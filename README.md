# Quiz App

A responsive quiz application with multiple subjects. Choose a subject, answer questions with instant feedback and explanations, and cancel at any time to see a summary of your current score. Includes a gated exam with an unlock key and per-question level (G/VG). The WAI subject (Web Architecture & Internet) covers HTTP/HTTPS, proxies, authN/Z, crypto, logging, and OWASP Top 10 topics. An Updates section displays the latest commits from this repository via a Netlify Function (with Prev/Next navigation).

Automated releases: the project uses Conventional Commits + semantic-release to auto-bump versions (patch/minor/major), generate a changelog, tag, and publish GitHub Releases on pushes to main. The current version is also shown in the app header.

## Features

- Subject chooser with card UI
- Answer flow with immediate correctness highlight
- Explanation panel shown after selecting an answer
- Cancel session and see a summary (score, attempts, total questions)
- Mobile-friendly, responsive styles using CSS `clamp()` and scoped selectors
- Clean separation of concerns: subject chooser (`Form`) vs quiz runner (`Subject`)
- Gated exam subject with unlock key (persisted in `localStorage`)
- Per-question level display (G/VG) for exam questions
- Netlify Function for external links/assets via environment variables
- Updates section that shows latest repo commits (via `/api/commits` → Netlify Function), with single-commit viewer and Prev/Next controls
- WAI subject: Web Architecture & Internet (HTTP, HTTPS, CA, Proxy, AuthN/Z, Helmet, OWASP, crypto, logging)

## Project structure

Note: The app lives in the `quiz-app/` subfolder.

```
quiz-app/
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
      verifyPreAccess.js   # Step 1: verify admin key (JWT pre-token)
      requestUnlock.js     # Step 2: email a one-time key (Resend)
      verifyUnlock.js      # Step 3: verify key → issue unlock JWT
      getDevUnlockKey.js   # Dev-only helper to fetch local key
      _store.js, jwtUtils.js, generateUnlockKey.js

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
          form.jsx       # Stateless subject chooser
          subject.jsx    # Quiz logic/view (shuffle, scoring, explanations)
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
```

## Getting Started

From the app folder:

```powershell
cd quiz-app
npm install
npm run dev
```

Then open http://localhost:5173.

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

Create a local `.env` inside `quiz-app/` (do not commit it; the repo ignores `.env`). Configure the same keys in your Netlify site settings for production.

Required

Client (public):

```
VITE_CLOUDINARY_PROJECTS_LINK=https://your-projects-site.example.com/
```

Server (Netlify Functions):

```
EXAM_SECRET=your-local-or-prod-exam-key
JWT_SECRET=your-jwt-signing-secret
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

### Local dev behavior

- In Netlify Dev (localhost), the unlock flow can skip email/DB. The app can fetch a developer key ("Öppna (Utvecklare)") and `verifyUnlock` accepts `EXAM_SECRET` directly.
- The data store uses an in-memory map in dev (no MongoDB needed). You can omit `MONGODB_URI` in local `.env`.

### Automated releases (semantic-release)

- Workflow: `.github/workflows/release.yml` (runs on push to `main`).
- Config: `quiz-app/.releaserc.json`.
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
  /api/commits         /.netlify/functions/getCommits      200
  /api/assets          /.netlify/functions/getAssets       200
  /api/getDevUnlockKey /.netlify/functions/getDevUnlockKey 200
  /api/requestUnlock   /.netlify/functions/requestUnlock   200
  /api/verifyUnlock    /.netlify/functions/verifyUnlock    200
  /*                   /index.html                         200
  ```

- Add environment variables (`VITE_CLOUDINARY_PROJECTS_LINK`, `EXAM_SECRET`, `JWT_SECRET`, and optionally `GITHUB_TOKEN`, `RESEND_*`) in your site settings.

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

- Edit arrays in `src/data/quiz/default/apt.js` and `src/data/quiz/default/plu.js` (named exports).
- Exam questions live in `src/data/quiz/exam/pluExam.js` and include a `level` (G/VG). The UI shows the level on each question.
- Existing subjects: APT, PLU, PLU Exam, and WAI (Web Architecture & Internet).
- Add a new subject by creating `src/data/quiz/<name>.js` (export a named array), wiring it in `subject.jsx` (based on the `subject` prop), adding a card in `form.jsx`, and extending any subject metadata registry (label/icon) used in `App.jsx`.

## Notes & troubleshooting

- Cancel summary shows points out of attempted, plus the total available for the chosen subject. The current question counts as attempted only if you selected an answer.
- If the "Visit Other Projects" button fails in production, verify the Netlify env var `VITE_CLOUDINARY_PROJECTS_LINK` is set.
- Styles are intentionally scoped (e.g., `.app-shell .quiz-wrapper ...`) to avoid leaking into other pages.
- Exam not unlocking:
  - Ensure `.env` has `EXAM_SECRET` and `JWT_SECRET` (restart dev server after changes).
  - For local testing, use the developer button ("Öppna (Utvecklare)") or paste `EXAM_SECRET` directly; no email/DB required.
  - Clear `localStorage` keys `preToken` and `examToken` (DevTools → Application → Local Storage) to re-lock for testing.
  - In production, confirm env vars are set on Netlify and a fresh deploy is live.
- Updates not showing or rate-limited:
  - Ensure `public/_redirects` contains the `/api/commits` mapping shown above.
  - Set `GITHUB_TOKEN` in Netlify to avoid GitHub API rate limits.
  - In local dev without Netlify functions, the Updates component tries `/api/commits`, then falls back to `/.netlify/functions/getCommits`, and finally to the public GitHub API.

## Security and env hygiene

- Do not commit `.env`. The root `.gitignore` already ignores `.env` in all subfolders.
- If you accidentally pushed secrets in the past, rotate them immediately. Optionally, rewrite history with BFG or `git filter-repo` to purge old secrets.

## License

MIT
