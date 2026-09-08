import mongoose from "mongoose";

const uri = process.env.MONGODB_URI;

export async function connectDb() {
  if (!uri) throw new Error("MONGODB_URI lipsește.");
  if (mongoose.connection.readyState) return mongoose;
  await mongoose.connect(uri, { dbName: process.env.MONGODB_DB || "insight_beauty" });
  return mongoose;
}
