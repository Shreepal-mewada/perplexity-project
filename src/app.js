import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import connectToDatabase from "./config/database.js";
import authRoutes from "./routes/auth.routes.js";

dotenv.config();
connectToDatabase();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use("/api/auth", authRoutes);

export default app;
