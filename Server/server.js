import express from "express";

import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import authRoute from "./Routes/auth-route.js";
import messageRoute from "./Routes/message-routes.js";
import userRoute from "./Routes/user-route.js";
import connecttoDb from "./DB/connecttoDb.js";
import { app, server } from "./Socket/socket.io.js";
import "./Socket/socketHandlers.js"; 

dotenv.config();

app.use(cors({
  origin: ["http://localhost:5173", "https://retrochat-beta.vercel.app"],
  credentials: true
}));

app.use(cookieParser());
app.use(express.json());

connecttoDb();

app.use("/api/auth", authRoute);
app.use("/api/message", messageRoute);
app.use("/api/users", userRoute);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log("🚀 Server running on", PORT);
});
