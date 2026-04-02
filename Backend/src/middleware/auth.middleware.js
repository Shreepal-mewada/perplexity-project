import jwt from "jsonwebtoken";

export const authenticate = (req, res, next) => {
  const authHeader = req.headers?.authorization;
  const bearerToken = authHeader?.startsWith("Bearer ")
    ? authHeader.slice(7)
    : null;

  if (!bearerToken) {
    return res.status(401).json({
      message: "Access denied. No token provided.",
      success: false,
      err: "Access denied. No token provided.",
    });
  }

  try {
    const decoded = jwt.verify(bearerToken, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    console.error("[Auth Middleware] JWT verification failed:", err.message);
    return res.status(401).json({
      message: "Invalid or expired token.",
      success: false,
      err: "Invalid or expired token.",
    });
  }
};
