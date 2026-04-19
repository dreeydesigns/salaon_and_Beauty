import { notFound } from "next/navigation";
import Link from "next/link";

import { AppShell } from "@/components/app-shell";
import { AuthCard, CTAButton, ProfileCompletionCard, SectionReveal } from "@/components/marketplace-ui";
import { profileCompletionTasks } from "@/lib/site-data";

export default async function AuthPage({
  params,
  searchParams,
}: {
  params: Promise<{ mode: string }>;
  searchParams: Promise<{ returnTo?: string }>;
}) {
  const { mode } = await params;
  const { returnTo } = await searchParams;
  const safeReturnTo = returnTo?.startsWith("/") ? returnTo : "/home";

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
              ? "Welcome back. Continue your saved beauty request without choosing everything again."
              : isSignUp
                ? "Create your account so bookings, favourites, and reminders stay beautifully organised."
                : "Enter your email and we will send a secure reset link."
          }
          eyebrow="Account"
          title={
            isSignIn ? "Sign in" : isSignUp ? "Create your account" : "Reset your password"
          }
        >
          <div className="space-y-4">
            {isSignUp ? (
              <div className="grid gap-3 md:grid-cols-2">
                <RoleChoice
                  description="Book salons and professionals with saved preferences."
                  href="/theme-quiz"
                  title="Sign up as Client"
                />
                <RoleChoice
                  description="Set up services, pricing, portfolio, and availability."
                  href="/onboarding/professional"
                  title="Sign up as Professional / Salon"
                />
              </div>
            ) : null}

            {isSignIn ? (
              <div className="grid gap-3 md:grid-cols-2">
                <RoleChoice
                  description="Continue your saved booking, favourites, and reminders."
                  href={safeReturnTo}
                  title="Sign in as Client"
                />
                <RoleChoice
                  description="Open requests, update portfolio, services, and payout readiness."
                  href="/dashboard"
                  title="Sign in as Professional"
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
              <CTAButton
                className="sm:flex-1"
                href={isSignUp ? "/theme-quiz" : mode === "forgot-password" ? "/auth/sign-in" : safeReturnTo}
              >
                {isSignIn ? "Sign in and continue" : isSignUp ? "Create account and continue" : "Send reset link"}
              </CTAButton>
              {isSignUp ? (
                <CTAButton className="sm:flex-1" href="/onboarding/professional" variant="outline">
                  Continue to professional onboarding
                </CTAButton>
              ) : null}
            </div>
          </div>
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
  href,
}: {
  title: string;
  description: string;
  href: string;
}) {
  return (
    <Link
      className="rounded-[24px] border border-[var(--ms-border)] bg-[var(--ms-soft-bg)] px-4 py-4 text-left transition hover:-translate-y-0.5 hover:border-[var(--ms-magenta)] hover:bg-[var(--ms-petal)]/70"
      href={href}
    >
      <p className="text-lg font-semibold text-[var(--ms-navy)]">{title}</p>
      <p className="mt-2 text-sm leading-6 text-[var(--ms-mauve)]">{description}</p>
    </Link>
  );
}
