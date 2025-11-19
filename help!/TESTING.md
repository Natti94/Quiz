# Testing

This project supports both Vitest and Jest for tests in the frontend package.
Vitest is useful for quick local iteration and when using Vite; Jest is supported for local terminal runs if you prefer it.

Run tests locally with Vitest:

```powershell
npm run test
# or run only in the workspace
npm --workspace quiz-frontend run test
```

Run tests locally with Jest:

```powershell
npm --workspace quiz-frontend run test:jest
```

The `LLM` handler has a small unit test that runs against the stub provider. To check low-level behavior without Netlify Dev, run `npm run test`.

For runtime Netlify Dev tests use:

```powershell
npm run test:netlify-dev:with-tests
```

This will spin up Netlify Dev and (optionally) copy test files from the `tests/netlify` folder into the runtime functions directory.
