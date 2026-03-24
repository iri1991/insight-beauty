import { questionnaireCatalog } from "./questionnaires.js";

const publicQuestionnaires = questionnaireCatalog.filter(
  (questionnaire) =>
    questionnaire.status === "active" &&
    (questionnaire.deliveryMode === "public" || questionnaire.deliveryMode === "public-assisted")
);

export const salons = [
  {
    id: "salon-insight-bucharest",
    slug: "insight-bucharest",
    name: "Insight Beauty Lab Bucharest",
    city: "Bucuresti",
    confidentialityScope: "tenant-isolated",
    admins: ["admin-ioana"],
    professionals: ["pro-elena", "pro-mara"],
    theme: "Elevated clinical glow"
  },
  {
    id: "salon-studio-cluj",
    slug: "studio-cluj",
    name: "Studio Skin Atelier Cluj",
    city: "Cluj-Napoca",
    confidentialityScope: "tenant-isolated",
    admins: ["admin-ioana"],
    professionals: ["pro-andreea"],
    theme: "Dermal recovery rituals"
  }
];

export const professionals = [
  {
    id: "pro-elena",
    name: "Elena Stoica",
    role: "professional",
    salonId: "salon-insight-bucharest",
    specialty: "Skin analysis and anti-age protocols",
    shareCode: "ELENA-GLOW",
    activeClients: 48,
    todayFollowUps: 6,
    preferredQuestionnaireSlugs: ["fitzpatrick-screening", "acne-severity"],
    appointmentPolicy: "Debriefing de 30 minute in 48-72h dupa intake.",
    focusAreas: ["anti-age", "barrier reset", "pigmentation"],
    weeklyCapacity: 34
  },
  {
    id: "pro-mara",
    name: "Mara Ionescu",
    role: "professional",
    salonId: "salon-insight-bucharest",
    specialty: "Acne rehabilitation and barrier repair",
    shareCode: "MARA-CALM",
    activeClients: 35,
    todayFollowUps: 4,
    preferredQuestionnaireSlugs: ["acne-severity", "fitzpatrick-screening"],
    appointmentPolicy: "Triage rapid pentru acnee activa si review la 14 zile.",
    focusAreas: ["acne", "inflammation", "homecare compliance"],
    weeklyCapacity: 28
  },
  {
    id: "pro-andreea",
    name: "Andreea Voda",
    role: "professional",
    salonId: "salon-studio-cluj",
    specialty: "Pigmentation and microneedling planning",
    shareCode: "ANDREEA-RADIANCE",
    activeClients: 27,
    todayFollowUps: 3,
    preferredQuestionnaireSlugs: ["fitzpatrick-screening", "acne-severity"],
    appointmentPolicy: "Evaluare foto + plan sezonier anti-pigmentare.",
    focusAreas: ["pigmentation", "collagen stimulation", "maintenance"],
    weeklyCapacity: 22
  }
];

export const clientDossiers = [
  {
    id: "client-ana-radu",
    dossierId: "DOS-AR-20260109",
    salonId: "salon-insight-bucharest",
    professionalId: "pro-elena",
    firstName: "Ana",
    lastName: "Radu",
    email: "ana.radu@example.com",
    phone: "+40 722 000 111",
    ageBand: "31-35",
    consentStatus: ["data-processing", "photo-tracking", "treatment-plan"],
    primaryConcerns: ["sensibilitate", "deshidratare", "pete post-inflamatorii"],
    lastAssessment: {
      questionnaireSlug: "fitzpatrick-screening",
      label: "Fitzpatrick III",
      score: 22,
      submittedAt: "2026-03-11T10:30:00.000Z"
    },
    baumannType: "DSPT",
    baumannProfile: {
      code: "DSPT",
      dimensions: {
        oiliness: 24,
        sensitivity: 34,
        pigmentation: 31,
        wrinkling: 37
      },
      summary: "Piele uscata, sensibila, pigmentata si ferma; prioritate pe repararea barierei si controlul reactiilor."
    },
    progressSnapshot: {
      trend: "upward",
      focus: "barrier reset",
      baseline: "reactivitate mare la active si pete persistente dupa inflamatie",
      current: "reactivitate redusa, toleranta mai buna la SPF si rutina de seara"
    },
    treatmentPlan: "Barrier reset + pigmentation maintenance",
    treatmentProgram: {
      status: "active",
      cadence: "1 sedinta la 2 saptamani timp de 8 saptamani",
      goals: [
        "stabilizare bariera cutanata",
        "reducere episoade de roseata",
        "uniformizare ton si preventie PIH"
      ],
      inCabinProtocols: [
        "curatare blanda + enzime",
        "LED antiinflamator",
        "hidratare profunda cu ceramide",
        "introducere graduala vitamina C stabila"
      ],
      homecare: [
        "cleanser fara parfum, non-spumant",
        "ser cu panthenol + ceramide",
        "SPF 50 zilnic",
        "retinal low-dose doar dupa stabilizare"
      ],
      reviewCadence: "review foto lunar + reevaluare Fitzpatrick inainte de sezon cald"
    },
    riskFlags: ["sensitive", "post-inflammatory pigmentation"],
    nextSession: "2026-03-18T14:30:00.000Z",
    questionnaireAssignments: [
      {
        questionnaireSlug: "fitzpatrick-screening",
        sharedAt: "2026-03-09T18:00:00.000Z",
        channel: "WhatsApp",
        status: "completed"
      },
      {
        questionnaireSlug: "acne-severity",
        sharedAt: "2026-03-21T09:00:00.000Z",
        channel: "Email",
        status: "scheduled"
      }
    ],
    assessmentHistory: [
      {
        questionnaireSlug: "fitzpatrick-screening",
        label: "Fitzpatrick III",
        score: 22,
        submittedAt: "2026-03-11T10:30:00.000Z",
        insight: "Toleranta medie la UV, risc moderat de pigmentare post-procedura."
      },
      {
        questionnaireSlug: "baumann-profile",
        label: "Tipologie Baumann DSPT",
        score: null,
        submittedAt: "2026-02-02T11:00:00.000Z",
        insight: "Profilul confirma prioritatea pe calmare si pigment control."
      }
    ],
    sessionHistory: [
      {
        id: "sess-ana-001",
        date: "2026-01-09",
        service: "Intake initial + analiza bariera",
        status: "completed",
        objective: "creare fisa client",
        notes: "reactivitate crescuta, rutina fragmentata, sensibilitate sezoniera",
        outcome: "dosar deschis si protocol de calmare setat"
      },
      {
        id: "sess-ana-002",
        date: "2026-02-02",
        service: "LED calmare + reparare bariera",
        status: "completed",
        objective: "reducere inflamatie",
        notes: "toleranta buna la ceramide, fara semne de supra-reactie",
        outcome: "roseata redusa si confort crescut"
      },
      {
        id: "sess-ana-003",
        date: "2026-03-18",
        service: "Review foto + hidratare profunda",
        status: "scheduled",
        objective: "validare progres si introducere activa noua",
        notes: "de evaluat retinal low-dose",
        outcome: "pending"
      }
    ],
    timeline: [
      { date: "2026-01-09", event: "Intake initial si creare fisa client" },
      { date: "2026-02-02", event: "Protocol calmare + LED + reparare bariera" },
      { date: "2026-03-11", event: "Reevaluare Fitzpatrick si actualizare rutina SPF" }
    ]
  },
  {
    id: "client-bianca-popa",
    dossierId: "DOS-BP-20260212",
    salonId: "salon-insight-bucharest",
    professionalId: "pro-mara",
    firstName: "Bianca",
    lastName: "Popa",
    email: "bianca.popa@example.com",
    phone: "+40 723 000 222",
    ageBand: "24-30",
    consentStatus: ["data-processing", "treatment-plan"],
    primaryConcerns: ["acnee inflamatorie", "seboree", "congestie recurenta"],
    lastAssessment: {
      questionnaireSlug: "acne-severity",
      label: "Acnee moderata",
      score: 7,
      submittedAt: "2026-03-12T08:15:00.000Z"
    },
    baumannType: "OSNT",
    baumannProfile: {
      code: "OSNT",
      dimensions: {
        oiliness: 31,
        sensitivity: 33,
        pigmentation: 24,
        wrinkling: 29
      },
      summary: "Ten gras, sensibil, nepigmentat, ferm; focus pe controlul inflamatiei si al sebumului fara agresiune."
    },
    progressSnapshot: {
      trend: "stable",
      focus: "inflammation control",
      baseline: "papule active pe zona mandibulara si T-zone foarte incarcata",
      current: "mai putine eruptii mari, dar inca apar recaderi legate de stres si somn"
    },
    treatmentPlan: "Sebum balance + anti-inflammatory tracking",
    treatmentProgram: {
      status: "active",
      cadence: "6 sedinte bilunare + control homecare saptamanal prin mesaj",
      goals: [
        "scadere numar leziuni inflamatorii",
        "stabilizare secretie sebum",
        "crestere aderenta la rutina low-irritation"
      ],
      inCabinProtocols: [
        "curatare profunda non-traumatica",
        "blue + red LED combinat",
        "masti sebo-reglatoare",
        "acid mandelic in progresie"
      ],
      homecare: [
        "gel salicilic bland",
        "niacinamide 5%",
        "hidratare oil-free",
        "journal stres + somn"
      ],
      reviewCadence: "DIA la fiecare 14 zile si review comportamental lunar"
    },
    riskFlags: ["active inflammation"],
    nextSession: "2026-03-15T11:00:00.000Z",
    questionnaireAssignments: [
      {
        questionnaireSlug: "acne-severity",
        sharedAt: "2026-03-10T19:00:00.000Z",
        channel: "Instagram DM",
        status: "completed"
      },
      {
        questionnaireSlug: "fitzpatrick-screening",
        sharedAt: "2026-03-16T10:00:00.000Z",
        channel: "SMS",
        status: "scheduled"
      }
    ],
    assessmentHistory: [
      {
        questionnaireSlug: "acne-severity",
        label: "Acnee moderata",
        score: 7,
        submittedAt: "2026-03-12T08:15:00.000Z",
        insight: "Necesita protocol consecvent si monitorizare a factorilor declansatori."
      },
      {
        questionnaireSlug: "baumann-profile",
        label: "Tipologie Baumann OSNT",
        score: null,
        submittedAt: "2026-02-27T12:00:00.000Z",
        insight: "Profilul confirma piele grasa si sensibila, deci fara escaladare agresiva."
      }
    ],
    sessionHistory: [
      {
        id: "sess-bianca-001",
        date: "2026-02-12",
        service: "Screening acnee + intake stil de viata",
        status: "completed",
        objective: "clasificare severitate",
        notes: "zahăr ridicat, somn instabil, stoarcere leziuni acasa",
        outcome: "setare plan antiinflamator"
      },
      {
        id: "sess-bianca-002",
        date: "2026-02-27",
        service: "Control 1 + extrageri blande",
        status: "completed",
        objective: "reducere congestie",
        notes: "porii mai curati, inca papule noi pe mandibula",
        outcome: "introducere acid mandelic"
      },
      {
        id: "sess-bianca-003",
        date: "2026-03-15",
        service: "Review progres + LED",
        status: "scheduled",
        objective: "masurare raspuns la protocol",
        notes: "verificare aderenta la homecare",
        outcome: "pending"
      }
    ],
    timeline: [
      { date: "2026-02-12", event: "Screening acnee si recomandari dieta low sugar" },
      { date: "2026-02-27", event: "Plan tratament 6 sedinte + monitorizare leziuni" },
      { date: "2026-03-12", event: "Reevaluare DIA si ajustare recomandari" }
    ]
  },
  {
    id: "client-daria-matei",
    dossierId: "DOS-DM-20251205",
    salonId: "salon-studio-cluj",
    professionalId: "pro-andreea",
    firstName: "Daria",
    lastName: "Matei",
    email: "daria.matei@example.com",
    phone: "+40 724 000 333",
    ageBand: "36-42",
    consentStatus: ["data-processing", "photo-tracking", "microneedling-consent"],
    primaryConcerns: ["melasma usoara", "riduri fine", "pierdere luminozitate"],
    lastAssessment: {
      questionnaireSlug: "fitzpatrick-screening",
      label: "Fitzpatrick V",
      score: 33,
      submittedAt: "2026-03-10T16:45:00.000Z"
    },
    baumannType: "ORPW",
    baumannProfile: {
      code: "ORPW",
      dimensions: {
        oiliness: 29,
        sensitivity: 26,
        pigmentation: 35,
        wrinkling: 48
      },
      summary: "Ten gras, rezistent, pigmentat si ridat; necesita control pigment si protocol anti-age progresiv."
    },
    progressSnapshot: {
      trend: "upward",
      focus: "pigmentation + collagen support",
      baseline: "ton inegal si textura obosita dupa vara",
      current: "luminozitate mai buna si textura rafinata, pigmentarea inca necesita mentenanta"
    },
    treatmentPlan: "Pigment control + collagen support",
    treatmentProgram: {
      status: "active",
      cadence: "protocol sezonier cu 4-8 sedinte + mentenanta lunara",
      goals: [
        "control pete si melasma usoara",
        "crestere fermitate",
        "mentinere toleranta buna la tratamente active"
      ],
      inCabinProtocols: [
        "microneedling superficial",
        "vitamina C + peptide",
        "LED galben pentru uniformizare",
        "peeling bland anti-pigment"
      ],
      homecare: [
        "SPF 50 reaplicat",
        "vitamina C 15%",
        "retinal 0.3%",
        "ser anti-pigment bland"
      ],
      reviewCadence: "reevaluare pigmentare la 30 zile si control foto la schimbare de sezon"
    },
    riskFlags: ["pigmentation risk", "wrinkling"],
    nextSession: "2026-03-20T09:30:00.000Z",
    questionnaireAssignments: [
      {
        questionnaireSlug: "fitzpatrick-screening",
        sharedAt: "2026-03-08T13:30:00.000Z",
        channel: "Email",
        status: "completed"
      }
    ],
    assessmentHistory: [
      {
        questionnaireSlug: "fitzpatrick-screening",
        label: "Fitzpatrick V",
        score: 33,
        submittedAt: "2026-03-10T16:45:00.000Z",
        insight: "Necesita precautie maxima la tratamente care pot genera PIH."
      },
      {
        questionnaireSlug: "baumann-profile",
        label: "Tipologie Baumann ORPW",
        score: null,
        submittedAt: "2025-12-05T15:30:00.000Z",
        insight: "Profil rezistent, pigmentat, ridat; protocol sezonier combinat."
      }
    ],
    sessionHistory: [
      {
        id: "sess-daria-001",
        date: "2025-12-05",
        service: "Deschidere fisa + test Baumann",
        status: "completed",
        objective: "stabilire baseline",
        notes: "melasma usoara pe pometi, riduri fine periorbitale",
        outcome: "protocol anti-pigmentare setat"
      },
      {
        id: "sess-daria-002",
        date: "2026-01-22",
        service: "Microneedling superficial",
        status: "completed",
        objective: "suport colagen",
        notes: "recuperare buna, fara hiperpigmentare noua",
        outcome: "fermizare usoara si luminozitate crescuta"
      },
      {
        id: "sess-daria-003",
        date: "2026-03-20",
        service: "Review pigmentare + sezon cald",
        status: "scheduled",
        objective: "adaptare SPF si intensitate tratamente",
        notes: "validare toleranta la peeling bland",
        outcome: "pending"
      }
    ],
    timeline: [
      { date: "2025-12-05", event: "Deschidere fisa si test Baumann" },
      { date: "2026-01-22", event: "Microneedling superficial + protocol depigmentare" },
      { date: "2026-03-10", event: "Actualizare profil UV si pregatire sezon cald" }
    ]
  }
];

export const adminSnapshot = {
  salons: salons.length,
  professionals: professionals.length,
  activeClients: 110,
  activeForms: questionnaireCatalog.filter((item) => item.status === "active").length,
  sourceDocumentsIndexed: 68,
  pendingEncodings: questionnaireCatalog.filter((item) => item.status !== "active").length
};

export const recentResponses = [
  {
    id: "resp-001",
    salonId: "salon-insight-bucharest",
    professionalId: "pro-elena",
    clientId: "client-ana-radu",
    questionnaireSlug: "fitzpatrick-screening",
    resultLabel: "Fitzpatrick III",
    submittedAt: "2026-03-11T10:30:00.000Z"
  },
  {
    id: "resp-002",
    salonId: "salon-insight-bucharest",
    professionalId: "pro-mara",
    clientId: "client-bianca-popa",
    questionnaireSlug: "acne-severity",
    resultLabel: "Acnee moderata",
    submittedAt: "2026-03-12T08:15:00.000Z"
  },
  {
    id: "resp-003",
    salonId: "salon-studio-cluj",
    professionalId: "pro-andreea",
    clientId: "client-daria-matei",
    questionnaireSlug: "fitzpatrick-screening",
    resultLabel: "Fitzpatrick V",
    submittedAt: "2026-03-10T16:45:00.000Z"
  }
];

export function getSalonBySlug(slug) {
  return salons.find((salon) => salon.slug === slug);
}

export function getProfessionalsForSalon(salonId) {
  return professionals.filter((professional) => professional.salonId === salonId);
}

export function getProfessionalById(professionalId) {
  return professionals.find((professional) => professional.id === professionalId);
}

export function getClientsForProfessional(professionalId) {
  return clientDossiers.filter((client) => client.professionalId === professionalId);
}

export function getClientDossiersForSalon(salonId) {
  return clientDossiers.filter((client) => client.salonId === salonId);
}

export function getClientDossierById(clientId) {
  return clientDossiers.find((client) => client.id === clientId);
}

export function getRecentResponsesForSalon(salonId) {
  return recentResponses.filter((response) => response.salonId === salonId);
}

export function getRecentResponsesForProfessional(professionalId) {
  return recentResponses.filter((response) => response.professionalId === professionalId);
}

export function buildPublicIntakeLink({ salonSlug, professionalId, questionnaireSlug, shareCode }) {
  const searchParams = new URLSearchParams({
    salon: salonSlug,
    professional: professionalId,
    questionnaire: questionnaireSlug
  });

  if (shareCode) {
    searchParams.set("share", shareCode);
  }

  return `/client/intake?${searchParams.toString()}`;
}

export function getProfessionalShareBundles(salonSlug, professionalId) {
  const professional = getProfessionalById(professionalId);

  if (!professional) {
    return [];
  }

  const preferred = professional.preferredQuestionnaireSlugs || [];

  return publicQuestionnaires
    .filter((questionnaire) => preferred.includes(questionnaire.slug))
    .map((questionnaire) => ({
      questionnaireSlug: questionnaire.slug,
      title: questionnaire.title,
      description: questionnaire.description,
      intakeLink: buildPublicIntakeLink({
        salonSlug,
        professionalId,
        questionnaireSlug: questionnaire.slug,
        shareCode: professional.shareCode
      }),
      shareCode: professional.shareCode
    }));
}
