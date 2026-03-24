import { execFileSync } from "node:child_process";
import { readdirSync, writeFileSync } from "node:fs";
import { basename, extname, join } from "node:path";

const rootDir = process.cwd();
const sourceDir = join(rootDir, "source");
const outputFile = join(rootDir, "data", "generated", "source-library.js");

function normalizeWhitespace(value) {
  return value.replace(/\r/g, "").replace(/\u00a0/g, " ").replace(/[ \t]+/g, " ").replace(/\n{3,}/g, "\n\n").trim();
}

function canonicalName(fileName) {
  return fileName.replace(/-\d+(?=\.[^.]+$)/, "");
}

function classifyDocument(fileName, text) {
  const lowerName = fileName.toLowerCase();
  const lowerText = text.toLowerCase();

  if (lowerName.includes("tipologie ten")) {
    return "tipology";
  }

  if (lowerName.includes("baumann")) {
    return "dimension-report";
  }

  if (lowerName.includes("consimtamant")) {
    return "consent";
  }

  if (lowerText.includes("interpretare") || lowerName.includes("interpretari")) {
    return "interpretation";
  }

  if (lowerName.includes("chestionar") || lowerText.includes("chestionar")) {
    return "questionnaire";
  }

  return "reference";
}

function inferAudience(fileName, text) {
  const lowerName = fileName.toLowerCase();
  const lowerText = text.toLowerCase();

  if (/-\d+\./.test(fileName)) {
    return "duplicate";
  }

  if (lowerText.includes("pentru clienti")) {
    return "client";
  }

  if (lowerText.includes("pentru cosmeticiene") || lowerText.includes("pentru cosmetician")) {
    return "professional";
  }

  if (lowerName.includes("consimtamant")) {
    return "client";
  }

  return "mixed";
}

function inferCode(fileName, text) {
  const matchFromText = text.match(/\b(D|O)(R|S)(N|P)(T|W)\b/);

  if (matchFromText) {
    return matchFromText[0];
  }

  const matchFromName = fileName.match(/\b(D|O)(R|S)(N|P)(T|W)\b/i);
  return matchFromName ? matchFromName[0].toUpperCase() : null;
}

const fileNames = readdirSync(sourceDir)
  .filter((fileName) => [".doc", ".docx"].includes(extname(fileName).toLowerCase()))
  .sort((left, right) => left.localeCompare(right));

const canonicalSeen = new Set();

const documents = fileNames.map((fileName) => {
  const filePath = join(sourceDir, fileName);
  const rawText = execFileSync("textutil", ["-convert", "txt", "-stdout", filePath], {
    encoding: "utf8"
  });
  const text = normalizeWhitespace(rawText);
  const name = canonicalName(fileName);
  const isDuplicate = canonicalSeen.has(name);

  canonicalSeen.add(name);

  return {
    id: basename(fileName, extname(fileName)).replaceAll(" ", "-").toLowerCase(),
    fileName,
    canonicalName: name,
    kind: classifyDocument(fileName, text),
    audience: isDuplicate ? "duplicate" : inferAudience(fileName, text),
    code: inferCode(fileName, text),
    preview: text.slice(0, 280),
    text
  };
});

const moduleContent = `export const sourceLibrary = ${JSON.stringify(documents, null, 2)};\n`;
writeFileSync(outputFile, moduleContent, "utf8");

console.log(`Generated ${documents.length} indexed source documents in ${outputFile}`);

