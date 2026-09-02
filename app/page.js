import Link from "next/link";

const softwareJsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Insight Beauty",
  applicationCategory: "BusinessApplication",
  description: "Platformă pentru intake, interpretarea evaluărilor și dosarul evolutiv al clientului în saloane și skin studios.",
  operatingSystem: "Web, iOS, Android",
  inLanguage: "ro"
};

function SkinMap() {
  return (
    <div className="mk-skin-map" aria-label="Hartă abstractă a unei evaluări de piele">
      <div className="mk-map-orbit mk-map-orbit-one" />
      <div className="mk-map-orbit mk-map-orbit-two" />
      <div className="mk-map-surface">
        <span className="mk-map-label">SKIN / CONTEXT</span>
        <div className="mk-map-grid">{Array.from({ length: 16 }, (_, index) => <i key={index} />)}</div>
      </div>
      <div className="mk-map-note mk-map-note-a"><b>01</b> intake</div>
      <div className="mk-map-note mk-map-note-b"><b>02</b> interpretare</div>
      <div className="mk-map-note mk-map-note-c"><b>03</b> evoluție</div>
    </div>
  );
}

const capabilities = [
  ["Intake ghidat", "Clientul primește întrebările potrivite, într-un parcurs simplu de pe orice dispozitiv."],
  ["Logică administrabilă", "Echipa admin configurează întrebări, variante de răspuns, scoruri și interpretări."],
  ["Dosar care continuă", "Evaluările, observațiile, tratamentele și următorii pași păstrează același context."]
];

const roles = [
  ["Administrator", "Controlează formularele, regulile de interpretare și structura operațională."],
  ["Salon", "Lucrează doar cu propriile date, echipă și dosare de client."],
  ["Profesionist", "Trimite evaluări și ajunge la consultație cu un context deja organizat."],
  ["Client", "Își completează evaluarea și urmărește recomandările în dosarul personal."]
];

export default function LandingPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareJsonLd) }} />
      <section className="mk-hero" aria-labelledby="hero-title">
        <div className="mk-container mk-hero-grid">
          <div className="mk-hero-copy">
            <p className="mk-eyebrow">Insight Beauty / Care intelligence</p>
            <h1 id="hero-title">Mai puțină presupunere.<br /><em>Mai mult context.</em></h1>
            <p className="mk-intro">O platformă pentru saloane și profesioniști care transformă evaluarea pielii într-un parcurs coerent: întrebare, interpretare, conversație, plan.</p>
            <div className="mk-actions"><Link href="/login" className="mk-button mk-button-primary">Intră în platformă <span aria-hidden="true">↗</span></Link><a href="#cum-functioneaza" className="mk-button mk-button-quiet">Vezi cum funcționează</a></div>
          </div>
          <SkinMap />
        </div>
        <div className="mk-container mk-hero-foot"><span>INTAKE</span><i /><span>INTERPRETARE</span><i /><span>DOSAR EVOLUTIV</span><i /><span>PWA</span></div>
      </section>
      <section className="mk-statement"><div className="mk-container"><p className="mk-eyebrow">O infrastructură discretă</p><h2>Consultația rămâne umană.<br />Informația devine <em>mai clară.</em></h2></div></section>
      <section className="mk-capabilities" id="cum-functioneaza"><div className="mk-container"><div className="mk-section-head"><p className="mk-eyebrow">În jurul clientului</p><p>Insight Beauty leagă etapele care de obicei rămân separate între formular, conversație și fișa de lucru.</p></div><div className="mk-capability-list">{capabilities.map(([title, body], index) => <article key={title} className="mk-capability"><span>0{index + 1}</span><h3>{title}</h3><p>{body}</p></article>)}</div></div></section>
      <section className="mk-flow"><div className="mk-container mk-flow-grid"><div><p className="mk-eyebrow">Un flux, nu încă un tool</p><h2>De la link-ul primit<br />la următorul pas.</h2></div><ol><li><b>Clientul completează</b><span>Răspunsurile și datele de contact intră în contextul corect al salonului.</span></li><li><b>Sistemul organizează</b><span>Regulile configurate adaugă scoruri și interpretări, fără a înlocui decizia specialistului.</span></li><li><b>Profesionistul continuă</b><span>Debriefingul, planul de tratament și progresul rămân în dosarul clientului.</span></li></ol></div></section>
      <section className="mk-roles"><div className="mk-container"><div className="mk-section-head"><p className="mk-eyebrow">Acces bazat pe rol</p><p>Vizibilitatea datelor rămâne delimitată per salon. Administratorii pot intra în contextul unui salon doar pentru suport și audit.</p></div><div className="mk-role-grid">{roles.map(([role, body]) => <article key={role}><h3>{role}</h3><p>{body}</p></article>)}</div></div></section>
      <section className="mk-access"><div className="mk-container mk-access-inner"><div><p className="mk-eyebrow">Spațiul tău de lucru</p><h2>Tot ce contează<br />într-un singur <em>fir.</em></h2></div><div><p>Autentifică-te pentru a accesa instrumentele, dosarele și evaluările disponibile pentru rolul tău.</p><Link href="/login" className="mk-button mk-button-light">Autentificare <span aria-hidden="true">↗</span></Link></div></div></section>
      <footer className="mk-footer"><div className="mk-container"><strong><i>IB</i> Insight Beauty</strong><span>Platformă pentru evaluări și continuitatea îngrijirii.</span><span>© {new Date().getFullYear()}</span></div></footer>
    </>
  );
}
