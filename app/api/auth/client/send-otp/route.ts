import { NextResponse } from "next/server";

function isKenyanPhone(phone: unknown) {
  return typeof phone === "string" && /^\+2547\d{8}$/.test(phone);
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as { phone?: unknown; resendCount?: unknown } | null;

  if (!isKenyanPhone(body?.phone)) {
    return NextResponse.json({ ok: false, message: "Use a Kenyan phone number like +2547XXXXXXXX." }, { status: 400 });
  }

  const resendCount = typeof body?.resendCount === "number" ? Math.min(Math.max(body.resendCount, 1), 3) : 1;
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000).toISOString();

  return NextResponse.json({
    ok: true,
    expiresAt,
    resendCount,
  });
}
