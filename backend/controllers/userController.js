import User from "../models/user.js";
import bcrypt from "bcryptjs";

// GET /api/user/profile
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt
    });
  } catch (err) {
    console.error("Get profile error:", err);
    res.status(500).json({ message: err.message || "Server error" });
  }
};

// PATCH /api/user/profile
export const updateProfile = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (name) user.name = name;
    if (email) {
      const existingUser = await User.findOne({ email });
      if (existingUser && existingUser._id.toString() !== user._id.toString())
        return res.status(400).json({ message: "Email already in use" });
      user.email = email;
    }
    if (password) user.password = await bcrypt.hash(password, 12);

    await user.save();
    res.json({
      message: "Profile updated successfully",
      user: { id: user._id, name: user.name, email: user.email, role: user.role }
    });
  } catch (err) {
    console.error("Update profile error:", err);
    res.status(500).json({ message: err.message || "Server error" });
  }
};
