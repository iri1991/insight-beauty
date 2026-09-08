import { redirect } from "next/navigation";
import { AppShell } from "../../components/app-shell";
import { currentAccount } from "../../lib/auth";
import { getSalonWorkspace } from "../../lib/dashboard";

export default async function SalonPage() {
  const account = await currentAccount(); if (!account || account.role !== "salon") redirect("/login");
  const workspace = await getSalonWorkspace(account); if (!workspace) redirect("/login");
  const { salon, professionals, clients } = workspace;
  const clientCounts = clients.reduce((result, client) => ({ ...result, [client.professionalId]: (result[client.professionalId] || 0) + 1 }), {});
  return <AppShell account={account}><header className="page-header"><div><p className="eyebrow">Salon</p><h1>{salon.name}</h1><p>{salon.city}. O privire de ansamblu asupra echipei și dosarelor aflate în grija ei.</p></div><div className="metric"><strong>{clients.length}</strong><span>dosare de client</span></div></header><section className="content-section"><div className="section-heading"><div><p className="eyebrow">Echipa</p><h2>Profesioniști</h2></div><span>{professionals.length} activi</span></div><div className="team-grid">{professionals.map((professional) => <article className="team-card" key={String(professional._id)}><div className="avatar">{professional.name.slice(0, 1)}</div><h3>{professional.name}</h3><p>{professional.specialty}</p><strong>{clientCounts[String(professional._id)] || 0} clienți</strong></article>)}</div>{!professionals.length && <div className="empty-state">Administratorul platformei poate adăuga primul profesionist pentru acest salon.</div>}</section><section className="content-section"><div className="section-heading"><div><p className="eyebrow">Confidențial</p><h2>Dosare în salon</h2></div></div><div className="client-table">{clients.map((client) => <div key={String(client._id)}><strong>{client.name}</strong><span>{client.onboardingStatus === "completed" ? `Baumann ${client.baumannType}` : "Așteaptă onboarding"}</span></div>)}</div></section></AppShell>;
}
