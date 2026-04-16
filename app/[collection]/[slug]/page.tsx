import { notFound } from "next/navigation";

import { AppShell } from "@/components/app-shell";
import {
  AvailabilityChips,
  CTAButton,
  PackageCard,
  PortfolioGrid,
  ProfessionalCard,
  ReviewCard,
  SectionReveal,
  ServiceCard,
  VerifiedBadge,
  WhatsAppButton,
} from "@/components/marketplace-ui";
import {
  getProfessional,
  getProfessionalsForSalon,
  getSalon,
  getServicesByIds,
  testimonials,
} from "@/lib/site-data";
import { buildBookingHref } from "@/lib/utils";

export default async function DetailPage({
  params,
}: {
  params: Promise<{ collection: string; slug: string }>;
}) {
  const { collection, slug } = await params;

  if (collection !== "salons" && collection !== "professionals") {
    notFound();
  }

  const item = collection === "salons" ? getSalon(slug) : getProfessional(slug);

  if (!item) {
    notFound();
  }

  const services = getServicesByIds(item.serviceIds);
  const relatedProfessionals =
    collection === "salons" ? getProfessionalsForSalon(item.slug) : [];
  const bookingHref = buildBookingHref({ targetType: collection, targetId: item.slug });

  return (
    <AppShell currentNav={collection} roleMode={collection}>
      <div className="section-grid">
        <SectionReveal className={`rounded-[40px] bg-gradient-to-br ${item.heroMood} p-6 text-white shadow-[0_22px_60px_rgba(13,27,42,0.24)] lg:p-8`}>
          <div className="grid gap-6 xl:grid-cols-[minmax(0,0.66fr)_minmax(320px,0.34fr)]">
            <div>
              <div className="flex flex-wrap items-center gap-3">
                {item.verified ? <VerifiedBadge /> : null}
                <span className="rounded-full bg-white/14 px-3 py-1 text-xs font-semibold">{item.location}</span>
                <span className="rounded-full bg-white/14 px-3 py-1 text-xs font-semibold">
                  {item.rating} rating · {item.reviewCount} reviews
                </span>
              </div>
              <h1 className="mt-5 font-display text-5xl leading-tight">{item.name}</h1>
              {"specialty" in item ? (
                <p className="mt-3 text-base text-white/82">{item.specialty}</p>
              ) : (
                <p className="mt-3 text-base text-white/82">{item.tagline}</p>
              )}
              <p className="mt-4 max-w-3xl text-sm leading-7 text-white/74">{item.description}</p>
              <div className="mt-6 flex flex-wrap gap-3">
                <CTAButton className="bg-white text-[var(--ms-navy)] hover:bg-[var(--ms-ivory)]" href={bookingHref}>
                  {collection === "salons" ? "Book this salon" : "Request booking"}
                </CTAButton>
                <WhatsAppButton className="border-white/20 bg-white/10 text-white hover:text-white" label={item.name} />
              </div>
            </div>
            <div className="rounded-[32px] border border-white/10 bg-white/8 p-5 backdrop-blur">
              <p className="text-xs uppercase tracking-[0.22em] text-white/62">Coverage and availability</p>
              <AvailabilityChips items={item.areasServed} />
              <div className="mt-5 rounded-[24px] bg-white/8 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-white/60">Next available</p>
                <p className="mt-2 text-lg font-semibold">{item.nextAvailable}</p>
              </div>
              {"serviceMode" in item ? (
                <div className="mt-4 rounded-[24px] bg-white/8 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-white/60">Service mode</p>
                  <p className="mt-2 text-lg font-semibold">{item.serviceMode}</p>
                  <p className="mt-2 text-sm text-white/74">
                    {item.salonAffiliation === "Independent"
                      ? "Independent professional with mobile support."
                      : `Also works from ${item.salonAffiliation}.`}
                  </p>
                </div>
              ) : (
                <div className="mt-4 rounded-[24px] bg-white/8 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-white/60">Service model</p>
                  <p className="mt-2 text-lg font-semibold">
                    {item.mobileService ? "In-salon and mobile" : "In-salon focus"}
                  </p>
                </div>
              )}
            </div>
          </div>
        </SectionReveal>

        <div className="grid gap-6 xl:grid-cols-[minmax(0,0.66fr)_minmax(320px,0.34fr)]">
          <div className="section-grid">
            <section className="rounded-[32px] bg-white p-6 shadow-[0_18px_48px_rgba(13,27,42,0.08)]">
              <p className="text-xs uppercase tracking-[0.22em] text-[var(--ms-mauve)]">About</p>
              <p className="mt-4 text-base leading-8 text-[var(--ms-charcoal)]">
                {"about" in item ? item.about : item.bio}
              </p>
            </section>

            <section className="section-grid rounded-[32px] bg-white p-6 shadow-[0_18px_48px_rgba(13,27,42,0.08)]">
              <div className="flex items-end justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.22em] text-[var(--ms-mauve)]">Services</p>
                  <h2 className="mt-3 text-3xl font-semibold text-[var(--ms-navy)]">Prices and inclusions stay visible</h2>
                </div>
              </div>
              <div className="grid gap-4">
                {services.map((service) => (
                  <ServiceCard compact key={service.id} service={service} />
                ))}
              </div>
            </section>

            {item.packageOffers.length ? (
              <section className="section-grid rounded-[32px] bg-white p-6 shadow-[0_18px_48px_rgba(13,27,42,0.08)]">
                <div>
                  <p className="text-xs uppercase tracking-[0.22em] text-[var(--ms-mauve)]">Packages</p>
                  <h2 className="mt-3 text-3xl font-semibold text-[var(--ms-navy)]">Bundles that make sense in real life</h2>
                </div>
                <div className="grid gap-4 lg:grid-cols-2">
                  {item.packageOffers.map((offer) => (
                    <PackageCard key={offer.id} offer={offer} />
                  ))}
                </div>
              </section>
            ) : null}

            {"specialty" in item ? null : relatedProfessionals.length ? (
              <section className="section-grid rounded-[32px] bg-white p-6 shadow-[0_18px_48px_rgba(13,27,42,0.08)]">
                <div>
                  <p className="text-xs uppercase tracking-[0.22em] text-[var(--ms-mauve)]">Available professionals</p>
                  <h2 className="mt-3 text-3xl font-semibold text-[var(--ms-navy)]">The team behind this salon</h2>
                </div>
                <div className="grid gap-4 lg:grid-cols-2">
                  {relatedProfessionals.map((professional) => (
                    <ProfessionalCard key={professional.slug} professional={professional} />
                  ))}
                </div>
              </section>
            ) : null}

            <section className="section-grid dark-atmosphere rounded-[32px] p-6 text-white shadow-[0_18px_48px_rgba(13,27,42,0.22)]">
              <div>
                <p className="text-xs uppercase tracking-[0.22em] text-white/60">Work done</p>
                <h2 className="mt-3 text-3xl font-semibold">Portfolio built for trust</h2>
              </div>
              <PortfolioGrid dark items={item.gallery} />
            </section>

            <section className="section-grid rounded-[32px] bg-white p-6 shadow-[0_18px_48px_rgba(13,27,42,0.08)]">
              <div>
                <p className="text-xs uppercase tracking-[0.22em] text-[var(--ms-mauve)]">Reviews</p>
                <h2 className="mt-3 text-3xl font-semibold text-[var(--ms-navy)]">Structured feedback with specifics</h2>
              </div>
              <div className="grid gap-4 lg:grid-cols-3">
                {testimonials.map((review) => (
                  <ReviewCard key={review.id} review={review} />
                ))}
              </div>
            </section>

            <section className="section-grid rounded-[32px] bg-white p-6 shadow-[0_18px_48px_rgba(13,27,42,0.08)]">
              <div>
                <p className="text-xs uppercase tracking-[0.22em] text-[var(--ms-mauve)]">FAQ</p>
                <h2 className="mt-3 text-3xl font-semibold text-[var(--ms-navy)]">What clients ask before they commit</h2>
              </div>
              <div className="space-y-3">
                {item.faq.map((faq) => (
                  <details className="rounded-[24px] border border-[var(--ms-border)] bg-[var(--ms-soft-bg)] p-5" key={faq.question}>
                    <summary className="cursor-pointer text-lg font-semibold text-[var(--ms-navy)]">{faq.question}</summary>
                    <p className="mt-3 text-sm leading-7 text-[var(--ms-mauve)]">{faq.answer}</p>
                  </details>
                ))}
              </div>
            </section>
          </div>

          <div className="section-grid">
            <aside className="sticky top-44 rounded-[32px] bg-white p-5 shadow-[0_18px_48px_rgba(13,27,42,0.08)]">
              <p className="text-xs uppercase tracking-[0.22em] text-[var(--ms-mauve)]">Ready to book</p>
              <h2 className="mt-3 text-3xl font-semibold text-[var(--ms-navy)]">Keep the next action obvious.</h2>
              <p className="mt-3 text-sm leading-7 text-[var(--ms-mauve)]">
                Confirm the target, choose services, and lock the slot with visible pricing before the request is sent.
              </p>
              <div className="mt-5 flex flex-col gap-3">
                <CTAButton href={bookingHref}>
                  {collection === "salons" ? "Book this salon" : "Request this professional"}
                </CTAButton>
                <WhatsAppButton label={item.name} />
              </div>
            </aside>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
