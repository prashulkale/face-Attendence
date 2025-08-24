import mongoose from "mongoose";

let isConnected = false; // connection state

export async function connectDB() {
  if (isConnected) {
    console.log("✅ Using existing MongoDB connection");
    return mongoose.connection;
  }

  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);

    isConnected = true;
    console.log(`🗄️ MongoDB connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    throw error;
  }
}
