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

test.describe('Experience Page', () => {
    test.beforeEach(async ({ page }) => {
        await login(page);
        await page.locator('aside a[href="/experience"]').first().click();
        await page.waitForURL('/experience');
    });

    test('should load experience list', async ({ page }) => {
        await expect(page.getByRole('heading', { name: /experience/i })).toBeVisible();
    });

    test('should navigate to add experience form', async ({ page }) => {
        await page.getByRole('button', { name: /add experience/i }).click();
        await page.waitForURL('/experience/new');
        await expect(page).toHaveURL('/experience/new');
    });

    test('should show validation errors on empty form submit', async ({ page }) => {
        await page.getByRole('button', { name: /add experience/i }).click();
        await page.waitForURL('/experience/new');

        // Submit empty form
        await page.getByRole('button', { name: /create experience/i }).click();

        // Should show validation errors
        await expect(page.getByText(/required/i).first()).toBeVisible();
    });

    test('should fill experience form', async ({ page }) => {
        await page.getByRole('button', { name: /add experience/i }).click();
        await page.waitForURL('/experience/new');

        // Fill form using actual placeholders from ExperienceEdit.tsx
        await page.getByPlaceholder('e.g. PT. Creative Studio').fill('Test Company');
        await page.getByPlaceholder('e.g. Senior Graphic Designer').fill('Test Developer');

        // Verify filled
        await expect(page.getByPlaceholder('e.g. PT. Creative Studio')).toHaveValue('Test Company');
    });
});
