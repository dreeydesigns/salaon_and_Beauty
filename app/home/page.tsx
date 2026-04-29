"use client";

import { useState } from "react";
import { LayoutGrid, List } from "lucide-react";

import { AppShell } from "@/components/app-shell";
import { SalonCard, ProfessionalCard } from "@/components/marketplace-ui";
import { professionals, salons } from "@/lib/site-data";
import { cn } from "@/lib/utils";

const PAGE_SIZE = 12;

export default function Home() {
  const [tab, setTab] = useState<"salons" | "professionals">("salons");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [shown, setShown] = useState(PAGE_SIZE);

  const items = tab === "salons" ? salons : professionals;
  const visible = items.slice(0, shown);
  const hasMore = shown < items.length;

  const countLabel =
    tab === "salons"
      ? `${items.length} salon${items.length !== 1 ? "s" : ""} available`
      : `${items.length} professional${items.length !== 1 ? "s" : ""} available`;

  return (
    <AppShell currentNav="home" roleMode={tab} requireSession showFooter>
      <div className="mx-auto max-w-7xl px-4 pb-24 pt-4">

        {/* ── Toggle ─────────────────────────────────────────────────── */}
        <div className="mb-4 flex justify-center">
          <div className="inline-flex rounded-full border border-[var(--ms-border)] bg-white p-1 shadow-[0_4px_12px_rgba(13,27,42,0.06)]">
            <button
              type="button"
              onClick={() => { setTab("salons"); setShown(PAGE_SIZE); }}
              className={cn(
                "rounded-full px-6 py-2.5 text-sm font-semibold transition-all",
                tab === "salons"
                  ? "bg-[var(--ms-plum)] text-white shadow-[0_4px_12px_rgba(132,36,92,0.22)]"
                  : "text-[var(--ms-mauve)] hover:text-[var(--ms-navy)]",
              )}
            >
              Salons
            </button>
            <button
              type="button"
              onClick={() => { setTab("professionals"); setShown(PAGE_SIZE); }}
              className={cn(
                "rounded-full px-6 py-2.5 text-sm font-semibold transition-all",
                tab === "professionals"
                  ? "bg-[linear-gradient(135deg,var(--ms-rose),var(--ms-orchid))] text-white shadow-[0_4px_12px_rgba(232,62,140,0.22)]"
                  : "text-[var(--ms-mauve)] hover:text-[var(--ms-navy)]",
              )}
            >
              Professional
            </button>
          </div>
        </div>

        {/* ── Controls row ───────────────────────────────────────────── */}
        <div className="mb-5 flex items-center justify-between">
          <p className="text-sm font-medium text-[var(--ms-mauve)]">{countLabel}</p>
          <div className="flex items-center gap-1 rounded-full border border-[var(--ms-border)] bg-white p-1">
            <button
              type="button"
              aria-label="Grid view"
              onClick={() => setView("grid")}
              className={cn(
                "rounded-full p-2 transition",
                view === "grid" ? "bg-[var(--ms-soft-bg)] text-[var(--ms-navy)]" : "text-[var(--ms-mauve)]",
              )}
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
            <button
              type="button"
              aria-label="List view"
              onClick={() => setView("list")}
              className={cn(
                "rounded-full p-2 transition",
                view === "list" ? "bg-[var(--ms-soft-bg)] text-[var(--ms-navy)]" : "text-[var(--ms-mauve)]",
              )}
            >
              <List className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* ── Card grid ──────────────────────────────────────────────── */}
        {tab === "salons" ? (
          <div
            className={cn(
              view === "grid"
                ? "grid grid-cols-1 gap-4 sm:grid-cols-2"
                : "flex flex-col gap-4",
            )}
          >
            {visible.map((salon) => (
              <SalonCard key={(salon as typeof salons[0]).slug} salon={salon as typeof salons[0]} listView={view === "list"} />
            ))}
          </div>
        ) : (
          <div
            className={cn(
              view === "grid"
                ? "grid grid-cols-1 gap-4 sm:grid-cols-2"
                : "flex flex-col gap-4",
            )}
          >
            {visible.map((pro) => (
              <ProfessionalCard key={(pro as typeof professionals[0]).slug} professional={pro as typeof professionals[0]} listView={view === "list"} />
            ))}
          </div>
        )}

        {/* ── Empty state ────────────────────────────────────────────── */}
        {items.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <span className="text-4xl">✦</span>
            <p className="mt-4 text-lg font-semibold text-[var(--ms-navy)]">
              {tab === "salons" ? "No salons published yet." : "No professionals published yet."}
            </p>
            <p className="mt-2 text-sm text-[var(--ms-mauve)]">Check back soon.</p>
          </div>
        )}

        {/* ── Load more ─────────────────────────────────────────────── */}
        {hasMore && (
          <div className="mt-8 flex justify-center">
            <button
              type="button"
              onClick={() => setShown((n) => n + PAGE_SIZE)}
              className="rounded-full border border-[var(--ms-border)] bg-white px-8 py-3 text-sm font-semibold text-[var(--ms-mauve)] shadow-[0_4px_12px_rgba(13,27,42,0.06)] transition hover:border-[var(--ms-rose)] hover:text-[var(--ms-rose)]"
            >
              Load more
            </button>
          </div>
        )}
      </div>
    </AppShell>
  );
}
