"use client";

import { useState, type FormEvent } from "react";
import { Check, MessageCircle, Phone, Sparkles } from "lucide-react";
import { buildWhatsAppUrl, siteConfig } from "@/data/site";
import { trackCavoEvent } from "@/lib/analytics";
import type { Locale } from "@/lib/i18n";

const departmentTabs = [
  {
    id: "general",
    label: { en: "Main & Boat", ar: "المطعم والمركب" },
    lineIdx: 0,
  },
  {
    id: "yacht",
    label: { en: "Yachts by Cavo", ar: "يخوت كافو" },
    lineIdx: 1,
  },
  {
    id: "elite",
    label: { en: "CAVO Elite", ar: "كافو إيليت" },
    lineIdx: 2,
  },
] as const;

const quickPrompts = [
  {
    id: "table",
    label: { en: "Tonight's Table", ar: "حجز طاولة اليوم" },
    text: {
      en: "Hello CAVO, I would like to ask about table availability for tonight.",
      ar: "مرحباً كافو، أرغب في الاستفسار عن إتاحة طاولة اليوم.",
    },
  },
  {
    id: "live",
    label: { en: "Live Music Nights", ar: "مواعيد السهرات واللايف" },
    text: {
      en: "Hello CAVO, could you share this week's live music & evening schedule?",
      ar: "مرحباً كافو، ممكن تفاصيل وجدول سهرات الموسيقى الحية هذا الأسبوع؟",
    },
  },
  {
    id: "yacht-charter",
    label: { en: "Private Yacht Info", ar: "استفسار يخت خاص" },
    text: {
      en: "Hello Yachts by Cavo, I'd like details on booking a private Nile yacht cruise.",
      ar: "مرحباً يخوت كافو، أرغب في معرفة تفاصيل حجز رحلة أو مناسبة على اليخت الخاص.",
    },
  },
  {
    id: "valet",
    label: { en: "Arrival & Valet", ar: "الوصول وركن السيارات" },
    text: {
      en: "Hello CAVO, what is the best arrival point and valet option at Nile City Boat?",
      ar: "مرحباً كافو، ما هي أسهل نقطة وصول وخدمة Valet أمام مركب نايل سيتي؟",
    },
  },
];

export function VisitContactForm({ locale }: { locale: Locale }) {
  const isAr = locale === "ar";
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [topic, setTopic] = useState<(typeof departmentTabs)[number]["id"]>("general");
  const [message, setMessage] = useState("");
  const [prepared, setPrepared] = useState(false);

  const selectedDept =
    departmentTabs.find((d) => d.id === topic) ?? departmentTabs[0];
  const line = siteConfig.contactLines[selectedDept.lineIdx] ?? siteConfig.contactLines[0];

  const waText = isAr
    ? `استفسار من موقع كافو آيلاند (${selectedDept.label.ar})\nالاسم: ${name}\nالموبايل: ${phone}\nالرسالة: ${message}`
    : `Inquiry from CAVO Island Website (${selectedDept.label.en})\nName: ${name}\nPhone: ${phone}\nMessage: ${message}`;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setPrepared(true);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 rounded-[26px] border border-[var(--cavo-gold)]/40 bg-[#f8f6f2] p-5 shadow-[0_22px_55px_-22px_rgba(70,54,36,0.18)] sm:rounded-[32px] sm:p-7"
    >
      <div>
        <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--cavo-border)] bg-[#f1ede6] px-3 py-1 text-[10px] font-bold text-[var(--cavo-gold-deep)] sm:text-[11px]">
          <Sparkles className="h-3 w-3 text-[var(--cavo-gold)]" />
          <span>
            {isAr ? "تواصل مباشر مع الاستقبال" : "DIRECT VENUE CONCIERGE DESK"}
          </span>
        </span>

        <h3 className="font-display mt-2 text-2xl font-semibold text-[var(--cavo-ink)] sm:text-3xl">
          {isAr ? "أرسل استفسارك مباشرة للفريق" : "Message the CAVO Concierge"}
        </h3>
        <p className="mt-1 text-xs leading-relaxed text-[var(--cavo-smoke)]">
          {isAr
            ? "اختر الوجهة وسيتم توجيه رسالتك فوراً لرقم الاستقبال المخصص لها عبر واتساب."
            : "Select your destination and your message will route directly to its dedicated WhatsApp desk."}
        </p>
      </div>

      {/* Interactive 3-Department Pill Switcher */}
      <div>
        <label className="mb-1.5 block text-xs font-bold text-[var(--cavo-ink)]">
          {isAr ? "1. اختر مكتب الاستقبال:" : "1. Select Venue Desk:"}
        </label>
        <div
          className="grid grid-cols-3 gap-1.5 rounded-2xl border border-[var(--cavo-border)] bg-[#f1ede6] p-1"
          role="tablist"
          aria-label={isAr ? "القسم المعني" : "Department"}
        >
          {departmentTabs.map((dept) => {
            const active = dept.id === topic;
            return (
              <button
                key={dept.id}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => {
                  setTopic(dept.id);
                  setPrepared(false);
                }}
                className={`relative min-h-[38px] rounded-xl px-2 py-2 text-center text-[11px] font-semibold transition-all sm:text-xs ${
                  active
                    ? "cavo-gold-gradient text-white shadow-sm"
                    : "text-[var(--cavo-ink)]/85 hover:text-[var(--cavo-gold-deep)]"
                }`}
              >
                <span className="block truncate">{dept.label[locale]}</span>
              </button>
            );
          })}
        </div>

        {/* Active Desk Phone Indicator */}
        <div className="mt-2 flex items-center justify-between rounded-xl border border-[var(--cavo-border)]/70 bg-[#f1ede6]/70 px-3 py-1.5 text-[11px]">
          <span className="text-[var(--cavo-smoke)]">
            {isAr ? "خط الاستقبال المختار:" : "Routed Desk Line:"}
          </span>
          <a
            href={line.telHref}
            dir="ltr"
            className="inline-flex items-center gap-1 font-mono font-bold text-[var(--cavo-gold-deep)] hover:underline"
          >
            <Phone className="h-3 w-3 text-[var(--cavo-gold)]" />
            <span>{line.phoneDisplay}</span>
          </a>
        </div>
      </div>

      {/* Quick One-Tap Topic Chips */}
      <div>
        <span className="mb-1.5 block text-[11px] font-semibold text-[var(--cavo-smoke)]">
          {isAr
            ? "استفسار سريع بضغطة واحدة (اختياري):"
            : "Quick Inquiry Presets (Optional):"}
        </span>
        <div className="flex flex-wrap gap-1.5">
          {quickPrompts.map((p) => {
            const isSelected = message === p.text[locale];
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => {
                  setMessage(p.text[locale]);
                  if (p.id === "yacht-charter") setTopic("yacht");
                  setPrepared(false);
                }}
                className={`rounded-full border px-3 py-1 text-[11px] font-medium transition ${
                  isSelected
                    ? "border-[var(--cavo-gold)] bg-[var(--cavo-gold)] text-white"
                    : "border-[var(--cavo-border)] bg-[#f1ede6] text-[var(--cavo-ink)] hover:border-[var(--cavo-gold)]"
                }`}
              >
                {p.label[locale]}
              </button>
            );
          })}
        </div>
      </div>

      {/* Name & Phone Row */}
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label
            htmlFor="visit-name"
            className="mb-1 block text-xs font-bold text-[var(--cavo-ink)]"
          >
            {isAr ? "الاسم *" : "Name *"}
          </label>
          <input
            id="visit-name"
            type="text"
            required
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setPrepared(false);
            }}
            placeholder={isAr ? "الاسم بالكامل" : "Your full name"}
            className="w-full rounded-2xl border border-[var(--cavo-border)] bg-[#f1ede6] px-4 py-2.5 text-base font-medium text-[var(--cavo-ink)] placeholder:text-[var(--cavo-smoke)]/70 focus:border-[var(--cavo-gold)] focus:bg-white focus:outline-none sm:text-sm"
          />
        </div>
        <div>
          <label
            htmlFor="visit-phone"
            className="mb-1 block text-xs font-bold text-[var(--cavo-ink)]"
          >
            {isAr ? "رقم الموبايل *" : "Phone *"}
          </label>
          <input
            id="visit-phone"
            type="tel"
            dir="ltr"
            required
            value={phone}
            onChange={(e) => {
              setPhone(e.target.value);
              setPrepared(false);
            }}
            placeholder="+20 1XX XXX XXXX"
            className="w-full rounded-2xl border border-[var(--cavo-border)] bg-[#f1ede6] px-4 py-2.5 text-base font-medium text-[var(--cavo-ink)] placeholder:text-[var(--cavo-smoke)]/70 focus:border-[var(--cavo-gold)] focus:bg-white focus:outline-none sm:text-sm"
          />
        </div>
      </div>

      {/* Message Textarea */}
      <div>
        <label
          htmlFor="visit-msg"
          className="mb-1 block text-xs font-bold text-[var(--cavo-ink)]"
        >
          {isAr ? "تفاصيل استفسارك *" : "Your Message *"}
        </label>
        <textarea
          id="visit-msg"
          rows={3}
          required
          value={message}
          onChange={(e) => {
            setMessage(e.target.value);
            setPrepared(false);
          }}
          placeholder={
            isAr
              ? "اكتب استفسارك أو الموعد وعدد الضيوف..."
              : "Share your inquiry, preferred date, or guest count..."
          }
          className="w-full rounded-2xl border border-[var(--cavo-border)] bg-[#f1ede6] px-4 py-2.5 text-base font-medium text-[var(--cavo-ink)] placeholder:text-[var(--cavo-smoke)]/70 focus:border-[var(--cavo-gold)] focus:bg-white focus:outline-none sm:text-sm"
        />
      </div>

      {/* Submit & Direct WhatsApp Action */}
      <div className="space-y-2.5 pt-1">
        <button
          type="submit"
          className="cavo-btn-gold flex w-full items-center justify-center gap-2 rounded-full px-6 py-3 text-xs font-semibold"
        >
          <Check className="h-3.5 w-3.5" />
          <span>
            {isAr
              ? `تجهيز الرسالة لمكتب ${selectedDept.label.ar}`
              : `Prepare Message for ${selectedDept.label.en}`}
          </span>
        </button>

        {prepared && (
          <a
            href={buildWhatsAppUrl(line.whatsappDigits, waText)}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() =>
              trackCavoEvent("whatsapp_click", {
                venue: topic,
                source: "visit_contact",
              })
            }
            className="flex w-full items-center justify-center gap-2 rounded-full border border-[var(--cavo-gold)] bg-[#282018] px-5 py-3 text-xs font-semibold text-[#f5ece0] shadow-md transition hover:bg-[var(--cavo-gold)] hover:text-white"
          >
            <MessageCircle className="h-4 w-4 text-[var(--cavo-gold-light)]" />
            <span>
              {isAr
                ? `إرسال الآن عبر واتساب (${line.phoneDisplay})`
                : `Send Now on WhatsApp (${line.phoneDisplay})`}
            </span>
          </a>
        )}
      </div>
    </form>
  );
}
