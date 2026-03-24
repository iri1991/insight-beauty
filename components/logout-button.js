"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";

export function LogoutButton() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleLogout() {
    startTransition(() => {
      void (async () => {
        await fetch("/api/auth/logout", {
          method: "POST"
        });
        router.push("/login");
        router.refresh();
      })();
    });
  }

  return (
    <button className="button secondary logout-button" type="button" disabled={isPending} onClick={handleLogout}>
      {isPending ? "Iesire..." : "Logout"}
    </button>
  );
}

