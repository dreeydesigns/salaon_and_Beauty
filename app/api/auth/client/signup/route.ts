import { NextResponse } from "next/server";

import { getThemeConfig, normalizeThemeKey, type ClientLocation } from "@/lib/personalization";

function isKenyanPhone(phone: unknown) {
  return typeof phone === "string" && /^\+2547\d{8}$/.test(phone);
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as {
    firstName?: unknown;
    phone?: unknown;
    password?: unknown;
    theme?: unknown;
    tribeBadge?: unknown;
    location?: ClientLocation;
  } | null;

  const firstName = typeof body?.firstName === "string" ? body.firstName.trim() : "";
  const phone = typeof body?.phone === "string" ? body.phone : "";
  const theme = normalizeThemeKey(typeof body?.theme === "string" ? body.theme : null);
  const themeConfig = getThemeConfig(theme);

  if (!firstName || !isKenyanPhone(phone) || typeof body?.password !== "string" || body.password.length < 8) {
    return NextResponse.json({ ok: false, message: "Missing or invalid signup details." }, { status: 400 });
  }

  return NextResponse.json({
    ok: true,
    profile: {
      id: `preview_${Date.now()}`,
      role: "client",
      firstName,
      phone,
      theme,
      tribeBadge: typeof body.tribeBadge === "string" ? body.tribeBadge : themeConfig.tribeBadge,
      quizCompleted: theme !== "not_set",
      themeSetBy: theme === "not_set" ? "fallback" : "quiz",
      themeUpdatedAt: new Date().toISOString(),
      location: body.location,
      subscription: {
        tier: "none",
        status: "teaser",
      },
      tribes: theme === "not_set" ? [] : [theme],
      createdAt: new Date().toISOString(),
    },
  });
}
