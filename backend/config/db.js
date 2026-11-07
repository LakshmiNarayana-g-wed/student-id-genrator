import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

let isConnected = false;
let dbHost = "";
let dbName = "";

export const connectDB = async () => {
  const mongoURI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/student_id_db";

  try {
    const conn = await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 5000,
    });

    isConnected = true;
    dbHost = conn.connection.host;
    dbName = conn.connection.name;

    console.log(`✅ MongoDB Connected Successfully: ${dbHost}/${dbName}`);
  } catch (error) {
    isConnected = false;
    console.warn(`⚠️ MongoDB Connection Notice: ${error.message}`);
    console.warn(
      `ℹ️ Running in resilient mode. Set a valid MONGODB_URI in your .env file to persist to MongoDB Atlas.`,
    );
  }
};

export const getDbStatus = () => ({
  connected: isConnected,
  host: dbHost || "None (local fallback)",
  database: dbName || "student_id_db",
  state: mongoose.connection.readyState,
  // 0 = disconnected, 1 = connected, 2 = connecting, 3 = disconnecting
  stateDescription:
    ["disconnected", "connected", "connecting", "disconnecting"][mongoose.connection.readyState] ||
    "unknown",
});
