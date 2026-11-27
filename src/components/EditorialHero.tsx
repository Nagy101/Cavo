"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Clock,
  Compass,
  Play,
  Sparkles,
} from "lucide-react";
import { triggerCavoIntroReplay } from "@/components/CavoWelcomeIntro";
import { AnimatedCounter } from "@/components/MotionPrimitives";
import { trackCavoEvent } from "@/lib/analytics";
import { localePath, type Locale } from "@/lib/i18n";

interface EditorialHeroProps {
  locale: Locale;
}

const heroScenes = [
  {
    id: "pergola-day",
    venueSlug: "main-restaurant",
    src: "/media/hero/cavo-nile-room.jpg",
    badge: { en: "01 · Main Restaurant", ar: "01 · المطعم الرئيسي" },
    title: {
      en: "A CAVO lounge with a wide Nile view",
      ar: "جلسات كافو بإطلالة واسعة على النيل",
    },
    time: { en: "Morning & Daytime", ar: "إشراقة الصباح والنهار" },
  },
  {
    id: "terrace-edge",
    venueSlug: "boat",
    src: "/media/hero/main-terrace.jpg",
    badge: { en: "02 · Nile-Edge Terrace", ar: "02 · تراس ضفة النيل" },
    title: {
      en: "Artisanal Morning Spreads Directly Above the Water",
      ar: "مائدة الفطار الصباحي مباشرة على صفحة النيل",
    },
    time: { en: "From 8:00 AM Daily", ar: "يومياً من 8:00 صباحاً" },
  },
  {
    id: "golden-dusk",
    venueSlug: "elite",
    src: "/media/hero/main-evening.jpg",
    badge: { en: "03 · Golden Dusk Glow", ar: "03 · توهّج المساء الدافئ" },
    title: {
      en: "Warm Backlit Architecture & Evening Hospitality",
      ar: "الإضاءة المعمارية الدافئة وأمسيات الزمالك الراقية",
    },
    time: { en: "Sunset to 4:00 AM", ar: "من الغروب حتى 4:00 فجراً" },
  },
  {
    id: "private-yacht",
    venueSlug: "private-yacht",
    src: "/media/venues/private-yacht/yacht-night-dinner.jpg",
    badge: { en: "04 · Yachts by Cavo", ar: "04 · اليخت الخاص" },
    title: {
      en: "Private Nile Charters Facing Cairo Tower",
      ar: "رحلات اليخت الخاص بإطلالة بانورامية على برج القاهرة",
    },
    time: { en: "Bespoke Private Cruises", ar: "رحلات ومناسبات خاصة" },
  },
] as const;

export function EditorialHero({ locale }: EditorialHeroProps) {
  const isAr = locale === "ar";
  const [activeScene, setActiveScene] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartXRef = useRef<number | null>(null);

  useEffect(() => {
    if (isPaused || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setInterval(() => {
      setActiveScene((prev) => (prev + 1) % heroScenes.length);
    }, 7000);
    return () => window.clearInterval(timer);
  }, [isPaused, activeScene]);

  const currentScene = heroScenes[activeScene];

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0]?.clientX ?? null;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartXRef.current === null) return;
    const endX = e.changedTouches[0]?.clientX ?? touchStartXRef.current;
    const deltaX = endX - touchStartXRef.current;
    touchStartXRef.current = null;
    if (Math.abs(deltaX) < 38) return;

    const direction = deltaX < 0 ? 1 : -1;
    const step = isAr ? -direction : direction;
    setActiveScene(
      (prev) => (prev + step + heroScenes.length) % heroScenes.length
    );
  };

  const marqueeItems = isAr
    ? [
        { lead: "كافو آيلاند", detail: "مركب نايل سيتي · الزمالك" },
        { lead: "المطعم الرئيسي", detail: "فطار وغداء وعشاء على النيل" },
        { lead: "المركب المفتوح", detail: "جلسات على ضفة النهر" },
        { lead: "يخوت كافو", detail: "رحلات وحفلات خاصة" },
        { lead: "كافو إيليت", detail: "أمسيات راقية وسهر مميز" },
        { lead: "+378 صنف", detail: "مطبخ كافو الرسمي" },
        { lead: "يومياً", detail: "من 8:00 صباحاً حتى 4:00 فجراً" },
      ]
    : [
        { lead: "CAVO Island", detail: "Nile City Boat · Zamalek" },
        { lead: "Main Restaurant", detail: "All-Day Riverside Dining" },
        { lead: "The Boat", detail: "Open-Air Nile Deck" },
        { lead: "Yachts by Cavo", detail: "Private Nile Charters" },
        { lead: "CAVO Elite", detail: "Elevated Evening Lounge" },
        { lead: "378+ Creations", detail: "Official Kitchen Menu" },
        { lead: "Open Daily", detail: "8:00 AM – 4:00 AM" },
      ];

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#f6f3ee] via-[#efeae1] to-[#e7dfd3] pt-[74px] text-[var(--cavo-ink)] sm:pt-24 lg:pt-28">
      {/* Subtle Sunlit Riviera Ambient Glows */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 start-1/4 h-[420px] w-[420px] -translate-x-1/2 rounded-full opacity-55 blur-3xl"
        style={{
          background:
            "radial-gradient(circle, rgba(196,169,132,0.28) 0%, rgba(196,169,132,0) 70%)",
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-12 end-0 h-[380px] w-[380px] rounded-full opacity-45 blur-3xl"
        style={{
          background:
            "radial-gradient(circle, rgba(158,132,102,0.24) 0%, rgba(158,132,102,0) 72%)",
        }}
      />

      <div className="relative z-10 mx-auto max-w-7xl px-4 pt-2 pb-7 sm:px-6 sm:pt-6 sm:pb-14 lg:pt-8 lg:pb-16">
        <div className="grid grid-cols-1 items-center gap-5 sm:gap-8 lg:grid-cols-12 lg:gap-12">
          {/* COPY & CTAs — Second on Mobile (right under the hero photo), First on Desktop */}
          <div className="cavo-rise order-2 min-w-0 lg:order-1 lg:col-span-6">
            {/* Compact Location & Live Status Pill */}
            <div className="inline-flex max-w-full items-center gap-2 rounded-full border border-[var(--cavo-gold)]/40 bg-[#fbf9f5]/95 px-3 py-1 shadow-[0_8px_24px_-12px_rgba(70,54,36,0.18)] backdrop-blur-sm sm:px-3.5 sm:py-1.5">
              <span className="relative flex h-2 w-2 shrink-0">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--cavo-gold)] opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-[var(--cavo-gold-deep)]" />
              </span>
              <span
                className={`break-words text-[10px] font-semibold text-[var(--cavo-gold-deep)] sm:text-xs ${
                  isAr ? "" : "uppercase tracking-[0.18em]"
                }`}
              >
                {isAr
                  ? "مركب نايل سيتي · الزمالك، القاهرة"
                  : "Nile City Boat · Zamalek, Cairo"}
              </span>
            </div>

            {/* Monumental Responsive Headline */}
            <h1
              className={`font-display mt-3 text-[1.95rem] font-semibold text-[var(--cavo-ink)] sm:mt-5 sm:text-5xl md:text-[3.4rem] lg:text-[4.15rem] xl:text-[4.4rem] ${
                isAr ? "leading-[1.22]" : "leading-[1.06]"
              }`}
            >
              {isAr ? (
                <>
                  القاهرة، من منظور{" "}
                  <span className="cavo-gold-text">أكثر فخامة على النيل.</span>
                </>
              ) : (
                <>
                  Cairo, From a{" "}
                  <span className="cavo-gold-text italic">
                    Different Point of View.
                  </span>
                </>
              )}
            </h1>

            <p className="mt-2.5 max-w-xl break-words text-[13px] leading-relaxed text-[var(--cavo-smoke)] sm:mt-5 sm:text-base lg:text-lg">
              {isAr
                ? "ابدأ بفطار على ضوء النيل، كمّل بأمسية على المركب، أو خلّي مناسبتك رحلة خاصة وسط القاهرة."
                : "Start with a sunlit breakfast, linger for an evening by the river, or take the celebration out on a private yacht."}
            </p>

            {/* Mobile-Perfected CTA Hierarchy: Zero text truncation on any phone width */}
            <div className="mt-4 flex flex-col gap-2.5 sm:mt-7 sm:flex-row sm:flex-wrap sm:items-center sm:gap-3">
              <Link
                href={localePath(locale, "book")}
                onClick={() =>
                  trackCavoEvent("booking_start", { source: "hero" })
                }
                className={`cavo-btn-gold group inline-flex min-h-[46px] w-full items-center justify-center gap-2 rounded-full px-6 py-3 text-xs font-semibold sm:w-auto sm:px-8 sm:py-4 ${
                  isAr ? "" : "uppercase tracking-[0.16em]"
                }`}
              >
                <span>
                  {isAr ? "احجز تجربتك الآن" : "RESERVE EXPERIENCE"}
                </span>
                <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1" />
              </Link>

              <div className="grid grid-cols-2 gap-2.5 sm:contents">
                <a
                  href="#experiences"
                  className={`cavo-btn-pearl group inline-flex min-h-[44px] items-center justify-center gap-1.5 rounded-full px-3.5 py-3 text-[11px] font-semibold sm:gap-2 sm:px-6 sm:py-4 sm:text-xs ${
                    isAr ? "" : "uppercase tracking-[0.14em]"
                  }`}
                >
                  <Compass className="h-3.5 w-3.5 shrink-0 text-[var(--cavo-gold-deep)] transition-transform duration-500 group-hover:rotate-45" />
                  <span className="whitespace-nowrap">
                    {isAr ? "التجارب الأربع" : "4 VENUES"}
                  </span>
                </a>

                <button
                  type="button"
                  onClick={triggerCavoIntroReplay}
                  className={`cavo-btn-pearl group inline-flex min-h-[44px] items-center justify-center gap-1.5 rounded-full px-3.5 py-3 text-[11px] font-semibold sm:gap-2 sm:px-6 sm:py-4 sm:text-xs ${
                    isAr ? "" : "uppercase tracking-[0.14em]"
                  }`}
                >
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[var(--cavo-gold-pale)] text-[var(--cavo-gold-deep)] transition-transform duration-300 group-hover:scale-110">
                    <Play className="h-2.5 w-2.5 fill-current" />
                  </span>
                  <span className="whitespace-nowrap">
                    {isAr ? "فيلم كافو" : "WATCH FILM"}
                  </span>
                </button>
              </div>
            </div>

            {/* Refined 3-Pillar Signature Hospitality Strip */}
            <div className="mt-5 grid grid-cols-3 divide-x divide-[var(--cavo-border)] rounded-2xl border border-[var(--cavo-gold)]/28 bg-[#fbf9f5]/88 px-2.5 py-2.5 text-center shadow-[0_12px_30px_-18px_rgba(70,54,36,0.18)] sm:mt-8 sm:max-w-lg sm:rounded-[22px] sm:px-4 sm:py-3.5 rtl:divide-x-reverse">
              <div className="px-1.5 sm:px-2">
                <p className="font-display text-lg font-bold text-[var(--cavo-gold-deep)] sm:text-2xl">
                  <AnimatedCounter target={4} padZero />
                </p>
                <p className="mt-0.5 text-[10px] font-semibold text-[var(--cavo-smoke)] sm:text-[11px]">
                  {isAr ? "تجارب على النيل" : "Nile Venues"}
                </p>
              </div>
              <div className="px-1.5 sm:px-2">
                <p className="font-display text-lg font-bold text-[var(--cavo-gold-deep)] sm:text-2xl">
                  <AnimatedCounter target={378} suffix="+" />
                </p>
                <p className="mt-0.5 text-[10px] font-semibold text-[var(--cavo-smoke)] sm:text-[11px]">
                  {isAr ? "صنف بالمنيو" : "Menu Items"}
                </p>
              </div>
              <div className="px-1.5 sm:px-2">
                <p className="font-display text-lg font-bold text-[var(--cavo-gold-deep)] sm:text-2xl">
                  <AnimatedCounter target={20} suffix={isAr ? " س" : "h"} />
                </p>
                <p className="mt-0.5 text-[10px] font-semibold text-[var(--cavo-smoke)] sm:text-[11px]">
                  {isAr ? "8 ص – 4 فجراً" : "8 AM – 4 AM"}
                </p>
              </div>
            </div>
          </div>

          {/* ARCHITECTURAL PHOTO SHOWCASE — First on Mobile (Visual-First!), Second on Desktop */}
          <div
            style={{ "--d": "0.08s" } as React.CSSProperties}
            className="cavo-rise relative order-1 min-w-0 lg:order-2 lg:col-span-6"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            {/* Outer Architectural Double-Frame */}
            <div className="relative mx-auto max-w-2xl rounded-[22px] border border-[var(--cavo-gold)]/45 bg-gradient-to-b from-[#fbf9f5] to-[#f2ece2] p-2 shadow-[0_24px_60px_-22px_rgba(65,48,30,0.26)] sm:rounded-[36px] sm:p-3.5 lg:max-w-xl xl:max-w-2xl">
              {/* Main Showcase Canvas with Stacked Crossfade + Swipe */}
              <div
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
                className="relative aspect-[16/11] w-full overflow-hidden rounded-[17px] bg-[#241c15] sm:rounded-[28px] lg:aspect-[4/4.35]"
              >
                {heroScenes.map((scene, idx) => {
                  const isActive = idx === activeScene;
                  return (
                    <div
                      key={scene.id}
                      aria-hidden={!isActive}
                      className={`absolute inset-0 transition-opacity duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                        isActive
                          ? "z-10 opacity-100"
                          : "pointer-events-none z-0 opacity-0"
                      }`}
                    >
                      <div
                        key={isActive ? `${scene.id}-live` : scene.id}
                        className={
                          isActive && !isPaused
                            ? "cavo-ken-burns relative h-full w-full"
                            : "relative h-full w-full"
                        }
                      >
                        <Image
                          src={scene.src}
                          alt={scene.title[locale]}
                          fill
                          priority={idx === 0}
                          fetchPriority={idx === 0 ? "high" : "auto"}
                          quality={84}
                          sizes="(max-width: 1024px) 100vw, 50vw"
                          className="object-cover object-center"
                        />
                      </div>
                    </div>
                  );
                })}

                {/* Multi-Stop Cinema Vignette for Crisp Caption Legibility */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-x-0 top-0 z-20 h-20 bg-gradient-to-b from-[#1e1710]/45 to-transparent sm:h-24"
                />
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-3/5 bg-gradient-to-t from-[#1f1710]/90 via-[#1f1710]/38 to-transparent"
                />

                {/* Top Floating Glass Scene Badge & Time */}
                <div className="absolute inset-x-2.5 top-2.5 z-30 flex items-center justify-between gap-2 sm:inset-x-4 sm:top-4">
                  <span className="inline-flex min-w-0 items-center gap-1.5 rounded-full border border-white/55 bg-[#f8f5ef]/95 px-2.5 py-1 text-[10px] font-semibold text-[var(--cavo-ink)] shadow-md backdrop-blur-md sm:px-3.5 sm:py-1.5 sm:text-xs">
                    <Sparkles className="h-3 w-3 shrink-0 text-[var(--cavo-gold)]" />
                    <span className="truncate">{currentScene.badge[locale]}</span>
                  </span>

                  <span className="inline-flex shrink-0 items-center gap-1 rounded-full border border-white/30 bg-[#231b13]/80 px-2.5 py-1 text-[10px] font-medium text-[#f6f3ee] backdrop-blur-md sm:px-3.5 sm:py-1.5 sm:text-[11px]">
                    <Clock className="h-3 w-3 shrink-0 text-[#e4c89e]" />
                    <span>{currentScene.time[locale]}</span>
                  </span>
                </div>

                {/* Bottom Caption, Direct Link & Live Timer Dots */}
                <div className="absolute inset-x-3 bottom-2.5 z-30 flex flex-col gap-1.5 sm:inset-x-5 sm:bottom-4 sm:gap-2.5">
                  <p
                    key={currentScene.id}
                    className="cavo-swap-in font-display line-clamp-1 text-base font-semibold leading-snug text-white drop-shadow-[0_4px_16px_rgba(0,0,0,0.55)] sm:line-clamp-none sm:text-2xl lg:text-[1.75rem]"
                  >
                    {currentScene.title[locale]}
                  </p>

                  <div className="flex items-center justify-between gap-2">
                    {/* Scene Switcher Dots with Live Progress Fill */}
                    <div
                      className="-ms-1.5 flex items-center"
                      role="tablist"
                      aria-label={
                        isAr ? "مشاهد كافو" : "CAVO Atmosphere Scenes"
                      }
                    >
                      {heroScenes.map((scene, idx) => {
                        const active = idx === activeScene;
                        return (
                          <button
                            key={scene.id}
                            type="button"
                            role="tab"
                            aria-selected={active}
                            onClick={() => setActiveScene(idx)}
                            aria-label={scene.title[locale]}
                            className="group flex min-h-[28px] min-w-[26px] items-center justify-center px-1 py-2"
                          >
                            <span
                              className={`relative block h-1.5 overflow-hidden rounded-full transition-all duration-500 sm:h-2.5 ${
                                active
                                  ? "w-9 bg-white/30 sm:w-13"
                                  : "w-1.5 bg-white/55 group-hover:w-5 group-hover:bg-white/90 sm:w-2.5"
                              }`}
                            >
                              {active && !isPaused && (
                                <span
                                  key={`timer-${activeScene}`}
                                  className="cavo-scene-timer absolute inset-0 rounded-full bg-[#e6cba3]"
                                />
                              )}
                              {active && isPaused && (
                                <span className="absolute inset-0 rounded-full bg-[#e6cba3]" />
                              )}
                            </span>
                          </button>
                        );
                      })}
                    </div>

                    <Link
                      href={localePath(
                        locale,
                        `experiences/${currentScene.venueSlug}`
                      )}
                      className="inline-flex items-center gap-1 rounded-full border border-white/30 bg-white/15 px-3 py-1 text-[10px] font-semibold text-white backdrop-blur-md transition hover:bg-white/25 sm:text-xs"
                    >
                      <span>{isAr ? "استكشف" : "Explore"}</span>
                      <ArrowRight className="h-3 w-3 rtl:rotate-180" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sunlit Warm Champagne-Cashmere Seamless Marquee Ribbon */}
      <div
        dir="ltr"
        aria-label={isAr ? "شريط تجارب كافو آيلاند" : "CAVO Island Highlights"}
        className="relative overflow-hidden border-y border-[var(--cavo-gold)]/32 bg-gradient-to-r from-[#eae2d5] via-[#f5efe6] to-[#eae2d5] py-3 text-[var(--cavo-ink)] shadow-[inset_0_1px_0_rgba(255,255,255,0.65)] sm:py-3.5"
      >
        <div className="cavo-edge-mask relative overflow-hidden">
          <div className="animate-cavo-marquee">
            {[0, 1].map((trackIdx) => (
              <div
                key={trackIdx}
                aria-hidden={trackIdx === 1}
                className="flex shrink-0 items-center gap-7 pr-7 sm:gap-11 sm:pr-11"
              >
                {marqueeItems.map((item) => (
                  <div
                    key={`${trackIdx}-${item.lead}`}
                    className="flex shrink-0 items-center gap-7 sm:gap-11"
                  >
                    <div
                      dir={isAr ? "rtl" : "ltr"}
                      className="flex items-baseline gap-2 whitespace-nowrap sm:gap-2.5"
                    >
                      <span
                        className={`font-display text-sm font-bold text-[var(--cavo-gold-deep)] sm:text-base ${
                          isAr ? "" : "italic tracking-wide"
                        }`}
                      >
                        {item.lead}
                      </span>
                      <span
                        className={`text-[11px] font-medium text-[var(--cavo-smoke)] sm:text-xs ${
                          isAr ? "" : "uppercase tracking-[0.14em]"
                        }`}
                      >
                        {item.detail}
                      </span>
                    </div>
                    <span
                      aria-hidden="true"
                      className="inline-block h-1.5 w-1.5 shrink-0 rotate-45 bg-[var(--cavo-gold)]/80"
                    />
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
