import { Page } from '@playwright/test';

export async function loginWithClerk(page: Page, email: string, password: string) {
  console.log(`Attempting login with: ${email}`);

  // Go to home page
  await page.goto('/', { waitUntil: 'networkidle' });

  // Take screenshot for debugging
  await page.screenshot({ path: `test-results/before-signin-${Date.now()}.png` });

  // Look for Sign In button - try multiple selectors
  const signInButton = page.locator('button:has-text("Sign In"), a:has-text("Sign In")').first();
  await signInButton.waitFor({ state: 'visible', timeout: 10000 });
  await signInButton.click();

  console.log('Clicked Sign In button');

  // Wait for Clerk modal/form - be more flexible with selectors
  await page.waitForTimeout(2000); // Give Clerk time to load

  // Try to find email input with multiple strategies
  const emailInput = page.locator(
    'input[name="identifier"], input[type="email"], input[name="emailAddress"]'
  ).first();

  await emailInput.waitFor({ state: 'visible', timeout: 15000 });
  await emailInput.fill(email);
  console.log('Filled email');

  // Press Enter key instead of clicking button to avoid OAuth buttons
  await emailInput.press('Enter');
  console.log('Pressed Enter to continue');

  // Wait for password field
  await page.waitForTimeout(2000);
  const passwordInput = page.locator('input[name="password"], input[type="password"]').first();
  await passwordInput.waitFor({ state: 'visible', timeout: 15000 });
  await passwordInput.fill(password);
  console.log('Filled password');

  // Press Enter key to submit instead of clicking button
  await passwordInput.press('Enter');
  console.log('Pressed Enter to submit');

  // Wait for redirect to dashboard
  await page.waitForURL('**/dashboard', { timeout: 30000 });
  console.log('Redirected to dashboard');

  // Wait for page to be fully loaded
  await page.waitForLoadState('networkidle');
}