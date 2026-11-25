"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Anchor,
  ArrowRight,
  CalendarCheck,
  Check,
  ChevronLeft,
  ChevronRight,
  Clock,
  Compass,
  Instagram,
  Maximize2,
  MessageCircle,
  Moon,
  Phone,
  Sparkles,
  Sun,
  UtensilsCrossed,
  Wind,
  X,
} from "lucide-react";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { FadeUp } from "@/components/MotionPrimitives";
import { menuItems } from "@/data/menu";
import { buildWhatsAppUrl } from "@/data/site";
import { venues } from "@/data/venues";
import { trackCavoEvent } from "@/lib/analytics";
import { localePath, type Locale } from "@/lib/i18n";
import type { VenueSlug } from "@/types/cavo";

const venueDishPairings: Record<VenueSlug, string> = {
  "main-restaurant": "english-breakfast",
  boat: "love-story-mocktail",
  "private-yacht": "cavo-special-grills",
  elite: "miso-chicken",
};

const venueAtmosphereSpecs: Record<
  VenueSlug,
  {
    moodId: string;
    moodLabel: { en: string; ar: string };
    icon: "sun" | "wind" | "anchor" | "moon";
    setting: { en: string; ar: string };
    bestTime: { en: string; ar: string };
    vibe: { en: string; ar: string };
    musicAndStyle: { en: string; ar: string };
  }
> = {
  "main-restaurant": {
    moodId: "dining",
    moodLabel: { en: "Brunch & All-Day Dining", ar: "فطار وغداء طوال اليوم" },
    icon: "sun",
    setting: {
      en: "Indoor Sunlit Timber Hall",
      ar: "قاعة داخلية بالبرجولا الخشبية",
    },
    bestTime: {
      en: "8:00 AM Morning to Evening",
      ar: "من 8:00 صباحاً حتى المساء",
    },
    vibe: {
      en: "Sunlit Calm & Oriental Live Nights",
      ar: "إشراقة الصباح وسهرات الطرب الحي",
    },
    musicAndStyle: {
      en: "Acoustic Oriental Bands & Match Nights",
      ar: "فرق طرب حي (تختيستا) وشاشات مباريات",
    },
  },
  boat: {
    moodId: "breeze",
    moodLabel: { en: "Open-Air Nile Breeze", ar: "هواء طلق على النيل" },
    icon: "wind",
    setting: {
      en: "Open-Air Riverside Deck",
      ar: "سطح مفتوح مباشرة فوق النيل",
    },
    bestTime: {
      en: "Golden Sunset to 4:00 AM",
      ar: "من ساعة الغروب حتى 4:00 فجراً",
    },
    vibe: {
      en: "River Breeze, Shisha & Skyline Lights",
      ar: "نسمة النيل، الشيشة وأضواء القاهرة",
    },
    musicAndStyle: {
      en: "Upbeat Riverside Social Lounge",
      ar: "أجواء اجتماعية مفتوحة بمحاذاة المياه",
    },
  },
  "private-yacht": {
    moodId: "celebrate",
    moodLabel: { en: "Private Yacht Cruise", ar: "احتفال ويخت خاص" },
    icon: "anchor",
    setting: {
      en: "Cruising Private Nile Yacht",
      ar: "يخت خاص يبحر في قلب النيل",
    },
    bestTime: {
      en: "Custom Daylight, Sunset or Night Charter",
      ar: "رحلات نهارية أو غروب أو ليلية بالحجز",
    },
    vibe: {
      en: "100% Private Milestone Celebrations",
      ar: "خصوصية كاملة للحفلات والعزومات",
    },
    musicAndStyle: {
      en: "Custom Sound, Decor & Onboard Dining",
      ar: "موسيقى وتجهيز وسفرة خاصة حسب طلبك",
    },
  },
  elite: {
    moodId: "nightlife",
    moodLabel: { en: "Fine Dinner & Late Night", ar: "عشاء فاخر وسهر راقٍ" },
    icon: "moon",
    setting: {
      en: "Panoramic Booths & Ambient Lamps",
      ar: "بوثات بانورامية وإضاءة خافتة",
    },
    bestTime: {
      en: "Lunch to Late Night (4:00 AM)",
      ar: "من الغداء حتى السهر المتأخر (4 فجراً)",
    },
    vibe: {
      en: "Intimate Fine Dining & VIP Lounge",
      ar: "هدوء راقٍ وعشاء على أضواء النيل",
    },
    musicAndStyle: {
      en: "Curated Deep Lounge & Fine Ambience",
      ar: "موسيقى مختارة وخصوصية عالية",
    },
  },
};

export function ExperiencesInteractiveHub({ locale }: { locale: Locale }) {
  const isAr = locale === "ar";

  // Active mood filter ("all" or a specific VenueSlug)
  const [highlightedSlug, setHighlightedSlug] = useState<VenueSlug | "all">("all");

  // Per-card active photo index so user can browse photos directly inside each card
  const [cardPhotoIdx, setCardPhotoIdx] = useState<Record<string, number>>({});

  // Mobile comparison tab selector
  const [compareTabSlug, setCompareTabSlug] = useState<VenueSlug>("main-restaurant");

  // Fullscreen Lightbox State
  const [lightboxState, setLightboxState] = useState<{
    venueSlug: VenueSlug;
    photoIdx: number;
  } | null>(null);
  const touchStartXRef = useRef<number | null>(null);

  const cycleCardPhoto = (slug: VenueSlug, total: number, delta: number) => {
    setCardPhotoIdx((prev) => {
      const current = prev[slug] ?? 0;
      return {
        ...prev,
        [slug]: (current + delta + total) % total,
      };
    });
  };

  const handleMoodSelect = (slug: VenueSlug) => {
    if (highlightedSlug === slug) {
      setHighlightedSlug("all");
      return;
    }
    setHighlightedSlug(slug);
    setCompareTabSlug(slug);
    trackCavoEvent("experience_select", {
      venue: slug,
      source: "experiences_mood_dock",
    });
    const el = document.getElementById(`venue-card-${slug}`);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  const activeLightboxVenue = lightboxState
    ? venues.find((v) => v.slug === lightboxState.venueSlug)
    : null;
  const activeLightboxPhoto =
    activeLightboxVenue && lightboxState
      ? activeLightboxVenue.gallery[lightboxState.photoIdx]
      : null;

  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-[#f5f2ec] via-[#efeae1] to-[#f6f3ee] pt-20 pb-28 text-[var(--cavo-ink)] sm:pt-24 sm:pb-32">
      {/* Subtle Ambient Sunlit Riviera Glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 start-1/4 h-96 w-96 rounded-full opacity-45 blur-3xl"
        style={{
          background:
            "radial-gradient(circle, rgba(196,169,132,0.28) 0%, transparent 70%)",
        }}
      />

      <div className="relative z-10 mx-auto max-w-7xl space-y-10 px-3.5 sm:space-y-16 sm:px-6">
        {/* SECTION 01 — BALANCED 12-COLUMN EDITORIAL HEADER & MOOD MATCHER DOCK */}
        <section>
          <div className="grid grid-cols-1 items-end gap-5 lg:grid-cols-12 lg:gap-6">
            {/* Left 7 Cols: Inline Breadcrumb + Eyebrow + Display Title + Subtitle */}
            <div className="cavo-rise min-w-0 space-y-2.5 lg:col-span-7">
              <div className="flex flex-wrap items-center gap-2">
                <Breadcrumbs
                  locale={locale}
                  items={[{ label: isAr ? "التجارب الأربع" : "Experiences" }]}
                />
                <span className="text-[var(--cavo-border)]">·</span>
                <div className="inline-flex items-center gap-1.5 rounded-full border border-[var(--cavo-border)] bg-[#f8f6f2] px-3 py-0.5 text-[10px] font-semibold text-[var(--cavo-gold-deep)] shadow-sm sm:text-[11px]">
                  <Sparkles className="h-3 w-3 shrink-0 text-[var(--cavo-gold)]" />
                  <span className={isAr ? "" : "editorial-eyebrow-en"}>
                    {isAr
                      ? "أربع عوالم على مركب نايل سيتي"
                      : "FOUR WORLDS ABOARD NILE CITY BOAT"}
                  </span>
                </div>
              </div>

              <h1 className="font-display text-2xl font-semibold leading-[1.15] text-[var(--cavo-ink)] sm:text-4xl lg:text-[46px]">
                {isAr ? (
                  <>
                    أربع تجارب ضيافة على النيل،{" "}
                    <span className="cavo-gold-text">
                      لكل لحظة عالمها الخاص.
                    </span>
                  </>
                ) : (
                  <>
                    Four Distinct Nile Worlds,{" "}
                    <span className="cavo-gold-text italic">
                      One Iconic Destination.
                    </span>
                  </>
                )}
              </h1>

              <p className="max-w-2xl break-words text-xs leading-relaxed text-[var(--cavo-smoke)] sm:text-sm">
                {isAr
                  ? "استكشف الفرق بين المطعم الرئيسي، المركب المفتوح (Boat)، اليخت الخاص، وكافو إيليت — قارن الأجواء والجلسات وتصفح صور كل وجهة بهدوء قبل الحجز."
                  : "Discover Main Restaurant, the open-air Boat deck, Yachts by Cavo, and CAVO Elite—compare settings, browse live venue photography, and reserve your preferred table."}
              </p>
            </div>

            {/* Right 5 Cols: Interactive Mood Quick-Matcher Dock */}
            <FadeUp delay={0.08} className="min-w-0 lg:col-span-5">
              <div className="rounded-[22px] border border-[var(--cavo-gold)]/35 bg-[#f8f6f2] p-3 shadow-[0_16px_38px_-16px_rgba(70,54,36,0.16)] sm:rounded-[26px] sm:p-4">
                <div className="mb-2.5 flex items-center justify-between px-1">
                  <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-[var(--cavo-gold-deep)] sm:text-xs">
                    <Compass className="h-3.5 w-3.5 text-[var(--cavo-gold)]" />
                    {isAr
                      ? "ما هو مود زيارتك اليوم؟ (اضغط للترشيح):"
                      : "What's Your Mood Today? (Tap to Match):"}
                  </span>
                  {highlightedSlug !== "all" && (
                    <button
                      type="button"
                      onClick={() => setHighlightedSlug("all")}
                      className="text-[10px] font-semibold text-[var(--cavo-smoke)] underline hover:text-[var(--cavo-ink)]"
                    >
                      {isAr ? "عرض الكل" : "Reset"}
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-1.5">
                  {venues.map((v) => {
                    const spec = venueAtmosphereSpecs[v.slug];
                    const active = highlightedSlug === v.slug;
                    const MoodIcon =
                      spec.icon === "sun"
                        ? Sun
                        : spec.icon === "wind"
                          ? Wind
                          : spec.icon === "anchor"
                            ? Anchor
                            : Moon;

                    return (
                      <button
                        key={v.slug}
                        type="button"
                        onClick={() => handleMoodSelect(v.slug)}
                        className={`relative flex items-center gap-2 rounded-xl border px-2.5 py-2 text-start text-[11px] font-semibold transition-all duration-300 ${
                          active
                            ? "cavo-gold-gradient border-[var(--cavo-gold)] text-white shadow-sm"
                            : "border-[var(--cavo-border)] bg-[#f1ede6] text-[var(--cavo-ink)] hover:border-[var(--cavo-gold)]"
                        }`}
                      >
                        <MoodIcon
                          className={`relative z-10 h-3.5 w-3.5 shrink-0 ${
                            active ? "text-white" : "text-[var(--cavo-gold-deep)]"
                          }`}
                        />
                        <div className="relative z-10 min-w-0 flex-1">
                          <span className="block truncate leading-tight">
                            {spec.moodLabel[locale]}
                          </span>
                          <span
                            className={`block truncate text-[9px] ${
                              active
                                ? "text-[#f5ece0]"
                                : "text-[var(--cavo-gold-deep)]"
                            }`}
                          >
                            → {v.name[locale]}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </FadeUp>
          </div>
        </section>

        {/* SECTION 02 — THE 4 ARCHITECTURAL VENUE PAVILIONS (2x2 GRID · CROSSFADE PHOTO CAROUSEL + SWIPE) */}
        <section aria-label={isAr ? "وجهات كافو الأربع" : "Four CAVO Venues"}>
          <div className="grid grid-cols-1 gap-5 sm:gap-7 lg:grid-cols-2">
            {venues.map((venue, idx) => {
              const spec = venueAtmosphereSpecs[venue.slug];
              const photos = venue.gallery;
              const currentPhotoIndex = (cardPhotoIdx[venue.slug] ?? 0) % photos.length;
              const isHighlighted = highlightedSlug === venue.slug;

              const pairedDishId = venueDishPairings[venue.slug];
              const pairedDish = menuItems.find((m) => m.id === pairedDishId);

              const whatsappMsg = isAr
                ? `مرحباً كافو، أرغب في الاستفسار عن حجز في ${venue.name.ar}`
                : `Hello CAVO, I would like to inquire about a reservation at ${venue.name.en}`;

              return (
                <FadeUp key={venue.slug} delay={idx * 0.07} className="flex min-w-0">
                  <article
                    id={`venue-card-${venue.slug}`}
                    className={`cavo-sheen-card group relative flex w-full min-w-0 flex-col justify-between overflow-hidden rounded-[24px] border bg-[#f8f6f2] p-3 shadow-[0_20px_50px_-22px_rgba(70,54,36,0.18)] transition-all duration-500 hover:-translate-y-1 hover:border-[var(--cavo-gold)] sm:rounded-[32px] sm:p-4 ${
                      isHighlighted
                        ? "border-[var(--cavo-gold)] ring-2 ring-[var(--cavo-gold)]/55 shadow-[0_28px_65px_-18px_rgba(117,93,67,0.32)]"
                        : "border-[var(--cavo-border)]"
                    }`}
                  >
                    <div>
                      {/* Interactive Multi-Photo Crossfade + Touch Swipe Stage */}
                      <div
                        onTouchStart={(e) => {
                          touchStartXRef.current = e.touches[0]?.clientX ?? null;
                        }}
                        onTouchEnd={(e) => {
                          if (touchStartXRef.current === null) return;
                          const endX =
                            e.changedTouches[0]?.clientX ?? touchStartXRef.current;
                          const deltaX = endX - touchStartXRef.current;
                          touchStartXRef.current = null;
                          if (Math.abs(deltaX) < 38) return;
                          const dir = deltaX < 0 ? 1 : -1;
                          const step = isAr ? -dir : dir;
                          cycleCardPhoto(venue.slug, photos.length, step);
                        }}
                        className="relative aspect-[16/10] w-full overflow-hidden rounded-[18px] bg-[#1e1711] sm:rounded-[22px]"
                      >
                        {photos.map((photo, pIdx) => {
                          const isCurrent = pIdx === currentPhotoIndex;
                          return (
                            <div
                              key={photo.src}
                              aria-hidden={!isCurrent}
                              className={`absolute inset-0 transition-opacity duration-700 ease-out ${
                                isCurrent
                                  ? "z-10 opacity-100"
                                  : "pointer-events-none z-0 opacity-0"
                              }`}
                            >
                              <Image
                                src={photo.src}
                                alt={photo.alt[locale]}
                                fill
                                sizes="(max-width: 1024px) 100vw, 50vw"
                                className="object-cover transition-transform duration-1000 ease-out group-hover:scale-105"
                              />
                            </div>
                          );
                        })}

                        <div className="pointer-events-none absolute inset-0 z-20 bg-gradient-to-t from-[#221a12]/80 via-transparent to-[#221a12]/25" />

                        {/* Top Bar: Number + Role Badge & Lightbox Expand */}
                        <div className="absolute inset-x-3 top-3 z-30 flex items-center justify-between gap-2">
                          <span className="inline-flex items-center gap-1.5 rounded-full border border-white/45 bg-[#f6f3ee]/95 px-3 py-1 text-[10px] font-bold text-[var(--cavo-gold-deep)] shadow-sm backdrop-blur-md sm:text-xs">
                            <span className="font-mono">{venue.number}</span>
                            <span>·</span>
                            <span>{venue.role[locale]}</span>
                          </span>

                          <button
                            type="button"
                            onClick={() =>
                              setLightboxState({
                                venueSlug: venue.slug,
                                photoIdx: currentPhotoIndex,
                              })
                            }
                            aria-label={isAr ? "تكبير الصور" : "Expand Gallery"}
                            className="inline-flex items-center gap-1 rounded-full border border-white/40 bg-[#f6f3ee]/92 px-2.5 py-1 text-[10px] font-semibold text-[var(--cavo-ink)] shadow-sm backdrop-blur-md transition hover:bg-[var(--cavo-gold)] hover:text-white sm:text-[11px]"
                          >
                            <Maximize2 className="h-3 w-3" />
                            <span>
                              0{currentPhotoIndex + 1}/0{photos.length}
                            </span>
                          </button>
                        </div>

                        {/* Prev / Next Photo Arrows on Card Image */}
                        <button
                          type="button"
                          onClick={() =>
                            cycleCardPhoto(venue.slug, photos.length, -1)
                          }
                          aria-label={isAr ? "الصورة السابقة" : "Previous photo"}
                          className="absolute start-2.5 top-1/2 z-30 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full border border-white/40 bg-[#261e16]/60 text-white backdrop-blur-md transition hover:bg-[var(--cavo-gold)]"
                        >
                          <ChevronLeft className="h-4 w-4 rtl:rotate-180" />
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            cycleCardPhoto(venue.slug, photos.length, 1)
                          }
                          aria-label={isAr ? "الصورة التالية" : "Next photo"}
                          className="absolute end-2.5 top-1/2 z-30 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full border border-white/40 bg-[#261e16]/60 text-white backdrop-blur-md transition hover:bg-[var(--cavo-gold)]"
                        >
                          <ChevronRight className="h-4 w-4 rtl:rotate-180" />
                        </button>

                        {/* Bottom Bar on Image: Hours + Photo Thumbnail Dots */}
                        <div className="absolute inset-x-3 bottom-2.5 z-30 flex items-center justify-between gap-2">
                          <span className="inline-flex items-center gap-1 rounded-full bg-[#241c14]/75 px-2.5 py-0.5 text-[10px] font-medium text-[#f3e9d9] backdrop-blur-md sm:text-[11px]">
                            <Clock className="h-3 w-3 text-[var(--cavo-gold-light)]" />
                            <span className="truncate">{venue.hours[locale]}</span>
                          </span>

                          <div className="flex items-center gap-1">
                            {photos.map((p, pIdx) => (
                              <button
                                key={p.src}
                                type="button"
                                onClick={() =>
                                  setCardPhotoIdx((prev) => ({
                                    ...prev,
                                    [venue.slug]: pIdx,
                                  }))
                                }
                                aria-label={`Photo ${pIdx + 1}`}
                                className={`h-1.5 rounded-full transition-all ${
                                  pIdx === currentPhotoIndex
                                    ? "w-5 bg-[var(--cavo-gold-light)]"
                                    : "w-1.5 bg-white/55 hover:bg-white"
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Card Narrative & Calm 3-Spec Strip */}
                      <div className="p-2 pt-3.5 sm:p-3 sm:pt-4">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <Link
                              href={localePath(
                                locale,
                                `experiences/${venue.slug}`
                              )}
                              className="group/title inline-flex items-center gap-1.5"
                            >
                              <h2 className="font-display text-2xl font-semibold text-[var(--cavo-ink)] transition-colors group-hover/title:text-[var(--cavo-gold-deep)] sm:text-3xl">
                                {venue.name[locale]}
                              </h2>
                              <ArrowRight className="h-4 w-4 text-[var(--cavo-gold)] transition-transform duration-300 group-hover/title:translate-x-1 rtl:rotate-180 rtl:group-hover/title:-translate-x-1" />
                            </Link>
                            <p className="mt-0.5 text-xs font-semibold text-[var(--cavo-terracotta)]">
                              {venue.tagline[locale]}
                            </p>
                          </div>

                          <a
                            href={venue.instagramUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex shrink-0 items-center gap-1 rounded-full border border-[var(--cavo-border)] bg-[#f1ede6] px-2.5 py-1 font-mono text-[10px] font-semibold text-[var(--cavo-gold-deep)] hover:border-[var(--cavo-gold)] sm:text-[11px]"
                          >
                            <Instagram className="h-3 w-3" />
                            <span>{venue.instagramHandle}</span>
                          </a>
                        </div>

                        <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-[var(--cavo-smoke)] sm:text-sm">
                          {venue.shortDesc[locale]}
                        </p>

                        {/* Clean 3-Column Spec Tiles */}
                        <div className="mt-3.5 grid grid-cols-3 gap-1.5 rounded-2xl border border-[var(--cavo-border)] bg-[#f1ede6] p-2.5 text-[11px]">
                          <div className="min-w-0">
                            <span className="block text-[9px] font-bold text-[var(--cavo-muted-gray)] sm:text-[10px]">
                              {isAr ? "طبيعة المكان" : "SETTING"}
                            </span>
                            <span className="mt-0.5 block truncate font-semibold text-[var(--cavo-ink)]">
                              {spec.setting[locale]}
                            </span>
                          </div>

                          <div className="min-w-0 border-s border-[var(--cavo-border)] ps-2">
                            <span className="block text-[9px] font-bold text-[var(--cavo-muted-gray)] sm:text-[10px]">
                              {isAr ? "الأجواء" : "ATMOSPHERE"}
                            </span>
                            <span className="mt-0.5 block truncate font-semibold text-[var(--cavo-ink)]">
                              {spec.vibe[locale]}
                            </span>
                          </div>

                          <div className="min-w-0 border-s border-[var(--cavo-border)] ps-2">
                            <span className="block text-[9px] font-bold text-[var(--cavo-muted-gray)] sm:text-[10px]">
                              {isAr ? "ترشيح المطبخ" : "SIGNATURE"}
                            </span>
                            <Link
                              href={localePath(locale, "menu")}
                              className="mt-0.5 block truncate font-semibold text-[var(--cavo-gold-deep)] hover:underline"
                            >
                              {pairedDish ? pairedDish.name[locale] : "Menu"}
                            </Link>
                          </div>
                        </div>

                        {/* Seating Zone Pills */}
                        <div className="mt-3 flex flex-wrap items-center gap-1.5">
                          {venue.seatingOptions.map((seat) => (
                            <span
                              key={seat.id}
                              className="inline-flex items-center gap-1 rounded-full border border-[var(--cavo-border)] bg-[#f8f6f2] px-2.5 py-0.5 text-[10px] font-medium text-[var(--cavo-smoke)] sm:text-[11px]"
                            >
                              <Check className="h-2.5 w-2.5 text-[var(--cavo-gold-deep)]" />
                              <span>{seat.label[locale]}</span>
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Card Footer Action Bar */}
                    <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-[var(--cavo-border)]/80 px-2 pt-3 pb-1 sm:px-3">
                      <div className="flex flex-wrap items-center gap-2">
                        <Link
                          href={localePath(locale, `experiences/${venue.slug}`)}
                          className="cavo-btn-gold inline-flex items-center gap-1.5 rounded-full px-5 py-2.5 text-xs font-semibold"
                        >
                          <span>
                            {isAr
                              ? `استكشف ${venue.name.ar}`
                              : `Explore ${venue.name.en}`}
                          </span>
                          <ArrowRight className="h-3.5 w-3.5 rtl:rotate-180" />
                        </Link>

                        <Link
                          href={localePath(locale, `book?venue=${venue.slug}`)}
                          className="cavo-btn-pearl rounded-full px-4 py-2.5 text-xs font-semibold"
                        >
                          {isAr ? "احجز طاولة" : "Book Table"}
                        </Link>
                      </div>

                      <a
                        href={buildWhatsAppUrl(venue.whatsappDigits, whatsappMsg)}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={isAr ? "واتساب مباشر" : "WhatsApp Desk"}
                        className="inline-flex items-center gap-1.5 rounded-full border border-[var(--cavo-border)] bg-[#f1ede6] px-3 py-2 text-xs font-semibold text-[var(--cavo-gold-deep)] transition hover:border-[var(--cavo-gold)]"
                      >
                        <MessageCircle className="h-3.5 w-3.5 text-[var(--cavo-gold)]" />
                        <span className="hidden sm:inline">
                          {isAr ? "واتساب" : "WhatsApp"}
                        </span>
                      </a>
                    </div>
                  </article>
                </FadeUp>
              );
            })}
          </div>
        </section>

        {/* SECTION 03 — SIDE-BY-SIDE ARCHITECTURAL COMPARISON MATRIX */}
        <FadeUp className="overflow-hidden rounded-[26px] border border-[var(--cavo-gold)]/40 bg-[#f8f6f2] p-4 shadow-[0_22px_55px_-22px_rgba(70,54,36,0.18)] sm:rounded-[34px] sm:p-7">
          <div className="mb-5 flex flex-col justify-between gap-3 border-b border-[var(--cavo-border)] pb-4 sm:flex-row sm:items-end">
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--cavo-border)] bg-[#f1ede6] px-3 py-1 text-[10px] font-bold text-[var(--cavo-gold-deep)] sm:text-[11px]">
                <Sparkles className="h-3 w-3 text-[var(--cavo-gold)]" />
                <span>
                  {isAr
                    ? "مقارنة سريعة وواضحة"
                    : "AT-A-GLANCE VENUE COMPARISON"}
                </span>
              </span>
              <h2 className="font-display mt-2 text-2xl font-semibold text-[var(--cavo-ink)] sm:text-3xl">
                {isAr
                  ? "الفرق بين تجارب كافو الأربع في نظرة واحدة."
                  : "Compare All Four Experiences Side by Side."}
              </h2>
            </div>

            <Link
              href={localePath(locale, "book")}
              className="cavo-btn-gold inline-flex items-center gap-1.5 self-start rounded-full px-5 py-2.5 text-xs font-semibold sm:self-auto"
            >
              <CalendarCheck className="h-3.5 w-3.5" />
              <span>{isAr ? "انتقل لصفحة الحجز" : "Go to Reservation Form"}</span>
            </Link>
          </div>

          {/* Mobile Tabbed Switcher for Comparison */}
          <div className="lg:hidden">
            <div className="mb-3 grid grid-cols-2 gap-1.5 rounded-2xl border border-[var(--cavo-border)] bg-[#f1ede6] p-1">
              {venues.map((v) => {
                const active = v.slug === compareTabSlug;
                return (
                  <button
                    key={v.slug}
                    type="button"
                    onClick={() => setCompareTabSlug(v.slug)}
                    className={`rounded-xl py-2 px-2.5 text-xs font-semibold transition ${
                      active
                        ? "cavo-gold-gradient text-white shadow-sm"
                        : "text-[var(--cavo-ink)]/80"
                    }`}
                  >
                    {v.number} · {v.name[locale]}
                  </button>
                );
              })}
            </div>

            {(() => {
              const v =
                venues.find((item) => item.slug === compareTabSlug) ?? venues[0];
              const spec = venueAtmosphereSpecs[v.slug];
              return (
                <div className="space-y-2.5 rounded-2xl border border-[var(--cavo-border)] bg-[#f3efe8] p-4 text-xs">
                  <div className="flex items-center justify-between border-b border-[var(--cavo-border)]/70 pb-2">
                    <span className="text-[var(--cavo-smoke)]">
                      {isAr ? "طبيعة المكان:" : "Setting:"}
                    </span>
                    <span className="font-bold text-[var(--cavo-ink)]">
                      {spec.setting[locale]}
                    </span>
                  </div>
                  <div className="flex items-center justify-between border-b border-[var(--cavo-border)]/70 pb-2">
                    <span className="text-[var(--cavo-smoke)]">
                      {isAr ? "أفضل توقيت:" : "Best Hours:"}
                    </span>
                    <span className="font-semibold text-[var(--cavo-ink)]">
                      {spec.bestTime[locale]}
                    </span>
                  </div>
                  <div className="flex items-center justify-between border-b border-[var(--cavo-border)]/70 pb-2">
                    <span className="text-[var(--cavo-smoke)]">
                      {isAr ? "الموسيقى والأجواء:" : "Music & Vibe:"}
                    </span>
                    <span className="font-semibold text-[var(--cavo-ink)]">
                      {spec.musicAndStyle[locale]}
                    </span>
                  </div>
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[var(--cavo-smoke)]">
                      {isAr ? "خط الحجز المباشر:" : "Direct Line:"}
                    </span>
                    <a
                      href={`tel:${v.phoneDisplay.replace(/\s+/g, "")}`}
                      dir="ltr"
                      className="font-mono font-bold text-[var(--cavo-gold-deep)]"
                    >
                      {v.phoneDisplay}
                    </a>
                  </div>
                </div>
              );
            })()}
          </div>

          {/* Desktop 4-Column Comparison Grid */}
          <div className="hidden grid-cols-4 gap-3.5 lg:grid">
            {venues.map((v) => {
              const spec = venueAtmosphereSpecs[v.slug];
              return (
                <div
                  key={v.slug}
                  className="cavo-sheen-card flex flex-col justify-between rounded-2xl border border-[var(--cavo-border)] bg-[#f3efe8] p-4 transition hover:-translate-y-0.5 hover:border-[var(--cavo-gold)]"
                >
                  <div className="space-y-3">
                    <div>
                      <span className="font-mono text-[11px] font-bold text-[var(--cavo-gold-deep)]">
                        {v.number} · {v.role[locale]}
                      </span>
                      <h3 className="font-display mt-0.5 text-2xl font-semibold text-[var(--cavo-ink)]">
                        {v.name[locale]}
                      </h3>
                    </div>

                    <div className="space-y-2 border-t border-[var(--cavo-border)] pt-3 text-xs">
                      <div>
                        <span className="block text-[10px] font-bold text-[var(--cavo-muted-gray)]">
                          {isAr ? "طبيعة المكان" : "SETTING"}
                        </span>
                        <span className="font-semibold text-[var(--cavo-ink)]">
                          {spec.setting[locale]}
                        </span>
                      </div>

                      <div>
                        <span className="block text-[10px] font-bold text-[var(--cavo-muted-gray)]">
                          {isAr ? "أفضل توقيت" : "IDEAL HOURS"}
                        </span>
                        <span className="font-semibold text-[var(--cavo-ink)]">
                          {spec.bestTime[locale]}
                        </span>
                      </div>

                      <div>
                        <span className="block text-[10px] font-bold text-[var(--cavo-muted-gray)]">
                          {isAr ? "الأجواء والموسيقى" : "MUSIC & VIBE"}
                        </span>
                        <span className="font-semibold text-[var(--cavo-ink)]">
                          {spec.musicAndStyle[locale]}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-between border-t border-[var(--cavo-border)] pt-3 text-xs">
                    <a
                      href={`tel:${v.phoneDisplay.replace(/\s+/g, "")}`}
                      dir="ltr"
                      className="inline-flex items-center gap-1 font-mono font-bold text-[var(--cavo-gold-deep)] hover:underline"
                    >
                      <Phone className="h-3 w-3 text-[var(--cavo-gold)]" />
                      {v.phoneDisplay}
                    </a>

                    <Link
                      href={localePath(locale, `experiences/${v.slug}`)}
                      className="font-bold text-[var(--cavo-ink)] hover:text-[var(--cavo-gold-deep)]"
                    >
                      {isAr ? "التفاصيل ←" : "Details →"}
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </FadeUp>

        {/* SECTION 04 — ESPRESSO-CHAMPAGNE PRIVATE EVENTS & YACHT CHARTERS FINALE PAVILION */}
        <FadeUp className="relative overflow-hidden rounded-[26px] border border-[#d6bc96]/45 bg-[#1d150f] p-6 text-white shadow-[0_28px_70px_-22px_rgba(30,20,12,0.48)] sm:rounded-[34px] sm:p-10">
          <Image
            src="/media/venues/private-yacht/yacht-night-dinner.jpg"
            alt=""
            fill
            sizes="(max-width: 1280px) 100vw, 1280px"
            className="object-cover object-center opacity-30"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#19120c]/95 via-[#201710]/85 to-[#2b1f15]/78"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-2.5 rounded-[20px] border border-[#d6bc96]/20 sm:inset-4 sm:rounded-[28px]"
          />

          <div className="relative z-10 flex flex-col items-start justify-between gap-5 lg:flex-row lg:items-center">
            <div className="max-w-xl space-y-1.5">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[#d6bc96]/35 bg-white/10 px-3 py-1 text-[11px] font-bold text-[#efdcb9] backdrop-blur-sm">
                <Anchor className="h-3.5 w-3.5 text-[#e5caa4]" />
                <span>
                  {isAr
                    ? "تخطط لعيد ميلاد، خطوبة، أو عزومة خاصة؟"
                    : "PLANNING A BIRTHDAY, PROPOSAL, OR PRIVATE CRUISE?"}
                </span>
              </span>
              <h2 className="font-display text-2xl font-semibold text-white sm:text-4xl">
                {isAr
                  ? "صمّم مناسبتك الخاصة على يخت كافو أو سطح المركب."
                  : "Tailor Your Private Event Aboard Yachts by Cavo."}
              </h2>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <Link
                href={localePath(locale, "private-events")}
                className="cavo-btn-gold inline-flex min-h-[44px] items-center gap-2 rounded-full px-6 py-3 text-xs font-semibold"
              >
                <span>
                  {isAr ? "خطط لمناسبتك الخاصة" : "Plan a Private Event"}
                </span>
                <ArrowRight className="h-3.5 w-3.5 rtl:rotate-180" />
              </Link>

              <Link
                href={localePath(locale, "menu")}
                className="inline-flex min-h-[44px] items-center gap-1.5 rounded-full border border-[#d6bc96]/45 bg-white/10 px-5 py-3 text-xs font-semibold text-[#f8f2e8] backdrop-blur-sm transition hover:bg-white/20"
              >
                <UtensilsCrossed className="h-3.5 w-3.5 text-[#e5caa4]" />
                <span>{isAr ? "استعرض المنيو" : "Explore Menu"}</span>
              </Link>
            </div>
          </div>
        </FadeUp>
      </div>

      {/* FULLSCREEN VENUE GALLERY LIGHTBOX */}
      {activeLightboxVenue && activeLightboxPhoto && lightboxState && (
        <div
          onClick={() => setLightboxState(null)}
          onTouchStart={(e) => {
            touchStartXRef.current = e.touches[0]?.clientX ?? null;
          }}
          onTouchEnd={(e) => {
            if (touchStartXRef.current === null) return;
            const endX = e.changedTouches[0]?.clientX ?? touchStartXRef.current;
            const deltaX = endX - touchStartXRef.current;
            touchStartXRef.current = null;
            if (Math.abs(deltaX) < 42) return;
            const dir = deltaX < 0 ? 1 : -1;
            const step = isAr ? -dir : dir;
            setLightboxState({
              venueSlug: activeLightboxVenue.slug,
              photoIdx:
                (lightboxState.photoIdx +
                  step +
                  activeLightboxVenue.gallery.length) %
                activeLightboxVenue.gallery.length,
            });
          }}
          className="cavo-fade-in fixed inset-0 z-50 flex items-center justify-center bg-[#140f0b]/90 p-3 backdrop-blur-xl sm:p-4"
          role="dialog"
          aria-modal="true"
        >
          <button
            type="button"
            onClick={() => setLightboxState(null)}
            className="absolute end-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-[var(--cavo-gold)]/45 bg-[#f6f3ee] text-[var(--cavo-ink)] shadow-lg"
            aria-label={isAr ? "إغلاق" : "Close"}
          >
            <X className="h-5 w-5" />
          </button>

          <div
            onClick={(e) => e.stopPropagation()}
            className="cavo-zoom-in max-h-[90vh] w-full max-w-4xl overflow-hidden rounded-[26px] border border-[var(--cavo-gold)]/45 bg-[#f8f6f2] p-2.5 text-[var(--cavo-ink)] shadow-2xl sm:rounded-[30px] sm:p-4"
          >
            <div className="relative h-[50vh] w-full overflow-hidden rounded-[18px] bg-[#18120c] sm:h-[58vh] sm:rounded-[22px]">
              <Image
                src={activeLightboxPhoto.src}
                alt={activeLightboxPhoto.alt[locale]}
                fill
                sizes="100vw"
                className="object-contain"
              />
              <button
                type="button"
                onClick={() =>
                  setLightboxState({
                    venueSlug: activeLightboxVenue.slug,
                    photoIdx:
                      (lightboxState.photoIdx -
                        1 +
                        activeLightboxVenue.gallery.length) %
                      activeLightboxVenue.gallery.length,
                  })
                }
                className="absolute start-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-[#261e16]/75 text-white transition hover:bg-[var(--cavo-gold)]"
              >
                <ChevronLeft className="h-4 w-4 rtl:rotate-180" />
              </button>
              <button
                type="button"
                onClick={() =>
                  setLightboxState({
                    venueSlug: activeLightboxVenue.slug,
                    photoIdx:
                      (lightboxState.photoIdx + 1) %
                      activeLightboxVenue.gallery.length,
                  })
                }
                className="absolute end-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-[#261e16]/75 text-white transition hover:bg-[var(--cavo-gold)]"
              >
                <ChevronRight className="h-4 w-4 rtl:rotate-180" />
              </button>
            </div>

            <div className="flex flex-col justify-between gap-3 p-3 sm:flex-row sm:items-center">
              <div>
                <span className="font-mono text-xs font-bold text-[var(--cavo-gold-deep)]">
                  {activeLightboxVenue.number} ·{" "}
                  {activeLightboxVenue.name[locale]} · 0
                  {lightboxState.photoIdx + 1}/0
                  {activeLightboxVenue.gallery.length}
                </span>
                <p className="mt-0.5 text-sm font-medium text-[var(--cavo-ink)]">
                  {activeLightboxPhoto.alt[locale]}
                </p>
              </div>

              <Link
                href={localePath(
                  locale,
                  `experiences/${activeLightboxVenue.slug}`
                )}
                className="cavo-btn-gold inline-flex items-center gap-1.5 self-start rounded-full px-5 py-2 text-xs font-semibold sm:self-auto"
              >
                <span>
                  {isAr
                    ? `صفحة ${activeLightboxVenue.name.ar}`
                    : `Enter ${activeLightboxVenue.name.en}`}
                </span>
                <ArrowRight className="h-3.5 w-3.5 rtl:rotate-180" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
