import Link from "next/link";
import { LogoutButton } from "./logout-button";

function buildNavigation(currentUser) {
  const baseNavigation = [
    { href: "/", label: "Vision" },
    { href: "/client/intake", label: "Client Intake" }
  ];

  if (!currentUser) {
    return [...baseNavigation, { href: "/login", label: "Login" }];
  }

  if (currentUser.role === "admin") {
    return [...baseNavigation, { href: "/admin", label: "Admin" }];
  }

  if (currentUser.salonSlug) {
    return [...baseNavigation, { href: `/salon/${currentUser.salonSlug}`, label: "Workspace" }];
  }

  return baseNavigation;
}

export function AppShell({ children, currentUser }) {
  const navigation = buildNavigation(currentUser);

  return (
    <div className="site-shell">
      <div className="ambient ambient-a" />
      <div className="ambient ambient-b" />
      <header className="topbar">
        <Link className="brand-mark" href="/">
          Insight Beauty
        </Link>
        <div className="topbar-actions">
          <nav className="topnav">
            {navigation.map((item) => (
              <Link key={item.href} href={item.href}>
                {item.label}
              </Link>
            ))}
          </nav>
          {currentUser ? (
            <div className="user-chip">
              <div>
                <strong>{currentUser.displayName}</strong>
                <span>{currentUser.role}</span>
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
