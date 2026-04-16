import { AppShell } from "@/components/app-shell";
import { CTAButton, ProfileCompletionCard, SectionReveal } from "@/components/marketplace-ui";
import { profileCompletionTasks } from "@/lib/site-data";

export default function DashboardPage() {
  return (
    <AppShell currentNav="profile" roleMode="professionals">
      <div className="section-grid">
        <SectionReveal className="rounded-[36px] bg-white p-6 shadow-[0_18px_48px_rgba(13,27,42,0.08)] lg:p-8">
          <p className="text-xs uppercase tracking-[0.22em] text-[var(--ms-mauve)]">Professional dashboard</p>
          <h1 className="mt-3 text-4xl font-semibold text-[var(--ms-navy)]">A serious business home for salons and independent pros.</h1>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-[var(--ms-mauve)]">
            Keep bookings, availability, pricing, reviews, and payout readiness visible without making the workspace feel overwhelming.
          </p>
        </SectionReveal>

        <div className="grid gap-5 xl:grid-cols-[minmax(0,0.34fr)_minmax(0,0.66fr)]">
          <ProfileCompletionCard progress={72} tasks={profileCompletionTasks} />

          <div className="grid gap-5 md:grid-cols-3">
            {[
              ["Bookings this week", "18"],
              ["Average rating", "4.9"],
              ["Pending requests", "5"],
            ].map(([label, value]) => (
              <SectionReveal className="rounded-[28px] bg-white p-5 shadow-[0_12px_40px_rgba(13,27,42,0.06)]" key={label}>
                <p className="text-xs uppercase tracking-[0.22em] text-[var(--ms-mauve)]">{label}</p>
                <p className="mt-3 text-4xl font-semibold text-[var(--ms-navy)]">{value}</p>
              </SectionReveal>
            ))}
          </div>
        </div>

        <div className="grid gap-5 xl:grid-cols-2">
          <SectionReveal className="rounded-[32px] bg-white p-6 shadow-[0_18px_48px_rgba(13,27,42,0.08)]">
            <p className="text-xs uppercase tracking-[0.22em] text-[var(--ms-mauve)]">Availability</p>
            <h2 className="mt-3 text-3xl font-semibold text-[var(--ms-navy)]">Keep your open hours realistic.</h2>
            <div className="mt-5 space-y-3">
              {[
                "Thu · 8:00 AM - 6:00 PM",
                "Fri · 8:00 AM - 7:30 PM",
                "Sat · 7:30 AM - 6:00 PM",
              ].map((item) => (
                <div className="rounded-[24px] bg-[var(--ms-soft-bg)] px-4 py-4 text-sm text-[var(--ms-charcoal)]" key={item}>
                  {item}
                </div>
              ))}
            </div>
          </SectionReveal>

          <SectionReveal className="rounded-[32px] bg-white p-6 shadow-[0_18px_48px_rgba(13,27,42,0.08)]">
            <p className="text-xs uppercase tracking-[0.22em] text-[var(--ms-mauve)]">Payments and growth</p>
            <h2 className="mt-3 text-3xl font-semibold text-[var(--ms-navy)]">Mpesa-ready architecture, simple now.</h2>
            <p className="mt-4 text-sm leading-7 text-[var(--ms-mauve)]">
              The MVP keeps payout, deposit, and notification settings clearly framed so future integrations do not need a redesign.
            </p>
            <div className="mt-5 flex flex-col gap-3 sm:flex-row">
              <CTAButton href="/profile">Preview public profile</CTAButton>
              <CTAButton href="/help" variant="outline">
                Review payout policy
              </CTAButton>
            </div>
          </SectionReveal>
        </div>
      </div>
    </AppShell>
  );
}
