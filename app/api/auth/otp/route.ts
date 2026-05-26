import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';
const AfricasTalking = require('africastalking');

const at = AfricasTalking({
  apiKey: process.env.AFRICASTALKING_API_KEY,
  username: process.env.AFRICASTALKING_USERNAME,
});

export async function POST(req: NextRequest) {
  try {
    const { phone } = await req.json();
    
    // 1. Clean phone (strip all non-numbers)
    const cleanPhone = phone.toString().replace(/\D/g, '');
    
    // 2. Format to +254...
    const formattedPhone = cleanPhone.startsWith('0') 
      ? `+254${cleanPhone.slice(1)}` 
      : `+${cleanPhone}`;

    if (formattedPhone.length !== 13) {
      return NextResponse.json({ error: 'Invalid phone number' }, { status: 400 });
    }

    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString();

    // 3. Save to DB
    await sql`INSERT INTO otp_codes (phone, code, expires_at) VALUES (${formattedPhone}, ${otpCode}, ${expiresAt})`;

    // 4. Send SMS
    await at.SMS.send({
      to: [formattedPhone],
      message: `Your verification code is: ${otpCode}`,
      from: 'MobileSalon'
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('OTP Error:', error);
    return NextResponse.json({ error: 'Failed to send' }, { status: 500 });
  }
}