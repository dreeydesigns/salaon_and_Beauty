import Link from "next/link";
import Image from "next/image";
import { CalendarHeart, Clock3, Flower2, Gem, MapPin, Search, ShieldCheck, Sparkles } from "lucide-react";

import { AppShell } from "@/components/app-shell";
import {
  CTAButton,
  CategoryCircle,
  DecorativeStat,
  PackageCard,
  ProfessionalCard,
  ReviewCard,
  SalonCard,
  SectionReveal,
  ScrollSection,
  TrustFlowCard,
} from "@/components/marketplace-ui";
import { RoleChoiceModal } from "@/components/role-choice-modal";
import {
  howItWorks,
  imageAssets,
  marketplacePackages,
  professionals,
  salons,
  serviceCategories,
  testimonials,
  trustPoints,
} from "@/lib/site-data";

export default function Home() {
  const featuredPackages = marketplacePackages.filter((offer) => offer.trending).slice(0, 6);
  const spotlightProfessional = professionals[0];

  return (
    <AppShell currentNav="home" roleMode="salons" showFooter>
      <RoleChoiceModal />
      <div className="section-grid min-w-0 overflow-hidden">
        <SectionReveal className="relative w-full max-w-full overflow-hidden rounded-[34px] bg-[var(--ms-navy)] text-white shadow-[0_30px_90px_rgba(13,27,42,0.24)] lg:rounded-[46px]">
          <Image
            alt={imageAssets.braidsPortrait.alt}
            className="object-cover"
            fill
            priority
            sizes="100vw"
            src={imageAssets.braidsPortrait.url}
            style={{ objectPosition: imageAssets.braidsPortrait.position }}
          />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(58,24,58,0.96)_0%,rgba(58,24,58,0.78)_44%,rgba(232,62,140,0.18)_100%)]" />
          <div className="relative z-10 grid min-h-[470px] min-w-0 gap-8 p-6 sm:min-h-[620px] sm:p-8 lg:grid-cols-[minmax(0,0.58fr)_minmax(320px,0.42fr)] lg:p-10">
            <div className="flex min-w-0 max-w-[19.5rem] flex-col justify-center sm:max-w-3xl">
              <p className="w-fit max-w-full rounded-full border border-white/18 bg-white/10 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/78 sm:text-xs sm:tracking-[0.24em]">
                Nairobi beauty, softly booked
              </p>
              <p className="mt-5 font-script text-5xl leading-none text-[var(--ms-blush)] sm:text-6xl">
                Your glow, handled
              </p>
              <h1 className="mt-5 max-w-3xl break-words text-[2.25rem] font-semibold leading-[1.04] tracking-[-0.04em] text-white sm:text-6xl sm:leading-[0.98] lg:text-7xl">
                Beauty care, calmly booked.
              </h1>
              <p className="mt-5 max-w-[18rem] break-words text-[15px] leading-7 text-white/78 sm:max-w-xl sm:text-base sm:leading-8">
                Choose what feels right, see the price clearly, and secure trusted beauty help without the back-and-forth.
              </p>
              <div className="mt-6 flex max-w-[18rem] flex-col gap-2.5 sm:mt-8 sm:max-w-none sm:flex-row sm:gap-3">
                <CTAButton className="min-h-14 px-7 text-base" href="/book?rush=true">
                  Book my beauty moment
                </CTAButton>
                <CTAButton className="hidden min-h-12 border-white/24 bg-white/12 px-7 text-base text-white hover:text-white sm:inline-flex sm:min-h-14" href="/guide" variant="outline">
                  Show me how
                </CTAButton>
              </div>
              <div className="mt-8 hidden max-w-[18rem] gap-3 sm:grid sm:max-w-none sm:grid-cols-2">
                {[
                  ["Braids", "Kilimani", "/book?targetType=salons&serviceIds=knotless-braids&rush=true"],
                  ["Nails", "Westlands", "/book?targetType=salons&serviceIds=gel-manicure&rush=true"],
                  ["Soft glam", "Saturday", "/book?targetType=professionals&targetId=faith-odhiambo&serviceIds=makeup-soft-glam"],
                  ["Low cut refresh", "South B", "/book?targetType=professionals&targetId=kevin-ochieng&serviceIds=mens-fade&rush=true"],
                ].map(([service, location, href]) => (
                  <Link
                    className="group rounded-[24px] border border-white/14 bg-white/10 p-4 backdrop-blur transition hover:-translate-y-0.5 hover:bg-white/16"
                    href={href}
                    key={service}
                  >
                    <span className="block text-sm font-semibold text-white">{service}</span>
                    <span className="mt-1 block text-xs text-white/62">{location} · book fast</span>
                  </Link>
                ))}
              </div>
            </div>

            <div className="hidden min-w-0 items-end lg:flex lg:items-center">
              <div className="w-full rounded-[36px] border border-white/18 bg-white/12 p-5 shadow-[0_25px_70px_rgba(0,0,0,0.24)] backdrop-blur-xl">
                <div className="rounded-[28px] bg-white p-5 text-[var(--ms-navy)]">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--ms-mauve)]">Quick request</p>
                      <h2 className="mt-2 font-display text-3xl">Five taps to done</h2>
                    </div>
                    <span className="rounded-full bg-[var(--ms-gold)] px-3 py-1 text-xs font-semibold text-[var(--ms-navy)]">
                      Today
                    </span>
                  </div>
                  <div className="mt-5 space-y-3">
                    {[
                      "Pick salon or pro",
                      "Choose one service",
                      "Tap time",
                      "Add phone",
                      "Confirm",
                    ].map((item, index) => (
                      <div className="flex items-center gap-3 rounded-[20px] bg-[var(--ms-soft-bg)] px-4 py-3" key={item}>
                        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--ms-navy)] text-xs font-semibold text-white">
                          {index + 1}
                        </span>
                        <p className="text-sm font-semibold text-[var(--ms-charcoal)]">{item}</p>
                      </div>
                    ))}
                  </div>
                  <CTAButton className="mt-5 w-full" href="/book?rush=true">
                    Start now
                  </CTAButton>
                </div>
                <p className="mt-4 text-center text-xs text-white/62">
                  Real prices · real portfolios · Nairobi coverage
                </p>
              </div>
            </div>
          </div>
        </SectionReveal>

        <QuickGuidedSearch />

        <SectionReveal className="rounded-[36px] bg-white p-6 shadow-[0_18px_54px_rgba(132,36,92,0.1)] lg:p-8">
          <div className="grid gap-6 xl:grid-cols-[minmax(0,0.36fr)_minmax(0,0.64fr)] xl:items-center">
            <div>
              <p className="text-xs uppercase tracking-[0.22em] text-[var(--ms-mauve)]">How it works</p>
              <h2 className="mt-3 text-3xl font-semibold text-[var(--ms-plum)]">One calm path from need to confirmed booking.</h2>
              <p className="mt-3 text-sm leading-7 text-[var(--ms-mauve)]">
                This is the gentle guide: choose, review, sign in, pay, and let the platform protect the request.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {howItWorks.map((step) => (
                <div className="rounded-[26px] bg-[var(--ms-soft-bg)] p-4" key={step.step}>
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-sm font-semibold text-[var(--ms-rose)] shadow-[0_10px_22px_rgba(132,36,92,0.08)]">
                    {step.step}
                  </span>
                  <h3 className="mt-4 text-lg font-semibold text-[var(--ms-navy)]">{step.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-[var(--ms-mauve)]">{step.description}</p>
                </div>
              ))}
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

        <SectionReveal className="grid gap-5 xl:grid-cols-[minmax(0,0.48fr)_minmax(0,0.52fr)]">
          <TrustFlowCard />
          <div className="grid gap-4 sm:grid-cols-3 xl:grid-cols-1">
            <DecorativeStat icon={<ShieldCheck className="h-5 w-5" />} label="Request safety" value="Paid first" />
            <DecorativeStat icon={<Clock3 className="h-5 w-5" />} label="Rush friendly" value="< 3 min" />
            <DecorativeStat icon={<Gem className="h-5 w-5" />} label="Platform role" value="Bridge" />
          </div>
        </SectionReveal>

        <ScrollSection eyebrow="Featured salons" href="/salons" hrefLabel="See all salons" title="Calm studios with clear prices">
          {salons.map((salon) => (
            <SalonCard key={salon.slug} salon={salon} />
          ))}
        </ScrollSection>

        <ScrollSection eyebrow="Featured professionals" href="/professionals" hrefLabel="See all professionals" title="Trusted hands with real portfolios">
          {professionals.map((professional) => (
            <ProfessionalCard key={professional.slug} professional={professional} />
          ))}
        </ScrollSection>

        <ScrollSection eyebrow="Popular categories" href="/services" hrefLabel="See all services" title="Choose what feels right today">
          {serviceCategories.map((category) => (
            <CategoryCircle
              color={category.color}
              detail={category.detail}
              image={category.image}
              key={category.id}
              name={category.name}
            />
          ))}
        </ScrollSection>

        <ScrollSection eyebrow="Trending packages" href="/services" hrefLabel="See all packages" title="Packages for real beauty moments">
          {featuredPackages.map((offer) => (
            <PackageCard key={offer.id} offer={offer} />
          ))}
        </ScrollSection>

        {spotlightProfessional ? (
          <SectionReveal className="overflow-hidden rounded-[40px] border border-[var(--ms-border)] bg-white p-6 shadow-[0_22px_70px_rgba(13,27,42,0.08)] lg:p-8">
            <div className="grid gap-6 xl:grid-cols-[minmax(0,0.45fr)_minmax(0,0.55fr)] xl:items-center">
              <div>
                <p className="text-xs uppercase tracking-[0.22em] text-[var(--ms-mauve)]">Verified professional spotlight</p>
                <h2 className="mt-3 text-4xl font-semibold text-[var(--ms-plum)]">{spotlightProfessional.name}</h2>
                <p className="mt-3 text-sm leading-7 text-[var(--ms-mauve)]">{spotlightProfessional.description}</p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {spotlightProfessional.identityAttributes.map((attribute) => (
                    <span className="rounded-full bg-white px-3 py-2 text-xs font-semibold text-[var(--ms-plum)] shadow-[0_10px_24px_rgba(132,36,92,0.08)]" key={attribute}>
                      {attribute}
                    </span>
                  ))}
                </div>
                <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                  <CTAButton href={`/professionals/${spotlightProfessional.slug}`}>View profile</CTAButton>
                  <CTAButton href="/professionals" variant="outline">
                    Compare professionals
                  </CTAButton>
                </div>
              </div>
              <ProfessionalCard professional={spotlightProfessional} />
            </div>
          </SectionReveal>
        ) : null}

        <ScrollSection eyebrow="Review snapshots" href="/help" hrefLabel="Read policy" title="Trust comes from evidence, not hype">
          {testimonials.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </ScrollSection>

        <SectionReveal className="rounded-[36px] bg-[var(--ms-navy)] p-6 text-white shadow-[0_22px_60px_rgba(13,27,42,0.22)] lg:p-8">
          <div className="grid gap-5 xl:grid-cols-[minmax(0,0.66fr)_minmax(0,0.34fr)]">
            <div>
              <p className="text-xs uppercase tracking-[0.22em] text-white/60">PWA ready</p>
              <h2 className="mt-3 text-4xl font-semibold">Use it like an app in the browser.</h2>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-white/74">
                Sticky actions, quick switching, and thumb-first booking keep the mobile experience feeling native without losing the reach of the web.
              </p>
              <div className="mt-5 flex w-fit items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm text-white/76">
                <CalendarHeart className="h-4 w-4 text-[var(--ms-blush)]" />
                Built for last-minute beauty emergencies.
              </div>
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

        <SectionReveal className="relative overflow-hidden rounded-[40px] border border-[var(--ms-border)] bg-white p-6 shadow-[0_22px_70px_rgba(13,27,42,0.08)] lg:p-8">
          <div className="relative grid gap-5 xl:grid-cols-[minmax(0,0.62fr)_minmax(300px,0.38fr)] xl:items-center">
            <div>
              <p className="text-xs uppercase tracking-[0.22em] text-[var(--ms-mauve)]">For professionals</p>
              <h2 className="mt-3 text-4xl font-semibold text-[var(--ms-plum)]">Your skill can become a trusted beauty business page.</h2>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-[var(--ms-mauve)]">
                You do not need to own a salon to be visible. Strong portfolio, clear pricing, reliable response, and verified completion help you earn more trust.
              </p>
            </div>
            <div className="rounded-[32px] bg-[var(--ms-soft-bg)] p-5">
              <div className="flex items-start gap-3">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white text-[var(--ms-rose)]">
                  <Flower2 className="h-5 w-5" />
                </span>
                <div>
                  <h3 className="text-2xl font-semibold text-[var(--ms-navy)]">Build calmly. Earn clearly.</h3>
                  <p className="mt-2 text-sm leading-6 text-[var(--ms-mauve)]">
                    Update services, portfolio, packages, availability, and payout readiness from the dashboard.
                  </p>
                </div>
              </div>
              <div className="mt-5 flex flex-col gap-3">
                <CTAButton href="/onboarding/professional">Join as a Professional</CTAButton>
                <CTAButton href="/dashboard" variant="outline">
                  Preview dashboard
                </CTAButton>
              </div>
            </div>
          </div>
        </SectionReveal>
      </div>
    </AppShell>
  );
}

function QuickGuidedSearch() {
  const suggestions = [
    { label: "Braids", href: "/book?targetType=salons&serviceIds=knotless-braids&rush=true" },
    { label: "Nails", href: "/book?targetType=salons&serviceIds=gel-manicure&rush=true" },
    { label: "Lashes", href: "/book?targetType=professionals&serviceIds=lash-classic&rush=true" },
    { label: "Birthday glow", href: "/book?targetType=professionals&serviceIds=full-glam,nail-art-upgrade&rush=true" },
  ];

  return (
    <SectionReveal className="rounded-[36px] bg-white p-5 shadow-[0_18px_54px_rgba(132,36,92,0.1)] lg:p-6">
      <div className="grid gap-4 xl:grid-cols-[minmax(0,0.26fr)_minmax(0,0.74fr)] xl:items-center">
        <div>
          <p className="text-xs uppercase tracking-[0.22em] text-[var(--ms-mauve)]">Quick guided search</p>
          <h2 className="mt-3 text-2xl font-semibold text-[var(--ms-plum)]">Tell us the simple things first.</h2>
        </div>
        <div className="grid gap-3 md:grid-cols-4">
          {[
            ["Service", "What do you need?", <Search className="h-4 w-4" key="service" />],
            ["Location", "Near Kilimani, Westlands...", <MapPin className="h-4 w-4" key="location" />],
            ["Date", "Today or this week", <CalendarHeart className="h-4 w-4" key="date" />],
            ["Package", "Event or reset", <Sparkles className="h-4 w-4" key="package" />],
          ].map(([label, hint, icon]) => (
            <Link
              className="group rounded-[24px] border border-[var(--ms-border)] bg-[var(--ms-soft-bg)] p-4 transition hover:-translate-y-0.5 hover:border-[var(--ms-rose)]/35 hover:bg-[var(--ms-petal)]/70"
              href="/explore"
              key={label as string}
            >
              <span className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--ms-mauve)]">
                {icon}
                {label as string}
              </span>
              <span className="mt-2 block text-sm font-semibold text-[var(--ms-navy)]">{hint as string}</span>
            </Link>
          ))}
        </div>
      </div>
      <div className="mt-5 flex gap-2 overflow-x-auto pb-3">
        {suggestions.map((suggestion) => (
          <CTAButton className="shrink-0" href={suggestion.href} key={suggestion.label} variant="outline">
            {suggestion.label}
          </CTAButton>
        ))}
        <CTAButton className="shrink-0" href="/book?rush=true">
          Book calmly now
        </CTAButton>
      </div>
    </SectionReveal>
  );
}
