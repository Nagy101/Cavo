import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Anchor,
  ArrowRight,
  Check,
  Clock,
  Compass,
  ExternalLink,
  Instagram,
  MapPin,
  MessageCircle,
  Music2,
  Phone,
  ShieldCheck,
  Sparkles,
  Tv,
} from "lucide-react";
import { DayToNightSection } from "@/components/DayToNightSection";
import { EditorialHero } from "@/components/EditorialHero";
import { EditorialVenuesShowcase } from "@/components/EditorialVenuesShowcase";
import { GalleryGrid } from "@/components/GalleryGrid";
import { HomeMenuShowcase } from "@/components/HomeMenuShowcase";
import { AnimatedCounter, FadeUp } from "@/components/MotionPrimitives";
import { NileMapEmbed } from "@/components/NileMapEmbed";
import {
  buildWhatsAppUrl,
  businessConfirmationRegistry,
  siteConfig,
} from "@/data/site";
import { venues } from "@/data/venues";
import { isValidLocale, localePath } from "@/lib/i18n";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!isValidLocale(locale)) {
    notFound();
  }

  const isAr = locale === "ar";

  const eventOccasions = isAr
    ? [
        "أعياد الميلاد والاحتفالات الخاصة",
        "حفلات الخطوبة والمناسبات الرومانسية",
        "رحلات وعزومات اليخت الخاص",
        "عشاء العمل واستضافة الشركات",
      ]
    : [
        "Milestone Birthdays",
        "Proposals & Anniversaries",
        "Private Yacht Dinners",
        "Executive & VIP Hosting",
      ];

  const communityStories = [
    {
      num: "01",
      Icon: Music2,
      image: "/media/gallery/takhtista-live.jpg",
      tag: isAr ? "موسيقى حية وطرب" : "Live Music Nights",
      title: isAr
        ? "سهرات الطرب والموسيقى الحية"
        : "Live Bands & Cassette 90s",
      desc: isAr
        ? "أمسيات موسيقية حية منشورة على الحساب الرسمي تشمل فرق TAKHTISTA وCAVO Cassette 90s وسط أجواء النيل."
        : "Live acoustic and oriental nights published on @cavoisland, including TAKHTISTA and CAVO Cassette 90s sessions.",
    },
    {
      num: "02",
      Icon: Tv,
      image: "/media/gallery/live-band-night.jpg",
      tag: isAr ? "+130 ألف متابع" : "130K+ Community",
      title: isAr
        ? "ليالي المباريات ومجتمع متجدد"
        : "Match Screenings & 130K+ Guests",
      desc: isAr
        ? "مجتمع يتجاوز 130 ألف متابع على إنستغرام مع بث المباريات الكبرى وأجواء عائلية وشبابية نابضة بالحياة."
        : "Backed by an active 130K+ Instagram community and live screening nights for major football matches.",
    },
    {
      num: "03",
      Icon: ShieldCheck,
      image: "/media/venues/elite/elite-window-feast.jpg",
      tag: isAr ? "شفافية كاملة" : "Honest Clarity",
      title: isAr
        ? "التزام الوضوح والشفافية"
        : "Transparent Pricing & Desks",
      desc: isAr
        ? "إفصاح مسبق عن 12% خدمة و14% ضريبة في كل خطوة بالمنيو، وتوجيه مباشر لطلبات الحجز لمكتب كل وجهة."
        : "Upfront 12% service & 14% VAT notice across our menu plus direct booking-request routing to each venue desk.",
    },
  ] as const;

  const yachtWhatsAppHref = buildWhatsAppUrl(
    "201286666482",
    isAr
      ? "مرحباً فريق Yachts by Cavo، أرغب في الاستفسار عن حجز رحلة يخت خاصة."
      : "Hello Yachts by Cavo team, I would like to inquire about a private yacht charter."
  );

  return (
    <div className="bg-[var(--cavo-pearl)] text-[var(--cavo-ink)]">
      {/* SECTION 01 — FULL-BLEED CINEMATIC NILE HERO */}
      <EditorialHero locale={locale} />

      {/* SECTION 02 — DISCOVER CAVO */}
      <section
        id="discover"
        className="relative mx-auto max-w-7xl scroll-mt-20 px-4 py-14 sm:px-6 sm:py-22 lg:py-28"
      >
        {/* Subtle Architectural Glow */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute start-0 top-1/3 h-72 w-72 rounded-full opacity-45 blur-3xl"
          style={{
            background:
              "radial-gradient(circle, rgba(196,169,132,0.22) 0%, transparent 70%)",
          }}
        />

        <div className="relative z-10 grid grid-cols-1 items-center gap-9 sm:gap-12 lg:grid-cols-12 lg:gap-14">
          {/* Asymmetrical Double-Framed Photo Collage */}
          <FadeUp className="relative mx-auto w-full max-w-2xl min-w-0 lg:col-span-6 lg:max-w-none">
            {/* Subtle Architectural Offset Hairline */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -inset-2.5 hidden rounded-[36px] border border-[var(--cavo-gold)]/20 sm:block"
            />

            <div className="grid grid-cols-12 items-center gap-2.5 sm:gap-5">
              <div className="cavo-sheen-card group col-span-7 overflow-hidden rounded-[22px] border border-[var(--cavo-gold)]/35 bg-[#f8f6f2] p-1.5 shadow-[0_22px_50px_-18px_rgba(70,54,36,0.2)] transition-all duration-500 hover:-translate-y-1.5 hover:border-[var(--cavo-gold)] sm:rounded-[30px] sm:p-2.5">
                <div className="relative aspect-[4/4.4] overflow-hidden rounded-[16px] bg-[var(--cavo-stone)] sm:aspect-[3/3.75] sm:rounded-[22px]">
                  <Image
                    src="/media/hero/main-day.jpg"
                    alt={
                      isAr
                        ? "التصميم الداخلي الدافئ لمطعم كافو بالزمالك"
                        : "CAVO Main Restaurant sunlit timber pergola in Zamalek"
                    }
                    fill
                    sizes="(max-width: 1024px) 58vw, 28vw"
                    className="object-cover transition-transform duration-1000 ease-out group-hover:scale-108"
                  />
                </div>
              </div>

              <div className="cavo-sheen-card group col-span-5 mt-6 overflow-hidden rounded-[22px] border border-[var(--cavo-gold)]/35 bg-[#f8f6f2] p-1.5 shadow-[0_22px_50px_-18px_rgba(70,54,36,0.2)] transition-all duration-500 hover:-translate-y-1.5 hover:border-[var(--cavo-gold)] sm:mt-12 sm:rounded-[30px] sm:p-2.5">
                <div className="relative aspect-[3/4.1] overflow-hidden rounded-[16px] bg-[var(--cavo-stone)] sm:aspect-[3/4.2] sm:rounded-[22px]">
                  <Image
                    src="/media/hero/main-terrace.jpg"
                    alt={
                      isAr
                        ? "طاولة فطار كافو على ضفة النيل"
                        : "Nile-edge Egyptian breakfast spread at CAVO"
                    }
                    fill
                    sizes="(max-width: 1024px) 42vw, 20vw"
                    className="object-cover transition-transform duration-1000 ease-out group-hover:scale-108"
                  />
                </div>
              </div>
            </div>

            {/* Floating Frosted-Cashmere Architectural Seal */}
            <div className="cavo-float-slow cavo-glass-warm absolute start-1/2 bottom-2 z-10 w-max max-w-[90%] -translate-x-1/2 rounded-xl px-4 py-2 text-center shadow-[0_18px_40px_-12px_rgba(70,54,36,0.24)] rtl:translate-x-1/2 sm:bottom-4 sm:rounded-2xl sm:px-6 sm:py-3.5">
              <p className="font-mono text-[9px] font-bold uppercase tracking-[0.22em] text-[var(--cavo-gold-deep)] sm:text-[10px]">
                NILE CITY BOAT · ZAMALEK
              </p>
              <p className="font-display mt-0.5 text-sm font-semibold text-[var(--cavo-ink)] sm:text-lg">
                {isAr
                  ? "فخامة الضيافة المعمارية على ضفاف النيل"
                  : "Sunlit Riviera Architecture on the Nile"}
              </p>
            </div>
          </FadeUp>

          {/* Editorial Story & Live Animated 3-Col Stat Pillars */}
          <FadeUp delay={0.08} className="min-w-0 lg:col-span-6">
            <p
              className={`inline-flex items-center gap-1.5 rounded-full border border-[var(--cavo-border)] bg-[var(--cavo-gold-pale)] px-3.5 py-1 text-[11px] font-semibold text-[var(--cavo-gold-deep)] sm:text-xs ${
                isAr ? "" : "editorial-eyebrow-en"
              }`}
            >
              <Sparkles className="h-3 w-3 shrink-0 text-[var(--cavo-gold)]" />
              <span>
                {isAr ? "02 · اكتشف كافو آيلاند" : "02 · DISCOVER CAVO"}
              </span>
            </p>

            <h2 className="font-display mt-3 text-2xl font-semibold text-[var(--cavo-ink)] sm:mt-4 sm:text-4xl lg:text-5xl">
              {isAr ? (
                <>
                  أربع تجارب ضيافة متميزة في{" "}
                  <span className="cavo-gold-text">وجهة واحدة على النيل.</span>
                </>
              ) : (
                <>
                  Four distinct Nile experiences within{" "}
                  <span className="cavo-gold-text italic">
                    one iconic destination.
                  </span>
                </>
              )}
            </h2>

            <p className="mt-3 break-words text-[13px] leading-relaxed text-[var(--cavo-smoke)] sm:mt-5 sm:text-base">
              {isAr
                ? "على متن مركب نايل سيتي بالزمالك، يجمع كافو آيلاند أربعة أساليب راقية للزيارة: القاعة المعمارية المشمسة طوال اليوم، سطح المركب المفتوح، رحلات اليخت الخاص، وأجواء كافو إيليت الفاخرة."
                : "Moored aboard Nile City Boat in Zamalek, CAVO Island brings together Main Restaurant, the open-air Boat deck, Yachts by Cavo, and CAVO Elite—allowing every visit to match your exact occasion."}
            </p>

            {/* 3 Live Animated Stat Pillar Cards */}
            <div className="mt-6 grid grid-cols-3 gap-2 sm:mt-8 sm:gap-4">
              <div className="cavo-card-luxury cavo-sheen-card group relative min-w-0 overflow-hidden rounded-2xl p-3 text-center sm:p-5 sm:text-start">
                <div className="cavo-gold-gradient absolute inset-x-0 top-0 h-1 scale-x-0 transition-transform duration-500 group-hover:scale-x-100" />
                <p className="font-display text-2xl font-bold text-[var(--cavo-gold-deep)] sm:text-4xl">
                  <AnimatedCounter target={4} padZero />
                </p>
                <p className="mt-1 text-[11px] font-semibold leading-snug text-[var(--cavo-ink)] sm:text-sm">
                  {isAr ? "وجهات متكاملة" : "Nile Venues"}
                </p>
                <p className="mt-0.5 hidden text-[11px] text-[var(--cavo-smoke)] sm:block">
                  {isAr
                    ? "مطعم · مركب · يخت · إيليت"
                    : "Restaurant · Boat · Yacht · Elite"}
                </p>
              </div>

              <div className="cavo-card-luxury cavo-sheen-card group relative min-w-0 overflow-hidden rounded-2xl p-3 text-center sm:p-5 sm:text-start">
                <div className="cavo-gold-gradient absolute inset-x-0 top-0 h-1 scale-x-0 transition-transform duration-500 group-hover:scale-x-100" />
                <p className="font-display text-2xl font-bold text-[var(--cavo-gold-deep)] sm:text-4xl">
                  <AnimatedCounter target={378} suffix="+" />
                </p>
                <p className="mt-1 text-[11px] font-semibold leading-snug text-[var(--cavo-ink)] sm:text-sm">
                  {isAr ? "صنف بالمنيو" : "Menu Items"}
                </p>
                <p className="mt-0.5 hidden text-[11px] text-[var(--cavo-smoke)] sm:block">
                  {isAr ? "بأسعار معلنة وشفافة" : "Authentic EGP pricing"}
                </p>
              </div>

              <div className="cavo-card-luxury cavo-sheen-card group relative min-w-0 overflow-hidden rounded-2xl p-3 text-center sm:p-5 sm:text-start">
                <div className="cavo-gold-gradient absolute inset-x-0 top-0 h-1 scale-x-0 transition-transform duration-500 group-hover:scale-x-100" />
                <p className="font-display text-2xl font-bold text-[var(--cavo-gold-deep)] sm:text-4xl">
                  <AnimatedCounter
                    target={20}
                    suffix={isAr ? " س" : "h"}
                  />
                </p>
                <p className="mt-1 text-[11px] font-semibold leading-snug text-[var(--cavo-ink)] sm:text-sm">
                  {isAr ? "8 ص – 4 فجراً" : "8 AM – 4 AM"}
                </p>
                <p className="mt-0.5 hidden text-[11px] text-[var(--cavo-smoke)] sm:block">
                  {isAr ? "ضيافة يومية متواصلة" : "20 hours of hospitality"}
                </p>
              </div>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* SECTION 03 — FOUR SIGNATURE EXPERIENCES */}
      <section
        id="experiences"
        className="relative scroll-mt-20 overflow-hidden border-y border-[var(--cavo-border)] bg-gradient-to-b from-[#efeae1] via-[#e6ded1] to-[#efeae1] px-4 py-14 sm:px-6 sm:py-20 lg:py-24"
      >
        <div className="mx-auto max-w-7xl space-y-7 sm:space-y-10">
          <FadeUp className="flex flex-col gap-3 sm:gap-5 md:flex-row md:items-end md:justify-between">
            <div className="min-w-0">
              <p
                className={`inline-flex items-center gap-1.5 rounded-full border border-[var(--cavo-border)] bg-[#f8f6f2] px-3.5 py-1 text-[11px] font-semibold text-[var(--cavo-gold-deep)] shadow-sm sm:text-xs ${
                  isAr ? "" : "editorial-eyebrow-en"
                }`}
              >
                <Sparkles className="h-3 w-3 shrink-0 text-[var(--cavo-gold)]" />
                <span>
                  {isAr
                    ? "03 · التجارب الأربع المميزة"
                    : "03 · FOUR SIGNATURE EXPERIENCES"}
                </span>
              </p>
              <h2 className="font-display mt-2.5 text-2xl font-semibold text-[var(--cavo-ink)] sm:mt-4 sm:text-4xl lg:text-5xl">
                {isAr
                  ? "لكل مزاج وجهة استثنائية على النيل."
                  : "Four Venues. One Standard of Nile Luxury."}
              </h2>
            </div>

            <Link
              href={localePath(locale, "experiences")}
              className="cavo-btn-pearl group inline-flex min-h-[42px] items-center gap-2 self-start rounded-full px-5 py-2.5 text-xs font-semibold sm:px-6 sm:py-3 md:self-auto"
            >
              <span>
                {isAr ? "مقارنة التجارب الأربع" : "COMPARE ALL VENUES"}
              </span>
              <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1" />
            </Link>
          </FadeUp>

          <EditorialVenuesShowcase locale={locale} />
        </div>
      </section>

      {/* SECTION 04 — DAY TO NIGHT (Dynamic Morning-to-Midnight Atmosphere Shift) */}
      <DayToNightSection locale={locale} />

      {/* SECTION 05 — SIGNATURE MENU */}
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20 lg:py-26">
        <FadeUp className="mb-6 sm:mb-9">
          <p
            className={`inline-flex items-center gap-1.5 rounded-full border border-[var(--cavo-border)] bg-[var(--cavo-gold-pale)] px-3.5 py-1 text-[11px] font-semibold text-[var(--cavo-gold-deep)] sm:text-xs ${
              isAr ? "" : "editorial-eyebrow-en"
            }`}
          >
            <Sparkles className="h-3 w-3 shrink-0 text-[var(--cavo-gold)]" />
            <span>
              {isAr
                ? "05 · مختارات من مطبخ كافو"
                : "05 · SIGNATURE CULINARY COLLECTION"}
            </span>
          </p>
          <h2 className="font-display mt-2.5 text-2xl font-semibold text-[var(--cavo-ink)] sm:mt-4 sm:text-4xl lg:text-5xl">
            {isAr
              ? "أطباق ومشروبات حقيقية بتوقيع كافو."
              : "Authentic Creations. Transparent EGP Pricing."}
          </h2>
          <p className="mt-2 max-w-2xl break-words text-xs text-[var(--cavo-smoke)] sm:mt-3 sm:text-base">
            {siteConfig.taxNotice[locale]}
          </p>
        </FadeUp>

        <HomeMenuShowcase locale={locale} />
      </section>

      {/* SECTION 06 — PRIVATE EVENTS & YACHTS BY CAVO (Luxury Espresso-Walnut & Champagne Contrast Pavilion) */}
      <section className="px-4 py-8 sm:px-6 lg:py-16">
        <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[28px] border border-[#d6bc96]/35 bg-gradient-to-br from-[#241b13] via-[#1b140e] to-[#2c2017] p-5 text-[#f7f0e6] shadow-[0_32px_80px_-24px_rgba(30,20,12,0.5)] sm:rounded-[38px] sm:p-10 lg:p-14">
          {/* Inner Architectural Gold Hairline Frame */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-2.5 rounded-[22px] border border-[#d6bc96]/18 sm:inset-4 sm:rounded-[30px]"
          />

          {/* Warm Sunset Radial Ambient Glow */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -end-20 -top-20 h-96 w-96 rounded-full opacity-50 blur-3xl"
            style={{
              background:
                "radial-gradient(circle, rgba(214,174,120,0.25) 0%, transparent 70%)",
            }}
          />

          <div className="relative z-10 grid grid-cols-1 items-center gap-8 sm:gap-10 lg:grid-cols-12 lg:gap-12">
            {/* Yacht Photos Appear First on Mobile (order-1 lg:order-2) */}
            <FadeUp
              delay={0.06}
              className="relative order-1 mx-auto grid w-full max-w-2xl min-w-0 grid-cols-2 gap-3 sm:gap-5 lg:order-2 lg:col-span-6 lg:max-w-none"
            >
              <div className="cavo-sheen-card group overflow-hidden rounded-[20px] border border-[#d6bc96]/30 bg-[#2f2319] p-1.5 shadow-[0_22px_50px_-16px_rgba(0,0,0,0.45)] transition-all duration-500 hover:-translate-y-1.5 sm:rounded-[28px] sm:p-2.5">
                <div className="relative aspect-[4/4.5] overflow-hidden rounded-[15px] bg-[#1a130d] sm:aspect-[4/5] sm:rounded-[20px]">
                  <Image
                    src="/media/venues/private-yacht/yacht-night-dinner.jpg"
                    alt={
                      isAr
                        ? "عشاء ليلي على يخت كافو أمام برج القاهرة"
                        : "Night dining aboard Yachts by Cavo facing Cairo Tower"
                    }
                    fill
                    sizes="(max-width: 1024px) 50vw, 24vw"
                    className="object-cover transition-transform duration-1000 ease-out group-hover:scale-108"
                  />
                </div>
              </div>

              <div className="cavo-sheen-card group mt-5 overflow-hidden rounded-[20px] border border-[#d6bc96]/30 bg-[#2f2319] p-1.5 shadow-[0_22px_50px_-16px_rgba(0,0,0,0.45)] transition-all duration-500 hover:-translate-y-1.5 sm:mt-9 sm:rounded-[28px] sm:p-2.5">
                <div className="relative aspect-[4/4.5] overflow-hidden rounded-[15px] bg-[#1a130d] sm:aspect-[4/5] sm:rounded-[20px]">
                  <Image
                    src="/media/venues/private-yacht/yacht-deck-day.jpg"
                    alt={
                      isAr
                        ? "رحلة نهارية على يخت كافو"
                        : "Daytime cruise aboard Yachts by Cavo"
                    }
                    fill
                    sizes="(max-width: 1024px) 50vw, 24vw"
                    className="object-cover transition-transform duration-1000 ease-out group-hover:scale-108"
                  />
                </div>
              </div>

              {/* Floating Yachts Concierge Glass Seal */}
              <div className="cavo-float-slow absolute start-1/2 bottom-2 z-20 w-max max-w-[92%] -translate-x-1/2 rounded-xl border border-[#d6bc96]/45 bg-[#1b140e]/92 px-3.5 py-2.5 text-center shadow-[0_18px_40px_-10px_rgba(0,0,0,0.55)] backdrop-blur-xl rtl:translate-x-1/2 sm:bottom-3 sm:rounded-2xl sm:px-5 sm:py-3">
                <p className="text-[10px] font-bold text-[#ebd4b2] sm:text-[11px]">
                  {isAr
                    ? "مكتب تنسيق اليخوت المباشر · Yachts by Cavo"
                    : "Yachts by Cavo Direct Charter Desk"}
                </p>
                <div className="mt-1 flex items-center justify-center gap-3">
                  <a
                    href="tel:+201286666482"
                    dir="ltr"
                    className="inline-flex items-center gap-1 font-mono text-[11px] font-bold text-white transition hover:text-[#ebd4b2] sm:text-xs"
                  >
                    <Phone className="h-3 w-3 text-[#d6bc96]" />
                    <span>+20 128 666 6482</span>
                  </a>
                  <span className="h-3 w-[1px] bg-white/20" />
                  <a
                    href={yachtWhatsAppHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#ebd4b2] transition hover:text-white"
                  >
                    <MessageCircle className="h-3 w-3" />
                    <span>{isAr ? "واتساب" : "WhatsApp"}</span>
                  </a>
                </div>
              </div>
            </FadeUp>

            <FadeUp className="order-2 min-w-0 lg:order-1 lg:col-span-6">
              <p
                className={`inline-flex items-center gap-1.5 rounded-full border border-[#d6bc96]/35 bg-white/10 px-3.5 py-1 text-[11px] font-semibold text-[#efdcb9] backdrop-blur-sm sm:text-xs ${
                  isAr ? "" : "editorial-eyebrow-en"
                }`}
              >
                <Anchor className="h-3 w-3 shrink-0 text-[#e4c89e]" />
                <span>
                  {isAr
                    ? "06 · المناسبات الخاصة ويخوت كافو"
                    : "06 · PRIVATE EVENTS & YACHT CHARTERS"}
                </span>
              </p>

              <h2 className="font-display mt-3.5 text-2xl font-semibold text-white sm:mt-4 sm:text-4xl lg:text-5xl">
                {isAr ? (
                  <>
                    اجعل مناسبتك الخاصة{" "}
                    <span className="bg-gradient-to-r from-[#fff3df] via-[#dfc092] to-[#f7e4c6] bg-clip-text text-transparent">
                      لحظة لا تُنسى على النيل.
                    </span>
                  </>
                ) : (
                  <>
                    Make Your Milestone Moments{" "}
                    <span className="bg-gradient-to-r from-[#fff3df] via-[#dfc092] to-[#f7e4c6] bg-clip-text italic text-transparent">
                      Unforgettable.
                    </span>
                  </>
                )}
              </h2>

              <p className="mt-3 break-words text-[13px] leading-relaxed text-[#ded2c0] sm:mt-5 sm:text-base">
                {isAr
                  ? "من أعياد الميلاد وحفلات الخطوبة إلى عشاء العمل والاستضافة الخاصة على متن Yachts by Cavo — صمّم تفاصيل احتفالك أمام برج القاهرة ليراجعها فريق التنسيق مباشرة."
                  : "Host birthdays, proposals, family milestones, or executive dinners aboard Yachts by Cavo or a dedicated riverfront lounge section."}
              </p>

              {/* 2x2 Sculpted Occasion Grid */}
              <div className="mt-5 grid grid-cols-1 gap-2 min-[420px]:grid-cols-2 sm:mt-7 sm:gap-2.5">
                {eventOccasions.map((item) => (
                  <div
                    key={item}
                    className="flex min-w-0 items-center gap-2.5 rounded-xl border border-[#d6bc96]/25 bg-white/[0.06] px-3.5 py-2.5 text-[11px] font-semibold leading-snug text-[#f7f0e6] backdrop-blur-sm transition duration-300 hover:-translate-y-0.5 hover:border-[#d6bc96]/60 hover:bg-white/[0.1] sm:rounded-2xl sm:px-4 sm:py-3 sm:text-xs"
                  >
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#d6bc96]/20 text-[#ebd4b2]">
                      <Check className="h-3 w-3" />
                    </span>
                    <span className="min-w-0 flex-1 break-words">{item}</span>
                  </div>
                ))}
              </div>

              <div className="mt-6 flex flex-col gap-2.5 sm:mt-9 sm:flex-row sm:flex-wrap sm:gap-3.5">
                <Link
                  href={localePath(locale, "private-events")}
                  className={`cavo-btn-gold group inline-flex min-h-[46px] items-center justify-center gap-2 rounded-full px-6 py-3 text-xs font-semibold sm:px-8 sm:py-4 ${
                    isAr ? "" : "uppercase tracking-[0.16em]"
                  }`}
                >
                  <span>
                    {isAr
                      ? "خطط لمناسبتك الخاصة"
                      : "PLAN YOUR PRIVATE EVENT"}
                  </span>
                  <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1" />
                </Link>

                <Link
                  href={localePath(locale, "experiences/private-yacht")}
                  className="inline-flex min-h-[46px] items-center justify-center rounded-full border border-[#d6bc96]/45 bg-white/10 px-6 py-3 text-xs font-semibold text-[#f8f2e8] backdrop-blur-sm transition hover:border-[#ebd4b2] hover:bg-white/20 sm:px-7 sm:py-4"
                >
                  {isAr ? "تفاصيل اليخت الخاص" : "Explore Private Yacht"}
                </Link>
              </div>
            </FadeUp>
          </div>
        </div>
      </section>

      {/* SECTION 07 — THE CAVO GALLERY */}
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20 lg:py-26">
        <FadeUp className="mb-6 flex flex-col gap-3 sm:mb-8 md:flex-row md:items-end md:justify-between">
          <div className="min-w-0">
            <p
              className={`inline-flex items-center gap-1.5 rounded-full border border-[var(--cavo-border)] bg-[var(--cavo-gold-pale)] px-3.5 py-1 text-[11px] font-semibold text-[var(--cavo-gold-deep)] sm:text-xs ${
                isAr ? "" : "editorial-eyebrow-en"
              }`}
            >
              <Sparkles className="h-3 w-3 shrink-0 text-[var(--cavo-gold)]" />
              <span>
                {isAr ? "07 · معرض صور كافو" : "07 · THE CAVO GALLERY"}
              </span>
            </p>
            <h2 className="font-display mt-2.5 text-2xl font-semibold text-[var(--cavo-ink)] sm:mt-4 sm:text-4xl lg:text-5xl">
              {isAr
                ? "لقطات حقيقية من المكان، المذاق، والسهر."
                : "Authentic Frames Across Every Venue."}
            </h2>
          </div>

          <Link
            href={localePath(locale, "gallery")}
            className="cavo-btn-pearl group inline-flex min-h-[42px] items-center gap-2 self-start rounded-full px-5 py-2.5 text-xs font-semibold sm:px-6 sm:py-3 md:self-auto"
          >
            <span>{isAr ? "فتح المعرض الكامل" : "OPEN FULL GALLERY"}</span>
            <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1" />
          </Link>
        </FadeUp>

        <GalleryGrid locale={locale} limit={6} showFilters={true} />
      </section>

      {/* SECTION 08 — GUEST EXPERIENCES & VERIFIED COMMUNITY (Visual Editorial Story Cards) */}
      <section className="border-y border-[var(--cavo-border)] bg-gradient-to-b from-[#efeae1] via-[#e6ded1] to-[#efeae1] px-4 py-14 sm:px-6 sm:py-20 lg:py-24">
        <div className="mx-auto max-w-7xl">
          <FadeUp className="mb-8 flex flex-col gap-4 sm:mb-12 md:flex-row md:items-end md:justify-between">
            <div className="min-w-0">
              <p
                className={`inline-flex items-center gap-1.5 rounded-full border border-[var(--cavo-border)] bg-[#f8f6f2] px-3.5 py-1 text-[11px] font-semibold text-[var(--cavo-gold-deep)] shadow-sm sm:text-xs ${
                  isAr ? "" : "editorial-eyebrow-en"
                }`}
              >
                <Sparkles className="h-3 w-3 shrink-0 text-[var(--cavo-gold)]" />
                <span>
                  {isAr
                    ? "08 · مجتمع كافو وثقة الضيوف"
                    : "08 · GUEST EXPERIENCES & COMMUNITY"}
                </span>
              </p>
              <h2 className="font-display mt-2.5 text-2xl font-semibold text-[var(--cavo-ink)] sm:mt-4 sm:text-4xl lg:text-5xl">
                {isAr
                  ? "ضيافة حية موثقة على ضفاف الزمالك."
                  : "Verified Hospitality, Live Nights & Honest Clarity."}
              </h2>
            </div>

            <a
              href={siteConfig.socials.instagramReviewsHighlight}
              target="_blank"
              rel="noopener noreferrer"
              className="cavo-btn-pearl group inline-flex min-h-[42px] items-center gap-2 self-start rounded-full px-5 py-2.5 text-xs font-semibold sm:px-6 sm:py-3.5 md:self-auto"
            >
              <Instagram className="h-3.5 w-3.5 shrink-0 text-[var(--cavo-gold-deep)] sm:h-4 sm:w-4" />
              <span>
                {isAr
                  ? "قصص الضيوف على @cavoisland"
                  : "Guest Stories on @cavoisland"}
              </span>
              <ExternalLink className="h-3 w-3 shrink-0 text-[var(--cavo-gold)] sm:h-3.5 sm:w-3.5" />
            </a>
          </FadeUp>

          <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-3">
            {communityStories.map((story, idx) => {
              const Icon = story.Icon;
              return (
                <FadeUp key={story.num} delay={idx * 0.08} className="flex">
                  <article className="cavo-card-luxury cavo-sheen-card group relative flex w-full min-w-0 flex-col overflow-hidden rounded-[24px] p-3 sm:rounded-[28px] sm:p-4">
                    {/* Framed Atmosphere Photo */}
                    <div className="relative aspect-[16/9.5] w-full overflow-hidden rounded-[16px] bg-[var(--cavo-stone)] sm:rounded-[20px]">
                      <Image
                        src={story.image}
                        alt={story.title}
                        fill
                        sizes="(max-width: 767px) 100vw, 33vw"
                        className="object-cover transition-transform duration-700 ease-out group-hover:scale-108"
                      />
                      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#1f1710]/78 via-[#1f1710]/15 to-transparent" />

                      <div className="absolute inset-x-3 top-3 flex items-center justify-between gap-2">
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-white/50 bg-[#f6f3ee]/94 px-3 py-1 text-[10px] font-bold text-[var(--cavo-gold-deep)] shadow-sm backdrop-blur-md sm:text-[11px]">
                          <Sparkles className="h-2.5 w-2.5 text-[var(--cavo-gold)]" />
                          <span>{story.tag}</span>
                        </span>

                        <span className="cavo-gold-gradient flex h-9 w-9 items-center justify-center rounded-xl text-white shadow-md transition-transform duration-500 group-hover:scale-110">
                          <Icon className="h-4 w-4" />
                        </span>
                      </div>
                    </div>

                    {/* Narrative Body with Subtle Watermark */}
                    <div className="relative flex flex-1 flex-col justify-between p-2.5 pt-4 sm:p-3 sm:pt-5">
                      <span
                        aria-hidden="true"
                        data-num={story.num}
                        className="cavo-watermark font-display pointer-events-none absolute end-2 top-1 text-5xl font-bold text-[var(--cavo-gold)]/12 transition-transform duration-500 group-hover:scale-110 group-hover:text-[var(--cavo-gold)]/22"
                      />

                      <div>
                        <h3 className="font-display relative z-10 text-xl font-semibold text-[var(--cavo-ink)] transition-colors group-hover:text-[var(--cavo-gold-deep)] sm:text-2xl">
                          {story.title}
                        </h3>
                        <p className="relative z-10 mt-2 break-words text-xs leading-relaxed text-[var(--cavo-smoke)] sm:text-sm">
                          {story.desc}
                        </p>
                      </div>
                    </div>
                  </article>
                </FadeUp>
              );
            })}
          </div>
        </div>
      </section>

      {/* SECTION 09 — PLAN YOUR VISIT */}
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20 lg:py-26">
        <div className="grid grid-cols-1 items-center gap-8 sm:gap-10 lg:grid-cols-12">
          <FadeUp className="min-w-0 space-y-4 sm:space-y-5 lg:col-span-5">
            <div>
              <p
                className={`inline-flex items-center gap-1.5 rounded-full border border-[var(--cavo-border)] bg-[var(--cavo-gold-pale)] px-3.5 py-1 text-[11px] font-semibold text-[var(--cavo-gold-deep)] sm:text-xs ${
                  isAr ? "" : "editorial-eyebrow-en"
                }`}
              >
                <Sparkles className="h-3 w-3 shrink-0 text-[var(--cavo-gold)]" />
                <span>
                  {isAr ? "09 · خطط زيارتك" : "09 · PLAN YOUR VISIT"}
                </span>
              </p>
              <h2 className="font-display mt-2.5 text-2xl font-semibold text-[var(--cavo-ink)] sm:mt-4 sm:text-4xl">
                {isAr
                  ? "مركب نايل سيتي، كورنيش الزمالك"
                  : "Nile City Boat, Zamalek"}
              </h2>
              <p className="mt-2 break-words text-xs leading-relaxed text-[var(--cavo-smoke)] sm:mt-3 sm:text-sm">
                {siteConfig.landmarkNote[locale]}
              </p>
            </div>

            <div className="cavo-card-luxury space-y-2.5 rounded-2xl p-4 text-xs sm:space-y-3.5 sm:rounded-3xl sm:p-5 sm:text-sm">
              <p className="flex items-start gap-2.5 sm:gap-3">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[var(--cavo-gold-pale)] text-[var(--cavo-gold-deep)] sm:h-8 sm:w-8">
                  <MapPin className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                </span>
                <span className="mt-1 break-words font-semibold text-[var(--cavo-ink)]">
                  {siteConfig.address[locale]}
                </span>
              </p>
              <p className="flex items-start gap-2.5 sm:gap-3">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[var(--cavo-gold-pale)] text-[var(--cavo-gold-deep)] sm:h-8 sm:w-8">
                  <Clock className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                </span>
                <span className="mt-1 break-words text-[var(--cavo-ink)]">
                  {siteConfig.hours[locale]}
                </span>
              </p>
              <p className="border-t border-[var(--cavo-border)] pt-2.5 break-words text-[11px] leading-relaxed text-[var(--cavo-smoke)] sm:pt-3 sm:text-xs">
                {businessConfirmationRegistry.parkingAndValet.note[locale]}
              </p>
            </div>

            {/* Direct Venue Desks: One-Tap Call & WhatsApp */}
            <div className="space-y-2">
              {siteConfig.contactLines.map((line) => {
                const waUrl = buildWhatsAppUrl(
                  line.whatsappDigits,
                  isAr
                    ? `مرحباً كافو (${line.label.ar})، أرغب في الاستفسار عن الحجز.`
                    : `Hello CAVO (${line.label.en}), I would like to inquire about a reservation.`
                );
                return (
                  <div
                    key={line.id}
                    className="flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-[var(--cavo-border)] bg-[#f8f6f2] px-4 py-3 text-xs shadow-sm transition-all duration-300 hover:border-[var(--cavo-gold)] hover:bg-[#f2ece2]"
                  >
                    <span className="font-semibold text-[var(--cavo-ink)]">
                      {line.label[locale]}
                    </span>

                    <div className="flex items-center gap-2">
                      <a
                        href={line.telHref}
                        dir="ltr"
                        className="inline-flex items-center gap-1 rounded-full border border-[var(--cavo-border)] bg-white/80 px-2.5 py-1 font-mono text-[11px] font-bold text-[var(--cavo-gold-deep)] transition hover:border-[var(--cavo-gold)] hover:text-[var(--cavo-terracotta)]"
                      >
                        <Phone className="h-3 w-3 text-[var(--cavo-gold)]" />
                        <span>{line.phoneDisplay}</span>
                      </a>

                      <a
                        href={waUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`WhatsApp ${line.label[locale]}`}
                        className="cavo-gold-gradient inline-flex h-7 w-7 items-center justify-center rounded-full text-white shadow-sm transition hover:scale-105"
                      >
                        <MessageCircle className="h-3.5 w-3.5" />
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex flex-wrap gap-2.5 pt-1 sm:gap-3">
              <a
                href={siteConfig.mapsDirectionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={`cavo-btn-gold inline-flex min-h-[44px] items-center gap-2 rounded-full px-6 py-3 text-xs font-semibold sm:px-7 sm:py-3.5 ${
                  isAr ? "" : "uppercase tracking-[0.16em]"
                }`}
              >
                <span>{isAr ? "افتح الاتجاهات" : "GET DIRECTIONS"}</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </a>

              <Link
                href={localePath(locale, "contact")}
                className="cavo-btn-pearl inline-flex min-h-[44px] items-center rounded-full px-5 py-3 text-xs font-semibold sm:px-6 sm:py-3.5"
              >
                {isAr ? "تواصل معنا والأسئلة الشائعة" : "Contact & Visitor FAQ"}
              </Link>
            </div>
          </FadeUp>

          <FadeUp delay={0.1} className="min-w-0 lg:col-span-7">
            <div className="overflow-hidden rounded-[26px] border border-[var(--cavo-gold)]/40 bg-[#f8f6f2] p-2.5 shadow-[0_24px_55px_-20px_rgba(70,54,36,0.22)] sm:rounded-[34px] sm:p-3.5">
              <div className="mb-2.5 flex items-center justify-between px-2 text-[10px] font-semibold text-[var(--cavo-smoke)] sm:text-xs">
                <span className="inline-flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-[var(--cavo-gold)]" />
                  <span>
                    {isAr
                      ? "موقعنا المباشر · كورنيش النيل بالزمالك"
                      : "LIVE LOCATION · ZAMALEK NILE CORNICHE"}
                  </span>
                </span>
                <span className="font-mono text-[10px] text-[var(--cavo-gold-deep)]">
                  30.0561° N · 31.2240° E
                </span>
              </div>

              <NileMapEmbed
                locale={locale}
                className="h-[300px] sm:h-[390px] lg:h-[460px]"
              />
            </div>
          </FadeUp>
        </div>
      </section>

      {/* SECTION 10 — GRAND FINALE CINEMATIC RESERVATION PAVILION */}
      <section className="px-4 pb-16 sm:px-6 lg:pb-24">
        <FadeUp className="relative mx-auto max-w-7xl overflow-hidden rounded-[28px] border border-[#d6bc96]/45 bg-[#1d150f] p-6 text-white shadow-[0_32px_80px_-24px_rgba(30,20,12,0.5)] sm:rounded-[38px] sm:p-12 lg:p-16">
          {/* Veiled Golden-Hour Nile Backdrop */}
          <Image
            src="/media/hero/boat-nile-sunset.jpg"
            alt=""
            fill
            sizes="(max-width: 1280px) 100vw, 1280px"
            className="object-cover object-center opacity-35"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#1a130d]/95 via-[#1f1610]/86 to-[#2b1f15]/78"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-2.5 rounded-[22px] border border-[#d6bc96]/22 sm:inset-4 sm:rounded-[30px]"
          />

          <div className="relative z-10 flex flex-col items-start justify-between gap-7 lg:flex-row lg:items-center">
            <div className="min-w-0 max-w-2xl">
              <p
                className={`inline-flex items-center gap-1.5 rounded-full border border-[#d6bc96]/35 bg-white/10 px-3.5 py-1 text-[11px] font-semibold text-[#efdcb9] backdrop-blur-md sm:text-xs ${
                  isAr ? "" : "editorial-eyebrow-en"
                }`}
              >
                <Compass className="h-3 w-3 shrink-0 text-[#e5caa4]" />
                <span>{siteConfig.tagline[locale]}</span>
              </p>

              <h2 className="font-display mt-3.5 text-2xl font-semibold text-white sm:mt-4 sm:text-4xl lg:text-5xl">
                {isAr
                  ? "تجربتك القادمة على النيل تبدأ من هنا."
                  : "Your CAVO Nile Experience Starts Here."}
              </h2>

              <p className="mt-2.5 break-words text-xs leading-relaxed text-[#e2d6c5] sm:mt-3.5 sm:text-lg">
                {isAr
                  ? "اختر وجهتك المفضلة من تجارب كافو الأربع في قلب الزمالك واترك لفريق الاستقبال تنسيق كل التفاصيل."
                  : "Choose your preferred venue among our four Nile destinations and let our Zamalek hosts take care of every detail."}
              </p>

              {/* Direct Quick-Reserve Venue Chips */}
              <div className="mt-5 flex flex-wrap gap-2">
                {venues.map((venue) => (
                  <Link
                    key={venue.slug}
                    href={localePath(locale, `book?venue=${venue.slug}`)}
                    className="inline-flex items-center gap-1.5 rounded-full border border-[#d6bc96]/30 bg-white/10 px-3 py-1 text-[11px] font-semibold text-[#f5ebdc] backdrop-blur-sm transition hover:border-[#ebd4b2] hover:bg-white/20"
                  >
                    <span className="font-mono text-[10px] text-[#e5caa4]">
                      {venue.number}
                    </span>
                    <span>{venue.name[locale]}</span>
                  </Link>
                ))}
              </div>
            </div>

            <div className="flex w-full flex-col gap-2.5 sm:w-auto sm:flex-row sm:flex-wrap sm:items-center sm:gap-3.5">
              <Link
                href={localePath(locale, "book")}
                className={`cavo-btn-gold group inline-flex min-h-[48px] shrink-0 items-center justify-center gap-2.5 rounded-full px-7 py-3.5 text-xs font-semibold sm:px-9 sm:py-4 ${
                  isAr ? "" : "uppercase tracking-[0.18em]"
                }`}
              >
                <span>
                  {isAr ? "احجز تجربتك الآن" : "RESERVE YOUR EXPERIENCE"}
                </span>
                <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1" />
              </Link>

              <Link
                href={localePath(locale, "menu")}
                className="inline-flex min-h-[48px] items-center justify-center rounded-full border border-[#d6bc96]/45 bg-white/10 px-6 py-3.5 text-xs font-semibold text-[#f8f2e8] backdrop-blur-sm transition hover:border-[#ebd4b2] hover:bg-white/20 sm:px-7 sm:py-4"
              >
                {isAr ? "استعرض المنيو الكامل" : "Explore Full Menu"}
              </Link>
            </div>
          </div>
        </FadeUp>
      </section>
    </div>
  );
}
