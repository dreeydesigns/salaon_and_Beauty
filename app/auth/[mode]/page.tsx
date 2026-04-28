import { notFound } from "next/navigation";
import Link from "next/link";

import { AppShell } from "@/components/app-shell";
import { AuthCard, CTAButton, ProfileCompletionCard, SectionReveal } from "@/components/marketplace-ui";
import { SessionLaunchButton } from "@/components/session-launch-button";
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
              ? "Choose the workspace you want to open."
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
                  description="Set up a paid monthly salon subscription with services, team, and listing controls."
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
                <SessionRoleCard
                  description="Open saved bookings, favourites, and personal settings."
                  destination={safeReturnTo}
                  role="client"
                  title="Sign in as Client"
                />
                <SessionRoleCard
                  description="Open salon customization, subscription, and page controls."
                  destination="/profile"
                  role="salon"
                  title="Sign in as Salon"
                />
                <SessionRoleCard
                  description="Open profile cards, publish controls, and public page settings."
                  destination="/profile"
                  role="professional"
                  title="Sign in as Professional"
                />
              </div>
            ) : null}

            {mode === "forgot-password" ? <FormField label="Email" type="email" /> : null}

            {mode === "forgot-password" ? (
              <div className="flex flex-col gap-3 sm:flex-row">
                <CTAButton
                  className="sm:flex-1"
                  href="/auth/sign-in"
                >
                  Send reset link
                </CTAButton>
              </div>
            ) : isSignIn ? (
              <div className="rounded-[24px] bg-[var(--ms-soft-bg)] px-4 py-4 text-sm leading-6 text-[var(--ms-mauve)]">
                Pick the role you want to open. Client accounts go to saved bookings and personal settings. Salon and professional accounts go straight to profile customization.
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

function SessionRoleCard({
  title,
  description,
  role,
  destination,
}: {
  title: string;
  description: string;
  role: "client" | "salon" | "professional";
  destination: string;
}) {
  return (
    <div className="rounded-[24px] border border-[var(--ms-border)] bg-[var(--ms-soft-bg)] px-4 py-4">
      <p className="text-lg font-semibold text-[var(--ms-navy)]">{title}</p>
      <p className="mt-2 text-sm leading-6 text-[var(--ms-mauve)]">{description}</p>
      <SessionLaunchButton className="mt-4 w-full" destination={destination} role={role}>
        Continue
      </SessionLaunchButton>
    </div>
  );
}
