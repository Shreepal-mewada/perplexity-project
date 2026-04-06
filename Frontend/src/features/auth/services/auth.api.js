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
console.debug("[Frontend] auth API base URL:", API_BASE_URL);
const api = axios.create({
  baseURL: `${API_BASE_URL}/auth`,
});

api.interceptors.request.use((config) => {
  const state = store.getState().auth;
  const token = state.refreshToken || state.accessToken;
  if (token) {
    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${token}`,
    };
  }
  return config;
});

export async function register({ username, email, password }) {
  const response = await api.post("/register", { username, email, password });
  return response.data;
}

export async function login({ email, password }) {
  const response = await api.post("/login", { email, password });
  return response.data;
}

export async function handleRefresh() {
  const response = await api.post("/refresh-token");
  return response.data;
}

export async function getMe() {
  const response = await api.get("/get-me");
  return response.data;
}

export async function logoutUser() {
  const response = await api.get("/logout");
  return response.data;
}

export async function verifyEmail(token) {
  const response = await api.get(`/verify-email?token=${token}`);
  return response.data;
}

export async function googleAuthAPI(credential) {
  const response = await api.post("/google", { credential });
  return response.data;
}
