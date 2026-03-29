import Router from "express";
import { createChat, sendMessage, getChats, getMessages, deleteChat } from "../controllers/chat.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";

const authChatRouter = Router();
authChatRouter.post("/create", authenticate, createChat);
authChatRouter.post("/message", authenticate, sendMessage);
authChatRouter.get("/chats", authenticate, getChats);
authChatRouter.get("/messages/:chatId", authenticate, getMessages);
authChatRouter.delete("/chat/:chatId", authenticate, deleteChat);

export default authChatRouter;
