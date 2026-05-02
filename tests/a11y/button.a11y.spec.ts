import { test } from '@playwright/test';
import { expectNoA11yViolations, waitForComponents } from './axe';

test.describe('iv-button accessibility', () => {
  test('button demo has no automated WCAG violations', async ({ page }) => {
    await page.goto('/demos/button.html');
    await waitForComponents(page);

    await expectNoA11yViolations(page);
  });
});
