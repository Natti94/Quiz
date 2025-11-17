import { apiRequest } from "../../lib";

const AUTH_API_BASE = import.meta.env.VITE_AUTH_API_BASE_URL;

export async function generateCsrf() {
  try {
    const data = await apiRequest(`${AUTH_API_BASE}/csrf`, {
      method: "PATCH",
      successMessage: "CSRF token fetched successfully",
    });

    if (data?.csrfToken) {
      localStorage.setItem("csrfToken", data.csrfToken);
      return data.csrfToken;
    }
    console.warn("No CSRsF token received in response.");
    return null;
  } catch (error) {
    console.error("Failed to generate CSRF token:", error);
    throw error;
  }
}
