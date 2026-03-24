import Link from "next/link";

const heroSignals = ["guided intake", "clinical skin journeys", "tenant privacy by design"];

const pillars = [
  {
    title: "Beautifully calm",
    copy: "Experienta este aerisita, clara si tactila. Totul se simte premium, fara zgomot operational sau ecrane incarcate."
  },
  {
    title: "Clinically precise",
    copy: "Chestionarele, interpretarile si dosarul evolutiv lucreaza impreuna pentru o relatie mai inteligenta intre beauty si skin health."
  },
  {
    title: "Built for continuity",
    copy: "Primul intake nu se pierde intr-un formular uitat. Din el incepe un dosar viu, cu progres, tratamente si follow-up."
  }
];

const experienceMoments = [
  {
    label: "01",
    title: "First contact becomes diagnosis-ready",
    copy: "Clientul intra intr-un intake elegant, complet, natural de parcurs si suficient de riguros pentru un debriefing real."
  },
  {
    label: "02",
    title: "Results become a care conversation",
    copy: "Raspunsurile nu raman brute. Ele se transforma in interpretari, context, prioritati si propuneri de urmator pas."
  },
  {
    label: "03",
    title: "Every client becomes longitudinal",
    copy: "Dupa prima evaluare, Insight Beauty deschide un traseu: obiective, plan activ, sedinte, observatii si evolutie in timp."
  }
];

const rolePerspective = [
  {
    title: "Admini",
    copy: "Orchestreaza biblioteca de formulare, logica de interpretare, tenanturile si observabilitatea platformei."
  },
  {
    title: "Saloane",
    copy: "Isi pastreaza datele clientilor intr-un spatiu izolat, elegant si sigur, gandit pentru confidentialitate reala."
  },
  {
    title: "Profesionisti",
    copy: "Distribuie intake-uri, citesc contextul clientului mai repede si opereaza tot traseul terapeutic din acelasi loc."
  },
  {
    title: "Clienti",
    copy: "Primesc o experienta coerenta, premium si clara, de la primul formular pana la confirmare si debriefing."
  }
];

const productCuts = [
  "Intake public cu interpretare automata",
  "Dosar personal evolutiv dupa primul raspuns",
  "Plan de tratament si homecare in acelasi flux",
  "Share elegant pentru profesionisti si follow-up rapid",
  "PWA instalabil, pregatit pentru push si mobile extension"
];

export default function HomePage() {
  return (
    <div className="stack page-stack landing-shell">
      <section className="hero hero-immersive">
        <div className="hero-grid landing-hero-grid">
          <div className="hero-copy landing-copy">
            <span className="eyebrow">Beauty intelligence for 2026 care spaces</span>
            <h1>Insight Beauty aduce eleganta editoriala si rigoare clinica in acelasi sistem.</h1>
            <p className="lead-copy">
              O platforma creata pentru saloane premium, skin studios si concepte moderne de beauty-health care vor mai
              mult decat formulare. Vor context, continuitate, confidentialitate si o experienta care arata la fel de
              bine precum functioneaza.
            </p>

            <div className="capsule-strip">
              {heroSignals.map((signal) => (
                <span key={signal} className="capsule-pill">
                  {signal}
                </span>
              ))}
            </div>

            <div className="button-row landing-actions">
              <Link className="button primary" href="/client/intake">
                Descopera experienta clientului
              </Link>
              <Link className="button secondary" href="/login">
                Intra in platforma
              </Link>
            </div>
          </div>

          <div className="hero-stage">
            <article className="hero-stage-card hero-stage-main">
              <span className="eyebrow">Signature atmosphere</span>
              <h2>From first glow to living dossier.</h2>
              <p>
                Insight Beauty este gandit ca o experienta fluida: un intake sofisticat, o interpretare clara, apoi o
                relatie operationala continua intre client, profesionist si salon.
              </p>
            </article>

            <article className="hero-stage-card hero-stage-note">
              <span className="stage-kicker">Crafted for premium skin care</span>
              <p>
                Nu este un CRM generic cosmetizat. Este un sistem construit din perspectiva unei experiente beauty-health
                contemporane, calme si foarte precise.
              </p>
            </article>

            <article className="hero-stage-card hero-stage-mini">
              <span className="stage-label">Mobile native energy</span>
              <strong>PWA-ready, push-ready, future app-ready.</strong>
            </article>
          </div>
        </div>
      </section>

      <section className="section-block editorial-band">
        <div className="editorial-grid">
          <div className="editorial-intro">
            <span className="eyebrow">Design philosophy</span>
            <h2>Un produs care nu forteaza beauty-ul sa semene cu software de backoffice.</h2>
          </div>

          <div className="card-grid three-up">
            {pillars.map((pillar) => (
              <article key={pillar.title} className="detail-card editorial-card">
                <h3>{pillar.title}</h3>
                <p>{pillar.copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section-block story-band">
        <div className="section-heading">
          <div>
            <span className="eyebrow">Experience flow</span>
            <h2>Un parcurs coerent, gandit pentru conversatie, decizie si continuitate.</h2>
          </div>
        </div>

        <div className="card-grid three-up">
          {experienceMoments.map((moment) => (
            <article key={moment.label} className="detail-card story-card">
              <span className="story-index">{moment.label}</span>
              <h3>{moment.title}</h3>
              <p>{moment.copy}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section-block perspective-band">
        <div className="section-heading">
          <div>
            <span className="eyebrow">Made for every role</span>
            <h2>Fiecare actor vede exact ce are nevoie, fara sa piarda finetea experientei.</h2>
          </div>
        </div>

        <div className="card-grid four-up">
          {rolePerspective.map((role) => (
            <article key={role.title} className="detail-card perspective-card">
              <h3>{role.title}</h3>
              <p>{role.copy}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section-block feature-band">
        <div className="feature-band-grid">
          <div className="feature-band-copy">
            <span className="eyebrow">What lives inside</span>
            <h2>Insight Beauty uneste intake, interpretare, tratament si follow-up intr-un singur gest digital.</h2>
            <p className="lead-copy">
              Totul este construit pentru spatii de beauty care gandesc pe termen lung: nu doar sedinte, ci relatie,
              memorie si o estetica operationala de nivel inalt.
            </p>
          </div>

          <div className="feature-stack">
            {productCuts.map((item) => (
              <article key={item} className="feature-line">
                <span className="feature-dot" />
                <p>{item}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section-block final-cta">
        <div className="final-cta-copy">
          <span className="eyebrow">Ready to feel different</span>
          <h2>O platforma care arata, se misca si gandeste ca un brand beauty premium.</h2>
          <p className="lead-copy">
            Insight Beauty este despre claritate, rafinament si decizii mai bune, fara compromis intre estetica si
            structura operationala.
          </p>
        </div>

        <div className="button-row">
          <Link className="button primary" href="/client/intake">
            Vezi fluxul de intake
          </Link>
          <Link className="button secondary" href="/login">
            Acceseaza workspace-ul
          </Link>
        </div>
      </section>
    </div>
  );
}
