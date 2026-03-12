import { validationResult } from "express-validator";
import userModel from "../models/user.model.js";
import jwt from "jsonwebtoken";
import { sendEmail } from "../services/mail.service.js";

export async function registerUser(req, res) {
  const { username, email, password } = req.body;
  // Check if user already exists
  const existingUser = await userModel.findOne({
    $or: [{ email }, { username }],
  });
  if (existingUser) {
    return res.status(400).json({
      message: "Username or email already exists",
      success: false,
      err: "Username or email already exists",
    });
  }

  // Create new user
  const newUser = await userModel.create({ username, email, password });

  const emailVerificationToken = jwt.sign(
    { email: newUser.email },
    process.env.JWT_SECRET,
  );
  // Send verification email
  await sendEmail({
    to: email,
    subject: "Welcome to perplexity",
    html: `<p>Hi ${username},</p>
    <p>Please verify your email by clicking the link below:</p>
    <a href="http://localhost:3000/api/auth/verify-email?token=${emailVerificationToken}">Verify Email</a>`,
  });

  res.status(201).json({
    message:
      "User registered successfully. Please check your email to verify your account.",
    success: true,
    user: {
      id: newUser._id,
      username: newUser.username,
      email: newUser.email,
    },
  });
}

export async function verifyEmail(req, res) {
  const { token } = req.query;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await userModel.findOne({ email: decoded.email });
    if (!user) {
      return res.status(400).json({
        message: "Invalid token",
        success: false,
        err: "Invalid token",
      });
    }
    user.verified = true;
    await user.save();
    const html = `
    <h1>Email Verified Successfully</h1>
    <p>Your email has been verified. You can now <a href="/login">log in</a> to your account.</p>
  `;
    res.status(200).send(html);
  } catch (err) {
    res.status(400).json({
      message: "Invalid or expired token",
      success: false,
      err: "Invalid or expired token",
    });
  }
}

export async function loginUser(req, res) {
  const { email, password } = req.body;
  const user = await userModel.findOne({ email });
  if (!user) {
    return res.status(400).json({
      message: "Invalid email or password",
      success: false,
      err: "Invalid email or password",
    });
  }
  if (!user.verified) {
    return res.status(400).json({
      message: "Please verify your email before logging in",
      success: false,
      err: "Email not verified",
    });
  }
  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    return res.status(400).json({
      message: "Invalid email or password",
      success: false,
      err: "Invalid email or password",
    });
  }
  const token = jwt.sign(
    { id: user._id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );

  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });

  res.status(200).json({
    message: "Login successful",
    success: true,
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
    },
  });
}

export async function getMe(req, res) {
  const userId = req.userrr.id;
  const user = await userModel.findById(userId).select("-password");
  if (!user) {
    return res.status(404).json({
      message: "User not found",
      success: false,
      err: "User not found",
    });
  }
  res.status(200).json({
    message: "User retrieved successfully",
    success: true,
    user,
  });
}
