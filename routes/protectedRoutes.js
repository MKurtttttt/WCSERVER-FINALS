import express from "express";
import { protect } from "../middlewares/authMiddleware.js";


const router = express.Router();

router.get("/me", protect, (req, res) => {
  res.json({ message: "Protected route accessed", userId: req.user.id });
});


export default router;
