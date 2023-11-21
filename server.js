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
    console.log(data);
    io.emit("message", data);
  });
});

httpServer.listen(3000, () => {
  console.log("Server is running on port 3000");
});
