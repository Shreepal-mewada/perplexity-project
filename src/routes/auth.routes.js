import { Router } from "express";
import { registerValidationRules,loginValidationRules } from "../validator/auth.validator.js";
import { registerUser,verifyEmail,loginUser,getMe } from "../controllers/auth.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";

const router = Router();



router.post("/register", registerValidationRules, registerUser);
router.get("/verify-email", verifyEmail);
router.post("/login", loginValidationRules, loginUser);
router.get("/get-me", authenticate, getMe);

export default router;
