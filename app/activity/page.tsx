"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AppShell } from "@/components/app-shell";
import { CTAButton, SectionReveal } from "@/components/marketplace-ui";
import { ClientRatingFlow } from "@/components/service-session";
import { ErrorBoundary } from "@/components/error-boundary";
import { readAppSession } from "@/lib/client-session";
import {
  getClientBookings,
  writeBooking,
  SOCIAL_CHANGE_EVENT,
  type BookingRequest,
} from "@/lib/social-store";
import { signalSessionExpired } from "@/components/session-expiry-modal";
import { BookingTimeline, TrustShield } from "@/components/wow-ux";
import { cn } from "@/lib/utils";

function SkeletonCard() {
  return (
    <div className="rounded-[24px] bg-white p-5 shadow-[0_8px_28px_rgba(13,27,42,0.07)]">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 space-y-2">
          <div className="skeleton h-4 w-2/3" />
          <div className="skeleton h-3 w-1/2" />
        </div>
        <div className="skeleton h-6 w-16 shrink-0" />
      </div>
      <div className="mt-3 flex gap-4">
        <div className="skeleton h-3 w-24" />
        <div className="skeleton h-3 w-16" />
        <div className="skeleton h-3 w-20" />
      </div>
      <div className="skeleton mt-4 h-8 w-full" style={{ borderRadius: "0.75rem" }} />
    </div>
  );
}

function BookingCard({ booking }: { booking: BookingRequest }) {
  const dateStr = (() => {
    try {
      return new Date(booking.preferredDate).toLocaleDateString("en-KE", {
        weekday: "short", day: "numeric", month: "short", year: "numeric",
      });
    } catch { return booking.preferredDate; }
  })();

  return (
    <div className="card-lift rounded-[24px] bg-white p-5 shadow-[0_8px_28px_rgba(13,27,42,0.07)]">
      {/* Header row */}
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-[var(--ms-navy)]">{booking.targetName}</p>
          <p className="mt-0.5 text-xs text-[var(--ms-mauve)]">{booking.services.join(", ")}</p>
        </div>
        <span className="shrink-0 text-base font-bold text-[var(--ms-navy)]">
          KES {booking.totalKES.toLocaleString()}
        </span>
      </div>

      {/* Meta row */}
      <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[var(--ms-mauve)]">
        <span>{dateStr}</span>
        <span>·</span>
        <span>{booking.preferredTime}</span>
        {booking.location && <><span>·</span><span>{booking.location}</span></>}
      </div>

      {/* Animated timeline */}
      <div className="mt-4">
        <BookingTimeline status={booking.status as Parameters<typeof BookingTimeline>[0]["status"]} />
      </div>

      {/* Trust shield for active bookings */}
      {(booking.status === "pending" || booking.status === "accepted") && (
        <div className="mt-3">
          <TrustShield variant="payment" />
        </div>
      )}
    </div>
  );
}

export default function ActivityPage() {
  const [bookings, setBookings] = useState<BookingRequest[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadBookings() {
    const session = readAppSession();
    if (!session || session.role === "guest") { setLoading(false); return; }

    // Load from localStorage immediately
    const local = getClientBookings(session.id)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    setBookings(local);
    setLoading(false);

    // Then try DB and merge (DB is source of truth for status)
    try {
      const res = await fetch("/api/bookings", { credentials: "include" });
      if (res.status === 401) { signalSessionExpired(); return; }
      if (!res.ok) return;
      const data = await res.json() as { ok: boolean; bookings?: Array<{
        local_id?: string; id: string; service_names?: string[];
        provider_name?: string; provider_slug?: string; target_type?: string;
        booking_date: string; booking_time: string; total_kes?: number;
        notes?: string; status: string; created_at: string; updated_at: string;
      }> };
      if (!data.ok || !data.bookings) return;

      // Merge: write any DB bookings not yet in localStorage
      for (const dbB of data.bookings) {
        const localId = dbB.local_id ?? dbB.id;
        const exists = local.some((b) => b.id === localId || b.id === dbB.id);
        if (!exists) {
          const mapped: BookingRequest = {
            id: localId,
            clientId: session.id,
            clientName: session.role === "client" ? (session as { firstName: string }).firstName : "User",
            targetType: (dbB.target_type ?? "professionals") as "salons" | "professionals",
            targetSlug: dbB.provider_slug ?? "",
            targetName: dbB.provider_name ?? "Provider",
            services: dbB.service_names ?? [],
            preferredDate: dbB.booking_date,
            preferredTime: dbB.booking_time,
            totalKES: dbB.total_kes ?? 0,
            notes: dbB.notes ?? undefined,
            status: dbB.status as BookingRequest["status"],
            createdAt: dbB.created_at,
            updatedAt: dbB.updated_at,
          };
          writeBooking(mapped);
        }
      }

      // Re-read localStorage (now includes DB bookings)
      const merged = getClientBookings(session.id)
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      setBookings(merged);
    } catch { /* stay with localStorage */ }
  }

  useEffect(() => {
    void loadBookings();

    function onStorageChange() {
      const session = readAppSession();
      if (!session) return;
      const local = getClientBookings(session.id)
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      setBookings(local);
    }

    window.addEventListener(SOCIAL_CHANGE_EVENT, onStorageChange);
    window.addEventListener("storage", onStorageChange);
    return () => {
      window.removeEventListener(SOCIAL_CHANGE_EVENT, onStorageChange);
      window.removeEventListener("storage", onStorageChange);
    };
  }, []);

  return (
    <AppShell currentNav="activity" requireSession>
      <ClientRatingFlow />
      <ErrorBoundary>
      <div className="section-grid">
        <SectionReveal className="rounded-[36px] bg-white p-6 shadow-[0_18px_48px_rgba(13,27,42,0.08)] lg:p-8">
          <p className="text-xs uppercase tracking-[0.22em] text-[var(--ms-mauve)]">Activity</p>
          <h1 className="mt-3 text-4xl font-semibold text-[var(--ms-navy)]">
            Your bookings, saves, and follow-ups — in one place.
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-[var(--ms-mauve)]">
            Upcoming appointments, recent requests, and status updates stay organised here.
          </p>
        </SectionReveal>

        {loading ? (
          <div className="grid gap-4 xl:grid-cols-2">
            {[1, 2, 3].map((n) => <SkeletonCard key={n} />)}
          </div>
        ) : bookings.length === 0 ? (
          <SectionReveal className="rounded-[28px] bg-white p-10 text-center shadow-[0_12px_40px_rgba(13,27,42,0.08)]">
            <p className="text-3xl font-semibold text-[var(--ms-navy)]">No bookings yet</p>
            <p className="mt-3 text-sm leading-7 text-[var(--ms-mauve)]">
              When you book a service, it will appear here so you can track its status.
            </p>
            <Link
              href="/discover"
              className="mt-5 inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[var(--ms-rose)] px-7 text-sm font-semibold text-white shadow-[0_8px_22px_rgba(212,83,126,0.22)] transition hover:brightness-110"
            >
              Browse services
            </Link>
          </SectionReveal>
        ) : (
          <div className="grid gap-4 xl:grid-cols-2">
            {bookings.map((b) => <BookingCard key={b.id} booking={b} />)}
          </div>
        )}

        <SectionReveal className="rounded-[32px] bg-white p-6 shadow-[0_18px_48px_rgba(13,27,42,0.08)]">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.22em] text-[var(--ms-mauve)]">Need a fresh request?</p>
              <h2 className="mt-3 text-3xl font-semibold text-[var(--ms-navy)]">
                Jump back into booking without losing context.
              </h2>
            </div>
            <CTAButton href="/book">Book again</CTAButton>
          </div>
        </SectionReveal>
      </div>
      </ErrorBoundary>
    </AppShell>
  );
}
