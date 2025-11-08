import { apiRequest } from "./http";
import { parseJwt } from "./jwtParse";

const AUTH_API_BASE = "https://chatify-api.up.railway.app/auth";

export async function generateCsrf() {
  try {
    const data = await apiRequest("https://chatify-api.up.railway.app/csrf", {
      method: "PATCH",
      successMessage: "CSRF token fetched successfully",
    });

    if (data?.csrfToken) {
      localStorage.setItem("csrfToken", data.csrfToken);
      return data.csrfToken;
    }
    console.warn("No CSRF token received in response.");
    return null;
  } catch (error) {
    console.error("Failed to generate CSRF token:", error);
    throw error;
  }
}

export async function login(username, password) {
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

export async function register({ username, email, password, avatar }) {
  let csrfToken = localStorage.getItem("csrfToken");
  if (!csrfToken) {
    csrfToken = await generateCsrf();
  }

  const data = await apiRequest(`${AUTH_API_BASE}/register`, {
    method: "POST",
    body: { username, password, email, avatar, csrfToken },
    successMessage: "Registration successful",
    errorMessage:
      "Registration failed. Username or email may already be in use.",
  });

  if (data?.registerUser) {
    return data.registerUser;
  }

  throw new Error("Registration failed.");
}

export function logout() {
  try {
    localStorage.removeItem("csrfToken");
    sessionStorage.removeItem("jwtToken");
    sessionStorage.removeItem("avatar");
    console.log("Logout successful");
    return { success: true, message: "Logout successful" };
  } catch (error) {
    console.error("Logout failed:", error);
    return { success: false, message: "Logout failed. Please try again." };
  }
}

export function isAuthenticated() {
  const token = sessionStorage.getItem("jwtToken");
  if (!token) return false;

  const payload = parseJwt(token);
  if (!payload) return false;

  const now = Date.now() / 1000;
  if (payload.exp && payload.exp < now) {
    logout();
    return false;
  }

  return true;
}

export function getCurrentUser() {
  const token = sessionStorage.getItem("jwtToken");
  if (!token) return null;

  return parseJwt(token);
}
