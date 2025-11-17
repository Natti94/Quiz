export function parseJwt(token) {
  if (!token) return null;

  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");

    const _atob =
      typeof atob === "function"
        ? atob
        : (str) =>
            typeof globalThis !== "undefined" && globalThis.Buffer
              ? globalThis.Buffer.from(str, "base64").toString("binary")
              : atob(str);

    const jsonPayload = decodeURIComponent(
      _atob(base64)
        .split("")
        .map(function (c) {
          return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join(""),
    );

    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error("Failed to parse JWT:", error);
    return null;
  }
}
