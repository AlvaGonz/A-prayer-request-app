import { test, expect } from '@playwright/test';

/**
 * Phase 4: Shared Prayer Link Verification (Updated for Wizard)
 * Validates that a user can generate a share link using the 3-step wizard
 * and that anyone (guest) can view it.
 */
test.describe('Shared Prayer Flow', () => {
  const testEmail = `test.share.${Date.now()}@example.com`;
  const prayerText = `E2E Test Prayer for Sharing - ${Date.now()}`;

  test.beforeEach(async ({ page }) => {
    // Register a new user
    await page.goto('/register');
    
    // Check if we are already on the registration page
    await expect(page).toHaveURL(/.*register/);
    
    await page.fill('input[id="displayName"]', 'Share Tester');
    await page.fill('input[id="email"]', testEmail);
    await page.fill('input[id="password"]', 'Password123');
    await page.fill('input[id="confirmPassword"]', 'Password123');
    await page.click('button[type="submit"]');
    
    // Wait for redirect to wall
    await expect(page).toHaveURL('/');
  });

  test('should generate and load a shared prayer link via wizard', async ({ page, context }) => {
    // 1. Open Wizard
    await page.click('button:has-text("New Request")');
    
    // Step 1: Write Prayer
    await expect(page.locator('.wizard-step.active')).toContainText('Write');
    await page.fill('textarea', prayerText);
    await page.click('button:has-text("Next")');
    
    // Step 2: Identity
    await expect(page.locator('.wizard-step.active')).toContainText('Identity');
    // Select "Post with my name"
    await page.click('button:has-text("Post with my name")');
    await page.click('button:has-text("Next")');
    
    // Step 3: Review
    await expect(page.locator('.wizard-step.active')).toContainText('Review');
    await expect(page.locator('.review-text')).toContainText(prayerText);
    await expect(page.locator('.review-identity')).toContainText('Share Tester');
    
    // Submit
    await page.click('button:has-text("Share Request")');
    
    // 2. Wait for the prayer to appear in the wall
    const prayerCard = page.locator(`article:has-text("${prayerText}")`);
    await expect(prayerCard).toBeVisible({ timeout: 10000 });

    // 3. Click the Share button
    console.log('Clicking share button and waiting for response...');
    const [response] = await Promise.all([
      page.waitForResponse(res => res.url().includes('/api/requests/') && res.url().endsWith('/share'), { timeout: 15000 }),
      prayerCard.getByRole('button', { name: /share/i }).click(),
    ]);
    
    const responseData = await response.json();
    console.log('Share API Response:', responseData);
    const { shareUrl } = responseData;
    expect(shareUrl).toBeDefined();

    // 4. Open the shared link in a new incognito context
    const guestPage = await context.newPage();
    // Simple URL resolution
    const baseUrl = new URL(page.url()).origin;
    const targetUrl = shareUrl.startsWith('http') ? shareUrl : `${baseUrl}${shareUrl}`;
    
    console.log('Navigating guest page to:', targetUrl);
    await guestPage.goto(targetUrl);

    // 5. Verify the shared page content
    await expect(guestPage.locator('.shared-banner p')).toContainText('Someone is asking for prayer');
    await expect(guestPage.locator('article')).toContainText(prayerText);
    await expect(guestPage.locator('article')).toContainText('Share Tester');
    
    // 6. Verify guest interactive elements
    await expect(guestPage.locator('button:has-text("I Prayed for This")')).toBeVisible();
    await expect(guestPage.locator('textarea[placeholder*="encouragement"]')).toBeVisible();
  });
});
