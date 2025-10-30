import crypto from "crypto";

const ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

function makeCode(len = 10) {
  const bytes = crypto.randomBytes(len);
  let out = "";
  for (let i = 0; i < len; i++) out += ALPHABET[bytes[i] % ALPHABET.length];
  return out;
}

function sha256Hex(s) {
  return crypto.createHash("sha256").update(s).digest("hex");
}

export const handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  const adminToken = process.env.ADMIN_TOKEN || "";
  const provided =
    event.headers["x-admin-token"] || event.headers["X-Admin-Token"];
  if (!adminToken || provided !== adminToken) {
    return { statusCode: 401, body: JSON.stringify({ error: "Unauthorized" }) };
  }

  let body = {};
  try {
    body = JSON.parse(event.body || "{}");
  } catch {}

  const ttlMinutes = Math.max(
    1,
    Math.min(24 * 60, Number(body.ttlMinutes) || 60),
  );
  const ttlSec = ttlMinutes * 60;

  let code = String(body.code || "").trim();
  if (!code) {
    if (body.guid === true || body.format === "guid") {
      code = crypto.randomUUID().toUpperCase();
    } else {
      code = makeCode(Number(body.length) || 10);
    }
  }
  const codeNorm = code.trim().toUpperCase();
  const codeHash = sha256Hex(codeNorm);

  const now = Date.now();
  const expiresAt = now + ttlSec * 1000;

  const type = (body.type || "exam").toLowerCase();
  const bucket = type === "pre" ? "pre-keys" : "unlock-keys";

  const store = getDataStore(bucket);
  await store.setJSON(codeHash, { createdAt: now, expiresAt }, { ttl: ttlSec });

  return {
    statusCode: 200,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ok: true, type: bucket, code: codeNorm, expiresAt }),
  };
};
