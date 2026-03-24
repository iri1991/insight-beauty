import webpush from "web-push";

let vapidConfigured = false;

export function hasClientPushConfig() {
  return Boolean(process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY);
}

export function hasServerPushConfig() {
  return Boolean(process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY && process.env.VAPID_PRIVATE_KEY && process.env.VAPID_SUBJECT);
}

export function getPublicVapidKey() {
  return process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || "";
}

export function normalizeSubscription(subscription = {}) {
  return {
    endpoint: subscription.endpoint,
    expirationTime: subscription.expirationTime ?? null,
    keys: {
      p256dh: subscription.keys?.p256dh || "",
      auth: subscription.keys?.auth || ""
    }
  };
}

export function buildPushPayload(payload = {}) {
  return JSON.stringify({
    title: payload.title || "Insight Beauty",
    body: payload.body || "Ai un nou update privind evaluarea sau programarea clientului.",
    url: payload.url || "/",
    tag: payload.tag || "insight-beauty-update",
    icon: payload.icon || "/pwa-192.svg",
    badge: payload.badge || "/pwa-192.svg"
  });
}

function ensureVapidDetails() {
  if (!hasServerPushConfig() || vapidConfigured) {
    return;
  }

  webpush.setVapidDetails(
    process.env.VAPID_SUBJECT,
    process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
    process.env.VAPID_PRIVATE_KEY
  );

  vapidConfigured = true;
}

export async function sendPushToSubscription(subscription, payload) {
  if (!hasServerPushConfig()) {
    throw new Error("push-not-configured");
  }

  ensureVapidDetails();

  return webpush.sendNotification(normalizeSubscription(subscription), buildPushPayload(payload));
}
