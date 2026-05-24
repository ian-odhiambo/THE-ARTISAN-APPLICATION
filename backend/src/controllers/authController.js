import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import axios from "axios";
import User from "../models/User.js";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

// GET all users (temp debug)
export const getUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    console.log("[AuthController] Found users:", users.length);
    res.status(200).json(users);
  } catch (err) {
    console.error("[AuthController] Get users error:", err);
    res.status(500).json({ error: err.message });
  }
};

// Register Controller
export const register = async (req, res) => {
  try {
    console.log("[AuthController] Register attempt:", req.body.email);

    const { name, email, password, role, phone } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    if (role === "admin") {
      return res
        .status(403)
        .json({ error: "Unauthorized to register as admin" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role,
      phone,
      isApproved: role === "artisan" ? false : true,
    });

    console.log(
      "[AuthController] About to save user to DB:",
      mongoose.connection.name,
    );
    await newUser.save();
    console.log(
      "[AuthController] User registered:",
      newUser._id,
      "in DB:",
      mongoose.connection.name,
    );
    console.log(
      "[AuthController] DB readyState:",
      mongoose.connection.readyState,
    );

    await syncUserWithChatApp(name, email, password).catch((syncErr) => {
      console.warn("[AuthController] Chat sync failed:", syncErr.message);
    });

    res
      .status(201)
      .json({ message: "User registered successfully", userId: newUser._id });
  } catch (err) {
    console.error("[AuthController] Register error:", err);
    res.status(500).json({ error: err.message });
  }
};

// Login Controller
export const login = async (req, res) => {
  try {
    console.log("[AuthController] Login attempt:", req.body.email);

    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: user._id, role: user.role, serverKey: global.serverKey },
      process.env.JWT_SECRET,
      { expiresIn: "7d" },
    );

    console.log("[AuthController] User logged in:", user._id);

    await syncUserWithChatApp(user.name, user.email, password).catch(
      (syncErr) => {
        console.warn(
          "[AuthController] Chat sync failed on login:",
          syncErr.message,
        );
      },
    );

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("[AuthController] Login error:", err);
    res.status(500).json({ error: "Login failed" });
  }
};

// Forgot Password Controller
export const forgotPassword = async (req, res) => {
  try {
    console.log("[AuthController] Forgot password for:", req.body.email);

    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user)
      return res
        .status(200)
        .json({ message: "If this email exists, a reset link has been sent." });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "10m",
    });
    const resetLink = `http://192.168.20.1:3000/reset-password/${token}`;

    await transporter.sendMail({
      from: process.env.MAIL_USER,
      to: email,
      subject: "Desi-Etsy Password Reset",
      html: `<p>Click below to reset your password:</p><a href="${resetLink}">${resetLink}</a><p>This link expires in 10 minutes.</p>`,
    });

    console.log("[AuthController] Reset link sent to:", email);
    res.status(200).json({ message: "Reset link sent" });
  } catch (err) {
    console.error("[AuthController] Forgot password error:", err);
    res.status(500).json({ message: "Could not send reset link" });
  }
};

// Reset Password Controller
export const resetPassword = async (req, res) => {
  try {
    console.log("[AuthController] Reset password for token");

    const { token, newPassword } = req.body;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    console.log("[AuthController] Password reset for user:", user._id);
    res.status(200).json({ message: "Password reset successfully" });
  } catch (err) {
    console.error("[AuthController] Reset password error:", err);
    if (err.name === "TokenExpiredError")
      return res.status(400).json({ message: "Reset link has expired" });
    if (err.name === "JsonWebTokenError")
      return res.status(400).json({ message: "Invalid reset link" });
    res.status(500).json({ message: "Password reset failed" });
  }
};

// Get Profile Controller
export const getProfile = async (req, res) => {
  try {
    console.log("[AuthController] Fetch profile for:", req.user.id);

    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json(user);
  } catch (err) {
    console.error("[AuthController] Profile fetch error:", err);
    res.status(500).json({ error: "Failed to fetch profile" });
  }
};

// Update Profile Controller
export const updateProfile = async (req, res) => {
  try {
    console.log("[AuthController] Update profile for:", req.user.id);

    const { name, email } = req.body;
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (name) user.name = name;
    if (email) user.email = email;
    await user.save();

    res.status(200).json({
      message: "Profile updated successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("[AuthController] Profile update error:", err);
    res.status(500).json({ error: "Failed to update profile" });
  }
};

// Chat sync helper
const getChatAppUrl = () => {
  return process.env.CHAT_APP_URL || "http://localhost:8001";
};

const syncUserWithChatApp = async (fullName, username, password) => {
  if (!fullName || !username) {
    throw new Error("Missing required chat sync fields");
  }

  const chatAppUrl = getChatAppUrl();
  await axios.post(
    `${chatAppUrl}/api/v1/auth/sync-user`,
    {
      fullName,
      username,
      password,
    },
    {
      headers: { "Content-Type": "application/json" },
      timeout: 5000,
    },
  );
};

export const updatePassword = async (req, res) => {
  try {
    console.log("[AuthController] Update password for:", req.user.id);

    const { oldPassword, newPassword } = req.body;
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Old password is incorrect" });

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    console.log("[AuthController] Password updated for:", user._id);
    res.status(200).json({ message: "Password updated successfully" });
  } catch (err) {
    console.error("[AuthController] Update password error:", err);
    res.status(500).json({ error: "Password update failed" });
  }
};

export default {
  register,
  login,
  forgotPassword,
  resetPassword,
  getProfile,
  updateProfile,
  updatePassword,
  getUsers, // temp debug
};
