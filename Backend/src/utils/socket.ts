import { Server } from "socket.io";

let io: Server;

export const initSocket = (server: any) => {
  console.log("am getting called")
  io = new Server(server, {
    cors: { origin: "*" },
  });

  io.on("connection", (socket) => {
    console.log("Socket connected:", socket.id);
  
  socket.on("join", (userId) => {
    socket.join(userId);
    console.log("User joined room:", userId);
  });

 socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });

    });

  return io;
};

export const getIO = () => {
  if (!io) {
    throw new Error("Socket not initialized");
  }
  return io;
};