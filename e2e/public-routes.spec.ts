import { test, expect } from "@playwright/test";

test.describe("Public Routes", () => {
  test("should load Pricing page and show plans", async ({ page }) => {
    await page.goto("/pricing");

    // Check heading
    const pricingHeading = page.locator("h1", { hasText: /pricing/i });
    await expect(pricingHeading).toBeVisible();

    // Check pricing plans tabs or content
    const starterPlan = page.locator("h3", { hasText: /Starter Trial|Founder Pro|Explorer Trial/i }).first();
    await expect(starterPlan).toBeVisible();
  });

  test("should load Privacy Policy page", async ({ page }) => {
    await page.goto("/privacy");

    // Check title/header
    const privacyHeader = page.locator("h1", { hasText: /Privacy Policy/i });
    await expect(privacyHeader).toBeVisible();

    // Check section content
    const introSection = page.locator("h2", { hasText: /1. Introduction/i });
    await expect(introSection).toBeVisible();
  });

  test("should load Terms and Conditions page", async ({ page }) => {
    await page.goto("/terms");

    // Check title/header
    const termsHeader = page.locator("h1", { hasText: /Terms & Conditions|Terms of Service|Terms/i }).first();
    await expect(termsHeader).toBeVisible();
  });

  test("should load Disclaimer & Refund page", async ({ page }) => {
    await page.goto("/disclaimer");

    const disclaimerHeader = page.locator("h1", { hasText: /Disclaimer & Refund/i }).first();
    await expect(disclaimerHeader).toBeVisible();
  });

  test("should load Cookie Policy page", async ({ page }) => {
    await page.goto("/cookies");

    const cookieHeader = page.locator("h1", { hasText: /Cookie Policy/i }).first();
    await expect(cookieHeader).toBeVisible();
  });
});
