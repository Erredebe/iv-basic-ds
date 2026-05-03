import { Component, Event, EventEmitter, Host, Prop, h } from '@stencil/core';

let inputId = 0;

@Component({
  tag: 'iv-input',
  styleUrl: 'iv-input.css',
  shadow: false,
})
export class IvInput {
  private readonly fallbackInputId = `iv-input-${++inputId}`;

  /** Etiqueta visible del campo. */
  @Prop({ reflect: true }) label!: string;

  /** Identificador estable del input nativo interno. */
  @Prop({ attribute: 'input-id' }) inputId?: string;

  /** Valor actual del input. */
  @Prop({ mutable: true }) value = '';

  /** Tipo nativo del input. */
  @Prop() type: 'text' | 'email' | 'password' | 'search' | 'tel' | 'url' = 'text';

  /** Texto auxiliar cuando el campo esta vacio. */
  @Prop() placeholder?: string;

  /** Ayuda visible asociada al campo. */
  @Prop() hint?: string;

  /** Mensaje de error visible asociado al campo. */
  @Prop() error?: string;

  /** Deshabilita la interaccion del campo. */
  @Prop({ reflect: true }) disabled = false;

  /** Evita editar el valor sin deshabilitar el foco. */
  @Prop({ reflect: true }) readonly = false;

  /** Marca el campo como requerido. */
  @Prop({ reflect: true }) required = false;

  /** Nombre nativo enviado en formularios. */
  @Prop() name?: string;

  /** Identificador de formulario asociado cuando el input vive fuera del form. */
  @Prop() form?: string;

  /** Sugerencia nativa de autocompletado. */
  @Prop() autocomplete?: string;

  /** Sugerencia nativa de teclado virtual. */
  @Prop({ attribute: 'inputmode' }) inputMode?: string;

  /** Se emite cuando cambia el valor desde el input nativo. */
  @Event() valueChange!: EventEmitter<string>;

  private get controlId() {
    return this.inputId || this.fallbackInputId;
  }

  private get hintId() {
    return `${this.controlId}-hint`;
  }

  private get errorId() {
    return `${this.controlId}-error`;
  }

  private get describedBy() {
    return [this.hint ? this.hintId : undefined, this.error ? this.errorId : undefined].filter(Boolean).join(' ') || undefined;
  }

  private handleInput = (event: InputEvent) => {
    this.value = (event.target as HTMLInputElement).value;
    this.valueChange.emit(this.value);
  };

  render() {
    const hasError = Boolean(this.error);

    return (
      <Host>
        <div class={{ 'iv-input': true, 'iv-input--invalid': hasError, 'iv-input--disabled': this.disabled }}>
          <label class="iv-input__label" htmlFor={this.controlId}>
            {this.label}
            {this.required ? <span class="iv-input__required" aria-hidden="true">*</span> : undefined}
          </label>
          <input
            id={this.controlId}
            class="iv-input__control"
            type={this.type}
            value={this.value}
            name={this.name}
            form={this.form}
            placeholder={this.placeholder}
            autocomplete={this.autocomplete}
            inputMode={this.inputMode}
            disabled={this.disabled}
            readOnly={this.readonly}
            required={this.required}
            aria-describedby={this.describedBy}
            aria-invalid={hasError ? 'true' : undefined}
            onInput={this.handleInput}
          />
          {this.hint ? (
            <p id={this.hintId} class="iv-input__hint">
              {this.hint}
            </p>
          ) : undefined}
          {this.error ? (
            <p id={this.errorId} class="iv-input__error">
              {this.error}
            </p>
          ) : undefined}
        </div>
      </Host>
    );
  }
}
