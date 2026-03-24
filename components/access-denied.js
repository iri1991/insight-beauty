export function AccessDenied({ title = "Acces restrictionat", body = "Nu ai acces la acest spatiu in sesiunea activa." }) {
  return (
    <div className="stack page-stack">
      <section className="section-block">
        <div className="section-heading">
          <div>
            <span className="eyebrow">Access control</span>
            <h1>{title}</h1>
          </div>
        </div>
        <div className="detail-card">
          <p>{body}</p>
        </div>
      </section>
    </div>
  );
}

