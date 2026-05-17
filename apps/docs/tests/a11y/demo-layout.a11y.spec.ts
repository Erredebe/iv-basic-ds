import { expect, test } from '@playwright/test';
import { expectNoA11yViolations, expectNoHorizontalOverflow, waitForComponents } from './axe';

const demoRoutes = [
  { path: '/', title: 'Design System base con StencilJS' },
  { path: '/demos/atoms/button.html', title: 'Button' },
  { path: '/demos/atoms/button-001.html', title: 'Button 0.0.1' },
  { path: '/demos/atoms/button-002.html', title: 'Button 0.0.2' },
  { path: '/demos/atoms/button-versions.html', title: 'Button 0.0.1 vs 0.0.2' },
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

    await expect(page.getByRole('link', { name: 'Ir a Storybook' })).toHaveAttribute('href', '/storybook/');
    await expect(page.getByRole('link', { name: 'Showcase Angular' })).toHaveAttribute('href', '/showcase/');
    await expect(page.getByRole('link', { name: 'Historico de componentes' })).toHaveAttribute('href', '/showcase/#component-history');
    await expect(page.getByRole('link', { name: 'Informe a11y' })).toHaveAttribute('href', '/test-report/');
    await expect(page.getByRole('link', { name: 'Coverage spec' })).toHaveAttribute('href', '/coverage/');
    await expect(page.getByRole('link', { name: 'Ver repositorio' })).toHaveAttribute('href', 'https://github.com/Erredebe/iv-basic-ds');
    await expect(page.getByRole('heading', { name: 'Piezas base', level: 3 })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Composiciones con comportamiento', level: 3 })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Button', exact: true })).toHaveAttribute('href', '/demos/atoms/button.html');
    await expect(page.getByRole('link', { name: 'Button versions' })).toHaveAttribute('href', '/demos/atoms/button-versions.html');
    await expect(page.getByRole('link', { name: 'Button 0.0.1' })).toHaveAttribute('href', '/demos/atoms/button-001.html');
    await expect(page.getByRole('link', { name: 'Button 0.0.2' })).toHaveAttribute('href', '/demos/atoms/button-002.html');
    await expect(page.getByRole('link', { name: 'Icon' })).toHaveAttribute('href', '/demos/atoms/icon.html');
    await expect(page.getByRole('link', { name: 'Input' })).toHaveAttribute('href', '/demos/atoms/input.html');
    await expect(page.getByRole('link', { name: 'Textarea' })).toHaveAttribute('href', '/demos/atoms/textarea.html');
    await expect(page.getByRole('link', { name: 'Dialog' })).toHaveAttribute('href', '/demos/molecules/dialog.html');
  });
});
