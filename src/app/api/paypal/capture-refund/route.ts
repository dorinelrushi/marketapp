import { NextResponse } from "next/server";
import { getPayPalAccessToken, getPayPalBaseUrl } from "@/lib/paypal";

export const runtime = "nodejs";

type CaptureBody = {
  orderID?: string;
};

type PayPalCaptureResponse = {
  status?: string;
  purchase_units?: Array<{
    payments?: {
      captures?: Array<{
        id?: string;
        status?: string;
      }>;
    };
  }>;
  message?: string;
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as CaptureBody;
    if (!body.orderID) {
      return NextResponse.json({ error: "Missing order ID." }, { status: 400 });
    }

    const accessToken = await getPayPalAccessToken();

    const captureResponse = await fetch(
      `${getPayPalBaseUrl()}/v2/checkout/orders/${body.orderID}/capture`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        cache: "no-store",
      }
    );

    const captureData = (await captureResponse.json()) as PayPalCaptureResponse;
    if (!captureResponse.ok) {
      return NextResponse.json(
        { error: captureData.message || "Unable to capture order." },
        { status: 500 }
      );
    }

    const captureId =
      captureData.purchase_units?.[0]?.payments?.captures?.[0]?.id || null;
    if (!captureId) {
      return NextResponse.json(
        { error: "Capture succeeded but capture id was not found." },
        { status: 500 }
      );
    }

    const refundResponse = await fetch(
      `${getPayPalBaseUrl()}/v2/payments/captures/${captureId}/refund`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({}),
        cache: "no-store",
      }
    );

    const refundData = (await refundResponse.json()) as { id?: string; status?: string; message?: string };
    if (!refundResponse.ok) {
      return NextResponse.json(
        { error: refundData.message || "Unable to refund capture." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      status: captureData.status || "COMPLETED",
      captureId,
      refundId: refundData.id,
      refundStatus: refundData.status || "COMPLETED",
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unexpected error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
