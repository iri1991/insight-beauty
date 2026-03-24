import { evaluateQuestionnaire, getQuestionnaireBySlug } from "../lib/questionnaire-engine.js";

const fitzpatrick = evaluateQuestionnaire("fitzpatrick-screening", {
  answers: {
    eyeColor: "brown",
    hairColor: "light-brown",
    untannedSkin: "light-olive",
    freckles: "few",
    sunburnReaction: "peeling",
    tanningFrequency: "sometimes",
    tanIntensity: "medium-two-five-weeks",
    sunSensitivity: "medium",
    lastSunExposure: "one-two-months",
    treatedAreaExposure: "sometimes"
  }
});

const acne = evaluateQuestionnaire("acne-severity", {
  answers: {
    comedones: "moderate",
    papules: "few",
    pustules: "few",
    cysts: "none"
  }
});

const baumann = evaluateQuestionnaire("baumann-profile", {
  answers: {
    oiliness: 18,
    sensitivity: 31,
    pigmentation: 35,
    wrinkling: 37
  }
});

console.log("Questionnaire loaded:", getQuestionnaireBySlug("fitzpatrick-screening").title);
console.log("Fitzpatrick:", fitzpatrick.band?.label, fitzpatrick.score);
console.log("Acne:", acne.band?.label, acne.score, acne.flags || []);
console.log("Baumann:", baumann.band?.label, baumann.code);
