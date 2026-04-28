"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import {
  BadgeCheck,
  BriefcaseBusiness,
  Camera,
  Globe2,
  LayoutPanelTop,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  Sparkles,
  Store,
  UserRound,
} from "lucide-react";

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

function ClientProfileWorkspace({
  session,
  onSave,
}: {
  session: Extract<AppUserSession, { role: "client" }>;
  onSave: (session: AppUserSession) => void;
}) {
  return (
    <div className="section-grid">
      <SectionReveal className="rounded-[36px] bg-white p-6 shadow-[0_18px_48px_rgba(13,27,42,0.08)] lg:p-8">
        <p className="text-xs uppercase tracking-[0.22em] text-[var(--ms-mauve)]">Client profile</p>
        <h1 className="mt-3 text-4xl font-semibold text-[var(--ms-navy)]">Keep your booking details simple and saved.</h1>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-[var(--ms-mauve)]">
          This page only keeps what helps you book faster: your name, contact details, profile photo, and personal settings.
        </p>
      </SectionReveal>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,0.58fr)_minmax(320px,0.42fr)]">
        <SectionReveal className="beauty-card rounded-[32px] p-6">
          <div className="flex items-start gap-4">
            <ProfileAvatar photo={session.profilePhoto} label={session.firstName} />
            <div className="min-w-0">
              <p className="text-xs uppercase tracking-[0.22em] text-[var(--ms-mauve)]">Account basics</p>
              <h2 className="mt-3 text-3xl font-semibold text-[var(--ms-plum)]">Your saved details</h2>
            </div>
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <Field
              icon={<UserRound className="h-4 w-4" />}
              label="First name"
              value={session.firstName}
              onChange={(value) => onSave({ ...session, firstName: value })}
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
              icon={<Camera className="h-4 w-4" />}
              label="Profile photo URL"
              value={session.profilePhoto ?? ""}
              onChange={(value) => onSave({ ...session, profilePhoto: value })}
            />
          </div>
        </SectionReveal>

        <SectionReveal className="beauty-card rounded-[32px] p-6">
          <p className="text-xs uppercase tracking-[0.22em] text-[var(--ms-mauve)]">What stays saved</p>
          <h2 className="mt-3 text-3xl font-semibold text-[var(--ms-plum)]">Only the details that shorten the next booking.</h2>
          <div className="mt-5 grid gap-3">
            <SummaryRow icon={<ShieldCheck className="h-4 w-4" />} label="Contact privacy" value="Protected until booking is confirmed" />
            <SummaryRow icon={<Sparkles className="h-4 w-4" />} label="Theme preference" value={session.tribeBadge} />
            <SummaryRow icon={<Globe2 className="h-4 w-4" />} label="Language style" value="Saved in settings" />
          </div>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <CTAButton href="/home">Go to home</CTAButton>
            <CTAButton href="/book" variant="outline">
              Start booking
            </CTAButton>
          </div>
        </SectionReveal>
      </div>

      <MyWorldCard />
      <LanguagePreferenceCard />
    </div>
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
