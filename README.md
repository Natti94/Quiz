# Quiz App (React + Vite)

A small, responsive quiz with multiple subjects. Pick a subject, answer questions, see explanations, and cancel at any time to view your current score.

## Features
- Subject chooser with card UI (PLU and APT included)
- Cancel session and see a summary (score, attempts, total)
- Explanations displayed after each answer
- Mobile-friendly, responsive styles using CSS clamp()
- Clear separation of concerns: chooser (`Form`) vs. quiz (`Subject`)

## Getting started
The app lives in `quiz-app/`.

```powershell
cd quiz-app
npm install
npm run dev
```

Build & preview:

```powershell
cd quiz-app
npm run build
npm run preview
```

## Project structure
```
quiz-app/
	src/
		App.jsx          # App shell: chooser ↔ quiz + cancel summary
		index.css        # Global styles (subject cards, quiz, responsive)
		components/
			form.jsx       # Stateless subject chooser (calls onSelect)
			subject.jsx    # Quiz logic/view (scoring, explanations)
		data/
			apt.js         # APT questions (export const questionsApt)
			plu.js         # PLU questions (export const questionsPlu)
```

## Editing questions
Question shape:

```js
{
	question: "...",
	options: ["A", "B", "C", "D"],
	correct: 1, // index into options
	explanation: "..."
}
```

Update `src/data/apt.js` or `src/data/plu.js`. Arrays are exported as named exports and can be appended via `.push(...)`.

## Adding a new subject
1) Create `src/data/<name>.js` and export your array (e.g., `export const questionsX = [...]`).
2) Wire it in:
	 - `src/components/subject.jsx`: load your dataset when `subject === "<name>"`.
	 - `src/components/form.jsx`: add a new subject card and call `onSelect("<name>")`.
	 - `src/App.jsx`: extend `subjectMeta` (label + icon).

## Notes
- Cancel shows the score accumulated so far: attempts include the current question only if you selected an answer.
- Styles are scoped under `.app-shell .quiz-wrapper` to avoid leaks.

## License
MIT
