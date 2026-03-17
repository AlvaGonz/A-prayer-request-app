import { test, expect } from '@playwright/test';

test.describe('Auth and Rate Limits', () => {
  const uid = Date.now();
  const email = `testuser_${uid}@example.com`;
  const password = 'Password123!';

  test('successfully registers a new user', async ({ page }) => {
    await page.goto('/register');
    
    // Fill out registration form using exact IDs
    await page.fill('#displayName', `Test User ${uid}`);
    await page.fill('#email', email);
    await page.fill('#password', password);
    await page.fill('#confirmPassword', password);   // Confirm password field required
    
    // Submit
    await page.click('button[type="submit"]');

    // Should redirect to dashboard or home
    await expect(page).toHaveURL('/');
  });

  test('rate limit triggers generic 429 UI feedback on fast sequential logins', async ({ page, context }) => {
    // Block service workers from intercepting our explicit mocking
    await context.route('**/*', route => route.continue());

    await page.goto('/login');
    
    await page.route('**/api/auth/login*', async route => {
      // Handle CORS preflight if it occurs
      if (route.request().method() === 'OPTIONS') {
        return route.fulfill({
          status: 200,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
          }
        });
      }

      await route.fulfill({
        status: 429,
        contentType: 'application/json',
        headers: {
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({ error: "Too many requests from this IP" })
      });
    });

    await page.fill('#email', email);
    await page.fill('#password', password);
    await page.click('button[type="submit"]');

    // The error renders in a div with .auth-error
    const errorAlert = page.locator('.auth-error').first();
    await expect(errorAlert).toBeVisible({ timeout: 10000 });
    
    const errorText = await errorAlert.textContent();
    expect(errorText.toLowerCase()).toMatch(/intento|attempt|too many/i);
  });
});
