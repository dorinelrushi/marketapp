"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getAuthToken } from "@/lib/auth-client";
import BookingForm from "./BookingForm";

interface OwnerInfoSectionProps {
    propertyId: string;
    pricePerNight: number;
    propertyTitle: string;
}

export default function OwnerInfoSection({ propertyId, pricePerNight, propertyTitle }: OwnerInfoSectionProps) {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const token = getAuthToken();
        setIsLoggedIn(!!token);
        setIsLoading(false);
    }, []);

    if (isLoading) {
        return (
            <div className="text-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black mx-auto"></div>
            </div>
        );
    }

    return (
        <>
            <div className="flex items-start justify-between mb-8 pb-8 border-b border-zinc-50">
                <div>
                    <span className="text-3xl md:text-4xl font-black text-black tracking-tighter">€{pricePerNight}</span>
                    <span className="text-zinc-600 font-black text-[9px] uppercase tracking-[0.2em] block mt-1">/ Pro Nacht</span>
                </div>
                <div className="flex items-center text-[9px] font-black text-black bg-black/5 px-4 py-2 rounded-full border border-black/10 uppercase tracking-[0.1em] shrink-0">
                    Verifiziert
                </div>
            </div>

            {/* Owner Info Section */}
            {isLoggedIn ? (
                <>
                    <BookingForm
                        propertyId={propertyId}
                        pricePerNight={pricePerNight}
                        propertyTitle={propertyTitle}
                    />
                </>
            ) : (
                <div className="text-center py-12">
                    <div className="w-16 h-16 rounded-full bg-zinc-100 flex items-center justify-center mx-auto mb-6">
                        <svg className="w-8 h-8 text-zinc-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                    </div>
                    <h3 className="text-lg font-black text-black mb-3 uppercase tracking-tight">Anmeldung erforderlich</h3>
                    <p className="text-[11px] font-bold text-zinc-600 uppercase tracking-widest mb-6 max-w-xs mx-auto">
                        Bitte melden Sie sich an, um Kontaktdaten zu sehen und eine Buchung vorzunehmen.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        <Link
                            href="/anmelden"
                            className="aa inline-flex items-center justify-center px-8 py-3 bg-black text-[white!important] rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-zinc-800 transition-all"
                        >
                            Anmelden
                        </Link>
                        <Link
                            href="/registrieren"
                            className="inline-flex items-center justify-center px-8 py-3 bg-zinc-100 text-black rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-zinc-200 transition-all"
                        >
                            Registrieren
                        </Link>
                    </div>
                </div>
            )}
        </>
    );
}
