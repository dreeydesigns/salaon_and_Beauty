"use client";

import { useState } from "react";
import Link from "next/link";
import {
  BarChart2,
  Banknote,
  CalendarDays,
  Camera,
  Check,
  CheckCircle2,
  Clock,
  Eye,
  Home,
  ImagePlus,
  LogOut,
  MapPin,
  Pencil,
  Plus,
  Settings,
  ShieldCheck,
  Star,
  ToggleLeft,
  ToggleRight,
  UserRound,
} from "lucide-react";

import { cn } from "@/lib/utils";

// ── Mock data ──────────────────────────────────────────────────────────────

const TODAY_SCHEDULE = [
  { id: 1, time: "10:00 AM", service: "Braiding", client: "Amina", status: "confirmed" },
  { id: 2, time: "1:00 PM", service: "Natural Hair Styling", client: "Grace", status: "confirmed" },
  { id: 3, time: "3:30 PM", service: "Locs Retouch", client: "Wanjiru", status: "in-progress" },
];

const INCOMING = [
  { id: 4, time: "Tomorrow, 9:00 AM", client: "Fatuma", service: "Bridal Trial", total: "Ksh 3,200" },
  { id: 5, time: "Sat, 11:00 AM", client: "Keiko", service: "Big Chop + Style", total: "Ksh 1,500" },
];

const UPCOMING = [
  { id: 6, time: "Fri, 2:00 PM", client: "Sasha", service: "Box Braids", total: "Ksh 2,800" },
  { id: 7, time: "Sat, 10:00 AM", client: "Lila", service: "Protective Style", total: "Ksh 2,200" },
];

const PAST = [
  { id: 8, date: "Mon", client: "Aisha", service: "Locs Starter", total: "Ksh 2,400", status: "completed" },
  { id: 9, date: "Tue", client: "Nour", service: "Braiding", total: "Ksh 1,800", status: "completed" },
];

const PRO_SERVICES = [
  { id: "ps1", name: "Braiding (cornrows, box braids)", price: "Ksh 1,800", duration: "3h", products: "Shea Moisture Curl Enhancer", active: true },
  { id: "ps2", name: "Locs Starter", price: "Ksh 2,400", duration: "4h", products: "Creme of Nature Argan Oil", active: true },
  { id: "ps3", name: "Natural Hair Styling", price: "Ksh 1,200", duration: "1h 30min", products: "Cantu Leave-in Conditioner", active: true },
  { id: "ps4", name: "Big Chop + Style", price: "Ksh 1,500", duration: "1h", products: "None", active: false },
];

type Tab = "home" | "bookings" | "profile" | "earnings" | "settings";
type ProfileSection = "identity" | "services" | "portfolio" | "availability";

// ── Status pill ────────────────────────────────────────────────────────────

function StatusPill({ status }: { status: string }) {
  const map: Record<string, string> = {
    confirmed: "bg-emerald-100 text-emerald-700",
    pending: "bg-amber-100 text-amber-700",
    "in-progress": "bg-blue-100 text-blue-700",
    completed: "bg-slate-100 text-slate-600",
  };
  return (
    <span className={cn("rounded-full px-2.5 py-1 text-xs font-semibold capitalize", map[status] ?? "bg-slate-100 text-slate-600")}>
      {status.replace("-", " ")}
    </span>
  );
}

// ── Tab bar ────────────────────────────────────────────────────────────────

function TabBar({ active, onChange }: { active: Tab; onChange: (t: Tab) => void }) {
  const tabs: { key: Tab; label: string; icon: React.ReactNode }[] = [
    { key: "home", label: "Home", icon: <Home className="h-5 w-5" /> },
    { key: "bookings", label: "Bookings", icon: <CalendarDays className="h-5 w-5" /> },
    { key: "profile", label: "My Profile", icon: <UserRound className="h-5 w-5" /> },
    { key: "earnings", label: "Earnings", icon: <Banknote className="h-5 w-5" /> },
    { key: "settings", label: "Settings", icon: <Settings className="h-5 w-5" /> },
  ];

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden w-56 shrink-0 lg:block">
        <div className="sticky top-24 space-y-1 rounded-[24px] border border-[var(--ms-border)] bg-white p-3 shadow-[0_4px_16px_rgba(13,27,42,0.05)]">
          <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--ms-mauve)]">
            Pro Dashboard
          </p>
          {tabs.map((t) => (
            <button
              key={t.key}
              type="button"
              onClick={() => onChange(t.key)}
              className={cn(
                "flex w-full items-center gap-3 rounded-[14px] px-3 py-2.5 text-sm font-medium transition",
                active === t.key
                  ? "bg-[linear-gradient(135deg,var(--ms-rose),var(--ms-orchid))] text-white"
                  : "text-[var(--ms-navy)] hover:bg-[var(--ms-soft-bg)]",
              )}
            >
              {t.icon}
              {t.label}
            </button>
          ))}
        </div>
      </aside>

      {/* Mobile bottom bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 flex border-t border-[var(--ms-border)] bg-white lg:hidden">
        {tabs.map((t) => (
          <button
            key={t.key}
            type="button"
            onClick={() => onChange(t.key)}
            className={cn(
              "flex flex-1 flex-col items-center gap-1 py-3 text-[10px] font-semibold transition",
              active === t.key ? "text-[var(--ms-rose)]" : "text-[var(--ms-mauve)]",
            )}
          >
            {t.icon}
            {t.label}
          </button>
        ))}
      </nav>
    </>
  );
}

// ── Home tab ───────────────────────────────────────────────────────────────

function HomeTab() {
  const nudges = [
    { icon: <Camera className="h-4 w-4" />, label: "Add portfolio photos" },
    { icon: <ShieldCheck className="h-4 w-4" />, label: "Get verified" },
    { icon: <Clock className="h-4 w-4" />, label: "Set your availability" },
  ];

  return (
    <div className="space-y-6">
      {/* Profile nudge pills (NO progress bar — specific items only) */}
      <div className="flex flex-wrap gap-2">
        {nudges.map((n) => (
          <button
            key={n.label}
            type="button"
            className="flex items-center gap-2 rounded-full border border-[var(--ms-border)] bg-white px-4 py-2 text-xs font-medium text-[var(--ms-navy)] shadow-[0_2px_8px_rgba(13,27,42,0.05)] hover:border-[var(--ms-rose)] hover:text-[var(--ms-rose)]"
          >
            {n.icon}
            {n.label}
          </button>
        ))}
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Today", value: "3", icon: <CalendarDays className="h-5 w-5 text-[var(--ms-rose)]" /> },
          { label: "Rating", value: "4.9 ★", icon: <Star className="h-5 w-5 text-[var(--ms-gold)]" /> },
          { label: "Profile views", value: "87", icon: <Eye className="h-5 w-5 text-[var(--ms-teal)]" /> },
        ].map((s) => (
          <div key={s.label} className="rounded-[20px] border border-[var(--ms-border)] bg-white p-4 shadow-[0_2px_8px_rgba(13,27,42,0.04)]">
            <div className="mb-2">{s.icon}</div>
            <p className="text-2xl font-bold text-[var(--ms-navy)]">{s.value}</p>
            <p className="mt-0.5 text-xs text-[var(--ms-mauve)]">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Today's schedule (timeline) */}
      <div className="rounded-[24px] border border-[var(--ms-border)] bg-white p-5 shadow-[0_2px_8px_rgba(13,27,42,0.04)]">
        <h2 className="mb-4 text-base font-semibold text-[var(--ms-navy)]">Today's schedule</h2>
        <div className="space-y-3">
          {TODAY_SCHEDULE.map((b) => (
            <div key={b.id} className="flex items-start gap-3">
              <div className="flex flex-col items-center">
                <span className="w-16 text-xs font-semibold text-[var(--ms-mauve)]">{b.time}</span>
              </div>
              <div className="flex min-w-0 flex-1 items-center justify-between rounded-[14px] border border-[var(--ms-border)] bg-[var(--ms-soft-bg)] px-4 py-2.5">
                <div>
                  <p className="text-sm font-medium text-[var(--ms-navy)]">{b.service}</p>
                  <p className="text-xs text-[var(--ms-mauve)]">{b.client}</p>
                </div>
                <StatusPill status={b.status} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Bookings tab ───────────────────────────────────────────────────────────

function BookingsTab() {
  return (
    <div className="space-y-6">
      {/* Incoming */}
      <div className="rounded-[24px] border border-amber-200 bg-amber-50 p-5">
        <h2 className="mb-4 text-sm font-semibold text-amber-800">Incoming requests ({INCOMING.length})</h2>
        <div className="space-y-3">
          {INCOMING.map((b) => (
            <div key={b.id} className="flex items-center justify-between rounded-[16px] bg-white p-4 shadow-[0_1px_4px_rgba(13,27,42,0.06)]">
              <div>
                <p className="text-sm font-medium text-[var(--ms-navy)]">{b.client} · {b.service}</p>
                <p className="mt-0.5 text-xs text-[var(--ms-mauve)]">{b.time} · {b.total}</p>
              </div>
              <div className="flex gap-2">
                <button type="button" className="rounded-full bg-emerald-100 px-3 py-1.5 text-xs font-semibold text-emerald-700 hover:bg-emerald-200">
                  Accept
                </button>
                <button type="button" className="rounded-full bg-red-100 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-200">
                  Decline
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Upcoming confirmed */}
      <div className="rounded-[24px] border border-[var(--ms-border)] bg-white p-5 shadow-[0_2px_8px_rgba(13,27,42,0.04)]">
        <h2 className="mb-4 text-sm font-semibold text-[var(--ms-navy)]">Upcoming</h2>
        <div className="divide-y divide-[var(--ms-border)]">
          {UPCOMING.map((b) => (
            <div key={b.id} className="flex items-center justify-between py-3">
              <div>
                <p className="text-sm font-medium text-[var(--ms-navy)]">{b.client} · {b.service}</p>
                <p className="mt-0.5 text-xs text-[var(--ms-mauve)]">{b.time} · {b.total}</p>
              </div>
              <button type="button" className="rounded-full bg-[var(--ms-rose)] px-3 py-1.5 text-xs font-semibold text-white hover:opacity-90">
                Mark complete
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Today - active */}
      <div className="rounded-[24px] border border-[var(--ms-border)] bg-white p-5 shadow-[0_2px_8px_rgba(13,27,42,0.04)]">
        <h2 className="mb-4 text-sm font-semibold text-[var(--ms-navy)]">Today (active)</h2>
        <div className="divide-y divide-[var(--ms-border)]">
          {TODAY_SCHEDULE.map((b) => (
            <div key={b.id} className="flex items-center justify-between py-3">
              <div>
                <p className="text-sm font-medium text-[var(--ms-navy)]">{b.client} · {b.service}</p>
                <p className="mt-0.5 text-xs text-[var(--ms-mauve)]">Today, {b.time}</p>
              </div>
              <div className="flex items-center gap-2">
                <StatusPill status={b.status} />
                {b.status === "in-progress" && (
                  <button type="button" className="rounded-full bg-[var(--ms-rose)] px-3 py-1.5 text-xs font-semibold text-white hover:opacity-90">
                    Mark complete
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Past */}
      <div className="rounded-[24px] border border-[var(--ms-border)] bg-white p-5 shadow-[0_2px_8px_rgba(13,27,42,0.04)]">
        <h2 className="mb-4 text-sm font-semibold text-[var(--ms-navy)]">Past bookings</h2>
        <div className="divide-y divide-[var(--ms-border)]">
          {PAST.map((b) => (
            <div key={b.id} className="flex items-center justify-between py-3">
              <div>
                <p className="text-sm font-medium text-[var(--ms-navy)]">{b.client} · {b.service}</p>
                <p className="mt-0.5 text-xs text-[var(--ms-mauve)]">This week · {b.total}</p>
              </div>
              <StatusPill status={b.status} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── My Profile tab ─────────────────────────────────────────────────────────

function MyProfileTab() {
  const [section, setSection] = useState<ProfileSection>("identity");
  const [services, setServices] = useState(PRO_SERVICES);
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const [activeDays, setActiveDays] = useState(["Mon", "Tue", "Wed", "Thu", "Fri"]);

  function toggleDay(d: string) {
    setActiveDays((prev) => prev.includes(d) ? prev.filter((x) => x !== d) : [...prev, d]);
  }

  function toggleService(id: string) {
    setServices((prev) => prev.map((s) => s.id === id ? { ...s, active: !s.active } : s));
  }

  const sectionTabs: { key: ProfileSection; label: string }[] = [
    { key: "identity", label: "Identity" },
    { key: "services", label: "Services" },
    { key: "portfolio", label: "Portfolio" },
    { key: "availability", label: "Availability" },
  ];

  return (
    <div className="space-y-5">
      {/* Section tabs */}
      <div className="flex flex-wrap gap-2">
        {sectionTabs.map((t) => (
          <button
            key={t.key}
            type="button"
            onClick={() => setSection(t.key)}
            className={cn(
              "rounded-full border px-4 py-2 text-sm font-medium transition",
              section === t.key
                ? "border-[var(--ms-rose)] bg-[var(--ms-rose)] text-white"
                : "border-[var(--ms-border)] text-[var(--ms-mauve)] hover:text-[var(--ms-navy)]",
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Identity */}
      {section === "identity" && (
        <div className="rounded-[24px] border border-[var(--ms-border)] bg-white p-5 shadow-[0_2px_8px_rgba(13,27,42,0.04)]">
          <h2 className="mb-4 text-sm font-semibold text-[var(--ms-navy)]">Your identity</h2>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[var(--ms-petal)]">
                <UserRound className="h-10 w-10 text-[var(--ms-plum)]" />
              </div>
              <button type="button" className="rounded-full border border-[var(--ms-border)] px-4 py-2 text-sm font-medium text-[var(--ms-navy)] hover:border-[var(--ms-rose)]">
                Change photo
              </button>
            </div>
            {[
              { label: "Full name", placeholder: "Njeri Kamau" },
              { label: "One-line bio", placeholder: "Natural hair specialist based in Kilimani" },
              { label: "Neighbourhood", placeholder: "Kilimani" },
            ].map((f) => (
              <div key={f.label}>
                <label className="mb-1 block text-xs font-semibold text-[var(--ms-mauve)]">{f.label}</label>
                <input
                  type="text"
                  placeholder={f.placeholder}
                  className="w-full rounded-[14px] border border-[var(--ms-border)] bg-[var(--ms-soft-bg)] px-4 py-3 text-sm text-[var(--ms-navy)] outline-none focus:border-[var(--ms-rose)]"
                />
              </div>
            ))}
            <div>
              <label className="mb-1 block text-xs font-semibold text-[var(--ms-mauve)]">Work style</label>
              <div className="flex gap-2">
                {["Mobile", "Own space", "Both"].map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    className="rounded-full border border-[var(--ms-border)] px-4 py-2 text-sm font-medium text-[var(--ms-mauve)] transition hover:border-[var(--ms-rose)] hover:text-[var(--ms-rose)]"
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
            <button type="button" className="w-full rounded-full bg-[linear-gradient(135deg,var(--ms-rose),var(--ms-orchid))] py-3 text-sm font-semibold text-white hover:opacity-90">
              Save identity
            </button>
          </div>
        </div>
      )}

      {/* Services */}
      {section === "services" && (
        <div className="rounded-[24px] border border-[var(--ms-border)] bg-white p-5 shadow-[0_2px_8px_rgba(13,27,42,0.04)]">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-[var(--ms-navy)]">Your services</h2>
            <button type="button" className="flex items-center gap-1.5 rounded-full bg-[var(--ms-rose)] px-4 py-2 text-xs font-semibold text-white hover:opacity-90">
              <Plus className="h-3.5 w-3.5" /> Add service
            </button>
          </div>
          <div className="space-y-3">
            {services.map((s) => (
              <div key={s.id} className="rounded-[16px] border border-[var(--ms-border)] bg-[var(--ms-soft-bg)] p-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-[var(--ms-navy)]">{s.name}</p>
                  <button
                    type="button"
                    onClick={() => toggleService(s.id)}
                    className={cn("transition", s.active ? "text-emerald-600" : "text-slate-300")}
                  >
                    {s.active ? <ToggleRight className="h-7 w-7" /> : <ToggleLeft className="h-7 w-7" />}
                  </button>
                </div>
                <p className="mt-1 text-xs text-[var(--ms-mauve)]">{s.price} · {s.duration}</p>
                <p className="mt-1 text-xs text-[var(--ms-mauve)]">Products: {s.products}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Portfolio */}
      {section === "portfolio" && (
        <div className="rounded-[24px] border border-[var(--ms-border)] bg-white p-5 shadow-[0_2px_8px_rgba(13,27,42,0.04)]">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-[var(--ms-navy)]">Portfolio</h2>
            <button type="button" className="flex items-center gap-1.5 rounded-full bg-[var(--ms-rose)] px-4 py-2 text-xs font-semibold text-white hover:opacity-90">
              <Plus className="h-3.5 w-3.5" /> Add photo
            </button>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="group relative aspect-square overflow-hidden rounded-[14px] bg-[var(--ms-soft-bg)]">
                <div className="flex h-full flex-col items-center justify-center gap-1 text-[var(--ms-border)]">
                  <ImagePlus className="h-5 w-5" />
                  <p className="text-[10px]">Add photo</p>
                </div>
              </div>
            ))}
          </div>
          <p className="mt-3 text-center text-xs text-[var(--ms-mauve)]">Caption each photo after uploading.</p>
        </div>
      )}

      {/* Availability */}
      {section === "availability" && (
        <div className="rounded-[24px] border border-[var(--ms-border)] bg-white p-5 shadow-[0_2px_8px_rgba(13,27,42,0.04)]">
          <h2 className="mb-4 text-sm font-semibold text-[var(--ms-navy)]">Your availability</h2>
          <p className="mb-4 text-xs text-[var(--ms-mauve)]">Toggle days on/off. Set your hours per day.</p>
          <div className="space-y-3">
            {days.map((d) => {
              const on = activeDays.includes(d);
              return (
                <div key={d} className="flex items-center justify-between rounded-[14px] border border-[var(--ms-border)] bg-[var(--ms-soft-bg)] px-4 py-3">
                  <p className="text-sm font-medium text-[var(--ms-navy)]">{d}</p>
                  <div className="flex items-center gap-3">
                    {on && (
                      <p className="text-xs text-[var(--ms-mauve)]">8:00 AM – 6:00 PM</p>
                    )}
                    <button
                      type="button"
                      onClick={() => toggleDay(d)}
                      className={cn("transition", on ? "text-emerald-600" : "text-slate-300")}
                    >
                      {on ? <ToggleRight className="h-7 w-7" /> : <ToggleLeft className="h-7 w-7" />}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
          <button type="button" className="mt-4 w-full rounded-full bg-[linear-gradient(135deg,var(--ms-rose),var(--ms-orchid))] py-3 text-sm font-semibold text-white hover:opacity-90">
            Save availability
          </button>
        </div>
      )}
    </div>
  );
}

// ── Earnings tab ───────────────────────────────────────────────────────────

function EarningsTab() {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {[
          { label: "This month", value: "Ksh 28,200", sub: "18 services" },
          { label: "Pending escrow", value: "Ksh 4,500", sub: "3 in progress" },
          { label: "Paid out", value: "Ksh 23,700", sub: "Settled to M-Pesa" },
        ].map((s) => (
          <div key={s.label} className="rounded-[20px] border border-[var(--ms-border)] bg-white p-4 shadow-[0_2px_8px_rgba(13,27,42,0.04)]">
            <p className="text-xs text-[var(--ms-mauve)]">{s.label}</p>
            <p className="mt-1 text-xl font-bold text-[var(--ms-navy)]">{s.value}</p>
            <p className="mt-0.5 text-[10px] text-[var(--ms-mauve)]">{s.sub}</p>
          </div>
        ))}
      </div>

      <div className="rounded-[24px] border border-[var(--ms-border)] bg-white p-5 shadow-[0_2px_8px_rgba(13,27,42,0.04)]">
        <h2 className="mb-4 text-sm font-semibold text-[var(--ms-navy)]">Recent payouts</h2>
        {[
          { date: "Apr 28", amount: "Ksh 9,800", ref: "MP-7723" },
          { date: "Apr 21", amount: "Ksh 7,400", ref: "MP-7619" },
          { date: "Apr 14", amount: "Ksh 6,500", ref: "MP-7514" },
        ].map((p) => (
          <div key={p.ref} className="flex items-center justify-between border-b border-[var(--ms-border)] py-3 last:border-0">
            <div>
              <p className="text-sm font-medium text-[var(--ms-navy)]">{p.amount}</p>
              <p className="text-xs text-[var(--ms-mauve)]">{p.date} · {p.ref}</p>
            </div>
            <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-700">Settled</span>
          </div>
        ))}
      </div>

      <button type="button" className="w-full rounded-full bg-[linear-gradient(135deg,var(--ms-rose),var(--ms-orchid))] py-3.5 text-sm font-semibold text-white shadow-[0_8px_20px_rgba(232,62,140,0.2)] hover:opacity-90">
        Withdraw to M-Pesa
      </button>
    </div>
  );
}

// ── Settings tab ───────────────────────────────────────────────────────────

function SettingsTab() {
  return (
    <div className="space-y-4">
      <div className="rounded-[24px] border border-[var(--ms-border)] bg-white p-5 shadow-[0_2px_8px_rgba(13,27,42,0.04)]">
        <h2 className="mb-4 text-sm font-semibold text-[var(--ms-navy)]">Personal info</h2>
        <div className="space-y-3">
          {[
            { label: "Full name", value: "Njeri Kamau" },
            { label: "Phone", value: "+254 7XX XXX XXX" },
            { label: "Email", value: "njeri@example.com" },
          ].map((f) => (
            <div key={f.label} className="flex items-center justify-between rounded-[14px] border border-[var(--ms-border)] bg-[var(--ms-soft-bg)] px-4 py-3">
              <div>
                <p className="text-xs text-[var(--ms-mauve)]">{f.label}</p>
                <p className="text-sm font-medium text-[var(--ms-navy)]">{f.value}</p>
              </div>
              <Pencil className="h-4 w-4 text-[var(--ms-mauve)]" />
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-[24px] border border-[var(--ms-border)] bg-white p-5 shadow-[0_2px_8px_rgba(13,27,42,0.04)]">
        <h2 className="mb-4 text-sm font-semibold text-[var(--ms-navy)]">Payout account</h2>
        <div className="flex items-center justify-between rounded-[14px] border border-[var(--ms-border)] bg-[var(--ms-soft-bg)] px-4 py-3">
          <div>
            <p className="text-xs text-[var(--ms-mauve)]">M-Pesa number</p>
            <p className="text-sm font-medium text-[var(--ms-navy)]">+254 7XX XXX XXX</p>
          </div>
          <Pencil className="h-4 w-4 text-[var(--ms-mauve)]" />
        </div>
      </div>

      <div className="rounded-[24px] border border-[var(--ms-border)] bg-white p-5 shadow-[0_2px_8px_rgba(13,27,42,0.04)]">
        <h2 className="mb-4 text-sm font-semibold text-[var(--ms-navy)]">Verification</h2>
        <div className="flex items-center gap-3 rounded-[14px] bg-amber-50 px-4 py-3">
          <ShieldCheck className="h-5 w-5 text-amber-500" />
          <div>
            <p className="text-sm font-medium text-amber-800">Not yet verified</p>
            <p className="text-xs text-amber-700">Submit your ID to earn the Verified badge and rank higher.</p>
          </div>
        </div>
        <button type="button" className="mt-3 w-full rounded-full border border-[var(--ms-rose)] py-2.5 text-sm font-semibold text-[var(--ms-rose)] hover:bg-[var(--ms-petal)]">
          Start verification
        </button>
      </div>

      <div className="rounded-[24px] border border-[var(--ms-border)] bg-white p-5 shadow-[0_2px_8px_rgba(13,27,42,0.04)]">
        <h2 className="mb-4 text-sm font-semibold text-[var(--ms-navy)]">Notifications</h2>
        {[
          { label: "Booking requests", on: true },
          { label: "Booking confirmations", on: true },
          { label: "Payment releases", on: true },
          { label: "Weekly summary", on: false },
        ].map((n) => (
          <div key={n.label} className="flex items-center justify-between py-2.5">
            <p className="text-sm text-[var(--ms-navy)]">{n.label}</p>
            <button type="button" className={cn("transition", n.on ? "text-emerald-600" : "text-slate-300")}>
              {n.on ? <ToggleRight className="h-7 w-7" /> : <ToggleLeft className="h-7 w-7" />}
            </button>
          </div>
        ))}
      </div>

      <button type="button" className="flex w-full items-center justify-center gap-2 rounded-full border border-red-200 py-3 text-sm font-semibold text-red-500 hover:bg-red-50">
        <LogOut className="h-4 w-4" /> Log out
      </button>
    </div>
  );
}

// ── Page ───────────────────────────────────────────────────────────────────

export default function ProfessionalDashboardPage() {
  const [tab, setTab] = useState<Tab>("home");

  const tabContent: Record<Tab, React.ReactNode> = {
    home: <HomeTab />,
    bookings: <BookingsTab />,
    profile: <MyProfileTab />,
    earnings: <EarningsTab />,
    settings: <SettingsTab />,
  };

  return (
    <div className="min-h-screen bg-[var(--ms-soft-bg)]">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-[var(--ms-border)] bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 lg:px-6">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-[var(--ms-mauve)]">Professional Dashboard</p>
            <p className="mt-0.5 text-lg font-semibold text-[var(--ms-navy)]">Njeri Kamau</p>
          </div>
          <Link href="/home" className="rounded-full bg-[var(--ms-soft-bg)] px-4 py-2 text-sm font-medium text-[var(--ms-mauve)] hover:text-[var(--ms-navy)]">
            Exit dashboard
          </Link>
        </div>
      </header>

      {/* Body */}
      <div className="mx-auto flex max-w-7xl gap-6 px-4 pb-32 pt-6 lg:px-6 lg:pb-12">
        <TabBar active={tab} onChange={setTab} />
        <main className="min-w-0 flex-1">
          {tabContent[tab]}
        </main>
      </div>
    </div>
  );
}
