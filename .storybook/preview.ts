import { withThemeByClassName } from '@storybook/addon-themes';
import { ivStorybookTheme } from './theme';
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
    options: {
      runOnly: {
        type: 'tag',
        values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'],
      },
    },
  },
  backgrounds: {
    options: {
      canvas: { name: 'Canvas', value: '#eef4ff' },
      surface: { name: 'Surface', value: '#ffffff' },
      dark: { name: 'Dark', value: '#0f172a' },
    },
    grid: {
      cellSize: 8,
      cellAmount: 4,
      opacity: 0.18,
    },
  },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/i,
    },
  },
  docs: {
    theme: ivStorybookTheme,
    toc: true,
  },
  layout: 'centered',
  options: {
    storySort: {
      order: ['Introduccion', 'Guia', 'Atoms', ['Button'], 'Molecules', ['Dialog'], 'Organisms', 'Templates'],
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

export const initialGlobals = {
  backgrounds: { value: 'canvas' },
};
