import { expect, test } from '@playwright/test';
import { expectNoA11yViolations, waitForComponents } from './axe';

test.describe('iv-input accessibility', () => {
  test('input demo has no automated WCAG violations', async ({ page }) => {
    await page.goto('/demos/atoms/input.html');
    await waitForComponents(page);

    await expectNoA11yViolations(page);
  });

  test('labels and descriptions are exposed from the native input only', async ({ page }) => {
    await page.goto('/demos/atoms/input.html');
    await waitForComponents(page);

    const email = page.getByLabel('Email', { exact: true });
    await expect(email).toHaveAttribute('type', 'email');
    await expect(email).toHaveAccessibleDescription('Usa tu correo corporativo.');

    const usernameHost = page.locator('iv-input[label="Usuario"]');
    await expect(usernameHost).not.toHaveAttribute('aria-describedby');
    await expect(usernameHost).not.toHaveAttribute('aria-invalid');

    const username = page.getByLabel('Usuario');
    await expect(username).toHaveAttribute('aria-invalid', 'true');
    await expect(username).toHaveAccessibleDescription('Debe tener entre 3 y 20 caracteres. Este usuario ya existe.');
  });

  test('required, readonly and disabled states stay on the native input', async ({ page }) => {
    await page.goto('/demos/atoms/input.html');
    await waitForComponents(page);

    await expect(page.getByLabel('Contrasena')).toHaveAttribute('required', '');
    await expect(page.getByLabel('ID interno')).toHaveAttribute('readonly', '');
    await expect(page.getByLabel('Codigo bloqueado')).toBeDisabled();
  });

  test('named native inputs participate in FormData, including external form ownership', async ({ page }) => {
    await page.goto('/demos/atoms/input.html');
    await waitForComponents(page);

    const formData = await page.locator('#profile-form').evaluate(form => {
      const data = new FormData(form as HTMLFormElement);

      return {
        profileName: data.get('profileName'),
        profileEmail: data.get('profileEmail'),
        externalCode: data.get('externalCode'),
      };
    });

    expect(formData).toEqual({
      profileName: 'Ada',
      profileEmail: 'ada@example.com',
      externalCode: 'EXT-1',
    });
  });
});
