const fitzpatrickQuestions = [
  {
    id: "eyeColor",
    label: "Culoarea ochilor",
    options: [
      { value: "light-blue-gray-green", label: "Albastru deschis, gri, verde", points: 0 },
      { value: "blue", label: "Albastru", points: 1 },
      { value: "dark-blue", label: "Albastru inchis", points: 2 },
      { value: "brown", label: "Caprui", points: 3 },
      { value: "dark-brown-black", label: "Negri / brun inchis", points: 4 }
    ]
  },
  {
    id: "hairColor",
    label: "Culoarea naturala a parului",
    options: [
      { value: "red", label: "Roscat", points: 0 },
      { value: "blonde", label: "Blond", points: 1 },
      { value: "light-brown", label: "Saten deschis / inchis", points: 2 },
      { value: "chestnut", label: "Castaniu", points: 3 },
      { value: "dark-brown", label: "Brunet", points: 4 }
    ]
  },
  {
    id: "untannedSkin",
    label: "Culoarea tenului neexpus la soare",
    options: [
      { value: "very-fair", label: "Foarte deschis", points: 0 },
      { value: "fair", label: "Deschis", points: 1 },
      { value: "light-olive", label: "Masliniu deschis", points: 2 },
      { value: "light-brown", label: "Creol deschis", points: 3 },
      { value: "brown", label: "Creol", points: 4 }
    ]
  },
  {
    id: "freckles",
    label: "Pistrui",
    options: [
      { value: "many-all-face", label: "Foarte multi, pe toata fata", points: 0 },
      { value: "many-cheeks", label: "Multi, doar in zona pometilor", points: 1 },
      { value: "few", label: "Putini", points: 2 },
      { value: "very-few", label: "Foarte putini", points: 3 },
      { value: "none", label: "Fara", points: 4 }
    ]
  },
  {
    id: "sunburnReaction",
    label: "Reactia tenului dupa expunere indelungata la soare",
    options: [
      { value: "painful-burn-blisters-peeling", label: "Arsura dureroasa, pete pigmentare, vezicule, decojire", points: 0 },
      { value: "blisters-peeling", label: "Vezicule si decojire", points: 1 },
      { value: "peeling", label: "Doar decojire", points: 2 },
      { value: "rare-burns", label: "Arsuri rare", points: 3 },
      { value: "no-burns", label: "Fara arsuri", points: 4 }
    ]
  },
  {
    id: "tanningFrequency",
    label: "Cat de usor va bronzati",
    options: [
      { value: "never", label: "Niciodata", points: 0 },
      { value: "rarely", label: "Rar", points: 1 },
      { value: "sometimes", label: "Cateodata", points: 2 },
      { value: "often", label: "Des", points: 3 },
      { value: "always", label: "Intotdeauna", points: 4 }
    ]
  },
  {
    id: "tanIntensity",
    label: "Intensitatea bronzului obtinut",
    options: [
      { value: "none", label: "Fara bronz", points: 0 },
      { value: "light-short", label: "Bronz deschis, nu persista", points: 1 },
      { value: "medium-two-five-weeks", label: "Bronz mediu, relativ rezistent intre 2-5 saptamani", points: 2 },
      { value: "easy-two-four-months", label: "Bronz obtinut usor, persista 2-4 luni", points: 3 },
      { value: "fast-dark-long", label: "Bronzare rapida, culoare inchisa, persista pana la 9-12 luni", points: 4 }
    ]
  },
  {
    id: "sunSensitivity",
    label: "Sensibilitatea tenului la soare",
    options: [
      { value: "hypersensitive", label: "Hipersensibil", points: 0 },
      { value: "sensitive", label: "Sensibil", points: 1 },
      { value: "medium", label: "Mediu", points: 2 },
      { value: "resistant", label: "Rezistent", points: 3 },
      { value: "no-issues", label: "Fara probleme", points: 4 }
    ]
  },
  {
    id: "lastSunExposure",
    label: "Ultima expunere la soare sau solar",
    options: [
      { value: "under-three-months", label: "Sub 3 luni", points: 0 },
      { value: "two-three-months", label: "2-3 luni", points: 1 },
      { value: "one-two-months", label: "1-2 luni", points: 2 },
      { value: "one-month", label: "1 luna", points: 3 },
      { value: "two-weeks", label: "2 saptamani", points: 4 }
    ]
  },
  {
    id: "treatedAreaExposure",
    label: "Cat de des este expusa la soare zona tratata",
    options: [
      { value: "never", label: "Niciodata", points: 0 },
      { value: "rarely", label: "Rar", points: 1 },
      { value: "sometimes", label: "Cateodata", points: 2 },
      { value: "often", label: "Des", points: 3 },
      { value: "always", label: "Tot timpul", points: 4 }
    ]
  }
];

const acneQuestions = [
  {
    id: "comedones",
    label: "Numarul comedoanelor",
    options: [
      { value: "none", label: "Absente", points: 0 },
      { value: "few", label: "Cateva, pana la 5", points: 1 },
      { value: "moderate", label: "Moderat, 6-15", points: 2 },
      { value: "many", label: "Multe, peste 15", points: 3 }
    ]
  },
  {
    id: "papules",
    label: "Numarul papulelor",
    options: [
      { value: "none", label: "Absente", points: 0 },
      { value: "few", label: "Cateva, pana la 5", points: 1 },
      { value: "moderate", label: "Moderat, 6-15", points: 2 },
      { value: "many", label: "Multe, peste 15", points: 3 }
    ]
  },
  {
    id: "pustules",
    label: "Numarul pustulelor",
    options: [
      { value: "none", label: "Absente", points: 0 },
      { value: "few", label: "Cateva, pana la 5", points: 2 },
      { value: "moderate", label: "Moderat, 6-15", points: 3 },
      { value: "many", label: "Multe, peste 15", points: 4 }
    ]
  },
  {
    id: "cysts",
    label: "Numarul chisturilor",
    options: [
      { value: "none", label: "Absente", points: 0 },
      { value: "few", label: "1-2 chisturi", points: 3 },
      { value: "moderate", label: "3-5 chisturi", points: 4 },
      { value: "many", label: "Peste 5 chisturi", points: 5 }
    ]
  }
];

const baumannDimensions = {
  oiliness: {
    id: "oiliness",
    label: "O vs D",
    inputLabel: "Scor O/D",
    sourceRef: "raport baumann O vs D .docx",
    bands: [
      {
        min: 34,
        max: 44,
        code: "O",
        key: "oil-major",
        label: "Piele foarte grasa",
        summary: "Sebum abundent, pori dilatati si nevoie de control activ al secretiei de sebum."
      },
      {
        min: 27,
        max: 33,
        code: "O",
        key: "oil-tendency",
        label: "Piele usor grasa",
        summary: "Luciu moderat si predispozitie la incarcare in zona T."
      },
      {
        min: 17,
        max: 26,
        code: "D",
        key: "dry-tendency",
        label: "Piele usor uscata",
        summary: "Tendinta la senzatie de strangere si nevoie de hidratare profunda."
      },
      {
        min: 11,
        max: 16,
        code: "D",
        key: "dry-clear",
        label: "Piele uscata",
        summary: "Bariera fragila, descuamare si disconfort dupa curatare."
      }
    ]
  },
  sensitivity: {
    id: "sensitivity",
    label: "S vs R",
    inputLabel: "Scor S/R",
    sourceRef: "raport baumann S vs R.docx",
    bands: [
      {
        min: 34,
        max: 72,
        code: "S",
        key: "sensitive-major",
        label: "Piele foarte sensibila",
        summary: "Reactiva la produse, temperatura si stres; bariera necesita protocol bland."
      },
      {
        min: 30,
        max: 33,
        code: "S",
        key: "sensitive-light",
        label: "Piele oarecum sensibila",
        summary: "Rozeata ocazionala si nevoie de active cu toleranta controlata."
      },
      {
        min: 25,
        max: 29,
        code: "R",
        key: "resistant-light",
        label: "Piele oarecum rezistenta",
        summary: "Tolereaza active moderate, dar poate deveni sensibila prin supratratare."
      },
      {
        min: 17,
        max: 24,
        code: "R",
        key: "resistant-major",
        label: "Piele foarte rezistenta",
        summary: "Tolereaza bine proceduri intensive si active corectoare."
      }
    ]
  },
  pigmentation: {
    id: "pigmentation",
    label: "P vs N",
    inputLabel: "Scor P/N",
    sourceRef: "Raport baumann P vs N.docx",
    bands: [
      {
        min: 29,
        max: 52,
        code: "P",
        key: "pigmented",
        label: "Piele pigmentata",
        summary: "Predispozitie la hiperpigmentare si pete post-inflamatorii."
      },
      {
        min: 13,
        max: 28,
        code: "N",
        key: "non-pigmented",
        label: "Piele nepigmentata",
        summary: "Mai putina predispozitie la pete, dar necesita in continuare protectie UV."
      }
    ]
  },
  wrinkling: {
    id: "wrinkling",
    label: "T vs W",
    inputLabel: "Scor T/W",
    sourceRef: "raport baumann T vs W.docx",
    bands: [
      {
        min: 20,
        max: 40,
        code: "T",
        key: "tight",
        label: "Tight",
        summary: "Piele ferma, elasticitate buna si risc scazut de imbatranire prematura."
      },
      {
        min: 41,
        max: 85,
        code: "W",
        key: "wrinkled",
        label: "Wrinkled",
        summary: "Riduri vizibile, elasticitate scazuta si nevoie de protocol anti-age constant."
      }
    ]
  }
};

// ─── Lifestyle Insight ────────────────────────────────────────────────────────
// Source: Kit de consultatie profesionala (Didiu Amalia)
// Sections: Alimentatie, Somn, Stres, Miscare, Hidratare
// Scoring: 0–3p per item; overall bands based on total across all sections

const lifestyleQuestions = [
  // ── Alimentatie ──────────────────────────────────────────────────────────────
  {
    id: "smoking",
    label: "Fumezi?",
    section: "Alimentație",
    options: [
      { value: "yes", label: "Da", points: 0 },
      { value: "no", label: "Nu", points: 3 }
    ]
  },
  {
    id: "alcohol",
    label: "Consumi alcool?",
    section: "Alimentație",
    options: [
      { value: "daily", label: "Zilnic", points: 0 },
      { value: "weekly", label: "Săptămânal", points: 1 },
      { value: "monthly", label: "Lunar", points: 2 },
      { value: "rarely", label: "Rar", points: 3 }
    ]
  },
  {
    id: "coffee",
    label: "Câtă cafea bei pe zi?",
    section: "Alimentație",
    options: [
      { value: "none", label: "Nu beau", points: 3 },
      { value: "one", label: "1 cană", points: 2 },
      { value: "two", label: "2 căni", points: 1 },
      { value: "three-plus", label: "3+ căni", points: 0 }
    ]
  },
  {
    id: "food-intolerances",
    label: "Ai intoleranțe alimentare sau alergii?",
    section: "Alimentație",
    options: [
      { value: "yes", label: "Da", points: 1 },
      { value: "no", label: "Nu", points: 3 }
    ]
  },
  {
    id: "digestion",
    label: "Cum descrii digestia ta?",
    section: "Alimentație",
    options: [
      { value: "good", label: "Foarte bună", points: 1 },
      { value: "slow", label: "Lentă", points: 3 },
      { value: "sensitive", label: "Sensibilă (intoleranțe/reacții)", points: 0 },
      { value: "unsure", label: "Nu sunt sigură", points: 2 }
    ]
  },
  {
    id: "after-meal",
    label: "Cum te simți după ce mănânci, de obicei?",
    section: "Alimentație",
    options: [
      { value: "energized", label: "Energizată și ușoară", points: 3 },
      { value: "sleepy", label: "Somnolență", points: 2 },
      { value: "bloated", label: "Balonare / disconfort / arsuri / reflux", points: 0 },
      { value: "other", label: "Alte simptome", points: 1 }
    ]
  },
  {
    id: "fruits-veggies",
    label: "Consum zilnic fructe și legume proaspete?",
    section: "Alimentație",
    options: [
      { value: "every-meal", label: "Da, la fiecare masă", points: 3 },
      { value: "two-four", label: "De 2–4 ori pe zi", points: 2 },
      { value: "rarely", label: "Rareori sau deloc", points: 0 }
    ]
  },
  {
    id: "balanced-meals",
    label: "Mă asigur că mesele conțin surse sănătoase de proteine, carbohidrați și grăsimi?",
    section: "Alimentație",
    options: [
      { value: "always", label: "Întotdeauna", points: 3 },
      { value: "sometimes", label: "Uneori", points: 1 },
      { value: "rarely", label: "Rareori sau deloc", points: 0 }
    ]
  },
  {
    id: "processed-food",
    label: "Obișnuiesc să consum alimente procesate sau fast-food?",
    section: "Alimentație",
    options: [
      { value: "rarely", label: "Foarte rar sau deloc", points: 3 },
      { value: "occasionally", label: "Ocazional, de câteva ori pe lună", points: 1 },
      { value: "often", label: "Des, de mai multe ori pe săptămână", points: 0 }
    ]
  },
  {
    id: "sugar",
    label: "Evit consumul excesiv de zahăr (dulciuri, băuturi carbogazoase etc.)?",
    section: "Alimentație",
    options: [
      { value: "always", label: "Da, întotdeauna", points: 3 },
      { value: "sometimes", label: "Uneori", points: 1 },
      { value: "no", label: "Nu, consum frecvent", points: 0 }
    ]
  },
  {
    id: "meal-planning",
    label: "Îmi planific mesele pentru a evita mâncatul pe fugă?",
    section: "Alimentație",
    options: [
      { value: "always", label: "Da, mereu", points: 3 },
      { value: "sometimes", label: "Uneori, dar nu întotdeauna", points: 1 },
      { value: "no", label: "Nu, mănânc adesea pe fugă", points: 0 }
    ]
  },
  {
    id: "water-intake",
    label: "Consum de apă zilnic",
    section: "Alimentație",
    options: [
      { value: "under-1l", label: "Sub 1 L", points: 0 },
      { value: "one-to-1-5", label: "1–1.5 L", points: 1 },
      { value: "1-5-to-2", label: "1.5–2 L", points: 2 },
      { value: "over-2l", label: "2 L sau mai mult", points: 3 }
    ]
  },
  // ── Somn ─────────────────────────────────────────────────────────────────────
  {
    id: "sleep-quality",
    label: "Cum este somnul tău?",
    section: "Somn",
    options: [
      { value: "deep", label: "Dorm profund și mă trezesc odihnită", points: 3 },
      { value: "hard-to-fall", label: "Adorm greu", points: 0 },
      { value: "wake-night", label: "Mă trezesc noaptea", points: 0 },
      { value: "wake-early", label: "Mă trezesc devreme, fără motiv", points: 1 },
      { value: "tired", label: "Dorm suficient, dar mă simt obosită", points: 1 }
    ]
  },
  {
    id: "sleep-hours",
    label: "Dorm cel puțin 7–8 ore pe noapte?",
    section: "Somn",
    options: [
      { value: "always", label: "Da, întotdeauna", points: 3 },
      { value: "sometimes", label: "Uneori", points: 2 },
      { value: "rarely", label: "Rareori sau deloc", points: 0 }
    ]
  },
  {
    id: "wake-rested",
    label: "Mă trezesc odihnit/ă dimineața?",
    section: "Somn",
    options: [
      { value: "yes", label: "Da, de cele mai multe ori", points: 3 },
      { value: "sometimes", label: "Uneori", points: 2 },
      { value: "no", label: "Nu, aproape niciodată", points: 0 }
    ]
  },
  {
    id: "sleep-schedule",
    label: "Am un program de somn constant (adorm și mă trezesc la ore similare)?",
    section: "Somn",
    options: [
      { value: "always", label: "Da, întotdeauna", points: 3 },
      { value: "sometimes", label: "Uneori", points: 2 },
      { value: "no", label: "Nu, programul meu de somn este haotic", points: 0 }
    ]
  },
  {
    id: "phone-before-sleep",
    label: "Folosești telefonul înainte de culcare?",
    section: "Somn",
    options: [
      { value: "yes", label: "Da", points: 0 },
      { value: "sometimes", label: "Uneori", points: 1 },
      { value: "rarely", label: "Rar", points: 2 },
      { value: "never", label: "Niciodată", points: 3 }
    ]
  },
  {
    id: "insomnia",
    label: "Ai insomnii?",
    section: "Somn",
    options: [
      { value: "often", label: "Frecvent", points: 0 },
      { value: "sometimes", label: "Uneori", points: 1 },
      { value: "rarely", label: "Rar", points: 2 },
      { value: "never", label: "Niciodată", points: 3 }
    ]
  },
  {
    id: "sleep-environment",
    label: "Creez un mediu relaxant pentru somn (lumină redusă, temperatură confortabilă)?",
    section: "Somn",
    options: [
      { value: "always", label: "Da, întotdeauna", points: 3 },
      { value: "sometimes", label: "Uneori", points: 2 },
      { value: "no", label: "Nu, nu acord atenție acestui aspect", points: 0 }
    ]
  },
  // ── Stres și emoții ───────────────────────────────────────────────────────────
  {
    id: "stress-management",
    label: "Cum simți că gestionezi stresul?",
    section: "Stres și emoții",
    options: [
      { value: "easily", label: "Mă adaptez ușor", points: 3 },
      { value: "imbalance", label: "Dezechilibru emoțional", points: 2 },
      { value: "anxiety", label: "Anxietate / tensiune / furie / epuizare psihică", points: 0 }
    ]
  },
  {
    id: "stressed-often",
    label: "Mă simt stresată sau copleșită în mod frecvent?",
    section: "Stres și emoții",
    options: [
      { value: "rarely", label: "Rareori sau deloc", points: 3 },
      { value: "sometimes", label: "Uneori", points: 2 },
      { value: "often", label: "Des sau zilnic", points: 0 }
    ]
  },
  {
    id: "body-connection",
    label: "Te simți conectată cu corpul tău?",
    section: "Stres și emoții",
    options: [
      { value: "no", label: "Nu", points: 0 },
      { value: "sometimes", label: "Uneori", points: 1 },
      { value: "yes", label: "Da", points: 3 }
    ]
  },
  {
    id: "stress-practices",
    label: "Am practici regulate care mă ajută să gestionez stresul (yoga, meditație, respirație)?",
    section: "Stres și emoții",
    options: [
      { value: "daily", label: "Da, zilnic sau aproape zilnic", points: 3 },
      { value: "sometimes", label: "Uneori, dar nu constant", points: 2 },
      { value: "no", label: "Nu, nu am astfel de practici", points: 0 }
    ]
  },
  {
    id: "joy-time",
    label: "Îmi acord timp pentru activități care îmi aduc bucurie sau relaxare?",
    section: "Stres și emoții",
    options: [
      { value: "daily", label: "Da, zilnic", points: 3 },
      { value: "sometimes", label: "Uneori", points: 2 },
      { value: "no", label: "Nu, aproape niciodată", points: 0 }
    ]
  },
  {
    id: "positive-focus",
    label: "Reușesc să mă concentrez pe lucrurile pozitive din viața mea?",
    section: "Stres și emoții",
    options: [
      { value: "yes", label: "Da, de cele mai multe ori", points: 3 },
      { value: "sometimes", label: "Uneori", points: 2 },
      { value: "no", label: "Nu, mă focusez adesea pe negativ", points: 0 }
    ]
  },
  // ── Mișcare fizică ────────────────────────────────────────────────────────────
  {
    id: "exercise",
    label: "Fac exerciții fizice de cel puțin 3 ori pe săptămână?",
    section: "Mișcare fizică",
    options: [
      { value: "yes", label: "Da, în mod constant", points: 3 },
      { value: "sometimes", label: "Uneori", points: 2 },
      { value: "rarely", label: "Rareori sau deloc", points: 0 }
    ]
  },
  {
    id: "outdoor-time",
    label: "Petrec timp în aer liber sau în natură?",
    section: "Mișcare fizică",
    options: [
      { value: "often", label: "Da, frecvent", points: 3 },
      { value: "sometimes", label: "Uneori", points: 2 },
      { value: "rarely", label: "Rareori sau deloc", points: 0 }
    ]
  },
  {
    id: "walking",
    label: "Aleg să folosesc scările sau să merg pe jos în locul altor mijloace de transport?",
    section: "Mișcare fizică",
    options: [
      { value: "often", label: "Da, frecvent", points: 3 },
      { value: "sometimes", label: "Uneori", points: 2 },
      { value: "rarely", label: "Rareori sau deloc", points: 0 }
    ]
  },
  {
    id: "active-breaks",
    label: "Fac pauze active în timpul zilei (ex: întindere, plimbare)?",
    section: "Mișcare fizică",
    options: [
      { value: "yes", label: "Da, de fiecare dată", points: 3 },
      { value: "sometimes", label: "Uneori", points: 2 },
      { value: "no", label: "Nu, aproape niciodată", points: 0 }
    ]
  },
  {
    id: "exercise-energy",
    label: "Simt că mișcarea fizică mă ajută să mă relaxez și să mă încarc cu energie?",
    section: "Mișcare fizică",
    options: [
      { value: "yes", label: "Da, întotdeauna", points: 3 },
      { value: "sometimes", label: "Uneori", points: 2 },
      { value: "rarely", label: "Rareori sau deloc", points: 0 }
    ]
  },
  {
    id: "sedentarism",
    label: "Ore de sedentarism pe zi",
    section: "Mișcare fizică",
    options: [
      { value: "8plus", label: "8 ore sau mai mult", points: 0 },
      { value: "6-8", label: "6–8 ore", points: 1 },
      { value: "3-6", label: "3–6 ore", points: 2 },
      { value: "under-3", label: "Sub 3 ore", points: 3 }
    ]
  },
  {
    id: "screen-time",
    label: "Timp petrecut la ecrane (TV, laptop, tabletă, telefon) pe zi",
    section: "Mișcare fizică",
    options: [
      { value: "8plus", label: "8 ore sau mai mult", points: 0 },
      { value: "6-8", label: "6–8 ore", points: 1 },
      { value: "3-6", label: "3–6 ore", points: 2 },
      { value: "under-3", label: "Sub 3 ore", points: 3 }
    ]
  },
  {
    id: "morning-light",
    label: "Expunere la lumină naturală dimineața",
    section: "Mișcare fizică",
    options: [
      { value: "never", label: "Niciodată", points: 0 },
      { value: "rarely", label: "Rar", points: 1 },
      { value: "sometimes", label: "Uneori", points: 2 },
      { value: "daily", label: "Zilnic", points: 3 }
    ]
  },
  {
    id: "sweating",
    label: "Transpirație abundentă",
    section: "Mișcare fizică",
    options: [
      { value: "often", label: "Frecvent", points: 0 },
      { value: "sometimes", label: "Uneori", points: 1 },
      { value: "rarely", label: "Rar", points: 2 },
      { value: "almost-never", label: "Aproape deloc", points: 3 }
    ]
  },
  {
    id: "sweat-odor",
    label: "Miros înțepător al transpirației",
    section: "Mișcare fizică",
    options: [
      { value: "yes", label: "Da", points: 0 },
      { value: "sometimes", label: "Uneori", points: 1 },
      { value: "rarely", label: "Rar", points: 2 },
      { value: "never", label: "Niciodată", points: 3 }
    ]
  },
  // ── Hidratare internă și externă ──────────────────────────────────────────────
  {
    id: "thirst",
    label: "Cât de des simți senzația de sete pe parcursul zilei?",
    section: "Hidratare",
    options: [
      { value: "often", label: "Frecvent, beau abia când mi se face sete", points: 0 },
      { value: "sometimes", label: "Uneori", points: 1 },
      { value: "rarely", label: "Rar", points: 2 },
      { value: "almost-never", label: "Aproape niciodată (mă hidratez constant)", points: 3 }
    ]
  },
  {
    id: "urine-color",
    label: "Ce culoare are urina ta, de obicei?",
    section: "Hidratare",
    options: [
      { value: "dark-yellow", label: "Galben închis", points: 0 },
      { value: "intense-yellow", label: "Galben intens", points: 1 },
      { value: "light-yellow", label: "Galben deschis", points: 2 },
      { value: "transparent", label: "Aproape transparentă", points: 3 }
    ]
  },
  {
    id: "dehydrating-drinks",
    label: "Consumi lichide care deshidratează (cafea, sucuri, băuturi carbogazoase, energizante)?",
    section: "Hidratare",
    options: [
      { value: "daily", label: "Zilnic", points: 0 },
      { value: "few-week", label: "De câteva ori pe săptămână", points: 1 },
      { value: "occasionally", label: "Ocazional", points: 2 },
      { value: "rarely", label: "Foarte rar sau deloc", points: 3 }
    ]
  },
  {
    id: "water-rich-food",
    label: "Consumi alimente bogate în apă (supe, legume, fructe)?",
    section: "Hidratare",
    options: [
      { value: "rarely", label: "Rareori", points: 0 },
      { value: "occasionally", label: "Ocazional", points: 1 },
      { value: "daily-not-constant", label: "Zilnic, dar nu constant", points: 2 },
      { value: "daily-constant", label: "Zilnic și constant", points: 3 }
    ]
  },
  {
    id: "skin-after-wash",
    label: "După spălarea feței, fără produse aplicate, pielea ta se simte:",
    section: "Hidratare",
    options: [
      { value: "tight-uncomfortable", label: "Strânsă, inconfortabilă", points: 0 },
      { value: "slightly-tight", label: "Ușor strânsă", points: 1 },
      { value: "comfortable", label: "Confortabilă", points: 2 },
      { value: "comfortable-supple", label: "Confortabilă și suplă", points: 3 }
    ]
  },
  {
    id: "moisturizer-routine",
    label: "Folosești produse hidratante zilnic (ser, cremă, mască)?",
    section: "Hidratare",
    options: [
      { value: "rarely", label: "Nu, foarte rar", points: 0 },
      { value: "occasionally", label: "Doar ocazional", points: 1 },
      { value: "daily-one", label: "Zilnic, dar un singur produs", points: 2 },
      { value: "daily-routine", label: "Zilnic, în rutină completă (ser + cremă)", points: 3 }
    ]
  },
  {
    id: "adapted-products",
    label: "Folosești produse adaptate tipului tău de piele?",
    section: "Hidratare",
    options: [
      { value: "dont-know", label: "Nu știu ce tip de piele am", points: 0 },
      { value: "whatever", label: "Folosesc ce am la îndemână", points: 1 },
      { value: "partially", label: "Parțial adaptate", points: 2 },
      { value: "personalized", label: "Da, sunt personalizate pentru mine", points: 3 }
    ]
  },
  {
    id: "skin-during-day",
    label: "Cum reacționează pielea ta pe parcursul zilei?",
    section: "Hidratare",
    options: [
      { value: "dry-dull", label: "Devine uscată, ternă, inconfortabilă", points: 0 },
      { value: "sometimes-dry", label: "Uneori se usucă, alteori este ok", points: 1 },
      { value: "comfortable", label: "Se menține confortabilă", points: 2 },
      { value: "supple-luminous", label: "Rămâne suplă, elastică, luminoasă", points: 3 }
    ]
  },
  {
    id: "sunscreen-daily",
    label: "Folosești protecție solară zilnic?",
    section: "Hidratare",
    options: [
      { value: "no", label: "Nu", points: 0 },
      { value: "only-summer", label: "Doar vara", points: 1 },
      { value: "only-beach", label: "Doar la plajă", points: 1 },
      { value: "daily", label: "Zilnic", points: 3 }
    ]
  }
];

// ─── Dermatitis Screening ──────────────────────────────────────────────────────
// Source: Kit de consultatie profesionala (Didiu Amalia)
// 36 questions · Bands: 0–30 (ușoară/absentă), 31–60 (moderată), 61+ (severă)

const dermatitisQuestions = [
  {
    id: "d-age",
    label: "Vârsta",
    section: "Informații Personale",
    options: [
      { value: "under-20", label: "Sub 20 de ani", points: 2 },
      { value: "20-40", label: "20–40 de ani", points: 2 },
      { value: "41-60", label: "41–60 de ani", points: 3 },
      { value: "over-60", label: "Peste 60 de ani", points: 4 }
    ]
  },
  {
    id: "d-sex",
    label: "Sex",
    section: "Informații Personale",
    options: [
      { value: "female", label: "Feminin", points: 2 },
      { value: "male", label: "Masculin", points: 2 },
      { value: "other", label: "Altă opțiune", points: 2 }
    ]
  },
  {
    id: "d-occupation",
    label: "Ocupație",
    section: "Informații Personale",
    options: [
      { value: "office", label: "Birou", points: 1 },
      { value: "manual", label: "Lucru manual", points: 2 },
      { value: "outdoor", label: "În aer liber", points: 3 },
      { value: "other", label: "Altă ocupație", points: 1 }
    ]
  },
  {
    id: "d-blood-type",
    label: "Grupă sanguină (dacă este cunoscută)",
    section: "Informații Personale",
    options: [
      { value: "O", label: "O", points: 1 },
      { value: "A", label: "A", points: 2 },
      { value: "B", label: "B", points: 2 },
      { value: "AB", label: "AB", points: 2 },
      { value: "unknown", label: "Nu cunosc", points: 0 }
    ]
  },
  {
    id: "d-allergy-history",
    label: "Istoric de alergii personale sau în familie",
    section: "Informații Personale",
    options: [
      { value: "no", label: "Nu", points: 0 },
      { value: "minor", label: "Da, alergii minore", points: 2 },
      { value: "severe", label: "Da, alergii severe", points: 4 }
    ]
  },
  {
    id: "d-cancer-family",
    label: "Istoric de cancer în familie (inclusiv cancer de piele)",
    section: "Informații Personale",
    options: [
      { value: "no", label: "Nu", points: 0 },
      { value: "yes", label: "Da", points: 3 }
    ]
  },
  {
    id: "d-smoking",
    label: "Fumați?",
    section: "Stilul de Viață",
    options: [
      { value: "no", label: "Nu", points: 0 },
      { value: "occasionally", label: "Ocazional", points: 2 },
      { value: "regularly", label: "Regulat", points: 4 }
    ]
  },
  {
    id: "d-sun-exposure",
    label: "Expunere la soare",
    section: "Stilul de Viață",
    options: [
      { value: "rarely", label: "Rareori", points: 1 },
      { value: "occasionally", label: "Ocazional", points: 2 },
      { value: "often", label: "Des", points: 3 }
    ]
  },
  {
    id: "d-stress",
    label: "Nivelul de stres zilnic",
    section: "Stilul de Viață",
    options: [
      { value: "low", label: "Scăzut", points: 1 },
      { value: "medium", label: "Mediu", points: 2 },
      { value: "high", label: "Ridicat", points: 3 }
    ]
  },
  {
    id: "d-exercise",
    label: "Activitate fizică regulată",
    section: "Stilul de Viață",
    options: [
      { value: "no", label: "Nu", points: 1 },
      { value: "1-2", label: "1–2 zile pe săptămână", points: 2 },
      { value: "3plus", label: "3 zile sau mai mult pe săptămână", points: 3 }
    ]
  },
  {
    id: "d-sleep-quality",
    label: "Calitatea somnului",
    section: "Stilul de Viață",
    options: [
      { value: "good", label: "Bună", points: 0 },
      { value: "medium", label: "Medie", points: 2 },
      { value: "poor", label: "Slabă", points: 4 }
    ]
  },
  {
    id: "d-chemical-exposure",
    label: "Expozitia la substanțe chimice sau toxice",
    section: "Stilul de Viață",
    options: [
      { value: "no", label: "Nu", points: 0 },
      { value: "occasionally", label: "Da, ocazional", points: 2 },
      { value: "often", label: "Da, frecvent", points: 4 }
    ]
  },
  {
    id: "d-cosmetics",
    label: "Utilizarea regulată a cosmeticelor sau produselor de îngrijire personală",
    section: "Stilul de Viață",
    options: [
      { value: "no", label: "Nu", points: 0 },
      { value: "some", label: "Da, unele produse", points: 1 },
      { value: "many", label: "Da, multe produse", points: 2 }
    ]
  },
  {
    id: "d-caffeine",
    label: "Consum de cafeină",
    section: "Stilul de Viață",
    options: [
      { value: "no", label: "Nu", points: 0 },
      { value: "1-2", label: "1–2 porții pe zi", points: 1 },
      { value: "over-2", label: "Peste 2 porții pe zi", points: 2 }
    ]
  },
  {
    id: "d-skin-history",
    label: "Ați avut probleme de piele în trecut?",
    section: "Istoric Medical",
    options: [
      { value: "no", label: "Nu", points: 0 },
      { value: "mild", label: "Da, condiții ușoare", points: 2 },
      { value: "severe", label: "Da, condiții severe", points: 4 }
    ]
  },
  {
    id: "d-dermatitis-family",
    label: "Există cazuri de dermatită sau alte afecțiuni ale pielii în familie?",
    section: "Istoric Medical",
    options: [
      { value: "no", label: "Nu", points: 0 },
      { value: "unsure", label: "Nu sunt sigur(ă)", points: 1 },
      { value: "yes", label: "Da", points: 3 }
    ]
  },
  {
    id: "d-recent-treatment",
    label: "Tratamente medicale recente",
    section: "Istoric Medical",
    options: [
      { value: "no", label: "Nu", points: 0 },
      { value: "mild", label: "Da, tratamente ușoare", points: 2 },
      { value: "intense", label: "Da, tratamente intense", points: 4 }
    ]
  },
  {
    id: "d-infectious-diseases",
    label: "Istoric de boli infecțioase",
    section: "Istoric Medical",
    options: [
      { value: "no", label: "Nu", points: 0 },
      { value: "yes", label: "Da", points: 2 }
    ]
  },
  {
    id: "d-drug-reactions",
    label: "Istoricul de reacții la medicamente",
    section: "Istoric Medical",
    options: [
      { value: "no", label: "Nu", points: 0 },
      { value: "minor", label: "Da, reacții minore", points: 2 },
      { value: "severe", label: "Da, reacții severe", points: 4 }
    ]
  },
  {
    id: "d-autoimmune",
    label: "Istoric de boli autoimune (inclusiv în familie)",
    section: "Istoric Medical",
    options: [
      { value: "no", label: "Nu", points: 0 },
      { value: "yes", label: "Da", points: 3 }
    ]
  },
  {
    id: "d-affected-areas",
    label: "Zonele afectate",
    section: "Simptome",
    options: [
      { value: "face", label: "Față", points: 2 },
      { value: "scalp", label: "Scalp", points: 2 },
      { value: "body", label: "Alte zone ale corpului", points: 2 },
      { value: "combined", label: "Combinat", points: 4 }
    ]
  },
  {
    id: "d-symptom-severity",
    label: "Severitatea simptomelor",
    section: "Simptome",
    options: [
      { value: "mild", label: "Ușoare", points: 1 },
      { value: "moderate", label: "Moderate", points: 2 },
      { value: "severe", label: "Severe", points: 3 }
    ]
  },
  {
    id: "d-symptom-duration",
    label: "Durata simptomelor",
    section: "Simptome",
    options: [
      { value: "under-week", label: "Mai puțin de o săptămână", points: 1 },
      { value: "week-month", label: "1 săptămână – 1 lună", points: 2 },
      { value: "over-month", label: "Peste 1 lună", points: 3 }
    ]
  },
  {
    id: "d-skin-changes",
    label: "Modificări în aspectul pielii",
    section: "Simptome",
    options: [
      { value: "no", label: "Nu", points: 0 },
      { value: "mild", label: "Da, ușoare", points: 2 },
      { value: "severe", label: "Da, severe", points: 4 }
    ]
  },
  {
    id: "d-itching",
    label: "Prezența mâncărimii",
    section: "Simptome",
    options: [
      { value: "no", label: "Nu", points: 0 },
      { value: "mild", label: "Da, ușoară", points: 1 },
      { value: "severe", label: "Da, severă", points: 3 }
    ]
  },
  {
    id: "d-color-changes",
    label: "Modificări în culoarea pielii",
    section: "Simptome",
    options: [
      { value: "no", label: "Nu", points: 0 },
      { value: "mild", label: "Da, ușoare", points: 2 },
      { value: "severe", label: "Da, severe", points: 4 }
    ]
  },
  {
    id: "d-allergenic-food",
    label: "Consumați alimente cunoscute pentru a provoca alergii?",
    section: "Alimentație și Dietă",
    options: [
      { value: "rarely", label: "Rareori", points: 1 },
      { value: "occasionally", label: "Ocazional", points: 2 },
      { value: "often", label: "Des", points: 3 }
    ]
  },
  {
    id: "d-alcohol",
    label: "Consum de alcool",
    section: "Alimentație și Dietă",
    options: [
      { value: "no", label: "Nu", points: 0 },
      { value: "occasionally", label: "Ocazional", points: 1 },
      { value: "regularly", label: "Regulat", points: 3 }
    ]
  },
  {
    id: "d-food-intolerance",
    label: "Istoric de intoleranță la anumite alimente",
    section: "Alimentație și Dietă",
    options: [
      { value: "no", label: "Nu", points: 0 },
      { value: "minor", label: "Da, intoleranță minoră", points: 2 },
      { value: "severe", label: "Da, intoleranță severă", points: 4 }
    ]
  },
  {
    id: "d-fast-food",
    label: "Consum de fast-food sau alimente procesate",
    section: "Alimentație și Dietă",
    options: [
      { value: "no", label: "Nu", points: 0 },
      { value: "occasionally", label: "Ocazional", points: 1 },
      { value: "often", label: "Frecvent", points: 3 }
    ]
  },
  {
    id: "d-weight-fluctuation",
    label: "Istoric de fluctuații în greutate",
    section: "Alimentație și Dietă",
    options: [
      { value: "no", label: "Nu", points: 0 },
      { value: "minor", label: "Da, fluctuații minore", points: 2 },
      { value: "major", label: "Da, fluctuații majore", points: 4 }
    ]
  },
  {
    id: "d-irritants",
    label: "Expunerea la substanțe iritante sau alergene",
    section: "Factori de Mediu",
    options: [
      { value: "rarely", label: "Rareori", points: 1 },
      { value: "occasionally", label: "Ocazional", points: 2 },
      { value: "often", label: "Des", points: 3 }
    ]
  },
  {
    id: "d-air-quality",
    label: "Calitatea aerului în locuință sau la locul de muncă",
    section: "Factori de Mediu",
    options: [
      { value: "good", label: "Bună", points: 0 },
      { value: "medium", label: "Medie", points: 2 },
      { value: "poor", label: "Proastă", points: 4 }
    ]
  },
  {
    id: "d-pets-pollen",
    label: "Expunere la animale de companie sau polen",
    section: "Factori de Mediu",
    options: [
      { value: "no", label: "Nu", points: 0 },
      { value: "no-symptoms", label: "Da, dar fără simptome", points: 1 },
      { value: "with-symptoms", label: "Da, cu simptome", points: 3 }
    ]
  },
  {
    id: "d-temperature",
    label: "Expozitie la variații mari de temperatură sau umiditate",
    section: "Factori de Mediu",
    options: [
      { value: "no", label: "Nu", points: 0 },
      { value: "occasionally", label: "Da, ocazional", points: 2 },
      { value: "often", label: "Da, frecvent", points: 4 }
    ]
  },
  {
    id: "d-pollution",
    label: "Locuire în zone cu poluare ridicată sau condiții meteorologice extreme",
    section: "Factori de Mediu",
    options: [
      { value: "no", label: "Nu", points: 0 },
      { value: "sometimes", label: "Da, uneori", points: 2 },
      { value: "often", label: "Da, frecvent", points: 4 }
    ]
  }
];

// ─── Psoriasis Screening ───────────────────────────────────────────────────────
// Source: Kit de consultatie profesionala (Didiu Amalia)
// 40 questions · Bands: 0–15 (ușor/absent), 16–30 (moderat), 31+ (sever)

const psoriasisQuestions = [
  {
    id: "p-age",
    label: "Vârsta",
    section: "Informații Personale",
    options: [
      { value: "under-20", label: "Sub 20 de ani", points: 1 },
      { value: "20-40", label: "20–40 de ani", points: 2 },
      { value: "41-60", label: "41–60 de ani", points: 3 },
      { value: "over-60", label: "Peste 60 de ani", points: 4 }
    ]
  },
  {
    id: "p-sex",
    label: "Sex",
    section: "Informații Personale",
    options: [
      { value: "female", label: "Feminin", points: 2 },
      { value: "male", label: "Masculin", points: 2 },
      { value: "other", label: "Altă opțiune", points: 2 }
    ]
  },
  {
    id: "p-family-history",
    label: "Istoric familial de psoriazis",
    section: "Informații Personale",
    options: [
      { value: "no", label: "Nu", points: 0 },
      { value: "yes", label: "Da", points: 4 }
    ]
  },
  {
    id: "p-blood-type",
    label: "Grupă sanguină (dacă este cunoscută)",
    section: "Informații Personale",
    options: [
      { value: "O", label: "O", points: 1 },
      { value: "A", label: "A", points: 2 },
      { value: "B", label: "B", points: 2 },
      { value: "AB", label: "AB", points: 2 },
      { value: "unknown", label: "Nu știu", points: 0 }
    ]
  },
  {
    id: "p-occupation",
    label: "Ocupație",
    section: "Informații Personale",
    options: [
      { value: "office", label: "Birou", points: 1 },
      { value: "manual", label: "Lucru manual", points: 2 },
      { value: "outdoor", label: "În aer liber", points: 3 },
      { value: "other", label: "Altă ocupație", points: 1 }
    ]
  },
  {
    id: "p-smoking",
    label: "Fumați?",
    section: "Stilul de Viață",
    options: [
      { value: "no", label: "Nu", points: 0 },
      { value: "occasionally", label: "Ocazional", points: 2 },
      { value: "regularly", label: "Regulat", points: 4 }
    ]
  },
  {
    id: "p-sun-exposure",
    label: "Expunere la soare (perioadă săptămânală)",
    section: "Stilul de Viață",
    options: [
      { value: "rarely", label: "Rareori (sub 2 ore)", points: 1 },
      { value: "occasionally", label: "Ocazional (2–5 ore)", points: 2 },
      { value: "often", label: "Des (peste 5 ore)", points: 3 }
    ]
  },
  {
    id: "p-stress",
    label: "Nivelul de stres zilnic (1–10)",
    section: "Stilul de Viață",
    options: [
      { value: "low", label: "1–3 (Scăzut)", points: 1 },
      { value: "medium", label: "4–7 (Mediu)", points: 2 },
      { value: "high", label: "8–10 (Ridicat)", points: 3 }
    ]
  },
  {
    id: "p-exercise",
    label: "Activitate fizică regulată",
    section: "Stilul de Viață",
    options: [
      { value: "no", label: "Nu", points: 1 },
      { value: "1-2", label: "1–2 zile pe săptămână", points: 2 },
      { value: "3plus", label: "3 zile sau mai mult pe săptămână", points: 3 }
    ]
  },
  {
    id: "p-sleep",
    label: "Calitatea somnului (ore și interval orar)",
    section: "Stilul de Viață",
    options: [
      { value: "good", label: "7–9 ore, regulat", points: 0 },
      { value: "medium", label: "5–7 ore, neregulat", points: 2 },
      { value: "poor", label: "Sub 5 ore, foarte neregulat", points: 4 }
    ]
  },
  {
    id: "p-chemical-exposure",
    label: "Expunerea la substanțe chimice sau toxice (ex: vopsele, detergenți, solvenți)",
    section: "Stilul de Viață",
    options: [
      { value: "no", label: "Nu", points: 0 },
      { value: "occasionally", label: "Da, ocazional", points: 2 },
      { value: "often", label: "Da, frecvent", points: 4 }
    ]
  },
  {
    id: "p-cosmetics",
    label: "Utilizarea regulată a cosmeticelor sau produselor de îngrijire personală",
    section: "Stilul de Viață",
    options: [
      { value: "no", label: "Nu", points: 0 },
      { value: "basic", label: "Produse de bază (șampon, săpun, pastă de dinți)", points: 1 },
      { value: "many", label: "Multe produse (creme, loțiuni, machiaj)", points: 2 }
    ]
  },
  {
    id: "p-caffeine",
    label: "Consum de cafeină",
    section: "Stilul de Viață",
    options: [
      { value: "no", label: "Nu", points: 0 },
      { value: "1-2", label: "1–2 porții pe zi", points: 1 },
      { value: "over-2", label: "Peste 2 porții pe zi", points: 2 }
    ]
  },
  {
    id: "p-fatty-sugar-diet",
    label: "Dietă bogată în grăsimi și zaharuri",
    section: "Stilul de Viață",
    options: [
      { value: "no", label: "Nu", points: 0 },
      { value: "occasionally", label: "Ocazional", points: 1 },
      { value: "regularly", label: "Regulat", points: 2 }
    ]
  },
  {
    id: "p-allergy-history",
    label: "Istoric de alergii personale sau în familie",
    section: "Istoric Medical",
    options: [
      { value: "no", label: "Nu", points: 0 },
      { value: "minor", label: "Da, alergii minore", points: 2 },
      { value: "severe", label: "Da, alergii severe (astm, reacții anafilactice)", points: 4 }
    ]
  },
  {
    id: "p-cancer-family",
    label: "Istoric de cancer în familie (inclusiv cancer de piele)",
    section: "Istoric Medical",
    options: [
      { value: "no", label: "Nu", points: 0 },
      { value: "yes", label: "Da", points: 3 }
    ]
  },
  {
    id: "p-skin-disease-family",
    label: "Istoric de afecțiuni ale pielii în familie (dermatite, acnee, rozacee, mătreață)",
    section: "Istoric Medical",
    options: [
      { value: "no", label: "Nu", points: 0 },
      { value: "yes", label: "Da", points: 3 }
    ]
  },
  {
    id: "p-recent-treatment",
    label: "Tratamente medicale recente (antibiotice, steroizi, alte medicamente)",
    section: "Istoric Medical",
    options: [
      { value: "no", label: "Nu", points: 0 },
      { value: "mild", label: "Da, tratamente ușoare", points: 2 },
      { value: "intense", label: "Da, tratamente intense (chimioterapie, terapie biologică)", points: 4 }
    ]
  },
  {
    id: "p-infectious-diseases",
    label: "Istoric de boli infecțioase (gripă, varicelă, hepatită)",
    section: "Istoric Medical",
    options: [
      { value: "no", label: "Nu", points: 0 },
      { value: "yes", label: "Da", points: 2 }
    ]
  },
  {
    id: "p-drug-reactions",
    label: "Istoricul de reacții la medicamente",
    section: "Istoric Medical",
    options: [
      { value: "no", label: "Nu", points: 0 },
      { value: "minor", label: "Da, reacții minore", points: 2 },
      { value: "severe", label: "Da, reacții severe (dificultăți respiratorii, angioedem)", points: 4 }
    ]
  },
  {
    id: "p-autoimmune-family",
    label: "Istoric de boli autoimune în familie (tiroidită Hashimoto, scleroză multiplă)",
    section: "Istoric Medical",
    options: [
      { value: "no", label: "Nu", points: 0 },
      { value: "yes", label: "Da", points: 3 }
    ]
  },
  {
    id: "p-affected-areas",
    label: "Zonele afectate",
    section: "Simptome",
    options: [
      { value: "face", label: "Față", points: 2 },
      { value: "scalp", label: "Scalp", points: 2 },
      { value: "body", label: "Alte zone ale corpului", points: 2 },
      { value: "combined", label: "Combinat", points: 4 }
    ]
  },
  {
    id: "p-plaques",
    label: "Plăci roșii și solzoase pe piele",
    section: "Simptome",
    options: [
      { value: "no", label: "Nu", points: 0 },
      { value: "minor", label: "Da, minore", points: 2 },
      { value: "severe", label: "Da, severe", points: 4 }
    ]
  },
  {
    id: "p-itching-burning",
    label: "Mâncărime sau senzație de arsură",
    section: "Simptome",
    options: [
      { value: "no", label: "Nu", points: 0 },
      { value: "mild", label: "Da, ușoare", points: 1 },
      { value: "severe", label: "Da, severe", points: 3 }
    ]
  },
  {
    id: "p-lesion-location",
    label: "Localizarea leziunilor",
    section: "Simptome",
    options: [
      { value: "scalp-elbows-knees", label: "Scalp, coate, genunchi", points: 2 },
      { value: "trunk-folds", label: "Trunchi, pliuri ale pielii", points: 3 },
      { value: "widespread", label: "Peste tot corpul", points: 4 }
    ]
  },
  {
    id: "p-symptom-duration",
    label: "Durata simptomelor",
    section: "Simptome",
    options: [
      { value: "under-week", label: "Mai puțin de o săptămână", points: 1 },
      { value: "week-month", label: "1 săptămână – 1 lună", points: 2 },
      { value: "over-month", label: "Peste 1 lună", points: 3 }
    ]
  },
  {
    id: "p-symptom-severity",
    label: "Severitatea simptomelor (roșeață ușoară, plăci solzoase extinse)",
    section: "Simptome",
    options: [
      { value: "mild", label: "Ușoare", points: 1 },
      { value: "moderate", label: "Moderate", points: 2 },
      { value: "severe", label: "Severe", points: 3 }
    ]
  },
  {
    id: "p-skin-appearance",
    label: "Modificări în aspectul pielii (descuamare ușoară, crăpături profunde)",
    section: "Simptome",
    options: [
      { value: "no", label: "Nu", points: 0 },
      { value: "mild", label: "Da, ușoare", points: 2 },
      { value: "severe", label: "Da, severe", points: 4 }
    ]
  },
  {
    id: "p-itching",
    label: "Prezența mâncărimii",
    section: "Simptome",
    options: [
      { value: "no", label: "Nu", points: 0 },
      { value: "mild", label: "Da, ușoară", points: 1 },
      { value: "severe", label: "Da, severă", points: 3 }
    ]
  },
  {
    id: "p-skin-color-changes",
    label: "Modificări în culoarea pielii (pete palide, hiperpigmentare)",
    section: "Simptome",
    options: [
      { value: "no", label: "Nu", points: 0 },
      { value: "mild", label: "Da, ușoare", points: 2 },
      { value: "severe", label: "Da, severe", points: 4 }
    ]
  },
  {
    id: "p-allergenic-food",
    label: "Consumați alimente cunoscute pentru a provoca alergii (lactate, gluten, nuci)?",
    section: "Alimentație și Dietă",
    options: [
      { value: "rarely", label: "Rareori", points: 1 },
      { value: "occasionally", label: "Ocazional", points: 2 },
      { value: "often", label: "Des", points: 3 }
    ]
  },
  {
    id: "p-alcohol",
    label: "Consum de alcool",
    section: "Alimentație și Dietă",
    options: [
      { value: "no", label: "Nu", points: 0 },
      { value: "occasionally", label: "Ocazional (maxim 1–2 ori pe săptămână)", points: 1 },
      { value: "regularly", label: "Regulat (mai mult de 2 ori pe săptămână)", points: 3 }
    ]
  },
  {
    id: "p-food-intolerance",
    label: "Istoric de intoleranță la anumite alimente (lactoză, gluten)",
    section: "Alimentație și Dietă",
    options: [
      { value: "no", label: "Nu", points: 0 },
      { value: "minor", label: "Da, intoleranță minoră", points: 2 },
      { value: "severe", label: "Da, intoleranță severă", points: 4 }
    ]
  },
  {
    id: "p-fast-food",
    label: "Consum de fast-food sau alimente procesate",
    section: "Alimentație și Dietă",
    options: [
      { value: "no", label: "Nu", points: 0 },
      { value: "occasionally", label: "Ocazional (1–2 ori pe săptămână)", points: 1 },
      { value: "often", label: "Frecvent (mai mult de 2 ori pe săptămână)", points: 3 }
    ]
  },
  {
    id: "p-weight-fluctuation",
    label: "Istoric de fluctuații în greutate",
    section: "Alimentație și Dietă",
    options: [
      { value: "no", label: "Nu", points: 0 },
      { value: "minor", label: "Da, fluctuații minore", points: 2 },
      { value: "major", label: "Da, fluctuații majore", points: 4 }
    ]
  },
  {
    id: "p-irritants",
    label: "Expunerea la substanțe iritante sau alergene (praf, parfumuri, polen)",
    section: "Factori de Mediu",
    options: [
      { value: "rarely", label: "Rareori", points: 1 },
      { value: "occasionally", label: "Ocazional", points: 2 },
      { value: "often", label: "Des", points: 3 }
    ]
  },
  {
    id: "p-air-quality",
    label: "Calitatea aerului în locuință sau la locul de muncă (praf, mucegai, fum)",
    section: "Factori de Mediu",
    options: [
      { value: "good", label: "Bună", points: 0 },
      { value: "medium", label: "Medie", points: 2 },
      { value: "poor", label: "Proastă", points: 4 }
    ]
  },
  {
    id: "p-pets-pollen",
    label: "Expunere la animale de companie sau polen",
    section: "Factori de Mediu",
    options: [
      { value: "no", label: "Nu", points: 0 },
      { value: "no-symptoms", label: "Da, dar fără simptome", points: 1 },
      { value: "with-symptoms", label: "Da, cu simptome", points: 3 }
    ]
  },
  {
    id: "p-temperature",
    label: "Expunere la variații mari de temperatură sau umiditate",
    section: "Factori de Mediu",
    options: [
      { value: "no", label: "Nu", points: 0 },
      { value: "occasionally", label: "Da, ocazional", points: 2 },
      { value: "often", label: "Da, frecvent", points: 4 }
    ]
  },
  {
    id: "p-pollution",
    label: "Locuire în zone cu poluare ridicată sau condiții meteorologice extreme",
    section: "Factori de Mediu",
    options: [
      { value: "no", label: "Nu", points: 0 },
      { value: "sometimes", label: "Da, uneori", points: 2 },
      { value: "often", label: "Da, frecvent", points: 4 }
    ]
  }
];

const baumannChoiceQuestions = [
  {
    id: "baumann-oiliness", axis: "O/D", section: "Profil Baumann",
    label: "La 2–3 ore după spălare, fără niciun produs aplicat, pielea ta:",
    options: [
      { value: "rough-flaky", label: "Este aspră, descuamată", points: 1 },
      { value: "tight-comfortable", label: "Este strânsă, dar confortabilă", points: 2 },
      { value: "hydrated-no-shine", label: "Este bine hidratată, fără luciu", points: 3 },
      { value: "strong-shine", label: "Este lucioasă, cu reflexii puternice", points: 4 }
    ]
  },
  {
    id: "baumann-sensitivity", axis: "S/R", section: "Profil Baumann",
    label: "Cum reacționează pielea ta la produse noi (cosmetice, parfumate)?",
    options: [
      { value: "never", label: "Aproape niciodată nu reacționează", points: 1 },
      { value: "rarely", label: "Rareori, doar la produse puternice", points: 2 },
      { value: "often", label: "Des apare roșeață sau usturime", points: 3 },
      { value: "almost-always", label: "Aproape mereu reacționează", points: 4 }
    ]
  },
  {
    id: "baumann-pigmentation", axis: "P/N", section: "Profil Baumann",
    label: "După expunere la soare, cât de ușor apar pete sau ton inegal?",
    options: [
      { value: "almost-never", label: "Aproape niciodată", points: 1 },
      { value: "rarely-fade", label: "Rareori, dispar repede", points: 2 },
      { value: "often-weeks", label: "Des, rămân câteva săptămâni", points: 3 },
      { value: "very-easy-long", label: "Foarte ușor, rămân mult timp", points: 4 }
    ]
  },
  {
    id: "baumann-wrinkling", axis: "W/T", section: "Profil Baumann",
    label: "Cum ai descrie fermitatea și liniile fine ale pielii tale acum?",
    options: [
      { value: "firm", label: "Fermă, fără linii vizibile", points: 1 },
      { value: "fine-expression", label: "Câteva linii fine, doar la expresie", points: 2 },
      { value: "resting-lines", label: "Riduri vizibile în repaus", points: 3 },
      { value: "marked-loss", label: "Riduri marcate, pierdere de fermitate", points: 4 }
    ]
  }
];

const visualObservationDefinitions = [
  { slug: "hyperpigmentation-observation", title: "Hiperpigmentare", description: "Pete, uniformitate ton, zone afectate.", fields: ["Pete", "Uniformitatea tonului", "Zone afectate"] },
  { slug: "erythema-vascular-observation", title: "Eritem & vascular", description: "Roșeață, cuperoză, sensibilitate vasculară.", fields: ["Roșeață", "Cuperoză", "Sensibilitate vasculară"] },
  { slug: "pores-comedones-observation", title: "Pori & comedoane", description: "Dimensiune, densitate, zone T/U.", fields: ["Dimensiunea porilor", "Densitatea comedoanelor", "Zone T/U"] },
  { slug: "eye-area-observation", title: "Zona ochilor", description: "Cearcăne, pungi, riduri periorbitale.", fields: ["Cearcăne", "Pungi", "Riduri periorbitale"] },
  { slug: "elasticity-wrinkles-observation", title: "Elasticitate & riduri", description: "Turgor, fermitate, hărți de riduri.", fields: ["Turgor", "Fermitate", "Hărți de riduri"] }
];

export const questionnaireCatalog = [
  {
    slug: "fitzpatrick-screening",
    title: "Fitzpatrick Phototype",
    audience: "client",
    deliveryMode: "public",
    status: "active",
    sourceCoverage: "full",
    sourceRefs: ["1. chestionar fitzpatrik.docx"],
    description: "Chestionar self-service pentru fototip, risc UV si siguranta procedurilor."
  },
  {
    slug: "acne-severity",
    title: "Acne Severity Index",
    audience: "client-assisted",
    deliveryMode: "public-assisted",
    status: "active",
    sourceCoverage: "full",
    sourceRefs: ["chestionar acnee.docx"],
    description: "Scor DIA pentru severitatea acneei si recomandarea nivelului de debriefing."
  },
  {
    slug: "baumann-profile",
    title: "Testul Baumann",
    group: "Chestionare",
    audience: "client-assisted",
    deliveryMode: "public-assisted",
    status: "active",
    sourceCoverage: "dimensions-plus-tipology-library",
    sourceRefs: [
      "raport baumann O vs D .docx",
      "raport baumann S vs R.docx",
      "Raport baumann P vs N.docx",
      "raport baumann T vs W.docx",
      "tipologie ten *.docx"
    ],
    description: "4 axe: hidratare, sensibilitate, pigmentare, îmbătrânire."
  },
  {
    slug: "psoriasis-screening",
    title: "Evaluare psoriazis",
    group: "Chestionare",
    audience: "client",
    deliveryMode: "workspace",
    status: "active",
    sourceCoverage: "full",
    sourceRefs: ["1. chestionar psoriazis.docx"],
    description: "Screening psoriazis pe 40 de intrebari in 5 sectiuni, cu scor de severitate si recomandare de escaladare."
  },
  {
    slug: "lifestyle-insight",
    title: "Stil de viață",
    group: "Chestionare",
    audience: "client",
    deliveryMode: "workspace",
    status: "active",
    sourceCoverage: "full",
    sourceRefs: [
      "interpretari stil de viata clienti .docx",
      "interpretari profesionale chestionar stil de viata .docx"
    ],
    description: "Evaluare stil de viata pe 44 de intrebari in 5 sectiuni: alimentatie, somn, stres, miscare, hidratare."
  },
  {
    slug: "dermatitis-screening",
    title: "Evaluare dermatită",
    group: "Chestionare",
    audience: "client",
    deliveryMode: "workspace",
    status: "active",
    sourceCoverage: "full",
    sourceRefs: ["chestionar dermatita.docx"],
    description: "Screening dermatita pe 36 de intrebari in 6 sectiuni, cu scor de severitate si protocol recomandat."
  },
  ...visualObservationDefinitions.map((definition) => ({
    slug: definition.slug,
    title: definition.title,
    group: "Analiză vizuală",
    audience: "professional",
    deliveryMode: "workspace",
    status: "active",
    sourceCoverage: "professional-observation",
    sourceRefs: ["cod atașat — catalog final de teste"],
    description: definition.description
  }))
];

export const questionnaireDefinitions = {
  "fitzpatrick-screening": {
    slug: "fitzpatrick-screening",
    title: "Fitzpatrick Phototype",
    kind: "choice-sum",
    audience: "client",
    sourceRefs: ["1. chestionar fitzpatrik.docx"],
    questions: fitzpatrickQuestions,
    bands: [
      {
        min: 0,
        max: 7,
        label: "Fitzpatrick I",
        summary: "Fototip foarte deschis, predispus la arsuri si necesitand precautie maxima la expunere UV."
      },
      {
        min: 8,
        max: 16,
        label: "Fitzpatrick II",
        summary: "Fototip deschis, cu toleranta redusa la soare si nevoie de protectie ridicata."
      },
      {
        min: 17,
        max: 25,
        label: "Fitzpatrick III",
        summary: "Fototip intermediar, cu bronz progresiv si risc moderat la proceduri foto-sensibile."
      },
      {
        min: 26,
        max: 30,
        label: "Fitzpatrick IV",
        summary: "Fototip mai inchis, bronz usor si toleranta mai buna la expunere, cu risc PIH ce ramane relevant."
      },
      {
        min: 31,
        max: 35,
        label: "Fitzpatrick V",
        summary: "Fototip inchis, predispozitie redusa la arsura, dar cu nevoie mare de control al pigmentarii post-procedura."
      },
      {
        min: 36,
        max: 999,
        label: "Fitzpatrick VI",
        summary: "Fototip foarte inchis, cu protocol special pentru energie si prevenirea hiperpigmentarii."
      }
    ]
  },
  "acne-severity": {
    slug: "acne-severity",
    title: "Acne Severity Index",
    kind: "acne-index",
    audience: "client-assisted",
    sourceRefs: ["chestionar acnee.docx"],
    questions: acneQuestions,
    bands: [
      {
        min: 1,
        max: 5,
        label: "Acnee usoara",
        summary: "Inflamatie limitata si abordare conservatoare, cu control local si reevaluare."
      },
      {
        min: 6,
        max: 10,
        label: "Acnee moderata",
        summary: "Necesita plan de tratament structurat si urmarire mai stransa."
      },
      {
        min: 11,
        max: 99,
        label: "Acnee severa",
        summary: "Necesita debriefing rapid, protocol personalizat si criterii de escaladare medicala."
      }
    ]
  },
  "baumann-profile": {
    slug: "baumann-profile",
    title: "Testul Baumann",
    kind: "baumann-choice",
    audience: "client-assisted",
    sourceRefs: [
      "raport baumann O vs D .docx",
      "raport baumann S vs R.docx",
      "Raport baumann P vs N .docx",
      "raport baumann T vs W.docx"
    ],
    questions: baumannChoiceQuestions,
    bands: []
  },
  "lifestyle-insight": {
    slug: "lifestyle-insight",
    title: "Lifestyle Insight",
    kind: "choice-sum",
    audience: "client",
    sourceRefs: [
      "interpretari stil de viata clienti .docx",
      "interpretari profesionale chestionar stil de viata .docx"
    ],
    questions: lifestyleQuestions,
    bands: [
      {
        min: 0,
        max: 44,
        label: "Impact negativ ridicat",
        summary: "Stilul de viata actual afecteaza semnificativ sanatatea pielii. Recomandare: plan de optimizare in toate sectiunile evaluate."
      },
      {
        min: 45,
        max: 88,
        label: "Echilibru partial",
        summary: "Unele obiceiuri sunt favorabile, insa exista arii cu potential de imbunatatire care influenteaza tenul."
      },
      {
        min: 89,
        max: 132,
        label: "Stil de viata favorabil",
        summary: "Obiceiurile actuale sustin sanatatea pielii. Mentinerea rutinei si ajustari fine sunt suficiente."
      }
    ]
  },
  "dermatitis-screening": {
    slug: "dermatitis-screening",
    title: "Dermatitis Intake",
    kind: "choice-sum",
    audience: "client",
    sourceRefs: ["Kit de consultatie profesionala - Insight Beauty.pdf"],
    questions: dermatitisQuestions,
    bands: [
      {
        min: 0,
        max: 30,
        label: "Dermatita usoara sau absenta",
        summary: "Simptome minime sau absente. Protocol de ingrijire preventiva si hidratare adecvata."
      },
      {
        min: 31,
        max: 60,
        label: "Dermatita moderata",
        summary: "Simptome prezente cu impact functional. Necesita protocol terapeutic structurat si monitorizare periodica."
      },
      {
        min: 61,
        max: 999,
        label: "Dermatita severa",
        summary: "Simptome severe cu impact semnificativ. Necesita escaladare medicala si management dermatologic specializat."
      }
    ]
  },
  "psoriasis-screening": {
    slug: "psoriasis-screening",
    title: "Psoriasis Intake",
    kind: "choice-sum",
    audience: "client",
    sourceRefs: ["1. chestionar psoriazis.docx"],
    questions: psoriasisQuestions,
    bands: [
      {
        min: 0,
        max: 15,
        label: "Psoriazis usor sau absent",
        summary: "Simptome minime sau absente. Protocol de ingrijire si monitorizare preventiva."
      },
      {
        min: 16,
        max: 30,
        label: "Psoriazis moderat",
        summary: "Simptome prezente ce necesita plan de management personalizat si urmarire periodica."
      },
      {
        min: 31,
        max: 999,
        label: "Psoriazis sever",
        summary: "Simptome severe cu impact asupra calitatii vietii. Necesita trimitere catre dermatolog si protocol specializat."
      }
    ]
  }
};

for (const definition of visualObservationDefinitions) {
  questionnaireDefinitions[definition.slug] = {
    slug: definition.slug,
    title: definition.title,
    kind: "professional-observation",
    audience: "professional",
    sourceRefs: ["cod atașat — catalog final de teste"],
    questions: definition.fields.map((label) => ({
      id: `${definition.slug}-${label.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}`,
      label,
      inputType: "textarea"
    })),
    bands: []
  };
}
