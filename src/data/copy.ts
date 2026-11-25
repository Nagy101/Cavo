import type { Locale } from "@/lib/i18n";
import type { LocalizedString, VenueSlug } from "@/types/cavo";

export interface DayToNightChapter {
  id: "morning" | "afternoon" | "sunset" | "night";
  order: string;
  periodLabel: LocalizedString;
  timeRange: LocalizedString;
  venueSlug: VenueSlug;
  venueLabel: LocalizedString;
  headline: LocalizedString;
  description: LocalizedString;
  image: string;
  theme: "soft-white" | "ivory" | "espresso" | "obsidian";
}

export const dayToNightChapters: DayToNightChapter[] = [
  {
    id: "morning",
    order: "01",
    periodLabel: { en: "Morning", ar: "الصباح" },
    timeRange: { en: "From 8:00 AM", ar: "من 8:00 صباحاً" },
    venueSlug: "main-restaurant",
    venueLabel: { en: "Main Restaurant", ar: "المطعم الرئيسي" },
    headline: {
      en: "Sunlight Across the Timber Pergola.",
      ar: "أشعة الصباح على البرجولا الخشبية.",
    },
    description: {
      en: "Bright Nile light pours through panoramic glass as guests gather for Egyptian and continental breakfasts, flaky croissants, and CAVO espresso.",
      ar: "ضوء النيل الصباحي يملأ الصالة مع تشكيلة الفطار المصري والأوروبي والكرواسون الطازج وفنجان كابتشينو كافو.",
    },
    image: "/media/hero/main-day.jpg",
    theme: "soft-white",
  },
  {
    id: "afternoon",
    order: "02",
    periodLabel: { en: "Afternoon", ar: "الظهيرة" },
    timeRange: { en: "Midday Hours", ar: "ساعات النهار" },
    venueSlug: "boat",
    venueLabel: { en: "Main Restaurant & Boat", ar: "المطعم والمركب" },
    headline: {
      en: "Long Lunches at Water Level.",
      ar: "غداء ممتد بمحاذاة المياه.",
    },
    description: {
      en: "Passing riverboats drift past open-air tables and plush window booths while fresh salads, baked tajins, wood-fired pizzas, and iced drinks arrive.",
      ar: "المراكب النيلية تمر بهدوء أمام الجلسات المفتوحة وبوثات النوافذ وسط السلطات الطازجة والطواجن والبيتزا والمشروبات المثلجة.",
    },
    image: "/media/hero/main-terrace.jpg",
    theme: "ivory",
  },
  {
    id: "sunset",
    order: "03",
    periodLabel: { en: "Sunset", ar: "الغروب" },
    timeRange: { en: "Golden Hour", ar: "الساعة الذهبية" },
    venueSlug: "private-yacht",
    venueLabel: { en: "Boat & Private Yacht", ar: "المركب واليخت الخاص" },
    headline: {
      en: "Warm Bronze Reflections on the Nile.",
      ar: "انعكاسات الغروب الذهبية على النهر.",
    },
    description: {
      en: "As Cairo shifts from blue sky to dusk, backlit CAVO architecture warms the lounge while Yachts by Cavo and the open Boat deck welcome evening guests.",
      ar: "مع تحول السماء إلى الغسق تتوهج الإضاءة الذهبية حول شعار كافو وتبدأ أمسيات سطح المركب وإبحار اليخت الخاص.",
    },
    image: "/media/hero/main-evening.jpg",
    theme: "espresso",
  },
  {
    id: "night",
    order: "04",
    periodLabel: { en: "Night", ar: "الليل" },
    timeRange: { en: "Until 4:00 AM", ar: "حتى 4:00 فجراً" },
    venueSlug: "elite",
    venueLabel: { en: "Elite & Boat After Dark", ar: "إيليت وأمسيات الليل" },
    headline: {
      en: "Intimate Lamps & City Lights Until Dawn.",
      ar: "مصابيح خافتة وأضواء القاهرة حتى الفجر.",
    },
    description: {
      en: "Matte-black table lamps illuminate fine dinners at CAVO Elite while live music nights and skyline views carry hospitality until 4:00 AM.",
      ar: "مصابيح الطاولات الخافتة تحتضن عشاء كافو إيليت الفاخر بالتوازي مع ليالي الموسيقى الحية وإطلالة النيل حتى الرابعة فجراً.",
    },
    image: "/media/venues/elite/elite-night-dinner.jpg",
    theme: "obsidian",
  },
];

export interface FinderIntent {
  id: string;
  questionTag: LocalizedString;
  title: LocalizedString;
  subtitle: LocalizedString;
  recommendedVenue: VenueSlug;
  recommendationNote: LocalizedString;
}

export const experienceFinderIntents: FinderIntent[] = [
  {
    id: "dining",
    questionTag: { en: "Dining & Food", ar: "طعام وضيافة" },
    title: {
      en: "Dining & Food",
      ar: "الفطار، الغداء، والقهوة المختصة",
    },
    subtitle: {
      en: "All-day kitchen menu, morning brunch spreads, and sunlit timber architecture.",
      ar: "منيو متكامل طوال اليوم مع فطار الصباح وتصميم البرجولا الخشبية الدافئة.",
    },
    recommendedVenue: "main-restaurant",
    recommendationNote: {
      en: "Recommended: Main Restaurant · Open daily from 8:00 AM",
      ar: "الاختيار الأنسب: المطعم الرئيسي · مفتوح يومياً من 8:00 صباحاً",
    },
  },
  {
    id: "breeze",
    questionTag: { en: "A Night by the Nile", ar: "أمسية على النيل" },
    title: {
      en: "A Night by the Nile",
      ar: "أمسية مفتوحة على ضفاف النيل",
    },
    subtitle: {
      en: "Open-air riverfront seating, mocktails, shisha, and passing Nile boats at sunset & night.",
      ar: "جلسات هواء طلق مباشرة فوق النهر مع الموكتيلات والشيشة وأضواء القاهرة.",
    },
    recommendedVenue: "boat",
    recommendationNote: {
      en: "Recommended: Boat · Open-air Nile City deck",
      ar: "الاختيار الأنسب: المركب (Boat) · سطح مفتوح مباشرة على النيل",
    },
  },
  {
    id: "celebrate",
    questionTag: { en: "Private Celebration", ar: "احتفال خاص" },
    title: {
      en: "Private Celebration",
      ar: "مناسبة خاصة أو رحلة يخت",
    },
    subtitle: {
      en: "Birthdays, proposals, family milestones, or VIP dinners arranged aboard Yachts by Cavo.",
      ar: "أعياد ميلاد، خطوبة، أو عزومة خاصة تُرتّب على متن اليخت الخاص.",
    },
    recommendedVenue: "private-yacht",
    recommendationNote: {
      en: "Recommended: Private Yacht (Yachts by Cavo) · +20 128 666 6482",
      ar: "الاختيار الأنسب: اليخت الخاص (Yachts by Cavo) · 01286666482",
    },
  },
  {
    id: "nightlife",
    questionTag: { en: "Nightlife", ar: "سهر وأجواء راقية" },
    title: {
      en: "Nightlife & Elevated Dinner",
      ar: "أجواء السهر والعشاء الهادئ",
    },
    subtitle: {
      en: "Candlelit booths, ambient lamps, refined dining, and late-night rhythm until 4:00 AM.",
      ar: "بوثات بإضاءة خافتة، أطباق مميزة، وموسيقى مسائية حتى 4:00 فجراً.",
    },
    recommendedVenue: "elite",
    recommendationNote: {
      en: "Recommended: CAVO Elite · Dedicated Desk (+20 121 201 1201)",
      ar: "الاختيار الأنسب: كافو إيليت (CAVO Elite) · 01212011201",
    },
  },
];

export interface FaqItem {
  id: string;
  question: LocalizedString;
  answer: LocalizedString;
}

export const faqItems: FaqItem[] = [
  {
    id: "difference",
    question: {
      en: "What distinguishes Main Restaurant, Boat, Private Yacht, and Elite?",
      ar: "ما الفرق بين المطعم الرئيسي، المركب (Boat)، اليخت الخاص، وإيليت (Elite)؟",
    },
    answer: {
      en: "All four experiences are part of CAVO Island at Nile City Boat, Zamalek. Main Restaurant offers indoor all-day dining (8:00 AM–4:00 AM); Boat delivers open-air riverside tables directly above the Nile; Private Yacht (Yachts by Cavo) provides private chartered Nile cruises arranged per inquiry; and Elite offers a quieter, candlelit fine-dining and late-night lounge setting.",
      ar: "التجارب الأربع تتبع علامة كافو آيلاند في مركب نايل سيتي بالزمالك: المطعم الرئيسي يقدّم الضيافة طوال اليوم داخل القاعة المعمارية؛ المركب (Boat) يوفر جلسات مفتوحة في الهواء الطلق مباشرة على النيل؛ اليخت الخاص (Yachts by Cavo) يختص بالرحلات والحفلات الخاصة؛ وإيليت (Elite) يقدّم تجربة عشاء وسهر أكثر هدوءاً وفخامة.",
    },
  },
  {
    id: "taxes",
    question: {
      en: "Are service charge and VAT included in the listed menu prices?",
      ar: "هل أسعار المنيو تشمل رسوم الخدمة والضريبة؟",
    },
    answer: {
      en: "Per CAVO's official digital menu, listed prices are in EGP before a 12% service charge and 14% VAT. Our interactive menu includes a transparent pre-visit estimator showing subtotal, 12% service, and 14% VAT.",
      ar: "كما هو موضح في المنيو الرسمي: الأسعار المعلنة بالجنيه المصري قبل إضافة 12% خدمة و14% ضريبة قيمة مضافة. أضفنا في صفحة المنيو حاسبة تقديرية توضّح المبلغ النهائي بشفافية قبل الطلب.",
    },
  },
  {
    id: "location",
    question: {
      en: "Where is CAVO Island located?",
      ar: "أين يقع كافو آيلاند بالتحديد؟",
    },
    answer: {
      en: "CAVO Island is located aboard Nile City Boat along the Zamalek Nile Corniche in Cairo, Egypt. Use the Directions button on this page to open the route directly in Google Maps.",
      ar: "يقع كافو آيلاند على متن مركب نايل سيتي بكورنيش الزمالك، القاهرة. اضغط على زر (افتح الاتجاهات) لفتح المسار مباشرة على خرائط جوجل.",
    },
  },
  {
    id: "parking",
    question: {
      en: "Is parking or valet available near Nile City Boat?",
      ar: "هل تتوافر مواقف سيارات أو خدمة Valet أمام المركب؟",
    },
    answer: {
      en: "Parking and valet arrangements along the corniche can vary by evening peak hours—please ask our host team when confirming your reservation so they can advise the smoothest arrival option.",
      ar: "تختلف خيارات الركن والـ Valet على الكورنيش حسب التوقيت والذروة؛ يُرجى سؤال فريق الاستقبال عند تأكيد الحجز لإرشادك لأسهل مدخل وموقف متاح.",
    },
  },
  {
    id: "confirmations",
    question: {
      en: "Does submitting the booking form confirm my table immediately?",
      ar: "هل إرسال نموذج الحجز عبر الموقع يعني تأكيد الطاولة تلقائياً؟",
    },
    answer: {
      en: "Submitting prepares an organized reservation request routed to the dedicated WhatsApp desk for your chosen venue. Live table or yacht availability is not automated yet—your reservation becomes confirmed only once our host team replies.",
      ar: "إرسال النموذج يجهّز طلب حجز منظم ويوجّهه مباشرة لرقم الواتساب الخاص بالوجهة المختارة. لا توجد أتمتة لحظية لتوافر الطاولات، ويُعتبر الحجز مؤكداً فقط بعد رد فريق الاستقبال.",
    },
  },
  {
    id: "hours",
    question: {
      en: "What are CAVO's opening hours?",
      ar: "ما هي مواعيد العمل في كافو؟",
    },
    answer: {
      en: "CAVO's published schedule runs daily from 8:00 AM to 4:00 AM (with 24/7 hospitality noted on CAVO's official Instagram profile). Private Yacht cruises are scheduled directly upon charter inquiry.",
      ar: "مواعيد العمل المنشورة يومياً من 8:00 صباحاً حتى 4:00 فجراً (كما يُشار على إنستغرام كافو إلى خدمة ممتدة 24/7). مواعيد اليخت الخاص تُنسّق بالطلب المسبق.",
    },
  },
];

export const navCopy: Record<
  Locale,
  {
    home: string;
    experiences: string;
    menu: string;
    privateEvents: string;
    gallery: string;
    contact: string;
    reserve: string;
    reserveShort: string;
    switchLabel: string;
  }
> = {
  en: {
    home: "Home",
    experiences: "Experiences",
    menu: "Menu",
    privateEvents: "Private Events",
    gallery: "Gallery",
    contact: "Contact",
    reserve: "Reserve",
    reserveShort: "Book",
    switchLabel: "العربية",
  },
  ar: {
    home: "الرئيسية",
    experiences: "التجارب",
    menu: "المنيو",
    privateEvents: "المناسبات الخاصة",
    gallery: "المعرض",
    contact: "تواصل معنا",
    reserve: "احجز الآن",
    reserveShort: "احجز",
    switchLabel: "English",
  },
};
