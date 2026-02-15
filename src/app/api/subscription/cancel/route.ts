import { NextRequest, NextResponse } from "next/server";
import { User } from "@/models/User";
import { cancelPayPalSubscription } from "@/lib/paypal";
import jwt from "jsonwebtoken";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
    try {
        const authHeader = request.headers.get("authorization");
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { sub: string };

        const user = await User.findById(decoded.sub);
        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        if (!user.paypalSubscriptionId) {
            return NextResponse.json({ error: "No active subscription found" }, { status: 400 });
        }

        // Cancel on PayPal
        await cancelPayPalSubscription(user.paypalSubscriptionId);

        // Update DB
        user.subscriptionActive = false;
        user.paypalSubscriptionId = undefined;
        await user.save();

        return NextResponse.json({ success: true, user });
    } catch (error) {
        console.error("Cancellation error:", error);
        return NextResponse.json(
            { error: "Failed to cancel subscription" },
            { status: 500 }
        );
    }
}
