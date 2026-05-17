import { addons } from 'storybook/manager-api';
import { ivStorybookTheme } from './theme';

addons.setConfig({
  theme: ivStorybookTheme,
  sidebar: {
    showRoots: true,
  },
  toolbar: {
    title: { hidden: false },
  },
});
