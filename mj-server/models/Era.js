const mongoose = require("mongoose");

// 1. Schema con: Bài hát
const SongSchema = new mongoose.Schema({
  title: { type: String, required: true },
  year: { type: Number },
  trivia: { type: String },
  duration: { type: String },
});

// 2. Schema con: Vật phẩm
const ArtifactSchema = new mongoose.Schema({
  name: { type: String, required: true },
  imageUrl: { type: String },
  story: { type: String },
});

// 3. Schema con: Vũ đạo
const MoveSchema = new mongoose.Schema({
  name: { type: String },
  videoUrl: { type: String },
  description: { type: String },
});

// 4. Schema Chính: Kỷ nguyên (Era)
const EraSchema = new mongoose.Schema({
  name: { type: String, required: true },
  years: { type: String },
  description: { type: String },

  themeColor: { type: String },
  secondaryColor: { type: String },
  backgroundImage: { type: String },

  songs: [SongSchema],
  artifacts: [ArtifactSchema],
  signatureMove: MoveSchema,
  quote: { type: String },
});

module.exports = mongoose.model("Era", EraSchema);
