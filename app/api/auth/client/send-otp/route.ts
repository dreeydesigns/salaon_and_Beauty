import { NextResponse } from "next/server";
import { sql } from "@vercel/postgres";
import { sendOTP } from "@/lib/africas-talking";
import crypto from "crypto";

function isKenyanPhone(phone: unknown) {
  return typeof phone === "string" && /^\+2547\d{8}$/.test(phone);
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as {
    phone?: unknown;
    resendCount?: unknown;
  } | null;

  if (!isKenyanPhone(body?.phone)) {
    return NextResponse.json(
      { ok: false, message: "Use a Kenyan phone number like +2547XXXXXXXX." },
      { status: 400 }
    );
  }

  const phone = body!.phone as string;
  const resendCount =
    typeof body?.resendCount === "number"
      ? Math.min(Math.max(body.resendCount, 1), 3)
      : 1;

  try {
    // Generate 6-digit OTP
    const otp = crypto.randomInt(100000, 999999).toString();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    // Store OTP in database
    await sql`
      INSERT INTO otps (phone, code, expires_at)
      VALUES (${phone}, ${otp}, ${expiresAt.toISOString()})
    `;

    // Send OTP via Africa's Talking
    await sendOTP(phone, otp);

    return NextResponse.json({
      ok: true,
      expiresAt: expiresAt.toISOString(),
      resendCount,
    });
  } catch (error) {
    console.error("Send OTP error:", error);
    return NextResponse.json(
      { ok: false, message: "Failed to send OTP. Please try again." },
      { status: 500 }
    );
  }
}
