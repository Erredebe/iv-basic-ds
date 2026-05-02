import { expect, test } from '@playwright/test';
import { expectNoA11yViolations, waitForComponents } from './axe';

test.describe('iv-dialog accessibility', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/demos/dialog.html');
    await waitForComponents(page);
  });

  test('dialog demo has no automated WCAG violations when closed', async ({ page }) => {
    await expectNoA11yViolations(page);
  });

  test('labelled modal has no automated WCAG violations', async ({ page }) => {
    await page.getByRole('button', { name: 'Abrir dialog', exact: true }).click();

    await expectNoA11yViolations(page, '#labelled-dialog');
  });

  test('alertdialog has no automated WCAG violations', async ({ page }) => {
    await page.getByRole('button', { name: 'Abrir alertdialog' }).click();

    await expectNoA11yViolations(page, '#alert-dialog');
  });

  test('required review dialog cannot be dismissed accidentally and has no automated WCAG violations', async ({ page }) => {
    await page.getByRole('button', { name: 'Abrir revision obligatoria' }).click();

    for (let index = 0; index < 8; index += 1) {
      await page.keyboard.press('Escape');
    }

    await expect(page.locator('#prevent-dismiss-dialog dialog')).toHaveJSProperty('open', true);

    await page.mouse.click(10, 10);

    await expect(page.locator('#prevent-dismiss-dialog dialog')).toHaveJSProperty('open', true);
    await expectNoA11yViolations(page, '#prevent-dismiss-dialog');
  });

  test('long content dialog has no automated WCAG violations', async ({ page }) => {
    await page.getByRole('button', { name: 'Abrir contenido largo' }).click();

    await expectNoA11yViolations(page, '#long-dialog');
  });

  test('form dialog has no automated WCAG violations', async ({ page }) => {
    await page.getByRole('button', { name: 'Abrir formulario' }).click();

    await expectNoA11yViolations(page, '#form-dialog');
  });
});
