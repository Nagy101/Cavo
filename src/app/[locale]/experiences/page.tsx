import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ExperiencesInteractiveHub } from "@/components/ExperiencesInteractiveHub";
import { isValidLocale } from "@/lib/i18n";

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
        ? "جولة تفاعلية في تجارب كافو الأربع على النيل"
        : "Interactive Tour of Our Four Nile Experiences",
    description:
      locale === "ar"
        ? "استكشف وقارن بين المطعم الرئيسي، المركب (Boat)، اليخت الخاص، وكافو إيليت في الزمالك: الجلسات، الأطباق المميزة، والحجز المباشر."
        : "Explore and compare Main Restaurant, Boat, Private Yacht, and CAVO Elite aboard Nile City Boat, Zamalek: seating zones, menu pairings, and direct booking.",
    alternates: {
      canonical: `/${locale}/experiences`,
      languages: {
        en: "/en/experiences",
        ar: "/ar/experiences",
      },
    },
  };
}

export default async function ExperiencesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();

  return <ExperiencesInteractiveHub locale={locale} />;
}
