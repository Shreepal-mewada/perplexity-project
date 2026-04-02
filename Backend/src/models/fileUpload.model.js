import mongoose from "mongoose";

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
      type: Number,
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
      type: String,
      required: true,
    },
    fullText: {
      type: String,
      default: null,
    },
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
