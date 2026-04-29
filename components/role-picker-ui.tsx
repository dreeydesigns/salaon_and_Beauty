"use client";

import Link from "next/link";
import { ArrowRight, Building2, Crown, Sparkles, ShieldCheck, ShoppingBag, Truck } from "lucide-react";
import { useState } from "react";

import { SessionLaunchButton } from "@/components/session-launch-button";
import { cn } from "@/lib/utils";

// ─── Role definitions ────────────────────────────────────────────────────────

const ROLES = [
  {
    key: "client" as const,
    label: "Client",
    tagline: "Book a beauty service",
    description:
      "Find salons and professionals near you, see real prices, and confirm a booking in minutes.",
    badge: "Most users start here",
    icon: Sparkles,
    color: "#C8284A",
    colorLight: "rgba(200,40,74,0.10)",
    colorBorder: "rgba(200,40,74,0.32)",
    signUpHref: "/signup/client",
    signInDest: "/home",
    showInSignIn: true,
  },
  {
    key: "salon" as const,
    label: "Salon",
    tagline: "List your salon",
    description:
      "Showcase your team, services, and portfolio. Accept bookings and manage your business page.",
    badge: "Business account",
    icon: Building2,
    color: "#BF8C2E",
    colorLight: "rgba(191,140,46,0.10)",
    colorBorder: "rgba(191,140,46,0.32)",
    signUpHref: "/onboarding/salon",
    signInDest: "/profile",
    showInSignIn: true,
  },
  {
    key: "professional" as const,
    label: "Professional",
    tagline: "Offer your skills",
    description:
      "Build a bookable profile with your portfolio, pricing, and availability. No rent barrier.",
    badge: "Independent pro",
    icon: Crown,
    color: "#1A7A6B",
    colorLight: "rgba(26,122,107,0.10)",
    colorBorder: "rgba(26,122,107,0.32)",
    signUpHref: "/onboarding/professional?role=professional",
    signInDest: "/profile",
    showInSignIn: true,
  },
  {
    key: "shop" as const,
    label: "Shop",
    tagline: "Sell beauty products",
    description:
      "List and sell genuine beauty products on Counter. Escrow-protected. 5% commission only when you sell.",
    badge: "Seller account",
    icon: ShoppingBag,
    color: "#8B5CF6",
    colorLight: "rgba(139,92,246,0.10)",
    colorBorder: "rgba(139,92,246,0.32)",
    signUpHref: "/onboarding/shop",
    signInDest: "/dashboard/shop",
    showInSignIn: false, // Shop uses separate login — not in account switcher
  },
  {
    key: "delivery" as const,
    label: "Delivery",
    tagline: "Deliver for shops",
    description:
      "Partner with Shop+ sellers as an independent delivery rider. Earn per delivery across Nairobi.",
    badge: "Rider account",
    icon: Truck,
    color: "#EA580C",
    colorLight: "rgba(234,88,12,0.10)",
    colorBorder: "rgba(234,88,12,0.32)",
    signUpHref: "/onboarding/delivery",
    signInDest: "/dashboard/delivery",
    showInSignIn: false, // Delivery uses separate login — not in account switcher
  },
] as const;

type RoleKey = (typeof ROLES)[number]["key"];

// ─── Community standards content ─────────────────────────────────────────────

const COMMUNITY_STANDARDS = [
  "Be who you say you are. Misrepresentation is grounds for permanent removal.",
  "Respect every person's time. Cancel with as much notice as possible.",
  "Transact through the platform. Off-platform payment requests are a red flag.",
  "Sell what you say you are selling. Counterfeit products harm real people.",
  "Leave honest reviews. Your review helps the next woman make a better decision.",
  "This is a safe space. Harassment and threats result in permanent removal.",
  "Report what you see. You are protecting yourself and every other woman here.",
];

// ─── Checkbox atom ─────────────────────────────────────────────────────────────

function AgreementCheckbox({
  checked,
  onChange,
  children,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  children: React.ReactNode;
}) {
  return (
    <label className="flex cursor-pointer items-start gap-3 rounded-[14px] border border-[var(--ms-border)] bg-white px-4 py-3 transition hover:border-[var(--ms-rose)]/40">
      <span
        className={cn(
          "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border-2 transition",
          checked ? "border-[var(--ms-rose)] bg-[var(--ms-rose)] text-white" : "border-[var(--ms-border)] bg-white",
        )}
        style={{ minWidth: "1.25rem", minHeight: "1.25rem" }}
      >
        {checked ? (
          <svg className="h-3 w-3" viewBox="0 0 12 12" fill="none">
            <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        ) : null}
      </span>
      <input checked={checked} className="sr-only" onChange={(e) => onChange(e.target.checked)} type="checkbox" />
      <span className="text-xs leading-5 text-[var(--ms-charcoal)]">{children}</span>
    </label>
  );
}

// ─── Sign-up picker ───────────────────────────────────────────────────────────

export function SignUpRolePicker() {
  const [active, setActive] = useState<RoleKey>("client");
  const [agreedCommunity, setAgreedCommunity] = useState(false);
  const [agreedTerms, setAgreedTerms] = useState(false);
  const role = ROLES.find((r) => r.key === active)!;
  const canProceed = agreedCommunity && agreedTerms;

  // Reset agreements when switching role
  function handleRoleChange(key: RoleKey) {
    setActive(key);
    setAgreedCommunity(false);
    setAgreedTerms(false);
  }

  return (
    <div className="space-y-5">
      {/* Tab pills */}
      <div className="flex gap-2 rounded-[20px] border border-[var(--ms-border)] bg-[var(--ms-soft-bg)] p-1.5">
        {ROLES.map((r) => {
          const Icon = r.icon;
          const isActive = r.key === active;
          return (
            <button
              key={r.key}
              type="button"
              onClick={() => handleRoleChange(r.key)}
              className="flex flex-1 items-center justify-center gap-2 rounded-[14px] px-3 py-2.5 text-sm font-semibold transition-all"
              style={
                isActive
                  ? { backgroundColor: r.color, color: "#fff", boxShadow: `0 6px 20px ${r.color}44` }
                  : { color: "var(--ms-mauve)" }
              }
            >
              <Icon className="h-4 w-4 shrink-0" />
              <span className="hidden sm:inline">{r.label}</span>
            </button>
          );
        })}
      </div>

      {/* Active role card */}
      <div
        className="rounded-[24px] border p-5 transition-all"
        style={{ backgroundColor: role.colorLight, borderColor: role.colorBorder }}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <span
              className="inline-flex rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em]"
              style={{ backgroundColor: role.color, color: "#fff" }}
            >
              {role.badge}
            </span>
            <p className="mt-3 text-2xl font-semibold" style={{ color: role.color }}>
              {role.tagline}
            </p>
            <p className="mt-2 max-w-sm text-sm leading-6 text-[var(--ms-charcoal)]">
              {role.description}
            </p>
          </div>
          <span
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-white"
            style={{ backgroundColor: role.color }}
          >
            <role.icon className="h-5 w-5" />
          </span>
        </div>

        {/* Community Standards — separate screen per spec (shown inline here as collapsible) */}
        <div className="mt-5 rounded-[18px] border border-[var(--ms-border)] bg-white p-4">
          <div className="flex items-start gap-3">
            <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-[var(--ms-rose)]" />
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--ms-navy)]">
                Our Community Standards
              </p>
              <p className="mt-1 text-xs text-[var(--ms-mauve)]">
                This platform is built for women who take care of themselves. We hold every member to these standards.
              </p>
            </div>
          </div>
          <ul className="mt-3 space-y-1.5">
            {COMMUNITY_STANDARDS.map((standard, i) => (
              <li key={i} className="flex items-start gap-2 text-xs leading-5 text-[var(--ms-charcoal)]">
                <span className="mt-0.5 shrink-0 text-[var(--ms-rose)]">✦</span>
                {standard}
              </li>
            ))}
          </ul>
        </div>

        {/* Agreement checkboxes — MUST NOT be pre-ticked per Consumer Protection Act 2012 */}
        <div className="mt-4 space-y-3">
          <AgreementCheckbox checked={agreedCommunity} onChange={setAgreedCommunity}>
            I agree to the{" "}
            <span className="font-semibold text-[var(--ms-navy)]">Community Standards</span>{" "}
            above and commit to this community.
          </AgreementCheckbox>

          <AgreementCheckbox checked={agreedTerms} onChange={setAgreedTerms}>
            I have read and agree to Mobile Salon's{" "}
            <Link
              href="/terms"
              className="font-semibold text-[var(--ms-rose)] underline underline-offset-2"
              onClick={(e) => e.stopPropagation()}
            >
              Terms & Conditions
            </Link>
            . I am 18 years of age or older.
          </AgreementCheckbox>
        </div>

        {/* CTA — disabled until both checkboxes ticked */}
        {canProceed ? (
          <Link
            href={role.signUpHref}
            className="mt-5 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-[16px] text-sm font-semibold text-white transition hover:brightness-110"
            style={{ backgroundColor: role.color }}
          >
            Continue as {role.label}
            <ArrowRight className="h-4 w-4" />
          </Link>
        ) : (
          <button
            disabled
            className="mt-5 inline-flex min-h-12 w-full cursor-not-allowed items-center justify-center gap-2 rounded-[16px] text-sm font-semibold text-white opacity-40"
            style={{ backgroundColor: role.color }}
            type="button"
          >
            Continue as {role.label}
            <ArrowRight className="h-4 w-4" />
          </button>
        )}

        {!canProceed && (
          <p className="mt-2 text-center text-xs text-[var(--ms-mauve)]">
            Please agree to the Community Standards and Terms to continue.
          </p>
        )}
      </div>

      {/* Shortcut links for other roles */}
      <p className="text-center text-xs text-[var(--ms-mauve)]">
        {ROLES.filter((r) => r.key !== active).map((r, i) => (
          <span key={r.key}>
            {i > 0 && <span className="mx-1.5 opacity-40">·</span>}
            <button
              type="button"
              onClick={() => handleRoleChange(r.key)}
              className="font-semibold underline-offset-2 hover:underline"
              style={{ color: r.color }}
            >
              {r.label}
            </button>
          </span>
        ))}
        <span className="ml-1">accounts also available</span>
      </p>
    </div>
  );
}

// ─── Sign-in picker ───────────────────────────────────────────────────────────
// Shop and Delivery are separate logins — NEVER appear in the account switcher.
const SIGN_IN_ROLES = ROLES.filter((r) => r.showInSignIn);
type SignInRoleKey = "client" | "salon" | "professional";

export function SignInRolePicker({ returnTo }: { returnTo: string }) {
  const [active, setActive] = useState<SignInRoleKey>("client");
  const role = SIGN_IN_ROLES.find((r) => r.key === active) ?? SIGN_IN_ROLES[0];
  const dest = role.key === "client" ? returnTo : role.signInDest;

  return (
    <div className="space-y-5">
      {/* Tab pills — Client/Salon/Pro only. Shop+Delivery have separate logins. */}
      <div className="flex gap-2 rounded-[20px] border border-[var(--ms-border)] bg-[var(--ms-soft-bg)] p-1.5">
        {SIGN_IN_ROLES.map((r) => {
          const Icon = r.icon;
          const isActive = r.key === active;
          return (
            <button
              key={r.key}
              type="button"
              onClick={() => setActive(r.key as SignInRoleKey)}
              className="flex flex-1 items-center justify-center gap-2 rounded-[14px] px-3 py-2.5 text-sm font-semibold transition-all"
              style={
                isActive
                  ? { backgroundColor: r.color, color: "#fff", boxShadow: `0 6px 20px ${r.color}44` }
                  : { color: "var(--ms-mauve)" }
              }
            >
              <Icon className="h-4 w-4 shrink-0" />
              <span className="hidden sm:inline">{r.label}</span>
            </button>
          );
        })}
      </div>

      {/* Active role card */}
      <div
        className="rounded-[24px] border p-5 transition-all"
        style={{ backgroundColor: role.colorLight, borderColor: role.colorBorder }}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <span
              className="inline-flex rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em]"
              style={{ backgroundColor: role.color, color: "#fff" }}
            >
              {role.badge}
            </span>
            <p className="mt-3 text-2xl font-semibold" style={{ color: role.color }}>
              {role.tagline}
            </p>
            <p className="mt-2 max-w-sm text-sm leading-6 text-[var(--ms-charcoal)]">
              {role.description}
            </p>
          </div>
          <span
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-white"
            style={{ backgroundColor: role.color }}
          >
            <role.icon className="h-5 w-5" />
          </span>
        </div>

        <SessionLaunchButton className="mt-5 w-full" destination={dest} role={role.key}>
          Sign in as {role.label}
        </SessionLaunchButton>
      </div>

      {/* Helper hint */}
      <p className="rounded-[16px] bg-[var(--ms-soft-bg)] px-4 py-3 text-center text-xs leading-5 text-[var(--ms-mauve)]">
        Not sure?{" "}
        <button
          type="button"
          onClick={() => setActive("client")}
          className="font-semibold"
          style={{ color: SIGN_IN_ROLES[0].color }}
        >
          Start as Client
        </button>{" "}
        — you can always book without a pro account.
      </p>
    </div>
  );
}
