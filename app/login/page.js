import { redirect } from "next/navigation";
import { LoginForm } from "../../components/login-form";
import { currentAccount } from "../../lib/auth";

export default async function LoginPage() { if (await currentAccount()) redirect("/"); return <main className="auth-page"><div className="auth-intro"><p className="eyebrow">Insight Beauty</p><h2>O viziune clară asupra pielii, de la prima conversație.</h2><p>Dosare în timp, evaluări ordonate și continuitate între client, profesionist și salon.</p></div><LoginForm /></main>; }
