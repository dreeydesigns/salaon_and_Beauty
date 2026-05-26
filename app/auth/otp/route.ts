import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';

// Initialize Africa's Talking with your sandbox credentials
const credentials = {
  apiKey: 'atsk_0b456af06d638c7c11a13e86e771233caa9c4c23e5ca90c42f91f5aeda5c47831c9ad834',
  username: 'sandbox',
};

const AfricasTalking = require('africastalking')(credentials);
const sms = AfricasTalking.SMS;

export async function POST(req: NextRequest) {
  try {
    const { phone } = await req.json();

    if (!phone) {
      return NextResponse.json(
        { error: 'Phone number is required' },
        { status: 400 }
      );
    }

    // Clean phone number format (Remove spaces, hyphens)
    const formattedPhone = phone.replace(/[\s\-]/g, '');

    // 1. Generate a secure, highly readable 6-digit verification code
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

    // 2. Set code expiration threshold (valid for 10 minutes)
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    // 3. Commit code to your Neon DB 'otp_codes' table
    // Converted expiresAt to ISO string to resolve the Primitive type tracking error
    await sql`
      INSERT INTO otp_codes (phone, code, expires_at)
      VALUES (${formattedPhone}, ${otpCode}, ${expiresAt.toISOString()})
    `;

    // 4. Draft the transactional message structure
    const messagePayload = {
      to: [formattedPhone],
      message: `Your Salon & Beauty verification code is: ${otpCode}. Valid for 10 minutes.`,
    };

    // 5. Send code via Africa's Talking SMS Gateway
    const response = await sms.send(messagePayload);
    console.log('SMS Sent Successfully:', response);

    return NextResponse.json({
      success: true,
      message: 'Verification code sent successfully',
      sandboxCode: otpCode, // For easy retrieval during workspace testing
    });

  } catch (error) {
    console.error('OTP Route Error:', error);
    return NextResponse.json(
      { error: 'Failed to process OTP request', details: String(error) },
      { status: 500 }
    );
  }
}