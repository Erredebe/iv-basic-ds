import { describe, expect, h, it, render, vi } from '@stencil/vitest';
import './iv-textarea';

describe('iv-textarea', () => {
  it('renders a visible label connected to the native textarea', async () => {
    const { root } = await render(
      <iv-textarea label="Mensaje" textarea-id="message-field" name="message" autocomplete="off"></iv-textarea>,
    );
    const label = root.querySelector('label');
    const textarea = root.querySelector('textarea');

    expect(label?.textContent).toBe('Mensaje');
    expect(textarea).not.toBeNull();
    expect(textarea?.id).toBe('message-field');
    expect(textarea?.getAttribute('name')).toBe('message');
    expect(textarea?.getAttribute('autocomplete')).toBe('off');
    expect(label?.getAttribute('for')).toBe(textarea?.id);
    expect(root.getAttribute('label')).toBe('Mensaje');
    expect(root.hasAttribute('aria-label')).toBe(false);
    expect(root.hasAttribute('aria-describedby')).toBe(false);
  });

  it('maps hint and error to aria-describedby on the native textarea', async () => {
    const { root } = await render(
      <iv-textarea label="Comentario" hint="Minimo una frase." error="El comentario es demasiado corto."></iv-textarea>,
    );
    const textarea = root.querySelector('textarea');
    const hint = root.querySelector('.iv-textarea__hint');
    const error = root.querySelector('.iv-textarea__error');
    const describedBy = textarea?.getAttribute('aria-describedby')?.split(' ');

    expect(hint?.textContent).toBe('Minimo una frase.');
    expect(error?.textContent).toBe('El comentario es demasiado corto.');
    expect(describedBy).toEqual([hint?.id, error?.id]);
    expect(textarea?.getAttribute('aria-invalid')).toBe('true');
    expect(root.hasAttribute('aria-invalid')).toBe(false);
    expect(root.hasAttribute('aria-describedby')).toBe(false);
  });

  it('maps required, disabled and readonly only to the native textarea', async () => {
    const { root } = await render(
      <iv-textarea label="Codigo" value="LOCKED" required={true} disabled={true} readonly={true}></iv-textarea>,
    );
    const textarea = root.querySelector('textarea');

    expect(root.hasAttribute('required')).toBe(true);
    expect(root.hasAttribute('disabled')).toBe(true);
    expect(root.hasAttribute('readonly')).toBe(true);
    expect(textarea?.hasAttribute('required')).toBe(true);
    expect(textarea?.hasAttribute('disabled')).toBe(true);
    expect(textarea?.hasAttribute('readonly')).toBe(true);
  });

  it('does not expose disabled textareas as invalid even when error text is rendered', async () => {
    const { root } = await render(<iv-textarea label="Comentario" disabled={true} error="No se puede validar ahora."></iv-textarea>);
    const textarea = root.querySelector('textarea');

    expect(root.querySelector('.iv-textarea')?.classList.contains('iv-textarea--invalid')).toBe(false);
    expect(root.querySelector('.iv-textarea__error')?.textContent).toBe('No se puede validar ahora.');
    expect(textarea?.hasAttribute('aria-invalid')).toBe(false);
  });

  it('maps textarea-specific attributes to the native textarea', async () => {
    const { root } = await render(
      <iv-textarea label="Notas" placeholder="Escribe notas" rows={6} maxlength={200} minlength={10} wrap="hard"></iv-textarea>,
    );
    const textarea = root.querySelector('textarea');

    expect(textarea?.getAttribute('placeholder')).toBe('Escribe notas');
    expect(textarea?.getAttribute('rows')).toBe('6');
    expect(textarea?.getAttribute('maxlength')).toBe('200');
    expect(textarea?.getAttribute('minlength')).toBe('10');
    expect(textarea?.getAttribute('wrap')).toBe('hard');
  });

  it('maps form ownership to the native textarea for form participation', async () => {
    const { root } = await render(<iv-textarea label="Feedback" name="feedback" value="Me gusta" form="feedback-form"></iv-textarea>);
    const textarea = root.querySelector('textarea');

    expect(textarea?.getAttribute('name')).toBe('feedback');
    expect(textarea?.getAttribute('form')).toBe('feedback-form');
  });

  it('updates value and emits valueChange when users type', async () => {
    const { root, waitForChanges } = await render(<iv-textarea label="Mensaje"></iv-textarea>);
    const textarea = root.querySelector('textarea');
    const valueChange = vi.fn();
    root.addEventListener('valueChange', valueChange);

    textarea!.value = 'Hola mundo';
    textarea!.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
    await waitForChanges();

    expect(root.value).toBe('Hola mundo');
    expect(valueChange).toHaveBeenCalledTimes(1);
    expect(valueChange.mock.calls[0][0].detail).toBe('Hola mundo');
  });
});
