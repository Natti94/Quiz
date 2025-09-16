# Quiz App (React + Vite)

A responsive quiz application with multiple subjects. Choose a subject, answer questions with instant feedback and explanations, and cancel at any time to see a summary of your current score.

## Features

- Subject chooser with card UI
- Answer flow with immediate correctness highlight
- Explanation panel shown after selecting an answer
- Cancel session and see a summary (score, attempts, total questions)
- Mobile-friendly, responsive styles using CSS `clamp()` and scoped selectors
- Clean separation of concerns: subject chooser (`Form`) vs quiz runner (`Subject`)
- Netlify Function for external links/assets via environment variables

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
index.html               # Vite HTML
vite.config.js           # Vite config
package.json             # Scripts and dependencies
```

## Getting Started

From this folder (`quiz-app/`):

```powershell
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

A Netlify Function is used to serve external links (for example, the "Visit Other Projects" button). Set the following in `.env` for local development, and in Netlify env vars for production:

```
VITE_CLOUDINARY_PROJECTS_LINK=https://your-projects-site.example.com/
```

- In production, the app calls `/.netlify/functions/getAssets?asset=projects_link` which redirects to the URL above.
- In development, the URL is read directly from `VITE_CLOUDINARY_PROJECTS_LINK`.

## Deploying to Netlify

- Build command: `npm run build`
- Publish directory: `dist`
- Functions directory: `netlify/functions`
- Ensure `_redirects` exists in `public/` (it will be copied to `dist/_redirects`).

## Editing Questions / Adding Subjects

Question object shape:

```js
{
  question: "...",
  options: ["A", "B", "C", "D"],
  correct: 1, // index into options
  explanation: "..."
}
```

- Edit arrays in `src/data/apt.js` and `src/data/plu.js` (named exports).
- Add a new subject by creating `src/data/<name>.js` (export a named array), wiring it in `subject.jsx` (based on the `subject` prop), adding a card in `form.jsx`, and extending `subjectMeta` in `App.jsx` with a label and icon.

## Notes & Troubleshooting

- Cancel summary shows points out of attempted, plus the total available for the chosen subject. The current question counts as attempted only if you selected an answer.
- If the "Visit Other Projects" button fails in production, verify the Netlify env var `VITE_CLOUDINARY_PROJECTS_LINK` is set.
- Styles are intentionally scoped (e.g., `.app-shell .quiz-wrapper ...`) to avoid leaking into other pages.

## License

MIT
