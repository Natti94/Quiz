export const handler = async (event) => {
  const headers = event.headers || {};
  const host = headers.host || headers["x-forwarded-host"] || "";
  const isLocalEnv =
    process.env.NETLIFY_DEV === "true" ||
    process.env.CONTEXT === "dev" ||
    process.env.NODE_ENV !== "production";
  const isLocalHost = /^(localhost|127\.0\.0\.1)(:\d+)?$/.test(host);

  if (!(isLocalEnv || isLocalHost)) {
    return {
      statusCode: 403,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: "Not available in production" }),
    };
  }

  const requiredToken = process.env.DEV_ACCESS_TOKEN;
  if (requiredToken) {
    const token =
      headers["x-dev-token"] ||
      headers["x-dev-access"] ||
      (event.queryStringParameters && event.queryStringParameters.token);
    if (!token || token !== requiredToken) {
      return {
        statusCode: 401,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ error: "Missing or invalid dev token" }),
      };
    }
  }

  const key = process.env.EXAM_SECRET || "dev-secret";
  return {
    statusCode: 200,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-store",
    },
    body: JSON.stringify({ key }),
  };
};
