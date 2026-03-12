import jwt from "jsonwebtoken";

export const authenticate = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({
      message: "Access denied. No token provided.",
      success: false,
      err: "Access denied. No token provided.",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userrr = decoded;
    next();
  } catch (err) {
    return res.status(400).json({
      message: "Invalid token.",
      success: false,
      err: "Invalid token.",
    });
  }
};
