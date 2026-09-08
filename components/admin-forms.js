"use client";

import { useState } from "react";

export function AdminForms({ salons }) {
  const [notice, setNotice] = useState("");
  async function send(event, endpoint) {
    event.preventDefault(); setNotice("");
    const response = await fetch(endpoint, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(Object.fromEntries(new FormData(event.currentTarget))) });
    const data = await response.json();
    setNotice(response.ok ? "Înregistrare creată. Reîncarcă pagina pentru a actualiza lista." : data.error);
    if (response.ok) event.currentTarget.reset();
  }
  return <div className="admin-forms"><form className="inline-form" onSubmit={(event) => send(event, "/api/admin/salons")}><h2>Salon nou</h2><div className="form-grid"><label>Nume<input name="name" required /></label><label>Oraș<input name="city" required /></label><label>Administrator local<input name="ownerName" required /></label><label>Email administrator<input name="ownerEmail" type="email" required /></label><label>Parolă temporară<input name="password" type="password" minLength="8" required /></label></div><button className="primary-button">Creează salon</button></form><form className="inline-form" onSubmit={(event) => send(event, "/api/admin/professionals")}><h2>Profesionist nou</h2><div className="form-grid"><label>Salon<select name="salonId" required><option value="">Selectează</option>{salons.map((salon) => <option key={salon.id} value={salon.id}>{salon.name}</option>)}</select></label><label>Nume<input name="name" required /></label><label>Specializare<input name="specialty" required /></label><label>Email<input name="email" type="email" required /></label><label>Parolă temporară<input name="password" type="password" minLength="8" required /></label></div><button className="primary-button">Creează profesionist</button></form>{notice && <p className="form-success">{notice}</p>}</div>;
}
