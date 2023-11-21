import { createServer } from "http";
import { Server } from "socket.io";
import express from "express";

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  serveClient: false,
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("A new user is connected: " + socket.id);

  socket.on("message", (data) => {
    socket.broadcast.emit("message", data);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);

    // notifiying other about the user left the chat
    socket.broadcast.emit(
      "someone-left-the-chat",
      "User left the chat: " + socket.id
    );
  });
});

httpServer.listen(3000, () => {
  console.log("Server is running on port 3000");
});
