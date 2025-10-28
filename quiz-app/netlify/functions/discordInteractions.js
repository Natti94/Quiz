import nacl from "tweetnacl";
import crypto from "crypto";
import { getDataStore } from "./_store.js";

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

function getBlobsStore(name) {
  try {
    const siteID = process.env.NETLIFY_BLOBS_SITE_ID || process.env.NETLIFY_SITE_ID;
    const token = process.env.NETLIFY_BLOBS_TOKEN;
    const info = {
      hasSiteID: !!siteID,
      tokenSource: token ? "NETLIFY_BLOBS_TOKEN" : "none",
      siteIDLen: siteID ? String(siteID).length : 0,
      tokenLen: token ? String(token).length : 0,
    };
    console.log("[blobs] config", JSON.stringify(info));
  } catch {}
  return getDataStore(name);
}

export const handler = async (event) => {
  const publicKey = process.env.DISCORD_PUBLIC_KEY;
  const botToken = process.env.DISCORD_BOT_TOKEN;
  const allowedChannel = process.env.DISCORD_ALLOWED_CHANNEL_ID;
  const bypassVerify =
    String(process.env.DISCORD_BYPASS_VERIFY || "").toLowerCase() === "true";
  // Only require the public key when we're actually verifying signatures.
  if (!bypassVerify && !publicKey)
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

  // Early trace to confirm invocations reach the function (safe, no secrets logged)
  try {
    console.log(
      "[discord] invoke",
      JSON.stringify({
        method: event.httpMethod,
        path: event.path,
        bypassVerify,
        hasSig: !!signature,
        hasTs: !!timestamp,
      }),
    );
  } catch {}

  // Verify signature per Discord Interactions (allow temporary bypass via env for initial handshake/debug)
  if (!bypassVerify) {
    try {
      const isVerified = nacl.sign.detached.verify(
        Buffer.from(timestamp + bodyRaw),
        Buffer.from(signature, "hex"),
        Buffer.from(publicKey, "hex"),
      );
      if (!isVerified) {
        console.warn("[discord] signature verification failed (invalid).");
        return { statusCode: 401, body: "invalid request signature" };
      }
    } catch {
      console.warn("[discord] signature verification threw (invalid).");
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
    console.log("[discord] Received PING (type=1). Bypass:", bypassVerify);
    return jsonResponse({ type: 1 });
  }

  if (data.type === 2) {
    const name = data.data?.name?.toLowerCase();
    const channelId = data.channel_id;
    console.log(
      "[discord] Command received",
      JSON.stringify({ name, channelId, bypassVerify })
    );
    if (allowedChannel && channelId !== allowedChannel) {
      console.log(
        "[discord] Command used in disallowed channel",
        JSON.stringify({ channelId, allowedChannel })
      );
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
  const store = getBlobsStore("pre-keys");
      await store.setJSON(
        hash,
        { createdAt: now, expiresAt },
        { ttl: ttlMinutes * 60 },
      );

      const content = `Din admin-nyckel (giltig i ${ttlMinutes} min): ${code}`;
      console.log("[discord] Prekey generated, ttlMinutes=", ttlMinutes);

      return jsonResponse({ type: 4, data: { content, flags: 64 } });
    }
  }

  return jsonResponse({
    type: 4,
    data: { content: "Okänt kommando", flags: 64 },
  });
};
