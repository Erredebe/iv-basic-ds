import { Config } from '@stencil/core';

export const config: Config = {
  namespace: 'iv-button',
  globalStyle: '../../foundations/tokens/src/tokens.css',
  testing: {
    testRegex: '(/src/.*\\.spec\\.(tsx|ts))$',
  },
  outputTargets: [
    { type: 'www', serviceWorker: null },
    { type: 'dist', esmLoaderPath: '../loader' },
    { type: 'dist-custom-elements' },
  ],
};
