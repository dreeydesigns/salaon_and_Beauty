"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ArrowRight,
  Briefcase,
  CalendarDays,
  Droplets,
  Gem,
  Hand,
  Heart,
  LayoutGrid,
  Leaf,
  List,
  Scissors,
  Sparkles,
  Star,
  Waves,
} from "lucide-react";

import { AppShell } from "@/components/app-shell";
import { cn } from "@/lib/utils";

// ─── Service categories ───────────────────────────────────────────────────────

const SERVICE_CATEGORIES = [
  {
    id: "hair",
    name: "Hair",
    icon: Waves,
    color: "#C8284A",
    colorLight: "rgba(200,40,74,0.08)",
    subcategories: ["Braiding", "Locs", "Weaves", "Relaxer", "Dye / Colour", "Wash & Go", "Cuts", "Natural Hair"],
    count: 48,
  },
  {
    id: "nails",
    name: "Nails",
    icon: Hand,
    color: "#8B5CF6",
    colorLight: "rgba(139,92,246,0.08)",
    subcategories: ["Gel Manicure", "Acrylic", "Nail Art", "Pedicure", "Nail Extensions"],
    count: 34,
  },
  {
    id: "makeup",
    name: "Make-up",
    icon: Sparkles,
    color: "#BF8C2E",
    colorLight: "rgba(191,140,46,0.08)",
    subcategories: ["Bridal", "Events", "Natural", "Glam", "Lashes"],
    count: 29,
  },
  {
    id: "skincare",
    name: "Skincare",
    icon: Leaf,
    color: "#1A7A6B",
    colorLight: "rgba(26,122,107,0.08)",
    subcategories: ["Facial", "Glow Treatment", "Acne Care", "Chemical Peel"],
    count: 22,
  },
  {
    id: "massage",
    name: "Massage",
    icon: Heart,
    color: "#EA580C",
    colorLight: "rgba(234,88,12,0.08)",
    subcategories: ["Full Body", "Back & Neck", "Relaxation", "Deep Tissue"],
    count: 18,
  },
  {
    id: "waxing",
    name: "Waxing",
    icon: Droplets,
    color: "#C8284A",
    colorLight: "rgba(200,40,74,0.06)",
    subcategories: ["Body Wax", "Facial Wax", "Brow Shaping"],
    count: 15,
  },
  {
    id: "threading",
    name: "Threading",
    icon: Scissors,
    color: "#8B5CF6",
    colorLight: "rgba(139,92,246,0.06)",
    subcategories: ["Brow Threading", "Upper Lip", "Full Face"],
    count: 12,
  },
  {
    id: "wellness",
    name: "Wellness",
    icon: Leaf,
    color: "#1A7A6B",
    colorLight: "rgba(26,122,107,0.06)",
    subcategories: ["Body Wrap", "Steam", "Hot Oil Treatment"],
    count: 11,
  },
  {
    id: "bridal",
    name: "Bridal",
    icon: Gem,
    color: "#BF8C2E",
    colorLight: "rgba(191,140,46,0.06)",
    subcategories: ["Full bridal preparation packages"],
    count: 9,
  },
  {
    id: "locs-braids",
    name: "Locs & Braids",
    icon: Waves,
    color: "#EA580C",
    colorLight: "rgba(234,88,12,0.06)",
    subcategories: ["Locs Installation", "Locs Maintenance", "Braiding"],
    count: 31,
  },
];

// ─── Package types ────────────────────────────────────────────────────────────

const PACKAGES = [
  {
    id: "bridal",
    name: "Bridal Package",
    icon: Gem,
    color: "#BF8C2E",
    services: ["Hair", "Make-up", "Nails", "Skin"],
    price: "KES 18,000",
    duration: "Full day",
    description: "Full bridal prep. Book well in advance.",
    image: "https://images.pexels.com/photos/2253842/pexels-photo-2253842.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop",
    badge: null,
  },
  {
    id: "birthday",
    name: "Birthday Glow",
    icon: Star,
    color: "#C8284A",
    services: ["Hair", "Nails", "Make-up"],
    price: "KES 8,500",
    duration: "4–6 hrs",
    description: "Treat yourself on your birthday.",
    image: "https://images.pexels.com/photos/3738359/pexels-photo-3738359.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop",
    badge: "Popular",
  },
  {
    id: "self-care",
    name: "Self-Care Sunday",
    icon: Leaf,
    color: "#1A7A6B",
    services: ["Massage", "Facial", "Nail care"],
    price: "KES 9,200",
    duration: "Full day",
    description: "A full day of restoration.",
    image: "https://images.pexels.com/photos/3997990/pexels-photo-3997990.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop",
    badge: null,
  },
  {
    id: "baby-shower",
    name: "Baby Shower",
    icon: Heart,
    color: "#8B5CF6",
    services: ["Hair", "Make-up", "Nails"],
    price: "KES 7,800",
    duration: "3–4 hrs",
    description: "Look your best for the celebration.",
    image: "https://images.pexels.com/photos/3912572/pexels-photo-3912572.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop",
    badge: null,
  },
  {
    id: "corporate",
    name: "Corporate Event",
    icon: Briefcase,
    color: "#EA580C",
    services: ["Make-up", "Hair styling"],
    price: "KES 5,500",
    duration: "2–3 hrs",
    description: "Professional make-up + hair for events.",
    image: "https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop",
    badge: null,
  },
  {
    id: "seasonal",
    name: "Seasonal Special",
    icon: CalendarDays,
    color: "#C8284A",
    services: ["Varies by season"],
    price: "KES 6,000",
    duration: "3–5 hrs",
    description: "Curated seasonal rituals — updated quarterly.",
    image: "https://images.pexels.com/photos/3993449/pexels-photo-3993449.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop",
    badge: "Limited",
  },
  {
    id: "locs-starter",
    name: "Locs Starter",
    icon: Waves,
    color: "#1A7A6B",
    services: ["Locs installation", "Consultation"],
    price: "KES 4,500",
    duration: "4–8 hrs",
    description: "First-time locs consultation + first session.",
    image: "https://images.pexels.com/photos/3993398/pexels-photo-3993398.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop",
    badge: null,
  },
  {
    id: "natural-reset",
    name: "Natural Hair Reset",
    icon: Droplets,
    color: "#8B5CF6",
    services: ["Deep treatment", "Style", "Aftercare guide"],
    price: "KES 3,800",
    duration: "2–3 hrs",
    description: "Deep treatment + style + aftercare guide.",
    image: "https://images.pexels.com/photos/3993392/pexels-photo-3993392.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop",
    badge: null,
  },
];

// ─── Explore Page ─────────────────────────────────────────────────────────────

export default function ExplorePage() {
  const [activeTab, setActiveTab] = useState<"services" | "packages">("services");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

  return (
    <AppShell currentNav="explore" roleMode="salons" requireSession>
      <div className="mx-auto max-w-7xl space-y-6 px-4 pb-24 pt-4">

        {/* Header */}
        <div>
          <h1 className="text-3xl font-semibold text-[var(--ms-navy)] sm:text-4xl">Explore</h1>
          <p className="mt-2 text-sm text-[var(--ms-mauve)]">Everything we offer. Browse by service or package.</p>
        </div>

        {/* Section tabs */}
        <div className="flex items-center justify-between gap-4">
          <div className="inline-flex rounded-full border border-[var(--ms-border)] bg-white p-1">
            <button
              type="button"
              onClick={() => setActiveTab("services")}
              className={cn(
                "rounded-full px-5 py-2 text-sm font-semibold transition",
                activeTab === "services" ? "bg-[var(--ms-plum)] text-white" : "text-[var(--ms-mauve)]",
              )}
            >
              Services
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("packages")}
              className={cn(
                "rounded-full px-5 py-2 text-sm font-semibold transition",
                activeTab === "packages" ? "bg-[var(--ms-plum)] text-white" : "text-[var(--ms-mauve)]",
              )}
            >
              Packages
            </button>
          </div>
          {/* View toggle */}
          <div className="flex items-center gap-1 rounded-full border border-[var(--ms-border)] bg-white p-1">
            <button
              type="button"
              aria-label="Grid view"
              onClick={() => setView("grid")}
              className={cn("rounded-full p-2 transition", view === "grid" ? "bg-[var(--ms-soft-bg)] text-[var(--ms-navy)]" : "text-[var(--ms-mauve)]")}
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
            <button
              type="button"
              aria-label="List view"
              onClick={() => setView("list")}
              className={cn("rounded-full p-2 transition", view === "list" ? "bg-[var(--ms-soft-bg)] text-[var(--ms-navy)]" : "text-[var(--ms-mauve)]")}
            >
              <List className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* ── Services tab ───────────────────────────────────────────── */}
        {activeTab === "services" && (
          view === "grid" ? (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {SERVICE_CATEGORIES.map((cat) => {
                const Icon = cat.icon;
                return (
                  <Link
                    key={cat.id}
                    href={`/explore/services/${cat.id}`}
                    className="group flex flex-col items-center gap-3 rounded-[20px] border border-[var(--ms-border)] bg-white p-5 text-center shadow-[0_4px_12px_rgba(13,27,42,0.05)] transition hover:border-[var(--ms-rose)] hover:shadow-[0_8px_24px_rgba(13,27,42,0.10)]"
                  >
                    <span
                      className="flex h-12 w-12 items-center justify-center rounded-full transition group-hover:scale-105"
                      style={{ backgroundColor: cat.colorLight, color: cat.color }}
                    >
                      <Icon className="h-6 w-6" />
                    </span>
                    <p className="font-semibold text-[var(--ms-navy)]">{cat.name}</p>
                    <p className="text-xs text-[var(--ms-mauve)]">{cat.count} professionals offer this</p>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="space-y-2">
              {SERVICE_CATEGORIES.map((cat) => {
                const Icon = cat.icon;
                const expanded = expandedCategory === cat.id;
                return (
                  <div key={cat.id} className="overflow-hidden rounded-[16px] border border-[var(--ms-border)] bg-white">
                    <Link
                      href={`/explore/services/${cat.id}`}
                      className="flex items-center gap-4 px-5 py-4 transition hover:bg-[var(--ms-soft-bg)]"
                    >
                      <span
                        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full"
                        style={{ backgroundColor: cat.colorLight, color: cat.color }}
                      >
                        <Icon className="h-5 w-5" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold text-[var(--ms-navy)]">{cat.name}</p>
                        <p className="text-xs text-[var(--ms-mauve)]">{cat.subcategories.length} subcategories · {cat.count} professionals</p>
                      </div>
                      <button
                        type="button"
                        onClick={(e) => { e.preventDefault(); setExpandedCategory(expanded ? null : cat.id); }}
                        className="shrink-0 text-[var(--ms-mauve)] transition hover:text-[var(--ms-navy)]"
                      >
                        <ArrowRight className={cn("h-4 w-4 transition", expanded && "rotate-90")} />
                      </button>
                    </Link>
                    {expanded && (
                      <div className="flex flex-wrap gap-2 border-t border-[var(--ms-border)] px-5 py-3">
                        {cat.subcategories.map((sub) => (
                          <span key={sub} className="rounded-full border border-[var(--ms-border)] px-3 py-1 text-xs font-medium text-[var(--ms-mauve)]">
                            {sub}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )
        )}

        {/* ── Packages tab ───────────────────────────────────────────── */}
        {activeTab === "packages" && (
          view === "grid" ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {PACKAGES.map((pkg) => {
                const Icon = pkg.icon;
                return (
                  <article key={pkg.id} className="group overflow-hidden rounded-[18px] border border-[var(--ms-border)] bg-white shadow-[0_4px_12px_rgba(13,27,42,0.06)] transition hover:shadow-[0_8px_24px_rgba(13,27,42,0.10)]">
                    <div className="relative h-[140px] overflow-hidden">
                      <img
                        src={pkg.image}
                        alt={pkg.name}
                        className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.03]"
                      />
                      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(13,27,42,0.02)_40%,rgba(13,27,42,0.5)_100%)]" />
                      {pkg.badge && (
                        <span className="absolute right-3 top-3 rounded-full bg-[var(--ms-rose)] px-2.5 py-0.5 text-[10px] font-semibold text-white">
                          {pkg.badge}
                        </span>
                      )}
                    </div>
                    <div className="p-4">
                      <p className="font-semibold text-[var(--ms-navy)]">{pkg.name}</p>
                      <p className="mt-0.5 text-xs text-[var(--ms-mauve)]">{pkg.description}</p>
                      <div className="mt-2 flex flex-wrap gap-1">
                        {pkg.services.map((s) => (
                          <span key={s} className="rounded-full bg-[var(--ms-soft-bg)] px-2 py-0.5 text-[10px] font-medium text-[var(--ms-mauve)]">{s}</span>
                        ))}
                      </div>
                      <div className="mt-3 flex items-center justify-between">
                        <div>
                          <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--ms-mauve)]">From</p>
                          <p className="text-sm font-semibold text-[var(--ms-navy)]">{pkg.price}</p>
                        </div>
                        <Link
                          href={`/book?rush=true`}
                          className="rounded-full bg-[var(--ms-rose)] px-4 py-1.5 text-xs font-semibold text-white transition hover:brightness-110"
                        >
                          Explore package
                        </Link>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="space-y-3">
              {PACKAGES.map((pkg) => {
                const Icon = pkg.icon;
                return (
                  <article key={pkg.id} className="flex min-w-0 overflow-hidden rounded-[16px] border border-[var(--ms-border)] bg-white">
                    <img
                      src={pkg.image}
                      alt={pkg.name}
                      className="h-24 w-28 shrink-0 object-cover sm:h-28 sm:w-36"
                    />
                    <div className="flex min-w-0 flex-1 flex-col justify-between p-4">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-semibold text-[var(--ms-navy)]">{pkg.name}</p>
                          {pkg.badge && (
                            <span className="rounded-full bg-[var(--ms-rose)] px-2 py-0.5 text-[10px] font-semibold text-white">{pkg.badge}</span>
                          )}
                        </div>
                        <p className="mt-0.5 text-xs text-[var(--ms-mauve)]">{pkg.description}</p>
                        <div className="mt-1.5 flex flex-wrap gap-1">
                          {pkg.services.slice(0, 3).map((s) => (
                            <span key={s} className="rounded-full bg-[var(--ms-soft-bg)] px-2 py-0.5 text-[10px] text-[var(--ms-mauve)]">{s}</span>
                          ))}
                        </div>
                      </div>
                      <div className="mt-2 flex items-center justify-between">
                        <p className="text-sm font-semibold text-[var(--ms-navy)]">{pkg.price}</p>
                        <Link href="/book?rush=true" className="rounded-full bg-[var(--ms-rose)] px-4 py-1.5 text-xs font-semibold text-white">
                          Explore package
                        </Link>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )
        )}
      </div>
    </AppShell>
  );
}
