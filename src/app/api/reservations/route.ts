
import { connectToDatabase } from "@/lib/db";
import { Reservation } from "@/models/Reservation";
import { Payment } from "@/models/Payment";
import { User } from "@/models/User";
import { Property } from "@/models/Property";
import { getTokenFromRequest, verifyToken } from "@/lib/auth";
import { sendReservationEmail } from "@/lib/email";
import { NextResponse } from "next/server";
import { z } from "zod";

const reservationSchema = z.object({
    propertyId: z.string(),
    fullName: z.string().min(2),
    email: z.string().email(),
    phone: z.string().min(5),
    mediationFeePaid: z.boolean().optional(),
    mediationPaymentId: z.string().optional(),
    subscriptionId: z.string().optional(),
});

export async function POST(request: Request) {
    try {
        const token = getTokenFromRequest(request);
        if (!token) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        let userId: string;
        try {
            console.log("Verifying token for reservation...");
            const decoded = verifyToken(token);
            userId = decoded.sub;
            console.log("Token verified. User ID:", userId);
        } catch (err) {
            console.error("Token verification failed:", err);
            return NextResponse.json({ error: "Invalid token" }, { status: 401 });
        }

        const body = await request.json();
        const result = reservationSchema.safeParse(body);

        if (!result.success) {
            return NextResponse.json(
                { error: "Validation failed", details: result.error.format() },
                { status: 400 }
            );
        }

        const {
            propertyId,
            fullName,
            email,
            phone,
            mediationFeePaid, // This field from the client is now largely ignored in favor of server-side check
            mediationPaymentId,
        } = result.data;

        await connectToDatabase();

        const currentUser = await User.findById(userId);
        if (!currentUser) return NextResponse.json({ error: "User not found" }, { status: 404 });

        // One-time fee check
        if (!currentUser.hasPaidOneTimeFee) {

            // If we have a subscriptionId, we verify/save it and unlock the user
            if (body.subscriptionId) {
                await User.findByIdAndUpdate(userId, {
                    hasPaidOneTimeFee: true,
                    subscriptionId: body.subscriptionId,
                    subscriptionStatus: "active" // Optimistic activation
                });
            } else if (body.mediationPaymentId) {
                // Create Payment Record
                await Payment.create({
                    userId,
                    type: "mediation_fee",
                    amount: 0.99,
                    currency: "USD",
                    paypalId: body.mediationPaymentId,
                    status: "completed",
                });

                // Mark user as paid
                currentUser.hasPaidOneTimeFee = true;
                await currentUser.save();
            }
            // If no payment ID and not paid
            else if (!body.mediationFeePaid) {
                return NextResponse.json({ error: "Mediation fee payment required" }, { status: 400 });
            }
            // If body.mediationFeePaid is true but no ID, we assume client handled it (fallback)
            // Ideally we always mandate the ID for verification.
        }

        // If user HAS paid, we proceed to create reservation.
        // We ignore mediationPaymentId if sent, or it might be undefined is fine.

        // Fetch property title for the email
        const property = await Property.findById(propertyId);
        const propertyTitle = property ? property.title : "Unknown Property";

        // Create Reservation
        const newReservation = await Reservation.create({
            propertyId,
            userId,
            fullName,
            email,
            phone,
            mediationFeePaid: true, // Always true now, as it's either paid now or was paid before
            mediationPaymentId: mediationPaymentId || "waived-one-time-fee", // Use payment ID or a placeholder
            status: "pending",
        });

        // Send Email Notification (Non-blocking ideally, but we'll await for simplicity or use a background pattern)
        // We do this after successful creation
        try {
            console.log("Attempting to send reservation email to marioshkembi60@gmail.com...");
            const emailResult = await sendReservationEmail({
                clientName: fullName,
                clientEmail: email,
                clientPhone: phone,
                propertyTitle: propertyTitle
            });
            console.log("Email result:", emailResult);
        } catch (emailErr) {
            console.error("Failed to send reservation email:", emailErr);
            // We don't fail the request if just the email fails
        }

        console.log("Reservation process completed successfully.");
        return NextResponse.json(
            { message: "Reservation created", reservation: newReservation },
            { status: 201 }
        );
    } catch (error) {
        console.error("Create reservation error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
