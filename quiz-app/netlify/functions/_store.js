let client = null;
let db = null;

function getClient() {
  if (!client && process.env.MONGODB_URI) {
    const { MongoClient } = require("mongodb");
    client = new MongoClient(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  }
  return client;
}

export function getDataStore(bucket) {
  if (!process.env.MONGODB_URI) {
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

  if (!db) {
    const c = getClient();

    db = c.db();
  }

  const col = db.collection(bucket);

  return {
    async getJSON(key) {
      const doc = await col.findOne({ _id: key });
      return doc?.data ?? null;
    },
    async setJSON(key, data, { ttl } = {}) {
      const update = { $set: { data } };
      if (ttl) {
        update.$set.expireAt = new Date(Date.now() + ttl * 1000);
      }
      await col.updateOne({ _id: key }, update, { upsert: true });
    },
    async delete(key) {
      await col.deleteOne({ _id: key });
    },
  };
}
