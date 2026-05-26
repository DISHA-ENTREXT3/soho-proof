import { test, expect } from "@playwright/test";

test.describe("Authentication Page", () => {
  test("should render Login form by default and support tab switching", async ({ page }) => {
    // Go to Auth page
    await page.goto("/auth");

    // Verify title/header contains Soho Space
    const cardTitle = page.locator(".card-title, h3", { hasText: /Soho Space/i }).first();
    await expect(cardTitle).toBeVisible();

    // Verify presence of Google SSO button
    const googleBtn = page.getByRole("button", { name: /Continue with Google/i });
    await expect(googleBtn).toBeVisible();

    // Verify Login form fields are visible
    const loginEmailInput = page.locator("#login-email");
    const loginPasswordInput = page.locator("#login-password");
    await expect(loginEmailInput).toBeVisible();
    await expect(loginPasswordInput).toBeVisible();

    // Verify presence of Sign Up tab trigger
    const signUpTabTrigger = page.getByRole("tab", { name: /Sign Up/i });
    await expect(signUpTabTrigger).toBeVisible();

    // Click Sign Up tab
    await signUpTabTrigger.click();

    // Now under the Sign Up tab, we expect standard fields (e.g. name, role, email, password)
    // Let's verify that the input email/password is still present or switched
    const registerEmailInput = page.locator("input[type='email']").first();
    await expect(registerEmailInput).toBeVisible();
  });
});
