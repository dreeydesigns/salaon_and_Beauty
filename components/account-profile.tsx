"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Bell,
  BookOpen,
  Camera,
  Crown,
  Grid3X3,
  Heart,
  Lock,
  LogOut,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Settings,
  ShieldCheck,
  Sparkles,
  UserRound,
} from "lucide-react";

import { ImageUploadEditor } from "@/components/image-upload-editor";
import { LanguagePreferenceCard } from "@/components/language-preference-card";
import { MyWorldCard } from "@/components/my-world-card";
import {
  APP_SESSION_EVENT,
  clearAppSession,
  readAppSession,
  writeAppSession,
  type AppUserSession,
} from "@/lib/client-session";
import { readPosts, readSaves, SOCIAL_CHANGE_EVENT, type SocialPost } from "@/lib/social-store";
import { cn } from "@/lib/utils";
import { getThemeConfig } from "@/lib/personalization";
import { getProfessional, getSalon } from "@/lib/site-data";

type ProfileTab = "posts" | "following" | "settings";

export function AccountProfile() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initTab = (searchParams.get("tab") as ProfileTab | null) ?? "posts";
  const [activeTab, setActiveTab] = useState<ProfileTab>(
    ["posts", "following", "settings"].includes(initTab) ? initTab : "posts",
  );
  const [session, setSession] = useState<AppUserSession | null>(null);
  const [myPosts, setMyPosts] = useState<SocialPost[]>([]);
  const [saves, setSaves] = useState({ professionals: [] as string[], salons: [] as string[] });
  const [expandedPost, setExpandedPost] = useState<SocialPost | null>(null);

  // Edit fields (client only)
  const [editFirstName, setEditFirstName] = useState("");
  const [editUsername, setEditUsername] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editLocation, setEditLocation] = useState("");
  const [editBio, setEditBio] = useState("");
  const [saving, setSaving] = useState(false);
  const [savedOk, setSavedOk] = useState(false);
  const avatarInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    function sync() {
      const s = readAppSession();
      setSession(s);
      if (s) {
        setMyPosts(readPosts().filter((p) => p.authorId === s.id));
        setSaves(readSaves());
        if (s.role === "client") {
          setEditFirstName(s.firstName);
          setEditUsername(s.username ?? "");
          setEditPhone(s.phone);
          setEditEmail(s.email ?? "");
          setEditLocation(s.location?.label ?? "");
          setEditBio(s.bio ?? "");
        }
      }
    }
    sync();
    window.addEventListener(APP_SESSION_EVENT, sync);
    window.addEventListener(SOCIAL_CHANGE_EVENT, sync);
    return () => {
      window.removeEventListener(APP_SESSION_EVENT, sync);
      window.removeEventListener(SOCIAL_CHANGE_EVENT, sync);
    };
  }, []);

  if (!session) return null;

  const isGuest = session.role === "guest";
  const isClient = session.role === "client";
  const displayName =
    session.role === "client" ? session.firstName
      : session.role === "professional" ? session.displayName
      : session.role === "salon" ? session.salonName
      : session.role === "shop" ? session.shopName
      : session.role === "delivery" || session.role === "super_admin" ? session.displayName
      : "Guest";
  const username = isClient ? session.username : undefined;
  const bio = isClient ? session.bio : undefined;
  const avatar = "profilePhoto" in session ? session.profilePhoto : undefined;
  const theme = isClient ? session.theme : "not_set";
  const tribeBadge = isClient ? session.tribeBadge : "Guest";
  const themeConfig = getThemeConfig(theme);
  const followCount = saves.professionals.length + saves.salons.length;

  function handleSave() {
    if (!session || !isClient) return;
    setSaving(true);
    const updated = {
      ...session,
      firstName: editFirstName,
      phone: editPhone,
      email: editEmail || undefined,
      username: editUsername || undefined,
      bio: editBio || undefined,
    };
    writeAppSession(updated);
    setTimeout(() => {
      setSaving(false);
      setSavedOk(true);
      setTimeout(() => setSavedOk(false), 2000);
    }, 400);
  }

  function handleAvatarSave(dataUrl: string) {
    if (!session || isGuest || !("profilePhoto" in session)) return;
    writeAppSession({ ...session, profilePhoto: dataUrl } as typeof session);
  }

  function handleSignOut() {
    clearAppSession();
    router.push("/");
  }

  return (
    <div className="mx-auto max-w-2xl pb-28 pt-2">
      {/* Back button */}
      <button
        type="button"
        onClick={() => router.back()}
        className="mb-4 flex items-center gap-2 rounded-full border border-[var(--ms-border)] bg-white px-4 py-2 text-sm font-medium text-[var(--ms-mauve)] shadow-[0_2px_8px_rgba(13,27,42,0.04)] hover:text-[var(--ms-navy)]"
      >
        <ArrowLeft className="h-4 w-4" /> Back
      </button>

      {/* ── Profile header card ─────────────────────────────────── */}
      <div className="mb-4 overflow-hidden rounded-[28px] bg-white shadow-[0_6px_24px_rgba(13,27,42,0.08)]">
        {/* Mini cover gradient */}
        <div
          className="h-24 w-full"
          style={{ background: `linear-gradient(135deg, ${themeConfig.darkColor}, ${themeConfig.accentColor})` }}
        />

        {/* Avatar */}
        <div className="relative -mt-10 flex items-end justify-between px-5">
          <div className="relative">
            <div className="h-20 w-20 overflow-hidden rounded-full border-4 border-white bg-[linear-gradient(135deg,var(--ms-rose),var(--ms-orchid))] shadow-[0_6px_20px_rgba(13,27,42,0.14)] flex items-center justify-center text-2xl font-bold text-white">
              {avatar ? <img src={avatar} alt={displayName} className="h-full w-full object-cover" /> : displayName[0].toUpperCase()}
            </div>
            {!isGuest && (
              <button
                type="button"
                onClick={() => avatarInputRef.current?.click()}
                className="absolute bottom-0 right-0 flex h-7 w-7 items-center justify-center rounded-full bg-[var(--ms-rose)] text-white shadow-[0_2px_8px_rgba(212,83,126,0.4)]"
              >
                <Camera className="h-3.5 w-3.5" />
              </button>
            )}
            <input ref={avatarInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              const reader = new FileReader();
              reader.onload = (ev) => handleAvatarSave(ev.target?.result as string);
              reader.readAsDataURL(file);
            }} />
          </div>

          {/* Dashboard link for pro/salon */}
          {(session.role === "professional" || session.role === "salon") && (
            <Link
              href={session.role === "professional" ? "/pro/dashboard" : "/salon/dashboard"}
              className="mb-1 rounded-full border border-[var(--ms-border)] px-4 py-1.5 text-xs font-semibold text-[var(--ms-plum)] hover:border-[var(--ms-rose)] hover:text-[var(--ms-rose)]"
            >
              Dashboard →
            </Link>
          )}
        </div>

        {/* Name + identity */}
        <div className="px-5 pb-5 pt-3">
          <h1 className="text-xl font-bold text-[var(--ms-navy)]">{displayName}</h1>
          {username && <p className="text-sm text-[var(--ms-mauve)]">@{username}</p>}
          {isGuest && (
            <span className="mt-1 inline-flex items-center gap-1 rounded-full bg-[var(--ms-soft-bg)] px-3 py-1 text-xs font-semibold text-[var(--ms-mauve)]">
              Guest visitor
            </span>
          )}
          {!isGuest && (
            <span
              className="mt-1 inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-bold text-white"
              style={{ backgroundColor: themeConfig.accentColor }}
            >
              ✦ {tribeBadge}
            </span>
          )}
          {bio && <p className="mt-2 text-sm leading-6 text-[var(--ms-mauve)]">{bio}</p>}

          {/* Stats */}
          <div className="mt-4 flex gap-6 border-t border-[var(--ms-border)] pt-4">
            <div className="text-center">
              <p className="text-lg font-bold text-[var(--ms-navy)]">{myPosts.length}</p>
              <p className="text-[11px] text-[var(--ms-mauve)]">Posts</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold text-[var(--ms-navy)]">{followCount}</p>
              <p className="text-[11px] text-[var(--ms-mauve)]">Following</p>
            </div>
            {isClient && (
              <div className="text-center">
                <p className="text-lg font-bold text-[var(--ms-navy)]">{session.tribes?.length ?? 0}</p>
                <p className="text-[11px] text-[var(--ms-mauve)]">Tribes</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Guest CTA ─────────────────────────────────────────────── */}
      {isGuest && (
        <div className="mb-4 rounded-[24px] border border-[var(--ms-rose)]/20 bg-[var(--ms-petal)] p-5 text-center">
          <Sparkles className="mx-auto h-8 w-8 text-[var(--ms-rose)]" />
          <p className="mt-2 text-sm font-bold text-[var(--ms-plum)]">You're browsing as a guest</p>
          <p className="mt-1 text-xs leading-5 text-[var(--ms-mauve)]">
            Create a free account to post, book, message professionals, and build your beauty world.
          </p>
          <div className="mt-3 flex flex-col gap-2">
            <Link href="/signup/client" className="rounded-full bg-[linear-gradient(135deg,var(--ms-rose),var(--ms-orchid))] py-2.5 text-sm font-bold text-white shadow-[0_6px_18px_rgba(212,83,126,0.3)] text-center">
              Create free account
            </Link>
            <button type="button" onClick={handleSignOut} className="rounded-full border border-[var(--ms-border)] py-2.5 text-sm font-medium text-[var(--ms-mauve)]">
              Sign out (end guest session)
            </button>
          </div>
        </div>
      )}

      {/* ── Tabs ──────────────────────────────────────────────────── */}
      {!isGuest && (
        <>
          <div className="mb-4 flex border-b border-[var(--ms-border)]">
            {([
              { key: "posts", label: "Posts", icon: <Grid3X3 className="h-4 w-4" /> },
              { key: "following", label: "Following", icon: <Heart className="h-4 w-4" /> },
              { key: "settings", label: "Settings", icon: <Settings className="h-4 w-4" /> },
            ] as { key: ProfileTab; label: string; icon: React.ReactNode }[]).map((t) => (
              <button
                key={t.key}
                type="button"
                onClick={() => setActiveTab(t.key)}
                className={cn(
                  "flex flex-1 items-center justify-center gap-2 border-b-2 py-3 text-sm font-semibold transition",
                  activeTab === t.key
                    ? "border-[var(--ms-rose)] text-[var(--ms-rose)]"
                    : "border-transparent text-[var(--ms-mauve)] hover:text-[var(--ms-navy)]",
                )}
              >
                {t.icon}
                <span className="hidden sm:inline">{t.label}</span>
              </button>
            ))}
          </div>

          {/* Posts tab */}
          {activeTab === "posts" && (
            <div>
              {myPosts.length === 0 ? (
                <div className="rounded-[24px] border border-[var(--ms-border)] bg-white py-12 text-center">
                  <Grid3X3 className="mx-auto h-10 w-10 text-[var(--ms-mauve)] opacity-30" />
                  <p className="mt-3 text-sm font-semibold text-[var(--ms-navy)]">No posts yet</p>
                  <p className="mt-1 text-xs text-[var(--ms-mauve)]">Go to Home to share your first beauty moment.</p>
                  <Link href="/home" className="mt-3 inline-flex items-center gap-2 rounded-full bg-[var(--ms-petal)] px-5 py-2 text-sm font-semibold text-[var(--ms-rose)]">
                    Go to Home
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-3 gap-1 sm:gap-2">
                  {myPosts.map((post) => (
                    <button
                      key={post.id}
                      type="button"
                      onClick={() => setExpandedPost(post)}
                      className="group relative aspect-square overflow-hidden rounded-[12px] bg-[var(--ms-soft-bg)]"
                    >
                      {post.images[0] ? (
                        <img src={post.images[0]} alt="" className="h-full w-full object-cover" />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-[var(--ms-petal)] p-2">
                          <p className="text-center text-[10px] leading-4 text-[var(--ms-mauve)] line-clamp-3">{post.caption}</p>
                        </div>
                      )}
                      <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/0 opacity-0 transition group-hover:bg-black/30 group-hover:opacity-100">
                        <span className="flex items-center gap-1 text-xs font-bold text-white"><Heart className="h-3.5 w-3.5 fill-white" />{post.likes}</span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Following tab */}
          {activeTab === "following" && (
            <div className="space-y-2">
              {saves.professionals.length === 0 && saves.salons.length === 0 ? (
                <div className="rounded-[24px] border border-[var(--ms-border)] bg-white py-12 text-center">
                  <Heart className="mx-auto h-10 w-10 text-[var(--ms-mauve)] opacity-30" />
                  <p className="mt-3 text-sm font-semibold text-[var(--ms-navy)]">Not following anyone yet</p>
                  <Link href="/discover" className="mt-3 inline-flex items-center gap-2 rounded-full bg-[var(--ms-petal)] px-5 py-2 text-sm font-semibold text-[var(--ms-rose)]">
                    Discover professionals
                  </Link>
                </div>
              ) : (
                <>
                  {saves.professionals.map((slug) => {
                    const pro = getProfessional(slug);
                    if (!pro) return null;
                    return (
                      <div key={slug} className="flex items-center gap-3 rounded-[18px] border border-[var(--ms-border)] bg-white p-3">
                        <div
                          className="h-11 w-11 shrink-0 rounded-full bg-[var(--ms-soft-bg)] bg-cover bg-center"
                          style={{ backgroundImage: pro.image ? `url(${pro.image.url})` : undefined }}
                        />
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-semibold text-[var(--ms-navy)]">{pro.name}</p>
                          <p className="truncate text-xs text-[var(--ms-mauve)]">{pro.specialty}</p>
                        </div>
                        <Link href={`/professionals/${slug}`} className="shrink-0 rounded-full border border-[var(--ms-border)] px-3 py-1.5 text-xs font-semibold text-[var(--ms-plum)]">View</Link>
                      </div>
                    );
                  })}
                  {saves.salons.map((slug) => {
                    const salon = getSalon(slug);
                    if (!salon) return null;
                    return (
                      <div key={slug} className="flex items-center gap-3 rounded-[18px] border border-[var(--ms-border)] bg-white p-3">
                        <div
                          className="h-11 w-11 shrink-0 rounded-full bg-[var(--ms-soft-bg)] bg-cover bg-center"
                          style={{ backgroundImage: salon.image ? `url(${salon.image.url})` : undefined }}
                        />
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-semibold text-[var(--ms-navy)]">{salon.name}</p>
                          <p className="truncate text-xs text-[var(--ms-mauve)]">{salon.location}</p>
                        </div>
                        <Link href={`/salons/${slug}`} className="shrink-0 rounded-full border border-[var(--ms-border)] px-3 py-1.5 text-xs font-semibold text-[var(--ms-plum)]">View</Link>
                      </div>
                    );
                  })}
                </>
              )}
            </div>
          )}

          {/* Settings tab */}
          {activeTab === "settings" && (
            <div className="space-y-4">
              {/* Edit profile */}
              {isClient && (
                <div className="rounded-[24px] border border-[var(--ms-border)] bg-white p-5 shadow-[0_4px_16px_rgba(13,27,42,0.04)]">
                  <p className="mb-4 text-xs font-bold uppercase tracking-[0.18em] text-[var(--ms-mauve)]">Edit Profile</p>
                  <div className="space-y-3">
                    {[
                      { label: "First name", icon: <UserRound className="h-4 w-4" />, value: editFirstName, onChange: setEditFirstName },
                      { label: "Username", icon: <Crown className="h-4 w-4" />, value: editUsername, onChange: setEditUsername, placeholder: "@handle" },
                      { label: "Phone", icon: <Phone className="h-4 w-4" />, value: editPhone, onChange: setEditPhone, type: "tel" },
                      { label: "Email", icon: <Mail className="h-4 w-4" />, value: editEmail, onChange: setEditEmail, type: "email" },
                      { label: "Location", icon: <MapPin className="h-4 w-4" />, value: editLocation, onChange: setEditLocation, placeholder: "e.g. Kilimani" },
                    ].map((f) => (
                      <label key={f.label} className="flex items-center gap-3 rounded-[16px] border border-[var(--ms-border)] bg-[var(--ms-soft-bg)] px-4 py-3">
                        <span className="shrink-0 text-[var(--ms-rose)]">{f.icon}</span>
                        <div className="min-w-0 flex-1">
                          <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--ms-mauve)]">{f.label}</p>
                          <input
                            type={f.type ?? "text"}
                            className="mt-0.5 w-full bg-transparent text-sm text-[var(--ms-charcoal)] outline-none placeholder:text-[var(--ms-border)]"
                            value={f.value}
                            onChange={(e) => f.onChange(e.target.value)}
                            placeholder={f.placeholder ?? f.label}
                          />
                        </div>
                      </label>
                    ))}
                    <label className="block rounded-[16px] border border-[var(--ms-border)] bg-[var(--ms-soft-bg)] px-4 py-3">
                      <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--ms-mauve)]">
                        <MessageCircle className="h-3.5 w-3.5 text-[var(--ms-rose)]" /> Bio
                      </div>
                      <textarea
                        className="mt-1 w-full resize-none bg-transparent text-sm leading-6 text-[var(--ms-charcoal)] outline-none placeholder:text-[var(--ms-border)]"
                        rows={3}
                        placeholder="Your beauty story…"
                        value={editBio}
                        onChange={(e) => setEditBio(e.target.value)}
                      />
                    </label>
                  </div>
                  <button
                    type="button"
                    onClick={handleSave}
                    disabled={saving}
                    className="mt-4 flex min-h-11 w-full items-center justify-center rounded-full bg-[linear-gradient(135deg,var(--ms-rose),var(--ms-orchid))] text-sm font-bold text-white shadow-[0_6px_18px_rgba(212,83,126,0.28)] transition hover:brightness-110 disabled:opacity-60"
                  >
                    {savedOk ? "Saved ✓" : saving ? "Saving…" : "Save changes"}
                  </button>
                </div>
              )}

              {/* Privacy & safety */}
              <div className="rounded-[24px] border border-[var(--ms-border)] bg-white p-5 shadow-[0_4px_16px_rgba(13,27,42,0.04)]">
                <p className="mb-4 text-xs font-bold uppercase tracking-[0.18em] text-[var(--ms-mauve)]">Privacy & Safety</p>
                {[
                  { icon: <Lock className="h-4 w-4" />, label: "Contact privacy", value: "Hidden until booking confirmed" },
                  { icon: <Bell className="h-4 w-4" />, label: "Notifications", value: "On" },
                  { icon: <ShieldCheck className="h-4 w-4" />, label: "Safe space mode", value: "Active" },
                ].map((row) => (
                  <div key={row.label} className="flex items-center justify-between py-3 border-b border-[var(--ms-border)] last:border-0">
                    <div className="flex items-center gap-3 text-sm text-[var(--ms-charcoal)]">
                      <span className="text-[var(--ms-rose)]">{row.icon}</span>
                      {row.label}
                    </div>
                    <span className="rounded-full bg-[var(--ms-soft-bg)] px-3 py-1 text-xs font-semibold text-[var(--ms-mauve)]">{row.value}</span>
                  </div>
                ))}
              </div>

              {/* Quick links */}
              <div className="rounded-[24px] border border-[var(--ms-border)] bg-white p-5">
                <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-[var(--ms-mauve)]">Quick Links</p>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { label: "My bookings", href: "/activity" },
                    { label: "Explore packages", href: "/explore" },
                    { label: "Shop counter", href: "/counter" },
                    { label: "Book a service", href: "/book" },
                    { label: "Beauty guide", href: "/guide" },
                    { label: "Help & support", href: "/help" },
                  ].map((lk) => (
                    <Link
                      key={lk.href}
                      href={lk.href}
                      className="rounded-[14px] border border-[var(--ms-border)] bg-[var(--ms-soft-bg)] px-4 py-3 text-sm font-medium text-[var(--ms-navy)] hover:border-[var(--ms-rose)]/40 hover:bg-[var(--ms-petal)]"
                    >
                      {lk.label}
                    </Link>
                  ))}
                </div>
              </div>

              <MyWorldCard />
              <LanguagePreferenceCard />

              {/* Sign out */}
              <button
                type="button"
                onClick={handleSignOut}
                className="flex w-full items-center justify-center gap-2 rounded-[20px] border border-red-100 bg-white py-4 text-sm font-semibold text-red-500 shadow-[0_2px_8px_rgba(13,27,42,0.04)] hover:border-red-200 hover:bg-red-50"
              >
                <LogOut className="h-4 w-4" /> Sign out
              </button>
            </div>
          )}
        </>
      )}

      {/* ── Post detail modal ──────────────────────────────────── */}
      {expandedPost && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm sm:items-center" onClick={() => setExpandedPost(null)}>
          <div className="w-full max-w-lg overflow-hidden rounded-t-[32px] bg-white shadow-[0_-18px_60px_rgba(13,27,42,0.22)] sm:rounded-[32px]" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-4">
              <p className="text-sm font-semibold text-[var(--ms-navy)]">{expandedPost.authorName}</p>
              <button type="button" onClick={() => setExpandedPost(null)} className="rounded-full bg-[var(--ms-soft-bg)] p-2 text-[var(--ms-mauve)]">✕</button>
            </div>
            {expandedPost.images[0] && <img src={expandedPost.images[0]} alt="" className="w-full aspect-square object-cover" />}
            <div className="p-4">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1 text-sm text-[var(--ms-mauve)]"><Heart className="h-4 w-4" />{expandedPost.likes}</span>
                <span className="flex items-center gap-1 text-sm text-[var(--ms-mauve)]"><MessageCircle className="h-4 w-4" />{expandedPost.comments.length}</span>
              </div>
              {expandedPost.caption && <p className="mt-2 text-sm leading-6 text-[var(--ms-charcoal)]">{expandedPost.caption}</p>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
