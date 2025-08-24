
import express from "express";
const router = express.Router();
import User from "../models/User.js";
import Attendance from "../models/Attendance.js";

// Helper: start/end of day
const dayRange = (date = new Date()) => {
  const start = new Date(date); start.setHours(0,0,0,0);
  const end = new Date(date);   end.setHours(23,59,59,999);
  return { start, end };
  
};

// Mark attendance by aadhaar OR userId (one of them is required)
router.post("/mark", async (req, res) => {
  try {
    const { aadhaar, userId } = req.body;
    let user = null;

    if (userId) {
      user = await User.findById(userId);
    } else if (aadhaar) {
      user = await User.findOne({ aadhaar });
    }

    if (!user) return res.status(404).json({ error: "User not found" });

    // Prevent duplicate marks for the same day
    const { start, end } = dayRange(new Date());
    const already = await Attendance.findOne({
      userId: user._id,
      timestamp: { $gte: start, $lte: end },
    });

    if (already) {
      return res.json({ success: true, record: already, duplicate: true });
    }

    const record = await Attendance.create({ userId: user._id });
    const populated = await record.populate("userId");

    res.json({ success: true, record: populated });
  } catch (err) {
    console.error("Attendance mark error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// Bulk insert (optional; expects {records:[{userId|aadhaar, timestamp?}, ...]})
router.post("/bulk", async (req, res) => {
  const { records = [] } = req.body;
  const docs = [];
  for (const r of records) {
    let user = null;
    if (r.userId) user = await User.findById(r.userId);
    if (!user && r.aadhaar) user = await User.findOne({ aadhaar: r.aadhaar });
    if (user) {
      docs.push({ userId: user._id, timestamp: r.timestamp ? new Date(r.timestamp) : new Date() });
    }
  }
  const inserted = await Attendance.insertMany(docs);
  res.json(inserted);
});

// Get all attendance (populated)
router.get("/", async (_req, res) => {
  const records = await Attendance.find().sort({ timestamp: -1 }).populate("userId").lean();
  res.json(records);
});

export default router;
