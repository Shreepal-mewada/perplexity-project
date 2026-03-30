import axios from "axios";
import { store } from "../../../app/app.store";
import { handleApiRequest } from "../../../services/backendHealth.service";

const normalizeUrl = (url) => url?.replace(/\/+$/, "") || "";
const ensureApiPath = (baseUrl) => {
  const normalized = normalizeUrl(baseUrl);
  return normalized.endsWith("/api") ? normalized : `${normalized}/api`;
};
const API_BASE_URL =
  ensureApiPath(import.meta.env.VITE_API_BASE_URL) ||
  "https://perplexity-project-zac5.onrender.com/api";
console.debug("[Frontend] auth API base URL:", API_BASE_URL);
const api = axios.create({
  baseURL: `${API_BASE_URL}/auth`,
  withCredentials: true,
});

// Attach accessToken (from Redux state) to every request.
api.interceptors.request.use((config) => {
  const token = store.getState().auth.accessToken;
  if (token) {
    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${token}`,
    };
  }
  return config;
});

export async function register({ username, email, password }) {
  return handleApiRequest(async () => {
    const response = await api.post("/register", { username, email, password });
    return response.data;
  });
}

export async function login({ email, password }) {
  return handleApiRequest(async () => {
    const response = await api.post("/login", { email, password });
    // console.log(response.data);
    // localStorage.setItem("accessToken", response.data.accessToken);
    return response.data;
  });
}

export async function handleRefresh() {
  return handleApiRequest(async () => {
    const response = await api.post("/refresh-token");
    return response.data;
  });
}

export async function getMe() {
  return handleApiRequest(async () => {
    const response = await api.get("/get-me");
    return response.data;
  });
}

export async function logoutUser() {
  return handleApiRequest(async () => {
    const response = await api.get("/logout");
    return response.data;
  });
}
