import express from "express";
import { auth } from "../middlewares/authMiddleware.js";
import { updateProfile } from "../controllers/userController.js";

const router = express.Router();

// Update own profile
router.put("/profile", auth, updateProfile);

export default router;
