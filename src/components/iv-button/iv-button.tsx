import { Component, Host, Prop, h } from '@stencil/core';

@Component({
  tag: 'iv-button',
  styleUrl: 'iv-button.css',
  shadow: false,
})
export class IvButton {
  /** Variante visual del boton. */
  @Prop() variant: 'primary' | 'secondary' | 'ghost' = 'primary';

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
  @Prop({ attribute: 'aria-label' }) ariaLabel?: string;

  /** Referencia al elemento que etiqueta el control. */
  @Prop({ attribute: 'aria-labelledby' }) ariaLabelledby?: string;

  /** Referencia al elemento que describe el control. */
  @Prop({ attribute: 'aria-describedby' }) ariaDescribedby?: string;

  /** Identificador del elemento controlado por el boton. */
  @Prop({ attribute: 'aria-controls' }) ariaControls?: string;

  /** Estado expandido cuando el boton controla contenido desplegable. */
  @Prop({ attribute: 'aria-expanded' }) ariaExpanded?: boolean;

  /** Estado pulsado para botones tipo toggle. */
  @Prop({ attribute: 'aria-pressed' }) ariaPressed?: boolean | 'mixed';

  /** Indica si el boton abre un popup y de que tipo. */
  @Prop({ attribute: 'aria-haspopup' }) ariaHaspopup?: 'true' | 'menu' | 'listbox' | 'tree' | 'grid' | 'dialog';

  /** Marca un enlace como el item actual dentro de un conjunto. */
  @Prop({ attribute: 'aria-current' }) ariaCurrent?: 'page' | 'step' | 'location' | 'date' | 'time' | 'true' | 'false';

  private get accessibilityAttributes() {
    return {
      'aria-label': this.ariaLabel,
      'aria-labelledby': this.ariaLabelledby,
      'aria-describedby': this.ariaDescribedby,
      'aria-controls': this.ariaControls,
      'aria-expanded': this.toAriaValue(this.ariaExpanded),
      'aria-pressed': this.toAriaValue(this.ariaPressed),
      'aria-haspopup': this.ariaHaspopup,
      'aria-current': this.ariaCurrent,
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
