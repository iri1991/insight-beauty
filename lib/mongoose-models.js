import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    role: {
      type: String,
      enum: ["admin", "salon-manager", "professional", "client"],
      required: true
    },
    salonId: {
      type: String,
      index: true
    },
    email: {
      type: String,
      required: true,
      unique: true
    },
    passwordHash: String,
    passwordSalt: String,
    displayName: String,
    firstName: String,
    lastName: String,
    professionalId: String,
    shareCode: String,
    specialty: String,
    preferredQuestionnaireSlugs: [String],
    appointmentPolicy: String,
    focusAreas: [String],
    activeClients: Number,
    todayFollowUps: Number,
    weeklyCapacity: Number,
    status: {
      type: String,
      default: "active"
    }
  },
  { timestamps: true }
);

const salonSchema = new mongoose.Schema(
  {
    slug: {
      type: String,
      required: true,
      unique: true
    },
    name: {
      type: String,
      required: true
    },
    city: String,
    theme: String,
    confidentialityScope: {
      type: String,
      default: "tenant-isolated"
    },
    adminIds: [String],
    professionalIds: [String]
  },
  { timestamps: true }
);

const questionnaireTemplateSchema = new mongoose.Schema(
  {
    slug: {
      type: String,
      required: true,
      unique: true
    },
    title: {
      type: String,
      required: true
    },
    kind: {
      type: String,
      enum: ["choice-sum", "acne-index", "baumann-dimensions", "custom"],
      default: "choice-sum"
    },
    audience: {
      type: String,
      enum: ["client", "client-assisted", "professional"],
      default: "client"
    },
    deliveryMode: {
      type: String,
      enum: ["public", "public-assisted", "workspace"],
      default: "public"
    },
    status: {
      type: String,
      enum: ["active", "draft", "archived", "mapped-source", "awaiting-question-bank", "source-indexed"],
      default: "draft"
    },
    description: String,
    sourceRefs: [String],
    definition: mongoose.Schema.Types.Mixed
  },
  { timestamps: true }
);

const clientProfileSchema = new mongoose.Schema(
  {
    salonId: {
      type: String,
      required: true,
      index: true
    },
    professionalId: String,
    firstName: String,
    lastName: String,
    email: String,
    phone: String,
    dossierId: {
      type: String,
      required: true,
      unique: true
    },
    baumannType: String,
    riskFlags: [String],
    consentStatus: [String],
    primaryConcerns: [String],
    ageBand: String,
    treatmentPlanSummary: String,
    treatmentProgram: mongoose.Schema.Types.Mixed,
    progressSnapshot: mongoose.Schema.Types.Mixed,
    assessmentHistory: [mongoose.Schema.Types.Mixed],
    questionnaireAssignments: [mongoose.Schema.Types.Mixed],
    sessionHistory: [mongoose.Schema.Types.Mixed],
    timeline: [mongoose.Schema.Types.Mixed],
    firstIntakeAt: String,
    latestAssessment: mongoose.Schema.Types.Mixed,
    nextSession: String,
    baumannProfile: mongoose.Schema.Types.Mixed
  },
  { timestamps: true }
);

const questionnaireResponseSchema = new mongoose.Schema(
  {
    salonId: {
      type: String,
      required: true,
      index: true
    },
    professionalId: String,
    questionnaireSlug: {
      type: String,
      required: true,
      index: true
    },
    dossierId: {
      type: String,
      required: true,
      index: true
    },
    submittedByRole: String,
    client: mongoose.Schema.Types.Mixed,
    answers: mongoose.Schema.Types.Mixed,
    evaluation: mongoose.Schema.Types.Mixed,
    sourceRefs: [String]
  },
  { timestamps: true }
);

const treatmentPlanSchema = new mongoose.Schema(
  {
    salonId: {
      type: String,
      required: true,
      index: true
    },
    dossierId: {
      type: String,
      required: true,
      index: true
    },
    goals: [String],
    protocols: [String],
    sessionCadence: String,
    homecareSummary: String,
    status: {
      type: String,
      default: "draft"
    }
  },
  { timestamps: true }
);

const pushSubscriptionSchema = new mongoose.Schema(
  {
    endpoint: {
      type: String,
      required: true,
      unique: true
    },
    keys: {
      p256dh: String,
      auth: String
    },
    expirationTime: Number,
    role: String,
    salonSlug: String,
    professionalId: String,
    clientEmail: String,
    userAgent: String,
    status: {
      type: String,
      default: "active"
    },
    lastSeenAt: String
  },
  { timestamps: true }
);

const userSessionSchema = new mongoose.Schema(
  {
    tokenHash: {
      type: String,
      required: true,
      unique: true
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      index: true
    },
    role: {
      type: String,
      required: true
    },
    salonId: String,
    professionalId: String,
    expiresAt: {
      type: Date,
      required: true,
      index: true
    }
  },
  { timestamps: true }
);

export function getModels() {
  return {
    User: mongoose.models.User || mongoose.model("User", userSchema),
    Salon: mongoose.models.Salon || mongoose.model("Salon", salonSchema),
    QuestionnaireTemplate:
      mongoose.models.QuestionnaireTemplate ||
      mongoose.model("QuestionnaireTemplate", questionnaireTemplateSchema),
    ClientProfile: mongoose.models.ClientProfile || mongoose.model("ClientProfile", clientProfileSchema),
    QuestionnaireResponse:
      mongoose.models.QuestionnaireResponse ||
      mongoose.model("QuestionnaireResponse", questionnaireResponseSchema),
    TreatmentPlan: mongoose.models.TreatmentPlan || mongoose.model("TreatmentPlan", treatmentPlanSchema),
    PushSubscription:
      mongoose.models.PushSubscription || mongoose.model("PushSubscription", pushSubscriptionSchema),
    UserSession: mongoose.models.UserSession || mongoose.model("UserSession", userSessionSchema)
  };
}
