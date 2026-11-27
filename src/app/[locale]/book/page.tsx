import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Anchor, ArrowRight, Phone, Sparkles } from "lucide-react";
import { BookingForm } from "@/components/BookingForm";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { siteConfig } from "@/data/site";
import { isValidLocale, localePath } from "@/lib/i18n";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isValidLocale(locale)) return {};
  return {
    title:
      locale === "ar"
        ? "حجز طاولة أو يخت خاص | كافو آيلاند الزمالك"
        : "Reserve Your Experience | CAVO Island",
    description:
      locale === "ar"
        ? "احجز طاولتك في المطعم الرئيسي، المركب المفتوح (Boat)، اليخت الخاص، أو كافو إيليت على مركب نايل سيتي بالزمالك مع توجيه فوري لمكتب استقبال الوجهة."
        : "Request reservations for Main Restaurant, Boat, Private Yacht, or CAVO Elite aboard Nile City Boat, Zamalek with direct venue concierge routing.",
    alternates: {
      canonical: `/${locale}/book`,
      languages: {
        en: "/en/book",
        ar: "/ar/book",
      },
    },
  };
}

export default async function BookPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();
  const isAr = locale === "ar";

  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-[#f5f2ec] via-[#efeae1] to-[#f6f3ee] pt-20 pb-28 text-[var(--cavo-ink)] sm:pt-24 sm:pb-32">
      {/* Subtle Ambient Sunlit Riviera Glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 start-1/4 h-96 w-96 rounded-full opacity-45 blur-3xl"
        style={{
          background:
            "radial-gradient(circle, rgba(196,169,132,0.28) 0%, transparent 70%)",
        }}
      />

      <div className="relative z-10 mx-auto max-w-7xl space-y-6 px-3.5 sm:space-y-10 sm:px-6">
        {/* BALANCED 12-COLUMN EDITORIAL HEADER & DIRECT CONCIERGE DOCK */}
        <header className="grid grid-cols-1 items-end gap-4 lg:grid-cols-12 lg:gap-6">
          {/* Left 7 Cols: Breadcrumb + Eyebrow + Headline + Subtitle */}
          <div className="cavo-rise min-w-0 space-y-2 lg:col-span-7">
            <div className="flex flex-wrap items-center gap-2">
              <Breadcrumbs
                locale={locale}
                items={[{ label: isAr ? "حجز طاولة" : "Reserve" }]}
              />
              <span className="text-[var(--cavo-border)]">·</span>
              <div className="inline-flex items-center gap-1.5 rounded-full border border-[var(--cavo-border)] bg-[#f8f6f2] px-3 py-0.5 text-[10px] font-semibold text-[var(--cavo-gold-deep)] shadow-sm sm:text-[11px]">
                <Sparkles className="h-3 w-3 shrink-0 text-[var(--cavo-gold)]" />
                <span className={isAr ? "" : "editorial-eyebrow-en"}>
                  {isAr
                    ? "طلب حجز مباشر · التجارب الأربع"
                    : "DIRECT RESERVATION · ALL 4 VENUES"}
                </span>
              </div>
            </div>

            <h1 className="font-display text-2xl font-semibold leading-[1.15] text-[var(--cavo-ink)] sm:text-4xl lg:text-[44px]">
              {isAr ? (
                <>
                  اختر وجهتك وجلستك على النيل،{" "}
                  <span className="cavo-gold-text">في أقل من دقيقة.</span>
                </>
              ) : (
                <>
                  Reserve Your Waterside Table,{" "}
                  <span className="cavo-gold-text italic">
                    Tailored to Your Hour.
                  </span>
                </>
              )}
            </h1>

            <p className="max-w-2xl break-words text-xs leading-relaxed text-[var(--cavo-smoke)] sm:text-sm">
              {isAr
                ? "حدد التجربة، منطقة الجلوس المفضلة، والتوقيت ليتم تجهيز بطاقة حجزك وتوجيهها مباشرة لمكتب الاستقبال المختص في مركب نايل سيتي بالزمالك."
                : "Select your preferred CAVO venue, seating zone, and time slot—your request is routed directly to that venue's dedicated concierge desk aboard Nile City Boat."}
            </p>
          </div>

          {/* Right 5 Cols: Direct Concierge Lines & Private Event Shortcut Dock */}
          <div className="min-w-0 lg:col-span-5">
            <div className="rounded-[22px] border border-[var(--cavo-gold)]/35 bg-[#f8f6f2] p-3.5 shadow-[0_14px_34px_-16px_rgba(70,54,36,0.14)] sm:rounded-[26px] sm:p-4">
              <div className="mb-2 flex items-center justify-between text-[11px]">
                <span className="font-bold text-[var(--cavo-gold-deep)]">
                  {isAr
                    ? "خطوط الاستقبال المباشرة:"
                    : "Direct Venue Concierge Lines:"}
                </span>
                <span className="text-[10px] font-medium text-[var(--cavo-smoke)]">
                  {isAr ? "8 ص – 4 فجراً" : "8 AM – 4 AM"}
                </span>
              </div>

              <div className="cavo-no-scrollbar flex gap-2 overflow-x-auto pb-0.5 sm:grid sm:grid-cols-3 sm:gap-1.5 sm:overflow-visible sm:pb-0">
                {siteConfig.contactLines.map((line) => (
                  <a
                    key={line.id}
                    href={line.telHref}
                    className="flex shrink-0 flex-col items-start justify-center gap-0.5 rounded-xl border border-[var(--cavo-border)] bg-[#f1ede6] px-3 py-2 text-[11px] transition hover:border-[var(--cavo-gold)] sm:px-2.5"
                  >
                    <span className="max-w-[140px] truncate font-semibold text-[var(--cavo-ink)] sm:max-w-full">
                      {line.label[locale]}
                    </span>
                    <span
                      dir="ltr"
                      className="inline-flex items-center gap-1 font-mono text-[10px] font-bold text-[var(--cavo-gold-deep)]"
                    >
                      <Phone className="h-2.5 w-2.5 text-[var(--cavo-gold)]" />
                      {line.phoneDisplay}
                    </span>
                  </a>
                ))}
              </div>

              <div className="mt-2.5 flex items-center justify-between border-t border-[var(--cavo-border)]/75 pt-2 text-[11px]">
                <span className="inline-flex items-center gap-1 text-[var(--cavo-smoke)]">
                  <Anchor className="h-3 w-3 text-[var(--cavo-gold)]" />
                  {isAr
                    ? "تخطط لحفل كبير أو يخت خاص؟"
                    : "Planning a large party or yacht charter?"}
                </span>
                <Link
                  href={localePath(locale, "private-events")}
                  className="inline-flex items-center gap-1 font-bold text-[var(--cavo-gold-deep)] hover:underline"
                >
                  <span>
                    {isAr ? "مخطط المناسبات" : "Private Events"}
                  </span>
                  <ArrowRight className="h-3 w-3 rtl:rotate-180" />
                </Link>
              </div>
            </div>
          </div>
        </header>

        <Suspense
          fallback={
            <div className="rounded-[28px] border border-[var(--cavo-border)] bg-[#f8f6f2] p-10 text-center text-sm text-[var(--cavo-smoke)] shadow-sm">
              {isAr
                ? "جاري تحميل منصة الحجز..."
                : "Loading reservation concierge..."}
            </div>
          }
        >
          <BookingForm locale={locale} />
        </Suspense>
      </div>
    </div>
  );
}
