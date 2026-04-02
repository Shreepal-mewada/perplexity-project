import { v4 as uuidv4 } from "uuid";
import { extractTextFromPdf } from "../services/pdf.service.js";
import { chunkText } from "../services/chunker.service.js";
import { embedTexts } from "../services/embedding.service.js";
import {
  upsertChunks,
  deleteFileVectors,
} from "../services/pinecone.service.js";
import fileUploadModel from "../models/fileUpload.model.js";
import chatModel from "../models/chat.model.js";
import messageModel from "../models/message.model.js";

/**
 * POST /api/files/upload
 * Receives PDF, processes it, stores vectors in Pinecone.
 */
export async function uploadFile(req, res) {
  const userId = req.user?.id;
  const { chatId } = req.body;

  if (!userId) {
    return res.status(401).json({
      message: "Authentication required. Please sign in and try again.",
    });
  }

  // Multer validation
  if (!req.file || !req.file.buffer) {
    return res
      .status(400)
      .json({ message: "No file uploaded. Please attach a valid PDF file." });
  }

  if (!chatId) {
    return res.status(400).json({
      message: "chatId is required to link the file to a chat session.",
    });
  }

  // Verify chat belongs to user
  const chat = await chatModel.findOne({ _id: chatId, user: userId });
  if (!chat) {
    return res.status(404).json({ message: "Chat not found." });
  }

  const fileId = uuidv4();
  const namespace = `user-${userId}`;
  const fileName = req.file.originalname;

  // Create file record (status: uploading)
  const fileDoc = await fileUploadModel.create({
    fileId,
    userId,
    chatId,
    fileName,
    fileSize: req.file.size,
    namespace,
    status: "uploading",
  });

  try {
    // Step 1: Parse PDF
    fileDoc.status = "parsing";
    await fileDoc.save();

    const { text, pageCount } = await extractTextFromPdf(req.file.buffer);
    fileDoc.pageCount = pageCount;
    fileDoc.fullText = text;
    
    console.log(`\n[File Processing] Extracted text length: ${text.length} characters from ${pageCount} pages.`);

    // Step 2: Chunk text
    const chunks = chunkText(text, {
      fileId,
      fileName,
      userId: userId.toString(),
    });
    
    console.log(`[File Processing] Generated ${chunks.length} chunks for ${fileName}`);

    // Step 3: Embed chunks
    fileDoc.status = "embedding";
    await fileDoc.save();

    const texts = chunks.map((c) => c.text);
    console.log(`[File Processing] Sending ${texts.length} chunks to mistral-embed...`);
    const vectors = await embedTexts(texts);
    console.log(`[File Processing] Successfully generated embeddings for ${vectors.length} chunks.`);

    // Attach vector to each chunk
    const enrichedChunks = chunks.map((c, i) => ({
      ...c,
      vector: vectors[i],
    }));

    // Step 4: Upsert to Pinecone
    fileDoc.status = "indexing";
    await fileDoc.save();

    await upsertChunks(enrichedChunks, namespace, fileId);
    console.log(`[File Processing] Successfully upserted chunks to Pinecone.`);

    // Wait for Pinecone eventual consistency
    console.log(`[File Processing] Waiting 3s for Pinecone indexing...`);
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Step 5: Mark ready
    fileDoc.status = "ready";
    fileDoc.chunkCount = chunks.length;
    await fileDoc.save();

    // Step 6: Link file to chat document
    chat.fileId = fileId;
    chat.fileName = fileName;
    await chat.save();

    // Step 7: Create a file-type message so it persists in chat history
    const fileMessage = await messageModel.create({
      chat: chatId,
      content: "",
      role: "user",
      type: "file",
      fileInfo: {
        fileName,
        fileId,
      },
    });

    // Step 8: Create AI greeting message for when user uploads without text
    const aiGreeting = `I've read through **${fileName}**. What would you like to ask about this document?`;
    const aiMessage = await messageModel.create({
      chat: chatId,
      content: aiGreeting,
      role: "ai",
      type: "text",
    });

    return res.status(200).json({
      message: "File uploaded and indexed successfully.",
      fileId,
      fileName,
      chunkCount: chunks.length,
      pageCount,
      status: "ready",
      fileMessage,
      aiMessage,
    });
  } catch (err) {
    // Mark as failed with error message
    fileDoc.status = "failed";
    fileDoc.errorMessage = err.message;
    await fileDoc.save();

    console.error("File processing error:", err);

    if (err.message.startsWith("PDF_EMPTY")) {
      return res
        .status(422)
        .json({ message: err.message.replace("PDF_EMPTY: ", "") });
    }
    if (err.message.startsWith("PDF_CORRUPT")) {
      return res
        .status(422)
        .json({ message: err.message.replace("PDF_CORRUPT: ", "") });
    }
    if (err.message.startsWith("EMBEDDING_FAILED")) {
      return res
        .status(502)
        .json({ message: "Failed to generate embeddings. Please try again." });
    }
    if (
      err.name === "PineconeConnectionError" ||
      err.message.includes("Request failed to reach Pinecone") ||
      err.message.includes("ENOTFOUND")
    ) {
      return res.status(502).json({
        message:
          "Could not connect to Pinecone. Please verify your Pinecone network configuration and API settings.",
      });
    }

    return res
      .status(500)
      .json({ message: "File processing failed. Please try again." });
  }
}

/**
 * GET /api/files/:fileId/status
 * Returns current processing status of a file.
 */
export async function getFileStatus(req, res) {
  const { fileId } = req.params;
  const userId = req.user.id;

  const fileDoc = await fileUploadModel.findOne({ fileId, userId });
  if (!fileDoc) {
    return res.status(404).json({ message: "File not found." });
  }

  return res.status(200).json({
    fileId: fileDoc.fileId,
    fileName: fileDoc.fileName,
    status: fileDoc.status,
    chunkCount: fileDoc.chunkCount,
    errorMessage: fileDoc.errorMessage,
  });
}

/**
 * DELETE /api/files/:fileId
 * Removes file vectors from Pinecone + removes file record.
 * Clears fileId from linked chat.
 */
export async function deleteFile(req, res) {
  const { fileId } = req.params;
  const userId = req.user.id;

  const fileDoc = await fileUploadModel.findOne({ fileId, userId });
  if (!fileDoc) {
    return res.status(404).json({ message: "File not found." });
  }

  // Delete Pinecone vectors
  await deleteFileVectors(fileId, fileDoc.namespace);

  // Clear file from chat document
  await chatModel.updateOne(
    { _id: fileDoc.chatId, user: userId },
    { $unset: { fileId: "", fileName: "" } },
  );

  // Delete file record
  await fileUploadModel.deleteOne({ fileId, userId });

  return res.status(200).json({ message: "File removed successfully." });
}

