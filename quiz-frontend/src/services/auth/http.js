async function handleError(res, defaultMessage) {
  let errMessage = `${defaultMessage} (Status ${res.status})`;
  try {
    const errData = await res.json();
    if (errData?.message) {
      errMessage += ` - ${errData.message}`;
    }
  } catch {
    errMessage = defaultMessage;
  }
  console.error(`${errMessage}`, res.statusText);
  throw new Error(errMessage);
}

async function handleSuccess(res, successMessage) {
  console.log(`${successMessage} (Status ${res.status} ${res.statusText})`);
  return await res.json();
}

export async function apiRequest(
  url,
  { method = "GET", body, headers = {}, successMessage, errorMessage },
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

export { handleError, handleSuccess };
