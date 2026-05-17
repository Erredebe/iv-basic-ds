import { describe, expect, h, it, render, vi } from '@stencil/vitest';
import './iv-button';
import '../iv-icon/iv-icon';

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
      <iv-button variant="secondary" type="submit" value="apply" controls="filters" expanded={true} pressed="mixed">
        Filtros
      </iv-button>,
    );
    const button = root.querySelector('button');

    expect(button?.className).toBe('iv-button iv-button--secondary');
    expect(button?.type).toBe('submit');
    expect(button?.getAttribute('value')).toBe('apply');
    expect(button?.getAttribute('aria-controls')).toBe('filters');
    expect(button?.getAttribute('aria-expanded')).toBe('true');
    expect(button?.getAttribute('aria-pressed')).toBe('mixed');
    expect(root.getAttribute('controls')).toBe('filters');
    expect(root.hasAttribute('expanded')).toBe(true);
    expect(root.getAttribute('pressed')).toBe('mixed');
    expect(root.hasAttribute('aria-controls')).toBe(false);
    expect(root.hasAttribute('aria-expanded')).toBe(false);
    expect(root.hasAttribute('aria-pressed')).toBe(false);
  });

  it('renders the danger variant added in 0.0.2', async () => {
    const { root } = await render(<iv-button variant="danger">Eliminar</iv-button>);
    const button = root.querySelector('button');

    expect(button?.className).toBe('iv-button iv-button--danger');
    expect(button?.textContent).toBe('Eliminar');
  });

  it('maps semantic labelling props only to the internal native control', async () => {
    const { root } = await render(
      <iv-button label="Guardar cambios" labelled-by="button-title" described-by="button-help" has-popup="dialog">
        Guardar
      </iv-button>,
    );
    const button = root.querySelector('button');

    expect(root.getAttribute('label')).toBe('Guardar cambios');
    expect(root.getAttribute('labelled-by')).toBe('button-title');
    expect(root.getAttribute('described-by')).toBe('button-help');
    expect(root.getAttribute('has-popup')).toBe('dialog');
    expect(root.hasAttribute('aria-label')).toBe(false);
    expect(root.hasAttribute('aria-labelledby')).toBe(false);
    expect(root.hasAttribute('aria-describedby')).toBe(false);
    expect(root.hasAttribute('aria-haspopup')).toBe(false);
    expect(button?.getAttribute('aria-label')).toBe('Guardar cambios');
    expect(button?.getAttribute('aria-labelledby')).toBe('button-title');
    expect(button?.getAttribute('aria-describedby')).toBe('button-help');
    expect(button?.getAttribute('aria-haspopup')).toBe('dialog');
  });

  it('renders links when href is provided', async () => {
    const { root } = await render(
      <iv-button href="/storybook/" target="_blank" current="page" pressed={true}>
        Storybook
      </iv-button>,
    );
    const link = root.querySelector('a');

    expect(link).not.toBeNull();
    expect(link?.className).toBe('iv-button iv-button--primary');
    expect(link?.getAttribute('href')).toBe('/storybook/');
    expect(link?.getAttribute('target')).toBe('_blank');
    expect(link?.getAttribute('rel')).toBe('noopener noreferrer');
    expect(link?.getAttribute('aria-current')).toBe('page');
    expect(link?.hasAttribute('aria-pressed')).toBe(false);
    expect(root.getAttribute('current')).toBe('page');
    expect(root.hasAttribute('aria-current')).toBe(false);
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

  it('renders slotted icons and visible text inside the native button', async () => {
    const { root } = await render(
      <iv-button>
        <iv-icon name="check"></iv-icon>
        Guardar
      </iv-button>,
    );
    const button = root.querySelector('button');
    const icon = button?.querySelector('iv-icon');

    expect(button).not.toBeNull();
    expect(icon).not.toBeNull();
    expect(icon?.querySelector('svg')?.getAttribute('aria-hidden')).toBe('true');
    expect(button?.textContent?.trim()).toBe('Guardar');
  });

  it('keeps icon-only buttons named by the native control', async () => {
    const { root } = await render(
      <iv-button label="Cerrar" variant="ghost">
        <iv-icon name="close"></iv-icon>
      </iv-button>,
    );
    const button = root.querySelector('button');
    const icon = button?.querySelector('iv-icon');

    expect(root.getAttribute('label')).toBe('Cerrar');
    expect(root.hasAttribute('aria-label')).toBe(false);
    expect(button?.getAttribute('aria-label')).toBe('Cerrar');
    expect(icon).not.toBeNull();
    expect(icon?.hasAttribute('label')).toBe(false);
    expect(icon?.querySelector('svg')?.getAttribute('aria-hidden')).toBe('true');
  });
});
