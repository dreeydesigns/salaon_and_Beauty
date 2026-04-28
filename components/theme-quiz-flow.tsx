"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowRight, ChevronLeft, Sparkles } from "lucide-react";

import {
  applyThemeQuizResult,
  readClientSession,
  writeQuizTheme,
  writeSignupDraft,
} from "@/lib/client-session";
import {
  getThemeConfig,
  scoreThemeQuiz,
  themeQuizQuestions,
  type ThemeKey,
} from "@/lib/personalization";
import { cn } from "@/lib/utils";

export function ThemeQuizFlow() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<ThemeKey[]>([]);
  const question = themeQuizQuestions[step];
  const progress = ((step + 1) / themeQuizQuestions.length) * 100;
  const returnTo = searchParams.get("returnTo");
  const safeReturnTo = returnTo?.startsWith("/") ? returnTo : "/signup/client";

  function selectAnswer(theme: ThemeKey) {
    const nextAnswers = [...answers];
    nextAnswers[step] = theme;
    setAnswers(nextAnswers);

    if (step < themeQuizQuestions.length - 1) {
      setStep((current) => current + 1);
      return;
    }

    const result = scoreThemeQuiz(nextAnswers);
    const themeConfig = getThemeConfig(result.theme);
    writeQuizTheme(result.theme);

    if (readClientSession()) {
      applyThemeQuizResult(result);
      router.push(returnTo?.startsWith("/") ? returnTo : "/home");
      return;
    }

    writeSignupDraft({
      theme: result.theme,
      tribeBadge: themeConfig.tribeBadge,
      quiz: result,
    });
    router.push(safeReturnTo);
  }

  return (
    <main className="min-h-screen bg-white px-4 py-5 text-[var(--ms-charcoal)]">
      <section className="mx-auto grid min-h-[calc(100vh-2.5rem)] max-w-3xl content-center">
        <div className="overflow-hidden rounded-[38px] border border-[var(--ms-border)] bg-white shadow-[0_24px_80px_rgba(13,27,42,0.1)]">
          <div className="bg-[var(--ms-plum)] p-5 text-white">
            <div className="flex items-center justify-between gap-4">
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/12 text-[var(--ms-blush)]">
                <Sparkles className="h-5 w-5" />
              </span>
              <div className="flex items-center gap-2">
                <Link
                  className="inline-flex min-h-10 items-center rounded-full bg-white/10 px-4 text-sm font-semibold text-white"
                  href={safeReturnTo}
                >
                  Skip for now
                </Link>
                <button
                  className="inline-flex min-h-10 items-center gap-2 rounded-full bg-white/10 px-4 text-sm font-semibold text-white disabled:opacity-40"
                  disabled={step === 0}
                  onClick={() => setStep((current) => Math.max(0, current - 1))}
                  type="button"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Back
                </button>
              </div>
            </div>
            <div className="mt-6 h-2 overflow-hidden rounded-full bg-white/12">
              <div
                className="h-full rounded-full bg-[linear-gradient(90deg,var(--ms-rose),var(--ms-gold))] transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="mt-5 text-xs font-semibold uppercase tracking-[0.24em] text-white/58">{question.eyebrow}</p>
            <h1 className="mt-3 font-display text-4xl leading-tight">{question.question}</h1>
            <p className="mt-3 text-sm leading-7 text-white/68">Optional. Ten quick taps to shape your feed.</p>
          </div>

          <div className="grid gap-3 p-4 sm:p-5">
            {question.answers.map((option) => {
              const theme = getThemeConfig(option.theme);
              const active = answers[step] === option.theme;

              return (
                <button
                  className={cn(
                    "group min-h-20 rounded-[26px] border p-4 text-left transition hover:-translate-y-0.5 hover:shadow-[0_16px_34px_rgba(13,27,42,0.08)]",
                    active ? "border-transparent text-white" : "border-[var(--ms-border)] bg-[var(--ms-soft-bg)] text-[var(--ms-navy)]",
                  )}
                  key={option.id}
                  onClick={() => selectAnswer(option.theme)}
                  style={active ? { backgroundColor: theme.accentColor } : undefined}
                  type="button"
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-base font-semibold">{option.label}</span>
                    <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                  </div>
                  <p className={cn("mt-2 text-sm leading-6", active ? "text-white/78" : "text-[var(--ms-mauve)]")}>
                    {option.copy}
                  </p>
                </button>
              );
            })}
          </div>
        </div>
      </section>
    </main>
  );
}
