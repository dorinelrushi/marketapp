import { NextResponse } from "next/server";
import { getPayPalAccessToken, getPayPalBaseUrl } from "@/lib/paypal";

type CaptureBody = {
  orderID?: string;
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as CaptureBody;
    if (!body.orderID) {
      return NextResponse.json({ error: "Missing order ID." }, { status: 400 });
    }

    const accessToken = await getPayPalAccessToken();
    const response = await fetch(
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

    const data = (await response.json()) as { status?: string; message?: string };
    if (!response.ok) {
      return NextResponse.json(
        { error: data.message || "Unable to capture order." },
        { status: 500 }
      );
    }

    return NextResponse.json({ status: data.status || "COMPLETED" });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unexpected error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
