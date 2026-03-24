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
    title: "Baumann 16-Type Profiler",
    audience: "professional",
    deliveryMode: "workspace",
    status: "active",
    sourceCoverage: "dimensions-plus-tipology-library",
    sourceRefs: [
      "raport baumann O vs D .docx",
      "raport baumann S vs R.docx",
      "Raport baumann P vs N.docx",
      "raport baumann T vs W.docx",
      "tipologie ten *.docx"
    ],
    description: "Canvas intern pentru evaluare profesionala si asocierea tipologiei Baumann."
  },
  {
    slug: "psoriasis-screening",
    title: "Psoriasis Intake",
    audience: "client",
    deliveryMode: "workspace",
    status: "mapped-source",
    sourceCoverage: "source-indexed",
    sourceRefs: ["1. chestionar psoriazis.docx"],
    description: "Document sursa indexat si pregatit pentru codificare integrala in urmatorul increment."
  },
  {
    slug: "lifestyle-insight",
    title: "Lifestyle Insight",
    audience: "client",
    deliveryMode: "workspace",
    status: "awaiting-question-bank",
    sourceCoverage: "interpretations-only",
    sourceRefs: [
      "interpretari stil de viata clienti .docx",
      "interpretari profesionale chestionar stil de viata .docx"
    ],
    description: "Interpretarile sunt disponibile; banca de intrebari lipseste din sursa si trebuie completata."
  },
  {
    slug: "consent-library",
    title: "Consent Library",
    audience: "client",
    deliveryMode: "workspace",
    status: "source-indexed",
    sourceCoverage: "source-indexed",
    sourceRefs: [
      "fisa consimtamant microneedling.docx",
      "fisa consimtamant microneedling si RF.docx",
      "fisa consimtamant laser minori.docx",
      "fisa consimtamant tratament facial minori.docx",
      "fisa consimtamant peeling.docx"
    ],
    description: "Biblioteca de consimtamant este indexata pentru transformare in formulare semnabile."
  }
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
    title: "Baumann 16-Type Profiler",
    kind: "baumann-dimensions",
    audience: "professional",
    sourceRefs: [
      "raport baumann O vs D .docx",
      "raport baumann S vs R.docx",
      "Raport baumann P vs N.docx",
      "raport baumann T vs W.docx"
    ],
    dimensions: baumannDimensions
  }
};

