import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Anchor,
  ArrowRight,
  Clock,
  ExternalLink,
  MapPin,
  Phone,
  Sparkles,
} from "lucide-react";
import { EditorialHero } from "@/components/EditorialHero";
import { EditorialVenuesShowcase } from "@/components/EditorialVenuesShowcase";
import { GalleryGrid } from "@/components/GalleryGrid";
import { HomeMenuShowcase } from "@/components/HomeMenuShowcase";
import { FadeUp } from "@/components/MotionPrimitives";
import { NileMapEmbed } from "@/components/NileMapEmbed";
import { buildWhatsAppUrl, siteConfig } from "@/data/site";
import { isValidLocale, localePath } from "@/lib/i18n";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();

  const isAr = locale === "ar";
  const yachtWhatsAppHref = buildWhatsAppUrl(
    "201286666482",
    isAr
      ? "مرحباً، أرغب في الاستفسار عن حجز يخت خاص من كافو."
      : "Hello, I would like to inquire about a private yacht charter with CAVO."
  );

  return (
    <div className="bg-[var(--cavo-pearl)] text-[var(--cavo-ink)]">
      <EditorialHero locale={locale} />

      <section
        id="experiences"
        className="scroll-mt-24 border-y border-[var(--cavo-border)] bg-[#efeae1] px-4 py-12 sm:px-6 sm:py-16 lg:py-20"
      >
        <div className="mx-auto max-w-7xl space-y-6 sm:space-y-8">
          <FadeUp className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div className="min-w-0">
              <p className="inline-flex items-center gap-1.5 rounded-full border border-[var(--cavo-border)] bg-[#f8f6f2] px-3.5 py-1 text-[11px] font-semibold text-[var(--cavo-gold-deep)] sm:text-xs">
                <Sparkles className="h-3 w-3 text-[var(--cavo-gold)]" />
                {isAr ? "اختار أجواءك" : "FIND YOUR CAVO MOMENT"}
              </p>
              <h2 className="font-display mt-3 text-2xl font-semibold sm:text-4xl lg:text-5xl">
                {isAr
                  ? "زيارة هادية، سهرة على النيل، ولا يخت خاص؟"
                  : "A relaxed lunch, a Nile-side evening, or your own yacht?"}
              </h2>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[var(--cavo-smoke)] sm:text-base">
                {isAr
                  ? "كل تجربة ليها طابعها. اختار اللي يناسب يومك وشوف التفاصيل قبل الحجز."
                  : "Each setting has its own rhythm. Pick the one that fits your plans and see the details before you book."}
              </p>
            </div>
            <Link
              href={localePath(locale, "experiences")}
              className="cavo-btn-pearl inline-flex min-h-[42px] items-center justify-center gap-2 self-start rounded-full px-5 py-2.5 text-xs font-semibold sm:self-auto"
            >
              {isAr ? "كل التجارب" : "ALL EXPERIENCES"}
              <ArrowRight className="h-3.5 w-3.5 rtl:rotate-180" />
            </Link>
          </FadeUp>
          <EditorialVenuesShowcase locale={locale} />
        </div>
      </section>

      <section
        id="menu"
        className="scroll-mt-24 mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:py-20"
      >
        <FadeUp className="mb-6 flex flex-col gap-3 sm:mb-8 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="inline-flex items-center gap-1.5 rounded-full border border-[var(--cavo-border)] bg-[var(--cavo-gold-pale)] px-3.5 py-1 text-[11px] font-semibold text-[var(--cavo-gold-deep)] sm:text-xs">
              <Sparkles className="h-3 w-3 text-[var(--cavo-gold)]" />
              {isAr ? "من مطبخ كافو" : "FROM THE CAVO KITCHEN"}
            </p>
            <h2 className="font-display mt-3 text-2xl font-semibold sm:text-4xl lg:text-5xl">
              {isAr ? "ابدأ بأطباقنا المفضلة." : "Start with a few favourites."}
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[var(--cavo-smoke)] sm:text-base">
              {siteConfig.taxNotice[locale]}
            </p>
          </div>
        </FadeUp>
        <HomeMenuShowcase locale={locale} />
      </section>

      <section className="px-4 py-8 sm:px-6 sm:py-12 lg:py-16">
        <FadeUp>
          <div className="group relative mx-auto max-w-7xl overflow-hidden rounded-[28px] border border-[#d6bc96]/35 bg-[#211811] text-[#f7f0e6] shadow-[0_28px_70px_-32px_rgba(30,20,12,0.5)] sm:rounded-[36px]">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-2.5 z-10 rounded-[22px] border border-[#d6bc96]/18 sm:inset-3.5 sm:rounded-[28px]"
            />
            <div className="grid lg:grid-cols-2">
              <div className="relative min-h-[260px] overflow-hidden sm:min-h-[380px]">
                <Image
                  src="/media/venues/private-yacht/yacht-night-dinner.jpg"
                  alt={
                    isAr
                      ? "عشاء على يخت كافو الخاص على النيل"
                      : "Private dinner aboard a CAVO yacht on the Nile"
                  }
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1b130d]/55 to-transparent lg:bg-gradient-to-r" />
                <div className="absolute bottom-4 start-4 rounded-full border border-white/35 bg-[#1b130d]/55 px-3.5 py-1.5 text-xs font-medium text-white backdrop-blur-md sm:bottom-6 sm:start-6">
                  {isAr ? "Yachts by Cavo" : "Yachts by Cavo · Zamalek"}
                </div>
              </div>

              <div className="relative flex flex-col justify-center p-6 sm:p-10 lg:p-12">
                <p className="inline-flex w-fit items-center gap-2 rounded-full border border-[#d6bc96]/35 bg-white/[0.06] px-3.5 py-1 text-[11px] font-semibold text-[#ebd4b2] sm:text-xs">
                  <Anchor className="h-3.5 w-3.5" />
                  {isAr ? "مناسبات على طريقتك" : "A LITTLE MORE PERSONAL"}
                </p>
                <h2 className="font-display mt-4 text-3xl font-semibold leading-tight sm:text-4xl lg:text-5xl">
                  {isAr
                    ? "احتفلوا على النيل، والباقي علينا."
                    : "Make the occasion a Nile story."}
                </h2>
                <p className="mt-3 max-w-lg text-sm leading-relaxed text-[#ded2c0] sm:text-base">
                  {isAr
                    ? "عيد ميلاد، مناسبة خاصة، أو عشاء بعيد عن الزحمة. احكيلنا فكرتك وفريق اليخوت ينسّق معاك التفاصيل."
                    : "Birthdays, anniversaries, and private dinners. Tell the yacht team what you have in mind and shape the details together."}
                </p>
                <div className="mt-6 flex flex-col gap-2.5 sm:flex-row sm:flex-wrap">
                  <Link
                    href={localePath(locale, "private-events")}
                    className="cavo-btn-gold inline-flex min-h-[44px] items-center justify-center gap-2 rounded-full px-6 py-3 text-xs font-semibold"
                  >
                    {isAr ? "خطط لمناسبتك" : "PLAN YOUR EVENT"}
                    <ArrowRight className="h-3.5 w-3.5 rtl:rotate-180" />
                  </Link>
                  <a
                    href={yachtWhatsAppHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-[44px] items-center justify-center rounded-full border border-[#d6bc96]/45 bg-white/10 px-6 py-3 text-xs font-semibold text-[#f8f2e8] transition hover:bg-white/15"
                  >
                    {isAr ? "اسأل فريق اليخت" : "ASK THE YACHT TEAM"}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </FadeUp>
      </section>

      <section
        id="gallery"
        className="mx-auto max-w-7xl scroll-mt-24 px-4 py-12 sm:px-6 sm:py-16 lg:py-20"
      >
        <FadeUp className="mb-6 flex flex-col gap-3 sm:mb-8 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="inline-flex items-center gap-1.5 rounded-full border border-[var(--cavo-border)] bg-[var(--cavo-gold-pale)] px-3.5 py-1 text-[11px] font-semibold text-[var(--cavo-gold-deep)] sm:text-xs">
              <Sparkles className="h-3 w-3 text-[var(--cavo-gold)]" />
              {isAr ? "من قلب المكان" : "A FEW MOMENTS AT CAVO"}
            </p>
            <h2 className="font-display mt-3 text-2xl font-semibold sm:text-4xl lg:text-5xl">
              {isAr ? "شوف الأجواء بنفسك." : "Get a feel for the place."}
            </h2>
          </div>
          <Link
            href={localePath(locale, "gallery")}
            className="cavo-btn-pearl inline-flex min-h-[42px] items-center justify-center gap-2 self-start rounded-full px-5 py-2.5 text-xs font-semibold sm:self-auto"
          >
            {isAr ? "كل الصور والفيديو" : "VIEW ALL PHOTOS & VIDEO"}
            <ArrowRight className="h-3.5 w-3.5 rtl:rotate-180" />
          </Link>
        </FadeUp>
        <GalleryGrid locale={locale} limit={6} showFilters={false} />
      </section>

      <section className="border-y border-[var(--cavo-border)] bg-[#efeae1] px-4 py-12 sm:px-6 sm:py-16 lg:py-20">
        <div className="mx-auto grid max-w-7xl items-center gap-6 lg:grid-cols-[0.8fr_1.2fr] lg:gap-10">
          <FadeUp className="space-y-4">
            <p className="inline-flex items-center gap-1.5 rounded-full border border-[var(--cavo-border)] bg-[#f8f6f2] px-3.5 py-1 text-[11px] font-semibold text-[var(--cavo-gold-deep)] sm:text-xs">
              <MapPin className="h-3 w-3" />
              {isAr ? "في الزمالك، على النيل" : "ON THE NILE IN ZAMALEK"}
            </p>
            <h2 className="font-display text-3xl font-semibold sm:text-4xl lg:text-5xl">
              {isAr ? "مكان سهل توصل له." : "Easy to find. Worth the visit."}
            </h2>
            <p className="text-sm leading-relaxed text-[var(--cavo-smoke)] sm:text-base">
              {siteConfig.landmarkNote[locale]}
            </p>
            <div className="flex flex-wrap gap-2 text-xs font-medium">
              <span className="inline-flex items-center gap-2 rounded-full border border-[var(--cavo-border)] bg-[#f8f6f2] px-3.5 py-2">
                <Clock className="h-3.5 w-3.5 text-[var(--cavo-gold-deep)]" />
                {siteConfig.hours[locale]}
              </span>
              <a
                href="tel:+201286666483"
                dir="ltr"
                className="inline-flex items-center gap-2 rounded-full border border-[var(--cavo-border)] bg-[#f8f6f2] px-3.5 py-2 text-[var(--cavo-gold-deep)]"
              >
                <Phone className="h-3.5 w-3.5" />
                +20 128 666 6483
              </a>
            </div>
            <div className="flex flex-wrap gap-2 pt-1">
              <Link
                href={localePath(locale, "book")}
                className="cavo-btn-gold inline-flex min-h-[44px] items-center justify-center gap-2 rounded-full px-5 py-3 text-xs font-semibold"
              >
                {isAr ? "احجز مكانك" : "RESERVE A TABLE"}
                <ArrowRight className="h-3.5 w-3.5 rtl:rotate-180" />
              </Link>
              <a
                href={siteConfig.mapsDirectionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="cavo-btn-pearl inline-flex min-h-[44px] items-center justify-center gap-2 rounded-full px-5 py-3 text-xs font-semibold"
              >
                {isAr ? "الاتجاهات" : "GET DIRECTIONS"}
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </div>
          </FadeUp>
          <FadeUp delay={0.08}>
            <NileMapEmbed locale={locale} className="h-[300px] sm:h-[390px]" />
          </FadeUp>
        </div>
      </section>
    </div>
  );
}
