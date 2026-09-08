export const BAUMANN_QUESTIONS = [
  { id: "od", axis: "O/D", label: "La 2-3 ore după spălare, fără niciun produs aplicat, pielea ta:", options: [["Este aspră, descuamată", 1], ["Este strânsă, dar confortabilă", 2], ["Bine hidratată, fără luciu", 3], ["Lucioasă, cu reflexii puternice", 4]] },
  { id: "sr", axis: "S/R", label: "Cum reacționează pielea ta la produse noi (cosmetice, parfumate)?", options: [["Aproape niciodată nu reacționează", 1], ["Rareori, doar la produse puternice", 2], ["Des apare roșeață sau usturime", 3], ["Aproape mereu reacționează", 4]] },
  { id: "pn", axis: "P/N", label: "După expunere la soare, cât de ușor apar pete sau ton inegal?", options: [["Aproape niciodată", 1], ["Rareori, dispar repede", 2], ["Des, rămân câteva săptămâni", 3], ["Foarte ușor, rămân mult timp", 4]] },
  { id: "wt", axis: "W/T", label: "Cum ai descrie fermitatea și liniile fine ale pielii tale acum?", options: [["Fermă, fără linii vizibile", 1], ["Câteva linii fine, doar la expresie", 2], ["Riduri vizibile în repaus", 3], ["Riduri marcate, pierdere de fermitate", 4]] }
];

export const TEST_CATALOG = [
  ["baumann", "Testul Baumann", "Chestionare", "4 axe: hidratare, sensibilitate, pigmentare, îmbătrânire."],
  ["lifestyle", "Stil de viață", "Chestionare", "Alimentație, hidratare, somn, stres, mișcare, soare."],
  ["fitzpatrick", "Testul Fitzpatrick", "Chestionare", "Fototip solar I-VI, risc de ardere și pigmentare."],
  ["dermatita", "Evaluare dermatită", "Chestionare", "Scor de severitate și recomandări."],
  ["psoriazis", "Evaluare psoriazis", "Chestionare", "Scor de severitate și recomandări."],
  ["acnee", "Clasificare acnee", "Chestionare", "Comedoane, papule, pustule, chisturi."],
  ["hiperpigmentare", "Hiperpigmentare", "Analiză vizuală", "Pete, uniformitate ton, zone afectate."],
  ["eritem", "Eritem & vascular", "Analiză vizuală", "Roșeață, cuperoză, sensibilitate vasculară."],
  ["pori", "Pori & comedoane", "Analiză vizuală", "Dimensiune, densitate, zone T/U."],
  ["ochi", "Zona ochilor", "Analiză vizuală", "Cearcăne, pungi, riduri periorbitale."],
  ["elasticitate", "Elasticitate & riduri", "Analiză vizuală", "Turgor, fermitate, hărți de riduri."]
].map(([id, name, group, description], index) => ({ id, name, group, description, sequence: index + 1 }));

// This is the clinical sequence provided for Insight Beauty. Do not sort by group or name.
export const ASSESSMENT_SEQUENCE = TEST_CATALOG.map((test) => test.id);

export function getNextAssessment(history = []) {
  const completed = new Set(history.map((item) => item.id));
  return TEST_CATALOG.find((test) => !completed.has(test.id)) || null;
}

export function getBaumannType(answers) {
  const pairs = { "O/D": ["O", "D"], "S/R": ["R", "S"], "P/N": ["N", "P"], "W/T": ["T", "W"] };
  return BAUMANN_QUESTIONS.map((question) => pairs[question.axis][Number(answers[question.id]) <= 2.5 ? 0 : 1]).join("");
}
