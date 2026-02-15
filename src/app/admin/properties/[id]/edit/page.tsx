
import { connectToDatabase } from "@/lib/db";
import { Property } from "@/models/Property";
import { notFound } from "next/navigation";
import EditPropertyForm from "./EditPropertyForm";
import mongoose from "mongoose";

interface PageProps {
    params: Promise<{ id: string }>;
}

export default async function EditPropertyPage({ params }: PageProps) {
    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        notFound();
    }

    await connectToDatabase();
    const property = await Property.findById(id).lean();

    if (!property) {
        notFound();
    }

    // Serializable property
    const serializedProperty = {
        ...property,
        _id: property._id.toString(),
        createdAt: property.createdAt?.toISOString(),
        updatedAt: property.updatedAt?.toISOString(),
        createdBy: property.createdBy?.toString(),
    };

    return (
        <div className="max-w-2xl mx-auto space-y-8 p-6 bg-white rounded-xl shadow-lg border border-zinc-200">
            <div>
                <h1 className="font-display text-3xl font-bold text-black">Immobilie bearbeiten</h1>
                <p className="text-zinc-600">Aktualisieren Sie die Details der Immobilie.</p>
            </div>
            <EditPropertyForm property={serializedProperty} />
        </div>
    );
}
