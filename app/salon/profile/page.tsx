"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Building2,
  Check,
  ChevronRight,
  Clock,
  Globe,
  ImagePlus,
  MapPin,
  Phone,
  Scissors,
  ShieldCheck,
  Star,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ImageUploadEditor } from "@/components/image-upload-editor";

// ── Types ───────────────────────────────────────────────────────────────────

type ProfileTab =
  | "identity"
  | "location"
  | "services"
  | "team"
  | "verification"
  | "publish";

const TABS: { key: ProfileTab; label: string; icon: React.ElementType }[] = [
  { key: "identity", label: "Identity", icon: Building2 },
  { key: "location", label: "Location & Hours", icon: MapPin },
  { key: "services", label: "Services", icon: Scissors },
  { key: "team", label: "Team", icon: Users },
  { key: "verification", label: "Verification", icon: ShieldCheck },
  { key: "publish", label: "Publish", icon: Star },
];

const SERVICES_LIST = [
  "Hair styling", "Blow dry", "Balayage", "Highlights", "Braids",
  "Locs", "Weaves", "Manicure", "Pedicure", "Gel nails",
  "Make-up", "Skincare", "Facial", "Waxing", "Massage",
  "Threading", "Lashes", "Deep conditioning",
];

const HOURS = ["Closed", "8:00 AM", "9:00 AM", "10:00 AM", "12:00 PM", "6:00 PM", "7:00 PM", "8:00 PM"];
const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

// ── Field atoms ──────────────────────────────────────────────────────────────

function Field({
  label,
  type = "text",
  placeholder,
  hint,
}: {
  label: string;
  type?: string;
  placeholder?: string;
  hint?: string;
}) {
  return (
    <div>
      <label className="block rounded-[20px] border border-[var(--ms-border)] bg-white px-4 py-3.5">
        <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--ms-mauve)]">
          {label}
        </span>
        <input
          className="mt-2 w-full bg-transparent text-sm text-[var(--ms-charcoal)] outline-none placeholder:text-[var(--ms-border)]"
          placeholder={placeholder ?? label}
          type={type}
        />
      </label>
      {hint && <p className="mt-1.5 px-1 text-[11px] text-[var(--ms-mauve)]">{hint}</p>}
    </div>
  );
}

function Textarea({
  label,
  placeholder,
  rows = 3,
}: {
  label: string;
  placeholder?: string;
  rows?: number;
}) {
  return (
    <label className="block rounded-[20px] border border-[var(--ms-border)] bg-white px-4 py-3.5">
      <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--ms-mauve)]">
        {label}
      </span>
      <textarea
        className="mt-2 w-full resize-none bg-transparent text-sm text-[var(--ms-charcoal)] outline-none placeholder:text-[var(--ms-border)]"
        placeholder={placeholder ?? label}
        rows={rows}
      />
    </label>
  );
}

// ── Tab panels ───────────────────────────────────────────────────────────────

function IdentityTab() {
  const [coverPhoto, setCoverPhoto] = useState<string | undefined>();

  return (
    <div className="space-y-4">
      {/* Cover photo — ImageUploadEditor */}
      <ImageUploadEditor
        label="Salon cover photo"
        requirements="JPG or PNG · min 800 × 600 px · max 5 MB"
        aspectHint="Landscape 4:3 or 16:9 recommended"
        maxMB={5}
        value={coverPhoto}
        onSave={setCoverPhoto}
      />

      <Field label="Salon name" placeholder="e.g. Kilimani Texture House" />
      <Field label="Contact name" placeholder="Your name or manager's name" />
      <Field label="Phone number" type="tel" placeholder="+254 7XX XXX XXX" />
      <Field label="Email (optional)" type="email" placeholder="hello@yoursalon.ke" />
      <Textarea
        label="About your salon"
        placeholder="Describe your salon's vibe, specialties, and what makes you stand out..."
        rows={4}
      />
    </div>
  );
}

function LocationTab() {
  return (
    <div className="space-y-4">
      <Field label="Street address" placeholder="Building name, floor, road" />
      <Field label="Neighbourhood" placeholder="e.g. Kilimani, Westlands" />
      <Field label="County" placeholder="e.g. Nairobi" />

      {/* Hours */}
      <div className="rounded-[20px] border border-[var(--ms-border)] bg-white p-4">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--ms-mauve)] mb-3">
          Opening hours
        </p>
        <div className="space-y-2">
          {DAYS.map((day) => (
            <div key={day} className="flex items-center gap-3">
              <span className="w-8 text-xs font-semibold text-[var(--ms-charcoal)]">{day}</span>
              <select className="flex-1 rounded-xl border border-[var(--ms-border)] bg-[var(--ms-soft-bg)] px-2 py-1.5 text-xs text-[var(--ms-charcoal)]">
                {HOURS.map((h) => <option key={h}>{h}</option>)}
              </select>
              <span className="text-xs text-[var(--ms-mauve)]">to</span>
              <select className="flex-1 rounded-xl border border-[var(--ms-border)] bg-[var(--ms-soft-bg)] px-2 py-1.5 text-xs text-[var(--ms-charcoal)]">
                {HOURS.map((h) => <option key={h}>{h}</option>)}
              </select>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ServicesTab() {
  const [selected, setSelected] = useState<string[]>([]);

  function toggle(s: string) {
    setSelected((prev) =>
      prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s],
    );
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-[var(--ms-mauve)]">
        Select all services your salon offers. You can set individual prices after publishing.
      </p>
      <div className="flex flex-wrap gap-2">
        {SERVICES_LIST.map((s) => {
          const on = selected.includes(s);
          return (
            <button
              key={s}
              type="button"
              onClick={() => toggle(s)}
              className={cn(
                "rounded-full border px-3 py-1.5 text-xs font-medium transition-all",
                on
                  ? "border-[var(--ms-plum)] bg-[var(--ms-plum)] text-white"
                  : "border-[var(--ms-border)] bg-white text-[var(--ms-charcoal)] hover:border-[var(--ms-plum)]/40",
              )}
            >
              {on && <Check className="mr-1 inline h-3 w-3" />}
              {s}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function TeamTab() {
  return (
    <div className="space-y-4">
      <p className="text-sm text-[var(--ms-mauve)]">
        Add your team members so clients can book their preferred stylist.
      </p>
      <div className="rounded-[20px] border border-dashed border-[var(--ms-border)] bg-white p-6 text-center">
        <Users className="mx-auto h-8 w-8 text-[var(--ms-mauve)] opacity-50" />
        <p className="mt-3 text-sm font-semibold text-[var(--ms-charcoal)]">No team members yet</p>
        <p className="mt-1 text-xs text-[var(--ms-mauve)]">
          Add yourself or your team to let clients pick who they want.
        </p>
        <button className="mt-4 rounded-full bg-[var(--ms-plum)] px-5 py-2 text-sm font-semibold text-white transition hover:brightness-110">
          + Add team member
        </button>
      </div>
    </div>
  );
}

function VerificationTab() {
  return (
    <div className="space-y-4">
      <div className="rounded-[20px] border border-amber-200 bg-amber-50 p-4">
        <div className="flex items-start gap-3">
          <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
          <div>
            <p className="text-sm font-semibold text-amber-900">Verification builds trust</p>
            <p className="mt-1 text-xs text-amber-700">
              Verified salons get a badge, appear higher in search, and attract more bookings.
              We verify your business registration or physical location.
            </p>
          </div>
        </div>
      </div>

      <Field label="Business registration number (optional)" placeholder="e.g. KE/BUS/XXXXXX" />
      <Field label="Physical address for verification" placeholder="Full address inspectors can visit" />

      <div className="rounded-[20px] border border-dashed border-[var(--ms-border)] bg-white p-5 text-center">
        <ImagePlus className="mx-auto h-8 w-8 text-[var(--ms-mauve)] opacity-50" />
        <p className="mt-2 text-sm font-semibold text-[var(--ms-charcoal)]">Upload ID or business certificate</p>
        <p className="mt-1 text-xs text-[var(--ms-mauve)]">JPEG or PDF · Max 5 MB</p>
        <button className="mt-3 rounded-full border border-[var(--ms-border)] px-4 py-2 text-xs font-semibold text-[var(--ms-plum)] transition hover:bg-[var(--ms-soft-bg)]">
          Choose file
        </button>
      </div>

      <p className="text-center text-xs text-[var(--ms-mauve)]">
        Verification is optional at signup. You can submit documents later from your dashboard.
      </p>
    </div>
  );
}

function PublishTab() {
  return (
    <div className="space-y-4">
      <div className="rounded-[20px] border border-[var(--ms-border)] bg-white p-5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--ms-plum)]/10">
            <Star className="h-5 w-5 text-[var(--ms-plum)]" />
          </div>
          <div>
            <p className="text-sm font-semibold text-[var(--ms-charcoal)]">Almost ready to go live</p>
            <p className="text-xs text-[var(--ms-mauve)]">Review your details before publishing</p>
          </div>
        </div>

        <ul className="mt-4 space-y-2">
          {[
            "Salon name and contact info",
            "Location and opening hours",
            "Services offered",
            "Team members (optional)",
          ].map((item) => (
            <li key={item} className="flex items-center gap-2 text-xs text-[var(--ms-charcoal)]">
              <Check className="h-4 w-4 text-emerald-500" />
              {item}
            </li>
          ))}
        </ul>
      </div>

      <div className="rounded-[20px] border border-[var(--ms-border)] bg-[var(--ms-soft-bg)] p-4 text-xs leading-5 text-[var(--ms-mauve)]">
        By publishing, your salon page will be visible to clients searching on Mobile Salon.
        You can unpublish at any time from your dashboard settings.
      </div>

      <Link
        href="/salon/dashboard"
        className="flex min-h-12 w-full items-center justify-center gap-2 rounded-[18px] bg-[var(--ms-plum)] text-sm font-semibold text-white transition hover:brightness-110"
      >
        Publish my salon
        <ChevronRight className="h-4 w-4" />
      </Link>

      <Link
        href="/salon/dashboard"
        className="block text-center text-xs text-[var(--ms-mauve)] hover:underline"
      >
        Save as draft and finish later
      </Link>
    </div>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────────

export default function SalonProfilePage() {
  const [active, setActive] = useState<ProfileTab>("identity");
  const currentIndex = TABS.findIndex((t) => t.key === active);

  function next() {
    const nextTab = TABS[currentIndex + 1];
    if (nextTab) setActive(nextTab.key);
  }

  return (
    <div className="flex min-h-dvh flex-col bg-[var(--ms-soft-bg)]">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-[var(--ms-border)] bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-2xl items-center justify-between px-4 py-3">
          <Link
            href="/"
            className="text-lg font-extrabold tracking-tight text-[var(--ms-plum)]"
          >
            <span
              className="mr-2 inline-flex h-7 w-7 items-center justify-center rounded-full text-white text-xs font-black"
              style={{ background: "linear-gradient(135deg,#C8284A,#3A183A)" }}
            >
              MS
            </span>
            Mobile Salon
          </Link>
          <span className="text-xs text-[var(--ms-mauve)]">
            Step {currentIndex + 1} of {TABS.length}
          </span>
        </div>

        {/* Progress bar */}
        <div className="h-1 bg-[var(--ms-soft-bg)]">
          <div
            className="h-1 bg-[var(--ms-plum)] transition-all duration-500"
            style={{ width: `${((currentIndex + 1) / TABS.length) * 100}%` }}
          />
        </div>
      </header>

      <div className="mx-auto w-full max-w-2xl flex-1 px-4 py-6">
        {/* Section nav pills */}
        <div className="mb-6 flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {TABS.map((tab, i) => {
            const Icon = tab.icon;
            const done = i < currentIndex;
            const cur = i === currentIndex;
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActive(tab.key)}
                className={cn(
                  "flex shrink-0 items-center gap-1.5 rounded-full px-3 py-2 text-xs font-semibold transition-all",
                  cur
                    ? "bg-[var(--ms-plum)] text-white shadow-md"
                    : done
                      ? "bg-[var(--ms-plum)]/10 text-[var(--ms-plum)]"
                      : "bg-white text-[var(--ms-mauve)]",
                )}
              >
                {done ? <Check className="h-3 w-3" /> : <Icon className="h-3 w-3" />}
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Section title */}
        <h1 className="mb-5 text-xl font-bold text-[var(--ms-charcoal)]">
          {TABS[currentIndex].label}
        </h1>

        {/* Panel */}
        {active === "identity" && <IdentityTab />}
        {active === "location" && <LocationTab />}
        {active === "services" && <ServicesTab />}
        {active === "team" && <TeamTab />}
        {active === "verification" && <VerificationTab />}
        {active === "publish" && <PublishTab />}

        {/* Next button (except publish tab) */}
        {active !== "publish" && (
          <button
            type="button"
            onClick={next}
            className="mt-8 flex min-h-12 w-full items-center justify-center gap-2 rounded-[18px] bg-[var(--ms-plum)] text-sm font-semibold text-white transition hover:brightness-110"
          >
            Continue
            <ChevronRight className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
}
