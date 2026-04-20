"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { BadgeCheck, Sparkles } from "lucide-react";

import { ProfessionalCard, SectionReveal } from "@/components/marketplace-ui";
import { readClientSession } from "@/lib/client-session";
import { rankProfessionals } from "@/lib/discovery-ranking";
import { getThemeConfig, type ClientUserProfile } from "@/lib/personalization";
import { professionals } from "@/lib/site-data";

export function PersonalizedHomePanel() {
  const [profile, setProfile] = useState<ClientUserProfile | null>(null);

  useEffect(() => {
    function syncProfile() {
      setProfile(readClientSession());
    }

    syncProfile();
    window.addEventListener("storage", syncProfile);
    window.addEventListener("mobile-salon.client-session-change", syncProfile);

    return () => {
      window.removeEventListener("storage", syncProfile);
      window.removeEventListener("mobile-salon.client-session-change", syncProfile);
    };
  }, []);

  if (!profile) {
    return null;
  }

  const theme = getThemeConfig(profile.theme);
  const rankedProfessionals = rankProfessionals(
    professionals.filter((professional) => professional.verified),
    "top-rated",
    profile.theme,
  ).slice(0, 4);

  return (
    <SectionReveal
      className="overflow-hidden rounded-[36px] border border-[var(--ms-border)] bg-white p-5 shadow-[0_18px_54px_rgba(13,27,42,0.08)] sm:p-6 lg:p-8"
      style={{ background: `linear-gradient(135deg, ${theme.softColor}, #ffffff 62%)` }}
    >
      <div className="grid gap-6 xl:grid-cols-[minmax(0,0.35fr)_minmax(0,0.65fr)] xl:items-center">
        <div className="min-w-0">
          <span
            className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-white"
            style={{ backgroundColor: theme.accentColor }}
          >
            <Sparkles className="h-4 w-4" />
            {theme.displayName} world
          </span>
          <h2 className="mt-4 font-display text-4xl leading-tight text-[var(--ms-plum)]">
            Welcome, {profile.firstName}. Your beauty world is ready.
          </h2>
          <p className="mt-3 text-sm leading-7 text-[var(--ms-mauve)]">{theme.feedCopy.split(".")[0]}.</p>
          <div className="mt-4 flex flex-wrap gap-2">
            <span className="rounded-full bg-white px-3 py-2 text-xs font-semibold text-[var(--ms-plum)] shadow-[0_10px_22px_rgba(13,27,42,0.05)]">
              {profile.tribeBadge}
            </span>
            <span className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-2 text-xs font-semibold text-[var(--ms-plum)] shadow-[0_10px_22px_rgba(13,27,42,0.05)]">
              <BadgeCheck className="h-4 w-4" />
              Verified-first ranking
            </span>
          </div>
          <Link
            className="mt-5 inline-flex min-h-11 items-center justify-center rounded-full px-5 text-sm font-semibold text-white"
            href="/profile"
            style={{ backgroundColor: theme.accentColor }}
          >
            Edit My World
          </Link>
        </div>
        <div className="grid min-w-0 gap-4 lg:grid-cols-2">
          {rankedProfessionals.map((professional) => (
            <ProfessionalCard key={professional.slug} professional={professional} />
          ))}
        </div>
      </div>
    </SectionReveal>
  );
}
