import { connectMongo } from "./mongodb";
import { getModels } from "./mongoose-models";
import { questionnaireCatalog } from "./questionnaires";
import { isDatabaseConfigured } from "./auth";

function normalize(document) {
  if (!document) {
    return null;
  }

  return {
    ...document,
    _id: String(document._id),
    salonId: document.salonId ? String(document.salonId) : document.salonId,
    professionalId: document.professionalId ? String(document.professionalId) : document.professionalId,
    userId: document.userId ? String(document.userId) : document.userId
  };
}

function normalizeList(documents = []) {
  return documents.map((document) => normalize(document));
}

export function buildPublicIntakeLink({ salonSlug, professionalId, questionnaireSlug, shareCode }) {
  const searchParams = new URLSearchParams({
    salon: salonSlug,
    professional: professionalId,
    questionnaire: questionnaireSlug
  });

  if (shareCode) {
    searchParams.set("share", shareCode);
  }

  return `/client/intake?${searchParams.toString()}`;
}

export async function listSalons() {
  if (!isDatabaseConfigured()) {
    return [];
  }
  await connectMongo();
  const { Salon } = getModels();
  return normalizeList(await Salon.find().sort({ name: 1 }).lean().exec());
}

export async function getSalonBySlug(slug) {
  if (!isDatabaseConfigured()) {
    return null;
  }
  await connectMongo();
  const { Salon } = getModels();
  return normalize(await Salon.findOne({ slug }).lean().exec());
}

export async function getSalonById(salonId) {
  if (!isDatabaseConfigured()) {
    return null;
  }
  await connectMongo();
  const { Salon } = getModels();
  return normalize(await Salon.findById(salonId).lean().exec());
}

export async function getProfessionalById(professionalId) {
  if (!isDatabaseConfigured()) {
    return null;
  }
  await connectMongo();
  const { User } = getModels();
  return normalize(
    await User.findOne({
      _id: professionalId,
      role: "professional"
    })
      .lean()
      .exec()
  );
}

export async function getProfessionalByShareCode(shareCode) {
  if (!isDatabaseConfigured()) {
    return null;
  }
  await connectMongo();
  const { User } = getModels();
  return normalize(
    await User.findOne({
      role: "professional",
      shareCode
    })
      .lean()
      .exec()
  );
}

export async function listProfessionalsForSalon(salonId) {
  if (!isDatabaseConfigured()) {
    return [];
  }
  await connectMongo();
  const { User } = getModels();
  return normalizeList(
    await User.find({
      salonId,
      role: "professional"
    })
      .sort({ displayName: 1, firstName: 1 })
      .lean()
      .exec()
  );
}

export async function listAllProfessionals() {
  if (!isDatabaseConfigured()) {
    return [];
  }

  await connectMongo();
  const { User } = getModels();
  return normalizeList(
    await User.find({
      role: "professional"
    })
      .sort({ displayName: 1, firstName: 1 })
      .lean()
      .exec()
  );
}

export async function listClientsForSalon(salonId) {
  if (!isDatabaseConfigured()) {
    return [];
  }
  await connectMongo();
  const { ClientProfile } = getModels();
  return normalizeList(
    await ClientProfile.find({
      salonId
    })
      .sort({ updatedAt: -1 })
      .lean()
      .exec()
  );
}

export async function listClientsForProfessional(professionalId) {
  if (!isDatabaseConfigured()) {
    return [];
  }
  await connectMongo();
  const { ClientProfile } = getModels();
  return normalizeList(
    await ClientProfile.find({
      professionalId
    })
      .sort({ updatedAt: -1 })
      .lean()
      .exec()
  );
}

export async function getClientById(clientId) {
  if (!isDatabaseConfigured()) {
    return null;
  }
  await connectMongo();
  const { ClientProfile } = getModels();
  return normalize(await ClientProfile.findById(clientId).lean().exec());
}

export async function getClientBySalonAndEmail(salonId, email) {
  if (!isDatabaseConfigured()) {
    return null;
  }
  await connectMongo();
  const { ClientProfile } = getModels();
  return normalize(
    await ClientProfile.findOne({
      salonId,
      email: email.toLowerCase()
    })
      .lean()
      .exec()
  );
}

export async function listRecentResponsesForSalon(salonId) {
  if (!isDatabaseConfigured()) {
    return [];
  }
  await connectMongo();
  const { QuestionnaireResponse } = getModels();
  return normalizeList(
    await QuestionnaireResponse.find({
      salonId
    })
      .sort({ createdAt: -1 })
      .limit(10)
      .lean()
      .exec()
  );
}

export async function listRecentResponsesForProfessional(professionalId) {
  if (!isDatabaseConfigured()) {
    return [];
  }
  await connectMongo();
  const { QuestionnaireResponse } = getModels();
  return normalizeList(
    await QuestionnaireResponse.find({
      professionalId
    })
      .sort({ createdAt: -1 })
      .limit(10)
      .lean()
      .exec()
  );
}

export async function getAdminSnapshot() {
  if (!isDatabaseConfigured()) {
    return {
      salons: 0,
      professionals: 0,
      activeClients: 0,
      activeForms: questionnaireCatalog.filter((item) => item.status === "active").length,
      pendingEncodings: questionnaireCatalog.filter((item) => item.status !== "active").length
    };
  }
  await connectMongo();
  const { Salon, User, ClientProfile } = getModels();
  const [salonsCount, professionalsCount, clientsCount] = await Promise.all([
    Salon.countDocuments(),
    User.countDocuments({ role: "professional" }),
    ClientProfile.countDocuments()
  ]);

  return {
    salons: salonsCount,
    professionals: professionalsCount,
    activeClients: clientsCount,
    activeForms: questionnaireCatalog.filter((item) => item.status === "active").length,
    pendingEncodings: questionnaireCatalog.filter((item) => item.status !== "active").length
  };
}

export async function getQuestionnaireShareBundles(salon, professional) {
  const publicQuestionnaires = questionnaireCatalog.filter(
    (questionnaire) =>
      questionnaire.status === "active" &&
      (questionnaire.deliveryMode === "public" || questionnaire.deliveryMode === "public-assisted")
  );
  const preferred = professional.preferredQuestionnaireSlugs || [];

  return publicQuestionnaires
    .filter((questionnaire) => preferred.includes(questionnaire.slug))
    .map((questionnaire) => ({
      questionnaireSlug: questionnaire.slug,
      title: questionnaire.title,
      description: questionnaire.description,
      intakeLink: buildPublicIntakeLink({
        salonSlug: salon.slug,
        professionalId: professional._id,
        questionnaireSlug: questionnaire.slug,
        shareCode: professional.shareCode
      }),
      shareCode: professional.shareCode
    }));
}

export const getProfessionalShareBundles = getQuestionnaireShareBundles;
export const getRecentResponsesForSalon = listRecentResponsesForSalon;
export const getRecentResponsesForProfessional = listRecentResponsesForProfessional;

export async function updateClientCarePlan(clientId, payload) {
  if (!isDatabaseConfigured()) {
    return null;
  }
  await connectMongo();
  const { ClientProfile } = getModels();

  await ClientProfile.updateOne(
    { _id: clientId },
    {
      $set: payload
    }
  );

  return getClientById(clientId);
}

export async function appendClientSession(clientId, sessionEntry, nextSession) {
  if (!isDatabaseConfigured()) {
    return null;
  }
  await connectMongo();
  const { ClientProfile } = getModels();
  const currentClient = await ClientProfile.findById(clientId).lean().exec();
  const sessionHistory = [...(currentClient?.sessionHistory || []), sessionEntry];
  const timeline = [
    ...(currentClient?.timeline || []),
    {
      date: sessionEntry.date,
      event: `${sessionEntry.service} · ${sessionEntry.status}`
    }
  ];

  await ClientProfile.updateOne(
    { _id: clientId },
    {
      $set: {
        sessionHistory,
        timeline,
        nextSession: nextSession || currentClient?.nextSession || null
      }
    }
  );

  return getClientById(clientId);
}
