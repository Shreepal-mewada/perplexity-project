import fs from "fs";
import { generateVisionResponse } from "../services/vision.service.js";
import messageModel from "../models/message.model.js";
import chatModel from "../models/chat.model.js";

/**
 * POST /api/images/chat
 *
 * Flow:
 *  1. Validate image upload via multer (done in route)
 *  2. Create chat if none provided
 *  3. Read image from disk → base64 for AI API
 *  4. Save user message (type: "image") to MongoDB
 *  5. Call Gemini Vision → save AI response
 *  6. Return both messages + chat info to frontend
 *
 * The image file is kept on disk at /uploads/images/ and served statically.
 * Only the URL path is stored in MongoDB (no base64 in DB).
 */
export async function uploadImageChat(req, res) {
  try {
    const userId = req.user?.id;
    const { chatId, message } = req.body;

    if (!userId) {
      if (req.file) fs.unlinkSync(req.file.path);
      return res.status(401).json({ message: "Authentication required." });
    }

    if (!req.file) {
      return res.status(400).json({ message: "No image uploaded." });
    }

    let activeChatId = chatId;
    let chat = null;

    // Step 1: Resolve or create chat
    if (!activeChatId) {
      const titleText = message?.trim() || req.file.originalname.replace(/\.[^.]+$/, "") || "Image Chat";
      chat = await chatModel.create({
        user: userId,
        title: titleText.substring(0, 50), // keep title short
      });
      activeChatId = chat._id;
    } else {
      chat = await chatModel.findOne({ _id: activeChatId, user: userId });
      if (!chat) {
        fs.unlinkSync(req.file.path);
        return res.status(404).json({ message: "Chat not found." });
      }
    }

    // Step 2: Read image file to base64 (for AI; NOT stored in DB)
    const base64Image = fs.readFileSync(req.file.path).toString("base64");

    // Step 3: Save user message to DB — only URL stored, not base64
    const userMessage = await messageModel.create({
      chat: activeChatId,
      content: message?.trim() || "",
      role: "user",
      type: "image",
      imageInfo: {
        fileName: req.file.originalname,
        url: `/uploads/images/${req.file.filename}`,
        mimeType: req.file.mimetype,
      },
    });

    // Step 4: Call Vision AI
    const visionResponseText = await generateVisionResponse(
      message?.trim() || "",
      base64Image,
      req.file.mimetype
    );

    // Step 5: Save AI message to DB
    const aiMessage = await messageModel.create({
      chat: activeChatId,
      content: visionResponseText,
      role: "ai",
      type: "text",
    });

    return res.status(200).json({
      message: "Image processed successfully.",
      chat,
      userMessage,
      aiMessage,
    });
  } catch (err) {
    // Clean up uploaded file on error
    if (req.file) {
      try { fs.unlinkSync(req.file.path); } catch (_) { /* ignore */ }
    }
    console.error("[Image Controller] Error:", err);
    return res.status(500).json({ message: err.message || "Failed to process image." });
  }
}
