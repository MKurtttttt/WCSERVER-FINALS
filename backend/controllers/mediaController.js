import Media from "../models/media.js";

//  Create media
export const createMedia = async (req, res) => {
  try {
    const media = new Media(req.body);
    await media.save();
    res.status(201).json(media);
  } catch (err) {
    res.status(500).json({ message: "Error creating media", error: err.message });
  }
};

// 📖 Get all media (with search, filter, pagination)
export const getAllMedia = async (req, res) => {
  try {
    const { title, author, category, page = 1, limit = 10 } = req.query;
    const query = {};

    if (title) query.title = { $regex: title, $options: "i" };
    if (author) query.author = { $regex: author, $options: "i" };
    if (category) query.category = { $regex: `^${category}$`, $options: "i" };

    const skip = (page - 1) * limit;

    const media = await Media.find(query)
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Media.countDocuments(query);

    res.json({ total, page: parseInt(page), limit: parseInt(limit), results: media });
  } catch (err) {
    res.status(500).json({ message: "Error fetching media", error: err.message });
  }
};

//  Get single media + auto increment views
export const getMediaById = async (req, res) => {
  try {
    const media = await Media.findById(req.params.id);
    if (!media) return res.status(404).json({ message: "Media not found" });

    media.views += 1;
    await media.save();

    res.json(media);
  } catch (err) {
    res.status(500).json({ message: "Error fetching media", error: err.message });
  }
};

// Update media
export const updateMedia = async (req, res) => {
  try {
    const media = await Media.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!media) return res.status(404).json({ message: "Media not found" });
    res.json(media);
  } catch (err) {
    res.status(500).json({ message: "Error updating media", error: err.message });
  }
};

//  Delete media
export const deleteMedia = async (req, res) => {
  try {
    const media = await Media.findByIdAndDelete(req.params.id);
    if (!media) return res.status(404).json({ message: "Media not found" });
    res.json({ message: "Media deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting media", error: err.message });
  }
};

// ✅ Get trending/popular media
export const getTrendingMedia = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;

    // Sort by views first, then saves (descending)
    const media = await Media.find()
      .sort({ views: -1, saves: -1 })
      .limit(limit);

    res.json(media);
  } catch (err) {
    res.status(500).json({ message: "Error fetching trending media", error: err.message });
  }
};
