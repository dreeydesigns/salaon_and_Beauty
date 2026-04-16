export type RoleMode = "salons" | "professionals";
export type NavKey =
  | "home"
  | "explore"
  | "book"
  | "activity"
  | "profile"
  | "salons"
  | "professionals";

export type ServiceCategory =
  | "Hair"
  | "Care / Skin"
  | "Nails"
  | "Make-Up"
  | "Lashes / Brows"
  | "Men's Grooming"
  | "Bridal & Events";

export type ServiceMode = "In salon" | "Mobile" | "Both";

export interface Service {
  id: string;
  category: ServiceCategory;
  name: string;
  description: string;
  minPrice: number;
  maxPrice: number;
  durationMin: number;
  durationMax: number;
  inclusions: string;
  popular?: boolean;
}

export interface PackageOffer {
  id: string;
  name: string;
  description: string;
  price: number;
  serviceIds: string[];
  badge: string;
}

export interface ReviewSnapshot {
  id: string;
  name: string;
  title: string;
  rating: number;
  body: string;
  serviceLabel: string;
}

export interface PortfolioItem {
  id: string;
  title: string;
  note: string;
  tint: string;
}

export interface Salon {
  slug: string;
  name: string;
  tagline: string;
  location: string;
  areasServed: string[];
  rating: number;
  reviewCount: number;
  startingPrice: number;
  categoryTags: string[];
  verified: boolean;
  mobileService: boolean;
  about: string;
  description: string;
  heroMood: string;
  serviceIds: string[];
  topServiceIds: string[];
  packageOffers: PackageOffer[];
  gallery: PortfolioItem[];
  faq: { question: string; answer: string }[];
  professionals: string[];
  nextAvailable: string;
}

export interface Professional {
  slug: string;
  name: string;
  specialty: string;
  location: string;
  serviceMode: ServiceMode;
  salonAffiliation: string;
  areasServed: string[];
  rating: number;
  reviewCount: number;
  startingPrice: number;
  verified: boolean;
  bio: string;
  description: string;
  heroMood: string;
  serviceIds: string[];
  packageOffers: PackageOffer[];
  gallery: PortfolioItem[];
  faq: { question: string; answer: string }[];
  nextAvailable: string;
}

export const marketAreas = [
  "Westlands",
  "Kilimani",
  "Karen",
  "Lavington",
  "South B",
  "South C",
  "Parklands",
  "Ruaka",
  "Thika Road",
] as const;

export const serviceCategories = [
  {
    id: "braids",
    name: "Braids",
    detail: "Protective styles from knotless to fulani.",
    color: "from-[var(--ms-magenta)]/30 to-[var(--ms-gold)]/25",
  },
  {
    id: "natural-hair",
    name: "Natural Hair",
    detail: "Wash days, twists, silk press, and healthy care.",
    color: "from-[var(--ms-navy)]/80 to-[var(--ms-purple)]/30",
  },
  {
    id: "weaves",
    name: "Weaves",
    detail: "Closures, frontal installs, and maintenance.",
    color: "from-[var(--ms-mauve)]/40 to-[var(--ms-magenta)]/20",
  },
  {
    id: "nails",
    name: "Nails",
    detail: "Gel, acrylic, detailed nail art, and spa finishes.",
    color: "from-[var(--ms-blush)] to-[var(--ms-gold)]/30",
  },
  {
    id: "make-up",
    name: "Make-Up",
    detail: "Soft glam, bridal, editorial, and event-ready beats.",
    color: "from-[var(--ms-navy)]/80 to-[var(--ms-magenta)]/25",
  },
  {
    id: "lashes",
    name: "Lashes",
    detail: "Classic, hybrid, brow sculpting, and threading.",
    color: "from-[var(--ms-purple)]/30 to-[var(--ms-blush)]",
  },
  {
    id: "mens-grooming",
    name: "Men's Grooming",
    detail: "Precision fades, beard sculpting, and facials.",
    color: "from-[var(--ms-charcoal)]/90 to-[var(--ms-gold)]/25",
  },
  {
    id: "bridal",
    name: "Bridal",
    detail: "Trials, group bookings, and all-day glam support.",
    color: "from-[var(--ms-blush)] to-[var(--ms-magenta)]/15",
  },
];

export const services: Service[] = [
  {
    id: "knotless-braids",
    category: "Hair",
    name: "Knotless Braids",
    description: "Mid-back protective braids with clean sections and tension-light install.",
    minPrice: 3000,
    maxPrice: 6500,
    durationMin: 180,
    durationMax: 360,
    inclusions: "Consultation, sectioning, braid install, dip, and finishing mousse.",
    popular: true,
  },
  {
    id: "fulani-braids",
    category: "Hair",
    name: "Fulani Braids",
    description: "Beaded or clean centre-parted fulani styling with face-framing detail.",
    minPrice: 3500,
    maxPrice: 7000,
    durationMin: 210,
    durationMax: 360,
    inclusions: "Scalp prep, braid pattern mapping, accessories placement, and finish.",
  },
  {
    id: "loc-retwist",
    category: "Hair",
    name: "Loc Retwist",
    description: "Palm roll or interlock maintenance with scalp care.",
    minPrice: 2500,
    maxPrice: 5000,
    durationMin: 120,
    durationMax: 180,
    inclusions: "Wash, scalp cleanse, retwist, dry, and light styling.",
    popular: true,
  },
  {
    id: "silk-press",
    category: "Hair",
    name: "Silk Press",
    description: "Heat-protected straight finish for textured hair with bounce and movement.",
    minPrice: 2200,
    maxPrice: 4200,
    durationMin: 90,
    durationMax: 150,
    inclusions: "Shampoo, deep condition, blow dry, trim check, and silk finish.",
  },
  {
    id: "wig-install",
    category: "Hair",
    name: "Wig Install",
    description: "Natural-looking lace install with styling and secure hold.",
    minPrice: 3500,
    maxPrice: 7000,
    durationMin: 120,
    durationMax: 210,
    inclusions: "Braid down, lace prep, install, customization, and styling.",
  },
  {
    id: "facial-treatment",
    category: "Care / Skin",
    name: "Melanin Facial",
    description: "Barrier-safe facial designed for congestion, texture, and glow.",
    minPrice: 2000,
    maxPrice: 4500,
    durationMin: 60,
    durationMax: 90,
    inclusions: "Cleanse, steam, extraction if needed, mask, and aftercare guidance.",
    popular: true,
  },
  {
    id: "makeup-soft-glam",
    category: "Make-Up",
    name: "Soft Glam",
    description: "Event-ready complexion and eye work tailored for melanin-rich skin.",
    minPrice: 3500,
    maxPrice: 6000,
    durationMin: 75,
    durationMax: 120,
    inclusions: "Skin prep, complexion match, lashes, setting, and touch-up advice.",
    popular: true,
  },
  {
    id: "bridal-glam",
    category: "Bridal & Events",
    name: "Bridal Hair & Make-Up",
    description: "Trial-supported bridal glam with timeline planning for the full day.",
    minPrice: 12000,
    maxPrice: 28000,
    durationMin: 180,
    durationMax: 300,
    inclusions: "Consultation, trial planning, wedding day glam, and finishing support.",
    popular: true,
  },
  {
    id: "gel-manicure",
    category: "Nails",
    name: "Gel Manicure",
    description: "Short or medium nails with cuticle work and glossy gel finish.",
    minPrice: 1500,
    maxPrice: 2800,
    durationMin: 45,
    durationMax: 75,
    inclusions: "Shape, cuticle prep, gel application, and finishing oil.",
  },
  {
    id: "pedicure-spa",
    category: "Nails",
    name: "Spa Pedicure",
    description: "Foot soak, scrub, cuticle care, and long-wear polish option.",
    minPrice: 1800,
    maxPrice: 3200,
    durationMin: 50,
    durationMax: 75,
    inclusions: "Soak, exfoliation, massage, grooming, and polish.",
  },
  {
    id: "lash-classic",
    category: "Lashes / Brows",
    name: "Classic Lash Set",
    description: "Soft, lightweight lash enhancement with natural fullness.",
    minPrice: 2500,
    maxPrice: 4200,
    durationMin: 75,
    durationMax: 120,
    inclusions: "Consultation, lash map, application, and aftercare instructions.",
  },
  {
    id: "brow-threading",
    category: "Lashes / Brows",
    name: "Brow Threading",
    description: "Clean brow shape with balanced arch and sensitive-skin care.",
    minPrice: 600,
    maxPrice: 1000,
    durationMin: 20,
    durationMax: 30,
    inclusions: "Consultation, threading, trim if needed, and soothing gel.",
  },
  {
    id: "mens-fade",
    category: "Men's Grooming",
    name: "Precision Fade",
    description: "Detailed fade with line-up, texture clean-up, and style finish.",
    minPrice: 1200,
    maxPrice: 2200,
    durationMin: 35,
    durationMax: 60,
    inclusions: "Consultation, cut, line-up, and style finish.",
    popular: true,
  },
  {
    id: "beard-sculpt",
    category: "Men's Grooming",
    name: "Beard Sculpt",
    description: "Shape-up and grooming for neat, intentional beard lines.",
    minPrice: 900,
    maxPrice: 1600,
    durationMin: 25,
    durationMax: 40,
    inclusions: "Trim, line definition, hot towel, and finishing balm.",
  },
  {
    id: "wash-and-go",
    category: "Hair",
    name: "Wash and Go",
    description: "Hydrating cleanse and curl definition for 3C to 4C textures.",
    minPrice: 1800,
    maxPrice: 3200,
    durationMin: 60,
    durationMax: 90,
    inclusions: "Cleanse, detangle, deep condition, styling gel, and drying.",
  },
  {
    id: "relaxer-treatment",
    category: "Hair",
    name: "Relaxer Treatment",
    description: "Professional relaxer service with protein care and trim support.",
    minPrice: 2500,
    maxPrice: 4000,
    durationMin: 120,
    durationMax: 180,
    inclusions: "Application, rinse, neutralize, deep treatment, trim, and style.",
  },
  {
    id: "nail-art-upgrade",
    category: "Nails",
    name: "Nail Art Upgrade",
    description: "Detailed art add-on from chrome details to custom line work.",
    minPrice: 700,
    maxPrice: 1800,
    durationMin: 20,
    durationMax: 45,
    inclusions: "Art consultation, detailed design, top coat, and finish.",
  },
];

export const salons: Salon[] = [
  {
    slug: "kilimani-texture-house",
    name: "Kilimani Texture House",
    tagline: "Healthy textured hair care, braid installs, and premium wash days.",
    location: "Kilimani, Nairobi",
    areasServed: ["Kilimani", "Hurlingham", "Lavington", "Upper Hill"],
    rating: 4.9,
    reviewCount: 248,
    startingPrice: 1800,
    categoryTags: ["Natural Hair", "Braids", "Locs", "Bridal"],
    verified: true,
    mobileService: true,
    about:
      "A Nairobi salon built around healthy African hair routines, protective styling, and calm appointment pacing.",
    description:
      "Clients come here for braid installs that respect the hairline, wash days that feel restorative, and bridal prep that is organised from trial to finish.",
    heroMood: "from-[var(--ms-navy)] via-[#15253a] to-[var(--ms-magenta)]/40",
    serviceIds: [
      "knotless-braids",
      "fulani-braids",
      "wash-and-go",
      "silk-press",
      "loc-retwist",
      "bridal-glam",
    ],
    topServiceIds: ["knotless-braids", "wash-and-go", "bridal-glam"],
    packageOffers: [
      {
        id: "kilimani-wash-reset",
        name: "Texture Reset",
        description: "Wash, steam, trim check, and curl-setting finish for busy Nairobi weeks.",
        price: 4200,
        serviceIds: ["wash-and-go"],
        badge: "Popular package",
      },
      {
        id: "kilimani-bridal",
        name: "Civil Ceremony Edit",
        description: "Soft bridal hair and make-up for intimate ceremonies and city weddings.",
        price: 17500,
        serviceIds: ["bridal-glam"],
        badge: "Bridal favourite",
      },
    ],
    gallery: [
      { id: "g1", title: "Soft knotless finish", note: "Mid-back, light tension, side part.", tint: "from-[#251134] to-[#7b2cbf]" },
      { id: "g2", title: "Defined twist-out", note: "Healthy sheen and shape retention after wash day.", tint: "from-[#0d1b2a] to-[#3a506b]" },
      { id: "g3", title: "Bride trial look", note: "Modern bun with soft glam finish.", tint: "from-[#f2d7ee] to-[#c9a84c]" },
      { id: "g4", title: "Loc barrel detail", note: "Weekend-ready finish with scalp polish.", tint: "from-[#1f1f1f] to-[#8c7280]" },
    ],
    faq: [
      {
        question: "Do you provide braiding fibre?",
        answer: "Yes. The price range shows labour only or labour plus standard fibre options depending on the style selected.",
      },
      {
        question: "Can I book at-home service?",
        answer: "Yes. We cover Kilimani, Lavington, Hurlingham, Kileleshwa, and nearby zones for selected services.",
      },
    ],
    professionals: ["njeri-kamau", "faith-odhiambo"],
    nextAvailable: "Today, 4:30 PM",
  },
  {
    slug: "westlands-polish-room",
    name: "Westlands Polish Room",
    tagline: "High-detail nails, lashes, and polished express appointments.",
    location: "Westlands, Nairobi",
    areasServed: ["Westlands", "Parklands", "Kileleshwa", "Loresho"],
    rating: 4.8,
    reviewCount: 196,
    startingPrice: 1500,
    categoryTags: ["Nails", "Lashes", "Brows"],
    verified: true,
    mobileService: false,
    about:
      "An appointment-led beauty studio for sharp nail work, clean sanitation standards, and dependable after-work slots.",
    description:
      "Ideal for clients who need quick, reliable beauty maintenance with visible pricing and neat finishing.",
    heroMood: "from-[var(--ms-blush)] via-white to-[var(--ms-gold)]/30",
    serviceIds: [
      "gel-manicure",
      "pedicure-spa",
      "nail-art-upgrade",
      "lash-classic",
      "brow-threading",
    ],
    topServiceIds: ["gel-manicure", "lash-classic", "pedicure-spa"],
    packageOffers: [
      {
        id: "westlands-late-afternoon",
        name: "After Work Reset",
        description: "Gel manicure plus brow tidy for late afternoon bookings.",
        price: 3200,
        serviceIds: ["gel-manicure", "brow-threading"],
        badge: "Fast turnaround",
      },
    ],
    gallery: [
      { id: "g5", title: "Chocolate chrome set", note: "Short square with mirror finish.", tint: "from-[#543864] to-[#ff6f91]" },
      { id: "g6", title: "Minimal french detail", note: "Warm nude base with thin gold line.", tint: "from-[#f9d0e8] to-[#faf6f1]" },
      { id: "g7", title: "Classic lash map", note: "Soft volume for everyday wear.", tint: "from-[#1f1f1f] to-[#d9a441]" },
      { id: "g8", title: "Spa pedicure set-up", note: "Sanitised tools and calm finish zone.", tint: "from-[#f0ebe3] to-[#c9a84c]" },
    ],
    faq: [
      {
        question: "Do you remove previous gel work?",
        answer: "Yes. Removal can be booked as an add-on before selecting the new service.",
      },
      {
        question: "How long should I keep classic lashes?",
        answer: "Refills are usually best after two to three weeks, depending on care and natural shedding.",
      },
    ],
    professionals: ["amina-mwangi"],
    nextAvailable: "Tomorrow, 10:00 AM",
  },
  {
    slug: "south-b-groom-lab",
    name: "South B Groom Lab",
    tagline: "Clean men's cuts, beard sculpting, and quick facial refresh services.",
    location: "South B, Nairobi",
    areasServed: ["South B", "South C", "Mombasa Road", "Industrial Area"],
    rating: 4.7,
    reviewCount: 124,
    startingPrice: 900,
    categoryTags: ["Men's Grooming", "Facials", "Mobile"],
    verified: true,
    mobileService: true,
    about:
      "Built for consistent grooming routines with disciplined booking windows and clear service timing.",
    description:
      "Ideal for professionals who want precise cuts, dependable start times, and optional home or office call-outs.",
    heroMood: "from-[var(--ms-charcoal)] via-[#101820] to-[var(--ms-gold)]/30",
    serviceIds: ["mens-fade", "beard-sculpt", "facial-treatment"],
    topServiceIds: ["mens-fade", "beard-sculpt", "facial-treatment"],
    packageOffers: [
      {
        id: "southb-boardroom",
        name: "Boardroom Ready",
        description: "Fade, beard sculpt, and express facial before a big meeting or event.",
        price: 4200,
        serviceIds: ["mens-fade", "beard-sculpt", "facial-treatment"],
        badge: "Most booked",
      },
    ],
    gallery: [
      { id: "g9", title: "Low fade finish", note: "Sharp line-up with natural crown blend.", tint: "from-[#111827] to-[#374151]" },
      { id: "g10", title: "Defined beard line", note: "Hot towel finish with soft balm.", tint: "from-[#1f1f1f] to-[#8b5cf6]" },
      { id: "g11", title: "Express facial prep", note: "Clean station and skin-safe product line.", tint: "from-[#0d1b2a] to-[#d9a441]" },
      { id: "g12", title: "Mobile grooming kit", note: "Office-ready or at-home set-up.", tint: "from-[#334155] to-[#1f1f1f]" },
    ],
    faq: [
      {
        question: "Can I book a mobile office visit?",
        answer: "Yes. Mobile slots are available in South B, South C, and along Mombasa Road by request.",
      },
      {
        question: "Do you take walk-ins?",
        answer: "Walk-ins depend on gaps in the day, but the platform booking is the fastest way to secure a slot.",
      },
    ],
    professionals: ["kevin-ochieng"],
    nextAvailable: "Today, 6:15 PM",
  },
];

export const professionals: Professional[] = [
  {
    slug: "njeri-kamau",
    name: "Njeri Kamau",
    specialty: "Protective styling and healthy natural hair care",
    location: "Kilimani",
    serviceMode: "Both",
    salonAffiliation: "Kilimani Texture House",
    areasServed: ["Kilimani", "Lavington", "Kileleshwa", "Hurlingham"],
    rating: 4.9,
    reviewCount: 132,
    startingPrice: 2200,
    verified: true,
    bio:
      "Specialises in low-tension protective styles, wash-day recovery, and bridal prep for textured hair.",
    description:
      "Known for explaining what each service includes, how long it will take, and what aftercare actually matters.",
    heroMood: "from-[var(--ms-purple)]/35 via-[var(--ms-navy)] to-[var(--ms-magenta)]/30",
    serviceIds: ["knotless-braids", "fulani-braids", "wash-and-go", "silk-press"],
    packageOffers: [
      {
        id: "njeri-refresh",
        name: "Wash Day + Silk Finish",
        description: "Healthy scalp reset followed by a clean silk press finish.",
        price: 5600,
        serviceIds: ["wash-and-go", "silk-press"],
        badge: "Haircare favourite",
      },
    ],
    gallery: [
      { id: "p1", title: "Shoulder-length knotless", note: "Smart office-ready finish.", tint: "from-[#221c35] to-[#7c3aed]" },
      { id: "p2", title: "Defined wash and go", note: "Hydrated curl pattern and soft hold.", tint: "from-[#0d1b2a] to-[#1d4ed8]" },
      { id: "p3", title: "Silk press finish", note: "Movement retained without flatness.", tint: "from-[#fdf2f8] to-[#c9a84c]" },
      { id: "p4", title: "Fulani detail", note: "Crisp centre part with subtle beads.", tint: "from-[#4c1d95] to-[#ec4899]" },
    ],
    faq: [
      {
        question: "Do you work with children?",
        answer: "Yes, for selected braiding and wash-day services when the slot timing is confirmed in advance.",
      },
      {
        question: "How should I prepare for an install?",
        answer: "Arrive with your hair detangled where possible, or add a wash and prep service during booking.",
      },
    ],
    nextAvailable: "Today, 3:00 PM",
  },
  {
    slug: "faith-odhiambo",
    name: "Faith Odhiambo",
    specialty: "Bridal hair, soft glam, and occasion-ready finishes",
    location: "Karen",
    serviceMode: "Mobile",
    salonAffiliation: "Independent",
    areasServed: ["Karen", "Lang'ata", "Kilimani", "Lavington"],
    rating: 4.9,
    reviewCount: 88,
    startingPrice: 3500,
    verified: true,
    bio:
      "Mobile artist for brides, wedding parties, and polished event bookings that need calm coordination.",
    description:
      "Faith is booked for her calm prep timelines, shade matching for melanin-rich skin, and clear pre-event communication.",
    heroMood: "from-[var(--ms-blush)] via-white to-[var(--ms-magenta)]/25",
    serviceIds: ["makeup-soft-glam", "bridal-glam"],
    packageOffers: [
      {
        id: "faith-bride",
        name: "Bride + Maid Pairing",
        description: "Wedding day glam for bride plus one maid with schedule planning.",
        price: 23500,
        serviceIds: ["bridal-glam", "makeup-soft-glam"],
        badge: "Wedding day",
      },
    ],
    gallery: [
      { id: "p5", title: "Soft glam finish", note: "Neutral eye, defined skin, fluffy lash.", tint: "from-[#fff1f2] to-[#f9d0e8]" },
      { id: "p6", title: "Bride trial board", note: "Skin match and hairstyle notes locked early.", tint: "from-[#fce7f3] to-[#c9a84c]" },
      { id: "p7", title: "Civil look detail", note: "Elegant bun and understated lip finish.", tint: "from-[#8b5cf6] to-[#f472b6]" },
      { id: "p8", title: "Bridesmaid stack", note: "Timelined four-person morning prep.", tint: "from-[#1f1f1f] to-[#8c7280]" },
    ],
    faq: [
      {
        question: "Do you travel outside Nairobi?",
        answer: "Yes, by arrangement for weddings and event packages. Travel fees are confirmed before booking.",
      },
      {
        question: "Is a trial mandatory?",
        answer: "A trial is strongly recommended for bridal bookings and is included in premium packages.",
      },
    ],
    nextAvailable: "Tomorrow, 8:30 AM",
  },
  {
    slug: "amina-mwangi",
    name: "Amina Mwangi",
    specialty: "Nail detail, clean girl manicures, and classic lash work",
    location: "Westlands",
    serviceMode: "In salon",
    salonAffiliation: "Westlands Polish Room",
    areasServed: ["Westlands", "Parklands", "Kileleshwa"],
    rating: 4.8,
    reviewCount: 109,
    startingPrice: 1500,
    verified: true,
    bio:
      "Appointments built around neat prep, hygiene, and wearable beauty maintenance that still feels special.",
    description:
      "Amina is the go-to for clean finishes, strong retention, and subtle nail art that works from office to weekend.",
    heroMood: "from-[var(--ms-ivory)] via-[var(--ms-blush)] to-[var(--ms-gold)]/20",
    serviceIds: ["gel-manicure", "pedicure-spa", "nail-art-upgrade", "lash-classic", "brow-threading"],
    packageOffers: [
      {
        id: "amina-clean-week",
        name: "Clean Week Combo",
        description: "Gel manicure and classic lash set for one-booking convenience.",
        price: 6200,
        serviceIds: ["gel-manicure", "lash-classic"],
        badge: "Best value",
      },
    ],
    gallery: [
      { id: "p9", title: "Short nude gel", note: "Office-safe shine with clean cuticles.", tint: "from-[#fdf2f8] to-[#f59e0b]" },
      { id: "p10", title: "Glossy chrome", note: "Mirror detail with almond shape.", tint: "from-[#ec4899] to-[#8b5cf6]" },
      { id: "p11", title: "Classic lash map", note: "Balanced fullness and soft taper.", tint: "from-[#1f2937] to-[#6b7280]" },
      { id: "p12", title: "Delicate line art", note: "Minimalist detailing for everyday wear.", tint: "from-[#f3e8ff] to-[#fbcfe8]" },
    ],
    faq: [
      {
        question: "Can I combine nails and lashes in one session?",
        answer: "Yes. Combination bookings are encouraged and shown with the total duration before confirmation.",
      },
      {
        question: "Do you offer refill appointments?",
        answer: "Yes. Returning clients can request a refill or maintenance slot directly from their activity page.",
      },
    ],
    nextAvailable: "Tomorrow, 11:15 AM",
  },
  {
    slug: "kevin-ochieng",
    name: "Kevin Ochieng",
    specialty: "Precision fades, beard sculpting, and mobile grooming",
    location: "South B",
    serviceMode: "Both",
    salonAffiliation: "South B Groom Lab",
    areasServed: ["South B", "South C", "Mombasa Road", "CBD"],
    rating: 4.7,
    reviewCount: 73,
    startingPrice: 1200,
    verified: true,
    bio:
      "Reliable for sharp cuts before interviews, events, and weekly maintenance bookings.",
    description:
      "Kevin focuses on consistent execution, strong timing discipline, and grooming plans that fit busy schedules.",
    heroMood: "from-[#101820] via-[var(--ms-charcoal)] to-[var(--ms-gold)]/35",
    serviceIds: ["mens-fade", "beard-sculpt", "facial-treatment"],
    packageOffers: [
      {
        id: "kevin-reset",
        name: "Cut + Beard Reset",
        description: "Fade and beard sculpt pairing with optional express facial add-on.",
        price: 2600,
        serviceIds: ["mens-fade", "beard-sculpt"],
        badge: "Fast favourite",
      },
    ],
    gallery: [
      { id: "p13", title: "Temple fade", note: "Clean silhouette with soft crown blend.", tint: "from-[#111827] to-[#1d4ed8]" },
      { id: "p14", title: "Beard tidy", note: "Structured line without harsh finish.", tint: "from-[#1f1f1f] to-[#d97706]" },
      { id: "p15", title: "Mobile set-up", note: "Compact tools for office grooming calls.", tint: "from-[#334155] to-[#64748b]" },
      { id: "p16", title: "Express skin refresh", note: "Short facial for weekday recovery.", tint: "from-[#0d1b2a] to-[#0f766e]" },
    ],
    faq: [
      {
        question: "How early should I book for same-day slots?",
        answer: "Same-day windows are possible, but morning requests usually secure the best timing.",
      },
      {
        question: "Can you groom on-site for teams or events?",
        answer: "Yes. Team or event grooming can be arranged through WhatsApp support after the initial request.",
      },
    ],
    nextAvailable: "Today, 5:45 PM",
  },
];

export const testimonials: ReviewSnapshot[] = [
  {
    id: "r1",
    name: "Anne N.",
    title: "Client, Kilimani",
    rating: 5,
    body: "I booked knotless braids in under two minutes, saw the real price first, and the stylist arrived exactly when promised.",
    serviceLabel: "Knotless braids",
  },
  {
    id: "r2",
    name: "Brian M.",
    title: "Client, South C",
    rating: 5,
    body: "The fade looked sharp, the timing was accurate, and booking through the site was far easier than chasing WhatsApp replies.",
    serviceLabel: "Precision fade",
  },
  {
    id: "r3",
    name: "Shiko W.",
    title: "Bride, Karen",
    rating: 5,
    body: "I could compare bridal packages, see what was included, and confirm the morning schedule before paying a deposit.",
    serviceLabel: "Bridal glam",
  },
];

export const trustPoints = [
  "Verified profiles and visible prices before booking",
  "Nairobi coverage across Westlands, Kilimani, Karen, South B, Ruaka, and more",
  "Easy rescheduling and WhatsApp fallback for support",
  "Clear duration windows, availability, and service inclusions",
];

export const howItWorks = [
  {
    step: "01",
    title: "Compare trusted options",
    description: "See salons and professionals with prices, specialties, ratings, and location relevance in one place.",
  },
  {
    step: "02",
    title: "Select the exact service",
    description: "Choose hair, nails, skin, bridal, or grooming services with honest duration and inclusion details.",
  },
  {
    step: "03",
    title: "Confirm in minutes",
    description: "Pick a time, leave a note if needed, choose your notifications, and lock in the booking.",
  },
];

export const profileCompletionTasks = [
  "Add profile photo and bio",
  "Set service prices and durations",
  "Upload portfolio highlights",
  "Define coverage areas and service mode",
];

export const activityItems = [
  {
    title: "Upcoming booking",
    detail: "Soft Glam with Faith Odhiambo",
    meta: "Saturday, 9:30 AM · Karen delivery",
  },
  {
    title: "Saved studio",
    detail: "Westlands Polish Room",
    meta: "Gel manicure from KES 1,500",
  },
  {
    title: "Review reminder",
    detail: "Leave feedback for Njeri Kamau",
    meta: "Your last booking finished yesterday",
  },
];

export const supportFaq = [
  {
    question: "How does Mobile Salon handle rescheduling?",
    answer: "Clients can request a new time from the activity page, and the professional sees the change immediately.",
  },
  {
    question: "Can salons and independents both join?",
    answer: "Yes. Independent professionals, mobile providers, and salon teams are all supported within the same platform.",
  },
  {
    question: "Are prices final before booking?",
    answer: "The visible price range and inclusions appear before confirmation. Any add-on must be agreed clearly before the booking is finalised.",
  },
  {
    question: "What if I still prefer WhatsApp?",
    answer: "Every detail page includes a WhatsApp fallback so the MVP can support clients who want direct confirmation.",
  },
];

export const bookingDates = [
  { label: "Thu", date: "16 Apr" },
  { label: "Fri", date: "17 Apr" },
  { label: "Sat", date: "18 Apr" },
  { label: "Sun", date: "19 Apr" },
  { label: "Mon", date: "20 Apr" },
];

export const bookingTimes = [
  "8:00 AM",
  "9:30 AM",
  "11:00 AM",
  "1:30 PM",
  "3:00 PM",
  "4:30 PM",
  "6:00 PM",
] as const;

export function getCollection(collection: string) {
  if (collection === "salons") {
    return salons;
  }

  if (collection === "professionals") {
    return professionals;
  }

  return [];
}

export function getSalon(slug: string) {
  return salons.find((salon) => salon.slug === slug);
}

export function getProfessional(slug: string) {
  return professionals.find((professional) => professional.slug === slug);
}

export function getServicesByIds(ids: string[]) {
  return ids
    .map((id) => services.find((service) => service.id === id))
    .filter((service): service is Service => Boolean(service));
}

export function getProfessionalsForSalon(slug: string) {
  const salon = getSalon(slug);

  if (!salon) {
    return [];
  }

  return professionals.filter((professional) =>
    salon.professionals.includes(professional.slug),
  );
}
