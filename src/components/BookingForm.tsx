"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  ArrowRight,
  Calendar,
  Check,
  CheckCircle2,
  Clock,
  Compass,
  Instagram,
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
import { businessConfirmationRegistry } from "@/data/site";
import { getVenueBySlug, venues } from "@/data/venues";
import { trackCavoEvent } from "@/lib/analytics";
import {
  submitBookingRequest,
  type SubmissionResult,
} from "@/lib/integrations/concierge";
import { localePath, type Locale } from "@/lib/i18n";
import {
  bookingSchema,
  getTodayCairoDateString,
  type BookingFormValues,
} from "@/lib/validations/booking";
import type { VenueSlug } from "@/types/cavo";

const occasions = [
  {
    id: "Casual Dining / Coffee",
    en: "Dining & Coffee",
    ar: "غداء أو عشاء أو قهوة",
  },
  {
    id: "Morning Nile Breakfast",
    en: "Morning Nile Brunch",
    ar: "فطار الصباح على النيل",
  },
  {
    id: "Sunset / Romantic Evening",
    en: "Sunset / Romantic Dinner",
    ar: "أمسية غروب أو عشاء رومانسي",
  },
  {
    id: "Birthday / Celebration",
    en: "Birthday / Celebration",
    ar: "عيد ميلاد أو احتفال",
  },
  {
    id: "Business Hosting",
    en: "Business / VIP Hosting",
    ar: "لقاء عمل أو استضافة",
  },
];

const timePresets = [
  { time: "10:00", label: { en: "10:00 AM · Brunch", ar: "10:00 ص · فطار" } },
  { time: "14:30", label: { en: "2:30 PM · Lunch", ar: "2:30 م · غداء" } },
  { time: "18:00", label: { en: "6:00 PM · Sunset", ar: "6:00 م · غروب" } },
  { time: "21:00", label: { en: "9:00 PM · Dinner", ar: "9:00 م · عشاء" } },
  { time: "23:30", label: { en: "11:30 PM · Late Night", ar: "11:30 م · سهرة" } },
];

const specialRequestChips = [
  {
    id: "quiet-nile",
    text: {
      en: "Quiet table directly overlooking the Nile",
      ar: "طاولة هادئة مطلة على النيل مباشرة",
    },
  },
  {
    id: "birthday-setup",
    text: {
      en: "Birthday celebration table arrangement",
      ar: "تجهيز الطاولة لمناسبة عيد ميلاد",
    },
  },
  {
    id: "live-music",
    text: {
      en: "Close to live music / evening performance",
      ar: "طاولة قريبة من أجواء الموسيقى الحية",
    },
  },
  {
    id: "sunset-view",
    text: {
      en: "Best sunset photography angle",
      ar: "زاوية مميزة لمشاهدة الغروب والتصوير",
    },
  },
];

function addDaysToIsoDate(baseIso: string, daysToAdd: number): string {
  const parts = baseIso.split("-").map(Number);
  if (parts.length !== 3) return baseIso;
  const d = new Date(Date.UTC(parts[0], parts[1] - 1, parts[2] + daysToAdd));
  return d.toISOString().slice(0, 10);
}

export function BookingForm({ locale }: { locale: Locale }) {
  const isAr = locale === "ar";
  const searchParams = useSearchParams();
  const initialSlug = searchParams.get("venue");

  const validInitialSlug: VenueSlug =
    initialSlug && getVenueBySlug(initialSlug)
      ? (initialSlug as VenueSlug)
      : "main-restaurant";

  const initialVenue = getVenueBySlug(validInitialSlug) ?? venues[0];
  const todayIso = getTodayCairoDateString();
  const tomorrowIso = addDaysToIsoDate(todayIso, 1);
  const dayAfterIso = addDaysToIsoDate(todayIso, 2);

  const [reviewing, setReviewing] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [result, setResult] = useState<SubmissionResult | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    trigger,
    formState: { errors, isSubmitting },
  } = useForm<BookingFormValues>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      venue: validInitialSlug,
      date: todayIso,
      time: "21:00",
      guests: 2,
      fullName: "",
      phone: "",
      email: "",
      occasion: occasions[0].id,
      seatingPreference: initialVenue.seatingOptions[0].id,
      specialRequests: "",
    },
  });

  const watchedVenue = watch("venue");
  const watchedSeating = watch("seatingPreference");
  const watchedValues = watch();
  const selectedVenue = getVenueBySlug(watchedVenue) ?? venues[0];

  useEffect(() => {
    if (initialSlug && getVenueBySlug(initialSlug)) {
      setValue("venue", initialSlug as VenueSlug);
    }
  }, [initialSlug, setValue]);

  useEffect(() => {
    const firstOption = selectedVenue.seatingOptions[0]?.id ?? "";
    setValue("seatingPreference", firstOption);
  }, [selectedVenue, setValue]);

  const handleProceedToReview = async () => {
    setSubmitError("");
    const valid = await trigger();
    if (valid) {
      setReviewing(true);
    }
  };

  const onSubmit = async (data: BookingFormValues) => {
    if (isSubmitting) return;
    setSubmitError("");
    try {
      const response = await submitBookingRequest(data, locale);
      trackCavoEvent("booking_submit", {
        venue: data.venue,
        guests: data.guests,
      });
      setResult(response);
      setReviewing(false);
    } catch {
      setSubmitError(
        isAr
          ? "حدث خطأ أثناء تجهيز الطلب. يمكنك إعادة المحاولة أو التواصل مباشرة على رقم الوجهة."
          : "Could not prepare the reservation request. Please try again or contact the venue line directly."
      );
    }
  };

  const selectedSeatingLabel =
    selectedVenue.seatingOptions.find((s) => s.id === watchedSeating)?.label[
      locale
    ] ?? "";
  const selectedOccasionLabel =
    occasions.find((o) => o.id === watchedValues.occasion)?.[locale] ??
    watchedValues.occasion;

  const adjustGuests = (delta: number) => {
    const current = Number(watchedValues.guests) || 2;
    const next = Math.max(1, Math.min(150, current + delta));
    setValue("guests", next, { shouldValidate: true });
  };

  const toggleSpecialRequestChip = (chipText: string) => {
    const current = (watchedValues.specialRequests ?? "").trim();
    if (current.includes(chipText)) {
      const cleaned = current
        .replace(chipText, "")
        .replace(/\s*·\s*·\s*/g, " · ")
        .replace(/^(\s*·\s*)|(\s*·\s*)$/g, "")
        .trim();
      setValue("specialRequests", cleaned);
    } else {
      const next = current ? `${current} · ${chipText}` : chipText;
      setValue("specialRequests", next);
    }
  };

  // SUCCESS / PREPARED RESERVATION TICKET STATE
  if (result) {
    return (
      <div className="mx-auto max-w-3xl overflow-hidden rounded-[28px] border border-[var(--cavo-gold)] bg-[#f8f6f2] p-6 shadow-[0_26px_70px_-22px_rgba(70,54,36,0.22)] sm:rounded-[36px] sm:p-10">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
          <div className="cavo-gold-gradient flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-white shadow-md">
            <CheckCircle2 className="h-6 w-6" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="inline-flex items-center gap-2 rounded-full border border-[var(--cavo-gold)]/40 bg-[#f1ede6] px-3 py-1 font-mono text-xs font-bold text-[var(--cavo-gold-deep)]">
              <span>{isAr ? "مرجع الطلب:" : "REFERENCE:"}</span>
              <span>{result.referenceId}</span>
            </div>

            <h2 className="font-display mt-2 text-2xl font-semibold text-[var(--cavo-ink)] sm:text-4xl">
              {isAr
                ? "تم تجهيز بطاقة طلب الحجز بنجاح"
                : "Your Reservation Request Is Ready"}
            </h2>

            <div className="mt-3 flex items-start gap-2.5 rounded-2xl border border-[var(--cavo-gold)]/40 bg-[#f1ede6] p-3.5 text-xs leading-relaxed text-[var(--cavo-smoke)] sm:text-sm">
              <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-[var(--cavo-terracotta)]" />
              <span>
                {isAr
                  ? "خطوة أخيرة لتأكيد الطاولة: اضغط على زر (إرسال الطلب عبر واتساب) بالأسفل ليراجع مكتب الاستقبال التوافر ويؤكد حجزك رسمياً."
                  : "Final step to confirm your table: tap (Send Request on WhatsApp) below so our venue host desk can verify table availability and confirm your booking."}
              </span>
            </div>
          </div>
        </div>

        {/* Summary Ticket Grid */}
        <dl className="mt-6 grid grid-cols-2 gap-3 rounded-[22px] border border-[var(--cavo-border)] bg-[#f3efe8] p-4 text-xs sm:grid-cols-4 sm:p-5 sm:text-sm">
          <div>
            <dt className="text-[11px] font-semibold text-[var(--cavo-smoke)]">
              {isAr ? "الوجهة المختارة" : "Experience"}
            </dt>
            <dd className="mt-0.5 font-display text-base font-bold text-[var(--cavo-ink)] sm:text-lg">
              {selectedVenue.name[locale]}
            </dd>
          </div>
          <div>
            <dt className="text-[11px] font-semibold text-[var(--cavo-smoke)]">
              {isAr ? "تفضيل الجلسة" : "Seating Zone"}
            </dt>
            <dd className="mt-0.5 font-semibold text-[var(--cavo-ink)]">
              {selectedSeatingLabel}
            </dd>
          </div>
          <div>
            <dt className="text-[11px] font-semibold text-[var(--cavo-smoke)]">
              {isAr ? "الموعد والعدد" : "Date, Time & Party"}
            </dt>
            <dd className="mt-0.5 font-mono font-bold text-[var(--cavo-gold-deep)]">
              {watchedValues.date} · {watchedValues.time} ({watchedValues.guests}{" "}
              {isAr ? "أفراد" : "guests"})
            </dd>
          </div>
          <div>
            <dt className="text-[11px] font-semibold text-[var(--cavo-smoke)]">
              {isAr ? "خط استقبال الوجهة" : "Concierge Desk"}
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
                venue: watchedVenue,
                source: "booking_result",
              })
            }
            className="cavo-btn-gold inline-flex flex-1 items-center justify-center gap-2 rounded-full px-7 py-4 text-xs font-semibold sm:text-sm"
          >
            <MessageCircle className="h-4 w-4" />
            <span>
              {isAr
                ? `إرسال الطلب الآن عبر واتساب (${selectedVenue.name.ar})`
                : `Send Request on ${selectedVenue.name.en} WhatsApp`}
            </span>
          </a>

          <button
            type="button"
            onClick={() => setResult(null)}
            className="cavo-btn-pearl rounded-full px-6 py-3.5 text-xs font-semibold"
          >
            {isAr ? "تعديل أو طلب جديد" : "Edit / New Request"}
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
      {/* LEFT 8 COLS: INTERACTIVE STEP-BY-STEP RESERVATION BUILDER */}
      <div className="min-w-0 space-y-5 rounded-[24px] border border-[var(--cavo-gold)]/45 bg-[#f8f6f2] p-4 shadow-[0_24px_65px_-22px_rgba(70,54,36,0.18)] sm:space-y-7 sm:rounded-[34px] sm:p-7 lg:col-span-8">
        {/* STEP 01 — VISUAL PHOTO VENUE SELECTOR (2x2 ON MOBILE & 4-COL ON DESKTOP) */}
        <div>
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[var(--cavo-gold-deep)] sm:text-sm">
              <Sparkles className="h-3.5 w-3.5 text-[var(--cavo-gold)]" />
              <span>
                {isAr
                  ? "01 · اختر وجهة وتجربة زيارتك على النيل"
                  : "01 · Choose Your CAVO Nile Experience"}
              </span>
            </span>
            <Link
              href={localePath(locale, "experiences")}
              className="text-[11px] font-semibold text-[var(--cavo-gold-deep)] hover:underline"
            >
              {isAr ? "مقارنة التجارب الأربع ←" : "Compare All 4 Venues →"}
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-2.5 sm:gap-3 lg:grid-cols-4">
            {venues.map((venue) => {
              const active = venue.slug === watchedVenue;
              return (
                <button
                  key={venue.slug}
                  type="button"
                  aria-pressed={active}
                  onClick={() => {
                    setValue("venue", venue.slug, { shouldValidate: true });
                    setReviewing(false);
                  }}
                  className={`group relative flex flex-col overflow-hidden rounded-[18px] border p-1.5 text-start transition-all duration-300 sm:rounded-[22px] sm:p-2 ${
                    active
                      ? "border-[var(--cavo-gold)] bg-[#efe7db] shadow-[0_14px_30px_-12px_rgba(117,93,67,0.35)] ring-1 ring-[var(--cavo-gold)]"
                      : "border-[var(--cavo-border)] bg-[#f3efe8] opacity-85 hover:-translate-y-0.5 hover:border-[var(--cavo-gold)]/60 hover:opacity-100"
                  }`}
                >
                  <div className="relative aspect-[16/10] w-full overflow-hidden rounded-[12px] bg-[var(--cavo-stone)] sm:rounded-[15px]">
                    <Image
                      src={venue.cardImage}
                      alt={venue.name[locale]}
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
                      {venue.number}
                    </span>

                    {active && (
                      <span className="cavo-gold-gradient absolute end-1.5 top-1.5 flex h-5 w-5 items-center justify-center rounded-full text-white shadow-sm">
                        <Check className="h-3 w-3" />
                      </span>
                    )}
                  </div>

                  <div className="mt-1.5 px-1 pb-0.5">
                    <p className="font-display truncate text-base font-bold text-[var(--cavo-ink)] sm:text-lg">
                      {venue.name[locale]}
                    </p>
                    <p className="truncate text-[10px] text-[var(--cavo-smoke)] sm:text-[11px]">
                      {venue.role[locale]}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
          {errors.venue && (
            <p role="alert" className="mt-1.5 text-xs font-medium text-red-700">
              {errors.venue.message}
            </p>
          )}
        </div>

        {/* STEP 02 — INTERACTIVE SEATING ZONE SELECTOR FOR CHOSEN VENUE */}
        <div className="border-t border-[var(--cavo-border)]/80 pt-5">
          <div className="mb-2.5 flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[var(--cavo-gold-deep)] sm:text-sm">
              <Compass className="h-3.5 w-3.5 text-[var(--cavo-gold)]" />
              <span>
                {isAr
                  ? `02 · تفضيل الجلسة داخل ${selectedVenue.name.ar}`
                  : `02 · Preferred Seating Zone at ${selectedVenue.name.en}`}
              </span>
            </span>
          </div>

          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
            {selectedVenue.seatingOptions.map((opt, idx) => {
              const active = opt.id === watchedSeating;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => {
                    setValue("seatingPreference", opt.id);
                    setReviewing(false);
                  }}
                  className={`flex items-center justify-between gap-2 rounded-2xl border px-3.5 py-2.5 text-start transition-all ${
                    active
                      ? "border-[var(--cavo-gold)] bg-[#efe7db] shadow-sm ring-1 ring-[var(--cavo-gold)]/50"
                      : "border-[var(--cavo-border)] bg-[#f3efe8] hover:border-[var(--cavo-gold)]/60"
                  }`}
                >
                  <div className="min-w-0">
                    <span className="font-mono text-[10px] font-bold text-[var(--cavo-gold-deep)]">
                      ZONE 0{idx + 1}
                    </span>
                    <p className="mt-0.5 text-xs font-bold text-[var(--cavo-ink)]">
                      {opt.label[locale]}
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

        {/* STEP 03 — DATE, TIME & PARTY SIZE (WITH ONE-TAP MOBILE PRESETS!) */}
        <div className="space-y-4 border-t border-[var(--cavo-border)]/80 pt-5">
          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[var(--cavo-gold-deep)] sm:text-sm">
            <Calendar className="h-3.5 w-3.5 text-[var(--cavo-gold)]" />
            <span>
              {isAr
                ? "03 · التاريخ، التوقيت، وعدد الضيوف"
                : "03 · Date, Preferred Hour & Party Size"}
            </span>
          </span>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {/* Date Field + Quick Day Chips */}
            <div className="rounded-2xl border border-[var(--cavo-border)] bg-[#f3efe8] p-3">
              <label
                htmlFor="booking-date"
                className="mb-1.5 flex items-center gap-1.5 text-xs font-bold text-[var(--cavo-ink)]"
              >
                <Calendar className="h-3.5 w-3.5 text-[var(--cavo-gold-deep)]" />
                <span>{isAr ? "التاريخ المطلوب *" : "Preferred Date *"}</span>
              </label>

              <CavoDatePicker
                id="booking-date"
                value={watchedValues.date || todayIso}
                minDate={todayIso}
                locale={locale}
                onChange={(nextIso) => {
                  setValue("date", nextIso, { shouldValidate: true });
                  setReviewing(false);
                }}
              />

              {/* Quick Day Shortcuts */}
              <div className="mt-2 flex flex-wrap gap-1">
                {[
                  { iso: todayIso, label: { en: "Today", ar: "اليوم" } },
                  { iso: tomorrowIso, label: { en: "Tomorrow", ar: "غداً" } },
                  { iso: dayAfterIso, label: { en: "In 2 Days", ar: "بعد غد" } },
                ].map((d) => {
                  const isCurrent = watchedValues.date === d.iso;
                  return (
                    <button
                      key={d.iso}
                      type="button"
                      onClick={() => {
                        setValue("date", d.iso, { shouldValidate: true });
                        setReviewing(false);
                      }}
                      className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold transition ${
                        isCurrent
                          ? "bg-[var(--cavo-gold)] text-white"
                          : "border border-[var(--cavo-border)] bg-[#f8f6f2] text-[var(--cavo-ink)] hover:border-[var(--cavo-gold)]"
                      }`}
                    >
                      {d.label[locale]}
                    </button>
                  );
                })}
              </div>
              {errors.date && (
                <p role="alert" className="mt-1 text-[11px] text-red-700">
                  {errors.date.message}
                </p>
              )}
            </div>

            {/* Time Field + Quick Time-of-Day Chips */}
            <div className="rounded-2xl border border-[var(--cavo-border)] bg-[#f3efe8] p-3">
              <label
                htmlFor="booking-time"
                className="mb-1.5 flex items-center gap-1.5 text-xs font-bold text-[var(--cavo-ink)]"
              >
                <Clock className="h-3.5 w-3.5 text-[var(--cavo-gold-deep)]" />
                <span>{isAr ? "التوقيت المفضل *" : "Preferred Time *"}</span>
              </label>

              <CavoTimePicker
                id="booking-time"
                value={watchedValues.time || "21:00"}
                locale={locale}
                onChange={(nextTime) => {
                  setValue("time", nextTime, { shouldValidate: true });
                  setReviewing(false);
                }}
              />

              {/* Quick Time Slots */}
              <div className="mt-2 flex flex-wrap gap-1">
                {timePresets.map((slot) => {
                  const isCurrent = watchedValues.time === slot.time;
                  return (
                    <button
                      key={slot.time}
                      type="button"
                      onClick={() => {
                        setValue("time", slot.time, { shouldValidate: true });
                        setReviewing(false);
                      }}
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
              {errors.time && (
                <p role="alert" className="mt-1 text-[11px] text-red-700">
                  {errors.time.message}
                </p>
              )}
            </div>

            {/* Guests Stepper + Quick Party Size Chips */}
            <div className="rounded-2xl border border-[var(--cavo-border)] bg-[#f3efe8] p-3">
              <label
                htmlFor="booking-guests"
                className="mb-1.5 flex items-center gap-1.5 text-xs font-bold text-[var(--cavo-ink)]"
              >
                <Users className="h-3.5 w-3.5 text-[var(--cavo-gold-deep)]" />
                <span>{isAr ? "عدد الضيوف *" : "Party Size *"}</span>
              </label>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => adjustGuests(-1)}
                  aria-label="Decrease guests"
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[var(--cavo-border)] bg-white text-[var(--cavo-ink)] transition hover:border-[var(--cavo-gold)]"
                >
                  <Minus className="h-3.5 w-3.5" />
                </button>
                <input
                  id="booking-guests"
                  type="number"
                  min={1}
                  max={150}
                  {...register("guests", { valueAsNumber: true })}
                  className="w-full rounded-xl border border-[var(--cavo-border)] bg-white py-2 text-center font-mono text-base font-bold text-[var(--cavo-ink)] focus:border-[var(--cavo-gold)] focus:outline-none sm:text-sm"
                />
                <button
                  type="button"
                  onClick={() => adjustGuests(1)}
                  aria-label="Increase guests"
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[var(--cavo-border)] bg-white text-[var(--cavo-ink)] transition hover:border-[var(--cavo-gold)]"
                >
                  <Plus className="h-3.5 w-3.5" />
                </button>
              </div>

              <div className="mt-2 flex flex-wrap gap-1">
                {[2, 4, 6, 8, 12].map((n) => {
                  const isCurrent = Number(watchedValues.guests) === n;
                  return (
                    <button
                      key={n}
                      type="button"
                      onClick={() => {
                        setValue("guests", n, { shouldValidate: true });
                        setReviewing(false);
                      }}
                      className={`rounded-full px-2.5 py-0.5 font-mono text-[10px] font-bold transition ${
                        isCurrent
                          ? "bg-[var(--cavo-gold)] text-white"
                          : "border border-[var(--cavo-border)] bg-[#f8f6f2] text-[var(--cavo-ink)] hover:border-[var(--cavo-gold)]"
                      }`}
                    >
                      {n} {isAr ? "أفراد" : "guests"}
                    </button>
                  );
                })}
              </div>
              {errors.guests && (
                <p role="alert" className="mt-1 text-[11px] text-red-700">
                  {errors.guests.message}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* STEP 04 — OCCASION PILLS & ONE-TAP SPECIAL REQUEST CHIPS */}
        <div className="space-y-4 border-t border-[var(--cavo-border)]/80 pt-5">
          <div>
            <label className="mb-2 block text-xs font-bold text-[var(--cavo-gold-deep)] sm:text-sm">
              {isAr
                ? "04 · مناسبة الزيارة وطلباتك الخاصة"
                : "04 · Occasion & Special Table Requests"}
            </label>
            <div className="flex flex-wrap gap-1.5">
              {occasions.map((occ) => {
                const active = watchedValues.occasion === occ.id;
                return (
                  <button
                    key={occ.id}
                    type="button"
                    onClick={() => {
                      setValue("occasion", occ.id);
                      setReviewing(false);
                    }}
                    className={`rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-all ${
                      active
                        ? "border-[var(--cavo-gold)] bg-[var(--cavo-gold)] text-white shadow-sm"
                        : "border-[var(--cavo-border)] bg-[#f3efe8] text-[var(--cavo-ink)] hover:border-[var(--cavo-gold)]"
                    }`}
                  >
                    {occ[locale]}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <div className="mb-1.5 flex flex-wrap items-center justify-between gap-1">
              <label
                htmlFor="booking-notes"
                className="text-xs font-bold text-[var(--cavo-ink)]"
              >
                {isAr
                  ? "ملاحظات الاستقبال (اختياري — اضغط لإضافة تفضيل سريع):"
                  : "Special Requests (Optional — Tap to Add Quick Notes):"}
              </label>
            </div>

            <div className="mb-2 flex flex-wrap gap-1.5">
              {specialRequestChips.map((chip) => {
                const chipLabel = chip.text[locale];
                const isSelected = (watchedValues.specialRequests ?? "").includes(
                  chipLabel
                );
                return (
                  <button
                    key={chip.id}
                    type="button"
                    onClick={() => toggleSpecialRequestChip(chipLabel)}
                    className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[11px] font-medium transition ${
                      isSelected
                        ? "border-[var(--cavo-gold)] bg-[#efe7db] font-semibold text-[var(--cavo-gold-deep)]"
                        : "border-[var(--cavo-border)] bg-[#f1ede6] text-[var(--cavo-smoke)] hover:border-[var(--cavo-gold)]"
                    }`}
                  >
                    {isSelected ? (
                      <Check className="h-3 w-3 text-[var(--cavo-gold-deep)]" />
                    ) : (
                      <Plus className="h-3 w-3 text-[var(--cavo-gold)]" />
                    )}
                    <span>{chipLabel}</span>
                  </button>
                );
              })}
            </div>

            <textarea
              id="booking-notes"
              rows={2}
              {...register("specialRequests")}
              placeholder={
                isAr
                  ? "أي تفاصيل إضافية تود إبلاغ فريق الاستقبال بها..."
                  : "Any additional notes for our host desk..."
              }
              className="w-full rounded-2xl border border-[var(--cavo-border)] bg-[#f3efe8] px-4 py-2.5 text-base font-medium text-[var(--cavo-ink)] placeholder:text-[var(--cavo-smoke)]/70 focus:border-[var(--cavo-gold)] focus:bg-white focus:outline-none sm:text-sm"
            />
          </div>
        </div>

        {/* STEP 05 — GUEST CONTACT DETAILS */}
        <div className="space-y-3 border-t border-[var(--cavo-border)]/80 pt-5">
          <span className="block text-xs font-bold text-[var(--cavo-gold-deep)] sm:text-sm">
            {isAr
              ? "05 · بيانات التواصل لتأكيد الحجز"
              : "05 · Your Contact Details for Confirmation"}
          </span>

          <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-3">
            <div>
              <label
                htmlFor="booking-name"
                className="mb-1 block text-xs font-bold text-[var(--cavo-ink)]"
              >
                {isAr ? "الاسم بالكامل *" : "Full Name *"}
              </label>
              <input
                id="booking-name"
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
                htmlFor="booking-phone"
                className="mb-1 flex items-center gap-1 text-xs font-bold text-[var(--cavo-ink)]"
              >
                <Phone className="h-3 w-3 text-[var(--cavo-gold-deep)]" />
                <span>
                  {isAr ? "رقم الموبايل (واتساب) *" : "Mobile (WhatsApp) *"}
                </span>
              </label>
              <input
                id="booking-phone"
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
                htmlFor="booking-email"
                className="mb-1 flex items-center gap-1 text-xs font-bold text-[var(--cavo-ink)]"
              >
                <Mail className="h-3 w-3 text-[var(--cavo-gold-deep)]" />
                <span>
                  {isAr ? "البريد الإلكتروني (اختياري)" : "Email (Optional)"}
                </span>
              </label>
              <input
                id="booking-email"
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

        {/* Review Banner & Form Submit Actions */}
        {reviewing && (
          <div className="rounded-2xl border border-[var(--cavo-gold)] bg-[#efe7db] p-4">
            <p className="text-xs font-bold text-[var(--cavo-gold-deep)]">
              {isAr
                ? "مراجعة سريعة قبل تجهيز بطاقة الحجز:"
                : "Quick Review Before Generating Your Request:"}
            </p>
            <div className="mt-2 grid grid-cols-1 gap-2 text-xs sm:grid-cols-3">
              <div>
                <span className="text-[var(--cavo-smoke)]">
                  {isAr ? "الوجهة والجلسة:" : "Venue & Zone:"}
                </span>
                <p className="font-bold text-[var(--cavo-ink)]">
                  {selectedVenue.name[locale]} · {selectedSeatingLabel}
                </p>
              </div>
              <div>
                <span className="text-[var(--cavo-smoke)]">
                  {isAr ? "التاريخ والتوقيت:" : "Schedule:"}
                </span>
                <p className="font-mono font-bold text-[var(--cavo-ink)]">
                  {watchedValues.date} · {watchedValues.time}
                </p>
              </div>
              <div>
                <span className="text-[var(--cavo-smoke)]">
                  {isAr ? "الضيوف والمناسبة:" : "Guests & Occasion:"}
                </span>
                <p className="font-bold text-[var(--cavo-ink)]">
                  {watchedValues.guests} {isAr ? "أفراد" : "guests"} ·{" "}
                  {selectedOccasionLabel}
                </p>
              </div>
            </div>
          </div>
        )}

        {submitError && (
          <p role="alert" className="text-xs font-medium text-red-700">
            {submitError}
          </p>
        )}

        <div className="flex flex-col gap-3 border-t border-[var(--cavo-border)] pt-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-xs text-[var(--cavo-smoke)]">
            <span>
              {isAr
                ? `يُوجّه الطلب مباشرة لمكتب ${selectedVenue.name.ar}:`
                : `Routed directly to ${selectedVenue.name.en} Desk:`}
            </span>{" "}
            <strong
              dir="ltr"
              className="font-mono font-bold text-[var(--cavo-gold-deep)]"
            >
              {selectedVenue.phoneDisplay}
            </strong>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {!reviewing ? (
              <button
                type="button"
                onClick={handleProceedToReview}
                className="cavo-btn-gold inline-flex w-full items-center justify-center gap-2 rounded-full px-8 py-3.5 text-xs font-semibold sm:w-auto"
              >
                <span>
                  {isAr
                    ? "مراجعة وتجهيز طلب الحجز"
                    : "Review Reservation Request"}
                </span>
                <ArrowRight className="h-3.5 w-3.5 rtl:rotate-180" />
              </button>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => setReviewing(false)}
                  className="cavo-btn-pearl rounded-full px-5 py-3 text-xs font-semibold"
                >
                  {isAr ? "تعديل البيانات" : "Edit Details"}
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="cavo-btn-gold inline-flex flex-1 items-center justify-center gap-2 rounded-full px-8 py-3.5 text-xs font-semibold disabled:opacity-60 sm:flex-initial"
                >
                  {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
                  <span>
                    {isSubmitting
                      ? isAr
                        ? "جاري التجهيز..."
                        : "Preparing..."
                      : isAr
                      ? "تأكيد وتجهيز بطاقة الحجز"
                      : "Confirm & Prepare Booking"}
                  </span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* RIGHT 4 COLS: LIVE STICKY ESPRESSO-CHAMPAGNE RESERVATION BOARDING PASS */}
      <aside className="min-w-0 space-y-4 lg:sticky lg:top-24 lg:col-span-4">
        <div className="overflow-hidden rounded-[26px] border border-[#d6bc96]/40 bg-gradient-to-br from-[#231a13] via-[#1b140e] to-[#2a1f16] p-4 text-[#f7f0e6] shadow-[0_28px_70px_-22px_rgba(30,20,12,0.5)] sm:rounded-[32px] sm:p-5">
          {/* Selected Venue Live Crossfade Photo Header */}
          <div className="relative aspect-[16/10] w-full overflow-hidden rounded-[18px] bg-[#16100b]">
            <div
              key={selectedVenue.slug}
              className="cavo-ken-burns relative h-full w-full"
            >
              <Image
                src={selectedVenue.heroImage}
                alt={selectedVenue.name[locale]}
                fill
                sizes="(max-width: 1024px) 100vw, 33vw"
                className="object-cover"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-[#19120c]/90 via-transparent to-[#19120c]/25" />

            <span className="absolute start-3 top-3 rounded-full border border-[#d6bc96]/45 bg-[#1b140e]/85 px-2.5 py-0.5 font-mono text-[10px] font-bold text-[#efdcb9] backdrop-blur-md">
              {selectedVenue.number} · {selectedVenue.role[locale]}
            </span>

            <a
              href={selectedVenue.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="absolute end-3 top-3 inline-flex items-center gap-1 rounded-full border border-white/35 bg-[#241c14]/75 px-2.5 py-0.5 font-mono text-[10px] font-medium text-[#f3e9d9] backdrop-blur-md"
            >
              <Instagram className="h-2.5 w-2.5" />
              <span>{selectedVenue.instagramHandle}</span>
            </a>

            <div className="absolute inset-x-3.5 bottom-2.5">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-[#dfc398]">
                {isAr ? "بطاقة ملخص الحجز الحية" : "LIVE RESERVATION PASS"}
              </p>
              <h2 className="font-display text-2xl font-semibold text-white">
                {selectedVenue.name[locale]}
              </h2>
            </div>
          </div>

          {/* Live Selected Details Breakdown */}
          <div className="mt-4 space-y-2.5 rounded-2xl border border-[#d6bc96]/25 bg-white/[0.06] p-3.5 text-xs backdrop-blur-sm">
            <div className="flex items-center justify-between gap-2 border-b border-white/10 pb-2">
              <span className="text-[#cbbca6]">
                {isAr ? "منطقة الجلوس:" : "Seating Zone:"}
              </span>
              <span className="text-end font-bold text-white">
                {selectedSeatingLabel}
              </span>
            </div>

            <div className="flex items-center justify-between gap-2 border-b border-white/10 pb-2">
              <span className="text-[#cbbca6]">
                {isAr ? "التاريخ والتوقيت:" : "Date & Time:"}
              </span>
              <span className="text-end font-bold text-[#efdcb9]">
                {formatReadableDate(watchedValues.date || todayIso, locale)} ·{" "}
                {formatReadableTime24To12(
                  watchedValues.time || "21:00",
                  locale
                )}
              </span>
            </div>

            <div className="flex items-center justify-between gap-2 border-b border-white/10 pb-2">
              <span className="text-[#cbbca6]">
                {isAr ? "عدد الضيوف:" : "Party Size:"}
              </span>
              <span className="font-bold text-white">
                {watchedValues.guests || 2} {isAr ? "أفراد" : "Guests"}
              </span>
            </div>

            <div className="flex items-center justify-between gap-2">
              <span className="text-[#cbbca6]">
                {isAr ? "المناسبة:" : "Occasion:"}
              </span>
              <span className="text-end font-semibold text-white">
                {selectedOccasionLabel}
              </span>
            </div>
          </div>

          {/* Dedicated Concierge Desk & Confirmation Policy */}
          <div className="mt-3.5 rounded-2xl border border-[#d6bc96]/25 bg-black/25 p-3.5 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-bold text-[#efdcb9]">
                {isAr ? "مكتب الاستقبال المختص:" : "Dedicated Venue Desk:"}
              </span>
              <a
                href={`tel:${selectedVenue.phoneDisplay.replace(/\s+/g, "")}`}
                dir="ltr"
                className="inline-flex items-center gap-1 font-mono font-bold text-white transition hover:text-[#efdcb9]"
              >
                <Phone className="h-3 w-3 text-[#d6bc96]" />
                {selectedVenue.phoneDisplay}
              </a>
            </div>
            <p className="mt-2 border-t border-white/10 pt-2 text-[11px] leading-relaxed text-[#ded2c0]">
              {businessConfirmationRegistry.liveReservationApi.note[locale]}
            </p>
          </div>

          {/* Quick Links to Menu & Venue Details */}
          <div className="mt-3.5 grid grid-cols-2 gap-2">
            <Link
              href={localePath(locale, "menu")}
              className="inline-flex items-center justify-center gap-1.5 rounded-full border border-[#d6bc96]/35 bg-white/10 px-3 py-2 text-[11px] font-semibold text-[#f8f2e8] transition hover:bg-white/20"
            >
              <UtensilsCrossed className="h-3 w-3 text-[#e5caa4]" />
              <span>{isAr ? "تصفح المنيو" : "Explore Menu"}</span>
            </Link>

            <Link
              href={localePath(locale, `experiences/${selectedVenue.slug}`)}
              className="inline-flex items-center justify-center gap-1.5 rounded-full border border-[#d6bc96]/35 bg-white/10 px-3 py-2 text-[11px] font-semibold text-[#f8f2e8] transition hover:bg-white/20"
            >
              <span>{isAr ? "تفاصيل الوجهة" : "Venue Info"}</span>
              <ArrowRight className="h-3 w-3 rtl:rotate-180" />
            </Link>
          </div>
        </div>
      </aside>
    </form>
  );
}
