import { test, expect } from "@playwright/test";

test.describe("Landing page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    // Wait for hydration — hero text should be visible
    await page.waitForSelector("h1", { timeout: 10_000 });
  });

  test("page loads with correct title", async ({ page }) => {
    await expect(page).toHaveTitle(/Dev Remoto Simple/);
  });

  test("hero section is visible", async ({ page }) => {
    const hero = page.locator("h1");
    await expect(hero).toBeVisible();
    await expect(hero).toContainText("pensamos");
  });

  test("ÚNETE button links to WhatsApp", async ({ page }) => {
    const uneteButtons = page.locator('a[href*="chat.whatsapp.com"]');
    const count = await uneteButtons.count();
    expect(count).toBeGreaterThanOrEqual(1);

    const firstButton = uneteButtons.first();
    await expect(firstButton).toHaveAttribute("target", "_blank");
  });

  test("dot navigation exists on desktop", async ({ page, browserName }, testInfo) => {
    // Skip on mobile project
    if (testInfo.project.name === "mobile") {
      test.skip();
      return;
    }
    const dots = page.locator('button[aria-label^="Ir a sección"]');
    await expect(dots).toHaveCount(6);
  });

  test("dot navigation click scrolls to section", async ({ page }, testInfo) => {
    if (testInfo.project.name === "mobile") {
      test.skip();
      return;
    }
    // Click the 3rd dot (index 2 — Propósito section)
    const dot = page.locator('button[aria-label="Ir a sección 3"]');
    await dot.click();
    // Wait for scroll to complete
    await page.waitForTimeout(1200);
    // Propósito heading should be near the viewport
    const heading = page.locator("text=Nuestro propósito");
    await expect(heading).toBeInViewport();
  });

  test("event carousel arrows work", async ({ page }) => {
    // Scroll to eventos section first
    await page.locator("text=Eventos recientes").scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);

    const nextButton = page.locator('button[aria-label="Siguiente"]');
    await expect(nextButton).toBeVisible();

    // Click next
    await nextButton.click();
    await page.waitForTimeout(500);

    // Previous button should now be enabled (not disabled)
    const prevButton = page.locator('button[aria-label="Anterior"]');
    await expect(prevButton).toBeEnabled();
  });

  test("footer is visible at bottom", async ({ page }) => {
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(500);
    const copyright = page.locator("text=Dev Remoto Simple").last();
    await expect(copyright).toBeVisible();
  });

  test("full page screenshot — visual baseline", async ({ page }, testInfo) => {
    // Wait for lazy-loaded components
    await page.waitForTimeout(2000);

    await page.screenshot({
      path: `tests/screenshots/${testInfo.project.name}-full-page.png`,
      fullPage: true,
    });
  });
});
