import { io } from "socket.io-client";

const SOCKET_URL =
  import.meta.env.VITE_SOCKET_URL ||
  "https://perplexity-project-zac5.onrender.com";

export const initializeSocketConnection = () => {
  const socket = io(SOCKET_URL, {
    withCredentials: true,
  });

  socket.on("connect", () => {
    console.log("Connected to Socket.IO server");
  });
};
