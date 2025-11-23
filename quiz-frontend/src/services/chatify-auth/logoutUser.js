export function logoutUser() {
  try {
    localStorage.removeItem("csrfToken");
    sessionStorage.removeItem("jwtToken");
    console.log("Logout successful");
    return { success: true, message: "Logout successful" };
  } catch (error) {
    console.error("Logout failed:", error);
    return { success: false, message: "Logout failed. Please try again." };
  }
}
