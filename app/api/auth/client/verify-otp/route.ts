import { NextResponse } from "next/server";

function isKenyanPhone(phone: unknown) {
  return typeof phone === "string" && /^\+2547\d{8}$/.test(phone);
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as { phone?: unknown; code?: unknown } | null;

  if (!isKenyanPhone(body?.phone)) {
    return NextResponse.json({ ok: false, verified: false, message: "Invalid phone number." }, { status: 400 });
  }

  const verified = typeof body?.code === "string" && /^\d{6}$/.test(body.code);

  return NextResponse.json(
    {
      ok: verified,
      verified,
    },
    { status: verified ? 200 : 401 },
  );
}
