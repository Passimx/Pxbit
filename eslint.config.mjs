import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';
import prettier from 'eslint-config-prettier/flat';

export default defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    rules: {
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      eqeqeq: ['error', 'smart'],
      '@typescript-eslint/consistent-type-imports': ['error', { fixStyle: 'inline-type-imports' }],
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
      'import/order': [
        'error',
        {
          groups: ['builtin', 'external', 'internal', ['parent', 'sibling', 'index']],
          pathGroups: [{ pattern: '@/**', group: 'internal' }],
          'newlines-between': 'always',
          alphabetize: { order: 'asc', caseInsensitive: true },
        },
      ],
      // Запрещаем глубокие импорты из фич: снаружи используем только публичный index.ts.
      'no-restricted-imports': [
        'error',
        {
          patterns: [{ group: ['@/features/*/*'], message: 'Импортируйте фичу через её index.ts: @/features/<name>' }],
        },
      ],
    },
  },
  {
    // Внутри store допустим прямой импорт слайсов, чтобы не тянуть клиентские компоненты.
    files: ['src/store/**'],
    rules: { 'no-restricted-imports': 'off' },
  },
  // Отключает правила, которые конфликтуют с Prettier. Должен идти последним.
  prettier,
  globalIgnores(['.next/**', 'out/**', 'build/**', 'coverage/**', 'next-env.d.ts']),
]);
