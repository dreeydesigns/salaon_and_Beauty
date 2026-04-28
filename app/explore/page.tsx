import { AppShell } from "@/components/app-shell";
import {
  CTAButton,
  CategoryCircle,
  ProfessionalCard,
  SalonCard,
  SectionReveal,
  ScrollSection,
} from "@/components/marketplace-ui";
import { professionals, salons, serviceCategories } from "@/lib/site-data";

export default function ExplorePage() {
  return (
    <AppShell currentNav="explore" roleMode="salons" requireSession>
      <div className="section-grid">
        <SectionReveal className="rounded-[36px] bg-white p-6 shadow-[0_18px_48px_rgba(13,27,42,0.08)] lg:p-8">
          <p className="text-xs uppercase tracking-[0.22em] text-[var(--ms-mauve)]">Explore</p>
          <h1 className="mt-3 text-4xl font-semibold text-[var(--ms-navy)]">
            Browse the marketplace your way.
          </h1>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-[var(--ms-mauve)]">Salons, professionals, or rush booking.</p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <CTAButton href="/salons">Browse salons</CTAButton>
            <CTAButton href="/professionals" variant="outline">
              Browse professionals
            </CTAButton>
          </div>
        </SectionReveal>

        <section className="section-grid">
          <div className="grid gap-5 xl:grid-cols-2">
            <SectionReveal className="rounded-[32px] bg-white p-5 shadow-[0_12px_40px_rgba(13,27,42,0.08)]">
              <p className="text-xs uppercase tracking-[0.22em] text-[var(--ms-mauve)]">Browse salons</p>
              <h2 className="mt-3 text-3xl font-semibold text-[var(--ms-navy)]">For salon visits and wider menus.</h2>
              <div className="mt-5">
                <SalonCard salon={salons[0]} />
              </div>
            </SectionReveal>

            <SectionReveal className="rounded-[32px] bg-white p-5 shadow-[0_12px_40px_rgba(13,27,42,0.08)]">
              <p className="text-xs uppercase tracking-[0.22em] text-[var(--ms-mauve)]">Browse professionals</p>
              <h2 className="mt-3 text-3xl font-semibold text-[var(--ms-navy)]">For specialist hands.</h2>
              <div className="mt-5">
                <ProfessionalCard professional={professionals[1]} />
              </div>
            </SectionReveal>
          </div>
        </section>

        <SectionReveal className="beauty-card rounded-[34px] p-6">
          <p className="text-xs uppercase tracking-[0.22em] text-[var(--ms-mauve)]">Rush hour mode</p>
          <h2 className="mt-3 text-3xl font-semibold text-[var(--ms-plum)]">For last-minute beauty fixes.</h2>
          <div className="mt-5">
            <CTAButton href="/book?rush=true">Book in rush mode</CTAButton>
          </div>
        </SectionReveal>

        <ScrollSection eyebrow="Start by service" href="/services" hrefLabel="See all services" title="Move from what you need to who should do it">
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
      </div>
    </AppShell>
  );
}
