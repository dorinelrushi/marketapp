
import Link from "next/link";
import { PropertyDocument } from "@/models/Property";

type PropertyCardProps = {
    property: PropertyDocument;
};

export default function PropertyCard({ property }: PropertyCardProps) {
    return (
        <div className="group bg-white rounded-[32px] overflow-hidden border border-zinc-100 transition-all hover:shadow-2xl hover:shadow-zinc-200/50">
            <Link href={`/immobilien/${property.slug}`} className="block relative aspect-[1.3] overflow-hidden">
                <img
                    src={property.mainImage}
                    alt={property.title}
                    className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
            </Link>

            <div className="p-7 space-y-6">
                <div className="space-y-2">
                    <Link href={`/immobilien/${property.slug}`}>
                        <h3 className="text-xl font-bold text-black font-display leading-tight line-clamp-1">
                            {property.title}
                        </h3>
                    </Link>
                    <div className="flex items-center gap-1.5 text-zinc-400">
                        <svg className="w-4 h-4 text-red-500 fill-current" viewBox="0 0 24 24">
                            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                        </svg>
                        <span className="text-xs font-bold text-zinc-400 uppercase tracking-wide">{property.city}</span>
                    </div>
                </div>

                <div className="grid grid-cols-3 gap-4 pt-6 border-t border-zinc-50">
                    <div className="flex flex-col gap-1">
                        <span className="text-[10px] font-black text-zinc-300 uppercase tracking-widest">Zimmer</span>
                        <div className="flex items-center gap-1.5">
                            <span className="text-sm font-black text-black">{property.bedrooms}</span>
                            <svg className="w-3.5 h-3.5 text-zinc-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                            </svg>
                        </div>
                    </div>
                    <div className="flex flex-col gap-1 border-x border-zinc-50 px-4">
                        <span className="text-[10px] font-black text-zinc-300 uppercase tracking-widest">Bäder</span>
                        <div className="flex items-center gap-1.5">
                            <span className="text-sm font-black text-black">{property.bathrooms}</span>
                            <svg className="w-3.5 h-3.5 text-zinc-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                        </div>
                    </div>
                    <div className="flex flex-col gap-1 pl-2">
                        <span className="text-[10px] font-black text-zinc-300 uppercase tracking-widest">Fläche</span>
                        <div className="flex items-center gap-1.5">
                            <span className="text-sm font-black text-black">{property.sizeM2}m²</span>
                            <svg className="w-3.5 h-3.5 text-zinc-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                            </svg>
                        </div>
                    </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                    <div className="flex flex-col">
                        <span className="text-2xl font-black text-black tracking-tighter">€{property.pricePerNight}</span>
                        <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mt-0.5">/Nacht</span>
                    </div>
                    <Link
                        href={`/immobilien/${property.slug}`}
                        className="button-primary px-8 py-4 text-[10px] font-black tracking-widest uppercase border-none text-center"
                    >
                        Details ansehen
                    </Link>
                </div>
            </div>
        </div>
    );
}
