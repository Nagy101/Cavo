import { NextRequest, NextResponse } from "next/server";
import { defaultLocale, isValidLocale } from "@/lib/i18n";

const IGNORED_PREFIXES = ["/_next", "/api", "/media", "/favicon.ico"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    IGNORED_PREFIXES.some((prefix) => pathname.startsWith(prefix)) ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  if (pathname === "/") {
    return NextResponse.redirect(new URL(`/${defaultLocale}`, request.url));
  }

  if (pathname === "/yacht" || pathname === "/yacht/") {
    return NextResponse.redirect(
      new URL(`/${defaultLocale}/experiences/private-yacht`, request.url),
      308
    );
  }

  const firstSegment = pathname.split("/")[1] ?? "";
  if (!isValidLocale(firstSegment)) {
    const target = new URL(`/${defaultLocale}${pathname}`, request.url);
    target.search = request.nextUrl.search;
    return NextResponse.redirect(target);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|api|media|.*\\..*).*)"],
};
