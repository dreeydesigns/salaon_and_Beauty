import {
  Banknote,
  CalendarDays,
  CheckCircle2,
  CreditCard,
  Gem,
  ImagePlus,
  LockKeyhole,
  Palette,
  ShieldCheck,
  Sparkles,
  WalletCards,
} from "lucide-react";

import { AppShell } from "@/components/app-shell";
import {
  CTAButton,
  DecorativeStat,
  PortfolioGrid,
  ProfileCompletionCard,
  ScrollSection,
  SectionReveal,
  ServiceCard,
} from "@/components/marketplace-ui";
import {
  marketplaceProtectionSteps,
  payoutStates,
  protectedPaymentArchitecture,
  professionalRequests,
  professionalQualityStandards,
} from "@/lib/business-model";
import { marketplaceFlowCheckpoints } from "@/lib/marketplace-flow";
import { getProfessional, getServicesByIds, profileCompletionTasks } from "@/lib/site-data";

const activeProfessional = getProfessional("njeri-kamau");
const activeServices = activeProfessional ? getServicesByIds(activeProfessional.serviceIds) : [];

export default function DashboardPage() {
  return (
    <AppShell currentNav="profile" roleMode="professionals">
      <div className="section-grid">
        <SectionReveal className="relative overflow-hidden rounded-[40px] bg-[linear-gradient(135deg,var(--ms-plum),#6f255f_55%,var(--ms-rose))] p-6 text-white shadow-[0_28px_90px_rgba(132,36,92,0.22)] lg:p-8">
          <div className="absolute -right-10 top-8 h-44 w-44 rounded-full bg-[var(--ms-blush)]/20 blur-3xl" />
          <div className="absolute bottom-0 left-10 h-32 w-32 rounded-full bg-[var(--ms-gold)]/16 blur-3xl" />
          <div className="relative grid gap-6 xl:grid-cols-[minmax(0,0.62fr)_minmax(320px,0.38fr)] xl:items-end">
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-white/62">Professional business home</p>
              <h1 className="mt-3 max-w-4xl text-4xl font-semibold leading-tight text-white sm:text-5xl">
                Run your beauty page, requests, portfolio, and payout status from one calm place.
              </h1>
              <p className="mt-4 max-w-3xl text-sm leading-7 text-white/76">
                Mobile Salon is the bridge. Clients sign in and pay before a request becomes serious, then funds remain protected until the service is complete.
              </p>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <CTAButton className="bg-white text-[var(--ms-plum)] hover:bg-[var(--ms-ivory)]" href="/professionals/njeri-kamau">
                  Preview public page
                </CTAButton>
                <CTAButton className="border-white/20 bg-white/10 text-white hover:text-white" href="/onboarding/professional" variant="outline">
                  Customize profile
                </CTAButton>
              </div>
            </div>
            <div className="rounded-[32px] border border-white/16 bg-white/12 p-5 backdrop-blur">
              <p className="text-xs uppercase tracking-[0.22em] text-white/62">Today at a glance</p>
              <div className="mt-5 grid gap-3">
                {[
                  ["Funded requests", "12", <LockKeyhole className="h-4 w-4" key="funded" />],
                  ["Awaiting confirmation", "3", <CalendarDays className="h-4 w-4" key="waiting" />],
                  ["Ready for payout", "KES 42.8K", <WalletCards className="h-4 w-4" key="payout" />],
                ].map(([label, value, icon]) => (
                  <div className="flex items-center justify-between gap-4 rounded-[24px] bg-white/10 px-4 py-3" key={label as string}>
                    <div className="flex items-center gap-3">
                      <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/14 text-[var(--ms-blush)]">
                        {icon}
                      </span>
                      <p className="text-sm text-white/72">{label}</p>
                    </div>
                    <p className="text-lg font-semibold">{value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </SectionReveal>

        <div className="grid gap-5 md:grid-cols-3">
          <DecorativeStat icon={<CreditCard className="h-5 w-5" />} label="Client commitment" value="Paid request" />
          <DecorativeStat icon={<ShieldCheck className="h-5 w-5" />} label="Payout safety" value="Held funds" />
          <DecorativeStat icon={<Gem className="h-5 w-5" />} label="Profile standard" value="Premium" />
        </div>

        <div className="grid gap-5 xl:grid-cols-[minmax(0,0.36fr)_minmax(0,0.64fr)]">
          <ProfileCompletionCard progress={82} tasks={profileCompletionTasks} />
          <SectionReveal className="beauty-card rounded-[34px] p-6">
            <p className="text-xs uppercase tracking-[0.22em] text-[var(--ms-mauve)]">Professional page standards</p>
            <h2 className="mt-3 text-3xl font-semibold text-[var(--ms-plum)]">Only clear, beautiful, bookable profiles should go live.</h2>
            <div className="mt-5 grid gap-3 md:grid-cols-2">
              {professionalQualityStandards.map((standard) => (
                <div className="flex items-center gap-3 rounded-[22px] bg-[var(--ms-soft-bg)] px-4 py-3" key={standard}>
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--ms-petal)] text-[var(--ms-rose)]">
                    <CheckCircle2 className="h-4 w-4" />
                  </span>
                  <p className="text-sm leading-6 text-[var(--ms-charcoal)]">{standard}</p>
                </div>
              ))}
            </div>
          </SectionReveal>
        </div>

        <SectionReveal className="beauty-card rounded-[34px] p-6">
          <p className="text-xs uppercase tracking-[0.22em] text-[var(--ms-mauve)]">Payout pipeline</p>
          <h2 className="mt-3 text-3xl font-semibold text-[var(--ms-plum)]">Like a ride app: payout follows completed service.</h2>
          <div className="mt-5 space-y-3">
            {marketplaceProtectionSteps.map((step, index) => (
              <div className="grid gap-3 rounded-[24px] bg-[var(--ms-soft-bg)] p-4 sm:grid-cols-[44px_minmax(0,1fr)]" key={step.title}>
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-sm font-semibold text-[var(--ms-rose)] shadow-[0_10px_24px_rgba(132,36,92,0.08)]">
                  {index + 1}
                </span>
                <div>
                  <p className="font-semibold text-[var(--ms-navy)]">{step.title}</p>
                  <p className="mt-1 text-sm leading-6 text-[var(--ms-mauve)]">{step.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </SectionReveal>

        <section className="section-grid">
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-[var(--ms-mauve)]">Request desk</p>
            <h2 className="mt-3 text-3xl font-semibold text-[var(--ms-plum)]">Paid, pending, and in-service requests stay separated.</h2>
          </div>
          <div className="grid gap-4 xl:grid-cols-3">
            {professionalRequests.map((request) => (
              <SectionReveal className="beauty-card rounded-[30px] p-5" key={`${request.client}-${request.time}`}>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-[var(--ms-mauve)]">{request.status}</p>
                    <h3 className="mt-3 text-2xl font-semibold text-[var(--ms-navy)]">{request.client}</h3>
                  </div>
                  <span className="rounded-full bg-[var(--ms-petal)] px-3 py-1 text-xs font-semibold text-[var(--ms-rose)]">
                    {request.value}
                  </span>
                </div>
                <p className="mt-4 text-sm leading-6 text-[var(--ms-charcoal)]">{request.service}</p>
                <p className="mt-2 text-sm text-[var(--ms-mauve)]">{request.time}</p>
                <div className="mt-5 flex flex-col gap-2">
                  <CTAButton href="/activity" variant="dark">
                    Open request
                  </CTAButton>
                  <CTAButton href="/help" variant="outline">
                    Dispute / support
                  </CTAButton>
                </div>
              </SectionReveal>
            ))}
          </div>
        </section>

        <section className="section-grid">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.22em] text-[var(--ms-mauve)]">Portfolio showcase</p>
              <h2 className="mt-3 text-3xl font-semibold text-[var(--ms-plum)]">Show work beautifully before anyone trusts you</h2>
            </div>
            <CTAButton className="hidden sm:inline-flex" href="/professionals/njeri-kamau" variant="outline">
              View live profile
            </CTAButton>
          </div>
          {activeProfessional ? <PortfolioGrid items={activeProfessional.gallery} /> : null}
          <article className="beauty-card flex min-h-[260px] flex-col justify-between rounded-[30px] border-dashed p-6">
            <div>
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--ms-petal)] text-[var(--ms-rose)]">
                <ImagePlus className="h-5 w-5" />
              </span>
              <h3 className="mt-4 text-2xl font-semibold text-[var(--ms-plum)]">Add a portfolio set</h3>
              <p className="mt-3 text-sm leading-6 text-[var(--ms-mauve)]">
                Upload before/after, finished look, workspace, tools, and close-up detail photos. No blurry work goes live.
              </p>
            </div>
            <CTAButton className="mt-5" href="/onboarding/professional" variant="outline">
              Add images
            </CTAButton>
          </article>
          <CTAButton className="sm:hidden" href="/professionals/njeri-kamau" variant="outline">
            View live profile
          </CTAButton>
        </section>

        <ScrollSection eyebrow="Services and pricing" href="/services" hrefLabel="View client catalogue" title="Keep services organised, priced, and easy to request">
          {activeServices.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
          <article className="beauty-card flex min-h-[260px] flex-col justify-between rounded-[30px] p-6">
            <div>
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--ms-petal)] text-[var(--ms-rose)]">
                <Sparkles className="h-5 w-5" />
              </span>
              <h3 className="mt-4 text-2xl font-semibold text-[var(--ms-plum)]">Create a package</h3>
              <p className="mt-3 text-sm leading-6 text-[var(--ms-mauve)]">
                Bundle services clients often request together, like wash day plus styling or bridal trial plus event glam.
              </p>
            </div>
            <CTAButton className="mt-5" href="/onboarding/professional" variant="outline">
              Add package
            </CTAButton>
          </article>
        </ScrollSection>

        <div className="grid gap-5 xl:grid-cols-2">
          <SectionReveal className="beauty-card rounded-[34px] p-6">
            <div className="flex items-start gap-4">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[var(--ms-petal)] text-[var(--ms-rose)]">
                <Palette className="h-5 w-5" />
              </span>
              <div>
                <p className="text-xs uppercase tracking-[0.22em] text-[var(--ms-mauve)]">Page customization</p>
                <h2 className="mt-3 text-3xl font-semibold text-[var(--ms-plum)]">Beautiful, but controlled by brand standards.</h2>
                <p className="mt-3 text-sm leading-7 text-[var(--ms-mauve)]">
                  Professionals can update their bio, hero image, portfolio order, services, areas, and availability while the platform keeps typography, contrast, spacing, and trust badges consistent.
                </p>
                <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                  <CTAButton href="/onboarding/professional">Edit profile</CTAButton>
                  <CTAButton href="/professionals/njeri-kamau" variant="outline">
                    Public preview
                  </CTAButton>
                </div>
              </div>
            </div>
          </SectionReveal>

          <SectionReveal className="rounded-[34px] bg-[var(--ms-navy)] p-6 text-white shadow-[0_22px_60px_rgba(13,27,42,0.22)]">
            <div className="flex items-start gap-4">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white/10 text-[var(--ms-gold)]">
                <Banknote className="h-5 w-5" />
              </span>
              <div>
                <p className="text-xs uppercase tracking-[0.22em] text-white/62">Backend readiness</p>
                <h2 className="mt-3 text-3xl font-semibold">Built for request volume, not inbox chaos.</h2>
                <p className="mt-3 text-sm leading-7 text-white/74">
                  The production backend should queue paid requests, store payment state, require connected payout accounts, log evidence, and pause release during disputes.
                </p>
                <div className="mt-5 grid gap-2">
                  {marketplaceFlowCheckpoints.map((checkpoint) => (
                    <div className="flex items-center gap-3 rounded-[20px] bg-white/8 px-4 py-3" key={checkpoint}>
                      <CheckCircle2 className="h-4 w-4 text-[var(--ms-gold)]" />
                      <p className="text-sm leading-6 text-white/72">{checkpoint}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-5 rounded-[26px] border border-white/10 bg-white/8 p-4">
                  <p className="text-xs uppercase tracking-[0.22em] text-white/62">Production payment shape</p>
                  <div className="mt-3 grid gap-2">
                    {protectedPaymentArchitecture.map((item) => (
                      <p className="text-sm leading-6 text-white/70" key={item}>
                        {item}
                      </p>
                    ))}
                  </div>
                </div>
                <div className="mt-5 grid gap-3">
                  {payoutStates.map((state) => (
                    <div className="rounded-[22px] bg-white/8 px-4 py-3" key={state.label}>
                      <div className="flex items-center justify-between gap-3">
                        <p className="font-semibold">{state.label}</p>
                        <span className="rounded-full bg-white/10 px-3 py-1 text-xs text-white/72">{state.tone}</span>
                      </div>
                      <p className="mt-2 text-sm leading-6 text-white/66">{state.copy}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </SectionReveal>
        </div>
      </div>
    </AppShell>
  );
}
