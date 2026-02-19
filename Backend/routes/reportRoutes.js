const express = require("express");
const router = express.Router();
const Report = require("../models/reportModel");

/* GET all reports */
router.get("/", async (req, res) => {
  try {
    const reports = await Report.find();
    res.json(reports);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* CREATE report */
router.post("/", async (req, res) => {
  try {
    const { name, category, photo } = req.body;

    // 🔥 find matching report
    const existing = await Report.findOne({
      name: { $regex: new RegExp(name, "i") },
      category
    });

    let matchId = null;
    let matchColor = null;

    if (existing) {
      matchId = existing.matchId || existing._id.toString();
      matchColor = existing.matchColor || getRandomColor();

      // update old also
      await Report.findByIdAndUpdate(existing._id, {
        matchId,
        matchColor
      });
    }

    const newReport = await Report.create({
      ...req.body,
      matchId,
      matchColor
    });

    res.status(201).json(newReport);

  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});
 function getRandomColor() {
  const colors = [
    "#e74c3c", "#3498db", "#2ecc71",
    "#f1c40f", "#9b59b6", "#e67e22"
  ];
  return colors[Math.floor(Math.random() * colors.length)];
}


/* RESOLVE report ✅ (NO validation issue) */
router.patch("/:id/resolve", async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);

    if (!report) return res.status(404).json({ message: "Not found" });

    const matchId = report.matchId;

    if (matchId) {
      await Report.updateMany(
        { matchId },
        { resolvedAt: new Date().toLocaleString() }
      );
    } else {
      report.resolvedAt = new Date().toLocaleString();
      await report.save();
    }

    res.json({ message: "Resolved" });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


/* DELETE report ✅ (FORCE delete) */
router.delete("/:id", async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);

    if (!report) return res.status(404).json({ message: "Not found" });

    if (report.matchId) {
      await Report.deleteMany({ matchId: report.matchId });
    } else {
      await Report.findByIdAndDelete(req.params.id);
    }

    res.json({ message: "Deleted" });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;