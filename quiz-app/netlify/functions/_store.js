import { getStore as getBlobs } from "@netlify/blobs";
import { makeMongoStore } from "./_lib/mongoStore.js";

function makeBlobsStore(name, upstash) {
  const siteID =
    process.env.NETLIFY_BLOBS_SITE_ID || process.env.NETLIFY_SITE_ID;
  const token = process.env.NETLIFY_BLOBS_TOKEN;
  const base =
    siteID && token ? getBlobs(name, { siteID, token }) : getBlobs(name);

  const wrap =
    (fn) =>
    async (...args) => {
      try {
        return await base[fn](...args);
      } catch (err) {
        const msg = String(err?.name || err?.message || err);
        const isMissing = msg.includes("MissingBlobsEnvironmentError");
        if (isMissing && upstash) {
          return await upstash[fn](...args);
        }
        throw err;
      }
    };
  return {
    setJSON: wrap("setJSON"),
    getJSON: wrap("getJSON"),
    delete: wrap("delete"),
    set: wrap("set"),
    get: wrap("get"),
  };

  let __mongoClientPromise;
  async function getMongoClient() {
    const uri = process.env.MONGODB_URI;
    if (!uri) return null;
    if (!__mongoClientPromise) {
      const client = new MongoClient(uri, { maxPoolSize: 3 });
      __mongoClientPromise = client.connect();
    }
    try {
      return await __mongoClientPromise;
    } catch {
      __mongoClientPromise = undefined;
      return null;
    }
  }

  function makeMongoStore(name) {
    const uri = process.env.MONGODB_URI;
    if (!uri) return null;
    const dbName = process.env.MONGODB_DB || "app";
    return {
      async setJSON(key, value, opts = {}) {
        const client = await getMongoClient();
        if (!client) throw new Error("MongoDB client not available");
        const coll = client.db(dbName).collection(name);
        const ttlSec = Number(opts.ttl) || undefined;
        const expiresAt = ttlSec ? new Date(Date.now() + ttlSec * 1000) : null;
        await coll.updateOne(
          { _id: key },
          { $set: { json: value, text: null, expiresAt } },
          { upsert: true },
        );
      },
      async getJSON(key) {
        const client = await getMongoClient();
        if (!client) throw new Error("MongoDB client not available");
        const coll = client.db(dbName).collection(name);
        const doc = await coll.findOne({ _id: key });
        if (!doc) return null;
        if (doc.expiresAt && doc.expiresAt < new Date()) {
          await coll.deleteOne({ _id: key });
          return null;
        }
        return doc.json ?? null;
      },
      async consumeJSON(key) {
        const client = await getMongoClient();
        if (!client) throw new Error("MongoDB client not available");
        const coll = client.db(dbName).collection(name);
        const res = await coll.findOneAndDelete({ _id: key });
        const doc = res?.value || null;
        if (!doc) return null;
        if (doc.expiresAt && doc.expiresAt < new Date()) return null;
        return doc.json ?? null;
      },
      async delete(key) {
        const client = await getMongoClient();
        if (!client) throw new Error("MongoDB client not available");
        const coll = client.db(dbName).collection(name);
        await coll.deleteOne({ _id: key });
      },
      async set(key, value, opts = {}) {
        const client = await getMongoClient();
        if (!client) throw new Error("MongoDB client not available");
        const coll = client.db(dbName).collection(name);
        const ttlSec = Number(opts.ttl) || undefined;
        const expiresAt = ttlSec ? new Date(Date.now() + ttlSec * 1000) : null;
        await coll.updateOne(
          { _id: key },
          { $set: { text: String(value), json: null, expiresAt } },
          { upsert: true },
        );
      },
      async get(key, { type } = {}) {
        const client = await getMongoClient();
        if (!client) throw new Error("MongoDB client not available");
        const coll = client.db(dbName).collection(name);
        const doc = await coll.findOne({ _id: key });
        if (!doc) return null;
        if (doc.expiresAt && doc.expiresAt < new Date()) {
          await coll.deleteOne({ _id: key });
          return null;
        }
        const v = doc.text ?? null;
        if (v == null) return null;
        return type === "json" ? JSON.parse(v) : String(v);
      },
    };
  }
  function makeUpstashStore(name) {
    const base = process.env.UPSTASH_REDIS_REST_URL;
    const token = process.env.UPSTASH_REDIS_REST_TOKEN;
    if (!base || !token) return null;
    const prefix = `${name}:`;
    const headers = {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };
    async function cmd(args) {
      const res = await fetch(base, {
        method: "POST",
        headers,
        body: JSON.stringify(args),
      });
      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(`Upstash error ${res.status}: ${text}`);
      }
      return res.json();
    }
    return {
      async setJSON(key, value, opts = {}) {
        const ttlSec = Number(opts.ttl) || undefined;
        const k = prefix + key;
        const payload = ["SET", k, JSON.stringify(value)];
        if (ttlSec) payload.push("EX", ttlSec);
        await cmd(payload);
      },
      async getJSON(key) {
        const k = prefix + key;
        const out = await cmd(["GET", k]);
        const v = out?.result ?? null;
        if (v == null) return null;
        try {
          return JSON.parse(v);
        } catch {
          return null;
        }
      },
      async consumeJSON(key) {
        const k = prefix + key;
        const out = await cmd(["GETDEL", k]);
        const v = out?.result ?? null;
        if (v == null) return null;
        try {
          return JSON.parse(v);
        } catch {
          return null;
        }
      },
      async delete(key) {
        const k = prefix + key;
        await cmd(["DEL", k]);
      },
      async set(key, value, opts = {}) {
        const ttlSec = Number(opts.ttl) || undefined;
        const k = prefix + key;
        const payload = ["SET", k, String(value)];
        if (ttlSec) payload.push("EX", ttlSec);
        await cmd(payload);
      },
      async get(key, { type } = {}) {
        const k = prefix + key;
        const out = await cmd(["GET", k]);
        const v = out?.result ?? null;
        if (v == null) return null;
        return type === "json" ? JSON.parse(v) : String(v);
      },
    };
  }

  if (process.env.MONGODB_URI) {
    const mongo = makeMongoStore(name);
    if (mongo) return mongo;
  }
  const up = makeUpstashStore(name);
  return makeBlobsStore(name, up);
}
