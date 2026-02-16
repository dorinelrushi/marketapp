
import Link from "next/link";
import Image from "next/image";

interface Property {
    _id: string;
    title: string;
    city: string;
    pricePerNight: number;
    mainImage: string;
    slug: string;
    category: string;
}

export default function PropertyCard({ property }: { property: any }) {
    return (
        <div className="group bg-white rounded-[32px] overflow-hidden border border-zinc-100 transition-all hover:shadow-2xl hover:shadow-black/[0.03]">
            <Link href={`/immobilien/${property.slug}`} className="block relative aspect-[1.4] overflow-hidden">
                <Image
                    src={property.mainImage}
                    alt={property.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute top-4 left-4">
                    <span className="bg-white px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest text-black shadow-sm">
                        {property.category}
                    </span>
                </div>
            </Link>

            <div className="p-5 md:p-7 space-y-4 md:space-y-6">
                <div className="space-y-2">
                    <Link href={`/immobilien/${property.slug}`}>
                        <h3 className="text-xl font-black text-black leading-tight line-clamp-1 group-hover:text-zinc-600 transition-colors uppercase tracking-tight">
                            {property.title}
                        </h3>
                    </Link>
                    <div className="flex items-center gap-2 text-zinc-600">
                        <svg className="w-3.5 h-3.5 text-zinc-600" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                        </svg>
                        <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">{property.city}</span>
                    </div>
                </div>

                <div className="flex items-center gap-6 text-zinc-700 border-b border-zinc-50 pb-6 uppercase">
                    <div className="flex items-center gap-2">
                        <span className="text-sm font-black text-black">{property.bedrooms}</span>
                        <span className="text-[9px] font-black tracking-widest">Zimmer</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-sm font-black text-black">{property.bathrooms}</span>
                        <span className="text-[9px] font-black tracking-widest">Bäder</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-sm font-black text-black">{property.sizeM2}</span>
                        <span className="text-[9px] font-black tracking-widest">m²</span>
                    </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                    <div className="flex flex-col">
                        <span className="text-2xl font-black text-black tracking-tighter">€{property.pricePerNight}</span>
                        <span className="text-[9px] font-black text-zinc-700 uppercase tracking-[0.2em] mt-0.5">/ Nacht</span>
                    </div>
                    <Link
                        href={`/immobilien/${property.slug}`}
                        className="button-primary px-8 py-4 text-[10px] font-black tracking-widest uppercase border-none"
                    >
                        Details ansehen
                    </Link>
                </div>
            </div>
        </div>
    );
}
