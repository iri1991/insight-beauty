import mongoose from "mongoose";
import { hashPassword } from "../lib/passwords.js";
import { Account, Client, Professional, Salon, Visit } from "../lib/models.js";

process.loadEnvFile?.(".env");
if (!process.env.MONGODB_URI) throw new Error("MONGODB_URI lipsește din .env");
await mongoose.connect(process.env.MONGODB_URI, { dbName: process.env.MONGODB_DB || "insight_beauty" });

const password = process.env.SEED_ADMIN_PASSWORD;
const adminEmail = process.env.SEED_ADMIN_EMAIL || "admin@insightbeauty.local";
const adminName = process.env.SEED_ADMIN_NAME || "Insight Beauty Admin";
if (!password || password.length < 8) throw new Error("Definește SEED_ADMIN_PASSWORD (minimum 8 caractere) în .env înainte de inițializare.");
if (process.argv.includes("--reset")) await Promise.all([Account.deleteMany({}), Salon.deleteMany({}), Professional.deleteMany({}), Client.deleteMany({}), Visit.deleteMany({})]);
let admin = await Account.findOne({ email: adminEmail });
if (!admin) admin = await Account.create({ email: adminEmail, passwordHash: hashPassword(password), name: adminName, role: "admin" });
console.log(`Administrator disponibil: ${adminEmail}`);
await mongoose.disconnect();
