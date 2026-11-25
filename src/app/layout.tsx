import type { Metadata, Viewport } from "next";
import {
  Amiri,
  Cairo,
  Cormorant_Garamond,
  Plus_Jakarta_Sans,
} from "next/font/google";
import { getSiteBaseUrl } from "@/data/site";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
});

const amiri = Amiri({
  subsets: ["arabic", "latin"],
  weight: ["400", "700"],
  variable: "--font-amiri",
  display: "swap",
});

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  variable: "--font-cairo",
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f6f3ee" },
    { media: "(prefers-color-scheme: dark)", color: "#1c150f" },
  ],
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(getSiteBaseUrl()),
  title: {
    default: "CAVO Island | Nile City Boat, Zamalek",
    template: "%s | CAVO Island",
  },
  description:
    "Four Nile venues, one destination in Zamalek, Cairo: Main Restaurant, Boat, Private Yacht, and Elite.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const fontVars = [
    cormorant.variable,
    jakarta.variable,
    amiri.variable,
    cairo.variable,
  ].join(" ");

  return (
    <html lang="en" className={fontVars} suppressHydrationWarning>
      <body className="bg-[var(--cavo-pearl)] text-[var(--cavo-ink)] antialiased">
        {children}
      </body>
    </html>
  );
}
