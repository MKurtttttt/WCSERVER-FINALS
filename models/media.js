import mongoose from "mongoose";

const mediaSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  category: { type: String, required: true }, // e.g. Comic, Novel, Movie
  createdAt: { type: Date, default: Date.now },
  views: { type: Number, default: 0 },  // track popularity
  saves: { type: Number, default: 0 }   // track user saves
});

const Media = mongoose.model("Media", mediaSchema);
export default Media;
