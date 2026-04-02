import { Router } from "express";
import { uploadImageChat } from "../controllers/image.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";
import multer from "multer";

const imageRouter = Router();

const memStorage = multer.memoryStorage();

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
  storage: memStorage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});

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
