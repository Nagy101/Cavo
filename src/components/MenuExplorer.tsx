"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpDown,
  Calculator,
  CalendarCheck,
  ChevronLeft,
  ChevronRight,
  Coffee,
  ExternalLink,
  LayoutGrid,
  List,
  Maximize2,
  MessageCircle,
  Minus,
  Moon,
  Plus,
  Search,
  Sparkles,
  Sun,
  Sunrise,
  Sunset,
  Trash2,
  Users,
  Utensils,
  UtensilsCrossed,
  X,
} from "lucide-react";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import {
  dietaryLabels,
  menuCategories,
  menuItems,
  type DietaryTag,
  type MenuCategoryId,
  type MenuItem,
} from "@/data/menu";
import { buildWhatsAppUrl, siteConfig } from "@/data/site";
import { trackCavoEvent } from "@/lib/analytics";
import { calculateMenuBillEstimate } from "@/lib/integrations/concierge";
import { localePath, type Locale } from "@/lib/i18n";
import type { VenueSlug } from "@/types/cavo";

interface NileTableTimeChapter {
  id: "morning" | "afternoon" | "sunset" | "night";
  number: string;
  icon: "sunrise" | "sun" | "sunset" | "moon";
  skyStateBadge: Record<Locale, string>;
  periodName: Record<Locale, string>;
  timeWindow: Record<Locale, string>;
  venueTag: Record<Locale, string>;
  title: Record<Locale, string>;
  subtitle: Record<Locale, string>;
  tableHighlights: Record<Locale, string[]>;
  image: string;
  targetCategory: MenuCategoryId;
}

const nileTableTimeChapters: NileTableTimeChapter[] = [
  {
    id: "morning",
    number: "01",
    icon: "sunrise",
    skyStateBadge: {
      en: "Daylight · Morning Sunshine on the Nile",
      ar: "نهار مشرق · شمس الصباح على النيل",
    },
    periodName: { en: "Morning", ar: "الصباح" },
    timeWindow: { en: "8:00 AM – 12:00 PM", ar: "8:00 ص – 12:00 ظ" },
    venueTag: {
      en: "Main Restaurant · Sunlit Timber Pergola",
      ar: "المطعم الرئيسي · البرجولا الخشبية المشمسة",
    },
    title: {
      en: "Sunrise Breakfast Right at the Water's Edge",
      ar: "فطار الصباح على الترابيزة قدام النيل مباشرة",
    },
    subtitle: {
      en: "Bright morning daylight sparkles across the Nile right beside your table as golden French croissants, artisanal pastries, farm honey, and specialty cappuccino arrive.",
      ar: "ضوء النهار الصباحي يلمع على مياه النيل والمراكب الشراعية بجوار طاولتك مباشرة مع الكرواسون الفرنسي الطازج، المخبوزات الساخنة، والعسل والقهوة المختصة.",
    },
    tableHighlights: {
      en: [
        "Smoked Salmon Croissant",
        "Golden Pastries & Farm Honey",
        "Specialty Latte & Fresh Orange",
      ],
      ar: [
        "كرواسون سلمون مدخن طازج",
        "مخبوزات فرنسية وعسل نحل",
        "كابتشينو مختص وعصير فريش",
      ],
    },
    image: "/media/menu/times/morning-nile-table.jpg",
    targetCategory: "breakfast",
  },
  {
    id: "afternoon",
    number: "02",
    icon: "sun",
    skyStateBadge: {
      en: "Full Daylight · Clear Cairo Sky & River Breeze",
      ar: "عز النهار · سماء صافية ونسيم النيل",
    },
    periodName: { en: "Afternoon", ar: "الظهيرة" },
    timeWindow: { en: "12:00 PM – 5:00 PM", ar: "12:00 ظ – 5:00 م" },
    venueTag: {
      en: "Waterfront Deck · Panoramic Nile & Cairo Tower View",
      ar: "تراس النيل · إطلالة مفتوحة على النهر وبرج القاهرة",
    },
    title: {
      en: "Sunlit Midday Lunch Beside Passing Riverboats",
      ar: "غداء النهار المشمس بمحاذاة مياه النيل",
    },
    subtitle: {
      en: "Under a clear blue daytime sky overlooking the Nile and Cairo Tower, gather around wood-fired artisanal pizza, fresh rocca & avocado salad, and ice-cold refreshments.",
      ar: "في قلب النهار الصافي وأمام مياه النيل الفيروزية وبرج القاهرة، استمتع بالبيتزا الإيطالية المخبوزة طازجة، سلطة الجرجير بالأفوكادو، والمشروبات المثلجة.",
    },
    tableHighlights: {
      en: [
        "Artisanal Wood-Fired Pizza",
        "Rocca & Creamy Avocado Salad",
        "Iced Orange Espresso & Kiwi Cooler",
      ],
      ar: [
        "بيتزا إيطالية مخبوزة طازجة",
        "سلطة جرجير بالأفوكادو الطازج",
        "أمريكانو برتقال وموكتيل كيوي مثلج",
      ],
    },
    image: "/media/menu/times/afternoon-nile-table.jpg",
    targetCategory: "pizza-pasta",
  },
  {
    id: "sunset",
    number: "03",
    icon: "sunset",
    skyStateBadge: {
      en: "Golden Hour · Warm Sunset Reflections on Water",
      ar: "ساعة الغروب · انعكاس الشمس الذهبي على النيل",
    },
    periodName: { en: "Sunset", ar: "الغروب" },
    timeWindow: { en: "5:00 PM – 8:00 PM", ar: "5:00 م – 8:00 م" },
    venueTag: {
      en: "Open-Air Boat Deck & Private Yacht Horizon",
      ar: "سطح المركب المفتوح وإطلالة الغروب",
    },
    title: {
      en: "Golden-Hour Charcoal Grills & Sunset Mocktails",
      ar: "مشاوي الفحم وموكتيلات الغروب في الساعة الذهبية",
    },
    subtitle: {
      en: "As the Cairo sky turns warm amber and bronze over the rippling Nile beside your table, savor house-marinated charcoal mixed grills and glowing sunset mocktails.",
      ar: "مع تحول السماء للون الذهبي الدافئ وانعكاس الغروب على صفحة النيل بجوار طاولتك، تُقدّم تشكيلة مشاوي كافو على الفحم الحي مع موكتيلات الغروب المنعشة.",
    },
    tableHighlights: {
      en: [
        "Charcoal Lamb Chops & Mixed Grills",
        "Warm Baladi Bread & Oriental Dips",
        "Signature Sunset Citrus Mocktails",
      ],
      ar: [
        "ريش ضأن ومشاوي كافو على الفحم",
        "مقبلات شرقية وخبز ساخن",
        "موكتيلات الغروب المنعشة",
      ],
    },
    image: "/media/menu/times/sunset-nile-table.jpg",
    targetCategory: "grills",
  },
  {
    id: "night",
    number: "04",
    icon: "moon",
    skyStateBadge: {
      en: "After Dark · Shimmering Cairo Lights on the Night Nile",
      ar: "سحر الليل · أضواء القاهرة تتلألأ على النيل",
    },
    periodName: { en: "Night", ar: "الليل" },
    timeWindow: { en: "8:00 PM – 4:00 AM", ar: "8:00 م – 4:00 فجراً" },
    venueTag: {
      en: "CAVO Elite & Late-Night Riverfront Tables",
      ar: "كافو إيليت وطاولات السهر على النيل",
    },
    title: {
      en: "Intimate Lamp-Lit Dinner Under Cairo's Night Skyline",
      ar: "عشاء وسهر ليلي على أضواء النيل حتى الرابعة فجراً",
    },
    subtitle: {
      en: "Warm bronze table lamps illuminate your waterside table against the dark Nile shimmering with golden city lights—featuring fine main courses, Italian tiramisu, and fresh mojito mocktails.",
      ar: "أباجورات الطاولات النحاسية الدافئة تضيء جلستك أمام النيل ليلاً مع انعكاس أضواء القاهرة الساحرة، أطباق العشاء الفاخرة، التيراميسو الإيطالي، وموكتيلات السهر.",
    },
    tableHighlights: {
      en: [
        "Gourmet Night Dinner & Tajins",
        "Classic Italian Mascarpone Tiramisu",
        "Fresh Berry & Mint Mojito Mocktails",
      ],
      ar: [
        "أطباق العشاء الفاخرة والطواجن",
        "تيراميسو الماسكاربوني الإيطالي",
        "موكتيل التوت والموهيتو الفريش",
      ],
    },
    image: "/media/menu/times/night-nile-table.jpg",
    targetCategory: "desserts",
  },
];

const categoryEditorialMeta: Record<
  MenuCategoryId | "all",
  {
    thumb: string;
    chefNote: Record<Locale, string>;
    recommendedVenue: Record<Locale, string>;
    venueSlug: VenueSlug;
  }
> = {
  all: {
    thumb: "/media/menu/dishes/cavo-mixed-grills.jpg",
    chefNote: {
      en: "Curated highlights from our 378+ item kitchen archive—prepared fresh daily from 8:00 AM until 4:00 AM.",
      ar: "مختارات الشيف من أرشيف مطبخ كافو (+378 صنف) — تُحضّر طازجة يومياً من 8 صباحاً حتى 4 فجراً.",
    },
    recommendedVenue: {
      en: "Served across all 4 CAVO Nile venues",
      ar: "متاح في تجارب كافو الأربع على النيل",
    },
    venueSlug: "main-restaurant",
  },
  breakfast: {
    thumb: "/media/menu/dishes/salmon-croissant.jpg",
    chefNote: {
      en: "Freshly baked croissants, farm clotted cream feteer, and hearty breakfast spreads by the morning Nile.",
      ar: "كرواسون فرنسي مخبوز بالزبدة، فطير مشلتت بالقشطة والعسل، وفطار متكامل تحت شمس النيل.",
    },
    recommendedVenue: {
      en: "Main Restaurant (Morning Sun)",
      ar: "المطعم الرئيسي (شمس الصباح)",
    },
    venueSlug: "main-restaurant",
  },
  "soups-salads": {
    thumb: "/media/menu/dishes/rocca-avocado.jpg",
    chefNote: {
      en: "Crisp baby greens, creamy avocado, aged balsamic reductions, and slow-simmered traditional broths.",
      ar: "خضروات طازجة مع الأفوكادو وصوص البلسميك المعتق، وشوربات مصرية غنية مطهية بعناية.",
    },
    recommendedVenue: {
      en: "Main Restaurant & Private Yacht",
      ar: "المطعم الرئيسي واليخت الخاص",
    },
    venueSlug: "main-restaurant",
  },
  appetizers: {
    thumb: "/media/menu/dishes/muhammara.jpg",
    chefNote: {
      en: "Cold and hot Levantine & Egyptian mezze crafted for sharing around the table before your main course.",
      ar: "مقبلات باردة وساخنة من المطبخ المصري والشامي مثالية للمشاركة وسط الطاولة.",
    },
    recommendedVenue: {
      en: "Main Restaurant & Open-Air Boat",
      ar: "المطعم الرئيسي والمركب المفتوح",
    },
    venueSlug: "boat",
  },
  "tajins-mains": {
    thumb: "/media/menu/dishes/rice-meammar-meat.jpg",
    chefNote: {
      en: "Oven-bubbled Egyptian rice meammar with buffalo cream alongside contemporary glazed poultry & beef.",
      ar: "طواجن الأرز المعمر بالقشطة والسمن البلدي إلى جانب الأطباق الرئيسية بلمسة شيف كافو.",
    },
    recommendedVenue: {
      en: "Main Restaurant & CAVO Elite",
      ar: "المطعم الرئيسي وكافو إيليت",
    },
    venueSlug: "elite",
  },
  grills: {
    thumb: "/media/menu/dishes/cavo-mixed-grills.jpg",
    chefNote: {
      en: "Prime cuts of kebab, kofta, tarab, lamb chops, and shish tawook grilled to order over live charcoal.",
      ar: "تشكيلة فاخرة من الكباب، الكفتة، الطرب، والريش الضأن المشوية على الفحم الحي لحظة الطلب.",
    },
    recommendedVenue: {
      en: "Main Restaurant, Yacht & Elite",
      ar: "المطعم، اليخت، وإيليت",
    },
    venueSlug: "private-yacht",
  },
  "pizza-pasta": {
    thumb: "/media/menu/dishes/penne-alfredo.jpg",
    chefNote: {
      en: "Blistered artisanal crusts, rich Italian ragu, velvety parmesan alfredo, and gourmet sandwiches.",
      ar: "عجينة بيتزا إيطالية مخبوزة طازجة، صوصات باستا غنية بالبارميزان، وسندويشات كافو المميزة.",
    },
    recommendedVenue: {
      en: "Main Restaurant & Open-Air Boat",
      ar: "المطعم الرئيسي والمركب",
    },
    venueSlug: "boat",
  },
  desserts: {
    thumb: "/media/menu/dishes/tiramisu.png",
    chefNote: {
      en: "Table-poured warm chocolate tsunami cake, authentic mascarpone tiramisu, and golden Belgian waffles.",
      ar: "تيراميسو الماسكاربوني الإيطالي، كيك تسونامي الغارق بالشوكولاتة الدافئة، والوافل البلجيكي.",
    },
    recommendedVenue: {
      en: "Open-Air Boat & CAVO Elite",
      ar: "المركب المفتوح وكافو إيليت",
    },
    venueSlug: "boat",
  },
  drinks: {
    thumb: "/media/menu/dishes/cucumber-kiwi.jpg",
    chefNote: {
      en: "170+ specialty coffees, ceremonial matcha, tropical Nile-sunset mocktails, and 100% fresh juices.",
      ar: "أكثر من 170 مشروباً من القهوة المختصة، الماتشا، موكتيلات الغروب، والعصائر الفريش.",
    },
    recommendedVenue: {
      en: "Open-Air Boat & Morning Terrace",
      ar: "سطح المركب وتراس الصباح",
    },
    venueSlug: "boat",
  },
  shisha: {
    thumb: "/media/venues/boat/nile-deck-night.jpg",
    chefNote: {
      en: "Signature riverside blends with dedicated charcoal service designed for open-air Nile evenings.",
      ar: "خلطات كافو الخاصة مع خدمة فحم متواصلة لسهرات الهواء الطلق على ضفاف النيل.",
    },
    recommendedVenue: {
      en: "Open-Air Boat & Late-Night Lounge",
      ar: "المركب المفتوح وسهرات الليل",
    },
    venueSlug: "boat",
  },
};

type SortOption = "featured" | "price-asc" | "price-desc";
type ViewMode = "grid" | "list";

const ITEMS_PER_PAGE = 6;

export function MenuExplorer({ locale }: { locale: Locale }) {
  const isAr = locale === "ar";

  // 4 Times of Day Hero State (Morning, Afternoon, Sunset, Night)
  const [activeTimeIdx, setActiveTimeIdx] = useState(0);
  const [heroLightboxOpen, setHeroLightboxOpen] = useState(false);

  // Filter, Search, View & Tax Mode State
  const [selectedCategory, setSelectedCategory] = useState<MenuCategoryId | "all">("all");
  const [selectedTag, setSelectedTag] = useState<DietaryTag | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("featured");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [showTaxInclusive, setShowTaxInclusive] = useState(false);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [showAllPages, setShowAllPages] = useState(false);

  // Bill Estimator Drawer & Split State
  const [estimateQty, setEstimateQty] = useState<Record<string, number>>({});
  const [billDrawerOpen, setBillDrawerOpen] = useState(false);
  const [splitCount, setSplitCount] = useState(2);

  // Dish Quick-View Modal State
  const [quickViewDish, setQuickViewDish] = useState<MenuItem | null>(null);

  const currentTimeChapter =
    nileTableTimeChapters[activeTimeIdx % nileTableTimeChapters.length] ??
    nileTableTimeChapters[0];

  // Reset pagination to page 1 whenever filters/search/category change
  useEffect(() => {
    setCurrentPage(1);
    setShowAllPages(false);
  }, [selectedCategory, selectedTag, searchQuery, sortBy]);

  const filteredItems = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    const list = menuItems.filter((item) => {
      if (selectedCategory !== "all" && item.category !== selectedCategory) {
        return false;
      }
      if (selectedTag !== "all" && !item.tags.includes(selectedTag)) {
        return false;
      }
      if (q) {
        const haystack = [
          item.name.en,
          item.name.ar,
          item.description.en,
          item.description.ar,
        ]
          .join(" ")
          .toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      return true;
    });

    if (sortBy === "price-asc") {
      return [...list].sort((a, b) => a.priceEgp - b.priceEgp);
    }
    if (sortBy === "price-desc") {
      return [...list].sort((a, b) => b.priceEgp - a.priceEgp);
    }
    return [...list].sort(
      (a, b) => Number(Boolean(b.featured)) - Number(Boolean(a.featured))
    );
  }, [selectedCategory, selectedTag, searchQuery, sortBy]);

  const totalPages = Math.max(1, Math.ceil(filteredItems.length / ITEMS_PER_PAGE));
  const safePage = Math.min(currentPage, totalPages);

  const paginatedItems = useMemo(() => {
    if (showAllPages) return filteredItems;
    const start = (safePage - 1) * ITEMS_PER_PAGE;
    return filteredItems.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredItems, safePage, showAllPages]);

  const estimateItems = useMemo(() => {
    return Object.entries(estimateQty)
      .filter(([, qty]) => qty > 0)
      .map(([id, qty]) => {
        const item = menuItems.find((m) => m.id === id);
        return item ? { item, qty } : null;
      })
      .filter((entry): entry is { item: MenuItem; qty: number } => entry !== null);
  }, [estimateQty]);

  const totalCount = estimateItems.reduce((sum, e) => sum + e.qty, 0);
  const rawSubtotal = estimateItems.reduce(
    (sum, e) => sum + e.item.priceEgp * e.qty,
    0
  );
  const bill = calculateMenuBillEstimate(rawSubtotal);
  const perPersonEstimate =
    splitCount > 1
      ? Math.round(bill.estimatedTotal / splitCount)
      : bill.estimatedTotal;

  const updateQty = (id: string, delta: number) => {
    trackCavoEvent("menu_item_interaction", { itemId: id, delta });
    setEstimateQty((prev) => {
      const next = Math.max(0, (prev[id] ?? 0) + delta);
      if (next === 0) {
        const copy = { ...prev };
        delete copy[id];
        return copy;
      }
      return { ...prev, [id]: next };
    });
  };

  const resetAllFilters = () => {
    setSelectedCategory("all");
    setSelectedTag("all");
    setSearchQuery("");
    setSortBy("featured");
  };

  const goToPage = (page: number) => {
    const target = Math.max(1, Math.min(totalPages, page));
    setCurrentPage(target);
    const el = document.getElementById("cavo-menu-command-bar");
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const activeCategoryMeta = categoryEditorialMeta[selectedCategory];

  const getCategoryLabel = (catId: MenuCategoryId) =>
    menuCategories.find((c) => c.id === catId)?.label[locale] ?? "";

  const formatDisplayPrice = (basePriceEgp: number) => {
    if (!showTaxInclusive) return basePriceEgp;
    return calculateMenuBillEstimate(basePriceEgp).estimatedTotal;
  };

  const whatsappEstimateText = useMemo(() => {
    if (estimateItems.length === 0) return "";
    const lines = estimateItems.map(
      ({ item, qty }) =>
        `• ${qty}x ${item.name[locale]} (${(
          item.priceEgp * qty
        ).toLocaleString()} ${isAr ? "ج.م" : "EGP"})`
    );
    return isAr
      ? `مرحباً كافو آيلاند، أرغب في حجز طاولة وهذه قائمتي المختارة من المنيو:\n${lines.join(
          "\n"
        )}\nالإجمالي التقديري (شامل 12% خدمة و14% ضريبة): ${bill.estimatedTotal.toLocaleString()} ج.م`
      : `Hello CAVO Island, I would like to reserve a table with my pre-selected menu estimate:\n${lines.join(
          "\n"
        )}\nEstimated Total (incl. 12% service & 14% VAT): ${bill.estimatedTotal.toLocaleString()} EGP`;
  }, [estimateItems, bill.estimatedTotal, isAr, locale]);

  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-[#f5f2ec] via-[#efeae1] to-[#f6f3ee] pt-20 pb-28 text-[var(--cavo-ink)] sm:pt-24 sm:pb-32">
      {/* Subtle Ambient Sunlit Riviera Glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 start-1/3 h-96 w-96 rounded-full opacity-45 blur-3xl"
        style={{
          background:
            "radial-gradient(circle, rgba(196,169,132,0.28) 0%, transparent 70%)",
        }}
      />

      <div className="relative z-10 mx-auto max-w-7xl space-y-6 px-3.5 sm:space-y-10 sm:px-6">
        {/* SECTION 01 — FOUR TIMES OF DAY AT THE NILE TABLE HERO (ZERO PRICES · BALANCED 12-COL HEADER) */}
        <section>
          {/* Balanced 12-Column Editorial Header — Zero Empty Space on Desktop or Mobile */}
          <div className="mb-4 grid grid-cols-1 items-end gap-4 sm:mb-6 lg:grid-cols-12 lg:gap-6">
            {/* Left 7 Cols: Compact Breadcrumb + Eyebrow + Headline + Subtitle */}
            <div className="cavo-rise min-w-0 space-y-2 lg:col-span-7">
              <div className="flex flex-wrap items-center gap-2">
                <Breadcrumbs
                  locale={locale}
                  items={[{ label: isAr ? "المنيو التفاعلي" : "Interactive Menu" }]}
                />
                <span className="text-[var(--cavo-border)]">·</span>
                <div className="inline-flex items-center gap-1.5 rounded-full border border-[var(--cavo-border)] bg-[#f8f6f2] px-3 py-0.5 text-[10px] font-semibold text-[var(--cavo-gold-deep)] shadow-sm sm:text-[11px]">
                  <Sparkles className="h-3 w-3 shrink-0 text-[var(--cavo-gold)]" />
                  <span className={isAr ? "" : "editorial-eyebrow-en"}>
                    {isAr
                      ? "أربع أوقات على طاولتك أمام النيل"
                      : "FOUR HOURS AT YOUR NILE TABLE"}
                  </span>
                </div>
              </div>

              <h1 className="font-display text-2xl font-semibold leading-[1.15] text-[var(--cavo-ink)] sm:text-4xl lg:text-[44px]">
                {isAr ? (
                  <>
                    من شمس الصباح لأضواء الليل،{" "}
                    <span className="cavo-gold-text">
                      طاولتك على النيل ليها طعم تاني.
                    </span>
                  </>
                ) : (
                  <>
                    From Morning Sun to Night Lights,{" "}
                    <span className="cavo-gold-text italic">
                      Every Hour Has Its Taste.
                    </span>
                  </>
                )}
              </h1>

              <p className="max-w-2xl break-words text-xs leading-relaxed text-[var(--cavo-smoke)] sm:text-sm">
                {isAr
                  ? "شوف شكل قعدتك وأطباقك على الترابيزة قدام النيل مباشرة في أربع أوقات مختلفة (الصباح · الظهيرة · الغروب · الليل)، وبعدها استكشف المنيو الكامل بالأسفل."
                  : "Preview your waterside table across four moments of the day—bright morning sunshine, midday river breeze, golden sunset, and shimmering night lights."}
              </p>
            </div>

            {/* Right 5 Cols: Architectural Culinary At-A-Glance Dock (Fills the Right Side with Luxury Balance!) */}
            <div className="min-w-0 lg:col-span-5">
              <div className="rounded-[22px] border border-[var(--cavo-gold)]/35 bg-[#f8f6f2] p-3 shadow-[0_14px_34px_-16px_rgba(70,54,36,0.14)] sm:rounded-[26px] sm:p-4">
                {/* 3 Stat Pillars Side-by-Side */}
                <div className="grid grid-cols-3 divide-x divide-[var(--cavo-border)] text-center rtl:divide-x-reverse">
                  <div className="px-2">
                    <p className="font-display text-xl font-bold text-[var(--cavo-gold-deep)] sm:text-2xl">
                      378+
                    </p>
                    <p className="text-[10px] font-semibold text-[var(--cavo-smoke)] sm:text-[11px]">
                      {isAr ? "صنف بالمنيو" : "Menu Creations"}
                    </p>
                  </div>
                  <div className="px-2">
                    <p className="font-display text-xl font-bold text-[var(--cavo-gold-deep)] sm:text-2xl">
                      09
                    </p>
                    <p className="text-[10px] font-semibold text-[var(--cavo-smoke)] sm:text-[11px]">
                      {isAr ? "فصول طهي" : "Menu Chapters"}
                    </p>
                  </div>
                  <div className="px-2">
                    <p className="font-display text-xl font-bold text-[var(--cavo-gold-deep)] sm:text-2xl">
                      8–4
                    </p>
                    <p className="text-[10px] font-semibold text-[var(--cavo-smoke)] sm:text-[11px]">
                      {isAr ? "8 ص – 4 فجراً" : "8 AM – 4 AM"}
                    </p>
                  </div>
                </div>

                {/* 4-Hour Interactive Time Switcher Strip Inside Right Dock */}
                <div
                  className="mt-3 grid grid-cols-4 gap-1 rounded-xl border border-[var(--cavo-border)] bg-[#f1ede6] p-1"
                  role="tablist"
                  aria-label={
                    isAr ? "تبديل وقت اليوم" : "Time of Day Quick Switcher"
                  }
                >
                  {nileTableTimeChapters.map((chapter, idx) => {
                    const active = idx === activeTimeIdx;
                    const TabIcon =
                      chapter.icon === "sunrise"
                        ? Sunrise
                        : chapter.icon === "sun"
                        ? Sun
                        : chapter.icon === "sunset"
                        ? Sunset
                        : Moon;

                    return (
                      <button
                        key={chapter.id}
                        type="button"
                        role="tab"
                        aria-selected={active}
                        onClick={() => setActiveTimeIdx(idx)}
                        className={`relative flex items-center justify-center gap-1 rounded-lg py-1.5 text-[11px] font-semibold transition-all duration-300 ${
                          active
                            ? "cavo-gold-gradient text-white shadow-sm"
                            : "text-[var(--cavo-ink)]/80 hover:text-[var(--cavo-gold-deep)]"
                        }`}
                      >
                        <TabIcon className="relative z-10 h-3 w-3 shrink-0" />
                        <span className="relative z-10 truncate">
                          {chapter.periodName[locale]}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Hero Pavilion: Clean Mobile Photo Frame + 4 Visual Time-of-Day Cards (ZERO PRICES) */}
          <div className="overflow-hidden rounded-[24px] border border-[var(--cavo-gold)]/45 bg-[#f8f6f2] p-2.5 shadow-[0_26px_70px_-22px_rgba(70,54,36,0.22)] sm:rounded-[36px] sm:p-5">
            <div className="grid grid-cols-1 items-stretch gap-4 lg:grid-cols-12 lg:gap-6">
              {/* Left 7 Cols: Panoramic Nile-Table Stage */}
              <div className="flex min-w-0 flex-col justify-between lg:col-span-7">
                {/* Photo Stage — Stacked Crossfade + Ken Burns Drift */}
                <div className="relative flex aspect-[4/3] w-full flex-col justify-between overflow-hidden rounded-[18px] bg-[#1e1711] sm:aspect-[16/10] sm:rounded-[26px] lg:h-full lg:min-h-[440px]">
                  {nileTableTimeChapters.map((chapter, idx) => {
                    const isActive = idx === activeTimeIdx;
                    return (
                      <div
                        key={chapter.id}
                        aria-hidden={!isActive}
                        className={`absolute inset-0 transition-opacity duration-700 ease-out ${
                          isActive
                            ? "z-0 opacity-100"
                            : "pointer-events-none z-0 opacity-0"
                        }`}
                      >
                        <div
                          key={isActive ? `${chapter.id}-ken` : chapter.id}
                          className={
                            isActive
                              ? "cavo-ken-burns relative h-full w-full"
                              : "relative h-full w-full"
                          }
                        >
                          <Image
                            src={chapter.image}
                            alt={chapter.title[locale]}
                            fill
                            priority={idx === 0}
                            sizes="(max-width: 1024px) 100vw, 58vw"
                            className="object-cover"
                          />
                        </div>
                      </div>
                    );
                  })}

                  {/* Soft gradient only at top/bottom edges so center Nile view is crystal clear */}
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#1f1710]/85 via-transparent to-[#1f1710]/30" />

                  {/* Top Badges on Image */}
                  <div className="relative z-10 flex items-center justify-between gap-2 p-2.5 sm:p-4">
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-white/50 bg-[#f6f3ee]/95 px-2.5 py-1 text-[10px] font-bold text-[var(--cavo-gold-deep)] shadow-sm backdrop-blur-md sm:px-3.5 sm:text-xs">
                      {currentTimeChapter.icon === "sunrise" && (
                        <Sunrise className="h-3.5 w-3.5 shrink-0 text-[var(--cavo-gold)]" />
                      )}
                      {currentTimeChapter.icon === "sun" && (
                        <Sun className="h-3.5 w-3.5 shrink-0 text-[var(--cavo-gold)]" />
                      )}
                      {currentTimeChapter.icon === "sunset" && (
                        <Sunset className="h-3.5 w-3.5 shrink-0 text-[var(--cavo-gold)]" />
                      )}
                      {currentTimeChapter.icon === "moon" && (
                        <Moon className="h-3.5 w-3.5 shrink-0 text-[var(--cavo-gold)]" />
                      )}
                      <span className="truncate">
                        {currentTimeChapter.skyStateBadge[locale]}
                      </span>
                    </span>

                    <button
                      type="button"
                      onClick={() => setHeroLightboxOpen(true)}
                      aria-label={isAr ? "تكبير المشهد" : "Expand scene"}
                      className="inline-flex shrink-0 items-center gap-1 rounded-full border border-white/40 bg-[#f6f3ee]/90 px-2.5 py-1 text-[10px] font-semibold text-[var(--cavo-ink)] shadow-sm backdrop-blur-md transition hover:bg-[var(--cavo-gold)] hover:text-white sm:px-3 sm:text-[11px]"
                    >
                      <Maximize2 className="h-3 w-3" />
                      <span className="hidden sm:inline">
                        {isAr ? "تكبير الصورة" : "Fullscreen"}
                      </span>
                    </button>
                  </div>

                  {/* Prev / Next Arrows */}
                  <div className="relative z-10 flex items-center justify-between px-2.5 sm:px-3">
                    <button
                      type="button"
                      onClick={() =>
                        setActiveTimeIdx(
                          (prev) =>
                            (prev - 1 + nileTableTimeChapters.length) %
                            nileTableTimeChapters.length
                        )
                      }
                      aria-label={isAr ? "الوقت السابق" : "Previous time"}
                      className="flex h-8 w-8 items-center justify-center rounded-full border border-white/40 bg-[#261e16]/60 text-white backdrop-blur-md transition hover:scale-105 hover:bg-[var(--cavo-gold)] sm:h-9 sm:w-9"
                    >
                      <ChevronLeft className="h-4 w-4 rtl:rotate-180" />
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        setActiveTimeIdx(
                          (prev) => (prev + 1) % nileTableTimeChapters.length
                        )
                      }
                      aria-label={isAr ? "الوقت التالي" : "Next time"}
                      className="flex h-8 w-8 items-center justify-center rounded-full border border-white/40 bg-[#261e16]/60 text-white backdrop-blur-md transition hover:scale-105 hover:bg-[var(--cavo-gold)] sm:h-9 sm:w-9"
                    >
                      <ChevronRight className="h-4 w-4 rtl:rotate-180" />
                    </button>
                  </div>

                  {/* Bottom Caption Inside Image (Clean & Uncluttered on Mobile) */}
                  <div className="relative z-10 p-3 sm:p-5">
                    <div className="flex flex-wrap items-center gap-1.5 text-[10px] font-semibold text-[#f0e4d3] sm:text-xs">
                      <span className="rounded-full bg-white/20 px-2.5 py-0.5 backdrop-blur-sm">
                        {currentTimeChapter.number} ·{" "}
                        {currentTimeChapter.periodName[locale]}
                      </span>
                      <span className="rounded-full bg-[#241c14]/70 px-2.5 py-0.5 font-mono text-[#e8d8c3] backdrop-blur-sm">
                        {currentTimeChapter.timeWindow[locale]}
                      </span>
                    </div>

                    <h2 className="font-display mt-1.5 text-lg font-semibold leading-snug text-white drop-shadow-sm sm:text-3xl">
                      {currentTimeChapter.title[locale]}
                    </h2>

                    <p className="mt-1 hidden text-xs leading-relaxed text-[#ece4d8]/90 sm:line-clamp-2 sm:block sm:text-sm">
                      {currentTimeChapter.subtitle[locale]}
                    </p>

                    {/* Table Highlights Pills on Desktop */}
                    <div className="mt-2.5 hidden flex-wrap items-center gap-1.5 sm:flex">
                      {currentTimeChapter.tableHighlights[locale].map((item) => (
                        <span
                          key={item}
                          className="inline-flex items-center gap-1 rounded-full border border-white/30 bg-[#261e16]/70 px-2.5 py-1 text-[11px] font-medium text-[#f5ece0] backdrop-blur-md"
                        >
                          <Sparkles className="h-2.5 w-2.5 text-[var(--cavo-gold-light)]" />
                          <span>{item}</span>
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Mobile-Only Clean Narrative & Highlights Strip Below Photo (Prevents covering the photo on mobile!) */}
                <div className="mt-2.5 rounded-2xl border border-[var(--cavo-border)] bg-[#f3efe8] p-3 sm:hidden">
                  <p className="text-[11px] leading-relaxed text-[var(--cavo-smoke)]">
                    {currentTimeChapter.subtitle[locale]}
                  </p>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {currentTimeChapter.tableHighlights[locale].map((item) => (
                      <span
                        key={item}
                        className="inline-flex items-center gap-1 rounded-full border border-[var(--cavo-border)] bg-[#f8f6f2] px-2.5 py-0.5 text-[10px] font-semibold text-[var(--cavo-gold-deep)]"
                      >
                        <Sparkles className="h-2.5 w-2.5 text-[var(--cavo-gold)]" />
                        <span>{item}</span>
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right 5 Cols: 2x2 Visual Grid of All 4 Times of Day + Quick Action */}
              <div className="flex min-w-0 flex-col justify-between gap-3.5 lg:col-span-5">
                <div>
                  <div className="mb-2.5 flex items-center justify-between px-0.5">
                    <span className="text-[11px] font-bold text-[var(--cavo-gold-deep)] sm:text-xs">
                      {isAr
                        ? "اختار التوقيت عشان تشوف شكل الترابيزة والنيل:"
                        : "Tap Any Hour to Preview Your Nile Table:"}
                    </span>
                    <span className="font-mono text-[11px] font-bold text-[var(--cavo-gold-deep)]">
                      0{activeTimeIdx + 1} / 04
                    </span>
                  </div>

                  {/* 2x2 Visual Cards of Morning, Afternoon, Sunset, Night */}
                  <div className="grid grid-cols-2 gap-2 sm:gap-3">
                    {nileTableTimeChapters.map((chapter, idx) => {
                      const isCurrent = idx === activeTimeIdx;
                      return (
                        <button
                          key={chapter.id}
                          type="button"
                          onClick={() => setActiveTimeIdx(idx)}
                          className={`group relative flex flex-col overflow-hidden rounded-[16px] border p-1.5 text-start transition-all duration-300 sm:rounded-[22px] sm:p-2 ${
                            isCurrent
                              ? "border-[var(--cavo-gold)] bg-[#efe7db] shadow-[0_12px_28px_-10px_rgba(117,93,67,0.35)] ring-1 ring-[var(--cavo-gold)]"
                              : "border-[var(--cavo-border)] bg-[#f3efe8] opacity-80 hover:-translate-y-0.5 hover:border-[var(--cavo-gold)]/60 hover:opacity-100"
                          }`}
                        >
                          <div className="relative aspect-[16/10] w-full overflow-hidden rounded-[12px] bg-[var(--cavo-stone)] sm:rounded-[15px]">
                            <Image
                              src={chapter.image}
                              alt={chapter.title[locale]}
                              fill
                              sizes="(max-width: 1024px) 45vw, 22vw"
                              className="object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#221a12]/80 via-transparent to-transparent" />

                            <span
                              className={`absolute start-1.5 top-1.5 inline-flex items-center gap-1 rounded-full px-2 py-0.5 font-mono text-[9px] font-bold shadow-sm sm:text-[10px] ${
                                isCurrent
                                  ? "bg-[var(--cavo-gold)] text-white"
                                  : "bg-[#f6f3ee]/95 text-[var(--cavo-gold-deep)]"
                              }`}
                            >
                              {chapter.number} · {chapter.periodName[locale]}
                            </span>

                            <span className="absolute inset-x-2 bottom-1 truncate font-mono text-[9px] font-medium text-[#f3e9d9] sm:text-[10px]">
                              {chapter.timeWindow[locale]}
                            </span>
                          </div>

                          <div className="mt-1.5 px-1 pb-0.5">
                            <p className="line-clamp-1 text-[11px] font-bold text-[var(--cavo-ink)] sm:text-xs">
                              {chapter.venueTag[locale]}
                            </p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Action Box: Jump to This Hour's Menu or Open Bill Calculator */}
                <div className="rounded-2xl border border-[var(--cavo-border)] bg-[#f1ede6] p-3 sm:p-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-xs font-bold text-[var(--cavo-ink)]">
                      {isAr
                        ? `أطباق ${currentTimeChapter.periodName.ar} على النيل`
                        : `${currentTimeChapter.periodName.en} Nile Menu`}
                    </span>
                    <span className="text-[11px] font-medium text-[var(--cavo-gold-deep)]">
                      {currentTimeChapter.venueTag[locale]}
                    </span>
                  </div>

                  <div className="mt-2.5 flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedCategory(currentTimeChapter.targetCategory);
                        const el = document.getElementById(
                          "cavo-menu-command-bar"
                        );
                        if (el) {
                          el.scrollIntoView({
                            behavior: "smooth",
                            block: "start",
                          });
                        }
                      }}
                      className="cavo-btn-gold inline-flex flex-1 items-center justify-center gap-1.5 rounded-full px-4 py-2.5 text-xs font-semibold"
                    >
                      <UtensilsCrossed className="h-3.5 w-3.5" />
                      <span>
                        {isAr
                          ? `استعرض منيو ${currentTimeChapter.periodName.ar}`
                          : `Filter ${currentTimeChapter.periodName.en} Menu`}
                      </span>
                    </button>

                    <Link
                      href={localePath(locale, "book")}
                      className="cavo-btn-pearl inline-flex items-center justify-center gap-1.5 rounded-full px-4 py-2.5 text-xs font-semibold"
                    >
                      <span>{isAr ? "احجز طاولتك" : "Book Table"}</span>
                      <ArrowRight className="h-3.5 w-3.5 rtl:rotate-180" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 02 — STREAMLINED INTERACTIVE COMMAND BAR (VISUAL PHOTO CATEGORY RIBBON + LIVE TAX SWITCH + VIEW TOGGLE) */}
        <section
          id="cavo-menu-command-bar"
          aria-label={isAr ? "أدوات تصفية وبحث المنيو" : "Menu Search and Category Controls"}
          className="scroll-mt-24 rounded-[24px] border border-[var(--cavo-gold)]/35 bg-[#f8f6f2]/95 p-3.5 shadow-[0_20px_50px_-20px_rgba(70,54,36,0.16)] backdrop-blur-xl sm:rounded-[32px] sm:p-6"
        >
          {/* 1. Visual Photo-Thumbnail Category Ribbon (Single Horizontal Swipe Row on Mobile!) */}
          <div className="mb-4">
            <div className="mb-2.5 flex items-center justify-between px-1">
              <span className="text-xs font-bold text-[var(--cavo-gold-deep)]">
                {isAr
                  ? "فصول المنيو الـ 9 (اسحب واختر القسم):"
                  : "9 Culinary Chapters (Select a Category):"}
              </span>

              {(selectedCategory !== "all" ||
                selectedTag !== "all" ||
                searchQuery) && (
                <button
                  type="button"
                  onClick={resetAllFilters}
                  className="inline-flex items-center gap-1 rounded-full bg-[var(--cavo-gold-pale)] px-2.5 py-1 text-[11px] font-semibold text-[var(--cavo-gold-deep)] transition hover:bg-[var(--cavo-gold)] hover:text-white"
                >
                  <X className="h-3 w-3" />
                  <span>{isAr ? "عرض الكل" : "Reset"}</span>
                </button>
              )}
            </div>

            <div
              className="cavo-no-scrollbar flex gap-2 overflow-x-auto pb-2"
              role="tablist"
              aria-label={isAr ? "أقسام المنيو" : "Menu Categories"}
            >
              {/* "All Chapters" Visual Pill */}
              <button
                type="button"
                role="tab"
                aria-selected={selectedCategory === "all"}
                onClick={() => setSelectedCategory("all")}
                className={`group relative flex shrink-0 items-center gap-2.5 rounded-full border p-1.5 pe-4 transition-all duration-300 ${
                  selectedCategory === "all"
                    ? "cavo-gold-gradient border-[var(--cavo-gold)] text-white shadow-md"
                    : "border-[var(--cavo-border)] bg-[#f1ede6] text-[var(--cavo-ink)] hover:border-[var(--cavo-gold)]"
                }`}
              >
                <span className="relative z-10 h-8 w-8 shrink-0 overflow-hidden rounded-full border border-white/50 bg-[var(--cavo-stone)]">
                  <Image
                    src={categoryEditorialMeta.all.thumb}
                    alt="All Categories"
                    fill
                    sizes="32px"
                    className="object-cover"
                  />
                </span>
                <span className="relative z-10 text-xs font-semibold">
                  {isAr ? "كل المختارات" : "All Highlights"}{" "}
                  <span className="font-mono text-[10px] opacity-80">
                    ({menuItems.length})
                  </span>
                </span>
              </button>

              {menuCategories.map((cat) => {
                const active = selectedCategory === cat.id;
                const meta = categoryEditorialMeta[cat.id];
                return (
                  <button
                    key={cat.id}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`group relative flex shrink-0 items-center gap-2.5 rounded-full border p-1.5 pe-4 transition-all duration-300 ${
                      active
                        ? "cavo-gold-gradient border-[var(--cavo-gold)] text-white shadow-md"
                        : "border-[var(--cavo-border)] bg-[#f1ede6] text-[var(--cavo-ink)] hover:border-[var(--cavo-gold)]"
                    }`}
                  >
                    <span className="relative z-10 h-8 w-8 shrink-0 overflow-hidden rounded-full border border-white/50 bg-[var(--cavo-stone)]">
                      <Image
                        src={meta.thumb}
                        alt={cat.label[locale]}
                        fill
                        sizes="32px"
                        className="object-cover"
                      />
                    </span>
                    <span className="relative z-10 text-xs font-semibold">
                      {cat.label[locale]}{" "}
                      <span className="font-mono text-[10px] opacity-80">
                        ({cat.totalItemsInFullMenu})
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Search Input + Live Tax-Inclusive Price Switch + View Toggle (Grid / List) + Sort */}
          <div className="flex flex-col gap-3 border-t border-[var(--cavo-border)]/80 pt-3.5 lg:flex-row lg:items-center lg:justify-between">
            {/* Search Input */}
            <div className="relative flex-1 lg:max-w-sm">
              <Search className="pointer-events-none absolute start-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--cavo-gold-deep)]" />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                aria-label={isAr ? "ابحث في المنيو" : "Search menu dishes"}
                placeholder={
                  isAr
                    ? "ابحث باسم الطبق أو المكون (مشاوي، سلمون، ماتشا)..."
                    : "Search dish or ingredient (grills, salmon, matcha)..."
                }
                className="w-full rounded-full border border-[var(--cavo-border)] bg-[#f1ede6] py-2.5 ps-10 pe-9 text-xs font-medium text-[var(--cavo-ink)] placeholder:text-[var(--cavo-smoke)]/75 focus:border-[var(--cavo-gold)] focus:bg-white focus:outline-none sm:text-sm"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  aria-label={isAr ? "مسح البحث" : "Clear search"}
                  className="absolute end-3 top-1/2 -translate-y-1/2 rounded-full bg-[var(--cavo-stone)] p-1 text-[var(--cavo-ink)] hover:bg-[var(--cavo-gold)] hover:text-white"
                >
                  <X className="h-3 w-3" />
                </button>
              )}
            </div>

            {/* Interactive Controls Row: Live Tax Switch + Sort + Grid/List View Toggle */}
            <div className="flex flex-wrap items-center justify-between gap-2 sm:justify-end">
              {/* Live Tax-Inclusive Price Switch ("حركة عالمية") */}
              <button
                type="button"
                onClick={() => setShowTaxInclusive((prev) => !prev)}
                aria-pressed={showTaxInclusive}
                className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-[11px] font-semibold transition-all sm:text-xs ${
                  showTaxInclusive
                    ? "border-[var(--cavo-gold)] bg-[#282018] text-[#f5ece0] shadow-sm"
                    : "border-[var(--cavo-border)] bg-[#f1ede6] text-[var(--cavo-ink)] hover:border-[var(--cavo-gold)]"
                }`}
              >
                <span
                  className={`flex h-4 w-7 items-center rounded-full p-0.5 transition-colors ${
                    showTaxInclusive
                      ? "bg-[var(--cavo-gold)] justify-end"
                      : "bg-[var(--cavo-sand)] justify-start"
                  }`}
                >
                  <span className="h-3 w-3 rounded-full bg-white shadow-sm" />
                </span>
                <span>
                  {isAr
                    ? "عرض السعر شامل الخدمة والضريبة"
                    : "Show Net Price (Incl. Tax)"}
                </span>
              </button>

              <div className="flex items-center gap-1.5">
                {/* Sort Selector */}
                <div className="inline-flex items-center gap-1 rounded-full border border-[var(--cavo-border)] bg-[#f1ede6] px-2.5 py-1.5 text-[11px] sm:px-3 sm:text-xs">
                  <ArrowUpDown className="h-3 w-3 text-[var(--cavo-gold-deep)]" />
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as SortOption)}
                    aria-label={isAr ? "ترتيب الأطباق" : "Sort dishes"}
                    className="bg-transparent font-semibold text-[var(--cavo-ink)] focus:outline-none"
                  >
                    <option value="featured">
                      {isAr ? "الأبرز أولاً" : "Featured"}
                    </option>
                    <option value="price-asc">
                      {isAr ? "الأقل سعراً" : "Price: Low"}
                    </option>
                    <option value="price-desc">
                      {isAr ? "الأعلى سعراً" : "Price: High"}
                    </option>
                  </select>
                </div>

                {/* View Mode Toggle: Boutique Grid vs Classic Menu List */}
                <div
                  className="inline-flex rounded-full border border-[var(--cavo-border)] bg-[#f1ede6] p-0.5"
                  role="group"
                  aria-label={isAr ? "طريقة عرض المنيو" : "Menu View Mode"}
                >
                  <button
                    type="button"
                    onClick={() => setViewMode("grid")}
                    aria-label={isAr ? "عرض كروت الصور" : "Photo Grid View"}
                    className={`rounded-full p-1.5 transition ${
                      viewMode === "grid"
                        ? "bg-[var(--cavo-gold)] text-white shadow-sm"
                        : "text-[var(--cavo-smoke)] hover:text-[var(--cavo-ink)]"
                    }`}
                  >
                    <LayoutGrid className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode("list")}
                    aria-label={isAr ? "عرض قائمة كلاسيكية" : "Editorial List View"}
                    className={`rounded-full p-1.5 transition ${
                      viewMode === "list"
                        ? "bg-[var(--cavo-gold)] text-white shadow-sm"
                        : "text-[var(--cavo-smoke)] hover:text-[var(--cavo-ink)]"
                    }`}
                  >
                    <List className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* 3. Single-Row Horizontal Swipe Dietary Pills + Active Category Chef Note */}
          <div className="mt-3 flex flex-col justify-between gap-2.5 border-t border-[var(--cavo-border)]/60 pt-3 sm:flex-row sm:items-center">
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
              <button
                type="button"
                onClick={() => setSelectedTag("all")}
                className={`shrink-0 rounded-full border px-3 py-1 text-[11px] font-semibold transition-all ${
                  selectedTag === "all"
                    ? "border-[var(--cavo-gold)] bg-[var(--cavo-gold)] text-white shadow-sm"
                    : "border-[var(--cavo-border)] bg-[#f1ede6] text-[var(--cavo-ink)] hover:border-[var(--cavo-gold)]"
                }`}
              >
                {isAr ? "الكل" : "All"}
              </button>

              {(Object.keys(dietaryLabels) as DietaryTag[]).map((tag) => {
                const active = selectedTag === tag;
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => setSelectedTag(active ? "all" : tag)}
                    className={`inline-flex shrink-0 items-center gap-1 rounded-full border px-3 py-1 text-[11px] font-semibold transition-all ${
                      active
                        ? "border-[var(--cavo-gold)] bg-[var(--cavo-gold)] text-white shadow-sm"
                        : "border-[var(--cavo-border)] bg-[#f1ede6] text-[var(--cavo-ink)] hover:border-[var(--cavo-gold)]"
                    }`}
                  >
                    {tag === "signature" && (
                      <Sparkles
                        className={`h-2.5 w-2.5 ${
                          active ? "text-white" : "text-[var(--cavo-gold)]"
                        }`}
                      />
                    )}
                    <span>{dietaryLabels[tag][locale]}</span>
                  </button>
                );
              })}
            </div>

            <p className="truncate text-[11px] font-medium text-[var(--cavo-smoke)]">
              <span className="font-bold text-[var(--cavo-gold-deep)]">
                {activeCategoryMeta.recommendedVenue[locale]}
              </span>{" "}
              ·{" "}
              {showTaxInclusive
                ? isAr
                  ? "الأسعار المعروضة شاملة 12% خدمة و14% ضريبة"
                  : "Showing net prices incl. 12% service & 14% VAT"
                : siteConfig.taxBadgeShort[locale]}
            </p>
          </div>
        </section>

        {/* SECTION 03 — PAGINATED GASTRONOMY DISHES (GRID OR EDITORIAL LIST VIEW) */}
        <section aria-label={isAr ? "قائمة الأطباق" : "Dishes Showcase"}>
          {filteredItems.length === 0 ? (
            <div className="rounded-[26px] border border-[var(--cavo-border)] bg-[#f8f6f2] p-10 text-center shadow-sm">
              <Utensils className="mx-auto h-8 w-8 text-[var(--cavo-gold)]" />
              <p className="font-display mt-3 text-xl font-semibold text-[var(--cavo-ink)] sm:text-2xl">
                {isAr
                  ? "لم نجد طبقاً مطابقاً لهذا البحث في المختارات."
                  : "No matching dishes in our curated showcase."}
              </p>
              <p className="mt-1 text-xs text-[var(--cavo-smoke)] sm:text-sm">
                {isAr
                  ? "جرّب كلمة أخرى أو افتح منيو الطاولة الكامل (378 صنف)."
                  : "Try another term or open our full 378-item digital menu."}
              </p>
              <div className="mt-4 flex flex-wrap items-center justify-center gap-2.5">
                <button
                  type="button"
                  onClick={resetAllFilters}
                  className="cavo-btn-gold rounded-full px-5 py-2.5 text-xs font-semibold"
                >
                  {isAr ? "إعادة عرض كل الأطباق" : "Show All Dishes"}
                </button>
                <a
                  href={siteConfig.masterQrMenuUrl[locale]}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="cavo-btn-pearl inline-flex items-center gap-1.5 rounded-full px-5 py-2.5 text-xs font-semibold"
                >
                  <span>
                    {isAr ? "منيو الـ 378 صنفاً" : "Full 378-Item Menu"}
                  </span>
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </div>
            </div>
          ) : (
            <>
              {viewMode === "grid" ? (
                <div
                  key={`grid-${selectedCategory}-${selectedTag}-${sortBy}-${safePage}-${showAllPages}`}
                  className="cavo-swap-in grid grid-cols-2 gap-2.5 sm:gap-5 md:grid-cols-3 lg:gap-6"
                >
                  {paginatedItems.map((item) => {
                    const qty = estimateQty[item.id] ?? 0;
                    const displayedPrice = formatDisplayPrice(item.priceEgp);
                    const isSignature = item.tags.includes("signature");

                    return (
                      <article
                        key={item.id}
                        className={`cavo-sheen-card group relative flex min-w-0 flex-col overflow-hidden rounded-[20px] border bg-[#f8f6f2] p-2 shadow-[0_14px_34px_-18px_rgba(70,54,36,0.14)] transition-all duration-500 hover:-translate-y-1.5 hover:border-[var(--cavo-gold)] hover:shadow-[0_24px_55px_-18px_rgba(90,70,48,0.22)] sm:rounded-[28px] sm:p-3 ${
                          qty > 0
                            ? "border-[var(--cavo-gold)] ring-1 ring-[var(--cavo-gold)]/40"
                            : "border-[var(--cavo-border)]"
                        }`}
                      >
                          {/* Clean Uncluttered Image Frame */}
                          <div
                            onClick={() => setQuickViewDish(item)}
                            className="relative aspect-[4/3.1] w-full cursor-pointer overflow-hidden rounded-[14px] bg-[var(--cavo-stone)] sm:aspect-[16/10.5] sm:rounded-[20px]"
                          >
                            <Image
                              src={item.image}
                              alt={item.name[locale]}
                              fill
                              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 33vw"
                              className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                            />
                            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#241c14]/60 via-transparent to-transparent opacity-70" />

                            {/* Single Top-Start Badge (No Clutter!) */}
                            {isSignature && (
                              <span className="absolute start-2 top-2 inline-flex items-center gap-1 rounded-full border border-white/45 bg-[#f6f3ee]/92 px-2 py-0.5 text-[9px] font-bold text-[var(--cavo-gold-deep)] shadow-sm backdrop-blur-md sm:start-3 sm:top-3 sm:px-2.5 sm:text-[10px]">
                                <Sparkles className="h-2.5 w-2.5 text-[var(--cavo-gold)]" />
                                <span>{isAr ? "توقيع كافو" : "Signature"}</span>
                              </span>
                            )}

                            {/* Top-End Animated Price Medallion */}
                            <div className="absolute end-2 top-2 sm:end-3 sm:top-3">
                              <span
                                className={`inline-flex items-center rounded-full border px-2.5 py-0.5 font-mono text-[10px] font-bold shadow-md transition-all duration-300 sm:px-3.5 sm:py-1 sm:text-xs ${
                                  showTaxInclusive
                                    ? "border-[var(--cavo-gold)] bg-[#282018]/95 text-[#f5ece0]"
                                    : "border-[var(--cavo-gold)]/45 bg-[#f6f3ee]/95 text-[var(--cavo-gold-deep)] group-hover:bg-[var(--cavo-gold)] group-hover:text-white"
                                }`}
                              >
                                {displayedPrice.toLocaleString()}{" "}
                                {isAr ? "ج.م" : "EGP"}
                              </span>
                            </div>

                            {/* Bottom-End Subtle Quick-View Pill */}
                            <span className="absolute end-2 bottom-2 flex h-6 w-6 items-center justify-center rounded-full border border-white/35 bg-[#241c14]/65 text-white backdrop-blur-md transition group-hover:bg-[var(--cavo-gold)] sm:h-7 sm:w-7">
                              <Maximize2 className="h-3 w-3" />
                            </span>
                          </div>

                          {/* Card Body — Mobile-Perfected Typography & Full-Width Action Bar */}
                          <div className="flex min-w-0 flex-1 flex-col justify-between p-1.5 pt-2.5 sm:p-3.5 sm:pt-3.5">
                            <div className="min-w-0">
                              <span className="block truncate text-[9px] font-semibold text-[var(--cavo-gold-deep)] sm:text-[11px]">
                                {getCategoryLabel(item.category)}
                              </span>

                              <button
                                type="button"
                                onClick={() => setQuickViewDish(item)}
                                className="mt-0.5 text-start"
                              >
                                <h3 className="font-display line-clamp-1 break-words text-sm font-semibold leading-snug text-[var(--cavo-ink)] transition-colors group-hover:text-[var(--cavo-gold-deep)] sm:line-clamp-none sm:text-2xl">
                                  {item.name[locale]}
                                </h3>
                              </button>

                              <p className="mt-1 line-clamp-2 break-words text-[10px] leading-relaxed text-[var(--cavo-smoke)] sm:text-xs">
                                {item.description[locale]}
                              </p>
                            </div>

                            {/* Mobile-Perfected Bottom Action Bar (Never Collides!) */}
                            <div className="mt-2.5 border-t border-[var(--cavo-border)]/80 pt-2 sm:mt-4 sm:pt-3">
                              {qty === 0 ? (
                                <button
                                  type="button"
                                  onClick={() => updateQty(item.id, 1)}
                                  className="cavo-btn-pearl flex w-full items-center justify-center gap-1.5 rounded-full py-1.5 text-[11px] font-semibold sm:py-2 sm:text-xs"
                                >
                                  <Plus className="h-3 w-3 text-[var(--cavo-gold-deep)]" />
                                  <span>
                                    {isAr
                                      ? "أضف لحاسبة الفاتورة"
                                      : "Add to Bill Estimator"}
                                  </span>
                                </button>
                              ) : (
                                <div className="cavo-gold-gradient flex w-full items-center justify-between rounded-full px-2.5 py-1 text-xs text-white shadow-sm sm:px-3.5 sm:py-1.5">
                                  <button
                                    type="button"
                                    onClick={() => updateQty(item.id, -1)}
                                    aria-label={isAr ? "إنقاص" : "Decrease"}
                                    className="flex h-5 w-5 items-center justify-center rounded-full bg-white/20 transition hover:bg-white/35 sm:h-6 sm:w-6"
                                  >
                                    <Minus className="h-3 w-3" />
                                  </button>
                                  <span className="font-mono text-xs font-bold">
                                    {qty} {isAr ? "في الحاسبة" : "in bill"}
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() => updateQty(item.id, 1)}
                                    aria-label={isAr ? "زيادة" : "Increase"}
                                    className="flex h-5 w-5 items-center justify-center rounded-full bg-white/20 transition hover:bg-white/35 sm:h-6 sm:w-6"
                                  >
                                    <Plus className="h-3 w-3" />
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        </article>
                      );
                    })}
                </div>
              ) : (
                /* Luxury Editorial Fine-Dining List View (With Dotted Gold Leaders!) */
                <div
                  key={`list-${selectedCategory}-${selectedTag}-${sortBy}-${safePage}-${showAllPages}`}
                  className="cavo-swap-in grid grid-cols-1 gap-3 lg:grid-cols-2"
                >
                    {paginatedItems.map((item) => {
                      const qty = estimateQty[item.id] ?? 0;
                      const displayedPrice = formatDisplayPrice(item.priceEgp);

                      return (
                        <article
                          key={item.id}
                          className={`group flex items-center gap-3.5 rounded-[22px] border bg-[#f8f6f2] p-3 shadow-sm transition-all hover:border-[var(--cavo-gold)] sm:p-4 ${
                            qty > 0
                              ? "border-[var(--cavo-gold)] ring-1 ring-[var(--cavo-gold)]/35"
                              : "border-[var(--cavo-border)]"
                          }`}
                        >
                          <button
                            type="button"
                            onClick={() => setQuickViewDish(item)}
                            className="relative h-20 w-22 shrink-0 overflow-hidden rounded-2xl bg-[var(--cavo-stone)] sm:h-24 sm:w-28"
                          >
                            <Image
                              src={item.image}
                              alt={item.name[locale]}
                              fill
                              sizes="112px"
                              className="object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                          </button>

                          <div className="min-w-0 flex-1">
                            <div className="flex items-baseline gap-2">
                              <button
                                type="button"
                                onClick={() => setQuickViewDish(item)}
                                className="text-start"
                              >
                                <h3 className="font-display text-base font-semibold text-[var(--cavo-ink)] group-hover:text-[var(--cavo-gold-deep)] sm:text-xl">
                                  {item.name[locale]}
                                </h3>
                              </button>
                              <span className="flex-1 border-b border-dotted border-[var(--cavo-gold)]/50" />
                              <span className="shrink-0 font-mono text-xs font-bold text-[var(--cavo-gold-deep)] sm:text-sm">
                                {displayedPrice.toLocaleString()}{" "}
                                {isAr ? "ج.م" : "EGP"}
                              </span>
                            </div>

                            <p className="mt-1 line-clamp-2 text-[11px] leading-relaxed text-[var(--cavo-smoke)] sm:text-xs">
                              {item.description[locale]}
                            </p>

                            <div className="mt-2.5 flex items-center justify-between gap-2">
                              <span className="text-[10px] font-semibold text-[var(--cavo-gold-deep)]">
                                {getCategoryLabel(item.category)}
                              </span>

                              {qty === 0 ? (
                                <button
                                  type="button"
                                  onClick={() => updateQty(item.id, 1)}
                                  className="cavo-btn-pearl inline-flex items-center gap-1 rounded-full px-3 py-1 text-[11px] font-semibold"
                                >
                                  <Plus className="h-3 w-3 text-[var(--cavo-gold-deep)]" />
                                  <span>{isAr ? "أضف للحسبة" : "Estimate"}</span>
                                </button>
                              ) : (
                                <div className="cavo-gold-gradient inline-flex items-center gap-2 rounded-full px-2.5 py-0.5 text-xs text-white">
                                  <button
                                    type="button"
                                    onClick={() => updateQty(item.id, -1)}
                                  >
                                    <Minus className="h-3 w-3" />
                                  </button>
                                  <span className="font-mono font-bold">{qty}</span>
                                  <button
                                    type="button"
                                    onClick={() => updateQty(item.id, 1)}
                                  >
                                    <Plus className="h-3 w-3" />
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        </article>
                      );
                    })}
                </div>
              )}

              {/* LUXURY EDITORIAL PAGINATION BAR */}
              {filteredItems.length > ITEMS_PER_PAGE && (
                <div className="mt-7 flex flex-col items-center justify-between gap-3.5 rounded-[22px] border border-[var(--cavo-border)] bg-[#f8f6f2] px-4 py-3.5 shadow-sm sm:mt-9 sm:flex-row sm:rounded-full sm:px-6">
                  <div className="flex items-center gap-2 text-xs text-[var(--cavo-smoke)]">
                    <span>
                      {showAllPages
                        ? isAr
                          ? `عرض جميع الـ ${filteredItems.length} طبقاً`
                          : `Showing all ${filteredItems.length} dishes`
                        : isAr
                        ? `صفحة ${safePage} من ${totalPages} · (${filteredItems.length} طبق مختار)`
                        : `Page ${safePage} of ${totalPages} · (${filteredItems.length} curated dishes)`}
                    </span>
                  </div>

                  {!showAllPages && (
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        disabled={safePage <= 1}
                        onClick={() => goToPage(safePage - 1)}
                        aria-label={isAr ? "الصفحة السابقة" : "Previous page"}
                        className="flex h-8 w-8 items-center justify-center rounded-full border border-[var(--cavo-border)] bg-[#f1ede6] text-[var(--cavo-ink)] transition hover:border-[var(--cavo-gold)] disabled:opacity-35 sm:h-9 sm:w-9"
                      >
                        <ChevronLeft className="h-4 w-4 rtl:rotate-180" />
                      </button>

                      {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                        (page) => {
                          const active = page === safePage;
                          return (
                            <button
                              key={page}
                              type="button"
                              onClick={() => goToPage(page)}
                              className={`h-8 w-8 rounded-full font-mono text-xs font-bold transition-all sm:h-9 sm:w-9 ${
                                active
                                  ? "cavo-gold-gradient text-white shadow-sm"
                                  : "border border-[var(--cavo-border)] bg-[#f1ede6] text-[var(--cavo-ink)] hover:border-[var(--cavo-gold)]"
                              }`}
                            >
                              {page}
                            </button>
                          );
                        }
                      )}

                      <button
                        type="button"
                        disabled={safePage >= totalPages}
                        onClick={() => goToPage(safePage + 1)}
                        aria-label={isAr ? "الصفحة التالية" : "Next page"}
                        className="flex h-8 w-8 items-center justify-center rounded-full border border-[var(--cavo-border)] bg-[#f1ede6] text-[var(--cavo-ink)] transition hover:border-[var(--cavo-gold)] disabled:opacity-35 sm:h-9 sm:w-9"
                      >
                        <ChevronRight className="h-4 w-4 rtl:rotate-180" />
                      </button>
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={() => setShowAllPages((prev) => !prev)}
                    className="rounded-full border border-[var(--cavo-gold)]/45 bg-[#f1ede6] px-4 py-1.5 text-xs font-semibold text-[var(--cavo-gold-deep)] transition hover:bg-[var(--cavo-gold)] hover:text-white"
                  >
                    {showAllPages
                      ? isAr
                        ? "تفعيل تقسيم الصفحات (6 أطباق)"
                        : "Show Paginated (6 per page)"
                      : isAr
                      ? `عرض كل الأطباق (${filteredItems.length})`
                      : `View All (${filteredItems.length})`}
                  </button>
                </div>
              )}
            </>
          )}
        </section>

        {/* SECTION 04 — ESPRESSO-CHAMPAGNE FULL 378-ITEM TABLE QR MENU & BILL CALCULATOR PAVILION */}
        <section className="relative overflow-hidden rounded-[26px] border border-[#d6bc96]/45 bg-gradient-to-br from-[#231a13] via-[#1b140e] to-[#2a1f16] p-6 text-[#f7f0e6] shadow-[0_28px_70px_-22px_rgba(30,20,12,0.48)] sm:rounded-[34px] sm:p-9">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-2.5 rounded-[20px] border border-[#d6bc96]/18 sm:inset-4 sm:rounded-[26px]"
          />

          <div className="relative z-10 flex flex-col items-start justify-between gap-5 lg:flex-row lg:items-center">
            <div className="max-w-xl space-y-1.5">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[#d6bc96]/35 bg-white/10 px-3 py-1 text-[10px] font-semibold text-[#efdcb9] backdrop-blur-sm sm:text-[11px]">
                <Coffee className="h-3 w-3 text-[#e5caa4]" />
                <span>
                  {isAr
                    ? "منيو الطاولة الرقمي الكامل · 378 صنفاً"
                    : "COMPLETE TABLE QR ARCHIVE · 378 ITEMS"}
                </span>
              </span>
              <h2 className="font-display text-xl font-semibold text-white sm:text-3xl">
                {isAr
                  ? "تصفح منيو الطاولة الكامل (378 صنف) أو احسب فاتورتك."
                  : "Open the Complete 378-Item Table Menu or Estimate Your Bill."}
              </h2>
              <p className="text-xs leading-relaxed text-[#ded2c0]">
                {siteConfig.taxNotice[locale]}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <button
                type="button"
                onClick={() => setBillDrawerOpen(true)}
                className="cavo-btn-gold inline-flex items-center gap-2 rounded-full px-5 py-3 text-xs font-semibold"
              >
                <Calculator className="h-3.5 w-3.5" />
                <span>
                  {isAr
                    ? `حاسبة الفاتورة وتقسيم الشلة (${totalCount})`
                    : `Bill & Split Calculator (${totalCount})`}
                </span>
              </button>

              <a
                href={siteConfig.masterQrMenuUrl[locale]}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-full border border-[#d6bc96]/45 bg-white/10 px-5 py-3 text-xs font-semibold text-white backdrop-blur-sm transition hover:bg-white/20"
              >
                <span>
                  {isAr ? "منيو الـ 378 صنفاً (QR)" : "Full 378-Item QR Menu"}
                </span>
                <ExternalLink className="h-3.5 w-3.5 text-[#e5caa4]" />
              </a>
            </div>
          </div>
        </section>
      </div>

      {/* FLOATING LIVE BILL ESTIMATOR DOCK (Appears when totalCount > 0) */}
      {totalCount > 0 && (
        <div
          id="cavo-live-bill-dock"
          className="cavo-swap-in fixed inset-x-3 bottom-4 z-30 mx-auto max-w-2xl sm:bottom-5"
        >
          <div className="flex items-center justify-between gap-2.5 rounded-full border border-[var(--cavo-gold)] bg-[#282018]/96 px-3.5 py-2 text-[#f6f3ee] shadow-[0_22px_50px_-12px_rgba(30,22,14,0.58)] backdrop-blur-xl sm:px-5 sm:py-2.5">
            <div className="flex min-w-0 items-center gap-2.5">
              <span className="cavo-gold-gradient flex h-8 w-8 shrink-0 items-center justify-center rounded-full font-mono text-xs font-bold text-white shadow-sm sm:h-9 sm:w-9">
                {totalCount}
              </span>
              <div className="min-w-0">
                <p className="truncate text-[10px] font-medium text-[#e6dac8] sm:text-xs">
                  {isAr
                    ? "الإجمالي شامل الخدمة والضريبة"
                    : "Estimated Total (incl. Service & VAT)"}
                </p>
                <p className="font-mono text-xs font-bold text-white sm:text-base">
                  {bill.estimatedTotal.toLocaleString()} {isAr ? "ج.م" : "EGP"}
                  {splitCount > 1 && (
                    <span className="ms-1.5 text-[10px] font-normal text-[#d8c7b0] sm:text-[11px]">
                      (~{perPersonEstimate.toLocaleString()}{" "}
                      {isAr ? "للفرد" : "/ guest"})
                    </span>
                  )}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setBillDrawerOpen(true)}
              className="cavo-btn-gold shrink-0 rounded-full px-3.5 py-2 text-[11px] font-semibold sm:px-5 sm:text-xs"
            >
              {isAr ? "فتح الحاسبة وتقسيم الشلة" : "Open Bill & Split"}
            </button>
          </div>
        </div>
      )}

      {/* SLIDE-UP SMART BILL ESTIMATOR & TABLE-SPLIT DRAWER MODAL */}
      {billDrawerOpen && (
        <div
          onClick={() => setBillDrawerOpen(false)}
          className="cavo-fade-in fixed inset-0 z-50 flex items-end justify-center bg-[#221a12]/80 p-0 backdrop-blur-md sm:items-center sm:p-4"
          role="dialog"
          aria-modal="true"
          aria-label={
            isAr ? "حاسبة الفاتورة وتقسيم الشلة" : "Bill & Table Split Estimator"
          }
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="cavo-swap-in max-h-[88vh] w-full max-w-2xl overflow-y-auto rounded-t-[28px] border border-[var(--cavo-gold)]/50 bg-[#f8f6f2] p-5 text-[var(--cavo-ink)] shadow-2xl sm:rounded-[32px] sm:p-7"
          >
              <div className="mb-4 flex items-center justify-between border-b border-[var(--cavo-border)] pb-3.5">
                <div>
                  <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-[var(--cavo-gold-deep)]">
                    <Calculator className="h-3.5 w-3.5 text-[var(--cavo-gold)]" />
                    <span>
                      {isAr
                        ? "حاسبة الفاتورة الذكية وتقسيم الشلة"
                        : "TRANSPARENT BILL & SPLIT CALCULATOR"}
                    </span>
                  </span>
                  <h3 className="font-display text-2xl font-semibold text-[var(--cavo-ink)]">
                    {isAr
                      ? "تقدير فاتورتك قبل الزيارة"
                      : "Your Pre-Visit Bill Estimate"}
                  </h3>
                </div>

                <div className="flex items-center gap-2">
                  {estimateItems.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setEstimateQty({})}
                      className="inline-flex items-center gap-1 rounded-full border border-[var(--cavo-border)] bg-[#f1ede6] px-3 py-1.5 text-xs font-semibold text-[var(--cavo-terracotta)]"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      <span>{isAr ? "مسح" : "Clear"}</span>
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => setBillDrawerOpen(false)}
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--cavo-border)] bg-[#f1ede6] text-[var(--cavo-ink)]"
                    aria-label={isAr ? "إغلاق" : "Close"}
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {estimateItems.length === 0 ? (
                <div className="py-8 text-center">
                  <Calculator className="mx-auto h-8 w-8 text-[var(--cavo-gold)]" />
                  <p className="font-display mt-2 text-xl font-semibold text-[var(--cavo-ink)]">
                    {isAr
                      ? "لم تختر أطباقاً في الحاسبة بعد"
                      : "No Dishes Added Yet"}
                  </p>
                  <p className="mt-1 text-xs text-[var(--cavo-smoke)]">
                    {isAr
                      ? "اضغط على (+ أضف لحاسبة الفاتورة) تحت أي طبق لحساب الإجمالي شامل 12% خدمة و14% ضريبة."
                      : "Tap (+ Add to Bill Estimator) on any dish card to calculate your total with 12% service & 14% VAT."}
                  </p>
                </div>
              ) : (
                <div className="space-y-5">
                  {/* Selected Items List */}
                  <div className="max-h-56 space-y-2 overflow-y-auto pe-1">
                    {estimateItems.map(({ item, qty }) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between gap-3 rounded-2xl border border-[var(--cavo-border)] bg-[#f1ede6] p-2.5"
                      >
                        <div className="flex min-w-0 items-center gap-2.5">
                          <div className="relative h-11 w-13 shrink-0 overflow-hidden rounded-xl bg-[var(--cavo-stone)]">
                            <Image
                              src={item.image}
                              alt={item.name[locale]}
                              fill
                              sizes="52px"
                              className="object-cover"
                            />
                          </div>
                          <div className="min-w-0">
                            <p className="truncate text-xs font-bold text-[var(--cavo-ink)] sm:text-sm">
                              {item.name[locale]}
                            </p>
                            <p className="font-mono text-[11px] text-[var(--cavo-smoke)]">
                              {item.priceEgp} × {qty} ={" "}
                              <strong className="text-[var(--cavo-gold-deep)]">
                                {(item.priceEgp * qty).toLocaleString()}{" "}
                                {isAr ? "ج.م" : "EGP"}
                              </strong>
                            </p>
                          </div>
                        </div>

                        <div className="flex shrink-0 items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => updateQty(item.id, -1)}
                            className="flex h-7 w-7 items-center justify-center rounded-full border border-[var(--cavo-border)] bg-white"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="w-5 text-center font-mono text-xs font-bold">
                            {qty}
                          </span>
                          <button
                            type="button"
                            onClick={() => updateQty(item.id, 1)}
                            className="flex h-7 w-7 items-center justify-center rounded-full border border-[var(--cavo-border)] bg-white"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Subtotal + 12% Service + 14% VAT Breakdown */}
                  <div className="rounded-2xl border border-[var(--cavo-gold)]/40 bg-[#f1ede6] p-4">
                    <div className="space-y-1.5 border-b border-[var(--cavo-border)] pb-3 text-xs">
                      <div className="flex justify-between">
                        <span className="text-[var(--cavo-smoke)]">
                          {isAr
                            ? `المجموع الفرعي (${totalCount} أصناف)`
                            : `Subtotal (${totalCount} items)`}
                        </span>
                        <span className="font-mono font-semibold">
                          {bill.subtotal.toLocaleString()} {isAr ? "ج.م" : "EGP"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[var(--cavo-smoke)]">
                          {isAr ? "رسوم الخدمة (12%)" : "Service Charge (12%)"}
                        </span>
                        <span className="font-mono">
                          +{bill.serviceCharge.toLocaleString()}{" "}
                          {isAr ? "ج.م" : "EGP"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[var(--cavo-smoke)]">
                          {isAr ? "ضريبة القيمة المضافة (14%)" : "VAT (14%)"}
                        </span>
                        <span className="font-mono">
                          +{bill.vat.toLocaleString()} {isAr ? "ج.م" : "EGP"}
                        </span>
                      </div>
                    </div>

                    <div className="mt-3 flex items-baseline justify-between">
                      <span className="text-sm font-bold text-[var(--cavo-ink)]">
                        {isAr ? "الإجمالي النهائي التقديري" : "Estimated Net Total"}
                      </span>
                      <span className="font-display text-2xl font-bold text-[var(--cavo-gold-deep)] sm:text-3xl">
                        {bill.estimatedTotal.toLocaleString()}{" "}
                        <span className="text-sm">{isAr ? "ج.م" : "EGP"}</span>
                      </span>
                    </div>

                    {/* Split Bill Across Guests */}
                    <div className="mt-3.5 flex flex-wrap items-center justify-between gap-2 border-t border-[var(--cavo-border)] pt-3">
                      <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[var(--cavo-ink)]">
                        <Users className="h-3.5 w-3.5 text-[var(--cavo-gold-deep)]" />
                        {isAr ? "تقسيم على عدد الشلة:" : "Split Across Guests:"}
                      </span>
                      <div className="flex items-center gap-1">
                        {[1, 2, 4, 6, 8].map((n) => (
                          <button
                            key={n}
                            type="button"
                            onClick={() => setSplitCount(n)}
                            className={`h-7 w-7 rounded-full font-mono text-xs font-bold transition ${
                              splitCount === n
                                ? "bg-[var(--cavo-gold)] text-white"
                                : "border border-[var(--cavo-border)] bg-white text-[var(--cavo-ink)]"
                            }`}
                          >
                            {n}
                          </button>
                        ))}
                      </div>
                    </div>

                    {splitCount > 1 && (
                      <div className="mt-2 flex items-center justify-between rounded-xl bg-[#f8f6f2] px-3 py-2 text-xs">
                        <span className="text-[var(--cavo-smoke)]">
                          {isAr
                            ? `نصيب الفرد الواحد (${splitCount} أفراد):`
                            : `Estimated Per Person (${splitCount} guests):`}
                        </span>
                        <span className="font-mono text-sm font-bold text-[var(--cavo-gold-deep)]">
                          ~{perPersonEstimate.toLocaleString()}{" "}
                          {isAr ? "ج.م" : "EGP"}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Drawer Actions */}
                  <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                    <Link
                      href={localePath(locale, "book")}
                      className="cavo-btn-gold inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-xs font-semibold"
                    >
                      <CalendarCheck className="h-3.5 w-3.5" />
                      <span>{isAr ? "احجز طاولتك الآن" : "Reserve a Table"}</span>
                    </Link>

                    <a
                      href={buildWhatsAppUrl("201286666483", whatsappEstimateText)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="cavo-btn-pearl inline-flex items-center justify-center gap-1.5 rounded-full px-5 py-3 text-xs font-semibold"
                    >
                      <MessageCircle className="h-3.5 w-3.5 text-[var(--cavo-gold-deep)]" />
                      <span>
                        {isAr ? "شارك القائمة عبر واتساب" : "Share via WhatsApp"}
                      </span>
                    </a>
                  </div>
                </div>
              )}
          </div>
        </div>
      )}

      {/* DISH QUICK-VIEW & TRANSPARENT TAX BREAKDOWN MODAL */}
      {quickViewDish && (
        <div
          onClick={() => setQuickViewDish(null)}
          className="cavo-fade-in fixed inset-0 z-50 flex items-center justify-center bg-[#261e16]/85 p-3.5 backdrop-blur-xl"
          role="dialog"
          aria-modal="true"
          aria-label={quickViewDish.name[locale]}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="cavo-zoom-in relative max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-[28px] border border-[var(--cavo-gold)]/50 bg-[#f8f6f2] p-4 text-[var(--cavo-ink)] shadow-2xl sm:p-6"
          >
              <button
                type="button"
                onClick={() => setQuickViewDish(null)}
                aria-label={isAr ? "إغلاق" : "Close"}
                className="absolute end-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full border border-[var(--cavo-gold)]/40 bg-[#f6f3ee]/95 text-[var(--cavo-ink)] shadow-md transition hover:bg-[var(--cavo-gold)] hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>

              <div className="relative aspect-[16/10] w-full overflow-hidden rounded-[20px] bg-[var(--cavo-stone)]">
                <Image
                  src={quickViewDish.image}
                  alt={quickViewDish.name[locale]}
                  fill
                  sizes="(max-width: 768px) 100vw, 600px"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#241c14]/75 via-transparent to-transparent" />
                <div className="absolute start-3 bottom-3 flex flex-wrap items-center gap-1.5">
                  <span className="rounded-full bg-[#f6f3ee]/95 px-2.5 py-0.5 text-[11px] font-bold text-[var(--cavo-gold-deep)]">
                    {getCategoryLabel(quickViewDish.category)}
                  </span>
                  {quickViewDish.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-white/40 bg-[#261e16]/75 px-2.5 py-0.5 text-[11px] font-medium text-[#f3e9d9] backdrop-blur-md"
                    >
                      {dietaryLabels[tag][locale]}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-4 space-y-3.5">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <h3 className="font-display text-2xl font-semibold text-[var(--cavo-ink)]">
                      {quickViewDish.name[locale]}
                    </h3>
                    <p className="text-xs font-medium text-[var(--cavo-smoke)]">
                      {quickViewDish.name[isAr ? "en" : "ar"]}
                    </p>
                  </div>
                  <div className="text-end">
                    <span className="font-display text-2xl font-bold text-[var(--cavo-gold-deep)]">
                      {quickViewDish.priceEgp} {isAr ? "ج.م" : "EGP"}
                    </span>
                    <span className="block text-[10px] text-[var(--cavo-smoke)]">
                      {siteConfig.taxBadgeShort[locale]}
                    </span>
                  </div>
                </div>

                <p className="text-xs leading-relaxed text-[var(--cavo-smoke)] sm:text-sm">
                  {quickViewDish.description[locale]}
                </p>

                {/* Single-Dish Transparent Tax Breakdown */}
                {(() => {
                  const singleBill = calculateMenuBillEstimate(
                    quickViewDish.priceEgp
                  );
                  const catInfo = categoryEditorialMeta[quickViewDish.category];
                  return (
                    <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                      <div className="rounded-2xl border border-[var(--cavo-border)] bg-[#f1ede6] p-3 text-xs">
                        <p className="font-bold text-[var(--cavo-gold-deep)]">
                          {isAr
                            ? "تفصيل السعر الشفاف:"
                            : "Transparent Price Breakdown:"}
                        </p>
                        <div className="mt-1.5 space-y-1 text-[var(--cavo-smoke)]">
                          <div className="flex justify-between">
                            <span>{isAr ? "سعر المنيو:" : "Menu Price:"}</span>
                            <span className="font-mono font-semibold text-[var(--cavo-ink)]">
                              {singleBill.subtotal} {isAr ? "ج.م" : "EGP"}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span>{isAr ? "خدمة 12%:" : "12% Service:"}</span>
                            <span className="font-mono">
                              +{singleBill.serviceCharge} {isAr ? "ج.م" : "EGP"}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span>{isAr ? "ضريبة 14%:" : "14% VAT:"}</span>
                            <span className="font-mono">
                              +{singleBill.vat} {isAr ? "ج.م" : "EGP"}
                            </span>
                          </div>
                          <div className="flex justify-between border-t border-[var(--cavo-border)] pt-1 font-bold text-[var(--cavo-ink)]">
                            <span>{isAr ? "الصافي الشامل:" : "Net Total:"}</span>
                            <span className="font-mono text-[var(--cavo-gold-deep)]">
                              {singleBill.estimatedTotal} {isAr ? "ج.م" : "EGP"}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col justify-between rounded-2xl border border-[var(--cavo-border)] bg-[#f1ede6] p-3 text-xs">
                        <div>
                          <p className="font-bold text-[var(--cavo-gold-deep)]">
                            {isAr ? "الوجهة المقترحة:" : "Recommended Venue:"}
                          </p>
                          <p className="mt-1 font-semibold text-[var(--cavo-ink)]">
                            {catInfo.recommendedVenue[locale]}
                          </p>
                        </div>
                        <Link
                          href={localePath(
                            locale,
                            `book?venue=${catInfo.venueSlug}`
                          )}
                          className="mt-2 inline-flex items-center gap-1 font-bold text-[var(--cavo-gold-deep)] hover:underline"
                        >
                          <span>
                            {isAr ? "احجز طاولة لهذه الوجهة" : "Book This Venue"}
                          </span>
                          <ArrowRight className="h-3.5 w-3.5 rtl:rotate-180" />
                        </Link>
                      </div>
                    </div>
                  );
                })()}

                <div className="flex items-center gap-2.5 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      updateQty(quickViewDish.id, 1);
                      setQuickViewDish(null);
                    }}
                    className="cavo-btn-gold inline-flex flex-1 items-center justify-center gap-1.5 rounded-full px-5 py-2.5 text-xs font-semibold"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    <span>
                      {isAr ? "أضف لحاسبة الفاتورة" : "Add to Bill Estimator"}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setQuickViewDish(null)}
                    className="cavo-btn-pearl rounded-full px-4 py-2.5 text-xs font-semibold"
                  >
                    {isAr ? "إغلاق" : "Close"}
                  </button>
                </div>
              </div>
          </div>
        </div>
      )}

      {/* FULLSCREEN HERO 4-TIMES-OF-DAY NILE TABLE LIGHTBOX MODAL (ZERO PRICES) */}
      {heroLightboxOpen && (
        <div
          onClick={() => setHeroLightboxOpen(false)}
          className="cavo-fade-in fixed inset-0 z-50 flex items-center justify-center bg-[#221a12]/90 p-3.5 backdrop-blur-xl"
          role="dialog"
          aria-modal="true"
          aria-label={currentTimeChapter.title[locale]}
        >
          <button
            type="button"
            onClick={() => setHeroLightboxOpen(false)}
            className="absolute end-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-[var(--cavo-gold)]/45 bg-[#f6f3ee] text-[var(--cavo-ink)] shadow-lg"
            aria-label={isAr ? "إغلاق" : "Close"}
          >
            <X className="h-5 w-5" />
          </button>

          <div
            onClick={(e) => e.stopPropagation()}
            className="cavo-zoom-in max-h-[90vh] w-full max-w-4xl overflow-hidden rounded-[26px] border border-[var(--cavo-gold)]/45 bg-[#f8f6f2] p-2.5 text-[var(--cavo-ink)] shadow-2xl sm:rounded-[30px] sm:p-4"
          >
              <div className="relative h-[48vh] w-full overflow-hidden rounded-[18px] bg-[var(--cavo-stone)] sm:h-[56vh] sm:rounded-[22px]">
                <Image
                  src={currentTimeChapter.image}
                  alt={currentTimeChapter.title[locale]}
                  fill
                  sizes="100vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#221a12]/70 via-transparent to-transparent" />
                <span className="absolute start-3 top-3 rounded-full bg-[#f6f3ee]/95 px-3 py-1 text-[11px] font-bold text-[var(--cavo-gold-deep)] shadow-sm">
                  {currentTimeChapter.number} ·{" "}
                  {currentTimeChapter.periodName[locale]} ·{" "}
                  {currentTimeChapter.skyStateBadge[locale]}
                </span>
              </div>

              <div className="flex flex-col justify-between gap-3 p-3 sm:flex-row sm:items-center sm:p-4">
                <div className="min-w-0">
                  <p className="text-xs font-bold text-[var(--cavo-gold-deep)]">
                    {currentTimeChapter.venueTag[locale]} ·{" "}
                    {currentTimeChapter.timeWindow[locale]}
                  </p>
                  <h3 className="font-display mt-0.5 text-xl font-semibold text-[var(--cavo-ink)] sm:text-2xl">
                    {currentTimeChapter.title[locale]}
                  </h3>
                </div>

                <div className="flex flex-wrap items-center gap-1.5">
                  {nileTableTimeChapters.map((c, cIdx) => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => setActiveTimeIdx(cIdx)}
                      className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                        cIdx === activeTimeIdx
                          ? "bg-[var(--cavo-gold)] text-white"
                          : "border border-[var(--cavo-border)] bg-[#f1ede6] text-[var(--cavo-ink)]"
                      }`}
                    >
                      {c.periodName[locale]}
                    </button>
                  ))}
                </div>
              </div>
          </div>
        </div>
      )}
    </div>
  );
}
