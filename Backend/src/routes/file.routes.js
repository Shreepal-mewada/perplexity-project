import { Router } from "express";
import {
  uploadFile,
  getFileStatus,
  deleteFile,
} from "../controllers/file.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";
import { uploadMiddleware } from "../middleware/upload.middleware.js";

const fileRouter = Router();

// Multer error handling wrapper
function handleMulterUpload(req, res, next) {
  uploadMiddleware.single("file")(req, res, (err) => {
    if (err) {
      if (err.code === "LIMIT_FILE_SIZE") {
        return res.status(400).json({
          message: "File size must be under 10MB.",
        });
      }
      if (err.message?.startsWith("INVALID_FILE_TYPE")) {
        return res.status(400).json({
          message: "Only PDF files are accepted.",
        });
      }
      return res.status(400).json({ message: err.message || "Upload failed." });
    }
    next();
  });
}

fileRouter.post("/upload", authenticate, handleMulterUpload, uploadFile);
fileRouter.get("/:fileId/status", authenticate, getFileStatus);
fileRouter.delete("/:fileId", authenticate, deleteFile);

export default fileRouter;
