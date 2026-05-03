import { html } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components';

const meta: Meta = {
  title: 'Atoms/Button',
  component: 'iv-button',
  tags: ['autodocs', 'stable', 'a11y'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'ghost'],
    },
    disabled: { control: 'boolean' },
    text: { control: 'text' },
    href: { control: 'text' },
    label: { control: 'text' },
    controls: { control: 'text' },
    expanded: { control: 'boolean' },
    pressed: { control: 'boolean' },
  },
  args: {
    variant: 'primary',
    disabled: false,
    text: 'Button',
    href: '',
    label: '',
    controls: '',
    expanded: undefined,
    pressed: undefined,
  },
};

export default meta;

type Story = StoryObj;

export const Playground: Story = {
  render: ({ variant, disabled, text, href, label, controls, expanded, pressed }) => html`
    <iv-button
      variant=${variant}
      ?disabled=${disabled}
      href=${href || undefined}
      label=${label || undefined}
      controls=${controls || undefined}
      .expanded=${expanded}
      .pressed=${pressed}
    >
      ${text}
    </iv-button>
  `,
};

export const Variants: Story = {
  render: () => html`
    <div class="iv-storybook-panel">
      <p class="iv-storybook-panel__eyebrow">Button system</p>
      <h2 class="iv-storybook-panel__title">Acciones claras, tactiles y legibles</h2>
      <p class="iv-storybook-panel__description">
        Las variantes mantienen contraste AA, foco visible y tamanos comodos para uso con mouse, teclado y pantallas tactiles.
      </p>
      <div class="iv-storybook-actions">
        <iv-button variant="primary">Primary</iv-button>
        <iv-button variant="secondary">Secondary</iv-button>
        <iv-button variant="ghost">Ghost</iv-button>
        <iv-button disabled>Disabled</iv-button>
      </div>
    </div>
  `,
};

export const InteractionStates: Story = {
  parameters: {
    pseudo: {
      hover: true,
      focusVisible: true,
    },
  },
  render: () => html`
    <div class="iv-storybook-panel">
      <p class="iv-storybook-panel__eyebrow">Estados interactivos</p>
      <h2 class="iv-storybook-panel__title">Hover y foco siempre visibles</h2>
      <div class="iv-storybook-grid iv-storybook-grid--compact">
        <div class="iv-storybook-swatch">
          <span class="iv-storybook-swatch__label">Primary</span>
          <iv-button variant="primary">Guardar cambios</iv-button>
        </div>
        <div class="iv-storybook-swatch">
          <span class="iv-storybook-swatch__label">Secondary</span>
          <iv-button variant="secondary">Revisar detalles</iv-button>
        </div>
        <div class="iv-storybook-swatch">
          <span class="iv-storybook-swatch__label">Ghost</span>
          <iv-button variant="ghost">Cancelar</iv-button>
        </div>
        <div class="iv-storybook-swatch">
          <span class="iv-storybook-swatch__label">Disabled</span>
          <iv-button disabled>No disponible</iv-button>
        </div>
      </div>
    </div>
  `,
};

export const AccessibilityStates: Story = {
  render: () => html`
    <div class="iv-storybook-panel">
      <p class="iv-storybook-panel__eyebrow">Patrones ARIA</p>
      <h2 class="iv-storybook-panel__title">Semantica explicita para casos comunes</h2>
      <div class="iv-storybook-actions">
        <iv-button label="Guardar cambios">Guardar</iv-button>
        <iv-button controls="filters-panel" expanded="false">Filtros</iv-button>
        <iv-button pressed="true" variant="secondary">Vista compacta</iv-button>
        <iv-button href="/storybook/" current="page" variant="ghost">Storybook</iv-button>
      </div>
    </div>
  `,
};
