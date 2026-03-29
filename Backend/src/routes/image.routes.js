import { Router } from "express";
import { uploadImageChat } from "../controllers/image.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";
import multer from "multer";
import path from "path";
import fs from "fs";

const imageRouter = Router();

// Ensure uploads/images directory exists
const uploadDir = path.join(process.cwd(), "uploads", "images");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer disk storage — no memory bloat
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, `img_${uniqueSuffix}${ext}`);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error("Invalid image type. Only JPG, PNG, and WebP are allowed."),
      false,
    );
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
});

// Multer error wrapper
function handleImageUpload(req, res, next) {
  upload.single("image")(req, res, (err) => {
    if (err) {
      if (err.code === "LIMIT_FILE_SIZE") {
        return res
          .status(400)
          .json({ message: "Image size must be under 5MB." });
      }
      return res
        .status(400)
        .json({ message: err.message || "Image upload failed." });
    }
    next();
  });
}

imageRouter.post("/chat", authenticate, handleImageUpload, uploadImageChat);

export default imageRouter;
