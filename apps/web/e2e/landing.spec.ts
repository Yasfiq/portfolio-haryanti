import { test, expect } from '@playwright/test';

test.describe('Landing Page', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/');
        await page.waitForLoadState('networkidle');
    });

    test('should load homepage', async ({ page }) => {
        await expect(page).toHaveTitle(/Haryanti|Portfolio|Designer/i);
    });

    test('should display hero section', async ({ page }) => {
        await expect(page.getByText(/Hello, I'm Haryanti/i)).toBeVisible();
        await expect(page.getByText(/Graphic Designer/i).first()).toBeVisible();
    });

    test('should have scroll indicator', async ({ page }) => {
        await expect(page.getByText('Scroll')).toBeVisible();
    });

    test('should display navigation', async ({ page }) => {
        // Look for HARYANTI logo text in header
        await expect(page.getByText('HARYANTI').first()).toBeVisible();
    });
});

test.describe('Sections Visibility', () => {
    test('should show Skills section after scroll', async ({ page }) => {
        await page.goto('/');
        await page.waitForLoadState('networkidle');

        await page.evaluate(() => {
            window.scrollTo(0, window.innerHeight * 2);
        });
        await page.waitForTimeout(1000);

        await expect(page.getByText(/Skills & Expertise/i)).toBeVisible();
    });

    test('should show Experience section', async ({ page }) => {
        await page.goto('/');
        await page.waitForLoadState('networkidle');

        await page.evaluate(() => {
            window.scrollTo(0, window.innerHeight * 4);
        });
        await page.waitForTimeout(1000);

        const experienceSection = page.getByText(/Experience|Work History/i).first();
        await expect(experienceSection).toBeVisible();
    });

    test('should show Services section', async ({ page }) => {
        await page.goto('/');
        await page.waitForLoadState('networkidle');

        await page.evaluate(() => {
            window.scrollTo(0, window.innerHeight * 3);
        });
        await page.waitForTimeout(1000);

        await expect(page.getByText(/Services/i).first()).toBeVisible();
    });
});
