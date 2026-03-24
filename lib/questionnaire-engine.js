import { randomUUID } from "node:crypto";
import { getEvaluableDefinition, listPublicEvaluableDefinitions } from "./questionnaire-db.js";
import { questionnaireCatalog, questionnaireDefinitions } from "./questionnaires.js";
import { getTipologyByCode } from "./source-library.js";

function findBand(bands, score) {
  return bands.find((band) => score >= band.min && score <= band.max) || null;
}

function evaluateChoiceQuestionnaire(definition, answers = {}) {
  const details = definition.questions.map((question) => {
    const selectedValue = answers[question.id];
    const selectedOption = question.options.find((option) => option.value === selectedValue);

    if (!selectedOption) {
      return {
        questionId: question.id,
        missing: true
      };
    }

    return {
      questionId: question.id,
      label: question.label,
      selectedValue,
      selectedLabel: selectedOption.label,
      points: selectedOption.points,
      missing: false
    };
  });

  const missingQuestionIds = details.filter((detail) => detail.missing).map((detail) => detail.questionId);

  if (missingQuestionIds.length > 0) {
    return {
      ok: false,
      missingQuestionIds
    };
  }

  const score = details.reduce((sum, detail) => sum + detail.points, 0);
  const band = findBand(definition.bands, score);

  return {
    ok: true,
    score,
    band,
    details
  };
}

function evaluateAcneQuestionnaire(definition, answers = {}) {
  const baseEvaluation = evaluateChoiceQuestionnaire(definition, answers);

  if (!baseEvaluation.ok) {
    return baseEvaluation;
  }

  const cystSelection = baseEvaluation.details.find((detail) => detail.questionId === "cysts");
  const baseBand = findBand(definition.bands, baseEvaluation.score);
  const severeBand = definition.bands[definition.bands.length - 1];
  const band = cystSelection?.selectedValue && cystSelection.selectedValue !== "none" ? severeBand : baseBand;

  return {
    ...baseEvaluation,
    band,
    flags: cystSelection?.selectedValue && cystSelection.selectedValue !== "none" ? ["cysts-present"] : []
  };
}

function evaluateBaumannQuestionnaire(definition, answers = {}) {
  const dimensions = Object.values(definition.dimensions).map((dimension) => {
    const rawValue = Number(answers[dimension.id]);
    const band = findBand(dimension.bands, rawValue);

    if (Number.isNaN(rawValue) || !band) {
      return {
        id: dimension.id,
        missing: true
      };
    }

    return {
      id: dimension.id,
      label: dimension.label,
      score: rawValue,
      code: band.code,
      band
    };
  });

  const missingDimensionIds = dimensions.filter((dimension) => dimension.missing).map((dimension) => dimension.id);

  if (missingDimensionIds.length > 0) {
    return {
      ok: false,
      missingQuestionIds: missingDimensionIds
    };
  }

  const code = dimensions.map((dimension) => dimension.code).join("");
  const tipologyDocument = getTipologyByCode(code);

  return {
    ok: true,
    code,
    dimensions,
    band: {
      label: `Tipologie Baumann ${code}`,
      summary: tipologyDocument
        ? tipologyDocument.preview
        : "Tipologie compusa din cele patru dimensiuni scorate."
    },
    tipologyDocument
  };
}

export function getQuestionnaireBySlug(slug) {
  return questionnaireDefinitions[slug] || null;
}

export async function getQuestionnaireBySlugAsync(slug) {
  return getEvaluableDefinition(slug);
}

export function listQuestionnaireCatalog() {
  return questionnaireCatalog;
}

export function listPublicQuestionnaires() {
  return questionnaireCatalog
    .filter((questionnaire) => questionnaire.status === "active")
    .filter((questionnaire) => questionnaire.deliveryMode === "public" || questionnaire.deliveryMode === "public-assisted")
    .map((questionnaire) => questionnaireDefinitions[questionnaire.slug]);
}

export async function listPublicQuestionnairesAsync() {
  return listPublicEvaluableDefinitions();
}

export function evaluateDefinition(definition, payload = {}) {
  if (!definition) {
    return { ok: false, error: "unknown-questionnaire" };
  }

  if (definition.kind === "choice-sum") {
    return evaluateChoiceQuestionnaire(definition, payload.answers);
  }

  if (definition.kind === "acne-index") {
    return evaluateAcneQuestionnaire(definition, payload.answers);
  }

  if (definition.kind === "baumann-dimensions") {
    return evaluateBaumannQuestionnaire(definition, payload.answers);
  }

  return { ok: false, error: "unsupported-questionnaire" };
}

export function evaluateQuestionnaire(slug, payload = {}) {
  const definition = getQuestionnaireBySlug(slug);
  return evaluateDefinition(definition, payload);
}

export async function evaluateQuestionnaireAsync(slug, payload = {}) {
  const definition = await getQuestionnaireBySlugAsync(slug);
  return evaluateDefinition(definition, payload);
}

function formatClientName(client) {
  return [client.firstName, client.lastName].filter(Boolean).join(" ").trim() || "Client nou";
}

function formatProfessionalName(professional) {
  return (
    professional?.displayName ||
    professional?.name ||
    [professional?.firstName, professional?.lastName].filter(Boolean).join(" ").trim() ||
    "Specialist"
  );
}

export function buildAppointmentProposal({ salonName, professionalName, questionnaireTitle, resultLabel }) {
  return {
    title: "Propunere de debriefing",
    slotWindow: "in 48-72h",
    location: salonName,
    professional: professionalName,
    note: `Recomandam o discutie de 20-30 de minute pentru ${questionnaireTitle.toLowerCase()} si contextualizarea rezultatului ${resultLabel}.`
  };
}

export function createClientDossierPreview({ client = {}, salon, professional, questionnaire, evaluation }) {
  const createdAt = new Date().toISOString();
  const initials = `${(client.firstName || "N")[0]}${(client.lastName || "N")[0]}`.toUpperCase();
  const dossierId = `DOS-${initials}-${createdAt.slice(0, 10).replaceAll("-", "")}-${randomUUID().slice(0, 6).toUpperCase()}`;

  return {
    dossierId,
    createdAt,
    clientName: formatClientName(client),
    salonVisibility: salon?.name || "Salon neselectat",
    professionalOwner: formatProfessionalName(professional),
    confidentiality: "Vizibil doar in tenantul salonului; administrarea cross-salon este permisa exclusiv adminilor prin impersonare.",
    currentSnapshot: {
      questionnaire: questionnaire.title,
      result: evaluation.band?.label || "Fara rezultat",
      score: evaluation.score ?? null,
      baumannType: evaluation.code || null
    },
    nextStep: buildAppointmentProposal({
      salonName: salon?.name || "Salon",
      professionalName: formatProfessionalName(professional),
      questionnaireTitle: questionnaire.title,
      resultLabel: evaluation.band?.label || "rezultat disponibil"
    })
  };
}

export function buildEmailPreview({ client, salon, professional, questionnaire, evaluation, dossier }) {
  return {
    to: client.email || "client@example.com",
    subject: `Confirmare ${questionnaire.title} - ${salon?.name || "BeautyApp"}`,
    body: [
      `Buna, ${client.firstName || "draga clienta"},`,
      `Am inregistrat completarea pentru ${questionnaire.title}.`,
      `Rezultatul curent: ${evaluation.band?.label || "in curs de evaluare"}.`,
      evaluation.band?.summary || "",
      `Fisa ta personala a fost deschisa cu codul ${dossier.dossierId}.`,
      `Propunerea noastra de programare: ${dossier.nextStep.note}`,
      `Coordonator recomandat: ${formatProfessionalName(professional) || "echipa salonului"}.`
    ].filter(Boolean)
  };
}
