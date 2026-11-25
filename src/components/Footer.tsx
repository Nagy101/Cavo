import Link from "next/link";
import { ArrowUpRight, Clock, Mail, MapPin, Phone, Sparkles } from "lucide-react";
import { BrandMark } from "@/components/BrandMark";
import { navCopy } from "@/data/copy";
import { siteConfig } from "@/data/site";
import { venues } from "@/data/venues";
import { localePath, type Locale } from "@/lib/i18n";

export function Footer({ locale }: { locale: Locale }) {
  const isAr = locale === "ar";
  const nav = navCopy[locale];
  const otherLocale: Locale = isAr ? "en" : "ar";

  return (
    <footer className="relative overflow-hidden border-t border-[var(--cavo-border)] bg-gradient-to-b from-[#ebe5dc] via-[#e4ddd2] to-[#dcd3c6] text-[var(--cavo-ink)]">
      <div className="relative z-10 mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:py-20">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-12">
          {/* Brand & Heritage */}
          <div className="space-y-5 lg:col-span-4">
            <Link href={localePath(locale)} className="inline-block">
              <BrandMark locale={locale} tone="dark" />
            </Link>
            <p className="text-sm font-medium leading-relaxed text-[var(--cavo-ink)]">
              {siteConfig.tagline[locale]}
            </p>
            <p className="text-xs leading-relaxed text-[var(--cavo-smoke)]">
              {siteConfig.landmarkNote[locale]}
            </p>
            <div className="flex flex-wrap gap-2 pt-2">
              <a
                href={siteConfig.socials.instagramMain}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-[var(--cavo-border)] bg-[#f6f3ee] px-3.5 py-1.5 font-mono text-[11px] font-semibold text-[var(--cavo-gold-deep)] shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-[var(--cavo-gold)] hover:bg-[var(--cavo-gold)] hover:text-white"
              >
                @cavoisland
              </a>
              <a
                href={siteConfig.socials.instagramYachts}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-[var(--cavo-border)] bg-[#f6f3ee] px-3.5 py-1.5 font-mono text-[11px] font-semibold text-[var(--cavo-gold-deep)] shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-[var(--cavo-gold)] hover:bg-[var(--cavo-gold)] hover:text-white"
              >
                @yachtsbycavo
              </a>
              <a
                href={siteConfig.socials.instagramElite}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-[var(--cavo-border)] bg-[#f6f3ee] px-3.5 py-1.5 font-mono text-[11px] font-semibold text-[var(--cavo-gold-deep)] shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-[var(--cavo-gold)] hover:bg-[var(--cavo-gold)] hover:text-white"
              >
                @cavoelite
              </a>
            </div>
          </div>

          {/* Navigation & Venues */}
          <div className="grid grid-cols-2 gap-6 lg:col-span-4">
            <div>
              <h3
                className={`mb-4 inline-flex items-center gap-1.5 text-xs font-bold text-[var(--cavo-gold-deep)] ${
                  isAr ? "" : "uppercase tracking-[0.22em]"
                }`}
              >
                <Sparkles className="h-3 w-3 text-[var(--cavo-gold)]" />
                <span>{isAr ? "استكشف" : "Explore"}</span>
              </h3>
              <ul className="space-y-2.5 text-sm text-[var(--cavo-smoke)]">
                <li>
                  <Link
                    href={localePath(locale)}
                    className="transition hover:text-[var(--cavo-gold-deep)]"
                  >
                    {nav.home}
                  </Link>
                </li>
                <li>
                  <Link
                    href={localePath(locale, "experiences")}
                    className="transition hover:text-[var(--cavo-gold-deep)]"
                  >
                    {nav.experiences}
                  </Link>
                </li>
                <li>
                  <Link
                    href={localePath(locale, "menu")}
                    className="transition hover:text-[var(--cavo-gold-deep)]"
                  >
                    {nav.menu}
                  </Link>
                </li>
                <li>
                  <Link
                    href={localePath(locale, "private-events")}
                    className="transition hover:text-[var(--cavo-gold-deep)]"
                  >
                    {nav.privateEvents}
                  </Link>
                </li>
                <li>
                  <Link
                    href={localePath(locale, "gallery")}
                    className="transition hover:text-[var(--cavo-gold-deep)]"
                  >
                    {nav.gallery}
                  </Link>
                </li>
                <li>
                  <Link
                    href={localePath(locale, "contact")}
                    className="transition hover:text-[var(--cavo-gold-deep)]"
                  >
                    {nav.contact}
                  </Link>
                </li>
                <li>
                  <Link
                    href={localePath(locale, "book")}
                    className="font-semibold text-[var(--cavo-gold-deep)] hover:underline"
                  >
                    {nav.reserve}
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3
                className={`mb-4 inline-flex items-center gap-1.5 text-xs font-bold text-[var(--cavo-gold-deep)] ${
                  isAr ? "" : "uppercase tracking-[0.22em]"
                }`}
              >
                <Sparkles className="h-3 w-3 text-[var(--cavo-gold)]" />
                <span>{isAr ? "التجارب الأربع" : "Four Experiences"}</span>
              </h3>
              <ul className="space-y-2.5 text-sm text-[var(--cavo-smoke)]">
                {venues.map((venue) => (
                  <li key={venue.slug}>
                    <Link
                      href={localePath(locale, `experiences/${venue.slug}`)}
                      className="group inline-flex items-center gap-2 transition hover:text-[var(--cavo-gold-deep)]"
                    >
                      <span className="rounded-full bg-[#f6f3ee] px-2 py-0.5 font-mono text-[10px] font-bold text-[var(--cavo-gold-deep)] transition group-hover:bg-[var(--cavo-gold)] group-hover:text-white">
                        {venue.number}
                      </span>
                      <span>{venue.name[locale]}</span>
                    </Link>
                  </li>
                ))}
              </ul>

              <div className="mt-6 border-t border-[var(--cavo-border)] pt-4">
                <Link
                  href={localePath(otherLocale)}
                  className="inline-flex items-center gap-1.5 rounded-full border border-[var(--cavo-border)] bg-[#f6f3ee] px-4 py-1.5 text-xs font-semibold text-[var(--cavo-gold-deep)] transition hover:border-[var(--cavo-gold)]"
                >
                  {nav.switchLabel}
                </Link>
              </div>
            </div>
          </div>

          {/* Direct Contact */}
          <div className="space-y-4 lg:col-span-4">
            <h3
              className={`mb-4 inline-flex items-center gap-1.5 text-xs font-bold text-[var(--cavo-gold-deep)] ${
                isAr ? "" : "uppercase tracking-[0.22em]"
              }`}
            >
              <Sparkles className="h-3 w-3 text-[var(--cavo-gold)]" />
              <span>{isAr ? "الموقع والتواصل المباشر" : "Arrival & Contact"}</span>
            </h3>

            <div className="space-y-3 text-sm text-[var(--cavo-smoke)]">
              <p className="flex items-start gap-2.5">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[var(--cavo-gold-deep)]" />
                <span className="font-medium text-[var(--cavo-ink)]">
                  {siteConfig.address[locale]}
                </span>
              </p>
              <p className="flex items-start gap-2.5">
                <Clock className="mt-0.5 h-4 w-4 shrink-0 text-[var(--cavo-gold-deep)]" />
                <span>{siteConfig.hours[locale]}</span>
              </p>
              <p className="flex items-center gap-2.5">
                <Mail className="h-4 w-4 shrink-0 text-[var(--cavo-gold-deep)]" />
                <a
                  href={`mailto:${siteConfig.email}`}
                  className="hover:text-[var(--cavo-gold-deep)] hover:underline"
                >
                  {siteConfig.email}
                </a>
              </p>
            </div>

            <div className="space-y-2 rounded-2xl border border-[var(--cavo-border)] bg-[#f6f3ee] p-4 text-xs shadow-sm">
              {siteConfig.contactLines.map((line) => (
                <div
                  key={line.id}
                  className="flex items-center justify-between gap-2 border-b border-[var(--cavo-border)]/60 pb-2 last:border-b-0 last:pb-0"
                >
                  <span className="font-medium text-[var(--cavo-smoke)]">
                    {line.label[locale]}
                  </span>
                  <a
                    href={line.telHref}
                    dir="ltr"
                    className="inline-flex items-center gap-1 font-mono font-bold text-[var(--cavo-gold-deep)] transition hover:text-[var(--cavo-terracotta)] hover:underline"
                  >
                    <Phone className="h-3 w-3 text-[var(--cavo-gold)]" />
                    {line.phoneDisplay}
                  </a>
                </div>
              ))}
            </div>

            <a
              href={siteConfig.mapsDirectionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-1.5 text-xs font-bold text-[var(--cavo-gold-deep)] hover:underline"
            >
              <span>
                {isAr
                  ? "افتح الموقع على خرائط جوجل"
                  : "Open in Google Maps"}
              </span>
              <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-[var(--cavo-border)] pt-8 text-xs text-[var(--cavo-smoke)] md:flex-row md:items-center md:justify-between">
          <p>{siteConfig.taxNotice[locale]}</p>
          <p className="font-medium text-[var(--cavo-ink)]">
            © {new Date().getFullYear()} {siteConfig.brandName[locale]}.{" "}
            {isAr ? "جميع الحقوق محفوظة." : "All rights reserved."}
          </p>
        </div>
      </div>
    </footer>
  );
}
