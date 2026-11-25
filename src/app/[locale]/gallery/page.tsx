import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowRight,
  CalendarCheck,
  Compass,
  ExternalLink,
  Instagram,
  Sparkles,
} from "lucide-react";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { WatchIntroFilmButton } from "@/components/CavoWelcomeIntro";
import { GalleryGrid } from "@/components/GalleryGrid";
import { AnimatedCounter, FadeUp } from "@/components/MotionPrimitives";
import { galleryItems } from "@/data/gallery";
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
        ? "معرض الصور واللقطات الحية | كافو آيلاند"
        : "Visual Gallery & Nile Moments | CAVO Island",
    description:
      locale === "ar"
        ? "استعرض صوراً وفيديوهات حقيقية من المطعم الرئيسي، المركب، اليخت الخاص، وكافو إيليت على نيل الزمالك."
        : "Browse curated photography and official videos from CAVO Island across The Place, The Taste, The Moments, and After Dark.",
    alternates: {
      canonical: `/${locale}/gallery`,
      languages: {
        en: "/en/gallery",
        ar: "/ar/gallery",
      },
    },
  };
}

export default async function GalleryPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();
  const isAr = locale === "ar";
  const videoCount = galleryItems.filter((i) => i.mediaType === "video").length;

  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-[#f5f2ec] via-[#efeae1] to-[#f6f3ee] pt-20 pb-28 text-[var(--cavo-ink)] sm:pt-24 sm:pb-32">
      {/* Subtle Ambient Sunlit Glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 start-1/3 h-96 w-96 rounded-full opacity-45 blur-3xl"
        style={{
          background:
            "radial-gradient(circle, rgba(196,169,132,0.28) 0%, transparent 70%)",
        }}
      />

      <div className="relative z-10 mx-auto max-w-7xl space-y-10 px-3.5 sm:space-y-14 sm:px-6">
        {/* BALANCED 12-COL EDITORIAL HEADER & VISUAL ARCHIVE DOCK */}
        <header className="grid grid-cols-1 items-end gap-5 lg:grid-cols-12 lg:gap-8">
          <div className="cavo-rise min-w-0 space-y-2.5 lg:col-span-7">
            <div className="flex flex-wrap items-center gap-2">
              <Breadcrumbs
                locale={locale}
                items={[{ label: isAr ? "المعرض المرئي" : "Gallery" }]}
              />
              <span className="text-[var(--cavo-border)]">·</span>
              <div className="inline-flex items-center gap-1.5 rounded-full border border-[var(--cavo-border)] bg-[#f8f6f2] px-3 py-0.5 text-[10px] font-semibold text-[var(--cavo-gold-deep)] shadow-sm sm:text-[11px]">
                <Sparkles className="h-3 w-3 shrink-0 text-[var(--cavo-gold)]" />
                <span className={isAr ? "" : "editorial-eyebrow-en"}>
                  {isAr
                    ? "الأرشيف المرئي الرسمي · الزمالك"
                    : "THE CAVO VISUAL ARCHIVE"}
                </span>
              </div>
            </div>

            <h1 className="font-display text-3xl font-semibold leading-[1.15] text-[var(--cavo-ink)] sm:text-5xl">
              {isAr ? (
                <>
                  المكان، المذاق،{" "}
                  <span className="cavo-gold-text">وسحر السهر على النيل.</span>
                </>
              ) : (
                <>
                  The Place. The Taste.{" "}
                  <span className="cavo-gold-text italic">After Dark.</span>
                </>
              )}
            </h1>

            <p className="max-w-2xl break-words text-xs leading-relaxed text-[var(--cavo-smoke)] sm:text-base">
              {isAr
                ? "كل لقطة وفيديو هنا موثّق من داخل وجهات كافو الأربع على متن مركب نايل سيتي بالزمالك — تصفح حسب الأجواء واضغط على أي كادر للمشاهدة بالحجم الكامل."
                : "Every frame and film is captured inside Main Restaurant, Boat, Yachts by Cavo, and CAVO Elite along the Zamalek Nile Corniche."}
            </p>
          </div>

          {/* Right 5 Cols: Archive Stats + Official Film Trigger + Instagram Stories */}
          <FadeUp delay={0.08} className="min-w-0 lg:col-span-5">
            <div className="rounded-[24px] border border-[var(--cavo-gold)]/35 bg-[#f8f6f2] p-3.5 shadow-[0_16px_38px_-16px_rgba(70,54,36,0.16)] sm:rounded-[28px] sm:p-4">
              <div className="grid grid-cols-3 divide-x divide-[var(--cavo-border)] text-center rtl:divide-x-reverse">
                <div className="px-2">
                  <p className="font-display text-xl font-bold text-[var(--cavo-gold-deep)] sm:text-2xl">
                    <AnimatedCounter target={galleryItems.length} />
                  </p>
                  <p className="text-[10px] font-semibold text-[var(--cavo-smoke)] sm:text-[11px]">
                    {isAr ? "كادر ولقطة" : "Curated Frames"}
                  </p>
                </div>
                <div className="px-2">
                  <p className="font-display text-xl font-bold text-[var(--cavo-gold-deep)] sm:text-2xl">
                    <AnimatedCounter target={videoCount} padZero />
                  </p>
                  <p className="text-[10px] font-semibold text-[var(--cavo-smoke)] sm:text-[11px]">
                    {isAr ? "جولات فيديو" : "Nile Films"}
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
              </div>

              <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
                <WatchIntroFilmButton
                  locale={locale}
                  className="cavo-btn-gold inline-flex min-h-[40px] items-center justify-center gap-2 rounded-full px-4 py-2 text-xs font-semibold"
                />

                <a
                  href={siteConfig.socials.instagramMain}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="cavo-btn-pearl inline-flex min-h-[40px] items-center justify-center gap-1.5 rounded-full px-4 py-2 text-xs font-semibold"
                >
                  <Instagram className="h-3.5 w-3.5 text-[var(--cavo-gold-deep)]" />
                  <span>@cavoisland</span>
                  <ExternalLink className="h-3 w-3 text-[var(--cavo-gold)]" />
                </a>
              </div>
            </div>
          </FadeUp>
        </header>

        {/* INTERACTIVE FULL ARCHIVE GALLERY GRID */}
        <GalleryGrid locale={locale} showFilters />

        {/* GRAND ESPRESSO-CHAMPAGNE RESERVATION PAVILION */}
        <FadeUp className="relative overflow-hidden rounded-[28px] border border-[#d6bc96]/45 bg-[#1d150f] p-6 text-white shadow-[0_30px_75px_-24px_rgba(30,20,12,0.5)] sm:rounded-[36px] sm:p-11">
          <Image
            src="/media/hero/boat-nile-night.jpg"
            alt=""
            fill
            sizes="(max-width: 1280px) 100vw, 1280px"
            className="object-cover object-center opacity-32"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#1a130d]/95 via-[#1f1610]/85 to-[#2b1f15]/78"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-2.5 rounded-[22px] border border-[#d6bc96]/20 sm:inset-4 sm:rounded-[28px]"
          />

          <div className="relative z-10 flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-center">
            <div className="max-w-xl space-y-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[#d6bc96]/35 bg-white/10 px-3.5 py-1 text-[11px] font-semibold text-[#efdcb9] backdrop-blur-sm">
                <Compass className="h-3 w-3 text-[#e5caa4]" />
                <span>{siteConfig.tagline[locale]}</span>
              </span>
              <h2 className="font-display text-2xl font-semibold text-white sm:text-4xl">
                {isAr
                  ? "عِش الأجواء بنفسك على ضفة النيل بالزمالك."
                  : "Step Inside the Frame Aboard Nile City Boat."}
              </h2>
              <p className="text-xs leading-relaxed text-[#ded2c0] sm:text-sm">
                {isAr
                  ? "اختر وجهتك المفضلة بين المطعم الرئيسي، المركب المفتوح، اليخت الخاص، أو كافو إيليت واحجز طاولتك الآن."
                  : "Select your preferred setting across our four signature Nile destinations and reserve your table."}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <Link
                href={localePath(locale, "book")}
                className="cavo-btn-gold inline-flex min-h-[46px] items-center gap-2 rounded-full px-7 py-3 text-xs font-semibold"
              >
                <CalendarCheck className="h-3.5 w-3.5" />
                <span>
                  {isAr ? "احجز تجربتك الآن" : "Reserve Your Experience"}
                </span>
                <ArrowRight className="h-3.5 w-3.5 rtl:rotate-180" />
              </Link>

              <Link
                href={localePath(locale, "experiences")}
                className="inline-flex min-h-[46px] items-center gap-1.5 rounded-full border border-[#d6bc96]/45 bg-white/10 px-6 py-3 text-xs font-semibold text-[#f8f2e8] backdrop-blur-sm transition hover:bg-white/20"
              >
                <span>
                  {isAr ? "استكشف التجارب الأربع" : "Compare 4 Venues"}
                </span>
              </Link>
            </div>
          </div>
        </FadeUp>
      </div>
    </div>
  );
}
