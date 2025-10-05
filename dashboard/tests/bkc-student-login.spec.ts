import { test, expect } from '@playwright/test';

// Test credentials
const BKC_EMAIL = 'yash@bkc.met.edu';
const BKC_PASSWORD = 'Yash@cc2025';

test.describe('BKC Student Login and Dashboard Access', () => {
  test.beforeEach(async ({ page }) => {
    // Start at home page
    await page.goto('/');
  });

  test('should login with BKC credentials and see full sidebar', async ({ page }) => {
    // Click Sign In button
    await page.getByRole('button', { name: /sign in/i }).click();

    // Wait for Clerk modal/form to appear
    await page.waitForSelector('[name="identifier"]', { timeout: 10000 });

    // Fill in email
    await page.fill('[name="identifier"]', BKC_EMAIL);
    await page.click('button[type="submit"]');

    // Wait for password field and fill it
    await page.waitForSelector('[name="password"]', { timeout: 10000 });
    await page.fill('[name="password"]', BKC_PASSWORD);
    await page.click('button[type="submit"]');

    // Wait for redirect to dashboard
    await page.waitForURL('**/dashboard', { timeout: 15000 });

    // Verify we're on the dashboard
    expect(page.url()).toContain('/dashboard');

    // Verify BKC badge is visible in sidebar
    await expect(page.getByText('BKC')).toBeVisible();

    // Verify all 6 navigation items are visible for BKC students
    await expect(page.getByRole('link', { name: 'Dashboard' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Projects' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Timeline' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Analytics' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Resources' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Settings' })).toBeVisible();

    // Verify user type is shown as "BKC Student"
    await expect(page.getByText('BKC Student')).toBeVisible();
  });

  test('should access BKC-only pages (Analytics, Resources, Settings)', async ({ page }) => {
    // Login first
    await page.getByRole('button', { name: /sign in/i }).click();
    await page.waitForSelector('[name="identifier"]');
    await page.fill('[name="identifier"]', BKC_EMAIL);
    await page.click('button[type="submit"]');
    await page.waitForSelector('[name="password"]');
    await page.fill('[name="password"]', BKC_PASSWORD);
    await page.click('button[type="submit"]');
    await page.waitForURL('**/dashboard', { timeout: 15000 });

    // Test Analytics page
    await page.getByRole('link', { name: 'Analytics' }).click();
    await page.waitForURL('**/dashboard/analytics');
    await expect(page.getByRole('heading', { name: 'Analytics' })).toBeVisible();
    await expect(page.getByText('BKC Students Only')).toBeVisible();

    // Test Resources page
    await page.getByRole('link', { name: 'Resources' }).click();
    await page.waitForURL('**/dashboard/resources');
    await expect(page.getByRole('heading', { name: 'Resources' })).toBeVisible();
    await expect(page.getByText('BKC Students Only')).toBeVisible();

    // Test Settings page
    await page.getByRole('link', { name: 'Settings' }).click();
    await page.waitForURL('**/dashboard/settings');
    await expect(page.getByRole('heading', { name: 'Settings' })).toBeVisible();
    await expect(page.getByText('BKC Students Only')).toBeVisible();
    await expect(page.getByText(BKC_EMAIL)).toBeVisible();
  });

  test('should see BKC-specific welcome message on dashboard', async ({ page }) => {
    // Login
    await page.getByRole('button', { name: /sign in/i }).click();
    await page.waitForSelector('[name="identifier"]');
    await page.fill('[name="identifier"]', BKC_EMAIL);
    await page.click('button[type="submit"]');
    await page.waitForSelector('[name="password"]');
    await page.fill('[name="password"]', BKC_PASSWORD);
    await page.click('button[type="submit"]');
    await page.waitForURL('**/dashboard', { timeout: 15000 });

    // Check for BKC-specific content
    await expect(page.getByText(/BKC projects and timelines/i)).toBeVisible();
    await expect(page.getByText('BKC Student Access')).toBeVisible();
  });

  test('should display correct stats cards', async ({ page }) => {
    // Login
    await page.getByRole('button', { name: /sign in/i }).click();
    await page.waitForSelector('[name="identifier"]');
    await page.fill('[name="identifier"]', BKC_EMAIL);
    await page.click('button[type="submit"]');
    await page.waitForSelector('[name="password"]');
    await page.fill('[name="password"]', BKC_PASSWORD);
    await page.click('button[type="submit"]');
    await page.waitForURL('**/dashboard', { timeout: 15000 });

    // Verify stats cards
    await expect(page.getByText('Active Projects')).toBeVisible();
    await expect(page.getByText('Upcoming Deadlines')).toBeVisible();
    await expect(page.getByText('Tasks Completed')).toBeVisible();
  });
});