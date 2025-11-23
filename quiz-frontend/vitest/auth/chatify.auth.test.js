import { describe, it, expect, vi, beforeEach } from "vitest";
import { loginUser } from "../../services/chatify-auth/loginUser.js";
import { registerUser } from "../../services/chatify-auth/registerUser.js";
import { logoutUser } from "../../services/chatify-auth/logoutUser.js";
import { isAuthenticated } from "../../services/chatify-auth/isAuthenticated.js";
import { getCurrentUser } from "../../services/chatify-auth/getCurrentUser.js";

describe("Chatify Auth Service Tests", () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
  });
  it("registerUser should register a new user", async () => {
    const userData = {
      username: "testuser",
      email: "testuser@example.com",
      password: "password123",
      confirmPassword: "password123",
    };

    const response = await registerUser(userData);
    expect(response).toHaveProperty("message", "User registered successfully");
  });

  it("loginUser should authenticate a user and store token", async () => {
    const credentials = {
      username: "testuser",
      password: "password123",
    };

    const response = await loginUser(credentials);
    expect(response).toHaveProperty("token");
    expect(localStorage.getItem("chatify_auth_token")).toBe(response.token);
  });
  it("isAuthenticated should return true for authenticated user", async () => {
    localStorage.setItem("chatify_auth_token", "dummy_token");
    const authStatus = await isAuthenticated();
    expect(authStatus).toBe(true);
  });

  it("getCurrentUser should return user info for authenticated user", async () => {
    localStorage.setItem("chatify_auth_token", "dummy_token");
    const user = await getCurrentUser();
    expect(user).toHaveProperty("username", "testuser");
    expect(user).toHaveProperty("email", "testuser@example.com");
  });
});
