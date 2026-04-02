import { generateVisionResponse } from "../services/vision.service.js";
import messageModel from "../models/message.model.js";
import chatModel from "../models/chat.model.js";

/**
 * POST /api/images/chat
 *
 * Flow:
 *  1. Validate image upload via multer (done in route)
 *  2. Create chat if none provided
 *  3. Read image from memory buffer → base64 for AI API
 *  4. Save user message (type: "image") to MongoDB with base64 data
 *  5. Call Gemini Vision → save AI response
 *  6. Return both messages + chat info to frontend
 *
 * Images are stored as base64 in MongoDB (no disk writes needed).
 */
export async function uploadImageChat(req, res) {
  try {
    const userId = req.user?.id;
    const { chatId, message } = req.body;

    if (!userId) {
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
        title: titleText.substring(0, 50),
      });
      activeChatId = chat._id;
    } else {
      chat = await chatModel.findOne({ _id: activeChatId, user: userId });
      if (!chat) {
        return res.status(404).json({ message: "Chat not found." });
      }
    }

    // Step 2: Convert buffer to base64 for AI and storage
    const base64Image = req.file.buffer.toString("base64");
    const dataUrl = `data:${req.file.mimetype};base64,${base64Image}`;

    // Step 3: Call Vision AI
    const visionResponseText = await generateVisionResponse(
      message?.trim() || "",
      base64Image,
      req.file.mimetype
    );

    // Step 4: Save user message to DB with base64 data
    const userMessage = await messageModel.create({
      chat: activeChatId,
      content: message?.trim() || "",
      role: "user",
      type: "image",
      imageInfo: {
        fileName: req.file.originalname,
        mimeType: req.file.mimetype,
        data: dataUrl,
      },
    });

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
    console.error("[Image Controller] Error:", err);
    return res.status(500).json({ message: err.message || "Failed to process image." });
  }
}
