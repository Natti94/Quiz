// netlify/functions/auth/verifyPreAccess.js
import { getDataStore } from "../_store.js";
import {
  sha256Hex,
  signJWT,
  verifyJWT,
} from "../_lib/jwtUtils.js";

const store = getDataStore("pre-keys");

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

  const rawKey = String(body.key || "").trim();
  if (!rawKey) {
    return { statusCode: 400, body: JSON.stringify({ error: "Key required" }) };
  }

  const jwtSecret = process.env.JWT_SECRET || "dev-secret";

  // -------------------------------------------------
  // 1. Allow a JWT that already has scope=pre
  // -------------------------------------------------
  if (rawKey.split(".").length === 3) {
    const payload = verifyJWT(rawKey, jwtSecret);
    if (payload?.scope === "pre") {
      return {
        statusCode: 200,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ok: true, token: rawKey, exp: payload.exp }),
      };
    }
  }

  // -------------------------------------------------
  // 2. Normal one-time code flow
  // -------------------------------------------------
  const code = rawKey.toUpperCase();
  const keyHash = sha256Hex(code);

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
    try { await store.delete(keyHash); } catch {}
    return {
      statusCode: 410,
      body: JSON.stringify({ ok: false, error: "Expired key" }),
    };
  }

  // Delete after first use (if consumeJSON not supported)
  if (!store.consumeJSON) {
    try { await store.delete(keyHash); } catch {}
  }

  const { token, exp } = signJWT({ scope: "pre" }, jwtSecret, 30 * 60); // 30 min

  return {
    statusCode: 200,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ok: true, token, exp }),
  };
};