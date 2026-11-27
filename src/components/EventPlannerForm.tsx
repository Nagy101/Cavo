"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Anchor,
  ArrowRight,
  Calendar,
  Check,
  CheckCircle2,
  Clock,
  Loader2,
  Mail,
  MessageCircle,
  Minus,
  Phone,
  Plus,
  ShieldAlert,
  Sparkles,
  Users,
  UtensilsCrossed,
} from "lucide-react";
import {
  CavoDatePicker,
  CavoTimePicker,
  formatReadableDate,
  formatReadableTime24To12,
} from "@/components/CavoDateTimePickers";
import { siteConfig } from "@/data/site";
import { trackCavoEvent } from "@/lib/analytics";
import {
  submitEventInquiry,
  type SubmissionResult,
} from "@/lib/integrations/concierge";
import { localePath, type Locale } from "@/lib/i18n";
import { getTodayCairoDateString } from "@/lib/validations/booking";
import {
  eventInquirySchema,
  type EventInquiryFormValues,
} from "@/lib/validations/events";

const eventTypes = [
  {
    id: "Birthday Celebration",
    en: "Birthday Celebration",
    ar: "حفل عيد ميلاد",
    sub: { en: "Cake, table decor & music", ar: "تورتة، ديكور طاولات وموسيقى" },
  },
  {
    id: "Proposal / Anniversary",
    en: "Proposal / Anniversary",
    ar: "خطوبة أو عيد زواج",
    sub: { en: "Romantic sunset & florals", ar: "أجواء غروب وزهور خاصة" },
  },
  {
    id: "Corporate / VIP Hosting",
    en: "Corporate / VIP Hosting",
    ar: "عشاء شركات وكبار الشخصيات",
    sub: { en: "Executive Nile hospitality", ar: "استضافة رسمية راقية على النيل" },
  },
  {
    id: "Private Family Feast",
    en: "Private Family Feast",
    ar: "عزومة عائلية خاصة",
    sub: { en: "Shared grills & full spread", ar: "سفرة عائلية متكاملة بخصوصية" },
  },
];

const venueModes = [
  {
    id: "private-yacht",
    num: "01",
    en: "Private Yacht",
    ar: "اليخت الخاص",
    role: { en: "Yachts by Cavo Charter", ar: "رحلة خاصة في النيل" },
    image: "/media/venues/private-yacht/yacht-night-dinner.jpg",
    phone: "+20 128 666 6482",
  },
  {
    id: "boat",
    num: "02",
    en: "Boat Open-Air Deck",
    ar: "سطح المركب المفتوح",
    role: { en: "Riverside Group Section", ar: "قسم خاص في الهواء الطلق" },
    image: "/media/hero/boat-nile-sunset.jpg",
    phone: "+20 128 666 6483",
  },
  {
    id: "elite",
    num: "03",
    en: "CAVO Elite",
    ar: "كافو إيليت",
    role: { en: "Elevated Lounge Hosting", ar: "استضافة مسائية فاخرة" },
    image: "/media/venues/elite/elite-night-dinner.jpg",
    phone: "+20 121 201 1201",
  },
  {
    id: "main-restaurant",
    num: "04",
    en: "Main Restaurant",
    ar: "المطعم الرئيسي",
    role: { en: "Indoor Timber Pergola", ar: "طاولة مجموعة بالقاعة" },
    image: "/media/hero/main-day.jpg",
    phone: "+20 128 666 6483",
  },
];

const setupAddOns = [
  {
    id: "Floral & Table Styling",
    en: "Floral & Table Styling",
    ar: "تنسيق زهور وديكور طاولات",
  },
  {
    id: "Curated Dining Spread",
    en: "Curated Dining Spread",
    ar: "سفرة ومأكولات مخصصة للمجموعة",
  },
  {
    id: "Music / Acoustic Setup",
    en: "Music / Acoustic Setup",
    ar: "تجهيز موسيقى وصوتيات",
  },
  {
    id: "Celebration Cake",
    en: "Celebration Cake",
    ar: "تورتة احتفال خاصة",
  },
];

const eventTimePresets = [
  { time: "14:00", label: { en: "2:00 PM · Daylight", ar: "2:00 م · نهاري" } },
  { time: "17:30", label: { en: "5:30 PM · Sunset", ar: "5:30 م · غروب" } },
  { time: "20:30", label: { en: "8:30 PM · Dinner", ar: "8:30 م · عشاء" } },
  { time: "22:30", label: { en: "10:30 PM · Night", ar: "10:30 م · سهرة" } },
];

export function EventPlannerForm({ locale }: { locale: Locale }) {
  const isAr = locale === "ar";
  const todayIso = getTodayCairoDateString();
  const [submitError, setSubmitError] = useState("");
  const [result, setResult] = useState<SubmissionResult | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<EventInquiryFormValues>({
    resolver: zodResolver(eventInquirySchema),
    defaultValues: {
      fullName: "",
      phone: "",
      email: "",
      eventType: eventTypes[0].id,
      preferredVenue: venueModes[0].id,
      preferredDate: todayIso,
      preferredTime: "18:30",
      guestsCount: 15,
      budgetRange: "",
      setupPreferences: [],
      additionalRequirements: "",
    },
  });

  const watchedPrefs = watch("setupPreferences");
  const watchedValues = watch();

  const toggleSetup = (id: string) => {
    const next = watchedPrefs.includes(id)
      ? watchedPrefs.filter((item) => item !== id)
      : [...watchedPrefs, id];
    setValue("setupPreferences", next);
  };

  const adjustGuests = (delta: number) => {
    const current = Number(watchedValues.guestsCount) || 15;
    const next = Math.max(2, Math.min(300, current + delta));
    setValue("guestsCount", next, { shouldValidate: true });
  };

  const onSubmit = async (data: EventInquiryFormValues) => {
    if (isSubmitting) return;
    setSubmitError("");
    try {
      const response = await submitEventInquiry(data, locale);
      trackCavoEvent("private_event_inquiry", {
        venue: data.preferredVenue,
        guests: data.guestsCount,
      });
      setResult(response);
    } catch {
      setSubmitError(
        isAr
          ? "حدث خطأ أثناء تجهيز الاستفسار. يُرجى المحاولة مجدداً."
          : "Unable to prepare event inquiry right now. Please try again."
      );
    }
  };

  const selectedVenueObj =
    venueModes.find((v) => v.id === watchedValues.preferredVenue) ??
    venueModes[0];
  const selectedVenueLabel = selectedVenueObj[locale];
  const selectedEventLabel =
    eventTypes.find((e) => e.id === watchedValues.eventType)?.[locale] ?? "";

  if (result) {
    return (
      <div className="mx-auto max-w-3xl overflow-hidden rounded-[28px] border border-[var(--cavo-gold)] bg-[#f8f6f2] p-6 shadow-[0_28px_70px_-22px_rgba(70,54,36,0.24)] sm:rounded-[36px] sm:p-10">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
          <div className="cavo-gold-gradient flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-white shadow-md">
            <CheckCircle2 className="h-6 w-6" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="inline-flex items-center gap-2 rounded-full border border-[var(--cavo-gold)]/40 bg-[#f1ede6] px-3 py-1 font-mono text-xs font-bold text-[var(--cavo-gold-deep)]">
              <span>{isAr ? "مرجع المناسبة:" : "EVENT BRIEF:"}</span>
              <span>{result.referenceId}</span>
            </div>

            <h2 className="font-display mt-2 text-2xl font-semibold text-[var(--cavo-ink)] sm:text-4xl">
              {isAr
                ? "تم تجهيز ملف المناسبة الخاصة بنجاح"
                : "Your Private Event Brief Is Ready"}
            </h2>

            <div className="mt-3 flex items-start gap-2.5 rounded-2xl border border-[var(--cavo-gold)]/40 bg-[#f1ede6] p-3.5 text-xs leading-relaxed text-[var(--cavo-smoke)] sm:text-sm">
              <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-[var(--cavo-terracotta)]" />
              <span>
                {isAr
                  ? "خطوة أخيرة: اضغط على زر (إرسال الملف عبر واتساب) ليراجع فريق يخوت ومناسبات كافو الإتاحة والسعة والتكلفة المخصصة لمناسبتك."
                  : "Final step: tap (Send Brief via WhatsApp) so our Private Events & Yachts team can confirm availability, capacity, and tailored pricing."}
              </span>
            </div>
          </div>
        </div>

        <dl className="mt-6 grid grid-cols-2 gap-3 rounded-[22px] border border-[var(--cavo-border)] bg-[#f3efe8] p-4 text-xs sm:grid-cols-4 sm:p-5 sm:text-sm">
          <div>
            <dt className="text-[11px] font-semibold text-[var(--cavo-smoke)]">
              {isAr ? "نوع المناسبة" : "Celebration"}
            </dt>
            <dd className="mt-0.5 font-display text-base font-bold text-[var(--cavo-ink)] sm:text-lg">
              {selectedEventLabel}
            </dd>
          </div>
          <div>
            <dt className="text-[11px] font-semibold text-[var(--cavo-smoke)]">
              {isAr ? "الوجهة المختارة" : "Venue"}
            </dt>
            <dd className="mt-0.5 font-semibold text-[var(--cavo-ink)]">
              {selectedVenueLabel}
            </dd>
          </div>
          <div>
            <dt className="text-[11px] font-semibold text-[var(--cavo-smoke)]">
              {isAr ? "الموعد والضيوف" : "Schedule & Guests"}
            </dt>
            <dd className="mt-0.5 font-mono font-bold text-[var(--cavo-gold-deep)]">
              {watchedValues.preferredDate} · {watchedValues.preferredTime} (
              {watchedValues.guestsCount})
            </dd>
          </div>
          <div>
            <dt className="text-[11px] font-semibold text-[var(--cavo-smoke)]">
              {isAr ? "خط التنسيق" : "Charter Desk"}
            </dt>
            <dd
              dir="ltr"
              className="mt-0.5 font-mono font-bold text-[var(--cavo-ink)]"
            >
              {result.conciergePhone}
            </dd>
          </div>
        </dl>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
          <a
            href={result.whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() =>
              trackCavoEvent("whatsapp_click", {
                venue: watchedValues.preferredVenue,
                source: "private_event_result",
              })
            }
            className="cavo-btn-gold inline-flex flex-1 items-center justify-center gap-2 rounded-full px-7 py-4 text-xs font-semibold sm:text-sm"
          >
            <MessageCircle className="h-4 w-4" />
            <span>
              {isAr
                ? `إرسال الملف عبر واتساب (${result.conciergePhone})`
                : `Send Brief via WhatsApp (${result.conciergePhone})`}
            </span>
          </a>

          <button
            type="button"
            onClick={() => setResult(null)}
            className="cavo-btn-pearl rounded-full px-6 py-3.5 text-xs font-semibold"
          >
            {isAr ? "تعديل البيانات" : "Edit Inquiry"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12 lg:gap-8"
    >
      {/* LEFT 8 COLS: INTERACTIVE STEP-BY-STEP PRIVATE EVENT & YACHT BUILDER */}
      <div className="min-w-0 space-y-6 rounded-[26px] border border-[var(--cavo-gold)]/45 bg-[#f8f6f2] p-4 shadow-[0_24px_65px_-22px_rgba(70,54,36,0.18)] sm:space-y-7 sm:rounded-[34px] sm:p-7 lg:col-span-8">
        {/* STEP 01 — VISUAL VENUE & CHARTER MODE SELECTOR */}
        <div>
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[var(--cavo-gold-deep)] sm:text-sm">
              <Anchor className="h-3.5 w-3.5 text-[var(--cavo-gold)]" />
              <span>
                {isAr
                  ? "01 · اختر مكان إقامة المناسبة أو اليخت الخاص"
                  : "01 · Select Your Charter or Private Venue"}
              </span>
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2.5 sm:gap-3 lg:grid-cols-4">
            {venueModes.map((mode) => {
              const active = watchedValues.preferredVenue === mode.id;
              return (
                <button
                  key={mode.id}
                  type="button"
                  aria-pressed={active}
                  onClick={() =>
                    setValue("preferredVenue", mode.id, {
                      shouldValidate: true,
                    })
                  }
                  className={`group relative flex flex-col overflow-hidden rounded-[18px] border p-1.5 text-start transition-all duration-300 sm:rounded-[22px] sm:p-2 ${
                    active
                      ? "border-[var(--cavo-gold)] bg-[#efe7db] shadow-[0_14px_30px_-12px_rgba(117,93,67,0.35)] ring-1 ring-[var(--cavo-gold)]"
                      : "border-[var(--cavo-border)] bg-[#f3efe8] opacity-85 hover:-translate-y-0.5 hover:border-[var(--cavo-gold)]/60 hover:opacity-100"
                  }`}
                >
                  <div className="relative aspect-[16/10] w-full overflow-hidden rounded-[12px] bg-[var(--cavo-stone)] sm:rounded-[15px]">
                    <Image
                      src={mode.image}
                      alt={mode[locale]}
                      fill
                      sizes="(max-width: 1024px) 45vw, 20vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#221a12]/80 via-transparent to-transparent" />
                    <span
                      className={`absolute start-1.5 top-1.5 rounded-full px-2 py-0.5 font-mono text-[9px] font-bold shadow-sm sm:text-[10px] ${
                        active
                          ? "bg-[var(--cavo-gold)] text-white"
                          : "bg-[#f6f3ee]/95 text-[var(--cavo-gold-deep)]"
                      }`}
                    >
                      {mode.num}
                    </span>
                    {active && (
                      <span className="cavo-gold-gradient absolute end-1.5 top-1.5 flex h-5 w-5 items-center justify-center rounded-full text-white shadow-sm">
                        <Check className="h-3 w-3" />
                      </span>
                    )}
                  </div>

                  <div className="mt-1.5 px-1 pb-0.5">
                    <p className="font-display truncate text-base font-bold text-[var(--cavo-ink)] sm:text-lg">
                      {mode[locale]}
                    </p>
                    <p className="truncate text-[10px] text-[var(--cavo-smoke)] sm:text-[11px]">
                      {mode.role[locale]}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* STEP 02 — CELEBRATION / EVENT TYPE CARDS */}
        <div className="border-t border-[var(--cavo-border)]/80 pt-5">
          <span className="mb-3 inline-flex items-center gap-1.5 text-xs font-bold text-[var(--cavo-gold-deep)] sm:text-sm">
            <Sparkles className="h-3.5 w-3.5 text-[var(--cavo-gold)]" />
            <span>
              {isAr ? "02 · نوع المناسبة أو الاحتفال" : "02 · Celebration Type"}
            </span>
          </span>

          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {eventTypes.map((evt) => {
              const active = watchedValues.eventType === evt.id;
              return (
                <button
                  key={evt.id}
                  type="button"
                  onClick={() =>
                    setValue("eventType", evt.id, { shouldValidate: true })
                  }
                  className={`flex items-center justify-between gap-3 rounded-2xl border px-4 py-3 text-start transition-all ${
                    active
                      ? "border-[var(--cavo-gold)] bg-[#efe7db] shadow-sm ring-1 ring-[var(--cavo-gold)]/50"
                      : "border-[var(--cavo-border)] bg-[#f3efe8] hover:border-[var(--cavo-gold)]/60"
                  }`}
                >
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-[var(--cavo-ink)] sm:text-sm">
                      {evt[locale]}
                    </p>
                    <p className="mt-0.5 text-[11px] text-[var(--cavo-smoke)]">
                      {evt.sub[locale]}
                    </p>
                  </div>
                  <span
                    className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${
                      active
                        ? "border-[var(--cavo-gold)] bg-[var(--cavo-gold)] text-white"
                        : "border-[var(--cavo-border)] bg-white"
                    }`}
                  >
                    {active && <Check className="h-3 w-3" />}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* STEP 03 — DATE, TIME, GUESTS STEPPER & OPTIONAL BUDGET */}
        <div className="space-y-4 border-t border-[var(--cavo-border)]/80 pt-5">
          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[var(--cavo-gold-deep)] sm:text-sm">
            <Calendar className="h-3.5 w-3.5 text-[var(--cavo-gold)]" />
            <span>
              {isAr
                ? "03 · التاريخ، التوقيت، وعدد الضيوف المتوقع"
                : "03 · Preferred Date, Time & Guest Count"}
            </span>
          </span>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {/* Preferred Date */}
            <div className="rounded-2xl border border-[var(--cavo-border)] bg-[#f3efe8] p-3">
              <label
                htmlFor="evt-date"
                className="mb-1.5 flex items-center gap-1.5 text-xs font-bold text-[var(--cavo-ink)]"
              >
                <Calendar className="h-3.5 w-3.5 text-[var(--cavo-gold-deep)]" />
                <span>{isAr ? "التاريخ المفضل *" : "Preferred Date *"}</span>
              </label>
              <CavoDatePicker
                id="evt-date"
                value={watchedValues.preferredDate || todayIso}
                minDate={todayIso}
                locale={locale}
                onChange={(nextIso) =>
                  setValue("preferredDate", nextIso, { shouldValidate: true })
                }
              />
              {errors.preferredDate && (
                <p role="alert" className="mt-1 text-[11px] text-red-700">
                  {errors.preferredDate.message}
                </p>
              )}
            </div>

            {/* Preferred Time + Presets */}
            <div className="rounded-2xl border border-[var(--cavo-border)] bg-[#f3efe8] p-3">
              <label
                htmlFor="evt-time"
                className="mb-1.5 flex items-center gap-1.5 text-xs font-bold text-[var(--cavo-ink)]"
              >
                <Clock className="h-3.5 w-3.5 text-[var(--cavo-gold-deep)]" />
                <span>{isAr ? "التوقيت المفضل *" : "Preferred Time *"}</span>
              </label>
              <CavoTimePicker
                id="evt-time"
                value={watchedValues.preferredTime || "18:30"}
                locale={locale}
                onChange={(nextTime) =>
                  setValue("preferredTime", nextTime, { shouldValidate: true })
                }
              />
              <div className="mt-2 flex flex-wrap gap-1">
                {eventTimePresets.map((slot) => {
                  const isCurrent = watchedValues.preferredTime === slot.time;
                  return (
                    <button
                      key={slot.time}
                      type="button"
                      onClick={() =>
                        setValue("preferredTime", slot.time, {
                          shouldValidate: true,
                        })
                      }
                      className={`rounded-full px-2 py-0.5 text-[10px] font-semibold transition ${
                        isCurrent
                          ? "bg-[var(--cavo-gold)] text-white"
                          : "border border-[var(--cavo-border)] bg-[#f8f6f2] text-[var(--cavo-ink)] hover:border-[var(--cavo-gold)]"
                      }`}
                    >
                      {slot.label[locale]}
                    </button>
                  );
                })}
              </div>
              {errors.preferredTime && (
                <p role="alert" className="mt-1 text-[11px] text-red-700">
                  {errors.preferredTime.message}
                </p>
              )}
            </div>

            {/* Guests Stepper + Quick Chips */}
            <div className="rounded-2xl border border-[var(--cavo-border)] bg-[#f3efe8] p-3">
              <label
                htmlFor="evt-guests"
                className="mb-1.5 flex items-center gap-1.5 text-xs font-bold text-[var(--cavo-ink)]"
              >
                <Users className="h-3.5 w-3.5 text-[var(--cavo-gold-deep)]" />
                <span>{isAr ? "عدد الضيوف *" : "Guest Count *"}</span>
              </label>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => adjustGuests(-5)}
                  aria-label="Decrease guests"
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[var(--cavo-border)] bg-white text-[var(--cavo-ink)] transition hover:border-[var(--cavo-gold)]"
                >
                  <Minus className="h-3.5 w-3.5" />
                </button>
                <input
                  id="evt-guests"
                  type="number"
                  min={2}
                  max={300}
                  {...register("guestsCount", { valueAsNumber: true })}
                  className="w-full rounded-xl border border-[var(--cavo-border)] bg-white py-2 text-center font-mono text-base font-bold text-[var(--cavo-ink)] focus:border-[var(--cavo-gold)] focus:outline-none sm:text-sm"
                />
                <button
                  type="button"
                  onClick={() => adjustGuests(5)}
                  aria-label="Increase guests"
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[var(--cavo-border)] bg-white text-[var(--cavo-ink)] transition hover:border-[var(--cavo-gold)]"
                >
                  <Plus className="h-3.5 w-3.5" />
                </button>
              </div>

              <div className="mt-2 flex flex-wrap gap-1">
                {[10, 15, 25, 40, 60].map((n) => {
                  const isCurrent = Number(watchedValues.guestsCount) === n;
                  return (
                    <button
                      key={n}
                      type="button"
                      onClick={() =>
                        setValue("guestsCount", n, { shouldValidate: true })
                      }
                      className={`rounded-full px-2.5 py-0.5 font-mono text-[10px] font-bold transition ${
                        isCurrent
                          ? "bg-[var(--cavo-gold)] text-white"
                          : "border border-[var(--cavo-border)] bg-[#f8f6f2] text-[var(--cavo-ink)] hover:border-[var(--cavo-gold)]"
                      }`}
                    >
                      {n}
                    </button>
                  );
                })}
              </div>
              {errors.guestsCount && (
                <p role="alert" className="mt-1 text-[11px] text-red-700">
                  {errors.guestsCount.message}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* STEP 04 — BESPOKE SETUP ADD-ONS, BUDGET & NOTES */}
        <div className="space-y-4 border-t border-[var(--cavo-border)]/80 pt-5">
          <div>
            <span className="mb-2 block text-xs font-bold text-[var(--cavo-gold-deep)] sm:text-sm">
              {isAr
                ? "04 · تجهيزات الاحتفال والمنيو المخصصة"
                : "04 · Tailored Styling & Setup Preferences"}
            </span>
            <div className="flex flex-wrap gap-1.5">
              {setupAddOns.map((item) => {
                const active = watchedPrefs.includes(item.id);
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => toggleSetup(item.id)}
                    className={`inline-flex items-center gap-1.5 rounded-full border px-3.5 py-2 text-xs font-semibold transition-all ${
                      active
                        ? "cavo-gold-gradient border-transparent text-white shadow-sm"
                        : "border-[var(--cavo-border)] bg-[#f3efe8] text-[var(--cavo-ink)] hover:border-[var(--cavo-gold)]"
                    }`}
                  >
                    {active ? (
                      <Check className="h-3.5 w-3.5" />
                    ) : (
                      <Plus className="h-3 w-3 text-[var(--cavo-gold)]" />
                    )}
                    <span>{item[locale]}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-3">
            <div className="sm:col-span-1">
              <label
                htmlFor="evt-budget"
                className="mb-1 block text-xs font-bold text-[var(--cavo-ink)]"
              >
                {isAr
                  ? "الميزانية التقريبية (اختياري)"
                  : "Estimated Budget (Optional)"}
              </label>
              <input
                id="evt-budget"
                type="text"
                {...register("budgetRange")}
                placeholder={isAr ? "مثال: 25,000 ج.م" : "e.g. 25,000 EGP"}
                className="w-full rounded-2xl border border-[var(--cavo-border)] bg-[#f3efe8] px-4 py-2.5 text-base font-medium text-[var(--cavo-ink)] placeholder:text-[var(--cavo-smoke)]/70 focus:border-[var(--cavo-gold)] focus:bg-white focus:outline-none sm:text-sm"
              />
            </div>

            <div className="sm:col-span-2">
              <label
                htmlFor="evt-req"
                className="mb-1 block text-xs font-bold text-[var(--cavo-ink)]"
              >
                {isAr
                  ? "تفاصيل إضافية (مدة الإبحار، تفضيلات المنيو...)"
                  : "Additional Charter or Event Notes"}
              </label>
              <input
                id="evt-req"
                type="text"
                {...register("additionalRequirements")}
                placeholder={
                  isAr
                    ? "اكتب أي تفاصيل خاصة عن المنيو أو مدة الرحلة..."
                    : "Desired sailing hours, menu preferences, or decor ideas..."
                }
                className="w-full rounded-2xl border border-[var(--cavo-border)] bg-[#f3efe8] px-4 py-2.5 text-base font-medium text-[var(--cavo-ink)] placeholder:text-[var(--cavo-smoke)]/70 focus:border-[var(--cavo-gold)] focus:bg-white focus:outline-none sm:text-sm"
              />
            </div>
          </div>
        </div>

        {/* STEP 05 — HOST CONTACT DETAILS */}
        <div className="space-y-3 border-t border-[var(--cavo-border)]/80 pt-5">
          <span className="block text-xs font-bold text-[var(--cavo-gold-deep)] sm:text-sm">
            {isAr
              ? "05 · بيانات التواصل لإرسال عرض السعر والتفاصيل"
              : "05 · Your Contact Details for Concierge Follow-Up"}
          </span>

          <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-3">
            <div>
              <label
                htmlFor="evt-name"
                className="mb-1 block text-xs font-bold text-[var(--cavo-ink)]"
              >
                {isAr ? "الاسم بالكامل *" : "Full Name *"}
              </label>
              <input
                id="evt-name"
                type="text"
                {...register("fullName")}
                placeholder={isAr ? "الاسم الثنائي" : "Your full name"}
                className="w-full rounded-2xl border border-[var(--cavo-border)] bg-[#f3efe8] px-4 py-2.5 text-base font-medium text-[var(--cavo-ink)] placeholder:text-[var(--cavo-smoke)]/70 focus:border-[var(--cavo-gold)] focus:bg-white focus:outline-none sm:text-sm"
              />
              {errors.fullName && (
                <p role="alert" className="mt-1 text-[11px] text-red-700">
                  {errors.fullName.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="evt-phone"
                className="mb-1 flex items-center gap-1 text-xs font-bold text-[var(--cavo-ink)]"
              >
                <Phone className="h-3 w-3 text-[var(--cavo-gold-deep)]" />
                <span>
                  {isAr ? "رقم الموبايل (واتساب) *" : "Mobile (WhatsApp) *"}
                </span>
              </label>
              <input
                id="evt-phone"
                type="tel"
                dir="ltr"
                {...register("phone")}
                placeholder="+20 1XX XXX XXXX"
                className="w-full rounded-2xl border border-[var(--cavo-border)] bg-[#f3efe8] px-4 py-2.5 text-base font-medium text-[var(--cavo-ink)] placeholder:text-[var(--cavo-smoke)]/70 focus:border-[var(--cavo-gold)] focus:bg-white focus:outline-none sm:text-sm"
              />
              {errors.phone && (
                <p role="alert" className="mt-1 text-[11px] text-red-700">
                  {errors.phone.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="evt-email"
                className="mb-1 flex items-center gap-1 text-xs font-bold text-[var(--cavo-ink)]"
              >
                <Mail className="h-3 w-3 text-[var(--cavo-gold-deep)]" />
                <span>{isAr ? "البريد الإلكتروني *" : "Email Address *"}</span>
              </label>
              <input
                id="evt-email"
                type="email"
                dir="ltr"
                {...register("email")}
                placeholder="name@example.com"
                className="w-full rounded-2xl border border-[var(--cavo-border)] bg-[#f3efe8] px-4 py-2.5 text-base font-medium text-[var(--cavo-ink)] placeholder:text-[var(--cavo-smoke)]/70 focus:border-[var(--cavo-gold)] focus:bg-white focus:outline-none sm:text-sm"
              />
              {errors.email && (
                <p role="alert" className="mt-1 text-[11px] text-red-700">
                  {errors.email.message}
                </p>
              )}
            </div>
          </div>
        </div>

        {submitError && (
          <p role="alert" className="text-xs font-medium text-red-700">
            {submitError}
          </p>
        )}

        <div className="flex flex-col gap-3 border-t border-[var(--cavo-border)] pt-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-xs text-[var(--cavo-smoke)]">
            <span>
              {isAr ? "مكتب التنسيق المختص:" : "Routed Charter Desk:"}
            </span>{" "}
            <strong
              dir="ltr"
              className="font-mono font-bold text-[var(--cavo-gold-deep)]"
            >
              {selectedVenueObj.phone}
            </strong>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="cavo-btn-gold inline-flex w-full items-center justify-center gap-2 rounded-full px-8 py-3.5 text-xs font-semibold disabled:opacity-60 sm:w-auto"
          >
            {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
            <span>
              {isSubmitting
                ? isAr
                  ? "جاري تجهيز ملف المناسبة..."
                  : "Preparing Event Brief..."
                : isAr
                  ? "تجهيز وإرسال ملف المناسبة الخاصة"
                  : "Prepare & Submit Event Inquiry"}
            </span>
            <ArrowRight className="h-3.5 w-3.5 rtl:rotate-180" />
          </button>
        </div>
      </div>

      {/* RIGHT 4 COLS: LIVE STICKY ESPRESSO-CHAMPAGNE CHARTER BOARDING PASS */}
      <aside className="min-w-0 space-y-4 lg:sticky lg:top-24 lg:col-span-4">
        <div className="overflow-hidden rounded-[26px] border border-[#d6bc96]/40 bg-gradient-to-br from-[#231a13] via-[#1b140e] to-[#2a1f16] p-4 text-[#f7f0e6] shadow-[0_28px_70px_-22px_rgba(30,20,12,0.5)] sm:rounded-[32px] sm:p-5">
          {/* Selected Venue Live Photo Header */}
          <div className="relative aspect-[16/10] w-full overflow-hidden rounded-[18px] bg-[#16100b]">
            <Image
              src={selectedVenueObj.image}
              alt={selectedVenueLabel}
              fill
              sizes="(max-width: 1024px) 100vw, 33vw"
              className="object-cover transition-all duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#19120c]/90 via-transparent to-[#19120c]/25" />

            <span className="absolute start-3 top-3 rounded-full border border-[#d6bc96]/45 bg-[#1b140e]/85 px-2.5 py-0.5 font-mono text-[10px] font-bold text-[#efdcb9] backdrop-blur-md">
              {selectedVenueObj.num} · {selectedVenueObj.role[locale]}
            </span>

            <div className="absolute inset-x-3.5 bottom-3">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-[#dfc398]">
                {isAr ? "ملخص المناسبة الحية" : "LIVE CHARTER BRIEF"}
              </p>
              <h3 className="font-display text-2xl font-semibold text-white">
                {selectedEventLabel}
              </h3>
            </div>
          </div>

          {/* Live Breakdown */}
          <div className="mt-4 space-y-2.5 rounded-2xl border border-[#d6bc96]/25 bg-white/[0.06] p-3.5 text-xs backdrop-blur-sm">
            <div className="flex items-center justify-between gap-2 border-b border-white/10 pb-2">
              <span className="text-[#cbbca6]">
                {isAr ? "الوجهة المختارة:" : "Venue:"}
              </span>
              <span className="text-end font-bold text-white">
                {selectedVenueLabel}
              </span>
            </div>

            <div className="flex items-center justify-between gap-2 border-b border-white/10 pb-2">
              <span className="text-[#cbbca6]">
                {isAr ? "الموعد المفضل:" : "Preferred Schedule:"}
              </span>
              <span className="text-end font-bold text-[#efdcb9]">
                {formatReadableDate(
                  watchedValues.preferredDate || todayIso,
                  locale
                )}{" "}
                ·{" "}
                {formatReadableTime24To12(
                  watchedValues.preferredTime || "18:30",
                  locale
                )}
              </span>
            </div>

            <div className="flex items-center justify-between gap-2 border-b border-white/10 pb-2">
              <span className="text-[#cbbca6]">
                {isAr ? "عدد الضيوف:" : "Guest Count:"}
              </span>
              <span className="font-mono font-bold text-white">
                {watchedValues.guestsCount || 15} {isAr ? "ضيفاً" : "Guests"}
              </span>
            </div>

            <div className="flex items-start justify-between gap-2">
              <span className="text-[#cbbca6]">
                {isAr ? "التجهيزات:" : "Add-Ons:"}
              </span>
              <span className="text-end font-semibold text-white">
                {watchedPrefs.length > 0
                  ? `${watchedPrefs.length} ${
                      isAr ? "تجهيزات مختارة" : "selected"
                    }`
                  : isAr
                    ? "بدون إضافات بعد"
                    : "Standard hosting"}
              </span>
            </div>
          </div>

          <p className="mt-3.5 rounded-2xl border border-[#d6bc96]/25 bg-black/25 p-3 text-[11px] leading-relaxed text-[#ded2c0]">
            {isAr
              ? "السعة القصوى، مدة الإبحار، وعرض السعر المخصص يُؤكد مباشرة مع فريق يخوت ومناسبات كافو فور مراجعة طلبك."
              : "Vessel capacity, cruise duration, and tailored menu pricing are confirmed directly by our Charter Desk upon reviewing your brief."}
          </p>

          <div className="mt-3.5 grid grid-cols-2 gap-2">
            <Link
              href={localePath(locale, "menu")}
              className="inline-flex items-center justify-center gap-1.5 rounded-full border border-[#d6bc96]/35 bg-white/10 px-3 py-2 text-[11px] font-semibold text-[#f8f2e8] transition hover:bg-white/20"
            >
              <UtensilsCrossed className="h-3 w-3 text-[#e5caa4]" />
              <span>{isAr ? "استعرض المنيو" : "Explore Menu"}</span>
            </Link>

            <a
              href={siteConfig.socials.instagramYachts}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-1.5 rounded-full border border-[#d6bc96]/35 bg-white/10 px-3 py-2 font-mono text-[11px] font-semibold text-[#efdcb9] transition hover:bg-white/20"
            >
              <span>@yachtsbycavo</span>
            </a>
          </div>
        </div>
      </aside>
    </form>
  );
}
