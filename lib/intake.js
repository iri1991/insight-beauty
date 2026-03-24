import { randomBytes } from "node:crypto";
import { sendIntakeConfirmation } from "./email.js";
import { connectMongo } from "./mongodb.js";
import { getModels } from "./mongoose-models.js";
import { buildEmailPreview, createClientDossierPreview, evaluateDefinition } from "./questionnaire-engine.js";
import { createPasswordRecord } from "./security.js";

function buildAssessmentEntry(questionnaire, evaluation, submittedAt) {
  return {
    questionnaireSlug: questionnaire.slug,
    label: evaluation.band?.label || questionnaire.title,
    score: typeof evaluation.score === "number" ? evaluation.score : null,
    submittedAt,
    insight: evaluation.band?.summary || "Evaluare procesata automat pe server."
  };
}

function buildBaumannProfile(evaluation, currentProfile) {
  if (!evaluation.code) return currentProfile || null;
  const dimensions = Array.isArray(evaluation.dimensions)
    ? Object.fromEntries(evaluation.dimensions.map((d) => [d.id, d.score]))
    : currentProfile?.dimensions || {};
  return {
    code: evaluation.code,
    dimensions,
    summary: evaluation.band?.summary || currentProfile?.summary || "Tipologie calculata automat."
  };
}

function generateShareCode(length = 6) {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  return Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
}

export async function ensureClientUserAccount(email, firstName, lastName) {
  await connectMongo();
  const { User } = getModels();
  const existing = await User.findOne({ email }).lean().exec();
  if (existing) return { user: existing, isNew: false };

  const tempPassword = generateShareCode(10);
  const { passwordHash, passwordSalt } = createPasswordRecord(tempPassword);
  const user = await User.create({
    role: "client",
    email,
    firstName,
    lastName,
    displayName: [firstName, lastName].filter(Boolean).join(" "),
    passwordHash,
    passwordSalt,
    status: "active"
  });
  return { user: user.toObject(), isNew: true, tempPassword };
}

export async function persistIntakeResult({
  questionnaire,
  answers,
  client: clientPayload,
  salon,
  professional,
  submittedByRole = "professional",
  channel = "professional-intake"
}) {
  const evaluation = evaluateDefinition(questionnaire, { answers });
  if (!evaluation.ok) {
    return { ok: false, missingQuestionIds: evaluation.missingQuestionIds || [] };
  }

  await connectMongo();
  const { ClientProfile, QuestionnaireResponse } = getModels();
  const normalizedEmail = clientPayload.email.trim().toLowerCase();

  const existingClient = await ClientProfile.findOne({ salonId: salon._id, email: normalizedEmail }).lean().exec();

  const dossierPreview = createClientDossierPreview({ client: clientPayload, salon, professional, questionnaire, evaluation });
  const dossier = existingClient
    ? { ...dossierPreview, dossierId: existingClient.dossierId, createdAt: existingClient.firstIntakeAt || dossierPreview.createdAt }
    : dossierPreview;

  const submittedAt = new Date().toISOString();
  const assessmentEntry = buildAssessmentEntry(questionnaire, evaluation, submittedAt);

  const existingAssignments = existingClient?.questionnaireAssignments || [];
  const updatedAssignments = existingAssignments.map((a) =>
    a.questionnaireSlug === questionnaire.slug && a.status === "pending"
      ? { ...a, status: "completed", completedAt: submittedAt }
      : a
  );
  if (!updatedAssignments.find((a) => a.questionnaireSlug === questionnaire.slug && a.status === "completed")) {
    updatedAssignments.push({ questionnaireSlug: questionnaire.slug, sharedAt: submittedAt, channel, status: "completed" });
  }

  const timelineEntry = {
    date: submittedAt.slice(0, 10),
    event: `${questionnaire.title} completat${submittedByRole === "professional" ? " de profesionist" : ""}`
  };

  const savedClient = await ClientProfile.findOneAndUpdate(
    { dossierId: dossier.dossierId },
    {
      $set: {
        salonId: salon._id,
        professionalId: String(professional._id),
        firstName: clientPayload.firstName.trim(),
        lastName: clientPayload.lastName.trim(),
        email: normalizedEmail,
        phone: (clientPayload.phone || "").trim(),
        dossierId: dossier.dossierId,
        baumannType: evaluation.code || existingClient?.baumannType || null,
        baumannProfile: buildBaumannProfile(evaluation, existingClient?.baumannProfile),
        consentStatus: existingClient?.consentStatus?.length > 0 ? existingClient.consentStatus : ["intake-submitted", "debriefing-pending"],
        primaryConcerns: existingClient?.primaryConcerns || [],
        ageBand: existingClient?.ageBand || "Nespecificat",
        riskFlags: Array.from(new Set([...(existingClient?.riskFlags || []), ...(evaluation.flags || [])])),
        treatmentPlanSummary: existingClient?.treatmentPlanSummary || "Triage automat finalizat. Debriefing necesar pentru planul personalizat.",
        treatmentProgram: existingClient?.treatmentProgram || {
          status: "pending-debrief", cadence: "de stabilit dupa consult",
          goals: [], inCabinProtocols: [], homecare: [], reviewCadence: "de stabilit dupa prima consultatie"
        },
        progressSnapshot: {
          trend: existingClient?.progressSnapshot ? computeTrend(existingClient.progressSnapshot, evaluation) : "baseline",
          focus: questionnaire.title,
          baseline: existingClient?.progressSnapshot?.baseline || evaluation.band?.summary || "Intake initial.",
          current: evaluation.band?.summary || "Rezultat disponibil.",
          previousScore: existingClient?.latestAssessment?.score ?? null,
          currentScore: assessmentEntry.score
        },
        assessmentHistory: [...(existingClient?.assessmentHistory || []), assessmentEntry],
        questionnaireAssignments: updatedAssignments,
        sessionHistory: existingClient?.sessionHistory || [],
        timeline: [...(existingClient?.timeline || []), timelineEntry],
        firstIntakeAt: existingClient?.firstIntakeAt || dossier.createdAt,
        latestAssessment: assessmentEntry,
        nextSession: existingClient?.nextSession || null
      }
    },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  ).lean().exec();

  await QuestionnaireResponse.create({
    salonId: salon._id,
    professionalId: String(professional._id),
    questionnaireSlug: questionnaire.slug,
    dossierId: dossier.dossierId,
    submittedByRole,
    client: { ...clientPayload, email: normalizedEmail },
    answers,
    evaluation,
    sourceRefs: questionnaire.sourceRefs || []
  });

  const finalDossier = { ...dossier, dossierId: savedClient.dossierId };

  const emailResult = await sendIntakeConfirmation({
    client: { ...clientPayload, email: normalizedEmail },
    salon, professional, questionnaire, evaluation, dossier: finalDossier
  });

  const emailPreview = buildEmailPreview({
    client: { ...clientPayload, email: normalizedEmail },
    salon, professional, questionnaire, evaluation, dossier: finalDossier
  });

  return {
    ok: true,
    questionnaire: { slug: questionnaire.slug, title: questionnaire.title },
    evaluation,
    dossier: finalDossier,
    client: savedClient,
    emailPreview,
    emailSent: emailResult.sent
  };
}

function computeTrend(previousSnapshot, evaluation) {
  const prevScore = previousSnapshot?.currentScore;
  const currScore = typeof evaluation.score === "number" ? evaluation.score : null;
  if (prevScore === null || currScore === null) return "baseline";
  if (currScore < prevScore) return "improving";
  if (currScore > prevScore) return "worsening";
  return "stable";
}

export async function assignQuestionnaireToClient(clientId, questionnaireSlug, professionalId) {
  await connectMongo();
  const { ClientProfile } = getModels();
  const client = await ClientProfile.findById(clientId).lean().exec();
  if (!client) throw new Error("Client negăsit.");

  const existing = (client.questionnaireAssignments || []).find(
    (a) => a.questionnaireSlug === questionnaireSlug && a.status === "pending"
  );
  if (existing) return client;

  const assignment = {
    questionnaireSlug,
    sharedAt: new Date().toISOString(),
    channel: "professional-assign",
    status: "pending",
    assignedByProfessionalId: String(professionalId)
  };

  await ClientProfile.updateOne(
    { _id: clientId },
    { $push: { questionnaireAssignments: assignment } }
  );

  return ClientProfile.findById(clientId).lean().exec();
}
