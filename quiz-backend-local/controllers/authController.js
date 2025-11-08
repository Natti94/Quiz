import fetch from "node-fetch";
import User from "../models/User.js";

const TEACHER_API_BASE = process.env.TEACHER_API_BASE;
const CSRF_ENDPOINT = process.env.TEACHER_API_CSRF_ENDPOINT;
const TOKEN_ENDPOINT = process.env.TEACHER_API_TOKEN_ENDPOINT;
const REGISTER_ENDPOINT = process.env.TEACHER_API_REGISTER_ENDPOINT;

async function generateCSRF() {
  const res = await fetch(CSRF_ENDPOINT, {
    method: "PATCH",
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error("Failed to generate CSRF token");
  }

  const data = await res.json();
  return data.csrfToken;
}

export async function register(req, res) {
  try {
    const { username, email, password, avatar } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Username, email, and password are required",
      });
    }

    const existingUser = await User.findOne({
      $or: [{ username }, { email }],
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "User already exists in our system",
      });
    }

    const csrfToken = await generateCSRF();

    const teacherRes = await fetch(REGISTER_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        username,
        password,
        email,
        avatar,
        csrfToken,
      }),
    });

    if (!teacherRes.ok) {
      const errorData = await teacherRes.json().catch(() => ({}));
      return res.status(teacherRes.status).json({
        success: false,
        message: errorData.message || "Registration failed with teacher's API",
      });
    }

    const teacherData = await teacherRes.json();

    const newUser = await User.create({
      username,
      email,
      avatar: avatar || teacherData.registerUser?.avatar,
      userId: teacherData.registerUser?.id,
    });

    res.status(201).json({
      success: true,
      message: "Registration successful",
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        avatar: newUser.avatar,
      },
    });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({
      success: false,
      message: "Registration failed",
      error: error.message,
    });
  }
}

export async function login(req, res) {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: "Username and password are required",
      });
    }

    const csrfToken = await generateCSRF();

    const teacherRes = await fetch(TOKEN_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        username,
        password,
        csrfToken,
      }),
    });

    if (!teacherRes.ok) {
      const errorData = await teacherRes.json().catch(() => ({}));
      return res.status(teacherRes.status).json({
        success: false,
        message: errorData.message || "Login failed",
      });
    }

    const teacherData = await teacherRes.json();

    if (!teacherData.token) {
      return res.status(500).json({
        success: false,
        message: "No token received from authentication server",
      });
    }

    let user = await User.findOne({ username });

    if (!user) {
      user = await User.create({
        username,
        email: username,
        teacherApiToken: teacherData.token,
      });
    } else {
      user.teacherApiToken = teacherData.token;
      user.lastActive = new Date();
      await user.save();
    }

    res.status(200).json({
      success: true,
      message: "Login successful",
      token: teacherData.token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
        totalQuizzes: user.totalQuizzes,
        totalScore: user.totalScore,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      message: "Login failed",
      error: error.message,
    });
  }
}

export async function logout(req, res) {
  try {
    res.status(200).json({
      success: true,
      message: "Logout successful",
    });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({
      success: false,
      message: "Logout failed",
      error: error.message,
    });
  }
}

export async function getMe(req, res) {
  try {
    const user = await User.findById(req.user.id).select("-teacherApiToken");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("Get user error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get user data",
      error: error.message,
    });
  }
}
