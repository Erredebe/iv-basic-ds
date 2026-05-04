import { Component, Host, Prop, h } from '@stencil/core';

@Component({
  tag: 'iv-button',
  styleUrl: 'iv-button.css',
  shadow: false,
})
export class IvButton {
  /** Variante visual del boton. */
  @Prop() variant: 'primary' | 'secondary' | 'ghost' | 'danger' = 'primary';

  /** Tipo nativo del boton cuando no se renderiza como enlace. */
  @Prop() type: 'button' | 'submit' | 'reset' = 'button';

  /** Deshabilita la interaccion del control. */
  @Prop({ reflect: true }) disabled = false;

  /** Si se informa, el componente renderiza un enlace. */
  @Prop() href?: string;

  /** Destino del enlace cuando se usa `href`. */
  @Prop() target?: '_self' | '_blank' | '_parent' | '_top';

  /** Relacion del enlace cuando se usa `href`. */
  @Prop() rel?: string;

  /** Nombre accesible cuando el contenido visible no describe suficientemente la accion. */
  @Prop({ reflect: true }) label?: string;

  /** Referencia al elemento que etiqueta el control. */
  @Prop({ attribute: 'labelled-by', reflect: true }) labelledBy?: string;

  /** Referencia al elemento que describe el control. */
  @Prop({ attribute: 'described-by', reflect: true }) describedBy?: string;

  /** Identificador del elemento controlado por el boton. */
  @Prop({ reflect: true }) controls?: string;

  /** Estado expandido cuando el boton controla contenido desplegable. */
  @Prop({ reflect: true }) expanded?: boolean;

  /** Estado pulsado para botones tipo toggle. */
  @Prop({ reflect: true }) pressed?: boolean | 'mixed';

  /** Indica si el boton abre un popup y de que tipo. */
  @Prop({ attribute: 'has-popup', reflect: true }) hasPopup?: 'true' | 'menu' | 'listbox' | 'tree' | 'grid' | 'dialog';

  /** Marca un enlace como el item actual dentro de un conjunto. */
  @Prop({ reflect: true }) current?: 'page' | 'step' | 'location' | 'date' | 'time' | 'true' | 'false';

  private get accessibilityAttributes() {
    return {
      'aria-label': this.label,
      'aria-labelledby': this.labelledBy,
      'aria-describedby': this.describedBy,
      'aria-controls': this.controls,
      'aria-expanded': this.toAriaValue(this.expanded),
      'aria-pressed': this.toAriaValue(this.pressed),
      'aria-haspopup': this.hasPopup,
      'aria-current': this.current,
    };
  }

  private toAriaValue(value?: boolean | string) {
    return value === undefined ? undefined : String(value);
  }

  private handleLinkClick = (event: MouseEvent) => {
    if (!this.disabled) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();
  };

  private renderLink(className: string) {
    return (
      <a
        class={className}
        href={this.disabled ? undefined : this.href}
        target={this.target}
        rel={this.rel || (this.target === '_blank' ? 'noreferrer' : undefined)}
        aria-disabled={this.disabled ? 'true' : undefined}
        tabIndex={this.disabled ? -1 : undefined}
        onClick={this.handleLinkClick}
        {...this.accessibilityAttributes}
      >
        <slot />
      </a>
    );
  }

  private renderButton(className: string) {
    return (
      <button class={className} type={this.type} disabled={this.disabled} {...this.accessibilityAttributes}>
        <slot />
      </button>
    );
  }

  render() {
    const className = `iv-button iv-button--${this.variant}`;

    return (
      <Host>
        {this.href ? this.renderLink(className) : this.renderButton(className)}
      </Host>
    );
  }
}
