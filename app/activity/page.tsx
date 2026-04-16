import { AppShell } from "@/components/app-shell";
import { CTAButton, SectionReveal } from "@/components/marketplace-ui";
import { activityItems } from "@/lib/site-data";

export default function ActivityPage() {
  return (
    <AppShell currentNav="activity" roleMode="salons">
      <div className="section-grid">
        <SectionReveal className="rounded-[36px] bg-white p-6 shadow-[0_18px_48px_rgba(13,27,42,0.08)] lg:p-8">
          <p className="text-xs uppercase tracking-[0.22em] text-[var(--ms-mauve)]">Activity</p>
          <h1 className="mt-3 text-4xl font-semibold text-[var(--ms-navy)]">Keep bookings, saves, and follow-ups in one calm place.</h1>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-[var(--ms-mauve)]">
            Upcoming appointments, recent requests, and saved providers stay organised without making the interface feel heavy.
          </p>
        </SectionReveal>

        <div className="grid gap-5 xl:grid-cols-3">
          {activityItems.map((item) => (
            <SectionReveal className="rounded-[28px] bg-white p-5 shadow-[0_12px_40px_rgba(13,27,42,0.08)]" key={item.title}>
              <p className="text-xs uppercase tracking-[0.22em] text-[var(--ms-mauve)]">{item.title}</p>
              <h2 className="mt-3 text-2xl font-semibold text-[var(--ms-navy)]">{item.detail}</h2>
              <p className="mt-3 text-sm leading-7 text-[var(--ms-mauve)]">{item.meta}</p>
            </SectionReveal>
          ))}
        </div>

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
