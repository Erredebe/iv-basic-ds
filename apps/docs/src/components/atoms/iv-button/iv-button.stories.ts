import { html } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components';

const meta: Meta = {
  title: 'Atoms/Button',
  component: 'iv-button',
  tags: ['autodocs', 'stable', 'a11y'],
  parameters: {
    docs: {
      description: {
        component:
          'iv-button no emite un evento custom propio: usa el evento nativo click que burbujea desde el <button> o <a> interno. En HTML, Angular, Lit o Storybook escucha click directamente sobre <iv-button>.',
      },
    },
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'ghost', 'danger'],
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

const getDemoUrl = (path: string) => {
  if (globalThis.location?.port === '6006') {
    return `http://${globalThis.location.hostname}:3333${path}`;
  }

  return path;
};

const renderVersionFrame = (path: string, title: string) => html`
  <iframe
    title=${title}
    src=${getDemoUrl(path)}
    style="width: min(100%, 68rem); min-height: 44rem; border: 1px solid var(--iv-color-border); border-radius: var(--iv-radius-md); background: var(--iv-color-background);"
  ></iframe>
`;

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
        <iv-button variant="danger">Danger</iv-button>
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
          <span class="iv-storybook-swatch__label">Danger</span>
          <iv-button variant="danger">Eliminar</iv-button>
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
        <iv-button href="#current-step" current="step" variant="ghost">Paso actual</iv-button>
      </div>
      <p id="current-step" hidden>Paso actual del flujo de ejemplo.</p>
      <div id="filters-panel" hidden>Panel de filtros contraido para el ejemplo.</div>
    </div>
  `,
};

export const WithIcons: Story = {
  render: () => html`
    <div class="iv-storybook-panel">
      <p class="iv-storybook-panel__eyebrow">Composicion</p>
      <h2 class="iv-storybook-panel__title">Iconos decorativos dentro del boton</h2>
      <p class="iv-storybook-panel__description">
        Usa <code>iv-icon</code> dentro del slot. Si el boton solo muestra icono, el nombre accesible va en
        <code>label</code> de <code>iv-button</code>.
      </p>
      <div class="iv-storybook-actions">
        <iv-button>
          <iv-icon name="check"></iv-icon>
          Guardar
        </iv-button>
        <iv-button variant="secondary">
          Mas opciones
          <iv-icon name="chevron-down"></iv-icon>
        </iv-button>
        <iv-button href="/storybook/" target="_blank" variant="ghost">
          Storybook (nueva pestana)
          <iv-icon name="external-link"></iv-icon>
        </iv-button>
        <iv-button label="Cerrar" variant="ghost">
          <iv-icon name="close"></iv-icon>
        </iv-button>
        <iv-button disabled>
          <iv-icon name="warning"></iv-icon>
          No disponible
        </iv-button>
      </div>
    </div>
  `,
};

export const VersionsComparison: Story = {
  name: 'Versions',
  parameters: {
    docs: {
      description: {
        story: 'Compara versiones CDN de iv-button mediante iframes aislados para evitar registrar el mismo custom element dos veces.',
      },
    },
    layout: 'fullscreen',
  },
  render: () => renderVersionFrame('/demos/atoms/button-versions.html', 'Button versions comparison'),
};

export const Version001: Story = {
  name: 'Version 0.0.1',
  parameters: {
    docs: {
      description: {
        story: 'Carga el bundle historico /components/iv-button/0.0.1/build/iv-button.esm.js dentro de una demo aislada.',
      },
    },
    layout: 'fullscreen',
  },
  render: () => renderVersionFrame('/demos/atoms/button-001.html', 'Button 0.0.1 demo'),
};

export const Version002: Story = {
  name: 'Version 0.0.2',
  parameters: {
    docs: {
      description: {
        story: 'Carga el bundle actual /components/iv-button/0.0.2/build/iv-button.esm.js, incluyendo variant="danger".',
      },
    },
    layout: 'fullscreen',
  },
  render: () => renderVersionFrame('/demos/atoms/button-002.html', 'Button 0.0.2 demo'),
};
