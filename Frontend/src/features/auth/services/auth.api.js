import axios from "axios";
import { store } from "../../../app/app.store";

const api = axios.create({
  baseURL: "http://localhost:3000/api/auth",
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
  const response = await api.post("/register", { username, email, password });
  return response.data;
}

export async function login({ email, password }) {
  const response = await api.post("/login", { email, password });
  // console.log(response.data);
  // localStorage.setItem("accessToken", response.data.accessToken);
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
