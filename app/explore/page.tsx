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
    <AppShell currentNav="explore" roleMode="salons">
      <div className="section-grid">
        <SectionReveal className="rounded-[36px] bg-white p-6 shadow-[0_18px_48px_rgba(13,27,42,0.08)] lg:p-8">
          <p className="text-xs uppercase tracking-[0.22em] text-[var(--ms-mauve)]">Explore</p>
          <h1 className="mt-3 text-4xl font-semibold text-[var(--ms-navy)]">
            Start broad, then move quickly into the exact booking path you need.
          </h1>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-[var(--ms-mauve)]">
            Browse by service type, compare salons and professionals side by side, or jump directly into a booking flow.
          </p>
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
              <h2 className="mt-3 text-3xl font-semibold text-[var(--ms-navy)]">Best when you want a salon visit or a wider menu</h2>
              <p className="mt-3 text-sm leading-7 text-[var(--ms-mauve)]">
                Compare verified salons by area, starting price, categories, and whether they support mobile service too.
              </p>
              <div className="mt-5">
                <SalonCard salon={salons[0]} />
              </div>
            </SectionReveal>

            <SectionReveal className="rounded-[32px] bg-white p-5 shadow-[0_12px_40px_rgba(13,27,42,0.08)]">
              <p className="text-xs uppercase tracking-[0.22em] text-[var(--ms-mauve)]">Browse professionals</p>
              <h2 className="mt-3 text-3xl font-semibold text-[var(--ms-navy)]">Best when the person matters as much as the place</h2>
              <p className="mt-3 text-sm leading-7 text-[var(--ms-mauve)]">
                Go straight to specialists in bridal glam, textured hair care, nails, and feminine short-hair care.
              </p>
              <div className="mt-5">
                <ProfessionalCard professional={professionals[1]} />
              </div>
            </SectionReveal>
          </div>
        </section>

        <SectionReveal className="beauty-card rounded-[34px] p-6">
          <p className="text-xs uppercase tracking-[0.22em] text-[var(--ms-mauve)]">Rush hour mode</p>
          <h2 className="mt-3 text-3xl font-semibold text-[var(--ms-plum)]">For last-minute beauty emergencies.</h2>
          <p className="mt-3 text-sm leading-7 text-[var(--ms-mauve)]">
            Search the service, pick the closest trusted option, sign in, pay, and track the request without chasing replies.
          </p>
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
