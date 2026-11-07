import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import studentRoutes from "./routes/studentRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS for all incoming client requests
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

// Body parser supporting large payloads (for base64 ID photos and logos)
app.use(express.json({ limit: "15mb" }));
app.use(express.urlencoded({ extended: true, limit: "15mb" }));

// Mount API routes
app.use("/api", studentRoutes);

// Base route
app.get("/", (req, res) => {
  res.json({
    message: "🎓 Student ID Card Generator Backend API is active.",
    endpoints: {
      health: "/api/health",
      students: "/api/students",
      verify: "/api/students/verify/:regNo",
    },
  });
});

// Connect to MongoDB and start the HTTP server
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`===============================================`);
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📡 Health Check: http://localhost:${PORT}/api/health`);
    console.log(`🎓 Students API: http://localhost:${PORT}/api/students`);
    console.log(`===============================================`);
  });
});

export default app;
