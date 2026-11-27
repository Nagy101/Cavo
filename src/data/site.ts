import type {
  BusinessConfirmationField,
  FutureFeaturesConfig,
  LocalizedString,
  VenueContactLine,
} from "@/types/cavo";

export const SERVICE_RATE = 0.12;
export const VAT_RATE = 0.14;

export const futureFeaturesConfig: FutureFeaturesConfig = {
  virtualTour360: {
    enabled: false,
    providerUrl: null,
    supportedVenues: ["main-restaurant", "private-yacht"],
  },
  interactiveSeatingLive: {
    enabled: false,
    liveAvailabilityApiUrl: null,
  },
  eventPackages: {
    enabled: false,
    verifiedPackagesAvailable: false,
  },
  giftExperiences: {
    enabled: false,
    voucherPortalUrl: null,
  },
};

export const businessConfirmationRegistry: Record<
  | "parkingAndValet"
  | "privateYachtCapacityAndRates"
  | "minimumSpendPolicy"
  | "officialEventPackages"
  | "liveReservationApi",
  BusinessConfirmationField<string>
> = {
  parkingAndValet: {
    value: null,
    confirmationStatus: "requires_business_confirmation",
    note: {
      en: "Parking and valet availability along Nile City Boat corniche should be confirmed with the host desk when booking.",
      ar: "يُرجى التأكد من توافر خدمة ركن السيارات (Valet) أمام مركب نايل سيتي عند تأكيد الحجز مع فريق الاستقبال.",
    },
  },
  privateYachtCapacityAndRates: {
    value: null,
    confirmationStatus: "requires_business_confirmation",
    note: {
      en: "Maximum guest capacity, hourly charter rates, and sailing routes are confirmed per vessel directly with Yachts by Cavo (+20 128 666 6482).",
      ar: "السعة القصوى للضيوف وتكلفة الإبحار بالساعة تُحدد وتُؤكد مباشرة حسب اليخت المتاح عبر خط Yachts by Cavo (+20 128 666 6482).",
    },
  },
  minimumSpendPolicy: {
    value: null,
    confirmationStatus: "requires_business_confirmation",
    note: {
      en: "Any weekend, live-night, or Elite minimum-spend policy is communicated directly by the venue host desk prior to final confirmation.",
      ar: "أي سياسة حد أدنى للإنفاق (Minimum Spend) في السهرات أو إيليت تُوضح مسبقاً عبر فريق الاستقبال قبل تأكيد الحجز.",
    },
  },
  officialEventPackages: {
    value: null,
    confirmationStatus: "requires_business_confirmation",
    note: {
      en: "Every private event and yacht charter is tailored to your guest count, styling, and dining preferences directly with our events desk.",
      ar: "كل مناسبة خاصة أو رحلة يخت تُصمّم بالكامل حسب عدد الضيوف، التجهيزات، وقائمة الضيافة بالتنسيق المباشر مع فريق المناسبات.",
    },
  },
  liveReservationApi: {
    value: null,
    confirmationStatus: "requires_business_confirmation",
    note: {
      en: "Every reservation request is reviewed personally by our host desk aboard Nile City Boat to confirm your preferred waterside table.",
      ar: "يُراجع فريق الاستقبال على مركب نايل سيتي كل طلب حجز شخصياً لتأكيد أفضل طاولة متاحة على النيل.",
    },
  },
};

export const siteConfig = {
  brandName: {
    en: "CAVO Island",
    ar: "كافو آيلاند",
  } satisfies LocalizedString,
  shortBrand: "CAVO",
  tagline: {
    en: "Four Nile venues. One CAVO experience.",
    ar: "أربع تجارب على النيل. وجهة كافو واحدة.",
  } satisfies LocalizedString,
  address: {
    en: "Nile City Boat, Zamalek, Cairo, Egypt",
    ar: "مركب نايل سيتي، الزمالك، القاهرة، مصر",
  } satisfies LocalizedString,
  landmarkNote: {
    en: "Moored along the Zamalek Nile Corniche aboard Nile City Boat, Cairo.",
    ar: "على كورنيش الزمالك بالنيل على متن مركب نايل سيتي، القاهرة.",
  } satisfies LocalizedString,
  hours: {
    en: "Daily · 8:00 AM – 4:00 AM",
    ar: "يومياً · 8:00 صباحاً – 4:00 فجراً",
  } satisfies LocalizedString,
  hoursInstagramNote: {
    en: "Published website schedule: 8:00 AM – 4:00 AM daily (Instagram bio also notes 24/7 hospitality availability).",
    ar: "مواعيد الموقع الرسمية: يومياً من 8:00 صباحاً حتى 4:00 فجراً (مع الإشارة على إنستغرام لاستقبال على مدار الساعة).",
  } satisfies LocalizedString,
  email: "cavo.island@gmail.com",
  taxNotice: {
    en: "Published menu prices are in EGP before 12% service charge and 14% VAT.",
    ar: "الأسعار المعلنة بالمنيو بالجنيه المصري قبل إضافة 12% خدمة و14% ضريبة قيمة مضافة.",
  } satisfies LocalizedString,
  taxBadgeShort: {
    en: "+ 12% service & 14% VAT",
    ar: "يضاف 12% خدمة و 14% ضريبة",
  } satisfies LocalizedString,
  mapsEmbedUrl:
    "https://www.google.com/maps?q=Nile+City+Boat+Zamalek+Cairo+Egypt&output=embed",
  mapsDirectionsUrl:
    "https://www.google.com/maps/search/?api=1&query=Nile+City+Boat+Zamalek+Cairo+Egypt",
  masterQrMenuUrl: {
    en: "https://master-qr.com/en/luxury_menu/01KDX2VH4A9GYTS53YPETQ20M5",
    ar: "https://master-qr.com/ar/luxury_menu/01KDX2VH4A9GYTS53YPETQ20M5",
  },
  socials: {
    instagramMain: "https://www.instagram.com/cavoisland/",
    instagramReviewsHighlight:
      "https://www.instagram.com/stories/highlights/17908453455254555/",
    instagramYachts: "https://www.instagram.com/yachtsbycavo/",
    instagramElite: "https://www.instagram.com/cavoelite/",
    facebook: "https://www.facebook.com/profile.php?id=61567454540007",
    tiktok: "https://www.tiktok.com/@cavoislandeg",
    heylink: "https://heylink.me/CAVO_ISLAND/",
  },
  contactLines: [
    {
      id: "main",
      label: {
        en: "Main Restaurant & Boat",
        ar: "المطعم الرئيسي والمركب",
      },
      phoneDisplay: "+20 128 666 6483",
      telHref: "tel:+201286666483",
      whatsappDigits: "201286666483",
    },
    {
      id: "yacht",
      label: {
        en: "Yachts by Cavo",
        ar: "يخوت كافو (Yachts by Cavo)",
      },
      phoneDisplay: "+20 128 666 6482",
      telHref: "tel:+201286666482",
      whatsappDigits: "201286666482",
    },
    {
      id: "elite",
      label: {
        en: "CAVO Elite",
        ar: "كافو إيليت (CAVO Elite)",
      },
      phoneDisplay: "+20 121 201 1201",
      telHref: "tel:+201212011201",
      whatsappDigits: "201212011201",
      secondaryPhoneDisplay: "+20 121 202 1202",
      secondaryTelHref: "tel:+201212021202",
    },
  ] satisfies VenueContactLine[],
};

export function buildWhatsAppUrl(digits: string, message: string): string {
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}

export function getSiteBaseUrl(): string {
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/+$/, "");
  }
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  return "https://www.cavo-island.com";
}
