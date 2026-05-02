import { html } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components';

const meta: Meta = {
  title: 'Components/Button',
  component: 'iv-button',
  tags: ['autodocs', 'stable', 'a11y'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'ghost'],
    },
    disabled: { control: 'boolean' },
    label: { control: 'text' },
    href: { control: 'text' },
    ariaLabel: { control: 'text', name: 'aria-label' },
    ariaControls: { control: 'text', name: 'aria-controls' },
    ariaExpanded: { control: 'boolean', name: 'aria-expanded' },
    ariaPressed: { control: 'boolean', name: 'aria-pressed' },
  },
  args: {
    variant: 'primary',
    disabled: false,
    label: 'Button',
    href: '',
    ariaLabel: '',
    ariaControls: '',
    ariaExpanded: undefined,
    ariaPressed: undefined,
  },
};

export default meta;

type Story = StoryObj;

export const Playground: Story = {
  render: ({ variant, disabled, label, href, ariaLabel, ariaControls, ariaExpanded, ariaPressed }) => html`
    <iv-button
      variant=${variant}
      ?disabled=${disabled}
      href=${href || undefined}
      aria-label=${ariaLabel || undefined}
      aria-controls=${ariaControls || undefined}
      aria-expanded=${ariaExpanded === undefined ? undefined : String(ariaExpanded)}
      aria-pressed=${ariaPressed === undefined ? undefined : String(ariaPressed)}
    >
      ${label}
    </iv-button>
  `,
};

export const Variants: Story = {
  render: () => html`
    <div style="display: flex; flex-wrap: wrap; gap: var(--iv-space-sm);">
      <iv-button variant="primary">Primary</iv-button>
      <iv-button variant="secondary">Secondary</iv-button>
      <iv-button variant="ghost">Ghost</iv-button>
      <iv-button disabled>Disabled</iv-button>
    </div>
  `,
};

export const AccessibilityStates: Story = {
  render: () => html`
    <div style="display: flex; flex-wrap: wrap; gap: var(--iv-space-sm);">
      <iv-button aria-label="Guardar cambios">Guardar</iv-button>
      <iv-button aria-controls="filters-panel" aria-expanded="false">Filtros</iv-button>
      <iv-button aria-pressed="true" variant="secondary">Vista compacta</iv-button>
      <iv-button href="/storybook/" aria-current="page" variant="ghost">Storybook</iv-button>
    </div>
  `,
};
