"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  Crown,
  Phone,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Truck,
} from "lucide-react";
import { useRef, useState } from "react";

import {
  createSessionForRole,
  readAppSession,
  writeAppSession,
  type AppUserRole,
} from "@/lib/client-session";
import { cn } from "@/lib/utils";

// ─── Role definitions ────────────────────────────────────────────────────────

const ROLES = [
  {
    key: "client" as const,
    label: "Client",
    tagline: "Book a beauty service",
    description:
      "Find salons and professionals near you, see real prices, and confirm a booking in minutes.",
    badge: "Most users start here",
    icon: Sparkles,
    color: "#C8284A",
    colorLight: "rgba(200,40,74,0.10)",
    colorBorder: "rgba(200,40,74,0.32)",
    signUpHref: "/signup/client",
    signInDest: "/home",
    showInSignIn: true,
  },
  {
    key: "salon" as const,
    label: "Salon",
    tagline: "List your salon",
    description:
      "Showcase your team, services, and portfolio. Accept bookings and manage your business page.",
    badge: "Business account",
    icon: Building2,
    color: "#BF8C2E",
    colorLight: "rgba(191,140,46,0.10)",
    colorBorder: "rgba(191,140,46,0.32)",
    signUpHref: "/profile",
    signInDest: "/home",
    showInSignIn: true,
  },
  {
    key: "professional" as const,
    label: "Professional",
    tagline: "Offer your skills",
    description:
      "Build a bookable profile with your portfolio, pricing, and availability. No rent barrier.",
    badge: "Independent pro",
    icon: Crown,
    color: "#1A7A6B",
    colorLight: "rgba(26,122,107,0.10)",
    colorBorder: "rgba(26,122,107,0.32)",
    signUpHref: "/profile",
    signInDest: "/home",
    showInSignIn: true,
  },
  {
    key: "shop" as const,
    label: "Shop",
    tagline: "Sell beauty products",
    description:
      "List and sell genuine beauty products on Counter. Escrow-protected. 5% commission only when you sell.",
    badge: "Seller account",
    icon: ShoppingBag,
    color: "#8B5CF6",
    colorLight: "rgba(139,92,246,0.10)",
    colorBorder: "rgba(139,92,246,0.32)",
    signUpHref: "/shop/profile",
    signInDest: "/shop/dashboard",
    showInSignIn: false,
  },
  {
    key: "delivery" as const,
    label: "Delivery",
    tagline: "Deliver for shops",
    description:
      "Partner with Shop+ sellers as an independent delivery rider. Earn per delivery across Nairobi.",
    badge: "Rider account",
    icon: Truck,
    color: "#EA580C",
    colorLight: "rgba(234,88,12,0.10)",
    colorBorder: "rgba(234,88,12,0.32)",
    signUpHref: "/delivery/profile",
    signInDest: "/delivery/dashboard",
    showInSignIn: false,
  },
] as const;

type RoleKey = (typeof ROLES)[number]["key"];

// ─── Role-specific community standards (spec §5.4) ───────────────────────────

const COMMUNITY_STANDARDS: Record<RoleKey, string[]> = {
  client: [
    "Book honestly. Only book services you intend to keep.",
    "Respect the professional’s time. Cancel with as much notice as possible.",
    "Pay through the platform. Never pay cash or outside the app.",
    "Leave honest reviews. Your review helps every other woman here.",
    "This is a safe space. Report anything that feels wrong.",
    "Your data is private. We will never share your personal details without your consent.",
  ],
  salon: [
    "Be who you say you are. Your salon name, location, and services must be accurate.",
    "Deliver what you list. Misrepresentation is grounds for removal.",
    "Respond promptly to bookings. Slow response drops your ranking.",
    "All payments go through the platform. Off-platform transactions are prohibited.",
    "Your team is your responsibility. Ensure everyone who works under your account meets our standards.",
    "Keep your information up to date. Outdated services or hours damage client trust.",
  ],
  professional: [
    "Your profile is your business. Make it accurate and keep it current.",
    "Show up on time. Every no-show harms your ranking and your reputation.",
    "Deliver what you promise. Only list services you can actually provide.",
    "All payments go through the platform. No cash, no off-platform transfers.",
    "Respect client privacy. Never share a client’s details with anyone.",
    "Build trust through honesty. A real review is worth more than a fake five stars.",
  ],
  shop: [
    "Sell real products. Counterfeit or mislabelled products result in immediate removal.",
    "Describe accurately. Photos and descriptions must match the real product.",
    "Dispatch on time. Late shipping damages your rating and your clients’ trust.",
    "Honour your prices. Do not change a price after a client has paid.",
    "All payments go through the platform. You will be paid after client confirms receipt.",
    "Report issues to us. If there is a dispute, go through the platform — not directly to the client.",
  ],
  delivery: [
    "Show up for every job you accept. A missed delivery damages everyone — you, the seller, and the client.",
    "Handle products with care. You are responsible for the item from pickup to delivery.",
    "Be on time. Your rating depends on it.",
    "Communicate through the platform. Do not exchange personal contact with clients or sellers.",
    "Your availability status matters. Set it accurately — Available means you will take jobs.",
    "All earnings go through the platform. No side payments.",
  ],
};

// ─── Shared sub-components ────────────────────────────────────────────────────

function AgreementCheckbox({
  checked,
  onChange,
  children,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  children: React.ReactNode;
}) {
  return (
    <label className="flex cursor-pointer items-start gap-3 rounded-[14px] border border-[var(--ms-border)] bg-white px-4 py-3 transition hover:border-[var(--ms-rose)]/40">
      <span
        className={cn(
          "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border-2 transition",
          checked
            ? "border-[var(--ms-rose)] bg-[var(--ms-rose)] text-white"
            : "border-[var(--ms-border)] bg-white",
        )}
        style={{ minWidth: "1.25rem", minHeight: "1.25rem" }}
      >
        {checked ? (
          <svg className="h-3 w-3" viewBox="0 0 12 12" fill="none">
            <path
              d="M2 6l3 3 5-5"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        ) : null}
      </span>
      <input
        checked={checked}
        className="sr-only"
        onChange={(e) => onChange(e.target.checked)}
        type="checkbox"
      />
      <span className="text-xs leading-5 text-[var(--ms-charcoal)]">{children}</span>
    </label>
  );
}

// ─── OTP 6-digit input ────────────────────────────────────────────────────────

function OtpInput({
  value,
  onChange,
  color,
}: {
  value: string;
  onChange: (v: string) => void;
  color: string;
}) {
  const refs = useRef<Array<HTMLInputElement | null>>([]);

  function handleKey(i: number, e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Backspace" && !value[i] && i > 0) {
      refs.current[i - 1]?.focus();
    }
  }

  function handleChange(i: number, raw: string) {
    const digit = raw.replace(/\D/g, "").slice(-1);
    const arr = (value + "      ").slice(0, 6).split("");
    arr[i] = digit;
    const next = arr.join("");
    onChange(next);
    if (digit && i < 5) {
      setTimeout(() => refs.current[i + 1]?.focus(), 0);
    }
  }

  function handlePaste(e: React.ClipboardEvent) {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    onChange((pasted + "      ").slice(0, 6));
    const lastIdx = Math.min(pasted.length, 5);
    setTimeout(() => refs.current[lastIdx]?.focus(), 0);
  }

  return (
    <div className="flex justify-center gap-2">
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <input
          key={i}
          ref={(input) => {
            refs.current[i] = input;
          }}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={(value[i] ?? "").trim()}
          onChange={(e) => handleChange(i, e.target.value)}
          onKeyDown={(e) => handleKey(i, e)}
          onPaste={handlePaste}
          className="h-12 w-10 rounded-[12px] border-2 bg-white text-center text-lg font-bold outline-none transition focus:scale-105"
          style={{
            borderColor: value[i]?.trim() ? color : "var(--ms-border)",
            color: color,
          }}
        />
      ))}
    </div>
  );
}

// ─── Phone step ───────────────────────────────────────────────────────────────

function PhoneStep({
  color,
  onBack,
  onSend,
}: {
  color: string;
  onBack: () => void;
  onSend: (phone: string) => void;
}) {
  const [phone, setPhone] = useState("");
  const clean = phone.replace(/\D/g, "");
  const valid = clean.length >= 9; // Kenyan numbers: at least 9 digits

  return (
    <div className="space-y-5">
      {/* Back */}
      <button
        type="button"
        onClick={onBack}
        className="flex items-center gap-1.5 text-sm font-medium text-[var(--ms-mauve)] hover:text-[var(--ms-navy)]"
      >
        <ArrowLeft className="h-4 w-4" />
        Back
      </button>

      {/* Card */}
      <div
        className="rounded-[24px] border p-5"
        style={{ backgroundColor: `${color}10`, borderColor: `${color}40` }}
      >
        {/* Icon + heading */}
        <div className="flex flex-col items-center gap-3 text-center">
          <span
            className="flex h-14 w-14 items-center justify-center rounded-full"
            style={{ backgroundColor: color }}
          >
            <Phone className="h-6 w-6 text-white" />
          </span>
          <p className="text-xl font-semibold" style={{ color }}>
            Verify your number
          </p>
          <p className="max-w-xs text-sm leading-6 text-[var(--ms-charcoal)]">
            Enter your phone number. We&rsquo;ll send a one-time code to confirm it&rsquo;s you.
          </p>
        </div>

        {/* Phone input */}
        <div className="mt-5">
          <div className="flex overflow-hidden rounded-[14px] border-2 bg-white transition focus-within:border-current"
            style={{ borderColor: `${color}60` }}
          >
            <span className="flex items-center border-r px-4 text-sm font-semibold text-[var(--ms-charcoal)]"
              style={{ borderColor: `${color}30` }}
            >
              🇰🇪 +254
            </span>
            <input
              type="tel"
              placeholder="7XX XXX XXX"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="flex-1 bg-transparent px-4 py-3.5 text-sm text-[var(--ms-navy)] outline-none placeholder:text-[var(--ms-mauve)]/50"
              autoComplete="tel"
            />
          </div>
        </div>

        {/* Send OTP */}
        <button
          type="button"
          disabled={!valid}
          onClick={() => onSend(phone)}
          className="mt-4 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-[16px] text-sm font-semibold text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-40"
          style={{ backgroundColor: color }}
        >
          Send verification code
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>

      <p className="text-center text-xs text-[var(--ms-mauve)]">
        Standard SMS rates may apply.
      </p>
    </div>
  );
}

// ─── OTP step ─────────────────────────────────────────────────────────────────

function OtpStep({
  color,
  phone,
  onBack,
  onVerified,
}: {
  color: string;
  phone: string;
  onBack: () => void;
  onVerified: () => void;
}) {
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [resent, setResent] = useState(false);

  function handleVerify() {
    if (otp.replace(/\s/g, "").length === 6) {
      setError("");
      onVerified();
    } else {
      setError("Enter the 6-digit code to continue.");
    }
  }

  function handleResend() {
    setOtp("");
    setError("");
    setResent(true);
    setTimeout(() => setResent(false), 3000);
  }

  return (
    <div className="space-y-5">
      {/* Back */}
      <button
        type="button"
        onClick={onBack}
        className="flex items-center gap-1.5 text-sm font-medium text-[var(--ms-mauve)] hover:text-[var(--ms-navy)]"
      >
        <ArrowLeft className="h-4 w-4" />
        Change number
      </button>

      {/* Card */}
      <div
        className="rounded-[24px] border p-5"
        style={{ backgroundColor: `${color}10`, borderColor: `${color}40` }}
      >
        <div className="flex flex-col items-center gap-3 text-center">
          <span
            className="flex h-14 w-14 items-center justify-center rounded-full"
            style={{ backgroundColor: color }}
          >
            <ShieldCheck className="h-6 w-6 text-white" />
          </span>
          <p className="text-xl font-semibold" style={{ color }}>
            Enter your code
          </p>
          <p className="max-w-xs text-sm leading-6 text-[var(--ms-charcoal)]">
            We sent a 6-digit code to{" "}
            <span className="font-semibold text-[var(--ms-navy)]">+254 {phone}</span>.
          </p>
        </div>

        {/* OTP boxes */}
        <div className="mt-6">
          <OtpInput value={otp} onChange={setOtp} color={color} />
        </div>

        {/* Error */}
        {error && (
          <p className="mt-3 text-center text-xs font-medium text-red-500">{error}</p>
        )}

        {/* Verify */}
        <button
          type="button"
          disabled={otp.replace(/\s/g, "").length < 6}
          onClick={handleVerify}
          className="mt-4 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-[16px] text-sm font-semibold text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-40"
          style={{ backgroundColor: color }}
        >
          Verify &amp; continue
          <ArrowRight className="h-4 w-4" />
        </button>

        {/* Resend */}
        <div className="mt-3 text-center">
          {resent ? (
            <p className="text-xs text-green-600 font-medium">Code resent ✓</p>
          ) : (
            <button
              type="button"
              onClick={handleResend}
              className="text-xs text-[var(--ms-mauve)] underline-offset-2 hover:underline"
            >
              Didn&rsquo;t receive it? Resend code
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Sign-in picker ────────────────────────────────────────────────────────────
// Shop and Delivery are separate logins — NEVER appear in the account switcher.

const SIGN_IN_ROLES = ROLES.filter((r) => r.showInSignIn);
type SignInRoleKey = "client" | "salon" | "professional";
type SignInStep = "role" | "phone" | "otp";

export function SignInRolePicker({
  returnTo,
  onSuccess,
}: {
  returnTo: string;
  /** Optional override: called instead of router.push after successful auth. */
  onSuccess?: (destination: string) => void;
}) {
  const router = useRouter();
  const [active, setActive] = useState<SignInRoleKey>("client");
  const [step, setStep] = useState<SignInStep>("role");
  const [phone, setPhone] = useState("");

  const role = SIGN_IN_ROLES.find((r) => r.key === active) ?? SIGN_IN_ROLES[0];
  const dest = role.key === "client" ? returnTo : role.signInDest;

  function handleRoleChange(key: SignInRoleKey) {
    setActive(key);
    setStep("role");
    setPhone("");
  }

  function handleSend(p: string) {
    setPhone(p);
    setStep("otp");
  }

  function handleVerified() {
    // Write session
    const existing = readAppSession();
    if (existing?.role === role.key) {
      writeAppSession(existing);
    } else {
      writeAppSession(createSessionForRole(role.key as Exclude<AppUserRole, "guest">, `+254${phone.replace(/\D/g, "")}`));
    }
    if (onSuccess) {
      onSuccess(dest);
    } else {
      router.push(dest);
    }
  }

  if (step === "phone") {
    return (
      <PhoneStep
        color={role.color}
        onBack={() => setStep("role")}
        onSend={handleSend}
      />
    );
  }

  if (step === "otp") {
    return (
      <OtpStep
        color={role.color}
        phone={phone}
        onBack={() => setStep("phone")}
        onVerified={handleVerified}
      />
    );
  }

  // Step: "role"
  return (
    <div className="space-y-5">
      {/* Tab pills */}
      <div className="flex gap-2 rounded-[20px] border border-[var(--ms-border)] bg-[var(--ms-soft-bg)] p-1.5">
        {SIGN_IN_ROLES.map((r) => {
          const Icon = r.icon;
          const isActive = r.key === active;
          return (
            <button
              key={r.key}
              type="button"
              onClick={() => handleRoleChange(r.key as SignInRoleKey)}
              className="flex flex-1 items-center justify-center gap-2 rounded-[14px] px-3 py-2.5 text-sm font-semibold transition-all"
              style={
                isActive
                  ? { backgroundColor: r.color, color: "#fff", boxShadow: `0 6px 20px ${r.color}44` }
                  : { color: "var(--ms-mauve)" }
              }
            >
              <Icon className="h-4 w-4 shrink-0" />
              <span className="hidden sm:inline">{r.label}</span>
            </button>
          );
        })}
      </div>

      {/* Active role card */}
      <div
        className="rounded-[24px] border p-5 transition-all"
        style={{ backgroundColor: role.colorLight, borderColor: role.colorBorder }}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <span
              className="inline-flex rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em]"
              style={{ backgroundColor: role.color, color: "#fff" }}
            >
              {role.badge}
            </span>
            <p className="mt-3 text-2xl font-semibold" style={{ color: role.color }}>
              {role.tagline}
            </p>
            <p className="mt-2 max-w-sm text-sm leading-6 text-[var(--ms-charcoal)]">
              {role.description}
            </p>
          </div>
          <span
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-white"
            style={{ backgroundColor: role.color }}
          >
            <role.icon className="h-5 w-5" />
          </span>
        </div>

        {/* CTA → goes to phone step */}
        <button
          type="button"
          onClick={() => setStep("phone")}
          className="mt-5 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-[16px] text-sm font-semibold text-white transition hover:brightness-110"
          style={{ backgroundColor: role.color }}
        >
          Sign in as {role.label}
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>

      {/* Helper hint */}
      <p className="rounded-[16px] bg-[var(--ms-soft-bg)] px-4 py-3 text-center text-xs leading-5 text-[var(--ms-mauve)]">
        Not sure?{" "}
        <button
          type="button"
          onClick={() => handleRoleChange("client")}
          className="font-semibold"
          style={{ color: SIGN_IN_ROLES[0].color }}
        >
          Start as Client
        </button>{" "}
        — you can always book without a pro account.
      </p>
    </div>
  );
}

// ─── Sign-up picker ───────────────────────────────────────────────────────────

type SignUpStep = "role" | "phone" | "otp";

export function SignUpRolePicker({
  onSuccess,
}: {
  /** Optional override: called instead of router.push after successful auth. */
  onSuccess?: (destination: string) => void;
} = {}) {
  const router = useRouter();
  const [active, setActive] = useState<RoleKey>("client");
  const [agreedCommunity, setAgreedCommunity] = useState(false);
  const [agreedTerms, setAgreedTerms] = useState(false);
  const [step, setStep] = useState<SignUpStep>("role");
  const [phone, setPhone] = useState("");

  const role = ROLES.find((r) => r.key === active)!;
  const canProceed = agreedCommunity && agreedTerms;

  function handleRoleChange(key: RoleKey) {
    setActive(key);
    setAgreedCommunity(false);
    setAgreedTerms(false);
    setStep("role");
    setPhone("");
  }

  function handleSend(p: string) {
    setPhone(p);
    setStep("otp");
  }

  function handleVerified() {
    // Write a preview session so profile-setup pages know the role/user context
    const existing = readAppSession();
    if (!existing || existing.role !== role.key) {
      writeAppSession(createSessionForRole(role.key as Exclude<AppUserRole, "guest">, `+254${phone.replace(/\D/g, "")}`));
    }
    if (onSuccess) {
      onSuccess(role.signUpHref);
    } else {
      router.push(role.signUpHref);
    }
  }

  if (step === "phone") {
    return (
      <PhoneStep
        color={role.color}
        onBack={() => setStep("role")}
        onSend={handleSend}
      />
    );
  }

  if (step === "otp") {
    return (
      <OtpStep
        color={role.color}
        phone={phone}
        onBack={() => setStep("phone")}
        onVerified={handleVerified}
      />
    );
  }

  // Step: "role" — role picker + agreements
  return (
    <div className="space-y-5">
      {/* Role grid — 5 items, compact, always shows labels */}
      <div className="grid grid-cols-5 gap-1 rounded-[20px] border border-[var(--ms-border)] bg-[var(--ms-soft-bg)] p-1">
        {ROLES.map((r) => {
          const Icon = r.icon;
          const isActive = r.key === active;
          return (
            <button
              key={r.key}
              type="button"
              onClick={() => handleRoleChange(r.key)}
              className="flex flex-col items-center justify-center gap-1 rounded-[14px] px-1 py-2.5 font-semibold transition-all"
              style={
                isActive
                  ? { backgroundColor: r.color, color: "#fff", boxShadow: `0 4px 14px ${r.color}44` }
                  : { color: "var(--ms-mauve)" }
              }
            >
              <Icon className="h-4 w-4 shrink-0" />
              <span className="text-[10px] leading-none">{r.label}</span>
            </button>
          );
        })}
      </div>

      {/* Active role card */}
      <div
        className="rounded-[24px] border p-5 transition-all"
        style={{ backgroundColor: role.colorLight, borderColor: role.colorBorder }}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <span
              className="inline-flex rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em]"
              style={{ backgroundColor: role.color, color: "#fff" }}
            >
              {role.badge}
            </span>
            <p className="mt-3 text-2xl font-semibold" style={{ color: role.color }}>
              {role.tagline}
            </p>
            <p className="mt-2 max-w-sm text-sm leading-6 text-[var(--ms-charcoal)]">
              {role.description}
            </p>
          </div>
          <span
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-white"
            style={{ backgroundColor: role.color }}
          >
            <role.icon className="h-5 w-5" />
          </span>
        </div>

        {/* Community Standards */}
        <div className="mt-5 rounded-[18px] border border-[var(--ms-border)] bg-white p-4">
          <div className="flex items-start gap-3">
            <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-[var(--ms-rose)]" />
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--ms-navy)]">
                Our Community Standards
              </p>
              <p className="mt-1 text-xs text-[var(--ms-mauve)]">
                This platform is built for women who take care of themselves. We hold every member to these standards.
              </p>
            </div>
          </div>
          <ul className="mt-3 space-y-1.5">
            {COMMUNITY_STANDARDS[active].map((standard, i) => (
              <li key={i} className="flex items-start gap-2 text-xs leading-5 text-[var(--ms-charcoal)]">
                <span className="mt-0.5 shrink-0 text-[var(--ms-rose)]">✦</span>
                {standard}
              </li>
            ))}
          </ul>
        </div>

        {/* Agreement checkboxes */}
        <div className="mt-4 space-y-3">
          <AgreementCheckbox checked={agreedCommunity} onChange={setAgreedCommunity}>
            I agree to the{" "}
            <span className="font-semibold text-[var(--ms-navy)]">Community Standards</span>{" "}
            above and commit to this community.
          </AgreementCheckbox>

          <AgreementCheckbox checked={agreedTerms} onChange={setAgreedTerms}>
            I have read and agree to Mobile Salon&rsquo;s{" "}
            <Link
              href="/terms"
              className="font-semibold text-[var(--ms-rose)] underline underline-offset-2"
              onClick={(e) => e.stopPropagation()}
            >
              Terms &amp; Conditions
            </Link>
            . I am 18 years of age or older.
          </AgreementCheckbox>
        </div>

        {/* CTA — goes to phone verification after agreements */}
        {canProceed ? (
          <button
            type="button"
            onClick={() => setStep("phone")}
            className="mt-5 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-[16px] text-sm font-semibold text-white transition hover:brightness-110"
            style={{ backgroundColor: role.color }}
          >
            Continue as {role.label}
            <ArrowRight className="h-4 w-4" />
          </button>
        ) : (
          <button
            disabled
            className="mt-5 inline-flex min-h-12 w-full cursor-not-allowed items-center justify-center gap-2 rounded-[16px] text-sm font-semibold text-white opacity-40"
            style={{ backgroundColor: role.color }}
            type="button"
          >
            Continue as {role.label}
            <ArrowRight className="h-4 w-4" />
          </button>
        )}

        {!canProceed && (
          <p className="mt-2 text-center text-xs text-[var(--ms-mauve)]">
            Please agree to the Community Standards and Terms to continue.
          </p>
        )}
      </div>

      {/* Shortcut links for other roles */}
      <p className="text-center text-xs text-[var(--ms-mauve)]">
        {ROLES.filter((r) => r.key !== active).map((r, i) => (
          <span key={r.key}>
            {i > 0 && <span className="mx-1.5 opacity-40">·</span>}
            <button
              type="button"
              onClick={() => handleRoleChange(r.key)}
              className="font-semibold underline-offset-2 hover:underline"
              style={{ color: r.color }}
            >
              {r.label}
            </button>
          </span>
        ))}
        <span className="ml-1">accounts also available</span>
      </p>
    </div>
  );
}
