import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import fs from "fs";

import mediaRoutes from "./routes/mediaRoutes.js";
import protectedRoutes from "./routes/protectedRoutes.js";
import userMediaRoutes from "./routes/userMediaRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";


dotenv.config();
const app = express();

// ✅ Middleware (important these come BEFORE routes)
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
app.use(express.json()); // 👈 this parses JSON bodies

// ✅ Ensure uploads directory exists and serve it statically
const uploadsDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
app.use("/uploads", express.static(uploadsDir));

// ✅ Database connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error(err));

// ✅ API Routes
app.use("/api/auth", authRoutes);
app.use("/api/protected", protectedRoutes);
app.use("/api/media", mediaRoutes);
app.use("/api/userMedia", userMediaRoutes);
app.use("/api/user", userRoutes);

// ✅ Base route
app.get("/", (req, res) => {
  res.json({ message: "API running" });
});

// ✅ Global error handler
app.use((err, req, res, next) => {
  console.error("Global error:", err);
  res.status(500).json({ message: err.message || "Server error" });
});

// ✅ Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));