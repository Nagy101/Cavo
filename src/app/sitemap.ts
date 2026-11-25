import type { MetadataRoute } from "next";
import { getSiteBaseUrl } from "@/data/site";
import { venues } from "@/data/venues";
import { locales } from "@/lib/i18n";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = getSiteBaseUrl();

  const staticPaths = [
    "",
    "/experiences",
    "/menu",
    "/private-events",
    "/gallery",
    "/contact",
    "/book",
  ];

  const venuePaths = venues.map((v) => `/experiences/${v.slug}`);
  const allPaths = [...staticPaths, ...venuePaths];

  const entries: MetadataRoute.Sitemap = [];
  for (const locale of locales) {
    for (const subPath of allPaths) {
      entries.push({
        url: `${baseUrl}/${locale}${subPath}`,
        lastModified: new Date(),
        changeFrequency: subPath === "" || subPath === "/menu" ? "weekly" : "monthly",
        priority: subPath === "" ? 1 : 0.8,
      });
    }
  }

  return entries;
}
