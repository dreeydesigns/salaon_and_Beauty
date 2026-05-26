import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';
import { sendOTP } from '@/lib/africas-talking';
import crypto from 'crypto';

/**
 * Send OTP to phone number for verification
 * POST /api/auth/send-otp
 */
export async function POST(req: NextRequest) {
  try {
    const { phone } = await req.json();

    if (!phone) {
      return NextResponse.json(
        { error: 'Phone number is required' },
        { status: 400 }
      );
    }

    // Generate 6-digit OTP
    const otp = crypto.randomInt(100000, 999999).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Store OTP in database
    await sql`
      INSERT INTO otps (phone, code, expires_at)
      VALUES (${phone}, ${otp}, ${expiresAt.toISOString()})
    `;

    // Send SMS
    await sendOTP(phone, otp);

    return NextResponse.json({
      success: true,
      message: 'OTP sent successfully',
    });
  } catch (error) {
    console.error('Send OTP error:', error);
    return NextResponse.json(
      { error: 'Failed to send OTP', details: String(error) },
      { status: 500 }
    );
  }
}
