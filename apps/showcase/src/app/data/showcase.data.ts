import type { ComponentHistory, CurrentComponent } from '../models/showcase.models';

export const currentComponents: CurrentComponent[] = [
  { name: 'Button', tag: 'iv-button', level: 'Atom', summary: 'Acciones nativas y enlaces con variantes visuales.' },
  { name: 'Icon', tag: 'iv-icon', level: 'Atom', summary: 'Iconografia SVG decorativa o con nombre accesible.' },
  { name: 'Input', tag: 'iv-input', level: 'Atom', summary: 'Campo de texto con label, ayuda, error y eventos.' },
  { name: 'Textarea', tag: 'iv-textarea', level: 'Atom', summary: 'Entrada multilinea con estado, ayuda y validacion visual.' },
  { name: 'Dialog', tag: 'iv-dialog', level: 'Molecule', summary: 'Modal nativo con API publica y eventos Stencil.' },
];

export const componentHistories: ComponentHistory[] = [
  {
    name: 'Button',
    tag: 'iv-button',
    level: 'Atoms',
    description: 'Historico versionado del boton publicado por CDN.',
    versions: [
      {
        version: '0.0.1',
        status: 'Inicial',
        releaseNotes: 'Primer bundle publico con variantes primary, secondary, ghost y disabled.',
        demoUrl: 'history-viewer/?component=iv-button&version=0.0.1',
        cdnUrl: '/components/iv-button/0.0.1/build/iv-button.esm.js',
      },
      {
        version: '0.0.2',
        status: 'Actual',
        releaseNotes: 'Agrega la variante danger y mantiene la API publica del boton.',
        demoUrl: 'history-viewer/?component=iv-button&version=0.0.2',
        cdnUrl: '/components/iv-button/0.0.2/build/iv-button.esm.js',
      },
    ],
  },
  {
    name: 'Icon',
    tag: 'iv-icon',
    level: 'Atoms',
    description: 'Sin versiones historicas publicadas todavia.',
    versions: [],
  },
  {
    name: 'Input',
    tag: 'iv-input',
    level: 'Atoms',
    description: 'Sin versiones historicas publicadas todavia.',
    versions: [],
  },
  {
    name: 'Textarea',
    tag: 'iv-textarea',
    level: 'Atoms',
    description: 'Sin versiones historicas publicadas todavia.',
    versions: [],
  },
  {
    name: 'Dialog',
    tag: 'iv-dialog',
    level: 'Molecules',
    description: 'Sin versiones historicas publicadas todavia.',
    versions: [],
  },
];
