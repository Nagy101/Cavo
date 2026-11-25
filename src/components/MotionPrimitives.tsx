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

    const rect = el.getBoundingClientRect();
    // Elements already visible in the initial viewport stay visible immediately (zero LCP penalty)
    if (rect.top < window.innerHeight * 0.94 && rect.bottom > 0) {
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
        rootMargin: "0px 0px -6% 0px",
        threshold: 0.06,
      }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const mergedStyle = {
    ...style,
    ...(delay > 0 ? { "--reveal-delay": `${delay}s` } : {}),
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
