import './eslint.typescript.cjs';
import js from '@eslint/js';
import { defineConfig } from 'eslint/config';
import stylistic from '@stylistic/eslint-plugin';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default defineConfig(
  {
    ignores: ['dist/', 'storybook-static/', 'public/', 'node_modules/'],
  },

  js.configs.recommended,
  ...tseslint.configs.recommended,
  ...tseslint.configs.stylistic,
  react.configs.flat.recommended,
  react.configs.flat['jsx-runtime'],

  {
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: { ...globals.browser },
    },
    settings: { react: { version: 'detect' } },
    plugins: {
      '@stylistic': stylistic,
      'react-hooks': reactHooks,
    },
    rules: {
      ...stylistic.configs.customize({
        indent: 2,
        quotes: 'single',
        semi: true,
        jsx: true,
        braceStyle: '1tbs',
        arrowParens: true,
        commaDangle: 'always-multiline',
        quoteProps: 'as-needed',
      }).rules,
      '@stylistic/max-len': ['error', {
        code: 120,
        ignoreStrings: true,
        ignoreTemplateLiterals: true,
        ignoreUrls: true,
        ignoreRegExpLiterals: true,
      }],
      '@stylistic/max-statements-per-line': ['error', { max: 2 }],
      '@stylistic/brace-style': ['error', '1tbs', { allowSingleLine: true }],
      '@stylistic/jsx-one-expression-per-line': 'off',
      '@stylistic/jsx-curly-brace-presence': ['error', { props: 'never', children: 'never' }],
      '@stylistic/multiline-ternary': 'off',
      '@stylistic/operator-linebreak': ['error', 'before', { overrides: { '=': 'after' } }],
      '@stylistic/no-multiple-empty-lines': ['error', { max: 1, maxEOF: 0, maxBOF: 0 }],
      '@stylistic/eol-last': ['error', 'always'],
      '@stylistic/member-delimiter-style': ['error', {
        multiline: { delimiter: 'semi', requireLast: true },
        singleline: { delimiter: 'semi', requireLast: false },
      }],

      'no-restricted-syntax': ['error',
        {
          selector: 'FunctionDeclaration',
          message: 'Используйте стрелочную функцию: const name = (...) => ...',
        },
        {
          selector: 'FunctionExpression:not(Property[method=true] > FunctionExpression, MethodDefinition > FunctionExpression)',
          message: 'Используйте стрелочную функцию.',
        },
        {
          selector: 'TSEnumDeclaration',
          message: 'Вместо enum — union строковых литералов: type Mode = \'view\' | \'edit\'.',
        },
        {
          selector: 'ExportDefaultDeclaration',
          message: 'Только именованные экспорты. export default — для сторис, конфигов и *.d.ts.',
        },
      ],
      'prefer-arrow-callback': 'error',
      'arrow-body-style': ['error', 'as-needed'],
      'react/function-component-definition': ['error', {
        namedComponents: 'arrow-function',
        unnamedComponents: 'arrow-function',
      }],

      'no-var': 'error',
      'prefer-const': 'error',
      eqeqeq: ['error', 'always'],
      'object-shorthand': ['error', 'always'],
      'prefer-template': 'error',
      'no-nested-ternary': 'off',
      'no-negated-condition': 'error',
      'no-console': 'warn',
      curly: ['error', 'multi-line'],

      '@typescript-eslint/consistent-type-imports': ['error', {
        prefer: 'type-imports',
        fixStyle: 'inline-type-imports',
      }],
      '@typescript-eslint/no-import-type-side-effects': 'error',
      '@typescript-eslint/consistent-type-definitions': ['error', 'interface'],
      '@typescript-eslint/array-type': ['error', { default: 'array' }],
      '@typescript-eslint/consistent-indexed-object-style': ['error', 'record'],
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
      '@typescript-eslint/no-explicit-any': 'error',

      'react/prop-types': 'off',
      'react/jsx-fragments': ['error', 'syntax'],
      'react/self-closing-comp': 'error',
      'react/jsx-boolean-value': ['error', 'never'],
      'react/jsx-no-useless-fragment': ['error', { allowExpressions: true }],
      'react/no-array-index-key': 'error',
      'react/jsx-pascal-case': 'error',
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'error',
    },
  },

  {
    files: ['**/*.stories.tsx', '.storybook/**', '**/*.d.ts', 'eslint.config.js'],
    rules: {
      'no-restricted-syntax': ['error',
        { selector: 'FunctionDeclaration', message: 'Используйте стрелочную функцию.' },
        { selector: 'TSEnumDeclaration', message: 'Вместо enum — union строковых литералов.' },
      ],
    },
  },

  {
    files: ['*.mjs', '*.cjs', '*.js', '.storybook/main.ts'],
    languageOptions: { globals: { ...globals.node } },
    rules: { 'no-console': 'off' },
  },
  {
    files: ['*.cjs'],
    languageOptions: { sourceType: 'commonjs' },
    rules: { '@typescript-eslint/no-require-imports': 'off' },
  },
);
