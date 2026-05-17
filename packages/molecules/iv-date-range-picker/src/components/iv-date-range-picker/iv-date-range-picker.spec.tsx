import { beforeEach, describe, expect, h, it, render, vi } from '@stencil/vitest';
import './iv-date-range-picker';

type DateRangePickerElement = HTMLElement & {
  close(): Promise<void>;
  endValue: string;
  open: boolean;
  setFocus(part?: 'start' | 'end'): Promise<void>;
  show(): Promise<void>;
  startValue: string;
};

const renderPicker = async (props: Record<string, unknown> = {}) => {
  const page = await render(h('iv-date-range-picker', props));

  return { ...page, root: page.root as DateRangePickerElement };
};

describe('iv-date-range-picker', () => {
  beforeEach(() => {
    const dialogPrototype = HTMLElement.prototype as HTMLElement & Pick<HTMLDialogElement, 'showModal' | 'close'>;

    dialogPrototype.showModal = vi.fn(function (this: HTMLElement) {
      (this as HTMLDialogElement).open = true;
      this.setAttribute('open', '');
    });
    dialogPrototype.close = vi.fn(function (this: HTMLElement) {
      (this as HTMLDialogElement).open = false;
      this.removeAttribute('open');
      this.dispatchEvent(new Event('close'));
    });
  });

  it('renders a labelled group with two native date inputs', async () => {
    const { root } = await renderPicker({ label: 'Fechas del viaje', 'start-name': 'tripStart', 'end-name': 'tripEnd' });
    const fieldset = root.querySelector('fieldset');
    const legend = root.querySelector('legend');
    const inputs = root.querySelectorAll('input');

    expect(legend?.textContent).toBe('Fechas del viaje');
    expect(inputs).toHaveLength(2);
    expect(inputs[0].type).toBe('date');
    expect(inputs[0].name).toBe('tripStart');
    expect(inputs[1].name).toBe('tripEnd');
    expect(root.hasAttribute('aria-describedby')).toBe(false);
    expect(fieldset?.getAttribute('aria-describedby')).toContain('hint');
  });

  it('maps hint and error to the native inputs without duplicating ARIA on the host', async () => {
    const { root } = await renderPicker({ hint: 'Elige un rango disponible.', error: 'Revisa las fechas.' });
    const inputs = Array.from(root.querySelectorAll('input'));
    const hint = root.querySelector('.iv-date-range-picker__hint');
    const error = root.querySelector('.iv-date-range-picker__error');

    expect(hint?.textContent).toBe('Elige un rango disponible.');
    expect(error?.textContent).toBe('Revisa las fechas.');
    expect(inputs.every(input => input.getAttribute('aria-describedby') === `${hint?.id} ${error?.id}`)).toBe(true);
    expect(inputs.every(input => input.getAttribute('aria-invalid') === 'true')).toBe(true);
    expect(root.hasAttribute('aria-describedby')).toBe(false);
    expect(root.hasAttribute('aria-invalid')).toBe(false);
  });

  it('updates values and emits valueChange when users type manually', async () => {
    const { root, waitForChanges } = await renderPicker();
    const valueChange = vi.fn();
    const [startInput, endInput] = Array.from(root.querySelectorAll('input'));
    root.addEventListener('valueChange', valueChange);

    startInput.value = '2026-05-10';
    startInput.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
    endInput.value = '2026-05-12';
    endInput.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
    await waitForChanges();

    expect(root.startValue).toBe('2026-05-10');
    expect(root.endValue).toBe('2026-05-12');
    expect(valueChange).toHaveBeenCalledTimes(2);
  });

  it('shows a range order error when end date is before start date', async () => {
    const { root } = await renderPicker({ 'start-value': '2026-05-12', 'end-value': '2026-05-10' });
    const endInput = root.querySelectorAll('input')[1];

    expect(root.querySelector('.iv-date-range-picker__error')?.textContent).toContain('no puede ser anterior');
    expect(endInput.getAttribute('aria-invalid')).toBe('true');
  });

  it('opens a dialog calendar and selects the end date from the grid', async () => {
    const { root, waitForChanges } = await renderPicker({ 'start-value': '2026-05-10' });

    await root.show();
    await waitForChanges();

    expect(root.open).toBe(true);
    expect(root.querySelector('dialog')?.open).toBe(true);

    root.querySelector<HTMLButtonElement>('[data-iv-date="2026-05-12"]')?.click();
    await waitForChanges();

    expect(root.endValue).toBe('2026-05-12');
    expect(root.open).toBe(false);
  });

  it('supports preset ranges in the presets variant', async () => {
    const { root, waitForChanges } = await renderPicker({ variant: 'presets' });

    await root.show();
    await waitForChanges();
    root.querySelectorAll<HTMLButtonElement>('.iv-date-range-picker__presets button')[1].click();
    await waitForChanges();

    expect(root.startValue).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(root.endValue).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(compareIsoForTest(root.startValue, root.endValue)).toBeLessThanOrEqual(0);
  });

  it('moves focus to the requested native input through the public method', async () => {
    const { root } = await renderPicker();
    const endInput = root.querySelectorAll('input')[1];
    endInput.focus = vi.fn();

    await root.setFocus('end');

    expect(endInput.focus).toHaveBeenCalled();
  });
});

function compareIsoForTest(first: string, second: string) {
  return first.localeCompare(second);
}
