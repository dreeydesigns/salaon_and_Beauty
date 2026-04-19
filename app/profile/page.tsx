import { CalendarDays, Heart, LockKeyhole, UserRound } from "lucide-react";

import { AppShell } from "@/components/app-shell";
import { LanguagePreferenceCard } from "@/components/language-preference-card";
import { CTAButton, DecorativeStat, SectionReveal, WhatsAppButton } from "@/components/marketplace-ui";
import { MyWorldCard } from "@/components/my-world-card";
import { payoutStates } from "@/lib/business-model";

export default function ProfilePage() {
  return (
    <AppShell currentNav="profile" roleMode="salons" requireSession>
      <div className="section-grid">
        <SectionReveal className="rounded-[36px] bg-white p-6 shadow-[0_18px_48px_rgba(13,27,42,0.08)] lg:p-8">
          <p className="text-xs uppercase tracking-[0.22em] text-[var(--ms-mauve)]">Profile & account</p>
          <h1 className="mt-3 text-4xl font-semibold text-[var(--ms-navy)]">One place for your bookings, saved providers, and settings.</h1>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-[var(--ms-mauve)]">
            Client-friendly by default, with a clear path into professional tools when the account role changes.
          </p>
        </SectionReveal>

        <div className="grid gap-5 md:grid-cols-3">
          <DecorativeStat icon={<CalendarDays className="h-5 w-5" />} label="Client area" value="Bookings" />
          <DecorativeStat icon={<Heart className="h-5 w-5" />} label="Saved beauty" value="Favourites" />
          <DecorativeStat icon={<LockKeyhole className="h-5 w-5" />} label="Payment status" value="Protected" />
        </div>

        <div className="grid gap-5 xl:grid-cols-2">
          <SectionReveal className="beauty-card rounded-[32px] p-6">
            <p className="text-xs uppercase tracking-[0.22em] text-[var(--ms-mauve)]">Client view</p>
            <h2 className="mt-3 text-3xl font-semibold text-[var(--ms-plum)]">Upcoming, saved, and paid requests</h2>
            <div className="mt-5 space-y-3">
              {[
                "Upcoming · Soft Glam with Faith Odhiambo · Saturday 9:30 AM · Funded",
                "Saved · Kilimani Texture House · Braids from KES 3,000",
                "Settings · WhatsApp updates on, email reminders on",
              ].map((item) => (
                <div className="rounded-[24px] bg-[var(--ms-soft-bg)] px-4 py-4 text-sm text-[var(--ms-charcoal)]" key={item}>
                  {item}
                </div>
              ))}
            </div>
          </SectionReveal>

          <SectionReveal className="beauty-card rounded-[32px] p-6">
            <p className="text-xs uppercase tracking-[0.22em] text-[var(--ms-mauve)]">Professional view</p>
            <h2 className="mt-3 text-3xl font-semibold text-[var(--ms-plum)]">A different workspace when your role is professional</h2>
            <p className="mt-4 text-sm leading-7 text-[var(--ms-mauve)]">
              Professionals get a business layout for requests, pricing, availability, portfolio, payout status, and public profile customisation.
            </p>
            <div className="mt-5 flex flex-col gap-3 sm:flex-row">
              <CTAButton href="/dashboard">Open dashboard</CTAButton>
              <CTAButton href="/onboarding/professional" variant="outline">
                Edit onboarding
              </CTAButton>
            </div>
          </SectionReveal>
        </div>

        <LanguagePreferenceCard />

        <MyWorldCard />

        <SectionReveal className="rounded-[32px] bg-white p-6 shadow-[0_18px_48px_rgba(13,27,42,0.08)]">
          <p className="text-xs uppercase tracking-[0.22em] text-[var(--ms-mauve)]">Request status</p>
          <h2 className="mt-3 text-3xl font-semibold text-[var(--ms-plum)]">Everyone sees where the money is.</h2>
          <div className="mt-5 space-y-3">
            {payoutStates.slice(0, 4).map((state) => (
              <div className="rounded-[22px] bg-[var(--ms-soft-bg)] px-4 py-3" key={state.label}>
                <div className="flex items-center justify-between gap-3">
                  <p className="font-semibold text-[var(--ms-navy)]">{state.label}</p>
                  <span className="rounded-full bg-white px-3 py-1 text-xs text-[var(--ms-mauve)]">{state.tone}</span>
                </div>
                <p className="mt-2 text-sm leading-6 text-[var(--ms-mauve)]">{state.copy}</p>
              </div>
            ))}
          </div>
        </SectionReveal>

        <SectionReveal className="rounded-[32px] bg-white p-6 shadow-[0_18px_48px_rgba(13,27,42,0.08)]">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.22em] text-[var(--ms-mauve)]">Need help fast?</p>
              <h2 className="mt-3 text-3xl font-semibold text-[var(--ms-navy)]">Use WhatsApp support without losing the platform flow.</h2>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <CTAButton href="/auth/sign-in" variant="outline">
                <UserRound className="h-4 w-4" />
                Sign in
              </CTAButton>
              <WhatsAppButton label="profile support" />
            </div>
          </div>
        </SectionReveal>
      </div>
    </AppShell>
  );
}
