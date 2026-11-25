"use client";

import { useEffect } from "react";
import type { Locale } from "@/lib/i18n";

interface LocaleDocumentSyncProps {
  locale: Locale;
  dir: "ltr" | "rtl";
}

export function LocaleDocumentSync({ locale, dir }: LocaleDocumentSyncProps) {
  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = dir;
  }, [locale, dir]);

  return null;
}
