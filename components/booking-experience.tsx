"use client";

import { startTransition, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, ChevronLeft, ChevronRight, LoaderCircle } from "lucide-react";

import {
  bookingDates,
  bookingTimes,
  getProfessional,
  getSalon,
  getServicesByIds,
  services,
} from "@/lib/site-data";
import { useBookingStore } from "@/lib/booking-store";
import {
  BookingStepper,
  BreadcrumbTrail,
  CTAButton,
  DateChip,
  NotificationToggle,
  PriceSummary,
  SectionReveal,
  TimePill,
  WhatsAppButton,
} from "@/components/marketplace-ui";
import { cn, formatDurationRange, formatPriceRange } from "@/lib/utils";

export function BookingExperience() {
  const searchParams = useSearchParams();
  const isRushBooking = searchParams.get("rush") === "true";
  const [authPromptOpen, setAuthPromptOpen] = useState(false);
  const {
    step,
    targetType,
    targetId,
    selectedServiceIds,
    selectedDate,
    selectedTime,
    contact,
    notifications,
    status,
    nextStep,
    previousStep,
    reset,
    restoreBookingDraft,
    saveBookingDraft,
    setContact,
    setDate,
    setSelectedServices,
    setStatus,
    setStep,
    setTarget,
    setTime,
    toggleNotification,
    toggleService,
  } = useBookingStore();

  useEffect(() => {
    if (searchParams.get("resume") !== "booking") {
      return;
    }

    const restored = restoreBookingDraft();

    if (restored) {
      startTransition(() => {
        setStep(3);
      });
    }
  }, [restoreBookingDraft, searchParams, setStep]);

  useEffect(() => {
    const queryTargetType = searchParams.get("targetType");
    const queryTargetId = searchParams.get("targetId");
    const queryServiceIds = searchParams.get("serviceIds");

    if (queryTargetType === "salons" || queryTargetType === "professionals") {
      startTransition(() => {
        setTarget(queryTargetType, queryTargetId);
      });
    }

    if (queryServiceIds) {
      const ids = queryServiceIds.split(",").filter(Boolean);

      startTransition(() => {
        setSelectedServices(ids);
        if (ids.length) {
          setStep(2);
        }
      });
    }
  }, [searchParams, setSelectedServices, setStep, setTarget]);

  useEffect(() => {
    if (status !== "processing") {
      return;
    }

    const timer = window.setTimeout(() => {
      setStatus("done");
    }, 1600);

    return () => window.clearTimeout(timer);
  }, [setStatus, status]);

  const targetEntity =
    targetType === "salons" ? (targetId ? getSalon(targetId) : null) : targetId ? getProfessional(targetId) : null;
  const targetServices = targetEntity
    ? getServicesByIds(targetEntity.serviceIds)
    : services.filter((service) => service.popular).concat(services.filter((service) => !service.popular).slice(0, 6));
  const selectedServices = getServicesByIds(selectedServiceIds);
  const totalMin = selectedServices.reduce((sum, service) => sum + service.minPrice, 0);
  const totalMax = selectedServices.reduce((sum, service) => sum + service.maxPrice, 0);
  const durationMin = selectedServices.reduce((sum, service) => sum + service.durationMin, 0);
  const durationMax = selectedServices.reduce((sum, service) => sum + service.durationMax, 0);

  const canContinue =
    (step === 1 && Boolean(targetType)) ||
    (step === 2 && selectedServiceIds.length > 0) ||
    (step === 3 && Boolean(selectedDate && selectedTime)) ||
    (step === 4 && Boolean(contact.fullName && contact.phone && contact.email)) ||
    step === 5;

  function handleConfirm() {
    setStatus("processing");
  }

  function handleNextStep() {
    if (step === 2 && selectedServiceIds.length > 0) {
      saveBookingDraft();
      setAuthPromptOpen(true);
      return;
    }

    nextStep();
  }

  if (status === "done") {
    return (
      <SectionReveal className="mx-auto max-w-4xl rounded-[36px] bg-white p-6 shadow-[0_22px_60px_rgba(13,27,42,0.1)] lg:p-8">
        <div className="mx-auto max-w-2xl text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[var(--ms-gold)]/15">
            <CheckCircle2 className="h-10 w-10 text-[var(--ms-gold)]" />
          </div>
          <p className="mt-6 text-xs uppercase tracking-[0.24em] text-[var(--ms-mauve)]">Done</p>
          <h1 className="mt-3 text-4xl font-semibold text-[var(--ms-navy)]">Your paid request is confirmed.</h1>
          <p className="mt-3 text-sm leading-7 text-[var(--ms-mauve)]">
            {targetEntity ? `${"name" in targetEntity ? targetEntity.name : "Selected provider"} has your request.` : "Your request has been sent."} The payment is marked as held until service completion is confirmed.
          </p>
          <div className="mt-8 grid gap-4 rounded-[28px] bg-[var(--ms-soft-bg)] p-5 text-left sm:grid-cols-2">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-[var(--ms-mauve)]">Services</p>
              <p className="mt-2 text-sm text-[var(--ms-charcoal)]">
                {selectedServices.map((service) => service.name).join(", ")}
              </p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-[var(--ms-mauve)]">When</p>
              <p className="mt-2 text-sm text-[var(--ms-charcoal)]">
                {selectedDate} · {selectedTime}
              </p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-[var(--ms-mauve)]">Estimated total</p>
              <p className="mt-2 text-sm text-[var(--ms-charcoal)]">{formatPriceRange(totalMin, totalMax)}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-[var(--ms-mauve)]">Payment status</p>
              <p className="mt-2 text-sm text-[var(--ms-charcoal)]">Funded · pending service completion</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-[var(--ms-mauve)]">Notifications</p>
              <p className="mt-2 text-sm text-[var(--ms-charcoal)]">
                {[
                  notifications.email ? "Email" : null,
                  notifications.whatsapp ? "WhatsApp" : null,
                  notifications.text ? "Text" : null,
                ]
                  .filter(Boolean)
                  .join(" · ")}
              </p>
            </div>
          </div>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <CTAButton href="/activity" variant="dark">
              View activity
            </CTAButton>
            <CTAButton
              onClick={() => {
                reset();
              }}
              variant="outline"
            >
              Start another booking
            </CTAButton>
          </div>
        </div>
      </SectionReveal>
    );
  }

  return (
    <div
      className="grid w-full min-w-0 gap-6 xl:grid-cols-[minmax(0,0.66fr)_minmax(320px,0.34fr)]"
      style={{ maxWidth: "min(100%, calc(100vw - 2rem))" }}
    >
      <SectionReveal
        className="w-full overflow-hidden rounded-[36px] bg-white p-5 shadow-[0_22px_60px_rgba(13,27,42,0.1)] sm:p-6 lg:p-8"
        style={{ maxWidth: "min(100%, calc(100vw - 2rem))" }}
      >
        <BreadcrumbTrail
          items={[
            { label: "Home", href: "/" },
            { label: targetType === "salons" ? "Salons" : "Professionals", href: targetType === "salons" ? "/salons" : "/professionals" },
            ...(targetEntity ? [{ label: targetEntity.name, href: `/${targetType}/${targetEntity.slug}` }] : []),
            { label: "Booking" },
          ]}
        />
        <p className="text-xs uppercase tracking-[0.24em] text-[var(--ms-mauve)]">Booking</p>
          <h1 className="mt-3 text-4xl font-semibold text-[var(--ms-navy)]">Choose your beauty moment.</h1>
          <p className="mt-3 max-w-xl text-sm leading-7 text-[var(--ms-mauve)]">
          One calm step at a time. Sign in and payment are required before a provider receives the request.
        </p>
        {isRushBooking ? (
          <div className="mt-5 rounded-[28px] border border-[var(--ms-rose)]/25 bg-[var(--ms-petal)]/80 p-4">
            <p className="text-sm font-semibold text-[var(--ms-plum)]">Rush mode is on. Pick the closest good option and keep moving.</p>
          </div>
        ) : null}
        <div className="mt-6">
          <BookingStepper step={step} />
        </div>

        <div className="mt-8 space-y-6">
          {step === 1 ? (
            <div className="grid gap-4 md:grid-cols-2">
              <button
                className={cn(
                  "rounded-[28px] border px-5 py-6 text-left transition",
                  targetType === "salons"
                    ? "border-[var(--ms-navy)] bg-[var(--ms-navy)] text-white"
                    : "border-[var(--ms-border)] bg-[var(--ms-soft-bg)] text-[var(--ms-navy)]",
                )}
                onClick={() => setTarget("salons", targetId)}
                type="button"
              >
                <p className="text-xs uppercase tracking-[0.22em] opacity-70">Target</p>
                <h2 className="mt-3 text-2xl font-semibold">Salon</h2>
                <p className="mt-2 text-sm leading-6 opacity-80">
                  Best when you want a salon setting, a team, or a wider service menu.
                </p>
              </button>
              <button
                className={cn(
                  "rounded-[28px] border px-5 py-6 text-left transition",
                  targetType === "professionals"
                    ? "border-[var(--ms-magenta)] bg-[var(--ms-magenta)] text-white"
                    : "border-[var(--ms-border)] bg-[var(--ms-soft-bg)] text-[var(--ms-navy)]",
                )}
                onClick={() => setTarget("professionals", targetId)}
                type="button"
              >
                <p className="text-xs uppercase tracking-[0.22em] opacity-70">Target</p>
                <h2 className="mt-3 text-2xl font-semibold">Professional</h2>
                <p className="mt-2 text-sm leading-6 opacity-80">
                  Best when you already know the pro you want or need mobile, specialist-led service.
                </p>
              </button>
            </div>
          ) : null}

          {step === 2 ? (
            <div className="space-y-4">
              <div className="rounded-[28px] bg-[var(--ms-soft-bg)] p-5">
                <p className="text-xs uppercase tracking-[0.22em] text-[var(--ms-mauve)]">Select service</p>
                <h2 className="mt-3 text-2xl font-semibold text-[var(--ms-navy)]">
                  {targetEntity ? `Services available with ${targetEntity.name}` : "Choose what you want done"}
                </h2>
              </div>
              <div className="grid min-w-0 gap-3">
                {targetServices.map((service) => {
                  const active = selectedServiceIds.includes(service.id);

                  return (
                    <button
                      className={cn(
                        "w-full min-w-0 rounded-[24px] border p-4 text-left transition hover:border-[var(--ms-rose)]/35 hover:shadow-[0_14px_34px_rgba(132,36,92,0.09)] active:scale-[0.99]",
                        active
                          ? "border-[var(--ms-magenta)] bg-[var(--ms-magenta)] text-white"
                          : "border-[var(--ms-border)] bg-white text-[var(--ms-charcoal)]",
                      )}
                      key={service.id}
                      onClick={() => toggleService(service.id)}
                      type="button"
                    >
                      <div className="flex min-w-0 flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                        <div className="min-w-0">
                          <p className="text-lg font-semibold">{service.name}</p>
                          <p className={cn("mt-2 break-words text-sm leading-6", active ? "text-white/82" : "text-[var(--ms-mauve)]")}>
                            {service.description}
                          </p>
                        </div>
                        <span className={cn("w-fit rounded-full px-3 py-1 text-xs font-semibold", active ? "bg-white/18" : "bg-[var(--ms-soft-bg)] text-[var(--ms-mauve)]")}>
                          {formatPriceRange(service.minPrice, service.maxPrice)}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ) : null}

          {step === 3 ? (
            <div className="space-y-6">
              <div>
                <p className="text-xs uppercase tracking-[0.22em] text-[var(--ms-mauve)]">Choose date</p>
                <div className="mt-4 flex gap-3 overflow-x-auto pb-2">
                  {bookingDates.map((option) => (
                    <DateChip
                      date={option.date}
                      key={option.date}
                      label={option.label}
                      onClick={() => setDate(option.date)}
                      selected={selectedDate === option.date}
                    />
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.22em] text-[var(--ms-mauve)]">Choose time</p>
                <div className="mt-4 flex flex-wrap gap-3">
                  {bookingTimes.map((time) => (
                    <TimePill key={time} onClick={() => setTime(time)} selected={selectedTime === time} value={time} />
                  ))}
                </div>
              </div>
            </div>
          ) : null}

          {step === 4 ? (
            <div className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <InputField label="Full name" value={contact.fullName} onChange={(value) => setContact("fullName", value)} />
                <InputField label="Phone" value={contact.phone} onChange={(value) => setContact("phone", value)} />
                <InputField label="Email" value={contact.email} onChange={(value) => setContact("email", value)} />
                <div className="rounded-[24px] border border-[var(--ms-border)] bg-[var(--ms-soft-bg)] px-4 py-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-[var(--ms-mauve)]">Booking mode</p>
                  <p className="mt-2 text-sm text-[var(--ms-charcoal)]">
                    {targetType === "salons" ? "Salon booking request" : "Professional booking request"}
                  </p>
                </div>
              </div>
              <label className="block rounded-[24px] border border-[var(--ms-border)] bg-white p-4">
                <span className="text-xs uppercase tracking-[0.2em] text-[var(--ms-mauve)]">Notes</span>
                <textarea
                  className="mt-3 min-h-28 w-full resize-none bg-transparent text-sm leading-6 text-[var(--ms-charcoal)] outline-none placeholder:text-[var(--ms-mauve)]"
                  onChange={(event) => setContact("note", event.target.value)}
                  placeholder="Add hair length, reference look, preferred setup, or any details that matter."
                  value={contact.note}
                />
              </label>
              <div className="grid gap-3">
                <NotificationToggle
                  checked={notifications.email}
                  hint="Receive booking confirmation and reminder updates."
                  label="Email updates"
                  onToggle={() => toggleNotification("email")}
                />
                <NotificationToggle
                  checked={notifications.whatsapp}
                  hint="Best for quick schedule updates and urgent coordination."
                  label="WhatsApp updates"
                  onToggle={() => toggleNotification("whatsapp")}
                />
                <NotificationToggle
                  checked={notifications.text}
                  hint="Use SMS only when you want a simple appointment alert."
                  label="Text reminder"
                  onToggle={() => toggleNotification("text")}
                />
              </div>
            </div>
          ) : null}

          {step === 5 ? (
            <div className="space-y-4">
              <div className="rounded-[28px] bg-[var(--ms-soft-bg)] p-5">
                <p className="text-xs uppercase tracking-[0.22em] text-[var(--ms-mauve)]">Review</p>
                <h2 className="mt-3 text-2xl font-semibold text-[var(--ms-navy)]">Everything visible before you pay.</h2>
                <p className="mt-2 text-sm leading-6 text-[var(--ms-mauve)]">
                  The next production step opens protected checkout before the provider receives the job.
                </p>
              </div>
              <div className="grid gap-4 rounded-[28px] border border-[var(--ms-border)] bg-white p-5 md:grid-cols-2">
                <SummaryItem editStep={1} label="Target" onEdit={setStep} value={targetEntity?.name ?? (targetType === "salons" ? "Salon" : "Professional")} />
                <SummaryItem editStep={2} label="Services" onEdit={setStep} value={selectedServices.map((service) => service.name).join(", ")} />
                <SummaryItem editStep={3} label="Date" onEdit={setStep} value={selectedDate} />
                <SummaryItem editStep={3} label="Time" onEdit={setStep} value={selectedTime} />
                <SummaryItem editStep={4} label="Contact" onEdit={setStep} value={`${contact.fullName} · ${contact.phone}`} />
                <SummaryItem label="Payment rule" value="Pay now · funds held until completion" />
                <SummaryItem label="Notifications" value={[
                  notifications.email ? "Email" : null,
                  notifications.whatsapp ? "WhatsApp" : null,
                  notifications.text ? "Text" : null,
                ].filter(Boolean).join(", ")} />
              </div>
            </div>
          ) : null}
        </div>

        <div className="sticky bottom-20 mt-8 flex items-center gap-3 rounded-[28px] border border-[var(--ms-border)] bg-white/95 p-4 shadow-[0_18px_50px_rgba(13,27,42,0.08)] backdrop-blur md:bottom-6">
          <CTAButton
            className="min-w-[120px]"
            disabled={step === 1}
            onClick={previousStep}
            variant="outline"
          >
            <ChevronLeft className="h-4 w-4" />
            Back
          </CTAButton>
          {step < 5 ? (
            <CTAButton
              className="ml-auto min-w-[160px]"
              disabled={!canContinue}
              onClick={handleNextStep}
            >
              Next step
              <ChevronRight className="h-4 w-4" />
            </CTAButton>
          ) : (
            <CTAButton className="ml-auto min-w-[180px]" onClick={handleConfirm}>
              Pay and confirm
            </CTAButton>
          )}
        </div>
      </SectionReveal>

      <div className="space-y-5">
        <PriceSummary
          durationLabel={
            selectedServices.length
              ? `Estimated duration ${formatDurationRange(durationMin, durationMax)}`
              : "Pick at least one service to see the estimated total."
          }
          priceTotal={selectedServices.length ? formatPriceRange(totalMin, totalMax) : "Select services"}
          serviceCount={selectedServices.length}
        />
        <SectionReveal className="rounded-[32px] border border-[var(--ms-border)] bg-white p-5 shadow-[0_12px_40px_rgba(13,27,42,0.08)]">
          <p className="text-xs uppercase tracking-[0.22em] text-[var(--ms-mauve)]">Selected target</p>
          <h2 className="mt-3 text-2xl font-semibold text-[var(--ms-navy)]">
            {targetEntity?.name ?? (targetType === "salons" ? "Salon request" : "Professional request")}
          </h2>
          <p className="mt-3 text-sm leading-6 text-[var(--ms-mauve)]">
            {targetEntity?.description ??
              "You can start broad here and refine your choice once you compare providers and prices."}
          </p>
          <div className="mt-4 space-y-2 text-sm text-[var(--ms-charcoal)]">
            <p>Target type: {targetType === "salons" ? "Salon booking" : "Professional booking"}</p>
            <p>Best next action: choose the exact services you want completed, then sign in and pay to secure the request.</p>
          </div>
          <div className="mt-5 flex flex-col gap-3">
            <CTAButton href={targetType === "salons" ? "/salons" : "/professionals"} variant="outline">
              Compare more options
            </CTAButton>
            <WhatsAppButton label="booking support" />
          </div>
        </SectionReveal>
      </div>

      {status === "processing" ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(13,27,42,0.72)] px-4">
          <div className="w-full max-w-md rounded-[36px] bg-[linear-gradient(160deg,#0d1b2a_0%,#1f2942_55%,rgba(217,70,239,0.4)_100%)] p-8 text-center text-white shadow-[0_24px_70px_rgba(13,27,42,0.35)]">
            <LoaderCircle className="mx-auto h-12 w-12 animate-spin text-[var(--ms-gold)]" />
            <p className="mt-6 text-xs uppercase tracking-[0.24em] text-white/60">Booking</p>
            <h2 className="mt-3 text-3xl font-semibold">Securing your paid request...</h2>
            <p className="mt-3 text-sm leading-7 text-white/72">
              The professional side sees the service list, time slot, notes, and funded status clearly before accepting.
            </p>
          </div>
        </div>
      ) : null}

      {authPromptOpen ? (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-[rgba(58,24,58,0.5)] px-4 pb-4 backdrop-blur-sm sm:items-center sm:pb-0">
          <div className="relative w-full max-w-md overflow-hidden rounded-[34px] border border-white/70 bg-white p-5 shadow-[0_28px_90px_rgba(132,36,92,0.28)]">
            <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-[var(--ms-blush)]/80 blur-2xl" />
            <div className="absolute -bottom-12 -left-10 h-36 w-36 rounded-full bg-[var(--ms-lilac)]/80 blur-2xl" />
            <div className="relative">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--ms-mauve)]">Saved for you</p>
              <h2 className="mt-3 font-display text-3xl leading-tight text-[var(--ms-plum)]">
                Your services are tucked safely away.
              </h2>
              <p className="mt-3 text-sm leading-7 text-[var(--ms-mauve)]">
                Sign in or create an account to finish the request without losing your choice.
              </p>
              <div className="mt-5 rounded-[24px] bg-[var(--ms-soft-bg)] p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-[var(--ms-mauve)]">Selected</p>
                <p className="mt-2 text-sm font-semibold text-[var(--ms-navy)]">
                  {selectedServices.map((service) => service.name).join(", ")}
                </p>
                <p className="mt-1 text-sm text-[var(--ms-mauve)]">{formatPriceRange(totalMin, totalMax)}</p>
              </div>
              <div className="mt-5 grid gap-3">
                <CTAButton href={`/auth/sign-up?returnTo=${encodeURIComponent("/book?resume=booking")}`}>
                  Create account and continue
                </CTAButton>
                <CTAButton href={`/auth/sign-in?returnTo=${encodeURIComponent("/book?resume=booking")}`} variant="outline">
                  Sign in
                </CTAButton>
                <button
                  className="rounded-full px-4 py-3 text-sm font-semibold text-[var(--ms-mauve)] transition hover:text-[var(--ms-plum)]"
                  onClick={() => setAuthPromptOpen(false)}
                  type="button"
                >
                  Review my services again
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function InputField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block rounded-[24px] border border-[var(--ms-border)] bg-white px-4 py-4">
      <span className="text-xs uppercase tracking-[0.2em] text-[var(--ms-mauve)]">{label}</span>
      <input
        className="mt-3 w-full bg-transparent text-sm text-[var(--ms-charcoal)] outline-none placeholder:text-[var(--ms-mauve)]"
        onChange={(event) => onChange(event.target.value)}
        placeholder={label}
        value={value}
      />
    </label>
  );
}

function SummaryItem({
  label,
  value,
  editStep,
  onEdit,
}: {
  label: string;
  value: string;
  editStep?: number;
  onEdit?: (step: number) => void;
}) {
  return (
    <div>
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs uppercase tracking-[0.2em] text-[var(--ms-mauve)]">{label}</p>
        {editStep && onEdit ? (
          <button
            className="rounded-full bg-[var(--ms-soft-bg)] px-3 py-1 text-xs font-semibold text-[var(--ms-plum)] transition hover:bg-[var(--ms-petal)]"
            onClick={() => onEdit(editStep)}
            type="button"
          >
            Edit
          </button>
        ) : null}
      </div>
      <p className="mt-2 text-sm leading-6 text-[var(--ms-charcoal)]">{value}</p>
    </div>
  );
}
