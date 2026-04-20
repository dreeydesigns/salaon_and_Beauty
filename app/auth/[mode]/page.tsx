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
              ? "Welcome back. Pick up where you left off."
              : isSignUp
                ? "Choose the account path that fits you best."
                : "Enter your email and we will send a secure reset link."
          }
          eyebrow="Account"
          title={
            isSignIn ? "Sign in" : isSignUp ? "Choose your account" : "Reset your password"
          }
        >
          <div className="space-y-4">
            {isSignUp ? (
              <div className="grid gap-3 lg:grid-cols-3">
                <RoleChoice
                  description="Book beauty help with saved preferences and reminders."
                  href="/theme-quiz"
                  title="Sign up as Client"
                />
                <RoleChoice
                  description="Set up your salon page, team, services, and listing plan."
                  href="/onboarding/salon"
                  title="Sign up as Salon"
                />
                <RoleChoice
                  description="Set up your services, pricing, portfolio, and availability."
                  href="/onboarding/professional?role=professional"
                  title="Sign up as Professional"
                />
              </div>
            ) : null}

            {isSignIn ? (
              <div className="grid gap-3 lg:grid-cols-3">
                <RoleChoice
                  description="Open saved bookings, favourites, and reminders."
                  href={safeReturnTo}
                  title="Sign in as Client"
                />
                <RoleChoice
                  description="Open salon bookings, team updates, and business tools."
                  href="/dashboard"
                  title="Sign in as Salon"
                />
                <RoleChoice
                  description="Open requests, update portfolio, services, and payout readiness."
                  href="/dashboard"
                  title="Sign in as Professional"
                />
              </div>
            ) : null}

            {!isSignUp ? <FormField label="Email" type="email" /> : null}
            {mode !== "forgot-password" && !isSignUp ? <FormField label="Password" type="password" /> : null}

            {isSignIn || mode === "forgot-password" ? (
              <div className="flex flex-col gap-3 sm:flex-row">
                <CTAButton
                  className="sm:flex-1"
                  href={mode === "forgot-password" ? "/auth/sign-in" : safeReturnTo}
                >
                  {isSignIn ? "Continue to my account" : "Send reset link"}
                </CTAButton>
                {isSignIn ? (
                  <CTAButton className="sm:flex-1" href="/dashboard" variant="outline">
                    Open dashboard
                  </CTAButton>
                ) : null}
              </div>
            ) : (
              <div className="rounded-[24px] bg-[var(--ms-soft-bg)] px-4 py-4 text-sm leading-6 text-[var(--ms-mauve)]">
                Already joined?{" "}
                <Link className="font-semibold text-[var(--ms-plum)]" href="/auth/sign-in?returnTo=/home">
                  Sign in here.
                </Link>
              </div>
            )}
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
