"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Clock,
  Compass,
  MapPin,
  Play,
  Sparkles,
  Star,
  UtensilsCrossed,
} from "lucide-react";
import { triggerCavoIntroReplay } from "@/components/CavoWelcomeIntro";
import { venues } from "@/data/venues";
import { trackCavoEvent } from "@/lib/analytics";
import { localePath, type Locale } from "@/lib/i18n";

interface EditorialHeroProps {
  locale: Locale;
}

const heroScenes = [
  {
    id: "pergola-day",
    venueSlug: "main-restaurant",
    src: "/media/hero/main-day.jpg",
    badge: { en: "01 · Main Restaurant", ar: "01 · المطعم الرئيسي" },
    title: {
      en: "Sunlit Timber Pergola & Bouclé Lounges",
      ar: "البرجولا الخشبية المشمسة وجلسات البوكليه الفاخرة",
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
    if (isPaused) return;
    const timer = window.setInterval(() => {
      setActiveScene((prev) => (prev + 1) % heroScenes.length);
    }, 5500);
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

    // Natural swipe direction for both LTR & RTL
    const direction = deltaX < 0 ? 1 : -1;
    const step = isAr ? -direction : direction;
    setActiveScene(
      (prev) => (prev + step + heroScenes.length) % heroScenes.length
    );
  };

  const marqueeItems = isAr
    ? [
        "مركب نايل سيتي · كورنيش الزمالك",
        "المطعم الرئيسي · ضيافة طوال اليوم",
        "المركب (BOAT) · جلسات مفتوحة على النيل",
        "يخوت كافو · رحلات وحفلات خاصة",
        "كافو إيليت · فخامة الغداء والسهر",
        "378+ صنف في المنيو الرسمي",
        "يومياً من 8:00 صباحاً حتى 4:00 فجراً",
      ]
    : [
        "NILE CITY BOAT · ZAMALEK CORNICHE",
        "MAIN RESTAURANT · ALL-DAY ARCHITECTURE",
        "THE BOAT · OPEN-AIR NILE DECK",
        "YACHTS BY CAVO · PRIVATE CHARTERS",
        "CAVO ELITE · ELEVATED DINING & LOUNGE",
        "378+ ARTISANAL MENU CREATIONS",
        "DAILY · 8:00 AM TO 4:00 AM",
      ];

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#f6f3ee] via-[#efeae1] to-[#e7dfd3] pt-20 text-[var(--cavo-ink)] sm:pt-24 lg:pt-28">
      {/* Subtle Sunlit Riviera Ambient Glows (Zero harsh glare, pure architectural depth) */}
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

      <div className="relative z-10 mx-auto max-w-7xl px-4 pt-3 pb-10 sm:px-6 sm:pt-6 sm:pb-16 lg:pt-8 lg:pb-20">
        <div className="grid grid-cols-1 items-center gap-7 sm:gap-10 lg:grid-cols-12 lg:gap-12">
          {/* LEFT / START COLUMN */}
          <div className="cavo-rise min-w-0 lg:col-span-6">
            {/* Compact Location & Live Status Pill */}
            <div className="inline-flex max-w-full items-center gap-2 rounded-full border border-[var(--cavo-gold)]/40 bg-[#fbf9f5]/95 px-3.5 py-1.5 shadow-[0_8px_24px_-12px_rgba(70,54,36,0.18)] backdrop-blur-sm">
              <span className="relative flex h-2 w-2 shrink-0">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--cavo-gold)] opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-[var(--cavo-gold-deep)]" />
              </span>
              <span
                className={`break-words text-[11px] font-semibold text-[var(--cavo-gold-deep)] sm:text-xs ${
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
              className={`font-display mt-4 text-[2.1rem] font-semibold text-[var(--cavo-ink)] sm:mt-5 sm:text-5xl md:text-[3.4rem] lg:text-[4.15rem] xl:text-[4.4rem] ${
                isAr ? "leading-[1.22]" : "leading-[1.05]"
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

            <p className="mt-3.5 max-w-xl break-words text-[13px] leading-relaxed text-[var(--cavo-smoke)] sm:mt-5 sm:text-base lg:text-lg">
              {isAr
                ? "أربع تجارب ضيافة استثنائية على متن مركب نايل سيتي بالزمالك: المطعم الرئيسي، المركب المفتوح، اليخت الخاص، وكافو إيليت — بتفاصيل معمارية دافئة على صفحة النهر."
                : "Where sunlit timber architecture meets the Zamalek breeze across four signature Nile destinations: Main Restaurant, Boat, Yachts by Cavo, and Elite."}
            </p>

            {/* Tailored CTA Hierarchy: Full-width primary + balanced dual row on mobile, inline on sm+ */}
            <div className="mt-5 flex flex-col gap-2.5 sm:mt-7 sm:flex-row sm:flex-wrap sm:items-center sm:gap-3">
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
                  className={`cavo-btn-pearl group inline-flex min-h-[44px] items-center justify-center gap-2 rounded-full px-4 py-3 text-xs font-semibold sm:px-6 sm:py-4 ${
                    isAr ? "" : "uppercase tracking-[0.15em]"
                  }`}
                >
                  <Compass className="h-3.5 w-3.5 shrink-0 text-[var(--cavo-gold-deep)] transition-transform duration-500 group-hover:rotate-45" />
                  <span className="truncate">
                    {isAr ? "التجارب الأربع" : "4 VENUES"}
                  </span>
                </a>

                <button
                  type="button"
                  onClick={triggerCavoIntroReplay}
                  className={`cavo-btn-pearl group inline-flex min-h-[44px] items-center justify-center gap-2 rounded-full px-4 py-3 text-xs font-semibold sm:px-6 sm:py-4 ${
                    isAr ? "" : "uppercase tracking-[0.15em]"
                  }`}
                >
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[var(--cavo-gold-pale)] text-[var(--cavo-gold-deep)] transition-transform duration-300 group-hover:scale-110">
                    <Play className="h-2.5 w-2.5 fill-current" />
                  </span>
                  <span className="truncate">
                    {isAr ? "فيلم كافو" : "WATCH FILM"}
                  </span>
                </button>
              </div>
            </div>

            {/* Desktop 4-Venue Direct Access Strip */}
            <div className="mt-9 hidden border-t border-[var(--cavo-border)] pt-6 lg:block">
              <p
                className={`mb-3 text-[11px] font-semibold text-[var(--cavo-smoke)] ${
                  isAr ? "" : "uppercase tracking-[0.22em]"
                }`}
              >
                {isAr
                  ? "أربع تجارب متكاملة · اختر وجهتك مباشرة"
                  : "FOUR SIGNATURE DESTINATIONS · DIRECT ACCESS"}
              </p>
              <div className="grid grid-cols-4 gap-2.5">
                {venues.map((venue, idx) => {
                  const isCurrent = activeScene === idx;
                  return (
                    <Link
                      key={venue.slug}
                      href={localePath(locale, `experiences/${venue.slug}`)}
                      onMouseEnter={() => setActiveScene(idx)}
                      className={`cavo-sheen-card group relative overflow-hidden rounded-2xl border p-3 shadow-sm transition-all duration-300 hover:-translate-y-1 ${
                        isCurrent
                          ? "border-[var(--cavo-gold)] bg-[#efe8dd] shadow-[0_14px_28px_-14px_rgba(90,70,48,0.28)]"
                          : "border-[var(--cavo-border)] bg-[#f9f7f3] hover:border-[var(--cavo-gold)]"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-[10px] font-bold text-[var(--cavo-gold-deep)]">
                          {venue.number}
                        </span>
                        <ArrowRight
                          className={`h-3 w-3 text-[var(--cavo-gold-deep)] transition-all duration-300 rtl:rotate-180 ${
                            isCurrent
                              ? "opacity-100"
                              : "opacity-0 group-hover:translate-x-0.5 group-hover:opacity-100"
                          }`}
                        />
                      </div>
                      <p className="font-display mt-1 text-base font-semibold leading-snug text-[var(--cavo-ink)] group-hover:text-[var(--cavo-gold-deep)]">
                        {venue.name[locale]}
                      </p>
                      <p className="mt-0.5 line-clamp-1 text-[10px] text-[var(--cavo-smoke)]">
                        {venue.role[locale]}
                      </p>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>

          {/* RIGHT / END COLUMN — Cinema Crossfade & Ken Burns Architectural Showcase */}
          <div
            style={{ "--d": "0.1s" } as React.CSSProperties}
            className="cavo-rise relative min-w-0 lg:col-span-6"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            {/* Outer Architectural Double-Frame */}
            <div className="relative mx-auto max-w-2xl rounded-[26px] border border-[var(--cavo-gold)]/45 bg-gradient-to-b from-[#fbf9f5] to-[#f2ece2] p-2.5 shadow-[0_28px_70px_-22px_rgba(65,48,30,0.28)] sm:rounded-[36px] sm:p-3.5 lg:max-w-xl xl:max-w-2xl">
              {/* Main Showcase Canvas with Stacked Crossfade + Swipe */}
              <div
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
                className="relative aspect-[4/3.3] w-full overflow-hidden rounded-[20px] bg-[#241c15] sm:aspect-[16/11] sm:rounded-[28px] lg:aspect-[4/4.35]"
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
                  className="pointer-events-none absolute inset-x-0 top-0 z-20 h-24 bg-gradient-to-b from-[#1e1710]/45 to-transparent"
                />
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-3/5 bg-gradient-to-t from-[#1f1710]/90 via-[#1f1710]/38 to-transparent"
                />

                {/* Top Floating Glass Scene Badge & Time */}
                <div className="absolute inset-x-3 top-3 z-30 flex flex-wrap items-center justify-between gap-2 sm:inset-x-4 sm:top-4">
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-white/55 bg-[#f8f5ef]/95 px-3 py-1 text-[11px] font-semibold text-[var(--cavo-ink)] shadow-md backdrop-blur-md sm:px-3.5 sm:py-1.5 sm:text-xs">
                    <Sparkles className="h-3 w-3 shrink-0 text-[var(--cavo-gold)]" />
                    <span>{currentScene.badge[locale]}</span>
                  </span>

                  <span className="inline-flex items-center gap-1 rounded-full border border-white/30 bg-[#231b13]/80 px-2.5 py-1 text-[10px] font-medium text-[#f6f3ee] backdrop-blur-md sm:px-3.5 sm:py-1.5 sm:text-[11px]">
                    <Clock className="h-3 w-3 shrink-0 text-[#e4c89e]" />
                    <span>{currentScene.time[locale]}</span>
                  </span>
                </div>

                {/* Bottom Caption, Direct Link & Live Timer Dots */}
                <div className="absolute inset-x-3.5 bottom-3 z-30 flex flex-col gap-2 sm:inset-x-5 sm:bottom-4 sm:gap-2.5">
                  <p
                    key={currentScene.id}
                    className="cavo-swap-in font-display text-lg font-semibold leading-snug text-white drop-shadow-[0_4px_16px_rgba(0,0,0,0.55)] sm:text-2xl lg:text-[1.75rem]"
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
                            className="group flex min-h-[28px] min-w-[28px] items-center justify-center px-1 py-2"
                          >
                            <span
                              className={`relative block h-2 overflow-hidden rounded-full transition-all duration-500 sm:h-2.5 ${
                                active
                                  ? "w-10 bg-white/30 sm:w-13"
                                  : "w-2 bg-white/55 group-hover:w-5 group-hover:bg-white/90 sm:w-2.5"
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

              {/* Mobile & Tablet Venue Switcher Pills (2x2 on phones, 4-col on sm/md tablets) */}
              <div className="mt-2.5 grid grid-cols-2 gap-1.5 sm:grid-cols-4 sm:gap-2 lg:hidden">
                {venues.map((venue, idx) => {
                  const active = activeScene === idx;
                  return (
                    <button
                      key={venue.slug}
                      type="button"
                      onClick={() => setActiveScene(idx)}
                      className={`flex min-h-[42px] items-center gap-2 rounded-xl border px-3 py-2 text-start transition-all duration-300 ${
                        active
                          ? "cavo-gold-gradient border-[var(--cavo-gold-deep)] text-white shadow-sm"
                          : "border-[var(--cavo-border)] bg-[#f5f1e9] text-[var(--cavo-ink)] hover:border-[var(--cavo-gold)]"
                      }`}
                    >
                      <span
                        className={`font-mono text-[10px] font-bold ${
                          active
                            ? "text-[#f5ece0]"
                            : "text-[var(--cavo-gold-deep)]"
                        }`}
                      >
                        {venue.number}
                      </span>
                      <span className="truncate text-xs font-semibold leading-snug">
                        {venue.name[locale]}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Floating Glass Medallion — Desktop Only */}
              <div className="cavo-float-slow cavo-glass-warm absolute -bottom-5 -start-3 z-30 hidden items-center gap-3.5 rounded-2xl p-3.5 shadow-[0_20px_44px_-12px_rgba(70,54,36,0.24)] lg:flex">
                <div className="cavo-gold-gradient flex h-11 w-11 items-center justify-center rounded-xl text-white shadow-sm">
                  <UtensilsCrossed className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-[var(--cavo-ink)]">
                    {isAr ? "378+ صنف في المنيو" : "378+ Menu Creations"}
                  </p>
                  <p className="text-[11px] text-[var(--cavo-smoke)]">
                    {isAr
                      ? "فطار · مشاوي · طواجن · قهوة مختصة"
                      : "Breakfast · Grills · Tajins · Coffee"}
                  </p>
                </div>
              </div>

              {/* Floating Glass Rating & Community Seal — Desktop Only */}
              <div className="cavo-float-reverse cavo-glass-warm absolute -end-3 -top-4 z-30 hidden items-center gap-2.5 rounded-2xl px-4 py-2.5 shadow-[0_20px_44px_-12px_rgba(70,54,36,0.22)] lg:flex">
                <div className="flex items-center gap-0.5 text-[var(--cavo-gold)]">
                  <Star className="h-3.5 w-3.5 fill-current" />
                  <Star className="h-3.5 w-3.5 fill-current" />
                  <Star className="h-3.5 w-3.5 fill-current" />
                  <Star className="h-3.5 w-3.5 fill-current" />
                  <Star className="h-3.5 w-3.5 fill-current" />
                </div>
                <span className="text-xs font-bold text-[var(--cavo-ink)]">
                  {isAr ? "+130 ألف متابع" : "130K+ Community"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Architectural Quick-Facts Concierge Bar */}
        <div className="mt-7 rounded-2xl border border-[var(--cavo-gold)]/35 bg-[#faf8f4]/95 px-4 py-3.5 shadow-[0_14px_34px_-18px_rgba(70,54,36,0.16)] backdrop-blur-sm sm:mt-12 sm:rounded-3xl sm:px-7 sm:py-4">
          <div className="flex flex-col gap-2.5 text-[11px] sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:gap-4 sm:text-xs">
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
              <span className="inline-flex items-center gap-1.5 font-semibold text-[var(--cavo-ink)]">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[var(--cavo-gold-pale)] text-[var(--cavo-gold-deep)]">
                  <MapPin className="h-3 w-3" />
                </span>
                <span>
                  {isAr
                    ? "مركب نايل سيتي، كورنيش الزمالك"
                    : "Nile City Boat, Zamalek Corniche"}
                </span>
              </span>

              <span className="inline-flex items-center gap-1.5 font-semibold text-[var(--cavo-ink)]">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[var(--cavo-gold-pale)] text-[var(--cavo-gold-deep)]">
                  <Clock className="h-3 w-3" />
                </span>
                <span>
                  {isAr
                    ? "يومياً · 8:00 ص – 4:00 فجراً"
                    : "Daily · 8:00 AM – 4:00 AM"}
                </span>
              </span>
            </div>

            <Link
              href={localePath(locale, "menu")}
              className="group inline-flex items-center gap-1.5 border-t border-[var(--cavo-border)]/70 pt-2 font-semibold text-[var(--cavo-gold-deep)] transition hover:text-[var(--cavo-terracotta)] sm:border-t-0 sm:pt-0"
            >
              <span>
                {isAr
                  ? "المنيو الرسمي وحاسبة الفاتورة التفاعلية"
                  : "Official Menu & Live Bill Estimator"}
              </span>
              <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1" />
            </Link>
          </div>
        </div>
      </div>

      {/* Luxury Warm Sand Marquee Ticker Strip with Edge Masks */}
      <div
        dir="ltr"
        className="cavo-edge-mask overflow-hidden border-y border-[var(--cavo-border)] bg-[#e3dbd0] py-2.5 sm:py-3.5"
      >
        <div className="animate-cavo-marquee flex items-center gap-8 sm:gap-10">
          {[...marqueeItems, ...marqueeItems].map((item, idx) => (
            <div
              key={`${item}-${idx}`}
              className="flex shrink-0 items-center gap-8 text-[11px] font-semibold tracking-wider text-[var(--cavo-espresso)] sm:gap-10 sm:text-xs"
            >
              <span>{item}</span>
              <span
                aria-hidden="true"
                className="inline-block h-1.5 w-1.5 rotate-45 bg-[var(--cavo-gold-deep)]"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
