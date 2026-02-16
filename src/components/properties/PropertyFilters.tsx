"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";


export default function PropertyFilters({
    totalCount,
    currentCount,
    layout = "full"
}: {
    totalCount: number;
    currentCount: number;
    layout?: "full" | "sidebar" | "search-only"
}) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [search, setSearch] = useState(searchParams.get("search") || "");
    const [minPrice, setMinPrice] = useState(searchParams.get("minPrice") || "");
    const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") || "");
    const [minSize, setMinSize] = useState(searchParams.get("minSize") || "");
    const [maxSize, setMaxSize] = useState(searchParams.get("maxSize") || "");
    const [minRooms, setMinRooms] = useState(searchParams.get("bedrooms") || "");
    const [minBathrooms, setMinBathrooms] = useState(searchParams.get("bathrooms") || "");

    // Debounce effect for automatic filtering
    useEffect(() => {
        const timer = setTimeout(() => {
            applyFilters();
        }, 500);

        return () => clearTimeout(timer);
    }, [search, minPrice, maxPrice, minSize, maxSize, minRooms, minBathrooms]);

    const applyFilters = (overrides = {}) => {
        const params = new URLSearchParams(searchParams.toString());

        const data = {
            search,
            minPrice,
            maxPrice,
            minSize,
            maxSize,
            bedrooms: minRooms,
            bathrooms: minBathrooms,
            ...overrides
        };

        let hasChanges = false;
        Object.entries(data).forEach(([key, value]) => {
            const currentVal = params.get(key);
            if (value && value !== "All") {
                if (currentVal !== value.toString()) {
                    params.set(key, value as string);
                    hasChanges = true;
                }
            } else {
                if (params.has(key)) {
                    params.delete(key);
                    hasChanges = true;
                }
            }
        });

        if (hasChanges) {
            params.set("page", "1");
            router.replace(`/immobilien?${params.toString()}`, { scroll: false });
        }
    };

    const resetFilters = () => {
        setSearch("");
        setMinPrice("");
        setMaxPrice("");
        setMinSize("");
        setMaxSize("");
        setMinRooms("");
        setMinBathrooms("");
        router.push("/immobilien");
    };

    if (layout === "search-only") {
        return (
            <div className="flex bg-white rounded-3xl border border-zinc-200 focus-within:ring-8 focus-within:ring-black/5 focus-within:border-black/20 transition-all overflow-hidden shadow-sm">
                <div className="flex items-center pl-8 text-zinc-400">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </div>
                <input
                    type="text"
                    placeholder="Suche nach Stadt, Titel oder Adresse..."
                    className="w-[80%] px-6 py-6 outline-none text-black placeholder:text-zinc-300 bg-transparent font-bold text-sm"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
                <button
                    onClick={() => applyFilters()}
                    className="bg-black m-[5px] text-white px-12 font-black uppercase tracking-[0.2em] text-xs hover:bg-zinc-900 transition-colors rounded-[15px]"
                >
                    Suche
                </button>
            </div>
        );
    }

    if (layout === "sidebar") {
        return (
            <div className="space-y-10">
                <div className="space-y-6">
                    {[
                        { label: "Mindestpreis", value: minPrice, setter: setMinPrice, placeholder: "500" },
                        { label: "Maximalpreis", value: maxPrice, setter: setMaxPrice, placeholder: "2500" },
                        { label: "Mindest Zimmer", value: minRooms, setter: setMinRooms, placeholder: "2" },
                        { label: "Mindest Bäder", value: minBathrooms, setter: setMinBathrooms, placeholder: "1" },
                    ].map((field, idx) => (
                        <div key={idx} className="space-y-3 group">
                            <label className="text-[10px] font-black text-zinc-300 uppercase tracking-[0.2em] group-focus-within:text-black transition-colors">
                                {field.label}
                            </label>
                            <input
                                type="number"
                                placeholder={field.placeholder}
                                className="w-full px-5 py-4 bg-white border border-zinc-200 rounded-2xl outline-none focus:ring-4 focus:ring-black/5 focus:border-black/10 transition-all text-black font-bold text-xs"
                                value={field.value}
                                onChange={(e) => field.setter(e.target.value)}
                            />
                        </div>
                    ))}
                </div>

                <div className="pt-6 flex flex-col gap-3">
                    <button
                        onClick={() => { resetFilters(); }}
                        className="w-full py-4 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-300 hover:text-black transition-colors"
                    >
                        Zurücksetzen
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center mb-16">
            <h1 className="text-4xl lg:text-5xl font-black text-black mb-4 font-display tracking-tighter text-center tracking-tighter uppercase">Alle Immobilien</h1>
            <p className="text-zinc-500 font-medium mb-12 text-center">Entdecken Sie die besten Wohnungen in Deutschland</p>

            <div className="w-full max-w-5xl bg-white rounded-[40px] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.05)] border border-zinc-100 p-8 md:p-12">
                <div className="space-y-12">
                    {/* Top Search Bar */}
                    <div className="flex bg-white rounded-2xl border border-zinc-200 focus-within:ring-4 focus-within:ring-black/5 focus-within:border-black/20 transition-all overflow-hidden">
                        <input
                            type="text"
                            placeholder="Suche nach Stadt, Titel oder Adresse..."
                            className="flex-1 px-8 py-4 outline-none text-black placeholder:text-zinc-300 bg-transparent font-bold text-sm"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                        <button
                            onClick={() => applyFilters()}
                            className="bg-black text-white px-10 font-black uppercase tracking-widest text-xs hover:bg-zinc-900 transition-colors"
                        >
                            Suche
                        </button>
                    </div>

                    {/* Filter Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-10">
                        {[
                            { label: "Mindestpreis (EUR)", value: minPrice, setter: setMinPrice, placeholder: "z.B. 500" },
                            { label: "Maximalpreis (EUR)", value: maxPrice, setter: setMaxPrice, placeholder: "z.B. 2500" },
                            { label: "Min. Fläche (m2)", value: minSize, setter: setMinSize, placeholder: "z.B. 40" },
                            { label: "Max. Fläche (m2)", value: maxSize, setter: setMaxSize, placeholder: "z.B. 150" },
                            { label: "Min. Zimmer", value: minRooms, setter: setMinRooms, placeholder: "z.B. 2" },
                            { label: "Min. Bäder", value: minBathrooms, setter: setMinBathrooms, placeholder: "z.B. 1" },
                        ].map((field, idx) => (
                            <div key={idx} className="space-y-3 group">
                                <label className="text-[10px] font-black text-zinc-300 uppercase tracking-[0.2em] pl-1 group-focus-within:text-black transition-colors">
                                    {field.label}
                                </label>
                                <input
                                    type="number"
                                    placeholder={field.placeholder}
                                    className="w-full px-6 py-4 bg-zinc-50/50 border border-zinc-50 rounded-2xl outline-none focus:border-black/10 focus:bg-white focus:ring-4 focus:ring-black/[0.02] transition-all text-black font-bold text-sm placeholder:text-zinc-200 placeholder:font-medium"
                                    value={field.value}
                                    onChange={(e) => field.setter(e.target.value)}
                                />
                            </div>
                        ))}
                    </div>

                    {/* Footer Buttons */}
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-8 pt-10 border-t border-zinc-50">
                        <div className="flex gap-4 w-full sm:w-auto">
                            <button
                                type="button"
                                onClick={resetFilters}
                                className="button-primary px-10 py-5 text-xs font-black uppercase tracking-widest border-none opacity-40 hover:opacity-100"
                            >
                                Zurücksetzen
                            </button>
                        </div>

                        <p className="text-zinc-400 text-[10px] font-black uppercase tracking-widest bg-zinc-50 px-6 py-3 rounded-full border border-zinc-100/50">
                            Angezeigt: <span className="text-black">{currentCount}</span> von <span className="text-black">{totalCount}</span> Immobilien
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
