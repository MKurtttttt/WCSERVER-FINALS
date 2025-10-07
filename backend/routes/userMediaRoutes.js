import express from "express";
import { auth } from "../middlewares/authMiddleware.js";
import {
  addUserMedia,
  getUserMedia,
  updateUserMedia,
  deleteUserMedia
} from "../controllers/userMediaController.js";

const router = express.Router();

router.post("/", auth, addUserMedia);
router.get("/", auth, getUserMedia);
router.patch("/:id", auth, updateUserMedia);
router.delete("/:id", auth, deleteUserMedia);

export default router;
