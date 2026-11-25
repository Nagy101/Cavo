"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Clock,
  MoonStar,
  Sparkles,
  Sun,
  Sunrise,
  Sunset,
} from "lucide-react";
import { dayToNightChapters } from "@/data/copy";
import { trackCavoEvent } from "@/lib/analytics";
import { localePath, type Locale } from "@/lib/i18n";

const chapterAuras = {
  morning: {
    isDark: false,
    sectionBg: "bg-gradient-to-b from-[#f6f3ec] via-[#efeae0] to-[#e9e2d6]",
    cardBg:
      "border-[var(--cavo-border)] bg-gradient-to-br from-[#fbf9f5] via-[#f5f1e9] to-[#ece5da]",
    glowColor: "rgba(205, 174, 130, 0.28)",
    Icon: Sunrise,
  },
  afternoon: {
    isDark: false,
    sectionBg: "bg-gradient-to-b from-[#efeae0] via-[#e6ded1] to-[#dfd5c6]",
    cardBg:
      "border-[var(--cavo-border)] bg-gradient-to-br from-[#f9f6f0] via-[#f0eae0] to-[#e5dccf]",
    glowColor: "rgba(182, 148, 108, 0.28)",
    Icon: Sun,
  },
  sunset: {
    isDark: true,
    sectionBg: "bg-gradient-to-b from-[#332419] via-[#281c13] to-[#20160f]",
    cardBg:
      "border-[#d4b68c]/30 bg-gradient-to-br from-[#3e2c20] via-[#312218] to-[#261a12]",
    glowColor: "rgba(224, 169, 109, 0.22)",
    Icon: Sunset,
  },
  night: {
    isDark: true,
    sectionBg: "bg-gradient-to-b from-[#1b140f] via-[#150f0b] to-[#100c08]",
    cardBg:
      "border-[#d6bc96]/30 bg-gradient-to-br from-[#261d16] via-[#1e1610] to-[#17110c]",
    glowColor: "rgba(214, 188, 150, 0.18)",
    Icon: MoonStar,
  },
} as const;

export function DayToNightSection({ locale }: { locale: Locale }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [inView, setInView] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  const isAr = locale === "ar";
  const current = dayToNightChapters[activeIndex];
  const style = chapterAuras[current.id];
  const isDark = style.isDark;
  const ActiveIcon = style.Icon;

  useEffect(() => {
    const el = sectionRef.current;
    if (!el || typeof window === "undefined" || !("IntersectionObserver" in window)) {
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        setInView(entries.some((entry) => entry.isIntersecting));
      },
      { threshold: 0.25 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!inView || isPaused) return;
    const timer = window.setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % dayToNightChapters.length);
    }, 6200);
    return () => window.clearInterval(timer);
  }, [inView, isPaused, activeIndex]);

  const selectChapter = (idx: number) => {
    setActiveIndex(idx);
    setIsPaused(true);
  };

  return (
    <section
      ref={sectionRef}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className={`relative overflow-hidden border-y transition-colors duration-700 ${
        isDark ? "border-[#d6bc96]/20" : "border-[var(--cavo-border)]"
      } ${style.sectionBg}`}
    >
      {/* Dynamic Atmospheric Glow Shifting from Morning Sun to Evening Candlelight */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 end-1/4 h-[440px] w-[440px] rounded-full blur-3xl transition-all duration-1000"
        style={{
          background: `radial-gradient(circle, ${style.glowColor} 0%, transparent 70%)`,
        }}
      />

      <div className="relative z-10 mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-20 lg:py-24">
        <div className="mb-6 flex flex-col gap-4 sm:mb-10 lg:flex-row lg:items-end lg:justify-between lg:gap-6">
          <div className="min-w-0">
            <p
              className={`inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1 text-[11px] font-semibold shadow-sm transition-colors duration-500 sm:text-xs ${
                isDark
                  ? "border-[#d6bc96]/35 bg-[#2a1f16]/90 text-[#ebd6b5]"
                  : "border-[var(--cavo-border)] bg-[#f8f6f2] text-[var(--cavo-gold-deep)]"
              } ${isAr ? "" : "uppercase tracking-[0.22em]"}`}
            >
              <Sparkles className="h-3 w-3 shrink-0 text-[#d4b488]" />
              <span>
                {isAr
                  ? "04 · إيقاع النيل من الصباح حتى الفجر"
                  : "04 · DAY TO NIGHT ON THE NILE"}
              </span>
            </p>
            <h2
              className={`font-display mt-2.5 text-2xl font-semibold transition-colors duration-500 sm:mt-4 sm:text-5xl ${
                isDark ? "text-[#f8f2e8]" : "text-[var(--cavo-ink)]"
              }`}
            >
              {isAr
                ? "تجربة يتبدّل سحرها مع كل ساعة على النهر."
                : "A Living Atmosphere Shifting With Every Hour."}
            </h2>
          </div>

          {/* Single-Row 4-Period Horizon Switcher */}
          <div
            className={`grid shrink-0 grid-cols-4 gap-1 rounded-2xl border p-1 shadow-sm transition-colors duration-500 sm:inline-flex sm:flex-nowrap sm:gap-1.5 sm:rounded-full sm:p-1.5 ${
              isDark
                ? "border-[#d6bc96]/30 bg-[#231912]/90"
                : "border-[var(--cavo-border)] bg-[#f8f6f2]"
            }`}
            role="tablist"
            aria-label={isAr ? "أوقات الزيارة" : "CAVO Day to Night Periods"}
          >
            {dayToNightChapters.map((chapter, idx) => {
              const selected = idx === activeIndex;
              const ChapterIcon = chapterAuras[chapter.id].Icon;
              return (
                <button
                  key={chapter.id}
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  onClick={() => selectChapter(idx)}
                  className={`relative flex min-h-[40px] min-w-0 shrink-0 items-center justify-center gap-1 whitespace-nowrap rounded-xl px-2 py-2 text-[11px] font-semibold transition-all duration-300 sm:gap-1.5 sm:rounded-full sm:px-4 sm:py-2.5 sm:text-xs ${
                    selected
                      ? "cavo-gold-gradient text-white shadow-md"
                      : isDark
                        ? "text-[#e5d9c8]/85 hover:bg-white/10 hover:text-white"
                        : "text-[var(--cavo-ink)]/85 hover:bg-[var(--cavo-gold-pale)]/70 hover:text-[var(--cavo-gold-deep)]"
                  }`}
                >
                  <ChapterIcon className="h-3.5 w-3.5 shrink-0" />
                  <span className="hidden font-mono text-[10px] opacity-90 xl:inline">
                    {chapter.order}
                  </span>
                  <span className="truncate">{chapter.periodLabel[locale]}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Sculpted Editorial Showcase Card with Stacked Cinema Dissolve */}
        <div
          className={`overflow-hidden rounded-[26px] border p-3 shadow-[0_26px_65px_-22px_rgba(25,18,12,0.28)] transition-all duration-700 sm:rounded-[34px] sm:p-5 ${style.cardBg}`}
        >
          <div className="grid grid-cols-1 items-center gap-5 sm:gap-8 lg:grid-cols-12 lg:gap-10">
            {/* Stacked Crossfade Visual Frame */}
            <div className="group relative aspect-[16/10] w-full min-w-0 overflow-hidden rounded-[18px] bg-[#1e1711] sm:rounded-[24px] lg:col-span-7">
              {dayToNightChapters.map((chapter, idx) => {
                const active = idx === activeIndex;
                return (
                  <div
                    key={chapter.id}
                    aria-hidden={!active}
                    className={`absolute inset-0 transition-opacity duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                      active
                        ? "z-10 opacity-100"
                        : "pointer-events-none z-0 opacity-0"
                    }`}
                  >
                    <div
                      key={active ? `${chapter.id}-ken` : chapter.id}
                      className={
                        active
                          ? "cavo-ken-burns relative h-full w-full"
                          : "relative h-full w-full"
                      }
                    >
                      <Image
                        src={chapter.image}
                        alt={chapter.headline[locale]}
                        fill
                        sizes="(max-width: 1024px) 100vw, 58vw"
                        className="object-cover"
                      />
                    </div>
                  </div>
                );
              })}

              <div className="pointer-events-none absolute inset-0 z-20 bg-gradient-to-t from-[#1a130d]/75 via-transparent to-transparent" />

              <div className="absolute inset-x-3 bottom-3 z-30 flex flex-wrap items-center justify-between gap-2 sm:inset-x-4 sm:bottom-4">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-white/50 bg-[#f6f3ee]/95 px-3 py-1 text-[11px] font-bold text-[var(--cavo-gold-deep)] shadow-md backdrop-blur-md sm:px-4 sm:py-1.5 sm:text-xs">
                  <ActiveIcon className="h-3 w-3 shrink-0 text-[var(--cavo-gold)] sm:h-3.5 sm:w-3.5" />
                  <span>{current.timeRange[locale]}</span>
                </span>

                <span className="rounded-full border border-white/35 bg-[#241b13]/85 px-3 py-1 text-[10px] font-medium text-white backdrop-blur-md sm:text-xs">
                  {current.venueLabel[locale]}
                </span>
              </div>
            </div>

            {/* Narrative & Interactive Timeline Dots */}
            <div className="flex min-w-0 flex-col justify-between p-1.5 sm:p-4 lg:col-span-5">
              <div
                key={current.id}
                className="cavo-swap-in min-w-0 space-y-3 sm:space-y-5"
              >
                <div
                  className={`inline-flex max-w-full items-center gap-2 rounded-full px-3.5 py-1.5 text-[11px] font-bold transition-colors duration-500 sm:text-xs ${
                    isDark
                      ? "border border-[#d6bc96]/30 bg-white/10 text-[#efdcb9]"
                      : "bg-[var(--cavo-gold-pale)] text-[var(--cavo-gold-deep)]"
                  }`}
                >
                  <Clock className="h-3.5 w-3.5 shrink-0 text-[#d4b488]" />
                  <span className="break-words">
                    {current.timeRange[locale]} · {current.venueLabel[locale]}
                  </span>
                </div>

                <h3
                  className={`font-display text-2xl font-semibold transition-colors duration-500 sm:text-4xl ${
                    isDark ? "text-[#f8f2e8]" : "text-[var(--cavo-ink)]"
                  }`}
                >
                  {current.headline[locale]}
                </h3>

                <p
                  className={`break-words text-xs leading-relaxed transition-colors duration-500 sm:text-base ${
                    isDark ? "text-[#ded2c0]" : "text-[var(--cavo-smoke)]"
                  }`}
                >
                  {current.description[locale]}
                </p>
              </div>

              {/* Progress Timeline Strip */}
              <div
                className={`mt-5 border-t pt-4 transition-colors duration-500 sm:mt-8 sm:pt-6 ${
                  isDark
                    ? "border-[#d6bc96]/20"
                    : "border-[var(--cavo-border)]"
                }`}
              >
                <div className="mb-4 flex items-center gap-2 sm:mb-6">
                  {dayToNightChapters.map((ch, idx) => (
                    <button
                      key={ch.id}
                      type="button"
                      onClick={() => selectChapter(idx)}
                      className="group min-h-[38px] min-w-0 flex-1 text-start"
                    >
                      <div
                        className={`h-1.5 w-full overflow-hidden rounded-full transition-all duration-500 ${
                          idx === activeIndex
                            ? isDark
                              ? "bg-[#e5caa4]"
                              : "cavo-gold-gradient"
                            : idx < activeIndex
                              ? isDark
                                ? "bg-[#d6bc96]/55"
                                : "bg-[var(--cavo-gold)]/55"
                              : isDark
                                ? "bg-white/15 group-hover:bg-white/30"
                                : "bg-[var(--cavo-gold)]/20 group-hover:bg-[var(--cavo-gold)]/40"
                        }`}
                      />
                      <span
                        className={`mt-1.5 block truncate text-[11px] font-semibold transition-colors ${
                          idx === activeIndex
                            ? isDark
                              ? "text-[#f3dfc1]"
                              : "text-[var(--cavo-gold-deep)]"
                            : isDark
                              ? "text-[#cbbca6]/75 group-hover:text-white"
                              : "text-[var(--cavo-smoke)] group-hover:text-[var(--cavo-ink)]"
                        }`}
                      >
                        {ch.periodLabel[locale]}
                      </span>
                    </button>
                  ))}
                </div>

                <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
                  <Link
                    href={localePath(
                      locale,
                      `experiences/${current.venueSlug}`
                    )}
                    onClick={() =>
                      trackCavoEvent("experience_select", {
                        venue: current.venueSlug,
                        source: "day_to_night",
                      })
                    }
                    className={`cavo-btn-gold group inline-flex min-h-[42px] items-center gap-1.5 rounded-full px-5 py-2.5 text-xs font-semibold sm:px-6 sm:py-3 ${
                      isAr ? "" : "uppercase tracking-[0.15em]"
                    }`}
                  >
                    <span>
                      {isAr
                        ? `اكتشف ${current.venueLabel.ar}`
                        : `Explore ${current.venueLabel.en}`}
                    </span>
                    <ArrowRight className="h-3.5 w-3.5 rtl:rotate-180" />
                  </Link>

                  <Link
                    href={localePath(
                      locale,
                      `book?venue=${current.venueSlug}`
                    )}
                    className={`inline-flex min-h-[42px] items-center rounded-full border px-5 py-2.5 text-xs font-semibold transition-all duration-300 sm:py-3 ${
                      isDark
                        ? "border-[#d6bc96]/45 bg-white/10 text-[#f8f2e8] hover:bg-white/20"
                        : "cavo-btn-pearl"
                    }`}
                  >
                    {isAr ? "احجز الآن" : "Reserve"}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
