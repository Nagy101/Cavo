"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Globe } from "lucide-react";
import { trackCavoEvent } from "@/lib/analytics";
import type { Locale } from "@/lib/i18n";

export function FooterLocaleSwitch({
  locale,
  label,
}: {
  locale: Locale;
  label: string;
}) {
  const pathname = usePathname() || `/${locale}`;
  const otherLocale: Locale = locale === "en" ? "ar" : "en";
  const subPath = pathname.replace(/^\/(en|ar)(?=\/|$)/, "");
  const href = `/${otherLocale}${subPath}`;

  return (
    <Link
      href={href}
      onClick={() =>
        trackCavoEvent("language_change", {
          from: locale,
          to: otherLocale,
        })
      }
      className="inline-flex items-center gap-1.5 rounded-full border border-[var(--cavo-border)] bg-[#f6f3ee] px-4 py-1.5 text-xs font-semibold text-[var(--cavo-gold-deep)] transition hover:border-[var(--cavo-gold)]"
    >
      <Globe className="h-3.5 w-3.5 text-[var(--cavo-gold)]" />
      <span>{label}</span>
    </Link>
  );
}
