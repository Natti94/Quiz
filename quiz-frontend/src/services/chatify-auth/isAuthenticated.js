import { logoutUser } from "./logoutUser";
import { parseJwt } from "../../lib/index.js";

export function isAuthenticated() {
  const token = sessionStorage.getItem("jwtToken");
  if (!token) return false;

  const payload = parseJwt(token);
  if (!payload) return false;

  const now = Date.now() / 1000;
  if (payload.exp && payload.exp < now) {
    logoutUser();
    return false;
  }

  return true;
}
