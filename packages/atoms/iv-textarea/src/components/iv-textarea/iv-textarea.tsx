import { Component, Event, EventEmitter, Host, Prop, h } from '@stencil/core';

let textareaId = 0;

@Component({
  tag: 'iv-textarea',
  styleUrl: 'iv-textarea.css',
  shadow: false,
})
export class IvTextarea {
  private readonly fallbackTextareaId = `iv-textarea-${++textareaId}`;

  /** Etiqueta visible del campo. */
  @Prop({ reflect: true }) label!: string;

  /** Identificador estable del textarea nativo interno. */
  @Prop({ attribute: 'textarea-id' }) textareaId?: string;

  /** Valor actual del textarea. */
  @Prop({ mutable: true }) value = '';

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

  /** Identificador de formulario asociado cuando el textarea vive fuera del form. */
  @Prop() form?: string;

  /** Sugerencia nativa de autocompletado. */
  @Prop() autocomplete?: string;

  /** Numero visible de filas del textarea. */
  @Prop() rows = 4;

  /** Longitud maxima permitida por el textarea nativo. */
  @Prop({ attribute: 'maxlength' }) maxLength?: number;

  /** Longitud minima permitida por el textarea nativo. */
  @Prop({ attribute: 'minlength' }) minLength?: number;

  /** Estrategia nativa de ajuste de linea al enviar formularios. */
  @Prop() wrap?: 'soft' | 'hard' | 'off';

  /** Se emite cuando cambia el valor desde el textarea nativo. */
  @Event() valueChange!: EventEmitter<string>;

  private get controlId() {
    return this.textareaId || this.fallbackTextareaId;
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
    this.value = (event.target as HTMLTextAreaElement).value;
    this.valueChange.emit(this.value);
  };

  render() {
    const hasError = Boolean(this.error) && !this.disabled;

    return (
      <Host>
        <div class={{ 'iv-textarea': true, 'iv-textarea--invalid': hasError, 'iv-textarea--disabled': this.disabled }}>
          <label class="iv-textarea__label" htmlFor={this.controlId}>
            {this.label}
            {this.required ? <span class="iv-textarea__required" aria-hidden="true">*</span> : undefined}
          </label>
          <textarea
            id={this.controlId}
            class="iv-textarea__control"
            value={this.value}
            name={this.name}
            form={this.form}
            placeholder={this.placeholder}
            autocomplete={this.autocomplete}
            disabled={this.disabled}
            readOnly={this.readonly}
            required={this.required}
            rows={this.rows}
            maxLength={this.maxLength}
            minLength={this.minLength}
            wrap={this.wrap}
            aria-describedby={this.describedBy}
            aria-invalid={hasError ? 'true' : undefined}
            onInput={this.handleInput}
          />
          {this.hint ? (
            <p id={this.hintId} class="iv-textarea__hint">
              {this.hint}
            </p>
          ) : undefined}
          {this.error ? (
            <p id={this.errorId} class="iv-textarea__error">
              {this.error}
            </p>
          ) : undefined}
        </div>
      </Host>
    );
  }
}
