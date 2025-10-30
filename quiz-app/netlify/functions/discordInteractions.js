import nacl from "tweetnacl";
import { getDataStore } from "./_store.js";
import { signJWT } from "./_lib/jwtUtils.js";

function jsonResponse(obj, status = 200) {
  return {
    statusCode: status,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(obj),
  };
}

export const handler = async (event) => {
  const publicKey = process.env.DISCORD_PUBLIC_KEY;
  const bypass =
    String(process.env.DISCORD_BYPASS_VERIFY || "").toLowerCase() === "true";

  if (!bypass && !publicKey) {
    return jsonResponse({ error: "Missing DISCORD_PUBLIC_KEY" }, 500);
  }

  const headers = Object.fromEntries(
    Object.entries(event.headers || {}).map(([k, v]) => [k.toLowerCase(), v]),
  );
  const signature = headers["x-signature-ed25519"];
  const timestamp = headers["x-signature-timestamp"];
  const rawBody = event.isBase64Encoded
    ? Buffer.from(event.body || "", "base64").toString("utf8")
    : event.body || "";

  if (!bypass) {
    try {
      const verified = nacl.sign.detached.verify(
        Buffer.from(timestamp + rawBody),
        Buffer.from(signature, "hex"),
        Buffer.from(publicKey, "hex"),
      );
      if (!verified)
        return { statusCode: 401, body: "invalid request signature" };
    } catch {
      return { statusCode: 401, body: "invalid request signature" };
    }
  }

  let data;
  try {
    data = JSON.parse(rawBody);
  } catch {
    return jsonResponse({ error: "Bad JSON" }, 400);
  }

  if (data.type === 1) return jsonResponse({ type: 1 });

  if (data.type === 2) {
    const name = data.data?.name?.toLowerCase();
    const channelId = data.channel_id;
    const allowed = process.env.DISCORD_ALLOWED_CHANNEL_ID;

    if (allowed && channelId !== allowed) {
      return jsonResponse({
        type: 4,
        data: {
          content: "Kommandot får bara användas i den angivna kanalen.",
          flags: 64,
        },
      });
    }

    if (name === "prekey") {
      const ttl = 30;
      const { token, exp } = signJWT(
        { scope: "pre" },
        process.env.JWT_SECRET,
        ttl * 60,
      );
      const content = `Första stegets token (giltig i ${ttl} min):\n\`${token}\``;
      return jsonResponse({ type: 4, data: { content, flags: 64 } });
    }
  }

  return jsonResponse({
    type: 4,
    data: { content: "Okänt kommando", flags: 64 },
  });
};
