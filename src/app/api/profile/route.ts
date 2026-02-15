
import { connectToDatabase } from "@/lib/db";
import { User } from "@/models/User";
import { getTokenFromRequest, verifyToken, hashPassword } from "@/lib/auth";
import { NextResponse } from "next/server";
import { z } from "zod";

const updateProfileSchema = z.object({
    fullName: z.string().min(2).optional(),
    email: z.string().email().optional(),
    password: z.string().min(6).optional(),
});

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
        const user = await User.findById(userId).select("-passwordHash -__v");

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        return NextResponse.json({ user });
    } catch (error) {
        console.error("Fetch profile error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

export async function PUT(request: Request) {
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

        const body = await request.json();
        const result = updateProfileSchema.safeParse(body);

        if (!result.success) {
            return NextResponse.json(
                { error: "Validation failed", details: result.error.format() },
                { status: 400 }
            );
        }

        const { fullName, email, password } = result.data as any;
        const updateData: any = {};

        if (fullName) updateData.fullName = fullName;
        if (email) updateData.email = email;
        if (password) {
            updateData.passwordHash = await hashPassword(password);
        }

        await connectToDatabase();
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { $set: updateData },
            { new: true, runValidators: true }
        ).select("-passwordHash -__v");

        return NextResponse.json({ user: updatedUser, message: "Profile updated successfully" });
    } catch (error) {
        console.error("Update profile error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
