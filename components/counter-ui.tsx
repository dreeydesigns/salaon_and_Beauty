"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ArrowRight,
  Flag,
  Search,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Star,
  Store,
  Tag,
  Truck,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ─── Category data ─────────────────────────────────────────────────────────────
const categories = [
  { id: "all", label: "All", emoji: "✦" },
  { id: "hair", label: "Hair", emoji: "💇" },
  { id: "nails", label: "Nails", emoji: "💅" },
  { id: "skincare", label: "Skincare", emoji: "🌿" },
  { id: "tools", label: "Tools", emoji: "✂️" },
  { id: "accessories", label: "Accessories", emoji: "💎" },
  { id: "wellness", label: "Wellness", emoji: "🌸" },
];

// ─── Placeholder product data ───────────────────────────────────────────────────
const placeholderProducts = [
  {
    id: "1",
    name: "Edge Control Gel — Extra Hold",
    brand: "Cantu",
    shopName: "Beauty Base KE",
    price: 850,
    rating: 4.8,
    reviewCount: 24,
    category: "hair",
    badge: "Top Seller",
    image: "https://images.pexels.com/photos/3993449/pexels-photo-3993449.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop",
  },
  {
    id: "2",
    name: "Matte Lip Kit — Nairobi Nude",
    brand: "Zuri Beauty",
    shopName: "Zuri Beauty Official",
    price: 1200,
    rating: 4.6,
    reviewCount: 18,
    category: "accessories",
    badge: "New",
    image: "https://images.pexels.com/photos/2693644/pexels-photo-2693644.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop",
  },
  {
    id: "3",
    name: "Natural Hair Moisturiser",
    brand: "Shea Moisture",
    shopName: "NaturalGlow KE",
    price: 1650,
    rating: 4.9,
    reviewCount: 43,
    category: "hair",
    badge: "Verified Brand",
    image: "https://images.pexels.com/photos/5797991/pexels-photo-5797991.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop",
  },
  {
    id: "4",
    name: "Pro Nail Drill Kit — 35W",
    brand: "NailTech Pro",
    shopName: "ProNails KE",
    price: 3200,
    rating: 4.7,
    reviewCount: 12,
    category: "tools",
    badge: "Professional",
    image: "https://images.pexels.com/photos/3997373/pexels-photo-3997373.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop",
  },
  {
    id: "5",
    name: "Vitamin C Glow Serum",
    brand: "Radiant Skin Co.",
    shopName: "GlowUp KE",
    price: 2100,
    rating: 4.8,
    reviewCount: 31,
    category: "skincare",
    badge: "Trending",
    image: "https://images.pexels.com/photos/3762879/pexels-photo-3762879.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop",
  },
  {
    id: "6",
    name: "Rose Quartz Gua Sha Set",
    brand: "SkinRitual",
    shopName: "Wellness Corner KE",
    price: 1400,
    rating: 4.5,
    reviewCount: 9,
    category: "wellness",
    badge: "New",
    image: "https://images.pexels.com/photos/4465124/pexels-photo-4465124.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop",
  },
];

// ─── Trust signals ──────────────────────────────────────────────────────────────
const trustSignals = [
  {
    icon: <ShieldCheck className="h-5 w-5" />,
    title: "Verified sellers only",
    copy: "Every shop has a KRA PIN and business registration on file.",
  },
  {
    icon: <Tag className="h-5 w-5" />,
    title: "Genuine products",
    copy: "Sellers attest to product authenticity on every listing. Report a counterfeit in 3 taps.",
  },
  {
    icon: <ShoppingBag className="h-5 w-5" />,
    title: "Escrow protection",
    copy: "Your money is held safely. Released only when you confirm receipt.",
  },
  {
    icon: <Truck className="h-5 w-5" />,
    title: "Delivery available",
    copy: "Shop+ sellers offer Nairobi-wide delivery through verified delivery partners.",
  },
];

function formatKES(amount: number) {
  return `KES ${amount.toLocaleString()}`;
}

// ─── Product card ───────────────────────────────────────────────────────────────
function ProductCard({ product }: { product: typeof placeholderProducts[0] }) {
  return (
    <article className="beauty-card min-w-0 max-w-full overflow-hidden rounded-[28px] transition hover:-translate-y-1">
      <div className="relative h-44 overflow-hidden bg-[var(--ms-soft-bg)]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          alt={product.name}
          className="h-full w-full object-cover"
          loading="lazy"
          src={product.image}
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_50%,rgba(13,27,42,0.4))]" />
        {/* Badge */}
        <span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-[var(--ms-navy)]">
          {product.badge}
        </span>
        {/* Report flag */}
        <button
          aria-label="Report this product"
          className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/80 text-[var(--ms-mauve)] transition hover:bg-white hover:text-[var(--ms-danger)]"
          type="button"
        >
          <Flag className="h-3.5 w-3.5" />
        </button>
      </div>

      <div className="p-4">
        <p className="text-xs text-[var(--ms-mauve)]">{product.brand}</p>
        <h3 className="mt-1 text-sm font-semibold leading-snug text-[var(--ms-navy)]">{product.name}</h3>

        <div className="mt-2 flex items-center gap-1.5 text-xs text-[var(--ms-mauve)]">
          <Star className="h-3.5 w-3.5 fill-[var(--ms-gold)] text-[var(--ms-gold)]" />
          <span className="font-semibold text-[var(--ms-charcoal)]">{product.rating}</span>
          <span>({product.reviewCount})</span>
        </div>

        <div className="mt-2 flex items-center gap-2 text-xs text-[var(--ms-mauve)]">
          <Store className="h-3 w-3 shrink-0" />
          <span className="truncate">{product.shopName}</span>
        </div>

        <div className="mt-4 flex items-center justify-between gap-2">
          <p className="text-base font-semibold text-[var(--ms-navy)]">{formatKES(product.price)}</p>
          <button
            className="inline-flex items-center gap-1.5 rounded-full bg-[var(--ms-rose)] px-4 py-2 text-xs font-semibold text-white transition hover:brightness-110"
            type="button"
          >
            <ShoppingBag className="h-3.5 w-3.5" />
            Add
          </button>
        </div>

        {/* Buyer duty notice — required on every product listing per safety spec */}
        <p className="mt-3 rounded-[12px] bg-[var(--ms-soft-bg)] px-3 py-2 text-[10px] leading-4 text-[var(--ms-mauve)]">
          You have a right to accurate products.{" "}
          <button className="text-[var(--ms-rose)] underline" type="button">
            Report if not as described.
          </button>
        </p>
      </div>
    </article>
  );
}

// ─── Main Counter UI ────────────────────────────────────────────────────────────
export function CounterUI() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = placeholderProducts.filter((p) => {
    const matchesCat = activeCategory === "all" || p.category === activeCategory;
    const matchesSearch =
      !searchQuery ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.brand.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="section-grid">
      {/* Hero header */}
      <div className="overflow-hidden rounded-[36px] bg-[linear-gradient(135deg,var(--ms-plum),#512548_55%,var(--ms-rose))] px-6 py-8 text-white shadow-[0_24px_80px_rgba(58,24,58,0.28)] sm:px-8 sm:py-10">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/60">
              Beauty Products Marketplace
            </p>
            <h1 className="mt-3 font-display text-4xl leading-tight sm:text-5xl">
              Counter.
            </h1>
            <p className="mt-3 max-w-md text-sm leading-7 text-white/76">
              Genuine beauty products from verified Kenyan sellers. Escrow-protected. Delivered across Nairobi.
            </p>
          </div>
          <span className="hidden shrink-0 text-white/30 sm:block">
            <ShoppingBag className="h-20 w-20" />
          </span>
        </div>

        {/* Search */}
        <div className="mt-6 flex items-center gap-3 rounded-[22px] border border-white/20 bg-white/12 px-4 py-3 backdrop-blur">
          <Search className="h-4 w-4 shrink-0 text-white/60" />
          <input
            className="w-full bg-transparent text-sm text-white placeholder:text-white/48 outline-none"
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search products, brands, categories..."
            value={searchQuery}
          />
        </div>

        {/* Sell CTA */}
        <div className="mt-5 flex flex-wrap gap-3">
          <Link
            href="/auth/sign-up"
            className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-[var(--ms-navy)] transition hover:bg-[var(--ms-ivory)]"
          >
            <Store className="h-4 w-4" />
            Open a Shop
          </Link>
          <Link
            href="/auth/sign-in"
            className="inline-flex items-center gap-2 rounded-full bg-white/10 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-white/20"
          >
            Sign in to buy
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>

      {/* Category pills */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
        {categories.map((cat) => (
          <button
            className={cn(
              "inline-flex shrink-0 items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition",
              activeCategory === cat.id
                ? "border-[var(--ms-rose)] bg-[var(--ms-rose)] text-white"
                : "border-[var(--ms-border)] bg-white text-[var(--ms-mauve)] hover:border-[var(--ms-rose)]/40 hover:text-[var(--ms-navy)]",
            )}
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            type="button"
          >
            <span>{cat.emoji}</span>
            {cat.label}
          </button>
        ))}
      </div>

      {/* Trust signals */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {trustSignals.map((signal) => (
          <div
            className="flex items-start gap-3 rounded-[22px] border border-[var(--ms-border)] bg-white px-4 py-4 shadow-[0_8px_24px_rgba(13,27,42,0.05)]"
            key={signal.title}
          >
            <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--ms-rose)]/10 text-[var(--ms-rose)]">
              {signal.icon}
            </span>
            <div>
              <p className="text-sm font-semibold text-[var(--ms-navy)]">{signal.title}</p>
              <p className="mt-1 text-xs leading-5 text-[var(--ms-mauve)]">{signal.copy}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Products grid */}
      <section>
        <div className="mb-5 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--ms-mauve)]">
              {activeCategory === "all" ? "All Products" : categories.find((c) => c.id === activeCategory)?.label}
            </p>
            <h2 className="mt-1 text-2xl font-semibold text-[var(--ms-plum)]">
              {filtered.length} product{filtered.length !== 1 ? "s" : ""} found
            </h2>
          </div>
          <span className="inline-flex items-center gap-2 rounded-full bg-[var(--ms-soft-bg)] px-4 py-2 text-xs font-medium text-[var(--ms-mauve)]">
            <Sparkles className="h-3.5 w-3.5 text-[var(--ms-rose)]" />
            Verified sellers
          </span>
        </div>

        {filtered.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="rounded-[28px] border border-dashed border-[var(--ms-border)] bg-white px-5 py-12 text-center">
            <ShoppingBag className="mx-auto h-8 w-8 text-[var(--ms-mauve)]" />
            <h3 className="mt-4 text-lg font-semibold text-[var(--ms-navy)]">No products found</h3>
            <p className="mt-2 text-sm leading-6 text-[var(--ms-mauve)]">
              Try a different category or search term.
            </p>
            <button
              className="mt-4 inline-flex items-center gap-2 rounded-full border border-[var(--ms-border)] px-5 py-2.5 text-sm font-semibold text-[var(--ms-mauve)] transition hover:border-[var(--ms-rose)] hover:text-[var(--ms-navy)]"
              onClick={() => { setActiveCategory("all"); setSearchQuery(""); }}
              type="button"
            >
              Clear filters
            </button>
          </div>
        )}
      </section>

      {/* Shop owner CTA */}
      <div className="overflow-hidden rounded-[32px] bg-[var(--ms-navy)] px-6 py-8 text-white sm:px-8">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/60">For shop owners</p>
        <h2 className="mt-3 font-display text-3xl leading-tight">
          Sell your beauty products here.
        </h2>
        <p className="mt-3 text-sm leading-7 text-white/72">
          Register a Shop account. List up to 50 products on the Basic plan. Reach thousands of clients across Nairobi. 5% commission only when you sell.
        </p>
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          {[
            { label: "5% commission", sub: "Deducted from payout only" },
            { label: "Escrow protection", sub: "Get paid after delivery confirmed" },
            { label: "Promoted listings", sub: "Growth & Shop+ plans available" },
            { label: "Delivery integration", sub: "Shop+ includes rider network" },
          ].map((item) => (
            <div className="rounded-[18px] bg-white/8 px-4 py-3" key={item.label}>
              <p className="text-sm font-semibold text-[var(--ms-gold)]">{item.label}</p>
              <p className="mt-1 text-xs text-white/60">{item.sub}</p>
            </div>
          ))}
        </div>
        <Link
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-[var(--ms-rose)] px-6 py-3 text-sm font-semibold text-white transition hover:brightness-110"
          href="/auth/sign-up"
        >
          Register a Shop account
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      {/* Age-gated products notice */}
      <div className="rounded-[22px] border border-[var(--ms-border)] bg-white px-5 py-4">
        <p className="text-sm text-[var(--ms-mauve)]">
          <span className="font-semibold text-[var(--ms-navy)]">18+ products</span> are hidden by default.
          To view adult products, go to{" "}
          <span className="font-semibold text-[var(--ms-navy)]">Settings → Counter → View 18+ products</span>{" "}
          and confirm your age. Products intended for adults aged 18 and above only.
        </p>
      </div>
    </div>
  );
}
