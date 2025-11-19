// Temporary test function to verify Netlify Dev registers functions correctly
exports.handler = async function (event, context) {
  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ok: true, function: 'LLM_test' }),
  };
};
