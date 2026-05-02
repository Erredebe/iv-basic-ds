import { newSpecPage } from '@stencil/core/testing';
import { IvButton } from './iv-button';

describe('iv-button', () => {
  it('renders a primary button by default', async () => {
    const page = await newSpecPage({
      components: [IvButton],
      html: '<iv-button>Guardar</iv-button>',
    });

    const button = page.root?.querySelector('button');

    expect(button).not.toBeNull();
    expect(button?.className).toBe('iv-button iv-button--primary');
    expect(button?.type).toBe('button');
    expect(button?.textContent).toBe('Guardar');
  });

  it('renders configured variant, type and aria state attributes', async () => {
    const page = await newSpecPage({
      components: [IvButton],
      html: '<iv-button variant="secondary" type="submit" aria-controls="filters" aria-expanded="true" aria-pressed="mixed">Filtros</iv-button>',
    });

    const button = page.root?.querySelector('button');

    expect(button?.className).toBe('iv-button iv-button--secondary');
    expect(button?.type).toBe('submit');
    expect(button?.getAttribute('aria-controls')).toBe('filters');
    expect(button?.getAttribute('aria-expanded')).toBe('true');
    expect(button?.getAttribute('aria-pressed')).toBe('mixed');
  });

  it('renders links when href is provided', async () => {
    const page = await newSpecPage({
      components: [IvButton],
      html: '<iv-button href="/storybook/" target="_blank">Storybook</iv-button>',
    });

    const link = page.root?.querySelector('a');

    expect(link).not.toBeNull();
    expect(link?.className).toBe('iv-button iv-button--primary');
    expect(link?.getAttribute('href')).toBe('/storybook/');
    expect(link?.getAttribute('target')).toBe('_blank');
    expect(link?.getAttribute('rel')).toBe('noreferrer');
  });

  it('prevents disabled link navigation', async () => {
    const page = await newSpecPage({
      components: [IvButton],
      html: '<iv-button href="/storybook/" disabled>Storybook</iv-button>',
    });

    const link = page.root?.querySelector('a');
    const event = new MouseEvent('click', { bubbles: true, cancelable: true });
    const preventDefault = jest.spyOn(event, 'preventDefault');
    const stopPropagation = jest.spyOn(event, 'stopPropagation');

    link?.dispatchEvent(event);

    expect(link?.hasAttribute('href')).toBe(false);
    expect(link?.getAttribute('aria-disabled')).toBe('true');
    expect(link?.getAttribute('tabindex')).toBe('-1');
    expect(preventDefault).toHaveBeenCalled();
    expect(stopPropagation).toHaveBeenCalled();
  });
});
