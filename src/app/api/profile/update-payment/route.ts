import { connectToDatabase } from "@/lib/db";
import { User } from "@/models/User";
import { Payment } from "@/models/Payment";
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
        } catch (err) {
            return NextResponse.json({ error: "Invalid token" }, { status: 401 });
        }

        const body = await request.json();
        const { paymentId, hasPaidOneTimeFee } = body;

        await connectToDatabase();

        // Create payment record
        if (paymentId) {
            await Payment.create({
                userId,
                type: "mediation_fee",
                amount: 0.99,
                currency: "EUR",
                paypalId: paymentId,
                status: "completed",
            });
        }

        // Update user
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { hasPaidOneTimeFee: true },
            { new: true }
        ).select("-passwordHash");

        return NextResponse.json({
            message: "Payment updated successfully",
            user: updatedUser
        });

    } catch (error) {
        console.error("Update payment error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
