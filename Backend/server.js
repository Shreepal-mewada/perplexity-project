import app from "./src/app.js";
import dotenv from "dotenv";
import http from "http";
import { initSocket } from "./src/sockets/server.socket.js";

const httpServer = http.createServer(app);

initSocket(httpServer);

httpServer.listen(3000, () => {
  console.log("Server is running on port 3000");
});
