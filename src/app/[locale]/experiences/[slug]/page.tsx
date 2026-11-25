import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { VenueDetailClient } from "@/components/VenueDetailClient";
import { getVenueBySlug, venues } from "@/data/venues";
import { isValidLocale, locales } from "@/lib/i18n";

export function generateStaticParams() {
  return locales.flatMap((locale) =>
    venues.map((venue) => ({
      locale,
      slug: venue.slug,
    }))
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isValidLocale(locale)) return {};
  const venue = getVenueBySlug(slug);
  if (!venue) return {};
  return {
    title: `${venue.name[locale]} | ${venue.role[locale]}`,
    description: venue.shortDesc[locale],
    alternates: {
      canonical: `/${locale}/experiences/${venue.slug}`,
      languages: {
        en: `/en/experiences/${venue.slug}`,
        ar: `/ar/experiences/${venue.slug}`,
      },
    },
    openGraph: {
      images: [{ url: venue.heroImage }],
    },
  };
}

export default async function VenueDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  if (!isValidLocale(locale)) notFound();

  const venue = getVenueBySlug(slug);
  if (!venue) notFound();

  return <VenueDetailClient venue={venue} locale={locale} />;
}
