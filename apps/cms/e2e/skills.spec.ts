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

test.describe('Skills Page', () => {
    test.beforeEach(async ({ page }) => {
        await login(page);
        await page.locator('aside a[href="/skills"]').first().click();
        await page.waitForURL('/skills');
    });

    test('should load skills with tabs', async ({ page }) => {
        await expect(page.getByText(/Hard Skills \(/i)).toBeVisible();
        await expect(page.getByText(/Soft Skills \(/i)).toBeVisible();
    });

    test('should switch between tabs', async ({ page }) => {
        await page.getByText(/Soft Skills \(/i).click();
        await page.waitForTimeout(300);
        await expect(page.getByText(/soft skills/i).first()).toBeVisible();
    });

    test('should open add skill modal', async ({ page }) => {
        await page.getByRole('button', { name: /add skill/i }).click();
        await page.waitForTimeout(300);
        // Modal input - actual placeholder from Skills.tsx
        await expect(page.getByPlaceholder('e.g. Adobe Photoshop')).toBeVisible();
    });

    test('should add new skill', async ({ page }) => {
        await page.getByRole('button', { name: /add skill/i }).click();
        await page.waitForTimeout(300);

        // Fill skill name with actual placeholder
        await page.getByPlaceholder('e.g. Adobe Photoshop').fill('Test Skill');

        // Click Add Skill button - it's the one with Add Skill text that's enabled
        await page.locator('button:has-text("Add Skill"):not([disabled])').last().click();
        await page.waitForTimeout(300);

        // Modal should close
        await expect(page.getByPlaceholder('e.g. Adobe Photoshop')).not.toBeVisible();
    });
});

test.describe('Services Page', () => {
    test.beforeEach(async ({ page }) => {
        await login(page);
        await page.locator('aside a[href="/services"]').first().click();
        await page.waitForURL('/services');
    });

    test('should load services grid', async ({ page }) => {
        await expect(page.getByRole('heading', { name: /services/i })).toBeVisible();
    });

    test('should add new service', async ({ page }) => {
        await page.getByRole('button', { name: /add service/i }).click();
        await page.waitForTimeout(300);

        // Fill title with actual placeholder from Services.tsx
        await page.getByPlaceholder('e.g. Brand Design').fill('Web Development');

        // Fill description - required to enable Add button
        await page.getByPlaceholder('Describe what this service includes...').fill('Test description');

        // Click Add Service button
        await page.locator('button:has-text("Add Service"):not([disabled])').last().click();
        await page.waitForTimeout(300);

        // Modal should close
        await expect(page.getByPlaceholder('e.g. Brand Design')).not.toBeVisible();
    });
});
