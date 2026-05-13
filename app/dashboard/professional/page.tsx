"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  BarChart2,
  Banknote,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  Eye,
  FileText,
  Home,
  LogOut,
  MapPin,
  Pencil,
  Plus,
  Settings,
  ShieldCheck,
  Star,
  ToggleLeft,
  ToggleRight,
  X,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { ImageUploadEditor } from "@/components/image-upload-editor";
import { clearAppSession, readAppSession, APP_SESSION_EVENT } from "@/lib/client-session";
import { ServiceTimerCard } from "@/components/service-session";
import {
  getIncomingBookings,
  updateBookingStatus,
  SOCIAL_CHANGE_EVENT,
  type BookingRequest,
} from "@/lib/social-store";

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

type Tab = "home" | "bookings" | "profile" | "earnings" | "settings" | "ads";
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
    { key: "profile", label: "My Profile", icon: <Star className="h-5 w-5" /> },
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

const OPEN_GIGS = [
  { id: "g1", salon: "Glam Studio Westlands", service: "Braiding specialist", date: "Sat 17 May", fee: "Ksh 3,500", applied: 2 },
  { id: "g2", salon: "Naturelle Salon Karen", service: "Locs retouch", date: "Sun 18 May", fee: "Ksh 2,800", applied: 0 },
];

function HomeTab({ onNavigate }: { onNavigate?: (tab: Tab) => void }) {
  const [appliedGigs, setAppliedGigs] = useState<string[]>([]);
  const [myApplications, setMyApplications] = useState([
    { salon: "Zara Hair Studio", date: "May 10", status: "Pending" },
    { salon: "Bella Naturals", date: "May 7", status: "Accepted" },
  ]);

  const nudges: { icon: React.ReactNode; label: string; tab?: Tab }[] = [
    { icon: <Star className="h-4 w-4" />, label: "Add portfolio photos", tab: "profile" },
    { icon: <ShieldCheck className="h-4 w-4" />, label: "Get verified", tab: "settings" },
    { icon: <Clock className="h-4 w-4" />, label: "Set your availability", tab: "profile" },
  ];

  function applyForGig(gig: typeof OPEN_GIGS[number]) {
    setAppliedGigs(prev => [...prev, gig.id]);
    setMyApplications(prev => [...prev, { salon: gig.salon, date: "Today", status: "Pending" }]);
  }

  return (
    <div className="space-y-6">
      {/* ── Active session timer ── */}
      <ServiceTimerCard />

      {/* Profile nudge pills */}
      <div className="flex flex-wrap gap-2">
        {nudges.map((n) => (
          <button
            key={n.label}
            type="button"
            onClick={() => n.tab && onNavigate?.(n.tab)}
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

      {/* Open gig requests */}
      <div className="rounded-[24px] border border-[var(--ms-border)] bg-white p-5 shadow-[0_2px_8px_rgba(13,27,42,0.04)]">
        <h2 className="mb-1 text-base font-semibold text-[var(--ms-navy)]">Open gig requests</h2>
        <p className="mb-4 text-xs text-[var(--ms-mauve)]">Verified salons looking for professionals.</p>
        <div className="space-y-3">
          {OPEN_GIGS.map((gig) => {
            const hasApplied = appliedGigs.includes(gig.id);
            return (
              <div key={gig.id} className="rounded-[16px] border border-[var(--ms-border)] bg-[var(--ms-soft-bg)] p-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="truncate text-sm font-semibold text-[var(--ms-navy)]">{gig.salon}</p>
                      <span className="shrink-0 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">Verified ✓</span>
                    </div>
                    <p className="mt-0.5 text-xs text-[var(--ms-mauve)]">{gig.service} · {gig.date}</p>
                    {gig.applied > 0 && (
                      <p className="mt-1 text-[10px] text-[var(--ms-mauve)]">{gig.applied + (hasApplied ? 1 : 0)} {(gig.applied + (hasApplied ? 1 : 0)) === 1 ? "person" : "people"} applied</p>
                    )}
                  </div>
                  <p className="shrink-0 text-sm font-bold text-[var(--ms-navy)]">{gig.fee}</p>
                </div>
                <button
                  type="button"
                  disabled={hasApplied}
                  onClick={() => applyForGig(gig)}
                  className={cn(
                    "mt-3 w-full rounded-full py-2 text-xs font-semibold transition",
                    hasApplied
                      ? "bg-emerald-100 text-emerald-700 cursor-default"
                      : "bg-[linear-gradient(135deg,var(--ms-rose),var(--ms-orchid))] text-white hover:opacity-90",
                  )}
                >
                  {hasApplied ? "✓ Application sent" : "Apply for this gig"}
                </button>
              </div>
            );
          })}
        </div>
        <div className="mt-4 rounded-[16px] border border-[var(--ms-border)] bg-[var(--ms-soft-bg)] p-4">
          <h3 className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--ms-mauve)]">My applications</h3>
          <div className="space-y-2">
            {myApplications.map((app, i) => (
              <div key={i} className="flex items-center justify-between py-1.5">
                <div>
                  <p className="text-sm text-[var(--ms-navy)]">{app.salon}</p>
                  <p className="text-xs text-[var(--ms-mauve)]">{app.date}</p>
                </div>
                <span className={cn(
                  "rounded-full px-2.5 py-1 text-xs font-semibold",
                  app.status === "Accepted" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700",
                )}>
                  {app.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Bookings tab ───────────────────────────────────────────────────────────

function BookingsTab({ proSlug }: { proSlug: string }) {
  const [realIncoming, setRealIncoming] = useState<BookingRequest[]>([]);
  const [mockIncoming, setMockIncoming] = useState(INCOMING);
  const [upcoming, setUpcoming] = useState(UPCOMING);
  const [todaySchedule, setTodaySchedule] = useState(TODAY_SCHEDULE);

  // Sync real bookings from social store
  useEffect(() => {
    function sync() {
      setRealIncoming(getIncomingBookings(proSlug));
    }
    sync();
    window.addEventListener(SOCIAL_CHANGE_EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(SOCIAL_CHANGE_EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, [proSlug]);

  function acceptReal(id: string) {
    updateBookingStatus(id, "accepted");
  }

  function declineReal(id: string) {
    updateBookingStatus(id, "declined");
  }

  function acceptMock(id: number) {
    const req = mockIncoming.find(r => r.id === id);
    if (req) {
      setUpcoming(prev => [...prev, req]);
    }
    setMockIncoming(prev => prev.filter(r => r.id !== id));
  }

  function declineMock(id: number) {
    setMockIncoming(prev => prev.filter(r => r.id !== id));
  }

  function markUpcomingComplete(id: number) {
    setUpcoming(prev => prev.filter(r => r.id !== id));
  }

  function markTodayComplete(id: number) {
    setTodaySchedule(prev => prev.map(b => b.id === id ? { ...b, status: "completed" } : b));
  }

  const totalIncoming = realIncoming.length + mockIncoming.length;

  return (
    <div className="space-y-6">
      {/* Incoming */}
      <div className="rounded-[24px] border border-amber-200 bg-amber-50 p-5">
        <h2 className="mb-4 text-sm font-semibold text-amber-800">Incoming requests ({totalIncoming})</h2>
        <div className="space-y-3">
          {totalIncoming === 0 && (
            <p className="rounded-[14px] bg-amber-100/50 px-4 py-5 text-center text-sm text-amber-700">
              All requests handled ✓
            </p>
          )}
          {/* Real bookings from clients */}
          {realIncoming.map((b) => (
            <div key={b.id} className="flex items-start justify-between gap-3 rounded-[16px] bg-white p-4 shadow-[0_1px_4px_rgba(13,27,42,0.06)]">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-[var(--ms-petal)] px-2 py-0.5 text-[10px] font-semibold text-[var(--ms-rose)]">NEW</span>
                  <p className="truncate text-sm font-semibold text-[var(--ms-navy)]">{b.clientName}</p>
                </div>
                <p className="mt-0.5 truncate text-xs text-[var(--ms-mauve)]">{b.services.join(", ")}</p>
                <p className="mt-0.5 text-xs text-[var(--ms-mauve)]">
                  {new Date(b.preferredDate).toLocaleDateString("en-KE", { weekday: "short", month: "short", day: "numeric" })} · {b.preferredTime} · Ksh {b.totalKES.toLocaleString()}
                </p>
                {b.notes && <p className="mt-1 text-xs italic text-[var(--ms-mauve)]">"{b.notes}"</p>}
              </div>
              <div className="flex shrink-0 gap-2">
                <button type="button" onClick={() => acceptReal(b.id)} className="rounded-full bg-emerald-100 px-3 py-1.5 text-xs font-semibold text-emerald-700 hover:bg-emerald-200">
                  Accept
                </button>
                <button type="button" onClick={() => declineReal(b.id)} className="rounded-full bg-red-100 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-200">
                  Decline
                </button>
              </div>
            </div>
          ))}
          {/* Demo mock bookings */}
          {mockIncoming.map((b) => (
            <div key={b.id} className="flex items-center justify-between rounded-[16px] bg-white p-4 shadow-[0_1px_4px_rgba(13,27,42,0.06)]">
              <div>
                <p className="text-sm font-medium text-[var(--ms-navy)]">{b.client} · {b.service}</p>
                <p className="mt-0.5 text-xs text-[var(--ms-mauve)]">{b.time} · {b.total}</p>
              </div>
              <div className="flex gap-2">
                <button type="button" onClick={() => acceptMock(b.id)} className="rounded-full bg-emerald-100 px-3 py-1.5 text-xs font-semibold text-emerald-700 hover:bg-emerald-200">
                  Accept
                </button>
                <button type="button" onClick={() => declineMock(b.id)} className="rounded-full bg-red-100 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-200">
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
          {upcoming.length === 0 && (
            <p className="py-4 text-center text-sm text-[var(--ms-mauve)]">No upcoming bookings.</p>
          )}
          {upcoming.map((b) => (
            <div key={b.id} className="flex items-center justify-between py-3">
              <div>
                <p className="text-sm font-medium text-[var(--ms-navy)]">{b.client} · {b.service}</p>
                <p className="mt-0.5 text-xs text-[var(--ms-mauve)]">{b.time} · {b.total}</p>
              </div>
              <button type="button" onClick={() => markUpcomingComplete(b.id)} className="rounded-full bg-[var(--ms-rose)] px-3 py-1.5 text-xs font-semibold text-white hover:opacity-90">
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
          {todaySchedule.map((b) => (
            <div key={b.id} className="flex items-center justify-between py-3">
              <div>
                <p className="text-sm font-medium text-[var(--ms-navy)]">{b.client} · {b.service}</p>
                <p className="mt-0.5 text-xs text-[var(--ms-mauve)]">Today, {b.time}</p>
              </div>
              <div className="flex items-center gap-2">
                <StatusPill status={b.status} />
                {b.status === "in-progress" && (
                  <button type="button" onClick={() => markTodayComplete(b.id)} className="rounded-full bg-[var(--ms-rose)] px-3 py-1.5 text-xs font-semibold text-white hover:opacity-90">
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
  const [serviceOccasions, setServiceOccasions] = useState<Record<string, string[]>>({});
  const [expandedServiceId, setExpandedServiceId] = useState<string | null>(null);
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const [activeDays, setActiveDays] = useState(["Mon", "Tue", "Wed", "Thu", "Fri"]);
  const [profilePhoto, setProfilePhoto] = useState<string | undefined>();
  const [portfolioPhotos, setPortfolioPhotos] = useState<(string | undefined)[]>(Array(3).fill(undefined));
  type PortfolioMeta = { services: string[]; description: string };
  const [portfolioMeta, setPortfolioMeta] = useState<PortfolioMeta[]>(
    Array(3).fill(null).map(() => ({ services: [], description: "" }))
  );

  const [showAddService, setShowAddService] = useState(false);
  const [newServiceName, setNewServiceName] = useState("");
  const [newServiceCategory, setNewServiceCategory] = useState("Hair");
  const [newServicePrice, setNewServicePrice] = useState("");
  const [newServiceDuration, setNewServiceDuration] = useState("");
  const [newServiceProducts, setNewServiceProducts] = useState("");
  const [identitySaved, setIdentitySaved] = useState(false);
  const [availabilitySaved, setAvailabilitySaved] = useState(false);
  const [workStyle, setWorkStyle] = useState<string>("Mobile");

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
            <ImageUploadEditor
              label="Profile photo"
              requirements="JPG or PNG · min 400 × 400 px · max 3 MB"
              aspectHint="Square 1:1 — your face clearly visible"
              maxMB={3}
              value={profilePhoto}
              onSave={setProfilePhoto}
            />
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
                    onClick={() => setWorkStyle(opt)}
                    className={cn(
                      "rounded-full border px-4 py-2 text-sm font-medium transition",
                      workStyle === opt
                        ? "border-[var(--ms-rose)] bg-[var(--ms-petal)] text-[var(--ms-plum)] font-semibold"
                        : "border-[var(--ms-border)] text-[var(--ms-mauve)] hover:border-[var(--ms-rose)] hover:text-[var(--ms-rose)]",
                    )}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
            <button type="button"
              onClick={() => { setIdentitySaved(true); setTimeout(() => setIdentitySaved(false), 2200); }}
              className="w-full rounded-full bg-[linear-gradient(135deg,var(--ms-rose),var(--ms-orchid))] py-3 text-sm font-semibold text-white hover:opacity-90">
              {identitySaved ? "✓ Saved!" : "Save identity"}
            </button>
          </div>
        </div>
      )}

      {/* Services */}
      {section === "services" && (
        <div className="rounded-[24px] border border-[var(--ms-border)] bg-white p-5 shadow-[0_2px_8px_rgba(13,27,42,0.04)]">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-[var(--ms-navy)]">Your services</h2>
            <button type="button"
              onClick={() => { setShowAddService(true); setNewServiceName(""); setNewServicePrice(""); setNewServiceDuration(""); setNewServiceProducts(""); }}
              className="flex items-center gap-1.5 rounded-full bg-[var(--ms-rose)] px-4 py-2 text-xs font-semibold text-white hover:opacity-90">
              <Plus className="h-3.5 w-3.5" /> Add service
            </button>
          </div>
          {showAddService && (
            <div className="mb-4 rounded-[18px] border border-[var(--ms-border)] bg-[var(--ms-soft-bg)] p-4 space-y-3">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--ms-mauve)]">New service</p>
              <div>
                <label className="mb-1 block text-xs font-semibold text-[var(--ms-mauve)]">Service name</label>
                <input type="text" value={newServiceName} onChange={e => setNewServiceName(e.target.value)}
                  placeholder="e.g. Gel Manicure"
                  className="w-full rounded-[12px] border border-[var(--ms-border)] bg-white px-4 py-2.5 text-sm text-[var(--ms-navy)] outline-none focus:border-[var(--ms-rose)]" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-xs font-semibold text-[var(--ms-mauve)]">Specialty</label>
                  <input type="text" value={newServiceCategory} onChange={e => setNewServiceCategory(e.target.value)}
                    placeholder="e.g. Hair"
                    className="w-full rounded-[12px] border border-[var(--ms-border)] bg-white px-4 py-2.5 text-sm text-[var(--ms-navy)] outline-none focus:border-[var(--ms-rose)]" />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold text-[var(--ms-mauve)]">Price (Ksh)</label>
                  <input type="text" value={newServicePrice} onChange={e => setNewServicePrice(e.target.value)}
                    placeholder="e.g. 2,500"
                    className="w-full rounded-[12px] border border-[var(--ms-border)] bg-white px-4 py-2.5 text-sm text-[var(--ms-navy)] outline-none focus:border-[var(--ms-rose)]" />
                </div>
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold text-[var(--ms-mauve)]">Duration</label>
                <input type="text" value={newServiceDuration} onChange={e => setNewServiceDuration(e.target.value)}
                  placeholder="e.g. 1h 30min"
                  className="w-full rounded-[12px] border border-[var(--ms-border)] bg-white px-4 py-2.5 text-sm text-[var(--ms-navy)] outline-none focus:border-[var(--ms-rose)]" />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold text-[var(--ms-mauve)]">Products used (optional)</label>
                <input type="text" value={newServiceProducts} onChange={e => setNewServiceProducts(e.target.value)}
                  placeholder="e.g. Cantu Leave-in, Shea Moisture"
                  className="w-full rounded-[12px] border border-[var(--ms-border)] bg-white px-4 py-2.5 text-sm text-[var(--ms-navy)] outline-none focus:border-[var(--ms-rose)]" />
              </div>
              <div className="flex gap-2">
                <button type="button"
                  disabled={!newServiceName.trim() || !newServicePrice.trim() || !newServiceDuration.trim()}
                  onClick={() => {
                    if (!newServiceName.trim()) return;
                    setServices(prev => [...prev, { id: `ps${Date.now()}`, name: newServiceName.trim(), price: `Ksh ${newServicePrice.trim()}`, duration: newServiceDuration.trim(), products: newServiceProducts.trim() || "None", active: true }]);
                    setShowAddService(false);
                  }}
                  className="flex-1 rounded-full bg-[var(--ms-rose)] py-2.5 text-sm font-semibold text-white disabled:opacity-40 hover:opacity-90">
                  Save service
                </button>
                <button type="button" onClick={() => setShowAddService(false)}
                  className="rounded-full border border-[var(--ms-border)] px-5 py-2.5 text-sm font-semibold text-[var(--ms-mauve)] hover:text-[var(--ms-navy)]">
                  Cancel
                </button>
              </div>
            </div>
          )}
          <div className="space-y-3">
            {services.map((s) => {
              const isExpanded = expandedServiceId === s.id;
              const selectedOccasions = serviceOccasions[s.id] ?? [];
              return (
                <div key={s.id} className="rounded-[16px] border border-[var(--ms-border)] bg-[var(--ms-soft-bg)] p-4">
                  <div className="flex items-start justify-between gap-2">
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
                        <p className="mt-0.5 text-xs text-[var(--ms-mauve)]">{s.price} · {s.duration}</p>
                        <p className="mt-0.5 text-xs text-[var(--ms-mauve)]">Products: {s.products}</p>
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
                      className={cn("shrink-0 transition", s.active ? "text-emerald-600" : "text-slate-300")}
                    >
                      {s.active ? <ToggleRight className="h-7 w-7" /> : <ToggleLeft className="h-7 w-7" />}
                    </button>
                  </div>
                  {/* Occasion tags — expandable */}
                  {isExpanded && (
                    <div className="ml-6 mt-3 rounded-[14px] border border-[var(--ms-border)] bg-white p-4">
                      <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--ms-mauve)]">
                        Perfect for which occasion?
                      </p>
                      <p className="mb-3 text-xs text-[var(--ms-mauve)]">
                        Help clients find you when they are planning for these moments.
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

      {/* Portfolio */}
      {section === "portfolio" && (
        <div className="rounded-[24px] border border-[var(--ms-border)] bg-white p-5 shadow-[0_2px_8px_rgba(13,27,42,0.04)]">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-[var(--ms-navy)]">Portfolio</h2>
            <button type="button"
              onClick={() => {
                if (portfolioPhotos.length >= 12) return;
                setPortfolioPhotos(prev => [...prev, undefined]);
                setPortfolioMeta(prev => [...prev, { services: [], description: "" }]);
              }}
              className="flex items-center gap-1.5 rounded-full bg-[var(--ms-rose)] px-4 py-2 text-xs font-semibold text-white hover:opacity-90">
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
          <button
            type="button"
            onClick={() => { setAvailabilitySaved(true); setTimeout(() => setAvailabilitySaved(false), 2200); }}
            className="mt-4 w-full rounded-full bg-[linear-gradient(135deg,var(--ms-rose),var(--ms-orchid))] py-3 text-sm font-semibold text-white hover:opacity-90"
          >
            {availabilitySaved ? "✓ Availability saved!" : "Save availability"}
          </button>
        </div>
      )}
    </div>
  );
}

// ── Earnings tab ───────────────────────────────────────────────────────────

function EarningsTab() {
  const [withdrawn, setWithdrawn] = useState(false);

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

      <button
        type="button"
        onClick={() => { setWithdrawn(true); setTimeout(() => setWithdrawn(false), 3000); }}
        className="w-full rounded-full bg-[linear-gradient(135deg,var(--ms-rose),var(--ms-orchid))] py-3.5 text-sm font-semibold text-white shadow-[0_8px_20px_rgba(232,62,140,0.2)] hover:opacity-90"
      >
        {withdrawn ? "Request sent — M-Pesa notification incoming" : "Withdraw to M-Pesa"}
      </button>
    </div>
  );
}

// ── Monthly report modal ───────────────────────────────────────────────────

function MonthlyReportModal({ onClose, role }: { onClose: () => void; role: "salon" | "professional" }) {
  const [monthIndex, setMonthIndex] = useState(0);
  const [downloading, setDownloading] = useState<"pdf" | "csv" | null>(null);
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
            <button type="button"
              onClick={() => { setDownloading("pdf"); setTimeout(() => setDownloading(null), 2000); }}
              className="flex items-center justify-center gap-2 rounded-full border border-[var(--ms-plum)] py-2.5 text-sm font-semibold text-[var(--ms-plum)] hover:bg-[var(--ms-petal)]">
              {downloading === "pdf" ? "Preparing PDF..." : <><FileText className="h-4 w-4" /> Download PDF</>}
            </button>
            <button type="button"
              onClick={() => { setDownloading("csv"); setTimeout(() => setDownloading(null), 2000); }}
              className="flex items-center justify-center gap-2 rounded-full border border-[var(--ms-plum)] py-2.5 text-sm font-semibold text-[var(--ms-plum)] hover:bg-[var(--ms-petal)]">
              {downloading === "csv" ? "Preparing CSV..." : <><FileText className="h-4 w-4" /> Download CSV</>}
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
  const [notifications, setNotifications] = useState({
    "Booking requests": true,
    "Booking confirmations": true,
    "Payment releases": true,
    "Weekly summary": false,
  });

  function toggleNotification(label: string) {
    setNotifications(prev => ({ ...prev, [label]: !prev[label as keyof typeof prev] }));
  }

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
        {(Object.keys(notifications) as Array<keyof typeof notifications>).map((label) => (
          <div key={label} className="flex items-center justify-between py-2.5">
            <p className="text-sm text-[var(--ms-navy)]">{label}</p>
            <button type="button" onClick={() => toggleNotification(label)} className={cn("transition", notifications[label] ? "text-emerald-600" : "text-slate-300")}>
              {notifications[label] ? <ToggleRight className="h-7 w-7" /> : <ToggleLeft className="h-7 w-7" />}
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

      {reportOpen && <MonthlyReportModal onClose={() => setReportOpen(false)} role="professional" />}
    </div>
  );
}

// ── Client preview modal ───────────────────────────────────────────────────

function ClientPreviewModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[9990] flex items-center justify-center bg-[rgba(13,27,42,0.60)] backdrop-blur-sm p-4">
      <div className="relative w-full max-w-sm rounded-[28px] bg-white p-6 shadow-xl">
        <button
          type="button"
          onClick={onClose}
          aria-label="Close preview"
          className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-[var(--ms-soft-bg)] text-[var(--ms-mauve)] hover:text-[var(--ms-navy)]"
        >
          <X className="h-4 w-4" />
        </button>
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[var(--ms-petal)]">
          <Eye className="h-5 w-5 text-[var(--ms-plum)]" />
        </div>
        <h2 className="text-lg font-semibold text-[var(--ms-plum)]">Client view</h2>
        <p className="mt-2 text-sm leading-6 text-[var(--ms-mauve)]">
          This is how clients see your public profile. Tap below to open a live preview in a new tab.
        </p>
        <Link
          href="/professionals/preview"
          target="_blank"
          className="mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-[var(--ms-plum)] py-3 text-sm font-semibold text-white hover:opacity-90"
        >
          <Eye className="h-4 w-4" /> Open client preview
        </Link>
      </div>
    </div>
  );
}

// ── Page ───────────────────────────────────────────────────────────────────

export default function ProfessionalDashboardPage() {
  const [tab, setTab] = useState<Tab>("home");
  const [previewOpen, setPreviewOpen] = useState(false);
  const [proSlug, setProSlug] = useState("njeri-kamau"); // fallback to demo slug
  const isVerified = false;

  useEffect(() => {
    function syncSlug() {
      const session = readAppSession();
      if (session?.role === "professional" && session.publicSlug) {
        setProSlug(session.publicSlug);
      }
    }
    syncSlug();
    window.addEventListener(APP_SESSION_EVENT, syncSlug);
    return () => window.removeEventListener(APP_SESSION_EVENT, syncSlug);
  }, []);

  const tabContent: Record<Tab, React.ReactNode> = {
    home: <HomeTab onNavigate={setTab} />,
    bookings: <BookingsTab proSlug={proSlug} />,
    profile: <MyProfileTab />,
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
            <p className="text-xs uppercase tracking-[0.18em] text-[var(--ms-mauve)]">Professional Dashboard</p>
            <p className="mt-0.5 text-lg font-semibold text-[var(--ms-navy)]">Njeri Kamau</p>
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
