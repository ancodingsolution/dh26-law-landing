import type { MetadataRoute } from "next";
import { services } from "@/lib/content";
import { canonical, isIndexable } from "@/lib/site-url";
export default function sitemap(): MetadataRoute.Sitemap {
  if (!isIndexable) return [];
  return ["/", "/gioi-thieu", "/dich-vu", "/lien-he", "/chinh-sach-bao-mat", ...services.map((service) => `/dich-vu/${service.slug}`)].map((path) => ({ url: canonical(path) }));
}
