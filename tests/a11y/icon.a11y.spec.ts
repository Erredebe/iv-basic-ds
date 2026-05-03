import { expect, test } from '@playwright/test';
import { expectNoA11yViolations, expectNoHorizontalOverflow, waitForComponents } from './axe';

test.describe('iv-icon accessibility', () => {
  test('icon demo has no automated WCAG violations', async ({ page }) => {
    await page.goto('/demos/atoms/icon.html');
    await waitForComponents(page);

    await expectNoHorizontalOverflow(page);
    await expectNoA11yViolations(page);
  });

  test('decorative and meaningful icons expose the expected ARIA semantics', async ({ page }) => {
    await page.goto('/demos/atoms/icon.html');
    await waitForComponents(page);

    const decorativeSvg = page.locator('iv-icon[name="check"]').first().locator('svg');
    await expect(decorativeSvg).toHaveAttribute('aria-hidden', 'true');
    await expect(decorativeSvg).not.toHaveAttribute('role');
    await expect(decorativeSvg).not.toHaveAttribute('aria-label');
    await expect(decorativeSvg).toHaveAttribute('focusable', 'false');

    const meaningfulIcon = page.locator('iv-icon[label="Advertencia"]');
    await expect(meaningfulIcon).not.toHaveAttribute('aria-label');

    const meaningfulSvg = meaningfulIcon.locator('svg');
    await expect(meaningfulSvg).toHaveAttribute('role', 'img');
    await expect(meaningfulSvg).toHaveAttribute('aria-label', 'Advertencia');
    await expect(meaningfulSvg).not.toHaveAttribute('aria-hidden');
    await expect(meaningfulSvg).toHaveAttribute('focusable', 'false');
  });
});
