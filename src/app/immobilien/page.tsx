
import { connectToDatabase } from "@/lib/db";
import { Property } from "@/models/Property";
import PropertyFilters from "@/components/properties/PropertyFilters";
import PropertyCard from "@/components/properties/PropertyCard";
import Link from "next/link";
import Image from "next/image";

interface PageProps {
    searchParams: Promise<{
        search?: string;
        city?: string;
        category?: string;
        minPrice?: string;
        maxPrice?: string;
        minSize?: string;
        maxSize?: string;
        bedrooms?: string;
        bathrooms?: string;
    }>;
}

export const dynamic = "force-dynamic";

export default async function PropertiesPage({ searchParams }: PageProps) {
    await connectToDatabase();

    const params = await searchParams;
    const { search, city, category, minPrice, maxPrice, minSize, maxSize, bedrooms, bathrooms } = params;

    const query: any = {};

    if (search) {
        query.$or = [
            { title: { $regex: search, $options: "i" } },
            { city: { $regex: search, $options: "i" } },
            { address: { $regex: search, $options: "i" } }
        ];
    }
    if (city) query.city = { $regex: city, $options: "i" };
    if (category && category !== "All") query.category = category.toLowerCase();
    if (minPrice || maxPrice) {
        query.pricePerNight = {};
        if (minPrice) query.pricePerNight.$gte = Number(minPrice);
        if (maxPrice) query.pricePerNight.$lte = Number(maxPrice);
    }
    if (minSize || maxSize) {
        query.sizeM2 = {};
        if (minSize) query.sizeM2.$gte = Number(minSize);
        if (maxSize) query.sizeM2.$lte = Number(maxSize);
    }
    if (bedrooms) query.bedrooms = { $gte: Number(bedrooms) };
    if (bathrooms) query.bathrooms = { $gte: Number(bathrooms) };

    const properties = await Property.find(query).sort({ createdAt: -1 }).lean();
    const totalProperties = await Property.countDocuments({});

    return (
        <div className="min-h-screen pt-20 pb-24 bg-white">
            <div className="container mx-auto px-6 lg:px-12">
                <div className="mb-16">
                    <h1 className="text-4xl lg:text-6xl font-black text-black mb-4 font-display tracking-tighter uppercase">Alle Immobilien</h1>
                    <p className="text-zinc-400 font-medium">Durchsuchen Sie unsere vollständige Sammlung von Immobilien in Deutschland</p>
                </div>

                <div className="flex flex-col lg:flex-row gap-16">
                    {/* Left Sidebar: Filters */}
                    <aside className="lg:w-1/4">
                        {/* Mobile Toggle Button - Moved this to be always visible on mobile */}
                        <div className="lg:hidden mb-8">
                            <details className="group marker:content-none">
                                <summary className="flex items-center justify-between w-full p-6 bg-zinc-50 rounded-2xl border border-zinc-100 cursor-pointer list-none">
                                    <div className="flex items-center gap-3">
                                        <svg className="w-5 h-5 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                                        </svg>
                                        <span className="text-xs font-black text-black uppercase tracking-[0.2em]">Filter</span>
                                    </div>
                                    <svg className="w-5 h-5 text-zinc-300 transition-transform group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </summary>
                                <div className="mt-4 p-8 bg-zinc-50 rounded-[32px] border border-zinc-100">
                                    <PropertyFilters
                                        totalCount={totalProperties}
                                        currentCount={properties.length}
                                        layout="sidebar"
                                    />
                                </div>
                            </details>
                        </div>

                        {/* Desktop Filters */}
                        <div className="hidden lg:block sticky top-28 space-y-8">
                            <div className="p-8 bg-zinc-50 rounded-[32px] border border-zinc-100">
                                <h3 className="text-xs font-black text-black uppercase tracking-[0.2em] mb-8 pb-4 border-b border-zinc-200">Filter</h3>
                                <PropertyFilters
                                    totalCount={totalProperties}
                                    currentCount={properties.length}
                                    layout="sidebar"
                                />
                            </div>
                        </div>
                    </aside>

                    {/* Right Column: Search + Grid */}
                    <main className="lg:w-3/4 space-y-12">
                        {/* Search Bar at the top of results */}
                        <div className="relative group">
                            <PropertyFilters
                                totalCount={totalProperties}
                                currentCount={properties.length}
                                layout="search-only"
                            />
                        </div>

                        {/* Property Grid */}
                        <div>
                            {properties.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                                    {properties.map((property) => (
                                        <div key={property._id.toString()}>
                                            <PropertyCard property={property as any} />
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center py-32 text-center bg-zinc-50 rounded-[40px] border border-zinc-100">
                                    <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mb-6 shadow-sm">
                                        <svg className="w-10 h-10 text-zinc-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                        </svg>
                                    </div>
                                    <h3 className="text-2xl font-black text-black uppercase tracking-tight">Keine Immobilien gefunden</h3>
                                    <p className="mt-2 text-zinc-400 max-w-xs font-medium">Versuchen Sie, Ihre Filter zu ändern, um andere Ergebnisse zu sehen.</p>
                                    <Link href="/immobilien" className="mt-8 button-primary px-8 py-4 text-xs font-black uppercase tracking-widest border-none">
                                        Suche zurücksetzen
                                    </Link>
                                </div>
                            )}
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
}
