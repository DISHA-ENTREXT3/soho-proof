import { test, expect } from "@playwright/test";

test.describe("Landing Page", () => {
  test("should load landing page successfully and render branding and navigation", async ({ page }) => {
    // Go to home page
    await page.goto("/");

    // Verify title contains Soho Space
    await expect(page).toHaveTitle(/Soho Space/i);

    // Verify header branding is present
    const brandName = page.locator("nav a").filter({ hasText: "Soho Space" });
    await expect(brandName).toBeVisible();

    // Verify main navigation links exist in the desktop header
    const featuresLink = page.locator("nav a").filter({ hasText: "Features" }).first();
    const pricingLink = page.locator("nav a").filter({ hasText: "Pricing" }).first();
    const blogsLink = page.locator("nav a").filter({ hasText: "Blogs" }).first();

    await expect(pricingLink).toBeVisible();
    await expect(blogsLink).toBeVisible();

    // Verify 'Get Started' button is visible
    const getStartedBtn = page.getByRole("button", { name: /Get Started/i }).first();
    await expect(getStartedBtn).toBeVisible();
  });
});
