"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { CalendarCheck } from "lucide-react";
import { trackCavoEvent } from "@/lib/analytics";
import { localePath, type Locale } from "@/lib/i18n";

export function FloatingReserveButton({ locale }: { locale: Locale }) {
  const isAr = locale === "ar";
  const pathname = usePathname() || `/${locale}`;
  const [visible, setVisible] = useState(false);
  const [billDockActive, setBillDockActive] = useState(false);

  // Never show on reservation or private-event form pages
  const isFormPage =
    pathname.endsWith("/book") || pathname.includes("/private-events");
  const isHomePage = pathname === `/${locale}` || pathname === `/${locale}/`;

  useEffect(() => {
    if (isFormPage) {
      setVisible(false);
      return;
    }

    const checkVisibility = () => {
      // On Home, wait until visitor scrolls past the Hero's primary Reserve button
      const threshold = isHomePage ? 280 : 120;
      setVisible(window.scrollY > threshold);
      setBillDockActive(Boolean(document.getElementById("cavo-live-bill-dock")));
    };

    checkVisibility();
    window.addEventListener("scroll", checkVisibility, { passive: true });

    // Observe DOM mutations on /menu so we yield cleanly if the Live Bill Estimator dock opens
    const observer = pathname.includes("/menu")
      ? new MutationObserver(() => {
          setBillDockActive(
            Boolean(document.getElementById("cavo-live-bill-dock"))
          );
        })
      : null;

    if (observer && document.body) {
      observer.observe(document.body, { childList: true, subtree: true });
    }

    return () => {
      window.removeEventListener("scroll", checkVisibility);
      observer?.disconnect();
    };
  }, [isFormPage, isHomePage, pathname]);

  if (isFormPage) return null;

  const shouldShow = visible && !billDockActive;

  return (
    <div
      className={`fixed end-4 bottom-5 z-30 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] lg:hidden ${
        shouldShow
          ? "translate-y-0 scale-100 opacity-100"
          : "pointer-events-none translate-y-6 scale-90 opacity-0"
      }`}
    >
      <Link
        href={localePath(locale, "book")}
        aria-label={isAr ? "احجز طاولتك الآن" : "Reserve a table"}
        onClick={() =>
          trackCavoEvent("booking_start", { source: "floating_fab" })
        }
        className="cavo-sheen-card group inline-flex items-center gap-2 rounded-full border border-[#e5caa4]/55 bg-gradient-to-r from-[#221912]/96 via-[#33251a]/96 to-[#241a12]/96 p-1.5 pe-4 text-[#fbf6ee] shadow-[0_18px_40px_-8px_rgba(24,16,10,0.58)] backdrop-blur-xl transition-transform duration-300 active:scale-95"
      >
        <span className="cavo-gold-gradient relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-white shadow-md">
          <span
            aria-hidden="true"
            className="absolute inset-0 animate-ping rounded-full bg-[#e5caa4]/35 [animation-duration:2.8s]"
          />
          <CalendarCheck className="relative z-10 h-4 w-4" />
        </span>

        <span
          className={`text-xs font-semibold tracking-wide text-[#f8efe2] ${
            isAr ? "" : "uppercase tracking-[0.14em]"
          }`}
        >
          {isAr ? "احجز" : "Book"}
        </span>
      </Link>
    </div>
  );
}
