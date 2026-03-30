import axios from "axios";
import { handleApiRequest } from "../../../services/backendHealth.service";

const normalizeUrl = (url) => url?.replace(/\/+$/, "") || "";
const ensureApiPath = (baseUrl) => {
  const normalized = normalizeUrl(baseUrl);
  return normalized.endsWith("/api") ? normalized : `${normalized}/api`;
};
const API_BASE_URL =
  ensureApiPath(import.meta.env.VITE_API_BASE_URL) ||
  "https://perplexity-project-zac5.onrender.com/api";
console.debug("[Frontend] chat API base URL:", API_BASE_URL);
const api = axios.create({
  baseURL: `${API_BASE_URL}/chats`,
  withCredentials: true,
});

export const createChat = async ({ title = "New Chat" } = {}) => {
  return handleApiRequest(async () => {
    const response = await api.post("/create", { title });
    return response.data;
  });
};

export const sendMessage = async ({ message, chatId, fileId = null }) => {
  return handleApiRequest(async () => {
    const response = await api.post("/message", { chatId, message, fileId });
    return response.data;
  });
};

export const sendImageMessage = async (formData) => {
  return handleApiRequest(async () => {
    const imageApiUrl = `${API_BASE_URL}/images/chat`;
    const response = await axios.post(imageApiUrl, formData, {
      withCredentials: true,
    });
    return response.data;
  });
};

export const getChats = async () => {
  return handleApiRequest(async () => {
    const response = await api.get("/chats");
    return response.data;
  });
};

export const getMessages = async (chatId) => {
  return handleApiRequest(async () => {
    const response = await api.get(`/messages/${chatId}`);
    return response.data;
  });
};

export const deleteChat = async ({ chatId }) => {
  return handleApiRequest(async () => {
    const response = await api.delete(`/chat/${chatId}`);
    return response.data;
  });
};
