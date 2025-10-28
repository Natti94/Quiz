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
    return { statusCode: 400, body: JSON.stringify({ error: "Key required" }) };
  }

  const store = getBlobsStore("pre-keys");
  const keyHash = sha256Hex(provided);
  const rec = await store.getJSON(keyHash);
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

  try {
    await store.delete(keyHash);
  } catch {}

  const jwtSecret = process.env.JWT_SECRET || "dev-secret";
  const { token, exp } = signJWT({ scope: "pre" }, jwtSecret, 30 * 60);

  return {
    statusCode: 200,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ok: true, token, exp }),
  };
};
