import { test, expect } from '@playwright/test';

test.describe('Answered Prayer Flow', () => {
  const uid = Math.floor(Math.random() * 1000000);
  const email = `testuser_${uid}@example.com`;
  const password = 'Password123!';

  test('user can create a prayer and mark it as answered', async ({ page }) => {
    // Force Spanish locale for consistent UI text
    await page.addInitScript(() => {
      localStorage.setItem('i18nextLng', 'es');  // Force Spanish locale
    });

    // 1. Register a new user
    await page.goto('/register');
    await page.waitForLoadState('networkidle');   // Wait for React to hydrate
    await page.fill('input[name="displayName"]', 'Test User');
    await page.fill('input[name="email"]', email);
    await page.fill('input[name="password"]', password);
    await page.fill('input[name="confirmPassword"]', password);
    await page.click('button[type="submit"]');

    // Wait for redirect to wall
    await expect(page).toHaveURL('/');
    await expect(page.locator('.user-name')).toContainText('Test User');

    // 2. Create a prayer request (NOT anonymous)
    await page.click('.new-request-btn');
    const prayerBody = `This is a test prayer for the answered flow ${uid}`;
    await page.fill('textarea#prayer-body', prayerBody);
    
    // Ensure "Post anonymously" is unchecked
    const anonymousCheckbox = page.locator('input[name="isAnonymous"]');
    await expect(anonymousCheckbox).toBeVisible();
    if (await anonymousCheckbox.isChecked()) {
      await page.click('.checkbox-label'); // Click the label to toggle
    }
    await expect(anonymousCheckbox).not.toBeChecked();

    await page.click('button[type="submit"]');
    
    // 3. Verify it appears on the wall as "Test User"
    // Anchor to the specific card containing THIS test run's unique prayer text
    const firstCard = page.locator('.prayer-card').filter({ hasText: prayerBody });
    await expect(firstCard).toBeVisible({ timeout: 10000 });
    await expect(firstCard).toContainText('Test User');

    // 4. Mark as answered
    // Wait for card to fully render after prayer creation
    await page.waitForTimeout(1500);
    // The mark-answered button only appears for the prayer's author
    const markAnsweredBtn = firstCard.locator('[data-testid="mark-answered-btn"]');
    await expect(markAnsweredBtn).toBeVisible({ timeout: 10000 });
    await markAnsweredBtn.click();

    // Fill testimony
    const testimony = 'Praise God! This prayer was answered.';
    await page.fill('.prayer-card__testimony-textarea', testimony);
    await page.click('[data-testid="save-testimony-btn"]'); // The "Save" button

    // 5. Switch to Answered tab and verify the card appears there
    await page.locator('[role="tab"]').filter({ hasText: /answered|respondidas/i }).click();

    // The specific prayer card must now exist in answered state
    const answeredCard = page.locator('.prayer-card.answered').filter({ hasText: prayerBody });
    await expect(answeredCard).toBeVisible({ timeout: 10000 });
    await expect(answeredCard).toContainText(testimony);
    await expect(answeredCard.locator('.status-badge.answered')).toBeVisible();
  });
});
