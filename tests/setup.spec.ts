import { test, expect } from '@playwright/test';

// This local smoke test checks the installation without relying on a demo website.
test('browser can fill in a form', async ({ page }) => {
  await page.setContent(`
    <html lang="en">
      <head><title>Environment check</title></head>
      <body>
        <label for="username">Username</label>
        <input id="username" name="username" />
      </body>
    </html>
  `);

  await page.getByRole('textbox', { name: 'Username' }).fill('qa_student');

  await expect(page.getByRole('textbox', { name: 'Username' })).toHaveValue('qa_student');
});
