"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Briefcase,
  Camera,
  Check,
  ChevronRight,
  Clock,
  Crown,
  ImagePlus,
  MapPin,
  Scissors,
  ShieldCheck,
  Star,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ── Types ───────────────────────────────────────────────────────────────────

type ProfileTab =
  | "identity"
  | "services"
  | "availability"
  | "verification"
  | "publish";

const TABS: { key: ProfileTab; label: string; icon: React.ElementType }[] = [
  { key: "identity", label: "Identity", icon: Crown },
  { key: "services", label: "Services", icon: Scissors },
  { key: "availability", label: "Availability", icon: Clock },
  { key: "verification", label: "Verification", icon: ShieldCheck },
  { key: "publish", label: "Publish", icon: Star },
];

const SERVICES_LIST = [
  "Natural hair care", "Protective styles", "Braids", "Locs",
  "Weaves", "Balayage", "Highlights", "Blow dry",
  "Manicure", "Pedicure", "Gel nails", "Make-up",
  "Skincare", "Facial", "Waxing", "Massage",
  "Threading", "Lashes",
];

const WORK_STYLES = [
  { key: "mobile", label: "Mobile (I go to clients)", icon: MapPin },
  { key: "studio", label: "In-salon (clients come to me)", icon: Briefcase },
  { key: "both", label: "Both", icon: Scissors },
];

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

// ── Atoms ────────────────────────────────────────────────────────────────────

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
  const [workStyle, setWorkStyle] = useState("both");

  return (
    <div className="space-y-4">
      {/* Photo */}
      <div className="flex items-center gap-4 rounded-[20px] border border-dashed border-[var(--ms-border)] bg-white p-5">
        <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-[var(--ms-soft-bg)]">
          <Camera className="h-8 w-8 text-[var(--ms-mauve)]" />
        </div>
        <div>
          <p className="text-sm font-semibold text-[var(--ms-charcoal)]">Profile photo</p>
          <p className="mt-1 text-xs text-[var(--ms-mauve)]">
            A clear, professional photo builds trust. Use a real photo of yourself.
          </p>
          <button className="mt-2 rounded-full border border-[var(--ms-border)] px-3 py-1.5 text-xs font-semibold text-[#C8284A] transition hover:bg-[var(--ms-soft-bg)]">
            Upload photo
          </button>
        </div>
      </div>

      <Field label="Display name" placeholder="Name clients will see (e.g. Njeri K.)" />
      <Field label="Specialty" placeholder="e.g. Protective styling, Natural hair care" />
      <Field label="Phone number" type="tel" placeholder="+254 7XX XXX XXX" />
      <Field label="Email (optional)" type="email" />
      <Field label="Neighbourhood" placeholder="e.g. Kilimani" />
      <Textarea
        label="Your story"
        placeholder="Tell clients about your skills, approach, and experience..."
        rows={4}
      />

      {/* Work style */}
      <div className="rounded-[20px] border border-[var(--ms-border)] bg-white p-4">
        <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--ms-mauve)]">
          How do you work?
        </p>
        <div className="space-y-2">
          {WORK_STYLES.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              type="button"
              onClick={() => setWorkStyle(key)}
              className={cn(
                "flex w-full items-center gap-3 rounded-[14px] border px-4 py-3 text-sm font-medium transition-all text-left",
                workStyle === key
                  ? "border-[#C8284A] bg-[#C8284A]/5 text-[#C8284A]"
                  : "border-[var(--ms-border)] text-[var(--ms-charcoal)] hover:border-[#C8284A]/30",
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {label}
              {workStyle === key && <Check className="ml-auto h-4 w-4" />}
            </button>
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
        Select all services you offer. You can add custom services and prices from your dashboard.
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
                  ? "border-[#C8284A] bg-[#C8284A] text-white"
                  : "border-[var(--ms-border)] bg-white text-[var(--ms-charcoal)] hover:border-[#C8284A]/40",
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

function AvailabilityTab() {
  const [openDays, setOpenDays] = useState<string[]>(["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]);

  function toggleDay(day: string) {
    setOpenDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day],
    );
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-[var(--ms-mauve)]">
        Set which days you work. Clients will only see bookings for your available days.
      </p>

      {/* Day toggles */}
      <div className="rounded-[20px] border border-[var(--ms-border)] bg-white p-4">
        <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--ms-mauve)]">
          Working days
        </p>
        <div className="flex flex-wrap gap-2">
          {DAYS.map((day) => {
            const on = openDays.includes(day);
            return (
              <button
                key={day}
                type="button"
                onClick={() => toggleDay(day)}
                className={cn(
                  "rounded-full px-4 py-2 text-xs font-semibold transition-all",
                  on
                    ? "bg-[#C8284A] text-white"
                    : "border border-[var(--ms-border)] bg-white text-[var(--ms-mauve)]",
                )}
              >
                {day}
              </button>
            );
          })}
        </div>
      </div>

      <Field label="Typical start time" placeholder="e.g. 8:00 AM" />
      <Field label="Typical end time" placeholder="e.g. 6:00 PM" />

      <p className="text-xs text-[var(--ms-mauve)] px-1">
        You can set specific time slots and block dates from your dashboard after publishing.
      </p>
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
            <p className="text-sm font-semibold text-amber-900">Get your Verified badge</p>
            <p className="mt-1 text-xs text-amber-700">
              Verified professionals get a badge on their profile and rank higher in search.
              We verify your identity with a national ID.
            </p>
          </div>
        </div>
      </div>

      <Field label="Full legal name" placeholder="As it appears on your ID" />
      <Field label="ID number" placeholder="National ID / Passport number" />

      <div className="rounded-[20px] border border-dashed border-[var(--ms-border)] bg-white p-5 text-center">
        <ImagePlus className="mx-auto h-8 w-8 text-[var(--ms-mauve)] opacity-50" />
        <p className="mt-2 text-sm font-semibold text-[var(--ms-charcoal)]">Upload ID photo</p>
        <p className="mt-1 text-xs text-[var(--ms-mauve)]">JPEG or PNG · Max 5 MB · Front side</p>
        <button className="mt-3 rounded-full border border-[var(--ms-border)] px-4 py-2 text-xs font-semibold text-[#C8284A] transition hover:bg-[var(--ms-soft-bg)]">
          Choose file
        </button>
      </div>

      <p className="text-center text-xs text-[var(--ms-mauve)]">
        Verification is optional at signup. Submit later from your dashboard settings.
      </p>
    </div>
  );
}

function PublishTab() {
  return (
    <div className="space-y-4">
      <div className="rounded-[20px] border border-[var(--ms-border)] bg-white p-5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#C8284A]/10">
            <Star className="h-5 w-5 text-[#C8284A]" />
          </div>
          <div>
            <p className="text-sm font-semibold text-[var(--ms-charcoal)]">Ready to get discovered</p>
            <p className="text-xs text-[var(--ms-mauve)]">Review your details before going live</p>
          </div>
        </div>

        <ul className="mt-4 space-y-2">
          {[
            "Profile photo and display name",
            "Specialty and bio",
            "Services offered",
            "Working days and hours",
          ].map((item) => (
            <li key={item} className="flex items-center gap-2 text-xs text-[var(--ms-charcoal)]">
              <Check className="h-4 w-4 text-emerald-500" />
              {item}
            </li>
          ))}
        </ul>
      </div>

      <div className="rounded-[20px] border border-[var(--ms-border)] bg-[var(--ms-soft-bg)] p-4 text-xs leading-5 text-[var(--ms-mauve)]">
        Once published, your profile will appear to clients searching for professionals on Mobile Salon.
        You can pause or unpublish from your dashboard at any time.
      </div>

      <Link
        href="/pro/dashboard"
        className="flex min-h-12 w-full items-center justify-center gap-2 rounded-[18px] text-sm font-semibold text-white transition hover:brightness-110"
        style={{ backgroundColor: "#C8284A" }}
      >
        Publish my profile
        <ChevronRight className="h-4 w-4" />
      </Link>

      <Link
        href="/pro/dashboard"
        className="block text-center text-xs text-[var(--ms-mauve)] hover:underline"
      >
        Save as draft and finish later
      </Link>
    </div>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────────

export default function ProfessionalProfilePage() {
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
            className="h-1 transition-all duration-500"
            style={{
              width: `${((currentIndex + 1) / TABS.length) * 100}%`,
              backgroundColor: "#C8284A",
            }}
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
                    ? "text-white shadow-md"
                    : done
                      ? "text-[#C8284A]"
                      : "bg-white text-[var(--ms-mauve)]",
                )}
                style={
                  cur
                    ? { backgroundColor: "#C8284A" }
                    : done
                      ? { backgroundColor: "rgba(200,40,74,0.10)" }
                      : {}
                }
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
        {active === "services" && <ServicesTab />}
        {active === "availability" && <AvailabilityTab />}
        {active === "verification" && <VerificationTab />}
        {active === "publish" && <PublishTab />}

        {/* Next button */}
        {active !== "publish" && (
          <button
            type="button"
            onClick={next}
            className="mt-8 flex min-h-12 w-full items-center justify-center gap-2 rounded-[18px] text-sm font-semibold text-white transition hover:brightness-110"
            style={{ backgroundColor: "#C8284A" }}
          >
            Continue
            <ChevronRight className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
}
