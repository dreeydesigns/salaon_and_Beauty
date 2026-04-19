import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  Building2,
  CheckCircle2,
  Crown,
  Gem,
  LineChart,
  LockKeyhole,
  Sparkles,
  Star,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Mobile Salon | Kenya's Beauty Marketplace",
  description:
    "Mobile Salon connects Kenyan clients, salons, and independent beauty professionals through trusted discovery, protected booking, and clear beauty care.",
  openGraph: {
    title: "Mobile Salon | Beauty in your fingertips",
    description:
      "A three-sided Kenyan beauty marketplace for clients, salons, and independent professionals.",
    type: "website",
  },
};

const proofStats = [
  ["4.9", "client rating target"],
  ["1,200+", "verified pro goal"],
  ["3", "launch cities"],
  ["5 taps", "average booking path"],
];

const roleSections = [
  {
    label: "For clients",
    accent: "#C8284A",
    icon: Sparkles,
    title: "Beauty, sorted in five taps.",
    copy:
      "Search by service, location, and budget. See verified professionals, real portfolios, visible prices, and available times before you commit.",
    benefits: [
      "Book beauty help from anywhere in Nairobi.",
      "Find mobile pros who can come to you.",
      "Your details stay private until booking is confirmed.",
      "Verified professionals rank by real trust signals.",
      "Packages for bridal, birthday, self-care, and rush moments.",
    ],
    cta: "Find my beauty pro",
    href: "/theme-quiz",
  },
  {
    label: "For salons and spas",
    accent: "#BF8C2E",
    icon: Building2,
    title: "Turn your quality into your reputation.",
    copy:
      "Give your salon a full digital presence: service catalogue, team showcase, portfolio, verified status, and booking flow without building your own system.",
    benefits: [
      "Get discovered by clients searching your exact services.",
      "Manage bookings and availability in one clean workspace.",
      "Showcase your team, work, and full service menu.",
      "Use packages and featured placement to grow demand.",
      "Reduce admin while keeping your brand premium.",
    ],
    cta: "List my salon",
    href: "/onboarding/professional?role=salon",
  },
  {
    label: "For professionals",
    accent: "#1A7A6B",
    icon: Crown,
    title: "Your skill opens every door.",
    copy:
      "Independent beauty professionals can build income without owning salon space. Your profile becomes your bookable beauty business.",
    benefits: [
      "Operate mobile, in a salon setting, or both.",
      "Your rating becomes your business card.",
      "Access clients without rent or heavy starting capital.",
      "Verification unlocks stronger visibility.",
      "Set your pricing, schedule, and service area.",
    ],
    cta: "Start as professional",
    href: "/onboarding/professional?role=professional",
  },
];

const trustSignals = [
  { icon: BadgeCheck, title: "Verified first", copy: "Verified providers naturally rank above unverified accounts." },
  { icon: Star, title: "Quality engine", copy: "Ratings, reviews, completion rate, repeat bookings, and response speed shape discovery." },
  { icon: LockKeyhole, title: "Privacy protected", copy: "Phone details stay private before a confirmed booking or transaction." },
  { icon: LineChart, title: "Business built in", copy: "Commission, listing plans, verification, featured placement, and package upsell are designed into the platform." },
];

const steps = [
  "Choose salon or independent professional",
  "Pick your service or package",
  "Choose time with no back-and-forth calls",
  "Review price, service, and location",
  "Confirm and let Mobile Salon protect the request",
];

export default function PublicLandingPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#0F0A0D] text-[#FDF7F2]">
      <nav className="sticky top-0 z-50 border-b border-white/10 bg-[#0F0A0D]/78 backdrop-blur-2xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 lg:px-6">
          <Link className="font-display text-2xl font-semibold text-[#FDF7F2]" href="/">
            <span className="text-[#C8284A]">Mobile</span> Salon
          </Link>
          <div className="flex items-center gap-2">
            <Link
              className="hidden rounded-full border border-white/12 px-4 py-2 text-sm font-semibold text-white/82 transition hover:border-white/28 hover:text-white sm:inline-flex"
              href="/auth/sign-in?returnTo=/home"
            >
              Sign in
            </Link>
            <Link
              className="inline-flex min-h-11 items-center gap-2 rounded-full bg-[#C8284A] px-5 text-sm font-semibold text-white shadow-[0_18px_44px_rgba(200,40,74,0.28)] transition hover:bg-[#E03460]"
              href="/theme-quiz"
            >
              Get started
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </nav>

      <section className="relative mx-auto grid min-h-[calc(100vh-76px)] max-w-7xl items-center gap-10 px-4 py-16 lg:grid-cols-[minmax(0,0.55fr)_minmax(360px,0.45fr)] lg:px-6">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#C8284A]/70 to-transparent" />
        <div className="max-w-3xl">
          <p className="inline-flex rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-[#BF8C2E]">
            Kenya&apos;s three-sided beauty marketplace
          </p>
          <h1 className="mt-8 font-display text-6xl font-bold leading-[0.95] tracking-[-0.04em] text-white sm:text-7xl lg:text-8xl">
            One platform.
            <span className="block italic text-[#C8284A]">Three ways to win.</span>
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-8 text-white/70">
            Whether you need beauty services, run a salon, or offer beauty skills, Mobile Salon was built to make your next move simpler than a phone call.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              className="inline-flex min-h-13 items-center justify-center gap-2 rounded-full bg-[#C8284A] px-7 text-sm font-semibold text-white shadow-[0_20px_54px_rgba(200,40,74,0.32)] transition hover:bg-[#E03460]"
              href="/theme-quiz"
            >
              Create my account
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              className="inline-flex min-h-13 items-center justify-center rounded-full border border-white/12 px-7 text-sm font-semibold text-white/86 transition hover:border-white/30 hover:bg-white/6"
              href="/auth/sign-in?returnTo=/home"
            >
              I already have an account
            </Link>
          </div>
        </div>

        <div className="hidden gap-4 lg:grid">
          {roleSections.map((role) => {
            const Icon = role.icon;

            return (
              <Link
                className="group rounded-[34px] border border-white/10 bg-white/[0.055] p-5 shadow-[0_24px_80px_rgba(0,0,0,0.22)] transition hover:-translate-y-1 hover:border-white/22 hover:bg-white/[0.08]"
                href={role.href}
                key={role.label}
              >
                <div className="flex items-start gap-4">
                  <span
                    className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-white"
                    style={{ backgroundColor: role.accent }}
                  >
                    <Icon className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/45">{role.label}</p>
                    <h2 className="mt-2 font-display text-2xl font-semibold text-white">{role.title}</h2>
                    <p className="mt-2 line-clamp-2 text-sm leading-6 text-white/62">{role.copy}</p>
                    <p className="mt-4 inline-flex items-center gap-2 text-sm font-semibold" style={{ color: role.accent }}>
                      {role.cta}
                      <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                    </p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="border-y border-white/8 bg-white/[0.035]">
        <div className="mx-auto grid max-w-7xl gap-4 px-4 py-6 sm:grid-cols-2 lg:grid-cols-4 lg:px-6">
          {proofStats.map(([value, label]) => (
            <div className="rounded-[24px] border border-white/8 bg-[#1A0F14] px-5 py-5" key={label}>
              <p className="font-display text-4xl font-semibold text-white">{value}</p>
              <p className="mt-1 text-xs font-semibold uppercase tracking-[0.2em] text-white/45">{label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-8 px-4 py-20 lg:px-6">
        {roleSections.map((role, index) => {
          const Icon = role.icon;

          return (
            <article
              className="grid overflow-hidden rounded-[42px] border border-white/8 bg-[#1A0F14] lg:grid-cols-2"
              key={role.label}
            >
              <div className={`p-6 sm:p-8 lg:p-10 ${index % 2 === 1 ? "lg:order-2" : ""}`}>
                <span
                  className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-white"
                  style={{ backgroundColor: role.accent }}
                >
                  <Icon className="h-4 w-4" />
                  {role.label}
                </span>
                <h2 className="mt-6 font-display text-4xl font-semibold leading-tight text-white sm:text-5xl">
                  {role.title}
                </h2>
                <p className="mt-5 text-sm leading-7 text-white/66">{role.copy}</p>
                <Link
                  className="mt-7 inline-flex min-h-12 items-center justify-center gap-2 rounded-full px-6 text-sm font-semibold text-white transition hover:brightness-110"
                  href={role.href}
                  style={{ backgroundColor: role.accent }}
                >
                  {role.cta}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
              <div className="grid content-center gap-3 border-t border-white/8 bg-white/[0.035] p-6 sm:p-8 lg:border-l lg:border-t-0 lg:p-10">
                {role.benefits.map((benefit) => (
                  <div className="flex items-start gap-3 rounded-[24px] border border-white/8 bg-[#0F0A0D]/70 p-4" key={benefit}>
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" style={{ color: role.accent }} />
                    <p className="text-sm leading-6 text-white/72">{benefit}</p>
                  </div>
                ))}
              </div>
            </article>
          );
        })}
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-20 lg:px-6">
        <div className="grid gap-5 lg:grid-cols-[minmax(0,0.42fr)_minmax(0,0.58fr)]">
          <div className="rounded-[38px] border border-white/8 bg-[#1A0F14] p-6 sm:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#BF8C2E]">Trust and algorithm proof</p>
            <h2 className="mt-4 font-display text-4xl font-semibold leading-tight text-white">
              Mobile Salon rewards trust, not noise.
            </h2>
            <p className="mt-4 text-sm leading-7 text-white/64">
              Discovery is designed around verification, response speed, completion rate, repeat bookings, trending services, package engagement, location relevance, and recent activity.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {trustSignals.map((signal) => {
              const Icon = signal.icon;

              return (
                <div className="rounded-[30px] border border-white/8 bg-white/[0.045] p-5" key={signal.title}>
                  <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#C8284A]/16 text-[#C8284A]">
                    <Icon className="h-5 w-5" />
                  </span>
                  <h3 className="mt-4 text-xl font-semibold text-white">{signal.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-white/62">{signal.copy}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-20 lg:px-6">
        <div className="rounded-[42px] border border-white/8 bg-[#FDF7F2] p-6 text-[#0F0A0D] sm:p-8 lg:p-10">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,0.35fr)_minmax(0,0.65fr)] lg:items-center">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#8B6070]">How it works</p>
              <h2 className="mt-4 font-display text-4xl font-semibold leading-tight">
                A calm path from need to confirmed request.
              </h2>
            </div>
            <div className="grid gap-3 md:grid-cols-5">
              {steps.map((step, index) => (
                <div
                  className="rounded-[24px] border border-[#0F0A0D]/10 bg-white p-4 shadow-[0_14px_34px_rgba(15,10,13,0.06)]"
                  key={step}
                >
                  <span
                    className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold ${
                      index === steps.length - 1 ? "bg-[#C8284A] text-white" : "border border-[#C8284A]/40 text-[#C8284A]"
                    }`}
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <p className="mt-4 text-sm font-semibold leading-6">{step}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 pb-20 text-center lg:px-6">
        <div className="rounded-[44px] border border-white/10 bg-[linear-gradient(135deg,#1A0F14,#2A121D_52%,#0F0A0D)] p-8 shadow-[0_30px_100px_rgba(0,0,0,0.32)] sm:p-12">
          <Gem className="mx-auto h-9 w-9 text-[#BF8C2E]" />
          <h2 className="mt-5 font-display text-5xl font-semibold leading-tight text-white">
            Ready to be part of it?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-white/66">
            Whether you are booking your next look, growing your salon, or building a career, your place on Mobile Salon is ready.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#C8284A] px-7 text-sm font-semibold text-white transition hover:bg-[#E03460]"
              href="/theme-quiz"
            >
              Create your account
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/14 px-7 text-sm font-semibold text-white/82 transition hover:border-white/32 hover:text-white"
              href="/auth/sign-in?returnTo=/home"
            >
              Sign in
            </Link>
          </div>
          <p className="mt-5 text-xs text-white/44">No commitment until your first booking.</p>
        </div>
      </section>

      <footer className="border-t border-white/8">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-8 text-sm text-white/52 lg:flex-row lg:items-center lg:justify-between lg:px-6">
          <p className="font-display text-xl text-white">
            <span className="text-[#C8284A]">Mobile</span> Salon
          </p>
          <div className="flex flex-wrap gap-4">
            <Link className="hover:text-white" href="/help">Privacy</Link>
            <Link className="hover:text-white" href="/help">Terms</Link>
            <Link className="hover:text-white" href="/help">Contact</Link>
            <Link className="hover:text-white" href="/help">Help</Link>
          </div>
          <p>Copyright 2026 Mobile Salon. Beauty in your fingertips.</p>
        </div>
      </footer>
    </main>
  );
}
