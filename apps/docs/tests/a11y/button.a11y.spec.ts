import { expect, test } from '@playwright/test';
import { expectNoA11yViolations, expectNoHorizontalOverflow, waitForComponents } from './axe';

test.describe('iv-button accessibility', () => {
  test('button demo has no automated WCAG violations', async ({ page }) => {
    await page.goto('/demos/atoms/button.html');
    await waitForComponents(page);

    await expectNoHorizontalOverflow(page);
    await expectNoA11yViolations(page);
  });

  test('versioned button demos expose their expected variants', async ({ page }) => {
    await page.goto('/demos/atoms/button-001.html');
    await waitForComponents(page);

    await expect(page.getByRole('heading', { name: 'Button 0.0.1', level: 1 })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Primary' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Danger' })).toHaveCount(0);
    await expectNoA11yViolations(page);

    await page.goto('/demos/atoms/button-002.html');
    await waitForComponents(page);

    await expect(page.getByRole('heading', { name: 'Button 0.0.2', level: 1 })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Danger' })).toBeVisible();
    await expectNoA11yViolations(page);
  });

  test('icon-only button is named by the button and keeps its icon decorative', async ({ page }) => {
    await page.goto('/demos/atoms/button.html');
    await waitForComponents(page);

    await expect(page.getByRole('button', { name: 'Cerrar' })).toBeVisible();

    const iconOnlyButton = page.locator('iv-button[label="Cerrar"]');
    await expect(iconOnlyButton).not.toHaveAttribute('aria-label');
    await expect(iconOnlyButton.locator('button')).toHaveAttribute('aria-label', 'Cerrar');
    await expect(iconOnlyButton.locator('iv-icon')).not.toHaveAttribute('label');
    await expect(iconOnlyButton.locator('svg')).toHaveAttribute('aria-hidden', 'true');
  });
});
