import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Anchor,
  ArrowRight,
  Check,
  MessageCircle,
  Phone,
  Sparkles,
} from "lucide-react";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { EventPlannerForm } from "@/components/EventPlannerForm";
import { FadeUp } from "@/components/MotionPrimitives";
import { buildWhatsAppUrl, businessConfirmationRegistry } from "@/data/site";
import { privateYachtInquiryFormats } from "@/data/venues";
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
        ? "المناسبات الخاصة وحجز اليخت | كافو آيلاند"
        : "Private Events & Yacht Charters | CAVO Island",
    description:
      locale === "ar"
        ? "صمّم استفسار حفل عيد ميلاد، خطوبة، أو عزومة شركات على متن يخوت كافو أو سطح المركب بالزمالك."
        : "Submit an inquiry for birthdays, proposals, and VIP corporate gatherings aboard Yachts by Cavo or CAVO Boat in Zamalek.",
    alternates: {
      canonical: `/${locale}/private-events`,
      languages: {
        en: "/en/private-events",
        ar: "/ar/private-events",
      },
    },
  };
}

export default async function PrivateEventsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();
  const isAr = locale === "ar";

  const yachtDirectWa = buildWhatsAppUrl(
    "201286666482",
    isAr
      ? "مرحباً فريق Yachts by Cavo، أرغب في الاستفسار عن حجز رحلة يخت أو مناسبة خاصة."
      : "Hello Yachts by Cavo team, I would like to inquire about a private yacht charter or celebration."
  );

  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-[#f5f2ec] via-[#efeae1] to-[#f6f3ee] pt-20 pb-28 text-[var(--cavo-ink)] sm:pt-24 sm:pb-32">
      {/* Subtle Ambient Sunlit Riviera Glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-20 end-1/4 h-96 w-96 rounded-full opacity-45 blur-3xl"
        style={{
          background:
            "radial-gradient(circle, rgba(196,169,132,0.26) 0%, transparent 70%)",
        }}
      />

      <div className="relative z-10 mx-auto max-w-7xl space-y-10 px-3.5 sm:space-y-14 sm:px-6">
        {/* BALANCED 12-COL HEADER & YACHTS CONCIERGE SHOWCASE */}
        <header className="grid grid-cols-1 items-center gap-7 lg:grid-cols-12 lg:gap-10">
          <div className="cavo-rise min-w-0 space-y-3 lg:col-span-7">
            <div className="flex flex-wrap items-center gap-2">
              <Breadcrumbs
                locale={locale}
                items={[{ label: isAr ? "المناسبات الخاصة" : "Private Events" }]}
              />
              <span className="text-[var(--cavo-border)]">·</span>
              <div className="inline-flex items-center gap-1.5 rounded-full border border-[var(--cavo-border)] bg-[#f8f6f2] px-3 py-0.5 text-[10px] font-semibold text-[var(--cavo-gold-deep)] shadow-sm sm:text-[11px]">
                <Anchor className="h-3 w-3 shrink-0 text-[var(--cavo-gold)]" />
                <span className={isAr ? "" : "editorial-eyebrow-en"}>
                  {isAr
                    ? "يخوت كافو والمناسبات الخاصة"
                    : "YACHTS BY CAVO · PRIVATE EVENTS"}
                </span>
              </div>
            </div>

            <h1 className="font-display text-3xl font-semibold leading-[1.15] text-[var(--cavo-ink)] sm:text-5xl">
              {isAr ? (
                <>
                  صمّم مناسبتك الخاصة،{" "}
                  <span className="cavo-gold-text">على صفحة نيل الزمالك.</span>
                </>
              ) : (
                <>
                  Curate Your Private Celebration,{" "}
                  <span className="cavo-gold-text italic">
                    Afloat on the Nile.
                  </span>
                </>
              )}
            </h1>

            <p className="max-w-2xl break-words text-xs leading-relaxed text-[var(--cavo-smoke)] sm:text-base">
              {isAr
                ? "من أعياد الميلاد وحفلات الخطوبة إلى عشاء الشركات ورحلات اليخت المستقلة عبر Yachts by Cavo — جهّز تفاصيل مناسبتك في دقيقة ليراجعها فريق التنسيق ويؤكد لك الإتاحة والتكلفة."
                : "From milestone birthdays and sunset proposals to executive dinners aboard Yachts by Cavo—build your tailored event brief for direct concierge confirmation."}
            </p>

            {/* Direct Yachts Concierge Quick Bar */}
            <div className="flex flex-wrap items-center gap-2.5 pt-1">
              <a
                href={yachtDirectWa}
                target="_blank"
                rel="noopener noreferrer"
                className="cavo-btn-gold inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-xs font-semibold"
              >
                <MessageCircle className="h-3.5 w-3.5" />
                <span>
                  {isAr
                    ? "واتساب يخوت كافو المباشر"
                    : "WhatsApp Yachts by Cavo"}
                </span>
              </a>

              <a
                href="tel:+201286666482"
                dir="ltr"
                className="cavo-btn-pearl inline-flex items-center gap-1.5 rounded-full px-4 py-2.5 font-mono text-xs font-bold text-[var(--cavo-gold-deep)]"
              >
                <Phone className="h-3.5 w-3.5 text-[var(--cavo-gold)]" />
                <span>+20 128 666 6482</span>
              </a>
            </div>
          </div>

          {/* Asymmetric Dual Yacht Showcase */}
          <FadeUp
            delay={0.08}
            className="relative mx-auto grid w-full max-w-xl grid-cols-2 gap-3 sm:gap-4 lg:col-span-5"
          >
            <div className="cavo-sheen-card group overflow-hidden rounded-[22px] border border-[var(--cavo-gold)]/35 bg-[#f8f6f2] p-1.5 shadow-[0_20px_48px_-18px_rgba(70,54,36,0.2)] sm:rounded-[28px] sm:p-2">
              <div className="relative aspect-[4/4.6] overflow-hidden rounded-[16px] bg-[var(--cavo-stone)] sm:rounded-[20px]">
                <Image
                  src="/media/venues/private-yacht/yacht-night-dinner.jpg"
                  alt={
                    isAr
                      ? "عشاء ليلي خاص على يخت كافو"
                      : "Yachts by Cavo Night Event"
                  }
                  fill
                  priority
                  sizes="(max-width: 1024px) 50vw, 22vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-108"
                />
              </div>
            </div>

            <div className="cavo-sheen-card group mt-5 overflow-hidden rounded-[22px] border border-[var(--cavo-gold)]/35 bg-[#f8f6f2] p-1.5 shadow-[0_20px_48px_-18px_rgba(70,54,36,0.2)] sm:mt-8 sm:rounded-[28px] sm:p-2">
              <div className="relative aspect-[4/4.6] overflow-hidden rounded-[16px] bg-[var(--cavo-stone)] sm:rounded-[20px]">
                <Image
                  src="/media/venues/private-yacht/yacht-dining-table.jpg"
                  alt={
                    isAr
                      ? "سفرة الضيافة على متن اليخت الخاص"
                      : "Private Yacht Dining Spread"
                  }
                  fill
                  sizes="(max-width: 1024px) 50vw, 22vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-108"
                />
              </div>
            </div>
          </FadeUp>
        </header>

        {/* INTERACTIVE EVENT & CHARTER PLANNER SUITE */}
        <EventPlannerForm locale={locale} />

        {/* BESPOKE CHARTER FORMATS */}
        <section className="space-y-6">
          <FadeUp className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
            <div className="max-w-2xl">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--cavo-border)] bg-[#f8f6f2] px-3 py-1 text-[10px] font-bold text-[var(--cavo-gold-deep)] sm:text-[11px]">
                <Sparkles className="h-3 w-3 text-[var(--cavo-gold)]" />
                <span>
                  {isAr
                    ? "أشهر تنسيقات المناسبات واليخت"
                    : "POPULAR CHARTER & EVENT FORMATS"}
                </span>
              </span>
              <h2 className="font-display mt-2 text-2xl font-semibold text-[var(--cavo-ink)] sm:text-4xl">
                {isAr
                  ? "تنسيقات مرنة تُفصّل على مقاس احتفالك."
                  : "Tailored Formats Designed Around Your Guests."}
              </h2>
              <p className="mt-1.5 text-xs text-[var(--cavo-smoke)] sm:text-sm">
                {businessConfirmationRegistry.officialEventPackages.note[locale]}
              </p>
            </div>

            <Link
              href={localePath(locale, "experiences/private-yacht")}
              className="cavo-btn-pearl inline-flex items-center gap-1.5 self-start rounded-full px-5 py-2.5 text-xs font-semibold sm:self-auto"
            >
              <span>
                {isAr ? "جولة صور اليخت الخاص" : "Explore Private Yacht Gallery"}
              </span>
              <ArrowRight className="h-3.5 w-3.5 rtl:rotate-180" />
            </Link>
          </FadeUp>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3 sm:gap-6">
            {privateYachtInquiryFormats.map((fmt, idx) => (
              <FadeUp key={fmt.id} delay={idx * 0.08} className="flex">
                <div className="cavo-card-luxury cavo-sheen-card relative flex w-full flex-col justify-between overflow-hidden rounded-[26px] p-5 sm:rounded-[30px] sm:p-6">
                  <div>
                    <span className="inline-block rounded-full border border-[var(--cavo-border)] bg-[var(--cavo-gold-pale)] px-3 py-1 text-[10px] font-semibold text-[var(--cavo-gold-deep)] sm:text-[11px]">
                      {fmt.confirmationNote[locale]}
                    </span>
                    <h3 className="font-display mt-3.5 text-2xl font-semibold text-[var(--cavo-ink)]">
                      {fmt.name[locale]}
                    </h3>
                    <p className="mt-2 text-xs leading-relaxed text-[var(--cavo-smoke)] sm:text-sm">
                      {fmt.subtitle[locale]}
                    </p>
                    <ul className="mt-4 space-y-2 border-t border-[var(--cavo-border)] pt-4 text-xs text-[var(--cavo-ink)]">
                      {fmt.suggestedFocus[locale].map((inc) => (
                        <li key={inc} className="flex items-start gap-2">
                          <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[var(--cavo-gold-deep)]" />
                          <span>{inc}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </FadeUp>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
