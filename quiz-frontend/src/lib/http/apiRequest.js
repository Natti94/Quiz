import { handleSuccess } from "./handleSuccess.js";
import { handleError } from "./handleError.js";

export async function apiRequest(
  url,
  { method = "GET", body, headers = {}, successMessage, errorMessage }
) {
  const requestOptions = {
    method,
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
    credentials: "include",
  };

  if (body) {
    requestOptions.body = JSON.stringify(body);
  }

  try {
    const res = await fetch(url, requestOptions);

    if (res.ok) {
      return await handleSuccess(res, successMessage || "Request successful");
    }

    await handleError(res, errorMessage || "Request failed");
  } catch (error) {
    console.error("API request failed:", error);
    throw error;
  }
}
