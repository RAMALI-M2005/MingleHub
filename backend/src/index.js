// backend/index.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoute from "./routers/user.router.js";
import { connectDB } from "./lib/db.js";
import cookieParser from "cookie-parser";
import messageRoute from "./routers/message.router.js";
import { createServer } from "http";
import { Server } from "socket.io";

dotenv.config();

// Create an Express app
const app = express();
const server = createServer(app); // HTTP server
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // Replace with your frontend URL
    credentials: true,
  },
});

// Middlewares
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

// Connect to MongoDB
connectDB();

// Socket.io logic
io.on("connection", (socket) => {
  console.log(`🟢 User connected: ${socket.id}`);

  // Join a unique room for each user based on their userId
  socket.on("join", (userId, friendId) => {
    const roomID = userId < friendId ? `${userId}_${friendId}` : `${friendId}_${userId}`;
    socket.join(roomID);
    console.log(`User ${userId} joined room ${roomID}`);
  }); 

  // Listen for messages from clients and broadcast to all connected users
  socket.on("sendMessage", (message) => {
    const roomID = message.senderId < message.receiverId 
    ? `${message.senderId}_${message.receiverId}` 
    : `${message.receiverId}_${message.senderId}`;

    io.to(roomID).emit("receiveMessage", message);
    });

  // Handle disconnection
  socket.on("disconnect", () => {
    console.log(`🔴 User disconnected: ${socket.id}`);
  });
});

// Start the server
server.listen(process.env.PORT || 5000, () => {
  console.log(`🚀 Server running on port ${process.env.PORT || 5000}`);
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send({ message: "Internal server error" });
});

// Routes
app.use("/api/auth", authRoute);
app.use("/api/message", messageRoute);
