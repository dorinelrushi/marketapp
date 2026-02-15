"use client";

import Script from "next/script";
import { useEffect, useRef, useState } from "react";

type Props = {
  onApproved?: (orderId: string) => void;
};

export default function PayPalOrderButton({ onApproved }: Props) {
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;

  useEffect(() => {
    if (!ready || !containerRef.current || !(window as any).paypal) {
      return;
    }

    const buttons = (window as any).paypal.Buttons({
      style: {
        layout: "vertical",
        shape: "pill",
        color: "gold",
        label: "pay",
      },
      createOrder: async () => {
        setError(null);
        const response = await fetch("/api/paypal/order", { method: "POST" });
        const data = (await response.json()) as { id?: string; error?: string };
        if (!response.ok || !data.id) {
          throw new Error(data.error || "Unable to create PayPal order.");
        }
        return data.id;
      },
      onApprove: async (data: any) => {
        const response = await fetch("/api/paypal/capture-refund", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ orderID: data.orderID }),
        });
        const result = (await response.json()) as {
          status?: string;
          refundStatus?: string;
          error?: string;
        };
        if (!response.ok) {
          throw new Error(result.error || "Unable to capture/refund PayPal order.");
        }
        onApproved?.(data.orderID);
      },
      onError: () => {
        setError("Payment failed. Please try again.");
      },
    });

    buttons.render(containerRef.current);

    return () => {
      buttons.close?.();
      if (containerRef.current) {
        containerRef.current.innerHTML = "";
      }
    };
  }, [ready, onApproved]);

  if (!clientId) {
    return (
      <p className="text-sm text-amber-200">
        Missing `NEXT_PUBLIC_PAYPAL_CLIENT_ID` in .env.
      </p>
    );
  }

  return (
    <div className="space-y-3">
      <Script
        id="paypal-sdk-order"
        src={`https://www.paypal.com/sdk/js?client-id=${clientId}&currency=USD&components=buttons&intent=capture`}
        onLoad={() => setReady(true)}
      />
      <div ref={containerRef} />
      {error ? <p className="text-sm text-amber-200">{error}</p> : null}
    </div>
  );
}
