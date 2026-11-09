import withNuxt from './.nuxt/eslint.config.mjs';
import prettier from 'eslint-config-prettier/flat';

export default withNuxt(
  {
    name: 'portfolio/ignores',
    ignores: ['.local/**', '.output/**', '.nuxt/**', 'coverage/**'],
  },
  {
    name: 'portfolio/quality',
    rules: {
      eqeqeq: ['error', 'always'],
      curly: ['error', 'all'],
      'padding-line-between-statements': [
        'error',
        { blankLine: 'always', prev: 'import', next: '*' },
        { blankLine: 'any', prev: 'import', next: 'import' },
        {
          blankLine: 'always',
          prev: '*',
          next: ['return', 'if', 'for', 'try', 'function', 'class', 'export'],
        },
        { blankLine: 'always', prev: 'block-like', next: '*' },
        { blankLine: 'always', prev: ['const', 'let'], next: 'expression' },
      ],
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'vue/multi-word-component-names': 'off',
      'vue/no-multiple-template-root': 'off',
      'vue/no-mutating-props': 'error',
      'vue/no-v-html': 'error',
      'vue/require-v-for-key': 'error',
    },
  },
  {
    name: 'portfolio/typescript',
    files: ['**/*.{ts,vue}'],
    rules: {
      '@typescript-eslint/consistent-type-imports': [
        'error',
        { prefer: 'type-imports' },
      ],
    },
  },
  prettier,
);
