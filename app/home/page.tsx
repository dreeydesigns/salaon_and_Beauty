"use client";

import { useState, useDeferredValue } from "react";
import { LayoutGrid, List, SlidersHorizontal, X } from "lucide-react";

import { AppShell } from "@/components/app-shell";
import {
  SalonCard,
  ProfessionalCard,
  FilterDrawer,
  type FilterSection,
} from "@/components/marketplace-ui";
import { professionals, salons } from "@/lib/site-data";
import { rankProfessionals, rankSalons } from "@/lib/discovery-ranking";
import { cn } from "@/lib/utils";

const PAGE_SIZE = 12;

// ── Filter definitions ─────────────────────────────────────────────────────

const SALON_FILTERS: FilterSection[] = [
  { label: "Location", options: ["Kilimani", "Westlands", "South B", "Lavington", "Karen"] },
  { label: "Salon type", options: ["Hair Salon", "Beauty Spa", "Nail Bar", "Multi-service"] },
  { label: "Services", options: ["Hair", "Nails", "Make-up", "Skincare", "Massage", "Waxing"] },
  { label: "Verified only", options: ["Verified"] },
  { label: "Price range", options: ["Under Ksh 1,000", "Ksh 1,000–2,500", "Ksh 2,500–5,000", "Ksh 5,000+"] },
];

const PRO_FILTERS: FilterSection[] = [
  { label: "Location", options: ["Kilimani", "Karen", "Westlands", "South B", "Lavington"] },
  { label: "Service mode", options: ["Mobile", "In salon", "Both"] },
  { label: "Specialty", options: ["Bridal", "Natural Hair", "Nails", "Self-Care", "Short Hair & Shave", "Locs", "Make-up"] },
  { label: "Verified only", options: ["Verified"] },
  { label: "Price range", options: ["Under Ksh 1,000", "Ksh 1,000–2,500", "Ksh 2,500–5,000", "Ksh 5,000+"] },
  { label: "Availability", options: ["Today", "This week"] },
];

// ── Filter sidebar (desktop) ───────────────────────────────────────────────

function FilterSidebar({
  sections,
  selected,
  toggle,
}: {
  sections: FilterSection[];
  selected: string[];
  toggle: (v: string) => void;
}) {
  return (
    <aside className="hidden lg:block w-[260px] shrink-0">
      <div className="sticky top-24 rounded-[24px] border border-[var(--ms-border)] bg-white p-5 shadow-[0_4px_16px_rgba(13,27,42,0.05)]">
        <div className="mb-4 flex items-center justify-between">
          <p className="text-sm font-semibold text-[var(--ms-navy)]">Filters</p>
          {selected.length > 0 && (
            <button
              type="button"
              onClick={() => selected.forEach(toggle)}
              className="text-xs text-[var(--ms-rose)] hover:underline"
            >
              Clear all
            </button>
          )}
        </div>
        <div className="space-y-5">
          {sections.map((section) => (
            <div key={section.label}>
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--ms-mauve)]">
                {section.label}
              </p>
              <div className="flex flex-wrap gap-1.5">
                {section.options.map((opt) => {
                  const active = selected.includes(opt);
                  return (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => toggle(opt)}
                      className={cn(
                        "rounded-full border px-3 py-1.5 text-xs font-medium transition",
                        active
                          ? "border-[var(--ms-rose)] bg-[var(--ms-rose)] text-white"
                          : "border-[var(--ms-border)] bg-[var(--ms-soft-bg)] text-[var(--ms-mauve)] hover:border-[var(--ms-rose)] hover:text-[var(--ms-rose)]",
                      )}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}

// ── Active filter chips (mobile, shown inline when filters active) ─────────

function ActiveChips({
  selected,
  toggle,
}: {
  selected: string[];
  toggle: (v: string) => void;
}) {
  if (selected.length === 0) return null;
  return (
    <div className="flex flex-wrap gap-2 lg:hidden">
      {selected.map((v) => (
        <button
          key={v}
          type="button"
          onClick={() => toggle(v)}
          className="flex items-center gap-1 rounded-full border border-[var(--ms-rose)] bg-[var(--ms-rose)] px-3 py-1.5 text-xs font-medium text-white"
        >
          {v}
          <X className="h-3 w-3" />
        </button>
      ))}
    </div>
  );
}

// ── Main page ──────────────────────────────────────────────────────────────

export default function Home() {
  const [tab, setTab] = useState<"salons" | "professionals">("salons");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [shown, setShown] = useState(PAGE_SIZE);
  const [selected, setSelected] = useState<string[]>([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [sortBy, setSortBy] = useState("top-rated");
  const deferredSelected = useDeferredValue(selected);

  const filters = tab === "salons" ? SALON_FILTERS : PRO_FILTERS;

  function toggleFilter(value: string) {
    setSelected((cur) =>
      cur.includes(value) ? cur.filter((v) => v !== value) : [...cur, value],
    );
    setShown(PAGE_SIZE);
  }

  function switchTab(next: "salons" | "professionals") {
    setTab(next);
    setSelected([]);
    setShown(PAGE_SIZE);
  }

  // ── Filter + rank salons ─────────────────────────────────────────────────
  const filteredSalons = rankSalons(
    salons.filter((s) => {
      if (deferredSelected.length === 0) return true;
      return deferredSelected.every(
        (v) =>
          s.location.includes(v) ||
          s.categoryTags.includes(v) ||
          s.serviceIds.some((id) => id.includes(v.toLowerCase().replace(/\s+/g, "-"))) ||
          (v === "Verified" && s.verified),
      );
    }),
    sortBy as "top-rated" | "nearest" | "price-low" | "earliest",
  );

  // ── Filter + rank professionals ──────────────────────────────────────────
  const filteredPros = rankProfessionals(
    professionals.filter((p) => {
      if (deferredSelected.length === 0) return true;
      return deferredSelected.every(
        (v) =>
          p.location.includes(v) ||
          p.serviceMode === v ||
          p.specialty.includes(v) ||
          p.identityAttributes.includes(v) ||
          (v === "Verified" && p.verified) ||
          (v === "Today" && p.nextAvailable?.toLowerCase().includes("today")),
      );
    }),
    sortBy as "top-rated" | "nearest" | "price-low" | "earliest",
  );

  const results = tab === "salons" ? filteredSalons : filteredPros;
  const visible = results.slice(0, shown);
  const hasMore = shown < results.length;

  const countLabel =
    tab === "salons"
      ? `${results.length} salon${results.length !== 1 ? "s" : ""}`
      : `${results.length} professional${results.length !== 1 ? "s" : ""}`;

  return (
    <AppShell currentNav="home" showFooter>
      <div className="mx-auto max-w-7xl px-4 pb-24 pt-4 lg:px-6">

        {/* ── Toggle (ONE, centered, pill style) ────────────────────────── */}
        <div className="mb-5 flex justify-center">
          <div className="inline-flex rounded-full border border-[var(--ms-border)] bg-white p-1 shadow-[0_4px_12px_rgba(13,27,42,0.06)]">
            <button
              type="button"
              onClick={() => switchTab("salons")}
              className={cn(
                "rounded-full px-7 py-3 text-sm font-semibold transition-all",
                tab === "salons"
                  ? "bg-[var(--ms-plum)] text-white shadow-[0_4px_12px_rgba(132,36,92,0.22)]"
                  : "text-[var(--ms-mauve)] hover:text-[var(--ms-navy)]",
              )}
            >
              Salons
            </button>
            <button
              type="button"
              onClick={() => switchTab("professionals")}
              className={cn(
                "rounded-full px-7 py-3 text-sm font-semibold transition-all",
                tab === "professionals"
                  ? "bg-[linear-gradient(135deg,var(--ms-rose),var(--ms-orchid))] text-white shadow-[0_4px_12px_rgba(232,62,140,0.22)]"
                  : "text-[var(--ms-mauve)] hover:text-[var(--ms-navy)]",
              )}
            >
              Professional
            </button>
          </div>
        </div>

        {/* ── Body: sidebar + results ────────────────────────────────────── */}
        <div className="flex gap-6">

          {/* Desktop filter sidebar */}
          <FilterSidebar sections={filters} selected={selected} toggle={toggleFilter} />

          {/* Results column */}
          <div className="min-w-0 flex-1">

            {/* Controls row */}
            <div className="mb-4 flex flex-wrap items-center gap-3">
              {/* Mobile filter button */}
              <button
                type="button"
                onClick={() => setDrawerOpen(true)}
                className="flex items-center gap-2 rounded-full border border-[var(--ms-border)] bg-white px-4 py-2.5 text-sm font-medium text-[var(--ms-navy)] shadow-[0_2px_8px_rgba(13,27,42,0.05)] lg:hidden"
              >
                <SlidersHorizontal className="h-4 w-4" />
                Filters
                {selected.length > 0 && (
                  <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[var(--ms-rose)] text-[10px] font-bold text-white">
                    {selected.length}
                  </span>
                )}
              </button>

              {/* Sort */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="rounded-full border border-[var(--ms-border)] bg-white px-4 py-2.5 text-sm text-[var(--ms-navy)] outline-none shadow-[0_2px_8px_rgba(13,27,42,0.05)]"
              >
                <option value="top-rated">Top rated</option>
                <option value="nearest">Nearest</option>
                <option value="price-low">Price: low–high</option>
                <option value="earliest">Earliest available</option>
              </select>

              {/* Result count */}
              <p className="ml-auto text-sm font-medium text-[var(--ms-mauve)]">{countLabel}</p>

              {/* Grid / List toggle */}
              <div className="flex items-center gap-0.5 rounded-full border border-[var(--ms-border)] bg-white p-1">
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

            {/* Active filter chips (mobile) */}
            <ActiveChips selected={selected} toggle={toggleFilter} />

            {/* Card grid */}
            {results.length > 0 ? (
              <div
                className={cn(
                  "mt-4 grid gap-4",
                  view === "grid" ? "grid-cols-1 sm:grid-cols-2" : "grid-cols-1",
                )}
              >
                {tab === "salons"
                  ? (visible as typeof salons).map((s) => (
                      <SalonCard key={s.slug} salon={s} listView={view === "list"} />
                    ))
                  : (visible as typeof professionals).map((p) => (
                      <ProfessionalCard key={p.slug} professional={p} listView={view === "list"} />
                    ))}
              </div>
            ) : (
              <div className="mt-8 flex flex-col items-center justify-center py-20 text-center">
                <span className="text-4xl">✦</span>
                <p className="mt-4 text-base font-semibold text-[var(--ms-navy)]">
                  No matches found
                </p>
                <p className="mt-2 text-sm text-[var(--ms-mauve)]">
                  Try removing a filter or switching tabs.
                </p>
                {selected.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setSelected([])}
                    className="mt-4 rounded-full border border-[var(--ms-border)] px-5 py-2 text-sm font-medium text-[var(--ms-rose)] hover:bg-[var(--ms-petal)]"
                  >
                    Clear filters
                  </button>
                )}
              </div>
            )}

            {/* Load more */}
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
        </div>
      </div>

      {/* Mobile filter drawer */}
      <FilterDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        sections={filters}
        selected={selected}
        toggleValue={toggleFilter}
      />
    </AppShell>
  );
}
