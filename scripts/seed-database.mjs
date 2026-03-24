import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { connectMongo } from "../lib/mongodb.js";
import { getModels } from "../lib/mongoose-models.js";
import { professionals as seedProfessionals, salons as seedSalons, clientDossiers, recentResponses } from "../lib/mock-data.js";
import { questionnaireCatalog, questionnaireDefinitions } from "../lib/questionnaires.js";
import { createPasswordRecord } from "../lib/security.js";

const DEFAULT_PASSWORDS = {
  admin: "InsightAdmin123",
  manager: "InsightManager123",
  professional: "InsightPro123"
};

function loadEnvFile(filePath) {
  if (!fs.existsSync(filePath)) {
    return;
  }

  const content = fs.readFileSync(filePath, "utf8");

  for (const rawLine of content.split("\n")) {
    const line = rawLine.trim();

    if (!line || line.startsWith("#")) {
      continue;
    }

    const separatorIndex = line.indexOf("=");

    if (separatorIndex === -1) {
      continue;
    }

    const key = line.slice(0, separatorIndex).trim();
    const value = line.slice(separatorIndex + 1).trim().replace(/^['"]|['"]$/g, "");

    if (!process.env[key]) {
      process.env[key] = value;
    }
  }
}

function slugify(value) {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function buildLocalEmail(seed, suffix = "") {
  const stem = slugify(seed).replace(/-/g, ".");
  return `${stem}${suffix}@insightbeauty.local`;
}

function getFirstIntakeAt(client) {
  return (
    client.firstIntakeAt ||
    client.assessmentHistory?.[0]?.submittedAt ||
    (client.timeline?.[0]?.date ? `${client.timeline[0].date}T09:00:00.000Z` : new Date().toISOString())
  );
}

async function upsertUser(User, filter, payload) {
  const user = await User.findOneAndUpdate(
    filter,
    {
      $set: payload
    },
    {
      upsert: true,
      new: true,
      setDefaultsOnInsert: true
    }
  ).exec();

  return user;
}

const currentDir = path.dirname(fileURLToPath(import.meta.url));
loadEnvFile(path.resolve(currentDir, "../.env.local"));
loadEnvFile(path.resolve(currentDir, "../.env"));

if (!process.env.MONGODB_URI) {
  console.error("Missing MONGODB_URI. Configureaza .env sau .env.local inainte de seed.");
  process.exit(1);
}

const shouldReset = process.argv.includes("--reset");

await connectMongo();

const { ClientProfile, PushSubscription, QuestionnaireResponse, QuestionnaireTemplate, Salon, TreatmentPlan, User, UserSession } =
  getModels();

if (shouldReset) {
  await Promise.all([
    UserSession.deleteMany({}),
    PushSubscription.deleteMany({}),
    QuestionnaireResponse.deleteMany({}),
    TreatmentPlan.deleteMany({}),
    ClientProfile.deleteMany({}),
    QuestionnaireTemplate.deleteMany({}),
    User.deleteMany({}),
    Salon.deleteMany({})
  ]);
}

const salonIdMap = new Map();
const professionalIdMap = new Map();
const clientMap = new Map();

const adminUser = await upsertUser(User, { email: "admin@insightbeauty.local" }, {
  role: "admin",
  email: "admin@insightbeauty.local",
  displayName: "Insight Beauty Admin",
  firstName: "Insight",
  lastName: "Admin",
  status: "active",
  ...createPasswordRecord(DEFAULT_PASSWORDS.admin)
});

for (const salon of seedSalons) {
  const salonDocument = await Salon.findOneAndUpdate(
    { slug: salon.slug },
    {
      $set: {
        slug: salon.slug,
        name: salon.name,
        city: salon.city,
        theme: salon.theme,
        confidentialityScope: salon.confidentialityScope
      }
    },
    {
      upsert: true,
      new: true,
      setDefaultsOnInsert: true
    }
  )
    .lean()
    .exec();

  salonIdMap.set(salon.id, String(salonDocument._id));
}

const managerIdsBySalon = new Map();

for (const salon of seedSalons) {
  const managerEmail = buildLocalEmail(`manager ${salon.city}`);
  const manager = await upsertUser(User, { email: managerEmail }, {
    role: "salon-manager",
    salonId: salonIdMap.get(salon.id),
    email: managerEmail,
    displayName: `Manager ${salon.name}`,
    firstName: "Manager",
    lastName: salon.city,
    status: "active",
    ...createPasswordRecord(DEFAULT_PASSWORDS.manager)
  });

  managerIdsBySalon.set(salon.id, String(manager._id));
}

for (const professional of seedProfessionals) {
  const [firstName, ...lastNameParts] = professional.name.split(" ");
  const professionalUser = await upsertUser(User, { email: buildLocalEmail(professional.name) }, {
    role: "professional",
    salonId: salonIdMap.get(professional.salonId),
    email: buildLocalEmail(professional.name),
    displayName: professional.name,
    firstName,
    lastName: lastNameParts.join(" "),
    professionalId: professional.professionalId || "",
    shareCode: professional.shareCode,
    specialty: professional.specialty,
    preferredQuestionnaireSlugs: professional.preferredQuestionnaireSlugs || [],
    appointmentPolicy: professional.appointmentPolicy,
    focusAreas: professional.focusAreas || [],
    activeClients: professional.activeClients || 0,
    todayFollowUps: professional.todayFollowUps || 0,
    weeklyCapacity: professional.weeklyCapacity || 0,
    status: "active",
    ...createPasswordRecord(DEFAULT_PASSWORDS.professional)
  });

  if (professionalUser.professionalId !== String(professionalUser._id)) {
    professionalUser.professionalId = String(professionalUser._id);
    await professionalUser.save();
  }

  professionalIdMap.set(professional.id, String(professionalUser._id));
}

for (const salon of seedSalons) {
  const mappedProfessionals = seedProfessionals
    .filter((professional) => professional.salonId === salon.id)
    .map((professional) => professionalIdMap.get(professional.id));

  await Salon.updateOne(
    { _id: salonIdMap.get(salon.id) },
    {
      $set: {
        adminIds: [String(adminUser._id), managerIdsBySalon.get(salon.id)].filter(Boolean),
        professionalIds: mappedProfessionals
      }
    }
  );
}

for (const questionnaire of questionnaireCatalog) {
  await QuestionnaireTemplate.findOneAndUpdate(
    { slug: questionnaire.slug },
    {
      $set: {
        slug: questionnaire.slug,
        title: questionnaire.title,
        audience: questionnaire.audience,
        status: questionnaire.status,
        sourceRefs: questionnaire.sourceRefs || [],
        definition: questionnaireDefinitions[questionnaire.slug] || null
      }
    },
    {
      upsert: true,
      new: true,
      setDefaultsOnInsert: true
    }
  ).exec();
}

for (const client of clientDossiers) {
  const clientDocument = await ClientProfile.findOneAndUpdate(
    { dossierId: client.dossierId },
    {
      $set: {
        salonId: salonIdMap.get(client.salonId),
        professionalId: professionalIdMap.get(client.professionalId),
        firstName: client.firstName,
        lastName: client.lastName,
        email: client.email.toLowerCase(),
        phone: client.phone,
        dossierId: client.dossierId,
        baumannType: client.baumannType,
        baumannProfile: client.baumannProfile,
        consentStatus: client.consentStatus || [],
        primaryConcerns: client.primaryConcerns || [],
        ageBand: client.ageBand || "Nespecificat",
        riskFlags: client.riskFlags || [],
        treatmentPlanSummary: client.treatmentPlan || client.treatmentPlanSummary || "",
        treatmentProgram: client.treatmentProgram || {},
        progressSnapshot: client.progressSnapshot || {},
        assessmentHistory: client.assessmentHistory || [],
        questionnaireAssignments: client.questionnaireAssignments || [],
        sessionHistory: client.sessionHistory || [],
        timeline: client.timeline || [],
        firstIntakeAt: getFirstIntakeAt(client),
        latestAssessment: client.lastAssessment || client.latestAssessment || null,
        nextSession: client.nextSession || null
      }
    },
    {
      upsert: true,
      new: true,
      setDefaultsOnInsert: true
    }
  )
    .lean()
    .exec();

  clientMap.set(client.id, {
    _id: String(clientDocument._id),
    dossierId: clientDocument.dossierId,
    email: clientDocument.email
  });
}

for (const response of recentResponses) {
  const clientSeed = clientDossiers.find((client) => client.id === response.clientId);
  const clientRecord = clientMap.get(response.clientId);
  const assessment =
    clientSeed?.assessmentHistory?.find(
      (entry) => entry.questionnaireSlug === response.questionnaireSlug && entry.submittedAt === response.submittedAt
    ) ||
    clientSeed?.assessmentHistory?.find((entry) => entry.questionnaireSlug === response.questionnaireSlug) ||
    clientSeed?.lastAssessment;
  const questionnaire = questionnaireDefinitions[response.questionnaireSlug];

  if (!clientSeed || !clientRecord || !questionnaire) {
    continue;
  }

  await QuestionnaireResponse.findOneAndUpdate(
    {
      dossierId: clientRecord.dossierId,
      questionnaireSlug: response.questionnaireSlug,
      "client.email": clientSeed.email.toLowerCase()
    },
    {
      $set: {
        salonId: salonIdMap.get(response.salonId),
        professionalId: professionalIdMap.get(response.professionalId),
        questionnaireSlug: response.questionnaireSlug,
        dossierId: clientRecord.dossierId,
        submittedByRole: "client",
        client: {
          firstName: clientSeed.firstName,
          lastName: clientSeed.lastName,
          email: clientSeed.email.toLowerCase(),
          phone: clientSeed.phone
        },
        answers: {},
        evaluation: {
          ok: true,
          score: typeof assessment?.score === "number" ? assessment.score : null,
          band: {
            label: assessment?.label || response.resultLabel,
            summary: assessment?.insight || "Raspuns importat in seed-ul initial."
          },
          code: clientSeed.baumannType || null
        },
        sourceRefs: questionnaire.sourceRefs || []
      },
      $setOnInsert: {
        createdAt: new Date(response.submittedAt)
      }
    },
    {
      upsert: true,
      new: true,
      setDefaultsOnInsert: true
    }
  ).exec();
}

console.log("Database seed completed.");
console.log(`Salons: ${seedSalons.length}`);
console.log(`Professionals: ${seedProfessionals.length}`);
console.log(`Client dossiers: ${clientDossiers.length}`);
console.log(`Questionnaire templates: ${questionnaireCatalog.length}`);
console.log("Credentials:");
console.log(`- admin@insightbeauty.local / ${DEFAULT_PASSWORDS.admin}`);
console.log(`- manager.bucuresti@insightbeauty.local / ${DEFAULT_PASSWORDS.manager}`);
console.log(`- manager.cluj.napoca@insightbeauty.local / ${DEFAULT_PASSWORDS.manager}`);
console.log(`- elena.stoica@insightbeauty.local / ${DEFAULT_PASSWORDS.professional}`);
console.log(`- mara.ionescu@insightbeauty.local / ${DEFAULT_PASSWORDS.professional}`);
console.log(`- andreea.voda@insightbeauty.local / ${DEFAULT_PASSWORDS.professional}`);
