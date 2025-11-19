Small helpers for local Netlify Dev testing.

Place any helper functions (like `LLM_test_devcopy.js`) here. They will get copied into the `quiz-frontend/netlify/functions` folder when running:

```powershell
npm run test:netlify-dev:with-tests
```

This copies files with a `test_` prefix (so they don't overwrite production functions), runs the Netlify Dev test script which validates these endpoints, and then cleans them up.

To copy tests without running tests, run:

```bash
node ./scripts/test/copy-netlify-tests.mjs
```

To remove previously copied tests:

```bash
node ./scripts/test/copy-netlify-tests.mjs --clean
```

Flags you can use with the copy script:
- `--force` — overwrite even if the file contents are identical (useful when you want to ensure the test file is re-copied and retrigger function reloads).
- `--dry-run` — show what would be copied/removed without changing the filesystem.
- `--no-prefix` — copy using the original filenames instead of a `test_` prefix (be cautious; this can overwrite production files).

Notes:
- The copy step is idempotent; it overwrites any existing prefixed test functions unless `--force` is omitted and files are identical.
- Keep test functions small & local-only. Do not copy production secrets.
