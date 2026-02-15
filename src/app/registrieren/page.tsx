
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { setAuthToken, AUTH_EVENT_NAME } from "@/lib/auth-client";

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    role: "client"
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Registration failed");
      }

      // Save token and user info
      setAuthToken(data.token, data.user);

      // Redirect to home
      router.push("/");
      // Dispatch event for Navbar
      window.dispatchEvent(new Event(AUTH_EVENT_NAME));
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-6 py-12 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none">
        <div className="absolute top-[10%] left-[10%] w-64 h-64 bg-[#915B3C] rounded-full blur-[100px]"></div>
        <div className="absolute bottom-[10%] right-[10%] w-96 h-96 bg-zinc-400 rounded-full blur-[100px]"></div>
      </div>

      <div className="bg-white rounded-[40px] border border-zinc-100 shadow-2xl shadow-zinc-200/50 w-full max-w-[540px] p-10 lg:p-14 relative z-10">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-black text-black mb-4 font-display tracking-tight uppercase">Konto erstellen</h1>
          <p className="text-zinc-600 text-sm font-medium">Beginnen Sie heute mit der Verwaltung Ihrer Buchungen</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2 group">
              <label className="text-[10px] font-black text-zinc-700 uppercase tracking-widest ml-1 group-focus-within:text-black transition-colors">Vollständiger Name</label>
              <input
                type="text"
                required
                placeholder="Vor- und Nachname"
                className="w-full px-6 py-4 bg-zinc-50 border border-zinc-50 rounded-2xl text-black placeholder-zinc-200 focus:outline-none focus:ring-4 focus:ring-black/5 focus:border-black/10 focus:bg-white transition-all font-bold"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              />
            </div>

            <div className="space-y-2 group">
              <label className="text-[10px] font-black text-zinc-700 uppercase tracking-widest ml-1 group-focus-within:text-black transition-colors">Telefonnummer</label>
              <input
                type="tel"
                required
                placeholder="+49..."
                className="w-full px-6 py-4 bg-zinc-50 border border-zinc-50 rounded-2xl text-black placeholder-zinc-200 focus:outline-none focus:ring-4 focus:ring-black/5 focus:border-black/10 focus:bg-white transition-all font-bold"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2 group">
            <label className="text-[10px] font-black text-zinc-700 uppercase tracking-widest ml-1 group-focus-within:text-black transition-colors">E-Mail-Adresse</label>
            <input
              type="email"
              required
              placeholder="max@mustermann.de"
              className="w-full px-6 py-4 bg-zinc-50 border border-zinc-50 rounded-2xl text-black placeholder-zinc-200 focus:outline-none focus:ring-4 focus:ring-black/5 focus:border-black/10 focus:bg-white transition-all font-bold"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>

          <div className="space-y-2 group">
            <label className="text-[10px] font-black text-zinc-700 uppercase tracking-widest ml-1 group-focus-within:text-black transition-colors">Passwort</label>
            <input
              type="password"
              required
              placeholder="........"
              className="w-full px-6 py-4 bg-zinc-50 border border-zinc-50 rounded-2xl text-black placeholder-zinc-200 focus:outline-none focus:ring-4 focus:ring-black/5 focus:border-black/10 focus:bg-white transition-all font-bold"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
          </div>

          {error && (
            <div className="bg-red-50 text-red-500 text-[11px] font-bold py-4 px-5 rounded-2xl border border-red-100 flex items-center gap-3">
              <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="button-primary w-full py-5 text-xs font-black uppercase tracking-widest mt-2 border-none"
          >
            {loading ? "Konto wird erstellt..." : "Registrieren"}
          </button>
        </form>

        <div className="mt-10 text-center">
          <p className="text-[11px] font-black text-zinc-700 uppercase tracking-widest">
            Bereits ein Konto?{" "}
            <Link href="/anmelden" className="text-black font-black hover:underline underline-offset-4">
              Hier anmelden
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
