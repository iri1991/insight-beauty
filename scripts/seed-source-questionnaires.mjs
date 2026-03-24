/**
 * Seed script: codifică toate chestionarele din documentele sursă și le importă în MongoDB.
 *
 * Rulare: node scripts/seed-source-questionnaires.mjs
 * Sau cu reset: node scripts/seed-source-questionnaires.mjs --reset
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const currentDir = path.dirname(fileURLToPath(import.meta.url));

function loadEnvFile(filePath) {
  if (!fs.existsSync(filePath)) return;
  const content = fs.readFileSync(filePath, "utf8");
  for (const rawLine of content.split("\n")) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;
    const sep = line.indexOf("=");
    if (sep === -1) continue;
    const key = line.slice(0, sep).trim();
    const value = line.slice(sep + 1).trim().replace(/^['"]|['"]$/g, "");
    if (!process.env[key]) process.env[key] = value;
  }
}

loadEnvFile(path.resolve(currentDir, "../.env.local"));
loadEnvFile(path.resolve(currentDir, "../.env"));

if (!process.env.MONGODB_URI) {
  console.error("Missing MONGODB_URI. Configureaza .env sau .env.local.");
  process.exit(1);
}

const { connectMongo } = await import("../lib/mongodb.js");
const { getModels } = await import("../lib/mongoose-models.js");

/* ─────────────────────────────────────────────────────────────
   PSORIAZIS SCREENING
   Sursa: 1. chestionar psoriazis.docx
   40 întrebări cu punctaje extrase din document
───────────────────────────────────────────────────────────── */

const psoriazisQuestions = [
  // Informații Personale
  { id: "varsta", label: "Vârsta", options: [
    { value: "sub-20", label: "Sub 20 de ani", points: 1 },
    { value: "20-40", label: "20–40 de ani", points: 2 },
    { value: "41-60", label: "41–60 de ani", points: 3 },
    { value: "peste-60", label: "Peste 60 de ani", points: 4 }
  ]},
  { id: "sex", label: "Sex", options: [
    { value: "feminin", label: "Feminin", points: 2 },
    { value: "masculin", label: "Masculin", points: 2 },
    { value: "alta", label: "Altă opțiune", points: 2 }
  ]},
  { id: "istoric-familial", label: "Istoric familial de psoriazis", options: [
    { value: "nu", label: "Nu", points: 0 },
    { value: "da", label: "Da", points: 4 }
  ]},
  { id: "grupa-sanguina", label: "Grupă sanguină (dacă este cunoscut)", options: [
    { value: "o", label: "O", points: 1 },
    { value: "a", label: "A", points: 2 },
    { value: "b", label: "B", points: 2 },
    { value: "ab", label: "AB", points: 2 },
    { value: "necunoscut", label: "Nu știu", points: 1 }
  ]},
  { id: "ocupatie", label: "Ocupație", options: [
    { value: "birou", label: "Birou / sedentară", points: 1 },
    { value: "lucru-manual", label: "Lucru manual", points: 2 },
    { value: "aer-liber", label: "În aer liber", points: 3 },
    { value: "alta", label: "Altă ocupație", points: 1 }
  ]},
  // Stilul de Viață
  { id: "fumat", label: "Fumați?", options: [
    { value: "nu", label: "Nu", points: 0 },
    { value: "ocazional", label: "Ocazional", points: 2 },
    { value: "regulat", label: "Regulat", points: 4 }
  ]},
  { id: "expunere-soare", label: "Expunere la soare (săptămânal)", options: [
    { value: "rareori", label: "Rareori (sub 2 ore)", points: 1 },
    { value: "ocazional", label: "Ocazional (2–5 ore)", points: 2 },
    { value: "des", label: "Des (peste 5 ore)", points: 3 }
  ]},
  { id: "stres-zilnic", label: "Nivelul de stres zilnic (scală 1–10)", options: [
    { value: "scazut", label: "1–3 (Scăzut)", points: 1 },
    { value: "mediu", label: "4–7 (Mediu)", points: 2 },
    { value: "ridicat", label: "8–10 (Ridicat)", points: 3 }
  ]},
  { id: "activitate-fizica", label: "Activitate fizică regulată", options: [
    { value: "nu", label: "Nu", points: 1 },
    { value: "1-2-zile", label: "1–2 zile pe săptămână", points: 2 },
    { value: "3-plus", label: "3 zile sau mai mult pe săptămână", points: 3 }
  ]},
  { id: "calitate-somn", label: "Calitatea somnului (ore și regularitate)", options: [
    { value: "bun", label: "7–9 ore, regulat", points: 0 },
    { value: "mediu", label: "5–7 ore, neregulat", points: 2 },
    { value: "slab", label: "Sub 5 ore, foarte neregulat", points: 4 }
  ]},
  { id: "substante-chimice", label: "Expunere la substanțe chimice/toxice", options: [
    { value: "nu", label: "Nu", points: 0 },
    { value: "ocazional", label: "Da, ocazional", points: 2 },
    { value: "frecvent", label: "Da, frecvent", points: 4 }
  ]},
  { id: "cosmetice", label: "Utilizare regulată de cosmetice sau produse de îngrijire", options: [
    { value: "nu", label: "Nu", points: 0 },
    { value: "baza", label: "Produse de bază (șampon, săpun)", points: 1 },
    { value: "multe", label: "Multe produse (creme, loțiuni, machiaj)", points: 2 }
  ]},
  { id: "cafeina", label: "Consum de cafeină", options: [
    { value: "nu", label: "Nu", points: 0 },
    { value: "1-2", label: "1–2 porții pe zi", points: 1 },
    { value: "peste-2", label: "Peste 2 porții pe zi", points: 2 }
  ]},
  { id: "dieta-grasimi-zahar", label: "Dietă bogată în grăsimi și zaharuri", options: [
    { value: "nu", label: "Nu", points: 0 },
    { value: "ocazional", label: "Ocazional", points: 1 },
    { value: "regulat", label: "Regulat", points: 2 }
  ]},
  // Istoric Medical
  { id: "alergii", label: "Alergii personale sau în familie", options: [
    { value: "nu", label: "Nu", points: 0 },
    { value: "minore", label: "Da, alergii minore", points: 2 },
    { value: "severe", label: "Da, alergii severe (astm, anafilaxie)", points: 4 }
  ]},
  { id: "cancer-familie", label: "Istoric de cancer în familie (inclusiv cancer de piele)", options: [
    { value: "nu", label: "Nu", points: 0 },
    { value: "da", label: "Da", points: 3 }
  ]},
  { id: "afectiuni-piele-familie", label: "Afecțiuni ale pielii în familie (dermatite, acnee, rozacee)", options: [
    { value: "nu", label: "Nu", points: 0 },
    { value: "da", label: "Da", points: 3 }
  ]},
  { id: "tratamente-recente", label: "Tratamente medicale recente (antibiotice, steroizi)", options: [
    { value: "nu", label: "Nu", points: 0 },
    { value: "usoare", label: "Da, tratamente ușoare", points: 2 },
    { value: "intense", label: "Da, tratamente intense (chimioterapie, terapie biologică)", points: 4 }
  ]},
  { id: "boli-infectioase", label: "Boli infecțioase (gripă, varicelă, hepatită)", options: [
    { value: "nu", label: "Nu", points: 0 },
    { value: "da", label: "Da", points: 2 }
  ]},
  { id: "reactii-medicamente", label: "Reacții la medicamente (erupții, greață)", options: [
    { value: "nu", label: "Nu", points: 0 },
    { value: "minore", label: "Da, reacții minore", points: 2 },
    { value: "severe", label: "Da, reacții severe (dificultăți respiratorii)", points: 4 }
  ]},
  { id: "boli-autoimune", label: "Boli autoimune în familie (Hashimoto, scleroză multiplă)", options: [
    { value: "nu", label: "Nu", points: 0 },
    { value: "da", label: "Da", points: 3 }
  ]},
  // Simptome
  { id: "zone-afectate", label: "Zonele afectate", options: [
    { value: "fata", label: "Față", points: 2 },
    { value: "scalp", label: "Scalp", points: 2 },
    { value: "alte", label: "Alte zone ale corpului", points: 2 },
    { value: "combinat", label: "Combinat (multiple zone)", points: 4 }
  ]},
  { id: "placi", label: "Plăci roșii și solzoase pe piele", options: [
    { value: "nu", label: "Nu", points: 0 },
    { value: "minore", label: "Da, minore", points: 2 },
    { value: "severe", label: "Da, severe", points: 4 }
  ]},
  { id: "mancarime-arsura", label: "Mâncărime sau senzație de arsură", options: [
    { value: "nu", label: "Nu", points: 0 },
    { value: "usoare", label: "Da, ușoare", points: 1 },
    { value: "severe", label: "Da, severe", points: 3 }
  ]},
  { id: "localizare-leziuni", label: "Localizarea leziunilor", options: [
    { value: "scalp-coate-genunchi", label: "Scalp, coate, genunchi", points: 2 },
    { value: "trunchi-pliuri", label: "Trunchi, pliuri ale pielii", points: 3 },
    { value: "tot-corpul", label: "Peste tot corpul", points: 4 },
    { value: "niciunul", label: "Fără leziuni", points: 0 }
  ]},
  { id: "durata-simptome", label: "Durata simptomelor", options: [
    { value: "sub-o-saptamana", label: "Mai puțin de o săptămână", points: 1 },
    { value: "1s-1l", label: "1 săptămână – 1 lună", points: 2 },
    { value: "peste-1-luna", label: "Peste 1 lună", points: 3 },
    { value: "fara", label: "Fără simptome", points: 0 }
  ]},
  { id: "severitate", label: "Severitatea simptomelor", options: [
    { value: "usoare", label: "Ușoare (roșeață ușoară)", points: 1 },
    { value: "moderate", label: "Moderate", points: 2 },
    { value: "severe", label: "Severe (plăci solzoase extinse)", points: 3 },
    { value: "absente", label: "Absente", points: 0 }
  ]},
  { id: "modificari-aspect", label: "Modificări în aspectul pielii (descuamare, crăpături)", options: [
    { value: "nu", label: "Nu", points: 0 },
    { value: "usoare", label: "Da, ușoare", points: 2 },
    { value: "severe", label: "Da, severe", points: 4 }
  ]},
  { id: "prezenta-mancarime", label: "Prezența mâncărimii", options: [
    { value: "nu", label: "Nu", points: 0 },
    { value: "usoara", label: "Da, ușoară", points: 1 },
    { value: "severa", label: "Da, severă", points: 3 }
  ]},
  { id: "modificari-culoare", label: "Modificări în culoarea pielii (pete palide, hiperpigmentare)", options: [
    { value: "nu", label: "Nu", points: 0 },
    { value: "usoare", label: "Da, ușoare", points: 2 },
    { value: "severe", label: "Da, severe", points: 4 }
  ]},
  // Alimentație și Dietă
  { id: "alimente-alergene", label: "Consum de alimente alergene (lactate, gluten, nuci)", options: [
    { value: "rareori", label: "Rareori", points: 1 },
    { value: "ocazional", label: "Ocazional", points: 2 },
    { value: "des", label: "Des", points: 3 }
  ]},
  { id: "alcool", label: "Consum de alcool", options: [
    { value: "nu", label: "Nu", points: 0 },
    { value: "ocazional", label: "Ocazional (max 1–2 ori/săptămână)", points: 1 },
    { value: "regulat", label: "Regulat (mai mult de 2 ori/săptămână)", points: 3 }
  ]},
  { id: "intoleranta", label: "Intoleranță la anumite alimente (lactoză, gluten)", options: [
    { value: "nu", label: "Nu", points: 0 },
    { value: "minora", label: "Da, intoleranță minoră", points: 2 },
    { value: "severa", label: "Da, intoleranță severă", points: 4 }
  ]},
  { id: "fast-food", label: "Consum de fast-food sau alimente procesate", options: [
    { value: "nu", label: "Nu", points: 0 },
    { value: "ocazional", label: "Ocazional (1–2 ori/săptămână)", points: 1 },
    { value: "frecvent", label: "Frecvent (mai mult de 2 ori/săptămână)", points: 3 }
  ]},
  { id: "fluctuatii-greutate", label: "Fluctuații în greutate", options: [
    { value: "nu", label: "Nu", points: 0 },
    { value: "minore", label: "Da, fluctuații minore", points: 2 },
    { value: "majore", label: "Da, fluctuații majore", points: 4 }
  ]},
  // Factori de Mediu
  { id: "iritanti-alergene", label: "Expunere la substanțe iritante sau alergene (praf, parfumuri, polen)", options: [
    { value: "rareori", label: "Rareori", points: 1 },
    { value: "ocazional", label: "Ocazional", points: 2 },
    { value: "des", label: "Des", points: 3 }
  ]},
  { id: "calitate-aer", label: "Calitatea aerului în locuință sau la locul de muncă", options: [
    { value: "buna", label: "Bună", points: 0 },
    { value: "medie", label: "Medie (praf, mucegai ocazional)", points: 2 },
    { value: "proasta", label: "Proastă (praf, mucegai, fum)", points: 4 }
  ]},
  { id: "animale-polen", label: "Expunere la animale de companie sau polen", options: [
    { value: "nu", label: "Nu", points: 0 },
    { value: "fara-simptome", label: "Da, dar fără simptome", points: 1 },
    { value: "cu-simptome", label: "Da, cu simptome", points: 3 }
  ]},
  { id: "variatii-temperatura", label: "Expunere la variații mari de temperatură sau umiditate", options: [
    { value: "nu", label: "Nu", points: 0 },
    { value: "ocazional", label: "Da, ocazional", points: 2 },
    { value: "frecvent", label: "Da, frecvent", points: 4 }
  ]},
  { id: "poluare", label: "Locuiți în zone cu poluare ridicată sau condiții meteorologice extreme", options: [
    { value: "nu", label: "Nu", points: 0 },
    { value: "uneori", label: "Da, uneori", points: 2 },
    { value: "frecvent", label: "Da, frecvent", points: 4 }
  ]}
];

const psoriazisTemplate = {
  slug: "psoriasis-screening",
  title: "Psoriazis — Evaluare Detaliată",
  kind: "choice-sum",
  audience: "client-assisted",
  deliveryMode: "public-assisted",
  status: "active",
  description: "Chestionar detaliat de screening pentru evaluarea probabilității și severității psoriazisului. 40 de întrebări structurate pe 6 secțiuni: date personale, stil de viață, istoric medical, simptome, alimentație și factori de mediu.",
  sourceRefs: ["1. chestionar psoriazis.docx"],
  definition: {
    questions: psoriazisQuestions,
    bands: [
      {
        min: 0, max: 15,
        label: "Probabilitate scăzută / Psoriazis absent sau ușor",
        summary: "Punctajul obținut indică o probabilitate scăzută de psoriazis activ. Recomandările se concentrează pe menținerea sănătății pielii și prevenție.",
        recommendation: "Tratamente hidratante și calmante în cabinet. Loțiuni hidratante fără parfum, evitarea săpunurilor iritante. Dietă echilibrată, evitarea alimentelor procesate. Somn adecvat, reducerea stresului. Suplimente: Vitamina D, Omega-3."
      },
      {
        min: 16, max: 30,
        label: "Psoriazis Moderat",
        summary: "Simptomele la acest nivel necesită atenție specială. Tratamentele cosmetice și îngrijirea acasă se concentrează pe controlul simptomelor și reducerea inflamației.",
        recommendation: "Tratamente calmante (băi cu ovăz), fototerapie UVB, creme cu corticosteroizi (prescrise). Băi cu sare Epsom sau ovăz. Dietă bogată în antioxidanți și Omega-3. Exerciții fizice regulate. Suplimente: Probiotice, Curcumin."
      },
      {
        min: 31, max: 999,
        label: "Psoriazis Sever — Consultație urgentă recomandată",
        summary: "Un punctaj ridicat sugerează o afecțiune gravă a pielii care necesită intervenție medicală specializată și un regim de îngrijire riguros.",
        recommendation: "Consultație urgentă cu dermatolog. Terapii avansate personalizate. Urmarea strictă a planului de tratament prescris. Hidratanți potenți și unguente prescrise. Dietă antiinflamatorie. Gestionarea eficientă a stresului. Evitarea alcoolului și fumatului. Suplimente: Vitamina B12, Zinc."
      }
    ]
  }
};

/* ─────────────────────────────────────────────────────────────
   DERMATITA — EVALUARE COMPLETĂ
   Sursa: chestionar dermatita.docx
   36 de întrebări
───────────────────────────────────────────────────────────── */

const dermatitaQuestions = [
  { id: "varsta", label: "Vârsta", options: [
    { value: "sub-20", label: "Sub 20 de ani", points: 1 },
    { value: "20-40", label: "20–40 de ani", points: 2 },
    { value: "41-60", label: "41–60 de ani", points: 3 },
    { value: "peste-60", label: "Peste 60 de ani", points: 4 }
  ]},
  { id: "sex", label: "Sex", options: [
    { value: "feminin", label: "Feminin", points: 2 },
    { value: "masculin", label: "Masculin", points: 2 },
    { value: "alta", label: "Altă opțiune", points: 2 }
  ]},
  { id: "ocupatie", label: "Ocupație", options: [
    { value: "birou", label: "Birou / sedentară", points: 1 },
    { value: "lucru-manual", label: "Lucru manual", points: 2 },
    { value: "aer-liber", label: "În aer liber", points: 3 },
    { value: "alta", label: "Altă ocupație", points: 1 }
  ]},
  { id: "grupa-sanguina", label: "Grupă sanguinâ (dacă este cunoscutâ)", options: [
    { value: "o", label: "O", points: 1 },
    { value: "a", label: "A", points: 2 },
    { value: "b", label: "B", points: 2 },
    { value: "ab", label: "AB", points: 2 },
    { value: "necunoscut", label: "Nu știu", points: 1 }
  ]},
  { id: "alergii", label: "Alergii personale sau în familie", options: [
    { value: "nu", label: "Nu", points: 0 },
    { value: "minore", label: "Da, alergii minore", points: 2 },
    { value: "severe", label: "Da, alergii severe", points: 4 }
  ]},
  { id: "cancer-familie", label: "Istoric de cancer în familie (inclusiv cancer de piele)", options: [
    { value: "nu", label: "Nu", points: 0 },
    { value: "da", label: "Da", points: 3 }
  ]},
  { id: "fumat", label: "Fumați?", options: [
    { value: "nu", label: "Nu", points: 0 },
    { value: "ocazional", label: "Ocazional", points: 2 },
    { value: "regulat", label: "Regulat", points: 4 }
  ]},
  { id: "expunere-soare", label: "Expunere la soare (săptămânal)", options: [
    { value: "rareori", label: "Rareori", points: 1 },
    { value: "ocazional", label: "Ocazional", points: 2 },
    { value: "des", label: "Des", points: 3 }
  ]},
  { id: "stres-zilnic", label: "Nivelul de stres zilnic", options: [
    { value: "scazut", label: "Scăzut", points: 1 },
    { value: "mediu", label: "Mediu", points: 2 },
    { value: "ridicat", label: "Ridicat", points: 3 }
  ]},
  { id: "activitate-fizica", label: "Activitate fizică regulată", options: [
    { value: "nu", label: "Nu", points: 1 },
    { value: "1-2-zile", label: "1–2 zile pe săptămână", points: 2 },
    { value: "3-plus", label: "3 zile sau mai mult pe săptămână", points: 3 }
  ]},
  { id: "calitate-somn", label: "Calitatea somnului", options: [
    { value: "buna", label: "Bună", points: 0 },
    { value: "medie", label: "Medie", points: 2 },
    { value: "slaba", label: "Slabă", points: 4 }
  ]},
  { id: "substante-chimice", label: "Expunere la substanțe chimice sau toxice", options: [
    { value: "nu", label: "Nu", points: 0 },
    { value: "ocazional", label: "Da, ocazional", points: 2 },
    { value: "frecvent", label: "Da, frecvent", points: 4 }
  ]},
  { id: "cosmetice", label: "Utilizare regulată de cosmetice sau produse de îngrijire", options: [
    { value: "nu", label: "Nu", points: 0 },
    { value: "unele", label: "Da, unele produse", points: 1 },
    { value: "multe", label: "Da, multe produse", points: 2 }
  ]},
  { id: "cafeina", label: "Consum de cafeină", options: [
    { value: "nu", label: "Nu", points: 0 },
    { value: "1-2", label: "1–2 porții pe zi", points: 1 },
    { value: "peste-2", label: "Peste 2 porții pe zi", points: 2 }
  ]},
  { id: "probleme-piele-trecut", label: "Probleme de piele în trecut", options: [
    { value: "nu", label: "Nu", points: 0 },
    { value: "usoare", label: "Da, condiții ușoare", points: 2 },
    { value: "severe", label: "Da, condiții severe", points: 4 }
  ]},
  { id: "dermatite-familie", label: "Dermatite sau afecțiuni ale pielii în familie", options: [
    { value: "nu", label: "Nu", points: 0 },
    { value: "nesigur", label: "Nu sunt sigur(ă)", points: 1 },
    { value: "da", label: "Da", points: 3 }
  ]},
  { id: "tratamente-medicale", label: "Tratamente medicale recente", options: [
    { value: "nu", label: "Nu", points: 0 },
    { value: "usoare", label: "Da, tratamente ușoare", points: 2 },
    { value: "intense", label: "Da, tratamente intense", points: 4 }
  ]},
  { id: "boli-infectioase", label: "Boli infecțioase recente", options: [
    { value: "nu", label: "Nu", points: 0 },
    { value: "da", label: "Da", points: 2 }
  ]},
  { id: "reactii-medicamente", label: "Reacții la medicamente (erupții, greață)", options: [
    { value: "nu", label: "Nu", points: 0 },
    { value: "minore", label: "Da, reacții minore", points: 2 },
    { value: "severe", label: "Da, reacții severe", points: 4 }
  ]},
  { id: "boli-autoimune", label: "Boli autoimune personale sau în familie", options: [
    { value: "nu", label: "Nu", points: 0 },
    { value: "da", label: "Da", points: 3 }
  ]},
  { id: "zone-afectate", label: "Zonele afectate de dermatită", options: [
    { value: "fata", label: "Față", points: 2 },
    { value: "scalp", label: "Scalp", points: 2 },
    { value: "alte", label: "Alte zone ale corpului", points: 2 },
    { value: "combinat", label: "Combinat (multiple zone)", points: 4 },
    { value: "niciuna", label: "Nicio zonă", points: 0 }
  ]},
  { id: "severitate", label: "Severitatea simptomelor", options: [
    { value: "usoare", label: "Ușoare", points: 1 },
    { value: "moderate", label: "Moderate", points: 2 },
    { value: "severe", label: "Severe", points: 3 },
    { value: "absente", label: "Absente", points: 0 }
  ]},
  { id: "durata", label: "Durata simptomelor", options: [
    { value: "sub-saptamana", label: "Mai puțin de o săptămână", points: 1 },
    { value: "1s-1l", label: "1 săptămână – 1 lună", points: 2 },
    { value: "peste-1-luna", label: "Peste 1 lună", points: 3 },
    { value: "fara", label: "Fără simptome", points: 0 }
  ]},
  { id: "modificari-aspect", label: "Modificări în aspectul pielii (roșeață, descuamare)", options: [
    { value: "nu", label: "Nu", points: 0 },
    { value: "usoare", label: "Da, ușoare", points: 2 },
    { value: "severe", label: "Da, severe", points: 4 }
  ]},
  { id: "mancarime", label: "Prezența mâncărimii", options: [
    { value: "nu", label: "Nu", points: 0 },
    { value: "usoara", label: "Da, ușoară", points: 1 },
    { value: "severa", label: "Da, severă", points: 3 }
  ]},
  { id: "modificari-culoare", label: "Modificări în culoarea pielii", options: [
    { value: "nu", label: "Nu", points: 0 },
    { value: "usoare", label: "Da, ușoare", points: 2 },
    { value: "severe", label: "Da, severe", points: 4 }
  ]},
  { id: "alimente-alergene", label: "Consum de alimente alergene (lactate, gluten, nuci)", options: [
    { value: "rareori", label: "Rareori", points: 1 },
    { value: "ocazional", label: "Ocazional", points: 2 },
    { value: "des", label: "Des", points: 3 }
  ]},
  { id: "alcool", label: "Consum de alcool", options: [
    { value: "nu", label: "Nu", points: 0 },
    { value: "ocazional", label: "Ocazional", points: 1 },
    { value: "regulat", label: "Regulat", points: 3 }
  ]},
  { id: "intoleranta", label: "Intoleranță la anumite alimente", options: [
    { value: "nu", label: "Nu", points: 0 },
    { value: "minora", label: "Da, intoleranță minoră", points: 2 },
    { value: "severa", label: "Da, intoleranță severă", points: 4 }
  ]},
  { id: "fast-food", label: "Consum de fast-food sau alimente procesate", options: [
    { value: "nu", label: "Nu", points: 0 },
    { value: "ocazional", label: "Ocazional", points: 1 },
    { value: "frecvent", label: "Frecvent", points: 3 }
  ]},
  { id: "fluctuatii-greutate", label: "Fluctuații în greutate", options: [
    { value: "nu", label: "Nu", points: 0 },
    { value: "minore", label: "Da, fluctuații minore", points: 2 },
    { value: "majore", label: "Da, fluctuații majore", points: 4 }
  ]},
  { id: "iritanti", label: "Expunere la substanțe iritante sau alergene", options: [
    { value: "rareori", label: "Rareori", points: 1 },
    { value: "ocazional", label: "Ocazional", points: 2 },
    { value: "des", label: "Des", points: 3 }
  ]},
  { id: "calitate-aer", label: "Calitatea aerului în locuință sau la locul de muncă", options: [
    { value: "buna", label: "Bună", points: 0 },
    { value: "medie", label: "Medie", points: 2 },
    { value: "proasta", label: "Proastă (praf, mucegai, fum)", points: 4 }
  ]},
  { id: "animale-polen", label: "Expunere la animale de companie sau polen", options: [
    { value: "nu", label: "Nu", points: 0 },
    { value: "fara-simptome", label: "Da, fără simptome", points: 1 },
    { value: "cu-simptome", label: "Da, cu simptome", points: 3 }
  ]},
  { id: "variatii-temperatura", label: "Expunere la variații mari de temperatură sau umiditate", options: [
    { value: "nu", label: "Nu", points: 0 },
    { value: "ocazional", label: "Da, ocazional", points: 2 },
    { value: "frecvent", label: "Da, frecvent", points: 4 }
  ]},
  { id: "poluare", label: "Locuiți în zone cu poluare ridicată sau condiții extreme", options: [
    { value: "nu", label: "Nu", points: 0 },
    { value: "uneori", label: "Da, uneori", points: 2 },
    { value: "frecvent", label: "Da, frecvent", points: 4 }
  ]}
];

const dermatitaTemplate = {
  slug: "dermatita-screening",
  title: "Dermatită — Evaluare Completă",
  kind: "choice-sum",
  audience: "client-assisted",
  deliveryMode: "public-assisted",
  status: "active",
  description: "Chestionar complet de evaluare a dermatitei cu 36 de întrebări pe 6 secțiuni: date personale, stil de viață, istoric medical, simptome, alimentație și factori de mediu.",
  sourceRefs: ["chestionar dermatita.docx"],
  definition: {
    questions: dermatitaQuestions,
    bands: [
      {
        min: 0, max: 30,
        label: "Dermatită Ușoară sau Absentă",
        summary: "Probabilitate scăzută de dermatită sau afecțiuni ușoare ale pielii. Recomandările se concentrează pe menținerea sănătății pielii și prevenție.",
        recommendation: "Consultație pentru evaluare și sfaturi de îngrijire. Tratamente hidratante și calmante. Curățare blândă fără săpunuri iritante. Hidratare regulată. Dietă bogată în antioxidanți și Omega-3. Evitarea stresului, somn adecvat."
      },
      {
        min: 31, max: 60,
        label: "Dermatită Moderată",
        summary: "La acest nivel, simptomele necesită atenție specială. Tratamentele cosmetice și îngrijirea acasă se axează pe reducerea inflamației și sensibilității.",
        recommendation: "Tratamente antiinflamatoare (măști cu aloe vera). Terapii cu lumină pentru reducerea inflamației. Produse specializate pentru pielea sensibilă. Evitarea factorilor declanșatori. Limitarea alimentelor procesate și a zahărului. Exerciții fizice regulate."
      },
      {
        min: 61, max: 999,
        label: "Dermatită Severă — Consultație dermatologică necesară",
        summary: "Punctaj ridicat → afecțiune gravă care necesită intervenție medicală specializată și regim de îngrijire riguros.",
        recommendation: "Consultație urgentă cu dermatolog. Terapii avansate personalizate, inclusiv fototerapie. Respectarea strictă a regimului de îngrijire prescris. Creme și unguente cu corticosteroizi, dacă sunt recomandate. Eliminarea alergenilor alimentari. Reducerea stresului și a expunerii la mediu poluant. Dietă antiinflamatorie."
      }
    ]
  }
};

/* ─────────────────────────────────────────────────────────────
   LIFESTYLE INSIGHT
   Sursa: interpretari stil de viata clienti.docx
         interpretari profesionale chestionar stil de viata.docx
   Întrebările sunt create pe baza secțiunilor de interpretare.
   4 secțiuni: Alimentație (0-30p), Somn (0-24p),
               Stres & Emoții (0-18p), Mișcare (0-27p)
   Total max: 99p
───────────────────────────────────────────────────────────── */

const lifestyleQuestions = [
  // SECȚIUNEA 1: ALIMENTAȚIE (max 30p — 10 întrebări × max 3p)
  { id: "alimentatie-legume-fructe", label: "Cât de des consumați legume și fructe proaspete?", options: [
    { value: "rar", label: "Rareori (mai puțin de 2 zile/săptămână)", points: 0 },
    { value: "uneori", label: "Uneori (2–4 zile/săptămână)", points: 1 },
    { value: "des", label: "Des (5–6 zile/săptămână)", points: 2 },
    { value: "zilnic", label: "Zilnic, la fiecare masă", points: 3 }
  ]},
  { id: "alimentatie-zahar", label: "Cât de des consumați zahăr adăugat, dulciuri sau sucuri?", options: [
    { value: "zilnic", label: "Zilnic sau de mai multe ori/zi", points: 0 },
    { value: "des", label: "De câteva ori pe săptămână", points: 1 },
    { value: "rar", label: "Rareori (1–2 ori/săptămână)", points: 2 },
    { value: "deloc", label: "Deloc sau aproape deloc", points: 3 }
  ]},
  { id: "alimentatie-apa", label: "Cât de multă apă beți zilnic?", options: [
    { value: "putin", label: "Mai puțin de 1L/zi", points: 0 },
    { value: "moderat", label: "1–1.5L/zi", points: 1 },
    { value: "bun", label: "1.5–2L/zi", points: 2 },
    { value: "excelent", label: "Peste 2L/zi", points: 3 }
  ]},
  { id: "alimentatie-procesate", label: "Cât de des consumați alimente procesate sau fast-food?", options: [
    { value: "zilnic", label: "Zilnic sau aproape zilnic", points: 0 },
    { value: "des", label: "De câteva ori pe săptămână", points: 1 },
    { value: "rar", label: "Rareori (1–2 ori/lună)", points: 2 },
    { value: "deloc", label: "Deloc sau aproape deloc", points: 3 }
  ]},
  { id: "alimentatie-grasimi-sanatoase", label: "Cât de des consumați grăsimi sănătoase (avocado, nuci, ulei de măsline, pește gras)?", options: [
    { value: "rar", label: "Rareori sau deloc", points: 0 },
    { value: "uneori", label: "Uneori (1–2 ori/săptămână)", points: 1 },
    { value: "des", label: "Des (3–4 ori/săptămână)", points: 2 },
    { value: "zilnic", label: "Zilnic", points: 3 }
  ]},
  { id: "alimentatie-mese-regulate", label: "Cât de regulate sunt mesele voastre?", options: [
    { value: "neregulate", label: "Foarte neregulate, sar adesea mese", points: 0 },
    { value: "uneori-regulate", label: "Uneori regulate, alteori neregulate", points: 1 },
    { value: "relativ", label: "Relativ regulate (2–3 mese/zi)", points: 2 },
    { value: "regulate", label: "Regulate și echilibrate (3 mese + gustare)", points: 3 }
  ]},
  { id: "alimentatie-probiotice", label: "Cât de des consumați alimente probiotice (iaurt, kefir, varză murată)?", options: [
    { value: "deloc", label: "Deloc", points: 0 },
    { value: "rar", label: "Rareori", points: 1 },
    { value: "des", label: "De câteva ori pe săptămână", points: 2 },
    { value: "zilnic", label: "Zilnic", points: 3 }
  ]},
  { id: "alimentatie-cafeina", label: "Cât de mult cafeină consumați zilnic?", options: [
    { value: "mult", label: "Peste 3 cafele sau echivalent/zi", points: 0 },
    { value: "moderat", label: "2–3 cafele/zi", points: 1 },
    { value: "putin", label: "1 cafea/zi", points: 2 },
    { value: "deloc", label: "Deloc sau rareori", points: 3 }
  ]},
  { id: "alimentatie-alcool", label: "Cât de des consumați alcool?", options: [
    { value: "zilnic", label: "Zilnic", points: 0 },
    { value: "des", label: "De câteva ori pe săptămână", points: 1 },
    { value: "ocazional", label: "Ocazional (1–2 ori/lună)", points: 2 },
    { value: "deloc", label: "Deloc sau aproape deloc", points: 3 }
  ]},
  { id: "alimentatie-diversitate", label: "Cât de diversă este alimentația voastră?", options: [
    { value: "monotona", label: "Mănânc cam aceleași alimente", points: 0 },
    { value: "limitata", label: "Limitată, câteva variante", points: 1 },
    { value: "variata", label: "Variată, încerc alimente noi", points: 2 },
    { value: "diversa", label: "Foarte diversă, culori și tipuri diferite la fiecare masă", points: 3 }
  ]},
  // SECȚIUNEA 2: SOMN (max 24p — 8 întrebări × max 3p)
  { id: "somn-ore", label: "Câte ore dormiți în medie pe noapte?", options: [
    { value: "sub-5", label: "Sub 5 ore", points: 0 },
    { value: "5-6", label: "5–6 ore", points: 1 },
    { value: "6-7", label: "6–7 ore", points: 2 },
    { value: "7-9", label: "7–9 ore", points: 3 }
  ]},
  { id: "somn-adormire", label: "Cât de ușor adormiți?", options: [
    { value: "greu", label: "Greu, durează peste 45 de minute", points: 0 },
    { value: "dificil", label: "Dificil, 20–45 de minute", points: 1 },
    { value: "relativ", label: "Relativ ușor, 10–20 de minute", points: 2 },
    { value: "usor", label: "Ușor, sub 10 minute", points: 3 }
  ]},
  { id: "somn-odihnita", label: "Cât de odihnit(ă) vă simțiți dimineața?", options: [
    { value: "epuizat", label: "Epuizat(ă), nu mă refac niciodată", points: 0 },
    { value: "obosit", label: "Obosit(ă) de obicei", points: 1 },
    { value: "relativ", label: "Relativ odihnit(ă)", points: 2 },
    { value: "revigorat", label: "Revigorat(ă) și cu energie", points: 3 }
  ]},
  { id: "somn-program", label: "Cât de consistent este programul vostru de somn?", options: [
    { value: "haotic", label: "Haotic, mă culc și mă trezesc la ore foarte variate", points: 0 },
    { value: "neregulat", label: "Neregulat, cu variații de 2+ ore", points: 1 },
    { value: "relativ", label: "Relativ regulat, cu variații de 1 oră", points: 2 },
    { value: "regulat", label: "Consistent, aceeași oră +/- 30 de minute", points: 3 }
  ]},
  { id: "somn-ecrane", label: "Cât de des folosiți telefon/ecrane înainte de somn?", options: [
    { value: "pana-adorm", label: "Până adorm, mereu", points: 0 },
    { value: "cu-30-min", label: "Le opresc cu 30 de minute înainte", points: 1 },
    { value: "cu-1-ora", label: "Le opresc cu 1 oră înainte", points: 2 },
    { value: "nu-folosesc", label: "Nu folosesc ecrane seara", points: 3 }
  ]},
  { id: "somn-treziri", label: "Cât de des vă treziți noaptea?", options: [
    { value: "des", label: "Des, de mai multe ori pe noapte", points: 0 },
    { value: "uneori", label: "Uneori, 1–2 ori pe noapte", points: 1 },
    { value: "rar", label: "Rar, ocazional", points: 2 },
    { value: "deloc", label: "Aproape deloc", points: 3 }
  ]},
  { id: "somn-mediu-camera", label: "Cât de favorabil este mediul din camera de somn?", options: [
    { value: "nefavorabil", label: "Luminoasă, zgomotoasă, caldă", points: 0 },
    { value: "partial", label: "Parțial favorabil", points: 1 },
    { value: "bun", label: "Relativ întunecat și liniștit", points: 2 },
    { value: "ideal", label: "Întunecat complet, răcoros și liniștit", points: 3 }
  ]},
  { id: "somn-ritualuri", label: "Aveți ritualuri relaxante înainte de somn?", options: [
    { value: "nu", label: "Nu, mă duc direct la culcare", points: 0 },
    { value: "rar", label: "Uneori, dar nu constant", points: 1 },
    { value: "des", label: "De obicei da", points: 2 },
    { value: "mereu", label: "Mereu, am o rutină stabilă de seară", points: 3 }
  ]},
  // SECȚIUNEA 3: STRES ȘI EMOȚII (max 18p — 6 întrebări × max 3p)
  { id: "stres-nivel", label: "Cât de ridicat este nivelul vostru de stres zilnic?", options: [
    { value: "f-ridicat", label: "Foarte ridicat, constant copleșit(ă)", points: 0 },
    { value: "ridicat", label: "Ridicat, stresul este prezent zilnic", points: 1 },
    { value: "moderat", label: "Moderat, gestionabil", points: 2 },
    { value: "scazut", label: "Scăzut, mă simt echilibrat(ă)", points: 3 }
  ]},
  { id: "stres-relaxare", label: "Cât de des practicați tehnici de relaxare (meditație, respirație, yoga)?", options: [
    { value: "deloc", label: "Deloc", points: 0 },
    { value: "rar", label: "Rareori, din întâmplare", points: 1 },
    { value: "uneori", label: "Uneori, câteva ori pe săptămână", points: 2 },
    { value: "regulat", label: "Regulat, parte din rutina mea", points: 3 }
  ]},
  { id: "stres-echilibru-emotional", label: "Cât de echilibrat(ă) vă simțiți emoțional în general?", options: [
    { value: "dezechilibrat", label: "Dezechilibrat(ă), cu fluctuații mari", points: 0 },
    { value: "uneori", label: "Uneori echilibrat(ă), alteori nu", points: 1 },
    { value: "relativ", label: "Relativ echilibrat(ă)", points: 2 },
    { value: "echilibrat", label: "Echilibrat(ă) și calm(ă) de obicei", points: 3 }
  ]},
  { id: "stres-deconectare", label: "Cât de des aveți momente de deconectare totală (fără gânduri la muncă/probleme)?", options: [
    { value: "deloc", label: "Niciodată, mintea mea nu se oprește", points: 0 },
    { value: "rar", label: "Rareori", points: 1 },
    { value: "uneori", label: "Uneori, câteva momente pe zi", points: 2 },
    { value: "des", label: "Des, știu să mă deconectez", points: 3 }
  ]},
  { id: "stres-bucurie", label: "Cât de des faceți activități care vă aduc bucurie și relaxare?", options: [
    { value: "deloc", label: "Rareori sau deloc", points: 0 },
    { value: "rar", label: "Uneori, fără regularitate", points: 1 },
    { value: "des", label: "De câteva ori pe săptămână", points: 2 },
    { value: "zilnic", label: "Zilnic, este parte din rutina mea", points: 3 }
  ]},
  { id: "stres-gestionare", label: "Cât de bine gestionați situațiile dificile sau conflictele?", options: [
    { value: "dificil", label: "Greu, mă simt copleșit(ă) adesea", points: 0 },
    { value: "uneori", label: "Uneori bine, alteori nu", points: 1 },
    { value: "relativ", label: "Relativ bine, dar uneori durează", points: 2 },
    { value: "bine", label: "Bine, am strategii clare", points: 3 }
  ]},
  // SECȚIUNEA 4: MIȘCARE (max 27p — 9 întrebări × max 3p)
  { id: "miscare-frecventa", label: "Cât de des faceți mișcare sau sport?", options: [
    { value: "deloc", label: "Deloc sau aproape deloc", points: 0 },
    { value: "rar", label: "Rareori (1 dată/săptămână)", points: 1 },
    { value: "des", label: "De câteva ori pe săptămână (2–4 ori)", points: 2 },
    { value: "zilnic", label: "Zilnic sau aproape zilnic", points: 3 }
  ]},
  { id: "miscare-ecrane-zi", label: "Cât de mult timp petreceți la ecrane zilnic (TV, telefon, calculator)?", options: [
    { value: "8-plus", label: "Peste 8 ore/zi", points: 0 },
    { value: "5-8", label: "5–8 ore/zi", points: 1 },
    { value: "2-5", label: "2–5 ore/zi", points: 2 },
    { value: "sub-2", label: "Sub 2 ore/zi", points: 3 }
  ]},
  { id: "miscare-aer-liber", label: "Cât de des ieșiți în aer liber (parc, natură, plimbare)?", options: [
    { value: "rar", label: "Rareori", points: 0 },
    { value: "uneori", label: "1–2 ori pe săptămână", points: 1 },
    { value: "des", label: "De câteva ori pe săptămână", points: 2 },
    { value: "zilnic", label: "Zilnic", points: 3 }
  ]},
  { id: "miscare-pauze-active", label: "Cât de des faceți pauze active în timpul zilei (stretching, mers scurt)?", options: [
    { value: "deloc", label: "Deloc, stau ore întregi fără să mă mișc", points: 0 },
    { value: "rar", label: "Rareori, din întâmplare", points: 1 },
    { value: "uneori", label: "Uneori, câteva pauze pe zi", points: 2 },
    { value: "regulat", label: "Regulat, la fiecare oră aproximativ", points: 3 }
  ]},
  { id: "miscare-tip", label: "Ce tip de mișcare practicați cel mai des?", options: [
    { value: "deloc", label: "Niciun tip de mișcare", points: 0 },
    { value: "usor", label: "Mers pe jos ocazional", points: 1 },
    { value: "cardio-moderat", label: "Cardio moderat (mers alert, dans, ciclism)", points: 2 },
    { value: "variat-intens", label: "Variat și intens (yoga + cardio + forță)", points: 3 }
  ]},
  { id: "miscare-stat-jos", label: "Câte ore pe zi stați în cea mai mare parte jos (la birou, în mașinâ)?", options: [
    { value: "10-plus", label: "Peste 10 ore/zi", points: 0 },
    { value: "7-10", label: "7–10 ore/zi", points: 1 },
    { value: "4-7", label: "4–7 ore/zi", points: 2 },
    { value: "sub-4", label: "Sub 4 ore/zi", points: 3 }
  ]},
  { id: "miscare-stretching", label: "Cât de des faceți stretching sau exerciții de flexibilitate?", options: [
    { value: "deloc", label: "Deloc", points: 0 },
    { value: "rar", label: "Rareori", points: 1 },
    { value: "uneori", label: "De câteva ori pe săptămână", points: 2 },
    { value: "zilnic", label: "Zilnic", points: 3 }
  ]},
  { id: "miscare-intensitate", label: "Cât de intense sunt în general sesiunile voastre de mișcare?", options: [
    { value: "nici-una", label: "Nu fac mișcare", points: 0 },
    { value: "usoara", label: "Ușoară (mers pe jos lent)", points: 1 },
    { value: "moderata", label: "Moderată (transpir ușor)", points: 2 },
    { value: "intensa", label: "Intensă (transpir, puls crescut)", points: 3 }
  ]},
  { id: "miscare-mers-zilnic", label: "Câți pași faceți în medie zilnic?", options: [
    { value: "sub-2000", label: "Sub 2.000 de pași", points: 0 },
    { value: "2000-5000", label: "2.000–5.000 de pași", points: 1 },
    { value: "5000-8000", label: "5.000–8.000 de pași", points: 2 },
    { value: "peste-8000", label: "Peste 8.000 de pași", points: 3 }
  ]}
];

const lifestyleTemplate = {
  slug: "lifestyle-insight",
  title: "Lifestyle Insight — Stil de Viață și Piele",
  kind: "choice-sum",
  audience: "client",
  deliveryMode: "public",
  status: "active",
  description: "Chestionar complet de evaluare a stilului de viață cu impact direct asupra sănătății pielii. 4 secțiuni: Alimentație (0-30p), Somn (0-24p), Stres și Emoții (0-18p), Mișcare (0-27p). Total: 0-99p. Interpretare per secțiune și totală.",
  sourceRefs: [
    "interpretari stil de viata clienti .docx",
    "interpretari profesionale chestionar stil de viata .docx"
  ],
  definition: {
    questions: lifestyleQuestions,
    bands: [
      {
        min: 0, max: 33,
        label: "Stil de viață cu impact negativ asupra pielii",
        summary: "Stilul de viață actual generează inflamație cronică, barieră cutanată compromisă și regenerare lentă. Pielea este predispusă la sensibilitate, acnee inflamatorie, roșeață și vindecare lentă.",
        recommendation: "Prioritate: alimentație antiinflamatorie, hidratare 2L/zi, somn 7–9h regulat. Reduceți zahărul și alimentele procesate. Introduceți tehnici de gestionare a stresului. Tratamente blânde în cabinet: masaj limfatic, LED, hidratare profundă. Evitați exfolierile puternice și procedurile invazive până la reechilibrare."
      },
      {
        min: 34, max: 66,
        label: "Stil de viață echilibrat cu ajustări necesare",
        summary: "Aveți obiceiuri bune, dar inconsistente. Pielea prezintă fluctuații — arată bine în perioadele echilibrate și reacționează în perioadele de stres sau somn insuficient.",
        recommendation: "Consolidați obiceiurile pozitive: regularitate la mese, program de somn consistent, mișcare 3 ori/săptămână. Se pot introduce exfolieri ușoare, oxigenare și hidratare profundă în cabinet. Recomandați reducerea zahărului pentru uniformizarea pielii."
      },
      {
        min: 67, max: 99,
        label: "Stil de viață excelent pentru sănătatea pielii",
        summary: "Inflamație scăzută, regenerare excelentă, barieră cutanată echilibrată. Pielea răspunde rapid la tratamente și prezintă luminozitate naturală.",
        recommendation: "Mențineți obiceiurile curente. Se pot folosi tratamente avansate: acizi, microneedling, RF, protocoale anti-age. Ideal pentru planuri de tratament pe termen lung cu rezultate excelente."
      }
    ]
  }
};

/* ─────────────────────────────────────────────────────────────
   MAIN SEED LOGIC
───────────────────────────────────────────────────────────── */

const shouldReset = process.argv.includes("--reset");

await connectMongo();
const { QuestionnaireTemplate } = getModels();

const templates = [psoriazisTemplate, dermatitaTemplate, lifestyleTemplate];

console.log("\n🌿 Seed chestionare din surse — Insight Beauty\n");

for (const template of templates) {
  const existing = await QuestionnaireTemplate.findOne({ slug: template.slug }).lean().exec();

  if (existing && !shouldReset) {
    console.log(`  ⚠️  ${template.slug} — există deja (skip). Rulează cu --reset pentru suprascrie.`);
    continue;
  }

  if (existing && shouldReset) {
    await QuestionnaireTemplate.deleteOne({ slug: template.slug });
    console.log(`  🗑️  ${template.slug} — șters pentru reimport.`);
  }

  await QuestionnaireTemplate.create(template);
  console.log(`  ✅ ${template.slug} — importat (${template.definition.questions.length} întrebări, ${template.definition.bands.length} benzi).`);
}

console.log("\nFinalit. Chestionarele sunt disponibile în /admin/questionnaires pentru editare.\n");
process.exit(0);
