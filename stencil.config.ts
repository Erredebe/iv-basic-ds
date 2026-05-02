import { Config } from '@stencil/core';

export const config: Config = {
  namespace: 'iv-basic-ds',
  globalStyle: 'src/global/tokens.css',
  outputTargets: [
    {
      type: 'www',
      serviceWorker: null,
      copy: [
        { src: 'assets', warn: false },
        { src: 'demos', warn: false },
      ],
    },
    {
      type: 'dist',
      esmLoaderPath: '../loader',
    },
    {
      type: 'dist-custom-elements',
    },
  ],
};
