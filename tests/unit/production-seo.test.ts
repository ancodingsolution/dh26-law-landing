import { afterEach, expect, test, vi } from "vitest";
afterEach(() => { vi.unstubAllEnvs(); vi.resetModules(); });
test("production robots permits public pages and sitemap lists all 9 published URLs", async () => {
  vi.stubEnv("VERCEL_ENV", "production");
  vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://law.example.org");
  vi.resetModules();
  const { default: sitemap } = await import("@/app/sitemap");
  const { default: robots } = await import("@/app/robots");
  expect(sitemap()).toHaveLength(9);
  expect(sitemap().every((entry) => entry.url.startsWith("https://law.example.org/") && !entry.url.includes("/api/"))).toBe(true);
  expect(robots()).toMatchObject({ rules: { allow: "/", disallow: "/api/" }, sitemap: "https://law.example.org/sitemap.xml" });
});
test("preview is noindex and has an empty sitemap", async () => {
  vi.stubEnv("VERCEL_ENV", "preview");
  vi.resetModules();
  const { default: sitemap } = await import("@/app/sitemap");
  const { default: robots } = await import("@/app/robots");
  expect(sitemap()).toEqual([]);
  expect(robots()).toEqual({ rules: { userAgent: "*", disallow: "/" } });
});
