
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { getAuthToken } from "@/lib/auth-client";

export default function DeletePropertyButton({ id }: { id: string }) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    async function handleDelete() {
        if (!confirm("Sind Sie sicher, dass Sie diese Immobilie löschen möchten?")) return;

        setLoading(true);
        const token = getAuthToken();
        if (!token) {
            alert("Nicht autorisiert");
            setLoading(false);
            return;
        }

        try {
            const res = await fetch(`/api/properties/${id}`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });

            if (!res.ok) {
                const json = await res.json();
                throw new Error(json.error || "Löschen fehlgeschlagen");
            }

            router.refresh();
        } catch (err: any) {
            alert(err.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <button
            onClick={handleDelete}
            disabled={loading}
            className="text-red-500 hover:text-red-400 disabled:opacity-50"
        >
            {loading ? "Wird gelöscht..." : "Löschen"}
        </button>
    );
}
