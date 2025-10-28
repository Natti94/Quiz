import crypto from "crypto";
import { Resend } from "resend";
import { getDataStore } from "./_store.js";

function parseJWT(token) {
  try {
    const [h, p, s] = token.split(".");
    const payload = JSON.parse(
      Buffer.from(p.replace(/-/g, "+").replace(/_/g, "/"), "base64").toString(),
    );
    return { header: h, payload, signature: s };
  } catch {
    return null;
  }
}

function b64url(input) {
  return Buffer.from(input)
    .toString("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
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

  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM;
  const toAdmin = process.env.RESEND_TO;
  const jwtSecret = process.env.JWT_SECRET || "dev-secret";

  if (!apiKey) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Missing RESEND_API_KEY" }),
    };
  }
  if (!from) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Missing RESEND_FROM (verified sender)" }),
    };
  }

  const auth =
    event.headers["authorization"] || event.headers["Authorization"] || "";
  const m = auth.match(/^Bearer\s+(.+)$/i);
  const preToken = m ? m[1] : "";
  const payload = preToken ? verifyJWT(preToken, jwtSecret) : null;
  if (!payload || payload.scope !== "pre") {
    return {
      statusCode: 401,
      body: JSON.stringify({ error: "Preaccess required" }),
    };
  }

  let body;
  try {
    body = JSON.parse(event.body || "{}");
  } catch (e) {
    return { statusCode: 400, body: JSON.stringify({ error: "Invalid JSON" }) };
  }

  const recipient = String(body.recipient || "").trim();
  if (!recipient) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "recipient is required" }),
    };
  }

  try {
    const code = crypto.randomUUID().toUpperCase();
    const store = getDataStore("unlock-keys");
    const ttlMinutes = Math.max(
      5,
      Math.min(24 * 60, Number(body.ttlMinutes) || 120),
    );
    const now = Date.now();
    const expiresAt = now + ttlMinutes * 60 * 1000;
    const hash = crypto.createHash("sha256").update(code).digest("hex");
    await store.setJSON(
      hash,
      { createdAt: now, expiresAt },
      { ttl: ttlMinutes * 60 },
    );

    const resend = new Resend(apiKey);
    const subject = "Din tentanyckel (engångs)";
    const key = code;
    const html = `
      <p>Hej!</p>
      <p>Här är din engångsnyckel för att låsa upp tentan:</p>
      <p style="font-size:16px"><strong>${key}</strong></p>
      <p>Öppna sidan, klistra in nyckeln i fältet "Lösenord" och klicka på "Lås upp". Nyckeln upphör att gälla efter användning eller när den löper ut.</p>
      <p>Om du inte begärt denna nyckel kan du ignorera detta mejl.</p>
    `;

    const mailOptions = { from, to: recipient, subject, html };
    if (toAdmin) mailOptions.bcc = toAdmin;

    const response = await resend.emails.send(mailOptions);
    return {
      statusCode: 200,
      body: JSON.stringify({ ok: true, id: response?.id || null, expiresAt }),
      headers: { "Content-Type": "application/json" },
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "Failed to send email",
        details: err.message,
      }),
      headers: { "Content-Type": "application/json" },
    };
  }
};
