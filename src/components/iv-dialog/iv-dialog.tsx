import { Component, Event, EventEmitter, Host, Listen, Method, Prop, Watch, h } from '@stencil/core';
import dialogPolyfill from 'dialog-polyfill';

@Component({
  tag: 'iv-dialog',
  styleUrl: 'iv-dialog.css',
  shadow: false,
})
export class IvDialog {
  private dialogElement?: HTMLDialogElement;
  private previouslyFocusedElement?: HTMLElement;

  /** Controla si el dialog esta abierto. */
  @Prop({ mutable: true, reflect: true }) open = false;

  /** Usa `showModal()` cuando esta activo y `show()` cuando esta desactivado. */
  @Prop({ mutable: true }) modal = true;

  /** Rol ARIA aplicado al dialog nativo. Usa `alertdialog` para confirmaciones críticas. */
  @Prop({ attribute: 'dialog-role' }) dialogRole: 'dialog' | 'alertdialog' = 'dialog';

  /** Permite cerrar haciendo click en el backdrop del dialog modal. */
  @Prop() closeOnBackdrop = true;

  /** Permite cerrar con la tecla Escape usando el evento `cancel` nativo. */
  @Prop() closeOnEscape = true;

  /** Valor opcional devuelto por el dialog al cerrar. */
  @Prop({ mutable: true }) returnValue = '';

  /** Selector CSS del elemento que debe recibir foco inicial al abrir. Si no se informa, se respeta el comportamiento nativo/autofocus. */
  @Prop() initialFocus?: string;

  /** Devuelve el foco al invocador al cerrar. Desactivado por defecto para evitar falsos focos en mobile/AT. */
  @Prop({ attribute: 'restore-focus' }) restoreFocus = false;

  /** Nombre accesible cuando no hay un titulo visible asociado. */
  @Prop({ attribute: 'aria-label' }) ariaLabel?: string;

  /** Referencia al elemento que etiqueta el dialog. */
  @Prop({ attribute: 'aria-labelledby' }) ariaLabelledby?: string;

  /** Referencia al elemento que describe el dialog. */
  @Prop({ attribute: 'aria-describedby' }) ariaDescribedby?: string;

  /** Se emite cuando el dialog se abre mediante la API nativa. */
  @Event() ivOpen!: EventEmitter<void>;

  /** Se emite cuando el dialog se cierra mediante la API nativa. */
  @Event() ivClose!: EventEmitter<{ returnValue: string }>;

  /** Se emite cuando el dialog recibe el evento nativo `cancel`. */
  @Event() ivCancel!: EventEmitter<void>;

  @Watch('open')
  protected handleOpenChange() {
    this.syncDialogState();
  }

  componentDidLoad() {
    this.registerDialogPolyfill();
    this.syncDialogState();
  }

  /** Abre el dialog usando `show()` nativo. */
  @Method()
  async show() {
    this.modal = false;
    this.open = true;
    this.syncDialogState();
  }

  /** Abre el dialog usando `showModal()` nativo. */
  @Method()
  async showModal() {
    this.modal = true;
    this.open = true;
    this.syncDialogState();
  }

  /** Cierra el dialog usando `close()` nativo. */
  @Method()
  async close(returnValue = '') {
    this.returnValue = returnValue;

    if (this.dialogElement?.open) {
      this.dialogElement.close(returnValue);
      return;
    }

    this.open = false;
  }

  private get accessibilityAttributes() {
    return {
      'aria-label': this.ariaLabel,
      'aria-labelledby': this.ariaLabelledby,
      'aria-describedby': this.ariaDescribedby,
      'aria-modal': this.modal ? 'true' : undefined,
      role: this.dialogRole,
    };
  }

  private registerDialogPolyfill() {
    if (!this.dialogElement || 'showModal' in this.dialogElement) {
      return;
    }

    dialogPolyfill.registerDialog(this.dialogElement);
  }

  private syncDialogState() {
    if (!this.dialogElement) {
      return;
    }

    if (this.open && !this.dialogElement.open) {
      this.openNativeDialog();
      return;
    }

    if (!this.open && this.dialogElement.open) {
      this.dialogElement.close(this.returnValue);
    }
  }

  private openNativeDialog() {
    if (!this.dialogElement) {
      return;
    }

    this.previouslyFocusedElement = document.activeElement instanceof HTMLElement ? document.activeElement : undefined;

    if (this.modal) {
      this.dialogElement.showModal();
    } else {
      this.dialogElement.show();
    }

    this.applyInitialFocus();

    this.ivOpen.emit();
  }

  private applyInitialFocus() {
    if (!this.dialogElement || !this.initialFocus) {
      return;
    }

    const focusTarget = this.dialogElement.querySelector<HTMLElement>(this.initialFocus);

    focusTarget?.focus();
  }

  @Listen('cancel', { capture: true })
  protected handleCancel(event: Event) {
    if (event.target !== this.dialogElement) {
      return;
    }

    this.ivCancel.emit();

    if (!this.closeOnEscape) {
      event.preventDefault();
    }
  }

  @Listen('close', { capture: true })
  protected handleClose(event: Event) {
    if (event.target !== this.dialogElement) {
      return;
    }

    const returnValue = this.dialogElement?.returnValue || '';

    this.returnValue = returnValue;
    this.open = false;
    this.restoreFocusToInvoker();
    this.ivClose.emit({ returnValue });
  }

  private restoreFocusToInvoker() {
    if (!this.restoreFocus || !this.previouslyFocusedElement?.isConnected) {
      this.previouslyFocusedElement = undefined;
      return;
    }

    this.previouslyFocusedElement.focus();
    this.previouslyFocusedElement = undefined;
  }

  @Listen('click')
  protected handleDialogClick(event: MouseEvent) {
    if (!this.modal || !this.closeOnBackdrop || event.target !== this.dialogElement) {
      return;
    }

    const rect = this.dialogElement.getBoundingClientRect();
    const isBackdropClick = event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom;

    if (isBackdropClick) {
      this.dialogElement.close();
    }
  }

  render() {
    return (
      <Host>
        <dialog
          class="iv-dialog"
          ref={element => (this.dialogElement = element)}
          {...this.accessibilityAttributes}
        >
          <div class="iv-dialog__surface">
            <div class="iv-dialog__header">
              <slot name="header" />
            </div>
            <div class="iv-dialog__body">
              <slot />
            </div>
            <div class="iv-dialog__footer">
              <slot name="footer" />
            </div>
          </div>
        </dialog>
      </Host>
    );
  }
}
