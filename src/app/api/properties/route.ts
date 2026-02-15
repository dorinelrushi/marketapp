
import { connectToDatabase } from "@/lib/db";
import { Property } from "@/models/Property";
import { User } from "@/models/User"; // verify admin
import { getTokenFromRequest, verifyToken } from "@/lib/auth";
import { NextResponse } from "next/server";
import { z } from "zod";

const propertySchema = z.object({
    title: z.string().min(3),
    pricePerNight: z.number().positive(),
    city: z.string().min(2),
    address: z.string().optional(),
    bedrooms: z.number().int().positive(),
    bathrooms: z.number().int().positive(),
    sizeM2: z.number().positive(),
    description: z.string().min(10),
    category: z.string().min(2),
    amenities: z.array(z.string()),
    mainImage: z.string(),
    galleryImages: z.array(z.string()).max(6).optional(),
});

function generateSlug(title: string) {
    return title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");
}

export async function POST(request: Request) {
    try {
        const token = getTokenFromRequest(request);
        if (!token) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Verify User Role
        // In a real app we might decode token or check DB.
        // For now assuming token valid = check DB user
        // However, verifyToken(token) returns decode payload. 
        // We need to fetch user to check role 'admin'.

        // We'll trust the middleware/UI mostly but for API security we should check.
        // Let's assume verifyToken works (it returns { sub: userId }).

        let userId: string;
        try {
            const decoded = verifyToken(token);
            userId = decoded.sub;
        } catch {
            return NextResponse.json({ error: "Invalid token" }, { status: 401 });
        }

        await connectToDatabase();
        const user = await User.findById(userId);
        if (!user || user.role !== "admin") {
            return NextResponse.json({ error: "Forbidden: Admin only" }, { status: 403 });
        }

        const body = await request.json();
        const result = propertySchema.safeParse(body);

        if (!result.success) {
            return NextResponse.json(
                { error: "Validation failed", details: result.error.format() },
                { status: 400 }
            );
        }

        const {
            title,
            pricePerNight,
            city,
            address,
            bedrooms,
            bathrooms,
            sizeM2,
            description,
            category,
            amenities,
            mainImage,
            galleryImages,
        } = result.data;

        let slug = generateSlug(title);

        // Check uniqueness
        let existingProperty = await Property.findOne({ slug });
        if (existingProperty) {
            slug = `${slug}-${Math.random().toString(36).substring(2, 7)}`;
        }

        const newProperty = await Property.create({
            slug,
            title,
            pricePerNight,
            city,
            address,
            bedrooms,
            bathrooms,
            sizeM2,
            description,
            category,
            amenities,
            mainImage,
            galleryImages,
            createdBy: userId,
        });

        return NextResponse.json(
            { message: "Property created", property: newProperty },
            { status: 201 }
        );
    } catch (error) {
        console.error("Create property error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}

export async function GET() {
    // Public route to list properties (can be filtered)
    // For now just return all
    await connectToDatabase();
    const properties = await Property.find().sort({ createdAt: -1 });
    return NextResponse.json({ properties });
}
