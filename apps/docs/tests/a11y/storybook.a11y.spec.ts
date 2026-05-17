import { expect, test } from '@playwright/test';
import { expectNoA11yViolations, expectNoHorizontalOverflow, waitForComponents } from './axe';

const storyRoutes = [
  'atoms-button--accessibility-states',
  'atoms-button--with-icons',
  'atoms-input--accessibility',
  'atoms-textarea--accessibility',
  'atoms-icon--accessibility',
];

const openDialogStoryRoutes = [
  { id: 'molecules-dialog--labelled-by-title', button: 'Abrir confirmacion', dialog: '#basic-dialog' },
  { id: 'molecules-dialog--alert-dialog', button: 'Abrir alertdialog', dialog: '#alert-dialog' },
  { id: 'molecules-dialog--non-modal', button: 'Abrir dialog no modal', dialog: '#non-modal-dialog' },
  { id: 'molecules-dialog--complex-content-without-description', button: 'Abrir contenido complejo', dialog: '#complex-dialog' },
];

test.describe('Storybook accessibility smoke coverage', () => {
  for (const storyId of storyRoutes) {
    test(`${storyId} has no automated WCAG violations or horizontal overflow`, async ({ page }) => {
      await page.goto(`/storybook/iframe.html?id=${storyId}&viewMode=story`);
      await waitForComponents(page);

      await expect(page.locator('#storybook-root')).toBeVisible();
      await expectNoHorizontalOverflow(page);
      await expectNoA11yViolations(page);
    });
  }

  for (const story of openDialogStoryRoutes) {
    test(`${story.id} open state has no automated WCAG violations`, async ({ page }) => {
      await page.goto(`/storybook/iframe.html?id=${story.id}&viewMode=story`);
      await waitForComponents(page);
      await page.getByRole('button', { name: story.button }).click();

      await expect(page.locator(`${story.dialog} dialog`)).toHaveJSProperty('open', true);
      await expectNoHorizontalOverflow(page);
      await expectNoA11yViolations(page, story.dialog);
    });
  }
});
