import { validationResult } from "express-validator";
import userModel from "../models/user.model.js";
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
  // Send verification email
  await sendEmail({
    to: email,
    subject: "Verify your email",
    html: `<p>Hi ${username},</p>
    <p>Please verify your email by clicking the link below:</p>
    <a href="http://localhost:3000/verify-email?token=some-verification-token">Verify Email</a>`,
  });

  res.status(201).json({
    message: "User registered successfully. Please check your email to verify your account.",
    success: true,
    user: {
      id: newUser._id,
      username: newUser.username,
      email: newUser.email,
    },
  });
}
