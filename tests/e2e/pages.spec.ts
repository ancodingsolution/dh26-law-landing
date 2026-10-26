import { expect, test } from "@playwright/test";
const routes = ["/", "/gioi-thieu", "/dich-vu", "/lien-he", "/chinh-sach-bao-mat", "/dich-vu/tham-gia-to-tung", "/dich-vu/tu-van-phap-luat", "/dich-vu/dai-dien-ngoai-to-tung", "/dich-vu/dich-vu-phap-ly-khac"];
test("all public pages have server HTML, unique SEO, breadcrumbs and valid links", async ({ page, request }) => {
  const titles = new Set<string>();
  const descriptions = new Set<string>();
  const links = new Set<string>();
  for (const route of routes) {
    const response = await page.goto(route);
    expect(response?.status()).toBe(200);
    expect(await response?.text()).toContain("<h1");
    await expect(page.locator("h1")).toHaveCount(1);
    titles.add(await page.title());
    descriptions.add((await page.locator('meta[name="description"]').getAttribute("content"))!);
    const canonical = new URL((await page.locator('link[rel="canonical"]').getAttribute("href"))!);
    expect(canonical.origin).toBe("http://localhost:3000");
    expect(canonical.pathname).toBe(route);
    await expect(page.locator('meta[property="og:title"]')).toHaveCount(1);
    if (route !== "/") await expect(page.getByRole("navigation", { name: "Đường dẫn trang" })).toBeVisible();
    const hrefs = await page.locator('a[href^="/"]').evaluateAll((anchors) => anchors.map((a) => a.getAttribute("href")!));
    hrefs.forEach((href) => links.add(href.split("#")[0] || "/"));
  }
  expect(titles.size).toBe(routes.length);
  expect(descriptions.size).toBe(routes.length);
  for (const href of links) expect((await request.get(href)).status(), href).toBe(200);
});
test("404 status, preview robots, sitemap and OG image work", async ({ request }) => {
  for (const path of ["/unknown-page", "/dich-vu/unknown-service"]) {
    const response = await request.get(path);
    expect(response.status()).toBe(404);
    expect(await response.text()).toContain('content="noindex"');
  }
  const robots = await request.get("/robots.txt");
  expect(await robots.text()).toContain("Disallow: /");
  const sitemap = await request.get("/sitemap.xml");
  expect(sitemap.status()).toBe(200);
  expect(await sitemap.text()).toContain("<urlset");
  const og = await request.get("/opengraph-image");
  expect(og.status()).toBe(200);
  expect(og.headers()["content-type"]).toContain("image/png");
  const icon = await request.get("/icon");
  expect(icon.status()).toBe(200);
});
