"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import {
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Play,
  Sparkles,
  X,
} from "lucide-react";
import {
  galleryCategories,
  galleryItems,
  type GalleryCategory,
} from "@/data/gallery";
import type { Locale } from "@/lib/i18n";

const MEDIA_CACHE_VER = "v=9";

function withMediaVersion(src?: string): string | undefined {
  if (!src) return undefined;
  return src.includes("?") ? src : `${src}?${MEDIA_CACHE_VER}`;
}

interface GalleryGridProps {
  locale: Locale;
  limit?: number;
  showFilters?: boolean;
}

export function GalleryGrid({
  locale,
  limit,
  showFilters = true,
}: GalleryGridProps) {
  const [filter, setFilter] = useState<"all" | GalleryCategory>("all");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [isMobileViewport, setIsMobileViewport] = useState(false);
  const [lightboxVideoPlaying, setLightboxVideoPlaying] = useState(false);
  const [lightboxImgLoaded, setLightboxImgLoaded] = useState(false);
  const lightboxVideoRef = useRef<HTMLVideoElement | null>(null);
  const isAr = locale === "ar";

  useEffect(() => {
    const mql = window.matchMedia("(max-width: 767px)");
    setIsMobileViewport(mql.matches);
    const onChange = (e: MediaQueryListEvent) => setIsMobileViewport(e.matches);
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  const filtered =
    filter === "all"
      ? galleryItems
      : galleryItems.filter((item) => item.category === filter);

  const visibleItems = limit ? filtered.slice(0, limit) : filtered;

  useEffect(() => {
    setLightboxVideoPlaying(false);
    setLightboxImgLoaded(false);
    if (lightboxIndex === null) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightboxIndex(null);
      if (e.key === "ArrowRight") {
        setLightboxIndex((prev) =>
          prev === null ? null : (prev + 1) % visibleItems.length
        );
      }
      if (e.key === "ArrowLeft") {
        setLightboxIndex((prev) =>
          prev === null
            ? null
            : (prev - 1 + visibleItems.length) % visibleItems.length
        );
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [lightboxIndex, visibleItems.length]);

  const activeLightbox =
    lightboxIndex !== null ? visibleItems[lightboxIndex] : null;

  return (
    <div>
      {showFilters && (
        <div
          className="cavo-no-scrollbar mb-6 flex flex-nowrap items-center gap-1.5 overflow-x-auto rounded-full border border-[var(--cavo-border)] bg-[#f8f6f2] p-1.5 shadow-sm sm:mb-9 sm:inline-flex sm:flex-wrap sm:gap-2"
          role="tablist"
          aria-label={isAr ? "تصنيفات معرض الصور" : "Gallery Filter Tabs"}
        >
          {galleryCategories.map((cat) => {
            const active = filter === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => {
                  setFilter(cat.id);
                  setLightboxIndex(null);
                }}
                className={`relative min-h-[38px] shrink-0 whitespace-nowrap rounded-full px-3.5 py-2 text-[11px] font-semibold transition-all duration-300 sm:px-5 sm:py-2.5 sm:text-xs ${
                  active
                    ? "cavo-gold-gradient text-white shadow-sm"
                    : "text-[var(--cavo-ink)]/85 hover:bg-[var(--cavo-gold-pale)]/70 hover:text-[var(--cavo-gold-deep)]"
                }`}
              >
                {cat.label[locale]}
              </button>
            );
          })}
        </div>
      )}

      {/* Editorial 2-Column Bento Mosaic on Mobile, 3-Column on Desktop */}
      <div
        key={filter}
        className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-3"
      >
        {visibleItems.map((item, idx) => {
          const isHeroTileMobile = idx === 0 || idx === 5;
          return (
            <button
              key={item.id}
              type="button"
              style={{ "--d": `${idx * 0.05}s` } as CSSProperties}
              onClick={() => setLightboxIndex(idx)}
              className={`cavo-swap-in cavo-sheen-card group relative flex flex-col overflow-hidden rounded-[20px] border border-[var(--cavo-border)] bg-[#f8f6f2] p-2 text-start shadow-[0_14px_38px_-18px_rgba(70,54,36,0.14)] transition-all duration-500 hover:-translate-y-1.5 hover:border-[var(--cavo-gold)] hover:shadow-[0_24px_55px_-18px_rgba(90,70,48,0.22)] sm:rounded-[28px] sm:p-2.5 ${
                isHeroTileMobile ? "col-span-2 sm:col-span-1" : "col-span-1"
              }`}
            >
              <div
                className={`relative w-full overflow-hidden rounded-[14px] bg-[var(--cavo-stone)] sm:aspect-[4/3.1] sm:rounded-[20px] ${
                  isHeroTileMobile ? "aspect-[16/9]" : "aspect-[4/3.4]"
                }`}
              >
                {item.mediaType === "video" &&
                item.mobilePoster &&
                item.poster ? (
                  <>
                    <Image
                      src={item.mobilePoster}
                      alt={item.title[locale]}
                      fill
                      sizes="50vw"
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-110 md:hidden"
                    />
                    <Image
                      src={item.poster}
                      alt={item.title[locale]}
                      fill
                      sizes="(max-width: 1024px) 50vw, 33vw"
                      className="hidden object-cover transition-transform duration-700 ease-out group-hover:scale-110 md:block"
                    />
                  </>
                ) : (
                  <Image
                    src={
                      item.mediaType === "video" && item.poster
                        ? item.poster
                        : item.src
                    }
                    alt={item.title[locale]}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                  />
                )}

                {/* Subtle Warm Vignette */}
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#1f1710]/82 via-[#1f1710]/18 to-transparent transition-opacity duration-500 group-hover:opacity-90" />

                {/* Top Venue Badge & Expand Lens */}
                <div className="absolute inset-x-2.5 top-2.5 flex items-center justify-between gap-2 sm:inset-x-3.5 sm:top-3.5">
                  <span className="inline-flex items-center gap-1 rounded-full border border-white/50 bg-[#f6f3ee]/94 px-2.5 py-0.5 text-[10px] font-bold text-[var(--cavo-gold-deep)] shadow-sm backdrop-blur-md sm:px-3 sm:py-1 sm:text-[11px]">
                    <Sparkles className="h-2.5 w-2.5 text-[var(--cavo-gold)] sm:h-3 sm:w-3" />
                    <span className="truncate">{item.venueTag[locale]}</span>
                  </span>

                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/45 bg-[#f6f3ee]/92 text-[var(--cavo-ink)] shadow-md backdrop-blur-md transition-all duration-300 group-hover:scale-110 group-hover:border-[var(--cavo-gold)] group-hover:bg-[var(--cavo-gold-deep)] group-hover:text-white sm:h-9 sm:w-9">
                    {item.mediaType === "video" ? (
                      <Play className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                    ) : (
                      <Maximize2 className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                    )}
                  </span>
                </div>

                {/* Bottom Caption Overlay */}
                <div className="absolute inset-x-3 bottom-3 transition-transform duration-300 group-hover:-translate-y-0.5 sm:inset-x-4 sm:bottom-4">
                  <h3 className="font-display line-clamp-1 text-base font-semibold text-white drop-shadow-sm sm:text-2xl">
                    {item.title[locale]}
                  </h3>
                  <p className="mt-0.5 hidden line-clamp-2 text-xs leading-relaxed text-white/90 sm:block">
                    {item.caption[locale]}
                  </p>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Lightbox Dialog — Portaled directly into document.body so it ALWAYS centers over the viewport */}
      {activeLightbox &&
        lightboxIndex !== null &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            onClick={() => setLightboxIndex(null)}
            onTouchStart={(e) => setTouchStartX(e.touches[0]?.clientX ?? null)}
            onTouchEnd={(e) => {
              if (touchStartX === null) return;
              const endX = e.changedTouches[0]?.clientX ?? touchStartX;
              const deltaX = endX - touchStartX;
              setTouchStartX(null);
              if (Math.abs(deltaX) < 42) return;
              const dir = deltaX < 0 ? 1 : -1;
              const step = isAr ? -dir : dir;
              setLightboxIndex(
                (lightboxIndex + step + visibleItems.length) % visibleItems.length
              );
            }}
            className="cavo-fade-in fixed inset-0 z-[120] flex items-center justify-center bg-[#140f0b]/92 p-3 backdrop-blur-md sm:p-4"
            role="dialog"
            aria-modal="true"
            aria-label={activeLightbox.title[locale]}
          >
            <button
              type="button"
              onClick={() => setLightboxIndex(null)}
              aria-label={isAr ? "إغلاق" : "Close lightbox"}
              className="absolute end-4 top-4 z-20 flex h-10 w-10 items-center justify-center rounded-full border border-[var(--cavo-gold)]/45 bg-[#f6f3ee] text-[var(--cavo-ink)] shadow-lg transition hover:scale-105 hover:bg-[var(--cavo-gold-deep)] hover:text-white sm:end-6 sm:top-6 sm:h-11 sm:w-11"
            >
              <X className="h-5 w-5" />
            </button>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setLightboxIndex(
                  (lightboxIndex - 1 + visibleItems.length) % visibleItems.length
                );
              }}
              aria-label={isAr ? "السابق" : "Previous frame"}
              className="absolute start-2 top-1/2 z-20 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-[var(--cavo-gold)]/45 bg-[#f6f3ee] text-[var(--cavo-ink)] shadow-lg transition hover:scale-105 hover:bg-[var(--cavo-gold-deep)] hover:text-white sm:start-4 sm:flex"
            >
              <ChevronLeft className="h-5 w-5 rtl:rotate-180" />
            </button>

            <div
              onClick={(e) => e.stopPropagation()}
              className="cavo-zoom-in max-h-[92svh] w-full max-w-4xl overflow-y-auto rounded-[24px] border border-[var(--cavo-gold)]/45 bg-[#f6f3ee] p-2.5 text-[var(--cavo-ink)] shadow-2xl sm:rounded-[32px] sm:p-3"
            >
              <div
                onTouchStart={(e) => {
                  if (activeLightbox.mediaType === "video") {
                    e.stopPropagation();
                  }
                }}
                onTouchEnd={(e) => {
                  if (activeLightbox.mediaType === "video") {
                    e.stopPropagation();
                  }
                }}
                className="relative flex h-[50svh] w-full items-center justify-center overflow-hidden rounded-[18px] bg-[#1a130d] sm:h-[58svh] sm:rounded-[22px]"
              >
                {activeLightbox.mediaType === "video" ? (
                  <div className="relative h-full w-full">
                    <video
                      key={`${activeLightbox.id}-${isMobileViewport ? "m" : "d"}`}
                      ref={(el) => {
                        lightboxVideoRef.current = el;
                        if (!el || el.dataset.initPlay === "1") return;
                        el.dataset.initPlay = "1";
                        el.defaultMuted = true;
                        el.muted = true;
                        el.playsInline = true;
                        el.setAttribute("muted", "");
                        el.setAttribute("playsinline", "");
                        el.setAttribute("webkit-playsinline", "true");
                        const p = el.play();
                        if (p && typeof p.then === "function") {
                          p.then(() => {
                            setLightboxVideoPlaying(true);
                          }).catch(() => {});
                        }
                      }}
                      src={withMediaVersion(
                        isMobileViewport && activeLightbox.mobileSrc
                          ? activeLightbox.mobileSrc
                          : activeLightbox.src
                      )}
                      autoPlay
                      muted
                      loop
                      controls
                      playsInline
                      preload="auto"
                      onPlaying={() => setLightboxVideoPlaying(true)}
                      onTimeUpdate={(e) => {
                        if (e.currentTarget.currentTime > 0.03) {
                          setLightboxVideoPlaying(true);
                        }
                      }}
                      onPause={() => setLightboxVideoPlaying(false)}
                      poster={withMediaVersion(
                        isMobileViewport && activeLightbox.mobilePoster
                          ? activeLightbox.mobilePoster
                          : activeLightbox.poster
                      )}
                      className="h-full w-full object-contain"
                    />
                    {!lightboxVideoPlaying && (
                      <button
                        type="button"
                        onClick={() => {
                          const vid = lightboxVideoRef.current;
                          if (!vid) return;
                          vid.playsInline = true;
                          vid
                            .play()
                            .then(() => setLightboxVideoPlaying(true))
                            .catch(() => {
                              vid.defaultMuted = true;
                              vid.muted = true;
                              vid
                                .play()
                                .then(() => setLightboxVideoPlaying(true))
                                .catch(() => {});
                            });
                        }}
                        aria-label={isAr ? "تشغيل الفيديو" : "Play video"}
                        className="pointer-events-auto absolute inset-0 z-10 flex items-center justify-center bg-black/20 transition hover:bg-black/30"
                      >
                        <span className="cavo-gold-gradient flex h-14 w-14 items-center justify-center rounded-full border border-white/50 text-white shadow-xl">
                          <Play className="ms-0.5 h-6 w-6 fill-current" />
                        </span>
                      </button>
                    )}
                  </div>
                ) : (
                  <>
                    {!lightboxImgLoaded && (
                      <div
                        aria-hidden="true"
                        className="pointer-events-none absolute inset-0 flex items-center justify-center"
                      >
                        <span className="h-7 w-7 animate-spin rounded-full border-2 border-[#e4c89e]/30 border-t-[#e4c89e]" />
                      </div>
                    )}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      key={activeLightbox.src}
                      ref={(el) => {
                        if (el && el.complete && el.naturalWidth > 0) {
                          setLightboxImgLoaded(true);
                        }
                      }}
                      src={activeLightbox.src}
                      alt={activeLightbox.title[locale]}
                      loading="eager"
                      decoding="async"
                      onLoad={() => setLightboxImgLoaded(true)}
                      onError={() => setLightboxImgLoaded(true)}
                      className="relative z-10 h-full w-full object-contain"
                    />
                  </>
                )}
              </div>
              <div className="p-4 sm:p-6">
                <div className="flex items-center justify-between gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--cavo-gold-pale)] px-3 py-1 text-[11px] font-bold text-[var(--cavo-gold-deep)] sm:px-3.5 sm:text-xs">
                    <Sparkles className="h-3 w-3 text-[var(--cavo-gold)]" />
                    {activeLightbox.venueTag[locale]}
                  </span>

                  <div className="flex items-center gap-1.5">
                    <span className="font-mono text-xs font-bold text-[var(--cavo-smoke)]">
                      {String(lightboxIndex + 1).padStart(2, "0")} /{" "}
                      {String(visibleItems.length).padStart(2, "0")}
                    </span>
                    <div className="flex items-center gap-1 sm:hidden">
                      <button
                        type="button"
                        onClick={() =>
                          setLightboxIndex(
                            (lightboxIndex - 1 + visibleItems.length) %
                              visibleItems.length
                          )
                        }
                        aria-label={isAr ? "السابق" : "Previous"}
                        className="flex h-8 w-8 items-center justify-center rounded-full border border-[var(--cavo-border)] bg-white text-[var(--cavo-ink)]"
                      >
                        <ChevronLeft className="h-4 w-4 rtl:rotate-180" />
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          setLightboxIndex(
                            (lightboxIndex + 1) % visibleItems.length
                          )
                        }
                        aria-label={isAr ? "التالي" : "Next"}
                        className="flex h-8 w-8 items-center justify-center rounded-full border border-[var(--cavo-border)] bg-white text-[var(--cavo-ink)]"
                      >
                        <ChevronRight className="h-4 w-4 rtl:rotate-180" />
                      </button>
                    </div>
                  </div>
                </div>

                <h3 className="font-display mt-2 text-xl font-semibold text-[var(--cavo-ink)] sm:text-3xl">
                  {activeLightbox.title[locale]}
                </h3>
                <p className="mt-1.5 text-xs leading-relaxed text-[var(--cavo-smoke)] sm:text-sm">
                  {activeLightbox.caption[locale]}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setLightboxIndex((lightboxIndex + 1) % visibleItems.length);
              }}
              aria-label={isAr ? "التالي" : "Next frame"}
              className="absolute end-2 top-1/2 z-20 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-[var(--cavo-gold)]/45 bg-[#f6f3ee] text-[var(--cavo-ink)] shadow-lg transition hover:scale-105 hover:bg-[var(--cavo-gold-deep)] hover:text-white sm:end-4 sm:flex"
            >
              <ChevronRight className="h-5 w-5 rtl:rotate-180" />
            </button>
          </div>,
          document.body
        )}
    </div>
  );
}
