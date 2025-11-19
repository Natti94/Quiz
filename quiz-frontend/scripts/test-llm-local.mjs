import { handler } from '../netlify/functions/LLM.js';

(async function () {
  console.log('process.env.DEV_STUB=', process.env.DEV_STUB);
  const ev = { headers: {}, body: JSON.stringify({ prompt: 'Test prompt' }) };
  try {
    const res = await handler(ev);
    console.log('LLM handler result:', res);
  } catch (err) {
    console.error('LLM handler error:', err);
  }
})();
