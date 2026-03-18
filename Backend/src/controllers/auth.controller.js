import { validationResult } from "express-validator";
import userModel from "../models/user.model.js";
import jwt from "jsonwebtoken";
import { sendEmail } from "../services/mail.service.js";
import sessionModel from "../models/session.model.js";
import bcrypt from "bcryptjs/dist/bcrypt.js";

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

  const refreshToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  const refreshHash = await bcrypt.hash(refreshToken, 10);

  const session = await sessionModel.create({
    user: user._id,
    refreshToken: refreshHash,
    ip: req.ip,
    userAgent: req.headers["user-agent"],
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
  });

  const accessToken = jwt.sign(
    { id: user._id, sessionId: session._id },
    process.env.JWT_SECRET,
    {
      expiresIn: "15m",
    },
  );

  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  };

  res.cookie("refreshToken", refreshToken, cookieOptions);
  res.cookie("token", accessToken, cookieOptions);

  res.status(200).json({
    message: "Login successful",
    success: true,
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
    },
    accessToken,
  });
}

// export async function refreshToken(req, res) {
//   const refreshToken = req.cookies.refreshToken;
//   if (!refreshToken) {
//     return res.status(400).json({
//       message: "Refresh token is required",
//       success: false,
//       err: "Refresh token is required",
//     });
//   }
//   const session = await sessionModel.findOne({ revoked: false });
//   const match = await bcrypt.compare(refreshToken, session.refreshToken);
//   if (!match) {
//     return res.status(400).json({
//       message: "Invalid refresh token",
//       success: false,
//       err: "Invalid refresh token",
//     });
//   }
//   const user = await userModel.findById(session.user);
//   if (!user) {
//     return res.status(400).json({
//       message: "User not found",
//       success: false,
//       err: "User not found",
//     });
//   }
//   const accessToken = jwt.sign(
//     { id: user._id, sessionId: session._id },
//     process.env.JWT_SECRET,
//     { expiresIn: "15m" },
//   );

//   const newRefreshToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
//     expiresIn: "7d",
//   });

//   const cookieOptions = {
//     httpOnly: true,
//     secure: process.env.NODE_ENV === "production",
//     sameSite: "strict",
//     maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
//   };

//   // res.cookie("token", accessToken, cookieOptions);
//   res.cookie("refreshToken", newRefreshToken, cookieOptions);

//   res.status(200).json({
//     message: "Token refreshed successfully",
//     success: true,
//     accessToken,
//   });
// }

export async function refreshToken(req, res) {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    return res.status(400).json({
      message: "Refresh token is required",
      success: false,
      err: "Refresh token is required",
    });
  }

  let decoded;
  try {
    decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);
  } catch (error) {
    return res.status(400).json({
      message: "Invalid or expired refresh token",
      success: false,
      err: "Invalid or expired refresh token",
    });
  }

  const sessions = await sessionModel.find({ revoked: false });

  let matchedSession = null;

  for (const session of sessions) {
    const match = await bcrypt.compare(refreshToken, session.refreshToken);
    if (match) {
      matchedSession = session;
      break;
    }
  }

  if (!matchedSession) {
    return res.status(400).json({
      message: "Invalid refresh token",
      success: false,
      err: "Invalid refresh token",
    });
  }

  if (matchedSession.expiresAt < new Date()) {
    matchedSession.revoked = true;
    await matchedSession.save();

    return res.status(400).json({
      message: "Refresh token expired",
      success: false,
      err: "Refresh token expired",
    });
  }

  const user = await userModel.findById(matchedSession.user);

  if (!user) {
    return res.status(400).json({
      message: "User not founddd",
      success: false,
      err: "User not found",
    });
  }

  const accessToken = jwt.sign(
    { id: user._id, sessionId: matchedSession._id },
    process.env.JWT_SECRET,
    { expiresIn: "15m" },
  );

  const newRefreshToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  const newRefreshHash = await bcrypt.hash(newRefreshToken, 10);

  matchedSession.refreshToken = newRefreshHash;
  matchedSession.expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  await matchedSession.save();

  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  };

  res.cookie("refreshToken", newRefreshToken, cookieOptions);
   res.cookie("token", accessToken, cookieOptions);

  return res.status(200).json({
    message: "Token refreshed successfully",
    success: true,
    accessToken,
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

// export async function logoutUser(req, res) {
//   const refreshToken = req.cookies.refreshToken;

//   if (!refreshToken) {
//     return res.status(400).json({
//       message: "Refresh token is required",
//       success: false,
//       err: "Refresh token is required",
//     });
//   }

//   const refreshHash = await bcrypt.hash(refreshToken, 10);

//   const session = await sessionModel.findOne({ revoked: false });
//   const match = await bcrypt.compare(refreshToken, session.refreshToken);
//   console.log(session);
//   if (!match) {
//     return res.status(400).json({
//       message: "Invalid refresh token",
//       success: false,
//       err: "Invalid refresh token",
//     });
//   }
//   session.revoked = true;
//   await session.save();
//   res.clearCookie("refreshToken");
//   res.clearCookie("token");
//   res.status(200).json({
//     message: "Logout successful",
//     success: true,
//   });
// }

export async function logoutUser(req, res) {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    return res.status(400).json({
      message: "Refresh token is required",
      success: false,
      err: "Refresh token is required",
    });
  }

  const sessions = await sessionModel.find({ revoked: false });

  let matchedSession = null;

  for (const session of sessions) {
    const match = await bcrypt.compare(refreshToken, session.refreshToken);
    if (match) {
      matchedSession = session;
      break;
    }
  }

  if (!matchedSession) {
    return res.status(400).json({
      message: "Invalid refresh token",
      success: false,
      err: "Invalid refresh token",
    });
  }

  matchedSession.revoked = true;
  await matchedSession.save();

  res.clearCookie("refreshToken");
  res.clearCookie("token");

  return res.status(200).json({
    message: "Logout successful",
    success: true,
  });
}

// export async function logoutAllUser(req, res) {
//   const refreshToken = req.cookies.refreshToken;
//   if (!refreshToken) {
//     return res.status(400).json({
//       message: "Refresh token is required",
//       success: false,
//       err: "Refresh token is required",
//     });
//   }
//   const refreshHash = await bcrypt.hash(refreshToken, 10);

//   const session = await sessionModel.findOne({ revoked: false });
//   const match = await bcrypt.compare(refreshToken, session.refreshToken);
//   if (!match) {
//     return res.status(400).json({
//       message: "Invalid refresh token",
//       success: false,
//       err: "Invalid refresh token",
//     });
//   }
//   await sessionModel.updateMany(
//     { user: session.user, revoked: false },
//     { revoked: true },
//   );
//   res.clearCookie("refreshToken");
//   res.clearCookie("token");
//   res.status(200).json({
//     message: "All sessions logged out successfully",
//     success: true,
//   });
// }

export async function logoutAllUser(req, res) {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    return res.status(400).json({
      message: "Refresh token is required",
      success: false,
      err: "Refresh token is required",
    });
  }

  const sessions = await sessionModel.find({ revoked: false });

  let matchedSession = null;

  for (const session of sessions) {
    const match = await bcrypt.compare(refreshToken, session.refreshToken);
    if (match) {
      matchedSession = session;
      break;
    }
  }

  if (!matchedSession) {
    return res.status(400).json({
      message: "Invalid refresh token",
      success: false,
      err: "Invalid refresh token",
    });
  }

  // revoke all sessions of this user
  await sessionModel.updateMany(
    { user: matchedSession.user, revoked: false },
    { revoked: true },
  );

  res.clearCookie("refreshToken");
  res.clearCookie("token");

  return res.status(200).json({
    message: "All sessions logged out successfully",
    success: true,
  });
}
