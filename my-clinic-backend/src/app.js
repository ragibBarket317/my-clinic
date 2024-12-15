import cookieParser from "cookie-parser";
import cors from "cors";
import { EventEmitter } from "events";
import express from "express";
import http from "http";
import { Server } from "socket.io";
import { createSuperAdmin } from "./utils/createAdmin.js";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.SOCKET_FRONTEND_URL, // Ensure this is set in your .env
    methods: ["GET", "POST"],
    credentials: true, // Allow cookies and authentication headers
  },
});

// Maps for Socket.IO
const userSocketMap = {};
const whoSelectedWhom = {};

// Utility functions
export const getReceiverSocketId = (receiverId) => {
  return userSocketMap[receiverId];
};
export const getWhoSelectedWhom = (who) => {
  return whoSelectedWhom[who];
};

// Socket.IO Connection Handling
io.on("connection", (socket) => {
  console.log("🔌 User connected:", socket.id);

  const userId = socket.handshake.query.userId;
  if (userId && userId !== "undefined") {
    userSocketMap[userId] = socket.id;
  }

  // Emit the list of online users to everyone
  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  // Handle custom event
  socket.on("whoSelectedWhom", (selectedId) => {
    if (userId) {
      whoSelectedWhom[userId] = selectedId;
      console.log(`${userId} selected ${selectedId}`);
    } else {
      console.error("Invalid userId in whoSelectedWhom event");
    }
  });

  // Handle disconnect
  socket.on("disconnect", () => {
    console.log("❌ User disconnected:", socket.id);
    delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });

  // Handle errors
  socket.on("error", (err) => {
    console.error("Socket error:", err);
  });
});

// Middleware for CORS
app.use(
  cors({
    origin: process.env.CORS_ORIGIN, // Ensure this matches your frontend
    credentials: true, // Enable cookies and headers
  })
);

// General Middleware
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(cookieParser());
EventEmitter.defaultMaxListeners = 15;

// Superadmin creation script
createSuperAdmin();

// Importing routes
import adminRouter from "./routes/admin.routes.js";
import appointmentRouter from "./routes/appointment.routes.js";
import documentRouter from "./routes/document.routes.js";
import inviteAdmin from "./routes/invitedAdmin.routes.js";
import messageRouter from "./routes/message.routes.js";
import notesRouter from "./routes/note.routes.js";
import notificationsRouter from "./routes/notification.routes.js";
import overviewRouter from "./routes/overview.routes.js";
import patientRouter from "./routes/patient.routes.js";
import settingRouter from "./routes/setting.routes.js";
import { errorHandler } from "./utils/errorHandler.js";

// Route declarations
app.use("/api/v1/admins", adminRouter);
app.use("/api/v1/invite", inviteAdmin);
app.use("/api/v1/patient", patientRouter);
app.use("/api/v1/notes", notesRouter);
app.use("/api/v1/notifications", notificationsRouter);
app.use("/api/v1/message", messageRouter);
app.use("/api/v1/overview", overviewRouter);
app.use("/api/v1/apts", appointmentRouter);
app.use("/api/v1/documents", documentRouter);
app.use("/api/v1/setting", settingRouter);

// Error handler
app.use(errorHandler);

// Graceful shutdown
process.on("SIGINT", () => {
  console.log("🛑 Server shutting down...");
  server.close(() => {
    console.log("✅ Server closed.");
    process.exit(0);
  });
});

// Listen to the server on a port
server.listen(process.env.PORT || 8000, () => {
  console.log(`⚙️ Server is running on port: ${process.env.PORT || 8000}`);
});

export { app, io };
