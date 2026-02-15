"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function EditPropertyPage({ params }: { params: { id: string } }) {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        title: "",
        pricePerNight: "",
        city: "",
        address: "",
        bedrooms: "",
        bathrooms: "",
        sizeM2: "",
        description: "",
        category: "apartment",
        amenities: [] as string[],
        mainImage: "",
        galleryImages: ["", "", "", "", "", ""] as string[],
    });

    useEffect(() => {
        fetchProperty();
    }, []);

    const fetchProperty = async () => {
        try {
            const res = await fetch(`/api/properties/${params.id}`);
            const data = await res.json();

            if (!res.ok) throw new Error(data.error);

            const property = data.property;
            setFormData({
                title: property.title || "",
                pricePerNight: property.pricePerNight?.toString() || "",
                city: property.city || "",
                address: property.address || "",
                bedrooms: property.bedrooms?.toString() || "",
                bathrooms: property.bathrooms?.toString() || "",
                sizeM2: property.sizeM2?.toString() || "",
                description: property.description || "",
                category: property.category || "apartment",
                amenities: property.amenities || [],
                mainImage: property.mainImage || "",
                galleryImages: [
                    ...(property.galleryImages || []),
                    ...Array(6 - (property.galleryImages?.length || 0)).fill("")
                ].slice(0, 6),
            });
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, index: number = -1) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.size > 1024 * 1024) {
            alert("Image must be less than 1MB");
            return;
        }

        const reader = new FileReader();
        reader.onloadend = () => {
            const base64 = reader.result as string;
            if (index === -1) {
                setFormData({ ...formData, mainImage: base64 });
            } else {
                const newGallery = [...formData.galleryImages];
                newGallery[index] = base64;
                setFormData({ ...formData, galleryImages: newGallery });
            }
        };
        reader.readAsDataURL(file);
    };

    const removeGalleryImage = (index: number) => {
        const newGallery = [...formData.galleryImages];
        newGallery[index] = "";
        setFormData({ ...formData, galleryImages: newGallery });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setError(null);

        const token = localStorage.getItem("booknest_token");
        if (!token) {
            router.push("/login");
            return;
        }

        try {
            const payload = {
                ...formData,
                pricePerNight: parseFloat(formData.pricePerNight),
                bedrooms: parseInt(formData.bedrooms),
                bathrooms: parseInt(formData.bathrooms),
                sizeM2: parseFloat(formData.sizeM2),
                galleryImages: formData.galleryImages.filter(img => img !== ""),
            };

            const res = await fetch(`/api/properties/${params.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Failed to update property");
            }

            router.push("/dashboard");
        } catch (err: any) {
            setError(err.message);
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-background px-6 py-16 flex items-center justify-center">
                <p className="text-zinc-500">Loading property...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background px-6 py-16">
            <div className="mx-auto w-full max-w-3xl">
                <h1 className="text-3xl font-bold text-zinc-900 mb-8">Edit Property</h1>

                <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-xl border border-zinc-200">
                    <div>
                        <label className="block text-sm font-medium text-zinc-700 mb-1">Title</label>
                        <input
                            type="text"
                            required
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            className="w-full px-3 py-2 border border-zinc-300 rounded-md focus:ring-2 focus:ring-amber-500 focus:outline-none"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-zinc-700 mb-1">Price/Night ($)</label>
                            <input
                                type="number"
                                required
                                step="0.01"
                                value={formData.pricePerNight}
                                onChange={(e) => setFormData({ ...formData, pricePerNight: e.target.value })}
                                className="w-full px-3 py-2 border border-zinc-300 rounded-md focus:ring-2 focus:ring-amber-500 focus:outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-zinc-700 mb-1">City</label>
                            <input
                                type="text"
                                required
                                value={formData.city}
                                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                className="w-full px-3 py-2 border border-zinc-300 rounded-md focus:ring-2 focus:ring-amber-500 focus:outline-none"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-zinc-700 mb-1">Bedrooms</label>
                            <input
                                type="number"
                                required
                                value={formData.bedrooms}
                                onChange={(e) => setFormData({ ...formData, bedrooms: e.target.value })}
                                className="w-full px-3 py-2 border border-zinc-300 rounded-md focus:ring-2 focus:ring-amber-500 focus:outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-zinc-700 mb-1">Bathrooms</label>
                            <input
                                type="number"
                                required
                                value={formData.bathrooms}
                                onChange={(e) => setFormData({ ...formData, bathrooms: e.target.value })}
                                className="w-full px-3 py-2 border border-zinc-300 rounded-md focus:ring-2 focus:ring-amber-500 focus:outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-zinc-700 mb-1">Size (m²)</label>
                            <input
                                type="number"
                                required
                                step="0.01"
                                value={formData.sizeM2}
                                onChange={(e) => setFormData({ ...formData, sizeM2: e.target.value })}
                                className="w-full px-3 py-2 border border-zinc-300 rounded-md focus:ring-2 focus:ring-amber-500 focus:outline-none"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-zinc-700 mb-1">Description</label>
                        <textarea
                            required
                            rows={4}
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            className="w-full px-3 py-2 border border-zinc-300 rounded-md focus:ring-2 focus:ring-amber-500 focus:outline-none"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-zinc-700 mb-2">Main Image</label>
                        {formData.mainImage && (
                            <img src={formData.mainImage} alt="Main" className="mb-2 h-32 w-32 object-cover rounded-md" />
                        )}
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleImageUpload(e)}
                            className="w-full px-3 py-2 border border-zinc-300 rounded-md"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-zinc-700 mb-2">Gallery (up to 6 images)</label>
                        <div className="grid grid-cols-3 gap-4">
                            {formData.galleryImages.map((img, index) => (
                                <div key={index} className="relative">
                                    {img ? (
                                        <div className="relative">
                                            <img src={img} alt={`Gallery ${index + 1}`} className="h-24 w-full object-cover rounded-md" />
                                            <button
                                                type="button"
                                                onClick={() => removeGalleryImage(index)}
                                                className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
                                            >
                                                ×
                                            </button>
                                        </div>
                                    ) : (
                                        <label className="h-24 w-full border-2 border-dashed border-zinc-300 rounded-md flex items-center justify-center cursor-pointer hover:border-amber-500">
                                            <span className="text-zinc-400 text-sm">+</span>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={(e) => handleImageUpload(e, index)}
                                                className="hidden"
                                            />
                                        </label>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {error && (
                        <div className="p-3 bg-red-50 text-red-600 rounded-md text-sm">
                            {error}
                        </div>
                    )}

                    <div className="flex gap-3">
                        <button
                            type="button"
                            onClick={() => router.push("/dashboard")}
                            className="px-4 py-2 bg-zinc-100 text-zinc-900 rounded-md hover:bg-zinc-200"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={saving}
                            className="flex-1 px-4 py-2 bg-zinc-900 text-white rounded-md hover:bg-zinc-800 disabled:opacity-50"
                        >
                            {saving ? "Saving..." : "Save Changes"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
