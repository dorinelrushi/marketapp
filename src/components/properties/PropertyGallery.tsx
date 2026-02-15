
"use client";

import { useState } from "react";
import Image from "next/image";

interface PropertyGalleryProps {
    images: string[];
}

export default function PropertyGallery({ images }: PropertyGalleryProps) {
    const [currentIndex, setCurrentIndex] = useState(0);

    if (!images || images.length === 0) return null;

    const nextSlide = () => {
        setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    };

    const prevSlide = () => {
        setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    };

    return (
        <div className="space-y-6">
            <h2 className="text-xl md:text-2xl font-black mb-6 text-black uppercase tracking-tight">Galeria</h2>

            {/* Main Slider */}
            <div className="relative aspect-[16/10] md:aspect-[16/8] rounded-[32px] md:rounded-[40px] overflow-hidden bg-zinc-100 group shadow-2xl shadow-black/5">
                {images.map((img, idx) => (
                    <div
                        key={idx}
                        className={`absolute inset-0 transition-all duration-1000 ease-in-out ${idx === currentIndex ? "opacity-100 scale-100" : "opacity-0 scale-105"
                            }`}
                    >
                        <Image
                            src={img}
                            alt={`Slide ${idx + 1}`}
                            fill
                            className="object-cover"
                            priority={idx === 0}
                        />
                    </div>
                ))}

                {/* Navigation Buttons */}
                {images.length > 1 && (
                    <>
                        <button
                            onClick={prevSlide}
                            className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/20 hover:bg-white backdrop-blur-md rounded-full flex items-center justify-center text-white hover:text-black transition-all border border-white/20 group/btn"
                        >
                            <svg className="w-5 h-5 group-hover/btn:-translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>
                        <button
                            onClick={nextSlide}
                            className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/20 hover:bg-white backdrop-blur-md rounded-full flex items-center justify-center text-white hover:text-black transition-all border border-white/20 group/btn"
                        >
                            <svg className="w-5 h-5 group-hover/btn:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
                            </svg>
                        </button>

                        {/* Indicators */}
                        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                            {images.map((_, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setCurrentIndex(idx)}
                                    className={`h-1 transition-all duration-500 rounded-full ${idx === currentIndex ? "w-8 bg-white" : "w-1.5 bg-white/40 hover:bg-white/60"
                                        }`}
                                />
                            ))}
                        </div>
                    </>
                )}
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
                <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide">
                    {images.map((img, idx) => (
                        <button
                            key={idx}
                            onClick={() => setCurrentIndex(idx)}
                            className={`relative flex-shrink-0 w-24 md:w-32 aspect-[4/3] rounded-xl md:rounded-2xl overflow-hidden border-2 transition-all ${idx === currentIndex ? "border-black scale-95 shadow-lg" : "border-transparent opacity-40 hover:opacity-100"
                                }`}
                        >
                            <Image
                                src={img}
                                alt={`Thumbnail ${idx + 1}`}
                                fill
                                className="object-cover"
                            />
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
