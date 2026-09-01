/**
 * Sincronizează în MongoDB catalogul final de evaluări Insight Beauty.
 * Rulează explicit: node scripts/sync-final-assessment-catalog.mjs --apply
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const currentDir = path.dirname(fileURLToPath(import.meta.url));

function loadEnvFile(filePath) {
  if (!fs.existsSync(filePath)) return;
  for (const rawLine of fs.readFileSync(filePath, "utf8").split("\n")) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;
    const separator = line.indexOf("=");
    if (separator === -1) continue;
    const key = line.slice(0, separator).trim();
    const value = line.slice(separator + 1).trim().replace(/^['"]|['"]$/g, "");
    if (!process.env[key]) process.env[key] = value;
  }
}

loadEnvFile(path.resolve(currentDir, "../.env.local"));
loadEnvFile(path.resolve(currentDir, "../.env"));

if (!process.argv.includes("--apply")) {
  console.error("Acțiune oprită. Rulează cu --apply pentru a sincroniza șabloanele finale.");
  process.exit(1);
}

if (!process.env.MONGODB_URI) {
  console.error("Lipsește MONGODB_URI în .env sau .env.local.");
  process.exit(1);
}

const [{ connectMongo }, { getModels }, { questionnaireCatalog, questionnaireDefinitions }] = await Promise.all([
  import("../lib/mongodb.js"),
  import("../lib/mongoose-models.js"),
  import("../lib/questionnaires.js")
]);

await connectMongo();
const { QuestionnaireTemplate } = getModels();
const catalogBySlug = new Map(questionnaireCatalog.map((entry) => [entry.slug, entry]));

for (const [slug, definition] of Object.entries(questionnaireDefinitions)) {
  const catalog = catalogBySlug.get(slug);
  if (!catalog) continue;

  await QuestionnaireTemplate.findOneAndUpdate(
    { slug },
    {
      $set: {
        slug,
        title: catalog.title,
        kind: definition.kind,
        audience: catalog.audience,
        deliveryMode: catalog.deliveryMode,
        status: catalog.status,
        description: catalog.description,
        sourceRefs: catalog.sourceRefs,
        definition: {
          questions: definition.questions || [],
          bands: definition.bands || [],
          dimensions: definition.dimensions || null
        }
      }
    },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  ).exec();

  console.log(`✓ ${slug} (${definition.questions?.length || Object.keys(definition.dimensions || {}).length} câmpuri)`);
}

console.log("Catalogul final a fost sincronizat în MongoDB.");
