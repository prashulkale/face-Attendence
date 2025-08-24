import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  aadhaar: { type: String, required: true, match: /^\d{12}$/, unique: true },
  faceDescriptor: { type: [Number], required: true },
});

export default mongoose.model("User", UserSchema);
