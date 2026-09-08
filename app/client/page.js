import { redirect } from "next/navigation";
import { AppShell } from "../../components/app-shell";
import { currentAccount } from "../../lib/auth";
import { getClientDossier } from "../../lib/dashboard";

const formatDate = (value) => new Intl.DateTimeFormat("ro-RO", { dateStyle: "long" }).format(new Date(value));

export default async function ClientPage() {
  const account = await currentAccount(); if (!account || account.role !== "client") redirect("/login");
  const dossier = await getClientDossier(String(account._id)); if (!dossier) redirect("/login");
  const { client, professional, salon, visits } = dossier;
  return <AppShell account={account}><header className="page-header"><div><p className="eyebrow">Dosarul meu</p><h1>O hartă clară pentru îngrijirea ta.</h1><p>Profilul tău evoluează după fiecare vizită și recomandare.</p></div><div className="context-label">{salon?.name}<span>cu {professional?.name}</span></div></header><section className="result-hero"><div><p>Tipologia ta Baumann</p><strong>{client.baumannType}</strong><span>Rezultatul primei evaluări</span></div><div><h2>Ce urmează</h2><p>{visits[0]?.nextStep || "Profesionsitul tău va stabili următorul pas la debriefing."}</p></div></section><section className="content-section"><div className="section-heading"><div><p className="eyebrow">Istoric</p><h2>Parcursul tău</h2></div><span>{visits.length} vizite</span></div>{visits.length ? <div className="timeline">{visits.map((visit) => <article key={String(visit._id)} className="timeline-item"><p>{formatDate(visit.date)}</p><div><h3>{visit.procedures?.join(" · ") || "Consultație și evaluare"}</h3><p>{visit.notes}</p>{visit.treatments?.length > 0 && <small>Tratamente: {visit.treatments.join(", ")}</small>}</div></article>)}</div> : <div className="empty-state">Prima ta vizită va apărea aici, împreună cu procedurile și planul recomandat.</div>}</section></AppShell>;
}
