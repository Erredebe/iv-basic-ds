import { expect, test } from '@playwright/test';
import { expectNoA11yViolations, expectNoHorizontalOverflow, waitForComponents } from './axe';

const demoRoutes = [
  { path: '/', title: 'Design System base con StencilJS' },
  { path: '/demos/atoms/button.html', title: 'Button' },
  { path: '/demos/atoms/icon.html', title: 'Icon' },
  { path: '/demos/atoms/input.html', title: 'Input' },
  { path: '/demos/atoms/textarea.html', title: 'Textarea' },
  { path: '/demos/molecules/dialog.html', title: 'Dialog' },
];

test.describe('demo pages layout and accessibility', () => {
  for (const route of demoRoutes) {
    test(`${route.path} has no automated WCAG violations or horizontal overflow`, async ({ page }) => {
      await page.goto(route.path);
      await waitForComponents(page);

      await expect(page.getByRole('heading', { name: route.title, level: 1 })).toBeVisible();
      await expectNoHorizontalOverflow(page);
      await expectNoA11yViolations(page);
    });
  }

  test('home groups demos by atomic level with visible links', async ({ page }) => {
    await page.goto('/');
    await waitForComponents(page);

    await expect(page.getByRole('heading', { name: 'Piezas base', level: 3 })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Composiciones con comportamiento', level: 3 })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Button' })).toHaveAttribute('href', '/demos/atoms/button.html');
    await expect(page.getByRole('link', { name: 'Icon' })).toHaveAttribute('href', '/demos/atoms/icon.html');
    await expect(page.getByRole('link', { name: 'Input' })).toHaveAttribute('href', '/demos/atoms/input.html');
    await expect(page.getByRole('link', { name: 'Textarea' })).toHaveAttribute('href', '/demos/atoms/textarea.html');
    await expect(page.getByRole('link', { name: 'Dialog' })).toHaveAttribute('href', '/demos/molecules/dialog.html');
  });
});
