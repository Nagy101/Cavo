"use client";

import { useEffect, useRef, useState } from "react";
import { Compass, ExternalLink, MapPin } from "lucide-react";
import { siteConfig } from "@/data/site";
import { trackCavoEvent } from "@/lib/analytics";
import type { Locale } from "@/lib/i18n";

interface NileMapEmbedProps {
  locale: Locale;
  className?: string;
}

export function NileMapEmbed({ locale, className = "" }: NileMapEmbedProps) {
  const isAr = locale === "ar";
  const containerRef = useRef<HTMLDivElement>(null);
  const [shouldLoadMap, setShouldLoadMap] = useState(false);

  // Auto-load the real interactive Google Map as soon as the user nears this section
  useEffect(() => {
    const el = containerRef.current;
    if (!el || typeof window === "undefined") return;
    if (!("IntersectionObserver" in window)) {
      setShouldLoadMap(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setShouldLoadMap(true);
          observer.disconnect();
        }
      },
      { rootMargin: "350px 0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden rounded-[18px] border border-[var(--cavo-border)] bg-[#ebe5dc] sm:rounded-[24px] ${className}`}
    >
      {shouldLoadMap ? (
        <iframe
          title={
            isAr
              ? "خريطة موقع كافو آيلاند بالزمالك"
              : "CAVO Island Nile City Boat Map"
          }
          src={siteConfig.mapsEmbedUrl}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="h-full w-full border-0"
        />
      ) : (
        <div className="flex h-full w-full flex-col items-center justify-center gap-3 bg-gradient-to-br from-[#f6f3ee] via-[#efeae1] to-[#e4dcd0] p-6 text-center text-[var(--cavo-ink)]">
          <span className="flex h-12 w-12 items-center justify-center rounded-full border border-[var(--cavo-gold)]/40 bg-[#f8f6f2] text-[var(--cavo-gold-deep)] shadow-sm">
            <MapPin className="h-5 w-5" />
          </span>
          <div>
            <p className="font-display text-xl font-semibold">
              {siteConfig.address[locale]}
            </p>
            <p className="mt-1 text-xs text-[var(--cavo-smoke)]">
              {siteConfig.landmarkNote[locale]}
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => setShouldLoadMap(true)}
              className="cavo-btn-pearl rounded-full px-4 py-2 text-xs font-semibold"
            >
              {isAr ? "عرض الخريطة التفاعلية" : "Show Interactive Map"}
            </button>
            <a
              href={siteConfig.mapsDirectionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() =>
                trackCavoEvent("directions_click", { source: "map_preview" })
              }
              className="cavo-btn-gold inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-semibold"
            >
              <Compass className="h-3.5 w-3.5" />
              <span>{isAr ? "افتح الاتجاهات" : "Get Directions"}</span>
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
