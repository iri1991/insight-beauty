import Link from "next/link";
import { LogoutButton } from "./logout-button";

const ROLE_LABELS = {
  admin: "Admin",
  "salon-manager": "Manager",
  professional: "Profesionist",
  client: "Client"
};

function buildNavigation(currentUser) {
  if (!currentUser) {
    return [
      { href: "/client/intake", label: "Evaluare demo" },
      { href: "/login", label: "Autentificare", accent: true }
    ];
  }

  if (currentUser.role === "admin") {
    return [
      { href: "/client/intake", label: "Evaluare" },
      { href: "/admin", label: "Admin" },
      { href: "/admin/questionnaires", label: "Chestionare" }
    ];
  }

  if (currentUser.role === "client") {
    return [
      { href: "/client/intake", label: "Evaluare nouă" },
      { href: "/client/portal", label: "Dosarul meu" }
    ];
  }

  if (currentUser.salonSlug) {
    return [
      { href: "/client/intake", label: "Evaluare" },
      { href: `/salon/${currentUser.salonSlug}`, label: "Workspace" }
    ];
  }

  return [{ href: "/client/intake", label: "Evaluare" }];
}

export function AppShell({ children, currentUser }) {
  const navigation = buildNavigation(currentUser);
  const roleLabel = currentUser ? (ROLE_LABELS[currentUser.role] || currentUser.role) : null;

  return (
    <div className="site-shell">
      <header className="topbar">
        <Link className="brand-mark" href="/">
          <span className="brand-mark-symbol" aria-hidden="true">✦</span>
          <span className="brand-mark-name">Insight Beauty</span>
        </Link>

        <div className="topbar-right">
          <nav className="topnav" aria-label="Navigare principală">
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={item.accent ? "topnav-accent" : undefined}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {currentUser ? (
            <div className="user-chip">
              <div className="user-chip-info">
                <strong>{currentUser.displayName}</strong>
                <span>{roleLabel}</span>
              </div>
              <LogoutButton />
            </div>
          ) : null}
        </div>
      </header>

      <main className="page-frame">{children}</main>
    </div>
  );
}
