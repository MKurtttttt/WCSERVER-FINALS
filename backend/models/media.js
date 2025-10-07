import mongoose from "mongoose";

const mediaSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  category: { type: String, required: true }, // The genre of books 
  createdAt: { type: Date, default: Date.now },
  views: { type: Number, default: 0 },  // tracks how popular it is
  saves: { type: Number, default: 0 }   // track how many users save it
});

const Media = mongoose.model("Media", mediaSchema);
export default Media;
