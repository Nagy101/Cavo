import { NextRequest, NextResponse } from "next/server";
import {
  buildEventInquiryWhatsAppUrl,
  getEventDeskWhatsAppTarget,
} from "@/lib/integrations/concierge";
import { defaultLocale, isValidLocale } from "@/lib/i18n";
import { eventInquirySchema } from "@/lib/validations/events";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const locale = isValidLocale(body?.locale) ? body.locale : defaultLocale;
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

    let status: "request_prepared" | "forwarded_to_webhook" = "request_prepared";
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
      } catch {
        // Fallback smoothly to WhatsApp concierge handoff
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
  } catch {
    return NextResponse.json(
      { ok: false, message: "Invalid event inquiry payload" },
      { status: 400 }
    );
  }
}
