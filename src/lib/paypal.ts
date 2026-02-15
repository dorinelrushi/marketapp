const PAYPAL_ENV = process.env.PAYPAL_ENV || "sandbox";
const PAYPAL_WEBHOOK_ID = process.env.PAYPAL_WEBHOOK_ID || "";

export function getPayPalBaseUrl() {
  return PAYPAL_ENV === "live"
    ? "https://api-m.paypal.com"
    : "https://api-m.sandbox.paypal.com";
}

export async function getPayPalAccessToken() {
  const clientId = process.env.PAYPAL_CLIENT_ID;
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error("Missing PayPal API credentials.");
  }

  const auth = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");
  const response = await fetch(`${getPayPalBaseUrl()}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({ grant_type: "client_credentials" }),
    cache: "no-store",
  });

  const data = (await response.json()) as { access_token?: string; error?: string };
  if (!response.ok || !data.access_token) {
    throw new Error(data.error || "Unable to obtain PayPal access token.");
  }

  return data.access_token;
}

type CreateSubscriptionInput = {
  planId: string;
  returnUrl: string;
  cancelUrl: string;
  subscriber?: {
    email_address?: string;
    name?: { given_name?: string; surname?: string };
  };
};

export async function createPayPalSubscription({
  planId,
  returnUrl,
  cancelUrl,
  subscriber,
}: CreateSubscriptionInput) {
  const accessToken = await getPayPalAccessToken();

  const response = await fetch(`${getPayPalBaseUrl()}/v1/billing/subscriptions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      plan_id: planId,
      subscriber,
      application_context: {
        brand_name: "BookLike",
        user_action: "SUBSCRIBE_NOW",
        return_url: returnUrl,
        cancel_url: cancelUrl,
      },
    }),
    cache: "no-store",
  });

  const data = (await response.json()) as { id?: string; status?: string; message?: string; details?: unknown };
  if (!response.ok || !data.id) {
    console.error("PayPal Create Subscription Error:", JSON.stringify(data, null, 2));
    throw new Error(JSON.stringify(data));
  }

  return data;
}

type VerifyWebhookInput = {
  transmissionId: string;
  transmissionTime: string;
  certUrl: string;
  authAlgo: string;
  transmissionSig: string;
  webhookEvent: unknown;
};

export async function verifyPayPalWebhookSignature({
  transmissionId,
  transmissionTime,
  certUrl,
  authAlgo,
  transmissionSig,
  webhookEvent,
}: VerifyWebhookInput) {
  if (!PAYPAL_WEBHOOK_ID) {
    throw new Error("Missing PAYPAL_WEBHOOK_ID for webhook verification.");
  }

  const accessToken = await getPayPalAccessToken();

  const response = await fetch(
    `${getPayPalBaseUrl()}/v1/notifications/verify-webhook-signature`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        transmission_id: transmissionId,
        transmission_time: transmissionTime,
        cert_url: certUrl,
        auth_algo: authAlgo,
        transmission_sig: transmissionSig,
        webhook_id: PAYPAL_WEBHOOK_ID,
        webhook_event: webhookEvent,
      }),
      cache: "no-store",
    }
  );

  const data = (await response.json()) as { verification_status?: string; message?: string };
  if (!response.ok) {
    throw new Error(data.message || "Unable to verify webhook signature.");
  }

  return data;
}

export async function cancelPayPalSubscription(subscriptionId: string, reason = "User cancelled") {
  const accessToken = await getPayPalAccessToken();

  const response = await fetch(
    `${getPayPalBaseUrl()}/v1/billing/subscriptions/${subscriptionId}/cancel`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ reason }),
      cache: "no-store",
    }
  );

  if (!response.ok) {
    // PayPal returns 204 No Content on success, so we check specifically for errors
    const text = await response.text();
    if (text) {
      const data = JSON.parse(text) as { message?: string };
      throw new Error(data.message || "Unable to cancel subscription.");
    }
  }

  return true;
}
