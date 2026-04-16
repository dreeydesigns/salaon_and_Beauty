"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  Bell,
  CalendarDays,
  Check,
  ChevronRight,
  Clock3,
  Filter,
  Home,
  LayoutGrid,
  MapPin,
  Menu,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
  UserRound,
  WalletCards,
  MessageCircleMore,
} from "lucide-react";
import type { ReactNode } from "react";

import type {
  NavKey,
  PackageOffer,
  Professional,
  ReviewSnapshot,
  RoleMode,
  Salon,
  Service,
} from "@/lib/site-data";
import {
  buildBookingHref,
  buildWhatsAppLink,
  cn,
  formatDurationRange,
  formatKES,
  formatPriceRange,
} from "@/lib/utils";

export interface FilterSection {
  label: string;
  options: string[];
}

const navItems: Array<{
  key: NavKey;
  label: string;
  href: string;
  icon: typeof Home;
}> = [
  { key: "home", label: "Home", href: "/", icon: Home },
  { key: "explore", label: "Explore", href: "/explore", icon: LayoutGrid },
  { key: "book", label: "Book", href: "/book", icon: CalendarDays },
  { key: "activity", label: "Activity", href: "/activity", icon: Bell },
  { key: "profile", label: "Profile", href: "/profile", icon: UserRound },
];

export function SectionReveal({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}

function BrandMark() {
  return (
    <svg
      aria-hidden="true"
      className="h-14 w-14 drop-shadow-[0_12px_26px_rgba(217,70,239,0.34)]"
      viewBox="0 0 84 84"
      fill="none"
    >
      <defs>
        <linearGradient id="ms-mark" x1="10" y1="8" x2="74" y2="76" gradientUnits="userSpaceOnUse">
          <stop stopColor="#D946EF" />
          <stop offset="0.48" stopColor="#8B5CF6" />
          <stop offset="1" stopColor="#C9A84C" />
        </linearGradient>
      </defs>
      <path
        d="M20 21C30 11 48 9 60 18C68 24 72 34 67 43C61 55 42 57 34 49C27 42 32 31 41 30C48 29 53 34 52 39C51 44 46 47 42 46"
        stroke="url(#ms-mark)"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="7"
      />
      <path
        d="M18 52C28 65 48 70 62 61"
        stroke="url(#ms-mark)"
        strokeLinecap="round"
        strokeWidth="7"
      />
    </svg>
  );
}

export function CTAButton({
  children,
  href,
  variant = "primary",
  className,
  type = "button",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  href?: string;
  variant?: "primary" | "secondary" | "outline" | "ghost" | "dark";
  className?: string;
}) {
  const classes = cn(
    "inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-5 text-sm font-semibold transition duration-300",
    variant === "primary" &&
      "bg-[var(--ms-magenta)] text-white shadow-[0_14px_30px_rgba(217,70,239,0.28)] hover:-translate-y-0.5 hover:bg-[#c533dc]",
    variant === "secondary" &&
      "bg-[var(--ms-ivory)] text-[var(--ms-navy)] hover:bg-white",
    variant === "outline" &&
      "border border-[var(--ms-border)] bg-white text-[var(--ms-charcoal)] hover:border-[var(--ms-magenta)] hover:text-[var(--ms-magenta)]",
    variant === "ghost" &&
      "bg-white/10 text-white hover:bg-white/18",
    variant === "dark" &&
      "bg-[var(--ms-navy)] text-white hover:bg-[#13263d]",
    className,
  );

  if (href) {
    return (
      <Link className={classes} href={href}>
        {children}
      </Link>
    );
  }

  return (
    <button className={classes} type={type} {...props}>
      {children}
    </button>
  );
}

export function RoleSwitchTabs({
  roleMode,
}: {
  roleMode: RoleMode;
}) {
  return (
    <div className="grid grid-cols-2 gap-2 rounded-full border border-[var(--ms-border)] bg-white/85 p-1 shadow-[0_12px_30px_rgba(13,27,42,0.08)] backdrop-blur">
      <Link
        className={cn(
          "rounded-full px-4 py-2 text-center text-xs font-semibold uppercase tracking-[0.22em] transition",
          roleMode === "salons"
            ? "bg-[var(--ms-navy)] text-white"
            : "text-[var(--ms-mauve)] hover:text-[var(--ms-navy)]",
        )}
        href="/salons"
      >
        Salons
      </Link>
      <Link
        className={cn(
          "rounded-full px-4 py-2 text-center text-xs font-semibold uppercase tracking-[0.22em] transition",
          roleMode === "professionals"
            ? "bg-[var(--ms-magenta)] text-white"
            : "text-[var(--ms-mauve)] hover:text-[var(--ms-navy)]",
        )}
        href="/professionals"
      >
        Professional
      </Link>
    </div>
  );
}

export function SplitBrandHeader({
  currentNav,
  roleMode,
}: {
  currentNav: NavKey;
  roleMode: RoleMode;
}) {
  return (
    <header className="sticky top-0 z-40 border-b border-[var(--ms-border)] bg-[color:rgba(250,246,241,0.94)] backdrop-blur">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-3 lg:px-6">
        <div className="grid gap-3 md:grid-cols-[minmax(0,0.42fr)_minmax(0,0.58fr)]">
          <div className="rounded-[28px] bg-[var(--ms-navy)] px-4 py-4 text-white shadow-[0_18px_50px_rgba(13,27,42,0.22)]">
            <div className="flex items-center gap-3">
              <BrandMark />
              <div>
                <p className="text-xs uppercase tracking-[0.28em] text-white/70">Nairobi marketplace</p>
                <p className="text-base font-semibold">Beauty in your fingertips</p>
              </div>
            </div>
          </div>
          <div className="rounded-[28px] border border-[var(--ms-border)] bg-white px-4 py-4 shadow-[0_18px_50px_rgba(13,27,42,0.08)]">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
              <div>
                <Link className="font-display text-3xl leading-none text-[var(--ms-navy)]" href="/">
                  Mobile Salon
                </Link>
                <p className="mt-1 text-sm text-[var(--ms-mauve)]">
                  Trusted salons and professionals across Nairobi.
                </p>
              </div>
              <nav className="hidden items-center gap-2 lg:flex">
                <DesktopNavLink href="/" current={currentNav === "home"}>
                  Home
                </DesktopNavLink>
                <DesktopNavLink href="/explore" current={currentNav === "explore"}>
                  Explore
                </DesktopNavLink>
                <DesktopNavLink href="/salons" current={currentNav === "salons"}>
                  Salons
                </DesktopNavLink>
                <DesktopNavLink href="/professionals" current={currentNav === "professionals"}>
                  Professionals
                </DesktopNavLink>
                <DesktopNavLink href="/book" current={currentNav === "book"}>
                  Book
                </DesktopNavLink>
                <DesktopNavLink href="/profile" current={currentNav === "profile"}>
                  Profile
                </DesktopNavLink>
                <CTAButton className="ml-2" href="/book">
                  Start Booking <ArrowRight className="h-4 w-4" />
                </CTAButton>
              </nav>
              <div className="flex items-center gap-2 lg:hidden">
                <div className="rounded-full bg-[var(--ms-soft-bg)] p-2 text-[var(--ms-navy)]">
                  <Menu className="h-4 w-4" />
                </div>
                <CTAButton className="flex-1" href="/book">
                  Book now
                </CTAButton>
              </div>
            </div>
          </div>
        </div>
        <div className="mx-auto w-full max-w-md lg:mx-0 lg:max-w-sm">
          <RoleSwitchTabs roleMode={roleMode} />
        </div>
      </div>
    </header>
  );
}

function DesktopNavLink({
  children,
  href,
  current,
}: {
  children: ReactNode;
  href: string;
  current?: boolean;
}) {
  return (
    <Link
      className={cn(
        "rounded-full px-4 py-2 text-sm font-medium transition",
        current
          ? "bg-[var(--ms-soft-bg)] text-[var(--ms-navy)]"
          : "text-[var(--ms-mauve)] hover:bg-[var(--ms-soft-bg)] hover:text-[var(--ms-navy)]",
      )}
      href={href}
    >
      {children}
    </Link>
  );
}

export function BottomMobileNav({ currentNav }: { currentNav: NavKey }) {
  return (
    <nav className="fixed inset-x-3 bottom-3 z-40 rounded-[28px] border border-white/60 bg-[color:rgba(13,27,42,0.94)] px-2 py-2 shadow-[0_18px_50px_rgba(13,27,42,0.35)] backdrop-blur md:hidden">
      <ul className="grid grid-cols-5 gap-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = item.key === currentNav;

          return (
            <li key={item.key}>
              <Link
                className={cn(
                  "flex flex-col items-center gap-1 rounded-2xl px-2 py-2 text-[11px] font-medium transition",
                  active
                    ? "bg-white text-[var(--ms-navy)]"
                    : "text-white/72 hover:text-white",
                )}
                href={item.href}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

export function SearchBar({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}) {
  return (
    <label className="flex min-h-12 items-center gap-3 rounded-[22px] border border-[var(--ms-border)] bg-white px-4 shadow-[0_12px_24px_rgba(13,27,42,0.06)]">
      <Search className="h-4 w-4 text-[var(--ms-mauve)]" />
      <input
        className="w-full bg-transparent text-sm text-[var(--ms-charcoal)] outline-none placeholder:text-[var(--ms-mauve)]"
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        value={value}
      />
    </label>
  );
}

export function MobileSheet({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}) {
  return (
    <AnimatePresence>
      {open ? (
        <>
          <motion.button
            aria-label="Close panel"
            className="fixed inset-0 z-40 bg-[rgba(13,27,42,0.48)] md:hidden"
            initial={{ opacity: 0 }}
            onClick={onClose}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
          <motion.div
            className="fixed inset-x-0 bottom-0 z-50 rounded-t-[32px] bg-white p-5 shadow-[0_-24px_60px_rgba(13,27,42,0.24)] md:hidden"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <div className="mx-auto mb-4 h-1.5 w-14 rounded-full bg-[var(--ms-border)]" />
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-[var(--ms-navy)]">{title}</h3>
              <button
                className="rounded-full border border-[var(--ms-border)] px-3 py-1 text-sm text-[var(--ms-mauve)]"
                onClick={onClose}
                type="button"
              >
                Close
              </button>
            </div>
            {children}
          </motion.div>
        </>
      ) : null}
    </AnimatePresence>
  );
}

export function FilterDrawer({
  open,
  onClose,
  sections,
  selected,
  toggleValue,
}: {
  open: boolean;
  onClose: () => void;
  sections: FilterSection[];
  selected: string[];
  toggleValue: (value: string) => void;
}) {
  return (
    <MobileSheet open={open} onClose={onClose} title="Filters">
      <FilterControls sections={sections} selected={selected} toggleValue={toggleValue} />
    </MobileSheet>
  );
}

export function DesktopSidebar({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <aside className="hidden rounded-[28px] border border-[var(--ms-border)] bg-white p-5 shadow-[0_12px_40px_rgba(13,27,42,0.08)] lg:block">
      <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-[var(--ms-mauve)]">
        {title}
      </p>
      {children}
    </aside>
  );
}

function FilterControls({
  sections,
  selected,
  toggleValue,
}: {
  sections: FilterSection[];
  selected: string[];
  toggleValue: (value: string) => void;
}) {
  return (
    <div className="space-y-5">
      {sections.map((section) => (
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
                      : "border-[var(--ms-border)] bg-[var(--ms-soft-bg)] text-[var(--ms-mauve)] hover:text-[var(--ms-navy)]",
                  )}
                  key={option}
                  onClick={() => toggleValue(option)}
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
  );
}

export function CategoryCircle({
  name,
  detail,
  color,
}: {
  name: string;
  detail: string;
  color: string;
}) {
  return (
    <div className="group flex flex-col items-center gap-3 text-center">
      <div
        className={cn(
          "flex h-24 w-24 items-center justify-center rounded-full border border-white/60 bg-gradient-to-br text-lg font-semibold text-[var(--ms-navy)] shadow-[0_16px_34px_rgba(13,27,42,0.12)] transition duration-300 group-hover:-translate-y-1",
          color,
        )}
      >
        {name
          .split(" ")
          .slice(0, 2)
          .map((part) => part[0])
          .join("")}
      </div>
      <div>
        <p className="text-sm font-semibold text-[var(--ms-navy)]">{name}</p>
        <p className="mt-1 text-xs leading-5 text-[var(--ms-mauve)]">{detail}</p>
      </div>
    </div>
  );
}

export function VerifiedBadge() {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-[var(--ms-navy)]/8 px-3 py-1 text-xs font-semibold text-[var(--ms-navy)]">
      <ShieldCheck className="h-3.5 w-3.5 text-[var(--ms-magenta)]" />
      Verified
    </span>
  );
}

export function WhatsAppButton({
  label,
  className,
}: {
  label: string;
  className?: string;
}) {
  return (
    <CTAButton className={className} href={buildWhatsAppLink(label)} variant="outline">
      <MessageCircleMore className="h-4 w-4" />
      WhatsApp
    </CTAButton>
  );
}

export function SalonCard({ salon }: { salon: Salon }) {
  return (
    <motion.article
      className="overflow-hidden rounded-[32px] border border-[var(--ms-border)] bg-white shadow-[0_20px_60px_rgba(13,27,42,0.08)]"
      whileHover={{ y: -4 }}
      transition={{ duration: 0.22 }}
    >
      <div className={cn("relative overflow-hidden bg-gradient-to-br px-5 py-6 text-white", salon.heroMood)}>
        <div className="absolute inset-0 opacity-30">
          <div className="absolute -left-8 top-4 h-24 w-24 rounded-full bg-white/15 blur-xl" />
          <div className="absolute bottom-0 right-2 h-32 w-32 rounded-full bg-black/20 blur-2xl" />
        </div>
        <div className="relative flex flex-col gap-4">
          <div className="flex flex-wrap items-center gap-2">
            {salon.verified ? <VerifiedBadge /> : null}
            <span className="rounded-full bg-white/16 px-3 py-1 text-xs font-medium">{salon.location}</span>
          </div>
          <div>
            <p className="font-display text-3xl leading-tight">{salon.name}</p>
            <p className="mt-2 max-w-lg text-sm text-white/82">{salon.tagline}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {salon.categoryTags.map((tag) => (
              <span className="rounded-full border border-white/25 px-3 py-1 text-xs" key={tag}>
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
      <div className="space-y-4 p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2">
            <p className="flex items-center gap-2 text-sm text-[var(--ms-mauve)]">
              <MapPin className="h-4 w-4" />
              {salon.areasServed.join(" · ")}
            </p>
            <p className="flex items-center gap-2 text-sm text-[var(--ms-mauve)]">
              <Star className="h-4 w-4 fill-[var(--ms-gold)] text-[var(--ms-gold)]" />
              {salon.rating} ({salon.reviewCount} reviews)
            </p>
          </div>
          <div className="rounded-[22px] bg-[var(--ms-soft-bg)] px-4 py-3 text-right">
            <p className="text-xs uppercase tracking-[0.2em] text-[var(--ms-mauve)]">From</p>
            <p className="text-lg font-semibold text-[var(--ms-navy)]">{formatKES(salon.startingPrice)}</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {salon.topServiceIds.slice(0, 3).map((serviceId) => (
            <span
              className="rounded-full bg-[var(--ms-soft-bg)] px-3 py-1 text-xs font-medium text-[var(--ms-mauve)]"
              key={serviceId}
            >
              {serviceId.replaceAll("-", " ")}
            </span>
          ))}
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <CTAButton className="flex-1" href={`/salons/${salon.slug}`} variant="outline">
            View Salon
          </CTAButton>
          <CTAButton className="flex-1" href={buildBookingHref({ targetType: "salons", targetId: salon.slug })}>
            Book Now
          </CTAButton>
        </div>
      </div>
    </motion.article>
  );
}

export function ProfessionalCard({ professional }: { professional: Professional }) {
  return (
    <motion.article
      className="rounded-[32px] border border-[var(--ms-border)] bg-white p-5 shadow-[0_20px_60px_rgba(13,27,42,0.08)]"
      whileHover={{ y: -4 }}
      transition={{ duration: 0.22 }}
    >
      <div className={cn("mb-5 rounded-[28px] bg-gradient-to-br px-5 py-6 text-white", professional.heroMood)}>
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="font-display text-3xl leading-tight">{professional.name}</p>
            <p className="mt-2 text-sm text-white/82">{professional.specialty}</p>
          </div>
          {professional.verified ? <VerifiedBadge /> : null}
        </div>
      </div>
      <div className="space-y-4">
        <p className="text-sm leading-6 text-[var(--ms-charcoal)]">{professional.description}</p>
        <div className="grid gap-3 sm:grid-cols-2">
          <MetaPill icon={<MapPin className="h-4 w-4" />} label={professional.location} />
          <MetaPill icon={<WalletCards className="h-4 w-4" />} label={`${professional.serviceMode} service`} />
          <MetaPill icon={<Clock3 className="h-4 w-4" />} label={professional.nextAvailable} />
          <MetaPill
            icon={<Star className="h-4 w-4 fill-[var(--ms-gold)] text-[var(--ms-gold)]" />}
            label={`${professional.rating} rating`}
          />
        </div>
        <div className="rounded-[24px] bg-[var(--ms-soft-bg)] px-4 py-3">
          <p className="text-xs uppercase tracking-[0.2em] text-[var(--ms-mauve)]">Starts at</p>
          <p className="mt-1 text-lg font-semibold text-[var(--ms-navy)]">{formatKES(professional.startingPrice)}</p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <CTAButton className="flex-1" href={`/professionals/${professional.slug}`} variant="outline">
            View Profile
          </CTAButton>
          <CTAButton
            className="flex-1"
            href={buildBookingHref({ targetType: "professionals", targetId: professional.slug })}
          >
            Request Booking
          </CTAButton>
        </div>
      </div>
    </motion.article>
  );
}

function MetaPill({ icon, label }: { icon: ReactNode; label: string }) {
  return (
    <div className="flex items-center gap-2 rounded-full bg-[var(--ms-soft-bg)] px-3 py-2 text-sm text-[var(--ms-mauve)]">
      {icon}
      {label}
    </div>
  );
}

export function ServiceCard({
  service,
  compact,
}: {
  service: Service;
  compact?: boolean;
}) {
  return (
    <article className="rounded-[28px] border border-[var(--ms-border)] bg-white p-5 shadow-[0_12px_40px_rgba(13,27,42,0.06)]">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.22em] text-[var(--ms-mauve)]">{service.category}</p>
          <h3 className="mt-2 text-xl font-semibold text-[var(--ms-navy)]">{service.name}</h3>
        </div>
        {service.popular ? (
          <span className="rounded-full bg-[var(--ms-gold)]/16 px-3 py-1 text-xs font-semibold text-[var(--ms-gold)]">
            Popular
          </span>
        ) : null}
      </div>
      <p className="mt-3 text-sm leading-6 text-[var(--ms-charcoal)]">{service.description}</p>
      <p className="mt-3 text-sm text-[var(--ms-mauve)]">{service.inclusions}</p>
      <div className="mt-4 flex flex-wrap items-center gap-3 text-sm">
        <span className="rounded-full bg-[var(--ms-soft-bg)] px-3 py-2 text-[var(--ms-navy)]">
          {formatPriceRange(service.minPrice, service.maxPrice)}
        </span>
        <span className="rounded-full bg-[var(--ms-soft-bg)] px-3 py-2 text-[var(--ms-mauve)]">
          {formatDurationRange(service.durationMin, service.durationMax)}
        </span>
      </div>
      {!compact ? (
        <div className="mt-5">
          <CTAButton href={buildBookingHref({ targetType: "salons", serviceIds: [service.id] })}>
            Select Service
          </CTAButton>
        </div>
      ) : null}
    </article>
  );
}

export function PackageCard({ offer }: { offer: PackageOffer }) {
  return (
    <article className="rounded-[32px] bg-[linear-gradient(145deg,rgba(13,27,42,0.95),rgba(29,39,62,0.88)_52%,rgba(217,70,239,0.34))] p-5 text-white shadow-[0_22px_60px_rgba(13,27,42,0.18)]">
      <p className="text-xs uppercase tracking-[0.22em] text-white/65">{offer.badge}</p>
      <h3 className="mt-3 font-display text-3xl leading-tight">{offer.name}</h3>
      <p className="mt-3 text-sm leading-6 text-white/78">{offer.description}</p>
      <div className="mt-5 flex items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-white/60">Package price</p>
          <p className="mt-1 text-xl font-semibold text-[var(--ms-gold)]">{formatKES(offer.price)}</p>
        </div>
        <CTAButton
          className="bg-white text-[var(--ms-navy)] hover:bg-[var(--ms-ivory)]"
          href={buildBookingHref({ targetType: "salons", serviceIds: offer.serviceIds })}
        >
          Add
        </CTAButton>
      </div>
    </article>
  );
}

export function ReviewCard({ review }: { review: ReviewSnapshot }) {
  return (
    <article className="rounded-[28px] border border-[var(--ms-border)] bg-white p-5 shadow-[0_12px_40px_rgba(13,27,42,0.06)]">
      <div className="flex items-center gap-1 text-[var(--ms-gold)]">
        {Array.from({ length: review.rating }).map((_, index) => (
          <Star className="h-4 w-4 fill-current" key={`${review.id}-${index}`} />
        ))}
      </div>
      <p className="mt-4 text-base leading-7 text-[var(--ms-charcoal)]">{review.body}</p>
      <div className="mt-5">
        <p className="font-semibold text-[var(--ms-navy)]">{review.name}</p>
        <p className="text-sm text-[var(--ms-mauve)]">
          {review.title} · {review.serviceLabel}
        </p>
      </div>
    </article>
  );
}

export function AvailabilityChips({ items }: { items: string[] }) {
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((item) => (
        <span className="rounded-full bg-[var(--ms-soft-bg)] px-3 py-2 text-sm text-[var(--ms-mauve)]" key={item}>
          {item}
        </span>
      ))}
    </div>
  );
}

export function BookingStepper({ step }: { step: number }) {
  const steps = ["Target", "Service", "Time", "Details", "Review"];

  return (
    <div className="grid grid-cols-5 gap-2">
      {steps.map((label, index) => {
        const itemStep = index + 1;
        const active = itemStep <= step;

        return (
          <div className="space-y-2" key={label}>
            <div className={cn("h-1.5 rounded-full", active ? "bg-[var(--ms-magenta)]" : "bg-[var(--ms-border)]")} />
            <p className={cn("text-xs", active ? "text-[var(--ms-navy)]" : "text-[var(--ms-mauve)]")}>{label}</p>
          </div>
        );
      })}
    </div>
  );
}

export function DateChip({
  label,
  date,
  selected,
  onClick,
}: {
  label: string;
  date: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      className={cn(
        "min-w-[88px] rounded-[22px] border px-4 py-3 text-left transition",
        selected
          ? "border-[var(--ms-gold)] bg-[var(--ms-gold)] text-[var(--ms-navy)]"
          : "border-[var(--ms-border)] bg-white text-[var(--ms-mauve)]",
      )}
      onClick={onClick}
      type="button"
    >
      <p className="text-xs uppercase tracking-[0.18em]">{label}</p>
      <p className="mt-1 font-semibold">{date}</p>
    </button>
  );
}

export function TimePill({
  value,
  selected,
  onClick,
}: {
  value: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      className={cn(
        "rounded-full border px-4 py-2 text-sm font-medium transition",
        selected
          ? "border-[var(--ms-magenta)] bg-[var(--ms-magenta)] text-white"
          : "border-[var(--ms-border)] bg-white text-[var(--ms-mauve)]",
      )}
      onClick={onClick}
      type="button"
    >
      {value}
    </button>
  );
}

export function PriceSummary({
  serviceCount,
  priceTotal,
  durationLabel,
}: {
  serviceCount: number;
  priceTotal: string;
  durationLabel: string;
}) {
  return (
    <div className="rounded-[28px] bg-[var(--ms-navy)] p-5 text-white shadow-[0_20px_50px_rgba(13,27,42,0.24)]">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.22em] text-white/60">Selected services</p>
          <p className="mt-1 text-lg font-semibold">{serviceCount} chosen</p>
        </div>
        <div className="text-right">
          <p className="text-xs uppercase tracking-[0.22em] text-white/60">Estimated total</p>
          <p className="mt-1 text-xl font-semibold text-[var(--ms-gold)]">{priceTotal}</p>
        </div>
      </div>
      <p className="mt-3 text-sm text-white/72">{durationLabel}</p>
    </div>
  );
}

export function NotificationToggle({
  label,
  hint,
  checked,
  onToggle,
}: {
  label: string;
  hint: string;
  checked: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      className="flex w-full items-center justify-between gap-4 rounded-[24px] border border-[var(--ms-border)] bg-white px-4 py-4 text-left"
      onClick={onToggle}
      type="button"
    >
      <div>
        <p className="font-semibold text-[var(--ms-navy)]">{label}</p>
        <p className="mt-1 text-sm text-[var(--ms-mauve)]">{hint}</p>
      </div>
      <span
        className={cn(
          "flex h-7 w-12 items-center rounded-full p-1 transition",
          checked ? "justify-end bg-[var(--ms-magenta)]" : "justify-start bg-[var(--ms-border)]",
        )}
      >
        <span className="h-5 w-5 rounded-full bg-white" />
      </span>
    </button>
  );
}

export function PortfolioGrid({
  items,
  dark,
}: {
  items: { id: string; title: string; note: string; tint: string }[];
  dark?: boolean;
}) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {items.map((item) => (
        <div
          className={cn(
            "overflow-hidden rounded-[28px] border p-4",
            dark
              ? "border-white/10 bg-white/5"
              : "border-[var(--ms-border)] bg-white shadow-[0_12px_30px_rgba(13,27,42,0.06)]",
          )}
          key={item.id}
        >
          <div className={cn("h-36 rounded-[22px] bg-gradient-to-br", item.tint)} />
          <h3 className={cn("mt-4 text-lg font-semibold", dark ? "text-white" : "text-[var(--ms-navy)]")}>
            {item.title}
          </h3>
          <p className={cn("mt-2 text-sm leading-6", dark ? "text-white/70" : "text-[var(--ms-mauve)]")}>
            {item.note}
          </p>
        </div>
      ))}
    </div>
  );
}

export function EmptyState({
  title,
  copy,
}: {
  title: string;
  copy: string;
}) {
  return (
    <div className="rounded-[28px] border border-dashed border-[var(--ms-border)] bg-white px-5 py-12 text-center">
      <Sparkles className="mx-auto h-6 w-6 text-[var(--ms-magenta)]" />
      <h3 className="mt-4 text-lg font-semibold text-[var(--ms-navy)]">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-[var(--ms-mauve)]">{copy}</p>
    </div>
  );
}

export function AuthCard({
  eyebrow,
  title,
  description,
  children,
  aside,
}: {
  eyebrow: string;
  title: string;
  description: string;
  children: ReactNode;
  aside?: ReactNode;
}) {
  return (
    <div className="grid gap-5 lg:grid-cols-[minmax(0,0.6fr)_minmax(0,0.4fr)]">
      <div className="rounded-[32px] border border-[var(--ms-border)] bg-white p-6 shadow-[0_22px_60px_rgba(13,27,42,0.08)]">
        <p className="text-xs uppercase tracking-[0.24em] text-[var(--ms-mauve)]">{eyebrow}</p>
        <h1 className="mt-3 text-3xl font-semibold text-[var(--ms-navy)]">{title}</h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-[var(--ms-mauve)]">{description}</p>
        <div className="mt-6">{children}</div>
      </div>
      <div className="rounded-[32px] bg-[linear-gradient(160deg,#0d1b2a_0%,#12263d_52%,rgba(217,70,239,0.4)_100%)] p-6 text-white shadow-[0_22px_60px_rgba(13,27,42,0.18)]">
        <p className="text-xs uppercase tracking-[0.24em] text-white/62">Why Mobile Salon</p>
        <h2 className="mt-3 font-display text-4xl leading-tight">Clear pricing. Trusted Nairobi beauty.</h2>
        <p className="mt-4 text-sm leading-7 text-white/76">
          Built to remove booking chaos for clients while giving salons and professionals a serious home for their business.
        </p>
        <div className="mt-6 space-y-3">
          <InfoBullet text="Visible prices, timings, and availability before confirmation" />
          <InfoBullet text="Professional onboarding, portfolio setup, and service management" />
          <InfoBullet text="WhatsApp fallback for MVP support without breaking the main flow" />
        </div>
        {aside ? <div className="mt-6">{aside}</div> : null}
      </div>
    </div>
  );
}

function InfoBullet({ text }: { text: string }) {
  return (
    <div className="flex items-start gap-3 rounded-[20px] bg-white/8 px-4 py-3">
      <Check className="mt-1 h-4 w-4 text-[var(--ms-gold)]" />
      <p className="text-sm leading-6 text-white/76">{text}</p>
    </div>
  );
}

export function ProfileCompletionCard({
  progress,
  tasks,
}: {
  progress: number;
  tasks: string[];
}) {
  return (
    <article className="rounded-[28px] border border-[var(--ms-border)] bg-white p-5 shadow-[0_12px_40px_rgba(13,27,42,0.06)]">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.22em] text-[var(--ms-mauve)]">Profile completion</p>
          <h3 className="mt-2 text-2xl font-semibold text-[var(--ms-navy)]">{progress}% ready</h3>
        </div>
        <div className="rounded-full bg-[var(--ms-soft-bg)] p-3">
          <ChevronRight className="h-5 w-5 text-[var(--ms-magenta)]" />
        </div>
      </div>
      <div className="mt-4 h-2 rounded-full bg-[var(--ms-border)]">
        <div className="h-2 rounded-full bg-[var(--ms-magenta)]" style={{ width: `${progress}%` }} />
      </div>
      <ul className="mt-5 space-y-3">
        {tasks.map((task) => (
          <li className="flex items-center gap-3 text-sm text-[var(--ms-charcoal)]" key={task}>
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[var(--ms-soft-bg)]">
              <Check className="h-3.5 w-3.5 text-[var(--ms-magenta)]" />
            </span>
            {task}
          </li>
        ))}
      </ul>
    </article>
  );
}

export function FilterButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      className="inline-flex min-h-12 items-center gap-2 rounded-full border border-[var(--ms-border)] bg-white px-4 py-2 text-sm font-semibold text-[var(--ms-navy)] shadow-[0_12px_24px_rgba(13,27,42,0.06)] lg:hidden"
      onClick={onClick}
      type="button"
    >
      <Filter className="h-4 w-4" />
      Filters
    </button>
  );
}
