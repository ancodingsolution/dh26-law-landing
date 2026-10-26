import { expect, test } from "@playwright/test";
import copy from "../../src/data/contact.json" with { type: "json" };

test.describe("configured form", () => {
  test.skip(process.env.E2E_FORM_ENABLED !== "true", "Run pnpm test:e2e:form for the isolated public-key fixture build");
  test.beforeEach(async ({ page }) => {
    // Replace only third-party widget behavior. The API never accepts this fake token.
    await page.route("**/turnstile/v0/api.js*", (route) => route.fulfill({ contentType: "application/javascript", body: `window.turnstile={render:function(el,options){window.e2eVerify=options.callback;options.callback('e2e-token');return 'e2e-widget';},reset:function(){window.e2eVerify('e2e-token');},remove:function(){}};` }));
    await page.goto("/lien-he");
  });
  async function fill(page: import("@playwright/test").Page) {
    await page.getByLabel("Họ và tên *").fill("Khách kiểm thử");
    await page.getByLabel("Số điện thoại *").fill("0973787969");
    await page.getByLabel("Email *").fill("qa@example.org");
    await page.getByLabel("Tin nhắn *").fill("Nội dung kiểm thử biểu mẫu, không gửi thư thật.");
    await page.getByRole("checkbox").check();
  }
  test("validates inline and focuses the first invalid field", async ({ page }) => {
    await page.getByRole("button", { name: copy.submit }).click();
    await expect(page.getByText(copy.nameError)).toBeVisible();
    await expect(page.getByText(copy.consentError)).toBeVisible();
    await expect(page.getByLabel("Họ và tên *")).toBeFocused();
  });
  test("loading and confirmed success", async ({ page }) => {
    let release!: () => void;
    const pending = new Promise<void>((resolve) => { release = resolve; });
    await page.route("**/api/contact", async (route) => { await pending; await route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ success: true, message: copy.success }) }); });
    await fill(page);
    await page.getByRole("button", { name: copy.submit }).click();
    await expect(page.getByRole("button", { name: copy.submitting })).toBeDisabled();
    release();
    await expect(page.getByRole("status")).toHaveText(copy.success);
    await expect(page.getByLabel("Họ và tên *")).toHaveValue("");
  });
  test("homepage consultation card shares validated submission and preserves failed input", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator(".contact-form-compact")).toBeAttached();
    await page.route("**/api/contact", (route) => route.fulfill({ status: 502, contentType: "application/json", body: JSON.stringify({ success: false, message: copy.error }) }));
    await fill(page);
    await page.getByRole("button", { name: copy.submit }).click();
    await expect(page.locator('.form-feedback[data-state="error"]')).toBeVisible();
    await expect(page.getByLabel("Họ và tên *")).toHaveValue("Khách kiểm thử");
    await expect(page.getByRole("button", { name: copy.submit })).toBeEnabled();
  });
  for (const status of [502, 503, 429]) {
    test(`failure ${status} preserves input and allows retry`, async ({ page }) => {
      await page.route("**/api/contact", (route) => route.fulfill({ status, contentType: "application/json", body: JSON.stringify({ success: false, message: copy.error }) }));
      await fill(page);
      await page.getByRole("button", { name: copy.submit }).click();
      await expect(page.locator('.form-feedback[data-state="error"]')).toBeVisible();
      await expect(page.getByLabel("Họ và tên *")).toHaveValue("Khách kiểm thử");
      await expect(page.getByRole("button", { name: copy.submit })).toBeEnabled();
      await expect(page.getByText(copy.success)).toHaveCount(0);
    });
  }
});
