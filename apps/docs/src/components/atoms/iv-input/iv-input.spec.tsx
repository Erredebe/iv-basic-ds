import { describe, expect, h, it, render, vi } from '@stencil/vitest';
import './iv-input';

describe('iv-input', () => {
  it('renders a visible label connected to the native input', async () => {
    const { root } = await render(<iv-input label="Email" input-id="email-field" type="email" name="email" autocomplete="email"></iv-input>);
    const label = root.querySelector('label');
    const input = root.querySelector('input');

    expect(label?.textContent).toBe('Email');
    expect(input).not.toBeNull();
    expect(input?.id).toBe('email-field');
    expect(input?.type).toBe('email');
    expect(input?.name).toBe('email');
    expect(input?.getAttribute('autocomplete')).toBe('email');
    expect(label?.getAttribute('for')).toBe(input?.id);
    expect(root.getAttribute('label')).toBe('Email');
    expect(root.hasAttribute('aria-label')).toBe(false);
    expect(root.hasAttribute('aria-describedby')).toBe(false);
  });

  it('maps hint and error to aria-describedby on the native input', async () => {
    const { root } = await render(
      <iv-input label="Usuario" hint="Entre 3 y 20 caracteres." error="Este usuario ya existe."></iv-input>,
    );
    const input = root.querySelector('input');
    const hint = root.querySelector('.iv-input__hint');
    const error = root.querySelector('.iv-input__error');
    const describedBy = input?.getAttribute('aria-describedby')?.split(' ');

    expect(hint?.textContent).toBe('Entre 3 y 20 caracteres.');
    expect(error?.textContent).toBe('Este usuario ya existe.');
    expect(describedBy).toEqual([hint?.id, error?.id]);
    expect(input?.getAttribute('aria-invalid')).toBe('true');
    expect(root.hasAttribute('aria-invalid')).toBe(false);
    expect(root.hasAttribute('aria-describedby')).toBe(false);
  });

  it('maps required, disabled and readonly only to the native input', async () => {
    const { root } = await render(
      <iv-input label="Codigo" value="LOCKED" required={true} disabled={true} readonly={true}></iv-input>,
    );
    const input = root.querySelector('input');

    expect(root.hasAttribute('required')).toBe(true);
    expect(root.hasAttribute('disabled')).toBe(true);
    expect(root.hasAttribute('readonly')).toBe(true);
    expect(input?.required).toBe(true);
    expect(input?.disabled).toBe(true);
    expect(input?.readOnly).toBe(true);
    expect(input?.value).toBe('LOCKED');
  });

  it('maps placeholder and inputmode to the native input', async () => {
    const { root } = await render(
      <iv-input label="Telefono" type="tel" placeholder="600 000 000" inputmode="tel"></iv-input>,
    );
    const input = root.querySelector('input');

    expect(input?.getAttribute('placeholder')).toBe('600 000 000');
    expect(input?.getAttribute('inputmode')).toBe('tel');
  });

  it('maps form ownership to the native input for form participation', async () => {
    const { root } = await render(<iv-input label="Nombre" name="profileName" value="Ada" form="profile-form"></iv-input>);
    const input = root.querySelector('input');

    expect(input?.getAttribute('name')).toBe('profileName');
    expect(input?.getAttribute('form')).toBe('profile-form');
    expect(input?.value).toBe('Ada');
  });

  it('updates value and emits valueChange when users type', async () => {
    const { root, waitForChanges } = await render(<iv-input label="Nombre"></iv-input>);
    const input = root.querySelector('input');
    const valueChange = vi.fn();
    root.addEventListener('valueChange', valueChange);

    input!.value = 'Ada';
    input!.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
    await waitForChanges();

    expect(root.value).toBe('Ada');
    expect(valueChange).toHaveBeenCalledTimes(1);
    expect(valueChange.mock.calls[0][0].detail).toBe('Ada');
  });
});
