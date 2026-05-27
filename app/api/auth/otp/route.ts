/**
 * POST /api/auth/otp
 *
 * Legacy OTP send endpoint — kept for backward-compat with /auth/signup page.
 * Delegates to the canonical /api/otp/send implementation.
 *
 * NOTE: AfricasTalking is initialised lazily inside the handler (not at module
 * level) so Vercel's build-time page-data collection does not trigger Joi
 * validation when env vars are empty.
 */
import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';
import crypto from 'crypto';

export async function POST(req: NextRequest) {
  try {
    const { phone } = await req.json();

    // 1. Clean & format phone
    const cleanPhone = (phone ?? '').toString().replace(/\D/g, '');
    const formattedPhone = cleanPhone.startsWith('0')
      ? `+254${cleanPhone.slice(1)}`
      : `+${cleanPhone}`;

    if (formattedPhone.length !== 13) {
      return NextResponse.json({ error: 'Invalid phone number' }, { status: 400 });
    }

    // 2. Generate & hash OTP
    const otpCode = crypto.randomInt(100_000, 999_999).toString();
    const otpHash = crypto.createHash('sha256').update(otpCode).digest('hex');
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString();

    // 3. Save to DB (upsert on otp_codes — same table as /api/otp/send)
    await sql`
      INSERT INTO otp_codes (phone, otp_hash, expires_at, attempts)
      VALUES (${formattedPhone}, ${otpHash}, ${expiresAt}, 0)
      ON CONFLICT (phone) DO UPDATE
        SET otp_hash   = EXCLUDED.otp_hash,
            expires_at = EXCLUDED.expires_at,
            attempts   = 0,
            created_at = NOW()
    `;

    // 4. Send SMS via Africa's Talking HTTP API (no SDK — avoids build-time Joi errors)
    const AT_USERNAME = process.env.AT_USERNAME;
    const AT_API_KEY  = process.env.AT_API_KEY;

    if (!AT_USERNAME || !AT_API_KEY) {
      return NextResponse.json({ error: 'SMS service not configured' }, { status: 503 });
    }

    const atRes = await fetch('https://api.africastalking.com/version1/messaging', {
      method:  'POST',
      headers: {
        Accept:         'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',
        apiKey:         AT_API_KEY,
      },
      body: new URLSearchParams({
        username: AT_USERNAME,
        to:       formattedPhone,
        message:  `Your Mobile Salon code is: ${otpCode}. Valid for 10 minutes.`,
      }).toString(),
    });

    const atData = await atRes.json() as {
      SMSMessageData?: { Recipients?: { statusCode?: number }[] };
    };
    const statusCode = atData?.SMSMessageData?.Recipients?.[0]?.statusCode;

    if (statusCode !== 101 && statusCode !== 102) {
      return NextResponse.json({ error: 'Failed to send SMS' }, { status: 502 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[OTP legacy] Error:', error);
    return NextResponse.json({ error: 'Failed to send' }, { status: 500 });
  }
}