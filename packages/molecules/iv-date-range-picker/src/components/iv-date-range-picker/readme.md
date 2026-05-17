# iv-date-range-picker



<!-- Auto Generated Below -->


## Properties

| Property         | Attribute           | Description                                                                  | Type                                                                        | Default                                                                  |
| ---------------- | ------------------- | ---------------------------------------------------------------------------- | --------------------------------------------------------------------------- | ------------------------------------------------------------------------ |
| `disabled`       | `disabled`          | Deshabilita todos los controles.                                             | `boolean`                                                                   | `false`                                                                  |
| `endLabel`       | `end-label`         | Etiqueta visible del campo final.                                            | `string`                                                                    | `'Hasta'`                                                                |
| `endName`        | `end-name`          | Nombre nativo enviado para la fecha final.                                   | `string`                                                                    | `undefined`                                                              |
| `endValue`       | `end-value`         | Valor ISO YYYY-MM-DD del campo final.                                        | `string`                                                                    | `''`                                                                     |
| `error`          | `error`             | Mensaje de error visible asociado al grupo.                                  | `string`                                                                    | `undefined`                                                              |
| `firstDayOfWeek` | `first-day-of-week` | Dia inicial de la semana: 0 domingo, 1 lunes, ... 6 sabado.                  | `number`                                                                    | `1`                                                                      |
| `form`           | `form`              | Identificador de formulario asociado cuando los inputs viven fuera del form. | `string`                                                                    | `undefined`                                                              |
| `hint`           | `hint`              | Ayuda visible asociada al grupo.                                             | `string`                                                                    | `'Formato: AAAA-MM-DD. Tambien puedes escribir las fechas manualmente.'` |
| `label`          | `label`             | Etiqueta visible del grupo de rango.                                         | `string`                                                                    | `'Rango de fechas'`                                                      |
| `locale`         | `locale`            | Locale usado para textos de fechas del calendario.                           | `string`                                                                    | `'es-ES'`                                                                |
| `max`            | `max`               | Fecha maxima seleccionable en formato ISO YYYY-MM-DD.                        | `string`                                                                    | `undefined`                                                              |
| `min`            | `min`               | Fecha minima seleccionable en formato ISO YYYY-MM-DD.                        | `string`                                                                    | `undefined`                                                              |
| `open`           | `open`              | Controla si el calendario esta abierto.                                      | `boolean`                                                                   | `false`                                                                  |
| `pickerId`       | `picker-id`         | Identificador estable usado como base para los controles internos.           | `string`                                                                    | `undefined`                                                              |
| `readonly`       | `readonly`          | Evita editar el rango sin deshabilitar la lectura ni el foco.                | `boolean`                                                                   | `false`                                                                  |
| `required`       | `required`          | Marca ambos campos como requeridos.                                          | `boolean`                                                                   | `false`                                                                  |
| `startLabel`     | `start-label`       | Etiqueta visible del campo inicial.                                          | `string`                                                                    | `'Desde'`                                                                |
| `startName`      | `start-name`        | Nombre nativo enviado para la fecha inicial.                                 | `string`                                                                    | `undefined`                                                              |
| `startValue`     | `start-value`       | Valor ISO YYYY-MM-DD del campo inicial.                                      | `string`                                                                    | `''`                                                                     |
| `variant`        | `variant`           | Variante mobile-first del selector.                                          | `"compact" \| "native" \| "presets" \| "segmented" \| "sheet" \| "stepper"` | `'sheet'`                                                                |


## Events

| Event         | Description                                      | Type                                              |
| ------------- | ------------------------------------------------ | ------------------------------------------------- |
| `openChange`  | Se emite cuando se abre o cierra el calendario.  | `CustomEvent<boolean>`                            |
| `valueChange` | Se emite cuando cambia cualquiera de las fechas. | `CustomEvent<IvDateRangePickerValueChangeDetail>` |


## Methods

### `close() => Promise<void>`

Cierra el calendario.

#### Returns

Type: `Promise<void>`



### `setFocus(part?: IvDateRangePickerPart) => Promise<void>`

Mueve el foco al campo nativo indicado.

#### Parameters

| Name   | Type               | Description |
| ------ | ------------------ | ----------- |
| `part` | `"start" \| "end"` |             |

#### Returns

Type: `Promise<void>`



### `show() => Promise<void>`

Abre el calendario cuando la variante lo permite.

#### Returns

Type: `Promise<void>`




----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
