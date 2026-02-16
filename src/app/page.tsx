
import PropertyCard from "@/components/properties/PropertyCard";
import { connectToDatabase } from "@/lib/db";
import { Property } from "@/models/Property";
import { Suspense } from "react";
import Hero from "@/components/home/Hero";
import Footer from "@/components/Footer";
import Link from "next/link";

async function FeaturedProperties({ search }: { search?: string }) {
  await connectToDatabase();

  let query: any = {};
  if (search) {
    query = {
      $or: [
        { title: { $regex: search, $options: "i" } },
        { city: { $regex: search, $options: "i" } },
        { address: { $regex: search, $options: "i" } }
      ]
    };
  }

  let propertiesQuery = Property.find(query).sort({ createdAt: -1 });

  // Only limit if no search is active
  if (!search) {
    propertiesQuery = propertiesQuery.limit(6);
  }

  const properties = await propertiesQuery.lean();

  // Serialize MongoDB documents to plain JavaScript objects
  const serializedProperties = properties.map((property: any) => ({
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
  }));

  return (
    <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
      {serializedProperties.map((property) => (
        <PropertyCard key={property._id} property={property} />
      ))}
      {serializedProperties.length === 0 && (
        <p className="text-zinc-700 col-span-full text-center py-12">Momentan wurden keine Immobilien gefunden.</p>
      )}
    </div>
  );
}

export default async function Home({ searchParams }: { searchParams: Promise<{ search?: string }> }) {
  const params = await searchParams;
  const search = params?.search;

  return (
    <div className="min-h-screen bg-white">
      <Hero />

      {/* So funktioniert es */}
      <section className="py-12 md:py-24 bg-[#fffbfb]">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="text-center mb-10 md:mb-16">
            <h2 className="text-3xl md:text-5xl font-black text-black mb-4 font-display tracking-tighter uppercase">So funktioniert es</h2>
            <p className="text-zinc-700 font-medium">In nur drei einfachen Schritten zu Ihrer Traumwohnung</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-12 max-w-6xl mx-auto">
            {[
              {
                num: "1",
                title: "Wohnung auswählen",
                desc: "Stöbern Sie in unseren ausgewählten Immobilien in den beliebtesten deutschen Städten und wählen Sie Ihren Favoriten."
              },
              {
                num: "2",
                title: "Besichtigung buchen",
                desc: "Füllen Sie das Formular aus und wählen Sie ein passendes Datum und eine Uhrzeit für die Besichtigung."
              },
              {
                num: "3",
                title: "0,99 € bezahlen",
                desc: "Bezahlen Sie die Anmeldegebühr sicher per PayPal und aktivieren Sie den vollen Zugriff."
              }
            ].map((step, i) => (
              <div key={i} className="bg-white p-8 md:p-12 rounded-[32px] md:rounded-[40px] text-center space-y-6 md:space-y-8 border border-zinc-50 transition-all hover:shadow-2xl hover:shadow-zinc-200/50">
                <div className="w-16 h-16 bg-black text-white rounded-full flex items-center justify-center mx-auto text-2xl font-black font-display tracking-tighter">
                  {step.num}
                </div>
                <div className="space-y-4">
                  <h3 className="text-2xl font-black text-black font-display tracking-tight uppercase">{step.title}</h3>
                  <p className="text-zinc-600 text-sm leading-relaxed font-medium">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Properties Section */}
      <section id="available-properties" className="py-12 md:py-24 bg-zinc-50/30">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-20 gap-8">
            <div className="max-w-xl">
              <h2 className="text-3xl md:text-6xl font-black text-black mb-4 md:mb-6 tracking-tighter font-display leading-[1.1] uppercase">Verfügbare Immobilien</h2>
              <p className="text-zinc-700 text-base md:text-lg font-medium leading-relaxed">Wählen Sie aus den besten verifizierten Wohnungen und Häusern in Deutschland.</p>
            </div>
            <Link href="/immobilien" className="button-primary px-8 py-4 text-xs tracking-widest uppercase border-none">
              Alle Immobilien ansehen
            </Link>
          </div>

          <Suspense fallback={<div className="grid grid-cols-1 md:grid-cols-3 gap-8">{[1, 2, 3].map(i => <div key={i} className="aspect-[1.3] bg-zinc-100 rounded-[32px] animate-pulse"></div>)}</div>}>
            <FeaturedProperties search={search} />
          </Suspense>
        </div>
      </section>

      {/* Warum unsere Plattform wählen? */}
      <section className="py-12 md:py-24 bg-white">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="text-center mb-12 md:mb-20">
            <h2 className="text-3xl md:text-5xl font-black text-black mb-4 font-display tracking-tighter uppercase">Warum unsere Plattform?</h2>
            <p className="text-zinc-600 font-medium">Der zuverlässigste Mietservice in Deutschland</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
            {[
              {
                icon: "💎",
                title: "Vermittlung",
                desc: "Vollständige Abstimmung mit den Eigentümern, Unterstützung während des Prozesses und notwendige Unterlagen."
              },
              {
                icon: "🔒",
                title: "Sicherer Prozess",
                desc: "Jeder Zahlungsvorgang erfolgt sicher und transparent mit verifizierten Methoden."
              },
              {
                icon: "✅",
                title: "Verifiziert",
                desc: "Jedes Objekt wird geprüft und verifiziert, bevor es auf unserer Plattform veröffentlicht wird."
              },
              {
                icon: "⚡",
                title: "Schnelle Buchung",
                desc: "Buchen Sie online ohne Wartezeit und kontaktieren Sie sofort den Vermieter für den Termin."
              }
            ].map((feature, i) => (
              <div key={feature.title} className="bg-zinc-50/50 p-6 md:p-10 rounded-[32px] md:rounded-[40px] space-y-4 md:space-y-6 border border-zinc-100/50">
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-2xl shadow-sm">{feature.icon}</div>
                <h3 className="text-xl font-bold text-black font-display tracking-tight uppercase">{feature.title}</h3>
                <p className="text-zinc-600 text-sm leading-relaxed font-medium">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="pb-0 ">
        <div className="bg-[black] text-[white] py-[60px] md:py-[90px]">
          <div className="relative z-10">
            <h2 className="text-[25px] lg:text-[40px] max-w-[320px] lg:max-w-[800px] m-[auto] font-black mb-8 md:mb-12 text-center mx-auto leading-[1.1] font-display tracking-tighter uppercase">
              Bereit, Ihre Traumwohnung zu finden?
            </h2>
            <div className="flex w-[80%] m-[auto] flex-col sm:flex-row items-center justify-center gap-6">
              <Link
                href="/immobilien"
                className="w-full text-[black!important] sm:w-auto px-12 py-5 bg-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-zinc-100 transition-all shadow-xl shadow-white/5"
              >
                Immobilien durchsuchen
              </Link>
              <Link
                href="/registrieren"
                className="w-full sm:w-auto px-12 py-5 bg-[#1a1a1a] text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-zinc-900 transition-all border border-white/10"
              >
                Jetzt registrieren
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
