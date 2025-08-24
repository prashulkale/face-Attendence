


import express from "express";
const router = express.Router();
import User from "../models/User.js";

// Register user
router.post("/register", async (req, res) => {
  try {
    const { name, aadhaar, faceDescriptor } = req.body;
    if (!name || !aadhaar || !faceDescriptor) {
      return res.status(400).json({ error: "Missing fields." });
    }
    if (!/^\d{12}$/.test(aadhaar)) {
      return res.status(400).json({ error: "Invalid Aadhaar." });
    }

    const existing = await User.findOne({ aadhaar });
    if (existing) return res.status(409).json({ error: "Aadhaar already registered." });

    const user = await User.create({ name, aadhaar, faceDescriptor });
    res.json(user);
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// Get all users
router.get("/", async (_req, res) => {
  const users = await User.find().lean();
  res.json(users);
});

export default router;
