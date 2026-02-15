"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getAuthToken } from "@/lib/auth-client";
import BookingForm from "./BookingForm";

interface OwnerInfoSectionProps {
    owner: {
        fullName?: string;
        email?: string;
        phone?: string;
    } | null;
    propertyId: string;
    pricePerNight: number;
    propertyTitle: string;
}

export default function OwnerInfoSection({ owner, propertyId, pricePerNight, propertyTitle }: OwnerInfoSectionProps) {
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
                    <div className="mb-8 p-6 bg-zinc-50 rounded-3xl border border-zinc-100">
                        <h4 className="text-[10px] font-black text-zinc-600 uppercase tracking-widest mb-4">Anbieter Informationen</h4>
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-black shadow-sm">
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-[9px] text-zinc-600 uppercase font-black tracking-widest">Name</p>
                                    <p className="text-sm font-black text-black">{owner?.fullName || "Admin"}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-black shadow-sm">
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-[9px] text-zinc-400 uppercase font-black tracking-widest">Email</p>
                                    <p className="text-sm font-black text-black truncate max-w-[150px]">{owner?.email || "Kontakt über Buchung"}</p>
                                </div>
                            </div>
                            {owner?.phone && (
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-black shadow-sm">
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="text-[9px] text-zinc-400 uppercase font-black tracking-widest">Telefon</p>
                                        <p className="text-sm font-black text-black">{owner?.phone}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

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
                            className="inline-flex items-center justify-center px-8 py-3 bg-black text-white rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-zinc-800 transition-all"
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
