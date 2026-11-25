"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
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

const TITLE_REVEAL_AFTER_PLAY_MS = 1500;
const TITLE_FALLBACK_MS = 2300;
const PLAYBACK_WINDOW_MS = 6200;
const SAFETY_MAX_WAIT_MS = 10500;

const MOBILE_VIDEO_SRC = "/media/video/cavo-official-intro-mobile.mp4?v=4";
const DESKTOP_VIDEO_SRC = "/media/video/cavo-official-intro.mp4?v=4";
const MOBILE_POSTER_SRC = "/media/video/cavo-official-poster-mobile.jpg?v=4";
const DESKTOP_POSTER_SRC = "/media/video/cavo-official-poster.jpg?v=4";

export function CavoWelcomeIntro({ locale }: { locale: Locale }) {
  const isAr = locale === "ar";
  const [visible, setVisible] = useState(() => !hasPlayedIntroOnThisLoad);
  const [mounted, setMounted] = useState(false);
  const [showWelcomeText, setShowWelcomeText] = useState(false);
  const [closing, setClosing] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [videoReady, setVideoReady] = useState(false);
  const [autoplayBlocked, setAutoplayBlocked] = useState(false);
  const [runId, setRunId] = useState(0);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const closingRef = useRef(false);

  const triggerDismiss = () => {
    if (closingRef.current) return;
    closingRef.current = true;
    hasPlayedIntroOnThisLoad = true;
    setClosing(true);
    window.setTimeout(() => {
      setVisible(false);
      setClosing(false);
      closingRef.current = false;
    }, 850);
  };

  const handleManualPlayTap = () => {
    const vid = videoRef.current;
    if (!vid) return;
    vid.defaultMuted = true;
    vid.muted = isMuted;
    vid
      .play()
      .then(() => {
        setAutoplayBlocked(false);
        setVideoReady(true);
      })
      .catch(() => {
        vid.muted = true;
        setIsMuted(true);
        vid
          .play()
          .then(() => {
            setAutoplayBlocked(false);
            setVideoReady(true);
          })
          .catch(() => {});
      });
  };

  const toggleSound = (e: React.MouseEvent) => {
    e.stopPropagation();
    const vid = videoRef.current;
    if (!vid) return;
    const nextMuted = !vid.muted;
    vid.muted = nextMuted;
    setIsMuted(nextMuted);
    if (vid.paused) {
      vid.play().catch(() => {});
    }
  };

  // Mark client hydration complete so <video> never renders unmuted in SSR HTML
  useEffect(() => {
    setMounted(true);
  }, []);

  // Allow re-opening the intro film anytime from the Hero/Gallery "Watch Film" button
  useEffect(() => {
    const onReplay = () => {
      closingRef.current = false;
      setShowWelcomeText(false);
      setClosing(false);
      setIsMuted(true);
      setVideoReady(false);
      setAutoplayBlocked(false);
      setRunId((prev) => prev + 1);
      setVisible(true);
    };
    window.addEventListener("cavo:replay-intro", onReplay);
    return () => window.removeEventListener("cavo:replay-intro", onReplay);
  }, []);

  // Load & play exact mobile/desktop MP4 after explicit DOM muted/playsinline attributes are applied
  useEffect(() => {
    if (!visible || !mounted) return;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const vid = videoRef.current;
    const mql = window.matchMedia("(max-width: 767px)");

    const configureAndPlay = (mobileViewport: boolean) => {
      if (!vid) return;
      const targetSrc = mobileViewport ? MOBILE_VIDEO_SRC : DESKTOP_VIDEO_SRC;

      // Explicitly set HTML attributes BEFORE setting src so iOS Safari / Android Chrome
      // immediately recognize muted inline eligibility
      vid.defaultMuted = true;
      vid.muted = true;
      vid.playsInline = true;
      vid.setAttribute("muted", "");
      vid.setAttribute("playsinline", "");
      vid.setAttribute("webkit-playsinline", "true");
      vid.setAttribute("x5-playsinline", "true");

      const currentAttr = vid.getAttribute("data-active-src");
      if (currentAttr !== targetSrc) {
        setVideoReady(false);
        vid.setAttribute("data-active-src", targetSrc);
        vid.src = targetSrc;
        vid.load();
      }

      const playPromise = vid.play();
      if (playPromise && typeof playPromise.then === "function") {
        playPromise
          .then(() => {
            setAutoplayBlocked(false);
          })
          .catch(() => {
            // Can occur briefly before metadata arrives or under iOS Low Power Mode
            setAutoplayBlocked(true);
          });
      }
    };

    const retryPlayIfPaused = () => {
      if (!vid) return;
      if (!vid.paused && vid.readyState >= 2) {
        setVideoReady(true);
        setAutoplayBlocked(false);
        return;
      }
      if (vid.paused) {
        vid.defaultMuted = true;
        vid.muted = true;
        vid
          .play()
          .then(() => {
            setAutoplayBlocked(false);
            if (vid.readyState >= 2) {
              setVideoReady(true);
            }
          })
          .catch(() => {
            setAutoplayBlocked(true);
          });
      }
    };

    const markPlaying = () => {
      setVideoReady(true);
      setAutoplayBlocked(false);
    };

    const onTimeUpdate = () => {
      if (vid && vid.currentTime > 0.02) {
        setVideoReady(true);
        setAutoplayBlocked(false);
      }
    };

    if (vid) {
      vid.addEventListener("loadedmetadata", retryPlayIfPaused);
      vid.addEventListener("loadeddata", retryPlayIfPaused);
      vid.addEventListener("canplay", retryPlayIfPaused);
      vid.addEventListener("playing", markPlaying);
      vid.addEventListener("timeupdate", onTimeUpdate);
      configureAndPlay(mql.matches);
    }

    const onViewportChange = (e: MediaQueryListEvent) => {
      configureAndPlay(e.matches);
    };
    mql.addEventListener("change", onViewportChange);

    // Passive touch/pointer unlock for iPhones in Low Power Mode or strict in-app WebViews
    const unlockOnGesture = () => {
      if (!vid || !vid.paused) return;
      vid.muted = true;
      vid
        .play()
        .then(() => {
          setAutoplayBlocked(false);
          setVideoReady(true);
        })
        .catch(() => {});
    };
    window.addEventListener("touchstart", unlockOnGesture, { passive: true });
    window.addEventListener("pointerdown", unlockOnGesture, { passive: true });

    // Fallback title reveal even if cellular connection is slow
    const fallbackTitleTimer = window.setTimeout(() => {
      setShowWelcomeText(true);
    }, TITLE_FALLBACK_MS);

    // Safety cap so a slow/offline connection never traps the visitor
    const safetyCloseTimer = window.setTimeout(() => {
      triggerDismiss();
    }, SAFETY_MAX_WAIT_MS);

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" || e.key === "Enter" || e.key === " ") {
        triggerDismiss();
      }
    };
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = prevOverflow;
      if (vid) {
        vid.removeEventListener("loadedmetadata", retryPlayIfPaused);
        vid.removeEventListener("loadeddata", retryPlayIfPaused);
        vid.removeEventListener("canplay", retryPlayIfPaused);
        vid.removeEventListener("playing", markPlaying);
        vid.removeEventListener("timeupdate", onTimeUpdate);
      }
      mql.removeEventListener("change", onViewportChange);
      window.removeEventListener("touchstart", unlockOnGesture);
      window.removeEventListener("pointerdown", unlockOnGesture);
      window.removeEventListener("keydown", onKeyDown);
      window.clearTimeout(fallbackTitleTimer);
      window.clearTimeout(safetyCloseTimer);
    };
  }, [visible, mounted, runId]);

  // Once video actually starts playing on screen, give the viewer the full playback window
  useEffect(() => {
    if (!visible || !videoReady) return;

    const revealTimer = window.setTimeout(() => {
      setShowWelcomeText(true);
    }, TITLE_REVEAL_AFTER_PLAY_MS);

    const playbackCloseTimer = window.setTimeout(() => {
      triggerDismiss();
    }, PLAYBACK_WINDOW_MS);

    return () => {
      window.clearTimeout(revealTimer);
      window.clearTimeout(playbackCloseTimer);
    };
  }, [visible, videoReady, runId]);

  if (!visible) return null;

  return (
    <div
      onClick={handleManualPlayTap}
      className={`fixed inset-0 z-[100] flex flex-col justify-between overflow-hidden bg-[#0c0906] text-white select-none transition-all duration-[850ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${
        closing
          ? "pointer-events-none scale-[1.05] opacity-0 blur-[10px]"
          : "scale-100 opacity-100"
      }`}
      role="dialog"
      aria-modal="true"
      aria-label="Welcome to CAVO Island Intro"
    >
      {/* FULL-BLEED OFFICIAL CAVO VIDEO (Responsive Mobile Portrait & Desktop Widescreen) */}
      <div className="absolute inset-0 overflow-hidden bg-[#0c0906]">
        {/* Art-directed SSR poster: renders single-frame portrait on mobile and split widescreen on desktop at 0ms */}
        <picture className="pointer-events-none absolute inset-0 h-full w-full">
          <source media="(max-width: 767px)" srcSet={MOBILE_POSTER_SRC} />
          <img
            src={DESKTOP_POSTER_SRC}
            alt=""
            fetchPriority="high"
            decoding="sync"
            className="h-full w-full object-cover object-center"
          />
        </picture>

        {mounted && (
          <video
            key={runId}
            ref={videoRef}
            muted
            playsInline
            preload="auto"
            onEnded={triggerDismiss}
            className={`relative z-[1] h-full w-full object-cover object-center transition-opacity duration-300 ${
              videoReady ? "opacity-100" : "opacity-0"
            }`}
          />
        )}
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
            onClick={(e) => {
              e.stopPropagation();
              triggerDismiss();
            }}
            className="inline-flex min-h-[36px] items-center gap-1.5 rounded-full border border-white/25 bg-[#16100b]/60 px-4 py-1.5 text-xs font-semibold text-[#f5ece0] backdrop-blur-md transition hover:border-[#d6bc96] hover:bg-[var(--cavo-gold-deep)] hover:text-white"
          >
            <span>{isAr ? "تخطي" : "Skip"}</span>
            <ArrowRight className="h-3.5 w-3.5 rtl:rotate-180" />
          </button>
        </div>
      </div>

      {/* CENTER STAGE: "Welcome to CAVO Island" gently descends from above */}
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

          {/* Subtle Tap-to-Play Pill if iOS Low Power Mode / Data Saver paused background video */}
          {autoplayBlocked && !videoReady && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleManualPlayTap();
              }}
              className="mt-5 inline-flex items-center gap-2 rounded-full border border-[#d6bc96]/60 bg-[#1a130d]/75 px-5 py-2.5 text-xs font-semibold text-[#f7ebd9] shadow-lg backdrop-blur-md transition hover:bg-[var(--cavo-gold-deep)] hover:text-white"
            >
              <Play className="h-3.5 w-3.5 fill-current text-[#e5caa4]" />
              <span>{isAr ? "اضغط لتشغيل الفيلم" : "Tap to Play Film"}</span>
            </button>
          )}
        </div>
      </div>

      {/* BOTTOM PROGRESS HAIRLINE */}
      <div className="relative z-30 mx-auto w-full max-w-md px-8 pb-7 sm:pb-10">
        <div className="h-[2px] w-full overflow-hidden rounded-full bg-white/15">
          {videoReady ? (
            <div
              key={`ready-${runId}`}
              style={
                { "--prog-dur": `${PLAYBACK_WINDOW_MS / 1000}s` } as CSSProperties
              }
              className="cavo-progress-fill cavo-gold-gradient h-full w-full rounded-full"
            />
          ) : (
            <div className="cavo-gold-gradient h-full w-1/4 animate-pulse rounded-full" />
          )}
        </div>
      </div>
    </div>
  );
}
