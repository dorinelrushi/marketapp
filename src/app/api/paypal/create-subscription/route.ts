import { NextRequest, NextResponse } from "next/server";
import { createPayPalSubscription } from "@/lib/paypal";
import { saveSubscription } from "@/lib/subscriptionStore";

export const runtime = "nodejs";

type CreateSubscriptionBody = {
  planId?: string;
  subscriber?: {
    email_address?: string;
    name?: { given_name?: string; surname?: string };
  };
};

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as CreateSubscriptionBody;
    const planId = body.planId?.trim();

    if (!planId) {
      return NextResponse.json({ error: "Missing planId." }, { status: 400 });
    }
    if (planId === "your_paypal_plan_id" || planId === "REPLACE_WITH_YOUR_PLAN_ID") {
      return NextResponse.json(
        { error: "Invalid PayPal plan id. Update NEXT_PUBLIC_PAYPAL_PLAN_ID in .env." },
        { status: 400 }
      );
    }

    const origin =
      process.env.NEXT_PUBLIC_BASE_URL ||
      request.headers.get("origin") ||
      "http://localhost:3000";

    const subscription = await createPayPalSubscription({
      planId,
      returnUrl: `${origin}/subscribe?status=success`,
      cancelUrl: `${origin}/subscribe?status=cancel`,
      subscriber: body.subscriber,
    });

    saveSubscription(subscription.id!, subscription.status || "CREATED");

    return NextResponse.json({ id: subscription.id });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unexpected error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
