import { describe, expect, h, it, render } from '@stencil/vitest';
import './iv-icon';

describe('iv-icon', () => {
  it('renders a decorative icon by default', async () => {
    const { root } = await render(<iv-icon name="check"></iv-icon>);
    const svg = root.querySelector('svg');

    expect(svg).not.toBeNull();
    expect(svg?.getAttribute('class')).toBe('iv-icon iv-icon--md');
    expect(svg?.getAttribute('aria-hidden')).toBe('true');
    expect(svg?.hasAttribute('role')).toBe(false);
    expect(svg?.hasAttribute('aria-label')).toBe(false);
  });

  it('maps label only to the internal svg when the icon is meaningful', async () => {
    const { root } = await render(
      <iv-icon name="warning" label="Advertencia" size="lg"></iv-icon>,
    );
    const svg = root.querySelector('svg');

    expect(root.getAttribute('label')).toBe('Advertencia');
    expect(root.hasAttribute('aria-label')).toBe(false);
    expect(svg?.getAttribute('class')).toBe('iv-icon iv-icon--lg');
    expect(svg?.getAttribute('role')).toBe('img');
    expect(svg?.getAttribute('aria-label')).toBe('Advertencia');
    expect(svg?.hasAttribute('aria-hidden')).toBe(false);
  });
});
