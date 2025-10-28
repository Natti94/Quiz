import { getStore } from "@netlify/blobs";

function json(statusCode, body) {
  return {
    statusCode,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  };
}

function getBlobsStore(name) {
  const siteID =
    process.env.NETLIFY_BLOBS_SITE_ID || process.env.NETLIFY_SITE_ID;
  const token =
    process.env.NETLIFY_BLOBS_TOKEN || process.env.NETLIFY_API_TOKEN;
  const tokenSource = process.env.NETLIFY_BLOBS_TOKEN
    ? "NETLIFY_BLOBS_TOKEN"
    : process.env.NETLIFY_API_TOKEN
      ? "NETLIFY_API_TOKEN"
      : "none";

  const info = {
    hasSiteID: !!siteID,
    tokenSource,
    siteIDLen: siteID ? String(siteID).length : 0,
    tokenLen: token ? String(token).length : 0,
  };

  try {
    console.log("[blobsDiag] config", JSON.stringify(info));
  } catch {}

  if (siteID && token) return getStore(name, { siteID, token });
  return getStore(name);
}

export const handler = async () => {
  try {
    const store = getBlobsStore("diag");
    const key = `probe-${Date.now()}`;
    await store.set(key, "ok", { ttl: 60 });
    const val = await store.get(key, { type: "text" });
    return json(200, { ok: true, wrote: key, readBack: val });
  } catch (err) {
    return json(500, {
      ok: false,
      error: err?.name || "Error",
      message: err?.message || String(err),
    });
  }
};
