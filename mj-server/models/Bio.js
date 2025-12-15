const mongoose = require("mongoose");

const BioSchema = new mongoose.Schema({
  chapterId: { type: Number, required: true },
  year: { type: String, required: true },
  title: { type: String, required: true },
  image: { type: String, required: true },
  content: [String],
});

module.exports = mongoose.model("Bio", BioSchema);
