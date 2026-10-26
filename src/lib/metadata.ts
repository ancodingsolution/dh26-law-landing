import type { Metadata } from "next";
import { company, site } from "@/lib/content";
import { canonical, isIndexable } from "./site-url";
export function pageMetadata(title: string, description: string, path: string): Metadata {
  return {
    title: { absolute: title }, description,
    alternates: { canonical: canonical(path) },
    openGraph: { type: "website", siteName: company.brandName, title, description, locale: site.locale, url: canonical(path), images: [{ url: canonical("/opengraph-image"), width: 1200, height: 630, alt: company.brandName }] },
    twitter: { card: "summary_large_image", title, description, images: [canonical("/opengraph-image")] },
    robots: { index: isIndexable, follow: isIndexable },
  };
}
