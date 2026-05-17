import { Component, Element as StencilElement, Event, EventEmitter, Host, Method, Prop, State, Watch, h } from '@stencil/core';
import dialogPolyfill from 'dialog-polyfill';

export type IvDateRangePickerVariant = 'native' | 'sheet' | 'stepper' | 'segmented' | 'presets' | 'compact';
export type IvDateRangePickerPart = 'start' | 'end';

export interface IvDateRangePickerValueChangeDetail {
  startValue: string;
  endValue: string;
  activePart: IvDateRangePickerPart;
}

const isoDatePattern = /^(\d{4})-(\d{2})-(\d{2})$/;
let dateRangePickerId = 0;

const createDate = (year: number, month: number, day: number) => new Date(year, month, day);
const startOfMonth = (date: Date) => createDate(date.getFullYear(), date.getMonth(), 1);
const getDaysInMonth = (year: number, month: number) => createDate(year, month + 1, 0).getDate();
const isSameIsoDate = (first: string, second: string) => first !== '' && first === second;

const toIsoDate = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
};

const parseIsoDate = (value?: string) => {
  if (!value) {
    return undefined;
  }

  const match = isoDatePattern.exec(value);

  if (!match) {
    return undefined;
  }

  const year = Number(match[1]);
  const month = Number(match[2]) - 1;
  const day = Number(match[3]);
  const date = createDate(year, month, day);

  if (date.getFullYear() !== year || date.getMonth() !== month || date.getDate() !== day) {
    return undefined;
  }

  return date;
};

const addDays = (date: Date, days: number) => createDate(date.getFullYear(), date.getMonth(), date.getDate() + days);

const addMonths = (date: Date, months: number) => {
  const targetMonth = createDate(date.getFullYear(), date.getMonth() + months, 1);
  const targetDay = Math.min(date.getDate(), getDaysInMonth(targetMonth.getFullYear(), targetMonth.getMonth()));

  return createDate(targetMonth.getFullYear(), targetMonth.getMonth(), targetDay);
};

const compareDates = (first: Date, second: Date) => first.getTime() - second.getTime();

const compareIsoDates = (first: string, second: string) => {
  const firstDate = parseIsoDate(first);
  const secondDate = parseIsoDate(second);

  if (!firstDate || !secondDate) {
    return 0;
  }

  return compareDates(firstDate, secondDate);
};

const getWeekdayOffset = (date: Date, firstDayOfWeek: number) => (date.getDay() - firstDayOfWeek + 7) % 7;

@Component({
  tag: 'iv-date-range-picker',
  styleUrl: 'iv-date-range-picker.css',
  shadow: false,
})
export class IvDateRangePicker {
  @StencilElement() private hostElement!: HTMLElement;

  private readonly fallbackId = `iv-date-range-picker-${++dateRangePickerId}`;
  private dialogElement?: HTMLDialogElement;
  private startInputElement?: HTMLInputElement;
  private endInputElement?: HTMLInputElement;
  private previouslyFocusedElement?: HTMLElement;
  private shouldFocusCalendarDay = false;

  @State() private activePart: IvDateRangePickerPart = 'start';
  @State() private visibleMonth = startOfMonth(new Date());
  @State() private focusedDate = toIsoDate(new Date());

  /** Variante mobile-first del selector. */
  @Prop({ reflect: true }) variant: IvDateRangePickerVariant = 'sheet';

  /** Etiqueta visible del grupo de rango. */
  @Prop({ reflect: true }) label = 'Rango de fechas';

  /** Etiqueta visible del campo inicial. */
  @Prop({ attribute: 'start-label' }) startLabel = 'Desde';

  /** Etiqueta visible del campo final. */
  @Prop({ attribute: 'end-label' }) endLabel = 'Hasta';

  /** Valor ISO YYYY-MM-DD del campo inicial. */
  @Prop({ attribute: 'start-value', mutable: true, reflect: true }) startValue = '';

  /** Valor ISO YYYY-MM-DD del campo final. */
  @Prop({ attribute: 'end-value', mutable: true, reflect: true }) endValue = '';

  /** Nombre nativo enviado para la fecha inicial. */
  @Prop({ attribute: 'start-name' }) startName?: string;

  /** Nombre nativo enviado para la fecha final. */
  @Prop({ attribute: 'end-name' }) endName?: string;

  /** Identificador de formulario asociado cuando los inputs viven fuera del form. */
  @Prop() form?: string;

  /** Fecha minima seleccionable en formato ISO YYYY-MM-DD. */
  @Prop() min?: string;

  /** Fecha maxima seleccionable en formato ISO YYYY-MM-DD. */
  @Prop() max?: string;

  /** Ayuda visible asociada al grupo. */
  @Prop() hint = 'Formato: AAAA-MM-DD. Tambien puedes escribir las fechas manualmente.';

  /** Mensaje de error visible asociado al grupo. */
  @Prop() error?: string;

  /** Deshabilita todos los controles. */
  @Prop({ reflect: true }) disabled = false;

  /** Evita editar el rango sin deshabilitar la lectura ni el foco. */
  @Prop({ reflect: true }) readonly = false;

  /** Marca ambos campos como requeridos. */
  @Prop({ reflect: true }) required = false;

  /** Controla si el calendario esta abierto. */
  @Prop({ mutable: true, reflect: true }) open = false;

  /** Locale usado para textos de fechas del calendario. */
  @Prop() locale = 'es-ES';

  /** Dia inicial de la semana: 0 domingo, 1 lunes, ... 6 sabado. */
  @Prop({ attribute: 'first-day-of-week' }) firstDayOfWeek = 1;

  /** Identificador estable usado como base para los controles internos. */
  @Prop({ attribute: 'picker-id' }) pickerId?: string;

  /** Se emite cuando cambia cualquiera de las fechas. */
  @Event() valueChange!: EventEmitter<IvDateRangePickerValueChangeDetail>;

  /** Se emite cuando se abre o cierra el calendario. */
  @Event() openChange!: EventEmitter<boolean>;

  @Watch('open')
  protected handleOpenChange() {
    this.syncDialogState();
  }

  componentWillLoad() {
    this.syncCalendarFromCurrentValue();
  }

  componentDidLoad() {
    this.registerDialogPolyfill();
    this.syncDialogState();
  }

  componentDidRender() {
    this.focusPendingCalendarDay();
  }

  /** Abre el calendario cuando la variante lo permite. */
  @Method()
  async show() {
    if (this.isInteractionLocked || this.variant === 'native') {
      return;
    }

    this.previouslyFocusedElement = document.activeElement instanceof HTMLElement ? document.activeElement : undefined;
    this.prepareCalendarFocus();
    this.setOpen(true);
  }

  /** Cierra el calendario. */
  @Method()
  async close() {
    this.closeCalendar(true);
  }

  /** Mueve el foco al campo nativo indicado. */
  @Method()
  async setFocus(part: IvDateRangePickerPart = 'start') {
    const target = part === 'start' ? this.startInputElement : this.endInputElement;

    target?.focus();
  }

  private get baseId() {
    return this.pickerId || this.fallbackId;
  }

  private get startInputId() {
    return `${this.baseId}-start`;
  }

  private get endInputId() {
    return `${this.baseId}-end`;
  }

  private get hintId() {
    return `${this.baseId}-hint`;
  }

  private get errorId() {
    return `${this.baseId}-error`;
  }

  private get dialogId() {
    return `${this.baseId}-dialog`;
  }

  private get dialogTitleId() {
    return `${this.baseId}-dialog-title`;
  }

  private get dialogDescriptionId() {
    return `${this.baseId}-dialog-description`;
  }

  private get monthLabelId() {
    return `${this.baseId}-month`;
  }

  private get calendarPanelId() {
    return `${this.baseId}-calendar-panel`;
  }

  private get normalizedFirstDayOfWeek() {
    return Number.isInteger(this.firstDayOfWeek) && this.firstDayOfWeek >= 0 && this.firstDayOfWeek <= 6 ? this.firstDayOfWeek : 1;
  }

  private get resolvedLocale() {
    return this.locale || document.documentElement.lang || 'es-ES';
  }

  private get isInteractionLocked() {
    return this.disabled || this.readonly;
  }

  private get visibleError() {
    return this.error || (this.hasRangeOrderError() ? `La fecha ${this.endLabel} no puede ser anterior a ${this.startLabel}.` : undefined);
  }

  private get describedBy() {
    return [this.hint ? this.hintId : undefined, this.visibleError ? this.errorId : undefined].filter(Boolean).join(' ') || undefined;
  }

  private registerDialogPolyfill() {
    if (!this.dialogElement || 'showModal' in this.dialogElement) {
      return;
    }

    dialogPolyfill.registerDialog(this.dialogElement);
  }

  private syncDialogState() {
    if (this.variant === 'native' || this.variant === 'compact' || !this.dialogElement) {
      return;
    }

    if (this.open && !this.dialogElement.open) {
      this.dialogElement.showModal();
      this.shouldFocusCalendarDay = true;
      return;
    }

    if (!this.open && this.dialogElement.open) {
      this.dialogElement.close();
    }
  }

  private focusPendingCalendarDay() {
    if (!this.shouldFocusCalendarDay) {
      return;
    }

    this.shouldFocusCalendarDay = false;
    this.getFocusedDateButton()?.focus();
  }

  private getFocusedDateButton() {
    return this.hostElement.querySelector<HTMLButtonElement>(`[data-iv-date="${this.focusedDate}"]`);
  }

  private setOpen(open: boolean) {
    if (this.open === open) {
      return;
    }

    this.open = open;
    this.openChange.emit(open);
  }

  private prepareCalendarFocus() {
    const activeValue = this.activePart === 'start' ? this.startValue : this.endValue;
    const fallbackValue = this.startValue || this.endValue;
    const preferredDate = parseIsoDate(activeValue) || parseIsoDate(fallbackValue) || new Date();
    const clampedDate = this.clampDate(preferredDate);

    this.focusedDate = toIsoDate(clampedDate);
    this.visibleMonth = startOfMonth(clampedDate);
    this.shouldFocusCalendarDay = true;
  }

  private syncCalendarFromCurrentValue() {
    const initialDate = parseIsoDate(this.startValue) || parseIsoDate(this.endValue) || new Date();
    const clampedDate = this.clampDate(initialDate);

    this.activePart = this.startValue && !this.endValue ? 'end' : 'start';
    this.focusedDate = toIsoDate(clampedDate);
    this.visibleMonth = startOfMonth(clampedDate);
  }

  private closeCalendar(restoreFocus = false) {
    this.setOpen(false);

    if (this.dialogElement?.open) {
      this.dialogElement.close();
    }

    if (restoreFocus && this.previouslyFocusedElement?.isConnected) {
      this.previouslyFocusedElement.focus();
    }
  }

  private hasRangeOrderError() {
    return Boolean(this.startValue && this.endValue && compareIsoDates(this.startValue, this.endValue) > 0);
  }

  private getMinDate() {
    return parseIsoDate(this.min);
  }

  private getMaxDate() {
    return parseIsoDate(this.max);
  }

  private clampDate(date: Date) {
    const minDate = this.getMinDate();
    const maxDate = this.getMaxDate();

    if (minDate && compareDates(date, minDate) < 0) {
      return minDate;
    }

    if (maxDate && compareDates(date, maxDate) > 0) {
      return maxDate;
    }

    return date;
  }

  private isDateUnavailable(date: Date) {
    const minDate = this.getMinDate();
    const maxDate = this.getMaxDate();

    return Boolean((minDate && compareDates(date, minDate) < 0) || (maxDate && compareDates(date, maxDate) > 0));
  }

  private handleStartInput = (event: Event) => {
    this.startValue = (event.target as HTMLInputElement).value;
    this.activePart = 'end';
    this.syncFocusedDateFromInput(this.startValue);
    this.emitValueChange();
  };

  private handleEndInput = (event: Event) => {
    this.endValue = (event.target as HTMLInputElement).value;
    this.activePart = 'end';
    this.syncFocusedDateFromInput(this.endValue);
    this.emitValueChange();
  };

  private syncFocusedDateFromInput(value: string) {
    const date = parseIsoDate(value);

    if (!date) {
      return;
    }

    this.focusedDate = toIsoDate(this.clampDate(date));
    this.visibleMonth = startOfMonth(this.clampDate(date));
  }

  private emitValueChange() {
    this.valueChange.emit({
      startValue: this.startValue,
      endValue: this.endValue,
      activePart: this.activePart,
    });
  }

  private handleTriggerClick = () => {
    if (this.variant === 'compact') {
      this.prepareCalendarFocus();
      this.setOpen(!this.open);
      return;
    }

    this.show();
  };

  private handleDialogClose = (event: Event) => {
    if (event.target !== this.dialogElement) {
      return;
    }

    this.setOpen(false);
  };

  private handleDialogClick = (event: MouseEvent) => {
    if (event.target !== this.dialogElement) {
      return;
    }

    this.closeCalendar(true);
  };

  private handleDateSelect(dateIso: string) {
    if (this.isInteractionLocked || this.isDateUnavailable(parseIsoDate(dateIso)!)) {
      return;
    }

    if (this.activePart === 'start' || !this.startValue) {
      this.selectStartDate(dateIso);
      return;
    }

    this.selectEndDate(dateIso);
  }

  private selectStartDate(dateIso: string) {
    this.startValue = dateIso;

    if (this.endValue && compareIsoDates(dateIso, this.endValue) > 0) {
      this.endValue = '';
    }

    this.activePart = 'end';
    this.focusedDate = dateIso;
    this.visibleMonth = startOfMonth(parseIsoDate(dateIso)!);
    this.shouldFocusCalendarDay = true;
    this.emitValueChange();
  }

  private selectEndDate(dateIso: string) {
    if (compareIsoDates(dateIso, this.startValue) < 0) {
      this.selectStartDate(dateIso);
      return;
    }

    this.endValue = dateIso;
    this.activePart = 'start';
    this.focusedDate = dateIso;
    this.visibleMonth = startOfMonth(parseIsoDate(dateIso)!);
    this.emitValueChange();
    this.closeCalendar(true);
  }

  private clearRange = () => {
    if (this.isInteractionLocked) {
      return;
    }

    this.startValue = '';
    this.endValue = '';
    this.activePart = 'start';
    this.prepareCalendarFocus();
    this.emitValueChange();
  };

  private applyPreset = (preset: 'today' | 'next-seven' | 'this-month' | 'next-month') => {
    if (this.isInteractionLocked) {
      return;
    }

    const today = new Date();
    const nextMonth = addMonths(startOfMonth(today), 1);
    const ranges = {
      today: [today, today],
      'next-seven': [today, addDays(today, 6)],
      'this-month': [startOfMonth(today), createDate(today.getFullYear(), today.getMonth(), getDaysInMonth(today.getFullYear(), today.getMonth()))],
      'next-month': [nextMonth, createDate(nextMonth.getFullYear(), nextMonth.getMonth(), getDaysInMonth(nextMonth.getFullYear(), nextMonth.getMonth()))],
    } satisfies Record<typeof preset, [Date, Date]>;
    const [start, end] = ranges[preset].map(date => this.clampDate(date));

    this.startValue = toIsoDate(start);
    this.endValue = toIsoDate(end);
    this.activePart = 'start';
    this.focusedDate = this.startValue;
    this.visibleMonth = startOfMonth(start);
    this.emitValueChange();
    this.closeCalendar(true);
  };

  private setActivePart(part: IvDateRangePickerPart) {
    this.activePart = part;
    this.prepareCalendarFocus();
  }

  private moveFocusByDays(days: number, fromDate: Date) {
    this.moveFocusToDate(addDays(fromDate, days));
  }

  private moveFocusToDate(date: Date) {
    const clampedDate = this.clampDate(date);

    this.focusedDate = toIsoDate(clampedDate);
    this.visibleMonth = startOfMonth(clampedDate);
    this.shouldFocusCalendarDay = true;
  }

  private moveFocusByMonths(months: number, fromDate: Date) {
    this.moveFocusToDate(addMonths(fromDate, months));
  }

  private handleDayKeyDown = (event: KeyboardEvent, date: Date) => {
    const handledKeys = ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End', 'PageUp', 'PageDown'];

    if (!handledKeys.includes(event.key)) {
      return;
    }

    event.preventDefault();
    this.moveCalendarFocus(event, date);
  };

  private moveCalendarFocus(event: KeyboardEvent, date: Date) {
    const arrowDayDelta = this.getArrowDayDelta(event.key);

    if (arrowDayDelta !== undefined) {
      this.moveFocusByDays(arrowDayDelta, date);
      return;
    }

    if (event.key === 'Home') {
      this.moveFocusByDays(-getWeekdayOffset(date, this.normalizedFirstDayOfWeek), date);
      return;
    }

    if (event.key === 'End') {
      this.moveFocusByDays(6 - getWeekdayOffset(date, this.normalizedFirstDayOfWeek), date);
      return;
    }

    this.moveFocusByMonths(this.getPageMonthDelta(event), date);
  }

  private getArrowDayDelta(key: string) {
    const deltas: Record<string, number> = {
      ArrowLeft: -1,
      ArrowRight: 1,
      ArrowUp: -7,
      ArrowDown: 7,
    };

    return deltas[key];
  }

  private getPageMonthDelta(event: KeyboardEvent) {
    const direction = event.key === 'PageUp' ? -1 : 1;

    return event.shiftKey ? direction * 12 : direction;
  }

  private goToPreviousMonth = () => {
    this.visibleMonth = startOfMonth(addMonths(this.visibleMonth, -1));
  };

  private goToNextMonth = () => {
    this.visibleMonth = startOfMonth(addMonths(this.visibleMonth, 1));
  };

  private isDateInRange(dateIso: string) {
    return Boolean(
      this.startValue && this.endValue && compareIsoDates(this.startValue, dateIso) <= 0 && compareIsoDates(dateIso, this.endValue) <= 0,
    );
  }

  private formatDate(date: Date, options: Intl.DateTimeFormatOptions = { dateStyle: 'medium' }) {
    return new Intl.DateTimeFormat(this.resolvedLocale, options).format(date);
  }

  private formatIsoDate(value: string) {
    const date = parseIsoDate(value);

    return date ? this.formatDate(date) : '';
  }

  private getRangeSummary() {
    if (this.startValue && this.endValue && !this.hasRangeOrderError()) {
      return `${this.startLabel}: ${this.formatIsoDate(this.startValue)}. ${this.endLabel}: ${this.formatIsoDate(this.endValue)}.`;
    }

    if (this.startValue) {
      return `${this.startLabel}: ${this.formatIsoDate(this.startValue)}. Falta ${this.endLabel}.`;
    }

    if (this.endValue) {
      return `${this.endLabel}: ${this.formatIsoDate(this.endValue)}. Falta ${this.startLabel}.`;
    }

    return 'Sin fechas seleccionadas.';
  }

  private getTriggerLabel() {
    return this.startValue || this.endValue ? `Cambiar rango de fechas. ${this.getRangeSummary()}` : 'Elegir rango de fechas';
  }

  private getDayLabel(date: Date, dateIso: string) {
    const labels = [this.formatDate(date, { dateStyle: 'full' })];

    if (isSameIsoDate(dateIso, this.startValue)) {
      labels.push(`fecha ${this.startLabel}`);
    }

    if (isSameIsoDate(dateIso, this.endValue)) {
      labels.push(`fecha ${this.endLabel}`);
    }

    if (this.isDateInRange(dateIso) && !isSameIsoDate(dateIso, this.startValue) && !isSameIsoDate(dateIso, this.endValue)) {
      labels.push('dentro del rango seleccionado');
    }

    if (dateIso === toIsoDate(new Date())) {
      labels.push('hoy');
    }

    if (this.isDateUnavailable(date)) {
      labels.push('no disponible');
    }

    return labels.join(', ');
  }

  private getCalendarDays() {
    const firstVisibleDay = addDays(this.visibleMonth, -getWeekdayOffset(this.visibleMonth, this.normalizedFirstDayOfWeek));

    return Array.from({ length: 42 }, (_, index) => addDays(firstVisibleDay, index));
  }

  private getWeekdayHeaders() {
    return Array.from({ length: 7 }, (_, index) => {
      const day = addDays(createDate(2024, 0, 7 + this.normalizedFirstDayOfWeek), index);

      return {
        short: new Intl.DateTimeFormat(this.resolvedLocale, { weekday: 'short' }).format(day),
        long: new Intl.DateTimeFormat(this.resolvedLocale, { weekday: 'long' }).format(day),
      };
    });
  }

  private renderInput(part: IvDateRangePickerPart) {
    const isStart = part === 'start';
    const inputId = isStart ? this.startInputId : this.endInputId;
    const value = isStart ? this.startValue : this.endValue;
    const label = isStart ? this.startLabel : this.endLabel;
    const name = isStart ? this.startName : this.endName;
    const invalid = Boolean(this.visibleError && (!this.hasRangeOrderError() || !isStart));

    return (
      <div class="iv-date-range-picker__field">
        <label class="iv-date-range-picker__field-label" htmlFor={inputId}>
          {label}
        </label>
        <input
          id={inputId}
          ref={element => this.setInputElement(part, element)}
          class="iv-date-range-picker__input"
          type="date"
          value={value}
          name={name}
          form={this.form}
          min={this.min}
          max={this.max}
          disabled={this.disabled}
          readOnly={this.readonly}
          required={this.required}
          aria-describedby={this.describedBy}
          aria-invalid={invalid ? 'true' : undefined}
          onInput={isStart ? this.handleStartInput : this.handleEndInput}
          onFocus={() => (this.activePart = part)}
        />
      </div>
    );
  }

  private setInputElement(part: IvDateRangePickerPart, element?: HTMLInputElement) {
    if (part === 'start') {
      this.startInputElement = element;
      return;
    }

    this.endInputElement = element;
  }

  private renderFields() {
    return (
      <div class="iv-date-range-picker__fields">
        {this.renderInput('start')}
        {this.renderInput('end')}
      </div>
    );
  }

  private renderTrigger() {
    return (
      <button
        class="iv-date-range-picker__trigger"
        type="button"
        aria-haspopup={this.variant === 'compact' ? undefined : 'dialog'}
        aria-controls={this.variant === 'compact' ? this.calendarPanelId : this.dialogId}
        aria-expanded={this.open ? 'true' : 'false'}
        aria-label={this.getTriggerLabel()}
        disabled={this.isInteractionLocked}
        onClick={this.handleTriggerClick}
      >
        <span aria-hidden="true" class="iv-date-range-picker__trigger-icon">
          []
        </span>
        <span>{this.startValue || this.endValue ? 'Cambiar fechas' : 'Elegir fechas'}</span>
      </button>
    );
  }

  private renderVariantControls() {
    if (this.variant === 'stepper') {
      return this.renderStepper();
    }

    if (this.variant === 'segmented') {
      return this.renderSegments();
    }

    if (this.variant === 'presets' || this.variant === 'compact') {
      return this.renderPresets();
    }

    return <p class="iv-date-range-picker__instruction">Selecciona primero {this.startLabel} y despues {this.endLabel}.</p>;
  }

  private renderStepper() {
    return (
      <ol class="iv-date-range-picker__steps" aria-label="Progreso de seleccion">
        <li class={{ 'iv-date-range-picker__step': true, 'iv-date-range-picker__step--active': this.activePart === 'start' }} aria-current={this.activePart === 'start' ? 'step' : undefined}>
          1. {this.startLabel}
        </li>
        <li class={{ 'iv-date-range-picker__step': true, 'iv-date-range-picker__step--active': this.activePart === 'end' }} aria-current={this.activePart === 'end' ? 'step' : undefined}>
          2. {this.endLabel}
        </li>
      </ol>
    );
  }

  private renderSegments() {
    return (
      <div class="iv-date-range-picker__segments" role="tablist" aria-label="Parte del rango a seleccionar">
        {this.renderSegmentButton('start', this.startLabel)}
        {this.renderSegmentButton('end', this.endLabel)}
      </div>
    );
  }

  private renderSegmentButton(part: IvDateRangePickerPart, label: string) {
    const selected = this.activePart === part;

    return (
      <button
        class={{ 'iv-date-range-picker__segment': true, 'iv-date-range-picker__segment--active': selected }}
        type="button"
        role="tab"
        aria-selected={selected ? 'true' : 'false'}
        aria-controls={this.calendarPanelId}
        onClick={() => this.setActivePart(part)}
      >
        {label}
      </button>
    );
  }

  private renderPresets() {
    return (
      <div class="iv-date-range-picker__presets" aria-label="Rangos rapidos">
        <button type="button" onClick={() => this.applyPreset('today')}>Hoy</button>
        <button type="button" onClick={() => this.applyPreset('next-seven')}>Proximos 7 dias</button>
        <button type="button" onClick={() => this.applyPreset('this-month')}>Este mes</button>
        <button type="button" onClick={() => this.applyPreset('next-month')}>Mes siguiente</button>
      </div>
    );
  }

  private renderCalendar() {
    const days = this.getCalendarDays();
    const weeks = Array.from({ length: 6 }, (_, index) => days.slice(index * 7, index * 7 + 7));

    return (
      <div id={this.calendarPanelId} class="iv-date-range-picker__calendar">
        <div class="iv-date-range-picker__calendar-header">
          <button type="button" class="iv-date-range-picker__nav-button" aria-label="Mes anterior" onClick={this.goToPreviousMonth}>
            &lt;
          </button>
          <h3 id={this.monthLabelId} class="iv-date-range-picker__month" aria-live="polite">
            {this.formatDate(this.visibleMonth, { month: 'long', year: 'numeric' })}
          </h3>
          <button type="button" class="iv-date-range-picker__nav-button" aria-label="Mes siguiente" onClick={this.goToNextMonth}>
            &gt;
          </button>
        </div>
        <table class="iv-date-range-picker__grid" role="grid" aria-labelledby={this.monthLabelId} aria-multiselectable="true">
          <thead>
            <tr>{this.getWeekdayHeaders().map(day => <th scope="col" abbr={day.long}>{day.short}</th>)}</tr>
          </thead>
          <tbody>{weeks.map(week => this.renderCalendarWeek(week))}</tbody>
        </table>
      </div>
    );
  }

  private renderCalendarWeek(week: Date[]) {
    return <tr>{week.map(date => this.renderCalendarDay(date))}</tr>;
  }

  private renderCalendarDay(date: Date) {
    const dateIso = toIsoDate(date);
    const isCurrentMonth = date.getMonth() === this.visibleMonth.getMonth();
    const isUnavailable = this.isDateUnavailable(date);
    const isSelected = this.isDateInRange(dateIso) || isSameIsoDate(dateIso, this.startValue) || isSameIsoDate(dateIso, this.endValue);

    return (
      <td role="gridcell" aria-selected={isSelected ? 'true' : 'false'}>
        <button
          class={{
            'iv-date-range-picker__day': true,
            'iv-date-range-picker__day--muted': !isCurrentMonth,
            'iv-date-range-picker__day--range': this.isDateInRange(dateIso),
            'iv-date-range-picker__day--start': isSameIsoDate(dateIso, this.startValue),
            'iv-date-range-picker__day--end': isSameIsoDate(dateIso, this.endValue),
          }}
          type="button"
          data-iv-date={dateIso}
          disabled={isUnavailable || this.isInteractionLocked}
          tabIndex={this.focusedDate === dateIso ? 0 : -1}
          aria-label={this.getDayLabel(date, dateIso)}
          aria-current={dateIso === toIsoDate(new Date()) ? 'date' : undefined}
          onClick={() => this.handleDateSelect(dateIso)}
          onFocus={() => (this.focusedDate = dateIso)}
          onKeyDown={event => this.handleDayKeyDown(event, date)}
        >
          {date.getDate()}
        </button>
      </td>
    );
  }

  private renderDialog() {
    if (this.variant === 'native' || this.variant === 'compact') {
      return undefined;
    }

    return (
      <dialog
        id={this.dialogId}
        class="iv-date-range-picker__dialog"
        ref={element => (this.dialogElement = element)}
        aria-labelledby={this.dialogTitleId}
        aria-describedby={this.dialogDescriptionId}
        onClose={this.handleDialogClose}
        onClick={this.handleDialogClick}
      >
        <div class="iv-date-range-picker__sheet">
          {this.renderDialogHeader()}
          <p id={this.dialogDescriptionId} class="iv-date-range-picker__dialog-description">
            Usa los campos nativos o el calendario. Flechas mueven dias, Inicio y Fin mueven por semana, Re Pag y Av Pag cambian de mes.
          </p>
          {this.renderVariantControls()}
          {this.renderSummary()}
          {this.renderCalendar()}
          {this.renderDialogFooter()}
        </div>
      </dialog>
    );
  }

  private renderDialogHeader() {
    return (
      <div class="iv-date-range-picker__dialog-header">
        <h2 id={this.dialogTitleId}>Seleccionar rango</h2>
        <button type="button" class="iv-date-range-picker__close" aria-label="Cerrar selector de fechas" onClick={() => this.closeCalendar(true)}>
          x
        </button>
      </div>
    );
  }

  private renderSummary() {
    return (
      <p class="iv-date-range-picker__summary" aria-live="polite">
        {this.getRangeSummary()}
      </p>
    );
  }

  private renderDialogFooter() {
    return (
      <div class="iv-date-range-picker__footer">
        <button type="button" class="iv-date-range-picker__button iv-date-range-picker__button--ghost" onClick={this.clearRange}>
          Limpiar
        </button>
        <button type="button" class="iv-date-range-picker__button" onClick={() => this.closeCalendar(true)}>
          Aplicar
        </button>
      </div>
    );
  }

  private renderCompactPanel() {
    if (this.variant !== 'compact' || !this.open) {
      return undefined;
    }

    return (
      <div class="iv-date-range-picker__compact-panel" role="region" aria-labelledby={this.monthLabelId}>
        {this.renderVariantControls()}
        {this.renderSummary()}
        {this.renderCalendar()}
      </div>
    );
  }

  render() {
    return (
      <Host>
        <fieldset
          class={{
            'iv-date-range-picker': true,
            [`iv-date-range-picker--${this.variant}`]: true,
            'iv-date-range-picker--invalid': Boolean(this.visibleError),
          }}
          aria-describedby={this.describedBy}
        >
          <legend class="iv-date-range-picker__legend">
            {this.label}
            {this.required ? <span class="iv-date-range-picker__required" aria-hidden="true">*</span> : undefined}
          </legend>
          {this.hint ? <p id={this.hintId} class="iv-date-range-picker__hint">{this.hint}</p> : undefined}
          {this.visibleError ? <p id={this.errorId} class="iv-date-range-picker__error">{this.visibleError}</p> : undefined}
          {this.renderFields()}
          {this.variant !== 'native' ? this.renderTrigger() : undefined}
          {this.renderCompactPanel()}
          {this.renderDialog()}
        </fieldset>
      </Host>
    );
  }
}
