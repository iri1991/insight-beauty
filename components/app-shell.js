import Link from "next/link";
import { LogoutButton } from "./logout-button";

const navigation = {
  client: [["Dosarul meu", "/client"]],
  professional: [["Clienții mei", "/professional"]],
  salon: [["Echipa salonului", "/salon"]],
  admin: [["Administrare", "/admin"]]
};

export function AppShell({ account, children }) {
  return <div className="app-frame">
    <aside className="sidebar">
      <Link className="brand" href="/"><span className="brand-mark">I</span><span>Insight<br />Beauty</span></Link>
      <p className="sidebar-label">Spațiu {account.role === "professional" ? "profesionist" : account.role === "client" ? "client" : account.role}</p>
      <nav>{navigation[account.role].map(([label, href]) => <Link key={href} href={href}>{label}</Link>)}</nav>
      <div className="account-block"><strong>{account.name}</strong><span>{account.email}</span><LogoutButton /></div>
    </aside>
    <main className="workspace">{children}</main>
  </div>;
}
