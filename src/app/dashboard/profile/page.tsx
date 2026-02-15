
"use client";

import { useEffect, useState } from "react";
import { getAuthToken } from "@/lib/auth-client";
import Link from "next/link";
import Image from "next/image";

interface Reservation {
    _id: string;
    propertyId: {
        _id: string;
        title: string;
        slug: string;
        mainImage: string;
        city: string;
        pricePerNight: number;
    } | null;
    status: "pending" | "confirmed" | "cancelled";
    createdAt: string;
    fullName: string;
    email: string;
    phone: string;
    mediationFeePaid: boolean;
}

export default function ProfilePage() {
    const [user, setUser] = useState<any>(null);
    const [reservations, setReservations] = useState<Reservation[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            const token = getAuthToken();
            if (!token) {
                setLoading(false);
                return;
            }

            try {
                // Fetch profile
                const profileRes = await fetch("/api/profile", {
                    headers: { "Authorization": `Bearer ${token}` }
                });
                if (profileRes.ok) {
                    const profileData = await profileRes.json();
                    setUser(profileData.user);
                }

                // Fetch reservations
                const reservationsRes = await fetch("/api/reservations/mine", {
                    headers: { "Authorization": `Bearer ${token}` }
                });
                if (reservationsRes.ok) {
                    const reservationsData = await reservationsRes.json();
                    setReservations(reservationsData.reservations || []);
                }
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen pt-24 pb-12 flex justify-center bg-[#FAFAFA]">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
            </div>
        );
    }

    const firstName = user?.fullName?.split(' ')[0] || 'Gast';

    const getStatusLabel = (status: string) => {
        switch (status) {
            case "confirmed": return "Bestätigt";
            case "cancelled": return "Storniert";
            case "pending": return "Ausstehend";
            default: return status;
        }
    };

    return (
        <div className="min-h-screen py-12 bg-[#FAFAFA]">
            <div className="container mx-auto px-4 max-w-4xl space-y-8">

                {/* Welcome Card */}
                <div className="bg-white rounded-3xl p-10 border border-zinc-100 shadow-sm">
                    <h1 className="text-4xl font-extrabold text-[#1C1C1C] mb-3">Willkommen, {firstName}</h1>
                    <p className="text-zinc-500 text-sm">Verwalten Sie Ihre Buchungen und Profildaten</p>
                </div>

                {/* Profile Information Card */}
                <div className="bg-white rounded-3xl p-10 border border-zinc-100 shadow-sm">
                    <h2 className="text-xl font-bold text-[#1C1C1C] text-center mb-10">Profilinformationen</h2>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        {[
                            { label: "NAME", value: user?.fullName || "Gast" },
                            { label: "E-MAIL", value: user?.email || "gast@example.com" },
                            { label: "TELEFON", value: user?.phone || "-" },
                            { label: "ROLLE", value: user?.role === 'admin' ? "Eigentümer" : "Kunde" }
                        ].map((item, i) => (
                            <div key={i} className="bg-[#FAFAFA] rounded-xl p-5 border border-zinc-50">
                                <span className="text-[10px] font-bold text-zinc-400 block mb-1 uppercase tracking-wider">{item.label}</span>
                                <span className="text-sm font-semibold text-[#1C1C1C] block truncate">{item.value}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* My Bookings Card */}
                <div className="bg-white rounded-3xl p-10 border border-zinc-100 shadow-sm">
                    <h2 className="text-xl font-bold text-[#1C1C1C] text-center mb-10">Meine Buchungen</h2>

                    {reservations.length === 0 ? (
                        <div className="text-center space-y-6 py-4">
                            <h3 className="text-sm font-bold text-[#1C1C1C]">Noch keine Buchungen</h3>
                            <p className="text-zinc-400 text-xs max-w-xs mx-auto">Entdecken Sie unsere Immobilien und tätigen Sie Ihre erste Buchung!</p>
                            <Link
                                href="/immobilien"
                                className="inline-block bg-[#1C1C1C] text-white px-8 py-3 rounded-xl text-xs font-bold hover:bg-zinc-800 transition-all"
                            >
                                Immobilien durchsuchen
                            </Link>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-6">
                            {reservations.map((res) => (
                                <div key={res._id} className="flex flex-col md:flex-row gap-6 p-4 rounded-2xl bg-[#FAFAFA] border border-zinc-100 group transition-all hover:bg-white hover:shadow-md">
                                    <div className="w-full md:w-32 h-24 rounded-xl overflow-hidden bg-white shrink-0">
                                        {res.propertyId?.mainImage ? (
                                            <img src={res.propertyId.mainImage} alt="" className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-zinc-300">
                                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-1 flex flex-col justify-center">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h4 className="font-bold text-[#1C1C1C] text-sm group-hover:text-zinc-700 transition-colors">
                                                    {res.propertyId?.title || "Gelöschte Immobilie"}
                                                </h4>
                                                <p className="text-[10px] text-zinc-400 font-medium mt-1">{res.propertyId?.city || "Deutschland"}</p>
                                            </div>
                                            <span className={`text-[9px] font-bold px-2 py-1 rounded-full uppercase tracking-tighter ${res.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                                                res.status === 'cancelled' ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'
                                                }`}>
                                                {getStatusLabel(res.status)}
                                            </span>
                                        </div>
                                        <div className="mt-3 flex items-center justify-between">
                                            <span className="text-[10px] font-bold text-zinc-400 uppercase">
                                                Datum: {new Date(res.createdAt).toLocaleDateString('de-DE')}
                                            </span>
                                            {res.propertyId && (
                                                <Link href={`/immobilien/${res.propertyId.slug}`} className="text-[10px] font-extrabold text-[#1C1C1C] hover:underline">
                                                    DETAILS ANSEHEN
                                                </Link>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}
