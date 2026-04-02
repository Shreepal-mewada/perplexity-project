import { validationResult } from "express-validator";
import userModel from "../models/user.model.js";
import jwt from "jsonwebtoken";
import sessionModel from "../models/session.model.js";
import bcrypt from "bcryptjs/dist/bcrypt.js";

export async function registerUser(req, res) {
  try {
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

    res.status(201).json({
      message: "User registered successfully",
      success: true,
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
      },
    });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({
      message: "Error registering user",
      success: false,
      err: error.message,
    });
  }
}

export async function loginUser(req, res) {
  try {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password",
        success: false,
        err: "Invalid email or password",
      });
    }
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
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
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    const accessToken = jwt.sign(
      { id: user._id, sessionId: session._id },
      process.env.JWT_SECRET,
      {
        expiresIn: "15m",
      },
    );

    res.status(200).json({
      message: "Login successful",
      success: true,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
      accessToken,
      refreshToken,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      message: "Error logging in",
      success: false,
      err: error.message,
    });
  }
}

export async function refreshToken(req, res) {
  try {
    const authHeader = req.headers?.authorization;
    const bearerToken = authHeader?.startsWith("Bearer ")
      ? authHeader.slice(7)
      : null;
    const refreshToken = bearerToken;

    if (!refreshToken) {
      return res.status(401).json({
        message: "Refresh token is required",
        success: false,
        err: "Refresh token is required",
      });
    }

    let decoded;
    try {
      decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);
    } catch (error) {
      return res.status(401).json({
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
      return res.status(401).json({
        message: "Invalid refresh token",
        success: false,
        err: "Invalid refresh token",
      });
    }

    if (matchedSession.expiresAt < new Date()) {
      matchedSession.revoked = true;
      await matchedSession.save();

      return res.status(401).json({
        message: "Refresh token expired",
        success: false,
        err: "Refresh token expired",
      });
    }

    const user = await userModel.findById(matchedSession.user);

    if (!user) {
      return res.status(401).json({
        message: "User not found",
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

    return res.status(200).json({
      message: "Token refreshed successfully",
      success: true,
      accessToken,
      refreshToken: newRefreshToken,
    });
  } catch (error) {
    console.error("Refresh token error:", error);
    res.status(500).json({
      message: "Error refreshing token",
      success: false,
      err: error.message,
    });
  }
}

export async function getMe(req, res) {
  try {
    const userId = req.user.id;
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
  } catch (error) {
    console.error("Get me error:", error);
    res.status(500).json({
      message: "Error retrieving user",
      success: false,
      err: error.message,
    });
  }
}

export async function logoutUser(req, res) {
  try {
    const authHeader = req.headers?.authorization;
    const refreshToken = authHeader?.startsWith("Bearer ")
      ? authHeader.slice(7)
      : null;

    if (refreshToken) {
      const sessions = await sessionModel.find({ revoked: false });

      let matchedSession = null;

      for (const session of sessions) {
        const match = await bcrypt.compare(refreshToken, session.refreshToken);
        if (match) {
          matchedSession = session;
          break;
        }
      }

      if (matchedSession) {
        matchedSession.revoked = true;
        await matchedSession.save();
      }
    }

    return res.status(200).json({
      message: "Logout successful",
      success: true,
    });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({
      message: "Error logging out",
      success: false,
      err: error.message,
    });
  }
}

export async function logoutAllUser(req, res) {
  try {
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
  } catch (error) {
    console.error("Logout all error:", error);
    res.status(500).json({
      message: "Error logging out all sessions",
      success: false,
      err: error.message,
    });
  }
}
