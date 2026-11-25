import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MenuExplorer } from "@/components/MenuExplorer";
import { menuCategories, menuItems } from "@/data/menu";
import { getSiteBaseUrl } from "@/data/site";
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
        ? "المنيو التفاعلي وأسعار الأطباق | كافو آيلاند"
        : "Interactive Digital Menu & Bill Estimator",
    description:
      locale === "ar"
        ? "تصفح منيو كافو آيلاند الفاخر بالأسعار الحقيقية بالجنيه المصري، ترشيحات الشيف، وحاسبة الفاتورة الذكية شاملة الخدمة والضريبة وتقسيم الأفراد."
        : "Explore CAVO Island's interactive gastronomy menu with verified EGP pricing, chef's spotlight, dietary filters, and smart bill & split estimator.",
    alternates: {
      canonical: `/${locale}/menu`,
      languages: {
        en: "/en/menu",
        ar: "/ar/menu",
      },
    },
  };
}

export default async function MenuPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();
  const isAr = locale === "ar";
  const baseUrl = getSiteBaseUrl();

  const menuJsonLd = {
    "@context": "https://schema.org",
    "@type": "Menu",
    name: isAr ? "منيو كافو آيلاند" : "CAVO Island Menu",
    url: `${baseUrl}/${locale}/menu`,
    inLanguage: locale,
    hasMenuSection: menuCategories.map((cat) => ({
      "@type": "MenuSection",
      name: cat.label[locale],
      hasMenuItem: menuItems
        .filter((item) => item.category === cat.id)
        .map((item) => ({
          "@type": "MenuItem",
          name: item.name[locale],
          description: item.description[locale],
          offers: {
            "@type": "Offer",
            price: item.priceEgp,
            priceCurrency: "EGP",
          },
        })),
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(menuJsonLd) }}
      />
      <MenuExplorer locale={locale} />
    </>
  );
}
