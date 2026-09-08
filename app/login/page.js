import { redirect } from "next/navigation";
import Link from "next/link";
import { LoginForm } from "../../components/login-form";
import { currentAccount } from "../../lib/auth";

export default async function LoginPage() { if (await currentAccount()) redirect("/"); return <main className="login-page"><Link className="login-brand" href="/"><span>✦</span>Insight Beauty</Link><div className="login-panel"><div className="login-story"><p className="landing-kicker"><i /> Spațiu securizat</p><h1>Tot ce contează, păstrat cu grijă.</h1><p>Rezultate, planuri și continuitate, într-un dosar construit în jurul fiecărui client.</p><div className="login-orbit"><span>confidențialitate</span><span>continuitate</span><span>claritate</span></div></div><LoginForm /></div><p className="login-footnote">Insight Beauty · Platformă de îngrijire personalizată</p></main>; }
