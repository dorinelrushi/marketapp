
import { connectToDatabase } from "@/lib/db";
import { Property } from "@/models/Property";
import { User } from "@/models/User";
import { notFound } from "next/navigation";
import ReservationForm from "@/components/ReservationForm";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";

// Force dynamic because we need to check auth headers/cookies for personalization 
// although for just checking "if logged in" we can do it client side?
// The prompt says: "If user is NOT logged in: hide form... If user IS logged in: show form"
// We can pass user info to client component if available server side.



// Force dynamic rendering to ensure we always fetch the latest user status (paid/unpaid)
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

import { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    await connectToDatabase();
    const property = await Property.findOne({ slug });

    if (!property) {
        return {
            title: "Property Not Found | BookNest",
        };
    }

    return {
        title: `${property.title} | BookNest`,
        description: property.description.substring(0, 160),
        openGraph: {
            images: [property.mainImage],
        },
    };
}

export default async function PropertyDetailsPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    await connectToDatabase();

    const property = await Property.findOne({ slug });
    if (!property) return notFound();

    // Check login status server-side
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    let user = null;

    if (token) {
        try {
            const decoded = verifyToken(token);
            user = await User.findById(decoded.sub).select("fullName email phone hasPaidOneTimeFee");
            console.log(`User ${user?.email} paid status:`, user?.hasPaidOneTimeFee);
        } catch (e) {
            // invalid token
        }
    }

    // Serialize user for client component
    const userJson = user ? {
        _id: user._id.toString(),
        fullName: user.fullName,
        email: user.email,
        phone: user.phone
    } : null;

    return (
        <div className="min-h-screen bg-background text-foreground pb-20">
            {/* Hero Image */}
            <div className="h-[60vh] relative w-full overflow-hidden">
                <img
                    src={property.mainImage}
                    alt={property.title}
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 to-transparent opacity-80" />
                <div className="absolute bottom-0 left-0 p-8 max-w-7xl mx-auto w-full">
                    <h1 className="font-display text-4xl md:text-6xl font-bold">{property.title}</h1>
                    <p className="text-xl text-zinc-300 mt-2 flex items-center gap-2">
                        <span className="inline-block w-4 h-4 bg-amber-500 rounded-full" />
                        {property.city} {property.address && `• ${property.address}`}
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 mt-12 grid gap-12 lg:grid-cols-3">
                {/* Left Column: Details */}
                <div className="lg:col-span-2 space-y-12">
                    {/* Gallery Thumbnails (Placeholder) */}
                    {property.galleryImages && property.galleryImages.length > 0 && (
                        <div className="grid grid-cols-4 gap-4">
                            {property.galleryImages.map((img: string, idx: number) => (
                                <div key={idx} className="aspect-square rounded-lg overflow-hidden cursor-pointer hover:opacity-80">
                                    <img src={img} alt={`Gallery ${idx}`} className="w-full h-full object-cover" />
                                </div>
                            ))}
                        </div>
                    )}

                    <div className="grid grid-cols-3 gap-4 border-y border-white/10 py-8">
                        <div className="text-center">
                            <span className="block text-2xl font-bold">{property.bedrooms}</span>
                            <span className="text-sm text-zinc-500 uppercase tracking-wider">Bedrooms</span>
                        </div>
                        <div className="text-center border-l border-white/10">
                            <span className="block text-2xl font-bold">{property.bathrooms}</span>
                            <span className="text-sm text-zinc-500 uppercase tracking-wider">Bathrooms</span>
                        </div>
                        <div className="text-center border-l border-white/10">
                            <span className="block text-2xl font-bold">{property.sizeM2}</span>
                            <span className="text-sm text-zinc-500 uppercase tracking-wider">m² Area</span>
                        </div>
                    </div>

                    <div>
                        <h2 className="font-display text-2xl font-bold mb-4">About this place</h2>
                        <div className="prose prose-invert max-w-none text-zinc-300 whitespace-pre-line">
                            {property.description}
                        </div>
                    </div>

                    <div>
                        <h2 className="font-display text-2xl font-bold mb-4">What this place offers</h2>
                        <div className="flex flex-wrap gap-3">
                            {property.amenities.map((amenity: string, idx: number) => (
                                <span key={idx} className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-zinc-300">
                                    {amenity}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Column: Sticky Reservation */}
                <div className="relative">
                    <ReservationForm
                        propertyId={property._id.toString()}
                        pricePerNight={property.pricePerNight}
                        user={userJson}
                        hasPaidOneTimeFee={user?.hasPaidOneTimeFee}
                    />
                </div>
            </div>
        </div>
    );
}
