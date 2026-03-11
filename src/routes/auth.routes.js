import { Router } from "express";
import { registerValidationRules } from "../validator/auth.validator.js";
import { registerUser } from "../controllers/auth.controller.js";

const router = Router();



router.post("/register", registerValidationRules, registerUser);

export default router;
