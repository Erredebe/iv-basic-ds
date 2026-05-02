import { html } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components';

const meta: Meta = {
  title: 'Components/Dialog',
  component: 'iv-dialog',
  argTypes: {
    open: { control: 'boolean' },
    modal: { control: 'boolean' },
    closeOnBackdrop: { control: 'boolean' },
    closeOnEscape: { control: 'boolean' },
    ariaLabelledby: { control: 'text', name: 'aria-labelledby' },
    ariaDescribedby: { control: 'text', name: 'aria-describedby' },
  },
  args: {
    open: false,
    modal: true,
    closeOnBackdrop: true,
    closeOnEscape: true,
    ariaLabelledby: 'dialog-title',
    ariaDescribedby: 'dialog-description',
  },
};

export default meta;

type Story = StoryObj;

const openDialog = (event: Event) => {
  const dialog = (event.currentTarget as HTMLElement).parentElement?.querySelector('iv-dialog');
  void (dialog as any)?.showModal();
};

const closeDialog = (event: Event) => {
  const dialog = (event.currentTarget as HTMLElement).closest('iv-dialog');
  void (dialog as any)?.close();
};

export const Playground: Story = {
  render: ({ open, modal, closeOnBackdrop, closeOnEscape, ariaLabelledby, ariaDescribedby }) => html`
    <iv-button aria-haspopup="dialog" aria-controls="playground-dialog" @click=${openDialog}>Abrir dialog</iv-button>
    <iv-dialog
      id="playground-dialog"
      .open=${open}
      .modal=${modal}
      .closeOnBackdrop=${closeOnBackdrop}
      .closeOnEscape=${closeOnEscape}
      aria-labelledby=${ariaLabelledby || undefined}
      aria-describedby=${ariaDescribedby || undefined}
    >
      <h2 slot="header" id="dialog-title">Confirmar accion</h2>
      <p id="dialog-description">Este dialog usa el elemento nativo dialog y se abre con showModal().</p>
      <div slot="footer">
        <iv-button variant="ghost" @click=${closeDialog}>Cancelar</iv-button>
        <iv-button @click=${closeDialog}>Confirmar</iv-button>
      </div>
    </iv-dialog>
  `,
};

export const Basic: Story = {
  render: () => html`
    <iv-button aria-haspopup="dialog" aria-controls="basic-dialog" @click=${openDialog}>Abrir confirmacion</iv-button>
    <iv-dialog id="basic-dialog" aria-labelledby="basic-dialog-title" aria-describedby="basic-dialog-description">
      <h2 slot="header" id="basic-dialog-title">Eliminar elemento</h2>
      <p id="basic-dialog-description">Esta accion no se puede deshacer. Revisa la informacion antes de continuar.</p>
      <div slot="footer">
        <iv-button variant="ghost" @click=${closeDialog}>Cancelar</iv-button>
        <iv-button @click=${closeDialog}>Eliminar</iv-button>
      </div>
    </iv-dialog>
  `,
};

export const NonModal: Story = {
  render: () => html`
    <iv-button aria-haspopup="dialog" aria-controls="non-modal-dialog" @click=${(event: Event) => {
      const dialog = (event.currentTarget as HTMLElement).parentElement?.querySelector('iv-dialog');
      void (dialog as any)?.show();
    }}>Abrir dialog no modal</iv-button>
    <iv-dialog id="non-modal-dialog" .modal=${false} aria-label="Informacion no modal">
      <p>Este ejemplo usa show() nativo y no bloquea la interaccion con el resto de la pagina.</p>
      <div slot="footer">
        <iv-button @click=${closeDialog}>Cerrar</iv-button>
      </div>
    </iv-dialog>
  `,
};

export const LongContent: Story = {
  render: () => html`
    <iv-button aria-haspopup="dialog" aria-controls="long-dialog" @click=${openDialog}>Abrir contenido largo</iv-button>
    <iv-dialog id="long-dialog" aria-labelledby="long-dialog-title">
      <h2 slot="header" id="long-dialog-title">Terminos del servicio</h2>
      ${Array.from(
        { length: 8 },
        (_, index) => html`<p>Seccion ${index + 1}. El cuerpo del dialog mantiene scroll interno para conservar visibles las acciones.</p>`,
      )}
      <div slot="footer">
        <iv-button variant="ghost" @click=${closeDialog}>Cerrar</iv-button>
        <iv-button @click=${closeDialog}>Aceptar</iv-button>
      </div>
    </iv-dialog>
  `,
};
