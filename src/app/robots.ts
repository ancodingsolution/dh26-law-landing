import type { MetadataRoute } from "next";
import { canonical, isIndexable } from "@/lib/site-url";
export default function robots(): MetadataRoute.Robots { return isIndexable ? { rules: { userAgent: "*", allow: "/", disallow: "/api/" }, sitemap: canonical("/sitemap.xml") } : { rules: { userAgent: "*", disallow: "/" } }; }
