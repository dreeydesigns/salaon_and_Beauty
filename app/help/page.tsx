import { AppShell } from "@/components/app-shell";
import { CTAButton, SectionReveal, WhatsAppButton } from "@/components/marketplace-ui";
import { supportFaq } from "@/lib/site-data";

export default function HelpPage() {
  return (
    <AppShell currentNav="profile" roleMode="salons">
      <div className="section-grid">
        <SectionReveal className="rounded-[36px] bg-white p-6 shadow-[0_18px_48px_rgba(13,27,42,0.08)] lg:p-8">
          <p className="text-xs uppercase tracking-[0.22em] text-[var(--ms-mauve)]">Help, policy, and support</p>
          <h1 className="mt-3 text-4xl font-semibold text-[var(--ms-navy)]">Clear answers before things feel uncertain.</h1>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-[var(--ms-mauve)]">
            Booking policy, rescheduling expectations, support channels, and WhatsApp fallback live together here so clients and professionals do not have to guess.
          </p>
        </SectionReveal>

        <section className="section-grid rounded-[32px] bg-white p-6 shadow-[0_18px_48px_rgba(13,27,42,0.08)]">
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-[var(--ms-mauve)]">Frequently asked questions</p>
            <h2 className="mt-3 text-3xl font-semibold text-[var(--ms-navy)]">What people ask most</h2>
          </div>
          <div className="space-y-3">
            {supportFaq.map((faq) => (
              <details className="rounded-[24px] bg-[var(--ms-soft-bg)] p-5" key={faq.question}>
                <summary className="cursor-pointer text-lg font-semibold text-[var(--ms-navy)]">{faq.question}</summary>
                <p className="mt-3 text-sm leading-7 text-[var(--ms-mauve)]">{faq.answer}</p>
              </details>
            ))}
          </div>
        </section>

        <div className="grid gap-5 xl:grid-cols-2">
          <SectionReveal className="rounded-[32px] bg-white p-6 shadow-[0_18px_48px_rgba(13,27,42,0.08)]">
            <p className="text-xs uppercase tracking-[0.22em] text-[var(--ms-mauve)]">Policy snapshot</p>
            <div className="mt-4 space-y-3 text-sm leading-7 text-[var(--ms-charcoal)]">
              <p>Visible price ranges and inclusions appear before the booking is confirmed.</p>
              <p>Reschedule requests should happen as early as possible from the activity page.</p>
              <p>Professionals and salons control availability, while the platform keeps communication structured.</p>
            </div>
          </SectionReveal>

          <SectionReveal className="rounded-[32px] bg-[var(--ms-navy)] p-6 text-white shadow-[0_18px_48px_rgba(13,27,42,0.22)]">
            <p className="text-xs uppercase tracking-[0.22em] text-white/60">Contact support</p>
            <h2 className="mt-3 text-3xl font-semibold">Need direct help?</h2>
            <p className="mt-4 text-sm leading-7 text-white/74">
              WhatsApp remains available for MVP support, urgent rebooking, and onboarding questions while keeping the main product experience clean.
            </p>
            <div className="mt-5 flex flex-col gap-3 sm:flex-row">
              <WhatsAppButton className="border-white/20 bg-white/10 text-white hover:text-white" label="support" />
              <CTAButton href="/book" variant="ghost">
                Return to booking
              </CTAButton>
            </div>
          </SectionReveal>
        </div>
      </div>
    </AppShell>
  );
}
