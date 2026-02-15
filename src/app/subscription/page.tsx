"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function SubscriptionPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/subscribe");
  }, [router]);

  return (
    <div className="min-h-screen px-6 py-16">
      <div className="mx-auto w-full max-w-3xl space-y-6">
        <h1 className="text-3xl font-bold">Weiterleitung zum Abonnement…</h1>
        <p className="text-sm text-zinc-500">Wir leiten Sie zum jährlichen 49,99 € Plan weiter.</p>
      </div>
    </div>
  );
}
