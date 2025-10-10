import UserMedia from "../models/userMedia.js";

// Add user media
export const addUserMedia = async (req, res) => {
  try {
    const { mediaId, status, rating, lastReadChapter, lastReadPage } = req.body;
    const newEntry = await UserMedia.create({
      userId: req.user.id,
      mediaId,
      status,
      rating,
      lastReadChapter,
      lastReadPage
    });
    res.status(201).json(newEntry);
  } catch (err) {
    console.error("Add user media error:", err);
    res.status(500).json({ message: err.message || "Server error" });
  }
};

// Get user media
export const getUserMedia = async (req, res) => {
  try {
    const entries = await UserMedia.find({ userId: req.user.id }).populate("mediaId");
    res.json(entries);
  } catch (err) {
    console.error("Get user media error:", err);
    res.status(500).json({ message: err.message || "Server error" });
  }
};

// Update user media
export const updateUserMedia = async (req, res) => {
  try {
    const entry = await UserMedia.findById(req.params.id);
    if (!entry) return res.status(404).json({ message: "Entry not found" });

    Object.assign(entry, req.body);
    await entry.save();
    res.json(entry);
  } catch (err) {
    console.error("Update user media error:", err);
    res.status(500).json({ message: err.message || "Server error" });
  }
};

// Delete user media
export const deleteUserMedia = async (req, res) => {
  try {
    const entry = await UserMedia.findById(req.params.id);
    if (!entry) return res.status(404).json({ message: "Entry not found" });

    await entry.remove();
    res.json({ message: "Entry deleted successfully" });
  } catch (err) {
    console.error("Delete user media error:", err);
    res.status(500).json({ message: err.message || "Server error" });
  }
};
