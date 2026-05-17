# iv-input



<!-- Auto Generated Below -->


## Properties

| Property             | Attribute      | Description                                                               | Type                                                            | Default     |
| -------------------- | -------------- | ------------------------------------------------------------------------- | --------------------------------------------------------------- | ----------- |
| `autocomplete`       | `autocomplete` | Sugerencia nativa de autocompletado.                                      | `string`                                                        | `undefined` |
| `disabled`           | `disabled`     | Deshabilita la interaccion del campo.                                     | `boolean`                                                       | `false`     |
| `error`              | `error`        | Mensaje de error visible asociado al campo.                               | `string`                                                        | `undefined` |
| `form`               | `form`         | Identificador de formulario asociado cuando el input vive fuera del form. | `string`                                                        | `undefined` |
| `hint`               | `hint`         | Ayuda visible asociada al campo.                                          | `string`                                                        | `undefined` |
| `inputId`            | `input-id`     | Identificador estable del input nativo interno.                           | `string`                                                        | `undefined` |
| `inputMode`          | `inputmode`    | Sugerencia nativa de teclado virtual.                                     | `string`                                                        | `undefined` |
| `label` _(required)_ | `label`        | Etiqueta visible del campo.                                               | `string`                                                        | `undefined` |
| `name`               | `name`         | Nombre nativo enviado en formularios.                                     | `string`                                                        | `undefined` |
| `placeholder`        | `placeholder`  | Texto auxiliar cuando el campo esta vacio.                                | `string`                                                        | `undefined` |
| `readonly`           | `readonly`     | Evita editar el valor sin deshabilitar el foco.                           | `boolean`                                                       | `false`     |
| `required`           | `required`     | Marca el campo como requerido.                                            | `boolean`                                                       | `false`     |
| `type`               | `type`         | Tipo nativo del input.                                                    | `"email" \| "password" \| "search" \| "tel" \| "text" \| "url"` | `'text'`    |
| `value`              | `value`        | Valor actual del input.                                                   | `string`                                                        | `''`        |


## Events

| Event         | Description                                            | Type                  |
| ------------- | ------------------------------------------------------ | --------------------- |
| `valueChange` | Se emite cuando cambia el valor desde el input nativo. | `CustomEvent<string>` |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
