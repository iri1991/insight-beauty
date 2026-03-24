const CACHE_NAME = "insight-beauty-os-v1";
const APP_SHELL = ["/", "/admin", "/client/intake", "/offline", "/manifest.webmanifest"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) =>
      Promise.all(
        APP_SHELL.map((asset) =>
          fetch(asset, { cache: "no-store" })
            .then((response) => {
              if (response.ok) {
                return cache.put(asset, response.clone());
              }

              return null;
            })
            .catch(() => null)
        )
      )
    )
  );

  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)))
    )
  );

  self.clients.claim();
});

async function networkFirst(request) {
  const cache = await caches.open(CACHE_NAME);

  try {
    const response = await fetch(request);
    if (response.ok) {
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    const cached = await cache.match(request);
    if (cached) {
      return cached;
    }

    return cache.match("/offline");
  }
}

async function staleWhileRevalidate(request) {
  const cache = await caches.open(CACHE_NAME);
  const cached = await cache.match(request);
  const networkFetch = fetch(request)
    .then((response) => {
      if (response.ok) {
        cache.put(request, response.clone());
      }
      return response;
    })
    .catch(() => cached);

  return cached || networkFetch;
}

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") {
    return;
  }

  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) {
    return;
  }

  if (event.request.mode === "navigate") {
    event.respondWith(networkFirst(event.request));
    return;
  }

  if (
    url.pathname.startsWith("/_next/static/") ||
    url.pathname === "/manifest.webmanifest" ||
    url.pathname === "/icon" ||
    url.pathname.startsWith("/pwa-")
  ) {
    event.respondWith(staleWhileRevalidate(event.request));
  }
});

self.addEventListener("push", (event) => {
  let payload = {};

  try {
    payload = event.data ? event.data.json() : {};
  } catch (error) {
    payload = {
      title: "Insight Beauty",
      body: event.data ? event.data.text() : "Ai o notificare noua."
    };
  }

  const notificationOptions = {
    body: payload.body || "Ai o notificare noua.",
    icon: payload.icon || "/pwa-192.svg",
    badge: payload.badge || "/pwa-192.svg",
    tag: payload.tag || "insight-beauty-update",
    data: {
      url: payload.url || "/"
    }
  };

  event.waitUntil(self.registration.showNotification(payload.title || "Insight Beauty", notificationOptions));
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  const targetUrl = event.notification?.data?.url || "/";

  event.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((clients) => {
      const existing = clients.find((client) => "focus" in client);

      if (existing) {
        existing.navigate(targetUrl);
        return existing.focus();
      }

      return self.clients.openWindow(targetUrl);
    })
  );
});
