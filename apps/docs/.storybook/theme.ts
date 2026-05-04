import { create } from 'storybook/theming/create';

export const ivStorybookTheme = create({
  base: 'light',

  brandTitle: 'IV Basic DS',
  brandUrl: '/',
  brandTarget: '_self',

  colorPrimary: '#2563eb',
  colorSecondary: '#0f766e',

  appBg: '#eef4ff',
  appContentBg: '#ffffff',
  appPreviewBg: '#f8fafc',
  appBorderColor: '#d9e2ec',
  appBorderRadius: 12,

  barBg: '#ffffff',
  barTextColor: '#52606d',
  barSelectedColor: '#2563eb',
  barHoverColor: '#1d4ed8',

  fontBase: 'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  fontCode: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace',

  textColor: '#102a43',
  textInverseColor: '#ffffff',

  inputBg: '#ffffff',
  inputBorder: '#cbd5e1',
  inputTextColor: '#102a43',
  inputBorderRadius: 8,
});
