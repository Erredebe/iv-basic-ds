import { withThemeByClassName } from '@storybook/addon-themes';
import '../www/build/iv-basic-ds.esm.js';
import '../src/global/tokens.css';
import './preview.css';

export const decorators = [
  withThemeByClassName({
    themes: {
      light: 'iv-storybook-theme-light',
      dark: 'iv-storybook-theme-dark',
    },
    defaultTheme: 'light',
  }),
];

export const parameters = {
  a11y: {
    context: '#storybook-root',
  },
  backgrounds: {
    options: {
      light: { name: 'Light', value: '#ffffff' },
      neutral: { name: 'Neutral', value: '#f8fafc' },
      dark: { name: 'Dark', value: '#0f172a' },
    },
  },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/i,
    },
  },
  docs: {
    toc: true,
  },
  options: {
    storySort: {
      order: ['Introduccion', 'Guia', 'Components'],
    },
  },
  viewport: {
    options: {
      mobile: {
        name: 'Mobile',
        styles: { width: '390px', height: '844px' },
      },
      tablet: {
        name: 'Tablet',
        styles: { width: '768px', height: '1024px' },
      },
      desktop: {
        name: 'Desktop',
        styles: { width: '1280px', height: '800px' },
      },
    },
  },
};
