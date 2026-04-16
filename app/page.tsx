import Link from "next/link";

import { AppShell } from "@/components/app-shell";
import {
  CTAButton,
  CategoryCircle,
  PackageCard,
  ProfessionalCard,
  ReviewCard,
  SalonCard,
  SectionReveal,
} from "@/components/marketplace-ui";
import { howItWorks, professionals, salons, serviceCategories, testimonials, trustPoints } from "@/lib/site-data";

export default function Home() {
  const featuredPackages = [...salons.flatMap((salon) => salon.packageOffers), ...professionals.flatMap((pro) => pro.packageOffers)].slice(0, 4);

  return (
    <AppShell currentNav="home" roleMode="salons" showFooter>
      <div className="section-grid">
        <SectionReveal className="app-hero rounded-[40px] border border-[var(--ms-border)] p-6 shadow-[0_22px_70px_rgba(13,27,42,0.08)] lg:p-8">
          <div className="grid gap-6 xl:grid-cols-[minmax(0,0.62fr)_minmax(0,0.38fr)]">
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-[var(--ms-mauve)]">Beauty booked in seconds</p>
              <h1 className="mt-4 max-w-3xl text-5xl font-semibold leading-tight text-[var(--ms-navy)] lg:text-6xl">
                Find trusted beauty professionals and salons across Nairobi.
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-8 text-[var(--ms-mauve)]">
                Compare clear prices, visible durations, real specialties, and mobile service options without WhatsApp chaos.
              </p>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <CTAButton href="/book">Book a Service</CTAButton>
                <CTAButton href="/onboarding/professional" variant="outline">
                  Join as a Professional
                </CTAButton>
              </div>
              <div className="mt-8 grid gap-3 rounded-[32px] bg-white p-4 shadow-[0_18px_40px_rgba(13,27,42,0.08)] md:grid-cols-2 xl:grid-cols-4">
                {[
                  "Braids · Kilimani",
                  "Nails · Westlands",
                  "Soft glam · Saturday",
                  "Mobile barber · South B",
                ].map((item) => (
                  <Link
                    className="rounded-[24px] bg-[var(--ms-soft-bg)] px-4 py-4 text-sm font-medium text-[var(--ms-navy)] transition hover:bg-white"
                    href="/explore"
                    key={item}
                  >
                    {item}
                  </Link>
                ))}
              </div>
            </div>
            <div className="dark-atmosphere rounded-[36px] p-5 text-white shadow-[0_22px_60px_rgba(13,27,42,0.24)]">
              <p className="text-xs uppercase tracking-[0.24em] text-white/62">How the app feels on mobile</p>
              <div className="mt-5 rounded-[28px] border border-white/10 bg-white/5 p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-display text-3xl">Quick request</p>
                    <p className="mt-2 text-sm text-white/70">Thumb-friendly, fast, and fully visible.</p>
                  </div>
                  <span className="rounded-full bg-[var(--ms-gold)] px-3 py-1 text-xs font-semibold text-[var(--ms-navy)]">
                    Under 3 mins
                  </span>
                </div>
                <div className="mt-5 space-y-3">
                  {[
                    "Pick salon or professional",
                    "Select exact services with price range",
                    "Choose date, time, and notification preference",
                    "Confirm and get a clean reward state",
                  ].map((item) => (
                    <div className="flex items-center gap-3 rounded-[22px] bg-white/8 px-4 py-3" key={item}>
                      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/12 text-xs font-semibold">
                        +
                      </span>
                      <p className="text-sm text-white/76">{item}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </SectionReveal>

        <SectionReveal className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {trustPoints.map((point) => (
            <div className="rounded-[28px] bg-white p-5 shadow-[0_12px_40px_rgba(13,27,42,0.06)]" key={point}>
              <p className="text-sm leading-7 text-[var(--ms-charcoal)]">{point}</p>
            </div>
          ))}
        </SectionReveal>

        <section className="section-grid">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.22em] text-[var(--ms-mauve)]">Featured salons</p>
              <h2 className="mt-3 text-3xl font-semibold text-[var(--ms-navy)]">Studios clients trust right now</h2>
            </div>
            <CTAButton href="/salons" variant="outline">
              See all salons
            </CTAButton>
          </div>
          <div className="grid gap-5 xl:grid-cols-2">
            {salons.map((salon) => (
              <SalonCard key={salon.slug} salon={salon} />
            ))}
          </div>
        </section>

        <section className="section-grid">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.22em] text-[var(--ms-mauve)]">Featured professionals</p>
              <h2 className="mt-3 text-3xl font-semibold text-[var(--ms-navy)]">Specialists with strong portfolios</h2>
            </div>
            <CTAButton href="/professionals" variant="outline">
              See all professionals
            </CTAButton>
          </div>
          <div className="grid gap-5 xl:grid-cols-2">
            {professionals.map((professional) => (
              <ProfessionalCard key={professional.slug} professional={professional} />
            ))}
          </div>
        </section>

        <section className="section-grid">
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-[var(--ms-mauve)]">Popular categories</p>
            <h2 className="mt-3 text-3xl font-semibold text-[var(--ms-navy)]">African beauty is the default here</h2>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {serviceCategories.map((category) => (
              <CategoryCircle color={category.color} detail={category.detail} key={category.id} name={category.name} />
            ))}
          </div>
        </section>

        <section className="section-grid">
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-[var(--ms-mauve)]">Trending packages</p>
            <h2 className="mt-3 text-3xl font-semibold text-[var(--ms-navy)]">Clear value without hidden extras</h2>
          </div>
          <div className="grid gap-5 xl:grid-cols-2">
            {featuredPackages.map((offer) => (
              <PackageCard key={offer.id} offer={offer} />
            ))}
          </div>
        </section>

        <section className="section-grid rounded-[36px] bg-white p-6 shadow-[0_18px_48px_rgba(13,27,42,0.08)] lg:p-8">
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-[var(--ms-mauve)]">How it works</p>
            <h2 className="mt-3 text-3xl font-semibold text-[var(--ms-navy)]">Simple enough to understand at a glance</h2>
          </div>
          <div className="grid gap-5 lg:grid-cols-3">
            {howItWorks.map((item) => (
              <div className="rounded-[28px] bg-[var(--ms-soft-bg)] p-5" key={item.step}>
                <p className="text-xs uppercase tracking-[0.22em] text-[var(--ms-magenta)]">{item.step}</p>
                <h3 className="mt-3 text-2xl font-semibold text-[var(--ms-navy)]">{item.title}</h3>
                <p className="mt-3 text-sm leading-7 text-[var(--ms-mauve)]">{item.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="section-grid">
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-[var(--ms-mauve)]">Review snapshots</p>
            <h2 className="mt-3 text-3xl font-semibold text-[var(--ms-navy)]">Trust comes from evidence, not hype</h2>
          </div>
          <div className="grid gap-5 xl:grid-cols-3">
            {testimonials.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </div>
        </section>

        <SectionReveal className="rounded-[36px] bg-[var(--ms-navy)] p-6 text-white shadow-[0_22px_60px_rgba(13,27,42,0.22)] lg:p-8">
          <div className="grid gap-5 xl:grid-cols-[minmax(0,0.66fr)_minmax(0,0.34fr)]">
            <div>
              <p className="text-xs uppercase tracking-[0.22em] text-white/60">PWA ready</p>
              <h2 className="mt-3 text-4xl font-semibold">Use it like an app in the browser.</h2>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-white/74">
                Sticky actions, quick switching, and thumb-first booking keep the mobile experience feeling native without losing the reach of the web.
              </p>
            </div>
            <div className="rounded-[32px] bg-white/8 p-5">
              <p className="text-sm leading-7 text-white/78">
                Save the site to your home screen for faster return visits, booking reminders, and instant access to upcoming appointments.
              </p>
              <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                <CTAButton href="/book">Open booking</CTAButton>
                <CTAButton href="/help" variant="ghost">
                  Learn more
                </CTAButton>
              </div>
            </div>
          </div>
        </SectionReveal>
      </div>
    </AppShell>
  );
}
