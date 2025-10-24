const { Resend } = require("resend");

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM;
  const toAdmin = process.env.RESEND_TO; // where to send unlock requests

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
  if (!toAdmin) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Missing RESEND_TO (admin inbox)" }),
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
    const subject = "Unlock Key Request";
    const html = `
      <p>Användare har begärt tentanyckel.</p>
      <p><strong>E-post:</strong> ${recipient}</p>
    `;

    const response = await resend.emails.send({ from, to: toAdmin, subject, html });
    return {
      statusCode: 200,
      body: JSON.stringify({ ok: true, id: response?.id || null }),
      headers: { "Content-Type": "application/json" },
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to send email", details: err.message }),
      headers: { "Content-Type": "application/json" },
    };
  }
};
