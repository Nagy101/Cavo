"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Anchor,
  ArrowRight,
  ChevronDown,
  Globe,
  Menu,
  Sparkles,
  X,
} from "lucide-react";
import { BrandMark } from "@/components/BrandMark";
import { navCopy } from "@/data/copy";
import { venues } from "@/data/venues";
import { trackCavoEvent } from "@/lib/analytics";
import { localePath, type Locale } from "@/lib/i18n";

interface NavbarProps {
  locale: Locale;
}

export function Navbar({ locale }: NavbarProps) {
  const pathname = usePathname() || `/${locale}`;
  const isAr = locale === "ar";
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const megaContainerRef = useRef<HTMLDivElement>(null);

  const copy = navCopy[locale];
  const otherLocale: Locale = locale === "en" ? "ar" : "en";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setMegaOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!megaOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMegaOpen(false);
    };
    const onPointerDown = (e: MouseEvent) => {
      if (
        megaContainerRef.current &&
        !megaContainerRef.current.contains(e.target as Node)
      ) {
        setMegaOpen(false);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("mousedown", onPointerDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("mousedown", onPointerDown);
    };
  }, [megaOpen]);

  const subPath = pathname.replace(/^\/(en|ar)(?=\/|$)/, "");
  const switchHref = `/${otherLocale}${subPath}`;

  const primaryLinks = [
    { href: localePath(locale, "menu"), label: copy.menu },
    { href: localePath(locale, "gallery"), label: copy.gallery },
    { href: localePath(locale, "contact"), label: copy.contact },
  ];

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`);
  const isExperiencesActive =
    pathname.includes("/experiences") || pathname.includes("/private-events");

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 transition-all duration-500 ${
        scrolled || mobileOpen || megaOpen
          ? "border-b border-[var(--cavo-gold)]/30 bg-[#f4f0e9]/94 py-2.5 shadow-[0_14px_36px_-16px_rgba(70,54,36,0.14)] backdrop-blur-2xl"
          : "border-b border-[var(--cavo-gold)]/20 bg-[#f4f0e9]/85 py-3.5 backdrop-blur-xl"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link href={localePath(locale)}>
          <BrandMark locale={locale} tone="dark" compact />
        </Link>

        {/* Desktop Navigation */}
        <nav
          aria-label={isAr ? "القائمة الرئيسية" : "Primary Navigation"}
          className="hidden items-center gap-1 lg:flex"
        >
          <Link
            href={localePath(locale)}
            className={`group relative rounded-full px-4 py-2 text-sm font-medium transition-all duration-300 ${
              isAr ? "" : "tracking-wide"
            } ${
              pathname === localePath(locale)
                ? "bg-[var(--cavo-gold-pale)] font-semibold text-[var(--cavo-gold-deep)]"
                : "text-[var(--cavo-ink)]/85 hover:bg-[var(--cavo-gold-pale)]/60 hover:text-[var(--cavo-gold-deep)]"
            }`}
          >
            {copy.home}
          </Link>

          {/* Experiences Mega-Dropdown Trigger */}
          <div
            ref={megaContainerRef}
            className="relative"
            onMouseEnter={() => setMegaOpen(true)}
            onMouseLeave={() => setMegaOpen(false)}
          >
            <button
              type="button"
              aria-expanded={megaOpen}
              aria-haspopup="true"
              onClick={() => setMegaOpen((prev) => !prev)}
              className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition-all duration-300 ${
                isAr ? "" : "tracking-wide"
              } ${
                isExperiencesActive || megaOpen
                  ? "bg-[var(--cavo-gold-pale)] font-semibold text-[var(--cavo-gold-deep)]"
                  : "text-[var(--cavo-ink)]/85 hover:bg-[var(--cavo-gold-pale)]/60 hover:text-[var(--cavo-gold-deep)]"
              }`}
            >
              <span>{copy.experiences}</span>
              <ChevronDown
                className={`h-3.5 w-3.5 text-[var(--cavo-gold)] transition-transform duration-300 ${
                  megaOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {megaOpen && (
              <div className="cavo-pop-in absolute start-1/2 top-full w-[720px] -translate-x-1/2 pt-3 rtl:translate-x-1/2">
                <div className="overflow-hidden rounded-3xl border border-[var(--cavo-gold)]/35 bg-[#f6f3ee]/98 p-6 text-[var(--cavo-ink)] shadow-[0_32px_80px_-20px_rgba(70,54,36,0.22)] backdrop-blur-2xl">
                  <div className="mb-4 flex items-center justify-between border-b border-[var(--cavo-border)] pb-3.5">
                    <span
                      className={`inline-flex items-center gap-2 text-[11px] font-semibold text-[var(--cavo-gold-deep)] ${
                        isAr ? "" : "uppercase tracking-[0.22em]"
                      }`}
                    >
                      <Sparkles className="h-3.5 w-3.5 text-[var(--cavo-gold)]" />
                      {isAr
                        ? "أربع تجارب فاخرة على مركب نايل سيتي"
                        : "FOUR NILE VENUES · ONE DESTINATION"}
                    </span>
                    <Link
                      href={localePath(locale, "experiences")}
                      onClick={() => setMegaOpen(false)}
                      className="group inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--cavo-gold-deep)] transition hover:text-[var(--cavo-terracotta)]"
                    >
                      <span>
                        {isAr ? "استعراض جميع التجارب" : "All Experiences"}
                      </span>
                      <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1" />
                    </Link>
                  </div>

                  <div className="grid grid-cols-2 gap-3.5">
                    {venues.map((venue) => (
                      <Link
                        key={venue.slug}
                        href={localePath(locale, `experiences/${venue.slug}`)}
                        onClick={() => {
                          setMegaOpen(false);
                          trackCavoEvent("experience_select", {
                            venue: venue.slug,
                            source: "navbar_mega",
                          });
                        }}
                        className="group flex items-center gap-4 rounded-2xl border border-[var(--cavo-border)] bg-[#efeae2] p-3 transition-all duration-300 hover:-translate-y-0.5 hover:border-[var(--cavo-gold)] hover:bg-[#e7dfd4]"
                      >
                        <div className="relative h-16 w-20 shrink-0 overflow-hidden rounded-xl border border-[var(--cavo-gold)]/25 bg-[var(--cavo-stone)]">
                          <Image
                            src={venue.cardImage}
                            alt={venue.name[locale]}
                            fill
                            sizes="80px"
                            className="object-cover transition duration-700 group-hover:scale-110"
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between">
                            <span className="inline-block rounded-full bg-[var(--cavo-gold-pale)] px-2 py-0.5 font-mono text-[10px] font-bold text-[var(--cavo-gold-deep)] transition group-hover:bg-[var(--cavo-gold-deep)] group-hover:text-white">
                              {venue.number}
                            </span>
                            <ArrowRight className="h-3.5 w-3.5 text-[var(--cavo-gold)] opacity-0 transition-all duration-300 group-hover:translate-x-0.5 group-hover:opacity-100 rtl:rotate-180" />
                          </div>
                          <p className="font-display mt-1 truncate text-lg font-semibold text-[var(--cavo-ink)] group-hover:text-[var(--cavo-gold-deep)]">
                            {venue.name[locale]}
                          </p>
                          <p className="truncate text-[11px] text-[var(--cavo-smoke)]">
                            {venue.role[locale]}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>

                  {/* Private Events & Yacht Charters Callout Strip inside Mega Menu */}
                  <div className="mt-4 flex items-center justify-between gap-4 rounded-2xl border border-[var(--cavo-gold)]/35 bg-gradient-to-r from-[#ede6dc] via-[#f4f0e8] to-[#e7dfd3] px-4 py-3">
                    <div className="flex items-center gap-3">
                      <span className="cavo-gold-gradient flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-white shadow-sm">
                        <Anchor className="h-4 w-4" />
                      </span>
                      <div>
                        <p className="text-xs font-bold text-[var(--cavo-ink)]">
                          {isAr
                            ? "المناسبات الخاصة وحجز اليخت (Yachts by Cavo)"
                            : "Private Events & Yachts by Cavo Charters"}
                        </p>
                        <p className="text-[11px] text-[var(--cavo-smoke)]">
                          {isAr
                            ? "أعياد الميلاد، الخطوبة، وعزومات اليخت واللاونج الخاص"
                            : "Birthdays, proposals, corporate dinners & private Nile cruises"}
                        </p>
                      </div>
                    </div>
                    <Link
                      href={localePath(locale, "private-events")}
                      onClick={() => setMegaOpen(false)}
                      className="cavo-btn-pearl group inline-flex shrink-0 items-center gap-1.5 rounded-full px-4 py-2 text-xs font-semibold"
                    >
                      <span>{copy.privateEvents}</span>
                      <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5 rtl:rotate-180 rtl:group-hover:-translate-x-0.5" />
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>

          {primaryLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-all duration-300 ${
                isAr ? "" : "tracking-wide"
              } ${
                isActive(link.href)
                  ? "bg-[var(--cavo-gold-pale)] font-semibold text-[var(--cavo-gold-deep)]"
                  : "text-[var(--cavo-ink)]/85 hover:bg-[var(--cavo-gold-pale)]/60 hover:text-[var(--cavo-gold-deep)]"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Desktop Actions */}
        <div className="hidden items-center gap-3 lg:flex">
          <Link
            href={switchHref}
            onClick={() =>
              trackCavoEvent("language_change", {
                from: locale,
                to: otherLocale,
              })
            }
            className="cavo-btn-pearl inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-semibold"
          >
            <Globe className="h-3.5 w-3.5 text-[var(--cavo-gold-deep)]" />
            <span>{copy.switchLabel}</span>
          </Link>

          <Link
            href={localePath(locale, "book")}
            onClick={() => trackCavoEvent("booking_start", { source: "navbar" })}
            className={`cavo-btn-gold inline-flex items-center gap-2 rounded-full px-6 py-2.5 text-xs font-semibold ${
              isAr ? "" : "uppercase tracking-[0.16em]"
            }`}
          >
            <span>{copy.reserve}</span>
            <ArrowRight className="h-3.5 w-3.5 rtl:rotate-180" />
          </Link>
        </div>

        {/* Mobile Actions: Clean & Airy Language Switch + Menu Drawer Trigger */}
        <div className="flex items-center gap-2 lg:hidden">
          <Link
            href={switchHref}
            onClick={() =>
              trackCavoEvent("language_change", {
                from: locale,
                to: otherLocale,
              })
            }
            className="cavo-btn-pearl rounded-full px-3.5 py-1.5 text-xs font-semibold"
          >
            {copy.switchLabel}
          </Link>

          <button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-expanded={mobileOpen}
            aria-label={isAr ? "فتح القائمة" : "Toggle navigation menu"}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--cavo-gold)]/40 bg-[var(--cavo-gold-pale)] text-[var(--cavo-ink)]"
          >
            {mobileOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileOpen && (
        <div className="cavo-drawer-in max-h-[82vh] overflow-y-auto border-t border-[var(--cavo-gold)]/25 bg-[#f4f0e9] px-5 py-6 shadow-2xl lg:hidden">
          <div className="flex flex-col gap-2">
            <Link
              href={localePath(locale)}
              onClick={() => setMobileOpen(false)}
              className="border-b border-[var(--cavo-border)] py-3 text-base font-semibold text-[var(--cavo-ink)]"
            >
              {copy.home}
            </Link>

            <div className="border-b border-[var(--cavo-border)] py-3">
              <Link
                href={localePath(locale, "experiences")}
                onClick={() => setMobileOpen(false)}
                className="text-base font-semibold text-[var(--cavo-gold-deep)]"
              >
                {copy.experiences}
              </Link>
              <div className="mt-3 grid grid-cols-2 gap-2.5">
                {venues.map((v) => (
                  <Link
                    key={v.slug}
                    href={localePath(locale, `experiences/${v.slug}`)}
                    onClick={() => setMobileOpen(false)}
                    className="rounded-xl border border-[var(--cavo-border)] bg-[#ebe5dc] px-3.5 py-2.5 text-xs text-[var(--cavo-ink)]"
                  >
                    <span className="font-mono text-[10px] font-bold text-[var(--cavo-gold-deep)]">
                      {v.number}
                    </span>
                    <span className="mt-0.5 block font-semibold">
                      {v.name[locale]}
                    </span>
                  </Link>
                ))}
              </div>
              <Link
                href={localePath(locale, "private-events")}
                onClick={() => setMobileOpen(false)}
                className="mt-2.5 flex items-center justify-between rounded-xl border border-[var(--cavo-gold)]/35 bg-[#e7dfd3] px-3.5 py-2.5 text-xs font-semibold text-[var(--cavo-gold-deep)]"
              >
                <span className="inline-flex items-center gap-1.5">
                  <Anchor className="h-3.5 w-3.5 text-[var(--cavo-gold)]" />
                  {copy.privateEvents}
                </span>
                <ArrowRight className="h-3.5 w-3.5 rtl:rotate-180" />
              </Link>
            </div>

            {primaryLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={`border-b border-[var(--cavo-border)] py-3 text-base font-medium ${
                  isActive(link.href)
                    ? "font-semibold text-[var(--cavo-gold-deep)]"
                    : "text-[var(--cavo-ink)]/90"
                }`}
              >
                {link.label}
              </Link>
            ))}

            <Link
              href={localePath(locale, "book")}
              onClick={() => {
                setMobileOpen(false);
                trackCavoEvent("booking_start", { source: "mobile_drawer" });
              }}
              className="cavo-btn-gold mt-4 rounded-full px-6 py-3.5 text-center text-sm font-semibold"
            >
              {copy.reserve}
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
