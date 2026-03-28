import { generateResponse, generateChatTitle, generateRagResponse } from "../services/ai.service.js";
import chatModel from "../models/chat.model.js";
import messageModel from "../models/message.model.js";
import chatMemoryModel from "../models/chatMemory.model.js";
import { getRelevantMemories, processNewMessages } from "../services/memory.service.js";
import { handleRagQuery } from "../services/rag.service.js";

export async function sendMessage(req, res) {
  try {
    const { message, chatId, fileId } = req.body;

    const userId = req.user.id;
    let title = null,
      chat = null;

    if (!chatId) {
      title = await generateChatTitle(message);
      chat = await chatModel.create({
        user: userId,
        title,
      });
    }

    const userMessage = await messageModel.create({
      chat: chatId || chat._id,
      content: message,
      role: "user",
    });

    const activeChatId = chatId || chat._id;

    // Fetch memory context
    let chatMemory = await chatMemoryModel.findOne({ chat: activeChatId });
    if (!chatMemory) {
       chatMemory = await chatMemoryModel.create({ chat: activeChatId, user: userId });
    }
    
    // Fetch relevant long term facts
    const activeTopics = chatMemory.activeTopics || [];
    const topMemories = await getRelevantMemories(userId, message, activeTopics);

    const memoryContext = {
      shortTermMemory: chatMemory,
      topMemories: topMemories
    };

    let result;

    // --- RAG Routing ---
    // Determine active fileId: from request body OR from the linked chat document
    const activeChatDoc = await chatModel.findById(activeChatId);
    const activeFileId = fileId || activeChatDoc?.fileId || null;

    if (activeFileId) {
      const ragResult = await handleRagQuery(message, activeFileId, userId);

      if (ragResult.type === "rag") {
        // File-related question → answer from document context
        result = await generateRagResponse(message, ragResult.context, ragResult.fileName, memoryContext);
      } else if (ragResult.type === "not_found") {
        // File-related but no relevant chunks found
        result = `I couldn't find relevant information about that in the uploaded document **${ragResult.fileName}**. The document may not contain details on this topic, or try rephrasing your question.`;
      } else {
        // General question despite active file → normal LLM
        const recentMessages = await messageModel.find({ chat: activeChatId })
          .sort({ createdAt: -1 })
          .limit(15);
        recentMessages.reverse();
        result = await generateResponse(recentMessages, memoryContext);
      }
    } else {
      // --- Normal LLM Path (no file active) ---
      const recentMessages = await messageModel.find({ chat: activeChatId })
        .sort({ createdAt: -1 })
        .limit(15);
      recentMessages.reverse();
      result = await generateResponse(recentMessages, memoryContext);
    }

    const aiMessage = await messageModel.create({
      chat: activeChatId,
      content: result,
      role: "ai",
    });

    // Asynchronously trigger the memory extraction pipeline
    processNewMessages(activeChatId, userId).catch(err => console.error("Memory Pipeline Error:", err));
    res.status(201).json({
      title,
      chat,
      aiMessage,
    });
  } catch (error) {
    console.error("Error in sendMessage:", error);
    res.status(500).json({
      message: "Error sending message",
      error: error.message,
    });
  }
}

export async function getChats(req, res) {
  // const user = req.user
  const userId = req.user.id;
  const chats = await chatModel.find({ user: userId });

  res.status(200).json({
    message: "Chats retrieved successfully",
    chats,
  });
}

export async function getMessages(req, res) {
  const { chatId } = req.params;
  const userId = req.user.id;

  const chat = await chatModel.findOne({
    _id: chatId,
    user: userId,
  });

  if (!chat) {
    return res.status(404).json({
      message: "Chat not found",
    });
  }

  const messages = await messageModel.find({
    chat: chatId,
  });

  res.status(200).json({
    message: "Messages retrieved successfully",
    messages,
    // Include file context so frontend can restore active file badge on refresh
    fileContext: chat.fileId
      ? { fileId: chat.fileId, fileName: chat.fileName }
      : null,
  });
}

export async function deleteChat(req, res) {
  const { chatId } = req.params;
  const userId = req.user.id;
  const chat = await chatModel.findOneAndDelete({
    _id: chatId,
    user: userId,
  });

  await messageModel.deleteMany({
    chat: chatId,
  });

  if (!chat) {
    return res.status(404).json({
      message: "Chat not found",
    });
  }

  res.status(200).json({
    message: "Chat deleted successfully",
  });
}
