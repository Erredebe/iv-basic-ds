import { html } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components';

const meta: Meta = {
  title: 'Components/Button',
  component: 'iv-button',
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'ghost'],
    },
    disabled: { control: 'boolean' },
    label: { control: 'text' },
    href: { control: 'text' },
  },
  args: {
    variant: 'primary',
    disabled: false,
    label: 'Button',
    href: '',
  },
};

export default meta;

type Story = StoryObj;

export const Playground: Story = {
  render: ({ variant, disabled, label, href }) => html`
    <iv-button variant=${variant} ?disabled=${disabled} href=${href || undefined}>${label}</iv-button>
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
