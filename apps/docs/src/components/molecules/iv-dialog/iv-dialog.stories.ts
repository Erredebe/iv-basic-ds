import { html } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components';

const meta: Meta = {
  title: 'Molecules/Dialog',
  component: 'iv-dialog',
  tags: ['autodocs', 'stable', 'a11y'],
  argTypes: {
    open: { control: 'boolean' },
    modal: { control: 'boolean' },
    dialogRole: {
      control: 'select',
      name: 'dialog-role',
      options: ['dialog', 'alertdialog'],
    },
    closeOnBackdrop: { control: 'boolean' },
    closeOnEscape: { control: 'boolean' },
    restoreFocus: { control: 'boolean', name: 'restore-focus' },
    label: { control: 'text' },
    labelledBy: { control: 'text', name: 'labelled-by' },
    describedBy: { control: 'text', name: 'described-by' },
  },
  args: {
    open: false,
    modal: true,
    dialogRole: 'dialog',
    closeOnBackdrop: true,
    closeOnEscape: true,
    restoreFocus: false,
    label: '',
    labelledBy: 'dialog-title',
    describedBy: 'dialog-description',
  },
};

export default meta;

type Story = StoryObj;
type DialogElement = HTMLElement & {
  close(returnValue?: string): Promise<void> | void;
  show(): Promise<void> | void;
  showModal(): Promise<void> | void;
};

const findStoryDialog = (trigger: HTMLElement) =>
  trigger.closest('.iv-storybook-panel')?.querySelector<DialogElement>('iv-dialog') || trigger.parentElement?.querySelector<DialogElement>('iv-dialog');

const openDialog = (event: Event) => {
  const dialog = findStoryDialog(event.currentTarget as HTMLElement);

  dialog?.showModal();
};

const closeDialog = (event: Event) => {
  const dialog = (event.currentTarget as HTMLElement).closest<DialogElement>('iv-dialog');

  dialog?.close();
};

const openNonModalDialog = (event: Event) => {
  const dialog = findStoryDialog(event.currentTarget as HTMLElement);

  dialog?.show();
};

export const Playground: Story = {
  render: ({ open, modal, dialogRole, closeOnBackdrop, closeOnEscape, restoreFocus, label, labelledBy, describedBy }) => html`
    <iv-button has-popup="dialog" @click=${openDialog}>Abrir dialog</iv-button>
    <iv-dialog
      id="playground-dialog"
      .open=${open}
      .modal=${modal}
      dialog-role=${dialogRole}
      .closeOnBackdrop=${closeOnBackdrop}
      .closeOnEscape=${closeOnEscape}
      .restoreFocus=${restoreFocus}
      label=${label || undefined}
      labelled-by=${labelledBy || undefined}
      described-by=${describedBy || undefined}
    >
      <h2 slot="header" id="dialog-title">Confirmar accion</h2>
      <p id="dialog-description">Este dialog usa el elemento nativo dialog y se abre con showModal().</p>
      <div slot="footer">
        <iv-dialog-close return-value="cancel">
          <iv-button variant="ghost">Cancelar</iv-button>
        </iv-dialog-close>
        <iv-dialog-close return-value="confirm">
          <iv-button>Confirmar</iv-button>
        </iv-dialog-close>
      </div>
    </iv-dialog>
  `,
};

export const CompanionCloseAction: Story = {
  render: () => html`
    <iv-button has-popup="dialog" @click=${openDialog}>Abrir accion companion</iv-button>
    <iv-dialog
      id="companion-close-dialog"
      labelled-by="companion-close-title"
      described-by="companion-close-description"
      @ivClose=${(event: CustomEvent<{ returnValue: string }>) => {
        const output = document.getElementById('companion-close-output');
        if (output) {
          output.textContent = event.detail.returnValue || 'sin valor';
        }
      }}
    >
      <h2 slot="header" id="companion-close-title">Cierre desacoplado</h2>
      <p id="companion-close-description">
        iv-dialog-close vive en el slot footer y solicita el cierre sin que iv-button ni el consumidor llamen manualmente a close().
      </p>
      <div slot="footer">
        <iv-dialog-close return-value="cancel">
          <iv-button variant="ghost">Cancelar</iv-button>
        </iv-dialog-close>
        <iv-dialog-close return-value="confirm">
          <iv-button>Confirmar</iv-button>
        </iv-dialog-close>
      </div>
    </iv-dialog>
    <p>Ultimo valor companion: <output id="companion-close-output">sin valor</output></p>
  `,
};

export const LabelledByTitle: Story = {
  render: () => html`
    <div class="iv-storybook-panel">
      <p class="iv-storybook-panel__eyebrow">Dialog accesible</p>
      <h2 class="iv-storybook-panel__title">Confirmaciones con nombre visible</h2>
      <p class="iv-storybook-panel__description">
        El titulo visible se conecta con el dialog mediante labelled-by. El foco automatico y la restauracion siguen siendo opt-in.
      </p>
      <div class="iv-storybook-actions">
        <iv-button has-popup="dialog" @click=${openDialog}>Abrir confirmacion</iv-button>
      </div>
      <iv-dialog id="basic-dialog" labelled-by="basic-dialog-title" described-by="basic-dialog-description">
        <h2 slot="header" id="basic-dialog-title">Eliminar elemento</h2>
        <p id="basic-dialog-description">Esta accion no se puede deshacer. Revisa la informacion antes de continuar.</p>
        <div slot="footer">
          <iv-button variant="ghost" @click=${closeDialog}>Cancelar</iv-button>
          <iv-button @click=${closeDialog}>Eliminar</iv-button>
        </div>
      </iv-dialog>
    </div>
  `,
};

export const LabelOnly: Story = {
  render: () => html`
    <iv-button has-popup="dialog" @click=${openDialog}>Abrir ayuda rapida</iv-button>
    <iv-dialog id="label-only-dialog" label="Ayuda rapida">
      <p>Este ejemplo usa label porque no hay titulo visible en el slot header.</p>
      <div slot="footer">
        <iv-button @click=${closeDialog}>Cerrar</iv-button>
      </div>
    </iv-dialog>
  `,
};

export const AlertDialog: Story = {
  render: () => html`
    <div class="iv-storybook-panel">
      <p class="iv-storybook-panel__eyebrow">Patron critico</p>
      <h2 class="iv-storybook-panel__title">Alertdialog solo para decisiones destructivas</h2>
      <p class="iv-storybook-panel__description">
        Usa dialog-role="alertdialog" cuando el contenido requiere atencion inmediata y una decision explicita.
      </p>
      <div class="iv-storybook-actions">
        <iv-button has-popup="dialog" @click=${openDialog}>Abrir alertdialog</iv-button>
      </div>
      <iv-dialog id="alert-dialog" dialog-role="alertdialog" labelled-by="alert-dialog-title" described-by="alert-dialog-description">
        <h2 slot="header" id="alert-dialog-title">Eliminar definitivamente</h2>
        <p id="alert-dialog-description">Esta accion elimina los datos de forma permanente y no se puede deshacer.</p>
        <div slot="footer">
          <iv-button variant="ghost" @click=${closeDialog}>Cancelar</iv-button>
          <iv-button @click=${closeDialog}>Eliminar definitivamente</iv-button>
        </div>
      </iv-dialog>
    </div>
  `,
};

export const PreventDismiss: Story = {
  render: () => html`
    <iv-button has-popup="dialog" @click=${openDialog}>Abrir sin cierre accidental</iv-button>
    <iv-dialog
      id="prevent-dismiss-dialog"
      .closeOnBackdrop=${false}
      .closeOnEscape=${false}
      labelled-by="prevent-dismiss-title"
      described-by="prevent-dismiss-description"
    >
      <h2 slot="header" id="prevent-dismiss-title">Revision obligatoria</h2>
      <p id="prevent-dismiss-description">Este dialog no se cierra con Escape ni con click en el backdrop. Usa una accion explicita.</p>
      <div slot="footer">
        <iv-button @click=${closeDialog}>Entendido</iv-button>
      </div>
    </iv-dialog>
  `,
};

export const NonModal: Story = {
  render: () => html`
    <iv-button has-popup="dialog" @click=${openNonModalDialog}>Abrir dialog no modal</iv-button>
    <iv-dialog id="non-modal-dialog" .modal=${false} label="Informacion no modal">
      <p>Este ejemplo usa show() nativo y no bloquea la interaccion con el resto de la pagina.</p>
      <div slot="footer">
        <iv-button @click=${closeDialog}>Cerrar</iv-button>
      </div>
    </iv-dialog>
  `,
};

export const LongContent: Story = {
  render: () => html`
    <iv-button has-popup="dialog" @click=${openDialog}>Abrir contenido largo</iv-button>
    <iv-dialog id="long-dialog" labelled-by="long-dialog-title">
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

export const NativeFormClose: Story = {
  render: () => html`
    <iv-button has-popup="dialog" @click=${openDialog}>Abrir formulario nativo</iv-button>
    <iv-dialog id="form-dialog" labelled-by="form-dialog-title" described-by="form-dialog-description">
      <h2 slot="header" id="form-dialog-title">Selecciona una opcion</h2>
      <p id="form-dialog-description">El formulario usa method="dialog" para cerrar con la API nativa del elemento dialog.</p>
      <form method="dialog">
        <label>
          Preferencia
          <select name="preference">
            <option value="email">Email</option>
            <option value="sms">SMS</option>
            <option value="phone">Telefono</option>
          </select>
        </label>
        <div class="iv-demo__stack iv-demo__stack--end" style="margin-top: var(--iv-space-lg);">
          <iv-button type="submit" value="cancel" variant="ghost">Cancelar</iv-button>
          <iv-button type="submit" value="save">Guardar</iv-button>
        </div>
      </form>
    </iv-dialog>
  `,
};

export const ReturnValue: Story = {
  render: () => html`
    <iv-button has-popup="dialog" @click=${openDialog}>Abrir con returnValue</iv-button>
    <iv-dialog
      id="return-value-dialog"
      labelled-by="return-value-title"
      described-by="return-value-description"
      @ivClose=${(event: CustomEvent<{ returnValue: string }>) => {
        const output = document.getElementById('return-value-output');
        if (output) {
          output.textContent = event.detail.returnValue || 'sin valor';
        }
      }}
    >
      <h2 slot="header" id="return-value-title">Decision con valor de cierre</h2>
      <p id="return-value-description">Cada accion cierra el dialog con un returnValue distinto.</p>
      <div slot="footer">
        <iv-dialog-close return-value="cancel">
          <iv-button variant="ghost">Cancelar</iv-button>
        </iv-dialog-close>
        <iv-dialog-close return-value="confirm">
          <iv-button>Confirmar</iv-button>
        </iv-dialog-close>
      </div>
    </iv-dialog>
    <p>Ultimo valor: <output id="return-value-output">sin valor</output></p>
  `,
};

export const InitialFocusOptIn: Story = {
  render: () => html`
    <iv-button has-popup="dialog" @click=${openDialog}>Abrir con foco inicial opt-in</iv-button>
    <iv-dialog id="initial-focus-dialog" initial-focus="#safe-action" labelled-by="initial-focus-title" described-by="initial-focus-description">
      <h2 slot="header" id="initial-focus-title">Foco inicial explicito</h2>
      <p id="initial-focus-description">Este ejemplo fuerza el foco solo porque initial-focus se ha configurado expresamente.</p>
      <div slot="footer">
        <iv-button variant="ghost" @click=${closeDialog}>Cancelar</iv-button>
        <iv-button id="safe-action" @click=${closeDialog}>Continuar</iv-button>
      </div>
    </iv-dialog>
  `,
};

export const RestoreFocusOptIn: Story = {
  render: () => html`
    <iv-button has-popup="dialog" @click=${openDialog}>Abrir con restore-focus</iv-button>
    <iv-dialog id="restore-focus-dialog" restore-focus labelled-by="restore-focus-title" described-by="restore-focus-description">
      <h2 slot="header" id="restore-focus-title">Restauracion de foco opt-in</h2>
      <p id="restore-focus-description">Al cerrar, el foco vuelve al invocador solo porque restore-focus esta activado.</p>
      <div slot="footer">
        <iv-button @click=${closeDialog}>Cerrar</iv-button>
      </div>
    </iv-dialog>
  `,
};

export const ComplexContentWithoutDescription: Story = {
  render: () => html`
    <iv-button has-popup="dialog" @click=${openDialog}>Abrir contenido complejo</iv-button>
    <iv-dialog id="complex-dialog" labelled-by="complex-dialog-title">
      <h2 slot="header" id="complex-dialog-title">Resumen de pedido</h2>
      <p>Este ejemplo omite described-by porque el contenido incluye estructura que conviene explorar por separado.</p>
      <ul>
        <li>Producto principal con configuracion avanzada.</li>
        <li>Servicio adicional renovable.</li>
        <li>Descuento aplicado durante el primer periodo.</li>
      </ul>
      <div slot="footer">
        <iv-button variant="ghost" @click=${closeDialog}>Revisar despues</iv-button>
        <iv-button @click=${closeDialog}>Aceptar pedido</iv-button>
      </div>
    </iv-dialog>
  `,
};
