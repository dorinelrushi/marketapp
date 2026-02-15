import Link from "next/link";
import { connectToDatabase } from "@/lib/db";
import { Property } from "@/models/Property";
import { Reservation } from "@/models/Reservation";

export default async function AdminDashboard() {
    await connectToDatabase();

    const propertyCount = await Property.countDocuments();
    const reservationCount = await Reservation.countDocuments();
    const pendingReservations = await Reservation.countDocuments({ status: "pending" });

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <h1 className="font-display text-3xl font-bold">Dashboard</h1>
                <Link
                    href="/admin/properties/new"
                    className="rounded-full bg-white px-4 py-2 text-sm font-medium text-black transition-transform hover:scale-105"
                >
                    + Immobilie hinzufügen
                </Link>
            </div>

            <div className="grid gap-6 sm:grid-cols-3">
                <div className="rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
                    <h3 className="text-sm font-medium text-zinc-400">Immobilien gesamt</h3>
                    <p className="mt-2 font-display text-4xl font-bold">{propertyCount}</p>
                </div>
                <div className="rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
                    <h3 className="text-sm font-medium text-zinc-400">Reservierungen gesamt</h3>
                    <p className="mt-2 font-display text-4xl font-bold">{reservationCount}</p>
                </div>
                <div className="rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
                    <h3 className="text-sm font-medium text-zinc-400">Ausstehende Reservierungen</h3>
                    <p className="mt-2 font-display text-4xl font-bold text-amber-500">
                        {pendingReservations}
                    </p>
                </div>
            </div>
        </div>
    );
}
