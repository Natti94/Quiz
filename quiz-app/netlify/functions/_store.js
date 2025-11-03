let client = null;
let db = null;

async function getClient() {
  if (!client && process.env.MONGODB_URI) {
    const { MongoClient } = await import("mongodb");
    client = new MongoClient(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  }
  return client;
}

export function getDataStore(collectionName) {
  if (process.env.NETLIFY_DEV === "true" || !process.env.MONGODB_URI) {
    console.warn("[_store] MONGODB_URI missing – using in-memory stub");
    const mem = new Map();
    return {
      async getJSON(key) {
        const doc = mem.get(key);
        return doc?.data ?? null;
      },
      async setJSON(key, data, { ttl } = {}) {
        const entry = { data };
        if (ttl) entry.expireAt = Date.now() + ttl * 1000;
        mem.set(key, entry);
      },
      async delete(key) {
        mem.delete(key);
      },
    };
  }

  async function ensureDb() {
    if (!db) {
      const c = await getClient();
      db = c.db("quiz-app");
    }
    return db;
  }

  return {
    async getJSON(key) {
      const database = await ensureDb();
      const col = database.collection(collectionName);
      const doc = await col.findOne({ _id: key });
      return doc?.data ?? null;
    },
    async setJSON(key, data, { ttl } = {}) {
      const database = await ensureDb();
      const col = database.collection(collectionName);
      const update = { $set: { data } };
      if (ttl) {
        update.$set.expireAt = new Date(Date.now() + ttl * 1000);
      }
      await col.updateOne({ _id: key }, update, { upsert: true });
    },
    async delete(key) {
      const database = await ensureDb();
      const col = database.collection(collectionName);
      await col.deleteOne({ _id: key });
    },
  };
}
