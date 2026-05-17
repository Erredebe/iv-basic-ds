import { defineVitestConfig } from '@stencil/vitest/config';
import { stencilVitestPlugin } from '@stencil/vitest/plugin';

export default defineVitestConfig({
  stencilConfig: './stencil.config.ts',
  test: {
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'lcov'],
      reportsDirectory: 'coverage',
      include: ['src/components/**/*.{ts,tsx}'],
      exclude: ['src/**/*.spec.{ts,tsx}', 'src/**/*.stories.ts'],
    },
    projects: [
      {
        plugins: [stencilVitestPlugin()],
        test: {
          name: 'spec',
          include: ['src/**/*.spec.{ts,tsx}'],
          environment: 'stencil',
          globals: true,
          setupFiles: ['./vitest.setup.ts'],
        },
      },
    ],
  },
});
