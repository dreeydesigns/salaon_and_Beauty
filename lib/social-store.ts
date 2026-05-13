/**
 * Mobile Salon — Social Store
 *
 * localStorage-based real-time social layer. All accounts (client, pro, salon)
 * read and write to shared keys so interactions reflect instantly on both sides.
 *
 * Keys:
 *   ms_social_saves   — which pros/salons a client has saved (followed)
 *   ms_social_posts   — community feed posts (photos + captions)
 *   ms_bookings       — booking requests from clients to pros/salons
 *   ms_messages       — DM threads between accounts
 *
 * Sync: each write dispatches "ms-social-change" so all listeners update
 * within the same tab, plus a 1.5 s poll catches cross-tab changes.
 */

export const SOCIAL_CHANGE_EVENT = "ms-social-change";

// ─── Saves / Follows ─────────────────────────────────────────────────────────

const SAVES_KEY = "ms_social_saves";

export interface SocialSaves {
  professionals: string[]; // slugs
  salons: string[];        // slugs
}

function canUse() {
  return typeof window !== "undefined";
}

function dispatch() {
  if (canUse()) window.dispatchEvent(new Event(SOCIAL_CHANGE_EVENT));
}

export function readSaves(): SocialSaves {
  if (!canUse()) return { professionals: [], salons: [] };
  try {
    return JSON.parse(localStorage.getItem(SAVES_KEY) ?? "{}") as SocialSaves;
  } catch {
    return { professionals: [], salons: [] };
  }
}

export function isSaved(type: "professionals" | "salons", slug: string): boolean {
  const saves = readSaves();
  return (saves[type] ?? []).includes(slug);
}

export function toggleSave(type: "professionals" | "salons", slug: string) {
  const saves = readSaves();
  const list = saves[type] ?? [];
  const next = list.includes(slug) ? list.filter((s) => s !== slug) : [...list, slug];
  const updated: SocialSaves = { ...saves, [type]: next };
  localStorage.setItem(SAVES_KEY, JSON.stringify(updated));
  dispatch();
  return next.includes(slug); // returns new saved state
}

/** Count how many clients have saved a given slug (demo: reads from own saves) */
export function getSaveCount(type: "professionals" | "salons", slug: string): number {
  const saves = readSaves();
  return (saves[type] ?? []).includes(slug) ? 1 : 0;
}

// ─── Feed Posts ───────────────────────────────────────────────────────────────

const POSTS_KEY = "ms_social_posts";

export type PostType = "before_after" | "inspo" | "tip" | "portfolio" | "promotion";

export interface SocialPost {
  id: string;
  authorId: string;          // session id
  authorName: string;        // display name
  authorAvatar?: string;
  authorRole: "client" | "professional" | "salon";
  type: PostType;
  images: string[];          // data-URLs
  caption: string;
  tags: string[];
  likes: number;
  savedBy: string[];         // session ids who saved/liked
  comments: SocialComment[];
  createdAt: string;
}

export interface SocialComment {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  text: string;
  createdAt: string;
}

export function readPosts(): SocialPost[] {
  if (!canUse()) return [];
  try {
    return JSON.parse(localStorage.getItem(POSTS_KEY) ?? "[]") as SocialPost[];
  } catch {
    return [];
  }
}

export function writePost(post: SocialPost) {
  const posts = readPosts();
  localStorage.setItem(POSTS_KEY, JSON.stringify([post, ...posts]));
  dispatch();
}

export function likePost(postId: string, userId: string) {
  const posts = readPosts();
  const updated = posts.map((p) => {
    if (p.id !== postId) return p;
    const alreadyLiked = p.savedBy.includes(userId);
    return {
      ...p,
      likes: alreadyLiked ? p.likes - 1 : p.likes + 1,
      savedBy: alreadyLiked ? p.savedBy.filter((id) => id !== userId) : [...p.savedBy, userId],
    };
  });
  localStorage.setItem(POSTS_KEY, JSON.stringify(updated));
  dispatch();
}

export function addComment(postId: string, comment: SocialComment) {
  const posts = readPosts();
  const updated = posts.map((p) =>
    p.id === postId ? { ...p, comments: [...p.comments, comment] } : p,
  );
  localStorage.setItem(POSTS_KEY, JSON.stringify(updated));
  dispatch();
}

// ─── Bookings ────────────────────────────────────────────────────────────────

const BOOKINGS_KEY = "ms_bookings";

export type BookingStatus = "pending" | "accepted" | "declined" | "completed" | "cancelled";

export interface BookingRequest {
  id: string;
  clientId: string;
  clientName: string;
  clientPhone: string;
  clientAvatar?: string;
  targetType: "professionals" | "salons";
  targetSlug: string;
  targetName: string;
  services: string[];        // service names
  preferredDate: string;     // ISO string
  preferredTime: string;
  location?: string;
  totalKES: number;
  notes?: string;
  status: BookingStatus;
  createdAt: string;
  updatedAt: string;
}

export function readBookings(): BookingRequest[] {
  if (!canUse()) return [];
  try {
    return JSON.parse(localStorage.getItem(BOOKINGS_KEY) ?? "[]") as BookingRequest[];
  } catch {
    return [];
  }
}

export function writeBooking(booking: BookingRequest) {
  const bookings = readBookings();
  const existing = bookings.findIndex((b) => b.id === booking.id);
  const updated =
    existing >= 0
      ? bookings.map((b, i) => (i === existing ? booking : b))
      : [booking, ...bookings];
  localStorage.setItem(BOOKINGS_KEY, JSON.stringify(updated));
  dispatch();
}

export function updateBookingStatus(id: string, status: BookingStatus) {
  const bookings = readBookings();
  const updated = bookings.map((b) =>
    b.id === id ? { ...b, status, updatedAt: new Date().toISOString() } : b,
  );
  localStorage.setItem(BOOKINGS_KEY, JSON.stringify(updated));
  dispatch();
}

/** Get pending bookings for a specific pro or salon slug */
export function getIncomingBookings(targetSlug: string): BookingRequest[] {
  return readBookings().filter(
    (b) => b.targetSlug === targetSlug && b.status === "pending",
  );
}

/** Get all bookings for a client by their id */
export function getClientBookings(clientId: string): BookingRequest[] {
  return readBookings().filter((b) => b.clientId === clientId);
}

// ─── Messages ────────────────────────────────────────────────────────────────

const MESSAGES_KEY = "ms_messages";

export interface Message {
  id: string;
  text: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  createdAt: string;
  read: boolean;
}

export interface MessageThread {
  id: string;
  participantIds: string[];
  participantNames: string[];
  participantAvatars: (string | undefined)[];
  messages: Message[];
  lastMessageAt: string;
}

export function readThreads(): MessageThread[] {
  if (!canUse()) return [];
  try {
    return JSON.parse(localStorage.getItem(MESSAGES_KEY) ?? "[]") as MessageThread[];
  } catch {
    return [];
  }
}

export function sendMessage(threadId: string, message: Message, participants?: Omit<MessageThread, "messages" | "lastMessageAt">) {
  const threads = readThreads();
  const existing = threads.find((t) => t.id === threadId);
  if (existing) {
    const updated = threads.map((t) =>
      t.id === threadId
        ? { ...t, messages: [...t.messages, message], lastMessageAt: message.createdAt }
        : t,
    );
    localStorage.setItem(MESSAGES_KEY, JSON.stringify(updated));
  } else if (participants) {
    const newThread: MessageThread = {
      ...participants,
      id: threadId,
      messages: [message],
      lastMessageAt: message.createdAt,
    };
    localStorage.setItem(MESSAGES_KEY, JSON.stringify([newThread, ...threads]));
  }
  dispatch();
}

export function getOrCreateThreadId(idA: string, idB: string): string {
  return [idA, idB].sort().join("_");
}

export function getUnreadCount(recipientId: string): number {
  const threads = readThreads();
  return threads.reduce(
    (sum, t) =>
      sum +
      t.messages.filter((m) => !m.read && m.senderId !== recipientId).length,
    0,
  );
}

export function markThreadRead(threadId: string, recipientId: string) {
  const threads = readThreads();
  const updated = threads.map((t) =>
    t.id !== threadId
      ? t
      : {
          ...t,
          messages: t.messages.map((m) =>
            m.senderId !== recipientId ? { ...m, read: true } : m,
          ),
        },
  );
  localStorage.setItem(MESSAGES_KEY, JSON.stringify(updated));
  dispatch();
}
