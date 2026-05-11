export default function OfflinePage() {
  return (
    <div className="auth-page">
      <div className="auth-shell">
        <div className="auth-brand">
          <span className="auth-logo-mark" aria-hidden="true">✦</span>
          <span className="auth-brand-name">Insight Beauty</span>
        </div>

        <div className="offline-icon" aria-hidden="true">
          <svg viewBox="0 0 48 48" fill="none" width="48" height="48">
            <circle cx="24" cy="24" r="22" stroke="currentColor" strokeWidth="1.5" opacity="0.3" />
            <path d="M16 24c0-4.42 3.58-8 8-8s8 3.58 8 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.5" />
            <path d="M12 20c0-6.63 5.37-12 12-12s12 5.37 12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.25" />
            <line x1="10" y1="38" x2="38" y2="10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </div>

        <header className="auth-header">
          <h1>Fără conexiune</h1>
          <p className="auth-lead">
            Nu poți fi conectat la internet în acest moment. Unele pagini sunt disponibile offline —
            evaluările și trimiterile se reiau automat când conexiunea revine.
          </p>
        </header>

        <button
          className="button primary"
          onClick="window.location.reload()"
          style={{ width: "100%" }}
        >
          Încearcă din nou
        </button>
      </div>
    </div>
  );
}
