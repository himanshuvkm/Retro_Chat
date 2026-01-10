import { Server } from "socket.io";
import http, { get } from 'http';
import express from "express";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: ["http://localhost:5173", process.env.CLIENT_URL],
        methods: ["GET", "POST"]
    }
});

export const getReceiverSocketId = (receiverId) => {
    return userSocketMap[receiverId];
};

const userSocketMap = {};

io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);
    const userId = socket.handshake.query.userId;
    if (userId) userSocketMap[userId] = socket.id;

    io.emit("getOnlineUsers", Object.keys(userSocketMap));

    // socket.on() is used to listen to the event and can be used both on client and server side
    // Typing events
    socket.on("typing", (room) => socket.in(room).emit("typing"));
    socket.on("stopTyping", (room) => socket.in(room).emit("stopTyping"));

    // Join room for groups or direct messages (using receiverId as room for now or handle via userSocketMap)
    // For MVP, simplistic typing:
    socket.on("typing_direct", ({ receiverId }) => {
        const receiverSocket = userSocketMap[receiverId];
        if (receiverSocket) io.to(receiverSocket).emit("typing_direct", { senderId: userId });
    });

    socket.on("stopTyping_direct", ({ receiverId }) => {
        const receiverSocket = userSocketMap[receiverId];
        if (receiverSocket) io.to(receiverSocket).emit("stopTyping_direct", { senderId: userId });
    });

    socket.on("disconnect", () => {
        console.log("A user disconnected:", socket.id);
        if (userId) delete userSocketMap[userId];
        io.emit("getOnlineUsers", Object.keys(userSocketMap));
    });
});

export { app, io, server };
