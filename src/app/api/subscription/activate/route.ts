import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { getTokenFromRequest, verifyToken } from "@/lib/auth";
import { User } from "@/models/User";

export const runtime = "nodejs";

type ActivateBody = {
  subscriptionId?: string;
};

export async function POST(request: Request) {
  try {
    const token = getTokenFromRequest(request);
    if (!token) {
      return NextResponse.json({ error: "Missing token." }, { status: 401 });
    }

    const payload = verifyToken(token);
    const body = (await request.json()) as ActivateBody;
    const subscriptionId = body.subscriptionId?.trim();

    if (!subscriptionId) {
      return NextResponse.json({ error: "Missing subscription id." }, { status: 400 });
    }

    await connectToDatabase();
    const user = await User.findByIdAndUpdate(
      payload.sub,
      { subscriptionStatus: "active", subscriptionId },
      { new: true }
    );

    if (!user) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.fullName,
        fullName: user.fullName,
        subscriptionStatus: user.subscriptionStatus,
        subscriptionId: user.subscriptionId,
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unexpected error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
