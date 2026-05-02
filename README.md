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
npm run clean
```

Elimina `www`, `dist` y `loader`.

```bash
npm run test
```

Ejecuta tests de Stencil. Actualmente el repo todavia no incluye specs ni e2e iniciales.

## Estructura

```txt
.
├── .storybook/
│   ├── main.ts
│   └── preview.ts
├── src/
│   ├── components/
│   │   └── iv-button/
│   │       ├── iv-button.css
│   │       ├── iv-button.stories.ts
│   │       └── iv-button.tsx
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
- `/storybook/`: Storybook estatico.
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

### `iv-button`

Primer componente del DS.

Props:

- `variant`: `primary`, `secondary` o `ghost`.
- `disabled`: deshabilita el control.
- `href`: si se informa, renderiza un enlace en vez de un `button`.

Ejemplos:

```html
<iv-button variant="primary">Primary</iv-button>
<iv-button variant="secondary">Secondary</iv-button>
<iv-button variant="ghost">Ghost</iv-button>
<iv-button disabled>Disabled</iv-button>
<iv-button href="/storybook/">Ir a Storybook</iv-button>
```

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
- Componentes sin Shadow DOM: `shadow: false`.
- Clases CSS prefijadas con `iv-` para reducir colisiones.
- Tokens globales con prefijo `--iv-`.
- Stories junto al componente: `src/components/<component>/<component>.stories.ts`.
- Estilos del componente junto al componente: `src/components/<component>/<component>.css`.

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

Consideraciones al crear componentes:

- Usar elementos HTML semanticos siempre que sea posible.
- Mantener foco visible con `:focus-visible`.
- Reflejar estados importantes como `disabled` cuando aplique.
- Evitar reemplazar controles nativos si no es necesario.
- Documentar variantes y estados en Storybook.

## Flujo Recomendado Para Nuevos Componentes

1. Crear carpeta en `src/components/<nombre>`.
2. Crear `<nombre>.tsx` con `shadow: false`.
3. Crear `<nombre>.css` con clases prefijadas.
4. Crear `<nombre>.stories.ts`.
5. Añadir ejemplo en `src/index.html` si debe aparecer en la demo Stencil.
6. Ejecutar `npm run start` para revisar Stencil y Storybook.
7. Ejecutar `npm run build:netlify` antes de desplegar.

## Build Final

```bash
npm run build:netlify
```

Resultado:

```txt
www/
├── build/
│   ├── iv-basic-ds.esm.js
│   ├── iv-basic-ds.js
│   └── iv-basic-ds.css
├── storybook/
└── index.html
```

## Notas

- El paquete es `private: true` porque la distribucion inicial sera por CDN en Netlify, no por npm.
- Storybook puede mostrar un warning de chunk grande durante el build; es normal en el bundle de la propia UI de Storybook y no bloquea el despliegue.
- Si cambia el nombre final del sitio en Netlify, actualiza las URLs de ejemplo `https://iv-basic-ds.netlify.app`.
