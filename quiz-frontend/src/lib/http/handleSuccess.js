async function handleSuccess(res, successMessage) {
  console.log(`${successMessage} (Status ${res.status} ${res.statusText})`);
  return await res.json();
}

export { handleSuccess };
