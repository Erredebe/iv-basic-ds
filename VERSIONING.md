# Versionado De Componentes CDN

Este monorepo publica componentes por CDN desde Netlify. Cada componente tiene su propia version y cada version publicada debe quedar congelada.

## Versiones Publicadas

Las rutas publicas siguen este formato:

```txt
/components/<component>/<version>/build/<component>.esm.js
```

Ejemplo:

```txt
/components/iv-button/0.0.2/build/iv-button.esm.js
```

El source actual de un paquete representa su version vigente. Las versiones anteriores se conservan como artefactos historicos en `version-fixtures/components` para que Netlify siga publicandolas.

## Dependencias Entre Componentes

Cuando un componente compuesto depende de otro componente, debe declarar y documentar la version exacta que usa.

Ejemplo inicial:

```txt
iv-button@0.0.2
iv-card-action@0.0.1 depende de iv-button@0.0.2
```

Sus rutas CDN serian:

```html
<script type="module" src="/components/iv-button/0.0.2/build/iv-button.esm.js"></script>
<script type="module" src="/components/iv-card-action/0.0.1/build/iv-card-action.esm.js"></script>
```

## Cambios Transitivos

Si `iv-button` sube a `0.0.3`, no necesariamente hay que subir todos los componentes que lo usan.

Solo se versiona el componente dependiente cuando cambia su contrato, implementacion, documentacion o build para usar la nueva version de la dependencia.

Ejemplo:

```txt
iv-button@0.0.3
iv-card-action@0.0.2 depende de iv-button@0.0.3
```

Las rutas quedarian:

```html
<script type="module" src="/components/iv-button/0.0.3/build/iv-button.esm.js"></script>
<script type="module" src="/components/iv-card-action/0.0.2/build/iv-card-action.esm.js"></script>
```

La combinacion anterior sigue viva:

```html
<script type="module" src="/components/iv-button/0.0.2/build/iv-button.esm.js"></script>
<script type="module" src="/components/iv-card-action/0.0.1/build/iv-card-action.esm.js"></script>
```

## Reglas

- No reescribir una version publicada.
- Un componente compuesto debe cargar versiones exactas de sus dependencias CDN.
- Si una dependencia cambia pero el componente consumidor no cambia, no se publica una nueva version del consumidor.
- Si el consumidor adopta una nueva version de la dependencia, se publica una nueva version del consumidor.
- Las versiones historicas se conservan en `version-fixtures/components`.
- El build de Netlify copia fixtures historicos y despues genera la version actual desde `packages/<atomic-level>/<component>`.

## Criterio Practico

Subir version del componente dependiente cuando:

- Usa una nueva API de la dependencia.
- Cambia su comportamiento visual o funcional por la dependencia.
- Cambia su documentacion CDN para apuntar a una nueva dependencia.
- Necesita garantizar una combinacion especifica de versiones.

No subir version del componente dependiente cuando:

- La dependencia cambia internamente pero el consumidor no se recompila ni modifica.
- La version anterior del consumidor debe seguir usando su dependencia historica congelada.
