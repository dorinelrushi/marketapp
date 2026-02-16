
"use client";

import { useState } from "react";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

export default function Hero() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [search, setSearch] = useState(searchParams.get("search") || "");

    // Sync local state with URL param if it changes externally
    useEffect(() => {
        setSearch(searchParams.get("search") || "");
    }, [searchParams]);

    // Debounce effect for automatic URL update
    useEffect(() => {
        const timer = setTimeout(() => {
            const params = new URLSearchParams(searchParams.toString());
            const currentSearch = params.get("search") || "";

            // Only update URL if the search value has actually changed
            if (search !== currentSearch) {
                if (search) {
                    params.set("search", search);
                } else {
                    params.delete("search");
                }
                router.replace(`/?${params.toString()}`, { scroll: false });
            }
        }, 500);

        return () => clearTimeout(timer);
    }, [search, router, searchParams]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();

        // Ensure URL is updated immediately on submit
        const params = new URLSearchParams(searchParams.toString());
        if (search) {
            params.set("search", search);
        } else {
            params.delete("search");
        }
        router.replace(`/?${params.toString()}`, { scroll: false });

        // Scroll to results
        const element = document.getElementById("available-properties");
        if (element) {
            element.scrollIntoView({ behavior: "smooth" });
        }
    };

    const handleCityClick = (city: string) => {
        setSearch(city);
        // We let the useEffect handle the URL update, or we can force it here if we want immediate scroll
        // For better UX, let's scroll too:
        setTimeout(() => {
            const element = document.getElementById("available-properties");
            if (element) {
                element.scrollIntoView({ behavior: "smooth" });
            }
        }, 100);
    };

    return (
        <section className="relative pt-28 pb-12 px-6 md:pt-40 md:pb-32 overflow-hidden bg-white">
            <div className="container mx-auto max-w-6xl text-center relative z-10">
                <div className="max-w-4xl mx-auto mb-16">
                    <span className="inline-block px-5 py-2 mb-8 text-[10px] font-black uppercase tracking-[0.3em] bg-black text-white rounded-full animate-bounce">
                        NEU IN DEUTSCHLAND
                    </span>
                    <h1 className="text-4xl md:text-8xl font-display font-black text-black mb-6 md:mb-8 leading-[0.9] uppercase tracking-tighter">
                        Finden Sie Ihr <br />
                        <span className="text-zinc-700">nächstes</span> Zuhause
                    </h1>
                    <p className="text-lg md:text-2xl text-zinc-700 font-medium max-w-2xl mx-auto leading-relaxed">
                        Buchen Sie die besten Wohnungen und Häuser in Deutschland mit Leichtigkeit und Sicherheit.
                    </p>
                </div>

                <div className="max-w-3xl mx-auto">
                    <form onSubmit={handleSearch} className="flex flex-col md:flex-row items-center gap-3 p-3 bg-white rounded-[32px] md:rounded-full border border-zinc-100 shadow-[20px_40px_80px_-15px_rgba(0,0,0,0.1)] transition-all duration-500">
                        <div className="flex-1 w-full flex items-center px-4 md:px-6">
                            <input
                                type="text"
                                placeholder="Suche nach Stadt, Titel oder Adresse..."
                                className="flex-1 py-4 md:py-6 outline-none text-black placeholder:text-zinc-400 bg-transparent font-bold text-sm"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                        <button
                            type="submit"
                            className="bg-black text-white py-[20px] rounded-[15px] px-12 font-black uppercase tracking-[0.2em] text-xs hover:bg-zinc-900 transition-colors w-full md:w-auto"
                        >
                            Suche
                        </button>
                    </form>

                    <div className="flex flex-wrap justify-center gap-8 mt-12">
                        {['Berlin', 'München', 'Hamburg', 'Frankfurt', 'Düsseldorf', 'Köln'].map((city) => (
                            <button
                                key={city}
                                onClick={() => handleCityClick(city)}
                                className="text-[11px] font-black uppercase tracking-widest text-zinc-700 hover:text-black transition-colors"
                            >
                                {city}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
