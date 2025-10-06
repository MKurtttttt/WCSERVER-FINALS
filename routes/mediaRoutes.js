import express from "express";
import {
  createMedia,
  getAllMedia,
  getMediaById,
  updateMedia,
  deleteMedia
} from "../controllers/mediaController.js";

import { auth } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Only logged-in users can interact
router.post("/", auth, createMedia);
router.get("/", getAllMedia);
router.get("/:id", getMediaById);
router.put("/:id", auth, updateMedia);
router.delete("/:id", auth, deleteMedia);

export default router;
