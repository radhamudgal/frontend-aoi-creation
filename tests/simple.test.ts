import { test, expect } from '@playwright/test';

test('homepage loads correctly', async ({ page }) => {
  // Go to your app
  await page.goto('http://localhost:5173/');

  // Check page title
  await expect(page).toHaveTitle(/Area of Interest Creation/);

  // Check header exists (matches h2 in Sidebar)
  const header = page.locator('h2', { hasText: 'Define Area of Interest' });
  await expect(header).toBeVisible({ timeout: 10000 });
});
