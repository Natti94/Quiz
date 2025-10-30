import { MongoClient } from "mongodb";

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

export function makeMongoStore(name) {
  const uri = process.env.MONGODB_URI;
  if (!uri) return null;
  const dbName = process.env.MONGODB_DB || "app";
  return {
    async setJSON(key, value, opts = {}) {
      console.log(`[mongoStore] setJSON: collection=${name}, key=${key}`);
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
      console.log(`[mongoStore] getJSON: collection=${name}, key=${key}`);
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
      console.log(`[mongoStore] consumeJSON: collection=${name}, key=${key}`);
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
      console.log(`[mongoStore] delete: collection=${name}, key=${key}`);
      const client = await getMongoClient();
      if (!client) throw new Error("MongoDB client not available");
      const coll = client.db(dbName).collection(name);
      await coll.deleteOne({ _id: key });
    },
    async set(key, value, opts = {}) {
      console.log(`[mongoStore] set: collection=${name}, key=${key}`);
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
      console.log(`[mongoStore] get: collection=${name}, key=${key}`);
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
