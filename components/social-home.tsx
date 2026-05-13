"use client";

import Link from "next/link";
import { useEffect, useRef, useState, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import {
  BadgeCheck,
  Bookmark,
  ChevronLeft,
  ChevronRight,
  Flame,
  Heart,
  MessageCircle,
  MoreHorizontal,
  Plus,
  Repeat2,
  Send,
  Sparkles,
  Users,
  X,
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
  repostPost,
  bookmarkPost,
  sharePost,
  addComment,
  readSaves,
  SOCIAL_CHANGE_EVENT,
  SEED_POSTS,
  type SocialPost,
  type SocialSaves,
  type SocialComment,
} from "@/lib/social-store";
import { cn } from "@/lib/utils";

// ─── Types ────────────────────────────────────────────────────────────────────

type FeedTab = "foryou" | "following";
type CategoryKey = "all" | "portfolio" | "before_after" | "tip" | "inspo" | "promotion";

// ─── Constants ────────────────────────────────────────────────────────────────

const CATEGORIES: { key: CategoryKey; label: string }[] = [
  { key: "all", label: "All" },
  { key: "portfolio", label: "Looks" },
  { key: "before_after", label: "Transformations" },
  { key: "tip", label: "Tutorials" },
  { key: "inspo", label: "Inspo" },
  { key: "promotion", label: "Offers" },
];

const MOCK_STORIES = [
  { id: "s1", name: "Amara", avatar: "A", gradient: "from-purple-500 to-pink-500", seen: false },
  { id: "s2", name: "Kinyozi", avatar: "K", gradient: "from-rose-500 to-orange-500", seen: false },
  { id: "s3", name: "Zara MUA", avatar: "Z", gradient: "from-emerald-500 to-teal-500", seen: false },
  { id: "s4", name: "Lux Bar", avatar: "L", gradient: "from-amber-500 to-yellow-500", seen: true },
  { id: "s5", name: "Cynthia", avatar: "C", gradient: "from-blue-500 to-indigo-500", seen: true },
  { id: "s6", name: "Mariam", avatar: "M", gradient: "from-fuchsia-500 to-purple-600", seen: true },
  { id: "s7", name: "Westlands", avatar: "W", gradient: "from-rose-400 to-red-600", seen: true },
];

const TRENDING_TAGS = [
  { tag: "#boxbraids", posts: "2.4K posts" },
  { tag: "#naturalhair", posts: "18K posts" },
  { tag: "#nairobiglow", posts: "891 posts" },
  { tag: "#locjourney", posts: "1.2K posts" },
  { tag: "#bridalnairobi", posts: "547 posts" },
];

const SUGGESTED = [
  { name: "Amara Styles", role: "professional", sub: "Natural hair & braids · Westlands" },
  { name: "Lux Beauty Bar", role: "salon", sub: "Nails & facials · Lavington" },
  { name: "Zara Omukhubi", role: "professional", sub: "MUA · Kilimani" },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function timeAgo(iso: string): string {
  const diff = (Date.now() - new Date(iso).getTime()) / 1000;
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
  return `${Math.floor(diff / 86400)}d`;
}

function fmtCount(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
  return `${n}`;
}

function roleLabel(role: SocialPost["authorRole"]): string {
  return role === "professional" ? "Pro" : role === "salon" ? "Salon" : "Client";
}

function roleColors(role: SocialPost["authorRole"]): string {
  if (role === "professional") return "bg-[#F0EBFF] text-[#8B5CF6]";
  if (role === "salon") return "bg-[#FEF0F3] text-[#C8284A]";
  return "bg-[#E8F5F2] text-[#1A7A6B]";
}

function avatarGradient(role: SocialPost["authorRole"]): string {
  if (role === "professional") return "from-purple-500 to-purple-700";
  if (role === "salon") return "from-rose-500 to-red-700";
  return "from-teal-400 to-teal-600";
}

// ─── Avatar component ─────────────────────────────────────────────────────────

function Avatar({
  src,
  name,
  role,
  size = 40,
  ring = false,
}: {
  src?: string;
  name: string;
  role: SocialPost["authorRole"];
  size?: number;
  ring?: boolean;
}) {
  const cls = `shrink-0 overflow-hidden rounded-full bg-gradient-to-br ${avatarGradient(role)} flex items-center justify-center font-bold text-white`;
  const style = { width: size, height: size, fontSize: size * 0.4 };
  const ringStyle = ring
    ? {
        padding: 2.5,
        background:
          "linear-gradient(#fff,#fff) padding-box, linear-gradient(135deg,#D4537E,#8B5CF6) border-box",
        border: "2.5px solid transparent",
        borderRadius: "50%",
      }
    : {};

  return (
    <div style={ring ? { ...ringStyle, width: size + 5.5, height: size + 5.5 } : {}}>
      <div className={cls} style={style}>
        {src ? (
          <img src={src} alt={name} className="h-full w-full object-cover" />
        ) : (
          name[0]?.toUpperCase()
        )}
      </div>
    </div>
  );
}

// ─── Stories bar ──────────────────────────────────────────────────────────────

function StoriesBar({
  session,
  onAddStory,
}: {
  session: AppUserSession;
  onAddStory: () => void;
}) {
  const displayName =
    session.role === "client"
      ? session.firstName
      : session.role === "professional"
        ? session.displayName
        : session.role === "salon"
          ? session.salonName
          : "You";

  return (
    <div className="mb-3 overflow-x-auto pb-1 [-webkit-overflow-scrolling:touch] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      <div className="flex items-start gap-3 px-4">
        {/* Your story */}
        <button
          type="button"
          onClick={onAddStory}
          className="flex shrink-0 flex-col items-center gap-1.5"
        >
          <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-[var(--ms-soft-bg)] border-2 border-dashed border-[var(--ms-border)]">
            <Avatar
              name={displayName}
              role={session.role === "guest" ? "client" : session.role}
              size={52}
            />
            <span className="absolute bottom-0 right-0 flex h-5 w-5 items-center justify-center rounded-full bg-[var(--ms-rose)] border-2 border-white">
              <Plus className="h-2.5 w-2.5 text-white" strokeWidth={3} />
            </span>
          </div>
          <span className="max-w-[60px] truncate text-[10px] font-semibold text-[var(--ms-navy)]">
            Your story
          </span>
        </button>

        {/* Other stories */}
        {MOCK_STORIES.map((s) => (
          <button
            key={s.id}
            type="button"
            className="flex shrink-0 flex-col items-center gap-1.5"
          >
            <div
              className="flex items-center justify-center rounded-full"
              style={
                !s.seen
                  ? {
                      padding: 2.5,
                      background:
                        "linear-gradient(#fff,#fff) padding-box, linear-gradient(135deg,#D4537E,#8B5CF6) border-box",
                      border: "2.5px solid transparent",
                    }
                  : { padding: 2.5, border: "2.5px solid #E5E0DC", borderRadius: "50%" }
              }
            >
              <div
                className={cn(
                  "flex h-14 w-14 items-center justify-center rounded-full text-base font-bold text-white bg-gradient-to-br",
                  s.gradient,
                )}
              >
                {s.avatar}
              </div>
            </div>
            <span className="max-w-[60px] truncate text-[10px] font-semibold text-[var(--ms-navy)]">
              {s.name}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── Category chips ───────────────────────────────────────────────────────────

function CategoryChips({
  active,
  onChange,
}: {
  active: CategoryKey;
  onChange: (k: CategoryKey) => void;
}) {
  return (
    <div className="mb-3 overflow-x-auto pb-1 [-webkit-overflow-scrolling:touch] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      <div className="flex items-center gap-2 px-4">
        {CATEGORIES.map((c) => (
          <button
            key={c.key}
            type="button"
            onClick={() => onChange(c.key)}
            className={cn(
              "shrink-0 rounded-full px-4 py-2 text-[13px] font-semibold transition-all",
              active === c.key
                ? "bg-[var(--ms-plum)] text-white shadow-[0_4px_12px_rgba(132,36,92,0.25)]"
                : "bg-white text-[var(--ms-mauve)] border border-[var(--ms-border)] hover:text-[var(--ms-navy)]",
            )}
          >
            {c.label}
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── Post card ────────────────────────────────────────────────────────────────

function PostCard({
  post,
  session,
  onToast,
}: {
  post: SocialPost;
  session: AppUserSession | null;
  onToast: (msg: string) => void;
}) {
  const isGuest = !session || session.role === "guest";
  const userId = session?.id ?? "";

  const [localPost, setLocalPost] = useState(post);
  const [imgIdx, setImgIdx] = useState(0);
  const [commentsOpen, setCommentsOpen] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [captionExpanded, setCaptionExpanded] = useState(false);

  const liked = localPost.savedBy.includes(userId);
  const bookmarked = (localPost.bookmarkedBy ?? []).includes(userId);
  const reposted = (localPost.repostedBy ?? []).includes(userId);

  const displayName =
    session?.role === "client"
      ? (session as { firstName: string }).firstName
      : session?.role === "professional"
        ? (session as { displayName: string }).displayName
        : session?.role === "salon"
          ? (session as { salonName: string }).salonName
          : "Guest";

  const avatarSrc = session?.profilePhoto;

  function guardInteract(action: () => void) {
    if (isGuest) {
      onToast("Create a free account to interact");
      return;
    }
    action();
  }

  function handleLike() {
    guardInteract(() => {
      likePost(localPost.id, userId);
      setLocalPost((p) => ({
        ...p,
        likes: liked ? p.likes - 1 : p.likes + 1,
        savedBy: liked ? p.savedBy.filter((id) => id !== userId) : [...p.savedBy, userId],
      }));
    });
  }

  function handleRepost() {
    guardInteract(() => {
      repostPost(localPost.id, userId);
      setLocalPost((p) => ({
        ...p,
        repostedBy: reposted
          ? (p.repostedBy ?? []).filter((id) => id !== userId)
          : [...(p.repostedBy ?? []), userId],
      }));
    });
  }

  function handleBookmark() {
    guardInteract(() => {
      bookmarkPost(localPost.id, userId);
      setLocalPost((p) => ({
        ...p,
        bookmarkedBy: bookmarked
          ? (p.bookmarkedBy ?? []).filter((id) => id !== userId)
          : [...(p.bookmarkedBy ?? []), userId],
      }));
      onToast(bookmarked ? "Removed from saved" : "Saved to your collection");
    });
  }

  function handleShare() {
    sharePost(localPost.id);
    if (navigator.share) {
      navigator.share({ title: localPost.authorName, text: localPost.caption }).catch(() => null);
    } else {
      navigator.clipboard.writeText(window.location.href).catch(() => null);
      onToast("Link copied to clipboard");
    }
  }

  function handleComment() {
    guardInteract(() => {
      if (!commentText.trim()) return;
      const comment: SocialComment = {
        id: `cmt_${Date.now()}`,
        authorId: userId,
        authorName: displayName,
        authorAvatar: avatarSrc,
        text: commentText.trim(),
        createdAt: new Date().toISOString(),
      };
      addComment(localPost.id, comment);
      setLocalPost((p) => ({ ...p, comments: [...p.comments, comment] }));
      setCommentText("");
    });
  }

  const caption = localPost.caption;
  const captionShort = caption.length > 120 && !captionExpanded ? caption.slice(0, 120) : caption;

  // Strip hashtags from caption into separate chip line
  const hashtags = localPost.tags.length > 0 ? localPost.tags : [];

  return (
    <article className="overflow-hidden rounded-[20px] bg-white shadow-[0_1px_8px_rgba(13,27,42,0.08)]">
      {/* ── Author row ─────────────────────────────────────────────── */}
      <div className="flex items-center gap-2.5 px-4 py-3">
        <Avatar
          src={localPost.authorAvatar}
          name={localPost.authorName}
          role={localPost.authorRole}
          size={40}
          ring
        />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <span className="truncate text-sm font-bold text-[var(--ms-navy)]">
              {localPost.authorName}
            </span>
            <span
              className={cn(
                "shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.06em]",
                roleColors(localPost.authorRole),
              )}
            >
              {roleLabel(localPost.authorRole)}
            </span>
            {localPost.verified && (
              <BadgeCheck className="h-3.5 w-3.5 shrink-0 text-[#1A7A6B]" />
            )}
          </div>
          <p className="text-[11px] text-[var(--ms-mauve)]">
            {localPost.location ? `${localPost.location} · ` : ""}
            {timeAgo(localPost.createdAt)}
          </p>
        </div>
        <button
          type="button"
          className="ml-auto shrink-0 rounded-full px-3 py-1 text-xs font-bold border border-[var(--ms-border)] text-[var(--ms-plum)] hover:bg-[var(--ms-petal)] transition"
          onClick={() => guardInteract(() => onToast("Now following"))}
        >
          Follow
        </button>
        <button type="button" className="shrink-0 text-[var(--ms-mauve)] hover:text-[var(--ms-navy)]">
          <MoreHorizontal className="h-4 w-4" />
        </button>
      </div>

      {/* ── Media ──────────────────────────────────────────────────── */}
      {localPost.images.length > 0 && (
        <div className="relative aspect-[4/5] overflow-hidden bg-[var(--ms-soft-bg)]">
          <img
            src={localPost.images[imgIdx]}
            alt={localPost.caption}
            className="h-full w-full object-cover"
            loading="lazy"
          />

          {/* Post type badge */}
          {localPost.type === "before_after" && (
            <span className="absolute left-3 top-3 rounded-full bg-black/60 px-2.5 py-1 text-[11px] font-bold text-white backdrop-blur-sm">
              Before / After
            </span>
          )}
          {localPost.type === "tip" && (
            <span className="absolute left-3 top-3 flex items-center gap-1 rounded-full bg-[var(--ms-plum)]/90 px-2.5 py-1 text-[11px] font-bold text-white backdrop-blur-sm">
              <Sparkles className="h-3 w-3" /> Tutorial
            </span>
          )}

          {/* Carousel navigation */}
          {localPost.images.length > 1 && (
            <>
              {imgIdx > 0 && (
                <button
                  type="button"
                  onClick={() => setImgIdx((i) => i - 1)}
                  className="absolute left-2 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm hover:bg-black/60"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
              )}
              {imgIdx < localPost.images.length - 1 && (
                <button
                  type="button"
                  onClick={() => setImgIdx((i) => i + 1)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm hover:bg-black/60"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              )}
              {/* Dot indicators */}
              <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5">
                {localPost.images.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setImgIdx(i)}
                    className={cn(
                      "h-1.5 rounded-full transition-all",
                      i === imgIdx ? "w-5 bg-white" : "w-1.5 bg-white/50",
                    )}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      )}

      {/* ── Action bar ─────────────────────────────────────────────── */}
      <div className="flex items-center px-3 pt-3">
        {/* Like */}
        <button
          type="button"
          onClick={handleLike}
          className="flex items-center gap-1.5 rounded-full p-2 transition hover:bg-[var(--ms-soft-bg)]"
        >
          <Heart
            className={cn(
              "h-[22px] w-[22px] transition-all",
              liked ? "fill-[#C8284A] text-[#C8284A] scale-110" : "text-[var(--ms-navy)]",
            )}
          />
          <span className={cn("text-[13px] font-semibold", liked ? "text-[#C8284A]" : "text-[var(--ms-navy)]")}>
            {fmtCount(localPost.likes)}
          </span>
        </button>

        {/* Comment */}
        <button
          type="button"
          onClick={() => setCommentsOpen((o) => !o)}
          className="flex items-center gap-1.5 rounded-full p-2 transition hover:bg-[var(--ms-soft-bg)]"
        >
          <MessageCircle className="h-[22px] w-[22px] text-[var(--ms-navy)]" />
          <span className="text-[13px] font-semibold text-[var(--ms-navy)]">
            {localPost.comments.length > 0 ? fmtCount(localPost.comments.length) : ""}
          </span>
        </button>

        {/* Repost */}
        <button
          type="button"
          onClick={handleRepost}
          className="flex items-center gap-1.5 rounded-full p-2 transition hover:bg-[var(--ms-soft-bg)]"
        >
          <Repeat2
            className={cn(
              "h-[22px] w-[22px] transition-all",
              reposted ? "text-emerald-500" : "text-[var(--ms-navy)]",
            )}
          />
          {(localPost.repostedBy?.length ?? 0) > 0 && (
            <span className={cn("text-[13px] font-semibold", reposted ? "text-emerald-500" : "text-[var(--ms-navy)]")}>
              {fmtCount(localPost.repostedBy!.length)}
            </span>
          )}
        </button>

        {/* Share */}
        <button
          type="button"
          onClick={handleShare}
          className="flex items-center gap-1.5 rounded-full p-2 transition hover:bg-[var(--ms-soft-bg)]"
        >
          <Send className="h-[22px] w-[22px] text-[var(--ms-navy)]" />
        </button>

        {/* Spacer */}
        <span className="flex-1" />

        {/* Bookmark */}
        <button
          type="button"
          onClick={handleBookmark}
          className="flex items-center gap-1.5 rounded-full p-2 transition hover:bg-[var(--ms-soft-bg)]"
        >
          <Bookmark
            className={cn(
              "h-[22px] w-[22px] transition-all",
              bookmarked ? "fill-[var(--ms-plum)] text-[var(--ms-plum)]" : "text-[var(--ms-navy)]",
            )}
          />
        </button>
      </div>

      {/* ── Caption ────────────────────────────────────────────────── */}
      <div className="px-4 pb-2 pt-1">
        <p className="text-[13px] leading-5 text-[var(--ms-charcoal)]">
          <span className="font-bold text-[var(--ms-navy)]">{localPost.authorName}</span>{" "}
          {captionShort}
          {caption.length > 120 && !captionExpanded && (
            <button
              type="button"
              onClick={() => setCaptionExpanded(true)}
              className="ml-1 font-semibold text-[var(--ms-mauve)]"
            >
              more
            </button>
          )}
        </p>
        {hashtags.length > 0 && (
          <p className="mt-1 flex flex-wrap gap-x-2 gap-y-0.5">
            {hashtags.map((tag) => (
              <span key={tag} className="text-[12px] font-medium text-[#8B5CF6]">
                {tag}
              </span>
            ))}
          </p>
        )}
      </div>

      {/* ── Comments section ──────────────────────────────────────── */}
      {localPost.comments.length > 0 && (
        <div className="px-4 pb-2">
          {!commentsOpen && (
            <button
              type="button"
              onClick={() => setCommentsOpen(true)}
              className="text-[12px] font-semibold text-[var(--ms-mauve)] hover:text-[var(--ms-navy)]"
            >
              View all {localPost.comments.length} comment{localPost.comments.length !== 1 ? "s" : ""}
            </button>
          )}
          {commentsOpen && (
            <div className="space-y-2">
              {localPost.comments.map((c) => (
                <p key={c.id} className="text-[12px] leading-5 text-[var(--ms-charcoal)]">
                  <span className="font-bold text-[var(--ms-navy)]">{c.authorName}</span>{" "}
                  {c.text}
                </p>
              ))}
              <button
                type="button"
                onClick={() => setCommentsOpen(false)}
                className="text-[11px] font-semibold text-[var(--ms-mauve)]"
              >
                Collapse
              </button>
            </div>
          )}
        </div>
      )}

      {/* ── Comment input ─────────────────────────────────────────── */}
      <div className="flex items-center gap-2 border-t border-[var(--ms-border)]/60 px-3 py-2.5">
        {session && session.role !== "guest" ? (
          <Avatar
            src={(session as { profilePhoto?: string }).profilePhoto}
            name={displayName}
            role={session.role}
            size={28}
          />
        ) : (
          <div className="h-7 w-7 shrink-0 rounded-full bg-[var(--ms-soft-bg)]" />
        )}
        <input
          type="text"
          placeholder="Add a comment…"
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleComment();
          }}
          onClick={() => isGuest && onToast("Create a free account to comment")}
          readOnly={isGuest}
          className="flex-1 bg-transparent text-[13px] text-[var(--ms-charcoal)] placeholder:text-[var(--ms-border)] outline-none"
        />
        {commentText.trim() && (
          <button
            type="button"
            onClick={handleComment}
            className="text-[13px] font-bold text-[var(--ms-rose)]"
          >
            Post
          </button>
        )}
      </div>
    </article>
  );
}

// ─── Trending sidebar (desktop) ───────────────────────────────────────────────

function TrendingSidebar({ onToast }: { onToast: (msg: string) => void }) {
  return (
    <aside className="hidden w-72 shrink-0 xl:block">
      <div className="sticky top-24 space-y-4">
        {/* Trending */}
        <div className="rounded-[20px] bg-white p-5 shadow-[0_1px_8px_rgba(13,27,42,0.08)]">
          <div className="mb-3 flex items-center gap-2">
            <Flame className="h-4 w-4 text-[var(--ms-rose)]" />
            <p className="text-sm font-bold text-[var(--ms-navy)]">Trending</p>
          </div>
          <div className="space-y-3">
            {TRENDING_TAGS.map((t, i) => (
              <button
                key={t.tag}
                type="button"
                onClick={() => onToast("Filtering by " + t.tag)}
                className="flex w-full items-center justify-between group"
              >
                <div className="flex items-center gap-3">
                  <span className="w-4 text-right text-[11px] font-bold text-[var(--ms-mauve)]">
                    {i + 1}
                  </span>
                  <div className="text-left">
                    <p className="text-[13px] font-bold text-[var(--ms-navy)] group-hover:text-[var(--ms-plum)]">
                      {t.tag}
                    </p>
                    <p className="text-[11px] text-[var(--ms-mauve)]">{t.posts}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Suggested */}
        <div className="rounded-[20px] bg-white p-5 shadow-[0_1px_8px_rgba(13,27,42,0.08)]">
          <p className="mb-3 text-sm font-bold text-[var(--ms-navy)]">Suggested for you</p>
          <div className="space-y-3">
            {SUGGESTED.map((s) => (
              <div key={s.name} className="flex items-center gap-3">
                <div
                  className={cn(
                    "flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white bg-gradient-to-br",
                    s.role === "professional" ? "from-purple-500 to-purple-700" : s.role === "salon" ? "from-rose-500 to-red-700" : "from-teal-400 to-teal-600",
                  )}
                >
                  {s.name[0]}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[13px] font-bold text-[var(--ms-navy)]">{s.name}</p>
                  <p className="truncate text-[11px] text-[var(--ms-mauve)]">{s.sub}</p>
                </div>
                <button
                  type="button"
                  onClick={() => onToast("Now following " + s.name)}
                  className="shrink-0 rounded-full border border-[var(--ms-border)] px-3 py-1 text-[12px] font-bold text-[var(--ms-plum)] hover:bg-[var(--ms-petal)] transition"
                >
                  Follow
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <p className="px-1 text-[11px] text-[var(--ms-mauve)] leading-5">
          Mobile Salon · Beauty, softly handled · For women, by women · Kenya 🇰🇪
        </p>
      </div>
    </aside>
  );
}

// ─── Compose sheet ────────────────────────────────────────────────────────────

function ComposeSheet({
  session,
  displayName,
  avatarSrc,
  onClose,
  onPublished,
}: {
  session: AppUserSession;
  displayName: string;
  avatarSrc?: string;
  onClose: () => void;
  onPublished: () => void;
}) {
  const [images, setImages] = useState<string[]>([]);
  const [caption, setCaption] = useState("");
  const [tag, setTag] = useState<"portfolio" | "before_after" | "inspo" | "tip" | "promotion">("portfolio");

  const POST_TYPES: { key: typeof tag; label: string }[] = [
    { key: "portfolio", label: "My Look" },
    { key: "before_after", label: "Before / After" },
    { key: "tip", label: "Tutorial / Tip" },
    { key: "inspo", label: "Inspiration" },
    { key: "promotion", label: "Offer" },
  ];

  function publish() {
    if (!caption.trim() && images.length === 0) return;
    const post: SocialPost = {
      id: `post_${Date.now()}`,
      authorId: session.id,
      authorName: displayName,
      authorAvatar: avatarSrc,
      authorRole:
        session.role === "client"
          ? "client"
          : session.role === "professional"
            ? "professional"
            : "salon",
      type: tag,
      images,
      caption,
      tags: caption.match(/#\w+/g) ?? [],
      likes: 0,
      savedBy: [],
      bookmarkedBy: [],
      repostedBy: [],
      comments: [],
      createdAt: new Date().toISOString(),
    };
    writePost(post);
    onPublished();
    onClose();
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm sm:items-center"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg overflow-hidden rounded-t-[32px] bg-white shadow-[0_-20px_60px_rgba(13,27,42,0.22)] sm:rounded-[32px]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Handle */}
        <div className="mx-auto mt-3 h-1 w-10 rounded-full bg-[var(--ms-border)]" />

        <div className="p-5">
          <div className="mb-4 flex items-center gap-3">
            <Avatar
              src={avatarSrc}
              name={displayName}
              role={
                session.role === "client"
                  ? "client"
                  : session.role === "professional"
                    ? "professional"
                    : "salon"
              }
              size={40}
            />
            <div>
              <p className="text-sm font-bold text-[var(--ms-navy)]">{displayName}</p>
              <p className="text-xs text-[var(--ms-mauve)]">Sharing to everyone</p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="ml-auto rounded-full bg-[var(--ms-soft-bg)] p-2 text-[var(--ms-mauve)] hover:text-[var(--ms-rose)]"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Post type tabs */}
          <div className="mb-3 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {POST_TYPES.map((t) => (
              <button
                key={t.key}
                type="button"
                onClick={() => setTag(t.key)}
                className={cn(
                  "shrink-0 rounded-full px-3 py-1.5 text-xs font-bold transition",
                  tag === t.key
                    ? "bg-[var(--ms-plum)] text-white"
                    : "bg-[var(--ms-soft-bg)] text-[var(--ms-mauve)]",
                )}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Image upload */}
          <ImageUploadEditor
            onSave={(url) => setImages((prev) => [...prev, url])}
            aspectHint="1/1"
            className="mb-3"
          />

          {/* Image previews */}
          {images.length > 0 && (
            <div className="mb-3 flex gap-2 overflow-x-auto pb-1">
              {images.map((img, i) => (
                <div key={i} className="relative h-16 w-16 shrink-0 overflow-hidden rounded-[12px]">
                  <img src={img} alt="" className="h-full w-full object-cover" />
                  <button
                    type="button"
                    onClick={() => setImages((prev) => prev.filter((_, j) => j !== i))}
                    className="absolute right-0.5 top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-black/60 text-white"
                  >
                    <X className="h-2.5 w-2.5" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Caption */}
          <textarea
            className="mb-1 w-full resize-none rounded-[16px] border border-[var(--ms-border)] bg-[var(--ms-soft-bg)] px-4 py-3 text-[13px] leading-6 text-[var(--ms-charcoal)] outline-none placeholder:text-[var(--ms-border)] focus:border-[var(--ms-plum)] transition"
            rows={3}
            placeholder="Share your beauty moment, tip, or inspiration… use #hashtags"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
          />
          <p className="mb-3 text-[11px] text-[var(--ms-mauve)]">
            Add hashtags to reach more women — #naturalhair #nairobiglow etc.
          </p>

          <button
            type="button"
            onClick={publish}
            disabled={!caption.trim() && images.length === 0}
            className="w-full rounded-full bg-[linear-gradient(135deg,var(--ms-rose),var(--ms-orchid))] py-3.5 text-sm font-bold text-white shadow-[0_8px_22px_rgba(212,83,126,0.3)] transition hover:brightness-110 disabled:opacity-50"
          >
            Share now
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Toast ────────────────────────────────────────────────────────────────────

function Toast({ msg, onDone }: { msg: string; onDone: () => void }) {
  useEffect(() => {
    const t = setTimeout(onDone, 2400);
    return () => clearTimeout(t);
  }, [onDone]);
  return (
    <div className="fixed bottom-24 left-1/2 z-[60] -translate-x-1/2 rounded-full bg-[var(--ms-navy)] px-5 py-2.5 text-[13px] font-semibold text-white shadow-[0_8px_24px_rgba(13,27,42,0.28)] animate-in fade-in slide-in-from-bottom-4 duration-200">
      {msg}
    </div>
  );
}

// ─── Guest banner ─────────────────────────────────────────────────────────────

function GuestBanner({ onDismiss }: { onDismiss: () => void }) {
  return (
    <div className="relative mb-4 flex items-center gap-3 rounded-[18px] bg-[var(--ms-petal)] px-4 py-3.5 shadow-[0_1px_8px_rgba(13,27,42,0.07)]">
      <div className="flex-1">
        <p className="text-[13px] font-bold text-[var(--ms-plum)]">Browsing as a guest</p>
        <p className="text-[12px] text-[var(--ms-mauve)]">
          Create a free account to like, comment, post, and book.
        </p>
        <Link
          href="/signup/client"
          className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-[var(--ms-plum)] px-4 py-1.5 text-[12px] font-bold text-white"
        >
          Join free
        </Link>
      </div>
      <button
        type="button"
        onClick={onDismiss}
        className="absolute right-3 top-3 rounded-full p-1 text-[var(--ms-mauve)] hover:text-[var(--ms-navy)]"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export function SocialHome() {
  const searchParams = useSearchParams();
  const initTab = (searchParams.get("tab") as FeedTab | null) ?? "foryou";

  const [session, setSession] = useState<AppUserSession | null>(null);
  const [realPosts, setRealPosts] = useState<SocialPost[]>([]);
  const [saves, setSaves] = useState<SocialSaves>({ professionals: [], salons: [] });
  const [activeTab, setActiveTab] = useState<FeedTab>(["foryou", "following"].includes(initTab) ? initTab : "foryou");
  const [activeCategory, setActiveCategory] = useState<CategoryKey>("all");
  const [showCompose, setShowCompose] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [guestBannerDismissed, setGuestBannerDismissed] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const showToast = useCallback((msg: string) => {
    setToast(msg);
  }, []);

  useEffect(() => {
    function sync() {
      const s = readAppSession();
      setSession(s);
      setRealPosts(readPosts());
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
    session.role === "client"
      ? (session as { firstName: string }).firstName
      : session.role === "professional"
        ? (session as { displayName: string }).displayName
        : session.role === "salon"
          ? (session as { salonName: string }).salonName
          : "Guest";
  const avatarSrc = (session as { profilePhoto?: string }).profilePhoto;

  // Merge real posts + seed posts (dedup by id)
  const realIds = new Set(realPosts.map((p) => p.id));
  const allPosts = [...realPosts, ...SEED_POSTS.filter((sp) => !realIds.has(sp.id))];

  // Following filter
  const followedIds = new Set([...saves.professionals, ...saves.salons]);
  const feedPosts =
    activeTab === "following"
      ? allPosts.filter((p) => followedIds.has(p.authorId) || p.authorId === session.id)
      : allPosts;

  // Category filter
  const filteredPosts =
    activeCategory === "all"
      ? feedPosts
      : feedPosts.filter((p) => p.type === activeCategory);

  return (
    <>
      {/* Feed wrapper: max centered column + sidebar on xl */}
      <div className="mx-auto flex max-w-[960px] items-start gap-6 px-4 pb-28 pt-3 lg:px-6">
        {/* ── Main feed column ──────────────────────────────────────── */}
        <div className="min-w-0 flex-1">
          {/* Stories */}
          <StoriesBar session={session} onAddStory={() => !isGuest ? setShowCompose(true) : showToast("Create a free account to post stories")} />

          {/* Guest banner */}
          {isGuest && !guestBannerDismissed && (
            <GuestBanner onDismiss={() => setGuestBannerDismissed(true)} />
          )}

          {/* Feed / Following tabs */}
          <div className="mb-3 flex rounded-[18px] border border-[var(--ms-border)] bg-white p-1 shadow-[0_1px_6px_rgba(13,27,42,0.05)]">
            {(["foryou", "following"] as FeedTab[]).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setActiveTab(t)}
                className={cn(
                  "flex flex-1 items-center justify-center gap-2 rounded-[14px] py-2 text-[13px] font-bold transition",
                  activeTab === t
                    ? "bg-[var(--ms-navy)] text-white"
                    : "text-[var(--ms-mauve)] hover:text-[var(--ms-navy)]",
                )}
              >
                {t === "foryou" ? (
                  <>
                    <Sparkles className="h-4 w-4" /> For You
                  </>
                ) : (
                  <>
                    <Users className="h-4 w-4" /> Following
                  </>
                )}
              </button>
            ))}
          </div>

          {/* Category chips */}
          <div className="-mx-4 lg:-mx-6">
            <CategoryChips active={activeCategory} onChange={setActiveCategory} />
          </div>

          {/* Empty following state */}
          {activeTab === "following" && filteredPosts.length === 0 && (
            <div className="rounded-[20px] bg-white py-14 text-center shadow-[0_1px_8px_rgba(13,27,42,0.08)]">
              <Users className="mx-auto h-10 w-10 text-[var(--ms-mauve)] opacity-30" />
              <p className="mt-3 text-[14px] font-bold text-[var(--ms-navy)]">Nothing here yet</p>
              <p className="mt-1 text-[12px] text-[var(--ms-mauve)]">
                Follow professionals and salons to build your feed.
              </p>
              <button
                type="button"
                onClick={() => setActiveTab("foryou")}
                className="mt-4 rounded-full bg-[var(--ms-petal)] px-5 py-2 text-[13px] font-bold text-[var(--ms-plum)]"
              >
                Explore the community
              </button>
            </div>
          )}

          {/* Posts */}
          <div className="space-y-4">
            {filteredPosts.map((post) => (
              <PostCard
                key={`${post.id}_${refreshKey}`}
                post={post}
                session={session}
                onToast={showToast}
              />
            ))}
          </div>
        </div>

        {/* ── Desktop sidebar ───────────────────────────────────────── */}
        <TrendingSidebar onToast={showToast} />
      </div>

      {/* ── Floating compose button ───────────────────────────────── */}
      <button
        type="button"
        onClick={() =>
          isGuest
            ? showToast("Create a free account to post")
            : setShowCompose(true)
        }
        className="fixed bottom-24 right-4 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[linear-gradient(135deg,var(--ms-rose),var(--ms-orchid))] text-white shadow-[0_8px_28px_rgba(212,83,126,0.4)] transition hover:scale-105 hover:brightness-110 lg:bottom-8 lg:right-8"
        aria-label="Create post"
      >
        <Plus className="h-6 w-6" strokeWidth={2.5} />
      </button>

      {/* ── Compose sheet ─────────────────────────────────────────── */}
      {showCompose && !isGuest && (
        <ComposeSheet
          session={session}
          displayName={displayName}
          avatarSrc={avatarSrc}
          onClose={() => setShowCompose(false)}
          onPublished={() => setRefreshKey((k) => k + 1)}
        />
      )}

      {/* ── Toast ─────────────────────────────────────────────────── */}
      {toast && <Toast msg={toast} onDone={() => setToast(null)} />}
    </>
  );
}
