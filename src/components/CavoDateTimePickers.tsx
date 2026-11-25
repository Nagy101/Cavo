"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  Calendar,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clock,
  Moon,
  Sun,
  Sunrise,
  Sunset,
} from "lucide-react";
import type { Locale } from "@/lib/i18n";

const MONTH_NAMES: Record<Locale, string[]> = {
  en: [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ],
  ar: [
    "يناير",
    "فبراير",
    "مارس",
    "أبريل",
    "مايو",
    "يونيو",
    "يوليو",
    "أغسطس",
    "سبتمبر",
    "أكتوبر",
    "نوفمبر",
    "ديسمبر",
  ],
};

const WEEKDAY_SHORT: Record<Locale, string[]> = {
  en: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"],
  ar: ["ح", "ن", "ث", "ر", "خ", "ج", "س"],
};

const WEEKDAY_FULL: Record<Locale, string[]> = {
  en: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
  ar: ["الأحد", "الإثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"],
};

function parseIsoDate(iso: string): { year: number; month: number; day: number } {
  const parts = iso.split("-").map(Number);
  if (parts.length === 3 && !parts.some(Number.isNaN)) {
    return { year: parts[0], month: parts[1] - 1, day: parts[2] };
  }
  const now = new Date();
  return {
    year: now.getFullYear(),
    month: now.getMonth(),
    day: now.getDate(),
  };
}

function toIsoDateString(year: number, monthIndex: number, day: number): string {
  const m = String(monthIndex + 1).padStart(2, "0");
  const d = String(day).padStart(2, "0");
  return `${year}-${m}-${d}`;
}

export function formatReadableDate(iso: string, locale: Locale): string {
  const { year, month, day } = parseIsoDate(iso);
  const dateObj = new Date(year, month, day);
  const weekday = WEEKDAY_FULL[locale][dateObj.getDay()] ?? "";
  const monthName = MONTH_NAMES[locale][month] ?? "";
  if (locale === "ar") {
    return `${weekday}، ${day} ${monthName} ${year}`;
  }
  return `${weekday}, ${monthName.slice(0, 3)} ${day}, ${year}`;
}

export function formatReadableTime24To12(time24: string, locale: Locale): string {
  const [hStr, mStr] = (time24 || "21:00").split(":");
  const h = Number(hStr);
  const m = Number(mStr ?? 0);
  if (Number.isNaN(h)) return time24;

  const isPm = h >= 12;
  const h12 = h % 12 === 0 ? 12 : h % 12;
  const mFormatted = String(m).padStart(2, "0");
  const period =
    locale === "ar" ? (isPm ? "مساءً" : "صباحاً") : isPm ? "PM" : "AM";
  return `${String(h12).padStart(2, "0")}:${mFormatted} ${period}`;
}

interface CavoDatePickerProps {
  value: string;
  minDate: string;
  onChange: (nextIsoDate: string) => void;
  locale: Locale;
  id?: string;
}

export function CavoDatePicker({
  value,
  minDate,
  onChange,
  locale,
  id,
}: CavoDatePickerProps) {
  const isAr = locale === "ar";
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const parsedValue = useMemo(() => parseIsoDate(value || minDate), [value, minDate]);
  const [viewYear, setViewYear] = useState(parsedValue.year);
  const [viewMonth, setViewMonth] = useState(parsedValue.month);

  useEffect(() => {
    setViewYear(parsedValue.year);
    setViewMonth(parsedValue.month);
  }, [parsedValue.year, parsedValue.month]);

  useEffect(() => {
    if (!open) return;
    const handlePointerDown = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("mousedown", handlePointerDown);
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("mousedown", handlePointerDown);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  const calendarCells = useMemo(() => {
    const firstDayOfWeek = new Date(viewYear, viewMonth, 1).getDay();
    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
    const cells: (number | null)[] = [];
    for (let i = 0; i < firstDayOfWeek; i++) {
      cells.push(null);
    }
    for (let d = 1; d <= daysInMonth; d++) {
      cells.push(d);
    }
    return cells;
  }, [viewYear, viewMonth]);

  const goPrevMonth = () => {
    if (viewMonth === 0) {
      setViewYear((y) => y - 1);
      setViewMonth(11);
    } else {
      setViewMonth((m) => m - 1);
    }
  };

  const goNextMonth = () => {
    if (viewMonth === 11) {
      setViewYear((y) => y + 1);
      setViewMonth(0);
    } else {
      setViewMonth((m) => m + 1);
    }
  };

  return (
    <div ref={containerRef} className="relative">
      <button
        id={id}
        type="button"
        aria-expanded={open}
        aria-haspopup="dialog"
        onClick={() => setOpen((prev) => !prev)}
        className={`flex w-full items-center justify-between gap-2 rounded-xl border bg-white px-3.5 py-2.5 text-start shadow-sm transition-all ${
          open
            ? "border-[var(--cavo-gold)] ring-2 ring-[var(--cavo-gold)]/25"
            : "border-[var(--cavo-border)] hover:border-[var(--cavo-gold)]"
        }`}
      >
        <div className="flex min-w-0 items-center gap-2">
          <Calendar className="h-4 w-4 shrink-0 text-[var(--cavo-gold-deep)]" />
          <span className="truncate text-xs font-bold text-[var(--cavo-ink)] sm:text-sm">
            {formatReadableDate(value || minDate, locale)}
          </span>
        </div>
        <ChevronDown
          className={`h-4 w-4 shrink-0 text-[var(--cavo-gold)] transition-transform duration-300 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {open && (
        <div
          role="dialog"
          aria-label={isAr ? "اختيار التاريخ" : "Choose Date"}
          className="cavo-pop-in absolute start-0 top-full z-50 mt-2 w-[min(315px,calc(100vw-2.5rem))] overflow-hidden rounded-[24px] border border-[var(--cavo-gold)]/60 bg-[#f8f6f2] p-4 text-[var(--cavo-ink)] shadow-[0_28px_65px_-16px_rgba(44,34,22,0.32)] backdrop-blur-xl"
        >
            {/* Calendar Month/Year Header */}
            <div className="mb-3 flex items-center justify-between border-b border-[var(--cavo-border)]/80 pb-2.5">
              <button
                type="button"
                onClick={goPrevMonth}
                aria-label={isAr ? "الشهر السابق" : "Previous month"}
                className="flex h-8 w-8 items-center justify-center rounded-full border border-[var(--cavo-border)] bg-[#f1ede6] text-[var(--cavo-ink)] transition hover:border-[var(--cavo-gold)] hover:bg-[var(--cavo-gold)] hover:text-white"
              >
                <ChevronLeft className="h-4 w-4 rtl:rotate-180" />
              </button>

              <span className="font-display text-lg font-bold text-[var(--cavo-ink)]">
                {MONTH_NAMES[locale][viewMonth]} {viewYear}
              </span>

              <button
                type="button"
                onClick={goNextMonth}
                aria-label={isAr ? "الشهر التالي" : "Next month"}
                className="flex h-8 w-8 items-center justify-center rounded-full border border-[var(--cavo-border)] bg-[#f1ede6] text-[var(--cavo-ink)] transition hover:border-[var(--cavo-gold)] hover:bg-[var(--cavo-gold)] hover:text-white"
              >
                <ChevronRight className="h-4 w-4 rtl:rotate-180" />
              </button>
            </div>

            {/* Weekday Header Row */}
            <div className="mb-1.5 grid grid-cols-7 text-center">
              {WEEKDAY_SHORT[locale].map((w) => (
                <span
                  key={w}
                  className="py-1 text-[10px] font-bold uppercase text-[var(--cavo-gold-deep)]"
                >
                  {w}
                </span>
              ))}
            </div>

            {/* Days Grid */}
            <div className="grid grid-cols-7 gap-1">
              {calendarCells.map((day, idx) => {
                if (day === null) {
                  return <span key={`empty-${idx}`} className="h-9" />;
                }

                const cellIso = toIsoDateString(viewYear, viewMonth, day);
                const isPast = cellIso < minDate;
                const isSelected = cellIso === value;
                const isToday = cellIso === minDate;

                return (
                  <button
                    key={cellIso}
                    type="button"
                    disabled={isPast}
                    onClick={() => {
                      onChange(cellIso);
                      setOpen(false);
                    }}
                    className={`relative flex h-9 w-full items-center justify-center rounded-xl font-mono text-xs font-bold transition-all ${
                      isSelected
                        ? "cavo-gold-gradient text-white shadow-md scale-105"
                        : isPast
                        ? "cursor-not-allowed text-[var(--cavo-smoke)]/30"
                        : isToday
                        ? "border border-[var(--cavo-gold)] bg-[#efe7db] text-[var(--cavo-gold-deep)] hover:bg-[var(--cavo-gold)] hover:text-white"
                        : "text-[var(--cavo-ink)] hover:bg-[#efe7db] hover:text-[var(--cavo-gold-deep)]"
                    }`}
                  >
                    {day}
                  </button>
                );
              })}
            </div>

            {/* Quick Bottom Footer */}
            <div className="mt-3 flex items-center justify-between border-t border-[var(--cavo-border)]/80 pt-2.5 text-xs">
              <button
                type="button"
                onClick={() => {
                  onChange(minDate);
                  setOpen(false);
                }}
                className="rounded-full bg-[#efe7db] px-3 py-1 font-semibold text-[var(--cavo-gold-deep)] transition hover:bg-[var(--cavo-gold)] hover:text-white"
              >
                {isAr ? "تاريخ اليوم" : "Select Today"}
              </button>

              <button
                type="button"
                onClick={() => setOpen(false)}
                className="font-semibold text-[var(--cavo-smoke)] hover:text-[var(--cavo-ink)]"
              >
                {isAr ? "إغلاق" : "Done"}
              </button>
            </div>
        </div>
      )}
    </div>
  );
}

interface TimePeriodGroup {
  id: string;
  label: Record<Locale, string>;
  icon: "sunrise" | "sun" | "sunset" | "moon";
  slots: { value: string; display: Record<Locale, string> }[];
}

const TIME_PERIOD_GROUPS: TimePeriodGroup[] = [
  {
    id: "morning",
    label: { en: "Morning & Brunch", ar: "الصباح والفطار" },
    icon: "sunrise",
    slots: [
      { value: "08:30", display: { en: "08:30 AM", ar: "08:30 ص" } },
      { value: "09:30", display: { en: "09:30 AM", ar: "09:30 ص" } },
      { value: "10:30", display: { en: "10:30 AM", ar: "10:30 ص" } },
      { value: "11:30", display: { en: "11:30 AM", ar: "11:30 ص" } },
    ],
  },
  {
    id: "afternoon",
    label: { en: "Midday & Lunch", ar: "الظهيرة والغداء" },
    icon: "sun",
    slots: [
      { value: "13:00", display: { en: "01:00 PM", ar: "01:00 م" } },
      { value: "14:30", display: { en: "02:30 PM", ar: "02:30 م" } },
      { value: "15:30", display: { en: "03:30 PM", ar: "03:30 م" } },
      { value: "16:30", display: { en: "04:30 PM", ar: "04:30 م" } },
    ],
  },
  {
    id: "sunset",
    label: { en: "Golden Hour Sunset", ar: "ساعة الغروب" },
    icon: "sunset",
    slots: [
      { value: "17:30", display: { en: "05:30 PM", ar: "05:30 م" } },
      { value: "18:00", display: { en: "06:00 PM", ar: "06:00 م" } },
      { value: "19:00", display: { en: "07:00 PM", ar: "07:00 م" } },
      { value: "19:30", display: { en: "07:30 PM", ar: "07:30 م" } },
    ],
  },
  {
    id: "night",
    label: { en: "Dinner & Late Night", ar: "العشاء والسهر" },
    icon: "moon",
    slots: [
      { value: "20:30", display: { en: "08:30 PM", ar: "08:30 م" } },
      { value: "21:00", display: { en: "09:00 PM", ar: "09:00 م" } },
      { value: "22:00", display: { en: "10:00 PM", ar: "10:00 م" } },
      { value: "23:00", display: { en: "11:00 PM", ar: "11:00 م" } },
      { value: "23:30", display: { en: "11:30 PM", ar: "11:30 م" } },
      { value: "00:30", display: { en: "12:30 AM", ar: "12:30 ص" } },
      { value: "01:30", display: { en: "01:30 AM", ar: "01:30 ص" } },
      { value: "02:30", display: { en: "02:30 AM", ar: "02:30 ص" } },
    ],
  },
];

interface CavoTimePickerProps {
  value: string;
  onChange: (nextTime24: string) => void;
  locale: Locale;
  id?: string;
}

export function CavoTimePicker({
  value,
  onChange,
  locale,
  id,
}: CavoTimePickerProps) {
  const isAr = locale === "ar";
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handlePointerDown = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("mousedown", handlePointerDown);
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("mousedown", handlePointerDown);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  const parsedTime = useMemo(() => {
    const [hStr, mStr] = (value || "21:00").split(":");
    const h24 = Number(hStr) || 0;
    const m = Number(mStr) || 0;
    const isPm = h24 >= 12;
    const h12 = h24 % 12 === 0 ? 12 : h24 % 12;
    return { h24, h12, m, isPm };
  }, [value]);

  const setCustomTime = (h12: number, m: number, isPm: boolean) => {
    let h24 = h12 % 12;
    if (isPm) h24 += 12;
    const next = `${String(h24).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
    onChange(next);
  };

  return (
    <div ref={containerRef} className="relative">
      <button
        id={id}
        type="button"
        aria-expanded={open}
        aria-haspopup="dialog"
        onClick={() => setOpen((prev) => !prev)}
        className={`flex w-full items-center justify-between gap-2 rounded-xl border bg-white px-3.5 py-2.5 text-start shadow-sm transition-all ${
          open
            ? "border-[var(--cavo-gold)] ring-2 ring-[var(--cavo-gold)]/25"
            : "border-[var(--cavo-border)] hover:border-[var(--cavo-gold)]"
        }`}
      >
        <div className="flex min-w-0 items-center gap-2">
          <Clock className="h-4 w-4 shrink-0 text-[var(--cavo-gold-deep)]" />
          <span className="truncate font-mono text-xs font-bold text-[var(--cavo-ink)] sm:text-sm">
            {formatReadableTime24To12(value || "21:00", locale)}
          </span>
        </div>
        <ChevronDown
          className={`h-4 w-4 shrink-0 text-[var(--cavo-gold)] transition-transform duration-300 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {open && (
        <div
          role="dialog"
          aria-label={isAr ? "اختيار التوقيت" : "Choose Time"}
          className="cavo-pop-in absolute start-0 top-full z-50 mt-2 w-[min(330px,calc(100vw-2.5rem))] overflow-hidden rounded-[24px] border border-[var(--cavo-gold)]/60 bg-[#f8f6f2] p-4 text-[var(--cavo-ink)] shadow-[0_28px_65px_-16px_rgba(44,34,22,0.32)] backdrop-blur-xl"
        >
            {/* Header */}
            <div className="mb-3 flex items-center justify-between border-b border-[var(--cavo-border)]/80 pb-2">
              <span className="font-display text-base font-bold text-[var(--cavo-ink)]">
                {isAr
                  ? "اختر توقيت الزيارة المفضل"
                  : "Select Your Arrival Time"}
              </span>
              <span className="rounded-full bg-[#efe7db] px-2.5 py-0.5 font-mono text-[11px] font-bold text-[var(--cavo-gold-deep)]">
                {formatReadableTime24To12(value || "21:00", locale)}
              </span>
            </div>

            {/* 4 Time-of-Day Grouped Slot Grids */}
            <div className="max-h-[260px] space-y-3 overflow-y-auto pe-1">
              {TIME_PERIOD_GROUPS.map((group) => {
                const GroupIcon =
                  group.icon === "sunrise"
                    ? Sunrise
                    : group.icon === "sun"
                    ? Sun
                    : group.icon === "sunset"
                    ? Sunset
                    : Moon;

                return (
                  <div key={group.id}>
                    <div className="mb-1.5 flex items-center gap-1.5 text-[11px] font-bold text-[var(--cavo-gold-deep)]">
                      <GroupIcon className="h-3.5 w-3.5 text-[var(--cavo-gold)]" />
                      <span>{group.label[locale]}</span>
                    </div>
                    <div className="grid grid-cols-4 gap-1.5">
                      {group.slots.map((slot) => {
                        const isSelected = value === slot.value;
                        return (
                          <button
                            key={slot.value}
                            type="button"
                            onClick={() => {
                              onChange(slot.value);
                              setOpen(false);
                            }}
                            className={`rounded-xl border py-1.5 text-center font-mono text-[11px] font-bold transition-all ${
                              isSelected
                                ? "cavo-gold-gradient border-transparent text-white shadow-sm"
                                : "border-[var(--cavo-border)] bg-[#f1ede6] text-[var(--cavo-ink)] hover:border-[var(--cavo-gold)] hover:bg-[#efe7db]"
                            }`}
                          >
                            {slot.display[locale]}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Fine-Tune Exact Hour / Minute / AM-PM Bar */}
            <div className="mt-3 border-t border-[var(--cavo-border)]/80 pt-3">
              <div className="flex items-center justify-between gap-1.5">
                {/* Hour Selector */}
                <select
                  aria-label={isAr ? "الساعة" : "Hour"}
                  value={parsedTime.h12}
                  onChange={(e) =>
                    setCustomTime(
                      Number(e.target.value),
                      parsedTime.m,
                      parsedTime.isPm
                    )
                  }
                  className="rounded-xl border border-[var(--cavo-border)] bg-white px-2.5 py-1.5 font-mono text-xs font-bold text-[var(--cavo-ink)] focus:border-[var(--cavo-gold)] focus:outline-none"
                >
                  {[12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((h) => (
                    <option key={h} value={h}>
                      {String(h).padStart(2, "0")}
                    </option>
                  ))}
                </select>

                <span className="font-mono font-bold text-[var(--cavo-gold-deep)]">
                  :
                </span>

                {/* Minute Selector */}
                <div className="flex flex-1 items-center gap-1">
                  {[0, 15, 30, 45].map((m) => {
                    const active = parsedTime.m === m;
                    return (
                      <button
                        key={m}
                        type="button"
                        onClick={() =>
                          setCustomTime(parsedTime.h12, m, parsedTime.isPm)
                        }
                        className={`flex-1 rounded-lg py-1 font-mono text-[11px] font-bold transition ${
                          active
                            ? "bg-[var(--cavo-gold)] text-white"
                            : "border border-[var(--cavo-border)] bg-white text-[var(--cavo-ink)]"
                        }`}
                      >
                        :{String(m).padStart(2, "0")}
                      </button>
                    );
                  })}
                </div>

                {/* AM / PM Toggle */}
                <div className="inline-flex rounded-xl border border-[var(--cavo-border)] bg-[#f1ede6] p-0.5">
                  <button
                    type="button"
                    onClick={() =>
                      setCustomTime(parsedTime.h12, parsedTime.m, false)
                    }
                    className={`rounded-lg px-2 py-1 text-[10px] font-bold transition ${
                      !parsedTime.isPm
                        ? "bg-[var(--cavo-gold)] text-white"
                        : "text-[var(--cavo-smoke)]"
                    }`}
                  >
                    {isAr ? "ص" : "AM"}
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setCustomTime(parsedTime.h12, parsedTime.m, true)
                    }
                    className={`rounded-lg px-2 py-1 text-[10px] font-bold transition ${
                      parsedTime.isPm
                        ? "bg-[var(--cavo-gold)] text-white"
                        : "text-[var(--cavo-smoke)]"
                    }`}
                  >
                    {isAr ? "م" : "PM"}
                  </button>
                </div>
              </div>

              <div className="mt-2.5 flex justify-end">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="cavo-btn-gold rounded-full px-4 py-1 text-xs font-semibold"
                >
                  {isAr ? "تأكيد الوقت" : "Confirm Time"}
                </button>
              </div>
            </div>
        </div>
      )}
    </div>
  );
}
