import { NextResponse } from "next/server";
import { isDatabaseConfigured } from "../../../../../lib/auth";
import { sendIntakeConfirmation } from "../../../../../lib/email";
import { connectMongo } from "../../../../../lib/mongodb";
import { getModels } from "../../../../../lib/mongoose-models";
import {
  buildEmailPreview,
  createClientDossierPreview,
  evaluateQuestionnaire,
  getQuestionnaireBySlug
} from "../../../../../lib/questionnaire-engine";
import { getProfessionalById, getSalonBySlug } from "../../../../../lib/repositories";

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
  if (!evaluation.code) {
    return currentProfile || null;
  }

  const dimensions = Array.isArray(evaluation.dimensions)
    ? Object.fromEntries(evaluation.dimensions.map((dimension) => [dimension.id, dimension.score]))
    : currentProfile?.dimensions || {};

  return {
    code: evaluation.code,
    dimensions,
    summary: evaluation.band?.summary || currentProfile?.summary || "Tipologie calculata automat."
  };
}

export async function POST(request, { params }) {
  if (!isDatabaseConfigured()) {
    return NextResponse.json(
      { error: "MongoDB nu este configurat. Configureaza baza de date pentru intake si persistenta reala." },
      { status: 503 }
    );
  }

  const questionnaire = getQuestionnaireBySlug(params.slug);

  if (!questionnaire) {
    return NextResponse.json({ error: "Questionnaire not found." }, { status: 404 });
  }

  const payload = await request.json();
  const clientPayload = payload.client || {};
  const evaluation = evaluateQuestionnaire(params.slug, payload);

  if (!evaluation.ok) {
    return NextResponse.json(
      {
        error: "Questionnaire is incomplete.",
        missingQuestionIds: evaluation.missingQuestionIds || []
      },
      { status: 422 }
    );
  }

  if (!clientPayload.firstName || !clientPayload.lastName || !clientPayload.email || !clientPayload.phone) {
    return NextResponse.json(
      { error: "Completeaza prenumele, numele, emailul si telefonul pentru a deschide fisa clientului." },
      { status: 422 }
    );
  }

  const salon = await getSalonBySlug(clientPayload.salonSlug);
  const professional = await getProfessionalById(clientPayload.professionalId);

  if (!salon || !professional || professional.salonId !== salon._id) {
    return NextResponse.json(
      { error: "Contextul salon/profesionist nu este valid. Regeneraza linkul sau selecteaza un profesionist valid." },
      { status: 422 }
    );
  }

  await connectMongo();
  const { ClientProfile, QuestionnaireResponse } = getModels();
  const normalizedEmail = clientPayload.email.trim().toLowerCase();
  const existingClient = await ClientProfile.findOne({
    salonId: salon._id,
    email: normalizedEmail
  })
    .lean()
    .exec();

  const dossierPreview = createClientDossierPreview({
    client: clientPayload,
    salon,
    professional,
    questionnaire,
    evaluation
  });
  const dossier = existingClient
    ? {
        ...dossierPreview,
        dossierId: existingClient.dossierId,
        createdAt: existingClient.firstIntakeAt || dossierPreview.createdAt
      }
    : dossierPreview;
  const emailPreview = buildEmailPreview({
    client: {
      ...clientPayload,
      email: normalizedEmail
    },
    salon,
    professional,
    questionnaire,
    evaluation,
    dossier
  });
  const submittedAt = new Date().toISOString();
  const assessmentEntry = buildAssessmentEntry(questionnaire, evaluation, submittedAt);
  const questionnaireAssignment = {
    questionnaireSlug: questionnaire.slug,
    sharedAt: submittedAt,
    channel: clientPayload.shareCode ? "share-link" : "public-intake",
    status: "completed"
  };
  const timelineEntry = {
    date: submittedAt.slice(0, 10),
    event: `${questionnaire.title} completat si interpretat automat`
  };

  const savedClient = await ClientProfile.findOneAndUpdate(
    { dossierId: dossier.dossierId },
    {
      $set: {
        salonId: salon._id,
        professionalId: professional._id,
        firstName: clientPayload.firstName.trim(),
        lastName: clientPayload.lastName.trim(),
        email: normalizedEmail,
        phone: clientPayload.phone.trim(),
        dossierId: dossier.dossierId,
        baumannType: evaluation.code || existingClient?.baumannType || null,
        baumannProfile: buildBaumannProfile(evaluation, existingClient?.baumannProfile),
        consentStatus:
          existingClient?.consentStatus?.length > 0 ? existingClient.consentStatus : ["intake-submitted", "debriefing-pending"],
        primaryConcerns: existingClient?.primaryConcerns || [],
        ageBand: existingClient?.ageBand || "Nespecificat",
        riskFlags: Array.from(new Set([...(existingClient?.riskFlags || []), ...(evaluation.flags || [])])),
        treatmentPlanSummary:
          existingClient?.treatmentPlanSummary || "Triage automat finalizat. Debriefing necesar pentru planul personalizat.",
        treatmentProgram: existingClient?.treatmentProgram || {
          status: "pending-debrief",
          cadence: "de stabilit dupa consult",
          goals: [],
          inCabinProtocols: [],
          homecare: [],
          reviewCadence: "de stabilit dupa prima consultatie"
        },
        progressSnapshot: existingClient?.progressSnapshot || {
          trend: "baseline",
          focus: questionnaire.title,
          baseline: evaluation.band?.summary || "Intake initial inregistrat.",
          current: evaluation.band?.summary || "Rezultat initial disponibil."
        },
        assessmentHistory: [...(existingClient?.assessmentHistory || []), assessmentEntry],
        questionnaireAssignments: [...(existingClient?.questionnaireAssignments || []), questionnaireAssignment],
        sessionHistory: existingClient?.sessionHistory || [],
        timeline: [...(existingClient?.timeline || []), timelineEntry],
        firstIntakeAt: existingClient?.firstIntakeAt || dossier.createdAt,
        latestAssessment: assessmentEntry,
        nextSession: existingClient?.nextSession || null
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

  await QuestionnaireResponse.create({
    salonId: salon._id,
    professionalId: professional._id,
    questionnaireSlug: questionnaire.slug,
    dossierId: dossier.dossierId,
    submittedByRole: "client",
    client: {
      ...clientPayload,
      email: normalizedEmail
    },
    answers: payload.answers || {},
    evaluation,
    sourceRefs: questionnaire.sourceRefs
  });

  const finalDossier = { ...dossier, dossierId: savedClient.dossierId };

  const emailResult = await sendIntakeConfirmation({
    client: { ...clientPayload, email: normalizedEmail },
    salon,
    professional,
    questionnaire,
    evaluation,
    dossier: finalDossier
  });

  return NextResponse.json({
    questionnaire: {
      slug: questionnaire.slug,
      title: questionnaire.title
    },
    evaluation,
    dossier: finalDossier,
    emailPreview,
    emailSent: emailResult.sent,
    persistence: {
      mode: "mongo",
      saved: true
    }
  });
}
