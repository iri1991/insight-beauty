import { sourceLibrary } from "../data/generated/source-library.js";

export function getSourceDocuments() {
  return sourceLibrary;
}

export function getSourceDocumentsByKind(kind) {
  return sourceLibrary.filter((document) => document.kind === kind);
}

export function getSourceStats() {
  return sourceLibrary.reduce((stats, document) => {
    stats.total += 1;
    stats.byKind[document.kind] = (stats.byKind[document.kind] || 0) + 1;
    return stats;
  }, { total: 0, byKind: {} });
}

export function getTipologyByCode(code) {
  return sourceLibrary.find(
    (document) => document.kind === "tipology" && document.code === code && document.audience !== "duplicate"
  );
}

export function getTipologyCatalog() {
  return sourceLibrary.filter((document) => document.kind === "tipology" && document.audience !== "duplicate");
}

export function getSourceDocumentByFileName(fileName) {
  return sourceLibrary.find((document) => document.fileName === fileName) || null;
}
