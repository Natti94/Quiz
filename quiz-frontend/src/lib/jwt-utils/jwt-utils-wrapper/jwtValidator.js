import { parseJwt } from "./parseJwt.js";

export function jwtValidator(token) {
  const payload = parseJwt(token);
  if (!payload || !payload.exp) return true;

  const now = Date.now() / 1000;
  return payload.exp < now;
}
