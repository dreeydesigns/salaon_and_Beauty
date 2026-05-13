"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  Camera,
  Grid3X3,
  Heart,
  MessageCircle,
  Plus,
  Send,
  Users,
  X,
  Bookmark,
} from "lucide-react";

import { ImageUploadEditor } from "@/components/image-upload-editor";
import {
  APP_SESSION_EVENT,
  readAppSession,
  type AppUserSession,
} from "@/lib/client-session";
import {
  readPosts,
  writePost,
  likePost,
  addComment,
  readSaves,
  SOCIAL_CHANGE_EVENT,
  type SocialPost,
  type SocialSaves,
  type SocialComment,
} from "@/lib/social-store";
import { getProfessional, getSalon } from "@/lib/site-data";
import { cn } from "@/lib/utils";

type HomeTab = "my-posts" | "community";

export function SocialHome() {
  const searchParams = useSearchParams();
  const initTab = (searchParams.get("tab") as HomeTab | null) ?? "my-posts";
  const [activeTab, setActiveTab] = useState<HomeTab>(
    ["my-posts", "community"].includes(initTab) ? initTab : "my-posts",
  );
  const [session, setSession] = useState<AppUserSession | null>(null);
  const [myPosts, setMyPosts] = useState<SocialPost[]>([]);
  const [allPosts, setAllPosts] = useState<SocialPost[]>([]);
  const [saves, setSaves] = useState<SocialSaves>({ professionals: [], salons: [] });
  const [showNewPost, setShowNewPost] = useState(false);
  const [newImages, setNewImages] = useState<string[]>([]);
  const [newCaption, setNewCaption] = useState("");
  const [newTag, setNewTag] = useState("portfolio");
  const [expandedPost, setExpandedPost] = useState<SocialPost | null>(null);
  const [commentText, setCommentText] = useState("");

  useEffect(() => {
    function sync() {
      const s = readAppSession();
      setSession(s);
      const all = readPosts();
      setMyPosts(s ? all.filter((p) => p.authorId === s.id) : []);
      setAllPosts(all);
      setSaves(readSaves());
    }
    sync();
    window.addEventListener(APP_SESSION_EVENT, sync);
    window.addEventListener(SOCIAL_CHANGE_EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(APP_SESSION_EVENT, sync);
      window.removeEventListener(SOCIAL_CHANGE_EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  if (!session) return null;

  const isGuest = session.role === "guest";
  const displayName =
    session.role === "client" ? session.firstName
      : session.role === "professional" ? session.displayName
      : session.role === "salon" ? session.salonName
      : "Guest";
  const avatar = session.role !== "guest" ? session.profilePhoto : undefined;

  function handlePublish() {
    if (!newCaption.trim() && newImages.length === 0) return;
    if (isGuest) return; // guests cannot post
    const post: SocialPost = {
      id: `post_${Date.now()}`,
      authorId: session!.id,
      authorName: displayName,
      authorAvatar: avatar,
      authorRole: session!.role === "client" ? "client" : session!.role === "professional" ? "professional" : "salon",
      type: newTag as SocialPost["type"],
      images: newImages,
      caption: newCaption,
      tags: [],
      likes: 0,
      savedBy: [],
      comments: [],
      createdAt: new Date().toISOString(),
    };
    writePost(post);
    setNewImages([]);
    setNewCaption("");
    setShowNewPost(false);
  }

  function handleLike(postId: string) {
    if (!session || isGuest) return;
    likePost(postId, session.id);
  }

  function handleAddComment(postId: string) {
    if (!session || isGuest || !commentText.trim()) return;
    const comment: SocialComment = {
      id: `cmt_${Date.now()}`,
      authorId: session.id,
      authorName: displayName,
      authorAvatar: avatar,
      text: commentText.trim(),
      createdAt: new Date().toISOString(),
    };
    addComment(postId, comment);
    setCommentText("");
  }

  const followedSlugs = [...saves.professionals, ...saves.salons];
  const feedPosts = allPosts.filter((p) =>
    followedSlugs.includes(p.authorId) || (session && p.authorId === session.id),
  );
  const communityPosts = allPosts;

  const displayPosts = activeTab === "my-posts" ? myPosts : communityPosts;

  return (
    <div className="mx-auto max-w-2xl pb-28 pt-2">
      {/* ── Profile mini bar ─────────────────────────────────────── */}
      <div className="mb-4 flex items-center gap-3 rounded-[24px] bg-white p-4 shadow-[0_4px_16px_rgba(13,27,42,0.06)]">
        <Link href="/profile">
          <div className="h-12 w-12 shrink-0 overflow-hidden rounded-full bg-[linear-gradient(135deg,var(--ms-rose),var(--ms-orchid))] flex items-center justify-center text-lg font-bold text-white">
            {avatar ? (
              <img src={avatar} alt={displayName} className="h-full w-full object-cover" />
            ) : (
              displayName[0].toUpperCase()
            )}
          </div>
        </Link>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-bold text-[var(--ms-navy)]">{displayName}</p>
          {isGuest ? (
            <p className="text-xs text-[var(--ms-mauve)]">
              Guest · <Link href="/signup/client" className="font-semibold text-[var(--ms-rose)]">Create an account</Link>
            </p>
          ) : (
            <p className="text-xs text-[var(--ms-mauve)]">{myPosts.length} post{myPosts.length !== 1 ? "s" : ""} · {followedSlugs.length} following</p>
          )}
        </div>
        {!isGuest && (
          <button
            type="button"
            onClick={() => setShowNewPost(true)}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[linear-gradient(135deg,var(--ms-rose),var(--ms-orchid))] text-white shadow-[0_6px_18px_rgba(212,83,126,0.3)] hover:brightness-110"
          >
            <Plus className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* ── Quick actions ─────────────────────────────────────────── */}
      <div className="mb-4 grid grid-cols-3 gap-3">
        <Link href="/discover" className="flex flex-col items-center gap-1.5 rounded-[20px] bg-white p-4 text-center shadow-[0_2px_8px_rgba(13,27,42,0.04)] hover:shadow-[0_4px_16px_rgba(13,27,42,0.08)]">
          <Users className="h-6 w-6 text-[var(--ms-rose)]" />
          <span className="text-xs font-semibold text-[var(--ms-navy)]">Discover</span>
        </Link>
        <Link href="/book" className="flex flex-col items-center gap-1.5 rounded-[20px] bg-[linear-gradient(135deg,var(--ms-rose),var(--ms-orchid))] p-4 text-center shadow-[0_6px_18px_rgba(212,83,126,0.3)]">
          <Camera className="h-6 w-6 text-white" />
          <span className="text-xs font-bold text-white">Book Now</span>
        </Link>
        <Link href="/explore" className="flex flex-col items-center gap-1.5 rounded-[20px] bg-white p-4 text-center shadow-[0_2px_8px_rgba(13,27,42,0.04)] hover:shadow-[0_4px_16px_rgba(13,27,42,0.08)]">
          <Bookmark className="h-6 w-6 text-[var(--ms-rose)]" />
          <span className="text-xs font-semibold text-[var(--ms-navy)]">Explore</span>
        </Link>
      </div>

      {/* ── Tabs ──────────────────────────────────────────────────── */}
      <div className="mb-4 flex rounded-[20px] border border-[var(--ms-border)] bg-white p-1 shadow-[0_2px_8px_rgba(13,27,42,0.04)]">
        {([
          { key: "my-posts", label: "My Posts", icon: <Grid3X3 className="h-4 w-4" /> },
          { key: "community", label: "Community", icon: <Users className="h-4 w-4" /> },
        ] as { key: HomeTab; label: string; icon: React.ReactNode }[]).map((t) => (
          <button
            key={t.key}
            type="button"
            onClick={() => setActiveTab(t.key)}
            className={cn(
              "flex flex-1 items-center justify-center gap-2 rounded-[16px] py-2.5 text-sm font-semibold transition",
              activeTab === t.key
                ? "bg-[linear-gradient(135deg,var(--ms-rose),var(--ms-orchid))] text-white shadow-[0_4px_12px_rgba(212,83,126,0.24)]"
                : "text-[var(--ms-mauve)] hover:text-[var(--ms-navy)]",
            )}
          >
            {t.icon}
            {t.label}
          </button>
        ))}
      </div>

      {/* ── Guest restriction banner ───────────────────────────────── */}
      {isGuest && activeTab === "my-posts" && (
        <div className="mb-4 rounded-[20px] border border-[var(--ms-rose)]/20 bg-[var(--ms-petal)] p-5 text-center">
          <p className="text-sm font-semibold text-[var(--ms-plum)]">You're browsing as a guest.</p>
          <p className="mt-1 text-xs text-[var(--ms-mauve)]">Create an account to post, follow, comment, and book.</p>
          <Link href="/signup/client" className="mt-3 inline-flex items-center gap-2 rounded-full bg-[linear-gradient(135deg,var(--ms-rose),var(--ms-orchid))] px-5 py-2 text-sm font-semibold text-white shadow-[0_6px_18px_rgba(212,83,126,0.3)]">
            Create free account
          </Link>
        </div>
      )}

      {/* ── Posts grid ────────────────────────────────────────────── */}
      {displayPosts.length === 0 ? (
        <div className="rounded-[24px] border border-[var(--ms-border)] bg-white py-12 text-center shadow-[0_4px_16px_rgba(13,27,42,0.04)]">
          <Grid3X3 className="mx-auto h-10 w-10 text-[var(--ms-mauve)] opacity-30" />
          <p className="mt-4 text-sm font-semibold text-[var(--ms-navy)]">
            {activeTab === "my-posts" ? "Nothing shared yet" : "The community feed is empty"}
          </p>
          <p className="mt-1 text-xs text-[var(--ms-mauve)]">
            {activeTab === "my-posts"
              ? "Share your first beauty moment to get started."
              : "Follow professionals or salons to see their posts here."}
          </p>
          {!isGuest && activeTab === "my-posts" && (
            <button
              type="button"
              onClick={() => setShowNewPost(true)}
              className="mt-4 inline-flex items-center gap-2 rounded-full bg-[var(--ms-petal)] px-5 py-2 text-sm font-semibold text-[var(--ms-rose)]"
            >
              <Plus className="h-4 w-4" /> Share a moment
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-1 sm:gap-2">
          {displayPosts.map((post) => (
            <button
              key={post.id}
              type="button"
              onClick={() => setExpandedPost(post)}
              className="group relative aspect-square overflow-hidden rounded-[14px] bg-[var(--ms-soft-bg)]"
            >
              {post.images[0] ? (
                <img src={post.images[0]} alt="" className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.04]" />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-[linear-gradient(135deg,var(--ms-petal),var(--ms-soft-bg))]">
                  <p className="px-2 text-center text-[10px] font-medium leading-4 text-[var(--ms-mauve)] line-clamp-3">{post.caption}</p>
                </div>
              )}
              <div className="absolute inset-0 flex items-center justify-center gap-3 bg-black/0 opacity-0 transition group-hover:bg-black/30 group-hover:opacity-100">
                <span className="flex items-center gap-1 text-xs font-semibold text-white">
                  <Heart className="h-4 w-4 fill-white" /> {post.likes}
                </span>
                <span className="flex items-center gap-1 text-xs font-semibold text-white">
                  <MessageCircle className="h-4 w-4 fill-white" /> {post.comments.length}
                </span>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* ── New post modal ─────────────────────────────────────────── */}
      {showNewPost && !isGuest && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 backdrop-blur-sm sm:items-center">
          <div className="w-full max-w-lg rounded-t-[32px] bg-white p-5 shadow-[0_-18px_60px_rgba(13,27,42,0.18)] sm:rounded-[32px]">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-bold text-[var(--ms-navy)]">Share a moment</h2>
              <button type="button" onClick={() => setShowNewPost(false)} className="rounded-full bg-[var(--ms-soft-bg)] p-2 text-[var(--ms-mauve)] hover:text-[var(--ms-rose)]">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="mb-3 flex gap-2 overflow-x-auto pb-1">
              {[{ key: "portfolio", label: "My Look" }, { key: "before_after", label: "Before/After" }, { key: "inspo", label: "Inspiration" }, { key: "tip", label: "Tip" }].map((t) => (
                <button
                  key={t.key}
                  type="button"
                  onClick={() => setNewTag(t.key)}
                  className={cn("shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold transition", newTag === t.key ? "bg-[var(--ms-rose)] text-white" : "bg-[var(--ms-soft-bg)] text-[var(--ms-mauve)]")}
                >
                  {t.label}
                </button>
              ))}
            </div>
            <ImageUploadEditor
              onSave={(url) => setNewImages((prev) => [...prev, url])}
              aspectHint="1/1"
              className="mb-3"
            />
            {newImages.length > 0 && (
              <div className="mb-3 flex gap-2 overflow-x-auto">
                {newImages.map((img, i) => (
                  <div key={i} className="relative h-16 w-16 shrink-0 overflow-hidden rounded-[12px]">
                    <img src={img} alt="" className="h-full w-full object-cover" />
                    <button
                      type="button"
                      onClick={() => setNewImages((prev) => prev.filter((_, j) => j !== i))}
                      className="absolute right-0.5 top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-black/60 text-white"
                    >
                      <X className="h-2.5 w-2.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
            <textarea
              className="mb-3 w-full resize-none rounded-[16px] border border-[var(--ms-border)] bg-[var(--ms-soft-bg)] px-4 py-3 text-sm leading-6 text-[var(--ms-charcoal)] outline-none placeholder:text-[var(--ms-border)] focus:border-[var(--ms-rose)]"
              rows={3}
              placeholder="Share your beauty moment, tip, or inspiration…"
              value={newCaption}
              onChange={(e) => setNewCaption(e.target.value)}
            />
            <button
              type="button"
              onClick={handlePublish}
              disabled={!newCaption.trim() && newImages.length === 0}
              className="w-full rounded-full bg-[linear-gradient(135deg,var(--ms-rose),var(--ms-orchid))] py-3 text-sm font-bold text-white shadow-[0_8px_22px_rgba(212,83,126,0.3)] transition hover:brightness-110 disabled:opacity-50"
            >
              Post
            </button>
          </div>
        </div>
      )}

      {/* ── Post detail modal ──────────────────────────────────────── */}
      {expandedPost && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm sm:items-center" onClick={() => setExpandedPost(null)}>
          <div
            className="w-full max-w-lg overflow-hidden rounded-t-[32px] bg-white shadow-[0_-18px_60px_rgba(13,27,42,0.22)] sm:rounded-[32px]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[linear-gradient(135deg,var(--ms-rose),var(--ms-orchid))] text-sm font-bold text-white">
                  {expandedPost.authorName[0]}
                </div>
                <p className="text-sm font-semibold text-[var(--ms-navy)]">{expandedPost.authorName}</p>
              </div>
              <button type="button" onClick={() => setExpandedPost(null)} className="rounded-full bg-[var(--ms-soft-bg)] p-2 text-[var(--ms-mauve)]">
                <X className="h-4 w-4" />
              </button>
            </div>
            {expandedPost.images[0] && (
              <img src={expandedPost.images[0]} alt="" className="w-full aspect-square object-cover" />
            )}
            <div className="p-4">
              <div className="flex items-center gap-4">
                <button
                  type="button"
                  onClick={() => handleLike(expandedPost.id)}
                  disabled={isGuest}
                  className="flex items-center gap-1.5 text-sm font-semibold text-[var(--ms-mauve)] hover:text-[var(--ms-rose)] disabled:opacity-50"
                >
                  <Heart className={cn("h-5 w-5", expandedPost.savedBy.includes(session?.id ?? "") ? "fill-[var(--ms-rose)] text-[var(--ms-rose)]" : "")} />
                  {expandedPost.likes}
                </button>
                <span className="flex items-center gap-1.5 text-sm text-[var(--ms-mauve)]">
                  <MessageCircle className="h-5 w-5" /> {expandedPost.comments.length}
                </span>
              </div>
              {expandedPost.caption && (
                <p className="mt-2 text-sm leading-6 text-[var(--ms-charcoal)]">
                  <span className="font-semibold">{expandedPost.authorName}</span>{" "}{expandedPost.caption}
                </p>
              )}
              <div className="mt-3 max-h-36 space-y-2 overflow-y-auto">
                {expandedPost.comments.map((c) => (
                  <p key={c.id} className="text-xs leading-5 text-[var(--ms-charcoal)]">
                    <span className="font-semibold">{c.authorName}</span>{" "}{c.text}
                  </p>
                ))}
              </div>
              {!isGuest && (
                <div className="mt-3 flex gap-2">
                  <input
                    className="flex-1 rounded-full border border-[var(--ms-border)] bg-[var(--ms-soft-bg)] px-4 py-2 text-sm outline-none placeholder:text-[var(--ms-border)] focus:border-[var(--ms-rose)]"
                    placeholder="Add a comment…"
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter") handleAddComment(expandedPost.id); }}
                  />
                  <button type="button" onClick={() => handleAddComment(expandedPost.id)} className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--ms-rose)] text-white">
                    <Send className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
