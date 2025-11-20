import { isCategoryAllowed, CookieCategories } from "../../utils/cookies";

export async function userActivity(user, action, metadata = {}) {
  try {
    const userId = typeof user === "string" ? user : (user?.id ?? null);

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
    console.debug("userActivity failed:", err.message || err);
  }
}
