import { AppShell } from "@/components/app-shell";
import {
  CTAButton,
  CategoryCircle,
  ProfessionalCard,
  SalonCard,
  SectionReveal,
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
              <h2 className="mt-3 text-3xl font-semibold text-[var(--ms-navy)]">Best when you want a studio or a wider menu</h2>
              <p className="mt-3 text-sm leading-7 text-[var(--ms-mauve)]">
                Compare verified studios by area, price floor, categories, and whether they support mobile service too.
              </p>
              <div className="mt-5">
                <SalonCard salon={salons[0]} />
              </div>
            </SectionReveal>

            <SectionReveal className="rounded-[32px] bg-white p-5 shadow-[0_12px_40px_rgba(13,27,42,0.08)]">
              <p className="text-xs uppercase tracking-[0.22em] text-[var(--ms-mauve)]">Browse professionals</p>
              <h2 className="mt-3 text-3xl font-semibold text-[var(--ms-navy)]">Best when the person matters as much as the place</h2>
              <p className="mt-3 text-sm leading-7 text-[var(--ms-mauve)]">
                Go straight to specialists in bridal glam, textured hair care, nails, and mobile grooming.
              </p>
              <div className="mt-5">
                <ProfessionalCard professional={professionals[1]} />
              </div>
            </SectionReveal>
          </div>
        </section>

        <section className="section-grid rounded-[36px] bg-white p-6 shadow-[0_18px_48px_rgba(13,27,42,0.08)] lg:p-8">
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-[var(--ms-mauve)]">Start by service</p>
            <h2 className="mt-3 text-3xl font-semibold text-[var(--ms-navy)]">Move from what you need to who should do it</h2>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {serviceCategories.map((category) => (
              <CategoryCircle color={category.color} detail={category.detail} key={category.id} name={category.name} />
            ))}
          </div>
        </section>
      </div>
    </AppShell>
  );
}
