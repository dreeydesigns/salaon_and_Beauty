import { AppShell } from "@/components/app-shell";
import { CTAButton, ProfileCompletionCard, SectionReveal } from "@/components/marketplace-ui";
import { profileCompletionTasks, serviceCategories } from "@/lib/site-data";

export default function ProfessionalOnboardingPage() {
  return (
    <AppShell currentNav="profile" roleMode="professionals" showBottomNav={false}>
      <div className="grid gap-6 xl:grid-cols-[minmax(0,0.68fr)_minmax(320px,0.32fr)]">
        <SectionReveal className="rounded-[36px] bg-white p-6 shadow-[0_18px_48px_rgba(13,27,42,0.08)] lg:p-8">
          <p className="text-xs uppercase tracking-[0.22em] text-[var(--ms-mauve)]">Professional onboarding</p>
          <h1 className="mt-3 text-4xl font-semibold text-[var(--ms-navy)]">Set up a profile clients can trust at first glance.</h1>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-[var(--ms-mauve)]">
            Keep it practical: services, pricing, locations, portfolio, and whether you work in salon, mobile, or both.
          </p>

          <form className="mt-8 section-grid">
            <div className="grid gap-4 md:grid-cols-2">
              <FormField label="Display name" />
              <FormField label="Business type" placeholder="Independent, salon team, studio owner" />
              <FormField label="Location" />
              <FormField label="Phone" />
            </div>

            <div className="rounded-[28px] bg-[var(--ms-soft-bg)] p-5">
              <p className="text-xs uppercase tracking-[0.22em] text-[var(--ms-mauve)]">Categories</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {serviceCategories.map((category) => (
                  <button
                    className="rounded-full border border-[var(--ms-border)] bg-white px-4 py-2 text-sm text-[var(--ms-navy)]"
                    key={category.id}
                    type="button"
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <FormField label="Service mode" placeholder="In salon, mobile, or both" />
              <FormField label="Areas served" placeholder="Kilimani, Lavington, South B..." />
            </div>

            <label className="block rounded-[24px] border border-[var(--ms-border)] bg-white px-4 py-4">
              <span className="text-xs uppercase tracking-[0.2em] text-[var(--ms-mauve)]">Short bio</span>
              <textarea
                className="mt-3 min-h-28 w-full resize-none bg-transparent text-sm leading-6 text-[var(--ms-charcoal)] outline-none placeholder:text-[var(--ms-mauve)]"
                placeholder="Tell clients what you are best at, who you serve, and what your appointment style feels like."
              />
            </label>

            <div className="grid gap-4 md:grid-cols-2">
              <FormField label="Starter service" placeholder="e.g. Knotless braids" />
              <FormField label="Price range" placeholder="KES 3,000 - 6,500" />
              <FormField label="Duration" placeholder="3 - 6 hrs" />
              <FormField label="Portfolio upload" placeholder="Image placeholder ready" />
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <CTAButton type="submit">Save onboarding draft</CTAButton>
              <CTAButton href="/dashboard" variant="outline">
                View dashboard skeleton
              </CTAButton>
            </div>
          </form>
        </SectionReveal>

        <div className="section-grid">
          <ProfileCompletionCard progress={72} tasks={profileCompletionTasks} />
          <SectionReveal className="rounded-[32px] bg-[var(--ms-navy)] p-6 text-white shadow-[0_18px_48px_rgba(13,27,42,0.22)]">
            <p className="text-xs uppercase tracking-[0.22em] text-white/60">Why this matters</p>
            <h2 className="mt-3 text-3xl font-semibold">Professionals are not secondary.</h2>
            <p className="mt-4 text-sm leading-7 text-white/74">
              Your profile needs to sell clarity: what you do, where you work, how much it costs, and why a client should trust you.
            </p>
          </SectionReveal>
        </div>
      </div>
    </AppShell>
  );
}

function FormField({
  label,
  placeholder,
}: {
  label: string;
  placeholder?: string;
}) {
  return (
    <label className="block rounded-[24px] border border-[var(--ms-border)] bg-white px-4 py-4">
      <span className="text-xs uppercase tracking-[0.2em] text-[var(--ms-mauve)]">{label}</span>
      <input
        className="mt-3 w-full bg-transparent text-sm text-[var(--ms-charcoal)] outline-none placeholder:text-[var(--ms-mauve)]"
        placeholder={placeholder ?? label}
      />
    </label>
  );
}
