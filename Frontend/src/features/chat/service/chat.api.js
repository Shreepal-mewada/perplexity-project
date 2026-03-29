import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000/api/chats",
  withCredentials: true,
});

export const createChat = async ({ title = "New Chat" } = {}) => {
  try {
    const response = await api.post("/create", { title });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error("Network error");
  }
};

export const sendMessage = async ({ message, chatId, fileId = null }) => {
  try {
    const response = await api.post("/message", { chatId, message, fileId });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error("Network error");
  }
};

export const sendImageMessage = async (formData) => {
  try {
    // Note: the backend uses /api/images/chat, but `api` baseURL is /api/chats
    // Axios will automatically set the multipart/form-data boundary.
    const response = await axios.post(
      "http://localhost:3000/api/images/chat",
      formData,
      {
        withCredentials: true,
      },
    );
    return response.data;
  } catch (error) {
    const responseData = error.response?.data;
    if (responseData?.message) {
      throw new Error(responseData.message);
    }
    if (typeof responseData === "string") {
      throw new Error(responseData);
    }
    throw new Error("Network error");
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
