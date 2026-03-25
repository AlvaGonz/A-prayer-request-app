import { test, expect } from '@playwright/test';

test.describe('Answered Prayer Flow', () => {
  const uid = Math.floor(Math.random() * 1000000);
  const email = `testuser_${uid}@example.com`;
  const password = 'Password123!';

  test('user can create a prayer and mark it as answered', async ({ page }) => {
    // Increase timeout for this complex flow
    test.setTimeout(90000);

    // Setup consistent environment: Spanish locale and no notification banner
    await page.addInitScript(() => {
      localStorage.setItem('prayerBoard_language', 'es');
      localStorage.setItem('prayerBoard_notificationDismissed', 'true');
    });

    // Hide banner via CSS just in case localStorage is slow or missed
    await page.addStyleTag({ content: '.notification-banner { display: none !important; }' });

    // 1. Register a new user
    await page.goto('/register');
    await page.waitForLoadState('networkidle');   // Wait for React to hydrate
    await page.fill('input[name="displayName"]', 'Test User');
    await page.fill('input[name="email"]', email);
    await page.fill('input[name="password"]', password);
    await page.fill('input[name="confirmPassword"]', password);
    await page.click('button[type="submit"]');

    // Wait for redirect to wall with a generous timeout
    await page.waitForURL('/', { timeout: 15000 });
    await expect(page.locator('.user-name')).toContainText('Test User', { timeout: 15000 });

    // 2. Create a prayer request (Step-by-step Wizard)
    // Use force: true to bypass any lingering invisible obstacles or layout shifts
    await page.click('.new-request-btn', { force: true });
    const prayerBody = `This is a test prayer for the answered flow ${uid}`;
    
    // Step 1: Write text
    await page.fill('textarea#prayer-body', prayerBody);
    // Use a robust selector for "Next" that works in both languages or by role/index if needed
    await page.click('button:has-text("Siguiente"), button:has-text("Next")'); 
    
    // Step 2: Identity Selection (Named)
    // The "Named" identity card has the user's name
    // We filter by "Publicar con mi nombre" or the Name itself to ensure robustness
    const namedIdentityBtn = page.locator('.identity-card').filter({ hasText: /Publicar con mi nombre|Test User/ });
    await expect(namedIdentityBtn).toBeVisible({ timeout: 5000 });
    await namedIdentityBtn.click();
    await page.click('button:has-text("Siguiente"), button:has-text("Next")');
    
    // Step 3: Review & Finalize
    await expect(page.locator('.review-text')).toContainText(prayerBody, { timeout: 10000 });
    await page.click('.submit-prayer-btn', { force: true }); // The final "Compartir Petición" button
    
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
