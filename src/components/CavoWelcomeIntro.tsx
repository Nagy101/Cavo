"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowRight, Play, Sparkles, Volume2, VolumeX } from "lucide-react";
import type { Locale } from "@/lib/i18n";

// Plays once whenever the user opens/refreshes the website,
// and won't re-trigger during internal client-side link navigation.
let hasPlayedIntroOnThisLoad = false;

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
  const isAr = locale === "ar";
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
      <span>{isAr ? "شاهد فيلم كافو الرسمي" : "Watch Official Film"}</span>
    </button>
  );
}

// Timeline choreography (ms):
// 0ms -> 1700ms: Pure, unobstructed official CAVO video plays full-screen
// 1700ms: "Welcome to CAVO Island" gently descends into the center over the video
// 7200ms: Smooth cinema curtain dissolve revealing the website
const TITLE_REVEAL_MS = 1700;
const AUTO_ENTER_MS = 7200;

const MOBILE_VIDEO_SRC = "/media/video/cavo-official-intro-mobile.mp4?v=6";
const DESKTOP_VIDEO_SRC = "/media/video/cavo-official-intro.mp4?v=6";
const MOBILE_POSTER_SRC = "/media/video/cavo-official-poster-mobile.jpg?v=6";
const DESKTOP_POSTER_SRC = "/media/video/cavo-official-poster.jpg?v=6";

export function CavoWelcomeIntro({ locale }: { locale: Locale }) {
  const isAr = locale === "ar";
  const [visible, setVisible] = useState(() => !hasPlayedIntroOnThisLoad);
  const [showWelcomeText, setShowWelcomeText] = useState(false);
  const [closing, setClosing] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [runId, setRunId] = useState(0);

  const mobileVideoRef = useRef<HTMLVideoElement | null>(null);
  const desktopVideoRef = useRef<HTMLVideoElement | null>(null);

  const getActiveVideo = (): HTMLVideoElement | null => {
    if (typeof window === "undefined") return null;
    const isMobile = window.matchMedia("(max-width: 767px)").matches;
    return isMobile ? mobileVideoRef.current : desktopVideoRef.current;
  };

  const triggerDismiss = () => {
    if (closing) return;
    hasPlayedIntroOnThisLoad = true;
    setClosing(true);
    window.setTimeout(() => {
      setVisible(false);
      setClosing(false);
    }, 850);
  };

  const toggleSound = () => {
    const vid = getActiveVideo();
    if (!vid) return;
    const nextMuted = !vid.muted;
    vid.muted = nextMuted;
    setIsMuted(nextMuted);
    if (vid.paused) {
      vid.play().catch(() => {});
    }
  };

  // Allow re-opening the intro film anytime from the Hero/Gallery "Watch Film" button
  useEffect(() => {
    const onReplay = () => {
      setShowWelcomeText(false);
      setClosing(false);
      setIsMuted(true);
      setRunId((prev) => prev + 1);
      setVisible(true);
    };
    window.addEventListener("cavo:replay-intro", onReplay);
    return () => window.removeEventListener("cavo:replay-intro", onReplay);
  }, []);

  // Main choreography: Play active viewport's native SSR <video> without src replacement or opacity hiding
  useEffect(() => {
    if (!visible) return;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const isMobile = window.matchMedia("(max-width: 767px)").matches;
    const activeVid = isMobile
      ? mobileVideoRef.current
      : desktopVideoRef.current;
    const inactiveVid = isMobile
      ? desktopVideoRef.current
      : mobileVideoRef.current;

    if (inactiveVid) {
      inactiveVid.pause();
    }

    if (activeVid) {
      activeVid.defaultMuted = true;
      activeVid.muted = true;
      activeVid.currentTime = 0;
      activeVid.play().catch(() => {
        // Muted autoplay fallback
      });
    }

    const revealTimer = window.setTimeout(() => {
      setShowWelcomeText(true);
    }, TITLE_REVEAL_MS);

    const closeTimer = window.setTimeout(() => {
      hasPlayedIntroOnThisLoad = true;
      setClosing(true);
      window.setTimeout(() => {
        setVisible(false);
        setClosing(false);
      }, 850);
    }, AUTO_ENTER_MS);

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" || e.key === "Enter" || e.key === " ") {
        hasPlayedIntroOnThisLoad = true;
        setClosing(true);
        window.setTimeout(() => {
          setVisible(false);
          setClosing(false);
        }, 850);
      }
    };
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKeyDown);
      window.clearTimeout(revealTimer);
      window.clearTimeout(closeTimer);
    };
  }, [visible, runId]);

  if (!visible) return null;

  return (
    <div
      className={`fixed inset-0 z-[100] flex flex-col justify-between overflow-hidden bg-[#0c0906] text-white select-none transition-all duration-[850ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${
        closing
          ? "pointer-events-none scale-[1.05] opacity-0 blur-[10px]"
          : "scale-100 opacity-100"
      }`}
      role="dialog"
      aria-modal="true"
      aria-label="Welcome to CAVO Island Intro"
    >
      {/* FULL-BLEED OFFICIAL CAVO VIDEO: Dedicated SSR Mobile & Desktop <video> elements (never opacity-0, never swapped) */}
      <div className="absolute inset-0 overflow-hidden bg-[#0c0906]">
        {/* Mobile Portrait Video (< 768px) — has its own mobile src & mobile poster from 0ms SSR */}
        <video
          key={`mobile-${runId}`}
          ref={mobileVideoRef}
          src={MOBILE_VIDEO_SRC}
          poster={MOBILE_POSTER_SRC}
          autoPlay
          muted
          playsInline
          preload="auto"
          onEnded={triggerDismiss}
          className="h-full w-full object-cover object-center md:hidden"
        />

        {/* Desktop Widescreen Video (>= 768px) — identical to the original working desktop video */}
        <video
          key={`desktop-${runId}`}
          ref={desktopVideoRef}
          src={DESKTOP_VIDEO_SRC}
          poster={DESKTOP_POSTER_SRC}
          autoPlay
          muted
          playsInline
          preload="auto"
          onEnded={triggerDismiss}
          className="hidden h-full w-full object-cover object-center md:block"
        />
      </div>

      {/* DYNAMIC CINEMA VIGNETTE: Ultra-clear at start, softly deepens when Welcome title descends */}
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute inset-0 z-10 transition-opacity duration-[1600ms] ease-out ${
          showWelcomeText ? "opacity-100" : "opacity-35"
        }`}
        style={{
          background:
            "radial-gradient(circle at 50% 50%, rgba(12,9,6,0.48) 0%, rgba(12,9,6,0.72) 100%)",
        }}
      />

      {/* Subtle Architectural Gold Hairline Frame */}
      <div className="pointer-events-none absolute inset-3 z-20 rounded-[22px] border border-[#d6bc96]/25 sm:inset-5 sm:rounded-[32px]" />

      {/* MINIMAL TOP BAR: Sound Toggle & Skip Button */}
      <div className="relative z-30 mx-auto flex w-full max-w-7xl items-center justify-between px-5 pt-5 sm:px-10 sm:pt-8">
        <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-[#16100b]/55 px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-[0.22em] text-[#f0dec2] backdrop-blur-md sm:text-xs">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#e5caa4] opacity-80" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-[#e5caa4]" />
          </span>
          <span>CAVO · ZAMALEK</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={toggleSound}
            aria-label={
              isMuted
                ? isAr
                  ? "تشغيل الصوت"
                  : "Unmute audio"
                : isAr
                  ? "كتم الصوت"
                  : "Mute audio"
            }
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/25 bg-[#16100b]/60 text-[#f0dec2] backdrop-blur-md transition hover:border-[#d6bc96] hover:bg-[#2a1f16]"
          >
            {isMuted ? (
              <VolumeX className="h-4 w-4 text-[#e5caa4]" />
            ) : (
              <Volume2 className="h-4 w-4 text-[#e5caa4]" />
            )}
          </button>

          <button
            type="button"
            onClick={triggerDismiss}
            className="inline-flex min-h-[36px] items-center gap-1.5 rounded-full border border-white/25 bg-[#16100b]/60 px-4 py-1.5 text-xs font-semibold text-[#f5ece0] backdrop-blur-md transition hover:border-[#d6bc96] hover:bg-[var(--cavo-gold-deep)] hover:text-white"
          >
            <span>{isAr ? "تخطي" : "Skip"}</span>
            <ArrowRight className="h-3.5 w-3.5 rtl:rotate-180" />
          </button>
        </div>
      </div>

      {/* CENTER STAGE: "Welcome to CAVO Island" gently descends from above after video plays */}
      <div className="relative z-30 mx-auto flex flex-1 flex-col items-center justify-center px-6 text-center">
        <div
          className={`flex flex-col items-center transition-all duration-[1500ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${
            showWelcomeText
              ? "translate-y-0 scale-100 opacity-100 blur-0"
              : "-translate-y-12 scale-[0.97] opacity-0 blur-[6px] pointer-events-none"
          }`}
        >
          {/* Delicate Location Eyebrow */}
          <span className="inline-flex items-center gap-2 rounded-full border border-[#d6bc96]/45 bg-[#1a130d]/60 px-4 py-1.5 text-[10px] font-semibold uppercase tracking-[0.26em] text-[#efdcb9] shadow-lg backdrop-blur-md sm:text-xs">
            <Sparkles className="h-3 w-3 text-[#e5caa4]" />
            <span>NILE CITY BOAT · ZAMALEK, CAIRO</span>
          </span>

          {/* Monumental "Welcome to CAVO Island" Headline descending gently */}
          <h2
            dir="ltr"
            className="font-display mt-5 text-4xl font-bold tracking-tight text-white drop-shadow-[0_14px_36px_rgba(0,0,0,0.85)] sm:mt-6 sm:text-6xl lg:text-[78px] lg:leading-[1.04]"
          >
            <span className="block text-2xl font-normal tracking-[0.06em] text-[#f3e5ce]/90 sm:text-4xl lg:text-[44px]">
              Welcome to
            </span>
            <span className="mt-1 block bg-gradient-to-r from-[#fff6e5] via-[#dfc092] to-[#fff2da] bg-clip-text italic text-transparent">
              CAVO Island
            </span>
          </h2>

          {/* Expanding Golden Hairline Divider */}
          <div
            className={`mt-5 h-[1.5px] rounded-full bg-gradient-to-r from-transparent via-[#e5caa4] to-transparent transition-all duration-[1800ms] delay-300 ease-out ${
              showWelcomeText ? "w-44 opacity-90 sm:w-64" : "w-0 opacity-0"
            }`}
          />

          {/* Bilingual Subtitle */}
          <p
            className={`mt-4 max-w-lg text-xs font-medium leading-relaxed text-[#efe5d6]/90 drop-shadow-md transition-all duration-[1400ms] delay-300 ease-out sm:text-base ${
              showWelcomeText
                ? "translate-y-0 opacity-100"
                : "-translate-y-4 opacity-0"
            }`}
          >
            {isAr
              ? "أربع تجارب ضيافة استثنائية على ضفاف النيل في قلب الزمالك"
              : "Cairo, From a Different Point of View · Four Nile Experiences"}
          </p>
        </div>
      </div>

      {/* BOTTOM PROGRESS HAIRLINE */}
      <div className="relative z-30 mx-auto w-full max-w-md px-8 pb-7 sm:pb-10">
        <div className="h-[2px] w-full overflow-hidden rounded-full bg-white/15">
          <div
            style={
              { "--prog-dur": `${AUTO_ENTER_MS / 1000}s` } as React.CSSProperties
            }
            className="cavo-progress-fill cavo-gold-gradient h-full w-full rounded-full"
          />
        </div>
      </div>
    </div>
  );
}
