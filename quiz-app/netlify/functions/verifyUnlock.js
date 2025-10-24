const crypto = require("crypto");

function b64url(input) {
  return Buffer.from(input)
    .toString("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}

function signJWT(payload, secret, ttlSec = 6 * 60 * 60) {
  const header = { alg: "HS256", typ: "JWT" };
  const now = Math.floor(Date.now() / 1000);
  const body = { ...payload, iat: now, exp: now + ttlSec };
  const h = b64url(JSON.stringify(header));
  const p = b64url(JSON.stringify(body));
  const data = `${h}.${p}`;
  const sig = crypto.createHmac("sha256", secret).update(data).digest("base64").replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
  return { token: `${data}.${sig}`, exp: body.exp };
}

function safeEqual(a, b, key = "k") {
  try {
    const aBuf = Buffer.isBuffer(a) ? a : Buffer.from(String(a));
    const bBuf = Buffer.isBuffer(b) ? b : Buffer.from(String(b));
    if (aBuf.length === bBuf.length) return crypto.timingSafeEqual(aBuf, bBuf);
    // Compare HMACs of different-length inputs to keep timing consistent
    const ah = crypto.createHmac("sha256", key).update(aBuf).digest();
    const bh = crypto.createHmac("sha256", key).update(bBuf).digest();
    return crypto.timingSafeEqual(ah, bh);
  } catch {
    return false;
  }
}

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  let body;
  try {
    body = JSON.parse(event.body || "{}");
  } catch {
    return { statusCode: 400, body: JSON.stringify({ error: "Invalid JSON" }) };
  }

  const provided = String(body.key || "");
  if (!provided) {
    // Uniform response to avoid giving hints
    await new Promise((r) => setTimeout(r, 300));
    return { statusCode: 400, body: JSON.stringify({ error: "Key required" }) };
  }

  const actual = process.env.EXAM_SECRET || "";
  const jwtSecret = process.env.JWT_SECRET || process.env.EXAM_SECRET || "dev-secret";

  // Fixed small delay to reduce brute force rate without storage
  await new Promise((r) => setTimeout(r, 200));

  if (!actual) {
    return { statusCode: 500, body: JSON.stringify({ error: "Server not configured" }) };
  }

  const match = safeEqual(provided, actual, jwtSecret);
  if (!match) {
    return { statusCode: 401, body: JSON.stringify({ ok: false }) };
  }

  const { token, exp } = signJWT({ sub: "exam" }, jwtSecret, 6 * 60 * 60);
  return {
    statusCode: 200,
    body: JSON.stringify({ ok: true, token, exp }),
    headers: { "Content-Type": "application/json" },
  };
};
