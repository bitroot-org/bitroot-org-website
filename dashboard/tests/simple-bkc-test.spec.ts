import { test, expect } from '@playwright/test';
import { loginWithClerk } from './auth-helper';

const BKC_EMAIL = 'yash@bkc.met.edu';
const BKC_PASSWORD = 'Yash@cc2025';

test.describe('BKC Student - Simplified Tests', () => {
  test('should login and see BKC sidebar sections', async ({ page }) => {
    // Enable verbose logging
    page.on('console', msg => console.log('Browser:', msg.text()));

    // Login
    await loginWithClerk(page, BKC_EMAIL, BKC_PASSWORD);

    // Verify we're on dashboard
    expect(page.url()).toContain('/dashboard');
    console.log('✓ On dashboard page');

    // Take screenshot
    await page.screenshot({ path: 'test-results/dashboard-logged-in.png' });

    // Check for sidebar - wait a bit for it to render
    await page.waitForTimeout(2000);

    // Look for navigation links
    const dashboardLink = page.locator('a', { hasText: 'Dashboard' });
    const projectsLink = page.locator('a', { hasText: 'Projects' });
    const timelineLink = page.locator('a', { hasText: 'Timeline' });
    const analyticsLink = page.locator('a', { hasText: 'Analytics' });
    const resourcesLink = page.locator('a', { hasText: 'Resources' });
    const settingsLink = page.locator('a', { hasText: 'Settings' });

    // Wait for sidebar to be visible
    await expect(dashboardLink).toBeVisible({ timeout: 10000 });
    console.log('✓ Dashboard link visible');

    await expect(projectsLink).toBeVisible();
    console.log('✓ Projects link visible');

    await expect(timelineLink).toBeVisible();
    console.log('✓ Timeline link visible');

    // BKC-only sections
    await expect(analyticsLink).toBeVisible();
    console.log('✓ Analytics link visible (BKC only)');

    await expect(resourcesLink).toBeVisible();
    console.log('✓ Resources link visible (BKC only)');

    await expect(settingsLink).toBeVisible();
    console.log('✓ Settings link visible (BKC only)');

    // Check for BKC badge
    const bkcBadge = page.locator('text=BKC').first();
    await expect(bkcBadge).toBeVisible();
    console.log('✓ BKC badge visible');

    console.log('✅ All BKC sidebar sections verified!');
  });

  test('should access Analytics page', async ({ page }) => {
    await loginWithClerk(page, BKC_EMAIL, BKC_PASSWORD);

    // Click Analytics
    await page.click('a:has-text("Analytics")');
    await page.waitForURL('**/dashboard/analytics', { timeout: 10000 });

    // Verify page content
    await expect(page.locator('h1:has-text("Analytics")')).toBeVisible();
    console.log('✅ Analytics page accessible');
  });
});