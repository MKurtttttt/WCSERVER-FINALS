import express from "express";
import {
  createMedia,
  getAllMedia,
  getMediaById,
  updateMedia,
  deleteMedia
} from "../controllers/mediaController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Only logged-in users can interact
router.post("/", protect, createMedia);
router.get("/", getAllMedia);
router.get("/:id", getMediaById);
router.put("/:id", protect, updateMedia);
router.delete("/:id", protect, deleteMedia);

export default router;
