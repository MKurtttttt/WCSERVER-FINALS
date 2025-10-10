import express from "express";
import { protect } from "../middlewares/authMiddleware.js";
import { getUserProfile, updateProfile } from "../controllers/userController.js";

const router = express.Router();

router.get("/profile", protect, getUserProfile);
router.patch("/profile", protect, updateProfile);

export default router;
