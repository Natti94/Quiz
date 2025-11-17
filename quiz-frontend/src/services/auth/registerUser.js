import { generateCsrf } from "./generateCsrf.js";
import { apiRequest } from "../../lib/index.js";

const AUTH_API_BASE = import.meta.env.VITE_AUTH_API_BASE_URL;

export async function registerUser({ username, email, password, csrfToken }) {
  if (!csrfToken) {
    csrfToken = await generateCsrf();
  }

  const data = await apiRequest(`${AUTH_API_BASE}/auth/register`, {
    method: "POST",
    body: { username, password, email, csrfToken },
    successMessage: "Registration successful",
    errorMessage:
      "Registration failed. Username or email may already be in use.",
  });

  if (data?.registerUser) {
    return data.registerUser;
  }

  throw new Error("Registration failed.");
}
