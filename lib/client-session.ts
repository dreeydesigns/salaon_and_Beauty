import {
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

export function readClientSession(): ClientUserProfile | null {
  if (!canUseStorage()) {
    return null;
  }

  return safeParse<ClientUserProfile>(window.localStorage.getItem(CLIENT_SESSION_STORAGE_KEY));
}

export function writeClientSession(profile: ClientUserProfile) {
  if (!canUseStorage()) {
    return;
  }

  window.localStorage.setItem(CLIENT_SESSION_STORAGE_KEY, JSON.stringify(profile));
  window.dispatchEvent(new Event("mobile-salon.client-session-change"));
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
    themeSetBy: "settings",
    themeUpdatedAt: new Date().toISOString(),
    tribes: Array.from(new Set([...profile.tribes, normalizedTheme])).filter(
      (item): item is ThemeKey => item !== "not_set",
    ),
  };

  writeClientSession(next);
  return next;
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
