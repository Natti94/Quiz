const { Resend } = require("resend");

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM;
  const toAdmin = process.env.RESEND_TO;

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

  let payload;
  try {
    payload = JSON.parse(event.body || "{}");
  } catch (e) {
    return { statusCode: 400, body: JSON.stringify({ error: "Invalid JSON" }) };
  }

  const recipient = String(payload.recipient || "").trim();
  if (!recipient) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "recipient is required" }),
    };
  }

  try {
    const resend = new Resend(apiKey);
    const subject = "Din tentanyckel";
    const key = process.env.EXAM_SECRET || "dev-secret";
    const html = `
      <p>Hej!</p>
      <p>Här är din tentanyckel:</p>
      <p style="font-size:16px"><strong>${key}</strong></p>
      <p>Öppna sidan, klistra in nyckeln i fältet "Lösenord" och klicka på "Lås upp".</p>
      <p>Om du inte begärt denna nyckel kan du ignorera detta mejl.</p>
    `;

    const mailOptions = { from, to: recipient, subject, html };
    if (toAdmin) mailOptions.bcc = toAdmin;

    const response = await resend.emails.send(mailOptions);
    return {
      statusCode: 200,
      body: JSON.stringify({ ok: true, id: response?.id || null }),
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
