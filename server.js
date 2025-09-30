import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import mediaRoutes from "./routes/mediaRoutes.js";
import protectedRoutes from "./routes/protectedRoutes.js";
import authRoutes from "./routes/authRoutes.js"; 

dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(express.json());


// Connect DB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error(err));


// Routes
app.use("/api/auth", authRoutes);
app.use("/api/protected", protectedRoutes);
app.use("/api/media", mediaRoutes);


// Base route (router check)
app.get("/", (req, res) => {
  res.json({ message: "API running" });
});


// Error handler
app.use((err, req, res, next) => {
  console.error("Global error:", err);
  res.status(500).json({ message: err.message || "Server error" });
});


// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
