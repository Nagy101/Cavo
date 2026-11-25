import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { localePath, type Locale } from "@/lib/i18n";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  locale: Locale;
  items: BreadcrumbItem[];
  tone?: "light" | "dark";
}

export function Breadcrumbs({
  locale,
  items,
  tone = "light",
}: BreadcrumbsProps) {
  const isAr = locale === "ar";
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://www.cavo-island.com";

  const fullList: BreadcrumbItem[] = [
    { label: isAr ? "الرئيسية" : "Home", href: localePath(locale) },
    ...items,
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: fullList.map((item, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      name: item.label,
      ...(item.href ? { item: `${baseUrl}${item.href}` } : {}),
    })),
  };

  const textColor =
    tone === "dark" ? "text-[var(--cavo-muted-gray)]" : "text-[var(--cavo-smoke)]";
  const activeColor =
    tone === "dark"
      ? "text-[var(--cavo-champagne-light)]"
      : "text-[var(--cavo-obsidian)]";

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <nav
        aria-label={isAr ? "مسار الصفحة" : "Breadcrumb"}
        className={`flex flex-wrap items-center gap-1.5 text-xs ${textColor}`}
      >
        {fullList.map((item, index) => {
          const isLast = index === fullList.length - 1;
          return (
            <span key={`${item.label}-${index}`} className="inline-flex items-center gap-1.5">
              {index > 0 && (
                <ChevronRight className="h-3 w-3 opacity-60 rtl:rotate-180" />
              )}
              {item.href && !isLast ? (
                <Link
                  href={item.href}
                  className="transition hover:text-[var(--cavo-champagne)] hover:underline"
                >
                  {item.label}
                </Link>
              ) : (
                <span className={`font-medium ${activeColor}`}>{item.label}</span>
              )}
            </span>
          );
        })}
      </nav>
    </>
  );
}
