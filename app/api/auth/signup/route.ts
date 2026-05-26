import { NextRequest, NextResponse } from 'next/server';
import { createUser, createSession } from '@/lib/auth-server';
import { sql } from '@vercel/postgres';

export async function POST(req: NextRequest) {
  try {
    const { phone, firstName, password, tempToken } = await req.json();

    if (!phone || !firstName || !password || !tempToken) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Verify tempToken is valid (it should be from OTP verification)
    try {
      const decoded = JSON.parse(
        Buffer.from(tempToken, 'base64').toString('utf-8')
      );
      if (decoded.phone !== phone.replace(/[\s\-\+]/g, '')) {
        return NextResponse.json(
          { error: 'Invalid verification token' },
          { status: 400 }
        );
      }
    } catch {
      return NextResponse.json(
        { error: 'Invalid verification token' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existing = await sql`
      SELECT id FROM users WHERE phone = ${phone}
    `;

    if (existing.rows.length > 0) {
      return NextResponse.json(
        { error: 'Phone number already registered' },
        { status: 400 }
      );
    }

    // Create user
    const user = await createUser({
      phone,
      firstName,
      password,
      role: 'client',
    });

    // Create session
    const sessionToken = await createSession(
      user.id,
      'Mobile Device',
      req.headers.get('user-agent') || 'Unknown'
    );

    // Set session cookie
    const response = NextResponse.json({
      success: true,
      message: 'Account created successfully',
      user: { id: user.id, firstName: user.first_name, role: user.role },
    });

    response.cookies.set('session', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 30 * 24 * 60 * 60, // 30 days
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { error: 'Signup failed', details: String(error) },
      { status: 500 }
    );
  }
}