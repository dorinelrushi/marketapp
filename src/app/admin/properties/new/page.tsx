
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { getAuthToken } from "@/lib/auth-client";

export default function NewPropertyPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [amenities, setAmenities] = useState<string[]>([]);
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
            // Upload Main and Gallery Images
            let mainImageUrl = "";
            let galleryImageUrls: string[] = [];

            if (mainImageFile) {
                const uploadData = new FormData();
                // If user selected multiple in the main input, handle them
                const mainFiles = (event.currentTarget.elements.namedItem("mainImageInput") as HTMLInputElement).files;
                if (mainFiles && mainFiles.length > 0) {
                    console.log(`Uploading ${mainFiles.length} primary photo(s)...`);
                    for (let i = 0; i < mainFiles.length; i++) {
                        uploadData.append("file", mainFiles[i]);
                    }
                } else {
                    uploadData.append("file", mainImageFile);
                }

                const uploadRes = await fetch("/api/upload", {
                    method: "POST",
                    body: uploadData,
                });

                if (!uploadRes.ok) {
                    const errorText = await uploadRes.text();
                    console.error("Upload error:", errorText);
                    throw new Error("Fehler beim Hochladen der Hauptbilder");
                }

                const uploadJson = await uploadRes.json();
                console.log("Upload response:", uploadJson);

                if (!uploadJson.urls || uploadJson.urls.length === 0) {
                    throw new Error("No URLs returned from upload");
                }

                mainImageUrl = uploadJson.urls[0];
                console.log("Main image URL:", mainImageUrl);

                // If more than one main photo, add others to gallery
                if (uploadJson.urls.length > 1) {
                    galleryImageUrls = [...uploadJson.urls.slice(1)];
                    console.log(`Added ${galleryImageUrls.length} extra primary photos to gallery`);
                }
            } else {
                alert("Bitte wählen Sie mindestens ein Hauptbild (Primärfoto) aus.");
                setLoading(false);
                return;
            }

            if (galleryFiles && galleryFiles.length > 0) {
                console.log(`Uploading ${galleryFiles.length} gallery image(s)...`);
                const uploadData = new FormData();
                for (let i = 0; i < galleryFiles.length; i++) {
                    uploadData.append("file", galleryFiles[i]);
                }
                const uploadRes = await fetch("/api/upload", {
                    method: "POST",
                    body: uploadData,
                });
                if (!uploadRes.ok) {
                    const errorText = await uploadRes.text();
                    console.error("Gallery upload error:", errorText);
                    throw new Error("Fehler beim Hochladen der Galeriebilder");
                }
                const uploadJson = await uploadRes.json();
                console.log("Gallery upload response:", uploadJson);
                galleryImageUrls = [...galleryImageUrls, ...uploadJson.urls];
            }

            // Limit to 6 gallery images as per schema/logic preference
            if (galleryImageUrls.length > 6) {
                console.log(`Limiting gallery from ${galleryImageUrls.length} to 6 images`);
                galleryImageUrls = galleryImageUrls.slice(0, 6);
            }

            console.log("Final mainImage:", mainImageUrl);
            console.log("Final galleryImages:", galleryImageUrls);

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

            console.log("Sending property data:", data);

            const res = await fetch("/api/properties", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(data),
            });

            const json = await res.json();

            if (!res.ok) {
                throw new Error(json.error || "Fehler beim Erstellen der Immobilie");
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
        <div className="max-w-2xl mx-auto space-y-8 p-6 bg-white rounded-xl shadow-lg border border-zinc-200">
            <div>
                <h1 className="font-display text-3xl font-bold text-black">Neue Immobilie hinzufügen</h1>
                <p className="text-zinc-600">Erstellen Sie ein neues Angebot für Kunden zur Buchung.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid gap-6 sm:grid-cols-2">
                    <div className="sm:col-span-2">
                        <label className="block text-sm font-medium text-black">Titel</label>
                        <input name="title" required className="mt-1 block w-full rounded-md border border-zinc-300 px-3 py-2 text-black focus:border-amber-500 focus:ring-amber-500" />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-black">Kategorie</label>
                        <select name="category" required className="mt-1 block w-full rounded-md border border-zinc-300 px-3 py-2 text-black focus:border-amber-500 focus:ring-amber-500">
                            <option value="apartment">Apartment</option>
                            <option value="house">Haus</option>
                            <option value="hotel">Hotel</option>
                            <option value="villa">Villa</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-black">Stadt</label>
                        <input name="city" required className="mt-1 block w-full rounded-md border border-zinc-300 px-3 py-2 text-black focus:border-amber-500 focus:ring-amber-500" />
                    </div>

                    <div className="sm:col-span-2">
                        <label className="block text-sm font-medium text-black">Adresse (Optional)</label>
                        <input name="address" className="mt-1 block w-full rounded-md border border-zinc-300 px-3 py-2 text-black focus:border-amber-500 focus:ring-amber-500" />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-black">Preis pro Nacht (€)</label>
                        <input name="pricePerNight" type="number" step="0.01" required className="mt-1 block w-full rounded-md border border-zinc-300 px-3 py-2 text-black focus:border-amber-500 focus:ring-amber-500" />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-black">Größe (m²)</label>
                        <input name="sizeM2" type="number" required className="mt-1 block w-full rounded-md border border-zinc-300 px-3 py-2 text-black focus:border-amber-500 focus:ring-amber-500" />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-black">Schlafzimmer</label>
                        <input name="bedrooms" type="number" required className="mt-1 block w-full rounded-md border border-zinc-300 px-3 py-2 text-black focus:border-amber-500 focus:ring-amber-500" />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-black">Badezimmer</label>
                        <input name="bathrooms" type="number" required className="mt-1 block w-full rounded-md border border-zinc-300 px-3 py-2 text-black focus:border-amber-500 focus:ring-amber-500" />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-black">Beschreibung</label>
                    <textarea name="description" rows={4} required className="mt-1 block w-full rounded-md border border-zinc-300 px-3 py-2 text-black focus:border-amber-500 focus:ring-amber-500" />
                </div>

                <div>
                    <label className="block text-sm font-medium text-black">Hauptbilder (Primärfotos, min. 1)</label>
                    <input
                        id="mainImageInput"
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={(e) => setMainImageFile(e.target.files?.[0] || null)}
                        required
                        className="mt-1 block w-full text-sm text-zinc-500
                        file:mr-4 file:py-2 file:px-4
                        file:rounded-full file:border-0
                        file:text-sm file:font-semibold
                        file:bg-amber-50 file:text-amber-700
                        hover:file:bg-amber-100"
                    />
                    <p className="mt-1 text-xs text-zinc-500">Das erste Bild wird das Titelbild. Weitere werden der Galerie hinzugefügt.</p>
                </div>

                <div>
                    <label className="block text-sm font-medium text-black">Galeriebilder (Optional, Max. 6)</label>
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
                    <p className="mt-1 text-xs text-zinc-500">Halten Sie Strg/Cmd gedrückt, um mehrere Dateien auszuwählen.</p>
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

                <div className="flex justify-end pt-4">
                    <button
                        type="submit"
                        disabled={loading}
                        className="flex justify-center rounded-full bg-black px-8 py-3 text-sm font-bold text-white shadow-sm hover:bg-zinc-800 focus:outline-none disabled:opacity-50 transition-colors"
                    >
                        {loading ? "Wird erstellt..." : "Immobilie erstellen"}
                    </button>
                </div>
            </form>
        </div>
    );
}
