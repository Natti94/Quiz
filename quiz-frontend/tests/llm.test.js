import { describe, it, expect, beforeEach } from "vitest";

describe("LLM handler (unit)", () => {
  beforeEach(() => {
    process.env.DEV_STUB = "1";
  });

  it("returns a canned response when DEV_STUB=1", async () => {
    const { handler } = await import("../netlify/functions/LLM.js");
    const ev = { headers: {}, body: JSON.stringify({ prompt: "Test prompt" }) };
    const res = await handler(ev);
    expect(res.statusCode).toBe(200);
    const body = JSON.parse(res.body);
    expect(body.model).toBe("dev-stub");
    expect(body.done).toBe(true);
    expect(typeof body.response).toBe("string");
  });

  it("returns 400 when prompt missing", async () => {
    const { handler } = await import("../netlify/functions/LLM.js");
    const ev = { headers: {}, body: JSON.stringify({}) };
    const res = await handler(ev);
    expect(res.statusCode).toBe(400);
    const body = JSON.parse(res.body);
    expect(body.error).toBe("Prompt is required");
  });
});
