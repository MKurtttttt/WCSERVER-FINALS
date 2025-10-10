import express from "express";
import { protect } from "../middlewares/authMiddleware.js";
import { admin } from "../middlewares/adminMiddleware.js";
import { upload } from "../middlewares/uploadMiddleware.js";
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

// Expect fields: cover (single image) and gallery (multiple images)
router.post("/", protect, admin, upload.fields([
  { name: "cover", maxCount: 1 },
  { name: "gallery", maxCount: 10 }
]), createMedia);
router.patch("/:id", protect, admin, upload.fields([
  { name: "cover", maxCount: 1 },
  { name: "gallery", maxCount: 10 }
]), updateMedia);
router.delete("/:id", protect, admin, deleteMedia);

export default router;
