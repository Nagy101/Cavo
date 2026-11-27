"use client";

import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type HTMLAttributes,
  type ReactNode,
} from "react";

interface FadeUpProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  delay?: number;
  className?: string;
}

export function FadeUp({
  children,
  delay = 0,
  className = "",
  style,
  ...rest
}: FadeUpProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [revealState, setRevealState] = useState<"idle" | "pending" | "shown">(
    "idle"
  );
  const [effectiveDelay, setEffectiveDelay] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof window === "undefined") return;

    if (
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      !("IntersectionObserver" in window)
    ) {
      setRevealState("shown");
      return;
    }

    const isMobile = window.innerWidth < 768;
    // Never add stagger lag on vertically stacked mobile cards; keep subtle crisp stagger on desktop rows.
    setEffectiveDelay(isMobile ? 0 : Math.min(delay, 0.14));

    const rect = el.getBoundingClientRect();
    // Show immediately if already within or close to the initial viewport
    if (rect.top < window.innerHeight + 120 && rect.bottom > 0) {
      setRevealState("shown");
      return;
    }

    setRevealState("pending");

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setRevealState("shown");
          observer.disconnect();
        }
      },
      {
        // Pre-trigger 180px BEFORE entering the viewport so cards are gliding in immediately as you scroll
        rootMargin: "0px 0px 180px 0px",
        threshold: 0,
      }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [delay]);

  const mergedStyle = {
    ...style,
    ...(effectiveDelay > 0 ? { "--reveal-delay": `${effectiveDelay}s` } : {}),
  } as CSSProperties;

  return (
    <div
      ref={ref}
      data-reveal={revealState}
      style={mergedStyle}
      className={`cavo-reveal ${className}`}
      {...rest}
    >
      {children}
    </div>
  );
}

export function StaggerReveal({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return <FadeUp className={className}>{children}</FadeUp>;
}

interface AnimatedCounterProps {
  target: number;
  suffix?: string;
  prefix?: string;
  padZero?: boolean;
  durationMs?: number;
  className?: string;
}

export function AnimatedCounter({
  target,
  suffix = "",
  prefix = "",
  padZero = false,
  durationMs = 1400,
  className = "",
}: AnimatedCounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const [value, setValue] = useState(target);
  const hasAnimatedRef = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof window === "undefined" || hasAnimatedRef.current) return;

    if (
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      !("IntersectionObserver" in window)
    ) {
      return;
    }

    const runAnimation = () => {
      if (hasAnimatedRef.current) return;
      hasAnimatedRef.current = true;
      const start = performance.now();
      setValue(0);

      const tick = (now: number) => {
        const elapsed = now - start;
        const progress = Math.min(elapsed / durationMs, 1);
        // Smooth cubic ease-out
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = Math.round(eased * target);
        setValue(current);
        if (progress < 1) {
          window.requestAnimationFrame(tick);
        } else {
          setValue(target);
        }
      };

      window.requestAnimationFrame(tick);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          runAnimation();
          observer.disconnect();
        }
      },
      { threshold: 0.25 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [target, durationMs]);

  const formatted =
    padZero && value < 10 ? `0${value}` : value.toLocaleString("en-US");

  return (
    <span ref={ref} className={className}>
      {prefix}
      {formatted}
      {suffix}
    </span>
  );
}
