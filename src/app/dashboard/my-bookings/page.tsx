
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

export default function MyBookingsPage() {
    const [reservations, setReservations] = useState<Reservation[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchReservations = async () => {
            const token = getAuthToken();
            if (!token) {
                setError("Bitte melden Sie sich an, um Ihre Buchungen zu sehen.");
                setLoading(false);
                return;
            }

            try {
                const res = await fetch("/api/reservations/mine", {
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                });

                if (!res.ok) {
                    throw new Error("Fehler beim Laden der Reservierungen");
                }

                const data = await res.json();
                setReservations(data.reservations);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchReservations();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen pt-24 pb-12 flex justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen pt-24 pb-12 px-4">
                <div className="max-w-4xl mx-auto bg-red-50 p-6 rounded-lg text-red-600">
                    {error} <Link href="/anmelden" className="underline font-bold">Hier anmelden</Link>
                </div>
            </div>
        );
    }

    const getStatusLabel = (status: string) => {
        switch (status) {
            case "confirmed": return "Bestätigt";
            case "cancelled": return "Storniert";
            case "pending": return "Ausstehend";
            default: return status;
        }
    };

    return (
        <div className="min-h-screen pt-24 pb-16 bg-gray-50">
            <div className="container mx-auto px-4 max-w-5xl">
                <h1 className="text-3xl font-display font-bold text-black mb-8">Meine Buchungen</h1>

                {reservations.length === 0 ? (
                    <div className="bg-white rounded-xl p-12 text-center shadow-sm border border-gray-100">
                        <h3 className="text-xl font-medium text-gray-900 mb-2">Noch keine Buchungen</h3>
                        <p className="text-gray-700 mb-6">Sie haben noch keine Reservierungen vorgenommen.</p>
                        <Link
                            href="/immobilien"
                            className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-full text-white bg-black hover:bg-gray-800 transition-colors"
                        >
                            Immobilien durchsuchen
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {reservations.map((reservation) => (
                            <div key={reservation._id} className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                                <div className="flex flex-col md:flex-row">
                                    {/* Property Image */}
                                    <div className="md:w-64 h-48 relative bg-gray-200">
                                        {reservation.propertyId?.mainImage ? (
                                            <Image
                                                src={reservation.propertyId.mainImage}
                                                alt={reservation.propertyId.title}
                                                fill
                                                className="object-cover"
                                            />
                                        ) : (
                                            <div className="flex items-center justify-center h-full text-gray-600">
                                                Immobilie entfernt
                                            </div>
                                        )}
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 p-6 flex flex-col justify-between">
                                        <div>
                                            <div className="flex justify-between items-start mb-2">
                                                <div>
                                                    <h3 className="text-xl font-bold text-gray-900">
                                                        {reservation.propertyId ? (
                                                            <Link href={`/immobilien/${reservation.propertyId.slug}`} className="hover:text-amber-600 transition-colors">
                                                                {reservation.propertyId.title}
                                                            </Link>
                                                        ) : (
                                                            "Unbekannte Immobilie"
                                                        )}
                                                    </h3>
                                                    <p className="text-gray-700 text-sm flex items-center mt-1">
                                                        <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                        </svg>
                                                        {reservation.propertyId?.city || "Unbekannter Standort"}
                                                    </p>
                                                </div>
                                                <div className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider 
                                                    ${reservation.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                                                        reservation.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                                                            'bg-amber-100 text-amber-800'}`}>
                                                    {getStatusLabel(reservation.status)}
                                                </div>
                                            </div>

                                            <div className="mt-4 grid grid-cols-2 gap-4 text-sm text-gray-800">
                                                <div>
                                                    <span className="block text-xs uppercase text-gray-600 font-semibold mb-1">Buchungsdatum</span>
                                                    {new Date(reservation.createdAt).toLocaleDateString('de-DE')}
                                                </div>
                                                <div>
                                                    <span className="block text-xs uppercase text-gray-600 font-semibold mb-1">Zahlungsstatus</span>
                                                    {reservation.mediationFeePaid ? (
                                                        <span className="text-green-600 flex items-center">
                                                            <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                                                            Bezahlt
                                                        </span>
                                                    ) : (
                                                        <span className="text-amber-600">Zahlung ausstehend</span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="mt-6 pt-4 border-t border-gray-100 flex justify-end">
                                            {reservation.propertyId && (
                                                <Link
                                                    href={`/immobilien/${reservation.propertyId.slug}`}
                                                    className="text-sm font-medium text-black hover:underline"
                                                >
                                                    Immobiliendetails ansehen &rarr;
                                                </Link>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
