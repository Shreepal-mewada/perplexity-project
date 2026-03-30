import jwt from "jsonwebtoken";

export const authenticate = (req, res, next) => {
  // Support token from either an httpOnly cookie or an Authorization header.
  const cookieToken = req.cookies?.token;
  const authHeader = req.headers?.authorization;
  const bearerToken = authHeader?.startsWith("Bearer ")
    ? authHeader.slice(7)
    : null;
  const token = cookieToken || bearerToken;

  console.log("[Auth Middleware] Cookie token exists:", !!cookieToken);
  console.log("[Auth Middleware] Bearer token exists:", !!bearerToken);
  console.log("[Auth Middleware] Using token from:", cookieToken ? "cookie" : "header");

  if (!token) {
    return res.status(401).json({
      message: "Access denied. No token provided.",
      success: false,
      err: "Access denied. No token provided.",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("[Auth Middleware] Decoded JWT:", JSON.stringify(decoded));
    req.user = decoded;
    next();
  } catch (err) {
    console.error("[Auth Middleware] JWT verification failed:", err.message);
    return res.status(400).json({
      message: "Invalid token.",
      success: false,
      err: "Invalid token.",
    });
  }
};
