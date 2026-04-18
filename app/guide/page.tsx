import { CalendarDays, CheckCircle2, Heart, Search, UserRound } from "lucide-react";

import { AppShell } from "@/components/app-shell";
import { CTAButton, SectionReveal } from "@/components/marketplace-ui";

const guideSteps = [
  {
    icon: Search,
    title: "Find",
    copy: "Search by service or area.",
  },
  {
    icon: Heart,
    title: "Choose",
    copy: "Tap the salon or pro you like.",
  },
  {
    icon: CalendarDays,
    title: "Time",
    copy: "Pick a slot that works.",
  },
  {
    icon: UserRound,
    title: "Sign in",
    copy: "Your choice stays saved.",
  },
  {
    icon: CheckCircle2,
    title: "Done",
    copy: "Send the request.",
  },
];

export default function GuidePage() {
  return (
    <AppShell currentNav="home" roleMode="salons">
      <div className="section-grid">
        <SectionReveal className="silk-panel overflow-hidden rounded-[34px] p-5 lg:rounded-[40px] lg:p-8">
          <div className="grid gap-6 lg:grid-cols-[minmax(0,0.58fr)_minmax(0,0.42fr)] lg:items-end">
            <div>
              <p className="font-script text-4xl text-[var(--ms-rose)] sm:text-5xl">A soft little guide</p>
              <h1 className="mt-3 text-3xl font-semibold leading-tight text-[var(--ms-plum)] sm:text-4xl">
                Book in five taps.
              </h1>
              <p className="mt-4 max-w-xl text-sm leading-7 text-[var(--ms-mauve)]">
                Five taps. Clear prices. No long reading.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row lg:justify-end">
              <CTAButton href="/book?rush=true">Start booking</CTAButton>
              <CTAButton href="/explore" variant="outline">
                Browse first
              </CTAButton>
            </div>
          </div>
        </SectionReveal>

        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {guideSteps.map((step, index) => {
            const Icon = step.icon;

            return (
              <SectionReveal className="beauty-card rounded-[30px] p-5 text-center" key={step.title}>
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[var(--ms-petal)] text-[var(--ms-rose)]">
                  <Icon className="h-6 w-6" />
                </div>
                <p className="mt-4 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--ms-mauve)]">
                  {index + 1}
                </p>
                <h2 className="mt-2 text-2xl font-semibold text-[var(--ms-plum)]">{step.title}</h2>
                <p className="mt-2 text-sm leading-6 text-[var(--ms-mauve)]">{step.copy}</p>
              </SectionReveal>
            );
          })}
        </section>

        <SectionReveal className="rounded-[34px] bg-[var(--ms-plum)] p-6 text-white shadow-[0_24px_70px_rgba(13,27,42,0.18)]">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/60">Last-minute?</p>
              <h2 className="mt-2 text-3xl font-semibold">Go straight to rush booking.</h2>
            </div>
            <CTAButton className="bg-white text-[var(--ms-plum)] hover:bg-[var(--ms-petal)]" href="/book?rush=true">
              Book now
            </CTAButton>
          </div>
        </SectionReveal>
      </div>
    </AppShell>
  );
}
