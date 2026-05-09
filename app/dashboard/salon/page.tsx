"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
  ChevronLeft,
  ChevronRight,
  Clock,
  Eye,
  FileText,
  Home,
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
import { ImageUploadEditor } from "@/components/image-upload-editor";
import { clearAppSession } from "@/lib/client-session";

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

const PORTFOLIO_SERVICES = ["Hair styling", "Braiding", "Locs", "Nails", "Make-up", "Skincare", "Facial", "Threading", "Bridal"] as const;

const OCCASION_TAGS = [
  "Valentine's Day", "Date night", "Anniversary", "Baecation",
  "Birthday", "21st celebration", "Girls' trip", "Bachelorette",
  "Wedding day", "Traditional ceremony", "Bridal shower",
  "Baby shower", "Gender reveal", "Bump shoot",
  "Corporate event", "Business dinner", "Product launch",
  "Eid celebration", "Christmas", "New Year's Eve",
  "Graduation", "Self-care day", "Mental health reset",
  "Holiday prep", "Photo shoot", "Everyday glam",
] as const;

type Tab = "home" | "bookings" | "salon" | "earnings" | "settings" | "ads";
type SalonSection = "identity" | "services" | "team" | "portfolio" | "hours";

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
    { key: "ads", label: "Ads", icon: <BarChart2 className="h-5 w-5" /> },
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

const DAYS_OF_WEEK = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"] as const;
type DayKey = typeof DAYS_OF_WEEK[number];
type HoursEntry = { open: boolean; start: string; startPeriod: "AM" | "PM"; end: string; endPeriod: "AM" | "PM" };

function MySalonTab() {
  const [section, setSection] = useState<SalonSection>("identity");
  const [services, setServices] = useState(SERVICES);
  const [serviceOccasions, setServiceOccasions] = useState<Record<string, string[]>>({});
  const [expandedServiceId, setExpandedServiceId] = useState<string | null>(null);
  const [logoPhoto, setLogoPhoto] = useState<string | undefined>();
  const [coverPhoto, setCoverPhoto] = useState<string | undefined>();
  const [portfolioPhotos, setPortfolioPhotos] = useState<(string | undefined)[]>(Array(6).fill(undefined));
  type PortfolioMeta = { services: string[]; description: string };
  const [portfolioMeta, setPortfolioMeta] = useState<PortfolioMeta[]>(
    Array(6).fill(null).map(() => ({ services: [], description: "" }))
  );
  const [hours, setHours] = useState<Record<DayKey, HoursEntry>>({
    Monday:    { open: true,  start: "09:00", startPeriod: "AM", end: "07:00", endPeriod: "PM" },
    Tuesday:   { open: true,  start: "09:00", startPeriod: "AM", end: "07:00", endPeriod: "PM" },
    Wednesday: { open: true,  start: "09:00", startPeriod: "AM", end: "07:00", endPeriod: "PM" },
    Thursday:  { open: true,  start: "09:00", startPeriod: "AM", end: "07:00", endPeriod: "PM" },
    Friday:    { open: true,  start: "09:00", startPeriod: "AM", end: "07:00", endPeriod: "PM" },
    Saturday:  { open: true,  start: "09:00", startPeriod: "AM", end: "05:00", endPeriod: "PM" },
    Sunday:    { open: false, start: "10:00", startPeriod: "AM", end: "04:00", endPeriod: "PM" },
  });

  function updateHours(day: DayKey, patch: Partial<HoursEntry>) {
    setHours(prev => ({ ...prev, [day]: { ...prev[day], ...patch } }));
  }

  function toggleService(id: string) {
    setServices((prev) => prev.map((s) => s.id === id ? { ...s, active: !s.active } : s));
  }

  const sectionTabs: { key: SalonSection; label: string }[] = [
    { key: "identity", label: "Identity" },
    { key: "services", label: "Services" },
    { key: "team", label: "Team" },
    { key: "portfolio", label: "Portfolio" },
    { key: "hours", label: "Hours" },
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
            {/* Salon name — individual render with lock warning */}
            <div>
              <label className="mb-1 block text-xs font-semibold text-[var(--ms-mauve)]">Salon name</label>
              <input
                type="text"
                placeholder="Glam Studio Westlands"
                className="w-full rounded-[14px] border border-[var(--ms-border)] bg-[var(--ms-soft-bg)] px-4 py-3 text-sm text-[var(--ms-navy)] outline-none focus:border-[var(--ms-rose)]"
              />
              <p className="mt-1.5 rounded-[12px] border border-amber-200 bg-amber-50 px-3 py-2.5 text-[11px] leading-5 text-amber-800">
                ⚠️ Your salon name cannot be changed for 6 months after account creation. Once set, you can update it every 3 months.
              </p>
            </div>
            {/* Salon type */}
            <div>
              <label className="mb-1 block text-xs font-semibold text-[var(--ms-mauve)]">Salon type</label>
              <input
                type="text"
                placeholder="Hair Salon"
                className="w-full rounded-[14px] border border-[var(--ms-border)] bg-[var(--ms-soft-bg)] px-4 py-3 text-sm text-[var(--ms-navy)] outline-none focus:border-[var(--ms-rose)]"
              />
            </div>
            <ImageUploadEditor
              label="Salon logo"
              requirements="PNG recommended · min 400 × 400 px · max 2 MB"
              aspectHint="Square 1:1 — used on your listing card"
              maxMB={2}
              value={logoPhoto}
              onSave={setLogoPhoto}
            />
            <ImageUploadEditor
              label="Cover photo"
              requirements="JPG or PNG · min 800 × 600 px · max 5 MB"
              aspectHint="Landscape 4:3 or 16:9 recommended"
              maxMB={5}
              value={coverPhoto}
              onSave={setCoverPhoto}
            />
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
            {services.map((s) => {
              const isExpanded = expandedServiceId === s.id;
              const selectedOccasions = serviceOccasions[s.id] ?? [];
              return (
                <div key={s.id} className="py-3">
                  <div className="flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => setExpandedServiceId(isExpanded ? null : s.id)}
                      className="flex min-w-0 flex-1 items-start gap-2 text-left"
                    >
                      <ChevronRight className={cn(
                        "mt-0.5 h-4 w-4 shrink-0 text-[var(--ms-mauve)] transition-transform",
                        isExpanded && "rotate-90",
                      )} />
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-[var(--ms-navy)]">{s.name}</p>
                        <p className="mt-0.5 text-xs text-[var(--ms-mauve)]">{s.category} · {s.price} · {s.duration}</p>
                        {selectedOccasions.length > 0 && !isExpanded && (
                          <div className="mt-1.5 flex flex-wrap gap-1">
                            {selectedOccasions.slice(0, 3).map((o) => (
                              <span key={o} className="rounded-full bg-[var(--ms-petal)] px-2 py-0.5 text-[10px] font-semibold text-[var(--ms-plum)]">✦ {o}</span>
                            ))}
                          </div>
                        )}
                      </div>
                    </button>
                    <button
                      type="button"
                      onClick={() => toggleService(s.id)}
                      className={cn("ml-2 shrink-0 transition", s.active ? "text-emerald-600" : "text-slate-300")}
                    >
                      {s.active ? <ToggleRight className="h-7 w-7" /> : <ToggleLeft className="h-7 w-7" />}
                    </button>
                  </div>
                  {/* Occasion tags — expandable */}
                  {isExpanded && (
                    <div className="ml-6 mt-3 rounded-[16px] border border-[var(--ms-border)] bg-[var(--ms-soft-bg)] p-4">
                      <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--ms-mauve)]">
                        Perfect for which occasion?
                      </p>
                      <p className="mb-3 text-xs text-[var(--ms-mauve)]">
                        Help clients find you when planning for these moments.
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {OCCASION_TAGS.map((o) => {
                          const active = selectedOccasions.includes(o);
                          return (
                            <button
                              key={o}
                              type="button"
                              onClick={() =>
                                setServiceOccasions((prev) => ({
                                  ...prev,
                                  [s.id]: active
                                    ? (prev[s.id] ?? []).filter((x) => x !== o)
                                    : [...(prev[s.id] ?? []), o],
                                }))
                              }
                              className={cn(
                                "rounded-full border px-3 py-1 text-xs font-medium transition",
                                active
                                  ? "border-[var(--ms-rose)] bg-[var(--ms-petal)] text-[var(--ms-plum)]"
                                  : "border-[var(--ms-border)] text-[var(--ms-mauve)] hover:border-[var(--ms-rose)]/50",
                              )}
                            >
                              {active ? "✦ " : ""}{o}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
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
          <div className="space-y-4">
            {portfolioPhotos.map((photo, i) => (
              <div key={i} className="rounded-[20px] border border-[var(--ms-border)] bg-[var(--ms-soft-bg)] p-4 space-y-3">
                <ImageUploadEditor
                  label={`Photo ${i + 1}`}
                  requirements="JPG or PNG · min 600 × 600 px · max 5 MB"
                  aspectHint="Square or portrait works best"
                  maxMB={5}
                  value={photo}
                  onSave={(url) =>
                    setPortfolioPhotos((prev) => {
                      const next = [...prev];
                      next[i] = url;
                      return next;
                    })
                  }
                />

                {/* Service tags */}
                <div>
                  <p className="mb-2 text-xs font-semibold text-[var(--ms-mauve)]">Service done</p>
                  <div className="flex flex-wrap gap-1.5">
                    {PORTFOLIO_SERVICES.map((s) => {
                      const active = portfolioMeta[i].services.includes(s);
                      return (
                        <button key={s} type="button"
                          onClick={() => setPortfolioMeta(prev => {
                            const next = [...prev];
                            next[i] = {
                              ...next[i],
                              services: active
                                ? next[i].services.filter(x => x !== s)
                                : [...next[i].services, s],
                            };
                            return next;
                          })}
                          className={cn(
                            "rounded-full border px-3 py-1 text-xs font-medium transition",
                            active
                              ? "border-[var(--ms-rose)] bg-[var(--ms-petal)] text-[var(--ms-plum)]"
                              : "border-[var(--ms-border)] text-[var(--ms-mauve)] hover:border-[var(--ms-rose)]/50",
                          )}
                        >
                          {s}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Description */}
                <div>
                  <div className="mb-1 flex items-center justify-between">
                    <p className="text-xs font-semibold text-[var(--ms-mauve)]">Description of work</p>
                    <p className={cn("text-[10px]", portfolioMeta[i].description.length > 280 ? "text-[var(--ms-rose)]" : "text-[var(--ms-mauve)]")}>
                      {portfolioMeta[i].description.length} / 300
                    </p>
                  </div>
                  <textarea
                    value={portfolioMeta[i].description}
                    maxLength={300}
                    onChange={(e) => setPortfolioMeta(prev => {
                      const next = [...prev];
                      next[i] = { ...next[i], description: e.target.value };
                      return next;
                    })}
                    placeholder="Describe the work done — hair type, technique, products used..."
                    rows={3}
                    className="w-full resize-none rounded-[14px] border border-[var(--ms-border)] bg-white px-3 py-2 text-sm text-[var(--ms-navy)] outline-none focus:border-[var(--ms-rose)] placeholder:text-[var(--ms-border)]"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Hours */}
      {section === "hours" && (
        <div className="rounded-[24px] border border-[var(--ms-border)] bg-white p-5 shadow-[0_2px_8px_rgba(13,27,42,0.04)]">
          <h2 className="mb-1 text-sm font-semibold text-[var(--ms-navy)]">Operating hours</h2>
          <p className="mb-4 text-xs text-[var(--ms-mauve)]">Type any time you like — e.g. 09:30 AM. Toggle a day off to mark it as closed.</p>
          <div className="space-y-3">
            {DAYS_OF_WEEK.map((day) => {
              const h = hours[day];
              return (
                <div key={day} className="rounded-[16px] border border-[var(--ms-border)] bg-[var(--ms-soft-bg)] px-4 py-3">
                  <div className="flex items-center justify-between">
                    <p className="w-24 text-sm font-medium text-[var(--ms-navy)]">{day}</p>
                    <button
                      type="button"
                      onClick={() => updateHours(day, { open: !h.open })}
                      className={cn("transition", h.open ? "text-emerald-600" : "text-slate-300")}
                    >
                      {h.open ? <ToggleRight className="h-7 w-7" /> : <ToggleLeft className="h-7 w-7" />}
                    </button>
                  </div>
                  {h.open && (
                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      <span className="text-xs text-[var(--ms-mauve)]">Opens</span>
                      <input
                        type="text"
                        value={h.start}
                        onChange={(e) => updateHours(day, { start: e.target.value })}
                        placeholder="09:00"
                        className="w-20 rounded-[10px] border border-[var(--ms-border)] bg-white px-3 py-1.5 text-sm text-[var(--ms-navy)] outline-none focus:border-[var(--ms-rose)]"
                      />
                      <select
                        value={h.startPeriod}
                        onChange={(e) => updateHours(day, { startPeriod: e.target.value as "AM" | "PM" })}
                        className="rounded-[10px] border border-[var(--ms-border)] bg-white px-2 py-1.5 text-sm text-[var(--ms-navy)] outline-none focus:border-[var(--ms-rose)]"
                      >
                        <option>AM</option><option>PM</option>
                      </select>
                      <span className="text-xs text-[var(--ms-mauve)]">closes</span>
                      <input
                        type="text"
                        value={h.end}
                        onChange={(e) => updateHours(day, { end: e.target.value })}
                        placeholder="07:00"
                        className="w-20 rounded-[10px] border border-[var(--ms-border)] bg-white px-3 py-1.5 text-sm text-[var(--ms-navy)] outline-none focus:border-[var(--ms-rose)]"
                      />
                      <select
                        value={h.endPeriod}
                        onChange={(e) => updateHours(day, { endPeriod: e.target.value as "AM" | "PM" })}
                        className="rounded-[10px] border border-[var(--ms-border)] bg-white px-2 py-1.5 text-sm text-[var(--ms-navy)] outline-none focus:border-[var(--ms-rose)]"
                      >
                        <option>AM</option><option>PM</option>
                      </select>
                    </div>
                  )}
                  {!h.open && (
                    <p className="mt-1 text-xs text-[var(--ms-mauve)]">Closed</p>
                  )}
                </div>
              );
            })}
          </div>
          <button type="button" className="mt-5 w-full rounded-full bg-[var(--ms-plum)] py-3 text-sm font-semibold text-white hover:opacity-90">
            Save hours
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

// ── Monthly report modal ───────────────────────────────────────────────────

function MonthlyReportModal({ onClose, role }: { onClose: () => void; role: "salon" | "professional" }) {
  const [monthIndex, setMonthIndex] = useState(0);
  const MONTHS = ["May 2026", "April 2026", "March 2026", "February 2026"];
  const month = MONTHS[monthIndex];

  const salonBookings = [
    { date: "Apr 28", client: "Amina W.", service: "Balayage + Trim", amount: "Ksh 4,500", status: "Completed", payout: "Settled" },
    { date: "Apr 25", client: "Wanjiru K.", service: "Manicure & Pedicure", amount: "Ksh 1,800", status: "Completed", payout: "Settled" },
    { date: "Apr 22", client: "Fatuma A.", service: "Deep Conditioning", amount: "Ksh 1,200", status: "Completed", payout: "Settled" },
    { date: "Apr 19", client: "Grace N.", service: "Bridal Trial", amount: "Ksh 3,500", status: "Completed", payout: "Pending" },
  ];
  const proBookings = [
    { date: "Apr 27", client: "Sasha M.", service: "Box Braids", amount: "Ksh 2,800", status: "Completed", payout: "Settled" },
    { date: "Apr 24", client: "Nour H.", service: "Locs Starter", amount: "Ksh 2,400", status: "Completed", payout: "Settled" },
    { date: "Apr 20", client: "Keiko T.", service: "Natural Hair Styling", amount: "Ksh 1,200", status: "Completed", payout: "Pending" },
  ];
  const bookings = role === "salon" ? salonBookings : proBookings;
  const total = role === "salon" ? 48500 : 28200;
  const commission = Math.round(total * 0.05);
  const net = total - commission;

  return (
    <div className="fixed inset-0 z-[9990] flex items-end justify-center sm:items-center p-4 bg-[rgba(13,27,42,0.6)] backdrop-blur-sm">
      <div className="relative w-full max-w-2xl overflow-hidden rounded-t-[32px] bg-white sm:rounded-[32px]" style={{ maxHeight: "90dvh" }}>
        <div className="flex items-center justify-between border-b border-[var(--ms-border)] px-5 py-4">
          <h2 className="text-base font-semibold text-[var(--ms-navy)]">Monthly report</h2>
          <button type="button" onClick={onClose} className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--ms-soft-bg)] text-[var(--ms-mauve)] hover:text-[var(--ms-navy)]">
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="overflow-y-auto p-5 space-y-5">
          {/* Month selector */}
          <div className="flex items-center justify-between rounded-[16px] border border-[var(--ms-border)] bg-[var(--ms-soft-bg)] px-4 py-3">
            <button
              type="button"
              onClick={() => setMonthIndex(i => Math.min(i + 1, MONTHS.length - 1))}
              className="text-[var(--ms-mauve)] hover:text-[var(--ms-navy)] disabled:opacity-30"
              disabled={monthIndex >= MONTHS.length - 1}
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <p className="text-sm font-semibold text-[var(--ms-navy)]">{month}</p>
            <button
              type="button"
              onClick={() => setMonthIndex(i => Math.max(i - 1, 0))}
              className="text-[var(--ms-mauve)] hover:text-[var(--ms-navy)] disabled:opacity-30"
              disabled={monthIndex === 0}
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
          {/* Summary */}
          <div className="rounded-[20px] border border-[var(--ms-border)] bg-white p-4 space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--ms-mauve)]">Summary</p>
            {[
              ["Total bookings", bookings.length.toString()],
              ["Completed", bookings.filter(b => b.status === "Completed").length.toString()],
              ["Cancelled", "0"],
              ["No-shows", "0"],
              ["Total revenue", `Ksh ${total.toLocaleString()}`],
              ["Platform commission (5%)", `Ksh ${commission.toLocaleString()}`],
              ["Net paid out", `Ksh ${net.toLocaleString()}`],
            ].map(([label, value]) => (
              <div key={label} className="flex items-center justify-between py-1.5 border-b border-[var(--ms-border)] last:border-0">
                <p className="text-sm text-[var(--ms-mauve)]">{label}</p>
                <p className="text-sm font-semibold text-[var(--ms-navy)]">{value}</p>
              </div>
            ))}
          </div>
          {/* Booking breakdown */}
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--ms-mauve)]">Booking breakdown</p>
            <div className="overflow-x-auto rounded-[16px] border border-[var(--ms-border)]">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="border-b border-[var(--ms-border)] bg-[var(--ms-soft-bg)]">
                    {["Date", "Client", "Service", "Amount", "Status", "Payout"].map(h => (
                      <th key={h} className="px-3 py-2.5 text-left text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--ms-mauve)]">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((b, i) => (
                    <tr key={i} className="border-b border-[var(--ms-border)] last:border-0">
                      <td className="px-3 py-2.5 text-xs text-[var(--ms-mauve)]">{b.date}</td>
                      <td className="px-3 py-2.5 text-xs font-medium text-[var(--ms-navy)]">{b.client}</td>
                      <td className="px-3 py-2.5 text-xs text-[var(--ms-navy)]">{b.service}</td>
                      <td className="px-3 py-2.5 text-xs font-semibold text-[var(--ms-navy)]">{b.amount}</td>
                      <td className="px-3 py-2.5"><span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">{b.status}</span></td>
                      <td className="px-3 py-2.5"><span className={cn("rounded-full px-2 py-0.5 text-[10px] font-semibold", b.payout === "Settled" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700")}>{b.payout}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          {/* Download buttons */}
          <div className="grid grid-cols-2 gap-3">
            <button type="button" className="flex items-center justify-center gap-2 rounded-full border border-[var(--ms-plum)] py-2.5 text-sm font-semibold text-[var(--ms-plum)] hover:bg-[var(--ms-petal)]">
              <FileText className="h-4 w-4" /> Download PDF
            </button>
            <button type="button" className="flex items-center justify-center gap-2 rounded-full border border-[var(--ms-plum)] py-2.5 text-sm font-semibold text-[var(--ms-plum)] hover:bg-[var(--ms-petal)]">
              <FileText className="h-4 w-4" /> Download CSV
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Ads tab ────────────────────────────────────────────────────────────────

function AdsTab() {
  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5>(1);
  const [boostTarget, setBoostTarget] = useState<"profile" | "service">("profile");
  const [placements, setPlacements] = useState<string[]>([]);
  const [duration, setDuration] = useState<string>("");
  const [budget, setBudget] = useState(500);

  const togglePlacement = (p: string) =>
    setPlacements(prev => prev.includes(p) ? prev.filter(x => x !== p) : [...prev, p]);

  const PLACEMENTS = ["Home page feed", "Search results", "Explore page"];
  const DURATIONS = ["3 days", "7 days", "14 days", "30 days"];
  const estimatedReach = Math.round((budget / 10) * 18);
  const costPerDay = (budget / (parseInt(duration) || 7)).toFixed(0);

  return (
    <div className="space-y-5">
      {/* Active boosts */}
      <div className="rounded-[24px] border border-[var(--ms-border)] bg-white p-5 shadow-[0_2px_8px_rgba(13,27,42,0.04)]">
        <h2 className="mb-3 text-sm font-semibold text-[var(--ms-navy)]">Active boosts</h2>
        <div className="rounded-[16px] bg-[var(--ms-soft-bg)] px-4 py-8 text-center">
          <BarChart2 className="mx-auto h-8 w-8 text-[var(--ms-border)]" />
          <p className="mt-2 text-sm text-[var(--ms-mauve)]">No active boosts. Create one below.</p>
        </div>
      </div>

      {/* Create a boost wizard */}
      <div className="rounded-[24px] border border-[var(--ms-border)] bg-white p-5 shadow-[0_2px_8px_rgba(13,27,42,0.04)]">
        <h2 className="mb-1 text-sm font-semibold text-[var(--ms-navy)]">Create a boost</h2>
        <p className="mb-4 text-xs text-[var(--ms-mauve)]">Step {step} of 5</p>
        <div className="mb-5 flex gap-1.5">
          {[1, 2, 3, 4, 5].map(s => (
            <div key={s} className={cn("h-1.5 flex-1 rounded-full transition", s <= step ? "bg-[var(--ms-rose)]" : "bg-[var(--ms-border)]")} />
          ))}
        </div>

        {step === 1 && (
          <div className="space-y-3">
            <p className="text-xs font-semibold text-[var(--ms-mauve)]">What do you want to boost?</p>
            {[
              { key: "profile" as const, label: "My full profile", sub: "Show your entire salon to more clients" },
              { key: "service" as const, label: "A specific service", sub: "Highlight one service in search results" },
            ].map(opt => (
              <button key={opt.key} type="button" onClick={() => setBoostTarget(opt.key)}
                className={cn("flex w-full items-start gap-3 rounded-[16px] border p-4 text-left transition",
                  boostTarget === opt.key ? "border-[var(--ms-rose)] bg-[var(--ms-petal)]" : "border-[var(--ms-border)] hover:border-[var(--ms-rose)]/40")}>
                <div>
                  <p className="text-sm font-semibold text-[var(--ms-navy)]">{opt.label}</p>
                  <p className="text-xs text-[var(--ms-mauve)]">{opt.sub}</p>
                </div>
              </button>
            ))}
            <button type="button" onClick={() => setStep(2)} className="mt-2 w-full rounded-full bg-[var(--ms-plum)] py-3 text-sm font-semibold text-white hover:opacity-90">Next →</button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-3">
            <p className="text-xs font-semibold text-[var(--ms-mauve)]">Where do you want it to appear? (select all that apply)</p>
            {PLACEMENTS.map(p => (
              <button key={p} type="button" onClick={() => togglePlacement(p)}
                className={cn("flex w-full items-center gap-3 rounded-[16px] border px-4 py-3 text-left text-sm transition",
                  placements.includes(p) ? "border-[var(--ms-rose)] bg-[var(--ms-petal)] font-semibold text-[var(--ms-plum)]" : "border-[var(--ms-border)] text-[var(--ms-navy)] hover:border-[var(--ms-rose)]/40")}>
                <span className={cn("h-4 w-4 shrink-0 rounded border-2 transition flex items-center justify-center",
                  placements.includes(p) ? "border-[var(--ms-rose)] bg-[var(--ms-rose)]" : "border-[var(--ms-border)]")}>
                  {placements.includes(p) && <Check className="h-2.5 w-2.5 text-white" />}
                </span>
                {p}
              </button>
            ))}
            <div className="flex gap-2">
              <button type="button" onClick={() => setStep(1)} className="flex-1 rounded-full border border-[var(--ms-border)] py-3 text-sm font-semibold text-[var(--ms-mauve)] hover:text-[var(--ms-navy)]">← Back</button>
              <button type="button" onClick={() => setStep(3)} disabled={placements.length === 0} className="flex-1 rounded-full bg-[var(--ms-plum)] py-3 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-40">Next →</button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-3">
            <p className="text-xs font-semibold text-[var(--ms-mauve)]">How long should it run?</p>
            <div className="grid grid-cols-2 gap-2">
              {DURATIONS.map(d => (
                <button key={d} type="button" onClick={() => setDuration(d)}
                  className={cn("rounded-[16px] border py-3 text-sm font-medium transition",
                    duration === d ? "border-[var(--ms-rose)] bg-[var(--ms-petal)] font-semibold text-[var(--ms-plum)]" : "border-[var(--ms-border)] text-[var(--ms-navy)] hover:border-[var(--ms-rose)]/40")}>
                  {d}
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <button type="button" onClick={() => setStep(2)} className="flex-1 rounded-full border border-[var(--ms-border)] py-3 text-sm font-semibold text-[var(--ms-mauve)] hover:text-[var(--ms-navy)]">← Back</button>
              <button type="button" onClick={() => setStep(4)} disabled={!duration} className="flex-1 rounded-full bg-[var(--ms-plum)] py-3 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-40">Next →</button>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-4">
            <p className="text-xs font-semibold text-[var(--ms-mauve)]">Set your daily budget</p>
            <div className="rounded-[16px] bg-[var(--ms-soft-bg)] p-4 text-center">
              <p className="text-3xl font-bold text-[var(--ms-navy)]">KES {budget.toLocaleString()}</p>
              <p className="mt-1 text-xs text-[var(--ms-mauve)]">KES {costPerDay} / day · Reaches ~{estimatedReach.toLocaleString()} people</p>
            </div>
            <input type="range" min={200} max={10000} step={100} value={budget}
              onChange={(e) => setBudget(Number(e.target.value))}
              className="w-full accent-[var(--ms-rose)]" />
            <div className="flex justify-between text-[10px] text-[var(--ms-mauve)]">
              <span>KES 200</span><span>KES 10,000</span>
            </div>
            <div className="flex gap-2">
              <button type="button" onClick={() => setStep(3)} className="flex-1 rounded-full border border-[var(--ms-border)] py-3 text-sm font-semibold text-[var(--ms-mauve)] hover:text-[var(--ms-navy)]">← Back</button>
              <button type="button" onClick={() => setStep(5)} className="flex-1 rounded-full bg-[var(--ms-plum)] py-3 text-sm font-semibold text-white hover:opacity-90">Next →</button>
            </div>
          </div>
        )}

        {step === 5 && (
          <div className="space-y-4">
            <p className="text-xs font-semibold text-[var(--ms-mauve)]">Review and pay</p>
            <div className="rounded-[16px] border border-[var(--ms-border)] bg-[var(--ms-soft-bg)] p-4 space-y-2">
              {[
                ["Boost", boostTarget === "profile" ? "Full profile" : "Specific service"],
                ["Placements", placements.join(", ") || "—"],
                ["Duration", duration],
                ["Total budget", `KES ${budget.toLocaleString()}`],
              ].map(([k, v]) => (
                <div key={k} className="flex items-center justify-between py-1 border-b border-[var(--ms-border)] last:border-0">
                  <p className="text-xs text-[var(--ms-mauve)]">{k}</p>
                  <p className="text-xs font-semibold text-[var(--ms-navy)]">{v}</p>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <button type="button" onClick={() => setStep(4)} className="flex-1 rounded-full border border-[var(--ms-border)] py-3 text-sm font-semibold text-[var(--ms-mauve)] hover:text-[var(--ms-navy)]">← Back</button>
              <button type="button" className="flex-1 rounded-full bg-[linear-gradient(135deg,var(--ms-rose),var(--ms-orchid))] py-3 text-sm font-semibold text-white hover:opacity-90">Pay via M-Pesa</button>
            </div>
          </div>
        )}
      </div>

      {/* History */}
      <div className="rounded-[24px] border border-[var(--ms-border)] bg-white p-5 shadow-[0_2px_8px_rgba(13,27,42,0.04)]">
        <h2 className="mb-3 text-sm font-semibold text-[var(--ms-navy)]">History</h2>
        <div className="rounded-[16px] bg-[var(--ms-soft-bg)] px-4 py-6 text-center">
          <p className="text-sm text-[var(--ms-mauve)]">No past boosts yet.</p>
        </div>
      </div>
    </div>
  );
}

// ── Settings tab ───────────────────────────────────────────────────────────

function LogOutButton() {
  const router = useRouter();
  return (
    <button
      type="button"
      onClick={() => { clearAppSession(); router.push("/"); }}
      className="flex w-full items-center justify-center gap-2 rounded-full border border-red-200 py-3 text-sm font-semibold text-red-500 hover:bg-red-50"
    >
      <LogOut className="h-4 w-4" /> Log out
    </button>
  );
}

function SettingsTab() {
  const [reportOpen, setReportOpen] = useState(false);

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

      <div className="rounded-[24px] border border-[var(--ms-border)] bg-white p-5 shadow-[0_2px_8px_rgba(13,27,42,0.04)]">
        <h2 className="mb-1 text-sm font-semibold text-[var(--ms-navy)]">Monthly report</h2>
        <p className="mb-3 text-xs text-[var(--ms-mauve)]">Download a full breakdown of bookings, revenue, and payouts for any month.</p>
        <button
          type="button"
          onClick={() => setReportOpen(true)}
          className="flex w-full items-center justify-center gap-2 rounded-full border border-[var(--ms-plum)] py-2.5 text-sm font-semibold text-[var(--ms-plum)] hover:bg-[var(--ms-petal)]"
        >
          <FileText className="h-4 w-4" /> View monthly report
        </button>
      </div>

      <LogOutButton />

      {reportOpen && <MonthlyReportModal onClose={() => setReportOpen(false)} role="salon" />}
    </div>
  );
}

// ── Client preview modal ───────────────────────────────────────────────────

function ClientPreviewModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-[rgba(13,27,42,0.6)] backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 flex w-full max-w-2xl flex-col overflow-hidden rounded-t-[32px] bg-[var(--ms-soft-bg)] sm:rounded-[32px]" style={{ maxHeight: "90dvh" }}>
        {/* Preview header */}
        <div className="flex items-center justify-between border-b border-[var(--ms-border)] bg-white px-5 py-4">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--ms-rose)]">Preview mode</p>
            <p className="text-sm font-semibold text-[var(--ms-navy)]">How clients see your salon</p>
          </div>
          <button type="button" onClick={onClose} className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--ms-soft-bg)] text-[var(--ms-mauve)] hover:text-[var(--ms-navy)]">
            <X className="h-4 w-4" />
          </button>
        </div>
        {/* Mock client view */}
        <div className="overflow-y-auto p-5 space-y-4">
          <div className="h-40 w-full rounded-[20px] bg-gradient-to-br from-[var(--ms-plum)] to-[var(--ms-rose)] flex items-end p-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-white/70">Kilimani</p>
              <p className="text-2xl font-semibold text-white">Glam Studio</p>
            </div>
          </div>
          <div className="rounded-[20px] border border-[var(--ms-border)] bg-white p-4 space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--ms-mauve)]">Services</p>
            {["Hair styling · Ksh 800", "Braids · Ksh 2,500", "Make-up · Ksh 1,500"].map(s => (
              <div key={s} className="flex items-center justify-between py-1.5 border-b border-[var(--ms-border)] last:border-0">
                <p className="text-sm text-[var(--ms-navy)]">{s.split("·")[0]}</p>
                <p className="text-sm font-semibold text-[var(--ms-navy)]">{s.split("·")[1]}</p>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-3 rounded-[16px] border border-[var(--ms-border)] bg-amber-50 px-4 py-3">
            <Eye className="h-4 w-4 shrink-0 text-amber-600" />
            <p className="text-xs text-amber-700">All booking buttons are disabled in preview mode. Publish your listing to go live.</p>
          </div>
          <button disabled className="w-full rounded-full bg-[var(--ms-border)] py-3 text-sm font-semibold text-[var(--ms-mauve)] cursor-not-allowed">
            Book Now (preview only)
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Page ───────────────────────────────────────────────────────────────────

export default function SalonDashboardPage() {
  const [tab, setTab] = useState<Tab>("home");
  const [previewOpen, setPreviewOpen] = useState(false);
  const isVerified = false;

  const tabContent: Record<Tab, React.ReactNode> = {
    home: <HomeTab />,
    bookings: <BookingsTab />,
    salon: <MySalonTab />,
    earnings: <EarningsTab />,
    settings: <SettingsTab />,
    ads: <AdsTab />,
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
          <button
            type="button"
            onClick={() => setPreviewOpen(true)}
            className="flex items-center gap-2 rounded-full bg-[var(--ms-petal)] px-4 py-2 text-sm font-medium text-[var(--ms-plum)] hover:opacity-90"
          >
            <Eye className="h-4 w-4" /> Preview as client
          </button>
        </div>
      </header>

      {/* Unverified banner */}
      {!isVerified && (
        <div className="border-b border-amber-200 bg-amber-50">
          <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-2.5 lg:px-6">
            <ShieldCheck className="h-4 w-4 shrink-0 text-amber-500" />
            <p className="flex-1 text-xs text-amber-800">
              Your account is not verified. Unverified accounts rank lower in search.{" "}
              <button type="button" className="font-semibold underline hover:no-underline">
                Verify now →
              </button>
            </p>
          </div>
        </div>
      )}

      {/* Body */}
      <div className="mx-auto flex max-w-7xl gap-6 px-4 pb-32 pt-6 lg:px-6 lg:pb-12">
        <TabBar active={tab} onChange={setTab} />
        <main className="min-w-0 flex-1">
          {tabContent[tab]}
        </main>
      </div>

      {previewOpen && <ClientPreviewModal onClose={() => setPreviewOpen(false)} />}
    </div>
  );
}
