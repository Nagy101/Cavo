"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
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
  Phone,
  Sparkles,
  UtensilsCrossed,
  X,
} from "lucide-react";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { FadeUp } from "@/components/MotionPrimitives";
import { dietaryLabels, menuItems } from "@/data/menu";
import { buildWhatsAppUrl, businessConfirmationRegistry } from "@/data/site";
import { privateYachtInquiryFormats, venues } from "@/data/venues";
import { trackCavoEvent } from "@/lib/analytics";
import { localePath, type Locale } from "@/lib/i18n";
import type { VenueData, VenueSlug } from "@/types/cavo";

const venueMenuPairingIds: Record<VenueSlug, string[]> = {
  "main-restaurant": [
    "english-breakfast",
    "smoked-salmon-croissant",
    "cavo-special-grills",
    "rice-meammar-meat",
  ],
  boat: [
    "love-story-mocktail",
    "cucumber-kiwi",
    "crispy-chicken-mushroom",
    "nutella-waffle",
  ],
  "private-yacht": [
    "cavo-special-grills",
    "rocca-mushroom-avocado",
    "vine-leaves",
    "classic-mojito",
  ],
  elite: [
    "miso-chicken",
    "cavo-special-grills",
    "rocca-mushroom-avocado",
    "tiramisu",
  ],
};

export function VenueDetailClient({
  venue,
  locale,
}: {
  venue: VenueData;
  locale: Locale;
}) {
  const isAr = locale === "ar";
  const [heroPhotoIdx, setHeroPhotoIdx] = useState(0);
  const [selectedSeatId, setSelectedSeatId] = useState(
    venue.seatingOptions[0]?.id ?? ""
  );
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);
  const touchStartXRef = useRef<number | null>(null);

  const photos = venue.gallery;
  const currentHeroIdx = heroPhotoIdx % photos.length;
  const activeHeroPhoto = photos[currentHeroIdx] ?? photos[0];
  const selectedSeat =
    venue.seatingOptions.find((s) => s.id === selectedSeatId) ??
    venue.seatingOptions[0];

  const pairedIds = venueMenuPairingIds[venue.slug] ?? [];
  const pairedDishes = menuItems
    .filter((item) => pairedIds.includes(item.id))
    .slice(0, 4);

  const otherVenues = venues.filter((v) => v.slug !== venue.slug);

  useEffect(() => {
    if (lightboxIdx === null) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightboxIdx(null);
      if (e.key === "ArrowRight") {
        setLightboxIdx((prev) =>
          prev === null ? null : (prev + 1) % photos.length
        );
      }
      if (e.key === "ArrowLeft") {
        setLightboxIdx((prev) =>
          prev === null ? null : (prev - 1 + photos.length) % photos.length
        );
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [lightboxIdx, photos.length]);

  const seatWhatsAppMessage = isAr
    ? `مرحباً كافو، أرغب في الاستفسار عن حجز في ${venue.name.ar} — تفضيل الجلوس: ${selectedSeat?.label.ar ?? ""}`
    : `Hello CAVO, I would like to inquire about a reservation at ${venue.name.en} — Seating preference: ${selectedSeat?.label.en ?? ""}`;

  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-[#f5f2ec] via-[#efeae1] to-[#f6f3ee] pt-20 pb-28 text-[var(--cavo-ink)] sm:pt-24 sm:pb-32">
      {/* Subtle Ambient Sunlit Glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 start-1/3 h-96 w-96 rounded-full opacity-45 blur-3xl"
        style={{
          background:
            "radial-gradient(circle, rgba(196,169,132,0.28) 0%, transparent 70%)",
        }}
      />

      <div className="relative z-10 mx-auto max-w-7xl space-y-10 px-3.5 sm:space-y-14 sm:px-6">
        {/* SECTION 01 — BALANCED 12-COL HEADER + UNIFIED GALLERY & SEATING CONCIERGE PAVILION */}
        <section>
          <div className="mb-4 grid grid-cols-1 items-end gap-4 sm:mb-6 lg:grid-cols-12 lg:gap-6">
            {/* Left 7 Cols: Breadcrumb + Badge + Venue Name + Story */}
            <div className="cavo-rise min-w-0 space-y-2 lg:col-span-7">
              <div className="flex flex-wrap items-center gap-2">
                <Breadcrumbs
                  locale={locale}
                  items={[
                    {
                      label: isAr ? "التجارب الأربع" : "Experiences",
                      href: localePath(locale, "experiences"),
                    },
                    { label: venue.name[locale] },
                  ]}
                />
                <span className="text-[var(--cavo-border)]">·</span>
                <div className="inline-flex items-center gap-1.5 rounded-full border border-[var(--cavo-border)] bg-[#f8f6f2] px-3 py-0.5 text-[10px] font-semibold text-[var(--cavo-gold-deep)] shadow-sm sm:text-[11px]">
                  <Sparkles className="h-3 w-3 shrink-0 text-[var(--cavo-gold)]" />
                  <span>
                    {venue.number} · {venue.role[locale]}
                  </span>
                </div>
              </div>

              <h1 className="font-display text-3xl font-semibold leading-tight text-[var(--cavo-ink)] sm:text-5xl">
                {venue.name[locale]}
              </h1>

              <p className="text-xs font-semibold text-[var(--cavo-terracotta)] sm:text-sm">
                {venue.tagline[locale]}
              </p>

              <p className="max-w-2xl break-words text-xs leading-relaxed text-[var(--cavo-smoke)] sm:text-sm">
                {venue.fullStory[locale]}
              </p>
            </div>

            {/* Right 5 Cols: 4-Venue Quick Switcher + Hours & Direct Desk Dock */}
            <FadeUp delay={0.08} className="min-w-0 lg:col-span-5">
              <div className="rounded-[22px] border border-[var(--cavo-gold)]/35 bg-[#f8f6f2] p-3 shadow-[0_14px_34px_-16px_rgba(70,54,36,0.14)] sm:rounded-[26px] sm:p-4">
                <div className="mb-2 flex items-center justify-between px-1 text-[11px]">
                  <span className="font-bold text-[var(--cavo-gold-deep)]">
                    {isAr ? "تبديل سريع بين التجارب الأربع:" : "Switch CAVO Venue:"}
                  </span>
                  <a
                    href={venue.instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 font-mono font-semibold text-[var(--cavo-ink)] hover:text-[var(--cavo-gold-deep)]"
                  >
                    <Instagram className="h-3 w-3 text-[var(--cavo-gold-deep)]" />
                    <span>{venue.instagramHandle}</span>
                  </a>
                </div>

                {/* Horizontal Swipe Pill Row on Mobile, 2x2 Grid on sm+ */}
                <div className="cavo-no-scrollbar flex gap-1.5 overflow-x-auto pb-0.5 sm:grid sm:grid-cols-2 sm:overflow-visible sm:pb-0">
                  {venues.map((v) => {
                    const isCurrent = v.slug === venue.slug;
                    return (
                      <Link
                        key={v.slug}
                        href={localePath(locale, `experiences/${v.slug}`)}
                        className={`flex shrink-0 items-center justify-center gap-1.5 whitespace-nowrap rounded-xl border px-3 py-2 text-xs font-semibold transition-all sm:shrink ${
                          isCurrent
                            ? "cavo-gold-gradient border-transparent text-white shadow-sm"
                            : "border-[var(--cavo-border)] bg-[#f1ede6] text-[var(--cavo-ink)]/85 hover:border-[var(--cavo-gold)]"
                        }`}
                      >
                        <span className="font-mono text-[10px] opacity-80">
                          {v.number}
                        </span>
                        <span className="truncate">{v.name[locale]}</span>
                      </Link>
                    );
                  })}
                </div>

                {/* Hours + Direct Phone Strip */}
                <div className="mt-2.5 flex flex-wrap items-center justify-between gap-2 border-t border-[var(--cavo-border)]/75 pt-2.5 px-1 text-[11px]">
                  <span className="inline-flex items-center gap-1 font-medium text-[var(--cavo-smoke)]">
                    <Clock className="h-3.5 w-3.5 text-[var(--cavo-gold-deep)]" />
                    <span>{venue.hours[locale]}</span>
                  </span>

                  <a
                    href={`tel:${venue.phoneDisplay.replace(/\s+/g, "")}`}
                    dir="ltr"
                    className="inline-flex items-center gap-1 font-mono font-bold text-[var(--cavo-gold-deep)] hover:underline"
                  >
                    <Phone className="h-3 w-3 text-[var(--cavo-gold)]" />
                    <span>{venue.phoneDisplay}</span>
                  </a>
                </div>
              </div>
            </FadeUp>
          </div>

          {/* Unified Interactive Gallery & Seating Configurator Pavilion */}
          <div className="overflow-hidden rounded-[24px] border border-[var(--cavo-gold)]/45 bg-[#f8f6f2] p-2.5 shadow-[0_26px_70px_-22px_rgba(70,54,36,0.2)] sm:rounded-[36px] sm:p-5">
            <div className="grid grid-cols-1 items-stretch gap-5 lg:grid-cols-12 lg:gap-6">
              {/* Left 7 Cols: Stacked Crossfade + Ken Burns + Swipe Stage + Filmstrip */}
              <div className="flex min-w-0 flex-col justify-between gap-3 lg:col-span-7">
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
                    setHeroPhotoIdx(
                      (prev) => (prev + step + photos.length) % photos.length
                    );
                  }}
                  className="relative aspect-[4/3] w-full overflow-hidden rounded-[18px] bg-[#1e1711] sm:aspect-[16/10] sm:rounded-[26px] lg:flex-1 lg:min-h-[390px]"
                >
                  {photos.map((photo, pIdx) => {
                    const isActive = pIdx === currentHeroIdx;
                    return (
                      <div
                        key={photo.src}
                        aria-hidden={!isActive}
                        className={`absolute inset-0 transition-opacity duration-700 ease-out ${
                          isActive
                            ? "z-10 opacity-100"
                            : "pointer-events-none z-0 opacity-0"
                        }`}
                      >
                        <div
                          key={isActive ? `${photo.src}-ken` : photo.src}
                          className={
                            isActive
                              ? "cavo-ken-burns relative h-full w-full"
                              : "relative h-full w-full"
                          }
                        >
                          <Image
                            src={photo.src}
                            alt={photo.alt[locale]}
                            fill
                            priority={pIdx === 0}
                            sizes="(max-width: 1024px) 100vw, 58vw"
                            className="object-cover"
                          />
                        </div>
                      </div>
                    );
                  })}

                  <div className="pointer-events-none absolute inset-0 z-20 bg-gradient-to-t from-[#221a12]/80 via-transparent to-[#221a12]/25" />

                  {/* Top Photo Counter & Fullscreen Trigger */}
                  <div className="absolute inset-x-3 top-3 z-30 flex items-center justify-between sm:inset-x-4 sm:top-4">
                    <span className="rounded-full border border-white/45 bg-[#f6f3ee]/95 px-3 py-1 font-mono text-[10px] font-bold text-[var(--cavo-gold-deep)] shadow-sm backdrop-blur-md sm:text-xs">
                      {isAr ? "معرض صور الوجهة" : "VENUE GALLERY"} · 0
                      {currentHeroIdx + 1} / 0{photos.length}
                    </span>

                    <button
                      type="button"
                      onClick={() => setLightboxIdx(currentHeroIdx)}
                      className="inline-flex items-center gap-1.5 rounded-full border border-white/45 bg-[#f6f3ee]/92 px-3 py-1 text-[10px] font-semibold text-[var(--cavo-ink)] shadow-sm backdrop-blur-md transition hover:bg-[var(--cavo-gold)] hover:text-white sm:text-xs"
                    >
                      <Maximize2 className="h-3 w-3" />
                      <span>{isAr ? "تكبير الصورة" : "Fullscreen"}</span>
                    </button>
                  </div>

                  {/* Prev / Next Arrows */}
                  <button
                    type="button"
                    onClick={() =>
                      setHeroPhotoIdx(
                        (prev) => (prev - 1 + photos.length) % photos.length
                      )
                    }
                    className="absolute start-2.5 top-1/2 z-30 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full border border-white/40 bg-[#261e16]/60 text-white backdrop-blur-md transition hover:scale-105 hover:bg-[var(--cavo-gold)] sm:h-9 sm:w-9"
                    aria-label={isAr ? "السابق" : "Previous"}
                  >
                    <ChevronLeft className="h-4 w-4 rtl:rotate-180" />
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      setHeroPhotoIdx((prev) => (prev + 1) % photos.length)
                    }
                    className="absolute end-2.5 top-1/2 z-30 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full border border-white/40 bg-[#261e16]/60 text-white backdrop-blur-md transition hover:scale-105 hover:bg-[var(--cavo-gold)] sm:h-9 sm:w-9"
                    aria-label={isAr ? "التالي" : "Next"}
                  >
                    <ChevronRight className="h-4 w-4 rtl:rotate-180" />
                  </button>

                  {/* Bottom Photo Caption */}
                  <div className="absolute inset-x-3.5 bottom-3 z-30 sm:inset-x-4 sm:bottom-4">
                    <p
                      key={activeHeroPhoto.src}
                      className="cavo-swap-in line-clamp-1 text-xs font-medium text-white drop-shadow-sm sm:text-sm"
                    >
                      {activeHeroPhoto.alt[locale]}
                    </p>
                  </div>
                </div>

                {/* All Venue Photos Filmstrip */}
                <div className="cavo-no-scrollbar flex gap-2 overflow-x-auto pb-1 sm:grid sm:grid-cols-6 sm:overflow-visible sm:pb-0">
                  {photos.map((photo, pIdx) => {
                    const isCurrent = pIdx === currentHeroIdx;
                    return (
                      <button
                        key={photo.src}
                        type="button"
                        onClick={() => setHeroPhotoIdx(pIdx)}
                        className={`relative aspect-[4/3] w-20 shrink-0 overflow-hidden rounded-xl border-2 transition-all sm:w-auto ${
                          isCurrent
                            ? "border-[var(--cavo-gold)] shadow-sm ring-1 ring-[var(--cavo-gold)]"
                            : "border-transparent opacity-70 hover:opacity-100"
                        }`}
                        aria-label={photo.alt[locale]}
                      >
                        <Image
                          src={photo.src}
                          alt={photo.alt[locale]}
                          fill
                          sizes="96px"
                          className="object-cover"
                        />
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Right 5 Cols: Interactive Seating Zone Configurator + Verified Highlights + Direct Booking */}
              <div className="flex min-w-0 flex-col justify-between gap-4 rounded-[20px] border border-[var(--cavo-border)] bg-[#f3efe8] p-3.5 sm:rounded-[26px] sm:p-5 lg:col-span-5">
                <div className="space-y-4">
                  {/* 1. Interactive Seating Selector */}
                  <div>
                    <div className="mb-2 flex items-center justify-between">
                      <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[var(--cavo-gold-deep)]">
                        <Compass className="h-3.5 w-3.5 text-[var(--cavo-gold)]" />
                        {isAr
                          ? "1. اختر منطقة الجلوس المفضلة:"
                          : "1. Choose Your Seating Zone:"}
                      </span>
                    </div>

                    <div className="space-y-2">
                      {venue.seatingOptions.map((seat, idx) => {
                        const isSelected = seat.id === selectedSeat?.id;
                        return (
                          <button
                            key={seat.id}
                            type="button"
                            onClick={() => setSelectedSeatId(seat.id)}
                            className={`flex w-full items-center justify-between gap-3 rounded-2xl border px-3.5 py-2.5 text-start transition-all duration-300 ${
                              isSelected
                                ? "border-[var(--cavo-gold)] bg-[#f8f6f2] shadow-sm"
                                : "border-[var(--cavo-border)] bg-[#f8f6f2]/65 hover:border-[var(--cavo-gold)]/60"
                            }`}
                          >
                            <div className="flex min-w-0 items-center gap-2.5">
                              <span
                                className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full font-mono text-[10px] font-bold ${
                                  isSelected
                                    ? "cavo-gold-gradient text-white"
                                    : "bg-[var(--cavo-gold-pale)] text-[var(--cavo-gold-deep)]"
                                }`}
                              >
                                0{idx + 1}
                              </span>
                              <div className="min-w-0">
                                <p className="truncate text-xs font-bold text-[var(--cavo-ink)] sm:text-sm">
                                  {seat.label[locale]}
                                </p>
                                <p className="text-[10px] text-[var(--cavo-smoke)]">
                                  {seat.requiresConfirmation
                                    ? isAr
                                      ? "يُؤكد توافرها مع الاستقبال"
                                      : "Subject to host confirmation"
                                    : isAr
                                      ? "متاح للطلب المباشر"
                                      : "Standard reservation"}
                                </p>
                              </div>
                            </div>

                            <span
                              className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${
                                isSelected
                                  ? "border-[var(--cavo-gold)] bg-[var(--cavo-gold)] text-white"
                                  : "border-[var(--cavo-border)]"
                              }`}
                            >
                              {isSelected && <Check className="h-3 w-3" />}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* 2. Compact Verified Venue Highlights */}
                  <div className="border-t border-[var(--cavo-border)]/80 pt-3.5">
                    <p className="mb-2 text-xs font-bold text-[var(--cavo-gold-deep)]">
                      {isAr ? "2. مميزات هذه التجربة:" : "2. Venue Highlights:"}
                    </p>
                    <ul className="space-y-1.5">
                      {venue.highlights[locale].map((h) => (
                        <li
                          key={h}
                          className="flex items-start gap-2 text-xs leading-snug text-[var(--cavo-ink)]"
                        >
                          <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[var(--cavo-gold-deep)]" />
                          <span>{h}</span>
                        </li>
                      ))}
                    </ul>

                    {venue.slug === "private-yacht" && (
                      <p className="mt-2.5 rounded-xl border border-[var(--cavo-gold)]/35 bg-[#f8f6f2] p-2.5 text-[11px] leading-relaxed text-[var(--cavo-smoke)]">
                        {
                          businessConfirmationRegistry
                            .privateYachtCapacityAndRates.note[locale]
                        }
                      </p>
                    )}
                  </div>

                  {/* 3. Best For Occasion Pills */}
                  <div className="flex flex-wrap gap-1.5 border-t border-[var(--cavo-border)]/80 pt-3">
                    {venue.bestFor[locale].map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full border border-[var(--cavo-border)] bg-[#f8f6f2] px-2.5 py-0.5 text-[10px] font-semibold text-[var(--cavo-gold-deep)] sm:text-[11px]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Direct Reservation & WhatsApp Action Bar for Selected Seating Zone */}
                <div className="grid grid-cols-1 gap-2 border-t border-[var(--cavo-border)] pt-3.5 sm:grid-cols-2">
                  <Link
                    href={localePath(locale, `book?venue=${venue.slug}`)}
                    onClick={() =>
                      trackCavoEvent("booking_start", {
                        venue: venue.slug,
                        source: "venue_detail_pavilion",
                      })
                    }
                    className="cavo-btn-gold inline-flex items-center justify-center gap-1.5 rounded-full px-4 py-3 text-xs font-semibold"
                  >
                    <CalendarCheck className="h-3.5 w-3.5" />
                    <span>
                      {isAr
                        ? `احجز في ${venue.name.ar}`
                        : `Reserve ${venue.name.en}`}
                    </span>
                  </Link>

                  <a
                    href={buildWhatsAppUrl(
                      venue.whatsappDigits,
                      seatWhatsAppMessage
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="cavo-btn-pearl inline-flex items-center justify-center gap-1.5 rounded-full px-4 py-3 text-xs font-semibold"
                  >
                    <MessageCircle className="h-3.5 w-3.5 text-[var(--cavo-gold-deep)]" />
                    <span>
                      {isAr ? "اطلب الجلسة واتساب" : "WhatsApp This Zone"}
                    </span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 02 — PRIVATE YACHT CHARTER FORMATS (ONLY ON PRIVATE YACHT PAGE) */}
        {venue.slug === "private-yacht" && (
          <FadeUp className="space-y-5">
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--cavo-border)] bg-[#f8f6f2] px-3 py-1 text-[11px] font-semibold text-[var(--cavo-gold-deep)]">
                <Sparkles className="h-3 w-3 text-[var(--cavo-gold)]" />
                <span>
                  {isAr
                    ? "تنسيقات رحلات اليخت الخاص"
                    : "TAILORED YACHT CHARTER FORMATS"}
                </span>
              </span>
              <h2 className="font-display mt-2 text-2xl font-semibold text-[var(--cavo-ink)] sm:text-3xl">
                {isAr
                  ? "رتّب رحلة اليخت المناسبة لمناسبتك."
                  : "Ways Guests Charter Yachts by Cavo."}
              </h2>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              {privateYachtInquiryFormats.map((fmt) => (
                <div
                  key={fmt.id}
                  className="cavo-card-luxury cavo-sheen-card flex min-w-0 flex-col justify-between rounded-[24px] p-5"
                >
                  <div>
                    <span className="inline-block rounded-full bg-[var(--cavo-gold-pale)] px-3 py-1 text-[10px] font-semibold text-[var(--cavo-gold-deep)]">
                      {fmt.confirmationNote[locale]}
                    </span>
                    <h3 className="font-display mt-3 text-xl font-semibold text-[var(--cavo-ink)] sm:text-2xl">
                      {fmt.name[locale]}
                    </h3>
                    <p className="mt-1.5 text-xs leading-relaxed text-[var(--cavo-smoke)]">
                      {fmt.subtitle[locale]}
                    </p>

                    <ul className="mt-3.5 space-y-1.5 border-t border-[var(--cavo-border)] pt-3 text-xs">
                      {fmt.suggestedFocus[locale].map((inc) => (
                        <li key={inc} className="flex items-start gap-2">
                          <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[var(--cavo-gold-deep)]" />
                          <span>{inc}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Link
                    href={localePath(locale, "private-events")}
                    className="cavo-btn-gold mt-4 inline-flex items-center justify-center gap-1.5 rounded-full px-5 py-2.5 text-xs font-semibold"
                  >
                    <span>
                      {isAr
                        ? "صمّم استفسار هذه المناسبة"
                        : "Start Charter Inquiry"}
                    </span>
                    <ArrowRight className="h-3.5 w-3.5 rtl:rotate-180" />
                  </Link>
                </div>
              ))}
            </div>
          </FadeUp>
        )}

        {/* SECTION 03 — CURATED CULINARY & DRINK PAIRINGS FOR THIS VENUE */}
        <FadeUp className="rounded-[26px] border border-[var(--cavo-border)] bg-[#f8f6f2] p-4 shadow-sm sm:rounded-[34px] sm:p-7">
          <div className="mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--cavo-border)] bg-[#f1ede6] px-3 py-1 text-[10px] font-bold text-[var(--cavo-gold-deep)] sm:text-[11px]">
                <UtensilsCrossed className="h-3 w-3 text-[var(--cavo-gold)]" />
                <span>
                  {isAr
                    ? `ترشيحات المطبخ في ${venue.name.ar}`
                    : `SIGNATURE PAIRINGS AT ${venue.name.en.toUpperCase()}`}
                </span>
              </span>
              <h2 className="font-display mt-2 text-2xl font-semibold text-[var(--cavo-ink)] sm:text-3xl">
                {isAr
                  ? "أطباق ومشروبات تكمل أجواء جلستك."
                  : "Culinary Creations Matched to This Venue."}
              </h2>
            </div>

            <Link
              href={localePath(locale, "menu")}
              className="cavo-btn-gold inline-flex items-center gap-1.5 self-start rounded-full px-5 py-2.5 text-xs font-semibold sm:self-auto"
            >
              <span>
                {isAr
                  ? "استعرض المنيو التفاعلي وحاسبة الفاتورة"
                  : "Explore Interactive Menu"}
              </span>
              <ArrowRight className="h-3.5 w-3.5 rtl:rotate-180" />
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-2.5 sm:gap-4 lg:grid-cols-4">
            {pairedDishes.map((dish) => (
              <Link
                key={dish.id}
                href={localePath(locale, "menu")}
                className="cavo-sheen-card group flex min-w-0 flex-col justify-between overflow-hidden rounded-[20px] border border-[var(--cavo-border)] bg-[#f3efe8] p-2 transition-all duration-300 hover:-translate-y-1 hover:border-[var(--cavo-gold)] hover:bg-white hover:shadow-md sm:rounded-[24px] sm:p-2.5"
              >
                <div>
                  <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[14px] bg-[var(--cavo-stone)] sm:rounded-[16px]">
                    <Image
                      src={dish.image}
                      alt={dish.name[locale]}
                      fill
                      sizes="(max-width: 640px) 50vw, 25vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <span className="absolute end-2 top-2 rounded-full border border-[var(--cavo-gold)]/45 bg-[#f6f3ee]/95 px-2.5 py-0.5 font-mono text-[10px] font-bold text-[var(--cavo-gold-deep)] shadow-sm sm:text-xs">
                      {dish.priceEgp} {isAr ? "ج.م" : "EGP"}
                    </span>
                  </div>

                  <div className="p-1.5 pt-2.5">
                    <span className="text-[10px] font-bold text-[var(--cavo-gold-deep)]">
                      {dietaryLabels[dish.tags[0] ?? "signature"][locale]}
                    </span>
                    <h3 className="font-display mt-0.5 line-clamp-1 text-sm font-semibold text-[var(--cavo-ink)] group-hover:text-[var(--cavo-gold-deep)] sm:text-xl">
                      {dish.name[locale]}
                    </h3>
                    <p className="mt-1 line-clamp-2 text-[10px] leading-relaxed text-[var(--cavo-smoke)] sm:text-xs">
                      {dish.description[locale]}
                    </p>
                  </div>
                </div>

                <div className="mt-2 flex items-center justify-between border-t border-[var(--cavo-border)]/70 px-1.5 pt-2 text-[10px] font-semibold text-[var(--cavo-gold-deep)] sm:text-[11px]">
                  <span>{isAr ? "احسبها في المنيو" : "Estimate in Menu"}</span>
                  <ArrowRight className="h-3 w-3 rtl:rotate-180" />
                </div>
              </Link>
            ))}
          </div>
        </FadeUp>

        {/* SECTION 04 — COMPACT CONTINUE THE TOUR (OTHER 3 VENUES) */}
        <FadeUp>
          <div className="mb-4 flex items-center justify-between px-1">
            <h2 className="font-display text-xl font-semibold text-[var(--cavo-ink)] sm:text-2xl">
              {isAr
                ? "استكشف باقي تجارب كافو على المركب"
                : "Continue Exploring CAVO's Other Venues"}
            </h2>
            <Link
              href={localePath(locale, "experiences")}
              className="text-xs font-semibold text-[var(--cavo-gold-deep)] hover:underline"
            >
              {isAr ? "مقارنة الـ 4 تجارب" : "Compare All 4"}
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4">
            {otherVenues.map((other) => (
              <Link
                key={other.slug}
                href={localePath(locale, `experiences/${other.slug}`)}
                className="cavo-card-luxury cavo-sheen-card group flex items-center gap-3.5 rounded-2xl p-3"
              >
                <div className="relative h-14 w-18 shrink-0 overflow-hidden rounded-xl border border-[var(--cavo-border)] bg-[var(--cavo-stone)] sm:h-16 sm:w-20">
                  <Image
                    src={other.cardImage}
                    alt={other.name[locale]}
                    fill
                    sizes="80px"
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] font-bold text-[var(--cavo-gold-deep)]">
                      {other.number} · {other.role[locale]}
                    </span>
                    <ArrowRight className="h-3.5 w-3.5 shrink-0 text-[var(--cavo-gold)] transition-transform duration-300 group-hover:translate-x-0.5 rtl:rotate-180 rtl:group-hover:-translate-x-0.5" />
                  </div>
                  <h3 className="font-display truncate text-lg font-semibold text-[var(--cavo-ink)] group-hover:text-[var(--cavo-gold-deep)] sm:text-xl">
                    {other.name[locale]}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </FadeUp>
      </div>

      {/* FULLSCREEN LIGHTBOX MODAL */}
      {lightboxIdx !== null && photos[lightboxIdx] && (
        <div
          onClick={() => setLightboxIdx(null)}
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
            setLightboxIdx(
              (lightboxIdx + step + photos.length) % photos.length
            );
          }}
          className="cavo-fade-in fixed inset-0 z-50 flex items-center justify-center bg-[#140f0b]/90 p-3 backdrop-blur-xl sm:p-4"
          role="dialog"
          aria-modal="true"
        >
          <button
            type="button"
            onClick={() => setLightboxIdx(null)}
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
                src={photos[lightboxIdx].src}
                alt={photos[lightboxIdx].alt[locale]}
                fill
                sizes="100vw"
                className="object-contain"
              />
              <button
                type="button"
                onClick={() =>
                  setLightboxIdx(
                    (lightboxIdx - 1 + photos.length) % photos.length
                  )
                }
                className="absolute start-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-[#261e16]/75 text-white transition hover:bg-[var(--cavo-gold)]"
                aria-label={isAr ? "السابق" : "Previous"}
              >
                <ChevronLeft className="h-4 w-4 rtl:rotate-180" />
              </button>
              <button
                type="button"
                onClick={() =>
                  setLightboxIdx((lightboxIdx + 1) % photos.length)
                }
                className="absolute end-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-[#261e16]/75 text-white transition hover:bg-[var(--cavo-gold)]"
                aria-label={isAr ? "التالي" : "Next"}
              >
                <ChevronRight className="h-4 w-4 rtl:rotate-180" />
              </button>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 p-3">
              <div>
                <span className="font-mono text-xs font-bold text-[var(--cavo-gold-deep)]">
                  0{lightboxIdx + 1} / 0{photos.length} · {venue.name[locale]}
                </span>
                <p className="mt-0.5 text-xs font-medium text-[var(--cavo-ink)] sm:text-sm">
                  {photos[lightboxIdx].alt[locale]}
                </p>
              </div>

              <Link
                href={localePath(locale, `book?venue=${venue.slug}`)}
                className="cavo-btn-gold shrink-0 rounded-full px-5 py-2 text-xs font-semibold"
              >
                {isAr ? "احجز الآن" : "Book Now"}
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
