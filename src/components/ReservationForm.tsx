"use client";

import { useState } from "react";
// import PayPalOneTimeButton from "./paypal/PayPalOneTimeButton"; 
import PayPalSubscriptionButton from "./paypal/PayPalSubscriptionButton";
import { getAuthToken } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

type ReservationFormProps = {
    propertyId: string;
    pricePerNight: number;
    user: any; // User object if logged in
    hasPaidOneTimeFee?: boolean;
};

export default function ReservationForm({ propertyId, pricePerNight, user, hasPaidOneTimeFee }: ReservationFormProps) {
    const router = useRouter();
    const [step, setStep] = useState<"details" | "payment" | "success">("details");
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Form State
    const [formData, setFormData] = useState({
        fullName: user?.fullName || "",
        email: user?.email || "",
        phone: user?.phone || "",
    });

    const token = getAuthToken(); // Moved here to be available for the !user block

    // Debugging Props
    console.log("ReservationForm Rendered:", { hasPaidOneTimeFee, userEmail: user?.email });

    if (!user) {
        return (
            <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-xl">
                <div className="flex items-center justify-between border-b border-zinc-200 pb-4 mb-6">
                    <h3 className="text-xl font-bold text-zinc-900">Book this stay</h3>
                    {!token && (
                        <div className="flex gap-2 text-xs">
                            <a href="/login" className="px-3 py-2 rounded-md bg-zinc-900 text-white hover:bg-zinc-800">Log in</a>
                            <a href="/register" className="px-3 py-2 rounded-md border border-zinc-300 text-zinc-900 hover:bg-zinc-50">Sign up</a>
                        </div>
                    )}
                </div>
                <p className="text-zinc-600 mb-6">Please log in to reserve this property.</p>
                <div className="flex gap-4">
                    <a href="/login" className="flex-1 rounded-md bg-zinc-900 py-2 text-center text-sm font-bold text-white hover:bg-zinc-800">
                        Log In
                    </a>
                    <a href="/register" className="flex-1 rounded-md border border-zinc-300 py-2 text-center text-sm font-bold text-zinc-900 hover:bg-zinc-50">
                        Register
                    </a>
                </div>
            </div>
        );
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleDetailsSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setStep("payment");
    };

    const handleReservationSubmit = async (paymentDetails?: any) => {
        setIsProcessing(true);
        setError(null);

        try {
            const body: any = {
                propertyId,
                fullName: formData.fullName,
                email: formData.email,
                phone: formData.phone,
            };

            // Standard One-Time Payment Logic
            if (paymentDetails?.id) {
                body.mediationFeePaid = true;
                body.mediationPaymentId = paymentDetails.id;
            } else if (typeof paymentDetails === 'string') {
                // Subscription ID handling (optional fallback if triggered from success screen)
                body.subscriptionId = paymentDetails;
            } else {
                // Already paid case
                body.mediationFeePaid = true;
            }

            const res = await fetch("/api/reservations", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(body)
            });

            const data = await res.json();

            if (!res.ok) throw new Error(data.error || "Failed to create reservation");

            // No reload needed. We transition to "success" step which relies on the fact that the reservation is created.
            // The user status is updated on the server. If they navigate away and come back, `hasPaidOneTimeFee` will be true.

            setStep("success");
        } catch (err: any) {
            setError(err.message || "Something went wrong creating the reservation.");
            setIsProcessing(false);
        }
    };

    if (step === "success") {
        return (
            <div className="rounded-xl border border-green-500/20 bg-green-500/10 p-6 text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-500/20">
                    <svg className="h-8 w-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                </div>
                <h3 className="text-xl font-bold text-green-500 mb-2">Reservation Confirmed!</h3>
                <p className="text-zinc-300 mb-6">Your booking request has been sent successfully.</p>

                <div className="mb-6 rounded-md bg-zinc-100 p-4 text-left text-sm text-zinc-700 border border-zinc-200">
                    <p className="mb-1"><strong className="text-zinc-900">Name:</strong> {formData.fullName}</p>
                    <p className="mb-1"><strong className="text-zinc-900">Email:</strong> {formData.email}</p>
                    <p className="mb-1"><strong className="text-zinc-900">Phone:</strong> {formData.phone}</p>
                    <p className="mt-3 text-xs text-zinc-500 italic">A confirmation email has been sent to your inbox.</p>
                </div>



                <button onClick={() => router.push("/")} className="w-full rounded-full bg-zinc-900 py-2 text-sm font-bold text-white hover:bg-zinc-800">
                    Back to Home
                </button>
            </div>
        );
    }

    return (
        <div className="sticky top-24 rounded-xl border border-zinc-200 bg-white p-6 shadow-xl">
            <div className="flex justify-between items-end mb-6">
                <div className="flex items-end gap-1">
                    <span className="text-2xl font-bold text-zinc-900">${pricePerNight}</span>
                    <span className="text-sm text-zinc-500 mb-1">/ night</span>
                </div>
                {!hasPaidOneTimeFee && (
                    <div className="text-right">
                        <div className="text-xs text-amber-600 font-bold">One-time Fee</div>
                        <div className="flex items-center justify-end gap-1">
                            <span className="font-bold text-zinc-900">$0.99</span>
                        </div>
                    </div>
                )}
                {hasPaidOneTimeFee && (
                    <div className="text-right">
                        <span className="block text-xs text-green-500">Fee Paid ✓</span>
                    </div>
                )}
            </div>

            {step === "details" && (
                <form onSubmit={handleDetailsSubmit} className="space-y-4">
                    <div>
                        <label className="block text-xs uppercase tracking-wide text-zinc-500 mb-1">Full Name</label>
                        <input
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleInputChange}
                            required
                            className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-zinc-900 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                            placeholder="John Doe"
                        />
                    </div>
                    <div>
                        <label className="block text-xs uppercase tracking-wide text-zinc-500 mb-1">
                            Email
                            {hasPaidOneTimeFee && (
                                <span className="ml-2 inline-flex items-center text-green-500 normal-case">
                                    <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                    Verified & Paid
                                </span>
                            )}
                        </label>
                        <input
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            required
                            className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-zinc-900 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                            placeholder="john@example.com"
                        />
                    </div>
                    <div>
                        <label className="block text-xs uppercase tracking-wide text-zinc-500 mb-1">Phone</label>
                        <input
                            name="phone"
                            type="tel"
                            value={formData.phone}
                            onChange={handleInputChange}
                            required
                            className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-zinc-900 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                            placeholder="+1 (555) 000-0000"
                        />
                    </div>

                    <button type="submit" className="w-full rounded-full bg-zinc-900 py-3 font-bold text-white hover:bg-zinc-800 transition-colors">
                        Continue to {hasPaidOneTimeFee ? "Confirm" : "Payment"}
                    </button>
                </form>
            )}

            {step === "payment" && (
                <div className="space-y-4">
                    {hasPaidOneTimeFee ? (
                        <div>
                            <p className="text-sm text-zinc-400 mb-4">
                                You have already paid the one-time access fee. You can proceed to book directly.
                            </p>
                            <button
                                onClick={() => handleReservationSubmit()}
                                disabled={isProcessing}
                                className="w-full rounded-full bg-amber-500 py-3 font-bold text-black hover:bg-amber-400 transition-colors disabled:opacity-50"
                            >
                                {isProcessing ? "Processing..." : "Confirm Reservation"}
                            </button>
                        </div>
                    ) : (
                        <div>
                            <div className="text-sm text-zinc-600 mb-4 bg-zinc-100 p-3 rounded-md">
                                <p className="mb-2"><strong className="text-black">Start Membership</strong></p>
                                Pay <strong>€0.99</strong> setup fee today. (Subscription of €49.99/year starts tomorrow).
                            </div>

                            <PayPalSubscriptionButton
                                onSubscribed={(subId) => handleReservationSubmit(subId)}
                            />

                            <div className="mt-4 text-center">
                                <span className="text-xs text-zinc-500">Already subscribed? </span>
                                <button
                                    onClick={() => window.location.reload()}
                                    className="text-xs text-amber-500 underline hover:text-amber-400"
                                >
                                    Refresh Status
                                </button>
                            </div>
                        </div>
                    )}

                    <button onClick={() => setStep("details")} className="w-full text-center text-sm text-zinc-500 hover:text-white mt-2">
                        Back to Details
                    </button>
                </div>
            )}

            {error && (
                <div className="mt-4 rounded-md bg-red-500/10 p-3 text-sm text-red-500">
                    {error}
                </div>
            )}
        </div>
    );
}
