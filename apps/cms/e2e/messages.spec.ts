import { test, expect, Page } from '@playwright/test';

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

test.describe('Messages Page', () => {
    test.beforeEach(async ({ page }) => {
        await login(page);
        await page.locator('aside a[href="/messages"]').first().click();
        await page.waitForURL('/messages');
    });

    test('should load messages inbox', async ({ page }) => {
        await expect(page.getByRole('heading', { name: /messages/i })).toBeVisible();
    });

    test('should open message detail modal', async ({ page }) => {
        // Click on first clickable message element
        const messageRow = page.locator('tr, [class*="message"]').nth(1);
        if (await messageRow.isVisible()) {
            await messageRow.click();
            await page.waitForTimeout(500);
        }
    });
});

test.describe('Settings Page', () => {
    test.beforeEach(async ({ page }) => {
        await login(page);
        await page.locator('aside a[href="/settings"]').first().click();
        await page.waitForURL('/settings');
    });

    test('should load settings page with sections', async ({ page }) => {
        await expect(page.getByText(/branding/i).first()).toBeVisible();
        await expect(page.getByText(/color theme/i).first()).toBeVisible();
        await expect(page.getByRole('heading', { name: /change password/i })).toBeVisible();
    });

    test('should update site name', async ({ page }) => {
        const siteNameInput = page.locator('input[name="siteName"], input[placeholder*="site" i]').first();

        if (await siteNameInput.isVisible()) {
            await siteNameInput.clear();
            await siteNameInput.fill('Test Site Name');
        }

        await page.getByRole('button', { name: /save/i }).first().click();
        await page.waitForTimeout(1000);
    });

    test('should validate change password - password too short', async ({ page }) => {
        await page.getByRole('heading', { name: /change password/i }).scrollIntoViewIfNeeded();

        await page.getByPlaceholder(/minimal 6/i).fill('123');
        await page.getByPlaceholder(/masukkan ulang/i).fill('123');

        await page.getByRole('button', { name: /change password/i }).click();

        await expect(page.getByText(/minimal 6/i)).toBeVisible();
    });

    test('should validate change password - password mismatch', async ({ page }) => {
        await page.getByRole('heading', { name: /change password/i }).scrollIntoViewIfNeeded();

        await page.getByPlaceholder(/minimal 6/i).fill('password123');
        await page.getByPlaceholder(/masukkan ulang/i).fill('different456');

        await page.getByRole('button', { name: /change password/i }).click();

        await expect(page.getByText(/tidak cocok/i)).toBeVisible();
    });
});
