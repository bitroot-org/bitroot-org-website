import { test, expect } from '@playwright/test';

// Test credentials for non-BKC student
const NON_BKC_EMAIL = 'test@gmail.com';
const NON_BKC_PASSWORD = 'Test@2025';

test.describe('Non-BKC Student Login and Limited Access', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should login with non-BKC credentials and see limited sidebar', async ({ page }) => {
    // Click Sign In button
    await page.getByRole('button', { name: /sign in/i }).click();

    // Wait for Clerk modal/form
    await page.waitForSelector('[name="identifier"]', { timeout: 10000 });

    // Fill in email
    await page.fill('[name="identifier"]', NON_BKC_EMAIL);
    await page.click('button[type="submit"]');

    // Wait for password field
    await page.waitForSelector('[name="password"]', { timeout: 10000 });
    await page.fill('[name="password"]', NON_BKC_PASSWORD);
    await page.click('button[type="submit"]');

    // Wait for redirect to dashboard
    await page.waitForURL('**/dashboard', { timeout: 15000 });

    // Verify we're on the dashboard
    expect(page.url()).toContain('/dashboard');

    // Verify BKC badge is NOT visible
    await expect(page.getByText('BKC').first()).not.toBeVisible();

    // Verify only 3 base navigation items are visible
    await expect(page.getByRole('link', { name: 'Dashboard' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Projects' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Timeline' })).toBeVisible();

    // Verify BKC-only items are NOT visible
    await expect(page.getByRole('link', { name: 'Analytics' })).not.toBeVisible();
    await expect(page.getByRole('link', { name: 'Resources' })).not.toBeVisible();
    await expect(page.getByRole('link', { name: 'Settings' })).not.toBeVisible();

    // Verify user type is shown as "Student" (not "BKC Student")
    await expect(page.getByText('Student')).toBeVisible();
    await expect(page.getByText('BKC Student')).not.toBeVisible();
  });

  test('should be redirected when trying to access BKC-only pages', async ({ page }) => {
    // Login first
    await page.getByRole('button', { name: /sign in/i }).click();
    await page.waitForSelector('[name="identifier"]');
    await page.fill('[name="identifier"]', NON_BKC_EMAIL);
    await page.click('button[type="submit"]');
    await page.waitForSelector('[name="password"]');
    await page.fill('[name="password"]', NON_BKC_PASSWORD);
    await page.click('button[type="submit"]');
    await page.waitForURL('**/dashboard', { timeout: 15000 });

    // Try to access Analytics page directly
    await page.goto('/dashboard/analytics');
    // Should be redirected back to /dashboard
    await page.waitForURL('**/dashboard', { timeout: 5000 });
    expect(page.url()).toContain('/dashboard');
    expect(page.url()).not.toContain('/analytics');

    // Try to access Resources page directly
    await page.goto('/dashboard/resources');
    await page.waitForURL('**/dashboard', { timeout: 5000 });
    expect(page.url()).toContain('/dashboard');
    expect(page.url()).not.toContain('/resources');

    // Try to access Settings page directly
    await page.goto('/dashboard/settings');
    await page.waitForURL('**/dashboard', { timeout: 5000 });
    expect(page.url()).toContain('/dashboard');
    expect(page.url()).not.toContain('/settings');
  });

  test('should NOT see BKC-specific welcome message', async ({ page }) => {
    // Login
    await page.getByRole('button', { name: /sign in/i }).click();
    await page.waitForSelector('[name="identifier"]');
    await page.fill('[name="identifier"]', NON_BKC_EMAIL);
    await page.click('button[type="submit"]');
    await page.waitForSelector('[name="password"]');
    await page.fill('[name="password"]', NON_BKC_PASSWORD);
    await page.click('button[type="submit"]');
    await page.waitForURL('**/dashboard', { timeout: 15000 });

    // Should see generic message, not BKC-specific
    await expect(page.getByText(/your projects and timelines/i)).toBeVisible();
    await expect(page.getByText('BKC Student Access')).not.toBeVisible();
  });

  test('should have access to base features (Projects, Timeline)', async ({ page }) => {
    // Login
    await page.getByRole('button', { name: /sign in/i }).click();
    await page.waitForSelector('[name="identifier"]');
    await page.fill('[name="identifier"]', NON_BKC_EMAIL);
    await page.click('button[type="submit"]');
    await page.waitForSelector('[name="password"]');
    await page.fill('[name="password"]', NON_BKC_PASSWORD);
    await page.click('button[type="submit"]');
    await page.waitForURL('**/dashboard', { timeout: 15000 });

    // Test Projects page
    await page.getByRole('link', { name: 'Projects' }).click();
    await page.waitForURL('**/dashboard/projects');
    await expect(page.getByRole('heading', { name: 'Projects' })).toBeVisible();

    // Test Timeline page
    await page.getByRole('link', { name: 'Timeline' }).click();
    await page.waitForURL('**/dashboard/timeline');
    await expect(page.getByRole('heading', { name: 'Timeline' })).toBeVisible();
  });
});