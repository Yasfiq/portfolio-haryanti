import { test, expect, Page } from '@playwright/test';

// Test credentials
const TEST_EMAIL = 'haryantianggraeni1@gmail.com';
const TEST_PASSWORD = 'Pass123';

// Helper function to login
async function login(page: Page) {
    await page.goto('/login');
    await page.getByPlaceholder('admin@example.com').fill(TEST_EMAIL);
    await page.getByPlaceholder('••••••••').fill(TEST_PASSWORD);
    await page.getByRole('button', { name: /login/i }).click();
    await page.waitForURL('/');
}

test.describe('Authentication', () => {
    test('should show login page by default', async ({ page }) => {
        await page.goto('/');
        await expect(page).toHaveURL(/.*login/);
        await expect(page.getByRole('heading', { name: /welcome back/i })).toBeVisible();
    });

    test('should login successfully with valid credentials', async ({ page }) => {
        await page.goto('/login');

        await page.getByPlaceholder('admin@example.com').fill(TEST_EMAIL);
        await page.getByPlaceholder('••••••••').fill(TEST_PASSWORD);
        await page.getByRole('button', { name: /login/i }).click();

        await page.waitForURL('/');
        await expect(page.getByRole('heading', { name: /dashboard/i })).toBeVisible();
    });

    test('should show error for invalid credentials', async ({ page }) => {
        await page.goto('/login');

        await page.getByPlaceholder('admin@example.com').fill(TEST_EMAIL);
        await page.getByPlaceholder('••••••••').fill('wrongpassword');
        await page.getByRole('button', { name: /login/i }).click();

        // Wait for error or stay on login page
        await page.waitForTimeout(2000);
        // Should still be on login page or show error
        const hasError = await page.getByText(/invalid|error|incorrect/i).isVisible();
        const onLoginPage = page.url().includes('login');
        expect(hasError || onLoginPage).toBeTruthy();
    });

    test('should logout successfully', async ({ page }) => {
        await login(page);

        // Click logout button in aside
        await page.locator('aside button:has-text("Logout")').click();

        await expect(page).toHaveURL(/.*login/);
    });
});
