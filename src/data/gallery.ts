import type { Locale } from "@/lib/i18n";
import type { GalleryCategory, GalleryItem } from "@/types/cavo";

export type { GalleryCategory, GalleryItem } from "@/types/cavo";

export const galleryCategories: {
  id: "all" | GalleryCategory;
  label: Record<Locale, string>;
}[] = [
  { id: "all", label: { en: "All Frames", ar: "كل اللقطات" } },
  { id: "place", label: { en: "The Place", ar: "المكان والتصميم" } },
  { id: "taste", label: { en: "The Taste", ar: "المذاق والأطباق" } },
  { id: "moments", label: { en: "The Moments", ar: "اللحظات والموسيقى" } },
  { id: "after-dark", label: { en: "After Dark", ar: "أجواء السهر" } },
];

export const galleryItems: GalleryItem[] = [
  {
    id: "main-evening-glow",
    category: "after-dark",
    mediaType: "image",
    src: "/media/hero/main-evening.jpg",
    venueTag: { en: "Main Restaurant · Evening", ar: "المطعم الرئيسي · مساءً" },
    title: {
      en: "Warm Backlit CAVO Architecture",
      ar: "الإضاءة المعمارية الدافئة وشعار كافو",
    },
    caption: {
      en: "Sculpted wave walls, warm lantern glow, and plush terracotta-and-ivory seating at dusk.",
      ar: "الجدار المعماري المضيء مع الفوانيس الدافئة والجلسات الفاخرة وقت الغروب.",
    },
  },
  {
    id: "main-pergola-day",
    category: "place",
    mediaType: "image",
    src: "/media/hero/main-day.jpg",
    venueTag: { en: "Main Restaurant", ar: "المطعم الرئيسي" },
    title: {
      en: "Sunlit Pergola Architecture",
      ar: "البرجولا الخشبية في ضوء النهار",
    },
    caption: {
      en: "Natural morning sunlight across warm timber beams, botanical planters, and sculptural curved ivory seating.",
      ar: "أشعة الصباح الدافئة تتخلل الأسقف الخشبية والنباتات الخضراء والجلسات المنحنية الأنيقة.",
    },
  },
  {
    id: "cavo-riverside-entry",
    category: "place",
    mediaType: "image",
    src: "/media/hero/cavo-welcome-arch.jpg",
    venueTag: { en: "CAVO Island", ar: "كافو آيلاند" },
    title: {
      en: "A Warm Welcome on the River",
      ar: "مدخل كافو وسط الزهور على النيل",
    },
    caption: {
      en: "A flower-covered pergola and CAVO's iconic sculpted riverside entrance overlooking the Nile.",
      ar: "مدخل كافو الأيقوني وسط الزهور والأجنحة البيضاء بإطلالة مفتوحة على النيل.",
    },
  },
  {
    id: "nile-breakfast-table",
    category: "taste",
    mediaType: "image",
    src: "/media/hero/main-terrace.jpg",
    venueTag: { en: "Main Restaurant · Nile Edge", ar: "المطعم الرئيسي · على النيل" },
    title: {
      en: "Morning Table Overlooking the Nile",
      ar: "فطار الصباح على حافة النيل",
    },
    caption: {
      en: "Egyptian breakfast spreads, sunny-side eggs, warm bread, and brewed tea directly above the water.",
      ar: "تشكيلة الفطار المتكاملة مع الشاي الساخن والخبز الطازج وإطلالة المياه مباشرة.",
    },
  },
  {
    id: "boat-sunset-view",
    category: "place",
    mediaType: "image",
    src: "/media/hero/boat-nile-sunset.jpg",
    venueTag: { en: "Nile City Boat · Sunset", ar: "مركب نايل سيتي · الغروب" },
    title: {
      en: "Golden Hour Facing Cairo Tower",
      ar: "ساعة الغروب أمام برج القاهرة",
    },
    caption: {
      en: "Warm golden light and rippling Nile reflections across CAVO's riverfront decks in Zamalek.",
      ar: "انعكاس شمس الغروب الذهبية على مياه النيل أمام طوابق كافو بالزمالك.",
    },
  },
  {
    id: "yacht-day-cruiser",
    category: "moments",
    mediaType: "image",
    src: "/media/venues/private-yacht/yacht-exterior.jpg",
    venueTag: { en: "Private Yacht", ar: "اليخت الخاص" },
    title: {
      en: "Yachts by Cavo Facing Cairo Tower",
      ar: "يخت كافو الخاص أمام برج القاهرة",
    },
    caption: {
      en: "Private Nile yacht charters cruising smoothly past Zamalek and Cairo Tower.",
      ar: "رحلات اليخت الخاص من كافو تبحر بهدوء أمام الزمالك وبرج القاهرة.",
    },
  },
  {
    id: "twilight-interior",
    category: "place",
    mediaType: "video",
    src: "/media/video/cavo-official-intro.mp4",
    mobileSrc: "/media/video/cavo-official-intro-mobile.mp4",
    poster: "/media/video/cavo-official-poster.jpg",
    mobilePoster: "/media/video/cavo-official-poster-mobile.jpg",
    venueTag: { en: "CAVO Island · Official Tour", ar: "كافو آيلاند · جولة الفيديو الرسمية" },
    title: {
      en: "Inside CAVO Island Zamalek",
      ar: "جولة حية داخل كافو آيلاند بالزمالك",
    },
    caption: {
      en: "Panoramic Nile window booths, open-air riverside decks, and warm timber architecture along the Zamalek Corniche.",
      ar: "جلسات النيل البانورامية، التراس المفتوح على المياه، والتصميم المعماري الدافئ في قلب الزمالك.",
    },
  },
  {
    id: "yacht-night-cairo-tower",
    category: "moments",
    mediaType: "image",
    src: "/media/venues/private-yacht/yacht-night-dinner.jpg",
    venueTag: { en: "Private Yacht", ar: "اليخت الخاص" },
    title: {
      en: "Yachts by Cavo Facing Cairo Tower",
      ar: "عشاء على اليخت أمام برج القاهرة",
    },
    caption: {
      en: "Curved leather yacht seating and full dinner spreads sailing past Zamalek's lit Nile skyline.",
      ar: "جلسات اليخت الجلدية المريحة وسفرة العشاء أثناء الإبحار أمام معالم الزمالك المضيئة.",
    },
  },
  {
    id: "boat-sunset-panorama",
    category: "place",
    mediaType: "video",
    src: "/media/video/cavo-intro-sunset.mp4",
    poster: "/media/hero/boat-nile-sunset.jpg",
    venueTag: { en: "Nile City Boat · Sunset Video", ar: "مركب نايل سيتي · فيديو الغروب" },
    title: {
      en: "Golden Hour Facing Cairo Tower",
      ar: "ساعة الغروب أمام برج القاهرة",
    },
    caption: {
      en: "Warm golden light and rippling Nile waves across CAVO Island's riverfront decks along the Zamalek Corniche.",
      ar: "انعكاس شمس الغروب الذهبية وحركة أمواج النيل أمام طوابق كافو آيلاند وتراس الزمالك.",
    },
  },
  {
    id: "boat-deck-night",
    category: "after-dark",
    mediaType: "video",
    src: "/media/video/cavo-intro-night.mp4",
    poster: "/media/hero/boat-nile-night.jpg",
    venueTag: { en: "Boat & Yacht · Night Video", ar: "المركب واليخت · فيديو ليلي" },
    title: {
      en: "Illuminated Nile Waterfront After Dark",
      ar: "أضواء المركب واليخت على ضفاف النيل ليلاً",
    },
    caption: {
      en: "Warm timber lanterns and yacht moorings shimmering on the night Nile against Cairo's illuminated skyline.",
      ar: "توهج أضواء المركب واليخت الخاص على مياه النيل الليلية أمام أفق القاهرة وبرج القاهرة المضيء.",
    },
  },
  {
    id: "cavo-blossom-sign",
    category: "place",
    mediaType: "image",
    src: "/media/gallery/cavo-detail-1.webp",
    venueTag: { en: "Main Restaurant", ar: "المطعم الرئيسي" },
    title: {
      en: "Botanical Bouclé Sanctuary",
      ar: "تفاصيل التصميم المعماري والزهور",
    },
    caption: {
      en: "Sculptural CAVO emblem framed by crimson blossoms, slatted timber, and sunlit cream booths.",
      ar: "شعار كافو المحاط بالزهور الدافئة والأخشاب الطبيعية وجلسات البوكليه المريحة.",
    },
  },
  {
    id: "elite-table-lamps",
    category: "after-dark",
    mediaType: "image",
    src: "/media/venues/elite/elite-night-dinner.jpg",
    venueTag: { en: "Elite", ar: "إيليت" },
    title: {
      en: "Candlelit Dining at CAVO Elite",
      ar: "عشاء كافو إيليت بالإضاءة الخافتة",
    },
    caption: {
      en: "Matte-black table lamps, plated mains, and panoramic night river views.",
      ar: "مصابيح الطاولات الأنيقة مع أطباق العشاء وإطلالة النيل الليلية.",
    },
  },
  {
    id: "cavo-coffee-morning",
    category: "taste",
    mediaType: "image",
    src: "/media/menu/cavo-coffee-breakfast.jpg",
    venueTag: { en: "Main Restaurant", ar: "المطعم الرئيسي" },
    title: {
      en: "Branded Morning Espresso & Croissant",
      ar: "كابتشينو كافو والكرواسون الصباحي",
    },
    caption: {
      en: "CAVO Island cappuccino served riverside alongside flaky croissants and fresh orange juice.",
      ar: "فنجان كابتشينو بتوقيع كافو مع الكرواسون وعصير البرتقال الطازج على النيل.",
    },
  },
  {
    id: "takhtista-live",
    category: "moments",
    mediaType: "image",
    src: "/media/gallery/takhtista-live.jpg",
    venueTag: { en: "Main Restaurant · Live Nights", ar: "المطعم الرئيسي · ليالي الطرب" },
    title: {
      en: "TAKHTISTA Live Oriental Sessions",
      ar: "أجواء تختيستا والموسيقى الحية",
    },
    caption: {
      en: "Live violin, guitar, and percussion ensembles energizing CAVO's riverside evenings.",
      ar: "عزف حي بالكمان والجيتار والإيقاع يملأ أمسيات كافو بالطاقة والطرب.",
    },
  },
  {
    id: "yacht-day-feast",
    category: "taste",
    mediaType: "image",
    src: "/media/venues/private-yacht/yacht-dining-table.jpg",
    venueTag: { en: "Private Yacht", ar: "اليخت الخاص" },
    title: {
      en: "Artisanal Pizza & Onboard Spread",
      ar: "بيتزا ومقبلات تُقدّم على متن اليخت",
    },
    caption: {
      en: "Fresh pizza, appetizers, and chilled drinks served on board while cruising.",
      ar: "بيتزا مقرمشة ومقبلات متنوعة ومشروبات باردة تُقدّم طازجة وسط النيل.",
    },
  },
  {
    id: "cavo-sign-grill",
    category: "after-dark",
    mediaType: "image",
    src: "/media/venues/elite/cavo-sign-glow.jpg",
    venueTag: { en: "Elite · Main Lounge", ar: "إيليت · الصالة الرئيسية" },
    title: {
      en: "The Signature Backlit CAVO Wall",
      ar: "جدار كافو المضيء وطاولات المشاوي",
    },
    caption: {
      en: "Tableside charcoal grills beneath the sculpted backlit CAVO emblem.",
      ar: "مشاوي كافو الخاصة أسفل الشعار الذهبي المضيء وسط أجواء دافئة.",
    },
  },
  {
    id: "elite-window-feast",
    category: "taste",
    mediaType: "image",
    src: "/media/venues/elite/elite-window-feast.jpg",
    venueTag: { en: "Elite", ar: "إيليت" },
    title: {
      en: "Riverside Window Booth Spread",
      ar: "سفرة الغداء والعشاء أمام النوافذ البانورامية",
    },
    caption: {
      en: "Plush cream booth seating framing group dining against daytime Zamalek water views.",
      ar: "بوثات فاخرة تحتضن سفرة متكاملة أمام إطلالة النيل النهارية بالزمالك.",
    },
  },
  {
    id: "live-band-acoustic",
    category: "moments",
    mediaType: "image",
    src: "/media/gallery/live-band-night.jpg",
    venueTag: { en: "Main Restaurant · Live Nights", ar: "المطعم الرئيسي · حفلات حية" },
    title: {
      en: "Evening Acoustic & Band Performances",
      ar: "ليالي الغناء الحي والموسيقى",
    },
    caption: {
      en: "Intimate live sets framed by lush greenery and the glowing CAVO backdrop.",
      ar: "حفلات غنائية دافئة أمام ديكورات الزرع وإضاءة كافو الخافتة.",
    },
  },
  {
    id: "boat-terrace-day",
    category: "place",
    mediaType: "image",
    src: "/media/venues/boat/nile-terrace-day.jpg",
    venueTag: { en: "Boat", ar: "المركب" },
    title: {
      en: "Zamalek Daytime River Breeze",
      ar: "نسمة النيل الصباحية في الزمالك",
    },
    caption: {
      en: "Sun-kissed open-air dining beside passing feluccas and Zamalek's waterfront.",
      ar: "جلسات مفتوحة مشمسة على ضفة الزمالك مع إطلالة المراكب المارة.",
    },
  },
  {
    id: "interior-night-floor",
    category: "after-dark",
    mediaType: "image",
    src: "/media/gallery/cavo-detail-2.webp",
    venueTag: { en: "Main Restaurant · Night", ar: "المطعم الرئيسي · ليلاً" },
    title: {
      en: "Architectural Night Flow",
      ar: "انسيابية التصميم الليلي والممشى المضيء",
    },
    caption: {
      en: "Curved floor LED ribbons guiding guests through dining alcoves overlooking the night Nile.",
      ar: "خطوط الإضاءة الأرضية المنحنية تقودك بين الطاولات أمام نوافذ النيل الليلية.",
    },
  },
  {
    id: "dessert-strawberry",
    category: "taste",
    mediaType: "image",
    src: "/media/menu/signature-dessert.webp",
    venueTag: { en: "Kitchen · Desserts", ar: "المطبخ · الحلويات" },
    title: {
      en: "Late-Night Sweet Creations",
      ar: "حلويات السهر والتوقيع الخاص",
    },
    caption: {
      en: "Plated desserts paired with espresso and mocktails late into the Cairo evening.",
      ar: "حلويات مقدمة بعناية مع القهوة المختصة والموكتيلات حتى ساعات السهر.",
    },
  },
  {
    id: "yacht-day-booth",
    category: "moments",
    mediaType: "image",
    src: "/media/venues/private-yacht/yacht-deck-day.jpg",
    venueTag: { en: "Private Yacht", ar: "اليخت الخاص" },
    title: {
      en: "Daytime Nile Yacht Gatherings",
      ar: "تجمعات النهار على متن اليخت",
    },
    caption: {
      en: "Wide leather seating cruising Cairo's heart under clear blue skies.",
      ar: "جلسات جلدية واسعة تبحر في قلب القاهرة تحت السماء الصافية.",
    },
  },
];
