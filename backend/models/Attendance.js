import mongoose from "mongoose";

const AttendanceSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  timestamp: { type: Date, default: Date.now },
});

// Optional: compound index to prevent duplicates by day
AttendanceSchema.index(
  { userId: 1, day: 1 },
  { unique: true, partialFilterExpression: { day: { $exists: true } } }
);

// Maintain a derived "day" (YYYY-MM-DD) for dedupe
AttendanceSchema.pre("save", function (next) {
  const d = new Date(this.timestamp || Date.now());
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  this.day = `${yyyy}-${mm}-${dd}`;
  next();
});

export default mongoose.model("Attendance", AttendanceSchema);
