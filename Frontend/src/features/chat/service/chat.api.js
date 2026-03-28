import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000/api/chats",
  withCredentials: true,
});

export const sendMessage = async ({ message, chatId, fileId = null }) => {
  try {
    const response = await api.post("/message", { chatId, message, fileId });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error("Network error");
  }
};

export const getChats = async () => {
  try {
    const response = await api.get("/chats");
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error("Network error");
  }
};

export const getMessages = async (chatId) => {
  try {
    const response = await api.get(`/messages/${chatId}`);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error("Network error");
  }
};

export const deleteChat = async ({ chatId }) => {
  try {
    const response = await api.delete(`/chat/${chatId}`);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error("Network error");
  }
};
