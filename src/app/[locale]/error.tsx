"use client";

import Link from "next/link";
import { RefreshCw, Sparkles } from "lucide-react";

export default function LocaleError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <section className="relative flex min-h-[78vh] items-center justify-center overflow-hidden bg-gradient-to-b from-[#f6f3ee] via-[#efeae1] to-[#e9e2d7] px-4 pt-28 pb-24 text-center text-[var(--cavo-ink)]">
      <div className="cavo-rise max-w-lg rounded-[32px] border border-[var(--cavo-gold)]/45 bg-[#f8f6f2] p-8 shadow-[0_26px_65px_-22px_rgba(70,54,36,0.22)] sm:p-11">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--cavo-border)] bg-[var(--cavo-gold-pale)] px-3.5 py-1 font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-[var(--cavo-gold-deep)]">
          <Sparkles className="h-3 w-3 text-[var(--cavo-gold)]" />
          <span>TEMPORARY INTERRUPTION</span>
        </span>

        <h1 className="font-display mt-4 text-3xl font-semibold sm:text-4xl">
          Something unexpected occurred.
        </h1>
        <p className="mt-3 text-xs leading-relaxed text-[var(--cavo-smoke)] sm:text-sm">
          Please try reloading this section or return to CAVO Island home.
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <button
            type="button"
            onClick={() => reset()}
            className="cavo-btn-gold inline-flex items-center gap-2 rounded-full px-6 py-3 text-xs font-semibold"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            <span>Try Again · إعادة المحاولة</span>
          </button>
          <Link
            href="/ar"
            className="cavo-btn-pearl rounded-full px-6 py-3 text-xs font-semibold"
          >
            الرئيسية · Home
          </Link>
        </div>
      </div>
    </section>
  );
}
