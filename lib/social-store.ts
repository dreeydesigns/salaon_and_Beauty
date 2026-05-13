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
    const parsed = JSON.parse(localStorage.getItem(SAVES_KEY) ?? "{}") as Partial<SocialSaves>;

    return {
      professionals: Array.isArray(parsed.professionals) ? parsed.professionals : [],
      salons: Array.isArray(parsed.salons) ? parsed.salons : [],
    };
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
  verified?: boolean;
  location?: string;
  type: PostType;
  images: string[];          // data-URLs or https URLs
  caption: string;
  tags: string[];
  likes: number;
  savedBy: string[];         // session ids who liked/hearted
  bookmarkedBy?: string[];   // session ids who bookmarked
  repostedBy?: string[];     // session ids who reposted
  shareCount?: number;
  comments: SocialComment[];
  createdAt: string;
  archived?: boolean;        // owner-archived — hidden from public feed
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

export function repostPost(postId: string, userId: string) {
  const posts = readPosts();
  const updated = posts.map((p) => {
    if (p.id !== postId) return p;
    const repostedBy = p.repostedBy ?? [];
    const alreadyReposted = repostedBy.includes(userId);
    return {
      ...p,
      repostedBy: alreadyReposted ? repostedBy.filter((id) => id !== userId) : [...repostedBy, userId],
    };
  });
  localStorage.setItem(POSTS_KEY, JSON.stringify(updated));
  dispatch();
}

export function bookmarkPost(postId: string, userId: string) {
  const posts = readPosts();
  const updated = posts.map((p) => {
    if (p.id !== postId) return p;
    const bookmarkedBy = p.bookmarkedBy ?? [];
    const already = bookmarkedBy.includes(userId);
    return {
      ...p,
      bookmarkedBy: already
        ? bookmarkedBy.filter((id) => id !== userId)
        : [...bookmarkedBy, userId],
    };
  });
  localStorage.setItem(POSTS_KEY, JSON.stringify(updated));
  dispatch();
}

export function sharePost(postId: string) {
  const posts = readPosts();
  const updated = posts.map((p) =>
    p.id === postId ? { ...p, shareCount: (p.shareCount ?? 0) + 1 } : p,
  );
  localStorage.setItem(POSTS_KEY, JSON.stringify(updated));
  dispatch();
}

export function deletePost(postId: string, ownerId: string) {
  const posts = readPosts();
  const updated = posts.filter((p) => !(p.id === postId && p.authorId === ownerId));
  localStorage.setItem(POSTS_KEY, JSON.stringify(updated));
  dispatch();
}

export function archivePost(postId: string, ownerId: string) {
  const posts = readPosts();
  const updated = posts.map((p) => {
    if (p.id !== postId || p.authorId !== ownerId) return p;
    return { ...p, archived: !p.archived };
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
  clientPhone?: string;
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

// ─── Followed authors (in-feed follow, separate from profile saves) ──────────

const FOLLOWED_AUTHORS_KEY = "ms_followed_authors";

export function readFollowedAuthors(): string[] {
  if (!canUse()) return [];
  try {
    return JSON.parse(localStorage.getItem(FOLLOWED_AUTHORS_KEY) ?? "[]") as string[];
  } catch {
    return [];
  }
}

export function toggleFollowAuthor(authorId: string): boolean {
  const list = readFollowedAuthors();
  const alreadyFollowing = list.includes(authorId);
  const next = alreadyFollowing ? list.filter((id) => id !== authorId) : [...list, authorId];
  localStorage.setItem(FOLLOWED_AUTHORS_KEY, JSON.stringify(next));
  dispatch();
  return !alreadyFollowing; // returns new following state
}

// ─── Seed posts ────────────────────────────────────────────────────────────

export const SEED_POSTS: SocialPost[] = [
  {
    id: "seed_001",
    authorId: "pro_amara",
    authorName: "Amara Styles",
    authorRole: "professional",
    verified: true,
    location: "Westlands, Nairobi",
    type: "portfolio",
    images: [
      "https://images.pexels.com/photos/3993449/pexels-photo-3993449.jpeg?auto=compress&cs=tinysrgb&w=800&h=1000&fit=crop",
    ],
    caption: "Box braids done fresh ✨ 4 hours of love poured into every strand. Client wanted something protective and elegant for the season. She walked out glowing 🔥",
    tags: ["#boxbraids", "#protectivestyles", "#naturalhair", "#nairobihair"],
    likes: 284,
    savedBy: [],
    bookmarkedBy: [],
    repostedBy: [],
    comments: [
      { id: "sc1a", authorId: "u1", authorName: "Cynthia W.", text: "These are absolutely GORGEOUS 😍 the tension is perfect!", createdAt: "2026-05-13T07:40:00Z" },
      { id: "sc1b", authorId: "u2", authorName: "Grace M.", text: "She's so talented! Need to book asap 🙏", createdAt: "2026-05-13T08:10:00Z" },
    ],
    createdAt: "2026-05-13T07:30:00Z",
  },
  {
    id: "seed_002",
    authorId: "salon_kinyozi",
    authorName: "Kinyozi House",
    authorRole: "salon",
    verified: true,
    location: "Karen, Nairobi",
    type: "portfolio",
    images: [
      "https://images.pexels.com/photos/3738359/pexels-photo-3738359.jpeg?auto=compress&cs=tinysrgb&w=800&h=1000&fit=crop",
    ],
    caption: "Natural hair is not a trend. It is your heritage. Come as you are — we'll take it from here 🌿 Book your natural hair reset at the link in bio.",
    tags: ["#naturalhair", "#haircare", "#karen", "#nairobisalon"],
    likes: 521,
    savedBy: [],
    bookmarkedBy: [],
    repostedBy: [],
    comments: [
      { id: "sc2a", authorId: "u3", authorName: "Amina K.", text: "This reminds me why I went natural. Beautiful 🌸", createdAt: "2026-05-12T15:00:00Z" },
      { id: "sc2b", authorId: "u4", authorName: "Wanjiru N.", text: "The definition on those curls!! 🤍", createdAt: "2026-05-12T16:30:00Z" },
    ],
    createdAt: "2026-05-12T14:00:00Z",
  },
  {
    id: "seed_003",
    authorId: "pro_zara",
    authorName: "Zara Omukhubi",
    authorRole: "professional",
    verified: true,
    location: "Kilimani, Nairobi",
    type: "tip",
    images: [
      "https://images.pexels.com/photos/2253842/pexels-photo-2253842.jpeg?auto=compress&cs=tinysrgb&w=800&h=1000&fit=crop",
    ],
    caption: "Bridal glam that lasts all day — the secret is primer, setting powder, and waterproof liner 💄 Swipe for the full tutorial breakdown! DM to book your bridal slot before October fills up.",
    tags: ["#bridalmakeup", "#makeupartist", "#nairobi", "#makeuptips"],
    likes: 892,
    savedBy: [],
    bookmarkedBy: [],
    repostedBy: [],
    comments: [
      { id: "sc3a", authorId: "u5", authorName: "Fatuma S.", text: "Saving this for my wedding in November!! 😭💍", createdAt: "2026-05-11T10:00:00Z" },
      { id: "sc3b", authorId: "u6", authorName: "Njeri W.", text: "The blending is immaculate. Teach us your ways 🙌", createdAt: "2026-05-11T11:00:00Z" },
    ],
    createdAt: "2026-05-11T09:00:00Z",
  },
  {
    id: "seed_004",
    authorId: "client_amina",
    authorName: "Amina W.",
    authorRole: "client",
    location: "Nairobi",
    type: "before_after",
    images: [
      "https://images.pexels.com/photos/3993398/pexels-photo-3993398.jpeg?auto=compress&cs=tinysrgb&w=800&h=1000&fit=crop",
      "https://images.pexels.com/photos/3993392/pexels-photo-3993392.jpeg?auto=compress&cs=tinysrgb&w=800&h=1000&fit=crop",
    ],
    caption: "6 months into my locs journey and I am never looking back 🔒✨ Swipe to see where I started. So grateful for my loctician @amarastyles — patience and skill.",
    tags: ["#locjourney", "#locsofnairobi", "#naturalhair", "#transformation"],
    likes: 1204,
    savedBy: [],
    bookmarkedBy: [],
    repostedBy: [],
    comments: [
      { id: "sc4a", authorId: "u7", authorName: "Keiko L.", text: "THE GROWTH 😭🙌 This is so inspiring!!", createdAt: "2026-05-10T08:00:00Z" },
      { id: "sc4b", authorId: "u8", authorName: "Sasha M.", text: "I'm 3 months in and this gives me SO much hope 💚", createdAt: "2026-05-10T09:00:00Z" },
    ],
    createdAt: "2026-05-10T07:00:00Z",
  },
  {
    id: "seed_005",
    authorId: "salon_lux",
    authorName: "Lux Beauty Bar",
    authorRole: "salon",
    verified: true,
    location: "Lavington, Nairobi",
    type: "portfolio",
    images: [
      "https://images.pexels.com/photos/704815/pexels-photo-704815.jpeg?auto=compress&cs=tinysrgb&w=800&h=1000&fit=crop",
    ],
    caption: "Custom nail art that tells your story 💅 This set was designed for a client's anniversary dinner — we called it 'Quiet Luxury'. Every detail hand-painted.",
    tags: ["#nailart", "#nailsofnairobi", "#gelmanicure", "#luxurybeauty"],
    likes: 637,
    savedBy: [],
    bookmarkedBy: [],
    repostedBy: [],
    comments: [
      { id: "sc5a", authorId: "u9", authorName: "Grace A.", text: "Quiet luxury is EXACTLY what this is 😮‍💨🤌", createdAt: "2026-05-09T13:00:00Z" },
    ],
    createdAt: "2026-05-09T12:00:00Z",
  },
  {
    id: "seed_006",
    authorId: "pro_cynthia",
    authorName: "Cynthia Waweru",
    authorRole: "professional",
    verified: true,
    location: "South B, Nairobi",
    type: "tip",
    images: [
      "https://images.pexels.com/photos/3997990/pexels-photo-3997990.jpeg?auto=compress&cs=tinysrgb&w=800&h=1000&fit=crop",
    ],
    caption: "Skincare before makeup is not optional 🌿 A hydrated canvas = a flawless finish. My top 3 preps: double cleanse, Vitamin C serum, SPF 50. Save this for your morning routine!",
    tags: ["#skincareroutine", "#skincareafrica", "#glowup", "#beautyadvice"],
    likes: 743,
    savedBy: [],
    bookmarkedBy: [],
    repostedBy: [],
    comments: [
      { id: "sc6a", authorId: "u10", authorName: "Lila T.", text: "The vitamin C tip changed my skin 🙌 thank you!", createdAt: "2026-05-08T10:00:00Z" },
      { id: "sc6b", authorId: "u11", authorName: "Nour F.", text: "Double cleanse is underrated. Preach 👏", createdAt: "2026-05-08T11:00:00Z" },
    ],
    createdAt: "2026-05-08T09:00:00Z",
  },
  {
    id: "seed_007",
    authorId: "salon_westlands",
    authorName: "Westlands Beauty Studio",
    authorRole: "salon",
    verified: true,
    location: "Westlands, Nairobi",
    type: "inspo",
    images: [
      "https://images.pexels.com/photos/3912572/pexels-photo-3912572.jpeg?auto=compress&cs=tinysrgb&w=800&h=1000&fit=crop",
    ],
    caption: "Glow season is every season 🌟 Our signature facial treatment leaves your skin speaking for itself. 90 minutes. Zero makeup needed after. Book via the app 👇",
    tags: ["#facial", "#skingoals", "#selfcare", "#westlandsnairobi"],
    likes: 418,
    savedBy: [],
    bookmarkedBy: [],
    repostedBy: [],
    comments: [
      { id: "sc7a", authorId: "u12", authorName: "Aisha B.", text: "I had this done last month and WOW the results 😩🌸", createdAt: "2026-05-07T14:00:00Z" },
    ],
    createdAt: "2026-05-07T13:00:00Z",
  },
  {
    id: "seed_008",
    authorId: "pro_mariam",
    authorName: "Mariam Hassan",
    authorRole: "professional",
    location: "Kilimani, Nairobi",
    type: "inspo",
    images: [
      "https://images.pexels.com/photos/1029896/pexels-photo-1029896.jpeg?auto=compress&cs=tinysrgb&w=800&h=1000&fit=crop",
    ],
    caption: "The boldest thing you can do is show up as yourself. This look was for a client who said she wanted people to remember her when she left the room 💜 Mission accomplished.",
    tags: ["#boldlook", "#makeupinspo", "#beautyis", "#nairobi"],
    likes: 1089,
    savedBy: [],
    bookmarkedBy: [],
    repostedBy: [],
    comments: [
      { id: "sc8a", authorId: "u13", authorName: "Wanjiku R.", text: "The colour story here 💜🖤 stunning", createdAt: "2026-05-06T15:00:00Z" },
      { id: "sc8b", authorId: "u14", authorName: "Chebet A.", text: "She definitely left an impression! Wow 🔥", createdAt: "2026-05-06T16:00:00Z" },
    ],
    createdAt: "2026-05-06T14:00:00Z",
  },
];

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
