"use client";

import { useState } from "react";
import Link from "next/link";
import {
  BarChart2,
  Banknote,
  Bell,
  BriefcaseBusiness,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Clock,
  Eye,
  Home,
  ImagePlus,
  LogOut,
  Pencil,
  Plus,
  Settings,
  ShieldCheck,
  Star,
  ToggleLeft,
  ToggleRight,
  Trash2,
  UserRound,
  Users,
  WalletCards,
  X,
} from "lucide-react";

import { cn } from "@/lib/utils";

// ── Mock data ──────────────────────────────────────────────────────────────

const TODAY_BOOKINGS = [
  { id: 1, time: "9:00 AM", client: "Amina", service: "Balayage + Trim", status: "confirmed" },
  { id: 2, time: "11:30 AM", client: "Wanjiru", service: "Manicure & Pedicure", status: "confirmed" },
  { id: 3, time: "2:00 PM", client: "Fatuma", service: "Deep Conditioning Treatment", status: "pending" },
  { id: 4, time: "4:30 PM", client: "Njeri", service: "Eyebrow Threading", status: "confirmed" },
];

const PENDING_REQUESTS = [
  { id: 5, time: "Tomorrow, 10:00 AM", client: "Grace", service: "Bridal Trial", total: "Ksh 3,500" },
  { id: 6, time: "Sat, 1:00 PM", client: "Aisha", service: "Full Set Nails", total: "Ksh 2,200" },
];

const PAST_BOOKINGS = [
  { id: 7, date: "Mon", client: "Lila", service: "Locs Retouch", total: "Ksh 1,800", status: "completed" },
  { id: 8, date: "Tue", client: "Sasha", service: "Facial", total: "Ksh 2,500", status: "completed" },
  { id: 9, date: "Wed", client: "Keiko", service: "Hair Wash & Set", total: "Ksh 950", status: "completed" },
];

const SERVICES = [
  { id: "s1", name: "Balayage + Trim", category: "Hair", price: "Ksh 4,500", duration: "2h 30min", active: true },
  { id: "s2", name: "Deep Conditioning", category: "Hair", price: "Ksh 1,200", duration: "45min", active: true },
  { id: "s3", name: "Manicure & Pedicure", category: "Nails", price: "Ksh 1,800", duration: "1h 30min", active: true },
  { id: "s4", name: "Eyebrow Threading", category: "Face", price: "Ksh 400", duration: "15min", active: false },
  { id: "s5", name: "Bridal Package", category: "Bridal", price: "Ksh 8,500", duration: "4h", active: true },
];

const TEAM = [
  { id: "t1", name: "Zara Omukhubi", specialty: "Hair & Colour", active: true },
  { id: "t2", name: "Cynthia Waweru", specialty: "Nails", active: true },
  { id: "t3", name: "Mariam Hassan", specialty: "Skincare & Facial", active: false },
];

type Tab = "home" | "bookings" | "salon" | "earnings" | "settings";
type SalonSection = "identity" | "services" | "team" | "portfolio";

// ── Status pill ────────────────────────────────────────────────────────────

function StatusPill({ status }: { status: string }) {
  const map: Record<string, string> = {
    confirmed: "bg-emerald-100 text-emerald-700",
    pending: "bg-amber-100 text-amber-700",
    completed: "bg-slate-100 text-slate-600",
    declined: "bg-red-100 text-red-600",
  };
  return (
    <span className={cn("rounded-full px-2.5 py-1 text-xs font-semibold capitalize", map[status] ?? "bg-slate-100 text-slate-600")}>
      {status}
    </span>
  );
}

// ── Tab bar ────────────────────────────────────────────────────────────────

function TabBar({ active, onChange }: { active: Tab; onChange: (t: Tab) => void }) {
  const tabs: { key: Tab; label: string; icon: React.ReactNode }[] = [
    { key: "home", label: "Home", icon: <Home className="h-5 w-5" /> },
    { key: "bookings", label: "Bookings", icon: <CalendarDays className="h-5 w-5" /> },
    { key: "salon", label: "My Salon", icon: <BriefcaseBusiness className="h-5 w-5" /> },
    { key: "earnings", label: "Earnings", icon: <Banknote className="h-5 w-5" /> },
    { key: "settings", label: "Settings", icon: <Settings className="h-5 w-5" /> },
  ];

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden w-56 shrink-0 lg:block">
        <div className="sticky top-24 space-y-1 rounded-[24px] border border-[var(--ms-border)] bg-white p-3 shadow-[0_4px_16px_rgba(13,27,42,0.05)]">
          <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--ms-mauve)]">
            Salon Dashboard
          </p>
          {tabs.map((t) => (
            <button
              key={t.key}
              type="button"
              onClick={() => onChange(t.key)}
              className={cn(
                "flex w-full items-center gap-3 rounded-[14px] px-3 py-2.5 text-sm font-medium transition",
                active === t.key
                  ? "bg-[var(--ms-plum)] text-white"
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
              active === t.key ? "text-[var(--ms-plum)]" : "text-[var(--ms-mauve)]",
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
  return (
    <div className="space-y-6">
      {/* Stats row */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: "Today's bookings", value: "4", icon: <CalendarDays className="h-5 w-5 text-[var(--ms-plum)]" /> },
          { label: "Pending requests", value: "2", icon: <Clock className="h-5 w-5 text-amber-500" /> },
          { label: "Rating", value: "4.8 ★", icon: <Star className="h-5 w-5 text-[var(--ms-gold)]" /> },
          { label: "Profile views", value: "134", icon: <Eye className="h-5 w-5 text-[var(--ms-teal)]" /> },
        ].map((s) => (
          <div key={s.label} className="rounded-[20px] border border-[var(--ms-border)] bg-white p-4 shadow-[0_2px_8px_rgba(13,27,42,0.04)]">
            <div className="mb-2">{s.icon}</div>
            <p className="text-2xl font-bold text-[var(--ms-navy)]">{s.value}</p>
            <p className="mt-0.5 text-xs text-[var(--ms-mauve)]">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Today's schedule */}
      <div className="rounded-[24px] border border-[var(--ms-border)] bg-white p-5 shadow-[0_2px_8px_rgba(13,27,42,0.04)]">
        <h2 className="mb-4 text-base font-semibold text-[var(--ms-navy)]">Today's bookings</h2>
        <div className="divide-y divide-[var(--ms-border)]">
          {TODAY_BOOKINGS.map((b) => (
            <div key={b.id} className="flex items-center justify-between py-3">
              <div className="flex items-center gap-3">
                <span className="w-16 text-xs font-semibold text-[var(--ms-mauve)]">{b.time}</span>
                <div>
                  <p className="text-sm font-medium text-[var(--ms-navy)]">{b.client}</p>
                  <p className="text-xs text-[var(--ms-mauve)]">{b.service}</p>
                </div>
              </div>
              <StatusPill status={b.status} />
            </div>
          ))}
        </div>
      </div>

      {/* Quick actions */}
      <div>
        <h2 className="mb-3 text-sm font-semibold text-[var(--ms-navy)]">Quick actions</h2>
        <div className="flex flex-wrap gap-3">
          {[
            { label: "+ Add service", href: "#" },
            { label: "+ Add photo", href: "#" },
            { label: "✓ Get Verified", href: "#" },
          ].map((a) => (
            <Link
              key={a.label}
              href={a.href}
              className="rounded-full border border-[var(--ms-border)] bg-white px-5 py-2.5 text-sm font-medium text-[var(--ms-navy)] shadow-[0_2px_8px_rgba(13,27,42,0.05)] hover:border-[var(--ms-rose)] hover:text-[var(--ms-rose)]"
            >
              {a.label}
            </Link>
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
      {/* Pending */}
      <div className="rounded-[24px] border border-amber-200 bg-amber-50 p-5">
        <h2 className="mb-4 text-sm font-semibold text-amber-800">Pending requests ({PENDING_REQUESTS.length})</h2>
        <div className="space-y-3">
          {PENDING_REQUESTS.map((b) => (
            <div key={b.id} className="flex items-center justify-between rounded-[16px] bg-white p-4 shadow-[0_1px_4px_rgba(13,27,42,0.06)]">
              <div>
                <p className="text-sm font-medium text-[var(--ms-navy)]">{b.client} · {b.service}</p>
                <p className="mt-0.5 text-xs text-[var(--ms-mauve)]">{b.time} · {b.total}</p>
              </div>
              <div className="flex gap-2">
                <button type="button" className="rounded-full bg-emerald-100 px-3 py-1.5 text-xs font-semibold text-emerald-700 hover:bg-emerald-200">
                  Confirm
                </button>
                <button type="button" className="rounded-full bg-red-100 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-200">
                  Decline
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Upcoming */}
      <div className="rounded-[24px] border border-[var(--ms-border)] bg-white p-5 shadow-[0_2px_8px_rgba(13,27,42,0.04)]">
        <h2 className="mb-4 text-sm font-semibold text-[var(--ms-navy)]">Upcoming (confirmed)</h2>
        <div className="divide-y divide-[var(--ms-border)]">
          {TODAY_BOOKINGS.filter((b) => b.status === "confirmed").map((b) => (
            <div key={b.id} className="flex items-center justify-between py-3">
              <div>
                <p className="text-sm font-medium text-[var(--ms-navy)]">{b.client} · {b.service}</p>
                <p className="mt-0.5 text-xs text-[var(--ms-mauve)]">Today, {b.time}</p>
              </div>
              <StatusPill status={b.status} />
            </div>
          ))}
        </div>
      </div>

      {/* Past */}
      <div className="rounded-[24px] border border-[var(--ms-border)] bg-white p-5 shadow-[0_2px_8px_rgba(13,27,42,0.04)]">
        <h2 className="mb-4 text-sm font-semibold text-[var(--ms-navy)]">Past bookings</h2>
        <div className="divide-y divide-[var(--ms-border)]">
          {PAST_BOOKINGS.map((b) => (
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

// ── My Salon tab ───────────────────────────────────────────────────────────

function MySalonTab() {
  const [section, setSection] = useState<SalonSection>("identity");
  const [services, setServices] = useState(SERVICES);

  function toggleService(id: string) {
    setServices((prev) => prev.map((s) => s.id === id ? { ...s, active: !s.active } : s));
  }

  const sectionTabs: { key: SalonSection; label: string }[] = [
    { key: "identity", label: "Identity" },
    { key: "services", label: "Services" },
    { key: "team", label: "Team" },
    { key: "portfolio", label: "Portfolio" },
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
                ? "border-[var(--ms-plum)] bg-[var(--ms-plum)] text-white"
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
          <h2 className="mb-4 text-sm font-semibold text-[var(--ms-navy)]">Salon identity</h2>
          <div className="space-y-4">
            {[
              { label: "Salon name", placeholder: "Glam Studio Westlands" },
              { label: "Salon type", placeholder: "Hair Salon" },
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
            <div className="grid grid-cols-2 gap-3">
              <div className="flex aspect-video items-center justify-center rounded-[16px] border-2 border-dashed border-[var(--ms-border)] text-[var(--ms-mauve)] hover:border-[var(--ms-rose)]">
                <div className="text-center">
                  <ImagePlus className="mx-auto h-6 w-6" />
                  <p className="mt-1 text-xs">Logo</p>
                </div>
              </div>
              <div className="flex aspect-video items-center justify-center rounded-[16px] border-2 border-dashed border-[var(--ms-border)] text-[var(--ms-mauve)] hover:border-[var(--ms-rose)]">
                <div className="text-center">
                  <ImagePlus className="mx-auto h-6 w-6" />
                  <p className="mt-1 text-xs">Cover photo</p>
                </div>
              </div>
            </div>
            <button type="button" className="w-full rounded-full bg-[var(--ms-plum)] py-3 text-sm font-semibold text-white hover:opacity-90">
              Save identity
            </button>
          </div>
        </div>
      )}

      {/* Services */}
      {section === "services" && (
        <div className="rounded-[24px] border border-[var(--ms-border)] bg-white p-5 shadow-[0_2px_8px_rgba(13,27,42,0.04)]">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-[var(--ms-navy)]">Services</h2>
            <button type="button" className="flex items-center gap-1.5 rounded-full bg-[var(--ms-rose)] px-4 py-2 text-xs font-semibold text-white hover:opacity-90">
              <Plus className="h-3.5 w-3.5" /> Add service
            </button>
          </div>
          <div className="divide-y divide-[var(--ms-border)]">
            {services.map((s) => (
              <div key={s.id} className="flex items-center justify-between py-3">
                <div>
                  <p className="text-sm font-medium text-[var(--ms-navy)]">{s.name}</p>
                  <p className="mt-0.5 text-xs text-[var(--ms-mauve)]">{s.category} · {s.price} · {s.duration}</p>
                </div>
                <button
                  type="button"
                  onClick={() => toggleService(s.id)}
                  className={cn("transition", s.active ? "text-emerald-600" : "text-slate-300")}
                >
                  {s.active
                    ? <ToggleRight className="h-7 w-7" />
                    : <ToggleLeft className="h-7 w-7" />}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Team */}
      {section === "team" && (
        <div className="rounded-[24px] border border-[var(--ms-border)] bg-white p-5 shadow-[0_2px_8px_rgba(13,27,42,0.04)]">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-[var(--ms-navy)]">Team members</h2>
            <button type="button" className="flex items-center gap-1.5 rounded-full bg-[var(--ms-rose)] px-4 py-2 text-xs font-semibold text-white hover:opacity-90">
              <Plus className="h-3.5 w-3.5" /> Add member
            </button>
          </div>
          <div className="divide-y divide-[var(--ms-border)]">
            {TEAM.map((m) => (
              <div key={m.id} className="flex items-center justify-between py-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--ms-petal)]">
                    <UserRound className="h-5 w-5 text-[var(--ms-plum)]" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[var(--ms-navy)]">{m.name}</p>
                    <p className="text-xs text-[var(--ms-mauve)]">{m.specialty}</p>
                  </div>
                </div>
                <span className={cn(
                  "rounded-full px-2.5 py-1 text-xs font-semibold",
                  m.active ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-500",
                )}>
                  {m.active ? "Active" : "Hidden"}
                </span>
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
                <div className="flex h-full items-center justify-center text-[var(--ms-border)]">
                  <ImagePlus className="h-6 w-6" />
                </div>
              </div>
            ))}
          </div>
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
          { label: "This month", value: "Ksh 48,500", sub: "32 services" },
          { label: "Pending escrow", value: "Ksh 6,200", sub: "4 services in progress" },
          { label: "Paid out", value: "Ksh 42,300", sub: "Settled to M-Pesa" },
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
          { date: "Apr 28", amount: "Ksh 18,400", ref: "MP-8823" },
          { date: "Apr 21", amount: "Ksh 13,900", ref: "MP-8719" },
          { date: "Apr 14", amount: "Ksh 10,000", ref: "MP-8614" },
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

      <button type="button" className="w-full rounded-full bg-[linear-gradient(135deg,var(--ms-plum),var(--ms-rose))] py-3.5 text-sm font-semibold text-white shadow-[0_8px_20px_rgba(132,36,92,0.2)] hover:opacity-90">
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
        <h2 className="mb-4 text-sm font-semibold text-[var(--ms-navy)]">Salon info</h2>
        <div className="space-y-3">
          {[
            { label: "Salon name", value: "Glam Studio" },
            { label: "Address", value: "Westlands, Nairobi" },
            { label: "Opening hours", value: "Mon–Sat, 8 AM–7 PM" },
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
            <p className="text-xs text-amber-700">Upload your ID and business registration to earn the Verified badge.</p>
          </div>
        </div>
        <button type="button" className="mt-3 w-full rounded-full border border-[var(--ms-plum)] py-2.5 text-sm font-semibold text-[var(--ms-plum)] hover:bg-[var(--ms-petal)]">
          Start verification
        </button>
      </div>

      <div className="rounded-[24px] border border-[var(--ms-border)] bg-white p-5 shadow-[0_2px_8px_rgba(13,27,42,0.04)]">
        <h2 className="mb-4 text-sm font-semibold text-[var(--ms-navy)]">Notifications</h2>
        {[
          { label: "New booking requests", on: true },
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

export default function SalonDashboardPage() {
  const [tab, setTab] = useState<Tab>("home");

  const tabContent: Record<Tab, React.ReactNode> = {
    home: <HomeTab />,
    bookings: <BookingsTab />,
    salon: <MySalonTab />,
    earnings: <EarningsTab />,
    settings: <SettingsTab />,
  };

  return (
    <div className="min-h-screen bg-[var(--ms-soft-bg)]">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-[var(--ms-border)] bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 lg:px-6">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-[var(--ms-mauve)]">Salon Dashboard</p>
            <p className="mt-0.5 text-lg font-semibold text-[var(--ms-navy)]">Glam Studio</p>
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
