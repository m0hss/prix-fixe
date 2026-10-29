import { expect, test } from "@playwright/test";
import { config } from "../prixfixe.config";

for (const colorScheme of ["light", "dark"] as const) {
  for (const billing of ["monthly", "yearly"] as const) {
    for (const ticketOpen of [false, true]) {
      test(`A4 ${colorScheme} ${billing}, ticket ${ticketOpen ? "open" : "closed"}`, async ({ page }) => {
        await page.emulateMedia({ colorScheme, reducedMotion: "reduce" });
        await page.goto("/");
        const radio = page.getByRole("radio", { name: config.copy.billing[billing], exact: true });
        await radio.locator("..").click();
        await expect(radio).toBeChecked();
        if (ticketOpen) {
          await page.getByRole("button", { name: config.copy.menus.order }).nth(1).click();
          await expect(page.getByRole("dialog")).toBeVisible();
        }
        await page.evaluate(() => document.fonts.ready);
        await page.emulateMedia({ media: "print" });
        await expect(page.locator(".print-billing")).toContainText(config.copy.billing[billing]);
        await expect(page.locator(".cycle-price > [aria-hidden=true]").first()).toBeHidden();
        await expect(page.locator(".cycle-price > [aria-hidden=false]").first()).toBeVisible();
        await expect(page.locator("[aria-labelledby=chef-heading]")).toBeHidden();
        await expect(page.locator("[aria-labelledby=pairing-heading]")).toBeHidden();
        if (ticketOpen) await expect(page.getByRole("dialog", { includeHidden: true })).toBeHidden();
        expect(await page.locator(".menu-card").evaluate((el) => getComputedStyle(el).backgroundColor)).toBe("rgb(255, 255, 255)");
        const pdf = await page.pdf({ preferCSSPageSize: true, printBackground: true });
        // Chromium's PDF page dictionaries are uncompressed; count pages, not /Pages nodes.
        await test.info().attach("A4 menu", { body: pdf, contentType: "application/pdf" });
        expect(pdf.toString("latin1").match(/\/Type\s*\/Page\b/g)).toHaveLength(1);
      });
    }
  }
}

for (const width of [390, 1440]) {
  test(`menu and ticket fit a ${width}px viewport`, async ({ page }) => {
    await page.setViewportSize({ width, height: 1000 });
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
    const yearly = page.getByRole("radio", { name: config.copy.billing.yearly, exact: true });
    await yearly.locator("..").click();
    await expect(yearly).toBeChecked();
    await page.locator("#sides-heading").scrollIntoViewIfNeeded();
    await page.getByRole("checkbox").nth(0).check();
    await page.getByRole("checkbox").nth(1).check();
    await page.getByRole("button", { name: config.copy.menus.order }).nth(1).click();
    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();
    const money = (amount: number) => new Intl.NumberFormat(config.house.locale, { style: "currency", currency: config.house.currency }).format(amount);
    await expect(dialog).toContainText(money(110));
    await expect(dialog).toContainText(money(1320));
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
    await page.getByRole("button", { name: config.copy.ticket.close }).click();
    await expect(dialog).toBeHidden();
    await expect(page.getByRole("button", { name: config.copy.menus.order }).nth(1)).toBeFocused();
  });
}

test("social preview is wired into metadata and returns a 1200 × 630 PNG", async ({ page, request }) => {
  await page.goto("/");
  const url = await page.locator('meta[property="og:image"]').getAttribute("content");
  expect(url).toBeTruthy();
  const response = await request.get(new URL(url!, page.url()).pathname);
  expect(response.ok()).toBeTruthy();
  expect(response.headers()["content-type"]).toContain("image/png");
  const png = await response.body();
  expect(png.subarray(0, 8).toString("hex")).toBe("89504e470d0a1a0a");
  expect([png.readUInt32BE(16), png.readUInt32BE(20)]).toEqual([1200, 630]);
  await test.info().attach("Social preview", { body: png, contentType: "image/png" });
});
