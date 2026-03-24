import { NextResponse } from "next/server";
import { isDatabaseConfigured } from "../../../../lib/auth";
import { connectMongo } from "../../../../lib/mongodb";
import { getModels } from "../../../../lib/mongoose-models";
import { hasServerPushConfig, normalizeSubscription } from "../../../../lib/push-notifications";

export async function POST(request) {
  const payload = await request.json();
  const subscription = normalizeSubscription(payload.subscription);

  if (!subscription.endpoint || !subscription.keys.p256dh || !subscription.keys.auth) {
    return NextResponse.json({ error: "Invalid push subscription." }, { status: 422 });
  }

  if (!isDatabaseConfigured()) {
    return NextResponse.json(
      {
        error: "MongoDB nu este configurat. Persistenta pentru push subscriptions este dezactivata.",
        pushConfigured: hasServerPushConfig(),
        persistence: {
          mode: "disabled",
          saved: false
        }
      },
      { status: 503 }
    );
  }

  await connectMongo();
  const { PushSubscription } = getModels();

  await PushSubscription.updateOne(
    { endpoint: subscription.endpoint },
    {
      $set: {
        ...subscription,
        role: payload.role || "anonymous",
        salonSlug: payload.salonSlug || "",
        professionalId: payload.professionalId || "",
        clientEmail: payload.clientEmail || "",
        userAgent: request.headers.get("user-agent") || "",
        lastSeenAt: new Date().toISOString(),
        status: "active"
      }
    },
    { upsert: true }
  );

  return NextResponse.json({
    ok: true,
    pushConfigured: hasServerPushConfig(),
    persistence: {
      mode: "mongo",
      saved: true
    }
  });
}
