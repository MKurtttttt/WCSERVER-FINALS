import express from "express";
import { auth } from "../middlewares/authMiddleware.js";
import { admin } from "../middlewares/adminMiddleware.js";
import {
  createMedia,
  getAllMedia,
  getMediaById,
  updateMedia,
  deleteMedia,
  getTrendingMedia
} from "../controllers/mediaController.js";

const router = express.Router();

// Public routes
router.get("/", getAllMedia);
router.get("/trending", getTrendingMedia); // ✅ Must be before :id
router.get("/:id", getMediaById);

// Admin-only routes
router.post("/", auth, admin, createMedia);
router.patch("/:id", auth, admin, updateMedia);
router.delete("/:id", auth, admin, deleteMedia);

export default router;
