"use client";

export function LogoutButton() {
  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.assign("/login");
  }
  return <button className="quiet-button" onClick={logout}>Ieși din cont</button>;
}

export function StopImpersonatingButton() {
  async function stop() {
    const response = await fetch("/api/admin/impersonate", { method: "DELETE" });
    const data = await response.json();
    window.location.assign(response.ok ? data.destination : "/login");
  }
  return <button className="quiet-button impersonation-exit" onClick={stop}>Revino la administrator</button>;
}
