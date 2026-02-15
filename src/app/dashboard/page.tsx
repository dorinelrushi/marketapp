"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Property = {
  _id: string;
  title: string;
  city: string;
  pricePerNight: number;
  mainImage: string;
  slug: string;
};

export default function AdminDashboard() {
  const router = useRouter();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      const res = await fetch("/api/properties");
      const data = await res.json();
      setProperties(data.properties || []);
    } catch (error) {
      console.error("Failed to fetch properties:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    const token = localStorage.getItem("booknest_token");
    if (!token) {
      router.push("/anmelden");
      return;
    }

    try {
      const res = await fetch(`/api/properties/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      if (res.ok) {
        setProperties(properties.filter(p => p._id !== id));
        setDeleteId(null);
      } else {
        const data = await res.json();
        alert(data.error || "Löschen fehlgeschlagen");
      }
    } catch (error) {
      console.error("Delete error:", error);
      alert("Löschen fehlgeschlagen");
    }
  };

  return (
    <div className="min-h-screen bg-background px-6 py-16">
      <div className="mx-auto w-full max-w-6xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-zinc-900">Admin Dashboard</h1>
            <p className="text-zinc-500 mt-1">Verwalten Sie Ihre Immobilien</p>
          </div>
          <Link
            href="/dashboard/properties/new"
            className="px-4 py-2 bg-zinc-900 text-white rounded-md hover:bg-zinc-800"
          >
            + Immobilie hinzufügen
          </Link>
        </div>

        {loading ? (
          <p className="text-zinc-500">Immobilien werden geladen...</p>
        ) : properties.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl border border-zinc-200">
            <p className="text-zinc-500 mb-4">Noch keine Immobilien vorhanden</p>
            <Link
              href="/dashboard/properties/new"
              className="inline-block px-4 py-2 bg-zinc-900 text-white rounded-md hover:bg-zinc-800"
            >
              Erstellen Sie Ihre erste Immobilie
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {properties.map((property) => (
              <div key={property._id} className="bg-white rounded-xl border border-zinc-200 overflow-hidden">
                <img
                  src={property.mainImage}
                  alt={property.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h3 className="font-bold text-zinc-900 mb-1">{property.title}</h3>
                  <p className="text-sm text-zinc-500 mb-2">{property.city}</p>
                  <p className="text-lg font-bold text-amber-600 mb-4">
                    €{property.pricePerNight}/Nacht
                  </p>
                  <div className="space-y-2">
                    <Link
                      href={`/immobilien/${property.slug}`}
                      className="block w-full px-3 py-2 text-sm text-center bg-amber-50 text-amber-700 rounded-md hover:bg-amber-100"
                    >
                      Immobilie ansehen
                    </Link>
                    <div className="flex gap-2">
                      <Link
                        href={`/dashboard/properties/${property._id}/edit`}
                        className="flex-1 px-3 py-2 text-sm bg-zinc-100 text-zinc-900 rounded-md hover:bg-zinc-200 text-center"
                      >
                        Bearbeiten
                      </Link>
                      <button
                        onClick={() => setDeleteId(property._id)}
                        className="flex-1 px-3 py-2 text-sm bg-red-50 text-red-600 rounded-md hover:bg-red-100"
                      >
                        Löschen
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {deleteId && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
              <h3 className="text-xl font-bold text-zinc-900 mb-2">Immobilie löschen?</h3>
              <p className="text-zinc-600 mb-6">
                Diese Aktion kann nicht rückgängig gemacht werden. Die Immobilie wird dauerhaft gelöscht.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteId(null)}
                  className="flex-1 px-4 py-2 bg-zinc-100 text-zinc-900 rounded-md hover:bg-zinc-200"
                >
                  Abbrechen
                </button>
                <button
                  onClick={() => handleDelete(deleteId)}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                >
                  Löschen
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
