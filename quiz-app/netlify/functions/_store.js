// Unified storage wrapper: prefers Netlify Blobs, optionally falls back to Upstash Redis (REST)
import { getStore as getBlobs } from "@netlify/blobs";

function makeBlobsStore(name) {
  const siteID = process.env.NETLIFY_BLOBS_SITE_ID || process.env.NETLIFY_SITE_ID;
  const token = process.env.NETLIFY_BLOBS_TOKEN;
  if (siteID && token) return getBlobs(name, { siteID, token });
  return getBlobs(name);
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

export function getDataStore(name) {
  // Prefer Blobs. If ambient or token-backed Blobs are unavailable and Upstash is configured, use it.
  try {
    return makeBlobsStore(name);
  } catch (e) {
    // Fall through to Upstash if configured.
    const up = makeUpstashStore(name);
    if (up) return up;
    throw e;
  }
}
