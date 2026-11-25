import type { Locale } from "@/lib/i18n";

interface BrandMarkProps {
  locale: Locale;
  tone?: "light" | "dark";
  showSubtitle?: boolean;
  compact?: boolean;
}

export function BrandMark({
  locale,
  tone = "dark",
  showSubtitle = true,
  compact = false,
}: BrandMarkProps) {
  const isLight = tone === "light";
  const mainColor = isLight ? "text-[#faf6ef]" : "text-[var(--cavo-ink)]";
  const subColor = isLight ? "text-[#e5caa4]" : "text-[var(--cavo-gold-deep)]";

  return (
    <span
      className="group inline-flex items-center gap-3 select-none"
      dir="ltr"
    >
      <span
        className={`relative flex items-center justify-center rounded-xl border transition-all duration-500 group-hover:scale-105 ${
          isLight
            ? "border-[#e2c497]/45 bg-[#1b140e]/75 shadow-[0_8px_22px_-4px_rgba(0,0,0,0.45)] group-hover:border-[#e2c497]"
            : "border-[var(--cavo-gold)]/45 bg-gradient-to-br from-[#f8f5f0] via-[#efe9df] to-[#e2d8ca] shadow-[0_6px_16px_-4px_rgba(120,97,71,0.25)] group-hover:border-[var(--cavo-gold-deep)]"
        } ${compact ? "h-10 w-10" : "h-11 w-11"}`}
        aria-hidden="true"
      >
        <svg
          viewBox="0 0 32 32"
          className="h-6 w-6 transition-transform duration-500 group-hover:rotate-6"
          fill="none"
        >
          <path
            d="M22.2 8.8C20.3 7.1 17.8 6.2 15 6.2C9.3 6.2 5.2 10.5 5.2 16C5.2 21.5 9.3 25.8 15 25.8C17.9 25.8 20.4 24.7 22.3 22.9"
            stroke={isLight ? "#f1dcb8" : "#5C4936"}
            strokeWidth="1.8"
            strokeLinecap="round"
          />
          <path
            d="M20.8 11.4C19.3 10.1 17.3 9.3 15.1 9.3C11.1 9.3 8.3 12.1 8.3 16C8.3 19.9 11.1 22.7 15.1 22.7C17.3 22.7 19.3 21.9 20.8 20.5"
            stroke={isLight ? "#d7b789" : "#8A7053"}
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <path
            d="M19.4 13.8C18.3 12.8 16.9 12.3 15.3 12.3C13 12.3 11.3 13.8 11.3 16C11.3 18.2 13 19.7 15.3 19.7C16.9 19.7 18.3 19.1 19.4 18.1"
            stroke={isLight ? "#b59369" : "#A88F71"}
            strokeWidth="1.3"
            strokeLinecap="round"
          />
          <circle cx="24.5" cy="16" r="1.6" fill={isLight ? "#e2c497" : "#8A7053"} />
        </svg>
      </span>
      <span className="flex flex-col leading-none">
        <span
          className={`font-serif font-semibold tracking-[0.28em] transition-colors duration-300 ${
            isLight
              ? "group-hover:text-[#e5caa4]"
              : "group-hover:text-[var(--cavo-gold-deep)]"
          } ${compact ? "text-xl" : "text-2xl"} ${mainColor}`}
        >
          CAVO
        </span>
        {showSubtitle && (
          <span
            aria-hidden="true"
            className={`mt-1 text-[9px] font-semibold uppercase tracking-[0.34em] ${subColor}`}
          >
            {locale === "ar" ? "ISLAND · ZAMALEK" : "ISLAND · CAIRO"}
          </span>
        )}
      </span>
    </span>
  );
}
