"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AppShell } from "@/components/app-shell";
import { CTAButton, SectionReveal } from "@/components/marketplace-ui";
import { ClientRatingFlow } from "@/components/service-session";
import { readAppSession } from "@/lib/client-session";
import {
  getClientBookings,
  SOCIAL_CHANGE_EVENT,
  type BookingRequest,
} from "@/lib/social-store";
import { cn } from "@/lib/utils";

const STATUS_COLORS: Record<string, string> = {
  pending:               "bg-amber-100 text-amber-700",
  accepted:              "bg-green-100 text-green-700",
  completed:             "bg-blue-100 text-blue-700",
  cancelled:             "bg-red-100 text-red-600",
  declined:              "bg-red-100 text-red-600",
  reschedule_requested:  "bg-purple-100 text-purple-700",
  draft:                 "bg-gray-100 text-gray-500",
};

function BookingCard({ booking }: { booking: BookingRequest }) {
  const date = new Date(booking.preferredDate).toLocaleDateString("en-KE", {
    weekday: "short", day: "numeric", month: "short", year: "numeric",
  });
  return (
    <div className="rounded-[24px] bg-white p-5 shadow-[0_8px_28px_rgba(13,27,42,0.07)]">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-[var(--ms-navy)]">{booking.targetName}</p>
          <p className="mt-0.5 text-xs text-[var(--ms-mauve)]">{booking.services.join(", ")}</p>
        </div>
        <span className={cn("shrink-0 rounded-full px-2.5 py-1 text-[10px] font-semibold capitalize", STATUS_COLORS[booking.status] ?? "bg-gray-100 text-gray-500")}>
          {booking.status.replace(/_/g, " ")}
        </span>
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[var(--ms-mauve)]">
        <span>{date}</span>
        <span>{booking.preferredTime}</span>
        {booking.location && <span>{booking.location}</span>}
        <span className="font-semibold text-[var(--ms-navy)]">KES {booking.totalKES.toLocaleString()}</span>
      </div>
    </div>
  );
}

export default function ActivityPage() {
  const [bookings, setBookings] = useState<BookingRequest[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    function sync() {
      const session = readAppSession();
      if (!session || session.role === "guest") { setLoaded(true); return; }
      const myBookings = getClientBookings(session.id);
      setBookings(myBookings.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
      setLoaded(true);
    }
    sync();
    window.addEventListener(SOCIAL_CHANGE_EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(SOCIAL_CHANGE_EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  return (
    <AppShell currentNav="activity" roleMode="salons" requireSession>
      <ClientRatingFlow />

      <div className="section-grid">
        <SectionReveal className="rounded-[36px] bg-white p-6 shadow-[0_18px_48px_rgba(13,27,42,0.08)] lg:p-8">
          <p className="text-xs uppercase tracking-[0.22em] text-[var(--ms-mauve)]">Activity</p>
          <h1 className="mt-3 text-4xl font-semibold text-[var(--ms-navy)]">Your bookings, saves, and follow-ups — in one place.</h1>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-[var(--ms-mauve)]">
            Upcoming appointments, recent requests, and saved providers stay organised here.
          </p>
        </SectionReveal>

        {loaded && bookings.length === 0 ? (
          <SectionReveal className="rounded-[28px] bg-white p-8 text-center shadow-[0_12px_40px_rgba(13,27,42,0.08)]">
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
              <h2 className="mt-3 text-3xl font-semibold text-[var(--ms-navy)]">Jump back into booking without losing context.</h2>
            </div>
            <CTAButton href="/book">Book again</CTAButton>
          </div>
        </SectionReveal>
      </div>
    </AppShell>
  );
}
