# iv-textarea



<!-- Auto Generated Below -->


## Properties

| Property             | Attribute      | Description                                                                  | Type                        | Default     |
| -------------------- | -------------- | ---------------------------------------------------------------------------- | --------------------------- | ----------- |
| `autocomplete`       | `autocomplete` | Sugerencia nativa de autocompletado.                                         | `string`                    | `undefined` |
| `disabled`           | `disabled`     | Deshabilita la interaccion del campo.                                        | `boolean`                   | `false`     |
| `error`              | `error`        | Mensaje de error visible asociado al campo.                                  | `string`                    | `undefined` |
| `form`               | `form`         | Identificador de formulario asociado cuando el textarea vive fuera del form. | `string`                    | `undefined` |
| `hint`               | `hint`         | Ayuda visible asociada al campo.                                             | `string`                    | `undefined` |
| `label` _(required)_ | `label`        | Etiqueta visible del campo.                                                  | `string`                    | `undefined` |
| `maxLength`          | `maxlength`    | Longitud maxima permitida por el textarea nativo.                            | `number`                    | `undefined` |
| `minLength`          | `minlength`    | Longitud minima permitida por el textarea nativo.                            | `number`                    | `undefined` |
| `name`               | `name`         | Nombre nativo enviado en formularios.                                        | `string`                    | `undefined` |
| `placeholder`        | `placeholder`  | Texto auxiliar cuando el campo esta vacio.                                   | `string`                    | `undefined` |
| `readonly`           | `readonly`     | Evita editar el valor sin deshabilitar el foco.                              | `boolean`                   | `false`     |
| `required`           | `required`     | Marca el campo como requerido.                                               | `boolean`                   | `false`     |
| `rows`               | `rows`         | Numero visible de filas del textarea.                                        | `number`                    | `4`         |
| `textareaId`         | `textarea-id`  | Identificador estable del textarea nativo interno.                           | `string`                    | `undefined` |
| `value`              | `value`        | Valor actual del textarea.                                                   | `string`                    | `''`        |
| `wrap`               | `wrap`         | Estrategia nativa de ajuste de linea al enviar formularios.                  | `"hard" \| "off" \| "soft"` | `undefined` |


## Events

| Event         | Description                                               | Type                  |
| ------------- | --------------------------------------------------------- | --------------------- |
| `valueChange` | Se emite cuando cambia el valor desde el textarea nativo. | `CustomEvent<string>` |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
