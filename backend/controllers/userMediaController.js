import UserMedia from "../models/userMedia.js";

// ✅ CREATE
export const addUserMedia = async (req, res) => {
  try {
    const { mediaId, status } = req.body;
    const userId = req.user.id;

    const existing = await UserMedia.findOne({ userId, mediaId });
    if (existing) return res.status(400).json({ message: "Media already saved" });

    const newUserMedia = await UserMedia.create({ userId, mediaId, status });
    res.status(201).json(newUserMedia);
  } catch (error) {
    console.error("Add UserMedia error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ READ
export const getUserMedia = async (req, res) => {
  try {
    const userId = req.user.id;
    const userMedia = await UserMedia.find({ userId }).populate("mediaId");
    res.json(userMedia);
  } catch (error) {
    console.error("Get UserMedia error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ UPDATE
export const updateUserMedia = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, rating, lastReadChapter, lastReadPage } = req.body;

    const updated = await UserMedia.findByIdAndUpdate(
      id,
      { status, rating, lastReadChapter, lastReadPage },
      { new: true }
    );

    if (!updated) return res.status(404).json({ message: "UserMedia not found" });
    res.json(updated);
  } catch (error) {
    console.error("Update UserMedia error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ DELETE
export const deleteUserMedia = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await UserMedia.findByIdAndDelete(id);

    if (!deleted) return res.status(404).json({ message: "UserMedia not found" });
    res.json({ message: "Media removed from library" });
  } catch (error) {
    console.error("Delete UserMedia error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
