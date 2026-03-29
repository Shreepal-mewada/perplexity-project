import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import connectToDatabase from "./config/database.js";
import authRoutes from "./routes/auth.routes.js";
import chatRoutes from "./routes/chat.routes.js";
import fileRoutes from "./routes/file.routes.js";
import imageRoutes from "./routes/image.routes.js";
import { initializePinecone } from "./services/pinecone.service.js";
import cors from "cors";
import morgan from "morgan";

import path from "path";
import { fileURLToPath } from "url";

dotenv.config();
connectToDatabase();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Pinecone index on startup (non-blocking)
initializePinecone().catch((err) =>
  console.warn("Pinecone startup init failed:", err.message),
);

const app = express();
app.use(morgan("dev"));
app.use(express.json());
// Serve static uploads
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// app.use(
//   cors({
//     origin: "http://localhost:5173",
//     credentials: true,
//     methods: ["GET", "POST", "PUT", "DELETE"],
//   }),
// );

const allowedOrigins = [
  "http://localhost:5173",
  process.env.FRONTEND_URL, // future Vercel URL
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
  }),
);

app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use("/api/auth", authRoutes);
app.use("/api/chats", chatRoutes);
app.use("/api/files", fileRoutes);
app.use("/api/images", imageRoutes);
app.get("/", (req, res) => {
  res.send("Backend is running");
});

export default app;
