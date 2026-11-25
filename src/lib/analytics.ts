"use client";

export type CavoAnalyticsEventName =
  | "experience_view"
  | "experience_select"
  | "menu_view"
  | "menu_item_interaction"
  | "booking_start"
  | "booking_submit"
  | "private_event_inquiry"
  | "whatsapp_click"
  | "directions_click"
  | "language_change";

declare global {
  interface Window {
    gtag?: (
      command: "event",
      eventName: string,
      params?: Record<string, string | number | boolean>
    ) => void;
    fbq?: (
      command: "trackCustom",
      eventName: string,
      params?: Record<string, string | number | boolean>
    ) => void;
  }
}

export function trackCavoEvent(
  eventName: CavoAnalyticsEventName,
  params: Record<string, string | number | boolean> = {}
): void {
  if (typeof window === "undefined") return;

  if (typeof window.gtag === "function") {
    window.gtag("event", eventName, params);
  }

  if (typeof window.fbq === "function") {
    window.fbq("trackCustom", eventName, params);
  }
}
