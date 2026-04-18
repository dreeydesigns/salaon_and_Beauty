import Link from "next/link";

import { AppShell } from "@/components/app-shell";
import { CTAButton, PackageCard, ScrollSection, SectionReveal, ServiceCard, TrustFlowCard } from "@/components/marketplace-ui";
import { platformRevenueRules } from "@/lib/business-model";
import { marketplacePackages, services } from "@/lib/site-data";

export default function ServicesPage() {
  const grouped = Object.entries(
    services.reduce<Record<string, typeof services>>((accumulator, service) => {
      accumulator[service.category] ??= [];
      accumulator[service.category].push(service);
      return accumulator;
    }, {}),
  );
  const popular = services.filter((service) => service.popular);

  return (
    <AppShell currentNav="book" roleMode="salons">
      <div className="section-grid">
        <SectionReveal className="silk-panel decorative-orbit overflow-hidden rounded-[36px] p-6 lg:p-8">
          <div className="grid gap-6 xl:grid-cols-[minmax(0,0.66fr)_minmax(320px,0.34fr)] xl:items-end">
            <div>
              <p className="text-xs uppercase tracking-[0.22em] text-[var(--ms-mauve)]">Service catalogue</p>
              <h1 className="mt-3 text-4xl font-semibold text-[var(--ms-plum)]">Choose the glow you want.</h1>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-[var(--ms-mauve)]">
                Clear prices, clear time, and a paid request flow before a provider can accept the work.
              </p>
              <div className="mt-6 flex flex-wrap gap-2">
                {grouped.map(([category]) => (
                  <Link
                    className="rounded-full border border-[var(--ms-border)] bg-white px-4 py-2 text-sm font-semibold text-[var(--ms-plum)] transition hover:border-[var(--ms-rose)]/35 hover:bg-[var(--ms-petal)]"
                    href={`#${categoryId(category)}`}
                    key={category}
                  >
                    {category}
                  </Link>
                ))}
              </div>
            </div>
            <div className="rounded-[28px] bg-white/86 p-5 shadow-[0_16px_38px_rgba(132,36,92,0.1)]">
              <p className="text-xs uppercase tracking-[0.22em] text-[var(--ms-mauve)]">Fast path</p>
              <h2 className="mt-3 text-2xl font-semibold text-[var(--ms-navy)]">Need help now?</h2>
              <p className="mt-3 text-sm leading-6 text-[var(--ms-mauve)]">
                Start with one service, pay to secure the request, then track it from Activity.
              </p>
              <div className="mt-5">
                <CTAButton href="/book?rush=true">Start rush booking</CTAButton>
              </div>
            </div>
          </div>
        </SectionReveal>

        <ScrollSection eyebrow="Most requested" href="/book?rush=true" hrefLabel="Book now" title="Good first choices when you are in a hurry">
          {popular.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </ScrollSection>

        <ScrollSection eyebrow="Packages" href="/book?rush=true" hrefLabel="Book package" title="Bundles that make decisions easier">
          {marketplacePackages.map((offer) => (
            <PackageCard key={offer.id} offer={offer} />
          ))}
        </ScrollSection>

        <SectionReveal className="grid gap-5 xl:grid-cols-[minmax(0,0.5fr)_minmax(0,0.5fr)]">
          <TrustFlowCard />
          <div className="beauty-card rounded-[34px] p-6">
            <p className="text-xs uppercase tracking-[0.22em] text-[var(--ms-mauve)]">Business rules</p>
            <h2 className="mt-3 text-3xl font-semibold text-[var(--ms-plum)]">Mobile Salon protects both sides.</h2>
            <div className="mt-5 space-y-3">
              {platformRevenueRules.map((rule) => (
                <p className="rounded-[22px] bg-[var(--ms-soft-bg)] px-4 py-3 text-sm leading-6 text-[var(--ms-charcoal)]" key={rule}>
                  {rule}
                </p>
              ))}
            </div>
          </div>
        </SectionReveal>

        {grouped.map(([category, items]) => (
          <ScrollSection
            className="scroll-mt-40"
            eyebrow="Browse by category"
            href={`/book?category=${encodeURIComponent(category)}`}
            hrefLabel="Book category"
            id={categoryId(category)}
            key={category}
            title={category}
          >
            {items.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </ScrollSection>
        ))}
      </div>
    </AppShell>
  );
}

function categoryId(category: string) {
  return category.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}
