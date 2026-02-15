
import { connectToDatabase } from "@/lib/db";
import { Reservation } from "@/models/Reservation";
import { getTokenFromRequest, verifyToken } from "@/lib/auth";
import { NextResponse } from "next/server";
import { Property } from "@/models/Property"; // Import to ensure model is registered

export async function GET(request: Request) {
    try {
        const token = getTokenFromRequest(request);
        if (!token) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        let userId: string;
        try {
            const decoded = verifyToken(token);
            userId = decoded.sub;
        } catch {
            return NextResponse.json({ error: "Invalid token" }, { status: 401 });
        }

        await connectToDatabase();

        // Ensure Property model is loaded before populating
        // (Just referencing it in imports might be enough, but sometimes explicit load helps if not used elsewhere)

        const reservations = await Reservation.find({ userId })
            .populate("propertyId", "title mainImage slug city pricePerNight")
            .sort({ createdAt: -1 });

        return NextResponse.json({ reservations });
    } catch (error) {
        console.error("Fetch reservations error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
