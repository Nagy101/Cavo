import { permanentRedirect } from "next/navigation";
import { defaultLocale, isValidLocale, localePath } from "@/lib/i18n";

export default async function LegacyVisitRedirectPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const safeLocale = isValidLocale(locale) ? locale : defaultLocale;
  permanentRedirect(localePath(safeLocale, "contact"));
}
