"use client";

import Script from "next/script";
import { useEffect, useRef, useState } from "react";

type Props = {
    amount: number;
    onSuccess: (details: any) => void;
    onError?: (error: any) => void;
};


export default function PayPalOneTimeButton({ amount, onSuccess, onError }: Props) {
    const [ready, setReady] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;

    useEffect(() => {
        if (!ready || !containerRef.current || !(window as any).paypal) return;

        const buttons = (window as any).paypal.Buttons({
            style: {
                layout: "vertical",
                shape: "rect",
                color: "gold",
                label: "pay",
            },
            createOrder: (_data: any, actions: any) => {
                return actions.order.create({
                    purchase_units: [
                        {
                            amount: {
                                value: amount.toString(),
                            },
                            description: "Property Reservation Fee",
                        },
                    ],
                });
            },
            onApprove: async (data: any, actions: any) => {
                const details = await actions.order.capture();
                onSuccess(details);
            },
            onError: (err: any) => {
                console.error("PayPal Error:", err);
                if (onError) onError(err);
            },
        });

        buttons.render(containerRef.current);

        return () => {
            buttons.close?.();
            if (containerRef.current) containerRef.current.innerHTML = "";
        };
    }, [ready, amount, onSuccess, onError]);

    if (!clientId) return <p>Missing PayPal Client ID</p>;

    return (
        <>
            <Script
                src={`https://www.paypal.com/sdk/js?client-id=${clientId}&currency=EUR`}
                onLoad={() => setReady(true)}
            />
            <div ref={containerRef} className="z-0 relative" />
        </>
    );
}
