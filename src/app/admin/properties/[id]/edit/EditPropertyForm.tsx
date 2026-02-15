
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { getAuthToken } from "@/lib/auth-client";

interface Property {
    _id: string;
    title: string;
    description: string;
    pricePerNight: number;
    city: string;
    address?: string;
    bedrooms: number;
    bathrooms: number;
    sizeM2: number;
    category: string;
    amenities: string[];
    mainImage: string;
    galleryImages: string[];
}

export default function EditPropertyForm({ property }: { property: Property }) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [amenities, setAmenities] = useState<string[]>(property.amenities || []);
    const [currentAmenity, setCurrentAmenity] = useState("");
    const [mainImageFile, setMainImageFile] = useState<File | null>(null);
    const [galleryFiles, setGalleryFiles] = useState<FileList | null>(null);

    const handleAddAmenity = () => {
        if (currentAmenity.trim()) {
            setAmenities([...amenities, currentAmenity.trim()]);
            setCurrentAmenity("");
        }
    };

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setLoading(true);
        setError(null);

        const formData = new FormData(event.currentTarget);
        const token = getAuthToken();

        if (!token) {
            setError("Sie müssen angemeldet sein.");
            setLoading(false);
            return;
        }

        try {
            // Upload Main Image ONLY if new one selected
            let mainImageUrl = property.mainImage;
            if (mainImageFile) {
                const uploadData = new FormData();
                uploadData.append("file", mainImageFile);
                const uploadRes = await fetch("/api/upload", {
                    method: "POST",
                    body: uploadData,
                });
                if (!uploadRes.ok) throw new Error("Fehler beim Hochladen des Hauptbildes");
                const uploadJson = await uploadRes.json();
                mainImageUrl = uploadJson.urls[0];
            }

            // Upload Gallery Images - append to existing or replace? Usually simpler to append.
            // If user wants to delete, add delete buttons. For simplicity: Append new ones.
            let galleryImageUrls = [...(property.galleryImages || [])];
            if (galleryFiles && galleryFiles.length > 0) {
                const uploadData = new FormData();
                for (let i = 0; i < galleryFiles.length; i++) {
                    uploadData.append("file", galleryFiles[i]);
                }
                const uploadRes = await fetch("/api/upload", {
                    method: "POST",
                    body: uploadData,
                });
                if (!uploadRes.ok) throw new Error("Fehler beim Hochladen der Galeriebilder");
                const uploadJson = await uploadRes.json();
                galleryImageUrls = [...galleryImageUrls, ...uploadJson.urls];
            }

            // Using limit of 6 as per schema/request (modify logic to enforce max if strictly required)
            // User requested "maybe 6 photos", schema has max(6).
            if (galleryImageUrls.length > 6) {
                galleryImageUrls = galleryImageUrls.slice(0, 6); // Truncate to first 6
            }

            const data = {
                title: formData.get("title"),
                pricePerNight: Number(formData.get("pricePerNight")),
                city: formData.get("city"),
                address: formData.get("address"),
                bedrooms: Number(formData.get("bedrooms")),
                bathrooms: Number(formData.get("bathrooms")),
                sizeM2: Number(formData.get("sizeM2")),
                description: formData.get("description"),
                category: formData.get("category"),
                mainImage: mainImageUrl,
                galleryImages: galleryImageUrls,
                amenities: amenities,
            };

            const res = await fetch(`/api/properties/${property._id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(data),
            });

            const json = await res.json();

            if (!res.ok) {
                throw new Error(json.error || "Fehler beim Aktualisieren der Immobilie");
            }

            router.push("/admin/properties");
            router.refresh();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-6 sm:grid-cols-2">
                <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-black">Titel</label>
                    <input name="title" defaultValue={property.title} required className="mt-1 block w-full rounded-md border border-zinc-300 px-3 py-2 text-black focus:border-amber-500 focus:ring-amber-500" />
                </div>

                <div>
                    <label className="block text-sm font-medium text-black">Kategorie</label>
                    <select name="category" defaultValue={property.category} required className="mt-1 block w-full rounded-md border border-zinc-300 px-3 py-2 text-black focus:border-amber-500 focus:ring-amber-500">
                        <option value="apartment">Apartment</option>
                        <option value="house">Haus</option>
                        <option value="hotel">Hotel</option>
                        <option value="villa">Villa</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-black">Stadt</label>
                    <input name="city" defaultValue={property.city} required className="mt-1 block w-full rounded-md border border-zinc-300 px-3 py-2 text-black focus:border-amber-500 focus:ring-amber-500" />
                </div>

                <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-black">Adresse (Optional)</label>
                    <input name="address" defaultValue={property.address} className="mt-1 block w-full rounded-md border border-zinc-300 px-3 py-2 text-black focus:border-amber-500 focus:ring-amber-500" />
                </div>

                <div>
                    <label className="block text-sm font-medium text-black">Preis pro Nacht (€)</label>
                    <input name="pricePerNight" defaultValue={property.pricePerNight} type="number" step="0.01" required className="mt-1 block w-full rounded-md border border-zinc-300 px-3 py-2 text-black focus:border-amber-500 focus:ring-amber-500" />
                </div>

                <div>
                    <label className="block text-sm font-medium text-black">Größe (m²)</label>
                    <input name="sizeM2" defaultValue={property.sizeM2} type="number" required className="mt-1 block w-full rounded-md border border-zinc-300 px-3 py-2 text-black focus:border-amber-500 focus:ring-amber-500" />
                </div>

                <div>
                    <label className="block text-sm font-medium text-black">Schlafzimmer</label>
                    <input name="bedrooms" defaultValue={property.bedrooms} type="number" required className="mt-1 block w-full rounded-md border border-zinc-300 px-3 py-2 text-black focus:border-amber-500 focus:ring-amber-500" />
                </div>

                <div>
                    <label className="block text-sm font-medium text-black">Badezimmer</label>
                    <input name="bathrooms" defaultValue={property.bathrooms} type="number" required className="mt-1 block w-full rounded-md border border-zinc-300 px-3 py-2 text-black focus:border-amber-500 focus:ring-amber-500" />
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-black">Beschreibung</label>
                <textarea name="description" defaultValue={property.description} rows={4} required className="mt-1 block w-full rounded-md border border-zinc-300 px-3 py-2 text-black focus:border-amber-500 focus:ring-amber-500" />
            </div>

            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-black">Aktuelles Hauptbild (Primärfoto)</label>
                    <div className="mt-2 w-32 h-20 relative rounded-md overflow-hidden bg-zinc-100">
                        <img src={property.mainImage} alt="Main" className="object-cover w-full h-full" />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-black">Hauptbild (Primärfoto) ersetzen</label>
                    <input
                        id="mainImageInput"
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={(e) => setMainImageFile(e.target.files?.[0] || null)}
                        className="mt-1 block w-full text-sm text-zinc-500
                        file:mr-4 file:py-2 file:px-4
                        file:rounded-full file:border-0
                        file:text-sm file:font-semibold
                        file:bg-amber-50 file:text-amber-700
                        hover:file:bg-amber-100"
                    />
                    <p className="mt-1 text-xs text-zinc-500">Wenn Sie mehrere wählen, wird das erste als Hauptbild verwendet.</p>
                </div>
            </div>

            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-black">Aktuelle Galerie ({property.galleryImages?.length || 0})</label>
                    <div className="mt-2 flex gap-2 flex-wrap">
                        {property.galleryImages?.map((img, idx) => (
                            <div key={idx} className="w-20 h-16 relative rounded-md overflow-hidden bg-zinc-100 border border-zinc-200">
                                <img src={img} alt={`Gallery ${idx}`} className="object-cover w-full h-full" />
                            </div>
                        ))}
                        {(!property.galleryImages || property.galleryImages.length === 0) && <span className="text-zinc-500 text-sm">Keine Galeriebilder.</span>}
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-black">Galeriebilder hinzufügen (Max. insgesamt 6)</label>
                    <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={(e) => setGalleryFiles(e.target.files)}
                        className="mt-1 block w-full text-sm text-zinc-500
                        file:mr-4 file:py-2 file:px-4
                        file:rounded-full file:border-0
                        file:text-sm file:font-semibold
                        file:bg-amber-50 file:text-amber-700
                        hover:file:bg-amber-100"
                    />
                    <p className="mt-1 text-xs text-zinc-500">Neue Bilder werden angehängt. Die Gesamtzahl wird auf 6 begrenzt.</p>
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-black">Ausstattung</label>
                <div className="flex gap-2 mt-1">
                    <input
                        value={currentAmenity}
                        onChange={(e) => setCurrentAmenity(e.target.value)}
                        className="block flex-1 rounded-md border border-zinc-300 px-3 py-2 text-black focus:border-amber-500 focus:ring-amber-500"
                        placeholder="z.B. WLAN, Pool"
                    />
                    <button type="button" onClick={handleAddAmenity} className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800">
                        Hinzufügen
                    </button>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                    {amenities.map((amenity, index) => (
                        <span key={index} className="inline-flex items-center rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-800">
                            {amenity}
                            <button type="button" onClick={() => setAmenities(amenities.filter((_, i) => i !== index))} className="ml-1 text-amber-600 hover:text-amber-900">×</button>
                        </span>
                    ))}
                </div>
            </div>

            {error && (
                <div className="rounded-md bg-red-50 p-3 text-sm text-red-600 border border-red-200">
                    {error}
                </div>
            )}

            <div className="flex justify-end pt-4 gap-4">
                <button
                    type="button"
                    onClick={() => router.back()}
                    className="px-6 py-3 text-sm font-medium text-zinc-600 hover:text-black hover:bg-zinc-100 rounded-full"
                >
                    Abbrechen
                </button>
                <button
                    type="submit"
                    disabled={loading}
                    className="flex justify-center rounded-full bg-black px-8 py-3 text-sm font-bold text-white shadow-sm hover:bg-zinc-800 focus:outline-none disabled:opacity-50 transition-colors"
                >
                    {loading ? "Wird aktualisiert..." : "Immobilie aktualisieren"}
                </button>
            </div>
        </form>
    );
}
