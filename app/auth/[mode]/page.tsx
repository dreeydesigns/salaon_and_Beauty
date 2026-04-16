import { notFound } from "next/navigation";

import { AppShell } from "@/components/app-shell";
import { AuthCard, CTAButton, ProfileCompletionCard, SectionReveal } from "@/components/marketplace-ui";
import { profileCompletionTasks } from "@/lib/site-data";

export default async function AuthPage({
  params,
}: {
  params: Promise<{ mode: string }>;
}) {
  const { mode } = await params;

  if (!["sign-in", "sign-up", "forgot-password"].includes(mode)) {
    notFound();
  }

  const isSignIn = mode === "sign-in";
  const isSignUp = mode === "sign-up";

  return (
    <AppShell currentNav="profile" roleMode="salons" showBottomNav={false}>
      <SectionReveal>
        <AuthCard
          aside={
            isSignUp ? (
              <ProfileCompletionCard progress={45} tasks={profileCompletionTasks.slice(0, 3)} />
            ) : null
          }
          description={
            isSignIn
              ? "Welcome back. Pick up your next booking, saved salon, or professional request without any friction."
              : isSignUp
                ? "Create an account in a clean, mobile-first flow. Clients can stay simple. Professionals can continue into onboarding."
                : "Enter the email linked to your account and we will send a secure reset link with a WhatsApp fallback note."
          }
          eyebrow="Account"
          title={
            isSignIn ? "Sign in" : isSignUp ? "Create your account" : "Reset your password"
          }
        >
          <form className="space-y-4">
            {isSignUp ? (
              <div className="grid gap-3 md:grid-cols-2">
                <RoleChoice title="Client" description="Book salons and professionals with saved preferences." />
                <RoleChoice
                  title="Professional / Salon"
                  description="Set up services, pricing, portfolio, and availability."
                />
              </div>
            ) : null}

            {isSignUp ? <FormField label="Full name" /> : null}
            {isSignUp ? <FormField label="Phone" /> : null}
            <FormField label="Email" type="email" />
            {mode !== "forgot-password" ? <FormField label="Password" type="password" /> : null}
            {isSignUp ? <FormField label="Confirm password" type="password" /> : null}

            {isSignUp ? (
              <label className="flex items-start gap-3 rounded-[20px] bg-[var(--ms-soft-bg)] px-4 py-4 text-sm text-[var(--ms-mauve)]">
                <input className="mt-1 h-4 w-4 accent-[var(--ms-magenta)]" type="checkbox" />
                I agree to the terms, privacy expectations, and clear cancellation policy.
              </label>
            ) : null}

            <div className="flex flex-col gap-3 sm:flex-row">
              <CTAButton className="sm:flex-1" type="submit">
                {isSignIn ? "Sign in" : isSignUp ? "Create account" : "Send reset link"}
              </CTAButton>
              {isSignUp ? (
                <CTAButton className="sm:flex-1" href="/onboarding/professional" variant="outline">
                  Continue to professional onboarding
                </CTAButton>
              ) : null}
            </div>
          </form>
        </AuthCard>
      </SectionReveal>
    </AppShell>
  );
}

function FormField({
  label,
  type = "text",
}: {
  label: string;
  type?: string;
}) {
  return (
    <label className="block rounded-[24px] border border-[var(--ms-border)] bg-white px-4 py-4">
      <span className="text-xs uppercase tracking-[0.2em] text-[var(--ms-mauve)]">{label}</span>
      <input
        className="mt-3 w-full bg-transparent text-sm text-[var(--ms-charcoal)] outline-none placeholder:text-[var(--ms-mauve)]"
        placeholder={label}
        type={type}
      />
    </label>
  );
}

function RoleChoice({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <button
      className="rounded-[24px] border border-[var(--ms-border)] bg-[var(--ms-soft-bg)] px-4 py-4 text-left transition hover:border-[var(--ms-magenta)]"
      type="button"
    >
      <p className="text-lg font-semibold text-[var(--ms-navy)]">{title}</p>
      <p className="mt-2 text-sm leading-6 text-[var(--ms-mauve)]">{description}</p>
    </button>
  );
}
