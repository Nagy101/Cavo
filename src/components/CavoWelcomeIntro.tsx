"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import Image from "next/image";
import { ArrowRight, Play, Sparkles, X } from "lucide-react";
import { usePathname } from "next/navigation";
import type { Locale } from "@/lib/i18n";
import { WELCOME_PHOTO, WELCOME_SEEN_KEY } from "@/lib/intro";

type IntroMode = "welcome" | "film" | null;

const WELCOME_DURATION_MS = 4800;
const WELCOME_EXIT_MS = 650;
const MOBILE_VIDEO_SRC = "/media/video/cavo-official-intro-mobile.mp4?v=9";
const DESKTOP_VIDEO_SRC = "/media/video/cavo-official-intro.mp4?v=9";
const MOBILE_POSTER_SRC = "/media/video/cavo-official-poster-mobile.jpg?v=9";
const DESKTOP_POSTER_SRC = "/media/video/cavo-official-poster.jpg?v=9";

const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

export function triggerCavoIntroReplay() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("cavo:replay-intro"));
  }
}

export function WatchIntroFilmButton({
  locale,
  className = "",
}: {
  locale: Locale;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={triggerCavoIntroReplay}
      className={
        className ||
        "cavo-btn-gold inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-xs font-semibold"
      }
    >
      <Play className="h-3.5 w-3.5 fill-current" />
      <span>{locale === "ar" ? "شاهد فيلم كافو" : "Watch the CAVO film"}</span>
    </button>
  );
}

export function CavoWelcomeIntro({ locale }: { locale: Locale }) {
  const isAr = locale === "ar";
  const pathname = usePathname();
  const videoRef = useRef<HTMLVideoElement>(null);
  const closingRef = useRef(false);
  const closeTimerRef = useRef<number | null>(null);
  const [mode, setMode] = useState<IntroMode>(null);
  const [ready, setReady] = useState(false);
  const [closing, setClosing] = useState(false);
  const [playbackFailed, setPlaybackFailed] = useState(false);

  const dismissWelcome = useCallback(() => {
    if (closingRef.current) return;
    closingRef.current = true;
    setClosing(true);
    closeTimerRef.current = window.setTimeout(() => {
      setMode(null);
      setClosing(false);
      setReady(false);
      closingRef.current = false;
    }, WELCOME_EXIT_MS);
  }, []);

  useEffect(() => {
    return () => {
      if (closeTimerRef.current !== null) {
        window.clearTimeout(closeTimerRef.current);
      }
    };
  }, []);

  // Synchronously mount the welcome intro before paint so the homepage never flashes first.
  useIsomorphicLayoutEffect(() => {
    const cleanPath = pathname.replace(/\/+$/, "");
    if (cleanPath !== `/${locale}`) {
      delete document.documentElement.dataset.cavoIntro;
      return;
    }

    const pendingFromBoot =
      document.documentElement.dataset.cavoIntro === "pending";
    let alreadySeen = false;
    try {
      alreadySeen = Boolean(window.sessionStorage.getItem(WELCOME_SEEN_KEY));
    } catch {
      alreadySeen = false;
    }

    if (!pendingFromBoot && alreadySeen) {
      delete document.documentElement.dataset.cavoIntro;
      return;
    }

    try {
      window.sessionStorage.setItem(WELCOME_SEEN_KEY, "1");
    } catch {
      // Keep the first-visit welcome available when storage is restricted.
    }
    setMode("welcome");
  }, [locale, pathname]);

  // Remove the pre-paint boot veil once our z-[100] intro overlay is safely painted on screen.
  useEffect(() => {
    if (mode !== "welcome") return;
    const raf = window.requestAnimationFrame(() => {
      delete document.documentElement.dataset.cavoIntro;
    });
    // Fallback ensures animations always kick off smoothly even on slow connections.
    const fallback = window.setTimeout(() => setReady(true), 240);
    return () => {
      window.cancelAnimationFrame(raf);
      window.clearTimeout(fallback);
    };
  }, [mode]);

  useEffect(() => {
    const openFilm = () => {
      closingRef.current = false;
      setClosing(false);
      setPlaybackFailed(false);
      setMode("film");
    };
    window.addEventListener("cavo:replay-intro", openFilm);
    return () => window.removeEventListener("cavo:replay-intro", openFilm);
  }, []);

  // Start the auto-dismiss countdown only once the image is decoded and animations begin.
  useEffect(() => {
    if (mode !== "welcome" || !ready) return;
    const timer = window.setTimeout(dismissWelcome, WELCOME_DURATION_MS);
    return () => window.clearTimeout(timer);
  }, [mode, ready, dismissWelcome]);

  useEffect(() => {
    if (!mode) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        if (mode === "welcome") dismissWelcome();
        else setMode(null);
      }
    };
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [mode, dismissWelcome]);

  useEffect(() => {
    if (mode !== "film") return;

    const video = videoRef.current;
    if (!video) return;
    const isMobile = window.matchMedia("(max-width: 767px)").matches;
    video.src = isMobile ? MOBILE_VIDEO_SRC : DESKTOP_VIDEO_SRC;
    video.poster = isMobile ? MOBILE_POSTER_SRC : DESKTOP_POSTER_SRC;
    video.load();
    video.play().catch(() => setPlaybackFailed(true));

    return () => {
      video.pause();
      video.removeAttribute("src");
      video.load();
    };
  }, [mode]);

  const handleImageReady = useCallback(() => {
    // Double rAF guarantees the decoded image is uploaded to the GPU before motion starts.
    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => {
        setReady(true);
      });
    });
  }, []);

  if (!mode) return null;

  if (mode === "welcome") {
    return (
      <section
        className={`fixed inset-0 z-[100] flex h-[100svh] flex-col justify-between overflow-hidden bg-[#120d09] text-white transition-[opacity,transform] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          closing
            ? "pointer-events-none -translate-y-3 scale-[1.02] opacity-0"
            : "translate-y-0 scale-100 opacity-100"
        }`}
        role="dialog"
        aria-modal="true"
        aria-label={isAr ? "أهلاً بكم في كافو آيلاند" : "Welcome to CAVO Island"}
      >
        {/* Lightweight pure-CSS ambient glow (zero expensive full-screen blur filters) */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 68% 46% at 50% 37%, rgba(217, 174, 122, 0.2) 0%, rgba(164, 98, 92, 0.08) 38%, rgba(18, 13, 9, 0.94) 72%, #120d09 100%)",
          }}
        />

        {/* Subtle perimeter architectural framing line */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-3 rounded-[22px] border border-[#e4c89e]/14 sm:inset-5 sm:rounded-[30px]"
        />

        {/* Top Bar */}
        <header
          style={{ "--d": "0.1s" } as CSSProperties}
          className={`relative z-20 mx-auto flex w-full max-w-6xl items-center justify-between gap-3 px-6 pt-6 sm:px-10 sm:pt-9 ${
            ready ? "cavo-welcome-copy" : "opacity-0"
          }`}
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-[#e4c89e]/28 bg-[#1a130d]/85 px-3.5 py-1.5 text-[10px] font-semibold text-[#f5e6cf] sm:px-4 sm:py-2 sm:text-xs">
            <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#e4c89e]" />
            <span className={isAr ? "" : "uppercase tracking-[0.2em]"}>
              {isAr
                ? "مركب نايل سيتي · الزمالك"
                : "NILE CITY BOAT · ZAMALEK"}
            </span>
          </div>

          <button
            type="button"
            onClick={dismissWelcome}
            className="rounded-full border border-white/25 bg-[#1a130d]/80 px-4 py-1.5 text-xs font-semibold text-[#f7ecdc] transition duration-300 hover:border-[#e4c89e]/60 hover:bg-white/10 sm:px-5 sm:py-2"
          >
            {isAr ? "تخطي" : "Skip"}
          </button>
        </header>

        {/* Center Editorial Stage: Archway Portal + Masked Typography */}
        <div className="relative z-20 mx-auto flex w-full max-w-4xl flex-1 flex-col items-center justify-center px-5 py-2 sm:px-8">
          {/* Sculpted Double-Border Archway Portal */}
          <div
            className={`relative w-[min(90vw,640px,calc(43svh*1.5))] aspect-[3/2] rounded-[24px] border border-[#e4c89e]/32 bg-[#1d150e]/85 p-1.5 shadow-[0_32px_80px_-24px_rgba(0,0,0,0.85)] sm:rounded-[32px] sm:p-2 ${
              ready ? "cavo-portal-reveal" : "opacity-0"
            }`}
          >
            <div className="relative h-full w-full overflow-hidden rounded-[19px] bg-[#1a120c] sm:rounded-[25px]">
              <Image
                src={WELCOME_PHOTO}
                alt={
                  isAr
                    ? "مدخل كافو آيلاند بالزهور وإطلالة النيل في الزمالك"
                    : "CAVO Island flower-draped archway overlooking the Nile in Zamalek"
                }
                fill
                priority
                unoptimized
                onLoad={handleImageReady}
                sizes="(max-width: 640px) 90vw, 640px"
                className={`object-cover object-center ${
                  ready ? "cavo-portal-drift" : "scale-[1.13]"
                }`}
              />

              {/* GPU-composited dark veil lifting smoothly off the image */}
              <div
                aria-hidden="true"
                className={`pointer-events-none absolute inset-0 bg-[#120d09] ${
                  ready ? "cavo-portal-veil" : "opacity-60"
                }`}
              />

              {/* Subtle top & bottom cinema melt so the archway blends seamlessly into the typography */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-[#120d09]/35 to-transparent"
              />
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 bottom-0 h-[38%] bg-gradient-to-t from-[#120d09] via-[#120d09]/55 to-transparent"
              />

              {/* One-shot champagne sheen sweep across the portal glass */}
              {ready && (
                <div
                  aria-hidden="true"
                  className="cavo-portal-sheen pointer-events-none absolute inset-y-0 left-0 w-1/2 bg-gradient-to-r from-transparent via-[#fff3db]/26 to-transparent"
                />
              )}

              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 rounded-[19px] ring-1 ring-inset ring-white/15 sm:rounded-[25px]"
              />
            </div>
          </div>

          {/* Layered Editorial Typography rising cleanly out of masks */}
          <div className="relative z-20 -mt-7 flex max-w-2xl flex-col items-center text-center sm:-mt-10">
            {/* Golden hairline + Welcome eyebrow */}
            <div className="flex items-center justify-center gap-3 sm:gap-4">
              <span
                aria-hidden="true"
                style={{ "--d": "0.32s" } as CSSProperties}
                className={`h-px w-8 bg-gradient-to-r from-transparent to-[#e4c89e]/80 sm:w-14 ${
                  ready ? "cavo-line-expand" : "opacity-0"
                }`}
              />
              <div className="overflow-hidden">
                <p
                  style={{ "--d": "0.36s" } as CSSProperties}
                  className={`font-semibold text-[#ecd3ae] ${
                    ready ? "cavo-mask-rise" : "opacity-0"
                  } ${
                    isAr
                      ? "text-xs sm:text-sm"
                      : "text-[10px] uppercase tracking-[0.34em] sm:text-xs"
                  }`}
                >
                  {isAr ? "أهلاً بكم في" : "WELCOME TO"}
                </p>
              </div>
              <span
                aria-hidden="true"
                style={{ "--d": "0.32s" } as CSSProperties}
                className={`h-px w-8 bg-gradient-to-l from-transparent to-[#e4c89e]/80 sm:w-14 ${
                  ready ? "cavo-line-expand" : "opacity-0"
                }`}
              />
            </div>

            {/* Monumental Brand Title */}
            <div className="mt-1.5 overflow-hidden px-2 py-1 sm:mt-2">
              <h2
                style={{ "--d": "0.48s" } as CSSProperties}
                className={`font-display font-semibold tracking-tight ${
                  ready ? "cavo-mask-rise" : "opacity-0"
                } ${
                  isAr
                    ? "text-[2.65rem] leading-[1.18] sm:text-6xl lg:text-[4.4rem]"
                    : "text-[2.95rem] italic leading-[1.02] sm:text-6xl lg:text-[4.75rem]"
                }`}
              >
                <span className="inline-block bg-gradient-to-r from-[#fff8ec] via-[#e2c08e] to-[#fff5e4] bg-clip-text text-transparent drop-shadow-[0_10px_24px_rgba(0,0,0,0.55)]">
                  {isAr ? "كافو آيلاند" : "CAVO Island"}
                </span>
              </h2>
            </div>

            {/* Poetic Tagline */}
            <div className="mt-1.5 overflow-hidden sm:mt-2">
              <p
                style={{ "--d": "0.66s" } as CSSProperties}
                className={`max-w-md text-xs font-medium leading-relaxed text-[#f1e6d6]/85 sm:text-base ${
                  ready ? "cavo-mask-rise" : "opacity-0"
                }`}
              >
                {isAr
                  ? "القاهرة، من منظور أهدأ وأرقى على ضفة النيل."
                  : "Cairo, from a calmer view on the Nile."}
              </p>
            </div>

            {/* Refined CTA */}
            <div
              style={{ "--d": "0.82s" } as CSSProperties}
              className={`mt-4 sm:mt-5 ${
                ready ? "cavo-welcome-copy" : "opacity-0"
              }`}
            >
              <button
                type="button"
                onClick={dismissWelcome}
                className={`cavo-btn-gold group inline-flex min-h-[44px] items-center justify-center gap-2.5 rounded-full px-7 py-2.5 text-xs font-semibold ring-1 ring-[#e8cfa8]/40 sm:min-h-[48px] sm:px-9 sm:py-3 ${
                  isAr ? "" : "uppercase tracking-[0.2em]"
                }`}
              >
                <Sparkles className="h-3.5 w-3.5 text-[#f4dec0]" />
                <span>{isAr ? "ادخل كافو" : "STEP INSIDE"}</span>
                <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1" />
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Cinema Progress Hairline */}
        <footer
          style={{ "--d": "0.24s" } as CSSProperties}
          className={`relative z-20 mx-auto flex flex-col items-center gap-2 pb-6 sm:pb-8 ${
            ready ? "cavo-welcome-copy" : "opacity-0"
          }`}
        >
          <div className="h-[2px] w-36 overflow-hidden rounded-full bg-white/15 sm:w-48">
            {ready && (
              <div
                style={
                  { "--prog-dur": `${WELCOME_DURATION_MS}ms` } as CSSProperties
                }
                className="cavo-progress-fill h-full w-full rounded-full bg-gradient-to-r from-[#b89566] via-[#f4ddb9] to-[#c7a575]"
              />
            )}
          </div>
        </footer>
      </section>
    );
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-[#100c08]/95 p-3 text-white backdrop-blur-sm sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-label={isAr ? "فيلم كافو" : "CAVO film"}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) setMode(null);
      }}
    >
      <div className="relative my-auto w-full max-w-5xl rounded-[22px] border border-[#d6bc96]/35 bg-[#211811] p-2.5 shadow-2xl sm:rounded-[30px] sm:p-4">
        <div className="mb-2 flex items-center justify-between gap-3 px-1 sm:mb-3 sm:px-2">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#d6bc96]">
              CAVO · ZAMALEK
            </p>
            <h2 className="font-display mt-0.5 text-lg font-semibold sm:text-2xl">
              {isAr ? "لحظة على النيل" : "A moment on the Nile"}
            </h2>
          </div>
          <button
            type="button"
            onClick={() => setMode(null)}
            aria-label={isAr ? "إغلاق الفيديو" : "Close video"}
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/20 bg-white/5 text-white transition hover:bg-white/15"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mx-auto aspect-[9/16] max-h-[72svh] w-full max-w-[380px] overflow-hidden rounded-[16px] bg-black sm:aspect-video sm:max-h-[72vh] sm:max-w-none sm:rounded-[22px]">
          <video
            ref={videoRef}
            autoPlay
            muted
            playsInline
            controls
            preload="none"
            onError={() => setPlaybackFailed(true)}
            onPlaying={() => setPlaybackFailed(false)}
            className="h-full w-full object-contain"
          />
        </div>

        <p
          aria-live="polite"
          className="px-2 pt-2 text-center text-[11px] text-[#ded2c0] sm:pt-3 sm:text-xs"
        >
          {playbackFailed
            ? isAr
              ? "اضغط تشغيل من أدوات الفيديو لبدء المشاهدة."
              : "Tap play on the video controls to start watching."
            : isAr
              ? "الفيديو مكتوم في البداية. تقدر تفعّل الصوت من أدوات المشاهدة."
              : "The film starts muted. Turn on sound from the player controls."}
        </p>
        <button
          type="button"
          onClick={() => setMode(null)}
          className="mx-auto mt-2 inline-flex min-h-[38px] items-center gap-1.5 rounded-full px-4 text-xs font-semibold text-[#ebd4b2] transition hover:bg-white/10"
        >
          {isAr ? "العودة للموقع" : "Back to CAVO"}
          <ArrowRight className="h-3.5 w-3.5 rtl:rotate-180" />
        </button>
      </div>
    </div>
  );
}
