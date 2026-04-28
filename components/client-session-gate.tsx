"use client";

import Link from "next/link";
import { useEffect, useState, type ReactNode } from "react";
import { LockKeyhole, Sparkles } from "lucide-react";

import { APP_SESSION_EVENT, readAppSession } from "@/lib/client-session";

export function ClientSessionGate({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const [hasSession, setHasSession] = useState(false);

  useEffect(() => {
    function syncSession() {
      setHasSession(Boolean(readAppSession()));
      setReady(true);
    }

    syncSession();
    window.addEventListener("storage", syncSession);
    window.addEventListener(APP_SESSION_EVENT, syncSession);

    return () => {
      window.removeEventListener("storage", syncSession);
      window.removeEventListener(APP_SESSION_EVENT, syncSession);
    };
  }, []);

  if (!ready) {
    return (
      <section className="mx-auto max-w-2xl rounded-[34px] bg-white p-8 text-center shadow-[0_18px_48px_rgba(13,27,42,0.08)]">
        <div className="loader-bloom mx-auto h-14 w-14" />
        <p className="mt-5 text-sm font-semibold text-[var(--ms-mauve)]">Opening your Mobile Salon world...</p>
      </section>
    );
  }

  if (hasSession) {
    return children;
  }

  return (
    <section className="mx-auto max-w-3xl overflow-hidden rounded-[38px] border border-[var(--ms-border)] bg-white p-6 text-center shadow-[0_22px_60px_rgba(13,27,42,0.1)] sm:p-8">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[var(--ms-petal)] text-[var(--ms-rose)]">
        <LockKeyhole className="h-7 w-7" />
      </div>
      <p className="mt-6 text-xs font-semibold uppercase tracking-[0.24em] text-[var(--ms-mauve)]">
        Protected app area
      </p>
      <h1 className="mt-3 font-display text-4xl leading-tight text-[var(--ms-plum)]">
        Choose your account first.
      </h1>
      <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-[var(--ms-mauve)]">
        Mobile Salon keeps bookings, page controls, preferences, and private contact details behind an account so each workspace stays protected.
      </p>
      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        <Link
          className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[linear-gradient(135deg,var(--ms-rose),var(--ms-orchid))] px-5 text-sm font-semibold text-white shadow-[0_16px_34px_rgba(232,62,140,0.24)]"
          href="/auth/sign-up"
        >
          <Sparkles className="h-4 w-4" />
          Create account
        </Link>
        <Link
          className="inline-flex min-h-12 items-center justify-center rounded-full border border-[var(--ms-border)] bg-white px-5 text-sm font-semibold text-[var(--ms-plum)]"
          href="/auth/sign-in?returnTo=/home"
        >
          Sign in
        </Link>
      </div>
      <p className="mt-4 text-xs leading-6 text-[var(--ms-mauve)]">
        You can still explore the public landing page without signing in.
      </p>
    </section>
  );
}
