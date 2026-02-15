import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import { User } from "@/models/User";
import PayPalSubscriptionButton from "@/components/paypal/PayPalSubscriptionButton";
import Link from "next/link";

// Force dynamic because we rely on cookies/auth
export const dynamic = "force-dynamic";

export default async function SubscribePage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  let user = null;

  if (token) {
    try {
      const decoded = verifyToken(token);
      await connectToDatabase();
      user = await User.findById(decoded.sub);
    } catch (e) {
      // invalid token
    }
  }

  const isSubscribed = user?.subscriptionStatus === "active";

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-950 px-6">
      <div className="max-w-md w-full text-center space-y-8">
        <div>
          <h1 className="font-display text-4xl font-bold text-white">Treten Sie dem Club bei</h1>
          <p className="mt-4 text-zinc-400">
            Schalten Sie mit unserem Jahresplan exklusiven Zugang zu Premium-Immobilien frei.
          </p>
        </div>

        <div className={`bg-zinc-900 border ${isSubscribed ? "border-green-500/50 bg-green-500/5" : "border-white/10"} rounded-2xl p-8 hover:border-amber-500/50 transition-colors`}>

          {isSubscribed ? (
            <>
              <div className="flex justify-center mb-4">
                <span className="bg-green-500 text-black text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                  Aktives Mitglied
                </span>
              </div>
              <h2 className="text-2xl font-bold text-white">Premium freigeschaltet</h2>
              <p className="mt-4 text-zinc-300">
                Sie haben vollen Zugriff auf alle Premium-Funktionen.
              </p>
              <p className="text-xs text-zinc-500 mt-2">
                Nächstes Rechnungsdatum: {new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toLocaleDateString('de-DE')}
              </p>

              <div className="mt-8">
                <Link
                  href="/immobilien"
                  className="block w-full rounded-full bg-white py-3 font-bold text-black hover:bg-zinc-200 transition-colors"
                >
                  Immobilien durchsuchen
                </Link>
              </div>
            </>
          ) : (
            <>
              <h2 className="text-2xl font-bold text-white">Premium-Mitglied</h2>
              <div className="mt-4 flex items-baseline justify-center gap-1">
                <span className="text-4xl font-bold text-amber-500">49,99 €</span>
                <span className="text-zinc-500">/ Jahr</span>
              </div>
              <p className="mt-2 text-xs text-zinc-400">
                Die Abrechnung beginnt 24 Stunden nach der Aktivierung.
              </p>
              <ul className="mt-6 space-y-3 text-sm text-zinc-300">
                <li className="flex items-center gap-2 justify-center">
                  ✓ Keine Buchungsprovisionen
                </li>
                <li className="flex items-center gap-2 justify-center">
                  ✓ Prioritärer Support
                </li>
                <li className="flex items-center gap-2 justify-center">
                  ✓ Frühzeitiger Zugang zu neuen Angeboten
                </li>
              </ul>

              <div className="mt-8">
                {!user ? (
                  <Link
                    href="/anmelden?redirect=/subscribe"
                    className="block w-full rounded-full bg-white py-3 font-bold text-black hover:bg-zinc-200 transition-colors"
                  >
                    Anmelden zum Abonnieren
                  </Link>
                ) : (
                  <PayPalSubscriptionButton />
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
