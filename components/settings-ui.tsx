"use client";

import Link from "next/link";
import { useEffect, useState, useCallback, type ReactNode } from "react";
import {
  AlertTriangle,
  Bell,
  BellOff,
  BookOpen,
  ChevronRight,
  Database,
  Download,
  Eye,
  EyeOff,
  FileText,
  HelpCircle,
  Info,
  Languages,
  LayoutGrid,
  Lock,
  LogOut,
  MessageCircle,
  Monitor,
  Moon,
  Package,
  Palette,
  Phone,
  Repeat2,
  Shield,
  ShieldCheck,
  ShieldOff,
  ShoppingBag,
  Smartphone,
  Sparkles,
  Sun,
  Trash2,
  Type,
  User,
  UserCog,
  UserX,
  Users,
  Volume2,
  WifiOff,
  X,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  readSettings,
  writeSettings,
  setSetting,
  SETTINGS_CHANGE_EVENT,
  type AppSettings,
} from "@/lib/settings-store";
import {
  APP_SESSION_EVENT,
  readAppSession,
  clearAppSession,
  type AppUserSession,
} from "@/lib/client-session";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getDisplayName(session: AppUserSession | null): string {
  if (!session) return "Guest";
  if (session.role === "client")       return (session as { firstName: string }).firstName;
  if (session.role === "professional") return (session as { displayName: string }).displayName;
  if (session.role === "salon")        return (session as { salonName: string }).salonName;
  return "Guest";
}

function getAccountLabel(session: AppUserSession | null): string {
  if (!session || session.role === "guest") return "Not signed in";
  if (session.role === "client")       return "Client account";
  if (session.role === "professional") return "Professional account";
  if (session.role === "salon")        return "Salon account";
  return "";
}

// ─── Toggle ───────────────────────────────────────────────────────────────────

function Toggle({
  on,
  onChange,
  disabled = false,
}: {
  on: boolean;
  onChange: (next: boolean) => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      disabled={disabled}
      onClick={() => onChange(!on)}
      className={cn(
        "relative inline-flex h-[26px] w-[46px] shrink-0 items-center rounded-full border-2 transition-colors duration-200",
        on
          ? "border-[var(--ms-plum)] bg-[var(--ms-plum)]"
          : "border-[var(--ms-border)] bg-[var(--ms-soft-bg)]",
        disabled && "cursor-not-allowed opacity-40",
      )}
    >
      <span
        className={cn(
          "inline-block h-[18px] w-[18px] rounded-full bg-white shadow-sm transition-transform duration-200",
          on ? "translate-x-[22px]" : "translate-x-[2px]",
        )}
      />
    </button>
  );
}

// ─── Select pill ──────────────────────────────────────────────────────────────

function SelectPill<T extends string>({
  value,
  options,
  onChange,
}: {
  value: T;
  options: { value: T; label: string }[];
  onChange: (v: T) => void;
}) {
  return (
    <div className="flex gap-1">
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          onClick={() => onChange(o.value)}
          className={cn(
            "rounded-full px-3 py-1 text-[11px] font-semibold transition",
            o.value === value
              ? "bg-[var(--ms-plum)] text-white"
              : "bg-[var(--ms-soft-bg)] text-[var(--ms-mauve)] hover:text-[var(--ms-navy)]",
          )}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

// ─── Section wrapper ──────────────────────────────────────────────────────────

function Section({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div>
      <p className="mb-2 px-1 text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--ms-mauve)]">
        {title}
      </p>
      <div className="overflow-hidden rounded-[18px] bg-white shadow-[0_1px_6px_rgba(13,27,42,0.06)]">
        {children}
      </div>
    </div>
  );
}

// ─── Row variants ─────────────────────────────────────────────────────────────

interface RowBase {
  icon: React.ElementType<{ className?: string; strokeWidth?: number }>;
  label: string;
  sub?: string;
  danger?: boolean;
  iconBg?: string;
}

interface ToggleRow extends RowBase {
  kind: "toggle";
  on: boolean;
  onChange: (v: boolean) => void;
  disabled?: boolean;
}

interface LinkRow extends RowBase {
  kind: "link";
  href?: string;
  onClick?: () => void;
  value?: string;
}

interface SelectRow extends RowBase {
  kind: "select";
  value: string;
  options: { value: string; label: string }[];
  onChange: (v: string) => void;
}

type RowDef = ToggleRow | LinkRow | SelectRow;

function Row({ def, last }: { def: RowDef; last: boolean }) {
  const Icon = def.icon;

  const iconBg =
    def.iconBg ??
    (def.danger ? "bg-red-50" : "bg-[var(--ms-soft-bg)]");
  const iconColor = def.danger ? "text-red-500" : "text-[var(--ms-mauve)]";

  const inner = (
    <div
      className={cn(
        "flex items-center gap-3.5 px-4 py-3.5",
        !last && "border-b border-[var(--ms-border)]/60",
      )}
    >
      {/* Icon */}
      <span
        className={cn(
          "flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px]",
          iconBg,
        )}
      >
        <Icon
          className={cn("h-[18px] w-[18px]", iconColor)}
          strokeWidth={1.85}
        />
      </span>

      {/* Label + sub */}
      <div className="min-w-0 flex-1">
        <p
          className={cn(
            "text-[14px] font-semibold leading-snug",
            def.danger ? "text-red-500" : "text-[var(--ms-navy)]",
          )}
        >
          {def.label}
        </p>
        {def.sub && (
          <p className="mt-0.5 text-[11px] leading-4 text-[var(--ms-mauve)]">{def.sub}</p>
        )}
      </div>

      {/* Right element */}
      {def.kind === "toggle" && (
        <Toggle on={def.on} onChange={def.onChange} disabled={def.disabled} />
      )}
      {def.kind === "link" && (
        <div className="flex shrink-0 items-center gap-1.5">
          {def.value && (
            <span className="text-[12px] text-[var(--ms-mauve)]">{def.value}</span>
          )}
          <ChevronRight className="h-4 w-4 text-[var(--ms-border)]" />
        </div>
      )}
      {def.kind === "select" && (
        <SelectPill
          value={def.value}
          options={def.options}
          onChange={def.onChange}
        />
      )}
    </div>
  );

  if (def.kind === "link") {
    if (def.href) {
      return (
        <Link href={def.href} className="block transition hover:bg-[var(--ms-soft-bg)]/50">
          {inner}
        </Link>
      );
    }
    return (
      <button
        type="button"
        onClick={def.onClick}
        className="w-full text-left transition hover:bg-[var(--ms-soft-bg)]/50"
      >
        {inner}
      </button>
    );
  }

  return <div>{inner}</div>;
}

function RowGroup({ rows }: { rows: RowDef[] }) {
  return (
    <>
      {rows.map((def, i) => (
        <Row key={def.label} def={def} last={i === rows.length - 1} />
      ))}
    </>
  );
}

// ─── 18+ Age verification modal ───────────────────────────────────────────────

function AgeVerifyModal({
  onConfirm,
  onCancel,
}: {
  onConfirm: (dob: string) => void;
  onCancel: () => void;
}) {
  const [dob, setDob] = useState("");
  const [error, setError] = useState("");

  function verify() {
    if (!dob) { setError("Please enter your date of birth."); return; }
    const birth = new Date(dob);
    const today = new Date();
    const age = today.getFullYear() - birth.getFullYear() -
      (today < new Date(today.getFullYear(), birth.getMonth(), birth.getDate()) ? 1 : 0);
    if (isNaN(age) || age < 18) {
      setError("You must be 18 or older to view adult products.");
      return;
    }
    setError("");
    onConfirm(dob);
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 backdrop-blur-sm sm:items-center"
      onClick={onCancel}
    >
      <div
        className="w-full max-w-sm overflow-hidden rounded-t-[28px] bg-white sm:rounded-[28px]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mx-auto mt-3 h-1 w-10 rounded-full bg-[var(--ms-border)]" />
        <div className="p-6">
          {/* Header */}
          <div className="mb-5 flex items-start justify-between gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-[14px] bg-[var(--ms-soft-bg)]">
              <ShieldCheck className="h-6 w-6 text-[var(--ms-plum)]" strokeWidth={1.85} />
            </div>
            <button type="button" onClick={onCancel} className="mt-1 rounded-full p-1 text-[var(--ms-mauve)] hover:bg-[var(--ms-soft-bg)]">
              <X className="h-4 w-4" />
            </button>
          </div>

          <h2 className="text-[18px] font-bold text-[var(--ms-navy)]">Confirm your age</h2>
          <p className="mt-1.5 text-[13px] leading-5 text-[var(--ms-mauve)]">
            Adult products on Counter are intended for people aged 18 and above only.
            Please confirm your date of birth to continue.
          </p>

          <div className="mt-5">
            <label className="mb-1.5 block text-[12px] font-semibold text-[var(--ms-navy)]">
              Date of birth
            </label>
            <input
              type="date"
              value={dob}
              onChange={(e) => { setDob(e.target.value); setError(""); }}
              max={new Date(new Date().setFullYear(new Date().getFullYear() - 18))
                .toISOString()
                .split("T")[0]}
              className="w-full rounded-[14px] border border-[var(--ms-border)] bg-[var(--ms-soft-bg)] px-4 py-3 text-[14px] text-[var(--ms-navy)] outline-none focus:border-[var(--ms-plum)] transition"
            />
            {error && (
              <p className="mt-2 flex items-center gap-1.5 text-[12px] text-red-500">
                <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
                {error}
              </p>
            )}
          </div>

          <div className="mt-2 rounded-[12px] bg-amber-50 px-4 py-3">
            <p className="text-[11px] leading-5 text-amber-700">
              <strong>For adults aged 18+ only.</strong> By confirming, you certify that you are 18 years of age or older. This preference is stored on this device only.
            </p>
          </div>

          <div className="mt-5 flex gap-3">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 rounded-full border border-[var(--ms-border)] py-3 text-[13px] font-semibold text-[var(--ms-navy)]"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={verify}
              className="flex-1 rounded-full bg-[var(--ms-plum)] py-3 text-[13px] font-bold text-white transition hover:brightness-110"
            >
              Confirm age
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Sign-out confirmation ────────────────────────────────────────────────────

function SignOutConfirm({ onConfirm, onCancel }: { onConfirm: () => void; onCancel: () => void }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-6"
      onClick={onCancel}
    >
      <div
        className="w-full max-w-sm rounded-[24px] bg-white p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-[16px] font-bold text-[var(--ms-navy)]">Sign out?</h3>
        <p className="mt-1.5 text-[13px] text-[var(--ms-mauve)]">
          You can sign back in anytime. Your data stays safe.
        </p>
        <div className="mt-5 flex gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 rounded-full border border-[var(--ms-border)] py-3 text-[13px] font-semibold text-[var(--ms-navy)]"
          >
            Stay
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="flex-1 rounded-full bg-red-600 py-3 text-[13px] font-bold text-white"
          >
            Sign out
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Cache cleared toast ──────────────────────────────────────────────────────

function Toast({ msg, onDone }: { msg: string; onDone: () => void }) {
  useEffect(() => {
    const t = setTimeout(onDone, 2600);
    return () => clearTimeout(t);
  }, [onDone]);
  return (
    <div className="fixed bottom-24 left-1/2 z-[60] -translate-x-1/2 whitespace-nowrap rounded-full bg-[var(--ms-navy)] px-5 py-2.5 text-[13px] font-semibold text-white shadow-[0_8px_24px_rgba(13,27,42,0.28)]">
      {msg}
    </div>
  );
}

// ─── Deactivate account modal (placeholder) ───────────────────────────────────

function DeactivateAccountModal({ onCancel }: { onCancel: () => void }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-6"
      onClick={onCancel}
    >
      <div
        className="w-full max-w-sm rounded-[24px] bg-white p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-[14px] bg-amber-50">
          <BellOff className="h-6 w-6 text-amber-600" strokeWidth={1.85} />
        </div>
        <h3 className="text-[16px] font-bold text-[var(--ms-navy)]">Deactivate account</h3>
        <p className="mt-2 text-[13px] leading-5 text-[var(--ms-mauve)]">
          Deactivating temporarily hides your profile and posts from the community.
          You can reactivate anytime by signing back in.
        </p>
        <div className="mt-3 rounded-[12px] bg-amber-50 px-4 py-3">
          <p className="text-[11px] leading-5 text-amber-700">
            <strong>Coming soon.</strong> Full account management requires our backend
            infrastructure, currently in development. Your data stays safely stored on this device.
          </p>
        </div>
        <button
          type="button"
          onClick={onCancel}
          className="mt-5 w-full rounded-full bg-[var(--ms-plum)] py-3 text-[13px] font-bold text-white transition hover:brightness-110"
        >
          Got it
        </button>
      </div>
    </div>
  );
}

// ─── Delete account modal (placeholder) ──────────────────────────────────────

function DeleteAccountModal({ onCancel }: { onCancel: () => void }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-6"
      onClick={onCancel}
    >
      <div
        className="w-full max-w-sm rounded-[24px] bg-white p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-[14px] bg-red-50">
          <UserX className="h-6 w-6 text-red-500" strokeWidth={1.85} />
        </div>
        <h3 className="text-[16px] font-bold text-[var(--ms-navy)]">Delete account</h3>
        <p className="mt-2 text-[13px] leading-5 text-[var(--ms-mauve)]">
          Permanently removes your account, profile, posts, and booking history from Mobile Salon.
          This action cannot be undone.
        </p>
        <div className="mt-3 rounded-[12px] bg-red-50 px-4 py-3">
          <p className="text-[11px] leading-5 text-red-700">
            <strong>Coming soon.</strong> Account deletion is a regulated operation that requires
            our backend — currently in development. When available, all deleted data will leave a
            traceable audit record as required by Kenyan data protection law (DPA 2019).
          </p>
        </div>
        <button
          type="button"
          onClick={onCancel}
          className="mt-5 w-full rounded-full border border-[var(--ms-border)] py-3 text-[13px] font-semibold text-[var(--ms-navy)] transition hover:bg-[var(--ms-soft-bg)]"
        >
          Close
        </button>
      </div>
    </div>
  );
}

// ─── Main SettingsUI ──────────────────────────────────────────────────────────

export function SettingsUI() {
  const [settings, setSettings]           = useState<AppSettings>(readSettings);
  const [session,  setSession]            = useState<AppUserSession | null>(null);
  const [showAgeModal,    setShowAgeModal]    = useState(false);
  const [showSignOut,     setShowSignOut]     = useState(false);
  const [showDeactivate,  setShowDeactivate]  = useState(false);
  const [showDelete,      setShowDelete]      = useState(false);
  const [toast, setToast]                     = useState<string | null>(null);

  const showToast = useCallback((msg: string) => setToast(msg), []);

  // Sync settings + session from localStorage
  useEffect(() => {
    function sync() {
      setSettings(readSettings());
      setSession(readAppSession());
    }
    sync();
    window.addEventListener(SETTINGS_CHANGE_EVENT, sync);
    window.addEventListener(APP_SESSION_EVENT,      sync);
    window.addEventListener("storage",              sync);
    return () => {
      window.removeEventListener(SETTINGS_CHANGE_EVENT, sync);
      window.removeEventListener(APP_SESSION_EVENT,      sync);
      window.removeEventListener("storage",              sync);
    };
  }, []);

  const isGuest = !session || session.role === "guest";
  const isProvider = session?.role === "professional" || session?.role === "salon";

  function patch<K extends keyof AppSettings>(key: K, value: AppSettings[K]) {
    setSettings(setSetting(key, value));
  }

  function handleAdultToggle(on: boolean) {
    if (!on) {
      // Turning off is always allowed
      setSettings(writeSettings({ showAdultProducts: false }));
      return;
    }
    if (settings.adultProductsAgeVerified) {
      // Already verified — just re-enable
      setSettings(writeSettings({ showAdultProducts: true }));
    } else {
      // Need age verification first
      setShowAgeModal(true);
    }
  }

  function handleAgeConfirmed(dob: string) {
    setSettings(
      writeSettings({
        showAdultProducts: true,
        adultProductsAgeVerified: true,
        adultProductsVerifiedAt: new Date().toISOString(),
        adultProductsDOB: dob,
      }),
    );
    setShowAgeModal(false);
    showToast("Adult products enabled");
  }

  function handleSignOut() {
    clearAppSession();
    setShowSignOut(false);
    window.location.href = "/";
  }

  function handleClearCache() {
    // Only remove genuinely temporary/cache keys.
    // Social posts, bookings, messages, saves, and follows are USER DATA — never touch them here.
    const keepKeys = new Set([
      "ms_app_settings.v1",
      "mobile-salon.client-session.v1",
      "ms_social_posts",
      "ms_bookings",
      "ms_messages",
      "ms_social_saves",
      "ms_social_follows",
    ]);
    try {
      const toRemove = Object.keys(localStorage).filter(
        (k) => k.startsWith("ms_") && !keepKeys.has(k),
      );
      toRemove.forEach((k) => localStorage.removeItem(k));
    } catch { /* noop */ }
    showToast("Temporary cache cleared");
  }

  // ── Rows per section ────────────────────────────────────────────────────────

  const accountRows: RowDef[] = [
    {
      kind: "link",
      icon: User,
      label: "Edit profile",
      sub: isGuest ? "Sign in to manage your profile" : getDisplayName(session),
      href: isGuest ? "/auth/sign-in" : "/profile",
      iconBg: "bg-[#F0EBFF]",
    },
    {
      kind: "link",
      icon: Phone,
      label: "Phone number",
      sub: isGuest ? "—" : (session as { phone?: string }).phone ?? "Not set",
      href: "/profile",
    },
    {
      kind: "link",
      icon: UserCog,
      label: "Account type",
      value: isGuest ? "Guest" : getAccountLabel(session),
      href: "/profile",
    },
    {
      kind: "link",
      icon: Languages,
      label: "Language",
      value: "English",
      href: "#",
    },
  ];

  const privacyRows: RowDef[] = [
    {
      kind: "toggle",
      icon: Lock,
      label: "Private account",
      sub: "Only your followers can see your posts",
      on: settings.privateAccount,
      onChange: (v) => patch("privateAccount", v),
      iconBg: "bg-[#EDF5FF]",
    },
    {
      kind: "select",
      icon: MessageCircle,
      label: "Who can comment",
      sub: "Control who replies to your posts",
      value: settings.whoCanComment,
      options: [
        { value: "everyone",  label: "Everyone"  },
        { value: "followers", label: "Followers" },
        { value: "nobody",    label: "Nobody"    },
      ],
      onChange: (v) => patch("whoCanComment", v as AppSettings["whoCanComment"]),
    },
    {
      kind: "toggle",
      icon: Eye,
      label: "Activity status",
      sub: "Let others see when you were last active",
      on: settings.showActivityStatus,
      onChange: (v) => patch("showActivityStatus", v),
    },
    {
      kind: "toggle",
      icon: Users,
      label: "Direct messages",
      sub: "Allow anyone to message you",
      on: settings.allowDirectMessages,
      onChange: (v) => patch("allowDirectMessages", v),
    },
    {
      kind: "link",
      icon: UserX,
      label: "Blocked accounts",
      sub: "Manage who cannot see or interact with you",
      href: "#",
    },
    {
      kind: "link",
      icon: EyeOff,
      label: "Muted accounts",
      sub: "Posts from muted accounts won't appear in your feed",
      href: "#",
    },
  ];

  const notificationRows: RowDef[] = [
    {
      kind: "toggle",
      icon: Bell,
      label: "Push notifications",
      sub: "Master switch for all notifications",
      on: settings.pushNotifications,
      onChange: (v) => patch("pushNotifications", v),
      iconBg: "bg-[#FEF0F3]",
    },
    {
      kind: "toggle",
      icon: Sparkles,
      label: "Likes",
      sub: "When someone likes your post",
      on: settings.notifyLikes,
      onChange: (v) => patch("notifyLikes", v),
      disabled: !settings.pushNotifications,
    },
    {
      kind: "toggle",
      icon: MessageCircle,
      label: "Comments",
      sub: "When someone comments on your post",
      on: settings.notifyComments,
      onChange: (v) => patch("notifyComments", v),
      disabled: !settings.pushNotifications,
    },
    {
      kind: "toggle",
      icon: Users,
      label: "New followers",
      sub: "When someone follows you",
      on: settings.notifyFollowers,
      onChange: (v) => patch("notifyFollowers", v),
      disabled: !settings.pushNotifications,
    },
    {
      kind: "toggle",
      icon: Repeat2,
      label: "Reposts",
      sub: "When someone reposts your content",
      on: settings.notifyReposts,
      onChange: (v) => patch("notifyReposts", v),
      disabled: !settings.pushNotifications,
    },
    {
      kind: "toggle",
      icon: MessageCircle,
      label: "Messages",
      sub: "New direct messages",
      on: settings.notifyMessages,
      onChange: (v) => patch("notifyMessages", v),
      disabled: !settings.pushNotifications,
    },
    {
      kind: "toggle",
      icon: Package,
      label: isProvider ? "New booking alerts" : "Booking reminders",
      sub: isProvider ? "Incoming booking requests from clients" : "Upcoming appointment alerts",
      on: settings.notifyBookings,
      onChange: (v) => patch("notifyBookings", v),
      disabled: !settings.pushNotifications,
    },
    ...(!isProvider ? [{
      kind: "toggle" as const,
      icon: ShoppingBag,
      label: "Offers & promotions",
      sub: "Deals from salons and pros you follow",
      on: settings.notifyOffers,
      onChange: (v: boolean) => patch("notifyOffers", v),
      disabled: !settings.pushNotifications,
    }] : []),
    {
      kind: "toggle",
      icon: Bell,
      label: "Platform announcements",
      sub: "Updates from the Mobile Salon team",
      on: settings.notifyAnnouncements,
      onChange: (v) => patch("notifyAnnouncements", v),
      disabled: !settings.pushNotifications,
    },
  ];

  const counterRows: RowDef[] = [
    {
      kind: "toggle",
      icon: settings.showAdultProducts ? ShieldCheck : ShieldOff,
      label: "18+ products",
      sub: settings.showAdultProducts
        ? "Adult products are visible. Tap to disable."
        : "Hidden by default. Tap to enable with age verification.",
      on: settings.showAdultProducts,
      onChange: handleAdultToggle,
      iconBg: settings.showAdultProducts ? "bg-amber-50" : "bg-[var(--ms-soft-bg)]",
    },
    {
      kind: "toggle",
      icon: Sparkles,
      label: "Product suggestions",
      sub: "Show personalised product picks based on your services",
      on: settings.showProductSuggestions,
      onChange: (v) => patch("showProductSuggestions", v),
    },
    {
      kind: "link",
      icon: ShoppingBag,
      label: "Order history",
      sub: "View your past Counter purchases",
      href: "/counter/cart",
    },
  ];

  const feedRows: RowDef[] = [
    {
      kind: "toggle",
      icon: Repeat2,
      label: "Show reposts in feed",
      sub: "Display content reposted by people you follow",
      on: settings.showReposts,
      onChange: (v) => patch("showReposts", v),
    },
    {
      kind: "toggle",
      icon: Sparkles,
      label: "Suggested posts",
      sub: "See posts from creators you don't follow yet",
      on: settings.showSuggestedPosts,
      onChange: (v) => patch("showSuggestedPosts", v),
    },
    {
      kind: "toggle",
      icon: Volume2,
      label: "Autoplay videos",
      sub: "Videos play silently as you scroll",
      on: settings.autoplayVideos,
      onChange: (v) => patch("autoplayVideos", v),
    },
  ];

  const appearanceRows: RowDef[] = [
    {
      kind: "select",
      icon: Palette,
      label: "Color scheme",
      sub: "Choose light, dark, or follow your device",
      value: settings.colorScheme,
      options: [
        { value: "light",  label: "Light"  },
        { value: "dark",   label: "Dark"   },
        { value: "system", label: "System" },
      ],
      onChange: (v) => patch("colorScheme", v as AppSettings["colorScheme"]),
      iconBg: "bg-[#FEF0F3]",
    },
    {
      kind: "select",
      icon: Type,
      label: "Text size",
      sub: "Adjust how large text appears",
      value: settings.textSize,
      options: [
        { value: "small",  label: "S" },
        { value: "medium", label: "M" },
        { value: "large",  label: "L" },
      ],
      onChange: (v) => patch("textSize", v as AppSettings["textSize"]),
    },
  ];

  const accessibilityRows: RowDef[] = [
    {
      kind: "toggle",
      icon: Zap,
      label: "Reduce motion",
      sub: "Minimise animations and transitions throughout the app",
      on: settings.reduceMotion,
      onChange: (v) => patch("reduceMotion", v),
    },
    {
      kind: "toggle",
      icon: Monitor,
      label: "High contrast",
      sub: "Increase contrast for better readability",
      on: settings.highContrast,
      onChange: (v) => patch("highContrast", v),
    },
  ];

  const securityRows: RowDef[] = [
    {
      kind: "toggle",
      icon: Shield,
      label: "Two-factor authentication",
      sub: "Require a code from your phone when signing in",
      on: settings.twoFactorEnabled,
      onChange: (v) => { patch("twoFactorEnabled", v); showToast("Changes saved"); },
      iconBg: "bg-[#E8F5F2]",
    },
    {
      kind: "toggle",
      icon: Bell,
      label: "Login alerts",
      sub: "Get notified when your account is accessed from a new device",
      on: settings.loginAlerts,
      onChange: (v) => patch("loginAlerts", v),
    },
    {
      kind: "link",
      icon: Smartphone,
      label: "Active sessions",
      sub: "See all devices where you are signed in",
      href: "#",
    },
    {
      kind: "link",
      icon: Lock,
      label: "Change password",
      href: "#",
    },
  ];

  const storageRows: RowDef[] = [
    {
      kind: "link",
      icon: Trash2,
      label: "Clear cache",
      sub: "Remove temporary data to free up space",
      onClick: handleClearCache,
    },
    {
      kind: "link",
      icon: Download,
      label: "Download your data",
      sub: "Get a copy of your posts, bookings, and account data",
      href: "#",
    },
    {
      kind: "link",
      icon: Database,
      label: "Storage used",
      value: "< 1 MB",
      href: "#",
    },
    {
      kind: "link",
      icon: WifiOff,
      label: "Offline mode",
      sub: "Manage locally cached content",
      href: "#",
    },
  ];

  const supportRows: RowDef[] = [
    {
      kind: "link",
      icon: HelpCircle,
      label: "Help center",
      href: "/help",
      iconBg: "bg-[#EDF5FF]",
    },
    {
      kind: "link",
      icon: AlertTriangle,
      label: "Report a problem",
      sub: "Tell us if something isn't working",
      href: "/help",
    },
    {
      kind: "link",
      icon: Shield,
      label: "Safety information",
      sub: "Our commitment to your safety on Mobile Salon",
      href: "/terms",
    },
    {
      kind: "link",
      icon: BookOpen,
      label: "Community guidelines",
      href: "/terms",
    },
  ];

  const aboutRows: RowDef[] = [
    {
      kind: "link",
      icon: Info,
      label: "About Mobile Salon",
      value: "v1.0.0",
      href: "/guide",
      iconBg: "bg-[#F0EBFF]",
    },
    {
      kind: "link",
      icon: FileText,
      label: "Terms of service",
      href: "/terms",
    },
    {
      kind: "link",
      icon: Lock,
      label: "Privacy policy",
      href: "/terms",
    },
    {
      kind: "link",
      icon: LayoutGrid,
      label: "Open-source licenses",
      href: "#",
    },
  ];

  const dangerRows: RowDef[] = [
    {
      kind: "link",
      icon: LogOut,
      label: "Sign out",
      onClick: () => setShowSignOut(true),
      danger: true,
    },
    {
      kind: "link",
      icon: BellOff,
      label: "Deactivate account",
      sub: "Temporarily hides your profile and posts",
      onClick: () => setShowDeactivate(true),
      danger: true,
    },
    {
      kind: "link",
      icon: UserX,
      label: "Delete account",
      sub: "Permanently removes your account and data",
      onClick: () => setShowDelete(true),
      danger: true,
    },
  ];

  return (
    <div className="mx-auto max-w-2xl space-y-6 pb-28 pt-2">

      {/* Account card at the top */}
      {!isGuest && session && (
        <Link
          href="/profile"
          className="flex items-center gap-4 rounded-[22px] bg-[linear-gradient(135deg,var(--ms-plum),#7C3A6F)] px-5 py-5 text-white shadow-[0_6px_28px_rgba(132,36,92,0.22)] transition hover:brightness-105"
        >
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-white/20 text-2xl font-bold text-white">
            {getDisplayName(session)[0]?.toUpperCase()}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[16px] font-bold">{getDisplayName(session)}</p>
            <p className="text-[12px] text-white/70">{getAccountLabel(session)}</p>
          </div>
          <ChevronRight className="h-5 w-5 text-white/60" />
        </Link>
      )}

      {isGuest && (
        <Link
          href="/auth/sign-in"
          className="flex items-center gap-4 rounded-[22px] border border-[var(--ms-border)] bg-white px-5 py-5 shadow-[0_1px_6px_rgba(13,27,42,0.06)] transition hover:shadow-[0_4px_16px_rgba(13,27,42,0.1)]"
        >
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[var(--ms-soft-bg)]">
            <User className="h-7 w-7 text-[var(--ms-mauve)]" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[15px] font-bold text-[var(--ms-navy)]">Sign in to your account</p>
            <p className="text-[12px] text-[var(--ms-mauve)]">Access all settings and personalise your experience</p>
          </div>
          <ChevronRight className="h-5 w-5 text-[var(--ms-border)]" />
        </Link>
      )}

      {/* ── Account ─────────────────────────────────────────────────────── */}
      <Section title="Account">
        <RowGroup rows={accountRows} />
      </Section>

      {/* ── Privacy & Safety ────────────────────────────────────────────── */}
      <Section title="Privacy & Safety">
        <RowGroup rows={privacyRows} />
      </Section>

      {/* ── Notifications ───────────────────────────────────────────────── */}
      <Section title="Notifications">
        <RowGroup rows={notificationRows} />
      </Section>

      {/* ── Counter (Shop) — client only ────────────────────────────────── */}
      {!isProvider && (
        <Section title="Counter — Shop">
          {/* Prominent 18+ callout card */}
          <div className="border-b border-[var(--ms-border)]/60 px-4 py-4">
            <div className="flex items-start gap-3 rounded-[14px] bg-amber-50 p-3">
              <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" strokeWidth={1.85} />
              <div className="min-w-0 flex-1">
                <p className="text-[12px] font-bold text-amber-800">18+ products hidden by default</p>
                <p className="mt-0.5 text-[11px] leading-4 text-amber-700">
                  Adult products on Counter are hidden unless you verify your age below.
                  Products are intended for adults aged 18 and above only.
                </p>
              </div>
            </div>
          </div>
          <RowGroup rows={counterRows} />
        </Section>
      )}

      {/* ── Feed & Content ───────────────────────────────────────────────── */}
      <Section title="Feed & Content">
        <RowGroup rows={feedRows} />
      </Section>

      {/* ── Appearance ──────────────────────────────────────────────────── */}
      <Section title="Appearance">
        <RowGroup rows={appearanceRows} />
      </Section>

      {/* ── Accessibility ────────────────────────────────────────────────── */}
      <Section title="Accessibility">
        <RowGroup rows={accessibilityRows} />
      </Section>

      {/* ── Security ─────────────────────────────────────────────────────── */}
      <Section title="Security">
        <RowGroup rows={securityRows} />
      </Section>

      {/* ── Data & Storage ───────────────────────────────────────────────── */}
      <Section title="Data & Storage">
        <RowGroup rows={storageRows} />
      </Section>

      {/* ── Support ──────────────────────────────────────────────────────── */}
      <Section title="Support">
        <RowGroup rows={supportRows} />
      </Section>

      {/* ── About ────────────────────────────────────────────────────────── */}
      <Section title="About">
        <RowGroup rows={aboutRows} />
      </Section>

      {/* ── Sign out / Danger ─────────────────────────────────────────────── */}
      <Section title="Account actions">
        <RowGroup rows={isGuest ? dangerRows.slice(0, 0) : dangerRows} />
        {isGuest && (
          <div className="flex flex-col items-center gap-1 px-4 py-5">
            <p className="text-[13px] text-[var(--ms-mauve)]">Not signed in</p>
            <Link
              href="/auth/sign-in"
              className="mt-1 rounded-full bg-[var(--ms-plum)] px-6 py-2.5 text-[13px] font-bold text-white transition hover:brightness-110"
            >
              Sign in
            </Link>
          </div>
        )}
      </Section>

      {/* Footer */}
      <p className="pb-4 text-center text-[11px] leading-5 text-[var(--ms-mauve)]">
        Mobile Salon · Beauty, softly handled · Kenya{"\n"}
        For women, by women
      </p>

      {/* Modals */}
      {showAgeModal && (
        <AgeVerifyModal
          onConfirm={handleAgeConfirmed}
          onCancel={() => setShowAgeModal(false)}
        />
      )}
      {showSignOut && (
        <SignOutConfirm
          onConfirm={handleSignOut}
          onCancel={() => setShowSignOut(false)}
        />
      )}
      {showDeactivate && (
        <DeactivateAccountModal onCancel={() => setShowDeactivate(false)} />
      )}
      {showDelete && (
        <DeleteAccountModal onCancel={() => setShowDelete(false)} />
      )}
      {toast && <Toast msg={toast} onDone={() => setToast(null)} />}
    </div>
  );
}
