import Link from "next/link";
import { LogoutButton, StopImpersonatingButton } from "./logout-button";

const navigation = {
  client: [["Dosarul meu", "/client"]],
  professional: [["Clienții mei", "/professional"]],
  salon: [["Echipa salonului", "/salon"]],
  admin: [["Administrare", "/admin"]]
};

export function AppShell({ account, children }) {
  const roleLabel = { client: "Spațiu client", professional: "Spațiu profesionist", salon: "Spațiu salon", admin: "Control platformă" }[account.role];
  return <div className="unified-app">
    <header className="unified-header"><Link className="unified-brand" href="/"><span>✦</span>Insight<i>Beauty</i></Link><nav aria-label="Navigație aplicație">{navigation[account.role].map(([label, href]) => <Link key={href} href={href}>{label}</Link>)}</nav><div className="unified-account"><span>{account.impersonatedBy ? "Impersonare salon" : roleLabel}</span><strong>{account.name}</strong>{account.impersonatedBy ? <StopImpersonatingButton /> : <LogoutButton />}</div></header>
    <main className="unified-workspace">{children}</main>
  </div>;
}
