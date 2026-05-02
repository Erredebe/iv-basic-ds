import { Component, Host, Prop, h } from '@stencil/core';

@Component({
  tag: 'iv-button',
  styleUrl: 'iv-button.css',
  shadow: false,
})
export class IvButton {
  /** Variante visual del boton. */
  @Prop() variant: 'primary' | 'secondary' | 'ghost' = 'primary';

  /** Deshabilita la interaccion del control. */
  @Prop({ reflect: true }) disabled = false;

  /** Si se informa, el componente renderiza un enlace. */
  @Prop() href?: string;

  render() {
    const className = `iv-button iv-button--${this.variant}`;

    if (this.href) {
      return (
        <Host>
          <a class={className} href={this.disabled ? undefined : this.href} aria-disabled={this.disabled ? 'true' : undefined}>
            <slot />
          </a>
        </Host>
      );
    }

    return (
      <Host>
        <button class={className} type="button" disabled={this.disabled}>
          <slot />
        </button>
      </Host>
    );
  }
}
