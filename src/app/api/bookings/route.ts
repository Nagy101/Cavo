import { NextRequest, NextResponse } from "next/server";
import {
  buildVenueBookingWhatsAppUrl,
  getVenueConcierge,
} from "@/lib/integrations/concierge";
import { defaultLocale, isValidLocale } from "@/lib/i18n";
import { bookingSchema } from "@/lib/validations/booking";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const locale = isValidLocale(body?.locale) ? body.locale : defaultLocale;
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

    let status: "request_prepared" | "forwarded_to_webhook" = "request_prepared";
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
      } catch {
        // Keep graceful WhatsApp handoff fallback if external webhook is unreachable
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
  } catch {
    return NextResponse.json(
      { ok: false, message: "Invalid booking request payload" },
      { status: 400 }
    );
  }
}
