import { Component, Event, EventEmitter, Host, Method, Prop, Watch, h } from '@stencil/core';

@Component({
  tag: 'iv-dialog',
  styleUrl: 'iv-dialog.css',
  shadow: false,
})
export class IvDialog {
  private dialogElement?: HTMLDialogElement;

  /** Controla si el dialog esta abierto. */
  @Prop({ mutable: true, reflect: true }) open = false;

  /** Usa `showModal()` cuando esta activo y `show()` cuando esta desactivado. */
  @Prop({ mutable: true }) modal = true;

  /** Permite cerrar haciendo click en el backdrop del dialog modal. */
  @Prop() closeOnBackdrop = true;

  /** Permite cerrar con la tecla Escape usando el evento `cancel` nativo. */
  @Prop() closeOnEscape = true;

  /** Valor opcional devuelto por el dialog al cerrar. */
  @Prop({ mutable: true }) returnValue = '';

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
    };
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

    if (this.modal) {
      this.dialogElement.showModal();
    } else {
      this.dialogElement.show();
    }

    this.ivOpen.emit();
  }

  private handleCancel = (event: Event) => {
    this.ivCancel.emit();

    if (!this.closeOnEscape) {
      event.preventDefault();
    }
  };

  private handleClose = () => {
    const returnValue = this.dialogElement?.returnValue || '';

    this.returnValue = returnValue;
    this.open = false;
    this.ivClose.emit({ returnValue });
  };

  private handleDialogClick = (event: MouseEvent) => {
    if (!this.modal || !this.closeOnBackdrop || event.target !== this.dialogElement) {
      return;
    }

    const rect = this.dialogElement.getBoundingClientRect();
    const isBackdropClick = event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom;

    if (isBackdropClick) {
      this.dialogElement.close();
    }
  };

  render() {
    return (
      <Host>
        <dialog
          class="iv-dialog"
          ref={element => (this.dialogElement = element)}
          onCancel={this.handleCancel}
          onClose={this.handleClose}
          onClick={this.handleDialogClick}
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
