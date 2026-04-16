import { Suspense } from "react";

import { AppShell } from "@/components/app-shell";
import { BookingExperience } from "@/components/booking-experience";
import { SectionReveal } from "@/components/marketplace-ui";

export default function BookPage() {
  return (
    <AppShell currentNav="book" roleMode="salons">
      <Suspense
        fallback={
          <SectionReveal className="rounded-[36px] bg-white p-6 text-center shadow-[0_18px_48px_rgba(13,27,42,0.08)]">
            <p className="text-sm text-[var(--ms-mauve)]">Loading booking flow...</p>
          </SectionReveal>
        }
      >
        <BookingExperience />
      </Suspense>
    </AppShell>
  );
}
