"use client";

import { useDeferredValue, useState } from "react";

import { professionals, salons } from "@/lib/site-data";
import {
  DesktopSidebar,
  EmptyState,
  FilterButton,
  FilterDrawer,
  ProfessionalCard,
  SalonCard,
  SearchBar,
  SectionReveal,
  type FilterSection,
} from "@/components/marketplace-ui";
import { cn } from "@/lib/utils";

export function MarketplaceDiscovery({
  collection,
}: {
  collection: "salons" | "professionals";
}) {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState("top-rated");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [layout, setLayout] = useState<"stack" | "grid">("stack");
  const deferredQuery = useDeferredValue(query);

  const filters: FilterSection[] =
    collection === "salons"
      ? [
          { label: "Location", options: ["Kilimani", "Westlands", "South B", "Lavington", "Karen"] },
          { label: "What you need", options: ["Natural Hair", "Braids", "Nails", "Men's Grooming", "Bridal"] },
          { label: "Access", options: ["Mobile service", "Verified"] },
        ]
      : [
          { label: "Location", options: ["Kilimani", "Karen", "Westlands", "South B"] },
          { label: "Service mode", options: ["In salon", "Mobile", "Both", "Verified"] },
          { label: "Specialty", options: ["Bridal", "Natural Hair", "Nails", "Men's Grooming"] },
        ];

  const normalizedQuery = deferredQuery.trim().toLowerCase();
  const salonResults = [...salons]
    .filter((item) => {
      const searchable = `${item.name} ${item.location} ${item.tagline} ${item.categoryTags.join(" ")}`;
      const queryMatch = normalizedQuery ? searchable.toLowerCase().includes(normalizedQuery) : true;
      const filterMatch =
        selected.length === 0 ||
        selected.every(
          (value) =>
            item.location.includes(value) ||
            item.categoryTags.includes(value) ||
            (value === "Mobile service" && item.mobileService) ||
            (value === "Verified" && item.verified),
        );

      return queryMatch && filterMatch;
    })
    .sort((left, right) => {
      if (sortBy === "price-low") {
        return left.startingPrice - right.startingPrice;
      }

      if (sortBy === "earliest") {
        return left.nextAvailable.localeCompare(right.nextAvailable);
      }

      if (sortBy === "nearest") {
        return left.location.localeCompare(right.location);
      }

      return right.rating - left.rating;
    });

  const professionalResults = [...professionals]
    .filter((item) => {
      const searchable = `${item.name} ${item.location} ${item.specialty} ${item.areasServed.join(" ")}`;
      const queryMatch = normalizedQuery ? searchable.toLowerCase().includes(normalizedQuery) : true;
      const filterMatch =
        selected.length === 0 ||
        selected.every(
          (value) =>
            item.location.includes(value) ||
            item.serviceMode === value ||
            item.specialty.includes(value) ||
            (value === "Verified" && item.verified),
        );

      return queryMatch && filterMatch;
    })
    .sort((left, right) => {
      if (sortBy === "price-low") {
        return left.startingPrice - right.startingPrice;
      }

      if (sortBy === "earliest") {
        return left.nextAvailable.localeCompare(right.nextAvailable);
      }

      if (sortBy === "nearest") {
        return left.location.localeCompare(right.location);
      }

      return right.rating - left.rating;
    });

  const results = collection === "salons" ? salonResults : professionalResults;

  function toggleSelected(value: string) {
    setSelected((current) =>
      current.includes(value) ? current.filter((item) => item !== value) : [...current, value],
    );
  }

  return (
    <div className="space-y-6">
      <SectionReveal className="rounded-[32px] bg-white p-6 shadow-[0_20px_60px_rgba(13,27,42,0.08)]">
        <div className="grid gap-5 xl:grid-cols-[minmax(0,0.7fr)_minmax(0,0.3fr)]">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-[var(--ms-mauve)]">
              {collection === "salons" ? "Salon discovery" : "Professional discovery"}
            </p>
            <h1 className="mt-3 text-4xl font-semibold text-[var(--ms-navy)]">
              {collection === "salons"
                ? "Compare trusted Nairobi salons without the usual booking chaos."
                : "Find individual beauty pros with the right specialty, timing, and service mode."}
            </h1>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-[var(--ms-mauve)]">
              Prices stay visible, specialties stay specific, and the next action stays obvious.
            </p>
          </div>
          <div className="rounded-[28px] bg-[var(--ms-soft-bg)] p-5">
            <p className="text-xs uppercase tracking-[0.22em] text-[var(--ms-mauve)]">What matters here</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {[
                "Visible pricing",
                "Real availability",
                "Nairobi location fit",
                "Portfolio-first trust",
              ].map((item) => (
                <span className="rounded-full bg-white px-3 py-2 text-sm text-[var(--ms-navy)]" key={item}>
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>
      </SectionReveal>

      <div className="grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
        <DesktopSidebar title="Refine results">
          <div className="space-y-5">
            {filters.map((section) => (
              <div key={section.label}>
                <p className="mb-3 text-sm font-semibold text-[var(--ms-navy)]">{section.label}</p>
                <div className="flex flex-wrap gap-2">
                  {section.options.map((option) => {
                    const active = selected.includes(option);

                    return (
                      <button
                        className={cn(
                          "rounded-full border px-3 py-2 text-sm transition",
                          active
                            ? "border-[var(--ms-magenta)] bg-[var(--ms-magenta)] text-white"
                            : "border-[var(--ms-border)] bg-[var(--ms-soft-bg)] text-[var(--ms-mauve)]",
                        )}
                        key={option}
                        onClick={() => toggleSelected(option)}
                        type="button"
                      >
                        {option}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </DesktopSidebar>

        <div className="space-y-5">
          <div className="flex flex-col gap-3 rounded-[28px] bg-white p-4 shadow-[0_12px_40px_rgba(13,27,42,0.08)] md:flex-row md:items-center">
            <div className="flex-1">
              <SearchBar
                onChange={setQuery}
                placeholder={
                  collection === "salons"
                    ? "Search salons, areas, or services"
                    : "Search by name, specialty, or location"
                }
                value={query}
              />
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <FilterButton onClick={() => setMobileFiltersOpen(true)} />
              <select
                className="min-h-12 rounded-full border border-[var(--ms-border)] bg-[var(--ms-soft-bg)] px-4 text-sm text-[var(--ms-navy)] outline-none"
                onChange={(event) => setSortBy(event.target.value)}
                value={sortBy}
              >
                <option value="top-rated">Top rated</option>
                <option value="nearest">Nearest</option>
                <option value="price-low">Price low-high</option>
                <option value="earliest">Earliest available</option>
              </select>
              {collection === "salons" ? (
                <div className="hidden rounded-full border border-[var(--ms-border)] bg-[var(--ms-soft-bg)] p-1 md:flex">
                  <button
                    className={cn(
                      "rounded-full px-4 py-2 text-sm",
                      layout === "stack" ? "bg-white text-[var(--ms-navy)]" : "text-[var(--ms-mauve)]",
                    )}
                    onClick={() => setLayout("stack")}
                    type="button"
                  >
                    Stack
                  </button>
                  <button
                    className={cn(
                      "rounded-full px-4 py-2 text-sm",
                      layout === "grid" ? "bg-white text-[var(--ms-navy)]" : "text-[var(--ms-mauve)]",
                    )}
                    onClick={() => setLayout("grid")}
                    type="button"
                  >
                    Grid
                  </button>
                </div>
              ) : null}
            </div>
          </div>

          <p className="text-sm text-[var(--ms-mauve)]">
            {results.length} {collection === "salons" ? "salons" : "professionals"} match your current view.
          </p>

          {results.length ? (
            <div className={cn("grid gap-5", layout === "grid" ? "xl:grid-cols-2" : "grid-cols-1")}>
              {collection === "salons"
                ? salonResults.map((salon) => <SalonCard key={salon.slug} salon={salon} />)
                : professionalResults.map((professional) => (
                    <ProfessionalCard key={professional.slug} professional={professional} />
                  ))}
            </div>
          ) : (
            <EmptyState
              copy="Try a different area, remove one filter, or switch between salons and professionals."
              title="No exact matches yet"
            />
          )}
        </div>
      </div>

      <FilterDrawer
        onClose={() => setMobileFiltersOpen(false)}
        open={mobileFiltersOpen}
        sections={filters}
        selected={selected}
        toggleValue={toggleSelected}
      />
    </div>
  );
}
