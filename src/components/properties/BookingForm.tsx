
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Script from "next/script";
import { getAuthToken } from "@/lib/auth-client";
import PayPalOneTimeButton from "@/components/paypal/PayPalOneTimeButton";

interface BookingFormProps {
    propertyId: string;
    pricePerNight: number;
    propertyTitle: string;
}

interface UserProfile {
    _id: string;
    fullName: string;
    email: string;
    phone?: string;
    hasPaidOneTimeFee: boolean;
}

export default function BookingForm({ propertyId, pricePerNight, propertyTitle }: BookingFormProps) {
    const router = useRouter();
    const [step, setStep] = useState<"loading" | "details" | "payment" | "confirm" | "success">("loading");
    const [loading, setLoading] = useState(false); // For API calls
    const [error, setError] = useState<string | null>(null);
    const [user, setUser] = useState<UserProfile | null>(null);

    // Form Data
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        phone: "",
        message: "",
    });

    useEffect(() => {
        const fetchUser = async () => {
            const token = getAuthToken();
            if (!token) {
                setStep("details"); // Allow viewing form, but will prompt login on submit
                return;
            }

            try {
                const res = await fetch("/api/profile", {
                    headers: { "Authorization": `Bearer ${token}` }
                });
                if (res.ok) {
                    const data = await res.json();
                    if (data.user) {
                        setUser(data.user);
                        setFormData(prev => ({
                            ...prev,
                            fullName: data.user.fullName || "",
                            email: data.user.email || "",
                            phone: data.user.phone || "",
                        }));
                    }
                }
            } catch (e) {
                console.error("Failed to fetch user", e);
            } finally {
                setStep("details");
            }
        };
        fetchUser();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleContinue = (e: React.FormEvent) => {
        e.preventDefault();
        const token = getAuthToken();
        if (!token) {
            // Save current path to redirect back
            const currentPath = window.location.pathname;
            router.push(`/login?redirect=${encodeURIComponent(currentPath)}`);
            return;
        }

        // If user already paid, go to confirm
        if (user?.hasPaidOneTimeFee) {
            setStep("confirm");
        } else {
            setStep("payment");
        }
    };

    const createReservation = async (paymentDetails?: any) => {
        setLoading(true);
        setError(null);
        try {
            const token = getAuthToken();
            const body: any = {
                propertyId,
                ...formData,
            };

            if (paymentDetails) {
                body.mediationPaymentId = paymentDetails.id;
            }

            const res = await fetch("/api/reservations", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(body),
            });

            if (!res.ok) {
                const json = await res.json();
                throw new Error(json.error || "Fehler beim Erstellen der Reservierung");
            }

            setStep("success");
            router.refresh();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handlePaymentSuccess = async (details: any) => {
        setLoading(true);
        setError(null);
        try {
            const token = getAuthToken();

            // Update user with payment info
            const res = await fetch("/api/profile/update-payment", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    paymentId: details.id,
                    hasPaidOneTimeFee: true
                })
            });

            if (!res.ok) {
                throw new Error("Failed to update payment status");
            }

            // Update local user state
            if (user) {
                setUser({
                    ...user,
                    hasPaidOneTimeFee: true
                });
            }

            // Move to confirm step
            setStep("confirm");
        } catch (err: any) {
            setError(err.message || "Payment processing failed");
        } finally {
            setLoading(false);
        }
    };

    const handleConfirmBooking = () => {
        createReservation();
    };

    if (step === "loading") {
        return <div className="p-8 text-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black mx-auto"></div><p className="mt-4 text-zinc-700">Lade Benutzerdaten...</p></div>;
    }

    if (step === "success") {
        return (
            <div className="text-center p-6 md:p-8 bg-zinc-50 rounded-[32px] border border-zinc-100">
                <div className="w-12 h-12 md:w-16 md:h-16 bg-black text-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl shadow-black/10">
                    <svg className="w-6 h-6 md:w-8 md:h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                </div>
                <h3 className="text-xl md:text-2xl font-black text-black mb-2 font-display uppercase tracking-tight">Buchung erfolgreich!</h3>
                <p className="text-zinc-700 mb-8 leading-relaxed text-sm font-medium">Ihre Buchungsanfrage für {propertyTitle} wurde erfolgreich gesendet.</p>
                <button
                    onClick={() => router.push("/dashboard/my-bookings")}
                    className="button-primary w-full py-4 text-xs font-black uppercase tracking-widest border-none"
                >
                    Buchungen ansehen
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-6 relative">
            {step === "details" && (
                <form onSubmit={handleContinue} className="space-y-5">
                    <div className="space-y-4">
                        <div className="group">
                            <label className="block text-[9px] font-black text-zinc-700 uppercase tracking-widest mb-1.5 ml-1 group-focus-within:text-black transition-colors">Vollständiger Name</label>
                            <input
                                required
                                name="fullName"
                                type="text"
                                value={formData.fullName}
                                onChange={handleChange}
                                className="w-full rounded-2xl border border-zinc-100 bg-zinc-50/50 px-5 py-4 text-black focus:ring-4 focus:ring-black/5 focus:border-black/10 focus:bg-white outline-none transition-all font-bold text-sm"
                                placeholder="z.B. Max Mustermann"
                            />
                        </div>
                        <div className="group">
                            <label className="block text-[9px] font-black text-zinc-700 uppercase tracking-widest mb-1.5 ml-1 group-focus-within:text-black transition-colors">E-Mail-Adresse</label>
                            <input
                                required
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full rounded-2xl border border-zinc-100 bg-zinc-50/50 px-5 py-4 text-black focus:ring-4 focus:ring-black/5 focus:border-black/10 focus:bg-white outline-none transition-all font-bold text-sm"
                                placeholder="max@example.com"
                            />
                        </div>
                        <div className="group">
                            <label className="block text-[9px] font-black text-zinc-700 uppercase tracking-widest mb-1.5 ml-1 group-focus-within:text-black transition-colors">Telefonnummer</label>
                            <input
                                required
                                name="phone"
                                type="tel"
                                value={formData.phone}
                                onChange={handleChange}
                                className="w-full rounded-2xl border border-zinc-100 bg-zinc-50/50 px-5 py-4 text-black focus:ring-4 focus:ring-black/5 focus:border-black/10 focus:bg-white outline-none transition-all font-bold text-sm"
                                placeholder="+49 123 4567890"
                            />
                        </div>
                        <div className="group">
                            <label className="block text-[9px] font-black text-zinc-700 uppercase tracking-widest mb-1.5 ml-1 group-focus-within:text-black transition-colors">Nachricht (Optional)</label>
                            <textarea
                                name="message"
                                value={formData.message}
                                onChange={handleChange}
                                rows={3}
                                className="w-full rounded-2xl border border-zinc-100 bg-zinc-50/50 px-5 py-4 text-black focus:ring-4 focus:ring-black/5 focus:border-black/10 focus:bg-white outline-none transition-all font-bold text-sm resize-none"
                                placeholder="Schreiben Sie hier Ihre Nachricht an den Anbieter..."
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="button-primary w-full py-4 text-xs font-black uppercase tracking-widest border-none"
                    >
                        {user ? "Weiter" : "Zum Fortfahren anmelden"}
                    </button>

                    {!user && (
                        <p className="text-center text-[10px] font-black text-zinc-700 uppercase tracking-[0.2em] pt-2">
                            Noch kein Konto? <Link href="/registrieren" className="text-black hover:underline underline-offset-4">Registrieren</Link>
                        </p>
                    )}
                </form>
            )}

            {step === "payment" && (
                <div className="space-y-8">
                    <div className="p-6 md:p-8 rounded-[32px] bg-black text-white relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-3xl -mr-16 -mt-16"></div>
                        <div className="relative z-10 flex justify-between items-center mb-6">
                            <div>
                                <h4 className="text-lg font-black font-display leading-tight uppercase tracking-tight">Anmeldegebühr</h4>
                                <p className="text-zinc-600 text-[10px] mt-1 font-black uppercase tracking-widest">Einmalige Aktivierung</p>
                            </div>
                            <span className="text-3xl font-black text-white tracking-tighter shrink-0 ml-4">0,99 €</span>
                        </div>
                        <div className="relative z-10 min-h-[140px] bg-white rounded-2xl p-4">
                            <PayPalOneTimeButton
                                amount={0.99}
                                onSuccess={handlePaymentSuccess}
                                onError={(err) => setError("Zahlung fehlgeschlagen. Bitte versuchen Sie es erneut.")}
                            />
                        </div>
                    </div>

                    <button
                        onClick={() => setStep("details")}
                        className="w-full text-zinc-700 text-[9px] font-black uppercase tracking-widest hover:text-black transition-colors flex items-center justify-center gap-2"
                    >
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Zurück zu den Details
                    </button>
                </div>
            )}

            {step === "confirm" && (
                <div className="space-y-6">
                    <div className="bg-zinc-50 p-6 md:p-8 rounded-[32px] border border-zinc-100">
                        <h4 className="text-lg font-black text-black mb-6 font-display uppercase tracking-tight">Bestätigen</h4>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center py-3 border-b border-zinc-200/50">
                                <span className="text-[9px] font-black text-zinc-700 uppercase tracking-widest">Objekt</span>
                                <span className="text-xs font-black text-black truncate ml-4 max-w-[150px]">{propertyTitle}</span>
                            </div>
                            <div className="flex justify-between items-center py-3 border-b border-zinc-200/50">
                                <span className="text-[9px] font-black text-zinc-700 uppercase tracking-widest">Name</span>
                                <span className="text-xs font-black text-black">{formData.fullName}</span>
                            </div>
                            <div className="flex justify-between items-center py-3 border-b border-zinc-200/50">
                                <span className="text-[9px] font-black text-zinc-700 uppercase tracking-widest">Email</span>
                                <span className="text-xs font-black text-black">{formData.email}</span>
                            </div>
                            <div className="flex justify-between items-center py-3">
                                <span className="text-[9px] font-black text-zinc-700 uppercase tracking-widest">Status</span>
                                <div className="flex items-center gap-2 text-black bg-black/5 px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-[0.1em] border border-black/10 shrink-0">
                                    Bezahlt
                                </div>
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={handleConfirmBooking}
                        disabled={loading}
                        className="button-primary w-full py-4 text-xs font-black uppercase tracking-widest disabled:opacity-50 border-none"
                    >
                        {loading ? "Duke procesuar..." : "Rezervoni"}
                    </button>

                    <button
                        onClick={() => setStep("details")}
                        disabled={loading}
                        className="w-full text-zinc-700 text-[9px] font-black uppercase tracking-widest hover:text-black transition-colors flex items-center justify-center gap-2"
                    >
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        Details ändern
                    </button>
                </div>
            )}

            {error && (
                <div className="p-4 bg-red-50 text-red-600 rounded-2xl text-[10px] font-black border border-red-100 flex items-center gap-3 uppercase tracking-wider">
                    <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    {error}
                </div>
            )}

            {loading && step !== "confirm" && (
                <div className="absolute inset-0 bg-white/70 backdrop-blur-sm flex items-center justify-center z-20 rounded-[40px]">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
                </div>
            )}
        </div>
    );
}
