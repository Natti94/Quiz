import crypto from "crypto";
import { getDataStore } from "./_store.js";

function b64url(input) {
  return Buffer.from(input)
    .toString("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}

function signJWT(payload, secret, ttlSec) {
  const header = { alg: "HS256", typ: "JWT" };
  const now = Math.floor(Date.now() / 1000);
  const body = { ...payload, iat: now, exp: now + ttlSec };
  const h = b64url(JSON.stringify(header));
  const p = b64url(JSON.stringify(body));
  const data = `${h}.${p}`;
  const sig = crypto
    .createHmac("sha256", secret)
    .update(data)
    .digest("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
  return { token: `${data}.${sig}`, exp: body.exp };
}

function sha256Hex(s) {
  return crypto.createHash("sha256").update(s).digest("hex");
}

function getBlobsStore(name) {
  return getDataStore(name);
}

function verifyJWT(token, secret) {
  try {
    const [h, p, s] = token.split(".");
    if (!h || !p || !s) return null;
    const data = `${h}.${p}`;
    const expected = crypto
      .createHmac("sha256", secret)
      .update(data)
      .digest("base64")
      .replace(/=/g, "")
      .replace(/\+/g, "-")
      .replace(/\//g, "_");
    if (expected !== s) return null;
    const payload = JSON.parse(
      Buffer.from(p.replace(/-/g, "+").replace(/_/g, "/"), "base64").toString(),
    );
    const now = Math.floor(Date.now() / 1000);
    if (typeof payload.exp === "number" && now > payload.exp) return null;
    return payload;
  } catch {
    return null;
  }
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
    }

    return {
      statusCode: 401,
      body: JSON.stringify({ ok: false, error: "Invalid key" }),
    };
  }

  const store = getBlobsStore("pre-keys");
  const code = rawKey.toUpperCase();
  const keyHash = sha256Hex(code);
  const rec = (await (store.consumeJSON?.(keyHash))) || (await store.getJSON(keyHash));
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
