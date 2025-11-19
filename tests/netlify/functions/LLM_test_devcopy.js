// Simple dev-only function used to verify Netlify Dev function routing.
// Placed under `tests/netlify/functions/` and copied into the runtime
// functions folder during test runs. This should never be published.
exports.handler = async function (event, context) {
  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ok: true, function: 'LLM_test' }),
  };
};
