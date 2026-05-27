import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  // =========================================================================
  // FIREBASE MIGRATION NOTE:
  // Firebase Phone Authentication handles OTPs entirely on the client-side.
  // This backend route is no longer used to generate or send SMS messages.
  // 
  // Next Steps: 
  // 1. Ensure your signup page uses Firebase's `signInWithPhoneNumber`.
  // 2. Once your frontend no longer calls `fetch('/api/auth/otp')`, 
  //    you can safely delete this entire file and folder.
  // =========================================================================

  try {
    // We parse the JSON just to ensure the request is valid, 
    // but we do not process the phone number here anymore.
    const body = await req.json();

    return NextResponse.json({ 
      success: true,
      message: 'OTP routing is now handled client-side by Firebase.'
    });
    
  } catch (error) {
    console.error('[OTP Legacy Stub] Error:', error);
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}