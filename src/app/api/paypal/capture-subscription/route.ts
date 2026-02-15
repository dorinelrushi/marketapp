import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST() {
  return NextResponse.json(
    { message: "Capture is not required for PayPal subscriptions." },
    { status: 200 }
  );
}
