import mongoose from "mongoose";

/**
 * FileUpload Model
 * Tracks every uploaded PDF file — its processing status,
 * Pinecone namespace, and relationship to a chat session.
 */
const fileUploadSchema = new mongoose.Schema(
  {
    fileId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    chatId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Chat",
      required: true,
    },
    fileName: {
      type: String,
      required: true,
      trim: true,
    },
    fileSize: {
      type: Number, // bytes
      default: 0,
    },
    pageCount: {
      type: Number,
      default: 0,
    },
    chunkCount: {
      type: Number,
      default: 0,
    },
    namespace: {
      type: String, // e.g. "user-{userId}"
      required: true,
    },
    // State machine: uploading → parsing → embedding → indexing → ready | failed
    status: {
      type: String,
      enum: ["uploading", "parsing", "embedding", "indexing", "ready", "failed"],
      default: "uploading",
    },
    errorMessage: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const fileUploadModel =
  mongoose.models.FileUpload ||
  mongoose.model("FileUpload", fileUploadSchema);

export default fileUploadModel;
