import type {
  PrivateYachtInquiryFormat,
  VenueData,
} from "@/types/cavo";

export type { VenueSlug } from "@/types/cavo";

export const venues: VenueData[] = [
  {
    slug: "main-restaurant",
    number: "01",
    name: {
      en: "Main Restaurant",
      ar: "المطعم الرئيسي",
    },
    role: {
      en: "All-Day Dining & Lounge",
      ar: "ضيافة طوال اليوم",
    },
    tagline: {
      en: "Sunlit Nile mornings flowing into warm timber-pergola evenings.",
      ar: "صباحات مشمسة على النيل تمتد إلى أمسيات دافئة تحت البرجولا الخشبية.",
    },
    shortDesc: {
      en: "Breakfast, specialty coffee, main kitchen signatures, and live entertainment inside CAVO's architectural dining hall.",
      ar: "فطار، قهوة مختصة، أطباق المطبخ الرئيسية، وليالي موسيقية حية داخل التصميم المعماري الدافئ لكافو.",
    },
    fullStory: {
      en: "The architectural anchor of CAVO Island aboard Nile City Boat, Zamalek. Framed by warm natural timber beams, botanical planters, and sculptural curved ivory booths, Main Restaurant welcomes guests from 8:00 AM Nile-edge breakfasts through daytime lunches, afternoon coffee, and evening table gatherings featuring live music and match screenings.",
      ar: "القلب المعماري لكافو آيلاند على متن مركب نايل سيتي بالزمالك. تصميم يجمع بين الأسقف الخشبية الدافئة والنباتات الطبيعية والجلسات المنحنية الأنيقة، ليبدأ يومك من فطار الثامنة صباحاً على النيل ويمتد عبر الغداء والقهوة حتى أمسيات الطرب الحي ومشاهدة المباريات الكبرى.",
    },
    heroImage: "/media/hero/main-evening.jpg",
    cardImage: "/media/hero/main-day.jpg",
    gallery: [
      {
        src: "/media/hero/main-day.jpg",
        alt: {
          en: "Sunlit Main Restaurant interior with timber pergola and ivory booths",
          ar: "قاعة المطعم الرئيسي في ضوء النهار بتصميم البرجولا الخشبية",
        },
      },
      {
        src: "/media/hero/main-terrace.jpg",
        alt: {
          en: "Nile-edge Egyptian breakfast spread on CAVO placemats",
          ar: "طاولة فطار مصري متكاملة مباشرة على إطلالة النيل",
        },
      },
      {
        src: "/media/venues/main-restaurant/night-dining-hall.jpg",
        alt: {
          en: "Evening dining service inside CAVO Island Zamalek",
          ar: "الأجواء المسائية داخل المطعم الرئيسي بالزمالك",
        },
      },
      {
        src: "/media/venues/main-restaurant/interior-blossom.webp",
        alt: {
          en: "Curved seating around the red blossom centerpiece",
          ar: "الجلسات الدائرية حول شجرة الزهور المميزة",
        },
      },
      {
        src: "/media/gallery/takhtista-live.jpg",
        alt: {
          en: "TAKHTISTA live acoustic oriental music performance at CAVO",
          ar: "أجواء الموسيقى الشرقية الحية مع تختيستا في كافو",
        },
      },
      {
        src: "/media/gallery/interior-wave-wall.jpg",
        alt: {
          en: "Sculpted CAVO backlit feature wall and dining tables",
          ar: "الجدار المضيء بشعار كافو ومنطقة الطاولات",
        },
      },
    ],
    hours: {
      en: "Daily · 8:00 AM – 4:00 AM",
      ar: "يومياً · 8:00 صباحاً – 4:00 فجراً",
    },
    bestFor: {
      en: [
        "Morning Nile Breakfast",
        "Daytime & Family Lunches",
        "Specialty Coffee & Desserts",
        "Live Music & Match Screenings",
      ],
      ar: [
        "فطار الصباح على النيل",
        "غداء العائلات والأصدقاء",
        "القهوة المختصة والحلويات",
        "ليالي الطرب والمباريات",
      ],
    },
    seatingOptions: [
      {
        id: "nile-window",
        label: {
          en: "Nile Window Preference (subject to availability)",
          ar: "تفضيل طاولة مطلة على النيل (حسب التوافر)",
        },
        requiresConfirmation: true,
      },
      {
        id: "indoor-pergola",
        label: {
          en: "Indoor Timber Hall",
          ar: "القاعة الداخلية الرئيسية",
        },
      },
      {
        id: "terrace-edge",
        label: {
          en: "Riverside Edge Table",
          ar: "طاولة قريبة من المياه",
        },
        requiresConfirmation: true,
      },
    ],
    highlights: {
      en: [
        "31 breakfast selections served from morning hours",
        "Complete kitchen: Grills, Tajins, Pasta, Pizza & Salads",
        "Live acoustic nights featured on @cavoisland (TAKHTISTA & Cassette 90s)",
        "Live match screenings and shisha menu available",
      ],
      ar: [
        "31 صنفاً في قسم الفطار من ساعات الصباح الأولى",
        "مطبخ متكامل: مشاوي، طواجن، باستا، بيتزا وسلطات",
        "سهرات موسيقية حية منشورة على @cavoisland (تختيستا وكاسيت 90s)",
        "شاشات عرض للمباريات الكبرى وخدمة شيشة",
      ],
    },
    atmosphereTheme: "warm",
    instagramHandle: "@cavoisland",
    instagramUrl: "https://www.instagram.com/cavoisland/",
    whatsappDigits: "201286666483",
    phoneDisplay: "+20 128 666 6483",
  },
  {
    slug: "boat",
    number: "02",
    name: {
      en: "Boat",
      ar: "المركب (Boat)",
    },
    role: {
      en: "Open-Air Riverside Evenings",
      ar: "أمسيات مفتوحة على النيل",
    },
    tagline: {
      en: "Open skies, river breeze, and Cairo's illuminated skyline at water level.",
      ar: "سماء مفتوحة، نسمة النيل، وإطلالة مباشرة على أضواء القاهرة من على السطح.",
    },
    shortDesc: {
      en: "Open-air social seating directly above the Nile aboard Nile City Boat—crafted for sunset drinks, passing riverboats, and breezy evenings.",
      ar: "جلسات مفتوحة على ضفة النيل مباشرة فوق مركب نايل سيتي، مصممة لوقت الغروب والسهر وسط أضواء النهر.",
    },
    fullStory: {
      en: "CAVO's Boat experience seats guests right along the open-air riverside deck in Zamalek. By afternoon, sunlight reflects off passing Nile boats alongside cold mocktails and coffees; after sunset, timber deck lanterns glow against Cairo's night skyline for an unhurried outdoor gathering directly on the water.",
      ar: "تجربة المركب تضعك مباشرة في الهواء الطلق على ضفة الزمالك. عصراً تتلألأ المياه أمام المراكب المارة مع المشروبات الباردة والقهوة، وبعد الغروب تنعكس أضواء السطح الخشبي مع أفق القاهرة الليلي لأمسية اجتماعية مفتوحة مباشرة على النيل.",
    },
    heroImage: "/media/hero/boat-nile-sunset.jpg",
    cardImage: "/media/hero/boat-nile-night.jpg",
    gallery: [
      {
        src: "/media/hero/boat-nile-sunset.jpg",
        alt: {
          en: "Nile City Boat illuminated at golden hour facing Cairo Tower",
          ar: "مركب نايل سيتي في ساعة الغروب أمام برج القاهرة",
        },
      },
      {
        src: "/media/hero/boat-nile-night.jpg",
        alt: {
          en: "CAVO Boat glowing along the Zamalek Nile waterfront at night",
          ar: "أضواء مركب كافو ليلاً على ضفاف النيل بالزمالك",
        },
      },
      {
        src: "/media/hero/boat-nile-day.jpg",
        alt: {
          en: "Sunlit open-air Nile City Boat deck with passing feluccas",
          ar: "سطح مركب نايل سيتي المفتوح نهاراً أمام المراكب الشراعية",
        },
      },
      {
        src: "/media/venues/boat/nile-terrace-day.jpg",
        alt: {
          en: "Daytime open-air Nile terrace at Zamalek",
          ar: "تراس المركب المفتوح بالنهار على نيل الزمالك",
        },
      },
      {
        src: "/media/venues/boat/boat-lounge-sofas.jpg",
        alt: {
          en: "Sofa seating along the riverboat deck",
          ar: "جلسات الكنب المريحة بطول المركب",
        },
      },
    ],
    hours: {
      en: "Daily · 8:00 AM – 4:00 AM",
      ar: "يومياً · 8:00 صباحاً – 4:00 فجراً",
    },
    bestFor: {
      en: [
        "Golden Hour & Sunset Mocktails",
        "Open-Air Riverside Evenings",
        "Social Group Gatherings",
        "Shisha & Late-Night Breeze",
      ],
      ar: [
        "مشروبات الغروب والنسمة المفتوحة",
        "أمسيات الهواء الطلق على النيل",
        "تجمعات الأصدقاء",
        "الشيشة وسهرات الليل المفتوحة",
      ],
    },
    seatingOptions: [
      {
        id: "open-railing",
        label: {
          en: "Railing Waterline Preference",
          ar: "تفضيل طاولة ملاصقة لسور النيل",
        },
        requiresConfirmation: true,
      },
      {
        id: "boat-sofa",
        label: { en: "Open-Air Lounge Sofa", ar: "كنبة لاونج مفتوحة" },
      },
      {
        id: "sunset-terrace",
        label: { en: "Sunset Terrace Deck", ar: "تراس الغروب" },
      },
    ],
    highlights: {
      en: [
        "Direct open-air riverside deck on Nile City Boat",
        "Full food, specialty coffee, mocktail & shisha menu available",
        "Unobstructed Zamalek skyline and riverboat views",
        "Included cleanly in our online reservation selector",
      ],
      ar: [
        "جلسات مفتوحة مباشرة على النيل فوق مركب نايل سيتي",
        "تقديم المنيو الكامل والقهوة والموكتيلات والشيشة",
        "إطلالة مفتوحة على كورنيش الزمالك وأضواء القاهرة",
        "متاحة للحجز الإلكتروني المباشر مع تأكيد الاستقبال",
      ],
    },
    atmosphereTheme: "sunset",
    instagramHandle: "@cavoisland",
    instagramUrl: "https://www.instagram.com/cavoisland/",
    whatsappDigits: "201286666483",
    phoneDisplay: "+20 128 666 6483",
  },
  {
    slug: "private-yacht",
    number: "03",
    name: {
      en: "Private Yacht",
      ar: "اليخت الخاص",
    },
    role: {
      en: "Yachts by Cavo · Private Charters",
      ar: "يخوت كافو · رحلات وحفلات خاصة",
    },
    tagline: {
      en: "Your own private escape gliding past Cairo's skyline.",
      ar: "تجربتك الخاصة والمستقلة تُبحر بك أمام معالم القاهرة.",
    },
    shortDesc: {
      en: "Bespoke Nile yacht charters via Yachts by Cavo for birthdays, intimate dinners, and private group celebrations—tailored directly upon inquiry.",
      ar: "رحلات يخت خاصة عبر Yachts by Cavo لأعياد الميلاد، العزومات الراقية، والمناسبات الخاصة — تُنسّق تفاصيلها مباشرة حسب طلبك.",
    },
    fullStory: {
      en: "Yachts by Cavo brings CAVO's hospitality out onto the water aboard a dedicated Nile cruiser featuring curved leather lounge booths, full onboard table service, and panoramic skyline views toward Cairo Tower. Because guest counts, sailing durations, and menu spreads vary by celebration, every charter is arranged directly with our dedicated Yachts by Cavo reservations line (+20 128 666 6482).",
      ar: "تقدّم Yachts by Cavo تجربة كافو كاملةً أثناء الإبحار على النيل داخل جلسات جلدية دائرية مريحة مع تقديم الطعام والمشروبات على متن اليخت وإطلالة مباشرة على برج القاهرة. وبما أن تفاصيل كل مناسبة (المدة، عدد الضيوف، وتجهيز المنيو) تختلف من حجز لآخر، يتم تنسيق كل رحلة مباشرة عبر خط يخوت كافو المخصص (+201286666482).",
    },
    heroImage: "/media/venues/private-yacht/yacht-night-dinner.jpg",
    cardImage: "/media/venues/private-yacht/yacht-exterior.jpg",
    gallery: [
      {
        src: "/media/venues/private-yacht/yacht-exterior.jpg",
        alt: {
          en: "Yachts by Cavo cruiser on the Nile in Cairo",
          ar: "اليخت الخاص من كافو على صفحة النيل",
        },
      },
      {
        src: "/media/venues/private-yacht/yacht-night-dinner.jpg",
        alt: {
          en: "Night dining table aboard Yachts by Cavo facing Cairo Tower",
          ar: "عشاء ليلي على متن اليخت الخاص أمام برج القاهرة",
        },
      },
      {
        src: "/media/venues/private-yacht/yacht-deck-day.jpg",
        alt: {
          en: "Curved tan leather booth & daytime lunch spread on board",
          ar: "الجلسة الجلدية المميزة وسفرة الغداء أثناء الإبحار نهاراً",
        },
      },
      {
        src: "/media/venues/private-yacht/yacht-dining-table.jpg",
        alt: {
          en: "Wood-fired pizza, starters, and drinks served aboard Yachts by Cavo",
          ar: "بيتزا ومقبلات ومشروبات تُقدم طازجة على متن اليخت",
        },
      },
      {
        src: "/media/venues/private-yacht/yacht-nile-cruise.jpg",
        alt: {
          en: "Daytime cruise view past Cairo Opera & Zamalek waterfront",
          ar: "إطلالة الإبحار النهاري أمام أوبرا القاهرة والزمالك",
        },
      },
    ],
    hours: {
      en: "By Charter Inquiry · Confirm Sailing Hours Directly",
      ar: "بالحجز المسبق · تُحدد مواعيد الإبحار بالتنسيق المباشر",
    },
    bestFor: {
      en: [
        "Birthdays & Milestones",
        "Proposals & Anniversaries",
        "Private Family Dinners",
        "Executive & Group Hosting",
      ],
      ar: [
        "أعياد الميلاد والمناسبات الخاصة",
        "الخطوبة والمناسبات الرومانسية",
        "عزومات العائلة الخاصة",
        "استضافة المجموعات والشركات",
      ],
    },
    seatingOptions: [
      {
        id: "private-charter-inquiry",
        label: {
          en: "Private Charter Inquiry (Custom Arrangement)",
          ar: "استفسار رحلة يخت خاصة (تنسيق كامل)",
        },
        requiresConfirmation: true,
      },
      {
        id: "sunset-cruise-pref",
        label: {
          en: "Sunset Timeframe Preference",
          ar: "تفضيل توقيت الغروب",
        },
        requiresConfirmation: true,
      },
      {
        id: "night-cruise-pref",
        label: {
          en: "Night Skyline Preference",
          ar: "تفضيل الإبحار الليلي",
        },
        requiresConfirmation: true,
      },
    ],
    highlights: {
      en: [
        "Dedicated Yachts by Cavo concierge line (+20 128 666 6482)",
        "Curved leather onboard booths & full dining table service",
        "Custom food spreads from CAVO's kitchen",
        "Vessel capacity, duration & rates confirmed per inquiry",
      ],
      ar: [
        "خط تنسيق مخصص ليخوت كافو (+201286666482)",
        "جلسات جلدية فاخرة وتجهيز طاولات طعام على متن اليخت",
        "إمكانية تنسيق سفرة كاملة من مطبخ كافو",
        "تأكيد السعة والمدة والتكلفة مباشرة عند الاستفسار",
      ],
    },
    atmosphereTheme: "nile",
    instagramHandle: "@yachtsbycavo",
    instagramUrl: "https://www.instagram.com/yachtsbycavo/",
    whatsappDigits: "201286666482",
    phoneDisplay: "+20 128 666 6482",
  },
  {
    slug: "elite",
    number: "04",
    name: {
      en: "Elite",
      ar: "إيليت (Elite)",
    },
    role: {
      en: "From Lunch to Late-Night Luxury",
      ar: "فخامة الضيافة من الغداء حتى السهر",
    },
    tagline: {
      en: "Elevate your experience on the Nile with intimate lighting and polished dining.",
      ar: "ارتقِ بتجربتك على النيل وسط إضاءة خافتة وأطباق فاخرة وجلسات راقية.",
    },
    shortDesc: {
      en: "CAVO Elite offers upholstered Nile window booths, ambient table lamps, signature mains, and an elevated atmosphere from lunch to late night.",
      ar: "تجربة CAVO Elite تجمع بين البوثات المطلة على النيل، الإضاءة الحميمية بالمصابيح السوداء، الأطباق الفاخرة، وأجواء السهر الراقية.",
    },
    fullStory: {
      en: "Designed for guests seeking a quieter, more elevated setting within the CAVO collection at Nile City Boat. From sunlit riverside lunches to dimly lit late-night tables accented with matte-black lamps, cloth napkins, steaks, seafood spreads, and refined music, CAVO Elite operates with its own dedicated guest desk (+20 121 201 1201).",
      ar: "كافو إيليت صُمم للضيوف الباحثين عن خصوصية أعلى وهدوء راقٍ داخل مركب نايل سيتي. من غداء مطل على نوافذ النيل إلى عشاء على أضواء المصابيح الخافتة وأطباق الستيك والمأكولات البحرية والموسيقى المختارة، مع فريق استقبال وواتساب مخصص لتأكيد طاولتك (+201212011201).",
    },
    heroImage: "/media/hero/main-evening.jpg",
    cardImage: "/media/hero/main-evening.jpg",
    gallery: [
      {
        src: "/media/venues/elite/elite-night-dinner.jpg",
        alt: {
          en: "CAVO Elite evening dinner table with black lamps overlooking the Nile",
          ar: "عشاء في كافو إيليت مع الإضاءة الخافتة وإطلالة النيل الليلية",
        },
      },
      {
        src: "/media/venues/elite/elite-window-feast.jpg",
        alt: {
          en: "Upholstered Nile window booth with full CAVO Elite spread",
          ar: "بوث مبطن أمام النوافذ البانورامية مع سفرة كافو إيليت",
        },
      },
      {
        src: "/media/venues/elite/elite-day-lounge.jpg",
        alt: {
          en: "From lunch to dinner riverside view inside CAVO Elite",
          ar: "إطلالة الغداء والعشاء المطلة على النيل داخل كافو إيليت",
        },
      },
      {
        src: "/media/venues/elite/elite-skyline-night.jpg",
        alt: {
          en: "Late-night Zamalek skyline from CAVO Elite",
          ar: "أجواء السهر الليلية وأفق الزمالك المضيء من كافو إيليت",
        },
      },
      {
        src: "/media/venues/elite/cavo-sign-glow.jpg",
        alt: {
          en: "Warm backlit CAVO emblem beside signature table service",
          ar: "شعار كافو المضيء بجانب طاولة الضيافة",
        },
      },
      {
        src: "/media/venues/elite/lounge-bar.webp",
        alt: {
          en: "After-dark lounge atmosphere at CAVO",
          ar: "إضاءة اللاونج الليلي داخل كافو",
        },
      },
    ],
    hours: {
      en: "From Lunch to Late Night · Until 4:00 AM",
      ar: "من الغداء حتى السهر المتأخر · يومياً حتى 4:00 فجراً",
    },
    bestFor: {
      en: [
        "Elevated Date Nights",
        "Fine Lunch & Dinner Spreads",
        "After-Dark Refined Lounge",
        "Private Celebratory Tables",
      ],
      ar: [
        "سهرات وعشاء راقٍ",
        "غداء وعشاء بطابع خاص",
        "أجواء لاونج ليلية هادئة",
        "طاولات الاحتفالات الخاصة",
      ],
    },
    seatingOptions: [
      {
        id: "elite-window-booth",
        label: {
          en: "Upholstered Nile Window Booth",
          ar: "بوث مطل على النيل",
        },
        requiresConfirmation: true,
      },
      {
        id: "elite-dinner-table",
        label: {
          en: "Candlelit Dinner Table",
          ar: "طاولة عشاء بإضاءة هادئة",
        },
      },
      {
        id: "elite-lounge-area",
        label: {
          en: "Late-Night Lounge Section",
          ar: "منطقة اللاونج الليلية",
        },
        requiresConfirmation: true,
      },
    ],
    highlights: {
      en: [
        "Dedicated Elite WhatsApp (+20 121 201 1201) & call line (+20 121 202 1202)",
        "From Lunch to Dinner & Late-Night hospitality",
        "Plush riverside booths with ambient table lamps",
        "Curated music atmosphere in Zamalek",
      ],
      ar: [
        "خط واتساب مخصص لإيليت (201212011201+) وخط اتصال (201212021202+)",
        "تجربة متكاملة من الغداء حتى السهر المتأخر",
        "بوثات بانورامية مريحة مع مصابيح طاولات خافتة",
        "أجواء موسيقية مختارة في قلب الزمالك",
      ],
    },
    atmosphereTheme: "dark",
    instagramHandle: "@cavoelite",
    instagramUrl: "https://www.instagram.com/cavoelite/",
    whatsappDigits: "201212011201",
    phoneDisplay: "+20 121 201 1201",
    secondaryPhoneDisplay: "+20 121 202 1202",
  },
];

export const privateYachtInquiryFormats: PrivateYachtInquiryFormat[] = [
  {
    id: "sunset-gathering",
    name: {
      en: "Golden Hour & Sunset Charter",
      ar: "استفسار رحلة ساعة الغروب",
    },
    subtitle: {
      en: "Designed around Cairo's golden-hour light for proposals, anniversaries, and intimate celebrations.",
      ar: "مصممة حول ألوان الغروب على النيل لطلبات الخطوبة، أعياد الزواج، والتجمعات الخاصة.",
    },
    confirmationNote: {
      en: "Sailing duration, guest capacity & pricing confirmed upon inquiry",
      ar: "تُحدد المدة، السعة، والتكلفة بالتنسيق المباشر مع فريق اليخوت",
    },
    suggestedFocus: {
      en: [
        "Departure coordination from Nile City Boat, Zamalek",
        "Optional menu spreads from CAVO's kitchen",
        "Direct consultation via +20 128 666 6482",
      ],
      ar: [
        "تنسيق الصعود من مرسى نايل سيتي بالزمالك",
        "إمكانية تجهيز ضيافة وطعام من مطبخ كافو",
        "تنسيق مباشر عبر خط 01286666482",
      ],
    },
  },
  {
    id: "milestone-birthday",
    name: {
      en: "Birthday & Private Celebration",
      ar: "استفسار حفل عيد ميلاد أو احتفال خاص",
    },
    subtitle: {
      en: "Tailored cruise gatherings with shared dining spreads, curved leather seating, and Nile views.",
      ar: "تجمعات احتفالية على متن اليخت مع طاولات مشاركة وجلسات جلدية وإطلالة النيل.",
    },
    confirmationNote: {
      en: "Custom setup & menu arrangements confirmed directly",
      ar: "تُؤكد تفاصيل التجهيز والمنيو مباشرة مع إدارة اليخوت",
    },
    suggestedFocus: {
      en: [
        "Flexible morning, sunset, or night time slot requests",
        "Shared dining options (pizzas, grills, appetizers & drinks)",
        "Custom styling & music requests noted for team review",
      ],
      ar: [
        "مرونة اختيار الفترة (نهارية، غروب، أو ليلية)",
        "خيارات ضيافة متنوعة للمجموعات من المنيو الرسمي",
        "إمكانية إضافة متطلبات التجهيز والموسيقى في الاستفسار",
      ],
    },
  },
  {
    id: "corporate-hosting",
    name: {
      en: "VIP & Executive Nile Hosting",
      ar: "استفسار استضافة شركات وكبار الشخصيات",
    },
    subtitle: {
      en: "Private cruising hospitality along Zamalek's waterfront for executive dinners and visiting partners.",
      ar: "ضيافة نيلية خاصة على كورنيش الزمالك لعشاء العمل واستضافة الشركاء والوفود.",
    },
    confirmationNote: {
      en: "Tailored quote & confirmed schedule provided by Yachts by Cavo",
      ar: "يُقدّم عرض السعر والتفاصيل الرسمية بعد مراجعة الطلب",
    },
    suggestedFocus: {
      en: [
        "Private onboard table arrangement facing Cairo Tower",
        "Transparent menu pricing (+12% service & 14% VAT)",
        "Single point of contact for arrival & hosting",
      ],
      ar: [
        "توزيع طاولات خاص أمام برج القاهرة والزمالك",
        "شفافية كاملة في تسعير المنيو (+12% خدمة و14% ضريبة)",
        "منسّق متابعة واحد للاستقبال والضيافة",
      ],
    },
  },
];

export function getVenueBySlug(slug: string): VenueData | undefined {
  return venues.find((v) => v.slug === slug);
}
