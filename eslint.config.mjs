import globals from 'globals';
import pluginJs from '@eslint/js';
import tsEslint from 'typescript-eslint';
import tsEslintParser from '@typescript-eslint/parser';
import eslintPluginImport from 'eslint-plugin-import';

export default [
  ...tsEslint.configs.recommended.map(config => ({
    ...pluginJs.configs.recommended,
    ...config,
    languageOptions: {
      globals: globals.node,
      parser: tsEslintParser,
      parserOptions: {
        ecmaVersion: 2023, // Allows for the parsing of modern ECMAScript features
        sourceType: 'module', // Allows for the use of imports
      },
    },
    // files: ['src'],
    // ignores: ['dist/', 'tsconfig.json', 'eslint.config.js'],
    plugins: {
      import: eslintPluginImport,
    },
    rules: {
      'prefer-const': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      'object-curly-spacing': ['error', 'always'],
      semi: [2, 'always'],
      indent: ['error', 2, {
        SwitchCase: 1,
        ignoredNodes: ['ClassBody.body > PropertyDefinition[decorators.length>0] > Identifier'],
      }],
      '@typescript-eslint/no-non-null-assertion': 'off',
      quotes: ['error', 'single', { allowTemplateLiterals: true }],
      '@typescript-eslint/ban-types': 'off',
      '@typescript-eslint/no-empty-function': 'off',
      'array-element-newline': ['error', 'consistent'],
      'array-bracket-spacing': ['error', 'never'],
      'comma-dangle': ['error', {
        'arrays': 'always-multiline',
        'objects': 'always-multiline',
        'imports': 'always-multiline',
        'exports': 'always-multiline',
        'functions': 'always-multiline',
      }],
      'newline-per-chained-call': [2, { 'ignoreChainWithDepth': 3 }],
      'max-len': [
        'error',
        {
          'code': 120, 'ignoreComments': true,
          'ignoreTrailingComments': true,
          'ignoreStrings': true, 'ignoreRegExpLiterals': true,
          'ignoreUrls': true,
        },
      ],
      // 'import/newline-after-import': 'error',
      'padded-blocks': ['error', 'never'],
      'comma-spacing': ['error', { 'before': false, 'after': true }],
      'keyword-spacing': 'error',
      'space-in-parens': ['error', 'never'],
      'array-bracket-newline': ['off', 'consistent'],
      'no-multiple-empty-lines': ['error', { max: 1 }],
      // '@typescript-eslint/no-var-requires': 'off'
      'no-trailing-spaces': ['error', { 'ignoreComments': true }],

      // import orders
      'import/order': ['error', {
        groups: [
          'builtin', 'external', 'unknown', 'internal', ['parent', 'sibling', 'index', 'object'],
        ],
        'newlines-between': 'always',
        pathGroupsExcludedImportTypes: ['builtin'],
        pathGroups: [
          '@Decorators/**',
          '@Libs/**',
          '@Enums/**',
          '@Configs/**',
          '@Providers/**',
          '@Jobs/**',
          '@Bots/**',
          '@Middlewares/**',
          '@Errors/**',
          '@Models/**',
          '@Entities/**',
          '@ModelConstant/**',
          '@Repositories/**',
          '@Consumers/**',
          '@Services/**',
          '@Sockets/**',
          '@Rests/**',
          '@Resolvers/**',
        ].map(pattern => ({
          pattern,
          group: 'unknown',
          position: 'after',
        })),
      }],
    },
  })),
  {
  },
];
