import type { ViewerVersion } from '../models/history-viewer.models';

export const supportedVersions: ViewerVersion[] = [
  {
    component: 'iv-button',
    version: '0.0.1',
    title: 'iv-button 0.0.1',
    status: 'Inicial',
    description: 'Primer bundle publico del boton con variantes primary, secondary, ghost y disabled.',
    variants: ['primary', 'secondary', 'ghost'],
    cdnUrl: '/components/iv-button/0.0.1/build/iv-button.esm.js',
  },
  {
    component: 'iv-button',
    version: '0.0.2',
    title: 'iv-button 0.0.2',
    status: 'Actual',
    description: 'Version actual del boton con variante destructiva danger.',
    variants: ['primary', 'secondary', 'ghost', 'danger'],
    cdnUrl: '/components/iv-button/0.0.2/build/iv-button.esm.js',
  },
];
