/* eslint-env node */
/* global process */
import { describe, it, expect, beforeEach } from 'vitest';
import { handler } from '../netlify/functions/LLM.js';

describe('LLM handler (unit)', () => {
  beforeEach(() => {
    // Force stubbed provider for deterministic tests
    process.env.DEV_STUB = '1';
  });

  it('returns a canned response when DEV_STUB=1', async () => {
    const ev = { headers: {}, body: JSON.stringify({ prompt: 'Test prompt' }) };
    const res = await handler(ev);
    expect(res.statusCode).toBe(200);
    const body = JSON.parse(res.body);
    expect(body.model).toBe('dev-stub');
    expect(body.done).toBe(true);
    expect(typeof body.response).toBe('string');
  });

  it('returns 400 when prompt missing', async () => {
    const ev = { headers: {}, body: JSON.stringify({}) };
    const res = await handler(ev);
    expect(res.statusCode).toBe(400);
    const body = JSON.parse(res.body);
    expect(body.error).toBe('Prompt is required');
  });
});
