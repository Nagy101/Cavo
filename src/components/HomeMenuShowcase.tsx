"use client";

import { useState, type CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Sparkles, UtensilsCrossed } from "lucide-react";
import { dietaryLabels, menuItems } from "@/data/menu";
import { siteConfig } from "@/data/site";
import { localePath, type Locale } from "@/lib/i18n";

const homeMenuTabs = [
  {
    id: "featured",
    label: { en: "Chef's Signatures", ar: "مختارات الشيف" },
  },
  {
    id: "grills-mains",
    label: { en: "Grills & Tajins", ar: "المشاوي والطواجن" },
  },
  {
    id: "morning",
    label: { en: "Morning & Croissants", ar: "الفطار والكرواسون" },
  },
  {
    id: "desserts-drinks",
    label: { en: "Desserts & Mocktails", ar: "الحلويات والموكتيلات" },
  },
] as const;

type HomeMenuTabId = (typeof homeMenuTabs)[number]["id"];

export function HomeMenuShowcase({ locale }: { locale: Locale }) {
  const isAr = locale === "ar";
  const [activeTab, setActiveTab] = useState<HomeMenuTabId>("featured");

  const getDishesForTab = (tab: HomeMenuTabId) => {
    switch (tab) {
      case "featured":
        return menuItems.filter((item) => item.featured).slice(0, 6);
      case "grills-mains":
        return menuItems
          .filter(
            (item) =>
              item.category === "grills" || item.category === "tajins-mains"
          )
          .slice(0, 6);
      case "morning":
        return menuItems
          .filter(
            (item) =>
              item.category === "breakfast" || item.category === "appetizers"
          )
          .slice(0, 6);
      case "desserts-drinks":
        return menuItems
          .filter(
            (item) => item.category === "desserts" || item.category === "drinks"
          )
          .slice(0, 6);
    }
  };

  const displayedDishes = getDishesForTab(activeTab);

  return (
    <div>
      {/* Compact Filter Strip */}
      <div className="mb-6 flex flex-col gap-3 sm:mb-9 sm:flex-row sm:items-center sm:justify-between">
        <div
          className="grid grid-cols-2 gap-1.5 rounded-2xl border border-[var(--cavo-border)] bg-[#f8f6f2] p-1.5 shadow-sm sm:inline-flex sm:flex-wrap sm:gap-2 sm:rounded-full"
          role="tablist"
          aria-label={isAr ? "تصنيفات المنيو المختارة" : "Signature Menu Tabs"}
        >
          {homeMenuTabs.map((tab) => {
            const selected = tab.id === activeTab;
            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={selected}
                onClick={() => setActiveTab(tab.id)}
                className={`relative min-h-[38px] rounded-xl px-3 py-2 text-[11px] font-semibold transition-all duration-300 sm:rounded-full sm:px-5 sm:py-2.5 sm:text-xs ${
                  selected
                    ? "cavo-gold-gradient text-white shadow-sm"
                    : "text-[var(--cavo-ink)]/85 hover:bg-[var(--cavo-gold-pale)]/70 hover:text-[var(--cavo-gold-deep)]"
                }`}
              >
                {tab.label[locale]}
              </button>
            );
          })}
        </div>

        <Link
          href={localePath(locale, "menu")}
          className={`cavo-btn-gold group inline-flex min-h-[44px] items-center justify-center gap-2 rounded-full px-5 py-3 text-xs font-semibold sm:px-7 sm:py-3.5 ${
            isAr ? "" : "uppercase tracking-[0.15em]"
          }`}
        >
          <UtensilsCrossed className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          <span>
            {isAr
              ? "استعرض المنيو الكامل (378+ صنف)"
              : "FULL MENU (378+ ITEMS)"}
          </span>
          <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1" />
        </Link>
      </div>

      {/* Boutique 2-Column Grid on Phones, 3-Column on Tablets & Desktop */}
      <div
        key={activeTab}
        className="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 lg:gap-6"
      >
        {displayedDishes.map((dish, idx) => (
          <article
            key={dish.id}
            style={{ "--d": `${idx * 0.05}s` } as CSSProperties}
            className="cavo-swap-in cavo-sheen-card group relative flex min-w-0 flex-col overflow-hidden rounded-[20px] border border-[var(--cavo-border)] bg-[#f8f6f2] p-2 shadow-[0_14px_36px_-18px_rgba(70,54,36,0.14)] transition-all duration-500 hover:-translate-y-1.5 hover:border-[var(--cavo-gold)] hover:shadow-[0_24px_55px_-18px_rgba(90,70,48,0.22)] sm:rounded-[28px] sm:p-3"
          >
            {/* Dish Image Frame */}
            <div className="relative aspect-[4/3.1] w-full overflow-hidden rounded-[14px] bg-[var(--cavo-stone)] sm:aspect-[16/10.5] sm:rounded-[20px]">
              <Image
                src={dish.image}
                alt={dish.name[locale]}
                fill
                sizes="(max-width: 767px) 50vw, 33vw"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#2a2118]/55 via-transparent to-transparent opacity-65 transition-opacity duration-500 group-hover:opacity-80" />

              {/* Top Primary Tag on Mobile, Up to 2 Badges on sm+ */}
              {dish.tags.length > 0 && (
                <div className="absolute start-2 top-2 flex flex-wrap gap-1 sm:start-3 sm:top-3">
                  {dish.tags.slice(0, 2).map((tag, tagIdx) => (
                    <span
                      key={tag}
                      className={` items-center gap-1 rounded-full border border-white/45 bg-[#f6f3ee]/92 px-2 py-0.5 text-[9px] font-bold text-[var(--cavo-gold-deep)] shadow-sm backdrop-blur-md sm:px-2.5 sm:text-[10px] ${
                        tagIdx === 0 ? "inline-flex" : "hidden sm:inline-flex"
                      }`}
                    >
                      {tag === "signature" && (
                        <Sparkles className="h-2.5 w-2.5 text-[var(--cavo-gold)]" />
                      )}
                      {dietaryLabels[tag][locale]}
                    </span>
                  ))}
                </div>
              )}

              {/* Floating Price Medallion */}
              <div className="absolute end-2 bottom-2 sm:end-3 sm:top-3 sm:bottom-auto">
                <span className="inline-flex items-center rounded-full border border-[var(--cavo-gold)]/45 bg-[#f6f3ee]/95 px-2.5 py-0.5 font-mono text-[10px] font-bold text-[var(--cavo-gold-deep)] shadow-md transition-all duration-300 group-hover:bg-[var(--cavo-gold-deep)] group-hover:text-white sm:px-3.5 sm:py-1 sm:text-xs">
                  {dish.priceEgp} {isAr ? "ج.م" : "EGP"}
                </span>
              </div>
            </div>

            {/* Card Body */}
            <div className="flex min-w-0 flex-1 flex-col justify-between p-2 pt-2.5 sm:p-4 sm:pt-4">
              <div className="min-w-0">
                <h3 className="font-display break-words text-sm font-semibold leading-snug text-[var(--cavo-ink)] transition-colors duration-300 group-hover:text-[var(--cavo-gold-deep)] sm:text-2xl">
                  {dish.name[locale]}
                </h3>
                <p className="mt-1 line-clamp-2 break-words text-[11px] leading-relaxed text-[var(--cavo-smoke)] sm:mt-2 sm:text-sm">
                  {dish.description[locale]}
                </p>
              </div>

              <div className="mt-2.5 flex items-center justify-between border-t border-[var(--cavo-border)] pt-2 sm:mt-4 sm:pt-3.5">
                <span className="hidden text-[11px] font-medium text-[var(--cavo-smoke)] lg:inline">
                  {siteConfig.taxBadgeShort[locale]}
                </span>

                <Link
                  href={localePath(locale, "menu")}
                  className="inline-flex items-center gap-1 text-[11px] font-semibold text-[var(--cavo-gold-deep)] transition group-hover:text-[var(--cavo-terracotta)] sm:text-xs"
                >
                  <span>
                    {isAr ? "تفاصيل وحاسبة الفاتورة" : "Estimator & Menu"}
                  </span>
                  <ArrowRight className="h-3 w-3 shrink-0 transition-transform duration-300 group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1 sm:h-3.5 sm:w-3.5" />
                </Link>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
