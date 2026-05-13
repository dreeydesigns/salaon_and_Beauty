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
import { ClientRatingFlow } from "@/components/service-session";

type SortKey = "top-rated" | "nearest" | "price-low" | "earliest";

const PAGE_SIZE = 12;

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

export default function DiscoverPage() {
  const [tab, setTab] = useState<"salons" | "professionals">("salons");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [selected, setSelected] = useState<string[]>([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [sortBy] = useState<SortKey>("top-rated");
  const [shown, setShown] = useState(PAGE_SIZE);
  const deferredSelected = useDeferredValue(selected);

  function toggle(value: string) {
    setSelected((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value],
    );
    setShown(PAGE_SIZE);
  }

  function switchTab(next: "salons" | "professionals") {
    setTab(next);
    setSelected([]);
    setShown(PAGE_SIZE);
  }

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
    sortBy,
  );

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
    sortBy,
  );

  const results = tab === "salons" ? filteredSalons : filteredPros;
  const visible = results.slice(0, shown);
  const hasMore = shown < results.length;

  const countLabel =
    tab === "salons"
      ? `${results.length} salon${results.length !== 1 ? "s" : ""}`
      : `${results.length} professional${results.length !== 1 ? "s" : ""}`;

  return (
    <AppShell currentNav="discover" showFooter>
      <ClientRatingFlow />

      <div className="mx-auto max-w-7xl px-4 pb-24 pt-4 lg:px-6">
        {/* Header */}
        <div className="mb-6">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--ms-mauve)]">Discover</p>
          <h1 className="mt-1 text-2xl font-bold text-[var(--ms-navy)]">Verified salons & professionals</h1>
        </div>

        {/* Salon / Pro toggle */}
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
                  ? "bg-[var(--ms-plum)] text-white shadow-[0_4px_12px_rgba(132,36,92,0.22)]"
                  : "text-[var(--ms-mauve)] hover:text-[var(--ms-navy)]",
              )}
            >
              Professionals
            </button>
          </div>
        </div>

        {/* Toolbar */}
        <div className="mb-4 flex items-center gap-2">
          <button
            type="button"
            onClick={() => setDrawerOpen(true)}
            className="inline-flex items-center gap-2 rounded-full border border-[var(--ms-border)] bg-white px-4 py-2 text-sm font-medium text-[var(--ms-mauve)] shadow-[0_2px_8px_rgba(13,27,42,0.04)] hover:text-[var(--ms-navy)]"
          >
            <SlidersHorizontal className="h-4 w-4" />
            Filters
            {selected.length > 0 && (
              <span className="ml-1 rounded-full bg-[var(--ms-rose)] px-2 py-0.5 text-[10px] font-bold text-white">
                {selected.length}
              </span>
            )}
          </button>
          <span className="ml-auto text-xs text-[var(--ms-mauve)]">{countLabel}</span>
          <button
            type="button"
            onClick={() => setView(view === "grid" ? "list" : "grid")}
            className="rounded-full border border-[var(--ms-border)] bg-white p-2 text-[var(--ms-mauve)] shadow-[0_2px_8px_rgba(13,27,42,0.04)] hover:text-[var(--ms-navy)]"
          >
            {view === "grid" ? <List className="h-4 w-4" /> : <LayoutGrid className="h-4 w-4" />}
          </button>
        </div>

        {/* Active filter chips */}
        {selected.length > 0 && (
          <div className="mb-4 flex flex-wrap gap-2">
            {selected.map((v) => (
              <button
                key={v}
                type="button"
                onClick={() => toggle(v)}
                className="inline-flex items-center gap-1 rounded-full bg-[var(--ms-petal)] px-3 py-1 text-xs font-semibold text-[var(--ms-plum)]"
              >
                {v}
                <X className="h-3 w-3" />
              </button>
            ))}
          </div>
        )}

        {/* Grid or list */}
        <div className={view === "grid" ? "grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4" : "space-y-3"}>
          {visible.map((item) =>
            tab === "salons" ? (
              <SalonCard key={(item as typeof salons[0]).slug} salon={item as typeof salons[0]} listView={view === "list"} />
            ) : (
              <ProfessionalCard key={(item as typeof professionals[0]).slug} professional={item as typeof professionals[0]} listView={view === "list"} />
            ),
          )}
        </div>

        {hasMore && (
          <div className="mt-8 text-center">
            <button
              type="button"
              onClick={() => setShown((s) => s + PAGE_SIZE)}
              className="rounded-full border border-[var(--ms-border)] bg-white px-8 py-3 text-sm font-semibold text-[var(--ms-navy)] shadow-[0_4px_12px_rgba(13,27,42,0.06)] hover:shadow-[0_8px_24px_rgba(13,27,42,0.10)]"
            >
              Load more
            </button>
          </div>
        )}
      </div>

      <FilterDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        sections={tab === "salons" ? SALON_FILTERS : PRO_FILTERS}
        selected={selected}
        toggleValue={toggle}
      />
    </AppShell>
  );
}
