import { NextResponse } from "next/server";
import { getPayPalAccessToken, getPayPalBaseUrl } from "@/lib/paypal";

export async function POST() {
  try {
    const accessToken = await getPayPalAccessToken();

    const response = await fetch(`${getPayPalBaseUrl()}/v2/checkout/orders`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        intent: "CAPTURE",
        purchase_units: [
          {
            amount: {
              currency_code: "USD",
              value: "1.00",
            },
          },
        ],
        application_context: {
          brand_name: "BookNest",
          landing_page: "LOGIN",
          user_action: "PAY_NOW",
        },
      }),
      cache: "no-store",
    });

    const data = (await response.json()) as { id?: string; message?: string };
    if (!response.ok || !data.id) {
      return NextResponse.json(
        { error: data.message || "Unable to create order." },
        { status: 500 }
      );
    }

    return NextResponse.json({ id: data.id });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unexpected error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
