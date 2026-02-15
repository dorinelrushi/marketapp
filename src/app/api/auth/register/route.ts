
import { connectToDatabase } from "@/lib/db";
import { User } from "@/models/User";
import { hashPassword, signToken } from "@/lib/auth";
import { NextResponse } from "next/server";
import { z } from "zod";

const registerSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  phone: z.string().optional().or(z.literal("")),
  role: z.enum(["admin", "client"]).optional(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log("Register Request Body:", body);
    const result = registerSchema.safeParse(body);

    if (!result.success) {
      console.error("Register Validation Error:", result.error.format());
      return NextResponse.json(
        { error: "Validation failed", details: result.error.format() },
        { status: 400 }
      );
    }

    const { fullName, email, password, phone, role } = result.data;

    await connectToDatabase();

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists with this email" },
        { status: 409 } // Conflict
      );
    }

    const passwordHash = await hashPassword(password);

    const newUser = await User.create({
      fullName,
      email,
      passwordHash,
      phone,
      role: "client", // Force client role for public registration
      subscriptionStatus: "inactive",
    });

    const token = signToken(newUser._id.toString());

    // Omitting passwordHash from response
    const userResponse = {
      _id: newUser._id,
      fullName: newUser.fullName,
      name: newUser.fullName,
      email: newUser.email,
      role: newUser.role,
      subscriptionStatus: newUser.subscriptionStatus,
    };

    const response = NextResponse.json(
      { message: "User registered successfully", token, user: userResponse },
      { status: 201 }
    );

    // Set cookie for automatic login ?? Or just return token?
    // Let's return token in body and mostly rely on client managing it, 
    // BUT for middleware protection, cookies are often better. 
    // The prompt says "Authentication using JWT or NextAuth".
    // I will set a cookie as well for middleware to read easily.

    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 1 week
    });

    return response;

  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
