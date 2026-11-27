import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AnalyticsScripts } from "@/components/AnalyticsScripts";
import { CavoWelcomeIntro } from "@/components/CavoWelcomeIntro";
import { FloatingReserveButton } from "@/components/FloatingReserveButton";
import { Footer } from "@/components/Footer";
import { LocaleDocumentSync } from "@/components/LocaleDocumentSync";
import { Navbar } from "@/components/Navbar";
import { PageMotion } from "@/components/PageMotion";
import { getSiteBaseUrl, siteConfig } from "@/data/site";
import { getDirection, isValidLocale, locales, type Locale } from "@/lib/i18n";

export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

const metaCopy: Record<Locale, { title: string; description: string }> = {
  en: {
    title: "CAVO Island | Cairo, From a Different Point of View",
    description:
      "Four Nile venues aboard Nile City Boat, Zamalek: Main Restaurant, Boat, Private Yacht (Yachts by Cavo), and CAVO Elite. Daily 8 AM – 4 AM.",
  },
  ar: {
    title: "كافو آيلاند | القاهرة، من منظور مختلف على النيل",
    description:
      "أربع تجارب ضيافة على مركب نايل سيتي بالزمالك: المطعم الرئيسي، المركب، اليخت الخاص (Yachts by Cavo)، وكافو إيليت.",
  },
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;

  if (!isValidLocale(locale)) {
    return {};
  }

  const copy = metaCopy[locale];

  return {
    title: copy.title,
    description: copy.description,
    alternates: {
      canonical: `/${locale}`,
      languages: {
        en: "/en",
        ar: "/ar",
      },
    },
    openGraph: {
      type: "website",
      locale: locale === "ar" ? "ar_EG" : "en_US",
      title: copy.title,
      description: copy.description,
      siteName: "CAVO Island",
      images: [
        {
          url: "/media/brand/og-cavo-island.jpg",
          width: 1200,
          height: 630,
          alt: "CAVO Island — Nile City Boat, Zamalek, Cairo",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: copy.title,
      description: copy.description,
      images: ["/media/brand/og-cavo-island.jpg"],
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;

  if (!isValidLocale(locale)) {
    notFound();
  }

  const dir = getDirection(locale);
  const baseUrl = getSiteBaseUrl();

  const structuredGraph = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${baseUrl}/#organization`,
        name: "CAVO Island",
        url: baseUrl,
        logo: `${baseUrl}/media/brand/cavo-logo.png`,
        email: siteConfig.email,
        sameAs: [
          siteConfig.socials.instagramMain,
          siteConfig.socials.instagramYachts,
          siteConfig.socials.instagramElite,
          siteConfig.socials.facebook,
          siteConfig.socials.tiktok,
        ],
      },
      {
        "@type": "Restaurant",
        "@id": `${baseUrl}/#restaurant`,
        name: "CAVO Island",
        parentOrganization: { "@id": `${baseUrl}/#organization` },
        url: `${baseUrl}/${locale}`,
        image: `${baseUrl}/media/brand/og-cavo-island.jpg`,
        telephone: "+201286666483",
        email: siteConfig.email,
        servesCuisine: ["Egyptian", "Mediterranean", "International", "Grill"],
        hasMenu: `${baseUrl}/${locale}/menu`,
        address: {
          "@type": "PostalAddress",
          streetAddress: "Nile City Boat, Zamalek Corniche",
          addressLocality: "Cairo",
          addressCountry: "EG",
        },
        openingHoursSpecification: [
          {
            "@type": "OpeningHoursSpecification",
            dayOfWeek: [
              "Saturday",
              "Sunday",
              "Monday",
              "Tuesday",
              "Wednesday",
              "Thursday",
              "Friday",
            ],
            opens: "08:00",
            closes: "04:00",
          },
        ],
      },
    ],
  };

  return (
    <div
      lang={locale}
      dir={dir}
      className={
        locale === "ar" ? "font-ar min-h-screen" : "font-en min-h-screen"
      }
    >
      <AnalyticsScripts />
      <LocaleDocumentSync locale={locale} dir={dir} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredGraph) }}
      />
      <CavoWelcomeIntro locale={locale} />
      <Navbar locale={locale} />
      <a
        href="#main-content"
        className="cavo-skip-link"
      >
        {locale === "ar" ? "تخطي إلى المحتوى" : "Skip to content"}
      </a>
      <main id="main-content">
        <PageMotion>{children}</PageMotion>
      </main>
      <Footer locale={locale} />
      <FloatingReserveButton locale={locale} />
    </div>
  );
}
