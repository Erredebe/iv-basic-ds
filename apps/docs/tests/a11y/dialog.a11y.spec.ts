import { expect, test } from '@playwright/test';
import { expectNoA11yViolations, expectNoHorizontalOverflow, waitForComponents } from './axe';

const dialogTriggers = [
  { button: 'Abrir dialog', id: 'labelled-dialog' },
  { button: 'Abrir ayuda rapida', id: 'label-only-dialog' },
  { button: 'Abrir alertdialog', id: 'alert-dialog' },
  { button: 'Abrir revision obligatoria', id: 'prevent-dismiss-dialog' },
  { button: 'Abrir dialog no modal', id: 'non-modal-dialog' },
  { button: 'Abrir contenido largo', id: 'long-dialog' },
  { button: 'Abrir formulario', id: 'form-dialog' },
  { button: 'Abrir decision', id: 'return-dialog' },
  { button: 'Abrir con initial-focus', id: 'initial-focus-dialog' },
  { button: 'Abrir con restore-focus', id: 'restore-focus-dialog' },
  { button: 'Abrir resumen', id: 'complex-dialog' },
];

test.describe('iv-dialog accessibility', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/demos/molecules/dialog.html');
    await waitForComponents(page);
  });

  test('dialog demo has no automated WCAG violations when closed', async ({ page }) => {
    await expectNoHorizontalOverflow(page);
    await expectNoA11yViolations(page);
  });

  test('all dialog demo triggers open their dialogs', async ({ page }) => {
    for (const trigger of dialogTriggers) {
      await page.getByRole('button', { name: trigger.button, exact: true }).click();
      await expect(page.locator(`#${trigger.id} dialog`)).toHaveJSProperty('open', true);
      await page.locator(`#${trigger.id}`).evaluate((dialog: HTMLIvDialogElement) => dialog.close('test'));
    }
  });

  test('all open dialog states have no automated WCAG violations', async ({ page }) => {
    for (const trigger of dialogTriggers) {
      await page.getByRole('button', { name: trigger.button, exact: true }).click();
      await expect(page.locator(`#${trigger.id} dialog`)).toHaveJSProperty('open', true);
      await expectNoA11yViolations(page, `#${trigger.id}`);
      await page.locator(`#${trigger.id}`).evaluate((dialog: HTMLIvDialogElement) => dialog.close('test'));
    }
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

  test('companion close actions close with return value', async ({ page }) => {
    await page.getByRole('button', { name: 'Abrir decision' }).click();

    await page.locator('#return-dialog').getByRole('button', { name: 'Confirmar' }).click();

    await expect(page.locator('#return-dialog dialog')).toHaveJSProperty('open', false);
    await expect(page.locator('#return-output')).toHaveText('confirm');
  });

  test('normal dialogs close with Escape and backdrop click', async ({ page }) => {
    await page.getByRole('button', { name: 'Abrir dialog', exact: true }).click();
    await page.keyboard.press('Escape');

    await expect(page.locator('#labelled-dialog dialog')).toHaveJSProperty('open', false);

    await page.getByRole('button', { name: 'Abrir dialog', exact: true }).click();
    await page.mouse.click(10, 10);

    await expect(page.locator('#labelled-dialog dialog')).toHaveJSProperty('open', false);
  });

  test('focus options are explicit and verifiable', async ({ page }) => {
    const restoreTrigger = page.getByRole('button', { name: 'Abrir con restore-focus' });

    await page.getByRole('button', { name: 'Abrir con initial-focus' }).click();
    await expect(page.locator('#initial-focus-confirm button')).toBeFocused();
    await page.locator('#initial-focus-dialog').evaluate((dialog: HTMLIvDialogElement) => dialog.close('test'));

    await restoreTrigger.click();
    await page.locator('#restore-focus-dialog').evaluate((dialog: HTMLIvDialogElement) => dialog.close('test'));

    await expect(restoreTrigger).toBeFocused();
  });

  test('critical and complex dialog semantics are mapped to the native dialog only', async ({ page }) => {
    await page.getByRole('button', { name: 'Abrir alertdialog' }).click();
    const alertDialog = page.locator('#alert-dialog dialog');

    await expect(alertDialog).toHaveAttribute('role', 'alertdialog');
    await expect(alertDialog).toHaveAccessibleName('Eliminar definitivamente');
    await expect(alertDialog).toHaveAccessibleDescription('Esta accion elimina los datos de forma permanente y no se puede deshacer.');
    await page.locator('#alert-dialog').evaluate((dialog: HTMLIvDialogElement) => dialog.close('test'));

    await page.getByRole('button', { name: 'Abrir resumen' }).click();

    await expect(page.locator('#complex-dialog dialog')).not.toHaveAttribute('aria-describedby');
  });
});
