import mongoose from "mongoose";

const userMediaSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  mediaId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Media",
    required: true
  },
  status: {
    type: String,
    enum: ["To Read", "In Progress", "Completed"],
    default: "To Read"
  },
  rating: {
    type: Number,
    min: 1,
    max: 5
  },
  lastReadChapter: Number,
  lastReadPage: Number
}, { timestamps: true });

const UserMedia = mongoose.model("UserMedia", userMediaSchema);
export default UserMedia;
