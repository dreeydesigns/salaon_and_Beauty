"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  Check,
  Eye,
  MapPin,
  ShieldCheck,
  Sparkles,
  UserRound,
} from "lucide-react";
import {
  useEffect,
  useRef,
  useState,
  type ClipboardEvent,
  type KeyboardEvent,
  type ReactNode,
} from "react";

import {
  dismissPhotoNudge,
  isPhotoNudgeDismissed,
  readQuizTheme,
  readSignupDraft,
  writeClientSession,
  writeSignupDraft,
} from "@/lib/client-session";
import { rankProfessionals } from "@/lib/discovery-ranking";
import {
  getThemeConfig,
  normalizeThemeKey,
  type ClientLocation,
  type ClientUserProfile,
  type ThemeKey,
} from "@/lib/personalization";
import { professionals } from "@/lib/site-data";
import { cn } from "@/lib/utils";

const otpLength = 6;

export function ClientSignupFlow() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnTo = searchParams.get("returnTo");
  const safeReturnTo = returnTo?.startsWith("/") ? returnTo : "/home";

  const [step, setStep] = useState(1);
  const [theme, setTheme] = useState<ThemeKey>("feminine");
  const [firstName, setFirstName] = useState("");
  const [phoneDigits, setPhoneDigits] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState(Array.from({ length: otpLength }, () => ""));
  const [otpError, setOtpError] = useState("");
  const [otpShake, setOtpShake] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const [resendCount, setResendCount] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [locationMode, setLocationMode] = useState<ClientLocation["mode"] | null>(null);
  const [manualLocation, setManualLocation] = useState("");
  const [locationError, setLocationError] = useState("");
  const [locationData, setLocationData] = useState<ClientLocation | null>(null);
  const [profile, setProfile] = useState<ClientUserProfile | null>(null);
  const [photoNudgeHidden, setPhotoNudgeHidden] = useState(false);
  const otpRefs = useRef<Array<HTMLInputElement | null>>([]);

  const themeConfig = getThemeConfig(theme);
  const fullPhone = `+254${phoneDigits}`;
  const phoneIsValid = /^7\d{8}$/.test(phoneDigits);
  const passwordScore = getPasswordScore(password);
  const detailsValid = firstName.trim().length > 0 && phoneIsValid && password.length >= 8;
  const otpCode = otp.join("");
  const otpComplete = otpCode.length === otpLength && otp.every(Boolean);
  const rankedProfessionals = rankProfessionals(
    professionals.filter((professional) => professional.verified),
    "top-rated",
    theme,
  ).slice(0, 4);

  useEffect(() => {
    const draft = readSignupDraft();
    const storedTheme = normalizeThemeKey(draft?.theme ?? readQuizTheme());
    const chosenTheme = storedTheme === "not_set" ? "feminine" : storedTheme;

    setTheme(chosenTheme);
    setFirstName(draft?.firstName ?? "");
    setPhoneDigits(draft?.phone?.replace("+254", "").slice(0, 9) ?? "");
    setPassword(draft?.password ?? "");
    setPhotoNudgeHidden(isPhotoNudgeDismissed());
  }, []);

  useEffect(() => {
    if (step !== 3 || resendTimer <= 0) {
      return;
    }

    const timer = window.setTimeout(() => {
      setResendTimer((current) => Math.max(0, current - 1));
    }, 1000);

    return () => window.clearTimeout(timer);
  }, [resendTimer, step]);

  function persistDetails(next?: Partial<{ firstName: string; phone: string; password: string }>) {
    writeSignupDraft({
      firstName: next?.firstName ?? firstName,
      phone: next?.phone ?? fullPhone,
      password: next?.password ?? password,
      theme,
      tribeBadge: themeConfig.tribeBadge,
    });
  }

  async function sendVerificationCode(isResend = false) {
    if (!detailsValid || submitting) {
      return;
    }

    const nextResendCount = isResend ? resendCount + 1 : Math.max(resendCount, 1);

    if (nextResendCount > 3) {
      return;
    }

    setSubmitting(true);
    persistDetails();

    try {
      const response = await fetch("/api/auth/client/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: fullPhone, resendCount: nextResendCount }),
      });
      const result = (await response.json()) as { ok?: boolean; resendCount?: number };

      if (!response.ok || !result.ok) {
        throw new Error("OTP could not be sent");
      }

      setResendCount(result.resendCount ?? nextResendCount);
      setResendTimer(30);
      setOtp(Array.from({ length: otpLength }, () => ""));
      setOtpError("");
      setStep(3);
      window.setTimeout(() => otpRefs.current[0]?.focus(), 80);
    } catch {
      setOtpError("We could not send the code. Check the phone number and try again.");
    } finally {
      setSubmitting(false);
    }
  }

  async function verifyOtp() {
    if (!otpComplete || submitting) {
      return;
    }

    setSubmitting(true);
    setOtpError("");

    try {
      const response = await fetch("/api/auth/client/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: fullPhone, code: otpCode }),
      });
      const result = (await response.json()) as { ok?: boolean; verified?: boolean };

      if (!response.ok || !result.ok || !result.verified) {
        throw new Error("OTP mismatch");
      }

      writeSignupDraft({ otpVerified: true, phone: fullPhone, firstName, password, theme, tribeBadge: themeConfig.tribeBadge });
      setStep(4);
    } catch {
      setOtpError("That code didn't match. Try again.");
      setOtp(Array.from({ length: otpLength }, () => ""));
      setOtpShake(true);
      window.setTimeout(() => setOtpShake(false), 450);
      window.setTimeout(() => otpRefs.current[0]?.focus(), 80);
    } finally {
      setSubmitting(false);
    }
  }

  async function createClientProfile(location: ClientLocation) {
    setSubmitting(true);
    writeSignupDraft({ location, firstName, phone: fullPhone, password, theme, tribeBadge: themeConfig.tribeBadge });

    try {
      const response = await fetch("/api/auth/client/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName,
          phone: fullPhone,
          password,
          theme,
          tribeBadge: themeConfig.tribeBadge,
          location,
        }),
      });
      const result = (await response.json()) as { ok?: boolean; profile?: ClientUserProfile };

      if (!response.ok || !result.ok || !result.profile) {
        throw new Error("Profile could not be created");
      }

      writeClientSession(result.profile);
      setProfile(result.profile);
      setStep(5);
    } catch {
      const fallbackProfile: ClientUserProfile = {
        id: `preview_${Date.now()}`,
        role: "client",
        firstName,
        phone: fullPhone,
        theme,
        tribeBadge: themeConfig.tribeBadge,
        quizCompleted: theme !== "not_set",
        themeSetBy: "quiz",
        themeUpdatedAt: new Date().toISOString(),
        location,
        subscription: { tier: "none", status: "teaser" },
        tribes: theme === "not_set" ? [] : [theme],
        createdAt: new Date().toISOString(),
      };

      writeClientSession(fallbackProfile);
      setProfile(fallbackProfile);
      setStep(5);
    } finally {
      setSubmitting(false);
    }
  }

  function handleOtpChange(index: number, value: string) {
    const digit = value.replace(/\D/g, "").slice(-1);
    const next = [...otp];
    next[index] = digit;
    setOtp(next);

    if (digit && index < otpLength - 1) {
      otpRefs.current[index + 1]?.focus();
    }
  }

  function handleOtpKeyDown(index: number, event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  }

  function handleOtpPaste(event: ClipboardEvent<HTMLInputElement>) {
    event.preventDefault();
    const pastedDigits = event.clipboardData.getData("text").replace(/\D/g, "").slice(0, otpLength).split("");
    const next = Array.from({ length: otpLength }, (_, index) => pastedDigits[index] ?? "");
    setOtp(next);
    otpRefs.current[Math.min(pastedDigits.length, otpLength - 1)]?.focus();
  }

  function useGpsLocation() {
    setLocationMode("gps");
    setLocationError("");

    if (!("geolocation" in navigator)) {
      setLocationMode("manual");
      setLocationError("GPS is not available here. Type your area instead.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const nextLocation: ClientLocation = {
          mode: "gps",
          label: "Near Nairobi - GPS saved",
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };
        setLocationData(nextLocation);
        setManualLocation("");
      },
      () => {
        setLocationMode("manual");
        setLocationData(null);
        setLocationError("No problem. Type your area manually instead.");
      },
      { maximumAge: 60000, timeout: 8000 },
    );
  }

  function continueFromLocation() {
    let nextLocation: ClientLocation;

    if (locationMode === "gps" && locationData) {
      nextLocation = locationData;
    } else if (locationMode === "manual" && manualLocation.trim().length >= 2) {
      nextLocation = { mode: "manual", label: manualLocation.trim() };
    } else {
      nextLocation = { mode: "skipped", label: "Location skipped for now" };
    }

    void createClientProfile(nextLocation);
  }

  return (
    <main
      className="min-h-screen px-4 py-5 text-[var(--ms-charcoal)]"
      style={{ background: `linear-gradient(135deg, ${themeConfig.softColor}, #ffffff 58%, #FDF7F2)` }}
    >
      <section className="mx-auto grid min-h-[calc(100vh-2.5rem)] max-w-5xl content-center">
        <div className="overflow-hidden rounded-[40px] border border-[var(--ms-border)] bg-white shadow-[0_28px_90px_rgba(13,27,42,0.12)]">
          {step < 5 ? (
            <div className="border-b border-[var(--ms-border)] bg-white/90 p-5">
              <div className="flex items-center justify-between gap-3">
                <span
                  className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-white"
                  style={{ backgroundColor: themeConfig.accentColor }}
                >
                  {themeConfig.displayName} world
                </span>
                <span className="hidden text-xs font-semibold uppercase tracking-[0.2em] text-[var(--ms-mauve)] sm:inline">
                  Client signup
                </span>
              </div>
            </div>
          ) : null}

          {step === 1 ? (
            <ScreenShell>
              <p className="font-display text-5xl leading-tight text-[var(--ms-plum)]">Your world is ready for you.</p>
              <p className="mt-4 text-sm leading-7 text-[var(--ms-mauve)]">
                Create your account and we&apos;ll hold your world, your theme, and your preferences - exactly as you chose them.
              </p>
              <div
                className="mt-6 rounded-[26px] border p-4 text-sm font-semibold"
                style={{ borderColor: `${themeConfig.accentColor}44`, backgroundColor: themeConfig.softColor, color: themeConfig.darkColor }}
              >
                <span className="mr-2 inline-block h-2.5 w-2.5 rounded-full" style={{ backgroundColor: themeConfig.accentColor }} />
                Your theme: {themeConfig.displayName} - saved the moment you sign up.
              </div>
              <div className="mt-6 grid gap-3">
                <ValueRow
                  icon={<Sparkles className="h-5 w-5" />}
                  title="Your personalised feed"
                  copy="Professionals and salons matched to your aesthetic, from day one."
                />
                <ValueRow
                  icon={<ShieldCheck className="h-5 w-5" />}
                  title="Your privacy, always"
                  copy="Your contact details are never shared until a booking is confirmed."
                />
                <ValueRow
                  icon={<UserRound className="h-5 w-5" />}
                  title="Your tribe, when you&apos;re ready"
                  copy="Connect with women who share your world and your sense of beauty."
                />
              </div>
              <button
                className="mt-7 inline-flex min-h-13 w-full items-center justify-center gap-2 rounded-full px-6 text-sm font-semibold text-white transition hover:brightness-110"
                onClick={() => setStep(2)}
                style={{ backgroundColor: themeConfig.accentColor }}
                type="button"
              >
                Create my account
                <ArrowRight className="h-4 w-4" />
              </button>
              <p className="mt-4 text-center text-xs leading-6 text-[var(--ms-mauve)]">
                By continuing, you agree to Mobile Salon&apos;s privacy expectations, booking rules, and protected marketplace terms.
              </p>
            </ScreenShell>
          ) : null}

          {step === 2 ? (
            <ScreenShell>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--ms-mauve)]">Step 2 of 5 - Your details</p>
              <h1 className="mt-3 font-display text-5xl leading-tight text-[var(--ms-plum)]">Tell us your first name.</h1>
              <p className="mt-4 text-sm leading-7 text-[var(--ms-mauve)]">Just three things. That&apos;s all we need right now.</p>
              <div className="mt-6 grid gap-4">
                <label className="block rounded-[24px] border border-[var(--ms-border)] bg-[var(--ms-soft-bg)] px-4 py-4">
                  <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--ms-mauve)]">First name</span>
                  <input
                    className="mt-3 w-full bg-transparent text-base font-semibold text-[var(--ms-navy)] outline-none"
                    onChange={(event) => {
                      setFirstName(event.target.value);
                      persistDetails({ firstName: event.target.value });
                    }}
                    placeholder="e.g. Wanjiku"
                    value={firstName}
                  />
                </label>
                <label className="block rounded-[24px] border border-[var(--ms-border)] bg-[var(--ms-soft-bg)] px-4 py-4">
                  <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--ms-mauve)]">Phone</span>
                  <div className="mt-3 flex items-center gap-2">
                    <span className="rounded-full bg-white px-3 py-2 text-sm font-semibold text-[var(--ms-navy)]">+254</span>
                    <input
                      className="min-w-0 flex-1 bg-transparent text-base font-semibold text-[var(--ms-navy)] outline-none"
                      inputMode="numeric"
                      maxLength={9}
                      onChange={(event) => {
                        const nextPhone = event.target.value.replace(/\D/g, "").slice(0, 9);
                        setPhoneDigits(nextPhone);
                        persistDetails({ phone: `+254${nextPhone}` });
                      }}
                      placeholder="7XXXXXXXX"
                      value={phoneDigits}
                    />
                  </div>
                  {phoneDigits && !phoneIsValid ? (
                    <p className="mt-2 text-xs font-semibold text-[var(--ms-danger)]">Use a Kenyan number like +2547XXXXXXXX.</p>
                  ) : null}
                </label>
                <label className="block rounded-[24px] border border-[var(--ms-border)] bg-[var(--ms-soft-bg)] px-4 py-4">
                  <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--ms-mauve)]">Password</span>
                  <input
                    className="mt-3 w-full bg-transparent text-base font-semibold text-[var(--ms-navy)] outline-none"
                    onChange={(event) => {
                      setPassword(event.target.value);
                      persistDetails({ password: event.target.value });
                    }}
                    placeholder="At least 8 characters"
                    type="password"
                    value={password}
                  />
                  <div className="mt-3 h-2 overflow-hidden rounded-full bg-white">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${passwordScore.score * 25}%`,
                        backgroundColor: passwordScore.color,
                      }}
                    />
                  </div>
                  <p className="mt-2 text-xs font-semibold" style={{ color: passwordScore.color }}>
                    {passwordScore.label}
                  </p>
                </label>
              </div>
              <button
                className="mt-6 inline-flex min-h-13 w-full items-center justify-center gap-2 rounded-full px-6 text-sm font-semibold text-white transition disabled:opacity-40"
                disabled={!detailsValid || submitting}
                onClick={() => void sendVerificationCode()}
                style={{ backgroundColor: themeConfig.accentColor }}
                type="button"
              >
                Send verification code
                <ArrowRight className="h-4 w-4" />
              </button>
              <p className="mt-4 rounded-[22px] bg-[var(--ms-soft-bg)] px-4 py-3 text-sm leading-6 text-[var(--ms-mauve)]">
                We will never share your number. Your profile is private until you choose to book.
              </p>
            </ScreenShell>
          ) : null}

          {step === 3 ? (
            <ScreenShell>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--ms-mauve)]">Step 3 of 5 - Verify your number</p>
              <h1 className="mt-3 font-display text-5xl leading-tight text-[var(--ms-plum)]">Check your messages.</h1>
              <p className="mt-4 text-sm leading-7 text-[var(--ms-mauve)]">
                We sent a 6-digit code to {fullPhone}. It expires in 5 minutes.
              </p>
              <div className={cn("mt-6 grid grid-cols-6 gap-2 transition", otpShake ? "translate-x-1" : "")}>
                {otp.map((digit, index) => (
                  <input
                    aria-label={`OTP digit ${index + 1}`}
                    className="h-14 rounded-[18px] border border-[var(--ms-border)] bg-[var(--ms-soft-bg)] text-center text-xl font-semibold text-[var(--ms-navy)] outline-none focus:border-[var(--ms-rose)]"
                    inputMode="numeric"
                    key={`otp-${index}`}
                    maxLength={1}
                    onChange={(event) => handleOtpChange(index, event.target.value)}
                    onKeyDown={(event) => handleOtpKeyDown(index, event)}
                    onPaste={handleOtpPaste}
                    ref={(node) => {
                      otpRefs.current[index] = node;
                    }}
                    value={digit}
                  />
                ))}
              </div>
              {otpError ? <p className="mt-3 text-sm font-semibold text-[var(--ms-danger)]">{otpError}</p> : null}
              <button
                className="mt-6 inline-flex min-h-13 w-full items-center justify-center gap-2 rounded-full px-6 text-sm font-semibold text-white transition disabled:opacity-40"
                disabled={!otpComplete || submitting}
                onClick={() => void verifyOtp()}
                style={{ backgroundColor: themeConfig.accentColor }}
                type="button"
              >
                Verify and continue
                <Check className="h-4 w-4" />
              </button>
              <div className="mt-5 flex flex-col gap-2 text-center text-sm sm:flex-row sm:items-center sm:justify-between">
                <button
                  className="inline-flex items-center justify-center gap-2 rounded-full px-4 py-2 font-semibold text-[var(--ms-mauve)]"
                  onClick={() => setStep(2)}
                  type="button"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Change number
                </button>
                <button
                  className="rounded-full px-4 py-2 font-semibold text-[var(--ms-plum)] disabled:text-[var(--ms-mauve)]"
                  disabled={resendTimer > 0 || resendCount >= 3 || submitting}
                  onClick={() => void sendVerificationCode(true)}
                  type="button"
                >
                  {resendCount >= 3 ? "Too many resend attempts" : resendTimer > 0 ? `Resend in ${resendTimer}s` : "Resend code"}
                </button>
              </div>
              <p className="mt-3 text-center text-xs text-[var(--ms-mauve)]">Preview code: 123456</p>
            </ScreenShell>
          ) : null}

          {step === 4 ? (
            <ScreenShell>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--ms-mauve)]">Step 4 of 5 - Where you are</p>
              <h1 className="mt-3 font-display text-5xl leading-tight text-[var(--ms-plum)]">Where should we look for you?</h1>
              <p className="mt-4 text-sm leading-7 text-[var(--ms-mauve)]">
                This helps us show nearby salons and professionals first. You can skip and add it later.
              </p>
              <div className="mt-6 grid gap-3">
                <LocationChoice
                  active={locationMode === "gps"}
                  copy={locationData?.label ?? "Recommended for nearest professionals and rush bookings."}
                  icon={<MapPin className="h-5 w-5" />}
                  onClick={useGpsLocation}
                  title="Use my location"
                />
                <LocationChoice
                  active={locationMode === "manual"}
                  copy="Type your estate, area, or nearby landmark."
                  icon={<Eye className="h-5 w-5" />}
                  onClick={() => {
                    setLocationMode("manual");
                    setLocationData(null);
                  }}
                  title="Enter manually"
                />
                {locationMode === "manual" ? (
                  <input
                    className="min-h-13 rounded-[22px] border border-[var(--ms-border)] bg-[var(--ms-soft-bg)] px-4 text-sm font-semibold text-[var(--ms-navy)] outline-none"
                    onChange={(event) => setManualLocation(event.target.value)}
                    placeholder="e.g. Kilimani, Ruaka, South B"
                    value={manualLocation}
                  />
                ) : null}
                <LocationChoice
                  active={locationMode === "skipped"}
                  copy="Continue now and choose location when booking."
                  icon={<ArrowRight className="h-5 w-5" />}
                  onClick={() => {
                    setLocationMode("skipped");
                    setLocationData(null);
                  }}
                  title="Skip for now"
                />
              </div>
              {locationError ? <p className="mt-3 text-sm font-semibold text-[var(--ms-danger)]">{locationError}</p> : null}
              <button
                className="mt-6 inline-flex min-h-13 w-full items-center justify-center gap-2 rounded-full px-6 text-sm font-semibold text-white transition disabled:opacity-40"
                disabled={submitting || (locationMode === "manual" && manualLocation.trim().length < 2)}
                onClick={continueFromLocation}
                style={{ backgroundColor: themeConfig.accentColor }}
                type="button"
              >
                Continue
                <ArrowRight className="h-4 w-4" />
              </button>
            </ScreenShell>
          ) : null}

          {step === 5 && profile ? (
            <div className="grid gap-0 lg:grid-cols-[minmax(0,0.42fr)_minmax(0,0.58fr)]">
              <div className="p-6 sm:p-8 lg:p-10">
                <span
                  className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-white"
                  style={{ backgroundColor: themeConfig.accentColor }}
                >
                  ✦ {themeConfig.tribeBadge}
                </span>
                <h1 className="mt-6 font-display text-[34px] font-light leading-tight text-[var(--ms-plum)]">
                  Welcome, {profile.firstName}.<br />
                  Your {themeConfig.displayName} world<br />
                  is ready.
                </h1>
                <p className="mt-4 text-sm leading-7 text-[var(--ms-mauve)]">
                  We saved your theme, protected your phone number, and prepared a first feed of verified beauty professionals matched to the world you chose.
                </p>
                <button
                  className="mt-7 inline-flex min-h-13 w-full items-center justify-center gap-2 rounded-full px-6 text-sm font-semibold text-white transition hover:brightness-110"
                  onClick={() => router.push(safeReturnTo)}
                  style={{ backgroundColor: themeConfig.accentColor }}
                  type="button"
                >
                  Enter my world
                  <ArrowRight className="h-4 w-4" />
                </button>
                {!photoNudgeHidden ? (
                  <div className="mt-5 rounded-[24px] border border-[var(--ms-border)] bg-[var(--ms-soft-bg)] p-4">
                    <p className="text-sm font-semibold text-[var(--ms-navy)]">Add a profile photo later for a warmer, safer booking experience.</p>
                    <p className="mt-2 text-xs leading-5 text-[var(--ms-mauve)]">
                      You can skip it for now. Your phone stays private until a booking is confirmed.
                    </p>
                    <button
                      className="mt-3 rounded-full bg-white px-4 py-2 text-xs font-semibold text-[var(--ms-plum)]"
                      onClick={() => {
                        dismissPhotoNudge();
                        setPhotoNudgeHidden(true);
                      }}
                      type="button"
                    >
                      Not now
                    </button>
                  </div>
                ) : null}
              </div>
              <div className="grid grid-cols-2 gap-3 bg-[var(--ms-soft-bg)] p-4 sm:p-6 lg:p-8">
                {rankedProfessionals.map((professional) => (
                  <Link
                    className="overflow-hidden rounded-[28px] bg-white shadow-[0_12px_34px_rgba(13,27,42,0.08)]"
                    href={`/professionals/${professional.slug}`}
                    key={professional.slug}
                  >
                    <div className="relative h-32">
                      {professional.image ? (
                        <Image
                          alt={professional.image.alt}
                          className="object-cover"
                          fill
                          sizes="(max-width: 768px) 50vw, 240px"
                          src={professional.image.url}
                          style={{ objectPosition: professional.image.position ?? "center" }}
                        />
                      ) : null}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/72 to-transparent" />
                      <BadgeCheck className="absolute right-3 top-3 h-5 w-5 text-white" />
                    </div>
                    <div className="p-4">
                      <p className="text-sm font-semibold text-[var(--ms-navy)]">{professional.name}</p>
                      <p className="mt-1 line-clamp-2 text-xs leading-5 text-[var(--ms-mauve)]">{professional.specialty}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </section>
    </main>
  );
}

function ScreenShell({ children }: { children: ReactNode }) {
  return <div className="mx-auto max-w-xl p-5 sm:p-8 lg:p-10">{children}</div>;
}

function ValueRow({
  icon,
  title,
  copy,
}: {
  icon: ReactNode;
  title: string;
  copy: string;
}) {
  return (
    <div className="flex items-start gap-3 rounded-[24px] bg-[var(--ms-soft-bg)] p-4">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-[var(--ms-rose)]">
        {icon}
      </span>
      <div>
        <p className="font-semibold text-[var(--ms-navy)]">{title}</p>
        <p className="mt-1 text-sm leading-6 text-[var(--ms-mauve)]">{copy}</p>
      </div>
    </div>
  );
}

function LocationChoice({
  active,
  copy,
  icon,
  onClick,
  title,
}: {
  active: boolean;
  copy: string;
  icon: ReactNode;
  onClick: () => void;
  title: string;
}) {
  return (
    <button
      className={cn(
        "rounded-[24px] border p-4 text-left transition hover:-translate-y-0.5",
        active
          ? "border-[var(--ms-rose)] bg-[var(--ms-petal)] text-[var(--ms-plum)]"
          : "border-[var(--ms-border)] bg-[var(--ms-soft-bg)] text-[var(--ms-navy)]",
      )}
      onClick={onClick}
      type="button"
    >
      <div className="flex items-start gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-[var(--ms-rose)]">
          {icon}
        </span>
        <div>
          <p className="font-semibold">{title}</p>
          <p className="mt-1 text-sm leading-6 text-[var(--ms-mauve)]">{copy}</p>
        </div>
      </div>
    </button>
  );
}

function getPasswordScore(password: string) {
  let score = 0;

  if (password.length >= 8) {
    score += 1;
  }

  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) {
    score += 1;
  }

  if (/\d/.test(password)) {
    score += 1;
  }

  if (/[^A-Za-z0-9]/.test(password)) {
    score += 1;
  }

  if (score <= 1) {
    return { score: Math.max(score, 1), label: "Weak password", color: "#B44A5A" };
  }

  if (score === 2) {
    return { score, label: "Fair password", color: "#BA7517" };
  }

  if (score === 3) {
    return { score, label: "Good password", color: "#1D9E75" };
  }

  return { score, label: "Strong password", color: "#1A7A6B" };
}
