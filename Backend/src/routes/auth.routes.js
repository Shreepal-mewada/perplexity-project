import { Router } from "express";
import {
  registerValidationRules,
  loginValidationRules,
  validate,
} from "../validator/auth.validator.js";
import {
  registerUser,
  loginUser,
  getMe,
  logoutUser,
  refreshToken,
  logoutAllUser,
} from "../controllers/auth.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";

const router = Router();

router.post("/register", registerValidationRules, validate, registerUser);
router.post("/login", loginValidationRules, validate, loginUser);
router.get("/get-me", authenticate, getMe);
router.post("/refresh-token", refreshToken);
router.get("/logout", logoutUser);
router.get("/logout-all", logoutAllUser);4
router.get("/", (req, res) => {
  res.json({ message: "Auth route is working" });
});

export default router;
