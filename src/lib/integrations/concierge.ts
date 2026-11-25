import {
  buildWhatsAppUrl,
  SERVICE_RATE,
  siteConfig,
  VAT_RATE,
} from "@/data/site";
import { getVenueBySlug, venues } from "@/data/venues";
import type { Locale } from "@/lib/i18n";
import type { BookingFormValues } from "@/lib/validations/booking";
import type { EventInquiryFormValues } from "@/lib/validations/events";
import type { VenueSlug } from "@/types/cavo";

export interface ConciergeEndpoint {
  whatsappDigits: string;
  phoneDisplay: string;
  venueName: Record<Locale, string>;
}

export function getVenueConcierge(slug: VenueSlug): ConciergeEndpoint {
  const venue = getVenueBySlug(slug) ?? venues[0];
  return {
    whatsappDigits: venue.whatsappDigits,
    phoneDisplay: venue.phoneDisplay,
    venueName: venue.name,
  };
}

export function calculateMenuBillEstimate(subtotal: number): {
  subtotal: number;
  serviceCharge: number;
  vat: number;
  estimatedTotal: number;
} {
  const safeSubtotal = Math.max(0, Math.round(subtotal));
  const serviceCharge = Math.round(safeSubtotal * SERVICE_RATE);
  const vat = Math.round((safeSubtotal + serviceCharge) * VAT_RATE);
  return {
    subtotal: safeSubtotal,
    serviceCharge,
    vat,
    estimatedTotal: safeSubtotal + serviceCharge + vat,
  };
}

export function formatBookingWhatsAppMessage(
  data: BookingFormValues,
  referenceId: string,
  locale: Locale
): string {
  const concierge = getVenueConcierge(data.venue);
  const venue = getVenueBySlug(data.venue);
  const seatingLabel =
    venue?.seatingOptions.find((s) => s.id === data.seatingPreference)?.label[
      locale
    ] ?? data.seatingPreference;

  if (locale === "ar") {
    return [
      `مرحباً فريق كافو آيلاند (${concierge.venueName.ar})`,
      `مرجع الطلب: ${referenceId}`,
      `الاسم: ${data.fullName}`,
      `الموبايل: ${data.phone}`,
      data.email ? `البريد الإلكتروني: ${data.email}` : "",
      `الوجهة المطلوبة: ${concierge.venueName.ar}`,
      seatingLabel ? `تفضيل الجلسة: ${seatingLabel}` : "",
      `التاريخ والوقت: ${data.date} الساعة ${data.time}`,
      `عدد الأفراد: ${data.guests}`,
      data.occasion ? `المناسبة: ${data.occasion}` : "",
      data.specialRequests ? `ملاحظات: ${data.specialRequests}` : "",
    ]
      .filter(Boolean)
      .join("\n");
  }

  return [
    `Hello CAVO Island Team (${concierge.venueName.en})`,
    `Request Ref: ${referenceId}`,
    `Full Name: ${data.fullName}`,
    `Phone: ${data.phone}`,
    data.email ? `Email: ${data.email}` : "",
    `Experience: ${concierge.venueName.en}`,
    seatingLabel ? `Seating Preference: ${seatingLabel}` : "",
    `Date & Time: ${data.date} at ${data.time}`,
    `Guests: ${data.guests}`,
    data.occasion ? `Occasion: ${data.occasion}` : "",
    data.specialRequests ? `Special Requests: ${data.specialRequests}` : "",
  ]
    .filter(Boolean)
    .join("\n");
}

export function formatEventWhatsAppMessage(
  data: EventInquiryFormValues,
  referenceId: string,
  locale: Locale
): string {
  if (locale === "ar") {
    return [
      `استفسار مناسبة خاصة — كافو آيلاند`,
      `مرجع الطلب: ${referenceId}`,
      `الاسم: ${data.fullName}`,
      `الموبايل: ${data.phone}`,
      `البريد الإلكتروني: ${data.email}`,
      `نوع المناسبة: ${data.eventType}`,
      `الوجهة المفضلة: ${data.preferredVenue}`,
      `التاريخ والوقت: ${data.preferredDate} الساعة ${data.preferredTime}`,
      `عدد الضيوف: ${data.guestsCount}`,
      data.budgetRange ? `الميزانية التقريبية: ${data.budgetRange}` : "",
      data.setupPreferences.length
        ? `التجهيزات المطلوبة: ${data.setupPreferences.join("، ")}`
        : "",
      data.additionalRequirements
        ? `متطلبات إضافية: ${data.additionalRequirements}`
        : "",
    ]
      .filter(Boolean)
      .join("\n");
  }

  return [
    `Private Event Inquiry — CAVO Island`,
    `Inquiry Ref: ${referenceId}`,
    `Full Name: ${data.fullName}`,
    `Phone: ${data.phone}`,
    `Email: ${data.email}`,
    `Event Type: ${data.eventType}`,
    `Preferred Venue: ${data.preferredVenue}`,
    `Date & Time: ${data.preferredDate} at ${data.preferredTime}`,
    `Estimated Guests: ${data.guestsCount}`,
    data.budgetRange ? `Budget Range: ${data.budgetRange}` : "",
    data.setupPreferences.length
      ? `Requested Setup: ${data.setupPreferences.join(", ")}`
      : "",
    data.additionalRequirements
      ? `Additional Requirements: ${data.additionalRequirements}`
      : "",
  ]
    .filter(Boolean)
    .join("\n");
}

export interface SubmissionResult {
  ok: boolean;
  referenceId: string;
  status: "request_prepared" | "forwarded_to_webhook";
  confirmationRequired: boolean;
  whatsappUrl: string;
  conciergePhone: string;
  message?: string;
}

export async function submitBookingRequest(
  data: BookingFormValues,
  locale: Locale
): Promise<SubmissionResult> {
  const res = await fetch("/api/bookings", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...data, locale }),
  });

  if (!res.ok) {
    throw new Error("Failed to prepare reservation request");
  }

  return res.json();
}

export async function submitEventInquiry(
  data: EventInquiryFormValues,
  locale: Locale
): Promise<SubmissionResult> {
  const res = await fetch("/api/events", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...data, locale }),
  });

  if (!res.ok) {
    throw new Error("Failed to prepare event inquiry");
  }

  return res.json();
}

export function getEventDeskWhatsAppTarget(preferredVenue: string): {
  whatsappDigits: string;
  phoneDisplay: string;
} {
  if (preferredVenue === "elite") {
    return {
      whatsappDigits: siteConfig.contactLines[2].whatsappDigits,
      phoneDisplay: siteConfig.contactLines[2].phoneDisplay,
    };
  }
  if (preferredVenue === "main-restaurant" || preferredVenue === "boat") {
    return {
      whatsappDigits: siteConfig.contactLines[0].whatsappDigits,
      phoneDisplay: siteConfig.contactLines[0].phoneDisplay,
    };
  }
  return {
    whatsappDigits: siteConfig.contactLines[1].whatsappDigits,
    phoneDisplay: siteConfig.contactLines[1].phoneDisplay,
  };
}

export function buildVenueBookingWhatsAppUrl(
  data: BookingFormValues,
  referenceId: string,
  locale: Locale
): string {
  const concierge = getVenueConcierge(data.venue);
  const text = formatBookingWhatsAppMessage(data, referenceId, locale);
  return buildWhatsAppUrl(concierge.whatsappDigits, text);
}

export function buildEventInquiryWhatsAppUrl(
  data: EventInquiryFormValues,
  referenceId: string,
  locale: Locale
): string {
  const target = getEventDeskWhatsAppTarget(data.preferredVenue);
  const text = formatEventWhatsAppMessage(data, referenceId, locale);
  return buildWhatsAppUrl(target.whatsappDigits, text);
}
