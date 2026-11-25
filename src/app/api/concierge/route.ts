import { NextRequest, NextResponse } from "next/server";
import {
  buildEventInquiryWhatsAppUrl,
  buildVenueBookingWhatsAppUrl,
  getEventDeskWhatsAppTarget,
  getVenueConcierge,
} from "@/lib/integrations/concierge";
import { defaultLocale, isValidLocale } from "@/lib/i18n";
import { bookingSchema } from "@/lib/validations/booking";
import { eventInquirySchema } from "@/lib/validations/events";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const kind =
      request.nextUrl.searchParams.get("kind") ??
      (body?.eventType ? "event" : "booking");
    const locale = isValidLocale(body?.locale) ? body.locale : defaultLocale;

    if (kind === "event") {
      const parsed = eventInquirySchema.safeParse(body);
      if (!parsed.success) {
        return NextResponse.json(
          { ok: false, errors: parsed.error.flatten().fieldErrors },
          { status: 400 }
        );
      }

      const referenceId = `CAVO-EVT-${Math.floor(10000 + Math.random() * 90000)}`;
      const target = getEventDeskWhatsAppTarget(parsed.data.preferredVenue);
      const whatsappUrl = buildEventInquiryWhatsAppUrl(
        parsed.data,
        referenceId,
        locale
      );

      let status: "request_prepared" | "forwarded_to_webhook" =
        "request_prepared";
      const webhookUrl = process.env.CAVO_EVENTS_WEBHOOK_URL;

      if (webhookUrl) {
        try {
          const webhookRes = await fetch(webhookUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              type: "private_event_inquiry",
              referenceId,
              locale,
              ...parsed.data,
              submittedAt: new Date().toISOString(),
            }),
          });
          if (webhookRes.ok) {
            status = "forwarded_to_webhook";
          }
        } catch (webhookErr) {
          console.error("CAVO events webhook handoff warning:", webhookErr);
        }
      }

      return NextResponse.json({
        ok: true,
        referenceId,
        status,
        confirmationRequired: true,
        whatsappUrl,
        conciergePhone: target.phoneDisplay,
      });
    }

    const parsed = bookingSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { ok: false, errors: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const referenceId = `CAVO-${Math.floor(10000 + Math.random() * 90000)}`;
    const concierge = getVenueConcierge(parsed.data.venue);
    const whatsappUrl = buildVenueBookingWhatsAppUrl(
      parsed.data,
      referenceId,
      locale
    );

    let status: "request_prepared" | "forwarded_to_webhook" =
      "request_prepared";
    const webhookUrl = process.env.CAVO_BOOKING_WEBHOOK_URL;

    if (webhookUrl) {
      try {
        const webhookRes = await fetch(webhookUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type: "reservation_request",
            referenceId,
            locale,
            ...parsed.data,
            submittedAt: new Date().toISOString(),
          }),
        });
        if (webhookRes.ok) {
          status = "forwarded_to_webhook";
        }
      } catch (webhookErr) {
        console.error("CAVO booking webhook handoff warning:", webhookErr);
      }
    }

    return NextResponse.json({
      ok: true,
      referenceId,
      status,
      confirmationRequired: true,
      whatsappUrl,
      conciergePhone: concierge.phoneDisplay,
    });
  } catch (err) {
    console.error("Invalid concierge request payload:", err);
    return NextResponse.json(
      { ok: false, message: "Invalid concierge request payload" },
      { status: 400 }
    );
  }
}
