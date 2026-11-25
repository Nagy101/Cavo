import type {
  DietaryTag,
  MenuCategory,
  MenuItem,
} from "@/types/cavo";
import type { Locale } from "@/lib/i18n";

export type {
  DietaryTag,
  MenuCategory,
  MenuCategoryId,
  MenuItem,
} from "@/types/cavo";

export const menuCategories: MenuCategory[] = [
  {
    id: "breakfast",
    label: { en: "Breakfast & Brunch", ar: "الإفطار والبرانش" },
    totalItemsInFullMenu: 31,
  },
  {
    id: "soups-salads",
    label: { en: "Soups & Salads", ar: "الشوربة والسلطات" },
    totalItemsInFullMenu: 16,
  },
  {
    id: "appetizers",
    label: { en: "Cold & Hot Appetizers", ar: "المقبلات" },
    totalItemsInFullMenu: 37,
  },
  {
    id: "tajins-mains",
    label: { en: "Tajins & Mains", ar: "الطواجن والأطباق الرئيسية" },
    totalItemsInFullMenu: 35,
  },
  {
    id: "grills",
    label: { en: "Grills", ar: "المشاوي" },
    totalItemsInFullMenu: 12,
  },
  {
    id: "pizza-pasta",
    label: { en: "Pizza, Pasta & Sandwiches", ar: "بيتزا، باستا وسندويشات" },
    totalItemsInFullMenu: 37,
  },
  {
    id: "desserts",
    label: { en: "Desserts & Waffles", ar: "الحلويات والوافل" },
    totalItemsInFullMenu: 25,
  },
  {
    id: "drinks",
    label: { en: "Coffee, Mocktails & Juices", ar: "القهوة والموكتيلات والعصائر" },
    totalItemsInFullMenu: 170,
  },
  {
    id: "shisha",
    label: { en: "Shisha", ar: "الشيشة" },
    totalItemsInFullMenu: 5,
  },
];

export const dietaryLabels: Record<DietaryTag, Record<Locale, string>> = {
  signature: { en: "Signature", ar: "توقيع كافو" },
  vegetarian: { en: "Vegetarian", ar: "نباتي" },
  meat: { en: "Meat", ar: "لحوم" },
  chicken: { en: "Chicken", ar: "دجاج" },
  seafood: { en: "Seafood", ar: "مأكولات بحرية" },
};

export const menuItems: MenuItem[] = [
  // BREAKFAST
  {
    id: "english-breakfast",
    category: "breakfast",
    name: { en: "English Breakfast", ar: "فطار إنجليزي" },
    description: {
      en: "A complete breakfast, the CAVO Island way: 2 beef sausages, 2 chicken sausages, grilled mushrooms, omelette, and toast with butter, jam, and honey.",
      ar: "إفطار متكامل بأسلوب CAVO Island: ٢ سوسيس بيف، ٢ سوسيس فراخ، مشروم مشوي، أومليت، وتوست مع زبدة ومربى وعسل.",
    },
    priceEgp: 750,
    image: "/media/menu/breakfast-spread.jpg",
    tags: ["signature", "meat"],
    featured: true,
  },
  {
    id: "smoked-salmon-croissant",
    category: "breakfast",
    name: { en: "Smoked Salmon Croissant", ar: "كرواسون سلمون مدخن" },
    description: {
      en: "Flaky, buttery French croissant filled with premium smoked salmon slices and refreshing capers.",
      ar: "كرواسون فرنسي هش مخبوز بالزبدة محشو بشرائح السلمون المدخن الفاخر مع حبات الكبر المنعشة.",
    },
    priceEgp: 375,
    image: "/media/menu/dishes/salmon-croissant.jpg",
    tags: ["seafood", "signature"],
    featured: true,
  },
  {
    id: "cold-cut-croissant",
    category: "breakfast",
    name: { en: "Cold Cut Croissant", ar: "كرواسون باللحم البارد" },
    description: {
      en: "Butter-rich French croissant filled with curated cold cuts, specialty cheeses, and fresh crisp greens.",
      ar: "كرواسون فرنسي مخبوز بالزبدة محشو بتشكيلة فاخرة من اللحوم الباردة والأجبان المختارة والخضروات الطازجة.",
    },
    priceEgp: 315,
    image: "/media/menu/dishes/coldcut-croissant.jpg",
    tags: ["meat"],
  },
  {
    id: "feteer-meshaltet",
    category: "breakfast",
    name: { en: "Feteer Meshaltet", ar: "فطيرة مشلتت على أصولها" },
    description: {
      en: "Traditional golden flaky Egyptian layered pastry served hot with honey, black molasses, and clotted cream.",
      ar: "فطيرة مشلتت ساخنة ومورقة تُقدم مع العسل الأبيض، العسل الأسود، والقشطة الفلاحي.",
    },
    priceEgp: 550,
    image: "/media/hero/main-terrace.jpg",
    tags: ["vegetarian", "signature"],
  },
  {
    id: "foul-oil-lemon",
    category: "breakfast",
    name: { en: "Foul with Oil & Lemon", ar: "فول بالزيت والليمون" },
    description: {
      en: "Slow-simmered Egyptian fava beans finished with extra-virgin olive oil, fresh lemon, and warm baladi bread.",
      ar: "فول مدمس بالخلطة المصرية الأصيلة مع زيت الزيتون وعصير الليمون والعيش البلدي الساخن.",
    },
    priceEgp: 100,
    image: "/media/hero/main-terrace.jpg",
    tags: ["vegetarian"],
  },
  {
    id: "falafel-sesame",
    category: "breakfast",
    name: { en: "Sesame Falafel (4 pcs)", ar: "فلافل بالسمسم (4 قطع)" },
    description: {
      en: "Golden herb-packed Egyptian taameya crusted with toasted sesame seeds and tahina dip.",
      ar: "طعمية مصرية مقرمشة مغطاة بالسمسم المحمص مع سلطة الطحينة.",
    },
    priceEgp: 100,
    image: "/media/menu/breakfast-spread.jpg",
    tags: ["vegetarian"],
  },

  // SOUPS & SALADS
  {
    id: "orzo-soup",
    category: "soups-salads",
    name: { en: "Orzo Soup", ar: "شوربة لسان عصفور" },
    description: {
      en: "A warm, comforting soup made with rich seasoned broth and toasted golden orzo pasta.",
      ar: "شوربة دافئة وخفيفة محضرة من مرق غني مع مكرونة لسان عصفور المحمصة.",
    },
    priceEgp: 150,
    image: "/media/menu/dishes/orzo-soup.jpg",
    tags: ["vegetarian"],
  },
  {
    id: "knuckles-soup",
    category: "soups-salads",
    name: { en: "Knuckles Soup", ar: "شوربة كوارع" },
    description: {
      en: "Slow-braised traditional Egyptian beef knuckles broth infused with aromatic spices and vegetables.",
      ar: "شوربة كوارع مصرية غنية مطهية ببطء مع التوابل العطرية والخضروات.",
    },
    priceEgp: 550,
    image: "/media/menu/dishes/knuckles-soup.jpg",
    tags: ["meat"],
  },
  {
    id: "rocca-mushroom-avocado",
    category: "soups-salads",
    name: { en: "Rocca, Mushroom & Avocado Salad", ar: "سلطة جرجير بالمشروم والأفوكادو" },
    description: {
      en: "Fresh baby rocca leaves tossed with sautéed mushrooms, creamy avocado, aged balsamic, and olive oil.",
      ar: "جرجير طازج مع المشروم وشرائح الأفوكادو بصلصة البلسميك وزيت الزيتون والليمون.",
    },
    priceEgp: 450,
    image: "/media/menu/dishes/rocca-avocado.jpg",
    tags: ["vegetarian", "signature"],
  },
  {
    id: "oriental-salad",
    category: "soups-salads",
    name: { en: "Oriental Salad", ar: "سلطة بلدي" },
    description: {
      en: "Crisp chopped garden vegetables dressed in cold-pressed olive oil, lemon juice, and cumin.",
      ar: "مزيج طازج من الخضروات المقطعة مع زيت الزيتون وعصير الليمون والكمون.",
    },
    priceEgp: 150,
    image: "/media/menu/dishes/oriental-salad.jpg",
    tags: ["vegetarian"],
  },

  // APPETIZERS
  {
    id: "muhammara",
    category: "appetizers",
    name: { en: "Muhammara", ar: "محمرة شرقية" },
    description: {
      en: "Rich Levantine roasted red pepper spread blended with crushed walnuts and tangy pomegranate molasses.",
      ar: "محمرة شرقية غنية بطعم الفلفل الأحمر المشوي مع الجوز ودبس الرمان.",
    },
    priceEgp: 245,
    image: "/media/menu/dishes/muhammara.jpg",
    tags: ["vegetarian"],
  },
  {
    id: "vine-leaves",
    category: "appetizers",
    name: { en: "Cold Stuffed Vine Leaves", ar: "ورق عنب يالنجي بارد" },
    description: {
      en: "Hand-rolled tender grape leaves stuffed with herb-infused rice, olive oil, and lemon.",
      ar: "ورق عنب بارد محشو بالأرز المتبل بالأعشاب ودبس الرمان وزيت الزيتون.",
    },
    priceEgp: 195,
    image: "/media/menu/dishes/vine-leaves.jpg",
    tags: ["vegetarian"],
  },
  {
    id: "chicken-liver-pomegranate",
    category: "appetizers",
    name: { en: "Chicken Liver with Pomegranate Molasses", ar: "كبدة دجاج بدبس الرمان" },
    description: {
      en: "Pan-seared chicken liver glazed in rich pomegranate molasses with garlic and oriental spices.",
      ar: "كبدة دجاج مشوحة مع الثوم والبهارات الشرقية ومزينة بصلصة دبس الرمان الغنية.",
    },
    priceEgp: 275,
    image: "/media/menu/dishes/chicken-liver.jpg",
    tags: ["chicken", "signature"],
  },
  {
    id: "alexandrian-liver",
    category: "appetizers",
    name: { en: "Alexandrian Liver", ar: "كبدة إسكندراني" },
    description: {
      en: "Classic street-style sautéed beef liver with green chilies, crushed garlic, cumin, and fresh lime.",
      ar: "كبدة إسكندراني أصلية بالفلفل الأخضر والثوم والكمون وعصرة الليمون.",
    },
    priceEgp: 275,
    image: "/media/menu/dishes/chicken-liver.jpg",
    tags: ["meat"],
  },

  // TAJINS & MAINS
  {
    id: "rice-meammar-meat",
    category: "tajins-mains",
    name: { en: "Baked Rice Meammar with Meat", ar: "طاجن أرز معمر باللحم" },
    description: {
      en: "Creamy slow-baked Egyptian rice casserole enriched with farm ghee, buffalo cream, and tender braised beef.",
      ar: "أرز معمر في الفرن بالسمن البلدي والقشطة مع قطع اللحم الطرية الذائبة.",
    },
    priceEgp: 700,
    image: "/media/menu/dishes/rice-meammar-meat.jpg",
    tags: ["meat", "signature"],
  },
  {
    id: "rice-meammar-chicken",
    category: "tajins-mains",
    name: { en: "Baked Rice Meammar with Chicken", ar: "طاجن أرز معمر بالدجاج" },
    description: {
      en: "Oven-bubbled creamy Egyptian rice baked with roasted seasoned chicken cuts.",
      ar: "طاجن أرز معمر غني بالقشطة والسمن مع قطع الدجاج المتبلة والمحمرة.",
    },
    priceEgp: 595,
    image: "/media/menu/dishes/rice-meammar-chicken.jpg",
    tags: ["chicken"],
  },
  {
    id: "miso-chicken",
    category: "tajins-mains",
    name: { en: "Miso Glazed Chicken", ar: "دجاج بصلصة الميسو" },
    description: {
      en: "Tender grilled chicken cuts finished in a silky, umami-balanced miso glaze.",
      ar: "قطع دجاج طرية مطهية مع صلصة ميسو غنية ومتوازنة المذاق.",
    },
    priceEgp: 600,
    image: "/media/venues/elite/elite-night-dinner.jpg",
    tags: ["chicken"],
  },
  {
    id: "crispy-chicken-mushroom",
    category: "tajins-mains",
    name: { en: "Crispy Chicken Mushroom", ar: "دجاج كريسبي بالمشروم" },
    description: {
      en: "Golden crusted chicken fillet topped with creamy sautéed mushroom sauce and mashed potatoes.",
      ar: "فيليه دجاج مقرمش مغطى بصلصة المشروم الكريمية يُقدم مع البطاطس.",
    },
    priceEgp: 425,
    image: "/media/menu/dishes/crispy-chicken-mushroom.jpg",
    tags: ["chicken"],
  },

  // GRILLS
  {
    id: "cavo-special-grills",
    category: "grills",
    name: { en: "CAVO Special Mixed Grills", ar: "مشاوي ميكس كافو الخاصة" },
    description: {
      en: "Shish tawook, kofta, kebab, tarab, and tender lamb chops marinated in CAVO's house blend and charcoal-grilled.",
      ar: "تشكيلة استثنائية من شيش طاووق، كفتة لحم، كباب، طرب، وريش ضأن متبلة بخلطة كافو الخاصة ومشوية على الفحم.",
    },
    priceEgp: 1100,
    image: "/media/menu/dishes/cavo-mixed-grills.jpg",
    tags: ["signature", "meat"],
    featured: true,
  },
  {
    id: "mixed-grills",
    category: "grills",
    name: { en: "Classic Mixed Grills", ar: "مشاوي ميكس كلاسيك" },
    description: {
      en: "Charcoal-grilled assortment of beef kofta, kebab, and marinated shish tawook served with grilled vegetables.",
      ar: "تشكيلة مشويات على الفحم من الكفتة والكباب والشيش طاووق مع الخضروات المشوية.",
    },
    priceEgp: 700,
    image: "/media/menu/dishes/mixed-grills.jpg",
    tags: ["meat"],
  },

  // PIZZA, PASTA & SANDWICHES
  {
    id: "pepperoni-pizza",
    category: "pizza-pasta",
    name: { en: "Pepperoni Pizza", ar: "بيتزا بيبروني" },
    description: {
      en: "Smoked beef pepperoni, Italian mozzarella, and slow-cooked San Marzano tomato sauce on a blistered crust.",
      ar: "شرائح بيبروني بقري مدخن، جبن موزاريلا إيطالي، وصلصة طماطم غنية على عجينة هشة ومقرمشة.",
    },
    priceEgp: 450,
    image: "/media/venues/private-yacht/yacht-dining-table.jpg",
    tags: ["meat", "signature"],
    featured: true,
  },
  {
    id: "chicken-ranch-pizza",
    category: "pizza-pasta",
    name: { en: "Chicken Ranch Pizza", ar: "بيتزا دجاج رانش" },
    description: {
      en: "Wood-fired crust topped with grilled chicken, melted mozzarella, sweet corn, and smoky ranch drizzle.",
      ar: "عجينة مخبوزة طازجة مع قطع الدجاج المشوية والموزاريلا وصلصة الرانش الكريمية.",
    },
    priceEgp: 350,
    image: "/media/menu/main-kitchen.jpg",
    tags: ["chicken"],
  },
  {
    id: "penne-alfredo",
    category: "pizza-pasta",
    name: { en: "Penne Alfredo", ar: "بيني ألفريدو" },
    description: {
      en: "Al dente penne pasta tossed in velvety garlic parmesan cream with grilled chicken strips and mushrooms.",
      ar: "مكرونة بيني مع صوص الألفريدو الكريمي بالثوم والبارميزان وشرائح الدجاج والمشروم.",
    },
    priceEgp: 495,
    image: "/media/menu/dishes/penne-alfredo.jpg",
    tags: ["chicken"],
  },
  {
    id: "spaghetti-bolognese",
    category: "pizza-pasta",
    name: { en: "Spaghetti Bolognese", ar: "سباغيتي بولونيز" },
    description: {
      en: "Classic Italian ragu simmered with minced beef, aromatic herbs, rich tomato reduction, and parmesan.",
      ar: "مكرونة سباغيتي بصلصة البولونيز الإيطالية الغنية باللحم المفروم والأعشاب وجبنة البارميزان.",
    },
    priceEgp: 350,
    image: "/media/menu/dishes/spaghetti-bolognese.jpg",
    tags: ["meat"],
  },
  {
    id: "beef-sandwich",
    category: "pizza-pasta",
    name: { en: "Signature Beef Sandwich", ar: "سندويش لحم كافو" },
    description: {
      en: "Tender seared beef strips, caramelized onions, and melted cheese in artisan toasted bread with fries.",
      ar: "شرائح لحم طرية مشوية مع البصل المكرمل والجبن الذائب داخل خبز محمص مع البطاطس.",
    },
    priceEgp: 600,
    image: "/media/venues/elite/elite-window-feast.jpg",
    tags: ["meat"],
  },
  {
    id: "shish-tawook-sandwich",
    category: "pizza-pasta",
    name: { en: "Shish Tawook Sandwich", ar: "سندويش شيش طاووق" },
    description: {
      en: "Charcoal-grilled marinated chicken skewers wrapped with garlic toum, pickles, and crisp fries.",
      ar: "قطع شيش طاووق مشوية على الفحم مع صوص الثومية والمخلل والبطاطس المقرمشة.",
    },
    priceEgp: 295,
    image: "/media/menu/dishes/crispy-chicken-mushroom.jpg",
    tags: ["chicken"],
  },

  // DESSERTS & WAFFLES
  {
    id: "tiramisu",
    category: "desserts",
    name: { en: "Classic Italian Tiramisu", ar: "تيراميسو إيطالي" },
    description: {
      en: "Whipped Italian mascarpone cream layered with espresso-soaked ladyfingers and rich Belgian cocoa.",
      ar: "كريمة ماسكاربوني إيطالية مخفوقة مع بسكويت غني بالقهوة ولمسة كاكاو فاخر.",
    },
    priceEgp: 300,
    image: "/media/menu/dishes/tiramisu.png",
    tags: ["signature", "vegetarian"],
    featured: true,
  },
  {
    id: "tsunami-cake",
    category: "desserts",
    name: { en: "Tsunami Cake", ar: "كيك تسونامي" },
    description: {
      en: "Soft sponge dessert drenched at the table in a cascading warm chocolate ganache pour.",
      ar: "كيك إسفنجي طري يُغمر لحظة التقديم بصوص الشوكولاتة الساخن الغني.",
    },
    priceEgp: 300,
    image: "/media/menu/dishes/tsunami-cake.jpg",
    tags: ["vegetarian"],
  },
  {
    id: "nutella-waffle",
    category: "desserts",
    name: { en: "Nutella Waffle", ar: "وافل نوتيلا" },
    description: {
      en: "Crisp golden Belgian waffle generously topped with warm Nutella hazelnut spread and seasonal fruits.",
      ar: "وافل بلجيكي مقرمش مغطى بطبقة غنية من شوكولاتة النوتيلا والفواكه الطازجة.",
    },
    priceEgp: 280,
    image: "/media/menu/dishes/nutella-waffle.jpg",
    tags: ["vegetarian"],
  },

  // DRINKS & MOCKTAILS
  {
    id: "iced-orange-americano",
    category: "drinks",
    name: { en: "Iced Orange Americano", ar: "أمريكانو برتقال مثلج" },
    description: {
      en: "Double-shot specialty espresso poured over fresh-pressed chilled Egyptian orange juice and ice.",
      ar: "إسبريسو مختص مزدوج فوق عصير البرتقال المصري الطازج والثلج.",
    },
    priceEgp: 180,
    image: "/media/menu/cavo-coffee-breakfast.jpg",
    tags: ["signature", "vegetarian"],
  },
  {
    id: "matcha-tea",
    category: "drinks",
    name: { en: "Ceremonial Matcha Latte", ar: "شاي ماتشا" },
    description: {
      en: "Whisked ceremonial Japanese matcha green tea served hot or iced with silky textured milk.",
      ar: "ماتشا يابانية أصلية مخفوقة تُقدم ساخنة أو مثلجة مع الحليب المخملي.",
    },
    priceEgp: 180,
    image: "/media/menu/signature-drinks.jpg",
    tags: ["vegetarian"],
  },
  {
    id: "love-story-mocktail",
    category: "drinks",
    name: { en: "Love Story Mocktail", ar: "كوكتيل قصة حب" },
    description: {
      en: "Signature Nile-sunset mocktail blending orange, cranberry, passion fruit, and zesty lemon over crushed ice.",
      ar: "موكتيل كافو المنعش يمزج بين البرتقال والتوت البري وفاكهة الباشن والليمون.",
    },
    priceEgp: 180,
    image: "/media/menu/signature-drinks.jpg",
    tags: ["signature", "vegetarian"],
    featured: true,
  },
  {
    id: "cucumber-kiwi",
    category: "drinks",
    name: { en: "Cucumber Kiwi Cooler", ar: "موكتيل خيار بالكيوي" },
    description: {
      en: "Refreshing garden blend of crisp cucumber, sweet kiwi puree, mint, and sparkling chill.",
      ar: "مزيج منعش من الخيار الطازج والكيوي الطبيعي والنعناع المثلج.",
    },
    priceEgp: 180,
    image: "/media/menu/dishes/cucumber-kiwi.jpg",
    tags: ["vegetarian"],
  },
  {
    id: "classic-mojito",
    category: "drinks",
    name: { en: "Classic Nile Mojito", ar: "موهيتو كلاسيك" },
    description: {
      en: "Fresh muddled mint leaves, lime wedges, brown cane sugar, and crisp sparkling soda.",
      ar: "أوراق النعناع الطازج مع شرائح الليمون والصودا المثلجة.",
    },
    priceEgp: 130,
    image: "/media/menu/dishes/classic-mojito.jpg",
    tags: ["vegetarian"],
  },
  {
    id: "fresh-mango",
    category: "drinks",
    name: { en: "Fresh Egyptian Mango Juice", ar: "عصير مانجو طازج" },
    description: {
      en: "Thick, naturally sweet pureed Egyptian mango served ice-cold.",
      ar: "عصير مانجو مصري طبيعي 100% يقدم مثلجاً.",
    },
    priceEgp: 180,
    image: "/media/menu/signature-drinks.jpg",
    tags: ["vegetarian"],
  },

  // SHISHA
  {
    id: "mr-cavo-shisha",
    category: "shisha",
    name: { en: "Mr. CAVO Signature Shisha", ar: "شيشة مستر كافو الخاصة" },
    description: {
      en: "Our flagship signature riverside blend prepared with precision and dedicated coal service.",
      ar: "خلطة كافو المميزة الأعلى طلباً مع خدمة فحم مستمرة على ضفاف النيل.",
    },
    priceEgp: 650,
    image: "/media/venues/boat/nile-deck-night.jpg",
    tags: ["signature"],
  },
  {
    id: "panda-shisha",
    category: "shisha",
    name: { en: "Flash Smokery Panda Shisha", ar: "شيشة فلاش سموكري باندا" },
    description: {
      en: "Smooth contemporary shisha session crafted for late-night boat and lounge tables.",
      ar: "نكهات عصرية سلسة مثالية لسهرات المركب واللاونج الليلي.",
    },
    priceEgp: 500,
    image: "/media/venues/elite/cavo-sign-glow.jpg",
    tags: ["vegetarian"],
  },
];
