
"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState } from "react";
import { useDebouncedCallback } from "use-debounce";

export default function SearchBar() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [term, setTerm] = useState(searchParams.get("search") || "");
    const [city, setCity] = useState(searchParams.get("city") || "");

    const handleSearch = useDebouncedCallback((term: string, city: string) => {
        const params = new URLSearchParams(searchParams.toString());
        if (term) {
            params.set("search", term);
        } else {
            params.delete("search");
        }
        if (city) {
            params.set("city", city);
        } else {
            params.delete("city");
        }
        params.set("page", "1"); // Reset pagination
        router.push(`/properties?${params.toString()}`);
    }, 500);

    return (
        <div className="flex gap-4 w-full md:w-auto">
            <input
                type="text"
                placeholder="Search properties..."
                className="w-full md:w-64 rounded-full border border-gray-200 bg-white px-4 py-2 text-sm outline-none focus:border-black focus:ring-1 focus:ring-black"
                value={term}
                onChange={(e) => {
                    setTerm(e.target.value);
                    handleSearch(e.target.value, city);
                }}
            />
            <input
                type="text"
                placeholder="Filter by City..."
                className="w-full md:w-48 rounded-full border border-gray-200 bg-white px-4 py-2 text-sm outline-none focus:border-black focus:ring-1 focus:ring-black"
                value={city}
                onChange={(e) => {
                    setCity(e.target.value);
                    handleSearch(term, e.target.value);
                }}
            />
        </div>
    );
}
