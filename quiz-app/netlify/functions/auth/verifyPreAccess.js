import { getDataStore } from "../_store.js";
import { b64url, signJWT, sha256Hex, verifyJWT } from "../_lib/jwtUtils.js";

function getBlobsStore(name) {
  return getDataStore(name);
}

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

  if (rawKey.split(".").length === 3) {
    const payload = verifyJWT(rawKey, jwtSecret);
    if (payload && payload.scope === "pre") {
      return {
        statusCode: 200,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ok: true, token: rawKey, exp: payload.exp }),
      };
      // Blobs-related logic removed
        const store = getDataStore("pre-keys");
    };
  }

  const store = getBlobsStore("pre-keys");
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

  const { token, exp } = signJWT({ scope: "pre" }, jwtSecret, 30 * 60);

  return {
    statusCode: 200,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ok: true, token, exp }),
  };
};
