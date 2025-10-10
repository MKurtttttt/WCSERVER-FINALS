import express from "express";
import { protect } from "../middlewares/authMiddleware.js";
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

router.get("/", getAllMedia);
router.get("/trending", getTrendingMedia);
router.get("/:id", getMediaById);

router.post("/", protect, admin, createMedia);
router.patch("/:id", protect, admin, updateMedia);
router.delete("/:id", protect, admin, deleteMedia);

export default router;
