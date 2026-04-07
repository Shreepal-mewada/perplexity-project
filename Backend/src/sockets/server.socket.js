import { Server } from "socket.io";

let io;

export function initSocket(httpServer) {
  io = new Server(httpServer, {
    cors: {
      origin: [
        "http://localhost:5173",
        "https://perplexity-project-15i6gt7j0-shreepal-mewadas-projects.vercel.app",
        "https://perplexity-project-neon.vercel.app",
        "https://perplexity-project-zac5.onrender.com",
      ],
      credentials: true,
    },
  });
  console.log("socket server is RUNNING");

  console.log("Socket.io server is RUNNING");

  io.on("connection", (socket) => {
    console.log("A user connected: " + socket.id);
  });
}

export function getIO() {
  if (!io) {
    throw new Error("Socket.io not initialized");
  }

  return io;
}
