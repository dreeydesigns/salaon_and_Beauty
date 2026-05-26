import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';
const AfricasTalking = require('africastalking');

// Initialize with environment variables
const at = AfricasTalking({
  apiKey: process.env.AFRICASTALKING_API_KEY,
  username: process.env.AFRICASTALKING_USERNAME,
});

export async function POST(req: NextRequest) {
  try {
    const { phone } = await req.json();

    // 1. Sanitize: Keep only numbers
    const cleanPhone = phone.toString().replace(/\D/g, '');

    // 2. Format: Ensure it's +254... (12 digits total)
    // If it starts with '0', remove the '0' and add '254'
    let formattedPhone = cleanPhone;
    if (formattedPhone.startsWith('0')) {
      formattedPhone = '254' + formattedPhone.slice(1);
    }
    
    // Add the plus sign
    const finalPhone = `+${formattedPhone}`;

    // 3. Validation: Must be 12 digits (e.g., +254700000000)
    if (finalPhone.length !== 13) {
      return NextResponse.json({ error: 'Invalid Kenyan phone number format' }, { status: 400 });
    }

    // 4. Generate Code
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString();

    // 5. Database Save
    await sql`INSERT INTO otp_codes (phone, code, expires_at) VALUES (${finalPhone}, ${otpCode}, ${expiresAt})`;

    // 6. Send SMS
    await at.SMS.send({
      to: [finalPhone],
      message: `Your verification code is: ${otpCode}`,
      from: 'MobileSalon' // Ensure this matches your dashboard setting
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('OTP Error:', error);
    return NextResponse.json({ error: 'Failed to send OTP' }, { status: 500 });
  }
}