import { html } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components';

const meta: Meta = {
  title: 'Atoms/Textarea',
  component: 'iv-textarea',
  tags: ['autodocs', 'a11y'],
  parameters: {
    docs: {
      description: {
        component:
          'iv-textarea usa un <textarea> nativo interno con label visible conectado. Hint y error se asocian con aria-describedby, y el host no duplica atributos ARIA.',
      },
    },
  },
  argTypes: {
    label: { control: 'text' },
    textareaId: { control: 'text' },
    value: { control: 'text' },
    placeholder: { control: 'text' },
    hint: { control: 'text' },
    error: { control: 'text' },
    disabled: { control: 'boolean' },
    readonly: { control: 'boolean' },
    required: { control: 'boolean' },
    name: { control: 'text' },
    form: { control: 'text' },
    autocomplete: { control: 'text' },
    rows: { control: 'number' },
    maxLength: { control: 'number' },
    minLength: { control: 'number' },
    wrap: {
      control: 'select',
      options: ['', 'soft', 'hard', 'off'],
    },
  },
  args: {
    label: 'Mensaje',
    textareaId: '',
    value: '',
    placeholder: 'Escribe tu mensaje',
    hint: 'Incluye el contexto necesario para responderte.',
    error: '',
    disabled: false,
    readonly: false,
    required: false,
    name: 'message',
    form: '',
    autocomplete: 'off',
    rows: 4,
    maxLength: undefined,
    minLength: undefined,
    wrap: '',
  },
};

export default meta;

type Story = StoryObj;

export const Playground: Story = {
  render: ({ label, textareaId, value, placeholder, hint, error, disabled, readonly, required, name, form, autocomplete, rows, maxLength, minLength, wrap }) => html`
    <iv-textarea
      label=${label}
      textarea-id=${textareaId || undefined}
      value=${value}
      placeholder=${placeholder || undefined}
      hint=${hint || undefined}
      error=${error || undefined}
      ?disabled=${disabled}
      ?readonly=${readonly}
      ?required=${required}
      name=${name || undefined}
      form=${form || undefined}
      autocomplete=${autocomplete || undefined}
      rows=${rows}
      maxlength=${maxLength || undefined}
      minlength=${minLength || undefined}
      wrap=${wrap || undefined}
    ></iv-textarea>
  `,
};

export const FormStates: Story = {
  render: () => html`
    <div class="iv-storybook-panel">
      <p class="iv-storybook-panel__eyebrow">Form atom</p>
      <h2 class="iv-storybook-panel__title">Texto largo con descripcion accesible</h2>
      <p class="iv-storybook-panel__description">
        La etiqueta es visible y los textos de ayuda o error se anuncian desde el textarea nativo.
      </p>
      <div class="iv-storybook-grid">
        <iv-textarea label="Mensaje" placeholder="Escribe tu mensaje" hint="Maximo recomendado: 500 caracteres."></iv-textarea>
        <iv-textarea label="Descripcion" value="Contenido inicial" rows="5"></iv-textarea>
        <iv-textarea label="Motivo" value="Muy corto" error="Describe el motivo con mas detalle." required></iv-textarea>
        <iv-textarea label="Resumen interno" value="Solo lectura" readonly></iv-textarea>
        <iv-textarea label="Comentario bloqueado" value="No editable" disabled></iv-textarea>
      </div>
    </div>
  `,
};

export const NativeForm: Story = {
  render: () => html`
    <div class="iv-storybook-panel">
      <p class="iv-storybook-panel__eyebrow">Formularios</p>
      <h2 class="iv-storybook-panel__title">Participa en formularios HTML mediante el textarea nativo</h2>
      <form id="feedback-form" class="iv-storybook-grid">
        <iv-textarea label="Feedback" name="feedback" value="Me interesa probar el componente." rows="4"></iv-textarea>
        <iv-button type="submit">Enviar</iv-button>
      </form>
    </div>
  `,
};

export const Accessibility: Story = {
  render: () => html`
    <div class="iv-storybook-panel">
      <p class="iv-storybook-panel__eyebrow">Accesibilidad</p>
      <h2 class="iv-storybook-panel__title">Label, hint y error conectados al control nativo</h2>
      <iv-textarea
        label="Comentario"
        value="Ok"
        hint="Escribe al menos una frase completa."
        error="El comentario es demasiado corto."
        required
      ></iv-textarea>
    </div>
  `,
};
