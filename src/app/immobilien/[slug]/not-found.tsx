import Link from "next/link";

export default function NotFound() {
    return (
        <div className="min-h-screen bg-white flex items-center justify-center px-6">
            <div className="text-center max-w-2xl">
                <div className="mb-8">
                    <h1 className="text-8xl md:text-9xl font-display font-black text-black mb-4 tracking-tighter">
                        404
                    </h1>
                    <div className="w-24 h-1 bg-black mx-auto mb-8"></div>
                </div>

                <h2 className="text-2xl md:text-3xl font-black text-black mb-4 uppercase tracking-tight">
                    Immobilie nicht gefunden
                </h2>

                <p className="text-base md:text-lg text-zinc-600 mb-8 font-medium leading-relaxed">
                    Die von Ihnen gesuchte Immobilie existiert nicht oder wurde entfernt.
                    Bitte überprüfen Sie die URL oder kehren Sie zur Übersicht zurück.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link
                        href="/immobilien"
                        className="inline-flex items-center justify-center px-8 py-3 bg-black text-white rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-zinc-800 transition-all shadow-lg"
                    >
                        <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Alle Immobilien
                    </Link>

                    <Link
                        href="/"
                        className="inline-flex items-center justify-center px-8 py-3 bg-zinc-100 text-black rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-zinc-200 transition-all"
                    >
                        Zur Startseite
                    </Link>
                </div>

                <div className="mt-12 pt-8 border-t border-zinc-100">
                    <p className="text-xs text-zinc-400 font-black uppercase tracking-widest">
                        Benötigen Sie Hilfe? Kontaktieren Sie uns
                    </p>
                </div>
            </div>
        </div>
    );
}
