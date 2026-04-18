"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Sparkles, UserRound, WandSparkles, X } from "lucide-react";
import { useEffect, useState } from "react";

import { CTAButton } from "@/components/marketplace-ui";

const ROLE_CHOICE_KEY = "mobile-salon.role-choice.v1";

type RoleChoice = "client" | "professional" | "explore";

function rememberChoice(choice: RoleChoice) {
  try {
    window.localStorage.setItem(ROLE_CHOICE_KEY, choice);
  } catch {
    try {
      window.sessionStorage.setItem(ROLE_CHOICE_KEY, choice);
    } catch {
      // Storage can be blocked in private modes; the modal still closes for this visit.
    }
  }
}

export function RoleChoiceModal() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let storedChoice: string | null = null;

    try {
      storedChoice = window.localStorage.getItem(ROLE_CHOICE_KEY);
    } catch {
      try {
        storedChoice = window.sessionStorage.getItem(ROLE_CHOICE_KEY);
      } catch {
        storedChoice = null;
      }
    }

    if (!storedChoice) {
      const timer = window.setTimeout(() => setVisible(true), 650);

      return () => window.clearTimeout(timer);
    }

    return undefined;
  }, []);

  function close(choice: RoleChoice) {
    rememberChoice(choice);
    setVisible(false);
  }

  return (
    <AnimatePresence>
      {visible ? (
        <motion.div
          aria-modal="true"
          className="fixed inset-0 z-[70] flex items-end justify-center bg-[rgba(13,27,42,0.32)] px-4 pb-4 backdrop-blur-[7px] sm:items-center sm:pb-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          role="dialog"
        >
          <motion.div
            className="relative w-full max-w-[22rem] overflow-hidden rounded-[36px] border border-[var(--ms-border)] bg-white p-5 shadow-[0_32px_100px_rgba(13,27,42,0.22)] sm:max-w-lg sm:p-6"
            initial={{ opacity: 0, scale: 0.96, y: 18 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 18 }}
            transition={{ duration: 0.32, ease: "easeOut" }}
          >
            <button
              aria-label="Close role choice and explore"
              className="absolute right-4 top-4 z-10 rounded-full border border-[var(--ms-border)] bg-white/80 p-2 text-[var(--ms-mauve)] transition hover:border-[var(--ms-rose)]/40 hover:text-[var(--ms-plum)]"
              onClick={() => close("explore")}
              type="button"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="relative">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--ms-petal)] text-[var(--ms-rose)]">
                <Sparkles className="h-5 w-5" />
              </span>
              <p className="mt-5 text-xs font-semibold uppercase tracking-[0.24em] text-[var(--ms-mauve)]">
                You are in the right place
              </p>
              <h2 className="mt-3 break-words font-display text-3xl leading-tight text-[var(--ms-plum)] sm:text-4xl">
                How would you like to use Mobile Salon today?
              </h2>
              <p className="mt-3 text-sm leading-7 text-[var(--ms-mauve)]">
                Book calmly as a client, or build a professional beauty page. You can also close this and simply explore.
              </p>

              <div className="mt-5 grid gap-3">
                <Link
                  className="group rounded-[28px] border border-[var(--ms-gold)]/30 bg-[var(--ms-soft-bg)] p-4 text-left transition hover:-translate-y-0.5 hover:border-[var(--ms-gold)] hover:bg-white"
                  href="/book?rush=true"
                  onClick={() => close("client")}
                >
                  <div className="flex items-start gap-3">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white text-[var(--ms-gold)] shadow-[0_10px_24px_rgba(13,27,42,0.08)]">
                      <UserRound className="h-5 w-5" />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-lg font-semibold text-[var(--ms-plum)]">Continue as Client</span>
                      <span className="mt-1 block break-words text-sm leading-6 text-[var(--ms-mauve)]">
                        Find services, compare prices, choose time, and secure your booking.
                      </span>
                    </span>
                  </div>
                </Link>

                <Link
                  className="group rounded-[28px] border border-[var(--ms-border)] bg-white p-4 text-left transition hover:-translate-y-0.5 hover:border-[var(--ms-gold)]/60 hover:shadow-[0_18px_44px_rgba(13,27,42,0.1)]"
                  href="/onboarding/professional"
                  onClick={() => close("professional")}
                >
                  <div className="flex items-start gap-3">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[var(--ms-soft-bg)] text-[var(--ms-plum)]">
                      <WandSparkles className="h-5 w-5" />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-lg font-semibold text-[var(--ms-navy)]">Continue as Professional</span>
                      <span className="mt-1 block break-words text-sm leading-6 text-[var(--ms-mauve)]">
                        Set services, portfolio, availability, and payout readiness.
                      </span>
                    </span>
                  </div>
                </Link>
              </div>

              <div className="mt-5 flex justify-center">
                <CTAButton onClick={() => close("explore")} variant="outline">
                  Explore first
                </CTAButton>
              </div>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
