import axios from "axios";

const normalizeUrl = (url) => url?.replace(/\/+$/, "") || "";
const API_BASE_URL =
  normalizeUrl(import.meta.env.VITE_API_BASE_URL) ||
  "https://perplexity-project-zac5.onrender.com/api";
const fileApi = axios.create({
  baseURL: `${API_BASE_URL}/files`,
  withCredentials: true,
});

/**
 * Uploads a PDF file to the backend for RAG indexing.
 * @param {File} file — browser File object
 * @param {string} chatId — current chat session ID
 * @param {function} onProgress — optional progress callback
 * @returns {{ fileId, fileName, chunkCount, pageCount, status }}
 */
export const uploadFile = async (file, chatId, onProgress) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("chatId", chatId);

  try {
    const response = await fileApi.post("/upload", formData, {
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const percent = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total,
          );
          onProgress(percent);
        }
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || new Error("File upload failed");
  }
};

/**
 * Removes a file's vectors from Pinecone and clears it from the chat.
 * @param {string} fileId
 */
export const removeFile = async (fileId) => {
  try {
    const response = await fileApi.delete(`/${fileId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || new Error("File removal failed");
  }
};
