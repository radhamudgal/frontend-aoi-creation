import { test, expect } from '@playwright/test';

test.describe('AOI App Basic Tests', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173/');
  });

  // Test 1: Sidebar header exists
  test('sidebar header is visible', async ({ page }) => {
    const header = page.locator('h2', { hasText: 'Define Area of Interest' });
    await expect(header).toBeVisible({ timeout: 10000 });
  });

  // Test 2: Map container exists
  test('map container is visible', async ({ page }) => {
    const map = page.locator('#map');
    await expect(map).toBeVisible({ timeout: 10000 });
  });

  // Test 3: WMS toggle checkbox works
  test('Satellite WMS toggle checkbox', async ({ page }) => {
    const checkbox = page.locator('input[type="checkbox"]');
    await expect(checkbox).toBeVisible({ timeout: 5000 });

    await checkbox.check();
    await expect(checkbox).toBeChecked();

    await checkbox.uncheck();
    await expect(checkbox).not.toBeChecked();
  });

});
