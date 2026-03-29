import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  chat: { type: mongoose.Schema.Types.ObjectId, ref: "Chat", required: true },
  content: { type: String, required: false }, // optional if just image
  role: { type: String, enum: ["user", "ai"], default: "user" },
  type: { type: String, enum: ["text", "file", "image"], default: "text" },
  imageInfo: {
    fileName: String,
    url: String, // Path to local storage or cloud
    mimeType: String
  }
}, {
  timestamps: true,
});

const messageModel = mongoose.models.Message || mongoose.model("Message", messageSchema);
export default messageModel;
