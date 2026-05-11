import Image from "next/image";
import Link from "next/link";
import { ScrollReveal } from "../components/scroll-reveal";
import { DemoForm } from "../components/demo-form";

export const metadata = {
  title: "Insight Beauty — Platformă Clinică pentru Saloane Premium | România",
  description:
    "Insight Beauty este prima platformă de beauty intelligence din România. Intake clinic digital, analiză Baumann automată, dosar evolutiv al clientului și plan de tratament integrat. Construit pentru saloane premium, skin studios și concepte beauty-health.",
  alternates: {
    canonical: "/"
  }
};

// ─── SVG Icons ───────────────────────────────────────────────────────────────

function IconFlask() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="feat-icon-svg">
      <path d="M9 3h6M9 3v7L4 20h16L15 10V3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M6 16h12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <circle cx="9.5" cy="17.5" r="1" fill="currentColor" />
      <circle cx="14" cy="19" r="0.75" fill="currentColor" />
    </svg>
  );
}

function IconFolder() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="feat-icon-svg">
      <path d="M3 7a2 2 0 012-2h4l2 2h8a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V7z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M8 13h8M8 16h5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function IconPlan() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="feat-icon-svg">
      <rect x="3" y="3" width="18" height="18" rx="3" stroke="currentColor" strokeWidth="1.6" />
      <path d="M7 8h10M7 12h10M7 16h6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <circle cx="19" cy="19" r="4" fill="var(--accent)" />
      <path d="M17.5 19l1 1 2-2" stroke="#fff" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconMobile() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="feat-icon-svg">
      <rect x="5" y="2" width="14" height="20" rx="3" stroke="currentColor" strokeWidth="1.6" />
      <path d="M10 18h4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function IconShield() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="feat-icon-svg">
      <path d="M12 3L4 6v6c0 4.4 3.4 8.5 8 9.5 4.6-1 8-5.1 8-9.5V6L12 3z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconUsers() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="feat-icon-svg">
      <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="1.6" />
      <path d="M3 21v-2a4 4 0 014-4h4a4 4 0 014 4v2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M16 3.13a4 4 0 010 7.75M21 21v-2a4 4 0 00-3-3.87" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function IconCheck() {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" className="check-svg">
      <circle cx="10" cy="10" r="9" fill="currentColor" fillOpacity=".12" stroke="currentColor" strokeWidth="1.4" />
      <path d="M6 10l3 3 5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconStar() {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" className="star-svg">
      <path d="M10 1l2.4 7.2H20l-6.2 4.5 2.4 7.2L10 15.4l-6.2 4.5 2.4-7.2L0 8.2h7.6L10 1z" />
    </svg>
  );
}

function IconQuote() {
  return (
    <svg viewBox="0 0 32 24" fill="currentColor" aria-hidden="true" className="quote-svg">
      <path d="M0 24V14.4C0 9.6 1.6 5.8 4.8 3 8 1 12 0 17 0v4c-3.2.4-5.6 1.6-7 3.6-1.5 2-2.2 4.4-2 7.2H14V24H0zm18 0V14.4c0-4.8 1.6-8.6 4.8-11.4C26 1 30 0 35 0v4c-3.2.4-5.6 1.6-7 3.6-1.5 2-2.2 4.4-2 7.2H32V24H18z" />
    </svg>
  );
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const stats = [
  { value: "< 3 min", label: "timp mediu intake", desc: "Completare fluidă, fără fricțiune" },
  { value: "100%", label: "date criptate", desc: "Conforme GDPR, izolate per salon" },
  { value: "4 roluri", label: "suportate nativ", desc: "Admin, salon, profesionist, client" },
  { value: "PWA", label: "instalabil nativ", desc: "iOS, Android, desktop, fără app store" }
];

const features = [
  {
    id: "intake",
    eyebrow: "Evaluare clinică",
    title: "Intake digital care înlocuiește formularul pe hârtie",
    body: "Clientul parcurge un chestionar elegant, adaptat profilului salonului tău. Răspunsurile sunt structurate, interpretate automat și salvate în dosarul personal — nu pierdute în tabele sau dosare fizice.",
    bullets: [
      "Chestionare complet personalizabile per salon",
      "Interpretare automată tip Baumann",
      "Link public pentru trimitere înainte de programare",
      "Compatibil 100% cu dispozitivele mobile"
    ],
    image: {
      src: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=700&q=80",
      alt: "Profesionist beauty realizând evaluare clinică a clientului",
      width: 700,
      height: 520
    },
    cta: { label: "Încearcă intake-ul demo", href: "/client/intake" }
  },
  {
    id: "dossier",
    eyebrow: "Dosar evolutiv",
    title: "Fiecare client devine o relație pe termen lung",
    body: "Prima evaluare nu dispare după ședință. Din ea se construiește un dosar viu: istoricul tratamentelor, progresul pielii, observațiile profesionistului și planul activ de îngrijire — totul într-un singur loc.",
    bullets: [
      "Profil complet după prima evaluare",
      "Progres tracked pe dimensiunile Baumann",
      "Observații de sesiune și note profesionale",
      "Acces securizat pentru client și profesionist"
    ],
    image: {
      src: "https://images.unsplash.com/photo-1619451334792-150fd785ee74?auto=format&fit=crop&w=700&q=80",
      alt: "Dosar digital client afișat pe ecranul unui profesionist beauty",
      width: 700,
      height: 520
    },
    cta: { label: "Accesează workspace-ul", href: "/login" }
  },
  {
    id: "treatment",
    eyebrow: "Plan de tratament",
    title: "De la diagnostic la recomandare în același flux",
    body: "Interpretarea nu se oprește la un scor. Sistemul generează un plan de tratament și un protocol homecare personalizat, pe care profesionistul îl poate ajusta și trimite clientului direct din platformă.",
    bullets: [
      "Plan de tratament generat automat",
      "Recomandări homecare incluse",
      "Partajare elegantă cu clientul",
      "Follow-up și notificări push integrate"
    ],
    image: {
      src: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=700&q=80",
      alt: "Tratament facial profesional într-un salon premium",
      width: 700,
      height: 520
    },
    cta: { label: "Solicită demo gratuit", href: "#demo" }
  }
];

const steps = [
  {
    n: "01",
    title: "Clientul completează intake-ul",
    body: "Primește un link personalizat și parcurge un chestionar clinic de 3 minute, direct de pe telefon sau laptop, oricând înainte de prima ședință."
  },
  {
    n: "02",
    title: "Sistemul analizează și interpretează",
    body: "Răspunsurile sunt procesate automat: tip de piele Baumann, indicatori clinici și priorități de tratament — fără nicio intervenție manuală din partea ta."
  },
  {
    n: "03",
    title: "Profesionistul primește contextul complet",
    body: "La prima întâlnire, ai deja profilul clientului, interpretarea, planul de tratament propus și tot ce ai nevoie pentru o consultație reală, nu o repetare de informații."
  }
];

const roles = [
  {
    Icon: IconUsers,
    title: "Administratori de platformă",
    body: "Gestionează biblioteca de chestionare, logica de interpretare, tenanturile active și întreaga observabilitate a platformei dintr-un panou central.",
    tag: "Admin"
  },
  {
    Icon: IconShield,
    title: "Saloane și skin studios",
    body: "Datele clienților tăi rămân izolate, criptate și accesibile doar personalului autorizat. Spațiu de lucru branded, complet separat de alți utilizatori.",
    tag: "Salon"
  },
  {
    Icon: IconFlask,
    title: "Profesioniști și terapeuti",
    body: "Distribuie intake-uri cu un singur click, citește contextul clientului înaintea ședinței și operează întreg traseul terapeutic din același ecran.",
    tag: "Profesionist"
  },
  {
    Icon: IconFolder,
    title: "Clienți și pacienți",
    body: "O experiență premium de la primul formular — clară, calmă, personalizată. Accesează dosarul personal, planul activ și istoricul tratamentelor oricând.",
    tag: "Client"
  }
];

const testimonials = [
  {
    quote:
      "Am înlocuit complet formularul pe hârtie și fișele din Excel. Acum, când clienta intră pe ușă, eu deja știu cu ce să încep. Ședința devine o conversație, nu o anchetă.",
    name: "Andreea Constantin",
    role: "Skin Therapist & fondatoare",
    salon: "Studio Lumière, București",
    initials: "AC"
  },
  {
    quote:
      "Ce apreciez cel mai mult este că dosarul nu se pierde după prima evaluare. Văd progresul real al pielii clientului în timp — asta mă diferențiază față de oricine altcineva din piață.",
    name: "Dr. Mihaela Florescu",
    role: "Dermatocosmetolog",
    salon: "Clinica Derm+ Aesthetic",
    initials: "MF"
  },
  {
    quote:
      "Am testat mai multe soluții de management salon înainte să găsesc Insight Beauty. Diferența? Acesta a fost gândit de cineva care înțelege cu adevărat ce înseamnă să lucrezi cu pielea.",
    name: "Radu Ionescu",
    role: "Manager operațional",
    salon: "Velvet Skin Studio, Cluj",
    initials: "RI"
  }
];

const questionnaires = [
  {
    slug: "baumann-profile",
    title: "Profilare Baumann 16 tipuri",
    body: "Motor intern de evaluare profesională pe 4 dimensiuni — O/D, S/R, P/N, W/T — care calculează automat tipologia completă și generează recomandări de tratament și homecare personalizate.",
    badge: "Profesionist",
    color: "var(--accent)",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" width="22" height="22">
        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M12 3v9l5 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    )
  },
  {
    slug: "fitzpatrick-screening",
    title: "Fototip Fitzpatrick",
    body: "Chestionar self-service în 8 întrebări pentru determinarea fototipului I–VI, calcularea riscului UV și selecția protocoalelor foto-sensibile sigure.",
    badge: "Client",
    color: "#e8873a",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" width="22" height="22">
        <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    )
  },
  {
    slug: "lifestyle-insight",
    title: "Lifestyle Insight",
    body: "44 de întrebări structurate pe 5 secțiuni — alimentație, somn, stres, mișcare, hidratare — care evaluează impactul stilului de viață asupra sănătății tenului și generează un scor de risc pe fiecare arie.",
    badge: "Client",
    color: "#5aaa7a",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" width="22" height="22">
        <path d="M12 22C6.48 22 2 17.52 2 12S6.48 2 12 2s10 4.48 10 10-4.48 10-10 10z" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M8 12s1.5 2 4 2 4-2 4-2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M9 9h.01M15 9h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    )
  },
  {
    slug: "dermatitis-screening",
    title: "Screening Dermatită",
    body: "36 de întrebări în 6 secțiuni pentru evaluarea simptomelor de dermatită — prurit, eritem, descuamare, edem, excoriații, lichenificare — cu scor de severitate și protocol recomandat.",
    badge: "Client",
    color: "#7b9fd4",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" width="22" height="22">
        <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" stroke="currentColor" strokeWidth="1.5"/>
      </svg>
    )
  },
  {
    slug: "psoriasis-screening",
    title: "Screening Psoriazis",
    body: "40 de întrebări în 5 secțiuni — simptome cutanate, distribuție, manifestări unghiale și articulare, calitatea vieții, factori de risc — cu scor de severitate și criterii clare de escaladare medicală.",
    badge: "Client",
    color: "#c97bb2",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" width="22" height="22">
        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  }
];

const faqs = [
  {
    q: "Ce este Insight Beauty?",
    a: "Insight Beauty este o platformă SaaS multi-tenant specializată pentru saloane premium, skin studios și cabinete de dermatocosmetologie. Include un kit complet de consultație cu 5 chestionare clinice validate, analiză automată Baumann, dosar evolutiv al clientului și plan de tratament integrat."
  },
  {
    q: "Ce chestionare sunt incluse în kit-ul de consultație?",
    a: "Kit-ul include 5 chestionare clinice: Profilare Baumann (16 tipuri, evaluare profesională), Fototip Fitzpatrick (risc UV, 8 întrebări), Lifestyle Insight (44 întrebări pe 5 arii: alimentație, somn, stres, mișcare, hidratare), Screening Dermatită (36 întrebări, 6 secțiuni) și Screening Psoriazis (40 întrebări, 5 secțiuni cu criterii de escaladare medicală)."
  },
  {
    q: "Ce este analiza tip Baumann și cum o face Insight Beauty?",
    a: "Sistemul Baumann clasifică pielea pe 4 dimensiuni: Oily/Dry (sebum), Sensitive/Resistant (reactivitate), Pigmented/Non-pigmented (melanogeneză), Wrinkled/Tight (aging). Combinând cele 4 dimensiuni rezultă 16 tipologii distincte. Insight Beauty calculează automat tipul și generează recomandări personalizate de tratament și homecare."
  },
  {
    q: "Cum funcționează intake-ul clinic digital?",
    a: "Profesionistul trimite un link personalizat clientului înaintea programării. Clientul completează chestionarele selectate (2–5 minute, pe orice dispozitiv) fără cont. Răspunsurile sunt procesate automat, generând profilul de piele complet, scorurile pe fiecare chestionar și prioritățile de tratament — disponibile la prima ședință."
  },
  {
    q: "Datele clienților sunt în siguranță? Este platforma conformă GDPR?",
    a: "Da. Fiecare salon operează într-un tenant izolat — datele unui salon nu sunt accesibile altor utilizatori. Toate datele sunt criptate în tranzit și în repaus. Platforma este proiectată să respecte cerințele GDPR privind stocarea și procesarea datelor personale sensibile."
  },
  {
    q: "Funcționează Insight Beauty pe mobil? Există o aplicație?",
    a: "Insight Beauty este o PWA (Progressive Web App) — se poate instala direct din browser pe iOS, Android sau desktop, fără App Store sau Play Store. Oferă experiența unei aplicații native: offline capability, notificări push și performanță optimizată pe mobil."
  },
  {
    q: "Cât de rapid poate fi configurat un salon pe platformă?",
    a: "Configurarea unui salon nou durează mai puțin de 10 minute: creare cont, personalizare profil și primele chestionare active. Kit-ul de consultație standard este disponibil imediat — chestionarele Baumann, Fitzpatrick, Lifestyle, Dermatită și Psoriazis sunt preconfigurate și gata de utilizare."
  }
];

// ─── JSON-LD ──────────────────────────────────────────────────────────────────

const softwareJsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Insight Beauty",
  applicationCategory: "BusinessApplication",
  applicationSubCategory: "Beauty & Wellness Management",
  operatingSystem: "Web, iOS (PWA), Android (PWA)",
  description:
    "Platformă clinică multi-tenant pentru saloane premium: intake digital, analiză Baumann automată, dosar evolutiv al clientului și plan de tratament integrat.",
  offers: {
    "@type": "Offer",
    description: "Acces SaaS pentru saloane premium, skin studios și cabinete de dermatocosmettologie.",
    priceCurrency: "RON"
  },
  featureList: [
    "Intake clinic digital personalizabil",
    "Analiză automată tip piele Baumann",
    "Dosar evolutiv al clientului",
    "Plan de tratament și homecare personalizat",
    "PWA instalabil pe iOS și Android",
    "Arhitectură multi-tenant cu izolare completă",
    "Notificări push integrate",
    "Conformitate GDPR"
  ],
  screenshot: "https://insightbeauty.ro/og-image.jpg",
  inLanguage: "ro"
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Insight Beauty",
  url: "https://insightbeauty.ro",
  description:
    "Insight Beauty creează sisteme de beauty intelligence pentru saloane premium, skin studios și concepte beauty-health din România.",
  areaServed: "RO",
  knowsAbout: [
    "skin care management software",
    "Baumann skin type analysis",
    "beauty salon software",
    "client intake management"
  ]
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map(({ q, a }) => ({
    "@type": "Question",
    name: q,
    acceptedAnswer: { "@type": "Answer", text: a }
  }))
};

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <ScrollReveal />

      <div className="stack page-stack landing-shell">

        {/* ── HERO ─────────────────────────────────────────────────── */}
        <section className="hero hero-immersive" aria-labelledby="hero-title">
          <div className="hero-grid landing-hero-grid">

            <div className="hero-copy landing-copy">
              <span className="eyebrow">Beauty intelligence · România · 2025</span>
              <h1 id="hero-title">
                De la primul intake<br />la o relație de durată.
              </h1>
              <p className="lead-copy">
                Insight Beauty aduce evaluarea clinică, dosarul evolutiv și planul de tratament
                într-un singur sistem elegant — construit pentru saloane premium, skin studios
                și concepte moderne de beauty-health.
              </p>

              <ul className="hero-signals" aria-label="Caracteristici principale">
                {["Intake clinic digital", "Analiză Baumann automată", "Dosar evolutiv", "PWA nativ"].map((s) => (
                  <li key={s} className="capsule-pill">
                    <span className="capsule-dot" aria-hidden="true" />
                    {s}
                  </li>
                ))}
              </ul>

              <div className="button-row landing-actions">
                <Link className="button primary" href="/client/intake" aria-label="Încearcă fluxul de intake gratuit">
                  Încearcă intake-ul gratuit
                  <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" className="btn-icon">
                    <path d="M4 10h12M11 5l5 5-5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </Link>
                <Link className="button secondary" href="/login">
                  Intră în platformă
                </Link>
              </div>
            </div>

            {/* Product UI Showcase */}
            <div className="hero-stage" aria-label="Previzualizare interfață platformă" role="img">
              <article className="hero-stage-card hero-stage-main">
                <div className="stage-ui-header">
                  <span className="stage-kicker">Evaluare ten · Elena M.</span>
                  <span className="stage-progress-bar" aria-label="Progres chestionar 50%">
                    <span className="stage-progress-fill" style={{ width: "50%" }} />
                  </span>
                </div>
                <p className="stage-question">Cum descrieți textura pielii dvs. la finalul zilei?</p>
                <div className="stage-options">
                  {["Uscată și strânsă", "Normală, confortabilă", "Lucioasă în zona T", "Uniform lucioasă"].map((opt, i) => (
                    <div key={opt} className={`stage-option${i === 2 ? " stage-option-selected" : ""}`}>
                      <span className="stage-option-dot" />
                      {opt}
                    </div>
                  ))}
                </div>
              </article>

              <article className="hero-stage-card hero-stage-note" aria-label="Profil Baumann">
                <span className="stage-kicker">Profil Baumann</span>
                <strong className="baumann-preview-code">OSPT</strong>
                <p className="stage-baumann-desc">Oily · Sensitive · Pigmented · Tight</p>
                <div className="stage-score-bars">
                  {[["O/D", 68], ["S/R", 72], ["P/N", 55]].map(([dim, pct]) => (
                    <div key={dim} className="stage-score-row">
                      <span>{dim}</span>
                      <div className="stage-score-track">
                        <div className="stage-score-fill" style={{ width: `${pct}%` }} />
                      </div>
                      <span>{pct}%</span>
                    </div>
                  ))}
                </div>
              </article>

              <article className="hero-stage-card hero-stage-mini">
                <span className="stage-label">Următor pas</span>
                <strong>Plan tratament generat ✓</strong>
              </article>
            </div>
          </div>
        </section>

        {/* ── STATS ────────────────────────────────────────────────── */}
        <section className="landing-stats" aria-label="Statistici platformă">
          <ul className="stats-grid">
            {stats.map((s, i) => (
              <li
                key={s.label}
                className="stat-card"
                data-reveal
                data-delay={i}
              >
                <strong className="stat-value">{s.value}</strong>
                <span className="stat-label">{s.label}</span>
                <span className="stat-desc">{s.desc}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* ── FEATURES ─────────────────────────────────────────────── */}
        <section className="section-block features-showcase" aria-labelledby="features-title">
          <header className="section-header-row">
            <div>
              <span className="eyebrow">Ce face platforma</span>
              <h2 id="features-title">Trei instrumente. Un flux coerent.</h2>
            </div>
            <p className="section-lead">
              Insight Beauty unește evaluarea, interpretarea și follow-up-ul
              într-o singură experiență digitală premium.
            </p>
          </header>

          <div className="features-list">
            {features.map((feat, i) => (
              <article
                key={feat.id}
                className={`feature-block${i % 2 === 1 ? " feature-block-reverse" : ""}`}
                data-reveal
                aria-labelledby={`feat-title-${feat.id}`}
              >
                <div className="feature-block-image">
                  <Image
                    src={feat.image.src}
                    alt={feat.image.alt}
                    width={feat.image.width}
                    height={feat.image.height}
                    className="feat-img"
                    loading={i === 0 ? "eager" : "lazy"}
                    sizes="(max-width: 1080px) 100vw, 50vw"
                  />
                  <div className="feat-img-overlay" aria-hidden="true" />
                </div>

                <div className="feature-block-copy">
                  <div className="feat-icon-wrap" aria-hidden="true">
                    {feat.id === "intake" && <IconFlask />}
                    {feat.id === "dossier" && <IconFolder />}
                    {feat.id === "treatment" && <IconPlan />}
                  </div>
                  <span className="eyebrow">{feat.eyebrow}</span>
                  <h3 id={`feat-title-${feat.id}`}>{feat.title}</h3>
                  <p className="lead-copy">{feat.body}</p>
                  <ul className="feat-bullets" aria-label={`Beneficii ${feat.eyebrow}`}>
                    {feat.bullets.map((b) => (
                      <li key={b} className="feat-bullet">
                        <IconCheck />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                  <Link className="button primary feat-cta" href={feat.cta.href}>
                    {feat.cta.label}
                    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" className="btn-icon">
                      <path d="M4 10h12M11 5l5 5-5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* ── KIT DE CONSULTAȚIE ───────────────────────────────────── */}
        <section className="section-block kit-section" aria-labelledby="kit-title">
          <header className="section-header-row centered" data-reveal>
            <span className="eyebrow">Kit de consultație</span>
            <h2 id="kit-title">5 chestionare clinice. Un singur flux de intake.</h2>
            <p className="section-lead centered-lead">
              De la fototip la stilul de viață, fiecare client este evaluat complet înainte de prima ședință.
              Scorurile sunt interpretate automat — fără calcule manuale, fără pierderi de informație.
            </p>
          </header>

          <div className="card-grid kit-grid">
            {questionnaires.map((q, i) => (
              <article
                key={q.slug}
                className="kit-card"
                data-reveal
                data-delay={i}
              >
                <div className="kit-card-icon" style={{ color: q.color }} aria-hidden="true">
                  {q.icon}
                </div>
                <div className="kit-card-body">
                  <span className="kit-badge" style={{ backgroundColor: q.color + "22", color: q.color }}>
                    {q.badge}
                  </span>
                  <h3 className="kit-card-title">{q.title}</h3>
                  <p className="kit-card-desc">{q.body}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* ── HOW IT WORKS ─────────────────────────────────────────── */}
        <section className="section-block steps-section" aria-labelledby="steps-title">
          <header className="section-header-row centered">
            <span className="eyebrow">Cum funcționează</span>
            <h2 id="steps-title">Trei pași. De la zero la dosar complet.</h2>
            <p className="section-lead centered-lead">
              Fluxul este gândit să elimine fricțiunea pentru toți: client, profesionist și manager de salon.
            </p>
          </header>

          <ol className="steps-grid" aria-label="Pașii procesului">
            {steps.map((step, i) => (
              <li
                key={step.n}
                className="step-card"
                data-reveal
                data-delay={i}
              >
                <div className="step-number" aria-hidden="true">{step.n}</div>
                <div className="step-connector" aria-hidden="true" />
                <h3 className="step-title">{step.title}</h3>
                <p className="step-body">{step.body}</p>
              </li>
            ))}
          </ol>
        </section>

        {/* ── ROLES ────────────────────────────────────────────────── */}
        <section className="section-block perspective-band" aria-labelledby="roles-title">
          <header className="section-heading">
            <div>
              <span className="eyebrow">Construit pentru fiecare rol</span>
              <h2 id="roles-title">
                Aceeași platformă, experiențe separate pentru fiecare actor.
              </h2>
            </div>
          </header>

          <div className="card-grid four-up roles-grid">
            {roles.map((role, i) => (
              <article
                key={role.title}
                className="detail-card perspective-card role-card"
                data-reveal
                data-delay={i}
                aria-labelledby={`role-${i}`}
              >
                <div className="role-icon-wrap" aria-hidden="true">
                  <role.Icon />
                </div>
                <span className="role-tag">{role.tag}</span>
                <h3 id={`role-${i}`}>{role.title}</h3>
                <p>{role.body}</p>
              </article>
            ))}
          </div>
        </section>

        {/* ── TESTIMONIALS ─────────────────────────────────────────── */}
        <section className="section-block testimonials-section" aria-labelledby="testimonials-title">
          <header className="section-header-row centered">
            <span className="eyebrow">Ce spun profesioniștii</span>
            <h2 id="testimonials-title">Opinii de la specialiști care lucrează zilnic cu platforma.</h2>
          </header>

          <div className="testimonials-grid">
            {testimonials.map((t, i) => (
              <article
                key={t.name}
                className="testimonial-card"
                data-reveal
                data-delay={i}
                aria-label={`Testimonial de la ${t.name}`}
              >
                <div className="testimonial-stars" aria-label="Evaluare 5 stele">
                  {[1, 2, 3, 4, 5].map((s) => <IconStar key={s} />)}
                </div>
                <blockquote className="testimonial-quote">
                  <IconQuote />
                  <p>{t.quote}</p>
                </blockquote>
                <footer className="testimonial-author">
                  <div className="testimonial-avatar" aria-hidden="true">
                    {t.initials}
                  </div>
                  <div>
                    <strong className="testimonial-name">{t.name}</strong>
                    <span className="testimonial-role">{t.role}</span>
                    <span className="testimonial-salon">{t.salon}</span>
                  </div>
                </footer>
              </article>
            ))}
          </div>
        </section>

        {/* ── FAQ ──────────────────────────────────────────────────── */}
        <section className="section-block faq-section" aria-labelledby="faq-title">
          <header className="section-header-row">
            <div>
              <span className="eyebrow">Întrebări frecvente</span>
              <h2 id="faq-title">Tot ce vrei să știi înainte să începi.</h2>
            </div>
          </header>

          <dl className="faq-list" itemScope itemType="https://schema.org/FAQPage">
            {faqs.map((faq, i) => (
              <div
                key={faq.q}
                className="faq-item"
                data-reveal
                data-delay={i % 2}
                itemScope
                itemProp="mainEntity"
                itemType="https://schema.org/Question"
              >
                <dt className="faq-q" itemProp="name">{faq.q}</dt>
                <dd
                  className="faq-a"
                  itemScope
                  itemProp="acceptedAnswer"
                  itemType="https://schema.org/Answer"
                >
                  <span itemProp="text">{faq.a}</span>
                </dd>
              </div>
            ))}
          </dl>
        </section>

        {/* ── FINAL CTA ────────────────────────────────────────────── */}
        <section className="section-block final-cta-section" id="demo" aria-labelledby="cta-title">
          <div className="final-cta-inner">
            <header className="final-cta-copy">
              <span className="eyebrow">Gata să transformi salonul tău?</span>
              <h2 id="cta-title">
                Solicită o demonstrație gratuită.<br />Fără card. Fără angajament.
              </h2>
              <p className="lead-copy">
                Îți arătăm platforma configurată pentru tipul de salon tău în mai puțin de 30 de minute.
                Echipa noastră te ajută să pornești de la zero sau să migrezi de la procesele actuale.
              </p>
            </header>

            <DemoForm />

            <ul className="cta-trust-row" aria-label="Garanții">
              {[
                "Configurare în mai puțin de 10 minute",
                "Suport inclus în prima lună",
                "Date securizate și conforme GDPR",
                "Anulezi oricând, fără penalități"
              ].map((item) => (
                <li key={item} className="cta-trust-item">
                  <IconCheck />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ── FOOTER ───────────────────────────────────────────────── */}
        <footer className="landing-footer" role="contentinfo">
          <div className="footer-grid">
            <div className="footer-brand">
              <Link href="/" className="brand-mark footer-logo" aria-label="Insight Beauty — Acasă">
                Insight Beauty
              </Link>
              <p className="footer-tagline">
                Prima platformă de beauty intelligence<br />din România.
              </p>
              <div className="footer-social" aria-label="Social media">
                <a
                  href="https://instagram.com"
                  className="social-link"
                  aria-label="Instagram Insight Beauty"
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" width="20" height="20">
                    <rect x="2" y="2" width="20" height="20" rx="5" stroke="currentColor" strokeWidth="1.6" />
                    <circle cx="12" cy="12" r="5" stroke="currentColor" strokeWidth="1.6" />
                    <circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
                  </svg>
                </a>
                <a
                  href="https://linkedin.com"
                  className="social-link"
                  aria-label="LinkedIn Insight Beauty"
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" width="20" height="20">
                    <rect x="2" y="2" width="20" height="20" rx="4" stroke="currentColor" strokeWidth="1.6" />
                    <path d="M7 10v7M7 7v.5M11 17v-4a2 2 0 014 0v4M11 10v7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                  </svg>
                </a>
              </div>
            </div>

            <nav className="footer-nav" aria-label="Navigare platformă">
              <h3 className="footer-nav-title">Platformă</h3>
              <ul>
                <li><Link href="/client/intake">Evaluare client</Link></li>
                <li><Link href="/login">Workspace salon</Link></li>
                <li><Link href="/login">Portal client</Link></li>
              </ul>
            </nav>

            <nav className="footer-nav" aria-label="Informații">
              <h3 className="footer-nav-title">Informații</h3>
              <ul>
                <li><a href="#demo">Solicită demo</a></li>
                <li><a href="#faq-title">Întrebări frecvente</a></li>
              </ul>
            </nav>

            <div className="footer-legal">
              <h3 className="footer-nav-title">Legal</h3>
              <ul>
                <li><a href="#">Politica de confidențialitate</a></li>
                <li><a href="#">Termeni și condiții</a></li>
                <li><a href="#">Politica GDPR</a></li>
                <li><a href="#">Politica cookies</a></li>
              </ul>
            </div>
          </div>

          <div className="footer-bottom">
            <p>© {new Date().getFullYear()} Insight Beauty. Toate drepturile rezervate.</p>
            <p className="footer-bottom-right">
              Construit în România · GDPR compliant · PWA-ready
            </p>
          </div>
        </footer>

      </div>
    </>
  );
}
