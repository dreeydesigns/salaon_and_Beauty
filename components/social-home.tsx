"use client";

import Link from "next/link";
import { useEffect, useCallback, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  Archive,
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
  Trash2,
  UserCheck,
  UserPlus,
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
  deletePost,
  archivePost,
  readFollowedAuthors,
  toggleFollowAuthor,
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

// ─── Pulse cards (replaces generic story circles) ────────────────────────────

const PULSE_CARDS = [
  { id: "pc1", emoji: "🔥", label: "Box braids", sub: "2.4K posts", from: "from-purple-600", to: "to-pink-500", filter: "portfolio" as CategoryKey },
  { id: "pc2", emoji: "✨", label: "Tutorials", sub: "New this week", from: "from-teal-600", to: "to-emerald-400", filter: "tip" as CategoryKey },
  { id: "pc3", emoji: "🌿", label: "Natural hair", sub: "18K posts", from: "from-amber-500", to: "to-orange-400", filter: "portfolio" as CategoryKey },
  { id: "pc4", emoji: "💫", label: "Transformations", sub: "846 this week", from: "from-rose-600", to: "to-red-400", filter: "before_after" as CategoryKey },
  { id: "pc5", emoji: "💍", label: "Bridal inspo", sub: "Trending now", from: "from-indigo-600", to: "to-purple-400", filter: "inspo" as CategoryKey },
  { id: "pc6", emoji: "💅", label: "Nail art", sub: "637 posts", from: "from-pink-500", to: "to-rose-400", filter: "portfolio" as CategoryKey },
  { id: "pc7", emoji: "🌟", label: "Offers", sub: "Limited deals", from: "from-yellow-500", to: "to-amber-400", filter: "promotion" as CategoryKey },
];

const CATEGORIES: { key: CategoryKey; label: string }[] = [
  { key: "all", label: "All" },
  { key: "portfolio", label: "Looks" },
  { key: "before_after", label: "Transformations" },
  { key: "tip", label: "Tutorials" },
  { key: "inspo", label: "Inspo" },
  { key: "promotion", label: "Offers" },
];

const TRENDING_TAGS = [
  { tag: "#boxbraids", posts: "2.4K posts" },
  { tag: "#naturalhair", posts: "18K posts" },
  { tag: "#nairobiglow", posts: "891 posts" },
  { tag: "#locjourney", posts: "1.2K posts" },
  { tag: "#bridalnairobi", posts: "547 posts" },
];

const SUGGESTED = [
  { id: "pro_amara", name: "Amara Styles", role: "professional" as const, sub: "Natural hair & braids · Westlands" },
  { id: "salon_lux", name: "Lux Beauty Bar", role: "salon" as const, sub: "Nails & facials · Lavington" },
  { id: "pro_zara", name: "Zara Omukhubi", role: "professional" as const, sub: "MUA · Kilimani" },
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

/** Safely extract profilePhoto from any session role (guests have none) */
function getSessionPhoto(session: AppUserSession | null): string | undefined {
  if (!session || session.role === "guest") return undefined;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (session as any).profilePhoto as string | undefined;
}

/** Safely extract display name from any session role */
function getSessionName(session: AppUserSession | null): string {
  if (!session) return "Guest";
  if (session.role === "client") return (session as { firstName: string }).firstName;
  if (session.role === "professional") return (session as { displayName: string }).displayName;
  if (session.role === "salon") return (session as { salonName: string }).salonName;
  return "Guest";
}

// ─── Avatar ───────────────────────────────────────────────────────────────────

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
  const gradient = avatarGradient(role);
  const inner = (
    <div
      className={`shrink-0 overflow-hidden rounded-full bg-gradient-to-br ${gradient} flex items-center justify-center font-bold text-white`}
      style={{ width: size, height: size, fontSize: size * 0.38 }}
    >
      {src ? <img src={src} alt={name} className="h-full w-full object-cover" /> : name[0]?.toUpperCase()}
    </div>
  );

  if (!ring) return inner;

  return (
    <div
      style={{
        padding: 2.5,
        background: "linear-gradient(#fff,#fff) padding-box, linear-gradient(135deg,#D4537E,#8B5CF6) border-box",
        border: "2.5px solid transparent",
        borderRadius: "50%",
        width: size + 5,
        height: size + 5,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {inner}
    </div>
  );
}

// ─── Pulse bar (trending topics — not stories circles) ────────────────────────

function PulseBar({
  activeFilter,
  onFilter,
  onCompose,
  canPost,
}: {
  activeFilter: CategoryKey;
  onFilter: (k: CategoryKey) => void;
  onCompose: () => void;
  canPost: boolean;
}) {
  return (
    <div className="mb-3 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden [-webkit-overflow-scrolling:touch]">
      <div className="flex items-stretch gap-2.5 px-4">
        {/* Post card — first item */}
        <button
          type="button"
          onClick={onCompose}
          className="flex shrink-0 flex-col items-center justify-center gap-1.5 rounded-[18px] border-2 border-dashed border-[var(--ms-border)] bg-white px-4 py-3 text-center transition hover:border-[var(--ms-rose)] hover:text-[var(--ms-rose)]"
          style={{ minWidth: 110, minHeight: 80 }}
        >
          <Plus className={cn("h-6 w-6", canPost ? "text-[var(--ms-rose)]" : "text-[var(--ms-mauve)]")} strokeWidth={2} />
          <span className="text-[11px] font-bold text-[var(--ms-mauve)]">
            {canPost ? "Share look" : "Join & post"}
          </span>
        </button>

        {/* Pulse trend cards */}
        {PULSE_CARDS.map((c) => {
          const active = activeFilter === c.filter;
          return (
            <button
              key={c.id}
              type="button"
              onClick={() => onFilter(active ? "all" : c.filter)}
              className={cn(
                "shrink-0 overflow-hidden rounded-[18px] bg-gradient-to-br transition-all duration-200",
                c.from, c.to,
                active ? "ring-2 ring-white ring-offset-2 scale-[0.97]" : "hover:scale-[0.98]",
              )}
              style={{ minWidth: 130, minHeight: 80 }}
            >
              <div className="flex h-full flex-col items-start justify-between p-3">
                <span className="text-[22px] leading-none">{c.emoji}</span>
                <div className="text-left">
                  <p className="text-[12px] font-bold leading-tight text-white">{c.label}</p>
                  <p className="text-[10px] text-white/75">{c.sub}</p>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── Category chips ───────────────────────────────────────────────────────────

function CategoryChips({ active, onChange }: { active: CategoryKey; onChange: (k: CategoryKey) => void }) {
  return (
    <div className="mb-3 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
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

// ─── Post options menu ────────────────────────────────────────────────────────

function PostMenu({
  isOwner,
  isFollowing,
  isArchived,
  onFollow,
  onArchive,
  onDelete,
  onClose,
}: {
  isOwner: boolean;
  isFollowing: boolean;
  isArchived?: boolean;
  onFollow: () => void;
  onArchive: () => void;
  onDelete: () => void;
  onClose: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 backdrop-blur-sm sm:items-center"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm overflow-hidden rounded-t-[28px] bg-white sm:rounded-[28px]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mx-auto mt-3 h-1 w-10 rounded-full bg-[var(--ms-border)]" />
        <div className="p-4">
          {isOwner ? (
            <>
              <button
                type="button"
                onClick={onArchive}
                className="flex w-full items-center gap-3 rounded-[14px] px-4 py-3 text-sm font-semibold text-[var(--ms-navy)] hover:bg-[var(--ms-soft-bg)]"
              >
                <Archive className="h-5 w-5 text-[var(--ms-mauve)]" />
                {isArchived ? "Unarchive post" : "Archive post"}
              </button>
              <button
                type="button"
                onClick={onDelete}
                className="flex w-full items-center gap-3 rounded-[14px] px-4 py-3 text-sm font-semibold text-red-600 hover:bg-red-50"
              >
                <Trash2 className="h-5 w-5" />
                Delete post
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={onFollow}
                className="flex w-full items-center gap-3 rounded-[14px] px-4 py-3 text-sm font-semibold text-[var(--ms-navy)] hover:bg-[var(--ms-soft-bg)]"
              >
                {isFollowing
                  ? <><UserCheck className="h-5 w-5 text-[var(--ms-plum)]" /> Unfollow</>
                  : <><UserPlus className="h-5 w-5 text-[var(--ms-mauve)]" /> Follow</>
                }
              </button>
              <button
                type="button"
                onClick={onClose}
                className="flex w-full items-center gap-3 rounded-[14px] px-4 py-3 text-sm font-semibold text-[var(--ms-mauve)] hover:bg-[var(--ms-soft-bg)]"
              >
                Not interested in this post
              </button>
              <button
                type="button"
                onClick={onClose}
                className="flex w-full items-center gap-3 rounded-[14px] px-4 py-3 text-sm font-semibold text-red-500 hover:bg-red-50"
              >
                Report
              </button>
            </>
          )}
          <button
            type="button"
            onClick={onClose}
            className="mt-1 flex w-full items-center justify-center rounded-[14px] px-4 py-3 text-sm font-semibold text-[var(--ms-mauve)] hover:bg-[var(--ms-soft-bg)]"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Delete confirmation ──────────────────────────────────────────────────────

function DeleteConfirm({ onConfirm, onCancel }: { onConfirm: () => void; onCancel: () => void }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-6"
      onClick={onCancel}
    >
      <div
        className="w-full max-w-sm rounded-[24px] bg-white p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-base font-bold text-[var(--ms-navy)]">Delete this post?</h3>
        <p className="mt-1 text-sm text-[var(--ms-mauve)]">This cannot be undone. The post will be removed from everyone's feed.</p>
        <div className="mt-5 flex gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 rounded-full border border-[var(--ms-border)] py-3 text-sm font-semibold text-[var(--ms-navy)]"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="flex-1 rounded-full bg-red-600 py-3 text-sm font-bold text-white"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Post card ────────────────────────────────────────────────────────────────

function PostCard({
  post,
  sessionId,
  sessionRole,
  sessionPhoto,
  sessionName,
  onToast,
  followedAuthors,
  onFollowToggle,
  onDeleted,
  onArchived,
}: {
  post: SocialPost;
  sessionId: string;
  sessionRole: AppUserSession["role"];
  sessionPhoto: string | undefined;
  sessionName: string;
  onToast: (msg: string) => void;
  followedAuthors: Set<string>;
  onFollowToggle: (authorId: string) => void;
  onDeleted: (postId: string) => void;
  onArchived: (postId: string) => void;
}) {
  const isGuest = sessionRole === "guest";
  const isOwner = post.authorId === sessionId;
  const isFollowing = followedAuthors.has(post.authorId);

  const [localPost, setLocalPost] = useState(post);
  const [imgIdx, setImgIdx] = useState(0);
  const [commentsOpen, setCommentsOpen] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [captionExpanded, setCaptionExpanded] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const liked = localPost.savedBy.includes(sessionId);
  const bookmarked = (localPost.bookmarkedBy ?? []).includes(sessionId);
  const reposted = (localPost.repostedBy ?? []).includes(sessionId);

  function guard(action: () => void) {
    if (isGuest) { onToast("Join free to interact"); return; }
    action();
  }

  function handleLike() {
    guard(() => {
      likePost(localPost.id, sessionId);
      setLocalPost((p) => ({
        ...p,
        likes: liked ? p.likes - 1 : p.likes + 1,
        savedBy: liked ? p.savedBy.filter((id) => id !== sessionId) : [...p.savedBy, sessionId],
      }));
    });
  }

  function handleRepost() {
    guard(() => {
      repostPost(localPost.id, sessionId);
      setLocalPost((p) => ({
        ...p,
        repostedBy: reposted
          ? (p.repostedBy ?? []).filter((id) => id !== sessionId)
          : [...(p.repostedBy ?? []), sessionId],
      }));
      onToast(reposted ? "Repost removed" : "Reposted to your followers");
    });
  }

  function handleBookmark() {
    guard(() => {
      bookmarkPost(localPost.id, sessionId);
      setLocalPost((p) => ({
        ...p,
        bookmarkedBy: bookmarked
          ? (p.bookmarkedBy ?? []).filter((id) => id !== sessionId)
          : [...(p.bookmarkedBy ?? []), sessionId],
      }));
      onToast(bookmarked ? "Removed from saved" : "Saved to your collection ✨");
    });
  }

  function handleShare() {
    sharePost(localPost.id);
    if (typeof navigator !== "undefined" && navigator.share) {
      navigator.share({ title: localPost.authorName, text: localPost.caption }).catch(() => null);
    } else if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href).catch(() => null);
      onToast("Link copied");
    }
  }

  function handleComment() {
    guard(() => {
      if (!commentText.trim()) return;
      const comment: SocialComment = {
        id: `cmt_${Date.now()}`,
        authorId: sessionId,
        authorName: sessionName,
        authorAvatar: sessionPhoto,
        text: commentText.trim(),
        createdAt: new Date().toISOString(),
      };
      addComment(localPost.id, comment);
      setLocalPost((p) => ({ ...p, comments: [...p.comments, comment] }));
      setCommentText("");
    });
  }

  function handleFollow() {
    guard(() => {
      onFollowToggle(localPost.authorId);
      onToast(isFollowing ? `Unfollowed ${localPost.authorName}` : `Following ${localPost.authorName} ✓`);
      setMenuOpen(false);
    });
  }

  function handleArchive() {
    archivePost(localPost.id, sessionId);
    onArchived(localPost.id);
    setMenuOpen(false);
    onToast(localPost.archived ? "Post restored to feed" : "Post archived — only you can see it");
  }

  function handleDelete() {
    deletePost(localPost.id, sessionId);
    onDeleted(localPost.id);
    setMenuOpen(false);
    setConfirmDelete(false);
  }

  const caption = localPost.caption;
  const SHORT = 120;
  const captionShort = caption.length > SHORT && !captionExpanded ? caption.slice(0, SHORT) : caption;

  return (
    <>
      <article className="overflow-hidden rounded-[20px] bg-white shadow-[0_1px_8px_rgba(13,27,42,0.08)]">
        {/* Author row */}
        <div className="flex items-center gap-2.5 px-4 py-3">
          <Avatar src={localPost.authorAvatar} name={localPost.authorName} role={localPost.authorRole} size={40} ring />
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <span className="truncate text-sm font-bold text-[var(--ms-navy)]">{localPost.authorName}</span>
              <span className={cn("shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.06em]", roleColors(localPost.authorRole))}>
                {roleLabel(localPost.authorRole)}
              </span>
              {localPost.verified && <BadgeCheck className="h-3.5 w-3.5 shrink-0 text-[#1A7A6B]" />}
              {localPost.archived && <span className="shrink-0 rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-700">Archived</span>}
            </div>
            <p className="text-[11px] text-[var(--ms-mauve)]">
              {localPost.location ? `${localPost.location} · ` : ""}
              {timeAgo(localPost.createdAt)}
            </p>
          </div>

          {/* Follow / Unfollow pill (only on others' posts) */}
          {!isOwner && (
            <button
              type="button"
              onClick={handleFollow}
              className={cn(
                "shrink-0 rounded-full px-3 py-1 text-xs font-bold border transition",
                isFollowing
                  ? "border-[var(--ms-plum)] text-[var(--ms-plum)] bg-[var(--ms-petal)]"
                  : "border-[var(--ms-border)] text-[var(--ms-mauve)] hover:border-[var(--ms-plum)] hover:text-[var(--ms-plum)]",
              )}
            >
              {isFollowing ? "Following" : "Follow"}
            </button>
          )}

          {/* ··· menu */}
          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            className="shrink-0 rounded-full p-1 text-[var(--ms-mauve)] hover:bg-[var(--ms-soft-bg)]"
          >
            <MoreHorizontal className="h-4 w-4" />
          </button>
        </div>

        {/* Media */}
        {localPost.images.length > 0 && (
          <div className="relative aspect-[4/5] overflow-hidden bg-[var(--ms-soft-bg)]">
            <img
              src={localPost.images[imgIdx]}
              alt={localPost.caption}
              className="h-full w-full object-cover"
              loading="lazy"
            />
            {/* Type badge */}
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
            {/* Carousel */}
            {localPost.images.length > 1 && (
              <>
                {imgIdx > 0 && (
                  <button
                    type="button"
                    onClick={() => setImgIdx((i) => i - 1)}
                    className="absolute left-2 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                )}
                {imgIdx < localPost.images.length - 1 && (
                  <button
                    type="button"
                    onClick={() => setImgIdx((i) => i + 1)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                )}
                <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5">
                  {localPost.images.map((_, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setImgIdx(i)}
                      className={cn("h-1.5 rounded-full transition-all", i === imgIdx ? "w-5 bg-white" : "w-1.5 bg-white/50")}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {/* Action bar */}
        <div className="flex items-center px-3 pt-3">
          <button
            type="button"
            onClick={handleLike}
            className="flex items-center gap-1.5 rounded-full p-2 transition hover:bg-[var(--ms-soft-bg)]"
          >
            <Heart className={cn("h-[22px] w-[22px] transition-all", liked ? "fill-[#C8284A] text-[#C8284A] scale-110" : "text-[var(--ms-navy)]")} />
            <span className={cn("text-[13px] font-semibold", liked ? "text-[#C8284A]" : "text-[var(--ms-navy)]")}>
              {fmtCount(localPost.likes)}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setCommentsOpen((o) => !o)}
            className="flex items-center gap-1.5 rounded-full p-2 transition hover:bg-[var(--ms-soft-bg)]"
          >
            <MessageCircle className="h-[22px] w-[22px] text-[var(--ms-navy)]" />
            {localPost.comments.length > 0 && (
              <span className="text-[13px] font-semibold text-[var(--ms-navy)]">{fmtCount(localPost.comments.length)}</span>
            )}
          </button>

          <button
            type="button"
            onClick={handleRepost}
            className="flex items-center gap-1.5 rounded-full p-2 transition hover:bg-[var(--ms-soft-bg)]"
          >
            <Repeat2 className={cn("h-[22px] w-[22px] transition-all", reposted ? "text-emerald-500" : "text-[var(--ms-navy)]")} />
            {(localPost.repostedBy?.length ?? 0) > 0 && (
              <span className={cn("text-[13px] font-semibold", reposted ? "text-emerald-500" : "text-[var(--ms-navy)]")}>
                {fmtCount(localPost.repostedBy!.length)}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={handleShare}
            className="flex items-center gap-1.5 rounded-full p-2 transition hover:bg-[var(--ms-soft-bg)]"
          >
            <Send className="h-[22px] w-[22px] text-[var(--ms-navy)]" />
          </button>

          <span className="flex-1" />

          <button
            type="button"
            onClick={handleBookmark}
            className="flex items-center gap-1.5 rounded-full p-2 transition hover:bg-[var(--ms-soft-bg)]"
          >
            <Bookmark className={cn("h-[22px] w-[22px] transition-all", bookmarked ? "fill-[var(--ms-plum)] text-[var(--ms-plum)]" : "text-[var(--ms-navy)]")} />
          </button>
        </div>

        {/* Caption */}
        <div className="px-4 pb-2 pt-1">
          <p className="text-[13px] leading-5 text-[var(--ms-charcoal)]">
            <span className="font-bold text-[var(--ms-navy)]">{localPost.authorName}</span>{" "}
            {captionShort}
            {caption.length > SHORT && !captionExpanded && (
              <button type="button" onClick={() => setCaptionExpanded(true)} className="ml-1 font-semibold text-[var(--ms-mauve)]">
                more
              </button>
            )}
          </p>
          {localPost.tags.length > 0 && (
            <p className="mt-1 flex flex-wrap gap-x-2 gap-y-0.5">
              {localPost.tags.map((tag) => (
                <span key={tag} className="text-[12px] font-medium text-[#8B5CF6]">{tag}</span>
              ))}
            </p>
          )}
        </div>

        {/* Comments */}
        {localPost.comments.length > 0 && (
          <div className="px-4 pb-2">
            {!commentsOpen ? (
              <button type="button" onClick={() => setCommentsOpen(true)} className="text-[12px] font-semibold text-[var(--ms-mauve)] hover:text-[var(--ms-navy)]">
                View all {localPost.comments.length} comment{localPost.comments.length !== 1 ? "s" : ""}
              </button>
            ) : (
              <div className="space-y-2">
                {localPost.comments.map((c) => (
                  <p key={c.id} className="text-[12px] leading-5 text-[var(--ms-charcoal)]">
                    <span className="font-bold text-[var(--ms-navy)]">{c.authorName}</span>{" "}{c.text}
                  </p>
                ))}
                <button type="button" onClick={() => setCommentsOpen(false)} className="text-[11px] font-semibold text-[var(--ms-mauve)]">
                  Collapse
                </button>
              </div>
            )}
          </div>
        )}

        {/* Comment input */}
        <div className="flex items-center gap-2 border-t border-[var(--ms-border)]/60 px-3 py-2.5">
          {sessionRole !== "guest" ? (
            <Avatar src={sessionPhoto} name={sessionName} role={sessionRole === "client" ? "client" : sessionRole === "professional" ? "professional" : "salon"} size={28} />
          ) : (
            <div className="h-7 w-7 shrink-0 rounded-full bg-[var(--ms-soft-bg)]" />
          )}
          <input
            type="text"
            placeholder="Add a comment…"
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") handleComment(); }}
            onClick={() => isGuest && onToast("Join free to comment")}
            readOnly={isGuest}
            className="flex-1 bg-transparent text-[13px] text-[var(--ms-charcoal)] placeholder:text-[var(--ms-border)] outline-none"
          />
          {commentText.trim() && (
            <button type="button" onClick={handleComment} className="text-[13px] font-bold text-[var(--ms-rose)]">
              Post
            </button>
          )}
        </div>
      </article>

      {/* Menus */}
      {menuOpen && (
        <PostMenu
          isOwner={isOwner}
          isFollowing={isFollowing}
          isArchived={localPost.archived}
          onFollow={handleFollow}
          onArchive={handleArchive}
          onDelete={() => { setMenuOpen(false); setConfirmDelete(true); }}
          onClose={() => setMenuOpen(false)}
        />
      )}
      {confirmDelete && (
        <DeleteConfirm onConfirm={handleDelete} onCancel={() => setConfirmDelete(false)} />
      )}
    </>
  );
}

// ─── Desktop sidebar ──────────────────────────────────────────────────────────

function TrendingSidebar({
  followedAuthors,
  onFollowToggle,
  onToast,
}: {
  followedAuthors: Set<string>;
  onFollowToggle: (id: string) => void;
  onToast: (msg: string) => void;
}) {
  return (
    <aside className="hidden w-72 shrink-0 xl:block">
      <div className="sticky top-24 space-y-4">
        <div className="rounded-[20px] bg-white p-5 shadow-[0_1px_8px_rgba(13,27,42,0.08)]">
          <div className="mb-3 flex items-center gap-2">
            <Flame className="h-4 w-4 text-[var(--ms-rose)]" />
            <p className="text-sm font-bold text-[var(--ms-navy)]">Trending</p>
          </div>
          <div className="space-y-3">
            {TRENDING_TAGS.map((t, i) => (
              <button key={t.tag} type="button" onClick={() => onToast("Showing " + t.tag)} className="flex w-full items-center gap-3 group">
                <span className="w-4 text-right text-[11px] font-bold text-[var(--ms-mauve)]">{i + 1}</span>
                <div className="text-left">
                  <p className="text-[13px] font-bold text-[var(--ms-navy)] group-hover:text-[var(--ms-plum)]">{t.tag}</p>
                  <p className="text-[11px] text-[var(--ms-mauve)]">{t.posts}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-[20px] bg-white p-5 shadow-[0_1px_8px_rgba(13,27,42,0.08)]">
          <p className="mb-3 text-sm font-bold text-[var(--ms-navy)]">Suggested for you</p>
          <div className="space-y-3">
            {SUGGESTED.map((s) => {
              const following = followedAuthors.has(s.id);
              return (
                <div key={s.name} className="flex items-center gap-3">
                  <div className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white bg-gradient-to-br", avatarGradient(s.role))}>
                    {s.name[0]}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[13px] font-bold text-[var(--ms-navy)]">{s.name}</p>
                    <p className="truncate text-[11px] text-[var(--ms-mauve)]">{s.sub}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => { onFollowToggle(s.id); onToast(following ? `Unfollowed ${s.name}` : `Following ${s.name} ✓`); }}
                    className={cn(
                      "shrink-0 rounded-full border px-3 py-1 text-[12px] font-bold transition",
                      following ? "border-[var(--ms-plum)] bg-[var(--ms-petal)] text-[var(--ms-plum)]" : "border-[var(--ms-border)] text-[var(--ms-plum)] hover:bg-[var(--ms-petal)]",
                    )}
                  >
                    {following ? "Following" : "Follow"}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        <p className="px-1 text-[11px] text-[var(--ms-mauve)] leading-5">
          Mobile Salon · Beauty, softly handled · For women, by women · Kenya 🇰🇪
        </p>
      </div>
    </aside>
  );
}

// ─── Compose sheet ────────────────────────────────────────────────────────────

function ComposeSheet({
  sessionId,
  sessionRole,
  sessionName,
  sessionPhoto,
  onClose,
  onPublished,
}: {
  sessionId: string;
  sessionRole: AppUserSession["role"];
  sessionName: string;
  sessionPhoto: string | undefined;
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

  const authorRole: SocialPost["authorRole"] =
    sessionRole === "professional" ? "professional" : sessionRole === "salon" ? "salon" : "client";

  function publish() {
    if (!caption.trim() && images.length === 0) return;
    const post: SocialPost = {
      id: `post_${Date.now()}`,
      authorId: sessionId,
      authorName: sessionName,
      authorAvatar: sessionPhoto,
      authorRole,
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
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm sm:items-center" onClick={onClose}>
      <div className="w-full max-w-lg overflow-hidden rounded-t-[32px] bg-white shadow-[0_-20px_60px_rgba(13,27,42,0.22)] sm:rounded-[32px]" onClick={(e) => e.stopPropagation()}>
        <div className="mx-auto mt-3 h-1 w-10 rounded-full bg-[var(--ms-border)]" />
        <div className="p-5">
          <div className="mb-4 flex items-center gap-3">
            <Avatar src={sessionPhoto} name={sessionName} role={authorRole} size={40} />
            <div>
              <p className="text-sm font-bold text-[var(--ms-navy)]">{sessionName}</p>
              <p className="text-xs text-[var(--ms-mauve)]">Sharing to everyone</p>
            </div>
            <button type="button" onClick={onClose} className="ml-auto rounded-full bg-[var(--ms-soft-bg)] p-2 text-[var(--ms-mauve)]">
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="mb-3 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none]">
            {POST_TYPES.map((t) => (
              <button
                key={t.key}
                type="button"
                onClick={() => setTag(t.key)}
                className={cn("shrink-0 rounded-full px-3 py-1.5 text-xs font-bold transition", tag === t.key ? "bg-[var(--ms-plum)] text-white" : "bg-[var(--ms-soft-bg)] text-[var(--ms-mauve)]")}
              >
                {t.label}
              </button>
            ))}
          </div>

          <ImageUploadEditor onSave={(url) => setImages((prev) => [...prev, url])} aspectHint="1/1" className="mb-3" />

          {images.length > 0 && (
            <div className="mb-3 flex gap-2 overflow-x-auto pb-1">
              {images.map((img, i) => (
                <div key={i} className="relative h-16 w-16 shrink-0 overflow-hidden rounded-[12px]">
                  <img src={img} alt="" className="h-full w-full object-cover" />
                  <button type="button" onClick={() => setImages((prev) => prev.filter((_, j) => j !== i))} className="absolute right-0.5 top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-black/60 text-white">
                    <X className="h-2.5 w-2.5" />
                  </button>
                </div>
              ))}
            </div>
          )}

          <textarea
            className="mb-1 w-full resize-none rounded-[16px] border border-[var(--ms-border)] bg-[var(--ms-soft-bg)] px-4 py-3 text-[13px] leading-6 text-[var(--ms-charcoal)] outline-none placeholder:text-[var(--ms-border)] focus:border-[var(--ms-plum)] transition"
            rows={3}
            placeholder="Share your beauty moment… add #hashtags to reach more women"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
          />

          <button
            type="button"
            onClick={publish}
            disabled={!caption.trim() && images.length === 0}
            className="mt-2 w-full rounded-full bg-[linear-gradient(135deg,var(--ms-rose),var(--ms-orchid))] py-3.5 text-sm font-bold text-white shadow-[0_8px_22px_rgba(212,83,126,0.3)] transition hover:brightness-110 disabled:opacity-50"
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
    <div className="fixed bottom-24 left-1/2 z-[60] -translate-x-1/2 rounded-full bg-[var(--ms-navy)] px-5 py-2.5 text-[13px] font-semibold text-white shadow-[0_8px_24px_rgba(13,27,42,0.28)]">
      {msg}
    </div>
  );
}

// ─── Main SocialHome ──────────────────────────────────────────────────────────

export function SocialHome() {
  const searchParams = useSearchParams();
  const initTab = (searchParams.get("tab") as FeedTab | null) ?? "foryou";

  const [session, setSession] = useState<AppUserSession | null>(null);
  const [realPosts, setRealPosts] = useState<SocialPost[]>([]);
  const [saves, setSaves] = useState<SocialSaves>({ professionals: [], salons: [] });
  const [followedAuthors, setFollowedAuthors] = useState<Set<string>>(new Set());
  const [activeTab, setActiveTab] = useState<FeedTab>(["foryou", "following"].includes(initTab) ? initTab : "foryou");
  const [activeCategory, setActiveCategory] = useState<CategoryKey>("all");
  const [showCompose, setShowCompose] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [deletedIds, setDeletedIds] = useState<Set<string>>(new Set());
  const [archivedIds, setArchivedIds] = useState<Set<string>>(new Set());
  const [refreshKey, setRefreshKey] = useState(0);

  const showToast = useCallback((msg: string) => setToast(msg), []);

  useEffect(() => {
    function sync() {
      const s = readAppSession();
      setSession(s);
      setRealPosts(readPosts());
      setSaves(readSaves());
      setFollowedAuthors(new Set(readFollowedAuthors()));
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

  function handleFollowToggle(authorId: string) {
    const nowFollowing = toggleFollowAuthor(authorId);
    setFollowedAuthors((prev) => {
      const next = new Set(prev);
      if (nowFollowing) next.add(authorId);
      else next.delete(authorId);
      return next;
    });
  }

  if (!session) return null;

  const isGuest = session.role === "guest";
  const sessionId = session.id;
  const sessionRole = session.role;
  const sessionName = getSessionName(session);
  const sessionPhoto = getSessionPhoto(session);
  const canPost = !isGuest;

  // Merge real + seed posts, deduplicate
  const realIds = new Set(realPosts.map((p) => p.id));
  const allPosts = [
    ...realPosts.filter((p) => !deletedIds.has(p.id) && !archivedIds.has(p.id)),
    ...SEED_POSTS.filter((sp) => !realIds.has(sp.id)),
  ];

  // Following tab: seed author IDs + profile saves
  const followedIds = new Set([
    ...followedAuthors,
    ...saves.professionals,
    ...saves.salons,
  ]);

  const feedPosts =
    activeTab === "following"
      ? allPosts.filter((p) => followedIds.has(p.authorId) || p.authorId === sessionId)
      : allPosts;

  const filteredPosts =
    activeCategory === "all"
      ? feedPosts
      : feedPosts.filter((p) => p.type === activeCategory);

  return (
    <>
      <div className="mx-auto flex max-w-[960px] items-start gap-6 px-4 pb-28 pt-3 lg:px-6">
        {/* ── Feed column ───────────────────────────────────────────── */}
        <div className="min-w-0 flex-1">
          {/* Pulse bar */}
          <div className="-mx-4 lg:-mx-6">
            <PulseBar
              activeFilter={activeCategory}
              onFilter={setActiveCategory}
              onCompose={() => canPost ? setShowCompose(true) : showToast("Create a free account to post")}
              canPost={canPost}
            />
          </div>

          {/* Guest banner */}
          {isGuest && (
            <div className="mb-3 flex items-center gap-3 rounded-[18px] bg-[var(--ms-petal)] px-4 py-3.5">
              <div className="flex-1">
                <p className="text-[13px] font-bold text-[var(--ms-plum)]">Browsing as a guest</p>
                <p className="text-[11px] text-[var(--ms-mauve)]">Create a free account to like, post, follow, save, and book.</p>
                <Link href="/signup/client" className="mt-1.5 inline-flex items-center gap-1 rounded-full bg-[var(--ms-plum)] px-4 py-1.5 text-[12px] font-bold text-white">
                  Join free
                </Link>
              </div>
            </div>
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
                  activeTab === t ? "bg-[var(--ms-navy)] text-white" : "text-[var(--ms-mauve)] hover:text-[var(--ms-navy)]",
                )}
              >
                {t === "foryou" ? <><Sparkles className="h-4 w-4" /> For You</> : <><Users className="h-4 w-4" /> Following</>}
              </button>
            ))}
          </div>

          {/* Category chips */}
          <div className="-mx-4 lg:-mx-6">
            <CategoryChips active={activeCategory} onChange={setActiveCategory} />
          </div>

          {/* Empty state */}
          {filteredPosts.length === 0 && (
            <div className="rounded-[20px] bg-white py-14 text-center shadow-[0_1px_8px_rgba(13,27,42,0.08)]">
              <Users className="mx-auto h-10 w-10 text-[var(--ms-mauve)] opacity-30" />
              <p className="mt-3 text-[14px] font-bold text-[var(--ms-navy)]">
                {activeTab === "following" ? "Nothing here yet" : "No posts in this category"}
              </p>
              <p className="mt-1 text-[12px] text-[var(--ms-mauve)]">
                {activeTab === "following" ? "Follow creators to build your feed." : "Be the first to post here!"}
              </p>
              <button type="button" onClick={() => setActiveTab("foryou")} className="mt-4 rounded-full bg-[var(--ms-petal)] px-5 py-2 text-[13px] font-bold text-[var(--ms-plum)]">
                Explore everyone
              </button>
            </div>
          )}

          {/* Posts */}
          <div className="space-y-4">
            {filteredPosts.map((post) => (
              <PostCard
                key={`${post.id}_${refreshKey}`}
                post={post}
                sessionId={sessionId}
                sessionRole={sessionRole}
                sessionPhoto={sessionPhoto}
                sessionName={sessionName}
                onToast={showToast}
                followedAuthors={followedAuthors}
                onFollowToggle={handleFollowToggle}
                onDeleted={(id) => {
                  setDeletedIds((prev) => new Set([...prev, id]));
                  showToast("Post deleted");
                }}
                onArchived={(id) => {
                  setArchivedIds((prev) => new Set([...prev, id]));
                  setRefreshKey((k) => k + 1);
                }}
              />
            ))}
          </div>
        </div>

        {/* ── Desktop sidebar ───────────────────────────────────────── */}
        <TrendingSidebar followedAuthors={followedAuthors} onFollowToggle={handleFollowToggle} onToast={showToast} />
      </div>

      {/* FAB */}
      <button
        type="button"
        onClick={() => canPost ? setShowCompose(true) : showToast("Create a free account to post")}
        className="fixed bottom-24 right-4 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[linear-gradient(135deg,var(--ms-rose),var(--ms-orchid))] text-white shadow-[0_8px_28px_rgba(212,83,126,0.4)] transition hover:scale-105 hover:brightness-110 lg:bottom-8 lg:right-8"
        aria-label="Create post"
      >
        <Plus className="h-6 w-6" strokeWidth={2.5} />
      </button>

      {/* Compose sheet */}
      {showCompose && canPost && (
        <ComposeSheet
          sessionId={sessionId}
          sessionRole={sessionRole}
          sessionName={sessionName}
          sessionPhoto={sessionPhoto}
          onClose={() => setShowCompose(false)}
          onPublished={() => setRefreshKey((k) => k + 1)}
        />
      )}

      {/* Toast */}
      {toast && <Toast msg={toast} onDone={() => setToast(null)} />}
    </>
  );
}
