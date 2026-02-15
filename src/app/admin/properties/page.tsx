import Link from "next/link";
import { connectToDatabase } from "@/lib/db";
import { Property } from "@/models/Property";
import DeletePropertyButton from "./DeletePropertyButton";

export default async function AdminPropertiesPage() {
    await connectToDatabase();
    const properties = await Property.find().sort({ createdAt: -1 });

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <h1 className="font-display text-3xl font-bold">Immobilien</h1>
                <Link
                    href="/admin/properties/new"
                    className="rounded-full bg-white px-4 py-2 text-sm font-medium text-black transition-transform hover:scale-105"
                >
                    + Immobilie hinzufügen
                </Link>
            </div>

            <div className="overflow-hidden rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm">
                <table className="w-full text-left text-sm text-zinc-400">
                    <thead className="bg-white/5 text-zinc-200">
                        <tr>
                            <th className="px-6 py-4 font-medium">Bild</th>
                            <th className="px-6 py-4 font-medium">Titel</th>
                            <th className="px-6 py-4 font-medium">Stadt</th>
                            <th className="px-6 py-4 font-medium">Preis</th>
                            <th className="px-6 py-4 font-medium">Kategorie</th>
                            <th className="px-6 py-4 font-medium">Aktionen</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/10">
                        {properties.map((property) => (
                            <tr key={property._id.toString()} className="hover:bg-white/5">
                                <td className="px-6 py-4">
                                    <div className="h-12 w-20 overflow-hidden rounded-md bg-zinc-800">
                                        {property.mainImage ? (
                                            <img
                                                src={property.mainImage}
                                                alt={property.title}
                                                className="h-full w-full object-cover"
                                            />
                                        ) : (
                                            <div className="flex h-full w-full items-center justify-center text-xs text-zinc-500">Kein Bild</div>
                                        )}
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-white font-medium">{property.title}</td>
                                <td className="px-6 py-4">{property.city}</td>
                                <td className="px-6 py-4">{property.pricePerNight} €/Nacht</td>
                                <td className="px-6 py-4 capitalize">{property.category}</td>
                                <td className="px-6 py-4">
                                    <Link
                                        href={`/admin/properties/${property._id}/edit`}
                                        className="text-amber-500 hover:text-amber-400 mr-4"
                                    >
                                        Bearbeiten
                                    </Link>
                                    <DeletePropertyButton id={property._id.toString()} />
                                </td>
                            </tr>
                        ))}
                        {properties.length === 0 && (
                            <tr>
                                <td colSpan={6} className="px-6 py-8 text-center text-zinc-500">
                                    Keine Immobilien gefunden. Erstellen Sie eine, um zu beginnen.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
