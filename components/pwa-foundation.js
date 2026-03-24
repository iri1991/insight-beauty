"use client";

import { useEffect, useMemo, useState, useTransition } from "react";

function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replaceAll("-", "+").replaceAll("_", "/");
  const rawData = window.atob(base64);
  return Uint8Array.from([...rawData].map((char) => char.charCodeAt(0)));
}

export function PwaFoundation() {
  const isProduction = process.env.NODE_ENV === "production";
  const publicKey = useMemo(() => process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || "", []);
  const pushSupported =
    typeof window !== "undefined" &&
    "serviceWorker" in navigator &&
    "PushManager" in window &&
    "Notification" in window;
  const [serviceWorkerReady, setServiceWorkerReady] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [subscription, setSubscription] = useState(null);
  const [installPromptEvent, setInstallPromptEvent] = useState(null);
  const [feedback, setFeedback] = useState("");
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    const syncInstallState = () => {
      setIsInstalled(window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone === true);
    };

    syncInstallState();

    if (!("serviceWorker" in navigator)) {
      return;
    }

    if (!isProduction) {
      void navigator.serviceWorker.getRegistrations().then((registrations) => {
        registrations.forEach((registration) => {
          void registration.unregister();
        });
      });

      if ("caches" in window) {
        void caches.keys().then((keys) => {
          keys
            .filter((key) => key.startsWith("insight-beauty-os-"))
            .forEach((key) => {
              void caches.delete(key);
            });
        });
      }

      return;
    }

    const installListener = (event) => {
      event.preventDefault();
      setInstallPromptEvent(event);
    };

    const appInstalledListener = () => {
      setInstallPromptEvent(null);
      syncInstallState();
      setFeedback("Aplicatia este instalata si poate fi folosita ca app shell nativ.");
    };

    window.addEventListener("beforeinstallprompt", installListener);
    window.addEventListener("appinstalled", appInstalledListener);

    navigator.serviceWorker
      .register("/sw.js")
      .then(async (registration) => {
        setServiceWorkerReady(true);
        const activeSubscription = await registration.pushManager.getSubscription();
        if (activeSubscription) {
          setSubscription(activeSubscription.toJSON());
        }
      })
      .catch(() => {
        setFeedback("Service worker-ul nu a putut fi inregistrat.");
      });

    return () => {
      window.removeEventListener("beforeinstallprompt", installListener);
      window.removeEventListener("appinstalled", appInstalledListener);
    };
  }, [isProduction]);

  async function handleInstall() {
    if (!installPromptEvent) {
      setFeedback("Instalarea nativa va deveni disponibila dupa ce browserul considera app-ul eligibil.");
      return;
    }

    await installPromptEvent.prompt();
    await installPromptEvent.userChoice;
    setInstallPromptEvent(null);
    setIsInstalled(window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone === true);
  }

  function handleEnablePush() {
    if (!pushSupported) {
      setFeedback("Browserul curent nu suporta Push API.");
      return;
    }

    if (!publicKey) {
      setFeedback("Lipseste NEXT_PUBLIC_VAPID_PUBLIC_KEY. Genereaza cheile si adauga-le in .env.");
      return;
    }

    startTransition(() => {
      void (async () => {
        try {
          const permission = await Notification.requestPermission();
          if (permission !== "granted") {
            setFeedback("Permisiunea de notificari nu a fost acordata.");
            return;
          }

          const registration = await navigator.serviceWorker.ready;
          const nextSubscription =
            (await registration.pushManager.getSubscription()) ||
            (await registration.pushManager.subscribe({
              userVisibleOnly: true,
              applicationServerKey: urlBase64ToUint8Array(publicKey)
            }));

          const normalizedSubscription = nextSubscription.toJSON();
          const response = await fetch("/api/push/subscribe", {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              subscription: normalizedSubscription,
              role: "anonymous",
              segment: "marketing-and-care"
            })
          });

          if (!response.ok) {
            setFeedback("Subscriptia push nu a putut fi salvata.");
            return;
          }

          setSubscription(normalizedSubscription);
          setFeedback("Push notifications sunt active pentru acest browser.");
        } catch (error) {
          setFeedback("Activarea notificarilor a esuat.");
        }
      })();
    });
  }

  function handleTestPush() {
    if (!subscription) {
      setFeedback("Activeaza mai intai push notifications.");
      return;
    }

    startTransition(() => {
      void (async () => {
        try {
          const response = await fetch("/api/push/test", {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              subscription,
              payload: {
                title: "Reminder debriefing",
                body: "Ai un nou follow-up pregatit pentru evaluarea clientului.",
                url: "/salon/insight-bucharest",
                tag: "follow-up-reminder"
              }
            })
          });

          const result = await response.json();
          if (!response.ok) {
            setFeedback(result.error || "Testul push a esuat.");
            return;
          }

          setFeedback("Testul push a fost trimis. Verifica notificarea browserului.");
        } catch (error) {
          setFeedback("Testul push a esuat.");
        }
      })();
    });
  }

  return (
    <section className="section-block">
      <div className="section-heading">
        <div>
          <span className="eyebrow">PWA foundation</span>
          <h2>Instalabil pe device si pregatit pentru push notifications</h2>
        </div>
        <span className="tag tag-soft">mobile-ready architecture</span>
      </div>

      <div className="card-grid three-up">
        <article className="detail-card">
          <h3>Installable shell</h3>
          <p>Manifest, icon-uri si service worker active pentru app-like launch, splash si utilizare rapida.</p>
          <div className="metric-row">
            <span>Status</span>
            <strong>{serviceWorkerReady ? "Ready" : "Pending"}</strong>
          </div>
          <button className="button secondary" type="button" onClick={handleInstall}>
            {isInstalled ? "Aplicatie instalata" : "Instaleaza PWA"}
          </button>
        </article>

        <article className="detail-card">
          <h3>Push channel</h3>
          <p>Web Push pe VAPID, cu persistența subscripțiilor și API separat de UI pentru reutilizare ulterioara.</p>
          <div className="metric-row">
            <span>Subscription</span>
            <strong>{subscription ? "Active" : "Inactive"}</strong>
          </div>
          <button className="button secondary" type="button" disabled={isPending} onClick={handleEnablePush}>
            Activeaza notificari
          </button>
        </article>

        <article className="detail-card">
          <h3>Future mobile app</h3>
          <p>Scoring engine, persistenta si push orchestration raman in API si `lib`, astfel incat clientul mobil sa reuseze backend-ul.</p>
          <div className="metric-row">
            <span>Test channel</span>
            <strong>{publicKey ? "Configured" : "Missing VAPID"}</strong>
          </div>
          <button className="button secondary" type="button" disabled={isPending || !subscription} onClick={handleTestPush}>
            Trimite test push
          </button>
        </article>
      </div>

      {feedback ? <p className="helper-copy push-feedback">{feedback}</p> : null}
    </section>
  );
}
