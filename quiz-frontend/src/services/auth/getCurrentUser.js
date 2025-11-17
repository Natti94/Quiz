import { parseJwt } from "../../lib";

export function getCurrentUser() {
  const token = sessionStorage.getItem("jwtToken");
  if (!token) return null;

  return parseJwt(token);
}
