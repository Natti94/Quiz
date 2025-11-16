import { generateCsrf } from "./generateCsrf.js";
import { parseJwt } from "../../lib/jwt-utils/index.js";
import { apiRequest } from "../../lib/http-request/index.js";

const AUTH_API_BASE = import.meta.env.VITE_AUTH_API_BASE_URL;

export async function loginUser(username, password) {
  let csrfToken = localStorage.getItem("csrfToken");
  if (!csrfToken) {
    csrfToken = await generateCsrf();
  }

  const data = await apiRequest(`${AUTH_API_BASE}/token`, {
    method: "POST",
    body: { username, password, csrfToken },
    successMessage: "Login successful",
    errorMessage: "Login failed. Please check your credentials.",
  });

  if (data?.token) {
    sessionStorage.setItem("jwtToken", data.token);
    const payload = parseJwt(data.token);
    return { token: data.token, user: payload };
  }

  throw new Error("No JWT token received in login response.");
}
