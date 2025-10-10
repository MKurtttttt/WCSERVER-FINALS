import express from "express";
import { protect } from "../middlewares/authMiddleware.js";
import {
  addUserMedia,
  getUserMedia,
  updateUserMedia,
  deleteUserMedia
} from "../controllers/userMediaController.js";

const router = express.Router();

router.post("/", protect, addUserMedia);
router.get("/", protect, getUserMedia);
router.patch("/:id", protect, updateUserMedia);
router.delete("/:id", protect, deleteUserMedia);

export default router;
