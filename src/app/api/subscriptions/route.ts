
import { connectToDatabase } from "@/lib/db";
import { User } from "@/models/User";
import { getTokenFromRequest, verifyToken } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
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

        const { subscriptionId } = await request.json();

        if (!subscriptionId) {
            return NextResponse.json({ error: "Subscription ID required" }, { status: 400 });
        }

        await connectToDatabase();

        // Save subscription ID to user
        // We do NOT set status to 'active' immediately if we strictly follow "after webhook confirmation".
        // But usually for UX we might set it to 'pending' or rely on webhook.
        // The prompt says "subscriptionStatus becomes active after webhook confirmation".
        // So we just save the ID here.

        await User.findByIdAndUpdate(userId, {
            subscriptionId: subscriptionId
        });

        return NextResponse.json({ message: "Subscription ID saved" });

    } catch (error) {
        console.error("Subscription error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
