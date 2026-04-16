import { AppShell } from "@/components/app-shell";
import { CTAButton, SectionReveal, ServiceCard } from "@/components/marketplace-ui";
import { services } from "@/lib/site-data";

export default function ServicesPage() {
  const grouped = Object.entries(
    services.reduce<Record<string, typeof services>>((accumulator, service) => {
      accumulator[service.category] ??= [];
      accumulator[service.category].push(service);
      return accumulator;
    }, {}),
  );

  return (
    <AppShell currentNav="book" roleMode="salons">
      <div className="section-grid">
        <SectionReveal className="rounded-[36px] bg-white p-6 shadow-[0_18px_48px_rgba(13,27,42,0.08)] lg:p-8">
          <p className="text-xs uppercase tracking-[0.22em] text-[var(--ms-mauve)]">Service catalogue</p>
          <h1 className="mt-3 text-4xl font-semibold text-[var(--ms-navy)]">Specific services. Real ranges. Honest timing.</h1>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-[var(--ms-mauve)]">
            Built around Nairobi beauty realities, not generic menus. Every service shows the value before a client commits.
          </p>
          <div className="mt-6">
            <CTAButton href="/book">Start booking</CTAButton>
          </div>
        </SectionReveal>

        {grouped.map(([category, items]) => (
          <section className="section-grid" key={category}>
            <div>
              <p className="text-xs uppercase tracking-[0.22em] text-[var(--ms-mauve)]">{category}</p>
              <h2 className="mt-3 text-3xl font-semibold text-[var(--ms-navy)]">{category}</h2>
            </div>
            <div className="grid gap-4 xl:grid-cols-2">
              {items.map((service) => (
                <ServiceCard key={service.id} service={service} />
              ))}
            </div>
          </section>
        ))}
      </div>
    </AppShell>
  );
}
