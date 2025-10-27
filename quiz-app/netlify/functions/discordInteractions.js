import nacl from "tweetnacl";
import crypto from "crypto";
import { getStore } from "@netlify/blobs";

function makeGUID() {
  return crypto.randomUUID().toUpperCase();
}
function sha256Hex(s) {
  return crypto.createHash("sha256").update(s).digest("hex");
}

function jsonResponse(obj, statusCode = 200, headers = {}) {
  return {
    statusCode,
    headers: { "Content-Type": "application/json", ...headers },
    body: JSON.stringify(obj),
  };
}

export const handler = async (event) => {
  const publicKey = process.env.DISCORD_PUBLIC_KEY;
  const botToken = process.env.DISCORD_BOT_TOKEN;
  const allowedChannel = process.env.DISCORD_ALLOWED_CHANNEL_ID;
  const bypassVerify =
    String(process.env.DISCORD_BYPASS_VERIFY || "").toLowerCase() === "true";
  if (!publicKey)
    return jsonResponse({ error: "Missing DISCORD_PUBLIC_KEY" }, 500);

  const headers = Object.fromEntries(
    Object.entries(event.headers || {}).map(([k, v]) => [
      String(k).toLowerCase(),
      v,
    ]),
  );
  const signature = headers["x-signature-ed25519"];
  const timestamp = headers["x-signature-timestamp"];
  const bodyRaw = event.isBase64Encoded
    ? Buffer.from(event.body || "", "base64").toString("utf8")
    : event.body || "";

  // Verify signature per Discord Interactions (allow temporary bypass via env for initial handshake/debug)
  if (!bypassVerify) {
    try {
      const isVerified = nacl.sign.detached.verify(
        Buffer.from(timestamp + bodyRaw),
        Buffer.from(signature, "hex"),
        Buffer.from(publicKey, "hex"),
      );
      if (!isVerified)
        return { statusCode: 401, body: "invalid request signature" };
    } catch {
      return { statusCode: 401, body: "invalid request signature" };
    }
  }

  let data;
  try {
    data = JSON.parse(bodyRaw);
  } catch {
    return jsonResponse({ error: "Bad JSON" }, 400);
  }

  if (data.type === 1) {
    return jsonResponse({ type: 1 });
  }

  if (data.type === 2) {
    const name = data.data?.name?.toLowerCase();
    const channelId = data.channel_id;
    if (allowedChannel && channelId !== allowedChannel) {
      return jsonResponse({
        type: 4,
        data: {
          content: "Kommandot får bara användas i den angivna kanalen.",
          flags: 64,
        },
      });
    }
    if (name === "prekey") {
      const ttlMinutes = 60;
      const now = Date.now();
      const expiresAt = now + ttlMinutes * 60 * 1000;
      const code = makeGUID();
      const hash = sha256Hex(code);
      const store = getStore("pre-keys");
      await store.setJSON(
        hash,
        { createdAt: now, expiresAt },
        { ttl: ttlMinutes * 60 },
      );

      const content = `Din admin-nyckel (giltig i ${ttlMinutes} min): ${code}`;

      const response = {
        type: 4,
        data: { content, flags: 64 },
      };

      if (botToken && data.member?.user?.id) {
        try {
          const userId = data.member.user.id;
          const dmRes = await fetch(
            "https://discord.com/api/v10/users/@me/channels",
            {
              method: "POST",
              headers: {
                Authorization: `Bot ${botToken}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ recipient_id: userId }),
            },
          );
          const dm = await dmRes.json();
          if (dm?.id) {
            await fetch(
              `https://discord.com/api/v10/channels/${dm.id}/messages`,
              {
                method: "POST",
                headers: {
                  Authorization: `Bot ${botToken}`,
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({ content }),
              },
            );
          }
        } catch {}
      }

      return jsonResponse(response);
    }
  }

  return jsonResponse({
    type: 4,
    data: { content: "Okänt kommando", flags: 64 },
  });
};
