import { NextRequest, NextResponse } from "next/server";
import { verifyPayPalWebhookSignature } from "@/lib/paypal";
import { updateSubscriptionStatus } from "@/lib/subscriptionStore";

export const runtime = "nodejs";

type WebhookEvent = {
  id?: string;
  event_type?: string;
  resource?: Record<string, unknown>;
  create_time?: string;
};

function getHeader(request: NextRequest, name: string) {
  return request.headers.get(name) || "";
}

export async function POST(request: NextRequest) {
  try {
    const rawBody = await request.text();
    const webhookEvent = JSON.parse(rawBody) as WebhookEvent;

    const transmissionId = getHeader(request, "paypal-transmission-id");
    const transmissionTime = getHeader(request, "paypal-transmission-time");
    const certUrl = getHeader(request, "paypal-cert-url");
    const authAlgo = getHeader(request, "paypal-auth-algo");
    const transmissionSig = getHeader(request, "paypal-transmission-sig");

    if (
      !transmissionId ||
      !transmissionTime ||
      !certUrl ||
      !authAlgo ||
      !transmissionSig
    ) {
      return NextResponse.json(
        { error: "Missing PayPal verification headers." },
        { status: 400 }
      );
    }

    const verify = await verifyPayPalWebhookSignature({
      transmissionId,
      transmissionTime,
      certUrl,
      authAlgo,
      transmissionSig,
      webhookEvent,
    });

    if (verify.verification_status !== "SUCCESS") {
      return NextResponse.json({ error: "Invalid webhook signature." }, { status: 400 });
    }

    const eventType = webhookEvent.event_type;
    const resource = webhookEvent.resource || {};
    const eventTime = webhookEvent.create_time;

    if (eventType === "BILLING.SUBSCRIPTION.ACTIVATED") {
      const subscriptionId = resource.id as string | undefined;
      if (subscriptionId) {
        updateSubscriptionStatus(subscriptionId, "ACTIVE", eventTime);
      }
    }

    if (eventType === "PAYMENT.SALE.COMPLETED") {
      const subscriptionId =
        (resource as { billing_agreement_id?: string }).billing_agreement_id ||
        (resource.id as string | undefined);
      if (subscriptionId) {
        updateSubscriptionStatus(subscriptionId, "PAID", eventTime);
      }
    }

    if (eventType === "BILLING.SUBSCRIPTION.CANCELLED") {
      const subscriptionId = resource.id as string | undefined;
      if (subscriptionId) {
        updateSubscriptionStatus(subscriptionId, "CANCELLED", eventTime);
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unexpected error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
