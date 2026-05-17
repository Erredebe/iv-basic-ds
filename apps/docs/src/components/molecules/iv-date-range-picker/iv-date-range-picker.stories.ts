import { html } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components';

const meta: Meta = {
  title: 'Molecules/Date Range Picker',
  component: 'iv-date-range-picker',
  tags: ['autodocs', 'a11y'],
  parameters: {
    docs: {
      description: {
        component:
          'iv-date-range-picker combina dos inputs nativos de fecha con variantes de calendario mobile-first inspiradas en WAI-ARIA APG, USWDS, React Spectrum, Carbon, Duet, Polaris y MUI X.',
      },
    },
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['native', 'sheet', 'stepper', 'segmented', 'presets', 'compact'],
    },
    label: { control: 'text' },
    startLabel: { control: 'text', name: 'start-label' },
    endLabel: { control: 'text', name: 'end-label' },
    startValue: { control: 'text', name: 'start-value' },
    endValue: { control: 'text', name: 'end-value' },
    min: { control: 'text' },
    max: { control: 'text' },
    hint: { control: 'text' },
    error: { control: 'text' },
    required: { control: 'boolean' },
    disabled: { control: 'boolean' },
    readonly: { control: 'boolean' },
    firstDayOfWeek: { control: 'number', name: 'first-day-of-week' },
  },
  args: {
    variant: 'sheet',
    label: 'Fechas del viaje',
    startLabel: 'Desde',
    endLabel: 'Hasta',
    startValue: '2026-05-18',
    endValue: '2026-05-24',
    min: '2026-05-01',
    max: '2026-08-31',
    hint: 'Puedes escribir las fechas o elegirlas en el calendario.',
    error: '',
    required: false,
    disabled: false,
    readonly: false,
    firstDayOfWeek: 1,
  },
};

export default meta;

type Story = StoryObj;

export const Playground: Story = {
  render: ({ variant, label, startLabel, endLabel, startValue, endValue, min, max, hint, error, required, disabled, readonly, firstDayOfWeek }) => html`
    <iv-date-range-picker
      variant=${variant}
      label=${label}
      start-label=${startLabel}
      end-label=${endLabel}
      start-value=${startValue || undefined}
      end-value=${endValue || undefined}
      min=${min || undefined}
      max=${max || undefined}
      hint=${hint || undefined}
      error=${error || undefined}
      ?required=${required}
      ?disabled=${disabled}
      ?readonly=${readonly}
      first-day-of-week=${firstDayOfWeek}
      start-name="tripStart"
      end-name="tripEnd"
    ></iv-date-range-picker>
  `,
};

export const NativeMobileInputs: Story = {
  render: () => html`
    <div class="iv-storybook-panel">
      <p class="iv-storybook-panel__eyebrow">Version 1</p>
      <h2 class="iv-storybook-panel__title">Native mobile date inputs</h2>
      <p class="iv-storybook-panel__description">
        Inspirada en USWDS y GOV.UK: dos controles nativos, labels visibles y entrada manual siempre disponible.
      </p>
      <iv-date-range-picker
        variant="native"
        label="Periodo de ausencia"
        start-name="absenceStart"
        end-name="absenceEnd"
        hint="Usa el selector nativo del dispositivo o escribe AAAA-MM-DD."
        required
      ></iv-date-range-picker>
    </div>
  `,
};

export const BottomSheetCalendar: Story = {
  render: () => html`
    <div class="iv-storybook-panel">
      <p class="iv-storybook-panel__eyebrow">Version 2</p>
      <h2 class="iv-storybook-panel__title">Bottom sheet con calendario</h2>
      <p class="iv-storybook-panel__description">
        Inspirada en Material, React Spectrum y Duet: dialog modal, calendario con grid y cierre al completar el rango.
      </p>
      <iv-date-range-picker
        variant="sheet"
        label="Reserva de hotel"
        start-value="2026-05-18"
        end-value="2026-05-22"
        min="2026-05-01"
        max="2026-08-31"
        start-name="hotelStart"
        end-name="hotelEnd"
      ></iv-date-range-picker>
    </div>
  `,
};

export const StepperFlow: Story = {
  render: () => html`
    <div class="iv-storybook-panel">
      <p class="iv-storybook-panel__eyebrow">Version 3</p>
      <h2 class="iv-storybook-panel__title">Flujo por pasos</h2>
      <p class="iv-storybook-panel__description">
        Pensado para mobile: primero se confirma Desde y despues Hasta con una indicacion de progreso clara.
      </p>
      <iv-date-range-picker
        variant="stepper"
        label="Fechas de instalacion"
        min="2026-05-01"
        max="2026-07-31"
        start-name="installStart"
        end-name="installEnd"
      ></iv-date-range-picker>
    </div>
  `,
};

export const SegmentedCalendar: Story = {
  render: () => html`
    <div class="iv-storybook-panel">
      <p class="iv-storybook-panel__eyebrow">Version 4</p>
      <h2 class="iv-storybook-panel__title">Segmentado Desde y Hasta</h2>
      <p class="iv-storybook-panel__description">
        Inspirada en patrones de filtros: tabs accesibles para alternar que extremo del rango se esta editando.
      </p>
      <iv-date-range-picker
        variant="segmented"
        label="Campana activa"
        start-value="2026-06-03"
        end-value="2026-06-14"
        start-name="campaignStart"
        end-name="campaignEnd"
      ></iv-date-range-picker>
    </div>
  `,
};

export const PresetRanges: Story = {
  render: () => html`
    <div class="iv-storybook-panel">
      <p class="iv-storybook-panel__eyebrow">Version 5</p>
      <h2 class="iv-storybook-panel__title">Rangos rapidos</h2>
      <p class="iv-storybook-panel__description">
        Inspirada en MUI X, Ant Design y paneles de analytics: presets tactiles y calendario para ajuste fino.
      </p>
      <iv-date-range-picker
        variant="presets"
        label="Rango del informe"
        start-name="reportStart"
        end-name="reportEnd"
      ></iv-date-range-picker>
    </div>
  `,
};

export const CompactFilter: Story = {
  render: () => html`
    <div class="iv-storybook-panel">
      <p class="iv-storybook-panel__eyebrow">Version 6</p>
      <h2 class="iv-storybook-panel__title">Filtro compacto expandible</h2>
      <p class="iv-storybook-panel__description">
        Para toolbar o vistas de listado: mantiene inputs nativos en el formulario y despliega un calendario inline.
      </p>
      <iv-date-range-picker
        variant="compact"
        label="Filtrar por fechas"
        start-value="2026-05-01"
        end-value="2026-05-17"
        start-name="filterStart"
        end-name="filterEnd"
      ></iv-date-range-picker>
    </div>
  `,
};

export const ValidationAndLimits: Story = {
  render: () => html`
    <div class="iv-storybook-panel">
      <p class="iv-storybook-panel__eyebrow">Accesibilidad</p>
      <h2 class="iv-storybook-panel__title">Error, min y max conectados a inputs nativos</h2>
      <iv-date-range-picker
        variant="sheet"
        label="Solicitud fuera de rango"
        start-value="2026-07-20"
        end-value="2026-07-10"
        min="2026-05-01"
        max="2026-07-31"
        hint="El rango permitido esta entre mayo y julio de 2026."
      ></iv-date-range-picker>
    </div>
  `,
};
