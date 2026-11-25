"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Clock, Compass, Phone, Sparkles } from "lucide-react";
import { FadeUp } from "@/components/MotionPrimitives";
import { experienceFinderIntents } from "@/data/copy";
import { venues } from "@/data/venues";
import { trackCavoEvent } from "@/lib/analytics";
import { localePath, type Locale } from "@/lib/i18n";

export function EditorialVenuesShowcase({ locale }: { locale: Locale }) {
  const isAr = locale === "ar";
  const [selectedIntentId, setSelectedIntentId] = useState<string | null>(null);

  const activeIntent = experienceFinderIntents.find(
    (intent) => intent.id === selectedIntentId
  );

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Interactive Mood-to-Venue Concierge Matcher */}
      <FadeUp className="rounded-2xl border border-[var(--cavo-gold)]/30 bg-[#faf8f4]/90 p-3 shadow-sm backdrop-blur-sm sm:rounded-full sm:px-5 sm:py-2.5">
        <div className="flex flex-col gap-2.5 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
          <div className="flex items-center gap-2 px-1">
            <Compass className="h-4 w-4 shrink-0 text-[var(--cavo-gold-deep)]" />
            <span className="text-xs font-bold text-[var(--cavo-ink)]">
              {isAr
                ? "اختر أجواء زيارتك لنرشّح لك الوجهة الأنسب:"
                : "Select your mood for an instant venue match:"}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-1.5 sm:flex sm:flex-wrap sm:items-center sm:gap-1.5">
            {experienceFinderIntents.map((intent) => {
              const active = selectedIntentId === intent.id;
              return (
                <button
                  key={intent.id}
                  type="button"
                  onClick={() =>
                    setSelectedIntentId((prev) =>
                      prev === intent.id ? null : intent.id
                    )
                  }
                  className={`min-h-[36px] rounded-xl px-3 py-1.5 text-[11px] font-semibold transition-all duration-300 sm:rounded-full sm:px-3.5 ${
                    active
                      ? "cavo-gold-gradient text-white shadow-sm"
                      : "border border-[var(--cavo-border)] bg-[#f2ede4] text-[var(--cavo-ink)] hover:border-[var(--cavo-gold)] hover:text-[var(--cavo-gold-deep)]"
                  }`}
                >
                  {intent.questionTag[locale]}
                </button>
              );
            })}
          </div>
        </div>

        {activeIntent && (
          <div className="cavo-swap-in mt-2.5 flex flex-wrap items-center justify-between gap-2 rounded-xl border border-[var(--cavo-gold)]/35 bg-[var(--cavo-gold-pale)]/75 px-3.5 py-2 text-xs text-[var(--cavo-ink)] sm:rounded-full sm:px-4">
            <span className="inline-flex items-center gap-1.5 font-semibold text-[var(--cavo-gold-deep)]">
              <Sparkles className="h-3.5 w-3.5 shrink-0 text-[var(--cavo-gold)]" />
              <span>{activeIntent.recommendationNote[locale]}</span>
            </span>
            <button
              type="button"
              onClick={() => setSelectedIntentId(null)}
              className="text-[11px] font-semibold text-[var(--cavo-smoke)] underline hover:text-[var(--cavo-ink)]"
            >
              {isAr ? "عرض الكل بالتساوي" : "Reset"}
            </button>
          </div>
        )}
      </FadeUp>

      {/* 4 Signature Destination Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4">
        {venues.map((venue, idx) => {
          const isMatched = activeIntent?.recommendedVenue === venue.slug;
          const isDimmed = Boolean(activeIntent) && !isMatched;

          return (
            <FadeUp
              key={venue.slug}
              delay={idx * 0.08}
              className="flex min-w-0"
            >
              <article
                className={`cavo-sheen-card group relative flex w-full min-w-0 flex-col justify-between overflow-hidden rounded-[24px] border p-2.5 transition-all duration-500 sm:rounded-[28px] sm:p-3 ${
                  isMatched
                    ? "-translate-y-1.5 border-[var(--cavo-gold-deep)] bg-[#fcfaf7] shadow-[0_28px_65px_-16px_rgba(95,72,46,0.32)] ring-2 ring-[var(--cavo-gold)]/65"
                    : isDimmed
                      ? "border-[var(--cavo-border)] bg-[#f8f6f2]/85 opacity-80 hover:-translate-y-1.5 hover:border-[var(--cavo-gold)] hover:opacity-100"
                      : "border-[var(--cavo-border)] bg-[#f8f6f2] shadow-[0_16px_42px_-18px_rgba(70,54,36,0.15)] hover:-translate-y-2 hover:border-[var(--cavo-gold)] hover:shadow-[0_28px_60px_-18px_rgba(90,70,48,0.25)]"
                }`}
              >
                {/* Top Animated Brushed-Gold Hairline */}
                <div
                  className={`cavo-gold-gradient pointer-events-none absolute inset-x-6 top-0 z-20 h-[2.5px] rounded-full transition-transform duration-500 ${
                    isMatched
                      ? "scale-x-100"
                      : "scale-x-0 group-hover:scale-x-100"
                  }`}
                />

                <div>
                  {/* Sculpted Image Frame */}
                  <div className="relative aspect-[16/10] w-full overflow-hidden rounded-[18px] bg-[var(--cavo-stone)] sm:aspect-[4/4.3] sm:rounded-[20px]">
                    <Image
                      src={venue.cardImage}
                      alt={venue.name[locale]}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-108"
                    />
                    <div
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#1d150e]/90 via-[#1d150e]/22 to-transparent"
                    />

                    {/* Top Number Pill & Instagram Handle / Match Ribbon */}
                    <div className="absolute inset-x-3 top-3 flex items-center justify-between gap-2">
                      <span className="inline-flex items-center gap-1 rounded-full border border-white/50 bg-[#f6f3ee]/95 px-2.5 py-0.5 font-mono text-[11px] font-bold text-[var(--cavo-gold-deep)] shadow-sm backdrop-blur-md">
                        <Sparkles className="h-2.5 w-2.5 text-[var(--cavo-gold)]" />
                        {venue.number}
                      </span>

                      {isMatched ? (
                        <span className="cavo-pill-in cavo-gold-gradient inline-flex items-center gap-1 rounded-full border border-[#f5dfc0]/50 px-2.5 py-0.5 text-[10px] font-bold text-white shadow-md">
                          <Sparkles className="h-2.5 w-2.5" />
                          <span>{isAr ? "الأنسب لك" : "Top Match"}</span>
                        </span>
                      ) : (
                        <span className="rounded-full border border-white/25 bg-[#241b13]/75 px-2.5 py-0.5 font-mono text-[10px] text-white backdrop-blur-md">
                          {venue.instagramHandle}
                        </span>
                      )}
                    </div>

                    {/* Bottom Title & Role Inside Photo */}
                    <div className="absolute inset-x-3.5 bottom-3.5">
                      <p className="text-[11px] font-semibold text-[#ede4d6]">
                        {venue.role[locale]}
                      </p>
                      <h3 className="font-display mt-0.5 text-2xl font-semibold leading-tight text-white drop-shadow-sm">
                        {venue.name[locale]}
                      </h3>
                    </div>
                  </div>

                  {/* Concise Editorial Details */}
                  <div className="p-2.5 pt-3.5 sm:p-3 sm:pt-4">
                    <p className="line-clamp-2 break-words text-xs leading-relaxed text-[var(--cavo-smoke)]">
                      {venue.shortDesc[locale]}
                    </p>

                    {/* 2 Occasion Pills */}
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {venue.bestFor[locale].slice(0, 2).map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full border border-[var(--cavo-border)] bg-[#f1ede6] px-2.5 py-0.5 text-[10px] font-medium text-[var(--cavo-ink)]"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Card Footer: Clean Non-Truncating Hours, Phone & Actions */}
                <div className="border-t border-[var(--cavo-border)] px-2.5 pt-3 pb-1 sm:px-3">
                  <div className="mb-3 space-y-1 text-[11px] text-[var(--cavo-smoke)]">
                    <p className="flex items-center gap-1.5 truncate">
                      <Clock className="h-3 w-3 shrink-0 text-[var(--cavo-gold-deep)]" />
                      <span className="truncate">{venue.hours[locale]}</span>
                    </p>

                    <a
                      href={`tel:${venue.phoneDisplay.replace(/\s+/g, "")}`}
                      dir="ltr"
                      className="inline-flex items-center gap-1.5 font-mono text-[11px] font-bold text-[var(--cavo-gold-deep)] hover:underline"
                    >
                      <Phone className="h-3 w-3 shrink-0 text-[var(--cavo-gold)]" />
                      <span>{venue.phoneDisplay}</span>
                    </a>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <Link
                      href={localePath(locale, `experiences/${venue.slug}`)}
                      onClick={() =>
                        trackCavoEvent("experience_select", {
                          venue: venue.slug,
                          source: "home_4col_grid",
                        })
                      }
                      className="cavo-btn-pearl inline-flex min-h-[40px] items-center justify-center gap-1 rounded-full px-3 py-2 text-xs font-semibold"
                    >
                      <span>{isAr ? "التفاصيل" : "Explore"}</span>
                      <ArrowRight className="h-3 w-3 rtl:rotate-180" />
                    </Link>

                    <Link
                      href={localePath(locale, `book?venue=${venue.slug}`)}
                      onClick={() =>
                        trackCavoEvent("booking_start", {
                          venue: venue.slug,
                          source: "home_4col_grid",
                        })
                      }
                      className="cavo-btn-gold inline-flex min-h-[40px] items-center justify-center rounded-full px-3 py-2 text-xs font-semibold"
                    >
                      {isAr ? "احجز الآن" : "Reserve"}
                    </Link>
                  </div>
                </div>
              </article>
            </FadeUp>
          );
        })}
      </div>
    </div>
  );
}
