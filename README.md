# IV Basic DS

Design System base construido con StencilJS para distribuir Web Components por CDN y documentarlos con Storybook.

Produccion: https://iv-basic-ds.netlify.app/

## Objetivo

El proyecto esta preparado para publicar un sitio estatico en Netlify donde:

- `/` es la demo HTML nativa de Stencil.
- `/storybook/` es la documentacion visual de componentes.
- `/build/iv-basic-ds.esm.js` y `/build/iv-basic-ds.js` son los bundles consumibles por CDN.

Los componentes se crean sin Shadow DOM por defecto para facilitar integracion, accesibilidad y estilado desde aplicaciones consumidoras, especialmente Angular.

## Stack

- StencilJS `4`.
- TypeScript.
- Storybook para Web Components con Vite.
- Lit solo para escribir templates en stories.
- Netlify como hosting estatico/CDN.

## Modelo Atomico

El DS se gestiona con Atomic Design para clasificar alcance y composicion antes de implementar componentes.

- Foundations: tokens y reglas globales, como `src/global/tokens.css`.
- Atoms: componentes minimos, por ahora `iv-button`.
- Molecules: composiciones pequenas con comportamiento propio, por ahora `iv-dialog`.
- Organisms: bloques complejos de UI; sin componentes publicados todavia.
- Templates: estructuras de layout reutilizables; sin componentes publicados todavia.
- Pages: demos y pantallas de validacion, ubicadas en `src/demos/` o documentacion.

La clasificacion atomica no cambia la API publica: los tags mantienen el prefijo `iv-` sin incluir el nivel, por ejemplo `iv-button` e `iv-dialog`.

## Requisitos

- Node.js `20` o superior recomendado.
- npm `10` o superior recomendado.

## Instalacion

```bash
npm install
```

## Desarrollo

```bash
npm run start
```

Este comando ejecuta un build inicial y levanta en paralelo:

- Stencil: `http://localhost:3333/`
- Storybook: `http://localhost:6006/`

La home de Stencil incluye un enlace a Storybook.

## Scripts

```bash
npm run start
```

Levanta Stencil y Storybook en paralelo para desarrollo local.

```bash
npm run storybook
```

Levanta solo Storybook en `http://localhost:6006/` despues de generar el build de Stencil.

```bash
npm run build
```

Genera el build de Stencil y la documentacion tecnica de componentes.

```bash
npm run build:storybook
```

Limpia artefactos previos, genera Stencil y compila Storybook en `www/storybook`.

```bash
npm run build:netlify
```

Build completo para Netlify. La carpeta final publicada es `www`.

```bash
npm run test:spec
```

Ejecuta los tests spec con `@stencil/vitest` y coverage. El informe HTML queda en `coverage`.

```bash
npm run test:a11y
```

Ejecuta las pruebas automatizadas de accesibilidad con Playwright y axe-core contra la carpeta `www`. Requiere haber generado antes `www` con `npm run build:netlify`.

```bash
npm run test:a11y:build
```

Ejecuta `npm run build:netlify` y despues las pruebas automatizadas de accesibilidad.

```bash
npm run deploy:netlify
```

Flujo completo de despliegue: ejecuta specs con coverage, genera `www`, copia coverage a `www/coverage`, instala Chromium para Playwright si hace falta y ejecuta Playwright/a11y generando `www/test-report`.

```bash
npm run clean
```

Elimina `www`, `dist` y `loader`.

```bash
npm run test
```

Ejecuta specs de Stencil y pruebas a11y. Requiere que `www` exista para el paso a11y; para validacion completa usa `npm run deploy:netlify`.

## Estructura

```txt
.
├── .storybook/
│   ├── main.ts
│   └── preview.ts
├── src/
│   ├── components/
│   │   ├── atoms/
│   │   │   └── iv-button/
│   │   │       ├── iv-button.css
│   │   │       ├── iv-button.spec.tsx
│   │   │       ├── iv-button.stories.ts
│   │   │       └── iv-button.tsx
│   │   ├── molecules/
│   │   │   └── iv-dialog/
│   │   │       ├── iv-dialog.css
│   │   │       ├── iv-dialog.spec.tsx
│   │   │       ├── iv-dialog.stories.ts
│   │   │       └── iv-dialog.tsx
│   │   ├── organisms/
│   │   └── templates/
│   ├── demos/
│   │   ├── button.html
│   │   └── dialog.html
│   ├── docs/
│   │   ├── atomic-design.mdx
│   │   └── introduccion.mdx
│   ├── global/
│   │   └── tokens.css
│   ├── components.d.ts
│   └── index.html
├── netlify.toml
├── package.json
├── stencil.config.ts
└── tsconfig.json
```

## Stencil

La configuracion principal esta en `stencil.config.ts`.

```ts
export const config = {
  namespace: 'iv-basic-ds',
  globalStyle: 'src/global/tokens.css',
  outputTargets: [
    { type: 'www', serviceWorker: null },
    { type: 'dist', esmLoaderPath: '../loader' },
    { type: 'dist-custom-elements' },
  ],
};
```

Salidas principales:

- `www`: sitio estatico para Netlify.
- `www/build`: bundle CDN usado por la demo y consumidores externos.
- `dist`: salida de libreria Stencil.
- `dist-custom-elements`: custom elements individuales.

## Storybook

Storybook esta configurado en `.storybook/main.ts` y `.storybook/preview.ts`.

Addons activos:

- `@storybook/addon-docs`: Autodocs y paginas MDX.
- `@storybook/addon-a11y`: validaciones WCAG con axe-core.
- `@storybook/addon-themes`: selector de tema claro/oscuro por clases CSS.
- `storybook-addon-pseudo-states`: revision de estados `:hover`, `:focus`, `:active`, etc.
- `storybook-addon-tag-badges`: badges de tags como `stable` y `a11y`.

Durante el build estatico, Storybook queda dentro de:

```txt
www/storybook/
```

Los componentes se registran en Storybook cargando el bundle generado por Stencil:

```ts
import '../www/build/iv-basic-ds.esm.js';
```

Por eso los comandos de Storybook ejecutan primero el build de Stencil.

## Netlify

La configuracion esta en `netlify.toml`.

```toml
[build]
  command = "npm run build:netlify"
  publish = "www"
```

Netlify publica la carpeta `www`.

Rutas esperadas despues del deploy:

- `/`: demo HTML de Stencil.
- `/demos/button.html`: demo HTML del componente Button.
- `/demos/dialog.html`: demo HTML del componente Dialog.
- `/storybook/`: Storybook estatico.
- `/test-report/`: informe HTML de Playwright + axe-core.
- `/coverage/`: informe HTML de coverage de tests spec de Stencil.
- `/build/iv-basic-ds.esm.js`: bundle ESM para CDN.
- `/build/iv-basic-ds.js`: bundle legacy `nomodule`.
- `/build/iv-basic-ds.css`: estilos globales generados.

Los assets de `/build/*` tienen cache largo configurado:

```toml
Cache-Control = "public, max-age=31536000, immutable"
```

## CDN

Uso recomendado desde HTML:

```html
<script type="module" src="https://iv-basic-ds.netlify.app/build/iv-basic-ds.esm.js"></script>
<script nomodule src="https://iv-basic-ds.netlify.app/build/iv-basic-ds.js"></script>
```

Ejemplo:

```html
<iv-button variant="primary">Guardar</iv-button>
```

## Angular

El caso principal de integracion es Angular consumiendo los Web Components desde CDN.

Carga el bundle en `src/index.html` de la aplicacion Angular:

```html
<script type="module" src="https://iv-basic-ds.netlify.app/build/iv-basic-ds.esm.js"></script>
<script nomodule src="https://iv-basic-ds.netlify.app/build/iv-basic-ds.js"></script>
```

Habilita custom elements con `CUSTOM_ELEMENTS_SCHEMA`.

En un modulo:

```ts
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

@NgModule({
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule {}
```

En un componente standalone:

```ts
import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

@Component({
  selector: 'app-root',
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: '<iv-button variant="primary">Guardar</iv-button>',
})
export class AppComponent {}
```

Uso en templates Angular:

```html
<iv-button variant="primary">Guardar</iv-button>
<iv-button variant="secondary">Cancelar</iv-button>
<iv-button variant="ghost">Mas informacion</iv-button>
```

## Componentes

### Atoms

#### `iv-button`

Primer componente del DS.

Props:

- `variant`: `primary`, `secondary` o `ghost`.
- `type`: `button`, `submit` o `reset` cuando renderiza un `button` nativo.
- `disabled`: deshabilita el control.
- `href`: si se informa, renderiza un enlace en vez de un `button`.
- `target`: destino del enlace cuando se usa `href`.
- `rel`: relacion del enlace cuando se usa `href`; con `target="_blank"` se usa `noreferrer` por defecto si no se informa.
- `label`: nombre accesible cuando el contenido visible no es suficiente; se refleja en el host y se aplica como `aria-label` al control nativo interno.
- `labelled-by`: referencia al elemento que etiqueta el control; se aplica como `aria-labelledby` al control nativo interno.
- `described-by`: referencia al elemento que describe el control; se aplica como `aria-describedby` al control nativo interno.
- `controls`: identificador del elemento controlado por el boton; se aplica como `aria-controls` al control nativo interno.
- `expanded`: estado expandido para botones que controlan contenido desplegable; se aplica como `aria-expanded` al control nativo interno.
- `pressed`: estado pulsado para botones tipo toggle; admite `true`, `false` o `mixed` y se aplica como `aria-pressed` al control nativo interno.
- `has-popup`: indica que el boton abre un popup; admite `true`, `menu`, `listbox`, `tree`, `grid` o `dialog` y se aplica como `aria-haspopup` al control nativo interno.
- `current`: marca un enlace como item actual dentro de un conjunto; se aplica como `aria-current` al enlace interno.

Eventos:

- Usa el evento nativo `click`; no existe un evento custom `ivClick`.
- Cuando renderiza `<button>` o `<a>` internamente, el `click` burbujea hasta el host `<iv-button>`.
- Si `href` esta informado y `disabled` esta activo, el componente previene la navegacion y detiene el click.

Ejemplo HTML:

```html
<iv-button onclick="guardarCambios()">Guardar</iv-button>
```

Ejemplo Lit o Storybook:

```ts
html`<iv-button @click=${guardarCambios}>Guardar</iv-button>`
```

Ejemplos:

```html
<iv-button variant="primary">Primary</iv-button>
<iv-button variant="secondary">Secondary</iv-button>
<iv-button variant="ghost">Ghost</iv-button>
<iv-button disabled>Disabled</iv-button>
<iv-button href="/storybook/">Ir a Storybook</iv-button>
<iv-button controls="filters-panel" expanded="false">Filtros</iv-button>
<iv-button pressed="true" variant="secondary">Vista compacta</iv-button>
```

### Molecules

#### `iv-dialog`

Dialog accesible basado en el elemento nativo `dialog`. Usa la API nativa `showModal()`, `show()` y `close()` internamente.

Slots:

- `slot="header"`: cabecera o titulo visible del dialog.
- Slot por defecto: contenido principal.
- `slot="footer"`: acciones del dialog.

Props:

- `open`: controla si el dialog esta abierto.
- `modal`: usa `showModal()` cuando es `true`; usa `show()` cuando es `false`.
- `dialog-role`: `dialog` por defecto o `alertdialog` para confirmaciones criticas.
- `close-on-backdrop`: permite cerrar haciendo click en el backdrop modal.
- `close-on-escape`: permite cerrar con la tecla Escape.
- `return-value`: valor de retorno del dialog al cerrar.
- `initial-focus`: selector CSS del elemento que debe recibir foco inicial al abrir.
- `restore-focus`: devuelve el foco al invocador al cerrar; desactivado por defecto para evitar falsos focos en mobile y lectores de pantalla.
- `label`: nombre accesible si no hay titulo visible; se aplica como `aria-label` al dialog nativo interno.
- `labelled-by`: referencia al titulo visible del dialog; se aplica como `aria-labelledby` al dialog nativo interno.
- `described-by`: referencia al texto descriptivo del dialog; se aplica como `aria-describedby` al dialog nativo interno.

Metodos:

- `show()`: abre usando `HTMLDialogElement.show()`.
- `showModal()`: abre usando `HTMLDialogElement.showModal()`.
- `close(returnValue?: string)`: cierra usando `HTMLDialogElement.close()`.

Eventos:

- `ivOpen`: se emite al abrir.
- `ivClose`: se emite al cerrar e incluye `{ returnValue }`.
- `ivCancel`: se emite al recibir el evento nativo `cancel`.

Ejemplo:

```html
<iv-button has-popup="dialog">Abrir dialog</iv-button>

<iv-dialog id="confirm-dialog" labelled-by="confirm-title" described-by="confirm-description">
  <h2 slot="header" id="confirm-title">Confirmar accion</h2>
  <p id="confirm-description">Esta accion no se puede deshacer.</p>
  <div slot="footer">
    <iv-button variant="ghost">Cancelar</iv-button>
    <iv-button>Confirmar</iv-button>
  </div>
</iv-dialog>
```

Variantes accesibles incluidas en Storybook y en `/demos/dialog.html`:

- Modal etiquetado con `labelled-by` y `described-by`.
- Modal sin titulo visible usando `label`.
- `alertdialog` para acciones criticas.
- Modal sin cierre accidental con `close-on-backdrop=false` y `close-on-escape=false`.
- Dialog no modal usando `show()`.
- Dialog con contenido largo y scroll interno.

Compatibilidad:

- El componente registra `dialog-polyfill` cuando el navegador no soporta `HTMLDialogElement.showModal()`.
- El polyfill cubre navegadores antiguos modernos e IE9+, con las limitaciones propias del polyfill: evitar que el dialog viva dentro de contenedores que creen stacking context si se necesita posicionamiento modal perfecto.
- Por defecto no se fuerza foco programatico. `initial-focus` y `restore-focus` son opt-in para casos donde se haya validado el comportamiento con teclado y tecnologias asistivas.

## Tokens

Los tokens globales estan en `src/global/tokens.css` y se exponen como CSS Custom Properties.

Ejemplos:

```css
:root {
  --iv-color-primary: #2563eb;
  --iv-color-text: #102a43;
  --iv-color-background: #ffffff;
  --iv-radius-md: 0.625rem;
  --iv-space-md: 1rem;
}
```

Los componentes consumen estos tokens con `var(...)`, por lo que una aplicacion consumidora puede sobrescribirlos si necesita tematizar.

## Convenciones

- Prefijo de componentes: `iv-`.
- Modelo atomico obligatorio para componentes nuevos: `atoms`, `molecules`, `organisms` o `templates`.
- Ubicacion de componentes: `src/components/<atomic-level>/<component>/`.
- Los tags publicos no incluyen el nivel atomico: usar `iv-dialog`, no `iv-molecule-dialog`.
- Los titulos de Storybook si reflejan el nivel: `Atoms/Button`, `Molecules/Dialog`, etc.
- Componentes sin Shadow DOM: `shadow: false`.
- Clases CSS prefijadas con `iv-` para reducir colisiones.
- Tokens globales con prefijo `--iv-`.
- Diseno siempre mobile-first: la base CSS debe resolver pantallas pequenas y los ajustes para pantallas mayores deben ir con `@media (min-width: ...)`.
- Los botones no deben ser full-width por defecto; solo pueden ocupar todo el ancho dentro de layouts o contextos de acciones, como footers de dialog o stacks de demo.
- Cuando un componente renderiza un control nativo interno, las props publicas deben ser semanticas y reflejadas, no atributos `aria-*` como API principal. El ARIA real debe aplicarse solo al control nativo interno para evitar duplicacion en lectores de pantalla.
- Stories junto al componente: `src/components/<atomic-level>/<component>/<component>.stories.ts`.
- Estilos del componente junto al componente: `src/components/<atomic-level>/<component>/<component>.css`.
- Specs junto al componente: `src/components/<atomic-level>/<component>/<component>.spec.tsx`.

Ejemplo base de componente:

```tsx
import { Component, h } from '@stencil/core';

@Component({
  tag: 'iv-example',
  styleUrl: 'iv-example.css',
  shadow: false,
})
export class IvExample {
  render() {
    return <div class="iv-example"><slot /></div>;
  }
}
```

## Accesibilidad

El proyecto evita Shadow DOM por defecto para reducir fricciones con herramientas de accesibilidad, formularios, estilos globales y aplicaciones Angular consumidoras.

Validacion automatizada:

- Storybook usa `@storybook/addon-a11y` para inspeccion visual con axe-core durante desarrollo.
- Playwright usa `@axe-core/playwright` para pruebas automatizadas contra la build local en `www`.
- Ejecuta `npm run deploy:netlify` antes de subir cambios que creen o modifiquen componentes.
- Los tests spec viven junto al componente y deben cubrir render, props, ARIA y comportamiento publico basico.
- Los tests a11y viven en `tests/a11y/` y deben cubrir los estados principales de cada componente.
- El informe a11y se publica en `/test-report/` y el coverage spec se publica en `/coverage/`.

Consideraciones al crear componentes:

- Usar elementos HTML semanticos siempre que sea posible.
- Mantener foco visible con `:focus-visible`.
- Reflejar estados importantes como `disabled` cuando aplique.
- Evitar reemplazar controles nativos si no es necesario.
- Documentar variantes y estados en Storybook.
- Añadir o actualizar pruebas Axe con Playwright para estados relevantes.

## Flujo Recomendado Para Nuevos Componentes

1. Clasificar el componente como atom, molecule, organism o template.
2. Crear carpeta en `src/components/<atomic-level>/<nombre>`.
3. Crear `<nombre>.tsx` con `shadow: false`.
4. Crear `<nombre>.css` con clases prefijadas.
5. Crear `<nombre>.stories.ts` con titulo Storybook acorde al nivel atomico.
6. Crear `<nombre>.spec.tsx` junto al componente.
7. Crear o actualizar una demo HTML en `src/demos/` y enlazarla desde `src/index.html`.
8. Crear o actualizar tests en `tests/a11y/` para la demo y estados interactivos principales.
9. Ejecutar `npm run start` para revisar Stencil y Storybook.
10. Ejecutar `npm run deploy:netlify` antes de desplegar.

## Build Final

```bash
npm run deploy:netlify
```

Resultado:

```txt
www/
├── build/
│   ├── iv-basic-ds.esm.js
│   ├── iv-basic-ds.js
│   └── iv-basic-ds.css
├── demos/
│   ├── button.html
│   └── dialog.html
├── storybook/
├── test-report/
├── coverage/
└── index.html
```

## Notas

- El paquete es `private: true` porque la distribucion inicial sera por CDN en Netlify, no por npm.
- Storybook puede mostrar un warning de chunk grande durante el build; es normal en el bundle de la propia UI de Storybook y no bloquea el despliegue.
- Si cambia el nombre final del sitio en Netlify, actualiza las URLs de ejemplo `https://iv-basic-ds.netlify.app`.
