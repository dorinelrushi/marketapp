
"use client";

import { AUTH_EVENT_NAME, clearAuthToken, getAuthToken } from "@/lib/auth-client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Navbar() {
    const router = useRouter();
    const pathname = usePathname();
    const [mounted, setMounted] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        setMounted(true);
        const checkAuth = () => {
            const token = getAuthToken();
            setIsLoggedIn(!!token);

            if (token) {
                const userStr = localStorage.getItem("booknest_user");
                if (userStr) {
                    try {
                        const userData = JSON.parse(userStr);
                        setUser(userData);
                    } catch (e) {
                        setUser(null);
                    }
                } else {
                    setUser(null);
                }
            } else {
                setUser(null);
            }
        };

        checkAuth();
        window.addEventListener(AUTH_EVENT_NAME, checkAuth);
        return () => window.removeEventListener(AUTH_EVENT_NAME, checkAuth);
    }, []);

    const handleLogout = () => {
        clearAuthToken();
        setUser(null);
        setIsLoggedIn(false);
        router.push("/anmelden");
    };

    const [isMenuOpen, setIsMenuOpen] = useState(false);

    if (!mounted) return null;

    const isAdmin = user?.role === "admin";

    return (
        <nav className="bg-white sticky top-0 z-50 py-4 border-b border-zinc-50 shadow-sm shadow-black/[0.03]">
            <div className="container mx-auto flex items-center justify-between px-6 lg:px-12">
                <div className="flex items-center gap-2">
                    <Link href="/" className="flex items-center gap-2 group">
                        <div className="flex items-center justify-center p-1">
                            <svg className="w-6 h-6 text-black" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 3L4 9V21H20V9L12 3ZM10 19H8V11H10V19ZM16 19H14V11H16V19Z" />
                            </svg>
                        </div>
                        <span className="text-2xl font-black tracking-tighter text-black group-hover:text-zinc-600 transition-colors font-display">
                            1minutewohnung
                        </span>
                    </Link>
                </div>

                {/* Desktop Menu */}
                <div className="hidden md:flex items-center gap-10">
                    <Link href="/" className="text-[10px] font-black uppercase tracking-widest text-zinc-600 hover:text-black transition-colors">
                        Startseite
                    </Link>
                    <Link href="/immobilien" className="text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-black transition-colors">
                        Immobilien
                    </Link>

                    {isLoggedIn ? (
                        <div className="flex items-center gap-8">
                            <Link href="/dashboard/profile" className="text-[10px] font-black uppercase tracking-widest text-black flex items-center gap-2 group">
                                <span className="text-zinc-700">Willkommen,</span>
                                <span className="group-hover:translate-x-1 transition-transform">{user?.fullName?.split(' ')[0] || 'Benutzer'}</span>
                            </Link>
                            {isAdmin && (
                                <Link href="/admin" className="text-[10px] font-black uppercase tracking-widest text-black hover:text-zinc-600 transition-colors">
                                    Admin
                                </Link>
                            )}
                            <button onClick={handleLogout} className="text-[10px] font-black uppercase tracking-widest text-zinc-700 hover:text-black transition-colors">
                                Abmelden
                            </button>
                        </div>
                    ) : (
                        <div className="flex items-center gap-8">
                            <Link href="/anmelden" className="text-[10px] font-black uppercase tracking-widest text-black hover:text-zinc-600 transition-colors">
                                Anmelden
                            </Link>
                            <Link
                                href="/registrieren"
                                className="button-primary text-[10px] font-black tracking-widest uppercase py-3.5 px-8 border-none"
                            >
                                Registrieren
                            </Link>
                        </div>
                    )}
                </div>

                {/* Mobile Menu Button */}
                <button
                    className="md:hidden p-2 text-zinc-900 bg-zinc-50 rounded-xl"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                    {isMenuOpen ? (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    ) : (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6h16M4 12h16m-7 6h7" />
                        </svg>
                    )}
                </button>
            </div>

            {/* Mobile Menu Overlay */}
            {isMenuOpen && (
                <div className="md:hidden absolute top-full left-0 right-0 bg-white border-b border-zinc-100 shadow-2xl z-50 animate-in slide-in-from-top duration-300">
                    <div className="flex flex-col p-8 gap-6">
                        <Link
                            href="/"
                            onClick={() => setIsMenuOpen(false)}
                            className="text-sm font-black uppercase tracking-widest text-zinc-600"
                        >
                            Startseite
                        </Link>
                        <Link
                            href="/immobilien"
                            onClick={() => setIsMenuOpen(false)}
                            className="text-sm font-black uppercase tracking-widest text-zinc-600"
                        >
                            Immobilien
                        </Link>

                        <div className="h-px bg-zinc-50 my-2"></div>

                        {isLoggedIn ? (
                            <>
                                <Link
                                    href="/dashboard/profile"
                                    onClick={() => setIsMenuOpen(false)}
                                    className="text-sm font-black uppercase tracking-widest text-zinc-950"
                                >
                                    Willkommen, {user?.fullName?.split(' ')[0]}
                                </Link>
                                {isAdmin && (
                                    <Link
                                        href="/admin"
                                        onClick={() => setIsMenuOpen(false)}
                                        className="text-sm font-black uppercase tracking-widest text-zinc-950"
                                    >
                                        Admin
                                    </Link>
                                )}
                                <button
                                    onClick={() => {
                                        handleLogout();
                                        setIsMenuOpen(false);
                                    }}
                                    className="text-sm font-black uppercase tracking-widest text-zinc-700 text-left"
                                >
                                    Abmelden
                                </button>
                            </>
                        ) : (
                            <div className="flex flex-col gap-6 pt-4">
                                <Link
                                    href="/anmelden"
                                    onClick={() => setIsMenuOpen(false)}
                                    className="text-sm font-black uppercase tracking-widest text-zinc-950"
                                >
                                    Anmelden
                                </Link>
                                <Link
                                    href="/registrieren"
                                    onClick={() => setIsMenuOpen(false)}
                                    className="button-primary w-full text-center text-xs font-black uppercase tracking-widest py-5"
                                >
                                    Registrieren
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
}
