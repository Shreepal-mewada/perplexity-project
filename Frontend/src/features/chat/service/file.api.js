import axios from "axios";
import { store } from "../../../app/app.store";

const normalizeUrl = (url) => url?.replace(/\/+$/, "") || "";
const ensureApiPath = (baseUrl) => {
  const normalized = normalizeUrl(baseUrl);
  return normalized.endsWith("/api") ? normalized : `${normalized}/api`;
};
const API_BASE_URL =
  ensureApiPath(import.meta.env.VITE_API_BASE_URL) ||
  "https://perplexity-project-zac5.onrender.com/api";
console.debug("[Frontend] file API base URL:", API_BASE_URL);
const fileApi = axios.create({
  baseURL: `${API_BASE_URL}/files`,
});

fileApi.interceptors.request.use((config) => {
  const token = store.getState().auth.accessToken;
  if (token) {
    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${token}`,
    };
  }
  return config;
});

export const uploadFile = async (file, chatId, onProgress) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("chatId", chatId);

  const response = await fileApi.post("/upload", formData, {
    onUploadProgress: (progressEvent) => {
      if (onProgress && progressEvent.total) {
        const percent = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
        onProgress(percent);
      }
    },
  });
  return response.data;
};

export const removeFile = async (fileId) => {
  const response = await fileApi.delete(`/${fileId}`);
  return response.data;
};
