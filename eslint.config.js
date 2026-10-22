// Подменяет TypeScript для typescript-eslint — должен идти первым (см. файл).
import './eslint.typescript.cjs';
import js from '@eslint/js';
import { defineConfig } from 'eslint/config';
import stylistic from '@stylistic/eslint-plugin';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import globals from 'globals';
import tseslint from 'typescript-eslint';

/**
 * Стиль проекта. Подробное описание с примерами — docs/code-style.md.
 * Правила описывают уже принятый в коде стиль; новое правило — только вместе с правкой кода под него.
 */
export default defineConfig(
  {
    ignores: ['dist/', 'storybook-static/', 'public/', 'node_modules/'],
  },

  // ─── Базовые наборы ────────────────────────────────────────────────────────
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
      // ─── Форматирование (вместо Prettier) ──────────────────────────────────
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
      // строка — до 120 символов; длинные строковые литералы (имена файлов в моках, сообщения) не переносим
      '@stylistic/max-len': ['error', {
        code: 120,
        ignoreStrings: true,
        ignoreTemplateLiterals: true,
        ignoreUrls: true,
        ignoreRegExpLiterals: true,
      }],
      // `if (!x) return null;` и `for (…) list.sort(…);` в одну строку — норма
      '@stylistic/max-statements-per-line': ['error', { max: 2 }],
      // короткие однострочные блоки допустимы: `{ field: 'signType', title: '…' }`, `() => {}`
      '@stylistic/brace-style': ['error', '1tbs', { allowSingleLine: true }],
      // в JSX текст и выражения можно ставить в одну строку: `<><FolderIcon /> {row.name}</>`
      '@stylistic/jsx-one-expression-per-line': 'off',
      // `className="x"`, не `className={'x'}`; `<p>текст</p>`, не `<p>{'текст'}</p>`
      '@stylistic/jsx-curly-brace-presence': ['error', { props: 'never', children: 'never' }],
      // `cond ? a : b` в одну строку, если помещается; многострочные ветки — в скобках:
      // `return cond ? (\n  <A />\n) : (\n  value\n);`. Правило так не умеет, поэтому выключено
      '@stylistic/multiline-ternary': 'off',
      // перенос длинного выражения — оператором в начале новой строки (`? :`, `&&`, `||`, `+`);
      // исключение — `=` остаётся в конце: `export type Row =\n  | A\n  | B`
      '@stylistic/operator-linebreak': ['error', 'before', { overrides: { '=': 'after' } }],
      // не больше одной пустой строки подряд, в конце файла — перевод строки
      '@stylistic/no-multiple-empty-lines': ['error', { max: 1, maxEOF: 0, maxBOF: 0 }],
      '@stylistic/eol-last': ['error', 'always'],
      // поля интерфейсов — через `;`, в однострочном типе последний `;` не нужен: `{ a: string; b: number }`
      '@stylistic/member-delimiter-style': ['error', {
        multiline: { delimiter: 'semi', requireLast: true },
        singleline: { delimiter: 'semi', requireLast: false },
      }],

      // ─── Функции ───────────────────────────────────────────────────────────
      // только стрелочные функции: `const f = () => …`. `function` — нигде,
      // кроме сокращённых методов объекта (`show() {}` в createModalManager)
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
      // стрелка с выражением вместо `{ return … }`, если тело — одно выражение
      'arrow-body-style': ['error', 'as-needed'],
      'react/function-component-definition': ['error', {
        namedComponents: 'arrow-function',
        unnamedComponents: 'arrow-function',
      }],

      // ─── Переменные и выражения ────────────────────────────────────────────
      'no-var': 'error',
      'prefer-const': 'error',
      eqeqeq: ['error', 'always'],
      'object-shorthand': ['error', 'always'],
      'prefer-template': 'error',
      'no-nested-ternary': 'off',
      // без отрицания в условии с веткой «иначе»: `if (x) a; else b;`, не `if (!x) b; else a;`;
      // `a === b ? x : y`, не `a !== b ? y : x`. Ранний выход `if (!x) return;` — можно
      'no-negated-condition': 'error',
      'no-console': 'warn',
      // фигурные скобки обязательны, если тело на нескольких строках; `if (x) return;` — можно без них
      curly: ['error', 'multi-line'],

      // ─── TypeScript ────────────────────────────────────────────────────────
      // типы импортируются с `type`: `import type { X }` или `import { useMemo, type ReactNode }`
      '@typescript-eslint/consistent-type-imports': ['error', {
        prefer: 'type-imports',
        fixStyle: 'inline-type-imports',
      }],
      '@typescript-eslint/no-import-type-side-effects': 'error',
      // объектные типы — через interface; type — для union, кортежей, условных и производных типов
      '@typescript-eslint/consistent-type-definitions': ['error', 'interface'],
      // массивы — `T[]`, не `Array<T>`
      '@typescript-eslint/array-type': ['error', { default: 'array' }],
      // словари — `Record<K, V>`, не индексная сигнатура
      '@typescript-eslint/consistent-indexed-object-style': ['error', 'record'],
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
      '@typescript-eslint/no-explicit-any': 'error',

      // ─── React ─────────────────────────────────────────────────────────────
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

  // export default — только там, где его требует инструмент
  {
    files: ['**/*.stories.tsx', '.storybook/**', '**/*.d.ts', 'eslint.config.js'],
    rules: {
      'no-restricted-syntax': ['error',
        { selector: 'FunctionDeclaration', message: 'Используйте стрелочную функцию.' },
        { selector: 'TSEnumDeclaration', message: 'Вместо enum — union строковых литералов.' },
      ],
    },
  },

  // Node-скрипты (сборка, запуск, конфиги)
  {
    files: ['*.mjs', '*.cjs', '*.js', '.storybook/main.ts'],
    languageOptions: { globals: { ...globals.node } },
    // скрипты сборки и запуска пишут в консоль
    rules: { 'no-console': 'off' },
  },
  {
    files: ['*.cjs'],
    languageOptions: { sourceType: 'commonjs' },
    rules: { '@typescript-eslint/no-require-imports': 'off' },
  },
);
