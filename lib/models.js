import mongoose from "mongoose";

const accountSchema = new mongoose.Schema({
  email: { type: String, unique: true, index: true },
  passwordHash: { type: String, required: true },
  name: String,
  role: { type: String, enum: ["admin", "salon", "professional", "client"], required: true },
  salonId: String,
  professionalId: String,
  pushSubscriptions: [mongoose.Schema.Types.Mixed]
}, { timestamps: true });

const salonSchema = new mongoose.Schema({ name: String, city: String, ownerId: String }, { timestamps: true });
const professionalSchema = new mongoose.Schema({ salonId: String, accountId: String, name: String, specialty: String }, { timestamps: true });
const clientSchema = new mongoose.Schema({
  salonId: String, professionalId: String, accountId: String, name: String, email: String, phone: String,
  gdprConsent: {
    acceptedAt: Date,
    version: String
  },
  onboardingToken: { type: String, unique: true, sparse: true }, onboardingStatus: { type: String, enum: ["invited", "completed"], default: "invited" },
  baumannType: String, questionnaireHistory: [mongoose.Schema.Types.Mixed]
}, { timestamps: true });
const visitSchema = new mongoose.Schema({ clientId: String, salonId: String, professionalId: String, date: Date, procedures: [String], treatments: [String], notes: String, nextStep: String }, { timestamps: true });

export const Account = mongoose.models.Account || mongoose.model("Account", accountSchema);
export const Salon = mongoose.models.Salon || mongoose.model("Salon", salonSchema);
export const Professional = mongoose.models.Professional || mongoose.model("Professional", professionalSchema);
export const Client = mongoose.models.Client || mongoose.model("Client", clientSchema);
export const Visit = mongoose.models.Visit || mongoose.model("Visit", visitSchema);
