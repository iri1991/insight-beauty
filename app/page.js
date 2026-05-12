import Link from "next/link";
import { DemoForm } from "../components/demo-form";
import { ScrollReveal } from "../components/scroll-reveal";

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
  offers: { "@type": "Offer", priceCurrency: "RON" },
  featureList: [
    "Intake clinic digital personalizabil",
    "Analiză automată tip piele Baumann — 16 tipologii",
    "Dosar evolutiv al clientului",
    "Plan de tratament și homecare personalizat",
    "PWA instalabil pe iOS și Android",
    "Arhitectură multi-tenant cu izolare completă",
    "Conformitate GDPR"
  ],
  inLanguage: "ro"
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Insight Beauty",
  url: "https://insightbeauty.ro",
  description: "Insight Beauty creează sisteme de beauty intelligence pentru saloane premium și skin studios din România.",
  areaServed: "RO",
  knowsAbout: ["Baumann skin type analysis", "beauty salon software", "client intake management", "skin care intelligence"]
};

// ─── Baumann 16-type matrix visual ───────────────────────────────────────────

const BAUMANN_TYPES = [
  { code: "OSPT", g1: "#c8604a", g2: "#a84030" },
  { code: "OSPW", g1: "#c05840", g2: "#a03828" },
  { code: "OSNT", g1: "#d4904a", g2: "#b87030" },
  { code: "OSNW", g1: "#c88440", g2: "#aa6428" },
  { code: "ORPT", g1: "#6e9e72", g2: "#508055" },
  { code: "ORPW", g1: "#68946c", g2: "#4a7450" },
  { code: "ORNT", g1: "#9aba9e", g2: "#7c9c80" },
  { code: "ORNW", g1: "#90b094", g2: "#729476" },
  { code: "DSPT", g1: "#c09080", g2: "#a47060" },
  { code: "DSPW", g1: "#b48070", g2: "#986052" },
  { code: "DSNT", g1: "#d4bca8", g2: "#bca090" },
  { code: "DSNW", g1: "#c8b09c", g2: "#b09480" },
  { code: "DRPT", g1: "#8e7a6c", g2: "#706050" },
  { code: "DRPW", g1: "#846e60", g2: "#685448" },
  { code: "DRNT", g1: "#c4b4a4", g2: "#b0a090" },
  { code: "DRNW", g1: "#baaaa0", g2: "#a09488" }
];

function BaumannMatrix() {
  const size = 68;
  const gap = 5;
  const cols = 4;
  const rows = 4;
  const total = cols * (size + gap) - gap;

  return (
    <svg
      viewBox={`0 0 ${total} ${total}`}
      width={total}
      height={total}
      aria-label="Matricea celor 16 tipologii Baumann"
      className="lp-baumann-svg"
    >
      <defs>
        {BAUMANN_TYPES.map((t, i) => (
          <linearGradient key={t.code} id={`bg${i}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={t.g1} />
            <stop offset="100%" stopColor={t.g2} />
          </linearGradient>
        ))}
        <filter id="cell-shadow" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="rgba(60,30,20,0.18)" />
        </filter>
      </defs>

      {BAUMANN_TYPES.map((t, i) => {
        const col = i % cols;
        const row = Math.floor(i / cols);
        const x = col * (size + gap);
        const y = row * (size + gap);
        return (
          <g key={t.code} filter="url(#cell-shadow)">
            <rect x={x} y={y} width={size} height={size} rx="10" fill={`url(#bg${i})`} />
            <text
              x={x + size / 2}
              y={y + size / 2 + 5}
              textAnchor="middle"
              fontSize="10.5"
              fontWeight="700"
              fontFamily="'Avenir Next', 'Segoe UI', sans-serif"
              letterSpacing="0.06em"
              fill="rgba(255,255,255,0.92)"
            >
              {t.code}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

// ─── Skin dimension spectrum visual ──────────────────────────────────────────

function SkinSpectrum() {
  const dims = [
    {
      code: "O / D",
      a: "Oily",
      b: "Dry",
      desc: "Producția de sebum",
      from: "#c87858",
      to: "#ead4c0"
    },
    {
      code: "S / R",
      a: "Sensitive",
      b: "Resistant",
      desc: "Reactivitate cutanată",
      from: "#d4807a",
      to: "#c4b8b0"
    },
    {
      code: "P / N",
      a: "Pigmented",
      b: "Non-pigmented",
      desc: "Melanogeneză",
      from: "#8a5038",
      to: "#f2e8e0"
    },
    {
      code: "W / T",
      a: "Wrinkled",
      b: "Tight",
      desc: "Aging cutanat",
      from: "#c0a488",
      to: "#ddd0c4"
    }
  ];

  return (
    <div className="lp-spectrum">
      {dims.map((d) => (
        <div key={d.code} className="lp-spectrum-dim">
          <div className="lp-spectrum-meta">
            <span className="lp-spectrum-code">{d.code}</span>
            <span className="lp-spectrum-desc">{d.desc}</span>
          </div>
          <div className="lp-spectrum-row">
            <span className="lp-spectrum-pole">{d.a}</span>
            <div
              className="lp-spectrum-track"
              style={{ background: `linear-gradient(90deg, ${d.from}, ${d.to})` }}
              aria-hidden="true"
            />
            <span className="lp-spectrum-pole">{d.b}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Kit questionnaire rows ───────────────────────────────────────────────────

const KIT_ITEMS = [
  {
    n: "01",
    title: "Profilare Baumann",
    sub: "16 tipologii",
    body: "Evaluare pe 4 dimensiuni — sebum, reactivitate, melanogeneză, aging. Motor intern folosit de profesionist, rezultat automat.",
    color: "#c76447",
    badge: "Profesionist",
    motif: (
      <svg viewBox="0 0 48 48" fill="none" width="48" height="48" aria-hidden="true">
        <rect x="4" y="4" width="18" height="18" rx="3" fill="currentColor" opacity="0.9" />
        <rect x="26" y="4" width="18" height="18" rx="3" fill="currentColor" opacity="0.6" />
        <rect x="4" y="26" width="18" height="18" rx="3" fill="currentColor" opacity="0.6" />
        <rect x="26" y="26" width="18" height="18" rx="3" fill="currentColor" opacity="0.3" />
      </svg>
    )
  },
  {
    n: "02",
    title: "Fototip Fitzpatrick",
    sub: "8 întrebări",
    body: "Determină fototipul I–VI, calculează riscul UV și selecția protocoalelor foto-sensibile sigure pentru client.",
    color: "#d4813c",
    badge: "Client · Self-service",
    motif: (
      <svg viewBox="0 0 48 48" fill="none" width="48" height="48" aria-hidden="true">
        <circle cx="24" cy="24" r="10" fill="currentColor" opacity="0.9" />
        {[0,45,90,135,180,225,270,315].map((deg, i) => {
          const r = deg * Math.PI / 180;
          return <line key={i} x1={24+16*Math.cos(r)} y1={24+16*Math.sin(r)} x2={24+20*Math.cos(r)} y2={24+20*Math.sin(r)} stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" opacity="0.7" />;
        })}
      </svg>
    )
  },
  {
    n: "03",
    title: "Lifestyle Insight",
    sub: "44 întrebări / 5 secțiuni",
    body: "Alimentație, somn, stres, mișcare, hidratare — evaluare completă a factorilor de viață care afectează direct sănătatea tenului.",
    color: "#5a9a72",
    badge: "Client",
    motif: (
      <svg viewBox="0 0 48 48" fill="none" width="48" height="48" aria-hidden="true">
        {[10,18,26,34,42].map((x, i) => (
          <rect key={i} x={x-3} y={48-(i+1)*8-4} width="6" height={(i+1)*8} rx="3" fill="currentColor" opacity={0.4 + i*0.12} />
        ))}
      </svg>
    )
  },
  {
    n: "04",
    title: "Screening Dermatită",
    sub: "36 întrebări / 6 secțiuni",
    body: "Prurit, eritem, descuamare, edem, excoriații, lichenificare — scor de severitate și protocol recomandat.",
    color: "#6a8fc4",
    badge: "Client",
    motif: (
      <svg viewBox="0 0 48 48" fill="none" width="48" height="48" aria-hidden="true">
        <circle cx="24" cy="24" r="18" stroke="currentColor" strokeWidth="2" opacity="0.5" />
        <circle cx="24" cy="24" r="12" stroke="currentColor" strokeWidth="2" opacity="0.7" />
        <circle cx="24" cy="24" r="5" fill="currentColor" opacity="0.9" />
      </svg>
    )
  },
  {
    n: "05",
    title: "Screening Psoriazis",
    sub: "40 întrebări / 5 secțiuni",
    body: "Simptome cutanate, distribuție, manifestări unghiale și articulare, calitatea vieții, factori de risc — cu criterii clare de escaladare medicală.",
    color: "#b06aaa",
    badge: "Client",
    motif: (
      <svg viewBox="0 0 48 48" fill="none" width="48" height="48" aria-hidden="true">
        <path d="M24 4L44 44H4L24 4z" stroke="currentColor" strokeWidth="2" fill="none" opacity="0.5" />
        <path d="M24 16L37 40H11L24 16z" fill="currentColor" opacity="0.4" />
        <circle cx="24" cy="34" r="3" fill="currentColor" opacity="0.9" />
      </svg>
    )
  }
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function LandingPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }} />
      <ScrollReveal />

      {/* ── HERO ─────────────────────────────────────────────────────── */}
      <section className="lp-hero" aria-labelledby="hero-h1">
        <div className="lp-hero-inner">
          <div className="lp-hero-text">
            <span className="lp-kicker">Beauty Intelligence Platform</span>
            <h1 id="hero-h1" className="lp-headline">
              <em>Inteligența</em><br />
              pielii, în centrul<br />
              fiecărei consultații.
            </h1>
            <p className="lp-lead">
              Intake clinic digital, profilare Baumann automată și dosar evolutiv
              pentru saloane premium și skin studios. De la prima evaluare la planul de tratament — în același flux.
            </p>
            <div className="lp-hero-cta">
              <Link className="lp-btn-primary" href="/client/intake">
                Încearcă evaluarea demo
                <svg viewBox="0 0 20 20" fill="none" width="16" height="16" aria-hidden="true">
                  <path d="M4 10h12M11 5l5 5-5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
              <a className="lp-btn-ghost" href="#kit">
                Descoperă kit-ul clinic
              </a>
            </div>
          </div>

          <div className="lp-hero-visual" aria-hidden="true">
            <div className="lp-matrix-card">
              <p className="lp-matrix-card-eyebrow">16 tipologii Baumann</p>
              <BaumannMatrix />
              <p className="lp-matrix-caption">cartografiate automat prin evaluare clinică</p>
            </div>
          </div>
        </div>

        <div className="lp-hero-numbers" aria-label="Date cheie">
          <div className="lp-hero-num">
            <strong>5</strong>
            <span>chestionare clinice</span>
          </div>
          <div className="lp-hero-num-div" aria-hidden="true" />
          <div className="lp-hero-num">
            <strong>16</strong>
            <span>tipologii Baumann</span>
          </div>
          <div className="lp-hero-num-div" aria-hidden="true" />
          <div className="lp-hero-num">
            <strong>&lt; 3 min</strong>
            <span>timp mediu evaluare</span>
          </div>
        </div>
      </section>

      {/* ── MANIFESTO ────────────────────────────────────────────────── */}
      <section className="lp-manifesto" aria-label="Filosofia platformei">
        <div className="lp-manifesto-inner">
          <div className="lp-manifesto-mark" aria-hidden="true">✦</div>
          <blockquote className="lp-manifesto-text">
            Un profesionist care înțelege pielea clientului de la prima ședință
            este un profesionist pe care clienții îl recomandă.
          </blockquote>
          <p className="lp-manifesto-sub">
            Insight Beauty pune evaluarea clinică la baza fiecărei relații cu clientul.
          </p>
        </div>
      </section>

      {/* ── KIT DE CONSULTAȚIE ───────────────────────────────────────── */}
      <section id="kit" className="lp-kit" aria-labelledby="kit-h2">
        <div className="lp-kit-header" data-reveal>
          <span className="lp-section-kicker">Kit de consultație</span>
          <h2 id="kit-h2" className="lp-section-title">
            Cinci instrumente clinice.<br />
            <em>Un singur flux de intake.</em>
          </h2>
          <p className="lp-section-lead">
            Fiecare chestionar este validat clinic, codat complet și gata de utilizare.
            Scorurile sunt interpretate automat — profesionistul primește profilul complet înainte de prima ședință.
          </p>
        </div>

        <div className="lp-kit-rows">
          {KIT_ITEMS.map((item, i) => (
            <article
              key={item.n}
              className="lp-kit-row"
              style={{ "--kit-color": item.color }}
              data-reveal
              data-delay={i}
            >
              <div className="lp-kit-row-num">{item.n}</div>
              <div className="lp-kit-row-motif" style={{ color: item.color }}>
                {item.motif}
              </div>
              <div className="lp-kit-row-body">
                <div className="lp-kit-row-top">
                  <h3 className="lp-kit-row-title">{item.title}</h3>
                  <div className="lp-kit-row-meta">
                    <span className="lp-kit-badge" style={{ color: item.color, borderColor: item.color + "44" }}>{item.badge}</span>
                    <span className="lp-kit-sub">{item.sub}</span>
                  </div>
                </div>
                <p className="lp-kit-row-desc">{item.body}</p>
              </div>
              <div className="lp-kit-row-accent" style={{ background: item.color }} aria-hidden="true" />
            </article>
          ))}
        </div>
      </section>

      {/* ── BAUMANN SYSTEM ───────────────────────────────────────────── */}
      <section className="lp-baumann-section" aria-labelledby="baumann-h2">
        <div className="lp-baumann-inner">
          <div className="lp-baumann-text" data-reveal>
            <span className="lp-section-kicker">Sistemul Baumann</span>
            <h2 id="baumann-h2" className="lp-section-title">
              4 dimensiuni.<br />
              <em>16 tipologii distincte.</em>
            </h2>
            <p className="lp-section-lead">
              Fiecare piele este o combinație unică pe 4 axe. Insight Beauty calculează automat
              tipologia și generează recomandări de tratament și homecare personalizate.
            </p>
            <div className="lp-baumann-types-row" aria-label="Exemple de tipologii Baumann">
              {["OSPT", "DRNT", "ORPW", "DSPW"].map((t) => (
                <span key={t} className="lp-type-chip">{t}</span>
              ))}
              <span className="lp-type-chip-more">+12</span>
            </div>
          </div>

          <div className="lp-baumann-visual" data-reveal data-delay="1">
            <SkinSpectrum />
          </div>
        </div>
      </section>

      {/* ── FLUX ─────────────────────────────────────────────────────── */}
      <section className="lp-flow" aria-labelledby="flow-h2">
        <div className="lp-flow-header" data-reveal>
          <span className="lp-section-kicker">Cum funcționează</span>
          <h2 id="flow-h2" className="lp-section-title">De la link la dosar complet.</h2>
        </div>

        <div className="lp-flow-steps">
          {[
            {
              n: "01",
              title: "Clientul completează",
              body: "Primește un link personalizat înainte de programare. Parcurge chestionarele selectate în 2–5 minute, de pe orice dispozitiv.",
              detail: "Fără cont. Fără app. Fără fricțiune."
            },
            {
              n: "02",
              title: "Sistemul interpretează",
              body: "Răspunsurile sunt procesate automat. Tipologia Baumann, scorurile clinice și prioritățile de tratament — calculate instant.",
              detail: "Zero intervenție manuală."
            },
            {
              n: "03",
              title: "Profesionistul acționează",
              body: "La prima ședință, profilul clientului este deja complet: Baumann, fototip, lifestyle, riscuri clinice și plan de tratament propus.",
              detail: "Prima ședință devine consultație reală."
            }
          ].map((step, i) => (
            <article key={step.n} className="lp-flow-step" data-reveal data-delay={i}>
              <div className="lp-flow-n" aria-hidden="true">{step.n}</div>
              <h3 className="lp-flow-title">{step.title}</h3>
              <p className="lp-flow-body">{step.body}</p>
              <p className="lp-flow-detail">{step.detail}</p>
            </article>
          ))}
        </div>
      </section>

      {/* ── ROLURI ───────────────────────────────────────────────────── */}
      <section className="lp-roles" aria-labelledby="roles-h2">
        <div className="lp-roles-inner">
          <div className="lp-roles-header" data-reveal>
            <span className="lp-section-kicker">Construit pentru fiecare rol</span>
            <h2 id="roles-h2" className="lp-section-title">
              Aceeași platformă.<br />
              <em>Experiențe separate.</em>
            </h2>
          </div>

          <div className="lp-roles-grid">
            {[
              {
                tag: "Admin",
                title: "Control global",
                body: "Gestionează chestionarele, logica de interpretare, saloanele active și întreaga platformă dintr-un panou central."
              },
              {
                tag: "Salon",
                title: "Spațiu de lucru dedicat",
                body: "Datele clienților tăi sunt izolate, criptate și accesibile doar personalului autorizat. Branded, separat, sigur."
              },
              {
                tag: "Profesionist",
                title: "Context clinic complet",
                body: "Trimiți link-ul, primești profilul. La ședință ai deja totul: Baumann, fototip, preocupări, plan propus."
              },
              {
                tag: "Client",
                title: "Dosar personal evolutiv",
                body: "Evaluările se acumulează în timp. Clientul vede evoluția tenului, planul activ și primește chestionare de la profesionist."
              }
            ].map((role, i) => (
              <article key={role.tag} className="lp-role-card" data-reveal data-delay={i}>
                <span className="lp-role-tag">{role.tag}</span>
                <h3 className="lp-role-title">{role.title}</h3>
                <p className="lp-role-body">{role.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────── */}
      <section id="demo" className="lp-cta" aria-labelledby="cta-h2">
        <div className="lp-cta-inner">
          <div className="lp-cta-text" data-reveal>
            <span className="lp-section-kicker lp-kicker-light">Demonstrație gratuită</span>
            <h2 id="cta-h2" className="lp-section-title lp-title-light">
              Configurare în<br />
              <em className="lp-cta-em">mai puțin de 10 minute.</em>
            </h2>
            <p className="lp-lead-light" style={{ marginTop: "1rem", fontSize: "1rem" }}>
              Fără card de credit. Fără angajament. Primești acces complet la platformă și asistență pentru
              configurarea inițială.
            </p>
          </div>
          <div className="lp-cta-form" data-reveal data-delay="1">
            <DemoForm />
          </div>
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────────────────────────── */}
      <footer className="lp-footer" aria-label="Footer">
        <div className="lp-footer-inner">
          <div className="lp-footer-brand">
            <span className="lp-footer-mark">✦</span>
            <strong>Insight Beauty</strong>
            <p>Beauty intelligence pentru saloane premium și skin studios din România.</p>
          </div>
          <nav className="lp-footer-nav" aria-label="Navigare footer">
            <div>
              <strong>Platformă</strong>
              <a href="/client/intake">Evaluare demo</a>
              <a href="/login">Autentificare</a>
            </div>
            <div>
              <strong>Kit clinic</strong>
              <a href="#kit">Baumann · Fitzpatrick</a>
              <a href="#kit">Lifestyle · Dermatită · Psoriazis</a>
            </div>
            <div>
              <strong>Legal</strong>
              <a href="#">Politica de confidențialitate</a>
              <a href="#">Termeni și condiții</a>
            </div>
          </nav>
          <p className="lp-footer-copy">© {new Date().getFullYear()} Insight Beauty · GDPR compliant · Date izolate per salon</p>
        </div>
      </footer>
    </>
  );
}
