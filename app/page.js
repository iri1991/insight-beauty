import Link from "next/link";
import { currentAccount } from "../lib/auth";

const destination = { admin: "/admin", salon: "/salon", professional: "/professional", client: "/client" };
const Arrow = () => <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12h15M13 5l7 7-7 7" fill="none" stroke="currentColor" strokeWidth="1.6" /></svg>;

export default async function Home() {
  const account = await currentAccount();
  const workspace = account ? destination[account.role] : "/login";
  return <main className="landing">
    <div className="landing-grain" />
    <nav className="landing-nav" aria-label="Navigație principală">
      <Link className="landing-brand" href="/"><span>IB</span>Insight Beauty</Link>
      <div className="landing-links"><a href="#platforma">Platforma</a><a href="#parcurs">Parcursul</a><a href="#pentru-echipe">Pentru echipe</a></div>
      <Link className="nav-login" href={workspace}>{account ? "Deschide spațiul meu" : "Autentificare"}<Arrow /></Link>
    </nav>

    <section className="landing-hero">
      <div className="hero-copy"><p className="landing-kicker"><i /> Inteligență pentru îngrijire</p><h1>Frumusețea are <em>memorie.</em></h1><p className="hero-lead">Insight Beauty transformă fiecare evaluare, recomandare și tratament într-un parcurs de îngrijire personalizat, clar și continuu.</p><div className="hero-actions"><Link className="landing-cta" href={workspace}>{account ? "Continuă în dosar" : "Accesează platforma"}<Arrow /></Link><a className="text-link" href="#parcurs">Descoperă parcursul <span>↓</span></a></div></div>
      <div className="hero-art" aria-label="Dosar Insight Beauty, ilustrație decorativă">
        <div className="sun-disc" /><div className="art-arch" /><div className="art-orbit orbit-one" /><div className="art-orbit orbit-two" />
        <article className="skin-card"><div className="skin-card-top"><span>Dosar de piele</span><span>01 / 04</span></div><div className="skin-code">OSPW</div><p>Tipologie Baumann</p><div className="skin-bars"><i /><i /><i /><i /></div><div className="skin-card-bottom"><span>Evaluare inițială</span><strong>Activă</strong></div></article>
        <p className="art-caption">O citire mai atentă<br />a ceea ce se schimbă.</p>
      </div>
      <div className="hero-note"><span>O platformă pentru</span><strong>clienți · profesioniști · saloane</strong></div>
    </section>

    <section className="landing-intro" id="platforma"><p className="section-number">01</p><div><p className="landing-kicker"><i /> Dosarul, nu doar datele</p><h2>Fiecare detaliu are un loc. Fiecare progres, un context.</h2></div><p className="intro-side">De la consimțământul inițial la următoarea programare, Insight Beauty creează o experiență liniștită pentru client și o perspectivă completă pentru echipă.</p></section>

    <section className="journey-section" id="parcurs"><div className="journey-heading"><p className="section-number">02</p><div><p className="landing-kicker"><i /> Un parcurs viu</p><h2>Îngrijirea nu se oprește la consultație.</h2></div></div><div className="journey-track"><article><span>01</span><h3>Începe cu acordul</h3><p>Clientul își creează contul, acceptă prelucrarea datelor și intră într-un spațiu personal securizat.</p></article><article><span>02</span><h3>Se evaluează corect</h3><p>Chestionarele urmează o ordine clinică. Rezultatul devine baza conversației cu specialistul.</p></article><article><span>03</span><h3>Se construiește în timp</h3><p>Vizitele, procedurile și tratamentele alcătuiesc un istoric care face progresul vizibil.</p></article></div></section>

    <section className="roles-section" id="pentru-echipe"><div className="roles-copy"><p className="section-number">03</p><p className="landing-kicker"><i /> O singură sursă de adevăr</p><h2>Relația bună cu clientul începe cu o echipă aliniată.</h2><p>Fiecare rol vede exact ceea ce are nevoie, fără compromisuri privind confidențialitatea datelor.</p></div><div className="role-list"><article><p>Client</p><h3>Își înțelege pielea și își urmărește parcursul.</h3><span>Rezultate · istoric · recomandări</span></article><article><p>Profesionist</p><h3>Își cunoaște clientul înainte de fiecare întâlnire.</h3><span>Dosare · evaluări · intervenții</span></article><article><p>Salon</p><h3>Are o perspectivă protejată asupra echipei și activității.</h3><span>Echipă · portofoliu · continuitate</span></article></div></section>

    <section className="landing-closing"><div><p className="landing-kicker"><i /> Insight Beauty</p><h2>Mai multă claritate<br />pentru fiecare etapă.</h2></div><Link className="closing-button" href={workspace}>{account ? "Deschide spațiul meu" : "Intră în platformă"}<Arrow /></Link></section>
    <footer className="landing-footer"><span>© 2026 Insight Beauty</span><span>Îngrijire informată. Relații durabile.</span></footer>
  </main>;
}
