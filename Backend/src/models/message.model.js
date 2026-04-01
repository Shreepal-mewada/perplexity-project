import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  chat: { type: mongoose.Schema.Types.ObjectId, ref: "Chat", required: true },
  content: { type: String, required: false },
  role: { type: String, enum: ["user", "ai"], default: "user" },
  type: { type: String, enum: ["text", "file", "image"], default: "text" },
  imageInfo: {
    fileName: String,
    url: String,
    mimeType: String
  },
  fileInfo: {
    fileName: String,
    fileId: String,
  }
}, {
  timestamps: true,
});

const messageModel = mongoose.models.Message || mongoose.model("Message", messageSchema);
export default messageModel;
