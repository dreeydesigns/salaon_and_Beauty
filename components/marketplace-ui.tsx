"use client";

import Link from "next/link";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  Bell,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronRight,
  Clock3,
  CreditCard,
  LockKeyhole,
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
  PhoneCall,
  EyeOff,
  Scissors,
  Paintbrush,
  Crown,
  Heart,
  Waves,
  Hand,
  Eye,
} from "lucide-react";
import { useEffect, useState, type CSSProperties, type ReactNode } from "react";

import { APP_SESSION_EVENT, readAppSession } from "@/lib/client-session";
import type {
  NavKey,
  PackageOffer,
  PortfolioItem,
  Professional,
  ReviewSnapshot,
  RoleMode,
  Salon,
  Service,
  VisualAsset,
} from "@/lib/site-data";
import { getServicesByIds, imageAssets } from "@/lib/site-data";
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
  { key: "home", label: "Home", href: "/home", icon: Home },
  { key: "explore", label: "Explore", href: "/explore", icon: LayoutGrid },
  { key: "book", label: "Book", href: "/book", icon: CalendarDays },
  { key: "activity", label: "Activity", href: "/activity", icon: Bell },
  { key: "profile", label: "Profile", href: "/profile", icon: UserRound },
];

export function SectionReveal({
  children,
  className,
  style,
}: {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <motion.div
      className={className}
      style={style}
      initial={{ opacity: 0.98, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}

export function ScrollSection({
  eyebrow,
  title,
  href,
  hrefLabel = "See all",
  children,
  className,
  id,
}: {
  eyebrow: string;
  title: string;
  href?: string;
  hrefLabel?: string;
  children: ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <section
      className={cn(
        "section-grid min-w-0 max-w-full overflow-hidden rounded-[32px] border border-[var(--ms-border)] bg-white p-4 shadow-[0_18px_54px_rgba(13,27,42,0.06)] sm:rounded-[36px] sm:p-6 lg:p-8",
        className,
      )}
      id={id}
    >
      <div className="flex min-w-0 flex-col items-start gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0">
          <p className="text-xs uppercase tracking-[0.22em] text-[var(--ms-mauve)]">{eyebrow}</p>
          <h2 className="mt-3 max-w-full text-2xl font-semibold leading-tight text-[var(--ms-plum)] sm:text-3xl">
            {title}
          </h2>
          <span className="scroll-affordance mt-3">
            Scroll sideways
            <ChevronRight className="h-4 w-4" />
          </span>
        </div>
        {href ? (
          <CTAButton className="hidden sm:inline-flex" href={href} variant="outline">
            {hrefLabel}
          </CTAButton>
        ) : null}
      </div>
      <div className="scroll-row">{children}</div>
      {href ? (
        <CTAButton className="sm:hidden" href={href} variant="outline">
          {hrefLabel}
        </CTAButton>
      ) : null}
    </section>
  );
}

export function DecorativeStat({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="beauty-card rounded-[28px] p-5">
      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[var(--ms-petal)] text-[var(--ms-rose)]">
        {icon}
      </div>
      <p className="mt-4 text-xs uppercase tracking-[0.2em] text-[var(--ms-mauve)]">{label}</p>
      <p className="mt-2 text-3xl font-semibold text-[var(--ms-plum)]">{value}</p>
    </div>
  );
}

export function TrustFlowCard() {
  const steps = [
    { icon: <UserRound className="h-5 w-5" />, title: "Sign in", copy: "Use a real account." },
    { icon: <CreditCard className="h-5 w-5" />, title: "Pay", copy: "Secure the slot first." },
    { icon: <LockKeyhole className="h-5 w-5" />, title: "Hold", copy: "Funds stay protected." },
    { icon: <CheckCircle2 className="h-5 w-5" />, title: "Release", copy: "Payout follows confirmation." },
  ];

  return (
    <div className="decorative-orbit min-w-0 max-w-full overflow-hidden rounded-[34px] bg-[linear-gradient(135deg,var(--ms-plum),#7a255f_55%,var(--ms-rose))] p-5 text-white shadow-[0_28px_80px_rgba(132,36,92,0.24)] sm:p-6">
      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/62">Protected marketplace</p>
      <h2 className="mt-3 max-w-full text-2xl font-semibold leading-tight sm:text-3xl">
        Pay first. Release after beauty is delivered.
      </h2>
      <p className="mt-3 max-w-full break-words text-sm leading-7 text-white/72">
        Mobile Salon holds the money first, then releases payout after service completion is confirmed.
      </p>
      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        {steps.map((step) => (
          <div className="min-w-0 rounded-[24px] bg-white/10 p-4 backdrop-blur" key={step.title}>
            <div className="flex min-w-0 items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/14 text-[var(--ms-blush)]">
                {step.icon}
              </span>
              <p className="min-w-0 font-semibold">{step.title}</p>
            </div>
            <p className="mt-3 text-sm leading-6 text-white/72">{step.copy}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function BrandMark() {
  return (
    <svg
      aria-hidden="true"
      className="h-9 w-9 drop-shadow-[0_10px_20px_rgba(217,70,239,0.32)]"
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
    "disabled:pointer-events-none disabled:opacity-45 active:scale-[0.98]",
    variant === "primary" &&
      "bg-[linear-gradient(135deg,var(--ms-rose),var(--ms-orchid))] text-white shadow-[0_16px_34px_rgba(232,62,140,0.28)] hover:-translate-y-0.5 hover:shadow-[0_20px_44px_rgba(232,62,140,0.34)]",
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

export function BreadcrumbTrail({
  items,
}: {
  items: Array<{ label: string; href?: string }>;
}) {
  return (
    <nav aria-label="Breadcrumb" className="flex min-w-0 flex-wrap items-center gap-2 text-xs text-[var(--ms-mauve)]">
      {items.map((item, index) => {
        const isLast = index === items.length - 1;

        return (
          <span className="flex min-w-0 items-center gap-2" key={`${item.label}-${index}`}>
            {item.href && !isLast ? (
              <Link className="beauty-link font-semibold text-[var(--ms-plum)]" href={item.href}>
                {item.label}
              </Link>
            ) : (
              <span className={cn("truncate", isLast ? "font-semibold text-[var(--ms-navy)]" : "")}>{item.label}</span>
            )}
            {!isLast ? <ChevronRight className="h-3.5 w-3.5 shrink-0" /> : null}
          </span>
        );
      })}
    </nav>
  );
}

export function RoleSwitchTabs({
  roleMode,
}: {
  roleMode: RoleMode;
}) {
  return (
    <div className="grid min-w-0 grid-cols-2 gap-2 overflow-hidden rounded-full border border-[var(--ms-border)] bg-white/85 p-1 shadow-[0_12px_30px_rgba(13,27,42,0.08)] backdrop-blur">
      <Link
        className={cn(
          "min-w-0 whitespace-nowrap rounded-full px-2 py-2 text-center text-[10px] font-semibold uppercase tracking-[0.12em] transition sm:px-3 sm:text-xs sm:tracking-[0.16em]",
          roleMode === "salons"
            ? "bg-[var(--ms-plum)] text-white"
            : "text-[var(--ms-mauve)] hover:text-[var(--ms-navy)]",
        )}
        href="/salons"
      >
        Salons
      </Link>
      <Link
        className={cn(
          "min-w-0 whitespace-nowrap rounded-full px-2 py-2 text-center text-[10px] font-semibold uppercase tracking-[0.12em] transition sm:px-3 sm:text-xs sm:tracking-[0.16em]",
          roleMode === "professionals"
            ? "bg-[linear-gradient(135deg,var(--ms-rose),var(--ms-orchid))] text-white"
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
  const [menuOpen, setMenuOpen] = useState(false);
  const [sessionRoleMode, setSessionRoleMode] = useState<RoleMode>(roleMode);

  useEffect(() => {
    function syncRoleMode() {
      const session = readAppSession();

      if (session?.role === "professional") {
        setSessionRoleMode("professionals");
        return;
      }

      if (session?.role === "salon") {
        setSessionRoleMode("salons");
        return;
      }

      setSessionRoleMode(roleMode);
    }

    syncRoleMode();
    window.addEventListener("storage", syncRoleMode);
    window.addEventListener(APP_SESSION_EVENT, syncRoleMode);

    return () => {
      window.removeEventListener("storage", syncRoleMode);
      window.removeEventListener(APP_SESSION_EVENT, syncRoleMode);
    };
  }, [roleMode]);

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-[var(--ms-border)] bg-white/95 backdrop-blur-2xl">
        <div className="mx-auto max-w-7xl px-4 py-3 lg:px-6">
          <div className="flex items-center gap-3 rounded-[28px] border border-white/80 bg-white/90 px-3 py-3 shadow-[0_18px_55px_rgba(132,36,92,0.11)]">
            <Link className="flex shrink-0 items-center gap-3" href="/home">
              <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-[22px] bg-[linear-gradient(145deg,var(--ms-plum),var(--ms-rose))] text-white shadow-[0_16px_36px_rgba(132,36,92,0.2)]">
                <BrandMark />
              </span>
              <span className="min-w-0">
                <span className="block whitespace-nowrap font-display text-2xl leading-none text-[var(--ms-navy)]">
                  Mobile Salon
                </span>
                <span className="mt-1 hidden whitespace-nowrap text-xs font-semibold uppercase tracking-[0.22em] text-[var(--ms-mauve)] sm:block">
                  Beauty, softly handled
                </span>
              </span>
            </Link>

            <nav className="ml-auto hidden items-center gap-1 xl:flex">
              <DesktopNavLink href="/home" current={currentNav === "home"}>
                Home
              </DesktopNavLink>
              <DesktopNavLink href="/guide">
                Guide
              </DesktopNavLink>
              <DesktopNavLink href="/explore" current={currentNav === "explore" || currentNav === "salons" || currentNav === "professionals"}>
                Product Marketplace
              </DesktopNavLink>
              <DesktopNavLink href="/services" current={currentNav === "book"}>
                Services
              </DesktopNavLink>
              <DesktopNavLink href="/book" current={currentNav === "book"}>
                Book
              </DesktopNavLink>
              <DesktopNavLink href="/profile" current={currentNav === "profile"}>
                Profile
              </DesktopNavLink>
              <CTAButton className="ml-2 min-h-12 px-6" href="/book?rush=true">
                Start Booking <ArrowRight className="h-4 w-4" />
              </CTAButton>
            </nav>

            <div className="ml-auto flex items-center gap-2 xl:hidden">
              <button
                aria-controls="mobile-menu"
                aria-expanded={menuOpen}
                aria-label="Open mobile menu"
                className="rounded-full bg-[var(--ms-petal)] p-3 text-[var(--ms-plum)]"
                onClick={() => setMenuOpen(true)}
                type="button"
              >
                <Menu className="h-5 w-5" />
              </button>
              <CTAButton className="hidden px-4 sm:inline-flex" href="/book?rush=true">
                Book
              </CTAButton>
            </div>
          </div>
          <div className="mx-auto mt-3 w-full max-w-80 sm:max-w-md">
            <RoleSwitchTabs roleMode={sessionRoleMode} />
          </div>
        </div>
      </header>
      <MobileSheet open={menuOpen} onClose={() => setMenuOpen(false)} title="Menu">
        <nav id="mobile-menu" className="grid gap-2">
          {[
            ["Home", "/home"],
            ["Guide", "/guide"],
            ["Product Marketplace", "/explore"],
            ["Services", "/services"],
            ["Book now", "/book?rush=true"],
            ["Activity", "/activity"],
            ["Profile", "/profile"],
            ["Sign in", "/auth/sign-in"],
            ["Create account", "/auth/sign-up"],
            ["Help", "/help"],
          ].map(([label, href]) => (
            <Link
              className="rounded-[20px] bg-[var(--ms-soft-bg)] px-4 py-3 text-sm font-semibold text-[var(--ms-navy)]"
              href={href}
              key={href}
              onClick={() => setMenuOpen(false)}
            >
              {label}
            </Link>
          ))}
        </nav>
      </MobileSheet>
    </>
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
    <nav
      className="mobile-bottom-nav fixed bottom-3 z-40 overflow-hidden rounded-[26px] border border-white/70 bg-[linear-gradient(135deg,rgba(58,24,58,0.96),rgba(132,36,92,0.94))] px-1.5 py-1.5 shadow-[0_18px_50px_rgba(132,36,92,0.32)] backdrop-blur md:hidden"
      style={{ left: "0.5rem", maxWidth: "calc(100vw - 1rem)", right: "0.5rem", width: "auto" }}
    >
      <ul
        className="mobile-bottom-nav-grid grid min-w-0 gap-0.5"
        style={{ gridTemplateColumns: "repeat(5, minmax(0, 1fr))" }}
      >
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = item.key === currentNav;

          return (
            <li className="min-w-0" key={item.key}>
              <Link
                className={cn(
                  "flex min-w-0 flex-col items-center gap-1 rounded-2xl px-1 py-2 text-[10px] font-medium transition",
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
            className="fixed inset-0 z-40 bg-[rgba(13,27,42,0.48)] xl:hidden"
            initial={{ opacity: 0 }}
            onClick={onClose}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
          <motion.div
            className="fixed inset-x-0 bottom-0 z-50 rounded-t-[32px] bg-white p-5 shadow-[0_-24px_60px_rgba(13,27,42,0.24)] xl:hidden"
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
  image,
}: {
  name: string;
  detail: string;
  color: string;
  image?: VisualAsset;
}) {
  return (
    <div className="group flex flex-col items-center gap-3 text-center">
      <div
        className={cn(
          "relative flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border border-white/60 bg-gradient-to-br text-lg font-semibold text-[var(--ms-navy)] shadow-[0_16px_34px_rgba(13,27,42,0.12)] transition duration-300 group-hover:-translate-y-1",
          color,
        )}
      >
        {image ? (
          <>
            <ImageLayer asset={image} />
            <span className="absolute inset-0 bg-[linear-gradient(180deg,rgba(13,27,42,0.05),rgba(13,27,42,0.62))]" />
            <span className="relative flex h-12 w-12 items-center justify-center rounded-full border border-white/30 bg-white/18 text-white backdrop-blur">
              {renderCategoryIcon(name, "h-6 w-6")}
            </span>
          </>
        ) : (
          renderCategoryIcon(name, "h-6 w-6")
        )}
      </div>
      <div>
        <p className="text-sm font-semibold text-[var(--ms-navy)]">{name}</p>
        <p className="mt-1 text-xs leading-5 text-[var(--ms-mauve)]">{detail}</p>
      </div>
    </div>
  );
}

function renderCategoryIcon(name: string, className: string) {
  const normalized = name.toLowerCase();

  if (normalized.includes("braid") || normalized.includes("hair")) {
    return <Waves className={className} />;
  }

  if (normalized.includes("nail")) {
    return <Hand className={className} />;
  }

  if (normalized.includes("make")) {
    return <Paintbrush className={className} />;
  }

  if (normalized.includes("lash")) {
    return <Eye className={className} />;
  }

  if (normalized.includes("short") || normalized.includes("shave")) {
    return <Scissors className={className} />;
  }

  if (normalized.includes("bridal")) {
    return <Crown className={className} />;
  }

  if (normalized.includes("self")) {
    return <Heart className={className} />;
  }

  return <Sparkles className={className} />;
}

export function VerifiedBadge() {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-[var(--ms-plum)] shadow-[0_8px_20px_rgba(132,36,92,0.14)]">
      <ShieldCheck className="h-3.5 w-3.5 text-[var(--ms-rose)]" />
      Verified
    </span>
  );
}

function ImageLayer({
  asset,
  className,
  priority,
}: {
  asset?: VisualAsset;
  className?: string;
  priority?: boolean;
}) {
  if (!asset) {
    return null;
  }

  return (
    <Image
      alt={asset.alt}
      className={cn("object-cover", className)}
      fill
      priority={priority}
      sizes="(min-width: 1280px) 42vw, (min-width: 768px) 50vw, 100vw"
      src={asset.url}
      style={{ objectPosition: asset.position ?? "center" }}
    />
  );
}

function serviceImage(service: Service) {
  if (service.image) {
    return service.image;
  }

  if (service.category === "Nails") {
    return imageAssets.nails;
  }

  if (service.category === "Make-Up" || service.category === "Bridal & Events") {
    return imageAssets.makeupArtist;
  }

  if (service.category === "Lashes / Brows") {
    return imageAssets.lashesTools;
  }

  if (service.category === "Short Hair & Shave") {
    return imageAssets.barber;
  }

  if (service.category === "Care / Skin") {
    return imageAssets.skincareHands;
  }

  if (service.category === "Self-Care / Beauty") {
    return imageAssets.spaCare;
  }

  return imageAssets.braidsPortrait;
}

function portfolioImage(title: string) {
  const lower = title.toLowerCase();

  if (lower.includes("nail") || lower.includes("chrome") || lower.includes("gel") || lower.includes("pedicure")) {
    return imageAssets.nails;
  }

  if (lower.includes("lash") || lower.includes("brow")) {
    return imageAssets.lashesTools;
  }

  if (lower.includes("fade") || lower.includes("beard") || lower.includes("groom") || lower.includes("low cut") || lower.includes("undercut")) {
    return imageAssets.beardCare;
  }

  if (lower.includes("spa") || lower.includes("massage") || lower.includes("polish") || lower.includes("facial")) {
    return imageAssets.spaCare;
  }

  if (lower.includes("bride") || lower.includes("glam") || lower.includes("makeup") || lower.includes("ceremony")) {
    return imageAssets.makeupArtist;
  }

  if (lower.includes("loc") || lower.includes("twist") || lower.includes("wash") || lower.includes("silk")) {
    return imageAssets.naturalHair;
  }

  return imageAssets.braidsPortrait;
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

export function SecureContactCard({
  name,
  bookingHref,
  confirmed = false,
}: {
  name: string;
  bookingHref: string;
  confirmed?: boolean;
}) {
  return (
    <article className="beauty-card rounded-[32px] p-5">
      <div className="flex items-start gap-3">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[var(--ms-petal)] text-[var(--ms-rose)]">
          <EyeOff className="h-5 w-5" />
        </span>
        <div>
          <p className="text-xs uppercase tracking-[0.22em] text-[var(--ms-mauve)]">Private contact</p>
          <h3 className="mt-2 text-2xl font-semibold text-[var(--ms-plum)]">
            Contact unlocks after a confirmed paid booking.
          </h3>
          <p className="mt-2 text-sm leading-7 text-[var(--ms-mauve)]">
            Before payment, Mobile Salon keeps phone details protected. You can request a call, send a secure message, or use support without exposing either side too early.
          </p>
        </div>
      </div>
      <div className="mt-5 grid gap-3">
        <CTAButton href={bookingHref}>
          <PhoneCall className="h-4 w-4" />
          Request call safely
        </CTAButton>
        <CTAButton href={bookingHref} variant="outline">
          <MessageCircleMore className="h-4 w-4" />
          Send secure request
        </CTAButton>
        {confirmed ? (
          <div className="rounded-[24px] bg-[var(--ms-soft-bg)] p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-[var(--ms-mauve)]">Confirmed booking</p>
            <p className="mt-2 text-sm text-[var(--ms-charcoal)]">
              Direct communication with {name} is available for this appointment.
            </p>
          </div>
        ) : (
          <WhatsAppButton label={`${name} secure contact support`} />
        )}
      </div>
    </article>
  );
}

export function SalonCard({ salon }: { salon: Salon }) {
  return (
    <motion.article
      className="beauty-card min-w-0 max-w-full rounded-[32px] p-4 sm:p-5"
      whileHover={{ y: -4 }}
      transition={{ duration: 0.22 }}
    >
      <div
        className={cn(
          "relative mb-5 min-h-[230px] overflow-hidden rounded-[28px] bg-gradient-to-br px-5 py-6 text-white sm:min-h-[270px]",
          salon.heroMood,
        )}
      >
        <ImageLayer asset={salon.image} priority />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(13,27,42,0.14)_0%,rgba(13,27,42,0.56)_48%,rgba(13,27,42,0.92)_100%)]" />
        <div className="absolute inset-x-0 bottom-0 z-10 flex min-w-0 flex-col gap-3 p-4 sm:gap-4 sm:p-5">
          <div className="flex flex-wrap items-center gap-2">
            {salon.verified ? <VerifiedBadge /> : null}
            <span className="rounded-full bg-white/16 px-3 py-1 text-xs font-medium">{salon.location}</span>
          </div>
          <div className="min-w-0">
            <p className="break-words font-display text-2xl leading-tight sm:text-3xl">{salon.name}</p>
            <p className="mt-2 max-w-lg break-words text-sm text-white/82">{salon.tagline}</p>
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
      <div className="space-y-4">
        <div className="grid min-w-0 gap-3 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-start">
          <div className="min-w-0 space-y-2">
            <p className="flex min-w-0 items-start gap-2 break-words text-sm text-[var(--ms-mauve)]">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
              {salon.areasServed.join(" · ")}
            </p>
            <p className="flex min-w-0 items-center gap-2 break-words text-sm text-[var(--ms-mauve)]">
              <Star className="h-4 w-4 shrink-0 fill-[var(--ms-gold)] text-[var(--ms-gold)]" />
              {salon.rating} ({salon.reviewCount} reviews)
            </p>
          </div>
          <div className="w-full rounded-[22px] bg-[var(--ms-soft-bg)] px-4 py-3 text-left sm:w-auto sm:text-right">
            <p className="text-xs uppercase tracking-[0.2em] text-[var(--ms-mauve)]">From</p>
            <p className="text-lg font-semibold text-[var(--ms-navy)]">{formatKES(salon.startingPrice)}</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {getServicesByIds(salon.topServiceIds.slice(0, 3)).map((service) => (
            <span
              className="rounded-full bg-[var(--ms-soft-bg)] px-3 py-1 text-xs font-medium text-[var(--ms-mauve)]"
              key={service.id}
            >
              {service.name}
            </span>
          ))}
        </div>
        <div className="grid gap-2 sm:grid-cols-2">
          <MetaPill icon={<Clock3 className="h-4 w-4" />} label={`Replies in ~${salon.responseSpeedMinutes} min`} />
          <MetaPill icon={<CheckCircle2 className="h-4 w-4" />} label={`${salon.completionRate}% completion`} />
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
      className="beauty-card rounded-[32px] p-5"
      whileHover={{ y: -4 }}
      transition={{ duration: 0.22 }}
    >
      <div className={cn("relative mb-5 min-h-[250px] overflow-hidden rounded-[28px] bg-gradient-to-br px-5 py-6 text-white", professional.heroMood)}>
        <ImageLayer asset={professional.image} />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(13,27,42,0.1)_0%,rgba(13,27,42,0.55)_52%,rgba(13,27,42,0.9)_100%)]" />
        <div className="absolute inset-x-0 bottom-0 z-10 flex items-start justify-between gap-4 p-5">
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
        <div className="flex flex-wrap gap-2">
          {professional.identityAttributes.map((attribute) => (
            <span
              className="rounded-full bg-[var(--ms-petal)] px-3 py-1 text-xs font-semibold text-[var(--ms-plum)]"
              key={attribute}
            >
              {attribute}
            </span>
          ))}
        </div>
        <div className="rounded-[24px] bg-[var(--ms-soft-bg)] px-4 py-3">
          <p className="text-xs uppercase tracking-[0.2em] text-[var(--ms-mauve)]">Starts at</p>
          <p className="mt-1 text-lg font-semibold text-[var(--ms-navy)]">{formatKES(professional.startingPrice)}</p>
          <p className="mt-1 text-xs text-[var(--ms-mauve)]">
            Replies in ~{professional.responseSpeedMinutes} min · {professional.completionRate}% completion
          </p>
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
    <div className="flex min-w-0 items-start gap-2 rounded-full bg-[var(--ms-soft-bg)] px-3 py-2 text-sm text-[var(--ms-mauve)]">
      <span className="mt-0.5 shrink-0">{icon}</span>
      <span className="min-w-0 break-words">{label}</span>
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
  const visual = serviceImage(service);

  return (
    <article className="beauty-card overflow-hidden rounded-[28px]">
      <div className="relative min-h-[150px] p-5 text-white">
        <ImageLayer asset={visual} />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(13,27,42,0.12)_0%,rgba(13,27,42,0.72)_70%,rgba(13,27,42,0.92)_100%)]" />
        <div className="relative z-10 flex items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-white/72">{service.category}</p>
            <h3 className="mt-2 text-xl font-semibold text-white">{service.name}</h3>
          </div>
          {service.popular ? (
            <span className="rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-[var(--ms-navy)]">
              Popular
            </span>
          ) : null}
        </div>
      </div>
      <div className="p-5">
        <p className="text-sm leading-6 text-[var(--ms-charcoal)]">{service.description}</p>
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
      </div>
    </article>
  );
}

export function PackageCard({ offer }: { offer: PackageOffer }) {
  return (
    <article className="decorative-orbit min-h-[310px] overflow-hidden rounded-[32px] bg-[linear-gradient(145deg,var(--ms-plum),#512547_54%,var(--ms-navy))] p-5 text-white shadow-[0_22px_60px_rgba(13,27,42,0.18)]">
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs uppercase tracking-[0.22em] text-white/65">{offer.badge}</p>
        {offer.trending ? (
          <span className="rounded-full bg-white/14 px-3 py-1 text-xs font-semibold text-[var(--ms-blush)]">
            Trending
          </span>
        ) : null}
      </div>
      <h3 className="mt-3 font-display text-3xl leading-tight">{offer.name}</h3>
      <p className="mt-3 text-sm leading-6 text-white/78">{offer.description}</p>
      {offer.bestFor ? (
        <p className="mt-3 rounded-[20px] bg-white/10 px-4 py-3 text-sm leading-6 text-white/76">
          Best for: {offer.bestFor}
        </p>
      ) : null}
      {offer.includedServices?.length ? (
        <div className="mt-4 flex flex-wrap gap-2">
          {offer.includedServices.slice(0, 4).map((service) => (
            <span className="rounded-full border border-white/18 px-3 py-1 text-xs text-white/78" key={service}>
              {service}
            </span>
          ))}
        </div>
      ) : null}
      <div className="mt-5 flex items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-white/60">Starts from</p>
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
    <article className="beauty-card rounded-[28px] p-5">
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
    <div
      className="grid min-w-0 gap-1.5 sm:gap-2"
      style={{ gridTemplateColumns: "repeat(5, minmax(0, 1fr))" }}
    >
      {steps.map((label, index) => {
        const itemStep = index + 1;
        const active = itemStep <= step;

        return (
          <div className="min-w-0 space-y-2" key={label}>
            <div className={cn("h-1.5 rounded-full", active ? "bg-[var(--ms-magenta)]" : "bg-[var(--ms-border)]")} />
            <p className={cn("truncate text-[10px] sm:text-xs", active ? "text-[var(--ms-navy)]" : "text-[var(--ms-mauve)]")}>{label}</p>
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
        "min-w-[88px] rounded-[22px] border px-4 py-3 text-left transition active:scale-[0.98]",
        selected
          ? "border-[var(--ms-gold)] bg-[var(--ms-gold)] text-[var(--ms-navy)]"
          : "border-[var(--ms-border)] bg-white text-[var(--ms-mauve)] hover:border-[var(--ms-rose)]/40 hover:text-[var(--ms-plum)]",
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
        "rounded-full border px-4 py-2 text-sm font-medium transition active:scale-[0.98]",
        selected
          ? "border-[var(--ms-magenta)] bg-[var(--ms-magenta)] text-white"
          : "border-[var(--ms-border)] bg-white text-[var(--ms-mauve)] hover:border-[var(--ms-rose)]/40 hover:text-[var(--ms-plum)]",
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
      className="flex w-full items-center justify-between gap-4 rounded-[24px] border border-[var(--ms-border)] bg-white px-4 py-4 text-left transition hover:border-[var(--ms-rose)]/30 hover:shadow-[0_14px_34px_rgba(132,36,92,0.09)] active:scale-[0.99]"
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
  items: PortfolioItem[];
  dark?: boolean;
}) {
  return (
    <div className="scroll-row sm:grid sm:grid-flow-row sm:grid-cols-2 xl:grid-cols-4">
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
          <div className={cn("relative h-40 overflow-hidden rounded-[22px] bg-gradient-to-br", item.tint)}>
            <ImageLayer asset={item.image ?? portfolioImage(item.title)} />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(13,27,42,0.02),rgba(13,27,42,0.34))]" />
          </div>
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
      <div className="silk-panel rounded-[32px] p-6">
        <p className="text-xs uppercase tracking-[0.24em] text-[var(--ms-mauve)]">{eyebrow}</p>
        <h1 className="mt-3 text-3xl font-semibold text-[var(--ms-plum)]">{title}</h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-[var(--ms-mauve)]">{description}</p>
        <div className="mt-6">{children}</div>
      </div>
      <div className="rounded-[32px] bg-[linear-gradient(160deg,var(--ms-plum)_0%,#68235c_52%,rgba(232,62,140,0.52)_100%)] p-6 text-white shadow-[0_22px_60px_rgba(132,36,92,0.18)]">
        <p className="text-xs uppercase tracking-[0.24em] text-white/62">Why Mobile Salon</p>
        <h2 className="mt-3 font-display text-4xl leading-tight">Saved choices. Softer booking.</h2>
        <p className="mt-4 text-sm leading-7 text-white/76">
          Your selected service stays ready while your account keeps bookings, reminders, and favourites together.
        </p>
        <div className="mt-6 space-y-3">
          <InfoBullet text="Visible prices, timings, and availability before confirmation" />
          <InfoBullet text="Professional onboarding, portfolio setup, and service management" />
          <InfoBullet text="WhatsApp support without breaking the protected booking flow" />
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
