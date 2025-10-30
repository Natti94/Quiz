import { getDataStore } from "./functions/_store.js";
import { signJWT, sha256Hex } from "./jwtUtils.js";

export const handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  let body;
  try {
    body = JSON.parse(event.body || "{}");
  } catch {
    return { statusCode: 400, body: JSON.stringify({ error: "Invalid JSON" }) };
  }

  const provided = String(body.key || "")
    .trim()
    .toUpperCase();
  if (!provided) {
    // tiny delay to thwart timing attacks
    await new Promise((r) => setTimeout(r, 200));
    return { statusCode: 400, body: JSON.stringify({ error: "Key required" }) };
  }

  const jwtSecret = process.env.JWT_SECRET || "dev-secret";
  const store = getDataStore("unlock-keys");
  const keyHash = sha256Hex(provided);

  const rec =
    (await store.consumeJSON?.(keyHash)) || (await store.getJSON(keyHash));

  if (!rec) {
    return {
      statusCode: 401,
      body: JSON.stringify({ ok: false, error: "Invalid key" }),
    };
  }

  const now = Date.now();
  if (rec.expiresAt && now > rec.expiresAt) {
    try {
      await store.delete(keyHash);
    } catch {}
    return {
      statusCode: 410,
      body: JSON.stringify({ ok: false, error: "Expired key" }),
    };
  }

  if (!store.consumeJSON) {
    try {
      await store.delete(keyHash);
    } catch {}
  }

  const { token, exp } = signJWT({ sub: "exam" }, jwtSecret, 6 * 60 * 60);

  return {
    statusCode: 200,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ok: true, token, exp }),
  };
};
