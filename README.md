# Quiz App

> **Note:** This repository contains the finalized version of the project, forked from another of my repositories. As a result, there are few or no commits here aside from the initial import.

A responsive quiz application with multiple subjects. Choose a subject, answer questions with instant feedback and explanations, and cancel at any time to see a summary of your current score. Includes a gated exam with an unlock key and per-question level (G/VG). Now also includes a WAI subject (Web Architecture & Internet) covering HTTP/HTTPS, proxies, authentication/authorization, cryptography, logging, and OWASP Top 10 topics.

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
- WAI subject: Web Architecture & Internet (HTTP, HTTPS, CA, Proxy, AuthN/Z, Helmet, OWASP, crypto, logging)

## Project Structure

```
netlify/
  functions/
    getAssets.js         # Netlify function for asset/link redirects
public/
  _redirects             # SPA fallback (/* -> /index.html)
src/
  App.jsx                # App shell: header, chooser ↔ quiz, cancel summary
  index.css              # Global styles, scoped under .app-shell .quiz-wrapper
  main.jsx               # Entry point (React + Vite)
  components/
    nav.jsx              # "Visit Other Projects" button (uses getAssets or env)
    form.jsx             # Stateless subject chooser (calls onSelect)
    subject.jsx          # Quiz logic/view (shuffle, scoring, explanations)
  data/
    apt.js               # APT questions (export const questionsApt)
    plu.js               # PLU questions (export const questionsPlu)
    pluExam.js           # PLU exam (G/VG) with { level: "G"|"VG", ... }
    wai.js               # WAI questions (export const questionsWai)
index.html               # Vite HTML
vite.config.js           # Vite config
package.json             # Scripts and dependencies
```

## Getting Started

From the app folder:

```powershell
cd quiz-app
npm install
npm run dev
```

Then open http://localhost:5173.

### Build & Preview

```powershell
npm run build
npm run preview
```

- Output goes to `dist/`.
- Files in `public/` (including `_redirects`) are copied to `dist/` automatically by Vite.

## Environment Variables

A Netlify Function is used to serve external links (for example, the "Visit Other Projects" button). Set the following in `.env` (inside `quiz-app/`) for local development, and in Netlify env vars for production:

```
VITE_CLOUDINARY_PROJECTS_LINK=https://your-projects-site.example.com/
VITE_SECRET_KEY=your-exam-unlock-key
```

- In production, the app calls `/.netlify/functions/getAssets?asset=projects_link` which redirects to the URL above.
- In development, the URL is read directly from `VITE_CLOUDINARY_PROJECTS_LINK`.
- The exam unlock form compares the input to `VITE_SECRET_KEY`. When unlocked, a `localStorage` flag `examUnlocked=true` is stored.

## Deploying to Netlify

- Build command: `npm run build`
- Publish directory: `dist`
- Functions directory: `netlify/functions`
- Ensure `_redirects` exists in `public/` (it will be copied to `dist/_redirects`).
- Add environment variables (`VITE_CLOUDINARY_PROJECTS_LINK`, `VITE_SECRET_KEY`) in your site settings.

## Editing Questions / Adding Subjects

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

- Edit arrays in `src/data/apt.js` and `src/data/plu.js` (named exports).
- Exam questions live in `src/data/pluExam.js` and include a `level` (G/VG). The UI shows the level on each question.
- Existing subjects: APT, PLU, PLU Exam, and WAI (Web Architecture & Internet).
- Add a new subject by creating `src/data/<name>.js` (export a named array), wiring it in `subject.jsx` (based on the `subject` prop), adding a card in `form.jsx`, and extending `subjectMeta` in `App.jsx` with a label and icon.

### WAI subject

The WAI (Web Architecture & Internet) subject covers:
- HTTP/HTTPS basics, CA/certificates, proxies, idempotency
- Authentication vs authorization (incl. JWT), Helmet, OWASP overview
- Cryptography concepts: public/private keys, hashing, salting
- Logging types: audit, access, trace
- OWASP Top 10 themes: Identification & Authentication Failures, Vulnerable & Outdated Components, Injection, Security Misconfiguration, Cryptographic Failures, Software & Data Integrity Failures, SSRF, Insecure Design, Broken Access Control

## Notes & Troubleshooting

- Cancel summary shows points out of attempted, plus the total available for the chosen subject. The current question counts as attempted only if you selected an answer.
- If the "Visit Other Projects" button fails in production, verify the Netlify env var `VITE_CLOUDINARY_PROJECTS_LINK` is set.
- Styles are intentionally scoped (e.g., `.app-shell .quiz-wrapper ...`) to avoid leaking into other pages.
- Exam not unlocking:
  - Ensure `.env` has `VITE_SECRET_KEY` (restart dev server after changes).
  - Clear `localStorage` key `examUnlocked` (DevTools → Application → Local Storage) to re-lock for testing.
  - In production, confirm the env var is configured on Netlify and a fresh deploy is live.

## License

MIT
