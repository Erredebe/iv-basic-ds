import { html } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components';

const iconNames = ['check', 'close', 'info', 'warning', 'chevron-down', 'external-link'];

const meta: Meta = {
  title: 'Atoms/Icon',
  component: 'iv-icon',
  tags: ['autodocs', 'a11y'],
  parameters: {
    docs: {
      description: {
        component:
          'iv-icon renderiza SVG inline con currentColor. Es decorativo por defecto; usa label solo cuando el icono comunica significado sin texto visible equivalente.',
      },
    },
  },
  argTypes: {
    name: {
      control: 'select',
      options: iconNames,
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    label: { control: 'text' },
  },
  args: {
    name: 'check',
    size: 'md',
    label: '',
  },
};

export default meta;

type Story = StoryObj;

export const Playground: Story = {
  render: ({ name, size, label }) => html`<iv-icon name=${name} size=${size} label=${label || undefined}></iv-icon>`,
};

export const IconSet: Story = {
  render: () => html`
    <div class="iv-storybook-panel">
      <p class="iv-storybook-panel__eyebrow">Icon system</p>
      <h2 class="iv-storybook-panel__title">Iconos pequenos, consistentes y heredables</h2>
      <p class="iv-storybook-panel__description">
        Los iconos usan <code>currentColor</code>, por lo que heredan el color del texto o del componente contenedor.
      </p>
      <div class="iv-storybook-grid iv-storybook-grid--compact">
        ${iconNames.map(
          name => html`
            <div class="iv-storybook-swatch">
              <iv-icon name=${name} size="lg"></iv-icon>
              <span class="iv-storybook-swatch__label">${name}</span>
            </div>
          `,
        )}
      </div>
    </div>
  `,
};

export const Sizes: Story = {
  render: () => html`
    <div class="iv-storybook-panel">
      <p class="iv-storybook-panel__eyebrow">Tamanos</p>
      <h2 class="iv-storybook-panel__title">Escala simple para texto y controles</h2>
      <div class="iv-storybook-actions">
        <span><iv-icon name="info" size="sm"></iv-icon> Small</span>
        <span><iv-icon name="info" size="md"></iv-icon> Medium</span>
        <span><iv-icon name="info" size="lg"></iv-icon> Large</span>
      </div>
    </div>
  `,
};

export const Accessibility: Story = {
  render: () => html`
    <div class="iv-storybook-panel">
      <p class="iv-storybook-panel__eyebrow">Accesibilidad</p>
      <h2 class="iv-storybook-panel__title">Decorativo por defecto, etiquetado cuando aporta significado</h2>
      <div class="iv-storybook-actions">
        <span><iv-icon name="check"></iv-icon> Texto visible equivalente</span>
        <iv-icon name="warning" label="Advertencia"></iv-icon>
      </div>
    </div>
  `,
};
