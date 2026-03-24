import { NextResponse } from "next/server";
import { sendPushToSubscription } from "../../../../lib/push-notifications";

export async function POST(request) {
  const payload = await request.json();

  if (!payload.subscription?.endpoint) {
    return NextResponse.json({ error: "Subscription is required for test push." }, { status: 422 });
  }

  try {
    await sendPushToSubscription(payload.subscription, payload.payload);

    return NextResponse.json({
      ok: true
    });
  } catch (error) {
    if (error.message === "push-not-configured") {
      return NextResponse.json(
        {
          error: "Push is not configured on the server. Add VAPID keys in .env."
        },
        { status: 412 }
      );
    }

    return NextResponse.json(
      {
        error: "Push delivery failed.",
        reason: error.message
      },
      { status: 500 }
    );
  }
}
