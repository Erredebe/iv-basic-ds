import js from '@eslint/js';
import sonarjs from 'eslint-plugin-sonarjs';
import globals from 'globals';
import tseslint from 'typescript-eslint';

const complexityLimit = 12;

export default tseslint.config(
  {
    ignores: ['coverage/**', 'dist/**', 'loader/**', 'node_modules/**', 'www/**'],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  sonarjs.configs.recommended,
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2022,
      globals: {
        ...globals.browser,
        ...globals.node,
      },
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    rules: {
      complexity: ['error', complexityLimit],
      'max-depth': ['error', 4],
      '@typescript-eslint/no-unused-vars': ['error', { varsIgnorePattern: '^h$' }],
      'sonarjs/unused-import': 'off',
      'sonarjs/cognitive-complexity': ['error', complexityLimit],
    },
  },
  {
    files: ['**/*.cjs'],
    languageOptions: {
      ecmaVersion: 2022,
      globals: {
        ...globals.node,
      },
      sourceType: 'commonjs',
    },
    rules: {
      '@typescript-eslint/no-require-imports': 'off',
    },
  },
  {
    files: ['**/*.spec.{ts,tsx}', 'tests/**/*.ts'],
    languageOptions: {
      globals: {
        ...globals.jest,
      },
    },
  },
);
