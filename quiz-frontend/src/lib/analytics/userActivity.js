// Frontend should not import server-side helpers or connect directly to a DB.
// Instead call a server endpoint which can validate auth and write to MongoDB.
import { isCategoryAllowed, CookieCategories } from "../../utils/cookies";

export async function userActivity(user, action, metadata = {}) {
  try {
    // user may be a string id or an object with id
    const userId = typeof user === "string" ? user : user?.id ?? null;

    // send event to server; it will decide what to store (avoid PII on client-side)
    if (!isCategoryAllowed(CookieCategories.ANALYTICS)) return;

    const token = sessionStorage.getItem("jwtToken");
    const headers = { "Content-Type": "application/json" };
    if (token) headers["Authorization"] = `Bearer ${token}`;

    await fetch("/api/user/activity", {
      method: "POST",
      headers,
      body: JSON.stringify({ userId, action, metadata }),
    });
  } catch (err) {
    // don't crash the app when analytics fail
    console.debug("userActivity failed:", err.message || err);
  }
}
