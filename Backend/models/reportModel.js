const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema({
  type: { type: String, required: true },
  name: { type: String, required: true },
  category: { type: String, required: true },
  description: String,
  date: String,
  location: String,
  fullName: { type: String, required: true },
  mobile: { type: String, required: true },
  classCourse: String,
  photo: String,
  resolvedAt: String,

  matchId: String,
  matchColor: String,

}, { timestamps: true });

// 🔥 MOST IMPORTANT LINE
module.exports = mongoose.model("Report", reportSchema);
