import { expect, test } from "@playwright/test";
import { mkdir } from "node:fs/promises";

const widths = [320, 360, 375, 390, 430, 768, 1024, 1440];
for (const width of widths) {
  test(`homepage responsive at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.goto("/");
    await page.evaluate(() => document.fonts.ready);
    await expect(page.locator("h1")).toHaveCount(1);
    await expect(page.locator(".service-card")).toHaveCount(4);
    await expect.poll(() => page.locator(".hero-media img").evaluate((image) => (image as HTMLImageElement).complete && (image as HTMLImageElement).naturalWidth > 0)).toBe(true);
    for (const section of ["#dich-vu", "#gioi-thieu", "#quy-trinh", "#lien-he"]) await expect(page.locator(section)).toBeAttached();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
    if (width < 480) {
      const box = await page.locator(".hero-actions").boundingBox();
      expect(box!.y + box!.height).toBeLessThan(760);
    }
    if (width === 320 || width === 1440) {
      await page.locator(".about-art").scrollIntoViewIfNeeded();
      await expect.poll(() => page.locator(".about-art img").evaluate((image) => (image as HTMLImageElement).complete && (image as HTMLImageElement).naturalWidth > 0)).toBe(true);
      await page.locator(".hero").scrollIntoViewIfNeeded();
      await mkdir("docs/qa", { recursive: true });
      await page.screenshot({ path: `docs/qa/home-${width}.png`, fullPage: true });
      if (width === 1440) await page.screenshot({ path: "docs/qa/home-desktop-preview.png", fullPage: false });
    }
    expect(errors).toEqual([]);
  });
}
test("mobile menu opens, closes with Escape, and restores focus", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto("/");
  const trigger = page.getByRole("button", { name: "Mở menu" });
  await trigger.click();
  await expect(page.getByRole("button", { name: "Đóng menu" })).toHaveAttribute("aria-expanded", "true");
  await page.locator("#mobile-navigation a").first().focus();
  await page.keyboard.press("Escape");
  await expect(trigger).toBeFocused();
  await trigger.click();
  await page.locator("#mobile-navigation").getByRole("link", { name: "Quy trình" }).click();
  await expect(page).toHaveURL(/#quy-trinh$/);
  await expect(trigger).toHaveAttribute("aria-expanded", "false");
});

test("desktop reference layout places consultation beside the main content", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  const main = await page.locator(".home-primary").boundingBox();
  const consultation = await page.locator(".home-contact").boundingBox();
  expect(consultation!.x).toBeGreaterThan(main!.x + main!.width);
  expect(Math.abs(consultation!.y - main!.y)).toBeLessThan(2);
});
