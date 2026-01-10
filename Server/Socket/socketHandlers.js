import { io } from "./socket.io.js";

const userSocketMap = {};

export const getReceiverSocketId = (receiverId) => {
  return userSocketMap[receiverId];
};

io.on("connection", (socket) => {
  console.log("🟢 User connected:", socket.id);

  const userId = socket.handshake.query.userId;
  if (userId) userSocketMap[userId] = socket.id;

  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  socket.on("typing_direct", ({ receiverId }) => {
    const receiverSocket = userSocketMap[receiverId];
    if (receiverSocket) io.to(receiverSocket).emit("typing_direct", { senderId: userId });
  });

  socket.on("stopTyping_direct", ({ receiverId }) => {
    const receiverSocket = userSocketMap[receiverId];
    if (receiverSocket) io.to(receiverSocket).emit("stopTyping_direct", { senderId: userId });
  });

  socket.on("disconnect", () => {
    if (userId) delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});
