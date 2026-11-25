import Link from "next/link";
import { ArrowRight, Compass, Sparkles } from "lucide-react";

export default function LocaleNotFound() {
  return (
    <section className="relative flex min-h-[78vh] items-center justify-center overflow-hidden bg-gradient-to-b from-[#f6f3ee] via-[#efeae1] to-[#e9e2d7] px-4 pt-28 pb-24 text-center text-[var(--cavo-ink)]">
      <div className="cavo-rise relative max-w-xl overflow-hidden rounded-[32px] border border-[var(--cavo-gold)]/45 bg-[#f8f6f2] p-8 shadow-[0_26px_65px_-22px_rgba(70,54,36,0.22)] sm:p-12">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--cavo-border)] bg-[var(--cavo-gold-pale)] px-3.5 py-1 font-mono text-[11px] font-bold uppercase tracking-[0.22em] text-[var(--cavo-gold-deep)]">
          <Sparkles className="h-3 w-3 text-[var(--cavo-gold)]" />
          <span>404 · PAGE NOT FOUND</span>
        </span>

        <h1 className="font-display mt-4 text-3xl font-semibold sm:text-5xl">
          This route is off the Nile chart.
        </h1>
        <p className="mt-3 text-xs leading-relaxed text-[var(--cavo-smoke)] sm:text-sm">
          The page you requested could not be found. Return to CAVO Island to
          explore our four Nile venues, interactive menu, or reservations.
        </p>
        <p
          className="mt-2 font-ar text-xs leading-relaxed text-[var(--cavo-smoke)] sm:text-sm"
          dir="rtl"
        >
          الصفحة المطلوبة غير موجودة. يمكنك العودة للصفحة الرئيسية أو استكشاف
          تجارب كافو الأربع على النيل.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/ar"
            className="cavo-btn-gold inline-flex items-center gap-2 rounded-full px-6 py-3 font-ar text-xs font-semibold"
          >
            <span>الرئيسية بالعربية</span>
            <ArrowRight className="h-3.5 w-3.5 rotate-180" />
          </Link>
          <Link
            href="/en"
            className="cavo-btn-pearl inline-flex items-center gap-2 rounded-full px-6 py-3 text-xs font-semibold uppercase tracking-[0.15em]"
          >
            <Compass className="h-4 w-4 text-[var(--cavo-gold-deep)]" />
            <span>English Home</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
