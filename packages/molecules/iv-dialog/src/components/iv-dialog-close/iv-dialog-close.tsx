import { Component, Event, EventEmitter, Host, Listen, Prop, h } from '@stencil/core';

export type IvDialogCloseRequestDetail = {
  returnValue: string;
};

@Component({
  tag: 'iv-dialog-close',
  styleUrl: 'iv-dialog-close.css',
  shadow: false,
})
export class IvDialogClose {
  /** Valor enviado al dialog cuando se solicita el cierre. */
  @Prop({ attribute: 'return-value' }) returnValue = '';

  /** Se emite cuando el contenido slotted solicita cerrar el dialog ancestro. */
  @Event({ bubbles: true, cancelable: true, composed: true }) ivDialogCloseRequest!: EventEmitter<IvDialogCloseRequestDetail>;

  @Listen('click')
  protected handleClick(event: MouseEvent) {
    if (event.defaultPrevented) {
      return;
    }

    const closeRequest = this.ivDialogCloseRequest.emit({ returnValue: this.returnValue });

    if (closeRequest.defaultPrevented) {
      event.preventDefault();
    }
  }

  render() {
    return (
      <Host>
        <slot />
      </Host>
    );
  }
}
