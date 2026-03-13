import { test, expect } from '@playwright/test';

test.describe('Answered Prayer Flow', () => {
  const uid = Math.floor(Math.random() * 1000000);
  const email = `testuser_${uid}@example.com`;
  const password = 'Password123!';

  test('user can create a prayer and mark it as answered', async ({ page }) => {
    // 1. Register a new user
    await page.goto('/register');
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
    const firstCard = page.locator('.prayer-card').first();
    await expect(firstCard).toContainText('Test User');
    await expect(firstCard).toContainText(prayerBody);

    // 4. Mark as answered
    const markAnsweredBtn = firstCard.locator('.mark-answered');
    await expect(markAnsweredBtn).toBeVisible();
    await markAnsweredBtn.click();

    // Fill testimony
    const testimony = 'Praise God! This prayer was answered.';
    await page.fill('.prayer-card__testimony-textarea', testimony);
    await page.click('.action-btn.mark-answered'); // The "Save" button

    // 5. Verify it's no longer in "Pending" and is in "Answered"
    await expect(firstCard).not.toBeVisible(); // Should be removed from "Pending" view

    await page.click('button:has-text("Respondidas")'); // Switch to Answered tab
    const answeredCard = page.locator('.prayer-card.answered').first();
    await expect(answeredCard).toContainText(prayerBody);
    await expect(answeredCard).toContainText(testimony);
    await expect(answeredCard.locator('.status-badge.answered')).toBeVisible();
  });
});
