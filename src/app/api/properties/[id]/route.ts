
import { connectToDatabase } from "@/lib/db";
import { Property } from "@/models/Property";
import { User } from "@/models/User";
import { getTokenFromRequest, verifyToken } from "@/lib/auth";
import { NextResponse } from "next/server";
import { z } from "zod";

const propertySchema = z.object({
    title: z.string().min(3).optional(),
    pricePerNight: z.number().positive().optional(),
    city: z.string().min(2).optional(),
    address: z.string().optional(),
    bedrooms: z.number().int().positive().optional(),
    bathrooms: z.number().int().positive().optional(),
    sizeM2: z.number().positive().optional(),
    description: z.string().min(10).optional(),
    category: z.string().min(2).optional(),
    amenities: z.array(z.string()).optional(),
    mainImage: z.string().optional(),
    galleryImages: z.array(z.string()).max(6).optional(),
});

// Helper to check admin access
async function checkAdmin(request: Request) {
    const token = getTokenFromRequest(request);
    if (!token) return null;
    try {
        const decoded = verifyToken(token);
        await connectToDatabase();
        const user = await User.findById(decoded.sub);
        if (user && user.role === "admin") return user;
    } catch {
        return null;
    }
    return null;
}

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const user = await checkAdmin(request);
        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id } = await params;
        const body = await request.json();

        // Remove _id or immutable fields if present
        delete body._id;
        delete body.createdAt;
        delete body.updatedAt;
        delete body.createdBy;

        const result = propertySchema.safeParse(body);

        if (!result.success) {
            return NextResponse.json(
                { error: "Validation failed", details: result.error.errors },
                { status: 400 }
            );
        }

        const updatedProperty = await Property.findByIdAndUpdate(
            id,
            { $set: result.data },
            { new: true, runValidators: true }
        );

        if (!updatedProperty) {
            return NextResponse.json({ error: "Property not found" }, { status: 404 });
        }

        return NextResponse.json({ message: "Property updated", property: updatedProperty });
    } catch (error) {
        console.error("Update property error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const user = await checkAdmin(request);
        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id } = await params;
        const deletedProperty = await Property.findByIdAndDelete(id);

        if (!deletedProperty) {
            return NextResponse.json({ error: "Property not found" }, { status: 404 });
        }

        return NextResponse.json({ message: "Property deleted" });
    } catch (error) {
        console.error("Delete property error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
