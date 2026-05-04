import { html } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components';

const meta: Meta = {
  title: 'Atoms/Input',
  component: 'iv-input',
  tags: ['autodocs', 'a11y'],
  parameters: {
    docs: {
      description: {
        component:
          'iv-input usa un <input> nativo interno con label visible conectado. Hint y error se asocian con aria-describedby, y el host no duplica atributos ARIA.',
      },
    },
  },
  argTypes: {
    label: { control: 'text' },
    value: { control: 'text' },
    type: {
      control: 'select',
      options: ['text', 'email', 'password', 'search', 'tel', 'url'],
    },
    placeholder: { control: 'text' },
    inputId: { control: 'text' },
    hint: { control: 'text' },
    error: { control: 'text' },
    disabled: { control: 'boolean' },
    readonly: { control: 'boolean' },
    required: { control: 'boolean' },
    name: { control: 'text' },
    form: { control: 'text' },
    autocomplete: { control: 'text' },
    inputMode: { control: 'text' },
  },
  args: {
    label: 'Email',
    value: '',
    type: 'email',
    placeholder: 'nombre@empresa.com',
    inputId: '',
    hint: 'Usa tu correo corporativo.',
    error: '',
    disabled: false,
    readonly: false,
    required: false,
    name: 'email',
    form: '',
    autocomplete: 'email',
    inputMode: '',
  },
};

export default meta;

type Story = StoryObj;

export const Playground: Story = {
  render: ({ label, value, type, placeholder, inputId, hint, error, disabled, readonly, required, name, form, autocomplete, inputMode }) => html`
    <iv-input
      label=${label}
      value=${value}
      type=${type}
      placeholder=${placeholder || undefined}
      input-id=${inputId || undefined}
      hint=${hint || undefined}
      error=${error || undefined}
      ?disabled=${disabled}
      ?readonly=${readonly}
      ?required=${required}
      name=${name || undefined}
      form=${form || undefined}
      autocomplete=${autocomplete || undefined}
      inputmode=${inputMode || undefined}
    ></iv-input>
  `,
};

export const FormStates: Story = {
  render: () => html`
    <div class="iv-storybook-panel">
      <p class="iv-storybook-panel__eyebrow">Form atom</p>
      <h2 class="iv-storybook-panel__title">Campos nativos con descripcion accesible</h2>
      <p class="iv-storybook-panel__description">
        La etiqueta es visible y los textos de ayuda o error se anuncian desde el input nativo.
      </p>
      <div class="iv-storybook-grid">
        <iv-input label="Nombre" placeholder="Ada Lovelace" autocomplete="name"></iv-input>
        <iv-input label="Email" type="email" hint="Usa tu correo corporativo." autocomplete="email"></iv-input>
        <iv-input label="Contrasena" type="password" required hint="Minimo 8 caracteres."></iv-input>
        <iv-input label="Usuario" value="ada" error="Este usuario ya existe."></iv-input>
        <iv-input label="ID interno" value="USR-1024" readonly></iv-input>
        <iv-input label="Codigo bloqueado" value="LOCKED" disabled></iv-input>
      </div>
    </div>
  `,
};

export const NativeForm: Story = {
  render: () => html`
    <div class="iv-storybook-panel">
      <p class="iv-storybook-panel__eyebrow">Formularios</p>
      <h2 class="iv-storybook-panel__title">Participa en formularios HTML mediante el input nativo</h2>
      <form id="profile-form" class="iv-storybook-grid">
        <iv-input label="Nombre" name="profileName" value="Ada" autocomplete="name"></iv-input>
        <iv-input label="Email" type="email" name="profileEmail" value="ada@example.com" autocomplete="email"></iv-input>
        <iv-button type="submit">Enviar</iv-button>
      </form>
    </div>
  `,
};

export const SearchField: Story = {
  render: () => html`
    <div class="iv-storybook-panel">
      <p class="iv-storybook-panel__eyebrow">Busqueda</p>
      <h2 class="iv-storybook-panel__title">Input search con teclado nativo</h2>
      <iv-input label="Buscar componentes" type="search" placeholder="Button, dialog, input" autocomplete="off"></iv-input>
    </div>
  `,
};

export const Accessibility: Story = {
  render: () => html`
    <div class="iv-storybook-panel">
      <p class="iv-storybook-panel__eyebrow">Accesibilidad</p>
      <h2 class="iv-storybook-panel__title">Label, hint y error conectados al control nativo</h2>
      <iv-input
        label="Email"
        type="email"
        value="ada"
        hint="Usa el formato nombre@empresa.com."
        error="Introduce un email valido."
        required
      ></iv-input>
    </div>
  `,
};
