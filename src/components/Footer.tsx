"use client";

import Link from "next/link";

export default function Footer() {
    return (
        <footer className="bg-white border-t border-zinc-100 py-12">
            <div className="container mx-auto px-6 lg:px-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 lg:gap-20">
                    <div className="md:col-span-1">
                        <Link href="/" className="flex items-center gap-2 group mb-6">
                            <div className="flex items-center justify-center">
                                <svg className="w-6 h-6 text-black" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M12 3L4 9V21H20V9L12 3ZM10 19H8V11H10V19ZM16 19H14V11H16V19Z" />
                                </svg>
                            </div>
                            <span className="text-xl font-black tracking-tighter text-black font-display uppercase">
                                1minutewohnung
                            </span>
                        </Link>
                        <p className="text-zinc-600 text-[14px] max-w-xs leading-relaxed font-medium">
                            Die führende Plattform für die Vermittlung von Häusern und Wohnungen in Deutschland. Finden Sie Ihr Traumzuhause in wenigen Minuten.
                        </p>
                    </div>

                    <div>
                        <h3 className="text-[16px] font-black text-black mb-8 uppercase tracking-[0.2em] font-display">Kontakt</h3>
                        <ul className="space-y-4">
                            <li className="text-[16px] text-zinc-700 font-medium">
                                <strong className="text-black font-black uppercase text-[10px] tracking-widest block mb-1">Email:</strong> info@1minutewohnung.de
                            </li>
                            <li className="text-[16px] text-zinc-700 font-medium">
                                <strong className="text-black font-black uppercase text-[10px] tracking-widest block mb-1">Tel:</strong> +49 123 456 789
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-[18px] font-black text-black mb-8 uppercase tracking-[0.2em] font-display">Entdecken</h3>
                        <ul className="space-y-4">
                            <li>
                                <Link href="/" className="text-[13px] text-zinc-700 hover:text-black transition-colors font-medium">Startseite</Link>
                            </li>
                            <li>
                                <Link href="/immobilien" className="text-[13px] text-zinc-500 hover:text-black transition-colors font-medium">Verfügbare Immobilien</Link>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-[16px] font-black text-black mb-8 uppercase tracking-[0.2em] font-display">Rechtliches</h3>
                        <ul className="space-y-4">
                            <li>
                                <Link href="/nutzungsbedingungen" className="text-[13px] text-zinc-500 hover:text-black transition-colors font-medium">Nutzungsbedingungen</Link>
                            </li>
                            <li>
                                <Link href="/datenschutz" className="text-[13px] text-zinc-500 hover:text-black transition-colors font-medium">Datenschutz</Link>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-zinc-50 mt-16 pt-8 flex flex-col md:flex-row items-center justify-between gap-6">
                    <p className="text-[10px] text-zinc-700 font-black uppercase tracking-widest">
                        © {new Date().getFullYear()} 1minutewohnung. Alle Rechte vorbehalten.
                    </p>
                </div>
            </div>
        </footer>
    );
}
