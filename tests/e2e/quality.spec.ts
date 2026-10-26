import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
const pages = ["/", "/gioi-thieu", "/dich-vu", "/dich-vu/tu-van-phap-luat", "/dich-vu/tham-gia-to-tung", "/dich-vu/dai-dien-ngoai-to-tung", "/dich-vu/dich-vu-phap-ly-khac", "/lien-he", "/chinh-sach-bao-mat"];
for (const width of [320, 360, 375, 390, 430, 768, 1024, 1440]) {
  test(`all subpages responsive at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    for (const route of pages.slice(1)) {
      await page.goto(route);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), route).toBe(true);
      await expect(page.locator("h1")).toBeVisible();
    }
  });
}
for (const width of [375, 1440]) {
  test(`accessibility WCAG audit at ${width}px on all pages`, async ({ page }) => {
    test.setTimeout(90_000);
    await page.setViewportSize({ width, height: 900 });
    for (const route of pages) {
      await page.goto(route);
      const result = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"]).analyze();
      expect(result.violations, `${route}: ${JSON.stringify(result.violations.map((v) => ({ id: v.id, impact: v.impact, nodes: v.nodes.map((n) => n.target) })))}`).toEqual([]);
    }
  });
}
test("keyboard skip link, contact links, 200% text zoom and reduced motion", async ({ page }) => {
  await page.setViewportSize({ width: 1024, height: 900 });
  await page.goto("/");
  await page.keyboard.press("Tab");
  await expect(page.getByRole("link", { name: "Chuyển đến nội dung chính" })).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.locator("main")).toBeFocused();
  await expect(page.locator('a[href="tel:+84973787969"]').first()).toBeAttached();
  await expect(page.locator('a[href="mailto:dhlaw642@gmail.com"]').first()).toBeAttached();
  await page.addStyleTag({ content: "html { font-size: 200% !important; }" });
  const overflow = await page.evaluate(() => Array.from(document.querySelectorAll("body *")).filter((element) => element.getBoundingClientRect().right > innerWidth + 1).map((element) => `${element.tagName}.${element.className}`).slice(0, 15));
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), JSON.stringify(overflow)).toBe(true);
  await page.emulateMedia({ reducedMotion: "reduce" });
  expect(await page.evaluate(() => getComputedStyle(document.documentElement).scrollBehavior)).toBe("auto");
});
test("contact without credentials fails closed and has no fake success", async ({ request, page }) => {
  await page.goto("/lien-he");
  const response = await request.post("/api/contact", { data: { name: "QA user", phone: "0973787969", email: "qa@example.org", message: "Yêu cầu kiểm thử, không phải yêu cầu tư vấn thật.", consent: true, turnstileToken: "", website: "" } });
  expect([422, 503]).toContain(response.status());
  expect((await response.json()).success).toBe(false);
  expect((await request.get("/api/contact")).status()).toBe(405);
  await expect(page.locator('.form-feedback[data-state="success"]')).toHaveCount(0);
});
