# Testing

This project uses Vitest for fast unit tests in the frontend package.

Run tests locally:

```powershell
npm run test
# or run only in the workspace
npm --workspace quiz-frontend run test
```

The `LLM` handler has a small unit test that runs against the stub provider. To check low-level behavior without Netlify Dev, run `npm run test`.

For runtime Netlify Dev tests use:

```powershell
npm run test:netlify-dev:with-tests
```

This will spin up Netlify Dev and (optionally) copy test files from the `tests/netlify` folder into the runtime functions directory.
