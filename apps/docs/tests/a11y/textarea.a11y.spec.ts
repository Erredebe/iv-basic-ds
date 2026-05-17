import { expect, test } from '@playwright/test';
import { expectNoA11yViolations, expectNoHorizontalOverflow, waitForComponents } from './axe';

test.describe('iv-textarea accessibility', () => {
  test('textarea demo has no automated WCAG violations', async ({ page }) => {
    await page.goto('/demos/atoms/textarea.html');
    await waitForComponents(page);

    await expectNoHorizontalOverflow(page);
    await expectNoA11yViolations(page);
  });

  test('labels and descriptions are exposed from the native textarea only', async ({ page }) => {
    await page.goto('/demos/atoms/textarea.html');
    await waitForComponents(page);

    const message = page.getByLabel('Mensaje', { exact: true });
    await expect(message).toHaveAccessibleDescription('Incluye el contexto necesario para responderte.');

    const commentHost = page.locator('iv-textarea[label="Comentario"]');
    await expect(commentHost).not.toHaveAttribute('aria-describedby');
    await expect(commentHost).not.toHaveAttribute('aria-invalid');

    const comment = commentHost.locator('textarea');
    await expect(comment).toHaveAttribute('aria-invalid', 'true');
    await expect(comment).toHaveAccessibleDescription('Escribe al menos una frase completa. El comentario es demasiado corto.');
  });

  test('required, readonly and disabled states stay on the native textarea', async ({ page }) => {
    await page.goto('/demos/atoms/textarea.html');
    await waitForComponents(page);

    await expect(page.locator('iv-textarea[label="Comentario"] textarea')).toHaveAttribute('required', '');
    await expect(page.getByLabel('Resumen interno')).toHaveAttribute('readonly', '');
    await expect(page.getByLabel('Comentario bloqueado')).toBeDisabled();
  });

  test('named native textareas participate in FormData, including external form ownership', async ({ page }) => {
    await page.goto('/demos/atoms/textarea.html');
    await waitForComponents(page);

    const formData = await page.locator('#feedback-form').evaluate(form => {
      const data = new FormData(form as HTMLFormElement);

      return {
        feedback: data.get('feedback'),
        externalNote: data.get('externalNote'),
      };
    });

    expect(formData).toEqual({
      feedback: 'Me interesa probar el componente.',
      externalNote: 'EXT-NOTE',
    });
  });
});
