import type { Metadata } from "next";
import { Be_Vietnam_Pro, Noto_Serif } from "next/font/google";
import "./globals.css";
import "./home-v2.css";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { site } from "@/lib/content";
import { siteUrl } from "@/lib/site-url";
import { organizationJsonLd } from "@/lib/jsonld";
import { JsonLd } from "@/components/seo/json-ld";

const sans = Be_Vietnam_Pro({ subsets: ["latin", "vietnamese"], weight: ["400", "500", "600"], variable: "--font-sans", display: "swap" });
const serif = Noto_Serif({ subsets: ["latin", "latin-ext", "vietnamese"], weight: "500", variable: "--font-serif", display: "swap" });
export const metadata: Metadata = { metadataBase: siteUrl, title: site.title, description: site.description };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="vi"><body className={`${sans.variable} ${serif.variable}`}><a className="skip-link" href="#noi-dung">{site.skipLink}</a><SiteHeader /><main id="noi-dung" tabIndex={-1}>{children}</main><SiteFooter /><JsonLd data={organizationJsonLd()} /></body></html>;
}
