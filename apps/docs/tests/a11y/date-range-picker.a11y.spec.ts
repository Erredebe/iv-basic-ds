import { expect, test } from '@playwright/test';
import { expectNoA11yViolations, expectNoHorizontalOverflow, waitForComponents } from './axe';

const dialogVariants = ['range-sheet', 'range-stepper', 'range-segmented', 'range-presets'];

test.describe('iv-date-range-picker accessibility', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/demos/molecules/date-range-picker.html');
    await waitForComponents(page);
  });

  test('date range picker demo has no automated WCAG violations when closed', async ({ page }) => {
    await expectNoHorizontalOverflow(page);
    await expectNoA11yViolations(page);
  });

  test('native inputs expose labels, descriptions and form values', async ({ page }) => {
    const formPicker = page.locator('#range-form-picker');

    await expect(formPicker.locator('input[name="bookingStart"]')).toHaveValue('2026-05-18');
    await expect(formPicker.locator('input[name="bookingEnd"]')).toHaveValue('2026-05-24');
    await expect(formPicker).not.toHaveAttribute('aria-describedby');

    const formData = await page.locator('#range-form').evaluate(form => {
      const data = new FormData(form as HTMLFormElement);

      return {
        bookingStart: data.get('bookingStart'),
        bookingEnd: data.get('bookingEnd'),
      };
    });

    expect(formData).toEqual({
      bookingStart: '2026-05-18',
      bookingEnd: '2026-05-24',
    });
  });

  test('all dialog variants open and have no automated WCAG violations', async ({ page }) => {
    for (const variantId of dialogVariants) {
      const picker = page.locator(`#${variantId}`);

      await picker.locator('.iv-date-range-picker__trigger').click();
      await expect(picker.locator('dialog')).toHaveJSProperty('open', true);
      await expectNoA11yViolations(page, `#${variantId}`);
      await picker.locator('dialog').evaluate(dialog => (dialog as HTMLDialogElement).close());
    }
  });

  test('compact variant expands inline without horizontal overflow', async ({ page }) => {
    const picker = page.locator('#range-compact');

    await picker.locator('.iv-date-range-picker__trigger').click();

    await expect(picker.locator('.iv-date-range-picker__compact-panel')).toBeVisible();
    await expectNoHorizontalOverflow(page);
    await expectNoA11yViolations(page, '#range-compact');
  });

  test('calendar selection updates start and end values accessibly', async ({ page }) => {
    const picker = page.locator('#range-stepper');

    await picker.locator('.iv-date-range-picker__trigger').click();
    await picker.locator('[data-iv-date="2026-05-12"]').click();

    await expect(picker).toHaveAttribute('start-value', '2026-05-10');
    await expect(picker).toHaveAttribute('end-value', '2026-05-12');
    await expect(picker.locator('dialog')).toHaveJSProperty('open', false);
  });

  test('range order error is announced from native inputs only', async ({ page }) => {
    const picker = page.locator('#range-sheet');
    const startInput = picker.locator('input[name="hotelStart"]');
    const endInput = picker.locator('input[name="hotelEnd"]');

    await startInput.fill('2026-05-24');
    await endInput.fill('2026-05-20');

    await expect(endInput).toHaveAttribute('aria-invalid', 'true');
    await expect(picker).not.toHaveAttribute('aria-invalid');
    await expect(picker.locator('.iv-date-range-picker__error')).toContainText('no puede ser anterior');
  });
});
