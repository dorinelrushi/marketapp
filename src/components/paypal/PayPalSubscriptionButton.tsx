"use client";

import Script from "next/script";
import { useEffect, useRef, useState } from "react";

import { getAuthToken } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

type Props = {
  onSubscribed?: (subscriptionId: string) => void;
};

export default function PayPalSubscriptionButton({ onSubscribed }: Props) {
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
  const planId = process.env.NEXT_PUBLIC_PAYPAL_PLAN_ID;

  useEffect(() => {
    if (!ready || !containerRef.current || !(window as any).paypal || !planId) {
      return;
    }

    const buttons = (window as any).paypal.Buttons({
      style: {
        layout: "vertical",
        shape: "pill",
        color: "gold",
        label: "subscribe",
      },
      createSubscription: async (_data: any, actions: any) => {
        setError(null);
        return actions.subscription.create({ plan_id: planId });
      },
      onApprove: async (data: any) => {
        const subId = data.subscriptionID;
        // Save to backend
        try {
          const token = getAuthToken();
          await fetch("/api/subscriptions", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ subscriptionId: subId })
          });

          // Notify parent if needed
          if (onSubscribed) onSubscribed(subId);

        } catch (e) {
          setError("Failed to save subscription. Please contact support.");
        }
      },
      onError: () => {
        setError("Subscription failed. Please try again.");
      },
    });

    buttons.render(containerRef.current);

    return () => {
      buttons.close?.();
      if (containerRef.current) {
        containerRef.current.innerHTML = "";
      }
    };
  }, [ready, planId, onSubscribed]);

  if (
    !clientId ||
    !planId ||
    planId === "your_paypal_plan_id" ||
    planId === "REPLACE_WITH_YOUR_PLAN_ID"
  ) {
    return (
      <p className="text-sm text-amber-200">
        Configure `NEXT_PUBLIC_PAYPAL_CLIENT_ID` and `NEXT_PUBLIC_PAYPAL_PLAN_ID` in `.env`.
      </p>
    );
  }

  return (
    <div className="space-y-3">
      <Script
        id="paypal-sdk-subscription"
        src={`https://www.paypal.com/sdk/js?client-id=${clientId}&currency=EUR&components=buttons&vault=true&intent=subscription`}
        onLoad={() => setReady(true)}
      />
      <div ref={containerRef} />
      {error ? <p className="text-sm text-amber-200">{error}</p> : null}
    </div>
  );
}
