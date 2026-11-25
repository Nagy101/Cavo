import { existsSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { navCopy } from "@/data/copy";
import { galleryItems } from "@/data/gallery";
import { menuItems } from "@/data/menu";
import { venues } from "@/data/venues";
import { getDirection, isValidLocale, localePath } from "@/lib/i18n";
import {
  calculateMenuBillEstimate,
  formatBookingWhatsAppMessage,
  formatEventWhatsAppMessage,
  getVenueConcierge,
} from "@/lib/integrations/concierge";
import {
  bookingSchema,
  getTodayCairoDateString,
  VENUE_SLUGS,
} from "@/lib/validations/booking";
import { eventInquirySchema } from "@/lib/validations/events";

describe("CAVO i18n helpers", () => {
  it("validates locales and computes LTR/RTL directions", () => {
    expect(isValidLocale("en")).toBe(true);
    expect(isValidLocale("ar")).toBe(true);
    expect(isValidLocale("fr")).toBe(false);
    expect(getDirection("en")).toBe("ltr");
    expect(getDirection("ar")).toBe("rtl");
    expect(localePath("en", "/experiences/boat")).toBe("/en/experiences/boat");
    expect(localePath("ar", "")).toBe("/ar");
  });
});

describe("CAVO four-venue integrity & routing", () => {
  it("contains all four distinct CAVO venues including boat", () => {
    const slugs = venues.map((v) => v.slug);
    expect(slugs).toEqual(["main-restaurant", "boat", "private-yacht", "elite"]);
  });

  it("routes each venue to its verified concierge phone", () => {
    expect(getVenueConcierge("main-restaurant").whatsappDigits).toBe("201286666483");
    expect(getVenueConcierge("boat").whatsappDigits).toBe("201286666483");
    expect(getVenueConcierge("private-yacht").whatsappDigits).toBe("201286666482");
    expect(getVenueConcierge("elite").whatsappDigits).toBe("201212011201");
  });
});

describe("Booking validation schema", () => {
  const today = getTodayCairoDateString();

  it("accepts boat and all 4 valid venues with future/today date", () => {
    for (const venue of VENUE_SLUGS) {
      const parsed = bookingSchema.safeParse({
        venue,
        date: today,
        time: "20:00",
        guests: 4,
        fullName: "Karim Hassan",
        phone: "+20 100 123 4567",
        email: "",
      });
      expect(parsed.success).toBe(true);
    }
  });

  it("rejects past dates, unknown venues, and short names/phones", () => {
    const bad = bookingSchema.safeParse({
      venue: "unknown-venue",
      date: "2020-01-01",
      time: "20:00",
      guests: 0,
      fullName: "A",
      phone: "123",
    });
    expect(bad.success).toBe(false);
  });

  it("formats bilingual WhatsApp messages cleanly", () => {
    const msg = formatBookingWhatsAppMessage(
      {
        venue: "boat",
        date: today,
        time: "19:30",
        guests: 3,
        fullName: "Nour El Din",
        phone: "01001122334",
      },
      "CAVO-12345",
      "ar"
    );
    expect(msg).toContain("CAVO-12345");
    expect(msg).toContain("المركب");
  });
});

describe("Private Event inquiry validation", () => {
  const today = getTodayCairoDateString();

  it("requires valid email, future date, and guest count", () => {
    const valid = eventInquirySchema.safeParse({
      fullName: "Salma Tarek",
      phone: "+20 122 444 5555",
      email: "salma@example.com",
      eventType: "Birthday Celebration",
      preferredVenue: "private-yacht",
      preferredDate: today,
      preferredTime: "18:00",
      guestsCount: 20,
      budgetRange: "",
      setupPreferences: ["Floral & Table Styling"],
      additionalRequirements: "Sunset timing preferred",
    });
    expect(valid.success).toBe(true);

    const invalid = eventInquirySchema.safeParse({
      fullName: "Salma",
      phone: "+20 122 444 5555",
      email: "not-an-email",
      eventType: "Birthday",
      preferredVenue: "private-yacht",
      preferredDate: "2019-05-10",
      preferredTime: "18:00",
      guestsCount: 1,
      setupPreferences: [],
    });
    expect(invalid.success).toBe(false);
  });

  it("formats structured event WhatsApp brief", () => {
    const brief = formatEventWhatsAppMessage(
      {
        fullName: "Omar Adel",
        phone: "01280001111",
        email: "omar@example.com",
        eventType: "Proposal / Anniversary",
        preferredVenue: "private-yacht",
        preferredDate: today,
        preferredTime: "17:30",
        guestsCount: 6,
        setupPreferences: ["Celebration Cake"],
      },
      "CAVO-EVT-99999",
      "en"
    );
    expect(brief).toContain("CAVO-EVT-99999");
    expect(brief).toContain("Celebration Cake");
  });
});

describe("Centralized menu & tax estimator", () => {
  it("contains valid bilingual items with positive EGP pricing", () => {
    expect(menuItems.length).toBeGreaterThanOrEqual(30);
    for (const item of menuItems) {
      expect(item.priceEgp).toBeGreaterThan(0);
      expect(item.name.en.trim().length).toBeGreaterThan(0);
      expect(item.name.ar.trim().length).toBeGreaterThan(0);
      expect(item.image.startsWith("/media/")).toBe(true);
    }
  });

  it("calculates 12% service and 14% VAT accurately", () => {
    const bill = calculateMenuBillEstimate(1000);
    expect(bill.subtotal).toBe(1000);
    expect(bill.serviceCharge).toBe(120);
    expect(bill.vat).toBe(157); // Math.round(1120 * 0.14)
    expect(bill.estimatedTotal).toBe(1277);
  });
});

describe("Responsive intro & gallery video assets", () => {
  it("provides dedicated mobile and desktop intro videos and posters on disk", () => {
    const requiredPublicAssets = [
      "media/video/cavo-official-intro.mp4",
      "media/video/cavo-official-intro-mobile.mp4",
      "media/video/cavo-official-intro-mobile.webp",
      "media/video/cavo-official-poster.jpg",
      "media/video/cavo-official-poster-mobile.jpg",
    ];
    for (const relPath of requiredPublicAssets) {
      expect(existsSync(join(process.cwd(), "public", relPath))).toBe(true);
    }

    const officialTour = galleryItems.find((item) => item.id === "twilight-interior");
    expect(officialTour?.mobileSrc).toBe("/media/video/cavo-official-intro-mobile.mp4");
    expect(officialTour?.mobilePoster).toBe("/media/video/cavo-official-poster-mobile.jpg");
    expect(navCopy.en.contact).toBe("Contact");
    expect(navCopy.ar.contact).toBe("تواصل معنا");
  });
});
