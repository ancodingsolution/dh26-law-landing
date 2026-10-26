import { describe, expect, test } from "vitest";
import { canonical, getSiteUrl } from "@/lib/site-url";
import { pageMetadata } from "@/lib/metadata";
import { breadcrumbJsonLd, organizationJsonLd, serializeJsonLd } from "@/lib/jsonld";
import { company } from "@/lib/content";
import { generateStaticParams, generateMetadata } from "@/app/dich-vu/[slug]/page";

describe("SEO contracts", () => {
  test("production requires a real HTTPS origin without credentials or paths", () => {
    for (const url of [undefined, "http://localhost:3000", "https://your-domain.example", "https://example.org/path", "https://user:password@example.org"]) {
      expect(() => getSiteUrl({ VERCEL_ENV: "production", NEXT_PUBLIC_SITE_URL: url })).toThrow();
    }
    expect(getSiteUrl({ VERCEL_ENV: "production", NEXT_PUBLIC_SITE_URL: "https://law.example.org" }).origin).toBe("https://law.example.org");
  });
  test("canonical and social URLs are absolute; metadata doesn't expose server env", () => {
    const metadata = pageMetadata("Title", "Description", "/gioi-thieu");
    expect(metadata.alternates?.canonical).toBe(canonical("/gioi-thieu"));
    expect(JSON.stringify(metadata)).not.toContain("RESEND_API_KEY");
  });
  test("structured data uses verified company data without fabricated claims", () => {
    const organization = organizationJsonLd();
    expect(organization.telephone).toBe(company.contact.phoneE164);
    expect(organization.name).toBe(company.tradeName);
    expect(organization).not.toHaveProperty("aggregateRating");
    const breadcrumbs = breadcrumbJsonLd([{ name: "Trang chủ", path: "/" }, { name: "Dịch vụ", path: "/dich-vu" }]);
    expect(breadcrumbs.itemListElement[1]).toMatchObject({ position: 2, item: canonical("/dich-vu") });
    expect(serializeJsonLd({ name: "</script><script>bad</script>" })).not.toContain("<");
  });
  test("actual page params generate 4 routes; unknown slugs 404 in metadata", async () => {
    expect(generateStaticParams()).toHaveLength(4);
    await expect(generateMetadata({ params: Promise.resolve({ slug: "unknown" }) })).rejects.toThrow();
  });
});
