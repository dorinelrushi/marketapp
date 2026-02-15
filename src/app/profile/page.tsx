"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type User = {
    id: string;
    name?: string;
    email: string;
    subscriptionStatus: string;
};

export default function ProfilePage() {
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [cancelling, setCancelling] = useState(false);
    const [message, setMessage] = useState<string | null>(null);

    useEffect(() => {
        const token = localStorage.getItem("booknest_token");
        if (!token) {
            router.push("/anmelden");
            return;
        }

        fetch("/api/auth/me", {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then(async (res) => {
                if (!res.ok) throw new Error("Fehler beim Laden des Profils");
                const data = await res.json();
                setUser(data.user);
            })
            .catch(() => {
                localStorage.removeItem("booknest_token");
                router.push("/anmelden");
            })
            .finally(() => {
                setLoading(false);
            });
    }, [router]);

    const handleCancelSubscription = async () => {
        if (!confirm("Sind Sie sicher, dass Sie Ihr Abonnement kündigen möchten?")) return;

        setCancelling(true);
        setMessage(null);
        const token = localStorage.getItem("booknest_token");

        try {
            const res = await fetch("/api/subscription/cancel", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Kündigung fehlgeschlagen");

            setUser((prev) => (prev ? { ...prev, subscriptionStatus: "inactive" } : null));
            setMessage("Abonnement erfolgreich gekündigt.");
        } catch (error) {
            const err = error instanceof Error ? error.message : "Fehler bei der Kündigung";
            setMessage(err);
        } finally {
            setCancelling(false);
        }
    };

    if (loading) {
        return (
            <main className="min-h-screen px-6 py-16">
                <div className="mx-auto w-full max-w-2xl">
                    <p className="text-muted">Profil wird geladen...</p>
                </div>
            </main>
        );
    }

    if (!user) return null;

    return (
        <main className="min-h-screen px-6 py-16">
            <div className="mx-auto w-full max-w-2xl space-y-8">
                <header>
                    <h1 className="text-3xl font-bold">Profil</h1>
                    <p className="text-muted">Verwalten Sie Ihr Konto und Ihr Abonnement.</p>
                </header>

                <div className="glass rounded-3xl p-8 space-y-6">
                    <div>
                        <h2 className="text-sm font-medium text-muted uppercase tracking-wider">Kontodetails</h2>
                        <div className="mt-4 space-y-2">
                            <div className="flex justify-between border-b border-white/5 pb-2">
                                <span className="text-muted">Name</span>
                                <span>{user.name || "Nicht verfügbar"}</span>
                            </div>
                            <div className="flex justify-between border-b border-white/5 pb-2">
                                <span className="text-muted">E-Mail</span>
                                <span>{user.email}</span>
                            </div>
                        </div>
                    </div>

                    <div>
                        <h2 className="text-sm font-medium text-muted uppercase tracking-wider">Abonnement</h2>
                        <div className="mt-4 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className={`h-3 w-3 rounded-full ${user.subscriptionStatus === "active" ? "bg-green-500" : "bg-red-500"}`} />
                                <span className="text-lg">
                                    {user.subscriptionStatus === "active" ? "Aktiv" : "Inaktiv"}
                                </span>
                            </div>
                            {user.subscriptionStatus === "active" && (
                                <button
                                    onClick={handleCancelSubscription}
                                    disabled={cancelling}
                                    className="rounded-xl bg-red-500/10 px-4 py-2 text-sm text-red-400 hover:bg-red-500/20 disabled:opacity-50"
                                >
                                    {cancelling ? "Wird gekündigt..." : "Abonnement kündigen"}
                                </button>
                            )}
                        </div>
                        {user.subscriptionStatus === "active" && (
                            <p className="mt-2 text-xs text-muted">
                                Ihr Abonnement verlängert sich automatisch über PayPal.
                            </p>
                        )}
                    </div>
                    {message && (
                        <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-center">
                            {message}
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
}
