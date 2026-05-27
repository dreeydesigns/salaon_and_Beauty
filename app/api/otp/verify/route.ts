/**
 * POST /api/otp/verify
 *
 * Verifies a 6-digit OTP against the hashed value in `otp_codes`.
 * Enforces expiry and a 5-attempt limit. Deletes the record on success.
 *
 * Body: { phone: string, otp: string }
 */

import { NextRequest, NextResponse } from "next/server";
import { sql } from "@vercel/postgres";
import crypto from "crypto";
import { isValidE164Broad } from "@/lib/phone-utils";

export async function POST(req: NextRequest) {
  const body = (await req.json().catch(() => null)) as {
    phone?: unknown;
    otp?: unknown;
  } | null;

  const phone = body?.phone;
  const otp   = body?.otp;

  if (!isValidE164Broad(phone)) {
    return NextResponse.json(
      { ok: false, error: "Invalid phone number." },
      { status: 400 },
    );
  }

  if (typeof otp !== "string" || !/^\d{6}$/.test(otp)) {
    return NextResponse.json(
      { ok: false, error: "A 6-digit code is required." },
      { status: 400 },
    );
  }

  try {
    // Look up the stored record
    const { rows } = await sql`
      SELECT otp_hash, expires_at, attempts
      FROM otp_codes
      WHERE phone = ${phone}
    `;

    if (rows.length === 0) {
      return NextResponse.json(
        { ok: false, error: "No code found. Request a new one." },
        { status: 404 },
      );
    }

    const { otp_hash, expires_at, attempts } = rows[0];

    // Check expiry
    if (new Date() > new Date(expires_at as string)) {
      await sql`DELETE FROM otp_codes WHERE phone = ${phone}`;
      return NextResponse.json(
        { ok: false, error: "Code has expired. Request a new one." },
        { status: 410 },
      );
    }

    // Check attempt limit
    if ((attempts as number) >= 5) {
      await sql`DELETE FROM otp_codes WHERE phone = ${phone}`;
      return NextResponse.json(
        { ok: false, error: "Too many incorrect attempts. Request a new code." },
        { status: 429 },
      );
    }

    // Compare hashes
    const submittedHash = crypto.createHash("sha256").update(otp).digest("hex");

    if (submittedHash !== (otp_hash as string)) {
      await sql`
        UPDATE otp_codes SET attempts = attempts + 1 WHERE phone = ${phone}
      `;
      const remaining = 4 - (attempts as number);
      return NextResponse.json(
        {
          ok: false,
          error: `Incorrect code. ${remaining} attempt${remaining === 1 ? "" : "s"} remaining.`,
        },
        { status: 401 },
      );
    }

    // ✓ Correct — delete so it cannot be reused
    await sql`DELETE FROM otp_codes WHERE phone = ${phone}`;

    return NextResponse.json({ ok: true, verified: true, success: true });
  } catch (error) {
    console.error("Verify OTP error:", error);
    return NextResponse.json(
      { ok: false, error: "Server error. Please try again." },
      { status: 500 },
    );
  }
}
