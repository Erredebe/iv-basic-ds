# iv-dialog



<!-- Auto Generated Below -->


## Properties

| Property          | Attribute           | Description                                                              | Type      | Default     |
| ----------------- | ------------------- | ------------------------------------------------------------------------ | --------- | ----------- |
| `ariaDescribedby` | `aria-describedby`  | Referencia al elemento que describe el dialog.                           | `string`  | `undefined` |
| `ariaLabel`       | `aria-label`        | Nombre accesible cuando no hay un titulo visible asociado.               | `string`  | `undefined` |
| `ariaLabelledby`  | `aria-labelledby`   | Referencia al elemento que etiqueta el dialog.                           | `string`  | `undefined` |
| `closeOnBackdrop` | `close-on-backdrop` | Permite cerrar haciendo click en el backdrop del dialog modal.           | `boolean` | `true`      |
| `closeOnEscape`   | `close-on-escape`   | Permite cerrar con la tecla Escape usando el evento `cancel` nativo.     | `boolean` | `true`      |
| `modal`           | `modal`             | Usa `showModal()` cuando esta activo y `show()` cuando esta desactivado. | `boolean` | `true`      |
| `open`            | `open`              | Controla si el dialog esta abierto.                                      | `boolean` | `false`     |
| `returnValue`     | `return-value`      | Valor opcional devuelto por el dialog al cerrar.                         | `string`  | `''`        |


## Events

| Event      | Description                                                 | Type                                    |
| ---------- | ----------------------------------------------------------- | --------------------------------------- |
| `ivCancel` | Se emite cuando el dialog recibe el evento nativo `cancel`. | `CustomEvent<void>`                     |
| `ivClose`  | Se emite cuando el dialog se cierra mediante la API nativa. | `CustomEvent<{ returnValue: string; }>` |
| `ivOpen`   | Se emite cuando el dialog se abre mediante la API nativa.   | `CustomEvent<void>`                     |


## Methods

### `close(returnValue?: string) => Promise<void>`

Cierra el dialog usando `close()` nativo.

#### Parameters

| Name          | Type     | Description |
| ------------- | -------- | ----------- |
| `returnValue` | `string` |             |

#### Returns

Type: `Promise<void>`



### `show() => Promise<void>`

Abre el dialog usando `show()` nativo.

#### Returns

Type: `Promise<void>`



### `showModal() => Promise<void>`

Abre el dialog usando `showModal()` nativo.

#### Returns

Type: `Promise<void>`




----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
