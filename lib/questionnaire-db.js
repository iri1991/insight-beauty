import { isDatabaseConfigured } from "./auth.js";
import { connectMongo } from "./mongodb.js";
import { getModels } from "./mongoose-models.js";
import { questionnaireCatalog, questionnaireDefinitions } from "./questionnaires.js";

function normalizeTemplate(doc) {
  if (!doc) return null;
  const obj = doc.toObject ? doc.toObject() : { ...doc };
  return {
    ...obj,
    _id: String(obj._id),
    source: "db"
  };
}

function staticTemplateToDb(catalogEntry) {
  const definition = questionnaireDefinitions[catalogEntry.slug] || null;
  return {
    slug: catalogEntry.slug,
    title: catalogEntry.title,
    kind: definition?.kind || "choice-sum",
    audience: catalogEntry.audience || "client",
    deliveryMode: catalogEntry.deliveryMode || "public",
    status: catalogEntry.status || "active",
    description: catalogEntry.description || "",
    sourceRefs: catalogEntry.sourceRefs || [],
    definition: definition
      ? {
          questions: definition.questions || [],
          bands: definition.bands || [],
          dimensions: definition.dimensions || null
        }
      : null,
    source: "static"
  };
}

export async function listQuestionnairesForAdmin() {
  const staticTemplates = questionnaireCatalog.map(staticTemplateToDb);

  if (!isDatabaseConfigured()) {
    return staticTemplates;
  }

  await connectMongo();
  const { QuestionnaireTemplate } = getModels();
  const dbTemplates = await QuestionnaireTemplate.find().sort({ createdAt: 1 }).lean().exec();
  const dbSlugs = new Set(dbTemplates.map((t) => t.slug));

  const merged = [
    ...dbTemplates.map((t) => ({ ...t, _id: String(t._id), source: "db" })),
    ...staticTemplates.filter((t) => !dbSlugs.has(t.slug))
  ];

  merged.sort((a, b) => a.title.localeCompare(b.title));
  return merged;
}

export async function getQuestionnaireTemplateBySlug(slug) {
  if (!isDatabaseConfigured()) {
    const entry = questionnaireCatalog.find((c) => c.slug === slug);
    return entry ? staticTemplateToDb(entry) : null;
  }

  await connectMongo();
  const { QuestionnaireTemplate } = getModels();
  const dbTemplate = await QuestionnaireTemplate.findOne({ slug }).lean().exec();

  if (dbTemplate) {
    return { ...dbTemplate, _id: String(dbTemplate._id), source: "db" };
  }

  const entry = questionnaireCatalog.find((c) => c.slug === slug);
  return entry ? staticTemplateToDb(entry) : null;
}

export async function saveQuestionnaireTemplate(data) {
  if (!isDatabaseConfigured()) throw new Error("Database neconfigurat.");

  await connectMongo();
  const { QuestionnaireTemplate } = getModels();

  const { slug, title, kind, audience, deliveryMode, status, description, sourceRefs, definition } = data;

  const doc = await QuestionnaireTemplate.findOneAndUpdate(
    { slug },
    {
      $set: {
        slug,
        title,
        kind: kind || "choice-sum",
        audience: audience || "client",
        deliveryMode: deliveryMode || "public",
        status: status || "draft",
        description: description || "",
        sourceRefs: sourceRefs || [],
        definition: definition || {}
      }
    },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  ).exec();

  return normalizeTemplate(doc);
}

export async function deleteQuestionnaireTemplate(slug) {
  if (!isDatabaseConfigured()) throw new Error("Database neconfigurat.");

  await connectMongo();
  const { QuestionnaireTemplate } = getModels();
  await QuestionnaireTemplate.deleteOne({ slug });
  return { ok: true };
}

export async function getEvaluableDefinition(slug) {
  const template = await getQuestionnaireTemplateBySlug(slug);

  if (!template) return null;

  const def = template.definition;
  if (!def) return null;

  return {
    slug: template.slug,
    title: template.title,
    kind: template.kind,
    audience: template.audience,
    sourceRefs: template.sourceRefs || [],
    questions: def.questions || [],
    bands: def.bands || [],
    dimensions: def.dimensions || null
  };
}

export async function listPublicEvaluableDefinitions() {
  const templates = await listQuestionnairesForAdmin();

  return templates
    .filter((t) => t.status === "active" && (t.deliveryMode === "public" || t.deliveryMode === "public-assisted"))
    .map((t) => {
      const def = t.definition;
      return {
        slug: t.slug,
        title: t.title,
        kind: t.kind,
        audience: t.audience,
        deliveryMode: t.deliveryMode,
        sourceRefs: t.sourceRefs || [],
        questions: def?.questions || [],
        bands: def?.bands || [],
        dimensions: def?.dimensions || null
      };
    })
    .filter((t) => t.questions.length > 0 || (t.dimensions && Object.keys(t.dimensions).length > 0));
}
