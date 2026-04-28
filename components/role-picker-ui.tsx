"use client";

import Link from "next/link";
import { ArrowRight, Building2, Crown, Sparkles } from "lucide-react";
import { useState } from "react";

import { SessionLaunchButton } from "@/components/session-launch-button";

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
  },
] as const;

type RoleKey = (typeof ROLES)[number]["key"];

// ─── Sign-up picker ───────────────────────────────────────────────────────────

export function SignUpRolePicker() {
  const [active, setActive] = useState<RoleKey>("client");
  const role = ROLES.find((r) => r.key === active)!;

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
              onClick={() => setActive(r.key)}
              className="flex flex-1 items-center justify-center gap-2 rounded-[14px] px-3 py-2.5 text-sm font-semibold transition-all"
              style={
                isActive
                  ? {
                      backgroundColor: r.color,
                      color: "#fff",
                      boxShadow: `0 6px 20px ${r.color}44`,
                    }
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
        style={{
          backgroundColor: role.colorLight,
          borderColor: role.colorBorder,
        }}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <span
              className="inline-flex rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em]"
              style={{ backgroundColor: role.color, color: "#fff" }}
            >
              {role.badge}
            </span>
            <p
              className="mt-3 text-2xl font-semibold"
              style={{ color: role.color }}
            >
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

        <Link
          href={role.signUpHref}
          className="mt-5 inline-flex w-full min-h-12 items-center justify-center gap-2 rounded-[16px] text-sm font-semibold text-white transition hover:brightness-110"
          style={{ backgroundColor: role.color }}
        >
          Continue as {role.label}
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      {/* Shortcut links for other roles */}
      <p className="text-center text-xs text-[var(--ms-mauve)]">
        {ROLES.filter((r) => r.key !== active).map((r, i, arr) => (
          <span key={r.key}>
            {i > 0 && <span className="mx-1.5 opacity-40">·</span>}
            <button
              type="button"
              onClick={() => setActive(r.key)}
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

export function SignInRolePicker({ returnTo }: { returnTo: string }) {
  const [active, setActive] = useState<RoleKey>("client");
  const role = ROLES.find((r) => r.key === active)!;
  const dest = role.key === "client" ? returnTo : role.signInDest;

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
              onClick={() => setActive(r.key)}
              className="flex flex-1 items-center justify-center gap-2 rounded-[14px] px-3 py-2.5 text-sm font-semibold transition-all"
              style={
                isActive
                  ? {
                      backgroundColor: r.color,
                      color: "#fff",
                      boxShadow: `0 6px 20px ${r.color}44`,
                    }
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
        style={{
          backgroundColor: role.colorLight,
          borderColor: role.colorBorder,
        }}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <span
              className="inline-flex rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em]"
              style={{ backgroundColor: role.color, color: "#fff" }}
            >
              {role.badge}
            </span>
            <p
              className="mt-3 text-2xl font-semibold"
              style={{ color: role.color }}
            >
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

        <SessionLaunchButton
          className="mt-5 w-full"
          destination={dest}
          role={role.key}
        >
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
          style={{ color: ROLES[0].color }}
        >
          Start as Client
        </button>{" "}
        — you can always book without a pro account.
      </p>
    </div>
  );
}
