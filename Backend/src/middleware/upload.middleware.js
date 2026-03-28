import multer from "multer";

// Store file in memory (buffer) — no disk writes needed
const memStorage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "application/pdf" ||
    file.originalname.toLowerCase().endsWith(".pdf")
  ) {
    cb(null, true);
  } else {
    cb(
      new Error("INVALID_FILE_TYPE: Only PDF files are accepted."),
      false
    );
  }
};

export const uploadMiddleware = multer({
  storage: memStorage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB max
  },
});
