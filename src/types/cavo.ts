import type { Locale } from "@/lib/i18n";

export type VenueSlug = "main-restaurant" | "boat" | "private-yacht" | "elite";

export type LocalizedString = Record<Locale, string>;

export interface BusinessConfirmationField<T> {
  value: T | null;
  confirmationStatus: "verified" | "requires_business_confirmation";
  note: LocalizedString;
}

export interface VenueContactLine {
  id: "main" | "yacht" | "elite";
  label: LocalizedString;
  phoneDisplay: string;
  telHref: string;
  whatsappDigits: string;
  secondaryPhoneDisplay?: string;
  secondaryTelHref?: string;
}

export interface SeatingOption {
  id: string;
  label: LocalizedString;
  requiresConfirmation?: boolean;
}

export type LocalizedStringList = Record<Locale, string[]>;

export interface PrivateYachtInquiryFormat {
  id: string;
  name: LocalizedString;
  subtitle: LocalizedString;
  confirmationNote: LocalizedString;
  suggestedFocus: LocalizedStringList;
}

export interface VenueData {
  slug: VenueSlug;
  number: string;
  name: LocalizedString;
  role: LocalizedString;
  tagline: LocalizedString;
  shortDesc: LocalizedString;
  fullStory: LocalizedString;
  heroImage: string;
  cardImage: string;
  gallery: { src: string; alt: LocalizedString }[];
  hours: LocalizedString;
  bestFor: LocalizedStringList;
  seatingOptions: SeatingOption[];
  highlights: LocalizedStringList;
  atmosphereTheme: "warm" | "sunset" | "nile" | "dark";
  instagramHandle: string;
  instagramUrl: string;
  whatsappDigits: string;
  phoneDisplay: string;
  secondaryPhoneDisplay?: string;
}

export type MenuCategoryId =
  | "breakfast"
  | "soups-salads"
  | "appetizers"
  | "tajins-mains"
  | "grills"
  | "pizza-pasta"
  | "desserts"
  | "drinks"
  | "shisha";

export type DietaryTag =
  | "signature"
  | "vegetarian"
  | "meat"
  | "chicken"
  | "seafood";

export interface MenuCategory {
  id: MenuCategoryId;
  label: LocalizedString;
  totalItemsInFullMenu: number;
}

export interface MenuItem {
  id: string;
  category: MenuCategoryId;
  name: LocalizedString;
  description: LocalizedString;
  priceEgp: number;
  image: string;
  tags: DietaryTag[];
  featured?: boolean;
}

export type GalleryCategory = "place" | "taste" | "moments" | "after-dark";

export interface GalleryItem {
  id: string;
  category: GalleryCategory;
  mediaType: "image" | "video";
  src: string;
  mobileSrc?: string;
  poster?: string;
  mobilePoster?: string;
  venueTag: LocalizedString;
  title: LocalizedString;
  caption: LocalizedString;
}

export interface VirtualTour360Config {
  enabled: boolean;
  providerUrl: string | null;
  supportedVenues: VenueSlug[];
}

export interface InteractiveSeatingConfig {
  enabled: boolean;
  liveAvailabilityApiUrl: string | null;
}

export interface EventPackagesConfig {
  enabled: boolean;
  verifiedPackagesAvailable: boolean;
}

export interface GiftExperienceConfig {
  enabled: boolean;
  voucherPortalUrl: string | null;
}

export interface FutureFeaturesConfig {
  virtualTour360: VirtualTour360Config;
  interactiveSeatingLive: InteractiveSeatingConfig;
  eventPackages: EventPackagesConfig;
  giftExperiences: GiftExperienceConfig;
}

export interface BookingRequestInput {
  venue: VenueSlug;
  date: string;
  time: string;
  guests: number;
  fullName: string;
  phone: string;
  email?: string;
  occasion?: string;
  seatingPreference?: string;
  specialRequests?: string;
}

export interface EventInquiryInput {
  fullName: string;
  phone: string;
  email: string;
  eventType: string;
  preferredVenue: string;
  preferredDate: string;
  preferredTime: string;
  guestsCount: number;
  budgetRange?: string;
  setupPreferences: string[];
  additionalRequirements?: string;
}
