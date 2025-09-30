import Media from "../models/media.js";

// ➕ Create media
export const createMedia = async (req, res) => {
  try {
    const media = new Media(req.body);
    await media.save();
    res.status(201).json(media);
  } catch (err) {
    res.status(500).json({ message: "Error creating media", error: err.message });
  }
};

// 📖 Get all media
export const getAllMedia = async (req, res) => {
  try {
    const media = await Media.find();
    res.json(media);
  } catch (err) {
    res.status(500).json({ message: "Error fetching media", error: err.message });
  }
};

// 🔍 Get single media
export const getMediaById = async (req, res) => {
  try {
    const media = await Media.findById(req.params.id);
    if (!media) return res.status(404).json({ message: "Media not found" });
    res.json(media);
  } catch (err) {
    res.status(500).json({ message: "Error fetching media", error: err.message });
  }
};

// ✏️ Update media
export const updateMedia = async (req, res) => {
  try {
    const media = await Media.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!media) return res.status(404).json({ message: "Media not found" });
    res.json(media);
  } catch (err) {
    res.status(500).json({ message: "Error updating media", error: err.message });
  }
};

// ❌ Delete media
export const deleteMedia = async (req, res) => {
  try {
    const media = await Media.findByIdAndDelete(req.params.id);
    if (!media) return res.status(404).json({ message: "Media not found" });
    res.json({ message: "Media deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting media", error: err.message });
  }
};
