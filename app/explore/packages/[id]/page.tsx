"use client";

import Link from "next/link";
import { useState } from "react";
import { useParams } from "next/navigation";
import {
  Briefcase,
  CalendarDays,
  Droplets,
  Gem,
  Heart,
  Leaf,
  Star,
  Waves,
} from "lucide-react";

import { AppShell } from "@/components/app-shell";
import { SalonCard, ProfessionalCard } from "@/components/marketplace-ui";
import { salons, professionals } from "@/lib/site-data";
import { cn } from "@/lib/utils";

// ─── Packages (mirrored from explore/page.tsx) ────────────────────────────────

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

export default function PackageDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const pkg = PACKAGES.find((p) => p.id === id);
  const [providerType, setProviderType] = useState<"salons" | "professionals">("salons");

  const displaySalons = salons.slice(0, 6);
  const displayPros = professionals.slice(0, 6);

  const Icon = pkg?.icon;

  if (!pkg) {
    return (
      <AppShell currentNav="explore" roleMode="salons">
        <div className="mx-auto max-w-7xl px-4 pb-24 pt-4">
          <Link href="/explore" className="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--ms-mauve)] hover:text-[var(--ms-navy)] transition">
            ← Packages
          </Link>
          <p className="mt-8 text-center text-[var(--ms-mauve)]">Package not found.</p>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell currentNav="explore" roleMode="salons">
      <div className="mx-auto max-w-7xl space-y-6 px-4 pb-24 pt-4">

        {/* Back link */}
        <Link
          href="/explore"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--ms-mauve)] hover:text-[var(--ms-navy)] transition"
        >
          ← Packages
        </Link>

        {/* Hero image */}
        <div className="relative overflow-hidden rounded-[24px]">
          <img
            src={pkg.image}
            alt={pkg.name}
            className="h-56 w-full object-cover rounded-[24px]"
          />
          {pkg.badge && (
            <span className="absolute right-4 top-4 rounded-full bg-[var(--ms-rose)] px-3 py-1 text-xs font-semibold text-white">
              {pkg.badge}
            </span>
          )}
        </div>

        {/* Package info */}
        <div className="rounded-[24px] border border-[var(--ms-border)] bg-white p-5 space-y-4 shadow-[0_4px_12px_rgba(13,27,42,0.05)]">
          <div className="flex items-start gap-4">
            {Icon && (
              <span
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full"
                style={{ backgroundColor: `${pkg.color}18`, color: pkg.color }}
              >
                <Icon className="h-6 w-6" />
              </span>
            )}
            <div className="min-w-0 flex-1">
              <h1 className="text-xl font-semibold text-[var(--ms-navy)]">{pkg.name}</h1>
              <p className="mt-1 text-sm text-[var(--ms-mauve)]">{pkg.description}</p>
            </div>
          </div>

          {/* Duration + Price */}
          <div className="flex items-center gap-6">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--ms-mauve)]">Duration</p>
              <p className="mt-0.5 text-sm font-medium text-[var(--ms-navy)]">{pkg.duration}</p>
            </div>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--ms-mauve)]">From</p>
              <p className="mt-0.5 text-sm font-semibold text-[var(--ms-navy)]">{pkg.price}</p>
            </div>
          </div>

          {/* Included services */}
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--ms-mauve)]">Includes</p>
            <div className="flex flex-wrap gap-2">
              {pkg.services.map((s) => (
                <span
                  key={s}
                  className="rounded-full border border-[var(--ms-border)] bg-[var(--ms-soft-bg)] px-3 py-1 text-xs font-medium text-[var(--ms-navy)]"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>

          {/* Book Now CTA */}
          <Link
            href={`/book?rush=true&packageId=${id}`}
            className="block w-full rounded-full bg-[var(--ms-rose)] py-3 text-center text-sm font-semibold text-white transition hover:brightness-110"
          >
            Book Now
          </Link>
        </div>

        {/* Provider type toggle */}
        <div>
          <p className="mb-3 text-sm font-semibold text-[var(--ms-navy)]">Choose your provider</p>
          <div className="inline-flex rounded-full border border-[var(--ms-border)] bg-white p-1">
            <button
              type="button"
              onClick={() => setProviderType("salons")}
              className={cn(
                "rounded-full px-5 py-2 text-sm font-semibold transition",
                providerType === "salons"
                  ? "bg-[var(--ms-plum)] text-white"
                  : "text-[var(--ms-mauve)]",
              )}
            >
              Book with a Salon
            </button>
            <button
              type="button"
              onClick={() => setProviderType("professionals")}
              className={cn(
                "rounded-full px-5 py-2 text-sm font-semibold transition",
                providerType === "professionals"
                  ? "bg-[var(--ms-plum)] text-white"
                  : "text-[var(--ms-mauve)]",
              )}
            >
              Book with a Professional
            </button>
          </div>
        </div>

        {/* Provider grid */}
        {providerType === "salons" ? (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {displaySalons.map((salon) => (
              <SalonCard key={salon.slug} salon={salon} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {displayPros.map((pro) => (
              <ProfessionalCard key={pro.slug} professional={pro} />
            ))}
          </div>
        )}
      </div>
    </AppShell>
  );
}
