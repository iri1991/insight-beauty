export default function OfflinePage() {
  return (
    <div className="stack page-stack">
      <section className="section-block">
        <div className="section-heading">
          <div>
            <span className="eyebrow">Offline mode</span>
            <h1>Conexiunea nu este disponibila momentan.</h1>
          </div>
        </div>
        <div className="detail-card">
          <p>
            Aplicatia poate pastra shell-ul si anumite ecrane cheie pentru acces rapid, iar actiunile critice precum
            submit-ul de chestionare sau trimiterea notificarilor se reiau cand conexiunea revine.
          </p>
        </div>
      </section>
    </div>
  );
}

