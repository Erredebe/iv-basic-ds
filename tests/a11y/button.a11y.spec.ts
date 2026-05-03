import { expect, test } from '@playwright/test';
import { expectNoA11yViolations, waitForComponents } from './axe';

test.describe('iv-button accessibility', () => {
  test('button demo has no automated WCAG violations', async ({ page }) => {
    await page.goto('/demos/button.html');
    await waitForComponents(page);

    await expectNoA11yViolations(page);
  });

  test('icon-only button is named by the button and keeps its icon decorative', async ({ page }) => {
    await page.goto('/demos/button.html');
    await waitForComponents(page);

    await expect(page.getByRole('button', { name: 'Cerrar' })).toBeVisible();

    const iconOnlyButton = page.locator('iv-button[label="Cerrar"]');
    await expect(iconOnlyButton).not.toHaveAttribute('aria-label');
    await expect(iconOnlyButton.locator('button')).toHaveAttribute('aria-label', 'Cerrar');
    await expect(iconOnlyButton.locator('iv-icon')).not.toHaveAttribute('label');
    await expect(iconOnlyButton.locator('svg')).toHaveAttribute('aria-hidden', 'true');
  });
});
