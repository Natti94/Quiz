import { MongoClient } from "mongodb";
import { verifyJWT } from "./jwtUtils.js";
import crypto from "crypto";

let __clientPromise;
async function getMongoClient() {
  const uri = process.env.MONGODB_URI;
  if (!uri) return null;
  if (!__clientPromise) {
    const client = new MongoClient(uri, { maxPoolSize: 3 });
    __clientPromise = client.connect();
  }
  try {
    return await __clientPromise;
  } catch (err) {
    __clientPromise = undefined;
    throw err;
  }
}

export async function handler(event) {
  if (event.httpMethod === "GET") {
    try {
      const client = await getMongoClient();
      if (!client) return { statusCode: 204, body: "" };

      const db = client.db(process.env.MONGODB_DB || "quiz-app");
      const col = db.collection("userActivities");

      const authHeader =
        event.headers["authorization"] || event.headers["Authorization"] || "";
      const match = authHeader.match(/^Bearer\s+(.+)$/i);
      let userId = null;
      if (match) {
        const token = match[1];
        const payload = verifyJWT(
          token,
          process.env.JWT_SECRET || "dev-secret"
        );
        if (!payload)
          return {
            statusCode: 401,
            body: JSON.stringify({ error: "Invalid token" }),
          };
        userId = payload.id || payload.userId || payload.sub || null;
      } else if (process.env.NETLIFY_DEV === "true") {
        userId =
          (event.queryStringParameters && event.queryStringParameters.userId) ||
          null;
      }

      if (!userId) {
        return {
          statusCode: 400,
          body: JSON.stringify({ error: "userId required" }),
        };
      }

      const docs = await col
        .find({ userId })
        .sort({ createdAt: -1 })
        .limit(200)
        .toArray();

      return { statusCode: 200, body: JSON.stringify(docs) };
    } catch (err) {
      console.error("listUserActivity error:", err);
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "Internal Error" }),
      };
    }
  }

  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method not allowed" }),
    };
  }

  try {
    const body = JSON.parse(event.body || "{}");
    const userId = body.userId ?? null;
    const action = String(body.action || "unknown");
    const metadata = body.metadata ?? {};

    const client = await getMongoClient();
    if (!client) {
      console.warn("MongoDB not configured — analytics disabled");
      return { statusCode: 204, body: "" };
    }

    const db = client.db(process.env.MONGODB_DB || "quiz-app");
    const col = db.collection("userActivities");

    const ip = (
      event.headers["x-forwarded-for"] ||
      event.headers["client-ip"] ||
      ""
    )
      .split(",")[0]
      .trim();
    const ipHash = ip
      ? crypto.createHash("sha256").update(ip).digest("hex")
      : null;

    const doc = {
      userId,
      action,
      metadata,
      ipHash,
      userAgent: (event.headers["user-agent"] || "").slice(0, 512),
      createdAt: new Date(),
    };

    // Insert is quick — don't block other actions for side-effects.
    await col.insertOne(doc);

    // Create useful indexes if not existing (no-op if already present)
    await col.createIndex({ userId: 1, createdAt: -1 });
    // Keep a TTL index example — set expiresAt in metadata if appropriate
    await col.createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 });

    return { statusCode: 201, body: JSON.stringify({ ok: true }) };
  } catch (err) {
    console.error("recordUserActivity error:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Internal Error" }),
    };
  }
}
