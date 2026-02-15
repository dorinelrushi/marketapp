
"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

const CATEGORIES = ["All", "Apartment", "House", "Villa", "Hotel"];

export default function FilterSidebar() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [category, setCategory] = useState(searchParams.get("category") || "All");
    const [minPrice, setMinPrice] = useState(searchParams.get("minPrice") || "");
    const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") || "");
    const [bedrooms, setBedrooms] = useState(searchParams.get("bedrooms") || "");

    const applyFilters = () => {
        const params = new URLSearchParams(searchParams.toString());

        if (category && category !== "All") params.set("category", category);
        else params.delete("category");

        if (minPrice) params.set("minPrice", minPrice);
        else params.delete("minPrice");

        if (maxPrice) params.set("maxPrice", maxPrice);
        else params.delete("maxPrice");

        if (bedrooms) params.set("bedrooms", bedrooms);
        else params.delete("bedrooms");

        params.set("page", "1");
        router.push(`/properties?${params.toString()}`);
    };

    const clearFilters = () => {
        setCategory("All");
        setMinPrice("");
        setMaxPrice("");
        setBedrooms("");
        router.push("/properties");
    };

    return (
        <div className="w-full md:w-64 space-y-6 bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
            <div>
                <h3 className="font-semibold mb-3 text-black">Category</h3>
                <div className="space-y-2">
                    {CATEGORIES.map((cat) => (
                        <label key={cat} className="flex items-center space-x-2 cursor-pointer">
                            <input
                                type="radio"
                                name="category"
                                value={cat}
                                checked={category === cat}
                                onChange={(e) => setCategory(e.target.value)}
                                className="text-black focus:ring-black"
                            />
                            <span className="text-sm text-gray-800">{cat}</span>
                        </label>
                    ))}
                </div>
            </div>

            <div>
                <h3 className="font-semibold mb-3 text-black">Price Range</h3>
                <div className="flex gap-2">
                    <input
                        type="number"
                        placeholder="Min"
                        className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm text-black"
                        value={minPrice}
                        onChange={(e) => setMinPrice(e.target.value)}
                    />
                    <input
                        type="number"
                        placeholder="Max"
                        className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm text-black"
                        value={maxPrice}
                        onChange={(e) => setMaxPrice(e.target.value)}
                    />
                </div>
            </div>

            <div>
                <h3 className="font-semibold mb-3 text-black">Bedrooms</h3>
                <select
                    value={bedrooms}
                    onChange={(e) => setBedrooms(e.target.value)}
                    className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm text-black"
                >
                    <option value="">Any</option>
                    <option value="1">1+</option>
                    <option value="2">2+</option>
                    <option value="3">3+</option>
                    <option value="4">4+</option>
                </select>
            </div>

            <div className="pt-4 flex flex-col gap-2">
                <button
                    onClick={applyFilters}
                    className="w-full bg-black text-white py-2 rounded-full text-sm font-medium hover:bg-gray-800 transition-colors"
                >
                    Apply Filters
                </button>
                <button
                    onClick={clearFilters}
                    className="w-full bg-gray-100 text-gray-800 py-2 rounded-full text-sm font-medium hover:bg-gray-200 transition-colors"
                >
                    Reset Check
                </button>
            </div>
        </div>
    );
}
