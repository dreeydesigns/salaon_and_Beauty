import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  // =========================================================================
  // FIREBASE MIGRATION NOTE:
  // This backend route is obsolete. Firebase handles OTPs client-side.
  // =========================================================================

  return NextResponse.json({ 
    success: true,
    message: 'OTP is now handled client-side by Firebase.'
  });
}