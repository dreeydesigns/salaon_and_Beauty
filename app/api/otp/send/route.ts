/**
 * POST /api/otp/send
 *
 * Generates a 6-digit OTP, stores a SHA-256 hash in `otp_codes`,
 * and delivers the code via Africa's Talking SMS.
 *
 * Body: { phone: string }   — must be E.164, e.g. "+254743817931"
 */

import { NextRequest, NextResponse } from "next/server";
import { sql } from "@vercel/postgres";
import crypto from "crypto";
import { isValidE164Broad } from "@/lib/phone-utils";

export async function POST(req: NextRequest) {
  const body = (await req.json().catch(() => null)) as { phone?: unknown } | null;
  const phone = body?.phone;

  if (!isValidE164Broad(phone)) {
    return NextResponse.json(
      { ok: false, error: "Invalid phone number. Use international format, e.g. +254743817931" },
      { status: 400 },
    );
  }

  // ── Generate & hash OTP ────────────────────────────────────────────────────
  const otp     = crypto.randomInt(100_000, 999_999).toString();
  const otpHash = crypto.createHash("sha256").update(otp).digest("hex");

  // ── Persist (upsert — one active OTP per phone at a time) ─────────────────
  try {
    await sql`
      INSERT INTO otp_codes (phone, otp_hash, expires_at, attempts)
      VALUES (${phone}, ${otpHash}, NOW() + INTERVAL '5 minutes', 0)
      ON CONFLICT (phone) DO UPDATE
        SET otp_hash   = ${otpHash},
            expires_at = NOW() + INTERVAL '5 minutes',
            attempts   = 0,
            created_at = NOW()
    `;
  } catch (dbError) {
    console.error("[OTP] DB error:", dbError);
    return NextResponse.json(
      { ok: false, error: "Database error: " + String(dbError) },
      { status: 500 },
    );
  }

  // ── Send via Africa's Talking HTTP API ─────────────────────────────────────
  const AT_USERNAME = process.env.AT_USERNAME;
  const AT_API_KEY  = process.env.AT_API_KEY;

  if (!AT_USERNAME || !AT_API_KEY) {
    console.error("[OTP] Missing AT_USERNAME or AT_API_KEY env vars");
    return NextResponse.json(
      { ok: false, error: "SMS service is not configured." },
      { status: 503 },
    );
  }

  const message =
    `Your Mobile Salon code is: ${otp}. ` +
    `Valid for 5 minutes. Do not share this code.`;

  console.log(`[OTP] Sending to ${phone} via AT username="${AT_USERNAME}"`);

  let atResult: unknown;
  try {
    const atRes = await fetch(
      "https://api.africastalking.com/version1/messaging",
      {
        method:  "POST",
        headers: {
          Accept:         "application/json",
          "Content-Type": "application/x-www-form-urlencoded",
          apiKey:         AT_API_KEY,
        },
        body: new URLSearchParams({
          username: AT_USERNAME,
          to:       phone,
          message,
        }).toString(),
      },
    );

    atResult = await atRes.json();
    console.log("[OTP] AT response:", JSON.stringify(atResult));
  } catch (smsError) {
    console.error("[OTP] AT fetch failed:", smsError);
    return NextResponse.json(
      { ok: false, error: "Could not reach SMS gateway. Try again." },
      { status: 502 },
    );
  }

  const typed = atResult as {
    SMSMessageData?: { Recipients?: { statusCode?: number; status?: string; number?: string }[] };
  };
  const recipient  = typed?.SMSMessageData?.Recipients?.[0];
  const statusCode = recipient?.statusCode;

  // 101 = Sent, 102 = Sent to queue (both acceptable)
  if (statusCode !== 101 && statusCode !== 102) {
    console.error("[OTP] AT rejected send. recipient:", JSON.stringify(recipient));
    return NextResponse.json(
      {
        ok: false,
        error: `SMS not delivered (AT status ${statusCode ?? "unknown"}): ${recipient?.status ?? "no status"}`,
      },
      { status: 502 },
    );
  }

  console.log(`[OTP] SMS dispatched successfully to ${phone}, AT statusCode=${statusCode}`);
  return NextResponse.json({ ok: true, message: "Code sent" });
}
