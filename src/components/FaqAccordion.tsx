"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { faqItems } from "@/data/copy";
import type { Locale } from "@/lib/i18n";

export function FaqAccordion({ locale }: { locale: Locale }) {
  const [openId, setOpenId] = useState<string | null>(faqItems[0].id);

  return (
    <div className="space-y-3">
      {faqItems.map((item, idx) => {
        const isOpen = openId === item.id;
        const num = String(idx + 1).padStart(2, "0");

        return (
          <div
            key={item.id}
            className={`overflow-hidden rounded-[22px] border transition-all duration-300 sm:rounded-[26px] ${
              isOpen
                ? "border-[var(--cavo-gold)] bg-[#f8f6f2] shadow-[0_16px_38px_-18px_rgba(70,54,36,0.18)]"
                : "border-[var(--cavo-border)] bg-[#f8f6f2]/85 hover:border-[var(--cavo-gold)]/55"
            }`}
          >
            <button
              type="button"
              aria-expanded={isOpen}
              onClick={() => setOpenId(isOpen ? null : item.id)}
              className="flex w-full items-center justify-between gap-3.5 px-4 py-4 text-start transition sm:px-6 sm:py-5"
            >
              <div className="flex min-w-0 items-center gap-3">
                <span
                  className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full font-mono text-[11px] font-bold transition-colors sm:h-8 sm:w-8 sm:text-xs ${
                    isOpen
                      ? "cavo-gold-gradient text-white shadow-sm"
                      : "bg-[var(--cavo-gold-pale)] text-[var(--cavo-gold-deep)]"
                  }`}
                >
                  {num}
                </span>
                <span className="font-display break-words text-base font-semibold leading-snug text-[var(--cavo-ink)] sm:text-xl">
                  {item.question[locale]}
                </span>
              </div>

              <span
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border transition-all duration-300 ${
                  isOpen
                    ? "rotate-180 border-[var(--cavo-gold)] bg-[var(--cavo-gold-pale)] text-[var(--cavo-gold-deep)]"
                    : "border-[var(--cavo-border)] bg-[#f1ede6] text-[var(--cavo-smoke)]"
                }`}
              >
                <ChevronDown className="h-4 w-4" />
              </span>
            </button>

            <div
              className={`grid transition-[grid-template-rows,opacity] duration-300 ease-out ${
                isOpen
                  ? "grid-rows-[1fr] opacity-100"
                  : "grid-rows-[0fr] opacity-0"
              }`}
            >
              <div className="overflow-hidden">
                <div className="border-t border-[var(--cavo-border)]/75 bg-[#f3efe8]/75 px-4 py-3.5 text-xs leading-relaxed text-[var(--cavo-smoke)] sm:px-6 sm:py-4 sm:text-sm">
                  {item.answer[locale]}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
