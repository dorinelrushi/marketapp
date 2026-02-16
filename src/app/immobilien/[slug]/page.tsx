import { connectToDatabase } from "@/lib/db";
import { Property } from "@/models/Property";
import { User } from "@/models/User"; // Import User model to register schema before populate
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import PropertyGallery from "@/components/properties/PropertyGallery";
import OwnerInfoSection from "@/components/properties/OwnerInfoSection";

interface PageProps {
    params: Promise<{ slug: string }>;
}

export default async function PropertyDetailsPage({ params }: PageProps) {
    try {
        const { slug } = await params;

        // Validate slug format
        if (!slug || typeof slug !== 'string' || slug.trim() === '') {
            notFound();
        }

        await connectToDatabase();

        const property = await Property.findOne({ slug })
            .populate("createdBy", "fullName email phone")
            .lean();

        if (!property) {
            notFound();
        }

        // Serialize the entire property object to plain JavaScript to avoid MongoDB-specific types
        const serializedProperty = {
            _id: property._id.toString(),
            title: property.title,
            slug: property.slug,
            pricePerNight: property.pricePerNight,
            city: property.city,
            address: property.address || null,
            bedrooms: property.bedrooms,
            bathrooms: property.bathrooms,
            sizeM2: property.sizeM2,
            description: property.description,
            category: property.category,
            mainImage: property.mainImage || null,
            galleryImages: property.galleryImages || [],
            amenities: property.amenities || [],
            createdAt: property.createdAt ? new Date(property.createdAt).toISOString() : null,
            updatedAt: property.updatedAt ? new Date(property.updatedAt).toISOString() : null,
        };



        const allImages = serializedProperty.mainImage
            ? [serializedProperty.mainImage, ...serializedProperty.galleryImages]
            : serializedProperty.galleryImages;

        return (
            <div className="min-h-screen bg-white">
                {/* Hero Image Section */}
                <div className="relative h-[60vh] w-full bg-zinc-950 overflow-hidden">
                    {serializedProperty.mainImage ? (
                        <Image
                            src={serializedProperty.mainImage}
                            alt={serializedProperty.title}
                            fill
                            className="object-cover opacity-80"
                            priority
                        />
                    ) : (
                        <div className="flex h-full w-full items-center justify-center text-zinc-400 font-black uppercase tracking-widest text-xs">
                            Kein Bild verfügbar
                        </div>
                    )}
                    <div className="absolute top-6 left-6 z-20">
                        <Link
                            href="/immobilien"
                            className="inline-flex items-center px-6 py-2.5 bg-white/10 hover:bg-white backdrop-blur-md rounded-full text-white hover:text-black text-[10px] font-black uppercase tracking-widest transition-all border border-white/20 shadow-2xl"
                        >
                            <svg className="w-3.5 h-3.5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            Immobilien
                        </Link>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/10 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12 text-white container mx-auto z-10">
                        <div className="max-w-4xl">
                            <span className="inline-block px-3 py-1 mb-6 text-[9px] font-black uppercase tracking-[0.2em] bg-white text-black rounded-full shadow-2xl">
                                {serializedProperty.category}
                            </span>
                            <h1 className="text-3xl md:text-5xl lg:text-6xl font-display font-black mb-4 tracking-tighter leading-[1.1] uppercase">
                                {serializedProperty.title}
                            </h1>
                            <div className="text-base md:text-lg text-zinc-300 flex items-center gap-3 font-bold">
                                <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center">
                                    <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                </div>
                                {serializedProperty.city} {serializedProperty.address && <span className="opacity-40">• {serializedProperty.address}</span>}
                            </div>
                        </div>
                    </div>
                </div>

                <main className="container mx-auto px-6 py-12 lg:py-20 lg:px-12">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16">
                        {/* Left Column: Details */}
                        <div className="lg:col-span-2 space-y-16 lg:space-y-24">

                            {/* Slide Gallery */}
                            {allImages.length > 0 && (
                                <PropertyGallery images={allImages} />
                            )}

                            {/* Key Features */}
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-8 py-10 border-y border-zinc-50">
                                {[
                                    { label: "Schlafzimmer", value: property.bedrooms, icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" },
                                    { label: "Fläche", value: `${property.sizeM2} m²`, icon: "M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" },
                                    { label: "Badezimmer", value: property.bathrooms, icon: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" }
                                ].map((feature, i) => (
                                    <div key={i} className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-zinc-50 rounded-2xl flex items-center justify-center text-black border border-zinc-100 shrink-0">
                                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={feature.icon} />
                                            </svg>
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-[9px] text-black uppercase tracking-[0.2em] mb-0.5 truncate">{feature.label}</p>
                                            <p className="text-lg font-black text-black">{feature.value}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Description */}
                            <div>
                                <h2 className="text-xl md:text-2xl font-black mb-6 text-black uppercase tracking-tight">Objektbeschreibung</h2>
                                <div className="text-zinc-500 leading-relaxed text-base md:text-lg font-medium whitespace-pre-line">
                                    {serializedProperty.description}
                                </div>
                            </div>

                            {/* Amenities */}
                            {serializedProperty.amenities && serializedProperty.amenities.length > 0 && (
                                <div>
                                    <h2 className="text-xl md:text-2xl font-black mb-8 text-black uppercase tracking-tight">Ausstattung</h2>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        {serializedProperty.amenities.map((amenity, idx) => (
                                            <div key={idx} className="flex items-center gap-4 p-5 rounded-2xl border border-zinc-50 bg-zinc-50/20 group hover:bg-zinc-50 transition-all">
                                                <div className="w-2 h-2 rounded-full bg-zinc-200 group-hover:bg-black transition-colors" />
                                                <span className="text-zinc-600 group-hover:text-black font-black uppercase text-[10px] tracking-widest">{amenity}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Right Column: Booking Card */}
                        <div className="lg:col-span-1">
                            <div className="sticky top-28 p-6 md:p-8 lg:p-10 rounded-[40px] border border-zinc-50 bg-white shadow-2xl shadow-black/5">
                                <OwnerInfoSection
                                    propertyId={serializedProperty._id}
                                    pricePerNight={serializedProperty.pricePerNight}
                                    propertyTitle={serializedProperty.title}
                                />
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        );
    } catch (error) {
        // Log error for debugging but show 404 to user
        console.error("Error loading property:", error);
        notFound();
    }
}
