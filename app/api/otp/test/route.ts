/**
 * GET /api/otp/test
 *
 * Diagnostic endpoint — checks every layer of the OTP pipeline:
 *  1. Are AT env vars present?
 *  2. Can we reach the AT API?
 *  3. Does the otp_codes table exist?
 *
 * Protected by CRON_SECRET so it can't be called publicly.
 * Usage: GET /api/otp/test?secret=<CRON_SECRET>
 */

import { NextRequest, NextResponse } from "next/server";
import { sql } from "@vercel/postgres";

export async function GET(req: NextRequest) {
  const secret = new URL(req.url).searchParams.get("secret");
  if (secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const results: Record<string, unknown> = {};

  // ── 1. Env vars ─────────────────────────────────────────────────────────────
  results.env = {
    AT_USERNAME_set: !!process.env.AT_USERNAME,
    AT_USERNAME_value: process.env.AT_USERNAME ?? "(missing)",
    AT_API_KEY_set: !!process.env.AT_API_KEY,
    AT_API_KEY_prefix: process.env.AT_API_KEY?.slice(0, 12) ?? "(missing)",
    POSTGRES_URL_set: !!process.env.POSTGRES_URL,
  };

  // ── 2. Database — does otp_codes table exist? ───────────────────────────────
  try {
    const { rows } = await sql`
      SELECT COUNT(*) as count FROM otp_codes LIMIT 1
    `;
    results.database = { ok: true, otp_codes_rows: rows[0]?.count ?? 0 };
  } catch (err) {
    results.database = {
      ok: false,
      error: String(err),
      hint: "Run POST /api/init with x-cron-secret header to create the table",
    };
  }

  // ── 3. Africa's Talking reachability ───────────────────────────────────────
  const AT_USERNAME = process.env.AT_USERNAME;
  const AT_API_KEY  = process.env.AT_API_KEY;

  if (AT_USERNAME && AT_API_KEY) {
    try {
      // Fetch account balance — lightweight endpoint that uses same auth
      const balRes = await fetch(
        `https://api.africastalking.com/version1/user?username=${AT_USERNAME}`,
        {
          headers: {
            Accept: "application/json",
            apiKey: AT_API_KEY,
          },
        },
      );
      const balData = await balRes.json();
      results.africasTalking = {
        ok: balRes.ok,
        httpStatus: balRes.status,
        response: balData,
      };
    } catch (err) {
      results.africasTalking = { ok: false, error: String(err) };
    }
  } else {
    results.africasTalking = { ok: false, error: "Missing env vars — skipped" };
  }

  return NextResponse.json(results, { status: 200 });
}
