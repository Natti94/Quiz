import { getDataStore } from "./_store.js";

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
  const token = process.env.NETLIFY_BLOBS_TOKEN;
  const info = {
    hasSiteID: !!siteID,
    hasBlobsToken: !!token,
    siteIDLen: siteID ? String(siteID).length : 0,
    tokenLen: token ? String(token).length : 0,
  };
  try {
    console.log("[blobsDiag] config", JSON.stringify(info));
  } catch {}
  return getDataStore(name);
}

export const handler = async () => {
  try {
    const store = getBlobsStore("diag");
    const key = `probe-${Date.now()}`;
    await store.set(key, "ok", { ttl: 60 });
    const val = await store.get(key, { type: "text" });
    return json(200, { ok: true, wrote: key, readBack: val });
  } catch (err) {
    const siteID =
      process.env.NETLIFY_BLOBS_SITE_ID || process.env.NETLIFY_SITE_ID;
    const token = process.env.NETLIFY_BLOBS_TOKEN;
    return json(500, {
      ok: false,
      error: err?.name || "Error",
      message: err?.message || String(err),
      config: {
        hasSiteID: !!siteID,
        hasBlobsToken: !!token,
        siteIDLen: siteID ? String(siteID).length : 0,
        tokenLen: token ? String(token).length : 0,
      },
    });
  }
};
