import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Anchor,
  ArrowRight,
  CalendarCheck,
  Car,
  Clock,
  Compass,
  Mail,
  MessageCircle,
  Phone,
  ShieldCheck,
  Sparkles,
  UtensilsCrossed,
} from "lucide-react";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { FaqAccordion } from "@/components/FaqAccordion";
import { AnimatedCounter, FadeUp } from "@/components/MotionPrimitives";
import { NileMapEmbed } from "@/components/NileMapEmbed";
import { VisitContactForm } from "@/components/VisitContactForm";
import {
  buildWhatsAppUrl,
  businessConfirmationRegistry,
  siteConfig,
} from "@/data/site";
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
        ? "تواصل معنا والموقع | كافو آيلاند الزمالك"
        : "Contact & Location | CAVO Island",
    description:
      locale === "ar"
        ? "تواصل مباشرة مع مكاتب استقبال كافو آيلاند بالزمالك (اتصال وواتساب)، خريطة مركب نايل سيتي، مواعيد العمل اليومية (8 صباحاً – 4 فجراً)، والأسئلة الشائعة."
        : "Contact CAVO Island's dedicated phone & WhatsApp desks, get directions to Nile City Boat in Zamalek, view daily hours (8 AM – 4 AM), and browse visitor FAQ.",
    alternates: {
      canonical: `/${locale}/contact`,
      languages: {
        en: "/en/contact",
        ar: "/ar/contact",
      },
    },
  };
}

const conciergeCardMeta = {
  main: {
    thumb: "/media/hero/main-day.jpg",
    badge: { en: "Indoor & Open-Air Deck", ar: "القاعة الداخلية وسطح المركب" },
    hours: {
      en: "Daily · 8:00 AM – 4:00 AM",
      ar: "يومياً · 8:00 ص – 4:00 فجراً",
    },
    venueHref: "experiences/main-restaurant",
  },
  yacht: {
    thumb: "/media/venues/private-yacht/yacht-exterior.jpg",
    badge: { en: "Private Nile Charters", ar: "رحلات وحفلات اليخت الخاص" },
    hours: { en: "Charter Inquiry Desk", ar: "تنسيق الرحلات بالحجز المسبق" },
    venueHref: "experiences/private-yacht",
  },
  elite: {
    thumb: "/media/venues/elite/cavo-sign-glow.jpg",
    badge: { en: "Fine Dining & Night Lounge", ar: "عشاء فاخر ولاونج ليلي" },
    hours: { en: "Evening & Late-Night Desk", ar: "استقبال الأمسيات والسهر" },
    venueHref: "experiences/elite",
  },
} as const;

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();
  const isAr = locale === "ar";

  const arrivalSteps = [
    {
      num: "01",
      icon: Car,
      title: {
        en: "Corniche Arrival & Valet",
        ar: "الكورنيش وركن السيارات",
      },
      desc: {
        en: "Arrive along Zamalek Nile Corniche at Nile City Boat. Ask our host team upon booking for peak-hour valet guidance.",
        ar: "الوصول عبر كورنيش النيل بالزمالك أمام مركب نايل سيتي. اسأل فريق الاستقبال عند الحجز لإرشادك لأسهل نقطة ركن أو Valet.",
      },
    },
    {
      num: "02",
      icon: Anchor,
      title: {
        en: "Nile City Boat Boarding",
        ar: "بوابة مركب نايل سيتي",
      },
      desc: {
        en: "Our welcome hosts at the main gangway direct you straight to Main Restaurant, Boat deck, Yachts by Cavo, or CAVO Elite.",
        ar: "فريق الاستقبال عند مدخل المركب يرحب بك ويوجهك مباشرة للمطعم الرئيسي، المركب المفتوح، اليخت الخاص، أو كافو إيليت.",
      },
    },
    {
      num: "03",
      icon: Clock,
      title: {
        en: "20 Hours of Daily Hospitality",
        ar: "20 ساعة ضيافة يومية",
      },
      desc: {
        en: "Open daily from 8:00 AM morning brunch through golden sunset dinners and late-night vibes until 4:00 AM.",
        ar: "نستقبلكم يومياً من 8:00 صباحاً لفطار الصباح والقهوة، مروراً بالغداء والغروب، وحتى 4:00 فجراً للسهر والعشاء.",
      },
    },
  ];

  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-[#f5f2ec] via-[#efeae1] to-[#f6f3ee] pt-20 pb-20 text-[var(--cavo-ink)] sm:pt-24 sm:pb-28">
      {/* Subtle Ambient Sunlit Riviera Glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 start-1/4 h-96 w-96 rounded-full opacity-45 blur-3xl"
        style={{
          background:
            "radial-gradient(circle, rgba(196,169,132,0.28) 0%, transparent 70%)",
        }}
      />

      <div className="relative z-10 mx-auto max-w-7xl space-y-8 px-3.5 sm:space-y-14 sm:px-6">
        {/* SECTION 01 — BALANCED 12-COLUMN EDITORIAL HEADER & ARRIVAL AT-A-GLANCE DOCK */}
        <section>
          <div className="mb-4 grid grid-cols-1 items-end gap-4 sm:mb-6 lg:grid-cols-12 lg:gap-6">
            {/* Left 7 Cols: Inline Breadcrumb + Eyebrow + Display Title + Subtitle */}
            <div className="cavo-rise min-w-0 space-y-2 lg:col-span-7">
              <div className="flex flex-wrap items-center gap-2">
                <Breadcrumbs
                  locale={locale}
                  items={[{ label: isAr ? "تواصل معنا" : "Contact" }]}
                />
                <span className="text-[var(--cavo-border)]">·</span>
                <div className="inline-flex items-center gap-1.5 rounded-full border border-[var(--cavo-border)] bg-[#f8f6f2] px-3 py-0.5 text-[10px] font-semibold text-[var(--cavo-gold-deep)] shadow-sm sm:text-[11px]">
                  <Sparkles className="h-3 w-3 shrink-0 text-[var(--cavo-gold)]" />
                  <span className={isAr ? "" : "editorial-eyebrow-en"}>
                    {isAr
                      ? "تواصل مباشر · مركب نايل سيتي الزمالك"
                      : "CONCIERGE & LOCATION · ZAMALEK"}
                  </span>
                </div>
              </div>

              <h1 className="font-display text-2xl font-semibold leading-[1.15] text-[var(--cavo-ink)] sm:text-4xl lg:text-[44px]">
                {isAr ? (
                  <>
                    تواصل مع استقبال كافو،{" "}
                    <span className="cavo-gold-text">واعرف طريقك للنيل بسهولة.</span>
                  </>
                ) : (
                  <>
                    Connect With Our Hosts,{" "}
                    <span className="cavo-gold-text italic">
                      Right on the Zamalek Nile.
                    </span>
                  </>
                )}
              </h1>

              <p className="max-w-2xl break-words text-xs leading-relaxed text-[var(--cavo-smoke)] sm:text-sm">
                {isAr
                  ? "خطوط اتصال وواتساب مخصصة لكل وجهة من تجارب كافو الأربع على متن مركب نايل سيتي بالزمالك، مع خريطة الوصول المباشرة ومواعيد العمل اليومية."
                  : "Direct phone and WhatsApp concierge desks for all four CAVO Island experiences aboard Nile City Boat in Zamalek, alongside live Google Maps routing and daily hours."}
              </p>
            </div>

            {/* Right 5 Cols: Architectural Arrival At-A-Glance Card */}
            <FadeUp delay={0.08} className="min-w-0 lg:col-span-5">
              <div className="rounded-[22px] border border-[var(--cavo-gold)]/35 bg-[#f8f6f2] p-3.5 shadow-[0_14px_34px_-16px_rgba(70,54,36,0.14)] sm:rounded-[26px] sm:p-4">
                <div className="grid grid-cols-3 divide-x divide-[var(--cavo-border)] text-center rtl:divide-x-reverse">
                  <div className="px-2">
                    <p className="font-display text-xl font-bold text-[var(--cavo-gold-deep)] sm:text-2xl">
                      <AnimatedCounter
                        target={20}
                        suffix={isAr ? " س" : "h"}
                      />
                    </p>
                    <p className="text-[10px] font-semibold text-[var(--cavo-smoke)] sm:text-[11px]">
                      {isAr ? "8 ص – 4 فجراً" : "8 AM – 4 AM"}
                    </p>
                  </div>
                  <div className="px-2">
                    <p className="font-display text-xl font-bold text-[var(--cavo-gold-deep)] sm:text-2xl">
                      <AnimatedCounter target={4} padZero />
                    </p>
                    <p className="text-[10px] font-semibold text-[var(--cavo-smoke)] sm:text-[11px]">
                      {isAr ? "وجهات على النيل" : "Nile Venues"}
                    </p>
                  </div>
                  <div className="px-2">
                    <p className="font-display text-xl font-bold text-[var(--cavo-gold-deep)] sm:text-2xl">
                      <AnimatedCounter target={3} padZero />
                    </p>
                    <p className="text-[10px] font-semibold text-[var(--cavo-smoke)] sm:text-[11px]">
                      {isAr ? "خطوط استقبال" : "Concierge Lines"}
                    </p>
                  </div>
                </div>

                <div className="mt-3 grid grid-cols-2 gap-2">
                  <a
                    href={siteConfig.mapsDirectionsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="cavo-btn-gold inline-flex items-center justify-center gap-1.5 rounded-full px-3.5 py-2 text-[11px] font-semibold sm:text-xs"
                  >
                    <Compass className="h-3.5 w-3.5 shrink-0" />
                    <span>{isAr ? "افتح خرائط جوجل" : "Google Maps"}</span>
                  </a>

                  <Link
                    href={localePath(locale, "book")}
                    className="cavo-btn-pearl inline-flex items-center justify-center gap-1.5 rounded-full px-3.5 py-2 text-[11px] font-semibold sm:text-xs"
                  >
                    <CalendarCheck className="h-3.5 w-3.5 shrink-0 text-[var(--cavo-gold-deep)]" />
                    <span>{isAr ? "احجز طاولتك" : "Book Table"}</span>
                  </Link>
                </div>
              </div>
            </FadeUp>
          </div>

          {/* SECTION 02 — INTERACTIVE MAP, 3-STEP ARRIVAL GUIDE & DEDICATED VENUE CONCIERGE DIRECTORY */}
          <div className="overflow-hidden rounded-[24px] border border-[var(--cavo-gold)]/45 bg-[#f8f6f2] p-2.5 shadow-[0_26px_70px_-22px_rgba(70,54,36,0.2)] sm:rounded-[36px] sm:p-5">
            <div className="grid grid-cols-1 items-stretch gap-5 lg:grid-cols-12 lg:gap-6">
              {/* Left 7 Cols: Framed Interactive Map + 3-Step Arrival & Boarding Strip */}
              <div className="flex min-w-0 flex-col justify-between gap-4 lg:col-span-7">
                <NileMapEmbed
                  locale={locale}
                  className="h-[290px] w-full sm:h-[370px] lg:flex-1"
                />

                {/* 3-Step Arrival & Boarding Strip Under Map */}
                <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3 sm:gap-3">
                  {arrivalSteps.map((step) => {
                    const StepIcon = step.icon;
                    return (
                      <div
                        key={step.num}
                        className="cavo-sheen-card group relative flex flex-col justify-between rounded-[18px] border border-[var(--cavo-border)] bg-[#f3efe8] p-3.5 transition-all duration-300 hover:-translate-y-0.5 hover:border-[var(--cavo-gold)] sm:rounded-[22px] sm:p-4"
                      >
                        <div>
                          <div className="flex items-center justify-between gap-2">
                            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[var(--cavo-gold-pale)] text-[var(--cavo-gold-deep)] transition-colors group-hover:bg-[var(--cavo-gold)] group-hover:text-white">
                              <StepIcon className="h-4 w-4" />
                            </span>
                            <span className="font-mono text-[11px] font-bold text-[var(--cavo-gold-deep)]">
                              {step.num}
                            </span>
                          </div>
                          <h2 className="font-display mt-2.5 text-base font-semibold text-[var(--cavo-ink)] sm:text-lg">
                            {step.title[locale]}
                          </h2>
                          <p className="mt-1 text-[11px] leading-relaxed text-[var(--cavo-smoke)] sm:text-xs">
                            {step.desc[locale]}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Right 5 Cols: Visual Venue Concierge Directory & Essential Info */}
              <div className="flex min-w-0 flex-col justify-between gap-3.5 lg:col-span-5">
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between px-1">
                    <span className="text-xs font-bold text-[var(--cavo-gold-deep)]">
                      {isAr
                        ? "مكاتب الاستقبال المخصصة لكل وجهة (اتصال أو واتساب):"
                        : "Dedicated Venue Concierge Desks (Call or WhatsApp):"}
                    </span>
                  </div>

                  {/* 3 Visual Concierge Desk Cards */}
                  <div className="space-y-2.5">
                    {siteConfig.contactLines.map((line) => {
                      const meta = conciergeCardMeta[line.id];
                      const waGreeting = isAr
                        ? `مرحباً كافو (${line.label.ar})، أرغب في الاستفسار عن زيارة وحجز.`
                        : `Hello CAVO (${line.label.en}), I would like to inquire about a visit and reservation.`;

                      return (
                        <div
                          key={line.id}
                          className="cavo-sheen-card group rounded-[20px] border border-[var(--cavo-border)] bg-[#f3efe8] p-3 transition-all duration-300 hover:border-[var(--cavo-gold)] hover:bg-[#efe9df] sm:rounded-[24px] sm:p-3.5"
                        >
                          <div className="flex items-center gap-3">
                            <Link
                              href={localePath(locale, meta.venueHref)}
                              className="relative h-14 w-16 shrink-0 overflow-hidden rounded-2xl border border-[var(--cavo-gold)]/30 bg-[var(--cavo-stone)] sm:h-16 sm:w-20"
                            >
                              <Image
                                src={meta.thumb}
                                alt={line.label[locale]}
                                fill
                                sizes="80px"
                                className="object-cover transition-transform duration-500 group-hover:scale-110"
                              />
                            </Link>

                            <div className="min-w-0 flex-1">
                              <span className="inline-block rounded-full bg-[#f8f6f2] px-2.5 py-0.5 text-[10px] font-semibold text-[var(--cavo-gold-deep)]">
                                {meta.badge[locale]}
                              </span>
                              <Link
                                href={localePath(locale, meta.venueHref)}
                                className="mt-0.5 block truncate font-display text-lg font-semibold text-[var(--cavo-ink)] hover:text-[var(--cavo-gold-deep)] sm:text-xl"
                              >
                                {line.label[locale]}
                              </Link>
                              <p className="text-[11px] text-[var(--cavo-smoke)]">
                                {meta.hours[locale]}
                              </p>
                            </div>
                          </div>

                          {/* Direct Call & WhatsApp Action Buttons */}
                          <div className="mt-3 grid grid-cols-2 gap-2 border-t border-[var(--cavo-border)]/75 pt-2.5">
                            <a
                              href={line.telHref}
                              dir="ltr"
                              className="cavo-btn-pearl inline-flex items-center justify-center gap-1.5 rounded-full px-3 py-1.5 font-mono text-[11px] font-bold text-[var(--cavo-ink)] sm:text-xs"
                            >
                              <Phone className="h-3 w-3 shrink-0 text-[var(--cavo-gold-deep)]" />
                              <span className="truncate">
                                {line.phoneDisplay}
                              </span>
                            </a>

                            <a
                              href={buildWhatsAppUrl(
                                line.whatsappDigits,
                                waGreeting
                              )}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="cavo-btn-gold inline-flex items-center justify-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-semibold sm:text-xs"
                            >
                              <MessageCircle className="h-3.5 w-3.5 shrink-0" />
                              <span>
                                {isAr ? "واتساب الاستقبال" : "WhatsApp Desk"}
                              </span>
                            </a>
                          </div>

                          {line.secondaryPhoneDisplay &&
                            line.secondaryTelHref && (
                              <div className="mt-2 flex items-center justify-between px-1 text-[11px] text-[var(--cavo-smoke)]">
                                <span>
                                  {isAr ? "خط إضافي لإيليت:" : "Secondary Line:"}
                                </span>
                                <a
                                  href={line.secondaryTelHref}
                                  dir="ltr"
                                  className="font-mono font-semibold text-[var(--cavo-gold-deep)] hover:underline"
                                >
                                  {line.secondaryPhoneDisplay}
                                </a>
                              </div>
                            )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Essential Hours, Email & Parking Disclosure Card */}
                <div className="space-y-2.5 rounded-[20px] border border-[var(--cavo-border)] bg-[#f1ede6] p-3.5 text-xs sm:rounded-[24px] sm:p-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="inline-flex items-center gap-1.5 font-bold text-[var(--cavo-ink)]">
                      <Clock className="h-3.5 w-3.5 text-[var(--cavo-gold-deep)]" />
                      {siteConfig.hours[locale]}
                    </span>

                    <a
                      href={`mailto:${siteConfig.email}`}
                      className="inline-flex items-center gap-1 font-mono font-semibold text-[var(--cavo-gold-deep)] hover:underline"
                    >
                      <Mail className="h-3.5 w-3.5" />
                      <span>{siteConfig.email}</span>
                    </a>
                  </div>

                  <p className="border-t border-[var(--cavo-border)]/80 pt-2 text-[11px] leading-relaxed text-[var(--cavo-smoke)]">
                    <ShieldCheck className="me-1 inline h-3.5 w-3.5 text-[var(--cavo-gold-deep)]" />
                    {businessConfirmationRegistry.parkingAndValet.note[locale]}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 03 — INTERACTIVE CONCIERGE MESSAGE FORM + NUMBERED ANIMATED FAQ ACCORDION */}
        <section className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12 lg:gap-8">
          {/* Left 5 Cols: Interactive Concierge Form */}
          <FadeUp className="min-w-0 lg:col-span-5">
            <VisitContactForm locale={locale} />
          </FadeUp>

          {/* Right 7 Cols: Visitor FAQ + Quick Navigation */}
          <FadeUp delay={0.08} className="min-w-0 space-y-5 lg:col-span-7">
            <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
              <div>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--cavo-border)] bg-[#f8f6f2] px-3 py-1 text-[10px] font-bold text-[var(--cavo-gold-deep)] sm:text-[11px]">
                  <Sparkles className="h-3 w-3 text-[var(--cavo-gold)]" />
                  <span className={isAr ? "" : "editorial-eyebrow-en"}>
                    {isAr
                      ? "دليل الزائر والأسئلة الشائعة"
                      : "VISITOR GUIDE & FREQUENT QUESTIONS"}
                  </span>
                </span>
                <h2 className="font-display mt-2 text-2xl font-semibold text-[var(--cavo-ink)] sm:text-4xl">
                  {isAr
                    ? "كل ما تحتاج معرفته قبل وصولك."
                    : "Everything to Know Before You Arrive."}
                </h2>
              </div>

              <Link
                href={localePath(locale, "experiences")}
                className="cavo-btn-pearl inline-flex items-center gap-1.5 self-start rounded-full px-4 py-2 text-xs font-semibold sm:self-auto"
              >
                <span>
                  {isAr ? "مقارنة التجارب الأربع" : "Compare 4 Venues"}
                </span>
                <ArrowRight className="h-3.5 w-3.5 rtl:rotate-180" />
              </Link>
            </div>

            <FaqAccordion locale={locale} />

            {/* Bottom Espresso-Champagne Action Banner Under FAQ */}
            <div className="flex flex-col items-start justify-between gap-4 rounded-[24px] border border-[#d6bc96]/40 bg-gradient-to-br from-[#231a13] via-[#1b140e] to-[#2a1f16] p-5 text-[#f7f0e6] shadow-lg sm:flex-row sm:items-center sm:rounded-[28px] sm:p-6">
              <div>
                <p className="font-display text-lg font-semibold text-white sm:text-2xl">
                  {isAr
                    ? "جاهز لاختيار طاولتك وأطباقك المفضلة على النيل؟"
                    : "Ready to Pick Your Waterside Table & Menu?"}
                </p>
                <p className="mt-0.5 text-xs text-[#ded2c0]">
                  {isAr
                    ? "استعرض المنيو التفاعلي بالأسعار أو أرسل طلب حجزك مباشرة."
                    : "Browse our interactive EGP menu or send your reservation request."}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <Link
                  href={localePath(locale, "book")}
                  className="cavo-btn-gold inline-flex items-center gap-1.5 rounded-full px-5 py-2.5 text-xs font-semibold"
                >
                  <CalendarCheck className="h-3.5 w-3.5" />
                  <span>{isAr ? "احجز الآن" : "Reserve Now"}</span>
                </Link>

                <Link
                  href={localePath(locale, "menu")}
                  className="inline-flex items-center gap-1.5 rounded-full border border-[#d6bc96]/45 bg-white/10 px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-white/20"
                >
                  <UtensilsCrossed className="h-3.5 w-3.5 text-[#e5caa4]" />
                  <span>{isAr ? "تصفح المنيو" : "Explore Menu"}</span>
                </Link>
              </div>
            </div>
          </FadeUp>
        </section>
      </div>
    </div>
  );
}
