
import { connectToDatabase } from "@/lib/db";
import { User } from "@/models/User";
import { verifyPayPalWebhookSignature } from "@/lib/paypal";
import { NextResponse } from "next/server";

// We need to disable body parsing to verify signature? 
// Next.js App Router API Routes parse body automatically if we read it? 
// Actually `verifyPayPalWebhookSignature` takes `webhookEvent` as object.
// We can use `request.json()` to get the body. 
// But signature verification often needs raw body? 
// `verifyPayPalWebhookSignature` in `lib/paypal.ts` takes `webhookEvent` (object) 
// and calls PayPal API to verify it. So json object is fine.

export async function POST(request: Request) {
    try {
        const headers = request.headers;
        const transmissionId = headers.get("paypal-transmission-id");
        const transmissionTime = headers.get("paypal-transmission-time");
        const certUrl = headers.get("paypal-cert-url");
        const authAlgo = headers.get("paypal-auth-algo");
        const transmissionSig = headers.get("paypal-transmission-sig");

        if (!transmissionId || !transmissionTime || !certUrl || !authAlgo || !transmissionSig) {
            return NextResponse.json({ error: "Missing headers" }, { status: 400 });
        }

        const body = await request.json();

        // Verify Signature
        try {
            await verifyPayPalWebhookSignature({
                transmissionId,
                transmissionTime,
                certUrl,
                authAlgo,
                transmissionSig,
                webhookEvent: body
            });
        } catch (err) {
            console.error("Webhook signature verification failed:", err);
            return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
        }

        const eventType = body.event_type;
        const resource = body.resource;

        await connectToDatabase();

        if (eventType === "BILLING.SUBSCRIPTION.ACTIVATED") {
            const subscriptionId = resource.id;
            await User.findOneAndUpdate(
                { subscriptionId },
                {
                    subscriptionStatus: "active",
                    hasPaidOneTimeFee: true
                }
            );
            console.log(`Subscription ${subscriptionId} activated. One-time fee marked as paid.`);
        } else if (eventType === "BILLING.SUBSCRIPTION.CANCELLED" || eventType === "BILLING.SUBSCRIPTION.EXPIRED") {
            const subscriptionId = resource.id;
            await User.findOneAndUpdate(
                { subscriptionId },
                { subscriptionStatus: "inactive" }
            );
            console.log(`Subscription ${subscriptionId} cancelled/expired.`);
        } else if (eventType === "PAYMENT.SALE.COMPLETED") {
            // Could be subscription payment or one-time payment if using same webhook id
            // Check billing_agreement_id for subscription
            if (resource.billing_agreement_id) {
                await User.findOneAndUpdate(
                    { subscriptionId: resource.billing_agreement_id },
                    { subscriptionStatus: "active" }
                );
            }
        }

        return NextResponse.json({ received: true });

    } catch (error) {
        console.error("Webhook error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
