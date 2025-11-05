import { Resend } from "resend";
import { getDataStore } from "./_store.js";
import { verifyJWT } from "./jwtUtils.js";
import crypto from "crypto";

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
      body: JSON.stringify({ error: "Missing RESEND_FROM" }),
    };
  }

  const authHeader =
    event.headers["authorization"] || event.headers["Authorization"] || "";
  const match = authHeader.match(/^Bearer\s+(.+)$/i);
  const preToken = match ? match[1] : "";
  const payload = preToken ? verifyJWT(preToken, jwtSecret) : null;
  if (!payload || payload.scope !== "pre") {
    return {
      statusCode: 401,
      body: JSON.stringify({ error: "Pre-Access required" }),
    };
  }

  let body;
  try {
    body = JSON.parse(event.body || "{}");
  } catch {
    return { statusCode: 400, body: JSON.stringify({ error: "Invalid JSON" }) };
  }

  const recipient = String(body.recipient || "").trim();
  if (!recipient) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "recipient required" }),
    };
  }

  const ttlMinutes = Math.max(
    5,
    Math.min(24 * 60, Number(body.ttlMinutes) || 120),
  );
  const now = Date.now();
  const expiresAt = now + ttlMinutes * 60 * 1000;
  const code = crypto.randomUUID().toUpperCase();
  const hash = crypto.createHash("sha256").update(code).digest("hex");

  const store = getDataStore("unlock-keys");
  await store.setJSON(
    hash,
    { createdAt: now, expiresAt },
    { ttl: ttlMinutes * 60 },
  );

  const resend = new Resend(apiKey);
  const subject = "Din tentanyckel (engångs)";
  const html = `
    <p>Hej!</p>
    <p>Här är din engångsnyckel för tentan:</p>
    <p style="font-size:16px"><strong>${code}</strong></p>
    <p>Öppna sidan, klistra in nyckeln och klicka <strong>Lås upp</strong>.</p>
    <p>Nyckeln upphör efter första användning eller när den löper ut.</p>
  `;

  const mail = { from, to: recipient, subject, html };
  if (toUser) mail.bcc = toUser;

  try {
    const { data } = await resend.emails.send(mail);
    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ok: true, id: data?.id ?? null, expiresAt }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        error: "Failed to send email",
        details: err.message,
      }),
    };
  }
};
