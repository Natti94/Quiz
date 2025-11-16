import { parseJwt } from "../../lib/jwt/index.js";

export function getCurrentUser() {
  const token = sessionStorage.getItem("jwtToken");
  if (!token) return null;

  return parseJwt(token);
}
