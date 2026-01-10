import path from "path";
import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import authRoute from "./Routes/auth-route.js";
import messageRoute from "./Routes/message-routes.js";
import connecttoDb from "./DB/connecttoDb.js";
import userRoute from "./Routes/user-route.js";
import { app, server } from "./Socket/socket.io.js";
import cors from "cors";

dotenv.config();

const Port = process.env.PORT || 5000;


// ---------------------- Middlewares ----------------------
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: ["http://localhost:5173", "https://retrochat-beta.vercel.app", process.env.CLIENT_URL], // Allow local dev and production client
  credentials: true
}));

// ---------------------- DB Connect -----------------------
connecttoDb();

// ---------------------- API Routes -----------------------
app.use("/api/auth", authRoute);
app.use("/api/message", messageRoute);
app.use("/api/users", userRoute);

// ---------------------- Start Server ---------------------
server.listen(Port, () => {
  console.log(`🚀 Server is running on port ${Port}`);
});
