"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  BadgeCheck,
  Bell,
  BriefcaseBusiness,
  Camera,
  Crown,
  Globe2,
  Grid3X3,
  Heart,
  ImagePlus,
  LayoutPanelTop,
  Lock,
  Mail,
  MapPin,
  MessageCircle,
  MessageSquare,
  Phone,
  Plus,
  Send,
  Settings,
  ShieldCheck,
  Sparkles,
  Store,
  UserRound,
  Users,
  X,
} from "lucide-react";

import { ImageUploadEditor } from "@/components/image-upload-editor";
import { LanguagePreferenceCard } from "@/components/language-preference-card";
import { CTAButton, SectionReveal } from "@/components/marketplace-ui";
import { MyWorldCard } from "@/components/my-world-card";
import {
  APP_SESSION_EVENT,
  clearAppSession,
  readAppSession,
  writeAppSession,
  type AppUserSession,
  type ProfessionalUserProfile,
  type ProfileCardPreference,
  type SalonUserProfile,
} from "@/lib/client-session";
import {
  readSaves,
  readPosts,
  writePost,
  likePost,
  addComment,
  readThreads,
  markThreadRead,
  sendMessage,
  getOrCreateThreadId,
  SOCIAL_CHANGE_EVENT,
  type SocialPost,
  type SocialSaves,
  type SocialComment,
  type MessageThread,
} from "@/lib/social-store";
import { getProfessional, getSalon } from "@/lib/site-data";
import { cn } from "@/lib/utils";

export function RoleProfileWorkspace() {
  const router = useRouter();
  const [session, setSession] = useState<AppUserSession | null>(null);

  useEffect(() => {
    function syncSession() {
      setSession(readAppSession());
    }

    syncSession();
    window.addEventListener("storage", syncSession);
    window.addEventListener(APP_SESSION_EVENT, syncSession);

    return () => {
      window.removeEventListener("storage", syncSession);
      window.removeEventListener(APP_SESSION_EVENT, syncSession);
    };
  }, []);

  function save(next: AppUserSession) {
    setSession(next);
    writeAppSession(next);
  }

  if (!session) {
    return null;
  }

  if (session.role === "client") {
    return <ClientProfileWorkspace session={session} onSave={save} />;
  }

  if (session.role === "salon") {
    return <SalonProfileWorkspace session={session} onSave={save} />;
  }

  if (session.role !== "professional") {
    // guest session — shouldn't land on profile workspace but guard anyway
    return null;
  }

  return (
    <ProfessionalProfileWorkspace
      onDeleteDraft={() => {
        clearAppSession();
        router.push("/auth/sign-up");
      }}
      onSave={save}
      session={session}
    />
  );
}

// ── Client social profile ─────────────────────────────────────────────────────

type ClientTab = "posts" | "following" | "messages" | "settings";

function ClientProfileWorkspace({
  session,
  onSave,
}: {
  session: Extract<AppUserSession, { role: "client" }>;
  onSave: (session: AppUserSession) => void;
}) {
  const searchParams = useSearchParams();
  const initialTab = (searchParams.get("tab") as ClientTab | null) ?? "posts";
  const [activeTab, setActiveTab] = useState<ClientTab>(
    (["posts", "following", "messages", "settings"] as ClientTab[]).includes(initialTab) ? initialTab : "posts"
  );
  const [posts, setPosts] = useState<SocialPost[]>([]);
  const [saves, setSaves] = useState<SocialSaves>({ professionals: [], salons: [] });
  const [showNewPost, setShowNewPost] = useState(false);
  const [newPostImages, setNewPostImages] = useState<string[]>([]);
  const [newPostCaption, setNewPostCaption] = useState("");
  const [newPostTag, setNewPostTag] = useState("before_after");
  const [expandedPost, setExpandedPost] = useState<SocialPost | null>(null);
  const [commentText, setCommentText] = useState("");
  const [editBio, setEditBio] = useState(session.bio ?? "");
  const [editUsername, setEditUsername] = useState(session.username ?? "");
  const [editFirstName, setEditFirstName] = useState(session.firstName);
  const [editPhone, setEditPhone] = useState(session.phone);
  const [editEmail, setEditEmail] = useState(session.email ?? "");
  const [editLocation, setEditLocation] = useState(session.location?.label ?? "");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [threads, setThreads] = useState<MessageThread[]>([]);
  const [activeThread, setActiveThread] = useState<MessageThread | null>(null);
  const [dmText, setDmText] = useState("");
  const imageInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    function sync() {
      setPosts(readPosts().filter((p) => p.authorId === session.id));
      setSaves(readSaves());
      setThreads(readThreads().filter((t) => t.participantIds.includes(session.id)));
    }
    sync();
    window.addEventListener(SOCIAL_CHANGE_EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(SOCIAL_CHANGE_EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, [session.id]);

  function handleSaveProfile() {
    setSaving(true);
    onSave({
      ...session,
      firstName: editFirstName,
      phone: editPhone,
      email: editEmail || undefined,
      bio: editBio || undefined,
      username: editUsername || undefined,
    });
    setTimeout(() => {
      setSaving(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }, 400);
  }

  function handleAvatarSave(dataUrl: string) {
    onSave({ ...session, profilePhoto: dataUrl });
  }

  function handleCoverSave(dataUrl: string) {
    onSave({ ...session, coverPhoto: dataUrl } as typeof session);
  }

  function handlePublishPost() {
    if (!newPostCaption.trim() && newPostImages.length === 0) return;
    const post: SocialPost = {
      id: `post_${Date.now()}`,
      authorId: session.id,
      authorName: session.firstName,
      authorAvatar: session.profilePhoto,
      authorRole: "client",
      type: newPostTag as SocialPost["type"],
      images: newPostImages,
      caption: newPostCaption,
      tags: [],
      likes: 0,
      savedBy: [],
      comments: [],
      createdAt: new Date().toISOString(),
    };
    writePost(post);
    setNewPostImages([]);
    setNewPostCaption("");
    setShowNewPost(false);
    setPosts((prev) => [post, ...prev]);
  }

  function handleAddImage(dataUrl: string) {
    setNewPostImages((prev) => [...prev, dataUrl]);
  }

  function handleLike(postId: string) {
    likePost(postId, session.id);
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id !== postId) return p;
        const liked = p.savedBy.includes(session.id);
        return {
          ...p,
          likes: liked ? p.likes - 1 : p.likes + 1,
          savedBy: liked ? p.savedBy.filter((id) => id !== session.id) : [...p.savedBy, session.id],
        };
      }),
    );
  }

  function handleComment() {
    if (!expandedPost || !commentText.trim()) return;
    const comment: SocialComment = {
      id: `c_${Date.now()}`,
      authorId: session.id,
      authorName: session.firstName,
      authorAvatar: session.profilePhoto,
      text: commentText,
      createdAt: new Date().toISOString(),
    };
    addComment(expandedPost.id, comment);
    setExpandedPost((p) => p ? { ...p, comments: [...p.comments, comment] } : p);
    setCommentText("");
  }

  const followedPros = (saves.professionals ?? [])
    .map((slug) => getProfessional(slug))
    .filter(Boolean);
  const followedSalons = (saves.salons ?? [])
    .map((slug) => getSalon(slug))
    .filter(Boolean);

  const initials = session.firstName.slice(0, 1).toUpperCase();
  const coverBg = (session as typeof session & { coverPhoto?: string }).coverPhoto;
  const handle = (session as typeof session & { username?: string }).username;

  return (
    <div className="mx-auto max-w-3xl pb-24">
      {/* ── Cover photo ─────────────────────────────────────────────────────── */}
      <div className="relative h-44 overflow-hidden rounded-b-[0px] rounded-t-[32px] sm:h-52 lg:rounded-t-[40px]">
        {coverBg ? (
          <img src={coverBg} alt="Cover" className="h-full w-full object-cover" />
        ) : (
          <div className="h-full w-full bg-[linear-gradient(135deg,var(--ms-plum),var(--ms-rose),var(--ms-orchid))]" />
        )}
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/10" />
        {/* Upload cover button */}
        <label className="absolute right-3 top-3 flex cursor-pointer items-center gap-1.5 rounded-full bg-black/35 px-3 py-1.5 text-[11px] font-semibold text-white backdrop-blur hover:bg-black/50">
          <Camera className="h-3.5 w-3.5" />
          Edit cover
          <input type="file" accept="image/*" className="sr-only" onChange={(e) => {
            const file = e.target.files?.[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = (ev) => { if (ev.target?.result) handleCoverSave(ev.target.result as string); };
            reader.readAsDataURL(file);
          }} />
        </label>
      </div>

      {/* ── Avatar + identity ───────────────────────────────────────────────── */}
      <div className="relative px-4 sm:px-6">
        {/* Avatar — overlaps cover */}
        <div className="relative -mt-12 w-fit">
          <div className="relative h-24 w-24 overflow-hidden rounded-full border-4 border-white bg-[var(--ms-soft-bg)] shadow-[0_8px_24px_rgba(13,27,42,0.18)]">
            {session.profilePhoto ? (
              <img src={session.profilePhoto} alt={session.firstName} className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-[linear-gradient(135deg,var(--ms-rose),var(--ms-orchid))] text-3xl font-bold text-white">
                {initials}
              </div>
            )}
          </div>
          {/* Camera overlay on avatar */}
          <label className="absolute bottom-0 right-0 flex h-7 w-7 cursor-pointer items-center justify-center rounded-full bg-[var(--ms-rose)] text-white shadow-md hover:bg-[var(--ms-plum)]">
            <Camera className="h-3.5 w-3.5" />
            <input type="file" accept="image/*" className="sr-only" onChange={(e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              const reader = new FileReader();
              reader.onload = (ev) => { if (ev.target?.result) handleAvatarSave(ev.target.result as string); };
              reader.readAsDataURL(file);
            }} />
          </label>
        </div>

        {/* Name + handle + bio */}
        <div className="mt-3">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h1 className="text-2xl font-bold text-[var(--ms-navy)]">{session.firstName}</h1>
              {handle && (
                <p className="mt-0.5 text-sm text-[var(--ms-mauve)]">@{handle}</p>
              )}
              <span className="mt-1 inline-flex items-center gap-1 rounded-full bg-[var(--ms-petal)] px-3 py-1 text-[11px] font-semibold text-[var(--ms-rose)]">
                <Sparkles className="h-3 w-3" />
                {session.tribeBadge}
              </span>
            </div>
            <button
              type="button"
              onClick={() => setActiveTab("settings")}
              className="flex items-center gap-1.5 rounded-full border border-[var(--ms-border)] px-4 py-2 text-sm font-semibold text-[var(--ms-navy)] hover:border-[var(--ms-rose)] hover:text-[var(--ms-rose)]"
            >
              <Settings className="h-4 w-4" />
              Edit profile
            </button>
          </div>

          {(session as typeof session & { bio?: string }).bio && (
            <p className="mt-3 text-sm leading-6 text-[var(--ms-charcoal)]">
              {(session as typeof session & { bio?: string }).bio}
            </p>
          )}

          {session.location?.label && (
            <p className="mt-1.5 flex items-center gap-1 text-xs text-[var(--ms-mauve)]">
              <MapPin className="h-3.5 w-3.5" /> {session.location.label}
            </p>
          )}
        </div>

        {/* Stats bar */}
        <div className="mt-4 flex gap-6 border-b border-[var(--ms-border)] pb-4">
          {[
            { label: "Posts", value: posts.length },
            { label: "Following", value: followedPros.length + followedSalons.length },
            { label: "Saved", value: (saves.professionals?.length ?? 0) + (saves.salons?.length ?? 0) },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-xl font-bold text-[var(--ms-navy)]">{stat.value}</p>
              <p className="text-xs text-[var(--ms-mauve)]">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="mt-0 flex border-b border-[var(--ms-border)]">
          {(
            [
              { key: "posts", label: "Posts", icon: <Grid3X3 className="h-4 w-4" /> },
              { key: "following", label: "Following", icon: <Users className="h-4 w-4" /> },
              { key: "messages", label: "Messages", icon: <MessageCircle className="h-4 w-4" /> },
              { key: "settings", label: "Settings", icon: <Settings className="h-4 w-4" /> },
            ] as { key: ClientTab; label: string; icon: ReactNode }[]
          ).map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              className={cn(
                "flex flex-1 items-center justify-center gap-2 border-b-2 py-3 text-sm font-semibold transition",
                activeTab === tab.key
                  ? "border-[var(--ms-rose)] text-[var(--ms-rose)]"
                  : "border-transparent text-[var(--ms-mauve)] hover:text-[var(--ms-navy)]",
              )}
            >
              <span className="relative">
                {tab.icon}
                {tab.key === "messages" && threads.some((t) => t.messages.some((m) => !m.read && m.senderId !== session.id)) && (
                  <span className="absolute -right-1 -top-1 h-2 w-2 rounded-full bg-[var(--ms-rose)]" />
                )}
              </span>
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* ── Posts tab ────────────────────────────────────────────────────── */}
        {activeTab === "posts" && (
          <div className="mt-5">
            {/* New post CTA */}
            <button
              type="button"
              onClick={() => setShowNewPost(true)}
              className="mb-5 flex w-full items-center gap-3 rounded-[24px] border-2 border-dashed border-[var(--ms-border)] bg-[var(--ms-soft-bg)] px-5 py-4 text-left transition hover:border-[var(--ms-rose)]"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[linear-gradient(135deg,var(--ms-rose),var(--ms-orchid))] text-white">
                <Plus className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-[var(--ms-navy)]">Share your beauty moment</p>
                <p className="text-xs text-[var(--ms-mauve)]">Before/after, inspo, tips — share it with the community</p>
              </div>
            </button>

            {posts.length === 0 ? (
              <div className="flex flex-col items-center py-16 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[var(--ms-soft-bg)]">
                  <ImagePlus className="h-8 w-8 text-[var(--ms-mauve)] opacity-50" />
                </div>
                <p className="mt-4 text-base font-semibold text-[var(--ms-navy)]">Your beauty board is empty</p>
                <p className="mt-2 text-sm text-[var(--ms-mauve)]">Share your first before/after or beauty inspiration.</p>
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-1 sm:gap-2">
                {posts.map((post) => (
                  <button
                    key={post.id}
                    type="button"
                    onClick={() => setExpandedPost(post)}
                    className="group relative aspect-square overflow-hidden rounded-[12px] bg-[var(--ms-soft-bg)]"
                  >
                    {post.images[0] ? (
                      <img
                        src={post.images[0]}
                        alt={post.caption}
                        className="h-full w-full object-cover transition group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-[linear-gradient(135deg,var(--ms-petal),var(--ms-soft-bg))]">
                        <Sparkles className="h-8 w-8 text-[var(--ms-rose)] opacity-40" />
                      </div>
                    )}
                    <div className="absolute inset-0 flex items-center justify-center gap-3 bg-black/0 text-white opacity-0 transition group-hover:bg-black/30 group-hover:opacity-100">
                      <span className="flex items-center gap-1 text-xs font-bold">
                        <Heart className="h-4 w-4" /> {post.likes}
                      </span>
                      <span className="flex items-center gap-1 text-xs font-bold">
                        <MessageCircle className="h-4 w-4" /> {post.comments.length}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── Following tab ────────────────────────────────────────────────── */}
        {activeTab === "following" && (
          <div className="mt-5 space-y-4">
            {followedPros.length === 0 && followedSalons.length === 0 ? (
              <div className="flex flex-col items-center py-16 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[var(--ms-soft-bg)]">
                  <Users className="h-8 w-8 text-[var(--ms-mauve)] opacity-50" />
                </div>
                <p className="mt-4 text-base font-semibold text-[var(--ms-navy)]">No one saved yet</p>
                <p className="mt-2 text-sm text-[var(--ms-mauve)]">Visit a professional or salon and tap Follow to add them here.</p>
                <CTAButton href="/home" className="mt-5">Browse the marketplace</CTAButton>
              </div>
            ) : (
              <>
                {followedPros.length > 0 && (
                  <div>
                    <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--ms-mauve)]">Professionals</p>
                    <div className="space-y-3">
                      {followedPros.map((pro) => pro && (
                        <div key={pro.slug} className="flex items-center gap-3 rounded-[20px] border border-[var(--ms-border)] bg-white p-3 shadow-[0_2px_8px_rgba(13,27,42,0.04)]">
                          <div
                            className="h-12 w-12 shrink-0 rounded-full bg-[var(--ms-soft-bg)] bg-cover bg-center"
                            style={{ backgroundImage: pro.image ? `url(${pro.image.url})` : undefined }}
                          />
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-semibold text-[var(--ms-navy)]">{pro.name}</p>
                            <p className="truncate text-xs text-[var(--ms-mauve)]">{pro.specialty} · {pro.location}</p>
                          </div>
                          <Link href={`/professionals/${pro.slug}`} className="shrink-0 rounded-full border border-[var(--ms-border)] px-3 py-1.5 text-xs font-semibold text-[var(--ms-plum)] hover:border-[var(--ms-rose)] hover:text-[var(--ms-rose)]">
                            View
                          </Link>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {followedSalons.length > 0 && (
                  <div>
                    <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--ms-mauve)]">Salons</p>
                    <div className="space-y-3">
                      {followedSalons.map((salon) => salon && (
                        <div key={salon.slug} className="flex items-center gap-3 rounded-[20px] border border-[var(--ms-border)] bg-white p-3 shadow-[0_2px_8px_rgba(13,27,42,0.04)]">
                          <div
                            className="h-12 w-12 shrink-0 rounded-full bg-[var(--ms-soft-bg)] bg-cover bg-center"
                            style={{ backgroundImage: salon.image ? `url(${salon.image.url})` : undefined }}
                          />
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-semibold text-[var(--ms-navy)]">{salon.name}</p>
                            <p className="truncate text-xs text-[var(--ms-mauve)]">{salon.location}</p>
                          </div>
                          <Link href={`/salons/${salon.slug}`} className="shrink-0 rounded-full border border-[var(--ms-border)] px-3 py-1.5 text-xs font-semibold text-[var(--ms-plum)] hover:border-[var(--ms-rose)] hover:text-[var(--ms-rose)]">
                            View
                          </Link>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* ── Messages tab ─────────────────────────────────────────────────── */}
        {activeTab === "messages" && (
          <div className="mt-5">
            {activeThread ? (
              /* Thread view */
              <div className="flex flex-col rounded-[24px] border border-[var(--ms-border)] bg-white shadow-[0_4px_16px_rgba(13,27,42,0.06)]">
                {/* Thread header */}
                <div className="flex items-center gap-3 border-b border-[var(--ms-border)] p-4">
                  <button
                    type="button"
                    onClick={() => setActiveThread(null)}
                    className="rounded-full p-1.5 text-[var(--ms-mauve)] hover:text-[var(--ms-rose)]"
                  >
                    <X className="h-4 w-4" />
                  </button>
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--ms-petal)] text-sm font-bold text-[var(--ms-rose)]">
                    {activeThread.participantNames.find((n, i) => activeThread.participantIds[i] !== session.id)?.[0] ?? "?"}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[var(--ms-navy)]">
                      {activeThread.participantNames.find((n, i) => activeThread.participantIds[i] !== session.id) ?? "Unknown"}
                    </p>
                    <p className="text-xs text-[var(--ms-mauve)]">Beauty professional</p>
                  </div>
                </div>

                {/* Messages list */}
                <div className="flex max-h-[360px] flex-col-reverse gap-2 overflow-y-auto p-4">
                  {[...activeThread.messages].reverse().map((msg) => {
                    const isMe = msg.senderId === session.id;
                    return (
                      <div key={msg.id} className={cn("flex gap-2", isMe ? "justify-end" : "justify-start")}>
                        <div className={cn(
                          "max-w-[78%] rounded-[18px] px-4 py-2.5 text-sm leading-6",
                          isMe
                            ? "bg-[linear-gradient(135deg,var(--ms-rose),var(--ms-orchid))] text-white"
                            : "bg-[var(--ms-soft-bg)] text-[var(--ms-charcoal)]",
                        )}>
                          {msg.text}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Compose */}
                <div className="flex items-end gap-2 border-t border-[var(--ms-border)] p-3">
                  <textarea
                    className="flex-1 resize-none rounded-[16px] border border-[var(--ms-border)] bg-[var(--ms-soft-bg)] px-4 py-2.5 text-sm leading-6 text-[var(--ms-charcoal)] outline-none placeholder:text-[var(--ms-border)] focus:border-[var(--ms-rose)]"
                    rows={1}
                    placeholder="Write a message…"
                    value={dmText}
                    onChange={(e) => setDmText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        if (!dmText.trim()) return;
                        const msg = {
                          id: `msg_${Date.now()}`,
                          text: dmText.trim(),
                          senderId: session.id,
                          senderName: session.firstName,
                          senderAvatar: session.profilePhoto,
                          createdAt: new Date().toISOString(),
                          read: false,
                        };
                        sendMessage(activeThread.id, msg);
                        setDmText("");
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (!dmText.trim()) return;
                      const msg = {
                        id: `msg_${Date.now()}`,
                        text: dmText.trim(),
                        senderId: session.id,
                        senderName: session.firstName,
                        senderAvatar: session.profilePhoto,
                        createdAt: new Date().toISOString(),
                        read: false,
                      };
                      sendMessage(activeThread.id, msg);
                      setDmText("");
                    }}
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[linear-gradient(135deg,var(--ms-rose),var(--ms-orchid))] text-white shadow-[0_4px_12px_rgba(212,83,126,0.3)] hover:brightness-110"
                  >
                    <Send className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ) : (
              /* Thread list */
              <div className="space-y-2">
                {threads.length === 0 ? (
                  <div className="rounded-[24px] border border-[var(--ms-border)] bg-white p-8 text-center shadow-[0_4px_16px_rgba(13,27,42,0.04)]">
                    <MessageCircle className="mx-auto h-10 w-10 text-[var(--ms-mauve)] opacity-40" />
                    <p className="mt-4 text-sm font-semibold text-[var(--ms-navy)]">No messages yet</p>
                    <p className="mt-1 text-xs leading-6 text-[var(--ms-mauve)]">Book a service or follow a professional to start a conversation.</p>
                    <Link href="/book" className="mt-4 inline-flex items-center gap-2 rounded-full bg-[var(--ms-petal)] px-5 py-2 text-sm font-semibold text-[var(--ms-rose)] hover:opacity-90">
                      Find a professional
                    </Link>
                  </div>
                ) : (
                  threads.sort((a, b) => new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime()).map((thread) => {
                    const otherIdx = thread.participantIds.findIndex((id) => id !== session.id);
                    const otherName = thread.participantNames[otherIdx] ?? "Unknown";
                    const lastMsg = thread.messages[thread.messages.length - 1];
                    const unread = thread.messages.filter((m) => !m.read && m.senderId !== session.id).length;
                    return (
                      <button
                        key={thread.id}
                        type="button"
                        onClick={() => {
                          markThreadRead(thread.id, session.id);
                          setActiveThread(thread);
                        }}
                        className="flex w-full items-center gap-3 rounded-[20px] border border-[var(--ms-border)] bg-white p-4 text-left shadow-[0_2px_8px_rgba(13,27,42,0.04)] transition hover:border-[var(--ms-rose)]/30 hover:shadow-[0_4px_16px_rgba(13,27,42,0.08)]"
                      >
                        <div className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[var(--ms-petal)] text-base font-bold text-[var(--ms-rose)]">
                          {otherName[0]}
                          {unread > 0 && (
                            <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-[var(--ms-rose)] text-[9px] font-bold text-white">
                              {unread}
                            </span>
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between">
                            <p className={cn("text-sm font-semibold", unread > 0 ? "text-[var(--ms-navy)]" : "text-[var(--ms-charcoal)]")}>{otherName}</p>
                            <p className="shrink-0 text-[10px] text-[var(--ms-mauve)]">
                              {lastMsg ? new Date(lastMsg.createdAt).toLocaleDateString("en-KE", { month: "short", day: "numeric" }) : ""}
                            </p>
                          </div>
                          <p className={cn("mt-0.5 truncate text-xs", unread > 0 ? "font-semibold text-[var(--ms-charcoal)]" : "text-[var(--ms-mauve)]")}>
                            {lastMsg ? `${lastMsg.senderId === session.id ? "You: " : ""}${lastMsg.text}` : "No messages yet"}
                          </p>
                        </div>
                      </button>
                    );
                  })
                )}
              </div>
            )}
          </div>
        )}

        {/* ── Settings tab ─────────────────────────────────────────────────── */}
        {activeTab === "settings" && (
          <div className="mt-5 space-y-4">
            <div className="rounded-[28px] border border-[var(--ms-border)] bg-white p-5 shadow-[0_4px_16px_rgba(13,27,42,0.06)]">
              <p className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--ms-mauve)]">Profile</p>
              <div className="space-y-3">
                <EditField label="First name" value={editFirstName} onChange={setEditFirstName} icon={<UserRound className="h-4 w-4" />} />
                <EditField label="Username / handle" value={editUsername} onChange={setEditUsername} placeholder="e.g. njeri_beauty" icon={<Crown className="h-4 w-4" />} />
                <EditField label="Phone" value={editPhone} onChange={setEditPhone} type="tel" icon={<Phone className="h-4 w-4" />} />
                <EditField label="Email" value={editEmail} onChange={setEditEmail} type="email" icon={<Mail className="h-4 w-4" />} />
                <EditField label="Location" value={editLocation} onChange={setEditLocation} placeholder="e.g. Kilimani" icon={<MapPin className="h-4 w-4" />} />
                <div>
                  <label className="block rounded-[20px] border border-[var(--ms-border)] bg-[var(--ms-soft-bg)] px-4 py-3">
                    <span className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--ms-mauve)]">
                      <MessageSquare className="h-3.5 w-3.5" /> Bio / beauty story
                    </span>
                    <textarea
                      className="mt-2 w-full resize-none bg-transparent text-sm leading-6 text-[var(--ms-charcoal)] outline-none placeholder:text-[var(--ms-border)]"
                      rows={3}
                      placeholder="Tell the community about your beauty journey, favourite styles, or what inspires you..."
                      value={editBio}
                      onChange={(e) => setEditBio(e.target.value)}
                    />
                  </label>
                </div>
              </div>
              <button
                type="button"
                onClick={handleSaveProfile}
                disabled={saving}
                className="mt-5 flex min-h-11 w-full items-center justify-center gap-2 rounded-[16px] bg-[linear-gradient(135deg,var(--ms-rose),var(--ms-orchid))] text-sm font-semibold text-white transition hover:brightness-110 disabled:opacity-60"
              >
                {saved ? "Saved ✓" : saving ? "Saving…" : "Save profile"}
              </button>
            </div>

            <div className="rounded-[28px] border border-[var(--ms-border)] bg-white p-5 shadow-[0_4px_16px_rgba(13,27,42,0.06)]">
              <p className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--ms-mauve)]">Privacy</p>
              {[
                { icon: <Lock className="h-4 w-4" />, label: "Contact privacy", value: "Hidden until booking confirmed" },
                { icon: <Bell className="h-4 w-4" />, label: "Notifications", value: "On" },
                { icon: <ShieldCheck className="h-4 w-4" />, label: "Safe space mode", value: "Active" },
              ].map((row) => (
                <div key={row.label} className="flex items-center justify-between py-2.5">
                  <div className="flex items-center gap-3 text-sm text-[var(--ms-charcoal)]">
                    <span className="text-[var(--ms-rose)]">{row.icon}</span>
                    {row.label}
                  </div>
                  <span className="rounded-full bg-[var(--ms-soft-bg)] px-3 py-1 text-xs font-semibold text-[var(--ms-mauve)]">{row.value}</span>
                </div>
              ))}
            </div>

            <div className="rounded-[28px] border border-[var(--ms-border)] bg-white p-5">
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--ms-mauve)]">Quick links</p>
              <div className="flex flex-wrap gap-2">
                <CTAButton href="/home" variant="outline" className="text-sm">Explore marketplace</CTAButton>
                <CTAButton href="/book" variant="outline" className="text-sm">Book a service</CTAButton>
                <CTAButton href="/activity" variant="outline" className="text-sm">My activity</CTAButton>
              </div>
            </div>

            <MyWorldCard />
            <LanguagePreferenceCard />
          </div>
        )}
      </div>

      {/* ── New post modal ───────────────────────────────────────────────────── */}
      {showNewPost && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 backdrop-blur-sm sm:items-center">
          <div className="w-full max-w-lg rounded-t-[32px] bg-white p-5 shadow-[0_-18px_60px_rgba(13,27,42,0.18)] sm:rounded-[32px]">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-bold text-[var(--ms-navy)]">Share a moment</h2>
              <button type="button" onClick={() => setShowNewPost(false)} className="rounded-full bg-[var(--ms-soft-bg)] p-2 text-[var(--ms-mauve)] hover:text-[var(--ms-rose)]">
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Type selector */}
            <div className="mb-3 flex gap-2 overflow-x-auto pb-1 scrollbar-none">
              {[
                { key: "before_after", label: "Before/After" },
                { key: "inspo", label: "Inspiration" },
                { key: "tip", label: "Beauty Tip" },
                { key: "portfolio", label: "My Look" },
              ].map((t) => (
                <button
                  key={t.key}
                  type="button"
                  onClick={() => setNewPostTag(t.key)}
                  className={cn(
                    "shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold transition",
                    newPostTag === t.key
                      ? "bg-[var(--ms-rose)] text-white"
                      : "bg-[var(--ms-soft-bg)] text-[var(--ms-mauve)]",
                  )}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {/* Image upload area */}
            <ImageUploadEditor
              label="Add photo(s)"
              requirements="JPG or PNG · max 5 MB"
              aspectHint="Square 1:1 works best for the feed"
              maxMB={5}
              value={newPostImages[0]}
              onSave={(url) => handleAddImage(url)}
            />

            {/* Caption */}
            <textarea
              className="mt-3 w-full resize-none rounded-[16px] border border-[var(--ms-border)] bg-[var(--ms-soft-bg)] px-4 py-3 text-sm leading-6 text-[var(--ms-charcoal)] outline-none placeholder:text-[var(--ms-mauve)]"
              rows={3}
              placeholder="Write a caption, tip, or story…"
              value={newPostCaption}
              onChange={(e) => setNewPostCaption(e.target.value)}
            />

            <button
              type="button"
              onClick={handlePublishPost}
              disabled={!newPostCaption.trim() && newPostImages.length === 0}
              className="mt-3 flex min-h-12 w-full items-center justify-center gap-2 rounded-[16px] bg-[linear-gradient(135deg,var(--ms-rose),var(--ms-orchid))] text-sm font-semibold text-white transition hover:brightness-110 disabled:opacity-40"
            >
              <Send className="h-4 w-4" /> Share to community
            </button>
          </div>
        </div>
      )}

      {/* ── Post detail modal ────────────────────────────────────────────────── */}
      {expandedPost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="flex max-h-[90vh] w-full max-w-lg flex-col overflow-hidden rounded-[28px] bg-white shadow-[0_30px_80px_rgba(13,27,42,0.28)]">
            {/* Header */}
            <div className="flex items-center gap-3 border-b border-[var(--ms-border)] p-4">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[linear-gradient(135deg,var(--ms-rose),var(--ms-orchid))] text-sm font-bold text-white">
                {expandedPost.authorName.slice(0, 1).toUpperCase()}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-[var(--ms-navy)]">{expandedPost.authorName}</p>
                <p className="text-xs text-[var(--ms-mauve)]">{new Date(expandedPost.createdAt).toLocaleDateString("en-KE", { day: "numeric", month: "short", year: "numeric" })}</p>
              </div>
              <button type="button" onClick={() => setExpandedPost(null)} className="rounded-full bg-[var(--ms-soft-bg)] p-2">
                <X className="h-4 w-4 text-[var(--ms-mauve)]" />
              </button>
            </div>
            {/* Image */}
            {expandedPost.images[0] && (
              <img src={expandedPost.images[0]} alt="Post" className="max-h-64 w-full object-cover" />
            )}
            {/* Caption + actions */}
            <div className="border-b border-[var(--ms-border)] p-4">
              <p className="text-sm leading-6 text-[var(--ms-charcoal)]">{expandedPost.caption}</p>
              <div className="mt-3 flex items-center gap-4">
                <button type="button" onClick={() => handleLike(expandedPost.id)} className={cn("flex items-center gap-1.5 text-sm font-semibold transition", expandedPost.savedBy.includes(session.id) ? "text-[var(--ms-rose)]" : "text-[var(--ms-mauve)]")}>
                  <Heart className="h-4 w-4" fill={expandedPost.savedBy.includes(session.id) ? "currentColor" : "none"} />
                  {expandedPost.likes}
                </button>
                <span className="flex items-center gap-1.5 text-sm text-[var(--ms-mauve)]">
                  <MessageCircle className="h-4 w-4" />
                  {expandedPost.comments.length} comments
                </span>
              </div>
            </div>
            {/* Comments */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {expandedPost.comments.length === 0 && (
                <p className="text-center text-xs text-[var(--ms-mauve)]">No comments yet. Be first to cheer!</p>
              )}
              {expandedPost.comments.map((c) => (
                <div key={c.id} className="flex gap-2">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[var(--ms-soft-bg)] text-xs font-bold text-[var(--ms-plum)]">
                    {c.authorName.slice(0, 1).toUpperCase()}
                  </div>
                  <div className="min-w-0 rounded-[14px] bg-[var(--ms-soft-bg)] px-3 py-2">
                    <p className="text-xs font-semibold text-[var(--ms-navy)]">{c.authorName}</p>
                    <p className="text-xs leading-5 text-[var(--ms-charcoal)]">{c.text}</p>
                  </div>
                </div>
              ))}
            </div>
            {/* Comment input */}
            <div className="flex gap-2 border-t border-[var(--ms-border)] p-3">
              <input
                className="flex-1 rounded-full border border-[var(--ms-border)] bg-[var(--ms-soft-bg)] px-4 py-2 text-sm outline-none placeholder:text-[var(--ms-mauve)]"
                placeholder="Add a comment…"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") handleComment(); }}
              />
              <button type="button" onClick={handleComment} className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--ms-rose)] text-white hover:bg-[var(--ms-plum)]">
                <Send className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Edit field atom ───────────────────────────────────────────────────────────

function EditField({
  label,
  value,
  onChange,
  icon,
  type = "text",
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  icon: ReactNode;
  type?: string;
  placeholder?: string;
}) {
  return (
    <label className="block rounded-[20px] border border-[var(--ms-border)] bg-[var(--ms-soft-bg)] px-4 py-3">
      <span className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--ms-mauve)]">
        {icon} {label}
      </span>
      <input
        type={type}
        className="mt-2 w-full bg-transparent text-sm font-semibold text-[var(--ms-navy)] outline-none placeholder:font-normal placeholder:text-[var(--ms-border)]"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
    </label>
  );
}

function SalonProfileWorkspace({
  session,
  onSave,
}: {
  session: SalonUserProfile;
  onSave: (session: AppUserSession) => void;
}) {
  return (
    <div className="section-grid">
      <SectionReveal className="rounded-[36px] bg-white p-6 shadow-[0_18px_48px_rgba(13,27,42,0.08)] lg:p-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-[var(--ms-mauve)]">Salon profile</p>
            <h1 className="mt-3 text-4xl font-semibold text-[var(--ms-navy)]">Manage the salon page clients will judge first.</h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-[var(--ms-mauve)]">
              Keep the salon name, contacts, subscription plan, and public page sections clear before you publish.
            </p>
          </div>
          <div className="rounded-[24px] bg-[var(--ms-soft-bg)] px-4 py-3 text-sm font-semibold text-[var(--ms-plum)]">
            {session.plan.toUpperCase()} plan · {session.subscriptionStatus.replaceAll("_", " ")}
          </div>
        </div>
      </SectionReveal>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,0.58fr)_minmax(320px,0.42fr)]">
        <SectionReveal className="beauty-card rounded-[32px] p-6">
          <p className="text-xs uppercase tracking-[0.22em] text-[var(--ms-mauve)]">Business details</p>
          <h2 className="mt-3 text-3xl font-semibold text-[var(--ms-plum)]">Edit your salon account</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <Field
              icon={<Store className="h-4 w-4" />}
              label="Salon name"
              value={session.salonName}
              onChange={(value) => onSave({ ...session, salonName: value })}
            />
            <Field
              icon={<UserRound className="h-4 w-4" />}
              label="Contact person"
              value={session.contactName}
              onChange={(value) => onSave({ ...session, contactName: value })}
            />
            <Field
              icon={<Phone className="h-4 w-4" />}
              label="Phone"
              value={session.phone}
              onChange={(value) => onSave({ ...session, phone: value })}
            />
            <Field
              icon={<Mail className="h-4 w-4" />}
              label="Email"
              value={session.email ?? ""}
              onChange={(value) => onSave({ ...session, email: value })}
            />
            <Field
              icon={<MapPin className="h-4 w-4" />}
              label="Location"
              value={session.location}
              onChange={(value) => onSave({ ...session, location: value })}
            />
            <Field
              icon={<Camera className="h-4 w-4" />}
              label="Logo or hero image URL"
              value={session.profilePhoto ?? ""}
              onChange={(value) => onSave({ ...session, profilePhoto: value })}
            />
          </div>
          <TextAreaField
            label="Salon description"
            value={session.description}
            onChange={(value) => onSave({ ...session, description: value })}
          />
        </SectionReveal>

        <SectionReveal className="beauty-card rounded-[32px] p-6">
          <p className="text-xs uppercase tracking-[0.22em] text-[var(--ms-mauve)]">Listing control</p>
          <h2 className="mt-3 text-3xl font-semibold text-[var(--ms-plum)]">Publish only when it feels ready.</h2>
          <div className="mt-5 grid gap-3">
            <SummaryRow icon={<BadgeCheck className="h-4 w-4" />} label="Listing status" value={session.listingPublished ? "Published" : "Draft"} />
            <SummaryRow icon={<BriefcaseBusiness className="h-4 w-4" />} label="Team size" value={`${session.teamCount} team members`} />
            <SummaryRow icon={<LayoutPanelTop className="h-4 w-4" />} label="Service count" value={`${session.servicesCount} visible services`} />
          </div>
          <div className="mt-6 flex flex-col gap-3">
            <CTAButton
              onClick={() => onSave({ ...session, listingPublished: !session.listingPublished })}
              type="button"
            >
              {session.listingPublished ? "Unpublish salon page" : "Publish salon page"}
            </CTAButton>
            <CTAButton href="/onboarding/salon" variant="outline">
              Update salon setup
            </CTAButton>
          </div>
          <p className="mt-4 text-xs leading-6 text-[var(--ms-mauve)]">
            Salon accounts are paid monthly subscriptions. Publish should stay locked to salons that have completed plan setup and billing.
          </p>
        </SectionReveal>
      </div>

      <SectionReveal className="beauty-card rounded-[32px] p-6">
        <p className="text-xs uppercase tracking-[0.22em] text-[var(--ms-mauve)]">Page sections</p>
        <h2 className="mt-3 text-3xl font-semibold text-[var(--ms-plum)]">Choose what appears on your salon page.</h2>
        <div className="mt-6 grid gap-3 md:grid-cols-2">
          {session.cards.map((card) => (
            <CardPreferenceRow
              card={card}
              key={card.id}
              onRemove={
                card.removable
                  ? () => onSave({ ...session, cards: session.cards.filter((item) => item.id !== card.id) })
                  : undefined
              }
              onToggle={() =>
                onSave({
                  ...session,
                  cards: session.cards.map((item) =>
                    item.id === card.id ? { ...item, enabled: !item.enabled } : item,
                  ),
                })
              }
            />
          ))}
        </div>
      </SectionReveal>
    </div>
  );
}

function ProfessionalProfileWorkspace({
  session,
  onSave,
  onDeleteDraft,
}: {
  session: ProfessionalUserProfile;
  onSave: (session: AppUserSession) => void;
  onDeleteDraft: () => void;
}) {
  return (
    <div className="section-grid">
      <SectionReveal className="rounded-[36px] bg-white p-6 shadow-[0_18px_48px_rgba(13,27,42,0.08)] lg:p-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-[var(--ms-mauve)]">Professional profile</p>
            <h1 className="mt-3 text-4xl font-semibold text-[var(--ms-navy)]">Control your public page before it goes to the marketplace.</h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-[var(--ms-mauve)]">
              Edit your basics, switch public cards on or off, then publish only when the page is strong enough to represent you.
            </p>
          </div>
          <div className="rounded-[24px] bg-[var(--ms-soft-bg)] px-4 py-3 text-sm font-semibold text-[var(--ms-plum)]">
            {session.listingPublished ? "Published" : "Draft"} · {session.serviceMode}
          </div>
        </div>
      </SectionReveal>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,0.58fr)_minmax(320px,0.42fr)]">
        <SectionReveal className="beauty-card rounded-[32px] p-6">
          <div className="flex items-start gap-4">
            <ProfileAvatar photo={session.profilePhoto} label={session.displayName} />
            <div className="min-w-0">
              <p className="text-xs uppercase tracking-[0.22em] text-[var(--ms-mauve)]">Profile basics</p>
              <h2 className="mt-3 text-3xl font-semibold text-[var(--ms-plum)]">Edit the professional account</h2>
            </div>
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <Field
              icon={<UserRound className="h-4 w-4" />}
              label="Display name"
              value={session.displayName}
              onChange={(value) => onSave({ ...session, displayName: value })}
            />
            <Field
              icon={<Sparkles className="h-4 w-4" />}
              label="Specialty"
              value={session.specialty}
              onChange={(value) => onSave({ ...session, specialty: value })}
            />
            <Field
              icon={<Phone className="h-4 w-4" />}
              label="Phone"
              value={session.phone}
              onChange={(value) => onSave({ ...session, phone: value })}
            />
            <Field
              icon={<Mail className="h-4 w-4" />}
              label="Email"
              value={session.email ?? ""}
              onChange={(value) => onSave({ ...session, email: value })}
            />
            <Field
              icon={<MapPin className="h-4 w-4" />}
              label="Location"
              value={session.location}
              onChange={(value) => onSave({ ...session, location: value })}
            />
            <Field
              icon={<Camera className="h-4 w-4" />}
              label="Profile image URL"
              value={session.profilePhoto ?? ""}
              onChange={(value) => onSave({ ...session, profilePhoto: value })}
            />
          </div>
          <TextAreaField
            label="Bio"
            value={session.bio}
            onChange={(value) => onSave({ ...session, bio: value })}
          />
        </SectionReveal>

        <SectionReveal className="beauty-card rounded-[32px] p-6">
          <p className="text-xs uppercase tracking-[0.22em] text-[var(--ms-mauve)]">Marketplace status</p>
          <h2 className="mt-3 text-3xl font-semibold text-[var(--ms-plum)]">Publish, pause, or remove the profile.</h2>
          <div className="mt-5 grid gap-3">
            <SummaryRow icon={<BadgeCheck className="h-4 w-4" />} label="Public status" value={session.listingPublished ? "Visible in marketplace" : "Hidden from marketplace"} />
            <SummaryRow icon={<Globe2 className="h-4 w-4" />} label="Public page" value={session.publicSlug} />
            <SummaryRow icon={<MapPin className="h-4 w-4" />} label="Areas served" value={session.areasServed.join(", ")} />
          </div>
          <div className="mt-6 flex flex-col gap-3">
            <CTAButton
              onClick={() => onSave({ ...session, listingPublished: !session.listingPublished })}
              type="button"
            >
              {session.listingPublished ? "Unpublish profile" : "Publish profile"}
            </CTAButton>
            <CTAButton href={`/professionals/${session.publicSlug}`} variant="outline">
              Preview public page
            </CTAButton>
            <CTAButton onClick={onDeleteDraft} type="button" variant="outline">
              Delete draft
            </CTAButton>
          </div>
        </SectionReveal>
      </div>

      <SectionReveal className="beauty-card rounded-[32px] p-6">
        <p className="text-xs uppercase tracking-[0.22em] text-[var(--ms-mauve)]">Profile cards</p>
        <h2 className="mt-3 text-3xl font-semibold text-[var(--ms-plum)]">Add or remove what the public profile shows.</h2>
        <div className="mt-6 grid gap-3 md:grid-cols-2">
          {session.cards.map((card) => (
            <CardPreferenceRow
              card={card}
              key={card.id}
              onRemove={
                card.removable
                  ? () => onSave({ ...session, cards: session.cards.filter((item) => item.id !== card.id) })
                  : undefined
              }
              onToggle={() =>
                onSave({
                  ...session,
                  cards: session.cards.map((item) =>
                    item.id === card.id ? { ...item, enabled: !item.enabled } : item,
                  ),
                })
              }
            />
          ))}
        </div>
      </SectionReveal>
    </div>
  );
}

function ProfileAvatar({ photo, label }: { photo?: string; label: string }) {
  if (photo) {
    return (
      <div
        aria-label={label}
        className="h-16 w-16 rounded-full border border-[var(--ms-border)] bg-[var(--ms-soft-bg)] bg-cover bg-center"
        role="img"
        style={{ backgroundImage: `url(${photo})` }}
      >
        <span className="sr-only">{label}</span>
      </div>
    );
  }

  return (
    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[var(--ms-soft-bg)] text-lg font-semibold text-[var(--ms-plum)]">
      {label.charAt(0).toUpperCase()}
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  icon,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  icon: ReactNode;
}) {
  return (
    <label className="block rounded-[24px] border border-[var(--ms-border)] bg-[var(--ms-soft-bg)] px-4 py-4">
      <span className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-[var(--ms-mauve)]">
        {icon}
        {label}
      </span>
      <input
        className="mt-3 w-full bg-transparent text-sm font-semibold text-[var(--ms-navy)] outline-none"
        onChange={(event) => onChange(event.target.value)}
        value={value}
      />
    </label>
  );
}

function TextAreaField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="mt-4 block rounded-[24px] border border-[var(--ms-border)] bg-[var(--ms-soft-bg)] px-4 py-4">
      <span className="text-xs uppercase tracking-[0.2em] text-[var(--ms-mauve)]">{label}</span>
      <textarea
        className="mt-3 min-h-28 w-full resize-none bg-transparent text-sm leading-6 text-[var(--ms-charcoal)] outline-none"
        onChange={(event) => onChange(event.target.value)}
        value={value}
      />
    </label>
  );
}

function SummaryRow({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-[20px] bg-[var(--ms-soft-bg)] px-4 py-3">
      <div className="flex items-center gap-3">
        <span className="text-[var(--ms-rose)]">{icon}</span>
        <p className="text-sm text-[var(--ms-mauve)]">{label}</p>
      </div>
      <p className="text-sm font-semibold text-[var(--ms-navy)]">{value}</p>
    </div>
  );
}

function CardPreferenceRow({
  card,
  onToggle,
  onRemove,
}: {
  card: ProfileCardPreference;
  onToggle: () => void;
  onRemove?: () => void;
}) {
  return (
    <div className="rounded-[24px] border border-[var(--ms-border)] bg-white px-4 py-4 shadow-[0_12px_24px_rgba(13,27,42,0.05)]">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-[var(--ms-navy)]">{card.label}</p>
          <p className="mt-1 text-xs text-[var(--ms-mauve)]">
            {card.enabled ? "Visible on page" : "Hidden from page"}
          </p>
        </div>
        <button
          className={`flex h-7 w-12 items-center rounded-full p-1 transition ${card.enabled ? "justify-end bg-[var(--ms-magenta)]" : "justify-start bg-[var(--ms-border)]"}`}
          onClick={onToggle}
          type="button"
        >
          <span className="h-5 w-5 rounded-full bg-white" />
        </button>
      </div>
      {onRemove ? (
        <button
          className="mt-4 text-sm font-semibold text-[var(--ms-rose)]"
          onClick={onRemove}
          type="button"
        >
          Remove card
        </button>
      ) : null}
    </div>
  );
}
