import { AppShell } from "@/components/app-shell";
import { CTAButton, SectionReveal, WhatsAppButton } from "@/components/marketplace-ui";

export default function ProfilePage() {
  return (
    <AppShell currentNav="profile" roleMode="salons">
      <div className="section-grid">
        <SectionReveal className="rounded-[36px] bg-white p-6 shadow-[0_18px_48px_rgba(13,27,42,0.08)] lg:p-8">
          <p className="text-xs uppercase tracking-[0.22em] text-[var(--ms-mauve)]">Profile & account</p>
          <h1 className="mt-3 text-4xl font-semibold text-[var(--ms-navy)]">One place for your bookings, saved providers, and settings.</h1>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-[var(--ms-mauve)]">
            Client-friendly by default, with a clear path into professional tools when the account role changes.
          </p>
        </SectionReveal>

        <div className="grid gap-5 xl:grid-cols-2">
          <SectionReveal className="rounded-[32px] bg-white p-6 shadow-[0_18px_48px_rgba(13,27,42,0.08)]">
            <p className="text-xs uppercase tracking-[0.22em] text-[var(--ms-mauve)]">Client view</p>
            <h2 className="mt-3 text-3xl font-semibold text-[var(--ms-navy)]">Upcoming and saved</h2>
            <div className="mt-5 space-y-3">
              {[
                "Upcoming · Soft Glam with Faith Odhiambo · Saturday 9:30 AM",
                "Saved · Kilimani Texture House",
                "Settings · WhatsApp updates on, email reminders on",
              ].map((item) => (
                <div className="rounded-[24px] bg-[var(--ms-soft-bg)] px-4 py-4 text-sm text-[var(--ms-charcoal)]" key={item}>
                  {item}
                </div>
              ))}
            </div>
          </SectionReveal>

          <SectionReveal className="rounded-[32px] bg-white p-6 shadow-[0_18px_48px_rgba(13,27,42,0.08)]">
            <p className="text-xs uppercase tracking-[0.22em] text-[var(--ms-mauve)]">Professional view</p>
            <h2 className="mt-3 text-3xl font-semibold text-[var(--ms-navy)]">Public profile preview</h2>
            <p className="mt-4 text-sm leading-7 text-[var(--ms-mauve)]">
              This area points professionals toward their live profile, pricing setup, availability, and portfolio.
            </p>
            <div className="mt-5 flex flex-col gap-3 sm:flex-row">
              <CTAButton href="/dashboard">Open dashboard</CTAButton>
              <CTAButton href="/onboarding/professional" variant="outline">
                Edit onboarding
              </CTAButton>
            </div>
          </SectionReveal>
        </div>

        <SectionReveal className="rounded-[32px] bg-white p-6 shadow-[0_18px_48px_rgba(13,27,42,0.08)]">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.22em] text-[var(--ms-mauve)]">Need help fast?</p>
              <h2 className="mt-3 text-3xl font-semibold text-[var(--ms-navy)]">Use WhatsApp support without losing the platform flow.</h2>
            </div>
            <WhatsAppButton label="profile support" />
          </div>
        </SectionReveal>
      </div>
    </AppShell>
  );
}
