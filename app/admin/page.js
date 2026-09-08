import { redirect } from "next/navigation";
import { AppShell } from "../../components/app-shell";
import { AdminForms } from "../../components/admin-forms";
import { AdminImpersonation } from "../../components/admin-impersonation";
import { currentAccount } from "../../lib/auth";
import { connectDb } from "../../lib/db";
import { Professional, Salon } from "../../lib/models";
import { TEST_CATALOG } from "../../lib/questionnaires";

export default async function AdminPage() {
  const account = await currentAccount(); if (!account || account.role !== "admin") redirect("/login");
  await connectDb(); const [salons, professionals] = await Promise.all([Salon.find().sort({ createdAt: -1 }).lean(), Professional.find().lean()]);
  const plainSalons = salons.map((salon) => ({ id: String(salon._id), name: salon.name, city: salon.city }));
  return <AppShell account={account}><header className="page-header"><div><p className="eyebrow">Control platformă</p><h1>Rețeaua Insight Beauty.</h1><p>Configurează saloane și accesul profesioniștilor. Această zonă este rezervată echipei dezvoltatoare.</p></div><div className="metric"><strong>{salons.length}</strong><span>saloane configurate</span></div></header><AdminForms salons={plainSalons} /><AdminImpersonation salons={plainSalons} /><section className="content-section"><div className="section-heading"><div><p className="eyebrow">Catalog</p><h2>Instrumente de evaluare</h2></div><span>{TEST_CATALOG.length} instrumente</span></div><div className="catalog-grid">{TEST_CATALOG.map((test) => <article key={test.id} className={`catalog-card ${test.id === "baumann" ? "is-active" : ""}`}><p>{test.group}</p><h3>{test.name}</h3><span>{test.description}</span><strong>{test.id === "baumann" ? "Activ în onboarding" : "În configurare clinică"}</strong></article>)}</div></section><section className="content-section"><div className="section-heading"><h2>Profesioniști configurați</h2></div><div className="client-table">{professionals.map((professional) => <div key={String(professional._id)}><strong>{professional.name}</strong><span>{professional.specialty}</span></div>)}</div></section></AppShell>;
}
