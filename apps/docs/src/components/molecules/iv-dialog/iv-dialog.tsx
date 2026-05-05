import { Component, Event, EventEmitter, Host, Listen, Method, Prop, State, Watch, h } from '@stencil/core';
import dialogPolyfill from 'dialog-polyfill';

const focusableSelector = [
  'button:not(:disabled)',
  'a[href]:not([aria-disabled="true"])',
  'input:not(:disabled)',
  'select:not(:disabled)',
  'textarea:not(:disabled)',
  '[tabindex]:not([tabindex="-1"]):not([aria-disabled="true"])',
].join(',');

@Component({
  tag: 'iv-dialog',
  styleUrl: 'iv-dialog.css',
  shadow: false,
})
export class IvDialog {
  private dialogElement?: HTMLDialogElement;
  private previouslyFocusedElement?: HTMLElement;
  private suppressNextCloseEvent = false;

  @State() private activeModal?: boolean;

  /** Controla si el dialog esta abierto. */
  @Prop({ mutable: true, reflect: true }) open = false;

  /** Usa `showModal()` cuando esta activo y `show()` cuando esta desactivado. */
  @Prop({ mutable: true, reflect: true }) modal = true;

  /** Rol ARIA aplicado al dialog nativo. Usa `alertdialog` para confirmaciones críticas. */
  @Prop({ attribute: 'dialog-role', reflect: true }) dialogRole: 'dialog' | 'alertdialog' = 'dialog';

  /** Permite cerrar haciendo click en el backdrop del dialog modal. */
  @Prop({ reflect: true }) closeOnBackdrop = true;

  /** Permite cerrar con la tecla Escape usando el evento `cancel` nativo. */
  @Prop({ reflect: true }) closeOnEscape = true;

  /** Valor opcional devuelto por el dialog al cerrar. */
  @Prop({ attribute: 'return-value', mutable: true, reflect: true }) returnValue = '';

  /** Selector CSS del elemento que debe recibir foco inicial al abrir. Si no se informa, se respeta el comportamiento nativo/autofocus. */
  @Prop({ attribute: 'initial-focus', reflect: true }) initialFocus?: string;

  /** Devuelve el foco al invocador al cerrar. Desactivado por defecto para evitar falsos focos en mobile/AT. */
  @Prop({ attribute: 'restore-focus', reflect: true }) restoreFocus = false;

  /** Nombre accesible aplicado al dialog nativo cuando no hay un titulo visible asociado. */
  @Prop({ reflect: true }) label?: string;

  /** Referencia al elemento que etiqueta el dialog nativo. */
  @Prop({ attribute: 'labelled-by', reflect: true }) labelledBy?: string;

  /** Referencia al elemento que describe el dialog nativo. */
  @Prop({ attribute: 'described-by', reflect: true }) describedBy?: string;

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

  @Watch('modal')
  protected handleModalChange() {
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
      'aria-label': this.label,
      'aria-labelledby': this.labelledBy,
      'aria-describedby': this.describedBy,
      'aria-modal': (this.activeModal ?? this.modal) ? 'true' : undefined,
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

    if (this.open && this.dialogElement.open) {
      if (this.activeModal !== this.modal) {
        this.reopenNativeDialog();
      }

      return;
    }

    if (!this.open && this.dialogElement.open) {
      this.dialogElement.close(this.returnValue);
    }
  }

  private reopenNativeDialog() {
    if (!this.dialogElement) {
      return;
    }

    this.suppressNextCloseEvent = true;
    this.dialogElement.close(this.returnValue);
    this.openNativeDialog(true);
  }

  private openNativeDialog(preservePreviouslyFocusedElement = false) {
    if (!this.dialogElement) {
      return;
    }

    if (!preservePreviouslyFocusedElement) {
      this.previouslyFocusedElement = document.activeElement instanceof HTMLElement ? document.activeElement : undefined;
    }

    const openAsModal = this.modal;

    if (openAsModal) {
      this.dialogElement.showModal();
    } else {
      this.dialogElement.show();
    }

    this.activeModal = openAsModal;
    this.syncAriaModalAttribute(openAsModal);
    this.warnIfMissingAccessibleName();
    this.applyInitialFocus();

    this.ivOpen.emit();
  }

  private syncAriaModalAttribute(isModal: boolean) {
    if (isModal) {
      this.dialogElement?.setAttribute('aria-modal', 'true');
      return;
    }

    this.dialogElement?.removeAttribute('aria-modal');
  }

  private warnIfMissingAccessibleName() {
    if (this.label || this.labelledBy) {
      return;
    }

    console.warn('[iv-dialog] Provide label or labelled-by before opening so the native dialog has an accessible name.');
  }

  private applyInitialFocus() {
    if (!this.dialogElement || !this.initialFocus) {
      return;
    }

    const requestedTarget = this.dialogElement.querySelector<HTMLElement>(this.initialFocus);
    const focusTarget = this.getFocusableTarget(requestedTarget);

    focusTarget?.focus();
  }

  private getFocusableTarget(element?: HTMLElement | null) {
    if (!element) {
      return undefined;
    }

    if (this.isFocusable(element)) {
      return element;
    }

    return Array.from(element.querySelectorAll<HTMLElement>(focusableSelector)).find(child => this.isFocusable(child));
  }

  private isFocusable(element: HTMLElement) {
    if (element.hidden || element.hasAttribute('disabled') || element.getAttribute('aria-disabled') === 'true') {
      return false;
    }

    const style = globalThis.getComputedStyle?.(element);

    if (style && (style.display === 'none' || style.visibility === 'hidden')) {
      return false;
    }

    if (element.hasAttribute('tabindex')) {
      return element.tabIndex >= -1;
    }

    const tagName = element.tagName.toLowerCase();

    if (tagName === 'a' || tagName === 'area') {
      return element.hasAttribute('href');
    }

    return ['button', 'input', 'select', 'textarea', 'summary'].includes(tagName) || element.isContentEditable;
  }

  @Listen('cancel', { capture: true })
  protected handleCancel(event: Event) {
    if (event.target !== this.dialogElement) {
      return;
    }

    if (!this.closeOnEscape) {
      event.preventDefault();
    }

    this.ivCancel.emit();
  }

  @Listen('keydown', { capture: true })
  protected handleKeyDown(event: KeyboardEvent) {
    if (event.key !== 'Escape' || this.closeOnEscape || !this.dialogElement?.open) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();
  }

  @Listen('close', { capture: true })
  protected handleClose(event: Event) {
    if (event.target !== this.dialogElement) {
      return;
    }

    if (this.suppressNextCloseEvent) {
      this.suppressNextCloseEvent = false;
      return;
    }

    const returnValue = this.dialogElement?.returnValue || '';

    this.activeModal = undefined;
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
    if (!(this.activeModal ?? this.modal) || !this.closeOnBackdrop || event.target !== this.dialogElement) {
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
