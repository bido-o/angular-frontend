// @ts-check
const eslint = require('@eslint/js');
const { defineConfig } = require('eslint/config');
const tseslint = require('typescript-eslint');
const angular = require('angular-eslint');
const boundaries = require('eslint-plugin-boundaries');

module.exports = defineConfig([
  {
    files: ['**/*.ts'],
    extends: [
      eslint.configs.recommended,
      tseslint.configs.recommended,
      tseslint.configs.stylistic,
      angular.configs.tsRecommended,
    ],
    processor: angular.processInlineTemplates,
    rules: {
      '@angular-eslint/directive-selector': [
        'error',
        { type: 'attribute', prefix: 'bido', style: 'camelCase' },
      ],
      '@angular-eslint/component-selector': [
        'error',
        { type: 'element', prefix: 'bido', style: 'kebab-case' },
      ],
    },
  },
  {
    files: ['**/*.html'],
    extends: [angular.configs.templateRecommended, angular.configs.templateAccessibility],
    rules: {},
  },

  // Architecture: api <- domain <- features, with shared and core available to all.
  {
    files: ['src/app/**/*.ts'],
    plugins: { boundaries },
    settings: {
      'import/resolver': { typescript: { project: './tsconfig.json' } },
      'boundaries/elements': [
        { type: 'api', pattern: 'src/app/api/*', capture: ['service'] },
        { type: 'domain', pattern: 'src/app/domain/*', capture: ['service'] },
        { type: 'feature', pattern: 'src/app/features/*', capture: ['area'] },
        { type: 'shared', pattern: 'src/app/shared' },
        { type: 'core', pattern: 'src/app/core' },
      ],
    },
    rules: {
      'boundaries/dependencies': [
        2,
        {
          default: 'disallow',
          policies: [
            // api: generated clients and thin wrappers, depend on nothing in the app but core
            { from: { element: { type: 'api' } }, allow: { to: { element: { type: 'core' } } } },
            // domain: stores and guards, talk to the API layer only
            {
              from: { element: { type: 'domain' } },
              allow: {
                to: { element: { types: { anyOf: ['api', 'core', 'shared'] } } },
              },
            },
            // features: UI, uses domain and shared, never another feature area
            {
              from: { element: { type: 'feature' } },
              allow: {
                to: { element: { types: { anyOf: ['domain', 'shared', 'core'] } } },
              },
            },
            { from: { element: { type: 'shared' } }, allow: { to: { element: { type: 'core' } } } },
            // core: app-wide config only, depends on nothing in the app (the auth interceptor lives in domain/auth)
          ],
        },
      ],
    },
  },
]);
