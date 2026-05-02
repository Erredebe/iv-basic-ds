import { describe, expect, h, it, render, vi } from '@stencil/vitest';
import './iv-button';

describe('iv-button', () => {
  it('renders a primary button by default', async () => {
    const { root } = await render(<iv-button>Guardar</iv-button>);
    const button = root.querySelector('button');

    expect(button).not.toBeNull();
    expect(button?.className).toBe('iv-button iv-button--primary');
    expect(button?.type).toBe('button');
    expect(button?.textContent).toBe('Guardar');
  });

  it('renders configured variant, type and aria state attributes', async () => {
    const { root } = await render(
      <iv-button variant="secondary" type="submit" aria-controls="filters" aria-expanded={true} aria-pressed="mixed">
        Filtros
      </iv-button>,
    );
    const button = root.querySelector('button');

    expect(button?.className).toBe('iv-button iv-button--secondary');
    expect(button?.type).toBe('submit');
    expect(button?.getAttribute('aria-controls')).toBe('filters');
    expect(button?.getAttribute('aria-expanded')).toBe('true');
    expect(button?.getAttribute('aria-pressed')).toBe('mixed');
  });

  it('renders links when href is provided', async () => {
    const { root } = await render(
      <iv-button href="/storybook/" target="_blank">
        Storybook
      </iv-button>,
    );
    const link = root.querySelector('a');

    expect(link).not.toBeNull();
    expect(link?.className).toBe('iv-button iv-button--primary');
    expect(link?.getAttribute('href')).toBe('/storybook/');
    expect(link?.getAttribute('target')).toBe('_blank');
    expect(link?.getAttribute('rel')).toBe('noreferrer');
  });

  it('prevents disabled link navigation', async () => {
    const { root } = await render(
      <iv-button href="/storybook/" disabled={true}>
        Storybook
      </iv-button>,
    );
    const link = root.querySelector('a');
    const event = new MouseEvent('click', { bubbles: true, cancelable: true });
    const preventDefault = vi.spyOn(event, 'preventDefault');
    const stopPropagation = vi.spyOn(event, 'stopPropagation');

    link?.dispatchEvent(event);

    expect(link?.hasAttribute('href')).toBe(false);
    expect(link?.getAttribute('aria-disabled')).toBe('true');
    expect(link?.getAttribute('tabindex')).toBe('-1');
    expect(preventDefault).toHaveBeenCalled();
    expect(stopPropagation).toHaveBeenCalled();
  });
});
