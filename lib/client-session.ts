import {
  type ThemeQuizResult,
  CLIENT_SESSION_STORAGE_KEY,
  CLIENT_SIGNUP_STORAGE_KEY,
  PHOTO_NUDGE_STORAGE_KEY,
  QUIZ_THEME_STORAGE_KEY,
  getThemeConfig,
  normalizeThemeKey,
  type ClientSignupDraft,
  type ClientUserProfile,
  type ThemeKey,
} from "@/lib/personalization";
import { getProfessional, getSalon, type ServiceMode } from "@/lib/site-data";

export type AppUserRole = "client" | "salon" | "professional";

export interface ProfileCardPreference {
  id: string;
  label: string;
  enabled: boolean;
  removable?: boolean;
}

export interface SalonUserProfile {
  id: string;
  role: "salon";
  salonName: string;
  contactName: string;
  phone: string;
  email?: string;
  profilePhoto?: string;
  location: string;
  plan: "basic" | "growth" | "premium";
  subscriptionStatus: "draft" | "active" | "needs_payment";
  listingPublished: boolean;
  description: string;
  teamCount: number;
  servicesCount: number;
  cards: ProfileCardPreference[];
  createdAt: string;
}

export interface ProfessionalUserProfile {
  id: string;
  role: "professional";
  displayName: string;
  specialty: string;
  phone: string;
  email?: string;
  profilePhoto?: string;
  location: string;
  serviceMode: ServiceMode;
  areasServed: string[];
  publicSlug: string;
  listingPublished: boolean;
  bio: string;
  cards: ProfileCardPreference[];
  createdAt: string;
}

export type AppUserSession = ClientUserProfile | SalonUserProfile | ProfessionalUserProfile;

export const APP_SESSION_EVENT = "mobile-salon.client-session-change";
export const APP_VISIT_EVENT = "mobile-salon.app-visit-change";

const APP_VISIT_COUNT_STORAGE_KEY = "mobile-salon.app-visits.v1";
const QUIZ_PROMPT_DISMISSED_STORAGE_KEY = "mobile-salon.theme-quiz-dismissed.v1";

function canUseStorage() {
  return typeof window !== "undefined" && "localStorage" in window && "sessionStorage" in window;
}

function safeParse<T>(value: string | null): T | null {
  if (!value) {
    return null;
  }

  try {
    return JSON.parse(value) as T;
  } catch {
    return null;
  }
}

export function readQuizTheme(): ThemeKey {
  if (!canUseStorage()) {
    return "not_set";
  }

  return normalizeThemeKey(window.sessionStorage.getItem(QUIZ_THEME_STORAGE_KEY));
}

export function writeQuizTheme(theme: ThemeKey) {
  if (!canUseStorage()) {
    return;
  }

  window.sessionStorage.setItem(QUIZ_THEME_STORAGE_KEY, normalizeThemeKey(theme));
}

export function readAppVisitCount() {
  if (!canUseStorage()) {
    return 0;
  }

  const stored = Number(window.localStorage.getItem(APP_VISIT_COUNT_STORAGE_KEY));
  return Number.isFinite(stored) && stored > 0 ? stored : 0;
}

export function recordAppVisit() {
  if (!canUseStorage()) {
    return 0;
  }

  const nextCount = readAppVisitCount() + 1;
  window.localStorage.setItem(APP_VISIT_COUNT_STORAGE_KEY, String(nextCount));
  window.dispatchEvent(new Event(APP_VISIT_EVENT));
  return nextCount;
}

export function isThemeQuizPromptDismissed() {
  if (!canUseStorage()) {
    return false;
  }

  return window.localStorage.getItem(QUIZ_PROMPT_DISMISSED_STORAGE_KEY) === "true";
}

export function dismissThemeQuizPrompt() {
  if (!canUseStorage()) {
    return;
  }

  window.localStorage.setItem(QUIZ_PROMPT_DISMISSED_STORAGE_KEY, "true");
  window.dispatchEvent(new Event(APP_VISIT_EVENT));
}

export function readSignupDraft(): ClientSignupDraft | null {
  if (!canUseStorage()) {
    return null;
  }

  return safeParse<ClientSignupDraft>(window.sessionStorage.getItem(CLIENT_SIGNUP_STORAGE_KEY));
}

export function writeSignupDraft(draft: Partial<ClientSignupDraft>) {
  if (!canUseStorage()) {
    return;
  }

  const current = readSignupDraft();
  const theme = normalizeThemeKey(draft.theme ?? current?.theme ?? readQuizTheme());
  const next: ClientSignupDraft = {
    firstName: draft.firstName ?? current?.firstName ?? "",
    phone: draft.phone ?? current?.phone ?? "",
    password: draft.password ?? current?.password,
    theme,
    tribeBadge: draft.tribeBadge ?? current?.tribeBadge ?? getThemeConfig(theme).tribeBadge,
    quiz: draft.quiz ?? current?.quiz,
    location: draft.location ?? current?.location,
    otpVerified: draft.otpVerified ?? current?.otpVerified,
    updatedAt: new Date().toISOString(),
  };

  window.sessionStorage.setItem(CLIENT_SIGNUP_STORAGE_KEY, JSON.stringify(next));
}

export function readAppSession(): AppUserSession | null {
  if (!canUseStorage()) {
    return null;
  }

  return safeParse<AppUserSession>(window.localStorage.getItem(CLIENT_SESSION_STORAGE_KEY));
}

export function writeAppSession(profile: AppUserSession) {
  if (!canUseStorage()) {
    return;
  }

  window.localStorage.setItem(CLIENT_SESSION_STORAGE_KEY, JSON.stringify(profile));
  window.dispatchEvent(new Event(APP_SESSION_EVENT));
}

export function clearAppSession() {
  if (!canUseStorage()) {
    return;
  }

  window.localStorage.removeItem(CLIENT_SESSION_STORAGE_KEY);
  window.dispatchEvent(new Event(APP_SESSION_EVENT));
}

export function readClientSession(): ClientUserProfile | null {
  const session = readAppSession();

  return session?.role === "client" ? session : null;
}

export function writeClientSession(profile: ClientUserProfile) {
  writeAppSession(profile);
}

export function updateClientTheme(theme: ThemeKey) {
  const profile = readClientSession();

  if (!profile) {
    return null;
  }

  const normalizedTheme = normalizeThemeKey(theme);
  const config = getThemeConfig(normalizedTheme);
  const next: ClientUserProfile = {
    ...profile,
    theme: normalizedTheme,
    tribeBadge: config.tribeBadge,
    quizCompleted: normalizedTheme !== "not_set",
    themeSetBy: "settings",
    themeUpdatedAt: new Date().toISOString(),
    tribes: Array.from(new Set([...profile.tribes, normalizedTheme])).filter(
      (item): item is ThemeKey => item !== "not_set",
    ),
  };

  writeClientSession(next);
  return next;
}

export function applyThemeQuizResult(result: ThemeQuizResult) {
  const profile = readClientSession();

  if (!profile) {
    return null;
  }

  const theme = normalizeThemeKey(result.theme);
  const config = getThemeConfig(theme);
  const next: ClientUserProfile = {
    ...profile,
    theme,
    tribeBadge: config.tribeBadge,
    quizCompleted: true,
    quizMetadata: result,
    themeSetBy: "quiz",
    themeUpdatedAt: new Date().toISOString(),
    tribes: Array.from(new Set([...profile.tribes, theme])).filter(
      (item): item is ThemeKey => item !== "not_set",
    ),
  };

  writeClientSession(next);
  return next;
}

export function createPreviewClientSession(overrides?: Partial<ClientUserProfile>): ClientUserProfile {
  const existing = readClientSession();
  const theme = normalizeThemeKey(overrides?.theme ?? existing?.theme ?? readQuizTheme());
  const config = getThemeConfig(theme);

  return {
    id: overrides?.id ?? existing?.id ?? `client_${Date.now()}`,
    role: "client",
    firstName: overrides?.firstName ?? existing?.firstName ?? "Wanjiku",
    phone: overrides?.phone ?? existing?.phone ?? "+254712345678",
    email: overrides?.email ?? existing?.email ?? "wanjiku@example.com",
    profilePhoto: overrides?.profilePhoto ?? existing?.profilePhoto,
    theme,
    tribeBadge: overrides?.tribeBadge ?? existing?.tribeBadge ?? config.tribeBadge,
    quizCompleted: overrides?.quizCompleted ?? existing?.quizCompleted ?? false,
    quizMetadata: overrides?.quizMetadata ?? existing?.quizMetadata,
    themeSetBy: overrides?.themeSetBy ?? existing?.themeSetBy ?? "fallback",
    themeUpdatedAt: overrides?.themeUpdatedAt ?? existing?.themeUpdatedAt ?? new Date().toISOString(),
    location: overrides?.location ?? existing?.location,
    subscription: overrides?.subscription ?? existing?.subscription ?? { tier: "none", status: "teaser" },
    tribes: overrides?.tribes ?? existing?.tribes ?? (theme === "not_set" ? [] : [theme]),
    createdAt: overrides?.createdAt ?? existing?.createdAt ?? new Date().toISOString(),
  };
}

export function createPreviewSalonSession(overrides?: Partial<SalonUserProfile>): SalonUserProfile {
  const salon = getSalon("kilimani-texture-house");

  return {
    id: overrides?.id ?? `salon_${Date.now()}`,
    role: "salon",
    salonName: overrides?.salonName ?? salon?.name ?? "Kilimani Texture House",
    contactName: overrides?.contactName ?? "Grace Njeri",
    phone: overrides?.phone ?? "+254733556677",
    email: overrides?.email ?? "hello@texturesalon.ke",
    profilePhoto: overrides?.profilePhoto ?? salon?.image?.url,
    location: overrides?.location ?? salon?.location ?? "Kilimani",
    plan: overrides?.plan ?? "growth",
    subscriptionStatus: overrides?.subscriptionStatus ?? "needs_payment",
    listingPublished: overrides?.listingPublished ?? false,
    description:
      overrides?.description ??
      salon?.about ??
      "A calm salon page with services, team profiles, portfolio proof, and protected bookings.",
    teamCount: overrides?.teamCount ?? salon?.professionals.length ?? 4,
    servicesCount: overrides?.servicesCount ?? salon?.serviceIds.length ?? 8,
    cards: overrides?.cards ?? [
      { id: "hero", label: "Hero banner", enabled: true },
      { id: "services", label: "Service menu", enabled: true },
      { id: "team", label: "Team showcase", enabled: true },
      { id: "portfolio", label: "Portfolio", enabled: true },
      { id: "packages", label: "Packages", enabled: true, removable: true },
      { id: "reviews", label: "Reviews", enabled: true, removable: true },
    ],
    createdAt: overrides?.createdAt ?? new Date().toISOString(),
  };
}

export function createPreviewProfessionalSession(
  overrides?: Partial<ProfessionalUserProfile>,
): ProfessionalUserProfile {
  const professional = getProfessional("njeri-kamau");

  return {
    id: overrides?.id ?? `professional_${Date.now()}`,
    role: "professional",
    displayName: overrides?.displayName ?? professional?.name ?? "Njeri Kamau",
    specialty: overrides?.specialty ?? professional?.specialty ?? "Protective styling and healthy natural hair care",
    phone: overrides?.phone ?? "+254722334455",
    email: overrides?.email ?? "njeri@mobilesalon.pro",
    profilePhoto: overrides?.profilePhoto ?? professional?.image?.url,
    location: overrides?.location ?? professional?.location ?? "Kilimani",
    serviceMode: overrides?.serviceMode ?? professional?.serviceMode ?? "Both",
    areasServed: overrides?.areasServed ?? professional?.areasServed ?? ["Kilimani", "Lavington", "Westlands"],
    publicSlug: overrides?.publicSlug ?? professional?.slug ?? "njeri-kamau",
    listingPublished: overrides?.listingPublished ?? false,
    bio:
      overrides?.bio ??
      professional?.bio ??
      "Known for careful styling, clear pricing, and calm appointments that respect African hair textures.",
    cards: overrides?.cards ?? [
      { id: "hero", label: "Hero card", enabled: true },
      { id: "services", label: "Services", enabled: true },
      { id: "portfolio", label: "Portfolio", enabled: true },
      { id: "availability", label: "Availability", enabled: true },
      { id: "packages", label: "Packages", enabled: true, removable: true },
      { id: "reviews", label: "Reviews", enabled: true, removable: true },
    ],
    createdAt: overrides?.createdAt ?? new Date().toISOString(),
  };
}

export function isPhotoNudgeDismissed() {
  if (!canUseStorage()) {
    return false;
  }

  return window.localStorage.getItem(PHOTO_NUDGE_STORAGE_KEY) === "true";
}

export function dismissPhotoNudge() {
  if (!canUseStorage()) {
    return;
  }

  window.localStorage.setItem(PHOTO_NUDGE_STORAGE_KEY, "true");
}
